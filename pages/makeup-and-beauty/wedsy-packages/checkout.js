import { loadGoogleMaps } from "@/utils/loadGoogleMaps";
import { toPriceString, toProperCase } from "@/utils/text";
import { trimTitle } from "@/utils/seo";
import { pushDataLayer } from "@/utils/tracking";
import { Button, Label, Modal, Select, TextInput } from "flowbite-react";
import Head from "next/head";
import Image from "next/image";
import { useRouter } from "next/router";
import { useEffect, useRef, useState } from "react";
import {
  FaArrowLeft,
  FaArrowRight,
  FaPencilAlt,
  FaTrash,
  FaCalendarAlt
} from "react-icons/fa";
import { DayPicker } from "react-day-picker";
import { format } from "date-fns";
import "react-day-picker/dist/style.css";

function MakeupAndBeauty({ user }) {
  const router = useRouter();
  const divRef = useRef(null);
  const inputRef = useRef(null); // Reference to the input element
  const editInputRef = useRef(null); // Reference for edit address input
  const datePickerRef = useRef(null);
  const datePickerDesktopRef = useRef(null);
  const [loading, setLoading] = useState(false);
  const [isLoaded, setIsLoaded] = useState(false);
  const [bookingInfo, setBookingInfo] = useState({ date: "", time: "" });
  const [showDatePicker, setShowDatePicker] = useState(false);
  const [showDatePickerDesktop, setShowDatePickerDesktop] = useState(false);
  const [selectedAddress, setSelectedAddress] = useState("");
  const [addressDetails, setAddressDetails] = useState({
    house_no: "",
    address_type: "",
  });
  const [googleAddressDetails, setGoogleAddressDetails] = useState({});
  const [editAddressModal, setEditAddressModal] = useState(false);
  const [editingAddressId, setEditingAddressId] = useState(null);
  const [editAddressDetails, setEditAddressDetails] = useState({
    house_no: "",
    address_type: "",
  });
  const [editGoogleAddressDetails, setEditGoogleAddressDetails] = useState({});
  const [divSize, setDivSize] = useState({ width: 0, height: 0 });
  const [wedsyPackages, setWedsyPackages] = useState([]);
  const [wedsyPackageCategory, setWedsyPackageCategory] = useState([]);
  const [selectedPackages, setSelectedPackages] = useState([]);
  const [taxationData, setTaxationData] = useState({});
  const [wedsyPackageTaxMultiply, setWedsyPackageTaxMultiply] = useState(1);
  const [userSavedAddress, setUserSavedAddress] = useState([]);
  const [displayModule, setDisplayModule] = useState("Address");
  // Address, Date & Time, Summary
  const [addNewAddress, setAddNewAddress] = useState(false);
  const [paymentStatus, setPaymentStatus] = useState(null);

  const extractAddressComponents = (components) => {
    const result = {
      city: "",
      postal_code: "",
      state: "",
      country: "",
      locality: "",
    };

    components.forEach((component) => {
      if (component.types.includes("locality")) {
        result.city = component.long_name; // Locality usually represents the city
      }
      if (
        component.types.includes("administrative_area_level_2") &&
        !result.city
      ) {
        result.city = component.long_name; // Fallback if locality isn't available
      }
      if (component.types.includes("postal_code")) {
        result.postal_code = component.long_name; // Extract postal code
      }
      if (component.types.includes("administrative_area_level_1")) {
        result.state = component.long_name; // Extract state
      }
      if (component.types.includes("country")) {
        result.country = component.long_name; // Extract country
      }
      if (
        component.types.includes("sublocality") ||
        component.types.includes("neighborhood")
      ) {
        result.locality = component.long_name; // More granular locality info
      }
    });

    return result;
  };

  useEffect(() => {
    const initializeAutocomplete = async () => {
      try {
        const google = await loadGoogleMaps(); // Load Google Maps API
        setIsLoaded(true);

        if (!google?.maps) {
          throw new Error("Google Maps library is not loaded properly.");
        }

        // Check if inputRef.current exists before initializing Autocomplete
        if (inputRef.current) {
          const autocomplete = new google.maps.places.Autocomplete(
            inputRef.current,
            {
              types: ["geocode"], // Restrict results to addresses only
              componentRestrictions: { country: "in" }, // Restrict to India
              bounds: new google.maps.LatLngBounds(
                new google.maps.LatLng(12.9141, 77.4563), // Southwest corner of Bengaluru
                new google.maps.LatLng(13.1129, 77.7343)  // Northeast corner of Bengaluru
              ),
              strictBounds: true, // Only show results within the bounds
            }
          );

          // Listen for place selection
          autocomplete.addListener("place_changed", () => {
            const place = autocomplete.getPlace();
            if (place.geometry) {
              const { city, postal_code, state, country, locality } =
                extractAddressComponents(place.address_components);
              
              // Validate that the selected location is in Bengaluru
              const isBengaluru = city.toLowerCase().includes('bengaluru') || 
                                 city.toLowerCase().includes('bangalore') ||
                                 locality.toLowerCase().includes('bengaluru') ||
                                 locality.toLowerCase().includes('bangalore');
              
              if (!isBengaluru) {
                alert("Please select a location within Bengaluru only.");
                // Clear the input
                setGoogleAddressDetails({});
                return;
              }
              
              setGoogleAddressDetails((prevDetails) => ({
                ...prevDetails, // Retain existing fields like house_no and address_type
                city,
                postal_code,
                state,
                country,
                locality,
                place_id: place.place_id,
                formatted_address: place.formatted_address,
                geometry: {
                  location: {
                    lat: place.geometry.location.lat(),
                    lng: place.geometry.location.lng(),
                  },
                },
                address_components: place.address_components,
              }));
              // Auto-fill pincode and city in addressDetails
              setAddressDetails((prevDetails) => ({
                ...prevDetails,
                postal_code: postal_code || prevDetails.postal_code,
                city: city || prevDetails.city,
              }));
            }
          });
        } else {
          console.warn("Input reference is not available yet.");
        }
      } catch (error) {
        console.error("Error loading Google Maps:", error);
      }
    };

    if (addNewAddress) {
      initializeAutocomplete();
    }
    // console.log(inputRef.current);
  }, [addNewAddress]); // Add inputRef.current as a dependency

  useEffect(() => {
    const initializeEditAutocomplete = async () => {
      try {
        const google = await loadGoogleMaps(); // Load Google Maps API

        if (!google?.maps) {
          throw new Error("Google Maps library is not loaded properly.");
        }

        // Check if editInputRef.current exists before initializing Autocomplete
        if (editInputRef.current) {
          const autocomplete = new google.maps.places.Autocomplete(
            editInputRef.current,
            {
              types: ["geocode"], // Restrict results to addresses only
              componentRestrictions: { country: "in" }, // Restrict to India
              bounds: new google.maps.LatLngBounds(
                new google.maps.LatLng(12.9141, 77.4563), // Southwest corner of Bengaluru
                new google.maps.LatLng(13.1129, 77.7343)  // Northeast corner of Bengaluru
              ),
              strictBounds: true, // Only show results within the bounds
            }
          );

          // Listen for place selection
          autocomplete.addListener("place_changed", () => {
            const place = autocomplete.getPlace();
            if (place.geometry) {
              const { city, postal_code, state, country, locality } =
                extractAddressComponents(place.address_components);
              
              // Validate that the selected location is in Bengaluru
              const isBengaluru = city.toLowerCase().includes('bengaluru') || 
                                 city.toLowerCase().includes('bangalore') ||
                                 locality.toLowerCase().includes('bengaluru') ||
                                 locality.toLowerCase().includes('bangalore');
              
              if (!isBengaluru) {
                alert("Please select a location within Bengaluru only.");
                // Clear the input
                setEditGoogleAddressDetails({});
                return;
              }
              
              setEditGoogleAddressDetails((prevDetails) => ({
                ...prevDetails, // Retain existing fields like house_no and address_type
                city,
                postal_code,
                state,
                country,
                locality,
                place_id: place.place_id,
                formatted_address: place.formatted_address,
                geometry: {
                  location: {
                    lat: place.geometry.location.lat(),
                    lng: place.geometry.location.lng(),
                  },
                },
                address_components: place.address_components,
              }));
              // Auto-fill pincode and city in editAddressDetails
              setEditAddressDetails((prevDetails) => ({
                ...prevDetails,
                postal_code: postal_code || prevDetails.postal_code,
                city: city || prevDetails.city,
              }));
            }
          });
        } else {
          console.warn("Edit input reference is not available yet.");
        }
      } catch (error) {
        console.error("Error loading Google Maps:", error);
      }
    };

    if (editAddressModal) {
      initializeEditAutocomplete();
    }
  }, [editAddressModal]);

  const fetchTaxationData = () => {
    fetch(`${process.env.NEXT_PUBLIC_API_URL}/config?code=MUA-Taxation`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        authorization: `Bearer ${localStorage.getItem("token")}`,
      },
    })
      .then((response) => response.json())
      .then((response) => {
        setTaxationData(response.data);
        setWedsyPackageTaxMultiply(
          (100 +
            response?.data?.wedsyPackage?.cgst +
            response?.data?.wedsyPackage?.sgst) /
            100
        );
      })
      .catch((error) => {
        console.error("There was a problem with the fetch operation:", error);
      });
  };
  const fetchWedsyPackages = () => {
    fetch(`${process.env.NEXT_PUBLIC_API_URL}/wedsy-package`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        authorization: `Bearer ${localStorage.getItem("token")}`,
      },
    })
      .then((response) => response.json())
      .then((response) => {
        if (!document.body.classList.contains("relative")) {
          document.body.classList.add("relative");
        }
        let tempCart = localStorage.getItem("wedsy-package-cart");
        let cart = [];
        if (tempCart) {
          try {
            cart = JSON.parse(tempCart);
          } catch (error) {
            console.log("Error:", error);
          }
        }
        Promise.all(
          response.map((i) => ({
            package: i,
            _id: i._id,
            quantity: cart.find((j) => j._id === i._id)?.quantity,
            price: i.price,
          }))
        ).then((r) => {
          let temp = r?.filter((p) => p.quantity > 0);
          if (temp.length <= 0) {
            router.push("/makeup-and-beauty/wedsy-packages");
          }
          setSelectedPackages(temp);
          setWedsyPackages(response);
        });
      })
      .catch((error) => {
        console.error("There was a problem with the fetch operation:", error);
      });
  };

  const addUserSavedAddress = () => {
    fetch(`${process.env.NEXT_PUBLIC_API_URL}/user/saved-address`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        authorization: `Bearer ${localStorage.getItem("token")}`,
      },
      body: JSON.stringify({ ...googleAddressDetails, ...addressDetails }),
    })
      .then((response) => response.json())
      .then((response) => {
        if (response.message === "success") {
          setSelectedAddress(response.id);
          fetchUserSavedAddress();
          setAddNewAddress(false);
        }
      })
      .catch((error) => {
        console.error("There was a problem with the fetch operation:", error);
      });
  };
  const updateUserSavedAddress = () => {
    fetch(`${process.env.NEXT_PUBLIC_API_URL}/user/saved-address/${editingAddressId}`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
        authorization: `Bearer ${localStorage.getItem("token")}`,
      },
      body: JSON.stringify({ ...editGoogleAddressDetails, ...editAddressDetails }),
    })
      .then((response) => response.json())
      .then((response) => {
        if (response.message === "success") {
          fetchUserSavedAddress();
          setEditAddressModal(false);
          setEditingAddressId(null);
          setEditAddressDetails({
            house_no: "",
            address_type: "",
            postal_code: "",
            city: "",
            address_line_1: "",
          });
          setEditGoogleAddressDetails({});
        }
      })
      .catch((error) => {
        console.error("There was a problem with the fetch operation:", error);
      });
  };
  const deleteUserSavedAddress = (addressId) => {
    if (window.confirm("Are you sure you want to delete this address?")) {
      fetch(`${process.env.NEXT_PUBLIC_API_URL}/user/saved-address/${addressId}`, {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
          authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      })
        .then((response) => response.json())
        .then((response) => {
          if (response.message === "success") {
            // If the deleted address was selected, clear the selection
            if (selectedAddress === addressId) {
              setSelectedAddress("");
            }
            fetchUserSavedAddress();
          }
        })
        .catch((error) => {
          console.error("There was a problem with the fetch operation:", error);
        });
    }
  };
  const fetchUserSavedAddress = () => {
    fetch(`${process.env.NEXT_PUBLIC_API_URL}/user/saved-address`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        authorization: `Bearer ${localStorage.getItem("token")}`,
      },
    })
      .then((response) => response.json())
      .then((response) => {
        setUserSavedAddress(response);
        if (selectedAddress) {
          if (
            !response.filter((item) => selectedAddress === item?._id)?.length >
            0
          ) {
            setSelectedAddress("");
          }
        }
      })
      .catch((error) => {
        console.error("There was a problem with the fetch operation:", error);
      });
  };

  const initializeRazorpay = () => {
    return new Promise((resolve) => {
      const script = document.createElement("script");
      script.src = "https://checkout.razorpay.com/v1/checkout.js";

      script.onload = () => {
        resolve(true);
      };
      script.onerror = () => {
        resolve(false);
      };

      document.body.appendChild(script);
    });
  };
  const makePayment = async ({ order_id, amount }) => {
    const res = await initializeRazorpay();
    if (!res) {
      alert("Razorpay SDK Failed to load");
      return;
    }
    var options = {
      key: process.env.NEXT_PUBLIC_RAZORPAY_KEY, // Enter the Key ID generated from the Dashboard
      name: "Wedsy",
      currency: "INR",
      amount: amount,
      order_id: order_id,
      description: "Your Event Payment",
      handler: function (response) {
        setPaymentStatus("success");
        const value = (amount / 100);
        pushDataLayer("Purchase", { value, currency: "INR", order_id, content_type: "makeup_package" });
        import("react-facebook-pixel").then((x) => x.default).then((ReactPixel) => ReactPixel.track("Purchase", { value, currency: "INR" }));
        UpdatePayment({ order_id, response });
      },
      prefill: {
        name: user.name,
        email: user.email,
        contact: user.phone,
      },
    };
    const paymentObject = new window.Razorpay(options);
    paymentObject.on("payment.failed", function (response) {
      setPaymentStatus("failure");
      UpdatePayment({ order_id, response: response.error });
    });
    paymentObject.open();
  };
  const CreatePayment = (_id, amount) => {
    fetch(`${process.env.NEXT_PUBLIC_API_URL}/payment/`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        authorization: `Bearer ${localStorage.getItem("token")}`,
      },
      body: JSON.stringify({
        order: _id,
        paymentFor: "makeup-and-beauty",
        paymentMethod: "razporpay",
        amount: amount,
      }),
    })
      .then((response) => (response.ok ? response.json() : null))
      .then((response) => {
        if (response.message === "success") {
          makePayment({ order_id: response.order_id, amount: response.amount });
        }
      })
      .catch((error) => {
        console.error("There was a problem with the fetch operation:", error);
      });
  };
  const UpdatePayment = ({ response, order_id }) => {
    fetch(`${process.env.NEXT_PUBLIC_API_URL}/payment/${order_id}`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
        authorization: `Bearer ${localStorage.getItem("token")}`,
      },
      body: JSON.stringify({ response }),
    })
      .then((response) => (response.ok ? response.json() : null))
      .then((response) => {
        if (response.message === "success") {
          // makePayment({ order_id: response.order_id, amount: response.amount });
          // fetchPayment();
          // alert("Finalized the event!");
          router.push("/makeup-and-beauty");
        }
      })
      .catch((error) => {
        console.error("There was a problem with the fetch operation:", error);
      });
  };
  const handleSubmit = () => {
    setLoading(true);
    const tempaddress = userSavedAddress?.find(
      (i) => i._id === selectedAddress
    );
    const { _id, ...tempuseraddress } = tempaddress;
    fetch(`${process.env.NEXT_PUBLIC_API_URL}/order`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        authorization: `Bearer ${localStorage.getItem("token")}`,
      },
      body: JSON.stringify({
        source: "Wedsy-Package",
        wedsyPackages: selectedPackages?.filter((i) => i.quantity > 0),
        date: bookingInfo?.date,
        time: bookingInfo?.time,
        address: tempuseraddress,
      }),
    })
      .then((response) => response.json())
      .then((response) => {
        setLoading(false);
        if (response.message === "success") {
          CreatePayment(response.id, response.amount);
        } else {
          alert("Please try again later");
        }
      })
      .catch((error) => {
        console.error("There was a problem with the fetch operation:", error);
      });
  };
  useEffect(() => {
    fetchWedsyPackages();
    fetchTaxationData();
    fetchUserSavedAddress();
  }, []);
  // A12 + A13: InitiateCheckout when checkout page is ready with cart
  useEffect(() => {
    if (selectedPackages?.length > 0) {
      const value = selectedPackages.reduce((sum, p) => sum + (p?.quantity ?? 0) * (p?.price ?? 0), 0);
      pushDataLayer("InitiateCheckout", { value, currency: "INR", content_ids: selectedPackages.map((p) => p._id), content_type: "makeup_package" });
      import("react-facebook-pixel").then((x) => x.default).then((ReactPixel) => ReactPixel.track("InitiateCheckout", { value, currency: "INR" }));
    }
  }, [selectedPackages?.length]);
  useEffect(() => {
    const handleResize = () => {
      if (divRef.current) {
        const { width, height } = divRef.current.getBoundingClientRect();
        const { top } = divRef.current.getBoundingClientRect();
        const totalHeight = window.innerHeight;
        setDivSize({ width, height: totalHeight - top });
      }
    };

    // Call handleResize initially to set the initial size
    handleResize();

    // Attach the event listener for window resize
    window.addEventListener("resize", handleResize);

    // Cleanup the event listener on component unmount
    return () => {
      window.removeEventListener("resize", handleResize);
    };
  }, []);

  // Close date picker when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (
        datePickerRef.current && !datePickerRef.current.contains(event.target) &&
        datePickerDesktopRef.current && !datePickerDesktopRef.current.contains(event.target) &&
        !event.target.closest('[data-date-picker-input]')
      ) {
        setShowDatePicker(false);
        setShowDatePickerDesktop(false);
      }
    };

    if (showDatePicker || showDatePickerDesktop) {
      document.addEventListener("mousedown", handleClickOutside);
    }

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [showDatePicker, showDatePickerDesktop]);

  return (
    <>
      <Head>
        <title>{trimTitle("Checkout | Wedsy")}</title>
        <meta name="robots" content="noindex, nofollow" />
        <link rel="canonical" href="https://www.wedsy.in/makeup-and-beauty/wedsy-packages/checkout" />
      </Head>
      <div className="md:hidden flex flex-col bg-[#F4F4F4]">
        <div className="grid grid-cols-3 divide-x bg-white">
          <div
            className={`${
              displayModule === "Address"
                ? "text-black border-b-[#840032]"
                : "text-gray-500 border-b-white border-b-[#F4F4F4] "
            } text-center font-semibold text-base border-b-4 p-2 flex items-center justify-center gap-2`}
          >
            <button
              className={`${
                displayModule === "Date & Time" || displayModule === "Summary"
                  ? "text-[#840032] hover:text-[#840032]/70"
                  : "text-gray-300 cursor-not-allowed"
              } transition-colors`}
              onClick={() => {
                if (displayModule === "Date & Time" || displayModule === "Summary") {
                  setDisplayModule("Address");
                }
              }}
              disabled={displayModule === "Address"}
            >
              <FaArrowLeft />
            </button>
            ADDRESS
          </div>
          <div
            className={`${
              displayModule === "Date & Time"
                ? "text-black border-b-[#840032]"
                : "text-gray-500 border-b-white border-b-[#F4F4F4] "
            } text-center font-semibold text-base border-b-4 p-2`}
          >
            DATE & TIME
          </div>
          <div
            className={`${
              displayModule === "Summary"
                ? "text-black border-b-[#840032]"
                : "text-gray-500 border-b-white border-b-[#F4F4F4] "
            } text-center font-semibold text-base border-b-4 p-2 flex items-center justify-center gap-2`}
          >
            SUMMARY
            <button
              className={`${
                displayModule === "Address" && selectedAddress
                  ? "text-[#840032] hover:text-[#840032]/70"
                  : displayModule === "Date & Time" && bookingInfo.date && bookingInfo.time
                  ? "text-[#840032] hover:text-[#840032]/70"
                  : "text-gray-300 cursor-not-allowed"
              } transition-colors`}
              onClick={() => {
                if (displayModule === "Address" && selectedAddress) {
                  setDisplayModule("Date & Time");
                } else if (displayModule === "Date & Time" && bookingInfo.date && bookingInfo.time) {
                  setDisplayModule("Summary");
                }
              }}
              disabled={
                (displayModule === "Address" && !selectedAddress) ||
                (displayModule === "Date & Time" && (!bookingInfo.date || !bookingInfo.time)) ||
                displayModule === "Summary"
              }
            >
              <FaArrowRight />
            </button>
          </div>
        </div>
        {displayModule === "Address" && (
          <>
            <div className="bg-white p-4 rounded-lg flex flex-col gap-4 mb-2">
              <p className="text-xl font-semibold uppercase">Saved Address</p>
              {userSavedAddress?.map((item) => (
                <div
                  className={`flex items-center gap-4 p-4 rounded-lg border ${
                    selectedAddress === item?._id 
                      ? "bg-gray-100 border-[#840032]" 
                      : "bg-white border-gray-300"
                  }`}
                  key={item._id}
                  onClick={() => {
                    setSelectedAddress(item?._id);
                  }}
                >
                  <Image 
                    src="/assets/new_icons/Location.svg" 
                    alt="Location" 
                    width={20} 
                    height={20} 
                    className="text-[#840032]"
                  />
                  <div className="flex-1">
                    <p className="font-normal text-md uppercase">
                      {item?.address_type}
                    </p>
                    <p className="text-gray-600 text-sm">
                      {item?.house_no}, {item?.formatted_address}
                    </p>
                  </div>
                  <div className="flex items-center gap-2">
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        setEditingAddressId(item._id);
                        setEditAddressDetails({
                          house_no: item.house_no || "",
                          address_type: item.address_type || "",
                          postal_code: item.postal_code || "",
                          city: item.city || "",
                          address_line_1: item.address_line_1 || "",
                        });
                        setEditGoogleAddressDetails({
                          formatted_address: item.formatted_address || "",
                          city: item.city || "",
                          postal_code: item.postal_code || "",
                          state: item.state || "",
                          country: item.country || "",
                          locality: item.locality || "",
                        });
                        setEditAddressModal(true);
                      }}
                      className="text-[#840032] hover:text-[#6b0028] transition-colors p-2"
                    >
                      <FaPencilAlt size={16} />
                    </button>
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        deleteUserSavedAddress(item._id);
                      }}
                      className="text-[#840028] hover:text-[#6b0028] transition-colors p-2"
                    >
                      <FaTrash size={16} />
                    </button>
                  </div>
                </div>
              ))}
              <p
                className="text-base font-medium text-[#840032] border-b border-b-black hover:cursor-pointer"
                onClick={() => {
                  setAddNewAddress(true);
                }}
              >
                + Add another address
              </p>
            </div>
            {addNewAddress && (
              <div className="bg-white p-6 rounded-lg flex flex-col gap-4">
                <div>
                  <Label value="House no/Flat no" />
                  <TextInput
                    type="text"
                    placeholder="House no/Flat no"
                    value={addressDetails.house_no}
                    onChange={(e) => {
                      setAddressDetails({
                        ...addressDetails,
                        house_no: e.target.value,
                      });
                    }}
                    className="!border-gray-400 focus:!border-gray-600 focus:!ring-0 focus:!outline-none"
                  />
                </div>
                <div>
                  <Label value="Address line 1" />
                  <TextInput
                    ref={inputRef}
                    type="text"
                    placeholder="Enter your address"
                    value={googleAddressDetails.formatted_address || addressDetails.address_line_1}
                    onChange={(e) => {
                      // Allow manual entry even if Google Maps doesn't find it
                      setAddressDetails({
                        ...addressDetails,
                        address_line_1: e.target.value,
                      });
                      // Clear Google Maps data when manually typing
                      if (!e.target.value) {
                        setGoogleAddressDetails({});
                      }
                    }}
                    className="!border-gray-400 focus:!border-gray-600 focus:!ring-0 focus:!outline-none"
                  />
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label value="Pincode" />
                    <TextInput
                      type="text"
                      placeholder="Pincode"
                      value={googleAddressDetails.postal_code || addressDetails.postal_code}
                      onChange={(e) => {
                        setAddressDetails({
                          ...addressDetails,
                          postal_code: e.target.value,
                        });
                      }}
                      className="!border-gray-400 focus:!border-gray-600 focus:!ring-0 focus:!outline-none"
                    />
                  </div>
                  <div>
                    <Label value="City" />
                    <TextInput
                      type="text"
                      placeholder="City"
                      value={googleAddressDetails.city || addressDetails.city}
                      onChange={(e) => {
                        setAddressDetails({
                          ...addressDetails,
                          city: e.target.value,
                        });
                      }}
                      className="!border-gray-400 focus:!border-gray-600 focus:!ring-0 focus:!outline-none"
                    />
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label value="Address Type" />
                    <Select
                      value={addressDetails.address_type}
                      onChange={(e) => {
                        setAddressDetails({
                          ...addressDetails,
                          address_type: e.target.value,
                        });
                      }}
                    >
                      <option value={""}>Select Type</option>
                      {["home", "work", "billing", "other"]?.map((item) => (
                        <option key={item} value={item}>
                          {toProperCase(item)}
                        </option>
                      ))}
                    </Select>
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <Button
                    color="gray"
                    onClick={() => {
                      setAddNewAddress(false);
                      // Reset form data
                      setAddressDetails({
                        house_no: "",
                        address_type: "",
                        postal_code: "",
                        city: "",
                        address_line_1: "",
                      });
                      setGoogleAddressDetails({});
                    }}
                  >
                    Cancel
                  </Button>
                  <Button
                    disabled={
                      !addressDetails.address_type ||
                      !addressDetails.house_no ||
                      !addressDetails.postal_code ||
                      !addressDetails.city ||
                      (!googleAddressDetails.formatted_address && !addressDetails.address_line_1)
                    }
                    onClick={() => {
                      addUserSavedAddress();
                    }}
                    className="!bg-[#840032] hover:!bg-[#6b0028] !text-white !focus:ring-0 !focus:outline-none !hover:ring-0 !border-0 focus:!border-0 hover:!border-0 !border-transparent focus:!border-transparent hover:!border-transparent"
                    style={{ border: 'none', outline: 'none' }}
                  >
                    Save
                  </Button>
                </div>
              </div>
            )}
            
            {/* ADDRESS SECTION - Only Next button */}
            {selectedAddress && !addNewAddress && (
              <div className="flex justify-end p-4">
              <button
                  className="py-2 px-6 bg-[#840032] text-white rounded-lg hover:bg-[#840032]/90 transition-colors flex items-center gap-2"
                onClick={() => {
                  setDisplayModule("Date & Time");
                }}
              >
                Next
                  <FaArrowRight />
              </button>
              </div>
            )}
          </>
        )}

        {displayModule === "Date & Time" && (
          <>
            <div className="bg-white p-6 rounded-lg flex flex-col gap-6">
              <div className="relative">
                <Label value="Date" />
                <div className="relative">
                  <TextInput
                    type="text"
                    readOnly
                    value={bookingInfo.date ? format(new Date(bookingInfo.date), "dd/MM/yyyy") : ""}
                    placeholder="Select a date"
                    onClick={() => setShowDatePicker(!showDatePicker)}
                    className="text-lg font-medium !border-gray-400 focus:!border-gray-600 focus:!ring-0 focus:!outline-none cursor-pointer"
                  />
                  <div className="absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none">
                    <FaCalendarAlt className="text-gray-400" size={18} />
                  </div>
                </div>
                {showDatePicker && (
                  <div className="absolute z-50 mt-2 bg-white rounded-lg shadow-lg border border-gray-200 p-4">
                    <style jsx global>{`
                      .rdp {
                        --rdp-cell-size: 40px;
                        --rdp-accent-color: #840032;
                        --rdp-background-color: #f0f0f0;
                        --rdp-accent-color-dark: #6b0028;
                        --rdp-background-color-dark: #180270;
                        --rdp-outline: 2px solid var(--rdp-accent-color);
                        --rdp-outline-selected: 3px solid var(--rdp-accent-color);
                        margin: 0;
                      }
                      .rdp-day_selected,
                      .rdp-day_selected:focus-visible,
                      .rdp-day_selected:hover {
                        background-color: #840032;
                        color: white;
                      }
                      .rdp-day:hover:not([disabled]):not(.rdp-day_selected) {
                        background-color: #84003220;
                      }
                      .rdp-button:hover:not([disabled]):not(.rdp-day_selected) {
                        background-color: #84003210;
                      }
                      .rdp-day_today {
                        font-weight: bold;
                        color: #840032;
                      }
                    `}</style>
                    <DayPicker
                      mode="single"
                      selected={bookingInfo.date ? new Date(bookingInfo.date) : undefined}
                      onSelect={(date) => {
                        if (date) {
                          setBookingInfo({ ...bookingInfo, date: format(date, "yyyy-MM-dd") });
                          setShowDatePicker(false);
                        }
                      }}
                      disabled={(date) => date < new Date(new Date().setHours(0, 0, 0, 0))}
                      className="rounded-lg"
                    />
                  </div>
                )}
              </div>
              <div>
                <Label value="Time" />
                <span className="text-gray-500 text-sm block mb-4">
                  *(The artist will arrive at the chosen time)
                </span>
                
                {/* Modern Time Picker */}
                <div className="bg-white border border-gray-300 rounded-lg p-4">
                  <div className="flex items-center justify-center gap-4">
                    {/* Hour Input */}
                    <div className="flex flex-col items-center">
                      <label className="text-xs text-gray-500 mb-2 font-medium">HOUR</label>
                      <div className="relative">
                        <input
                          type="number"
                          min="0"
                          max="23"
                          value={bookingInfo.time ? parseInt(bookingInfo.time.split(':')[0]) : ''}
                          onChange={(e) => {
                            const hour = e.target.value.padStart(2, '0');
                            const minute = bookingInfo.time ? bookingInfo.time.split(':')[1] : '00';
                            if (parseInt(hour) >= 0 && parseInt(hour) <= 23) {
                              setBookingInfo({ ...bookingInfo, time: `${hour}:${minute}` });
                            }
                          }}
                          onBlur={(e) => {
                            let hour = e.target.value;
                            if (hour === '') hour = '00';
                            if (parseInt(hour) < 0) hour = '00';
                            if (parseInt(hour) > 23) hour = '23';
                            hour = hour.padStart(2, '0');
                            const minute = bookingInfo.time ? bookingInfo.time.split(':')[1] : '00';
                            setBookingInfo({ ...bookingInfo, time: `${hour}:${minute}` });
                          }}
                          className="w-20 text-center text-2xl font-semibold border-2 border-gray-300 rounded-lg py-3 px-2 focus:outline-none focus:border-[#840032] transition-colors"
                          placeholder="00"
                        />
                        <div className="flex flex-col gap-1 absolute -right-8 top-1/2 -translate-y-1/2">
                          <button
                            type="button"
                            onClick={() => {
                              const currentHour = bookingInfo.time ? parseInt(bookingInfo.time.split(':')[0]) : 0;
                              const newHour = currentHour < 23 ? currentHour + 1 : 0;
                              const minute = bookingInfo.time ? bookingInfo.time.split(':')[1] : '00';
                              setBookingInfo({ ...bookingInfo, time: `${String(newHour).padStart(2, '0')}:${minute}` });
                            }}
                            className="w-6 h-6 flex items-center justify-center bg-gray-100 hover:bg-[#840032] hover:text-white rounded text-gray-600 transition-colors"
                          >
                            ↑
                          </button>
                          <button
                            type="button"
                            onClick={() => {
                              const currentHour = bookingInfo.time ? parseInt(bookingInfo.time.split(':')[0]) : 0;
                              const newHour = currentHour > 0 ? currentHour - 1 : 23;
                              const minute = bookingInfo.time ? bookingInfo.time.split(':')[1] : '00';
                              setBookingInfo({ ...bookingInfo, time: `${String(newHour).padStart(2, '0')}:${minute}` });
                            }}
                            className="w-6 h-6 flex items-center justify-center bg-gray-100 hover:bg-[#840032] hover:text-white rounded text-gray-600 transition-colors"
                          >
                            ↓
                          </button>
                        </div>
                      </div>
                    </div>
                    
                    <span className="text-3xl font-bold text-[#840032] mt-6">:</span>
                    
                    {/* Minute Input */}
                    <div className="flex flex-col items-center">
                      <label className="text-xs text-gray-500 mb-2 font-medium">MINUTE</label>
                      <div className="relative">
                        <input
                          type="number"
                          min="0"
                          max="59"
                          value={bookingInfo.time ? parseInt(bookingInfo.time.split(':')[1]) : ''}
                          onChange={(e) => {
                            const minute = e.target.value.padStart(2, '0');
                            const hour = bookingInfo.time ? bookingInfo.time.split(':')[0] : '00';
                            if (parseInt(minute) >= 0 && parseInt(minute) <= 59) {
                              setBookingInfo({ ...bookingInfo, time: `${hour}:${minute}` });
                            }
                          }}
                          onBlur={(e) => {
                            let minute = e.target.value;
                            if (minute === '') minute = '00';
                            if (parseInt(minute) < 0) minute = '00';
                            if (parseInt(minute) > 59) minute = '59';
                            minute = minute.padStart(2, '0');
                            const hour = bookingInfo.time ? bookingInfo.time.split(':')[0] : '00';
                            setBookingInfo({ ...bookingInfo, time: `${hour}:${minute}` });
                          }}
                          className="w-20 text-center text-2xl font-semibold border-2 border-gray-300 rounded-lg py-3 px-2 focus:outline-none focus:border-[#840032] transition-colors"
                          placeholder="00"
                        />
                        <div className="flex flex-col gap-1 absolute -right-8 top-1/2 -translate-y-1/2">
                          <button
                            type="button"
                            onClick={() => {
                              const currentMinute = bookingInfo.time ? parseInt(bookingInfo.time.split(':')[1]) : 0;
                              const newMinute = currentMinute < 59 ? currentMinute + 1 : 0;
                              const hour = bookingInfo.time ? bookingInfo.time.split(':')[0] : '00';
                              setBookingInfo({ ...bookingInfo, time: `${hour}:${String(newMinute).padStart(2, '0')}` });
                            }}
                            className="w-6 h-6 flex items-center justify-center bg-gray-100 hover:bg-[#840032] hover:text-white rounded text-gray-600 transition-colors"
                          >
                            ↑
                          </button>
                          <button
                            type="button"
                            onClick={() => {
                              const currentMinute = bookingInfo.time ? parseInt(bookingInfo.time.split(':')[1]) : 0;
                              const newMinute = currentMinute > 0 ? currentMinute - 1 : 59;
                              const hour = bookingInfo.time ? bookingInfo.time.split(':')[0] : '00';
                              setBookingInfo({ ...bookingInfo, time: `${hour}:${String(newMinute).padStart(2, '0')}` });
                            }}
                            className="w-6 h-6 flex items-center justify-center bg-gray-100 hover:bg-[#840032] hover:text-white rounded text-gray-600 transition-colors"
                          >
                            ↓
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>
                  
                  {/* Display selected time in readable format */}
                  {bookingInfo.time && (
                    <div className="mt-4 pt-4 border-t border-gray-200 text-center">
                      <p className="text-xs text-gray-500 mb-1">Selected Time</p>
                      <p className="text-2xl font-bold text-[#840032]">
                        {(() => {
                          const [hour, minute] = bookingInfo.time.split(':');
                          const hourNum = parseInt(hour);
                          const ampm = hourNum >= 12 ? 'PM' : 'AM';
                          const displayHour = hourNum === 0 ? 12 : hourNum > 12 ? hourNum - 12 : hourNum;
                          return `${displayHour}:${minute} ${ampm}`;
                        })()}
                      </p>
                    </div>
                  )}
                </div>
              </div>
            </div>
            
            {/* DATE & TIME SECTION - Back and Next buttons */}
            <div className="flex justify-between gap-4 p-4">
              <button
                className="py-2 px-6 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors flex items-center gap-2"
                onClick={() => {
                  setDisplayModule("Address");
                }}
              >
                <FaArrowLeft />
                Back
              </button>
            {bookingInfo.date && bookingInfo.time && (
              <button
                  className="py-2 px-6 bg-[#840032] text-white rounded-lg hover:bg-[#840032]/90 transition-colors flex items-center gap-2"
                onClick={() => {
                  setDisplayModule("Summary");
                }}
              >
                Next
                  <FaArrowRight />
              </button>
            )}
            </div>
          </>
        )}

        {displayModule === "Summary" && (
          <>
            <div className="bg-white p-6 rounded-lg grid grid-cols-2 gap-4">
              <div className="col-span-2">
                <Label value="Address" />
                {userSavedAddress
                  ?.filter((item) => item._id === selectedAddress)
                  ?.map((item) => (
                    <div
                      className={`flex items-center gap-4 bg-white p-4 rounded-lg border`}
                      key={item._id}
                      onClick={() => {
                        setSelectedAddress(item?._id);
                      }}
                    >
                      <Image 
                        src="/assets/new_icons/Location.svg" 
                        alt="Location" 
                        width={20} 
                        height={20} 
                        className="text-[#840032]"
                      />
                      <p className="font-normal text-base uppercase">
                        {item?.address_type}
                      </p>
                      <p className="text-gray-600 text-sm">
                        {item?.house_no}, {item?.formatted_address}
                      </p>
                    </div>
                  ))}
              </div>
              <div>
                <Label value="Date" />
                <TextInput
                  type="date"
                  readOnly={true}
                  value={bookingInfo.date}
                  className="!border-gray-400 focus:!border-gray-600 focus:!ring-0 focus:!outline-none"
                />
              </div>
              <div>
                <Label value="Time" />
                <TextInput
                  type="time"
                  readOnly={true}
                  value={bookingInfo.time}
                  className="!border-gray-400 focus:!border-gray-600 focus:!ring-0 focus:!outline-none"
                />
              </div>
            </div>
            <div className="bg-white rounded-lg p-6 flex flex-col gap-4 mt-2">
              {selectedPackages
                ?.filter((i) => i.quantity > 0)
                ?.map((item, index) => (
                  <div
                    className="grid grid-cols-4 gap-4 items-center"
                    key={index}
                  >
                    <div className="text-base font-medium col-span-2">
                      {item?.package?.name}
                    </div>
                    <div className="text-[#880E4F] flex flex-row justify-center">
                      <div className="flex items-center gap-1 rounded-lg bg-white border-[#880E4F] border divide-x-1 divide-[#880E4F]">
                        {selectedPackages?.find((i) => i._id === item._id)
                          ?.quantity > 0 && (
                          <button
                            className="px-2 py-1 font-semibold"
                            onClick={() => {
                              setSelectedPackages(
                                selectedPackages.map((i) =>
                                  i._id === item._id
                                    ? { ...i, quantity: i.quantity - 1 }
                                    : i
                                )
                              );
                            }}
                          >
                            -
                          </button>
                        )}
                        <span className="px-2 py-1">
                          {selectedPackages?.find((i) => i._id === item._id)
                            ?.quantity >
                          0 >
                          0
                            ? selectedPackages?.find((i) => i._id === item._id)
                                ?.quantity
                            : "Add"}
                        </span>
                        <button
                          className="px-2 py-1 font-semibold"
                          onClick={() => {
                            setSelectedPackages(
                              selectedPackages.map((i) =>
                                i._id === item._id
                                  ? { ...i, quantity: i.quantity + 1 }
                                  : i
                              )
                            );
                          }}
                        >
                          +
                        </button>
                      </div>
                    </div>
                    <div className="text-base font-medium">
                      {toPriceString(item.quantity * item.price)}
                    </div>
                  </div>
                ))}
            </div>
            <div className="bg-white rounded-lg p-6 flex flex-col gap-4 mt-2">
              <p className="text-lg font-semibold">Payment Summary</p>
              <div className="grid grid-cols-2 gap-4">
                <p className="text-base">Item Total</p>
                <p className="text-base text-right">
                  {toPriceString(
                    selectedPackages?.reduce((accumulator, item) => {
                      return accumulator + item.quantity * item.price;
                    }, 0)
                  )}
                </p>
                <p className="text-base">Taxes & fees</p>
                <p className="text-base text-right">
                  {toPriceString(
                    ((taxationData?.wedsyPackage?.cgst +
                      taxationData?.wedsyPackage?.sgst) /
                      100) *
                      selectedPackages?.reduce((accumulator, item) => {
                        return accumulator + item.quantity * item.price;
                      }, 0)
                  )}
                </p>
                <div className="col-span-2 h-[2px] bg-black w-full" />
                <p className="text-lg font-semibold">Total</p>
                <p className="text-lg font-semibold text-right">
                  {toPriceString(
                    ((100 +
                      taxationData?.wedsyPackage?.cgst +
                      taxationData?.wedsyPackage?.sgst) /
                      100) *
                      selectedPackages?.reduce((accumulator, item) => {
                        return accumulator + item.quantity * item.price;
                      }, 0)
                  )}
                </p>
              </div>
            </div>
            
            {/* SUMMARY SECTION - Back and Pay Now buttons */}
            <div className="flex justify-between gap-4 p-4">
            <button
                className="py-2 px-6 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors flex items-center gap-2"
                onClick={() => {
                  setDisplayModule("Date & Time");
                }}
              >
                <FaArrowLeft />
                Back
              </button>
              <button
                className="py-2 px-6 bg-[#840032] text-white rounded-lg hover:bg-[#840032]/90 transition-colors flex items-center gap-2"
              onClick={() => {
                handleSubmit();
              }}
                disabled={loading}
            >
                {loading ? "Processing..." : "Pay Now"}
                <FaArrowRight />
            </button>
            </div>
          </>
        )}
      </div>
      <div
        className="hidden md:grid grid-cols-2 gap-1 relative overflow-hidden hide-scrollbar bg-[#DCDCDC]"
        ref={divRef}
        style={{ height: divSize.height ?? "100vh" }}
      >
        <div className="bg-[#f4f4f4] hide-scrollbar overflow-y-auto p-12 flex flex-col gap-4">
          <p className="text-2xl font-semibold">Checkout</p>
          <div className="grid grid-cols-3">
            <div
              className={`${
                displayModule === "Address"
                  ? "text-black border-b-[#840032]"
                  : "text-gray-500 border-b-white"
              } text-center font-semibold text-xl border-b-4 pb-2 flex items-center justify-center gap-3`}
            >
              <button
                className={`${
                  displayModule === "Date & Time" || displayModule === "Summary"
                    ? "text-[#840032] hover:text-[#840032]/70"
                    : "text-gray-300 cursor-not-allowed"
                } transition-colors text-xl`}
                onClick={() => {
                  if (displayModule === "Date & Time" || displayModule === "Summary") {
                    setDisplayModule("Address");
                  }
                }}
                disabled={displayModule === "Address"}
              >
                <FaArrowLeft />
              </button>
              ADDRESS
            </div>
            <div
              className={`${
                displayModule === "Date & Time"
                  ? "text-black border-b-[#840032]"
                  : "text-gray-500 border-b-white"
              } text-center font-semibold text-xl border-b-4 pb-2`}
            >
              DATE & TIME
            </div>
            <div
              className={`${
                displayModule === "Summary"
                  ? "text-black border-b-[#840032]"
                  : "text-gray-500 border-b-white"
              } text-center font-semibold text-xl border-b-4 pb-2 flex items-center justify-center gap-3`}
            >
              SUMMARY
              <button
                className={`${
                  displayModule === "Address" && selectedAddress
                    ? "text-[#840032] hover:text-[#840032]/70"
                    : displayModule === "Date & Time" && bookingInfo.date && bookingInfo.time
                    ? "text-[#840032] hover:text-[#840032]/70"
                    : "text-gray-300 cursor-not-allowed"
                } transition-colors text-xl`}
                onClick={() => {
                  if (displayModule === "Address" && selectedAddress) {
                    setDisplayModule("Date & Time");
                  } else if (displayModule === "Date & Time" && bookingInfo.date && bookingInfo.time) {
                    setDisplayModule("Summary");
                  }
                }}
                disabled={
                  (displayModule === "Address" && !selectedAddress) ||
                  (displayModule === "Date & Time" && (!bookingInfo.date || !bookingInfo.time)) ||
                  displayModule === "Summary"
                }
              >
                <FaArrowRight />
              </button>
            </div>
          </div>
          {displayModule === "Address" && (
            <>
              <div className="bg-white p-6 rounded-lg flex flex-col gap-4">
                <p className="text-xl font-semibold uppercase">Saved Address</p>
                {userSavedAddress?.map((item) => (
                  <div
                    className={`flex items-center gap-4 p-4 rounded-xl border ${
                      selectedAddress === item?._id 
                        ? "bg-gray-100 border-[#840032]" 
                        : "bg-white border-gray-300"
                    }`}
                    key={item._id}
                    onClick={() => {
                      setSelectedAddress(item?._id);
                    }}
                  >
                    <Image 
                      src="/assets/new_icons/Location.svg" 
                      alt="Location" 
                      width={20} 
                      height={20} 
                      className="text-[#840032]"
                    />
                    <div className="flex-1">
                      <p className="font-normal text-md uppercase">
                        {item?.address_type}
                      </p>
                      <p className="text-gray-600">
                        {item?.house_no}, {item?.formatted_address}
                      </p>
                    </div>
                    <div className="flex items-center gap-2">
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          setEditingAddressId(item._id);
                          setEditAddressDetails({
                            house_no: item.house_no || "",
                            address_type: item.address_type || "",
                            postal_code: item.postal_code || "",
                            city: item.city || "",
                            address_line_1: item.address_line_1 || "",
                          });
                          setEditGoogleAddressDetails({
                            formatted_address: item.formatted_address || "",
                            city: item.city || "",
                            postal_code: item.postal_code || "",
                            state: item.state || "",
                            country: item.country || "",
                            locality: item.locality || "",
                          });
                          setEditAddressModal(true);
                        }}
                        className="text-[#840032] hover:text-[#6b0028] transition-colors p-2"
                      >
                        <FaPencilAlt size={16} />
                      </button>
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          deleteUserSavedAddress(item._id);
                        }}
                        className="text-red-600 hover:text-red-700 transition-colors p-2"
                      >
                        <FaTrash size={16} />
                      </button>
                    </div>
                  </div>
                ))}
                <p
                  className="text-lg font-medium text-[#840032] border-b border-b-black"
                  onClick={() => {
                    setAddNewAddress(true);
                  }}
                >
                  + Add another address
                </p>
                {selectedAddress && (
                  <button
                    className="w-full py-2 bg-[#840032] text-white rounded-lg"
                    onClick={() => {
                      setDisplayModule("Date & Time");
                    }}
                  >
                    Next
                  </button>
                )}
              </div>
              {addNewAddress && (
                <div className="bg-white p-6 rounded-lg flex flex-col gap-4">
                  <div>
                    <Label value="House no/Flat no" />
                    <TextInput
                      type="text"
                      placeholder="House no/Flat no"
                      value={addressDetails.house_no}
                      onChange={(e) => {
                        setAddressDetails({
                          ...addressDetails,
                          house_no: e.target.value,
                        });
                      }}
                      className="!border-gray-400 focus:!border-gray-600 focus:!ring-0 focus:!outline-none"
                    />
                  </div>
                  <div>
                    <Label value="Address line 1" />
                    <TextInput
                      ref={inputRef}
                      type="text"
                      placeholder="Enter your address"
                      value={googleAddressDetails.formatted_address || addressDetails.address_line_1}
                      onChange={(e) => {
                        // Allow manual entry even if Google Maps doesn't find it
                        setAddressDetails({
                          ...addressDetails,
                          address_line_1: e.target.value,
                        });
                        // Clear Google Maps data when manually typing
                        if (!e.target.value) {
                          setGoogleAddressDetails({});
                        }
                      }}
                      className="!border-gray-400 focus:!border-gray-600 focus:!ring-0 focus:!outline-none"
                    />
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <Label value="Pincode" />
                      <TextInput
                        type="text"
                        placeholder="Pincode"
                        value={googleAddressDetails.postal_code || addressDetails.postal_code}
                        onChange={(e) => {
                          setAddressDetails({
                            ...addressDetails,
                            postal_code: e.target.value,
                          });
                        }}
                        className="!border-gray-400 focus:!border-gray-600 focus:!ring-0 focus:!outline-none"
                      />
                    </div>
                    <div>
                      <Label value="City" />
                      <TextInput
                        type="text"
                        placeholder="City"
                        value={googleAddressDetails.city || addressDetails.city}
                        onChange={(e) => {
                          setAddressDetails({
                            ...addressDetails,
                            city: e.target.value,
                          });
                        }}
                        className="!border-gray-400 focus:!border-gray-600 focus:!ring-0 focus:!outline-none"
                      />
                    </div>
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <Label value="Address Type" />
                      <Select
                        value={addressDetails.address_type}
                        onChange={(e) => {
                          setAddressDetails({
                            ...addressDetails,
                            address_type: e.target.value,
                          });
                        }}
                      >
                        <option value={""}>Select Type</option>
                        {["home", "work", "billing", "other"]?.map((item) => (
                          <option key={item} value={item}>
                            {toProperCase(item)}
                          </option>
                        ))}
                      </Select>
                    </div>
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <Button
                      color="gray"
                      onClick={() => {
                        setAddNewAddress(false);
                        // Reset form data
                        setAddressDetails({
                          house_no: "",
                          address_type: "",
                          postal_code: "",
                          city: "",
                          address_line_1: "",
                        });
                        setGoogleAddressDetails({});
                      }}
                    >
                      Cancel
                    </Button>
                    <Button
                      disabled={
                        !addressDetails.address_type ||
                        !addressDetails.house_no ||
                        !addressDetails.postal_code ||
                        !addressDetails.city ||
                        (!googleAddressDetails.formatted_address && !addressDetails.address_line_1)
                      }
                      onClick={() => {
                        addUserSavedAddress();
                      }}
                      className="!bg-[#840032] hover:!bg-[#6b0028] !text-white !focus:ring-0 !focus:outline-none !hover:ring-0 !border-0 focus:!border-0 hover:!border-0 !border-transparent focus:!border-transparent hover:!border-transparent"
                      style={{ border: 'none', outline: 'none' }}
                    >
                      Save
                    </Button>
                  </div>
                </div>
              )}
            </>
          )}
          {displayModule === "Date & Time" && (
            <>
              <div className="bg-white p-6 rounded-lg flex flex-col gap-6">
                <div className="relative">
                  <Label value="Date" />
                  <div className="relative">
                    <TextInput
                      type="text"
                      readOnly
                      value={bookingInfo.date ? format(new Date(bookingInfo.date), "dd/MM/yyyy") : ""}
                      placeholder="Select a date"
                      onClick={() => setShowDatePickerDesktop(!showDatePickerDesktop)}
                      className="text-lg font-medium !border-gray-400 focus:!border-gray-600 focus:!ring-0 focus:!outline-none cursor-pointer"
                      data-date-picker-input
                    />
                    <div className="absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none">
                      <FaCalendarAlt className="text-gray-400" size={18} />
                    </div>
                  </div>
                  {showDatePickerDesktop && (
                    <div ref={datePickerDesktopRef} className="absolute z-50 mt-2 bg-white rounded-lg shadow-lg border border-gray-200 p-4">
                      <style jsx global>{`
                        .rdp {
                          --rdp-cell-size: 40px;
                          --rdp-accent-color: #840032;
                          --rdp-background-color: #f0f0f0;
                          --rdp-accent-color-dark: #6b0028;
                          --rdp-background-color-dark: #180270;
                          --rdp-outline: 2px solid var(--rdp-accent-color);
                          --rdp-outline-selected: 3px solid var(--rdp-accent-color);
                          margin: 0;
                        }
                        .rdp-day_selected,
                        .rdp-day_selected:focus-visible,
                        .rdp-day_selected:hover {
                          background-color: #840032;
                          color: white;
                        }
                        .rdp-day:hover:not([disabled]):not(.rdp-day_selected) {
                          background-color: #84003220;
                        }
                        .rdp-button:hover:not([disabled]):not(.rdp-day_selected) {
                          background-color: #84003210;
                        }
                        .rdp-day_today {
                          font-weight: bold;
                          color: #840032;
                        }
                      `}</style>
                      <DayPicker
                        mode="single"
                        selected={bookingInfo.date ? new Date(bookingInfo.date) : undefined}
                        onSelect={(date) => {
                          if (date) {
                            setBookingInfo({ ...bookingInfo, date: format(date, "yyyy-MM-dd") });
                            setShowDatePickerDesktop(false);
                          }
                        }}
                        disabled={(date) => date < new Date(new Date().setHours(0, 0, 0, 0))}
                        className="rounded-lg"
                      />
                    </div>
                  )}
                </div>
                <div>
                  <Label value="Time" />
                  <span className="text-gray-500 text-sm block mb-4">
                    *(The artist will arrive at the chosen time)
                  </span>
                  
                  {/* Modern Time Picker */}
                  <div className="bg-white border border-gray-300 rounded-lg p-6">
                    <div className="flex items-center justify-center gap-6">
                      {/* Hour Input */}
                      <div className="flex flex-col items-center">
                        <label className="text-xs text-gray-500 mb-2 font-medium uppercase tracking-wide">Hour</label>
                        <div className="relative">
                          <input
                            type="number"
                            min="0"
                            max="23"
                            value={bookingInfo.time ? parseInt(bookingInfo.time.split(':')[0]) : ''}
                            onChange={(e) => {
                              const hour = e.target.value.padStart(2, '0');
                              const minute = bookingInfo.time ? bookingInfo.time.split(':')[1] : '00';
                              if (parseInt(hour) >= 0 && parseInt(hour) <= 23) {
                                setBookingInfo({ ...bookingInfo, time: `${hour}:${minute}` });
                              }
                            }}
                            onBlur={(e) => {
                              let hour = e.target.value;
                              if (hour === '') hour = '00';
                              if (parseInt(hour) < 0) hour = '00';
                              if (parseInt(hour) > 23) hour = '23';
                              hour = hour.padStart(2, '0');
                              const minute = bookingInfo.time ? bookingInfo.time.split(':')[1] : '00';
                              setBookingInfo({ ...bookingInfo, time: `${hour}:${minute}` });
                            }}
                            className="w-24 text-center text-2xl font-semibold border-2 border-gray-300 rounded-lg py-4 px-3 focus:outline-none focus:border-[#840032] transition-colors"
                            placeholder="00"
                          />
                          <div className="flex flex-col gap-1 absolute -right-10 top-1/2 -translate-y-1/2">
                            <button
                              type="button"
                              onClick={() => {
                                const currentHour = bookingInfo.time ? parseInt(bookingInfo.time.split(':')[0]) : 0;
                                const newHour = currentHour < 23 ? currentHour + 1 : 0;
                                const minute = bookingInfo.time ? bookingInfo.time.split(':')[1] : '00';
                                setBookingInfo({ ...bookingInfo, time: `${String(newHour).padStart(2, '0')}:${minute}` });
                              }}
                              className="w-8 h-8 flex items-center justify-center bg-gray-100 hover:bg-[#840032] hover:text-white rounded text-gray-600 transition-colors text-sm font-bold"
                            >
                              ↑
                            </button>
                            <button
                              type="button"
                              onClick={() => {
                                const currentHour = bookingInfo.time ? parseInt(bookingInfo.time.split(':')[0]) : 0;
                                const newHour = currentHour > 0 ? currentHour - 1 : 23;
                                const minute = bookingInfo.time ? bookingInfo.time.split(':')[1] : '00';
                                setBookingInfo({ ...bookingInfo, time: `${String(newHour).padStart(2, '0')}:${minute}` });
                              }}
                              className="w-8 h-8 flex items-center justify-center bg-gray-100 hover:bg-[#840032] hover:text-white rounded text-gray-600 transition-colors text-sm font-bold"
                            >
                              ↓
                            </button>
                          </div>
                        </div>
                      </div>
                      
                      <span className="text-4xl font-bold text-[#840032] mt-8 "> </span>
                      
                      {/* Minute Input */}
                      <div className="flex flex-col items-center px-7">
                        <label className="text-xs text-gray-500 mb-2 font-medium uppercase tracking-wide">Minute</label>
                        <div className="relative">
                          <input
                            type="number"
                            min="0"
                            max="59"
                            value={bookingInfo.time ? parseInt(bookingInfo.time.split(':')[1]) : ''}
                            onChange={(e) => {
                              const minute = e.target.value.padStart(2, '0');
                              const hour = bookingInfo.time ? bookingInfo.time.split(':')[0] : '00';
                              if (parseInt(minute) >= 0 && parseInt(minute) <= 59) {
                                setBookingInfo({ ...bookingInfo, time: `${hour}:${minute}` });
                              }
                            }}
                            onBlur={(e) => {
                              let minute = e.target.value;
                              if (minute === '') minute = '00';
                              if (parseInt(minute) < 0) minute = '00';
                              if (parseInt(minute) > 59) minute = '59';
                              minute = minute.padStart(2, '0');
                              const hour = bookingInfo.time ? bookingInfo.time.split(':')[0] : '00';
                              setBookingInfo({ ...bookingInfo, time: `${hour}:${minute}` });
                            }}
                            className="w-24 text-center text-2xl font-semibold border-2 border-gray-300 rounded-lg py-4 px-3 focus:outline-none focus:border-[#840032] transition-colors"
                            placeholder="00"
                          />
                          <div className="flex flex-col gap-1 absolute -right-10 top-1/2 -translate-y-1/2">
                            <button
                              type="button"
                              onClick={() => {
                                const currentMinute = bookingInfo.time ? parseInt(bookingInfo.time.split(':')[1]) : 0;
                                const newMinute = currentMinute < 59 ? currentMinute + 1 : 0;
                                const hour = bookingInfo.time ? bookingInfo.time.split(':')[0] : '00';
                                setBookingInfo({ ...bookingInfo, time: `${hour}:${String(newMinute).padStart(2, '0')}` });
                              }}
                              className="w-8 h-8 flex items-center justify-center bg-gray-100 hover:bg-[#840032] hover:text-white rounded text-gray-600 transition-colors text-sm font-bold"
                            >
                              ↑
                            </button>
                            <button
                              type="button"
                              onClick={() => {
                                const currentMinute = bookingInfo.time ? parseInt(bookingInfo.time.split(':')[1]) : 0;
                                const newMinute = currentMinute > 0 ? currentMinute - 1 : 59;
                                const hour = bookingInfo.time ? bookingInfo.time.split(':')[0] : '00';
                                setBookingInfo({ ...bookingInfo, time: `${hour}:${String(newMinute).padStart(2, '0')}` });
                              }}
                              className="w-8 h-8 flex items-center justify-center bg-gray-100 hover:bg-[#840032] hover:text-white rounded text-gray-600 transition-colors text-sm font-bold"
                            >
                              ↓
                            </button>
                          </div>
                        </div>
                      </div>
                    </div>
                    
                    {/* Display selected time in readable format */}
                    {bookingInfo.time && (
                      <div className="mt-6 pt-6 border-t border-gray-200 text-center">
                        <p className="text-xs text-gray-500 mb-2 uppercase tracking-wide">Selected Time</p>
                        <p className="text-2xl font-bold text-[#840032]">
                          {(() => {
                            const [hour, minute] = bookingInfo.time.split(':');
                            const hourNum = parseInt(hour);
                            const ampm = hourNum >= 12 ? 'PM' : 'AM';
                            const displayHour = hourNum === 0 ? 12 : hourNum > 12 ? hourNum - 12 : hourNum;
                            return `${displayHour}:${minute} ${ampm}`;
                          })()}
                        </p>
                      </div>
                    )}
                  </div>
                </div>
                {bookingInfo.date && bookingInfo.time && (
                  <button
                    className="w-full py-3 bg-[#840032] text-white rounded-lg text-lg font-medium"
                    onClick={() => {
                      setDisplayModule("Summary");
                    }}
                  >
                    Next
                  </button>
                )}
              </div>
            </>
          )}
          {displayModule === "Summary" && (
            <>
              <div className="bg-white p-6 rounded-lg grid grid-cols-2 gap-4">
                <div className="col-span-2">
                  <Label value="Address" />
                  {userSavedAddress
                    ?.filter((item) => item._id === selectedAddress)
                    ?.map((item) => (
                      <div
                        className={`flex items-center gap-4 bg-white p-4 rounded-lg border`}
                        key={item._id}
                        onClick={() => {
                          setSelectedAddress(item?._id);
                        }}
                      >
                        <Image 
                          src="/assets/new_icons/Location.svg" 
                          alt="Location" 
                          width={20} 
                          height={20} 
                          className="text-[#840032]"
                        />
                        <p className="font-normal text-md uppercase">
                          {item?.address_type}
                        </p>
                        <p className="text-gray-600">
                          {item?.house_no}, {item?.formatted_address}
                        </p>
                      </div>
                    ))}
                </div>
                <div>
                  <Label value="Date" />
                  <TextInput
                    type="date"
                    readOnly={true}
                    value={bookingInfo.date}
                  />
                </div>
                <div>
                  <Label value="Time" />
                  <TextInput
                    type="time"
                    readOnly={true}
                    value={bookingInfo.time}
                  />
                </div>
              </div>
              <button
                className="w-full py-2 bg-[#840032] text-white rounded-lg"
                onClick={() => {
                  handleSubmit();
                }}
              >
                {loading ? <>Loading...</> : <>Pay Now</>}
              </button>
            </>
          )}
        </div>
        <div className="bg-[#f4f4f4] hide-scrollbar overflow-y-auto p-12 flex flex-col gap-8">
          <div className="bg-white rounded-lg p-6 flex flex-col gap-4">
            {selectedPackages
              ?.filter((i) => i.quantity > 0)
              ?.map((item, index) => (
                <div
                  className="grid grid-cols-4 gap-4 items-center"
                  key={index}
                >
                  <div className="text-lg font-medium col-span-2">
                    {item?.package?.name}
                  </div>
                  <div className="text-[#880E4F] flex flex-row justify-center">
                    <div className="flex items-center gap-1 rounded-lg bg-white border-[#880E4F] border divide-x-1 divide-[#880E4F]">
                      {selectedPackages?.find((i) => i._id === item._id)
                        ?.quantity > 0 && (
                        <button
                          className="px-2 py-1 font-semibold"
                          onClick={() => {
                            setSelectedPackages(
                              selectedPackages.map((i) =>
                                i._id === item._id
                                  ? { ...i, quantity: i.quantity - 1 }
                                  : i
                              )
                            );
                          }}
                        >
                          -
                        </button>
                      )}
                      <span className="px-2 py-1">
                        {selectedPackages?.find((i) => i._id === item._id)
                          ?.quantity >
                        0 >
                        0
                          ? selectedPackages?.find((i) => i._id === item._id)
                              ?.quantity
                          : "Add"}
                      </span>
                      <button
                        className="px-2 py-1 font-semibold"
                        onClick={() => {
                          setSelectedPackages(
                            selectedPackages.map((i) =>
                              i._id === item._id
                                ? { ...i, quantity: i.quantity + 1 }
                                : i
                            )
                          );
                        }}
                      >
                        +
                      </button>
                    </div>
                  </div>
                  <div className="text-lg font-medium">
                    {toPriceString(item.quantity * item.price)}
                  </div>
                </div>
              ))}
          </div>
          <div className="bg-white rounded-lg p-6 flex flex-col gap-4">
            <p className="text-xl font-semibold">Payment Summary</p>
            <div className="grid grid-cols-2 gap-4">
              <p className="text-lg">Item Total</p>
              <p className="text-lg text-right">
                {toPriceString(
                  selectedPackages?.reduce((accumulator, item) => {
                    return accumulator + item.quantity * item.price;
                  }, 0)
                )}
              </p>
              <p className="text-lg">Taxes & fees</p>
              <p className="text-lg text-right">
                {toPriceString(
                  ((taxationData?.wedsyPackage?.cgst +
                    taxationData?.wedsyPackage?.sgst) /
                    100) *
                    selectedPackages?.reduce((accumulator, item) => {
                      return accumulator + item.quantity * item.price;
                    }, 0)
                )}
              </p>
              <div className="col-span-2 h-[2px] bg-black w-full" />
              <p className="text-xl font-semibold">Total</p>
              <p className="text-xl font-semibold text-right">
                {toPriceString(
                  ((100 +
                    taxationData?.wedsyPackage?.cgst +
                    taxationData?.wedsyPackage?.sgst) /
                    100) *
                    selectedPackages?.reduce((accumulator, item) => {
                      return accumulator + item.quantity * item.price;
                    }, 0)
                )}
              </p>
            </div>
          </div>
          <div className="bg-white rounded-lg p-6 grid grid-cols-2 gap-4">
            <p className="text-xl font-semibold">Amount Payable</p>
            <p className="text-xl font-semibold text-right text-[#840032]">
              {toPriceString(
                ((100 +
                  taxationData?.wedsyPackage?.cgst +
                  taxationData?.wedsyPackage?.sgst) /
                  100) *
                  selectedPackages?.reduce((accumulator, item) => {
                    return accumulator + item.quantity * item.price;
                  }, 0)
              )}
            </p>
          </div>
        </div>
      </div>

      {/* Edit Address Modal */}
      <Modal
        show={editAddressModal}
        size="md"
        popup
        onClose={() => {
          setEditAddressModal(false);
          setEditingAddressId(null);
          setEditAddressDetails({
            house_no: "",
            address_type: "",
            postal_code: "",
            city: "",
            address_line_1: "",
          });
          setEditGoogleAddressDetails({});
        }}
      >
        <Modal.Header>Edit Address</Modal.Header>
        <Modal.Body>
          <div className="flex flex-col gap-4">
            <div>
              <Label value="House no/Flat no" />
              <TextInput
                type="text"
                placeholder="House no/Flat no"
                value={editAddressDetails.house_no}
                onChange={(e) => {
                  setEditAddressDetails({
                    ...editAddressDetails,
                    house_no: e.target.value,
                  });
                }}
                className="!border-gray-400 focus:!border-gray-600 focus:!ring-0 focus:!outline-none"
              />
            </div>
            <div>
              <Label value="Address line 1" />
              <TextInput
                ref={editInputRef}
                type="text"
                placeholder="Enter your address"
                value={editGoogleAddressDetails.formatted_address || editAddressDetails.address_line_1}
                onChange={(e) => {
                  setEditAddressDetails({
                    ...editAddressDetails,
                    address_line_1: e.target.value,
                  });
                  if (!e.target.value) {
                    setEditGoogleAddressDetails({});
                  }
                }}
                className="!border-gray-400 focus:!border-gray-600 focus:!ring-0 focus:!outline-none"
              />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label value="Pincode" />
                <TextInput
                  type="text"
                  placeholder="Pincode"
                  value={editAddressDetails.postal_code || editGoogleAddressDetails.postal_code}
                  onChange={(e) => {
                    setEditAddressDetails({
                      ...editAddressDetails,
                      postal_code: e.target.value,
                    });
                  }}
                  className="!border-gray-400 focus:!border-gray-600 focus:!ring-0 focus:!outline-none"
                />
              </div>
              <div>
                <Label value="City" />
                <TextInput
                  type="text"
                  placeholder="City"
                  value={editAddressDetails.city || editGoogleAddressDetails.city}
                  onChange={(e) => {
                    setEditAddressDetails({
                      ...editAddressDetails,
                      city: e.target.value,
                    });
                  }}
                  className="!border-gray-400 focus:!border-gray-600 focus:!ring-0 focus:!outline-none"
                />
              </div>
            </div>
            <div>
              <Label value="Address Type" />
              <Select
                value={editAddressDetails.address_type}
                onChange={(e) => {
                  setEditAddressDetails({
                    ...editAddressDetails,
                    address_type: e.target.value,
                  });
                }}
              >
                <option value={""}>Select Type</option>
                {["home", "work", "billing", "other"]?.map((item) => (
                  <option key={item} value={item}>
                    {toProperCase(item)}
                  </option>
                ))}
              </Select>
            </div>
            <div className="grid grid-cols-2 gap-4 mt-4">
              <Button
                color="gray"
                onClick={() => {
                  setEditAddressModal(false);
                  setEditingAddressId(null);
                  setEditAddressDetails({
                    house_no: "",
                    address_type: "",
                    postal_code: "",
                    city: "",
                    address_line_1: "",
                  });
                  setEditGoogleAddressDetails({});
                }}
              >
                Cancel
              </Button>
              <Button
                disabled={
                  !editAddressDetails.address_type ||
                  !editAddressDetails.house_no ||
                  (!editAddressDetails.postal_code && !editGoogleAddressDetails.postal_code) ||
                  (!editAddressDetails.city && !editGoogleAddressDetails.city) ||
                  (!editGoogleAddressDetails.formatted_address && !editAddressDetails.address_line_1)
                }
                onClick={() => {
                  updateUserSavedAddress();
                }}
                className="!bg-[#840032] hover:!bg-[#6b0028] !text-white !focus:ring-0 !focus:outline-none !hover:ring-0 !border-0 focus:!border-0 hover:!border-0 !border-transparent focus:!border-transparent hover:!border-transparent"
                style={{ border: 'none', outline: 'none' }}
              >
                Save
              </Button>
            </div>
          </div>
        </Modal.Body>
      </Modal>
    </>
  );
}

export default MakeupAndBeauty;
