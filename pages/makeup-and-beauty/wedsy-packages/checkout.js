import FAQAccordion from "@/components/accordion/FAQAccordion";
import MobileStickyFooter from "@/components/layout/MobileStickyFooter";
import { loadGoogleMaps } from "@/utils/loadGoogleMaps";
import { toPriceString, toProperCase } from "@/utils/text";
import { Button, Label, Modal, Select, TextInput } from "flowbite-react";
import Link from "next/link";
import Image from "next/image";
import { useRouter } from "next/router";
import { useEffect, useRef, useState } from "react";
import {
  FaArrowLeft,
  FaArrowRight,
  FaChevronLeft,
  FaChevronRight,
  FaSearch,
  FaStar,
} from "react-icons/fa";
import { MdChevronRight, MdClear } from "react-icons/md";

function MakeupAndBeauty({ user }) {
  const router = useRouter();
  const divRef = useRef(null);
  const inputRef = useRef(null); // Reference to the input element
  const [loading, setLoading] = useState(false);
  const [isLoaded, setIsLoaded] = useState(false);
  const [bookingInfo, setBookingInfo] = useState({ date: "", time: "" });
  const [selectedAddress, setSelectedAddress] = useState("");
  const [addressDetails, setAddressDetails] = useState({
    house_no: "",
    address_type: "",
  });
  const [googleAddressDetails, setGoogleAddressDetails] = useState({});
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
  return (
    <>
      <MobileStickyFooter />
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
                  className={`flex items-center gap-4 bg-white p-4 rounded-lg border ${
                    selectedAddress === item?._id && "border-[#840032]"
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
                  <p className="font-normal text-md uppercase">
                    {item?.address_type}
                  </p>
                  <p className="text-gray-600 text-sm">
                    {item?.house_no}, {item?.formatted_address}
                  </p>
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
                  />
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label value="Pincode" />
                    <TextInput
                      type="text"
                      placeholder="Pincode"
                      value={addressDetails.postal_code}
                      onChange={(e) => {
                        setAddressDetails({
                          ...addressDetails,
                          postal_code: e.target.value,
                        });
                      }}
                    />
                  </div>
                  <div>
                    <Label value="City" />
                    <TextInput
                      type="text"
                      placeholder="City"
                      value={addressDetails.city}
                      onChange={(e) => {
                        setAddressDetails({
                          ...addressDetails,
                          city: e.target.value,
                        });
                      }}
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
              <div>
                <Label value="Date" />
                <TextInput
                  type="date"
                  value={bookingInfo.date}
                  onChange={(e) => {
                    setBookingInfo({ ...bookingInfo, date: e.target.value });
                  }}
                  className="text-lg font-medium"
                />
              </div>
              <div>
                <Label value="Time" />
                <span className="text-gray-500 text-sm block mb-4">
                  *(The artist will arrive at the chosen time slot)
                </span>
                
                {/* Time slots grid */}
                <div className="grid grid-cols-3 gap-x-4 gap-y-3">
                  {[
                    "11:00", "12:00", "13:00",
                    "16:00", "17:30", "18:00", 
                    "18:30", "19:00", "19:30",
                    "20:00", "20:30", "21:00"
                  ].map((time) => (
                    <button
                      key={time}
                      onClick={() => {
                        setBookingInfo({ ...bookingInfo, time: time });
                      }}
                      className={`py-3 px-4 rounded-lg  text-center font-medium transition-all duration-200 ${
                        bookingInfo.time === time
                          ? " bg-[#840032]/30 text-[#840032]"
                          : " bg-[#F4F4F4] text-[#840032] hover:bg-[#840032]/10"
                      }`}
                    >
                      {time === "11:00" ? "11:00 am" :
                       time === "12:00" ? "12:00 pm" :
                       time === "13:00" ? "1:00 pm" :
                       time === "16:00" ? "4:00 pm" :
                       time === "17:30" ? "5:30 pm" :
                       time === "18:00" ? "6:00 pm" :
                       time === "18:30" ? "6:30 pm" :
                       time === "19:00" ? "7:00 pm" :
                       time === "19:30" ? "7:30 pm" :
                       time === "20:00" ? "8:00 pm" :
                       time === "20:30" ? "8:30 pm" :
                       time === "21:00" ? "9:00 pm" : time}
                    </button>
                  ))}
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
                    className={`flex items-center gap-4 bg-white p-4 rounded-xl border ${
                      selectedAddress === item?._id && "border-[#979797]"
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
                    <p className="font-normal text-md uppercase">
                      {item?.address_type}
                    </p>
                    <p className="text-gray-600">
                      {item?.house_no}, {item?.formatted_address}
                    </p>
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
                    />
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <Label value="Pincode" />
                      <TextInput
                        type="text"
                        placeholder="Pincode"
                        value={addressDetails.postal_code}
                        onChange={(e) => {
                          setAddressDetails({
                            ...addressDetails,
                            postal_code: e.target.value,
                          });
                        }}
                      />
                    </div>
                    <div>
                      <Label value="City" />
                      <TextInput
                        type="text"
                        placeholder="City"
                        value={addressDetails.city}
                        onChange={(e) => {
                          setAddressDetails({
                            ...addressDetails,
                            city: e.target.value,
                          });
                        }}
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
                <div>
                  <Label value="Date" />
                  <TextInput
                    type="date"
                    value={bookingInfo.date}
                    onChange={(e) => {
                      setBookingInfo({ ...bookingInfo, date: e.target.value });
                    }}
                    className="text-lg font-medium"
                  />
                </div>
                <div>
                  <Label value="Time" />
                  <span className="text-gray-500 text-sm block mb-4">
                    *(The artist will arrive at the chosen time slot)
                  </span>
                  
                  {/* Time slots grid */}
                  <div className="grid grid-cols-3 gap-x-4 gap-y-3">
                    {[
                      "11:00", "12:00", "13:00",
                      "16:00", "17:30", "18:00", 
                      "18:30", "19:00", "19:30",
                      "20:00", "20:30", "21:00"
                    ].map((time) => (
                      <button
                        key={time}
                        onClick={() => {
                          setBookingInfo({ ...bookingInfo, time: time });
                        }}
                        className={`py-3 px-4 rounded-lg border-2 text-center font-medium transition-all duration-200 ${
                          bookingInfo.time === time
                            ? "border-[#840032] bg-[#840032] text-white"
                            : "border-gray-300 bg-white text-[#840032] hover:border-[#840032] hover:bg-[#840032]/10"
                        }`}
                      >
                        {time === "11:00" ? "11:00 am" :
                         time === "12:00" ? "12:00 pm" :
                         time === "13:00" ? "1:00 pm" :
                         time === "16:00" ? "4:00 pm" :
                         time === "17:30" ? "5:30 pm" :
                         time === "18:00" ? "6:00 pm" :
                         time === "18:30" ? "6:30 pm" :
                         time === "19:00" ? "7:00 pm" :
                         time === "19:30" ? "7:30 pm" :
                         time === "20:00" ? "8:00 pm" :
                         time === "20:30" ? "8:30 pm" :
                         time === "21:00" ? "9:00 pm" : time}
                      </button>
                    ))}
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
    </>
  );
}

export default MakeupAndBeauty;
