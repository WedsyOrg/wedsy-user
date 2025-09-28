import MobileStickyFooter from "@/components/layout/MobileStickyFooter";
import { loadGoogleMaps } from "@/utils/loadGoogleMaps";
import { toPriceString } from "@/utils/text";
import { Label, Modal, TextInput } from "flowbite-react";
import Head from "next/head";
import Link from "next/link";
import { useRouter } from "next/router";
import { useEffect, useRef, useState } from "react";
import { BsShareFill } from "react-icons/bs";
import {
  FaArrowLeft,
  FaArrowRight,
  FaChevronLeft,
  FaChevronRight,
  FaHeart,
  FaMapMarkerAlt,
  FaRegHeart,
  FaRegStar,
  FaSearch,
  FaShareAlt,
  FaStar,
} from "react-icons/fa";
import { MdChevronRight, MdClear } from "react-icons/md";
import { RWebShare } from "react-web-share";

function MakeupAndBeauty({ userLoggedIn, setOpenLoginModalv2, setSource }) {
  const router = useRouter();
  const { vendorId } = router.query;
  const [loading, setLoading] = useState(false);
  const [personalPackages, setPersonalPackages] = useState([]);
  const [vendor, setVendor] = useState([]);
  const [displayPersonalPackages, setDisplayPersonalPackages] = useState([
    0, 1, 2, 3,
  ]);
  const inputRef = useRef(null);
  const [selectedPackages, setSelectedPackages] = useState([]);
  const [isLoaded, setIsLoaded] = useState(false);
  const [bookingInfo, setBookingInfo] = useState({ date: "", time: "" });
  const [googleAddressDetails, setGoogleAddressDetails] = useState({});
  const [taxationData, setTaxationData] = useState({});
  const [personalPackageTaxMultiply, setPersonalPackageTaxMultiply] =
    useState(1);
  const [isAddedToWishlist, setIsAddedToWishlist] = useState(false);
  const [galleryViewAll, setGalleryViewAll] = useState(false);
  const [viewBookingModal, setViewBookingModal] = useState(false);
  const [expandedAbout, setExpandedAbout] = useState(false);
  const scrollRef = useRef(null);
  const [scrollProgress, setScrollProgress] = useState(0);
  const reviewInputRef = useRef(null);
  const [shortUrl, setShortUrl] = useState("");

  useEffect(() => {
    const generateShortUrl = async () => {
      try {
        //change the localhost to your domain name when deploying
        const response = await fetch(
          `https://tinyurl.com/api-create.php?url=http://localhost:3000/makeup-and-beauty/artists/${vendorId}`
        );
        const shortLink = await response.text();
        setShortUrl(shortLink + "#reviews");
      } catch (error) {
        console.error("Error shortening URL:", error);
        setShortUrl(`https://wedsy.in/makeup-and-beauty/artists/${vendorId}`);
      }
    };

    generateShortUrl();
  }, [vendorId]);


  useEffect(() => {
    // Focus textarea when URL contains #reviews
    if (router.asPath.includes("#reviews")) {
      document.getElementById("reviews")?.scrollIntoView();
      setTimeout(() => {
        reviewInputRef.current?.focus();
      }, 500);
    }
  }, [router.asPath]);

  useEffect(() => {
    // Scroll progress for certificate section
    const handleScroll = () => {
      if (scrollRef.current) {
        const { scrollLeft, scrollWidth, clientWidth } = scrollRef.current;
        const progress = (scrollLeft / (scrollWidth - clientWidth)) * 100;
        setScrollProgress(progress);
      }
    };

    const container = scrollRef.current;
    if (container) {
      container.addEventListener("scroll", handleScroll);
    }

    return () => {
      if (container) {
        container.removeEventListener("scroll", handleScroll);
      }
    };
  }, [[vendor?.other?.awards?.length]]);

  const infoItems = [
    {
      label: "YEARS OF EXPERIENCE",
      value: vendor?.other?.experience ? `${vendor.other.experience}+` : "NA",
    },
    {
      label: "TOTAL ORDERS COMPLETED",
      value: vendor?.other?.clients ? `${vendor.other.clients}+` : "NA",
    },
    {
      label: "SERVICES OFFERED",
      value: vendor?.other?.onlyHairStyling
        ? "Hairstyling only"
        : vendor?.servicesOffered?.length > 0
          ? vendor.servicesOffered.join(", ")
          : "NA",
    },
    {
      label: "GROOM MAKEUP SERVICES",
      value: vendor?.other?.groomMakeup ? "Yes" : "No",
    },
    {
      label: "LGBTQ-FRIENDLY SERVICES",
      value: vendor?.other?.lgbtqMakeup ? "Yes" : "No",
    },
    {
      label: "PRODUCTS USED",
      value: vendor?.other?.makeupProducts?.length > 0
        ? vendor.other.makeupProducts.join(", ")
        : "NA",
    },
  ];


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
            }
          );

          // Listen for place selection
          autocomplete.addListener("place_changed", () => {
            const place = autocomplete.getPlace();
            if (place.geometry) {
              const { city, postal_code, state, country, locality } =
                extractAddressComponents(place.address_components);
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

    if (viewBookingModal) {
      initializeAutocomplete();
    }
  }, [viewBookingModal]); // Add inputRef.current as a dependency

  const handleSubmit = () => {
    setLoading(true);
    fetch(`${process.env.NEXT_PUBLIC_API_URL}/order`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        authorization: `Bearer ${localStorage.getItem("token")}`,
      },
      body: JSON.stringify({
        source: "Personal-Package",
        vendor: vendorId,
        personalPackages: selectedPackages
          ?.filter((i) => i.quantity > 0)
          ?.map((i) => ({
            quantity: i.quantity,
            price: i.price,
            package: i._id,
          })),
        date: bookingInfo?.date,
        time: bookingInfo?.time,
        address: googleAddressDetails,
      }),
    })
      .then((response) => response.json())
      .then((response) => {
        setLoading(false);
        if (response.message === "success") {
          alert("Request Sent Successfully!");
          setViewBookingModal(false);
          fetchPersonalPackages();
        } else {
          alert("Please try again later");
        }
      })
      .catch((error) => {
        console.error("There was a problem with the fetch operation:", error);
      });
  };
  const AddToWishlist = () => {
    fetch(`${process.env.NEXT_PUBLIC_API_URL}/user/wishlist/vendor`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        authorization: `Bearer ${localStorage.getItem("token")}`,
      },
      body: JSON.stringify({ _id: vendorId }),
    })
      .then((response) => (response.ok ? response.json() : null))
      .then((response) => {
        if (response.message === "success") {
          setIsAddedToWishlist(true);
          alert("Vendor added to wishlist!");
        }
      })
      .catch((error) => {
        console.error("There was a problem with the fetch operation:", error);
      });
  };
  const RemoveFromWishList = () => {
    fetch(`${process.env.NEXT_PUBLIC_API_URL}/user/wishlist/vendor`, {
      method: "DELETE",
      headers: {
        "Content-Type": "application/json",
        authorization: `Bearer ${localStorage.getItem("token")}`,
      },
      body: JSON.stringify({ _id: vendorId }),
    })
      .then((response) => (response.ok ? response.json() : null))
      .then((response) => {
        if (response.message === "success") {
          setIsAddedToWishlist(false);
          alert("Vendor removed from wishlist!");
        }
      })
      .catch((error) => {
        console.error("There was a problem with the fetch operation:", error);
      });
  };
  const AddStatLog = (statType, onSuccess) => {
    fetch(`${process.env.NEXT_PUBLIC_API_URL}/stats?key=vendor-${statType}`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        authorization: `Bearer ${localStorage.getItem("token")}`,
      },
      body: JSON.stringify({ vendor: vendorId }),
    })
      .then((response) => (response.ok ? response.json() : null))
      .then((response) => {
        if (response.message === "success") {
          onSuccess();
        }
      })
      .catch((error) => {
        console.error("There was a problem with the fetch operation:", error);
      });
  };
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
        setPersonalPackageTaxMultiply(
          (100 +
            response?.data?.personalPackage?.cgst +
            response?.data?.personalPackage?.sgst) /
            100
        );
      })
      .catch((error) => {
        console.error("There was a problem with the fetch operation:", error);
      });
  };

  const fetchPersonalPackages = () => {
    fetch(
      `${process.env.NEXT_PUBLIC_API_URL}/vendor-personal-package?vendorId=${vendorId}`,
      {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      }
    )
      .then((response) => response.json())
      .then((response) => {
        if (!document.body.classList.contains("relative")) {
          document.body.classList.add("relative");
        }
        Promise.all(
          response.map((i) => ({
            _id: i._id,
            quantity: 0,
            price: i.price,
          }))
        ).then((r) => {
          setSelectedPackages(r);
          setPersonalPackages(response);
          if (response.length < 4) {
            if (response.length === 1) {
              setDisplayPersonalPackages([0, 0, 0, 0]);
            }
            if (response.length === 2) {
              setDisplayPersonalPackages([0, 1, 0, 1]);
            }
            if (response.length === 3) {
              setDisplayPersonalPackages([0, 1, 2, 0]);
            }
          }
        });
      })
      .catch((error) => {
        console.error("There was a problem with the fetch operation:", error);
      });
  };
  const fetchVendor = () => {
    fetch(
      `${process.env.NEXT_PUBLIC_API_URL}/vendor/${vendorId}?fetchSimilar=true`,
      {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      }
    )
      .then((response) => response.json())
      .then((response) => {
        if (response?._id) {
          setVendor(response);
        } else {
          router.push("/makeup-and-beauty/artists");
        }
      })
      .catch((error) => {
        console.error("There was a problem with the fetch operation:", error);
      });
  };
  useEffect(() => {
    if (!vendorId) return;
    fetchPersonalPackages();
    fetchVendor();
    fetchTaxationData();
  }, [vendorId]);
  useEffect(() => {
    if (vendorId && userLoggedIn) {
      fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/user/is-added-to-wishlist?product=vendor&_id=${vendorId}`,
        {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
            authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        }
      )
        .then((response) => (response.ok ? response.json() : null))
        .then((response) => {
          if (response) {
            setIsAddedToWishlist(response.wishlist);
          }
        })
        .catch((error) => {
          console.error("There was a problem with the fetch operation:", error);
        });
    }
  }, [vendorId, userLoggedIn]);
  const nameParts = (vendor?.name || "").trim().split(" ").filter(Boolean);
  const firstLine = nameParts.length > 1 ? nameParts.slice(0, -1).join(" ") : vendor?.name || "";
  const secondLine = nameParts.length > 1 ? nameParts[nameParts.length - 1] : "";
  const colors = [
    { header: '#FFAFCD', services: '#FFAFCD', products: '#FFAFCD', priceBg: '#FFAFCD', buttonBg: '#840032' },
    { header: '#FBF2C0', services: '#FBF2C0', products: '#FBF2C0', priceBg: '#FBF2C0', buttonBg: '#FBF2C0' },
    { header: '#9ED0E6', services: '#9ED0E6', products: '#9ED0E6', priceBg: '#9ED0E6', buttonBg: '#9ED0E6' },
    { header: '#CE8C35', services: '#CE8C35', products: '#CE8C35', priceBg: '#CE8C35', buttonBg: '#CE8C35' },
  ];
  const MobileColors = [
    { header: '#FFFFFF', services: '#FFFFFF', products: '#AD7200', priceBg: '#AD7200', buttonBg: '#FFFFFF' },
    { header: '#FFFFFF', services: '#FFFFFF', products: '#FFFFFF', priceBg: '#012622', buttonBg: '#FFFFFF' }
  ];


  return (
    <>
      <Head>
        {/* <title>{vendor.name} | Wedsy</title> */}
        {/* <meta name="description" content={decor?.seoTags?.description} />
        <meta property="og:title" content={decor.name} />
        <meta property="og:description" content={decor?.seoTags?.description} /> */}
        {/* <meta property="og:image" content={vendor?.gallery?.coverPhoto} /> */}
        <Head>
          <title>{vendor?.name} | Wedsy</title>
          <meta property="og:title" content={`${vendor?.name} - Wedsy`} />
          <meta
            property="og:description"
            content={`${vendor?.speciality || "Makeup Artist"} • ${vendor?.businessAddress?.city || ""
              }`}
          />
          <meta
            property="og:image"
            content={vendor?.gallery?.coverPhoto || "/default-thumbnail.jpg"}
          />
          <meta
            property="og:url"
            content={`https://wedsy.in/makeup-and-beauty/artists/${vendor?._id}`}
          />
          <meta property="og:type" content="website" />
        </Head>
      </Head>
      <MobileStickyFooter />
      {selectedPackages?.reduce((accumulator, item) => {
        return accumulator + item.quantity;
      }, 0) > 0 && (
          <div className="bg-white fixed left-0 bottom-16 md:bottom-0 px-4 md:px-24 py-3 w-full z-50 flex flex-row items-center gap-4 items-center">
            <button
              className="py-2 px-6 rounded-md bg-black text-white shadow-md"
              onClick={() => {
                if (!userLoggedIn) {
                  setSource(`Makeup Artist [${vendor.name}]`);
                  setOpenLoginModalv2(true);
                } else {
                  setViewBookingModal(true);
                }
              }}
            >
              <span className="hidden md:block">{"CHOOSE DATE & TIME"}</span>
              <span className="md:hidden">View Cart</span>
            </button>
            <div className="hidden md:flex bg-[#840032] text-white rounded-full h-10 w-10 font-medium flex items-center justify-center">
              {selectedPackages?.reduce((accumulator, item) => {
                return accumulator + item.quantity;
              }, 0)}
            </div>
            <div className="ml-auto font-semibold text-black text-base md:text-lg">
              TOTAL:{" "}
              <span className="ml-4 text-[#840032] text-xl md:text-2xl">
                {toPriceString(
                  selectedPackages?.reduce((accumulator, item) => {
                    return accumulator + item.quantity * item.price;
                  }, 0) * personalPackageTaxMultiply
                )}
              </span>
            </div>
          </div>
        )}
      <Modal
        show={viewBookingModal}
        onClose={() => {
          setViewBookingModal(false);
        }}
        className="[&>div]:[&>div]:rounded-2xl"
      >
        <Modal.Body className="relative bg-[#D9D9D9] rounded-2xl p-6 flex flex-col gap-4">
          <MdClear
            className="absolute top-4 right-4"
            onClick={() => setViewBookingModal(false)}
            cursor={"pointer"}
          />
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <Label value="DATE" />
              <TextInput
                type="date"
                value={bookingInfo.date}
                onChange={(e) => {
                  setBookingInfo({ ...bookingInfo, date: e.target.value });
                }}
              />
            </div>
            <div>
              <Label value="TIME" />
              <TextInput
                type="time"
                value={bookingInfo.time}
                onChange={(e) => {
                  setBookingInfo({ ...bookingInfo, time: e.target.value });
                }}
              />
            </div>
          </div>
          <div>
            <Label value="LOCATION" />
            <TextInput
              ref={inputRef}
              type="text"
              placeholder="Enter your address"
            />
          </div>
          <div>
            <Label value="PROCESS" />
            <ul className="text-sm list-decimal list-inside">
              <li>
                Fill in the required details and submit your request to the
                artist
              </li>
              <li>
                The artist will review their availability and confirm if they
                can accommodate your request.
              </li>
              <li>
                Once accepted, you’ll receive a confirmation in your inbox, and
                you can proceed with payment to secure the artist’s services.
              </li>
            </ul>
          </div>
          <button
            className="bg-black disabled:bg-black/50 text-white py-2 px-7 rounded-lg max-w-max m-auto mt-4 self-center"
            disabled={loading}
            onClick={() => {
              handleSubmit();
            }}
          >
            SEND REQUEST
          </button>
        </Modal.Body>
      </Modal>
      <div className="hidden md:block relative w-full mb-1">
        <div className="w-56 h-56 overflow-hidden absolute top-0 right-0 ">
          <svg width="100%" height="100%" viewBox="0 0 100 100">
            <path d="M 0 0 A 100 100 0 0 0 100 100 L 100 0 Z" fill="#840032" />
          </svg>
        </div>
        <div className="absolute left-0 bottom-0 translate-y-1/2 bg-white rounded-r-full py-4 h-[70px] w-11/12 max-w-7xl min-w-[800px] divide-x-2 divide-gray-300 flex flex-row shadow-md">
          <div
            className="flex flex-row items-center gap-2 md:gap-3 px-4 md:px-8 lg:px-12 cursor-pointer flex-1 justify-center min-w-0"
            onClick={() => {
              if (!userLoggedIn) {
                setSource(`Makeup Artist [${vendor.name}]`);
                setOpenLoginModalv2(true);
              } else {
                AddStatLog("chat", () => {
                  window.open(`tel:${vendor.phone}`, "_blank");
                });
              }
            }}
          >
            <img src="/assets/icons/icon-message.png" className="h-5 w-5 md:h-6 md:w-6" />
            <span className="font-semibold text-sm md:text-base">CHAT</span>
          </div>
          <div
            className="flex flex-row items-center gap-2 md:gap-3 px-4 md:px-8 lg:px-12 cursor-pointer flex-1 justify-center min-w-0"
            onClick={() => {
              router.push("#gallery");
            }}
          >
            <img src="/assets/icons/icon-image.png" className="h-5 w-5 md:h-6 md:w-6" />
            <span className="font-semibold text-sm md:text-base">100 PHOTOS</span>
          </div>
          <div
            className="flex flex-row items-center gap-2 md:gap-3 px-4 md:px-8 lg:px-12 cursor-pointer flex-1 justify-center min-w-0"
            onClick={() => {
              router.push("#about");
            }}
          >
            <img src="/assets/icons/icon-info.png" className="h-5 w-5 md:h-6 md:w-6" />
            <span className="font-semibold text-sm md:text-base">ABOUT</span>
          </div>
          <div
            className="flex flex-row items-center gap-2 md:gap-3 px-4 md:px-8 lg:px-12 cursor-pointer flex-1 justify-center min-w-0"
            onClick={() => {
              router.push("#reviews");
            }}
          >
            <img src="/assets/icons/icon-review.png" className="h-5 w-5 md:h-6 md:w-6" />
            <span className="font-semibold text-sm md:text-base">REVIEWS</span>
          </div>
          <div
            className="flex flex-row items-center gap-2 md:gap-3 px-4 md:px-8 lg:px-12 cursor-pointer flex-1 justify-center min-w-0"
            onClick={() => {
              if (!userLoggedIn) {
                setSource(`Makeup Artist [${vendor.name}]`);
                setOpenLoginModalv2(true);
              } else {
                AddStatLog("call", () => {
                  window.open(`tel:${vendor.phone}`, "_blank");
                });
              }
            }}
          >
            <img src="/assets/icons/icon-call.png" className="h-5 w-5 md:h-6 md:w-6" />
            <span className="font-semibold text-sm md:text-base">CONTACT</span>
          </div>
        </div>
        <div className="w-1/2 absolute top-0 left-1/2 h-full">
          <div className="flex flex-row justify-center relative max-w-max mx-auto h-full ml-1 items-center px-12">

            <div
              className="absolute top-[15%] right-0 w-[190px] h-[40px] bg-black opacity-20 rounded-lg"
              style={{
                transform: "translateY(8px)",
                filter: "blur(8px)",
              }}
            ></div>

            <div
              className="flex items-center gap-1 bg-white absolute top-[15%] right-0 px-4 pr-6 py-1 w-[190px] h-[40px] z-10"
              style={{
                clipPath: "polygon(0 0, 90% 0, 100% 50%, 90% 100%, 0 100%)",
              }}
            >
              <FaRegStar size={24} className="text-[#840032] " />
              <span className="font-bold text-lg">{vendor?.rating} RATED</span>
            </div>
            <div className="absolute bottom-[10%] right-0 bg-[#840032] text-white rounded-lg p-3 translate-y-1/2 w-[250px] h-[80px] flex flex-col justify-center">
              <p className="text-sm font-medium tracking-wide mb-1">BRIDAL MAKEUP FROM</p>
              <p className="text-2xl font-bold">{toPriceString(vendor?.prices?.bridal)}</p>
            </div>
            <div className="w-[450px] h-[580px] rounded-t-[195px] overflow-hidden bg-[#D9D9D9] opacity-100">
              {vendor?.gallery?.coverPhoto && (
                <img
                  // src={vendor?.gallery?.coverPhoto}
                  src="/assets/images/makeup-artist-cover.png"
                  className="w-full h-full object-cover"
                />
              )}
            </div>
          </div>
        </div>
        <div className="grid grid-cols-2 px-24 bg-[#f4f4f4] h-[330px] items-center">
          <div className="relative">
            {/* First & Second Line */}
            <div className="font-semibold text-[clamp(1.5rem,4vw,3.5rem)] tracking-[0.35em] text-[#840032] uppercase leading-tight">
              <div>{firstLine}</div>
              {secondLine && <div>{secondLine}</div>}
            </div>

            {/* Speciality */}
            <div className="uppercase text-gray-500 tracking-[0.15em] font-semibold mt-2 text-[clamp(0.75rem,1.5vw,1rem)]">
              {`Speciality in : ${vendor?.speciality || ""}`}
            </div>

            {/* Icons */}
            <div className="flex flex-col gap-8 items-center absolute right-[-30px] bottom-0">
              {isAddedToWishlist ? (
                <FaHeart
                  size={32}
                  className="text-[#840032]"
                  onClick={() => {
                    if (userLoggedIn) {
                      RemoveFromWishList();
                    } else {
                      setSource(`Makeup Artist [${vendor.name}]`);
                      setOpenLoginModalv2(true);
                    }
                  }}
                />
              ) : (
                <FaRegHeart
                  size={32}
                  className="text-[#840032]"
                  onClick={() => {
                    if (userLoggedIn) {
                      AddToWishlist();
                    } else {
                      setSource(`Makeup Artist [${vendor.name}]`);
                      setOpenLoginModalv2(true);
                    }
                  }}
                />
              )}
              <RWebShare
                data={{
                  title: `Wedsy Makeup Artist - ${vendor?.name}`,
                  text: `Check out the Wedsy's Makeup Artist - ${vendor?.name}.`,
                  url: shortUrl || `https://wedsy.in/makeup-and-beauty/artists/${vendor?._id}`,
                }}
                onClick={() => console.log("Vendor shared successfully!")}
              >
                <BsShareFill
                  size={32}
                  className="text-[#840032]"
                  cursor={"pointer"}
                />
              </RWebShare>
            </div>
          </div>
        </div>


        <div className="grid bg-black center grid-cols-2 py-6 pb-16 h-[393px]">
          <div className="px-24">
            <div className="flex flex-row gap-4  pr-4 ">
              <div className="bg-[#EF2471] text-white uppercase w-[180px] h-[35px] rounded-none flex items-center justify-center font-bold">
                {vendor?.tag}
              </div>
              <div className="bg-white rounded-[10px] w-[118px] h-[76px] text-center flex flex-col items-center justify-center">
                <span className="text-xl font-bold">
                  {vendor?.other?.experience} yr+
                </span>
                <span className="text-sm font-normal">Experience</span>
              </div>
              <div className="bg-white rounded-[10px] w-[118px] h-[76px] text-center flex flex-col items-center justify-center">
                <span className="text-xl font-bold">
                  {vendor?.other?.clients}
                </span>
                <span className="text-sm font-normal">Orders</span>
              </div>
            </div>
            <p className="text-white mt-6">{vendor?.businessDescription}</p>
          </div>
        </div>
      </div>
      <div className="md:hidden relative">
        <div className="font-semibold text-4xl bg-white rounded-b-2xl text-center leading-loose tracking-wider text-[#840032] uppercase">
          {vendor?.name}
        </div>
        <div className="absolute top-0 left-0 w-full font-semibold text-4xl bg-white rounded-b-2xl text-center leading-loose tracking-wider text-[#840032] uppercase z-20">
          {vendor?.name}
        </div>

        <div className="relative">
          <div className="absolute top-8 left-0 px-4 py-1 bg-[#EF2471] text-white uppercase">
            {vendor?.tag}
          </div>
          <div className="absolute top-8 right-8">
            {isAddedToWishlist ? (
              <FaHeart
                size={32}
                className="text-[#840032]"
                onClick={() => {
                  if (userLoggedIn) {
                    RemoveFromWishList();
                  } else {
                    setSource(`Makeup Artist [${vendor.name}]`);
                    setOpenLoginModalv2(true);
                  }
                }}
              />
            ) : (
              <FaRegHeart
                size={32}
                className="text-[#840032]"
                onClick={() => {
                  if (userLoggedIn) {
                    AddToWishlist();
                  } else {
                    setSource(`Makeup Artist [${vendor.name}]`);
                    setOpenLoginModalv2(true);
                  }
                }}
              />
            )}
          </div>

          <div className="bg-[#f4f4f4] absolute -bottom-12 left-0 rounded-t-2xl w-full py-6 flex flex-row gap-4 items-center justify-center">
            <div className="bg-white p-2 rounded-lg">
              <img
                src="/assets/icons/icon-image.png"
                className="h-6 w-6"
                onClick={() => {
                  router.push("#gallery");
                }}
              />
            </div>

            <div className="bg-white p-2 rounded-lg">
              <img
                src="/assets/icons/icon-review.png"
                className="h-6 w-6"
                onClick={() => {
                  router.push("#reviews");
                }}
              />
            </div>
            <div className="bg-white p-2 rounded-lg">
              <img
                src="/assets/icons/icon-info.png"
                className="h-6 w-6"
                onClick={() => {
                  router.push("#about");
                }}
              />
            </div>
          </div>
          <img src={vendor?.gallery?.coverPhoto} className="-mt-4" />
        </div>
        <div className="bg-[#f4f4f4] py-6 mt-10 px-6">
          <div className="uppercase font-medium text-center">
            Speciality In: {vendor?.speciality}
          </div>
          <div className="bg-[#840032] text-white rounded-lg p-2 mt-4 font-medium text-center">
            <p className="text-lg">BRIDAL MAKEUP FROM</p>
            <p className="font-semibold text-2xl">
              {toPriceString(vendor?.prices?.bridal)}
            </p>
          </div>
          <p className="text-m mt-4">{vendor?.businessDescription}</p>
          <div className="py-2 gap-6 grid grid-cols-2 mt-6">
            <div
              className="flex flex-row items-center gap-3 justify-center bg-white rounded-lg p-2 py-3"
              onClick={() => {
                if (!userLoggedIn) {
                  setSource(`Makeup Artist [${vendor.name}]`);
                  setOpenLoginModalv2(true);
                } else {
                  AddStatLog("chat", () => {
                    window.open(`tel:${vendor.phone}`, "_blank");
                  });
                }
              }}
            >
              <img src="/assets/icons/icon-message-2.png" className="h-6 w-6" />
              <span className="font-semibold">CHAT NOW</span>
            </div>
            <div
              className="flex flex-row items-center gap-3 justify-center bg-[#2B3F6C] rounded-lg p-2 py-3"
              onClick={() => {
                if (!userLoggedIn) {
                  setSource(`Makeup Artist [${vendor.name}]`);
                  setOpenLoginModalv2(true);
                } else {
                  AddStatLog("call", () => {
                    window.open(`tel:${vendor.phone}`, "_blank");
                  });
                }
              }}
            >
              <img src="/assets/icons/icon-call-3.png" className="h-6 w-6" />
              <span className="font-semibold text-white">CALL NOW</span>
            </div>
          </div>
        </div>
      </div>



      {/* Makeup Artist's Packages Section */}
      {/* Mobile wedsy packages section */}
      <div className="bg-[#f4f4f4] mt-8 pt-8 md:hidden mb-1">
        <p className="text-2xl font-semibold text-center">Make up Artist Packages</p>
        <div className="px-6 pt-8 flex flex-col gap-8 md:px-0 w-full mb-8">
          {personalPackages.length > 0 &&
            personalPackages.slice(0, 2).map((pkg, index) => {
              const colorSet = MobileColors[index] || MobileColors[0];
              const isSelected = selectedPackages?.find((i) => i._id === pkg._id)?.quantity > 0;
              const quantity = isSelected ? selectedPackages?.find((i) => i._id === pkg._id)?.quantity : 0;
              const originalPrice = pkg?.price || 0;
              const discountedPrice = (pkg?.price || 0) * personalPackageTaxMultiply;

              return (
                <div
                  key={pkg?._id}
                  className="flex flex-col rounded-2xl overflow-hidden shadow-md"
                >
                  {/* Package Name Header */}
                  <div
                    className="text-center py-4 font-semibold text-xl text-Black uppercase"
                    style={{ backgroundColor: colorSet.header }}
                  >
                    {pkg?.name || "Package"}
                  </div>

                  {/* Services & Products Section */}
                  <div className="bg-white flex flex-col p-6 gap-4">
                    <div className="flex flex-col gap-2">
                      <h4 className="text-black font-normal uppercase">Services</h4>
                      <ul className="text-black font-semibold text-xl">
                        {pkg?.services?.map((i, i1) => (
                          <li key={i1}>&bull; {i}</li>
                        ))}
                      </ul>
                    </div>
                    <div className="flex flex-col gap-2">
                      <h4 className="text-black font-normal uppercase">Products</h4>
                      <ul className="text-black font-semibold text-xl">
                        {pkg?.products ? pkg.products.split(",").map((p, pIndex) => (
                          <li key={pIndex}>&bull; {p.trim()}</li>
                        )) : <li>No products listed</li>}
                      </ul>
                    </div>
                  </div>

                  <div
                    className="flex flex-row items-center justify-between py-4 px-6"
                    style={{ backgroundColor: colorSet.priceBg }}
                  >
                    <div className="flex items-center gap-2 rounded-lg bg-white overflow-hidden border border-[#C6C6C6]">
                      {quantity > 0 && (
                        <button
                          className="p-2 text-gray-800 font-semibold"
                          onClick={() => {
                            setSelectedPackages(
                              selectedPackages.map((i) =>
                                i._id === pkg._id
                                  ? { ...i, quantity: i.quantity - 1 }
                                  : i
                              )
                            );
                          }}
                        > - </button>
                      )}
                      <span className="p-2 px-4 text-center w-20">
                        {isSelected ? 'Add' : 'Add'}
                      </span>
                      <button
                        className="p-2 text-gray-800 font-semibold"
                        onClick={() => {
                          setSelectedPackages(
                            selectedPackages.map((i) =>
                              i._id === pkg._id
                                ? { ...i, quantity: i.quantity + 1 }
                                : i
                            )
                          );
                        }}
                      > + </button>
                    </div>
                    {/* Price */}
                    <div className="text-white text-right">
                      {originalPrice && (
                        <p className="text-xs line-through">₹{toPriceString(originalPrice)}</p>
                      )}
                      <p className="text-lg font-bold">₹{toPriceString(discountedPrice)}</p>
                      <p className="text-xs font-normal">Per Person</p>
                    </div>
                  </div>
                </div>
              );
            })}
        </div>
        <div className="flex flex-row justify-center ">
          <Link href="/makeup-and-beauty/wedsy-packages">
            <button
              className="rounded-md md:rounded-full bg-black text-white py-2 px-28 mt-4 mb-10"
            >
              View More
            </button>
          </Link>
        </div>
      </div>


      {/* Desktop wedsy packages section */}
<div className="bg-[#f4f4f4] px-24 py-12 pt-32 hidden md:block">
  <p className="text-2xl font-semibold text-center">Make up Artist Packages</p>
  <div className="relative pt-12 flex items-center justify-center">
    {/* Left Arrow Navigation */}
    <div className="absolute left-0 w-24 hidden md:flex flex-col justify-center items-center z-10">
      {displayPersonalPackages[0] > 0 && (
        <div
          className="rounded-full border border-black p-2 cursor-pointer"
          onClick={() => {
            setDisplayPersonalPackages((prev) => {
              let startIndex = prev[0] - 4;
              if (startIndex < 0) startIndex = 0;
              return [startIndex, startIndex + 1, startIndex + 2, startIndex + 3];
            });
          }}
        >
          <FaArrowLeft size={20} />
        </div>
      )}
    </div>

    {/* Right Arrow Navigation */}
    <div className="absolute right-0 w-24 hidden md:flex flex-col justify-center items-center z-10">
      {displayPersonalPackages[3] < personalPackages.length - 1 && (
        <div
          className="rounded-full border border-black p-2 cursor-pointer"
          onClick={() => {
            setDisplayPersonalPackages((prev) => {
              let endIndex = prev[3] + 4;
              if (endIndex > personalPackages.length - 1)
                endIndex = personalPackages.length - 1;
              return [endIndex - 3, endIndex - 2, endIndex - 1, endIndex];
            });
          }}
        >
          <FaArrowRight size={20} />
        </div>
      )}
    </div>

    {/* Package Grid */}
    {personalPackages.length > 0 && (
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8 md:gap-0 px-6 md:px-0 w-full mb-8">
        {[
          personalPackages[displayPersonalPackages[0]],
          personalPackages[displayPersonalPackages[1]],
          personalPackages[displayPersonalPackages[2]],
          personalPackages[displayPersonalPackages[3]],
        ].map((pkg, index) => {
          const colorSet = colors[index] || colors[0];
          const originalPrice = pkg?.price || 0;
          const discountedPrice = originalPrice * personalPackageTaxMultiply;
          const selected = selectedPackages?.find((i) => i._id === pkg._id);
          const quantity = selected?.quantity || 0;

          return (
            <div
              key={pkg?._id}
              className="flex flex-col rounded-2xl md:rounded-none overflow-hidden shadow-md md:border-2 md:border-white"
            >
              {/* Package Name Header */}
              <div
                className="text-center py-4 font-semibold text-black uppercase md:border-b-2 md:border-white"
                style={{ backgroundColor: colorSet.header, fontFamily: "Montserrat" }}
              >
                {pkg?.name || "Package"}
              </div>

              {/* Services Section */}
              <div
                className="flex flex-col items-center justify-center py-6 md:py-10"
                style={{ backgroundColor: colorSet.services, fontFamily: "Montserrat" }}
              >
                <h4 className="mb-1 text-black font-normal uppercase">Services</h4>
                <p className="hidden md:block text-black font-semibold text-xl text-center px-4">
                  {pkg?.services?.join(", ")}
                </p>
                <ul className="md:hidden text-center">
                  {pkg?.services?.map((i, i1) => (
                    <li key={i1} className="font-medium text-black">
                      {i}
                    </li>
                  ))}
                </ul>
              </div>

              {/* Products Section */}
              <div
                className="relative flex flex-col items-center justify-center py-6 md:py-10"
                style={{ backgroundColor: colorSet.products, fontFamily: "Montserrat" }}
              >
                <div className="absolute inset-0 bg-black/20"></div>
                <h4 className="mb-1 text-black font-normal uppercase relative z-10">Products</h4>
                <p className="hidden md:block text-black font-semibold text-xl text-center px-4 relative z-10">
                  {pkg?.products
                    ? pkg.products.split(",").map((p, pIndex) => (
                        <>
                          {p.trim()}
                          {pIndex < pkg.products.split(",").length - 1 && <br />}
                        </>
                      ))
                    : "No products listed"}
                </p>
                <p className="md:hidden text-black font-normal text-sm text-center px-4 relative z-10">
                  {pkg?.products || "No products listed"}
                </p>
              </div>

              {/* Bottom Add/Price Section */}
              <div
                className="flex items-center justify-between py-4 px-6 border-t md:border-b md:border-white"
                style={{ backgroundColor: colorSet.priceBg, borderColor: "#C6C6C6" }}
              >
                <div className="flex items-center gap-1 rounded-lg bg-white overflow-hidden border border-[#C6C6C6]">
                  {quantity > 0 && (
                    <button
                      className="p-2 text-gray-800 font-semibold"
                      onClick={() => {
                        setSelectedPackages(
                          selectedPackages.map((i) =>
                            i._id === pkg._id ? { ...i, quantity: i.quantity - 1 } : i
                          )
                        );
                      }}
                    >
                      -
                    </button>
                  )}
                  <span className="p-2">{quantity > 0 ? quantity : "Add"}</span>
                  <button
                    className="p-2 text-gray-800 font-semibold"
                    onClick={() => {
                      setSelectedPackages(
                        selectedPackages.map((i) =>
                          i._id === pkg._id ? { ...i, quantity: i.quantity + 1 } : i
                        )
                      );
                    }}
                  >
                    +
                  </button>
                </div>

                {/* Price */}
                <div className="text-right">
                  {originalPrice > 0 && (
                    <p className="text-xs line-through text-gray-600">₹{toPriceString(originalPrice)}</p>
                  )}
                  <p className="text-lg font-bold text-[#840032]">₹{toPriceString(discountedPrice)}</p>
                  <p className="text-xs font-normal text-black">Per Person</p>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    )}

    
  </div>
  <div className="flex flex-row justify-center ">
      <Link href="/makeup-and-beauty/wedsy-packages">
        <button className="rounded-md md:rounded-full bg-black text-white py-2 px-28 mt-4 mb-10">
          View More
        </button>
      </Link>
    </div>
</div>








        {/*gallery */}
        {/* <div className="md:hidden mt-8 bg-[#f4f4f4] py-4">
        <Modal show={galleryViewAll} onClose={() => setGalleryViewAll(false)}>
          <Modal.Body>
            <p className="text-2xl font-semibold  mb-2">
              GALLERY
              <MdClear
                className="float-right"
                onClick={() => setGalleryViewAll(!galleryViewAll)}
                cursor={"pointer"}
              />
            </p>
            <div className="grid grid-cols-2 gap-1">
              {vendor?.gallery?.photos?.map((item, index) => (
                <div className="pt-[100%] relative" key={index}>
                  <img
                    src={item}
                    className="absolute top-0 left-0 h-full w-full object-cover"
                  />
                </div>
              ))}
              <div className="bg-[#D9D9D9] flex justify-center items-center">
                <button
                  className="underline"
                  onClick={() => setGalleryViewAll(!galleryViewAll)}
                >
                  view less
                </button>
              </div>
            </div>
          </Modal.Body>
        </Modal>
        <p className="text-2xl font-semibold text-center">GALLERY</p>
        <div className="p-6 grid grid-cols-2 gap-1">
          {vendor?.gallery?.photos?.slice(0, 5)?.map((item, index) => (
            <div className="pt-[100%] relative" key={index}>
              <img
                src={item}
                className="absolute top-0 left-0 h-full w-full object-cover"
              />
            </div>
          ))}
          {vendor?.gallery?.photos?.length > 5 && (
            <div className="bg-[#D9D9D9] flex justify-center items-center">
              <button
                className="underline"
                onClick={() => setGalleryViewAll(!galleryViewAll)}
              >
                view all
              </button>
            </div>
          )}
        </div>
      </div>
      <div className="hidden  md:block bg-[#f4f4f4] px-24 py-12" id={"gallery"}>
        <div className="grid grid-cols-2 bg-white font-semibold text-center text-xl uppercase">
          <div className="text-[#840032] border-b-4 py-2 border-b-[#840032]">
            PHOTOS
          </div>
          <div className="border-b-4 border-white py-2">ALBUM</div>
        </div>
        <div className="shadow-xl p-12 grid grid-cols-5 gap-1">
          {(galleryViewAll
            ? vendor?.gallery?.photos
            : vendor?.gallery?.photos?.slice(0, 10)
          )?.map((item, index) => (
            <div className="pt-[100%] relative" key={index}>
              <img
                src={item}
                className="absolute top-0 left-0 h-full w-full object-cover"
              />
            </div>
          ))}
          {vendor?.gallery?.photos?.length > 10 && (
            <div className="col-span-5 flex justify-center items-center mt-4">
              <button
                className="bg-[#840032] text-white rounded-lg px-12 py-1"
                onClick={() => setGalleryViewAll(!galleryViewAll)}
              >
                VIEW {galleryViewAll ? "LESS" : "ALL"}
              </button>
            </div>
          )}
        </div>
      </div> */}
        <div className="bg-[#f4f4f4]  mt-8 uppercase px-6 md:px-24 py-8 md:py-16 text-2xl md:text-3xl font-semibold mt-1 md:mt-0 md:mb-0 text-center">
          {"Gallery"}
        </div>
        <div className="grid bg-[#f4f4f4] grid-cols-2 pb-12 px-6 md:grid-cols-5 md:grid-rows-2 gap-2 md:px-28">

          {/* S1 */}

          <div className="bg-gray-300 aspect-square rounded-xl md:row-span-2 md:col-span-2"></div>

          {/* S2 */}
          <div className="bg-gray-300 aspect-square rounded-xl"></div>


          {/* RECT  */}

          <div className="bg-gray-300 aspect-square rounded-xl md:col-span-2 md:aspect-auto"></div>

          {/* S5 */}
          <div className="bg-gray-300 aspect-square rounded-xl"></div>

          {/* S6 */}
          <div className="bg-gray-300 aspect-square rounded-xl"></div>

          {/* S7 */}
          <a
            href="/more"
            className="bg-[#333] aspect-square rounded-xl flex flex-col items-center justify-center text-white hover:bg-[#444] transition"
          >
            <div className="text-sm font-semibold tracking-wider mb-3">
              VIEW MORE
            </div>
            <div className="w-8 h-8 border-2 border-white rounded-full flex items-center justify-center">
              <span className="text-lg">›</span>
            </div>
          </a>

        </div>
        



        {/* About Artist Section */}
        {/* phone view */}
        <div className="md:hidden mt-8 bg-[#f4f4f4] px-6 py-6" id="about">
          <div className="font-semibold text-2xl uppercase mb-4 text-center">
            About {vendor?.businessName}
          </div>

          {/* Collapsed view (only description) */}
          {!expandedAbout && (
            <div className="font-semibold rounded-2xl text-xl bg-white p-6 font-medium">
              {vendor?.businessDescription}
            </div>
          )}

          {/* Expanded view (full content same as desktop) */}
          {expandedAbout && (
            <div className="bg-white rounded-2xl  ">
              <div className="p-6 font-medium rounded-2xl">
                <div className="px-2">
                  {/* About the Artist */}
                  <div className="mb-6">
                    <p
                      className="text-base text-xl text-black font-semibold"
                      style={{ fontFamily: "Montserrat" }}
                    >
                      {vendor?.other?.usp?.trim() ||
                        vendor?.businessDescription?.trim() ||
                        "{How are they different and what makes them special (artist's paragraph)}"}
                    </p>
                  </div>

                  {/* Key Highlights */}
                  <div className="text-xl">
                    <h3
                      className=" font-semibold text-black mb-1"
                      style={{ fontFamily: "Montserrat", fontWeight: 600 }}
                    >
                      Key Highlights
                    </h3>
                    <ul className=" text-black">
                      <li className="flex items-start">
                        <span className="text-black mr-2">•</span>
                        <span>
                          <span
                            className="font-semibold"
                            style={{ fontFamily: "Montserrat", fontWeight: 600 }}
                          >
                            Years of Experience:
                          </span>{" "}
                          <span
                            style={{ fontFamily: "Montserrat", fontWeight: 400 }}
                          >
                            {vendor?.other?.experience || "NA"}
                          </span>
                        </span>
                      </li>
                      <li className="flex items-start">
                        <span className="text-black mr-2">•</span>
                        <span>
                          <span
                            className="font-semibold"
                            style={{ fontFamily: "Montserrat", fontWeight: 600 }}
                          >
                            Total Orders Completed:
                          </span>{" "}
                          <span
                            style={{ fontFamily: "Montserrat", fontWeight: 400 }}
                          >
                            {vendor?.other?.clients || "NA"}
                          </span>
                        </span>
                      </li>
                      <li className="flex items-start">
                        <span className="text-black mr-2">•</span>
                        <span>
                          <span
                            className="font-semibold"
                            style={{ fontFamily: "Montserrat", fontWeight: 600 }}
                          >
                            Services Offered:
                          </span>{" "}
                          <span
                            style={{ fontFamily: "Montserrat", fontWeight: 400 }}
                          >
                            {vendor?.other?.onlyHairStyling
                              ? "Hairstyling only"
                              : vendor?.servicesOffered?.length > 0
                                ? vendor.servicesOffered.join(", ")
                                : "NA"}
                          </span>
                        </span>
                      </li>
                      <li className="flex items-start">
                        <span className="text-black mr-2">•</span>
                        <span>
                          <span
                            className="font-semibold"
                            style={{ fontFamily: "Montserrat", fontWeight: 600 }}
                          >
                            Groom Makeup Services:
                          </span>{" "}
                          <span
                            style={{ fontFamily: "Montserrat", fontWeight: 400 }}
                          >
                            {vendor?.other?.groomMakeup ? "Yes" : "No"}
                          </span>
                        </span>
                      </li>
                      <li className="flex items-start">
                        <span className="text-black mr-2">•</span>
                        <span>
                          <span
                            className="font-semibold"
                            style={{ fontFamily: "Montserrat", fontWeight: 600 }}
                          >
                            LGBTQ-Friendly Services:
                          </span>{" "}
                          <span
                            style={{ fontFamily: "Montserrat", fontWeight: 400 }}
                          >
                            {vendor?.other?.lgbtqMakeup ? "Yes" : "No"}
                          </span>
                        </span>
                      </li>
                      <li className="flex items-start">
                        <span className="text-black mr-2">•</span>
                        <span>
                          <span
                            className="font-semibold"
                            style={{ fontFamily: "Montserrat", fontWeight: 600 }}
                          >
                            Products Used:
                          </span>{" "}
                          <span
                            style={{ fontFamily: "Montserrat", fontWeight: 400 }}
                          >
                            {vendor?.other?.makeupProducts?.length > 0
                              ? vendor.other.makeupProducts.join(", ")
                              : "NA"}
                          </span>
                        </span>
                      </li>
                    </ul>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Toggle Button */}
          <div className="text-right mt-2">
            <button
              onClick={() => setExpandedAbout(!expandedAbout)}
              className="text-gray-500 font-semibold"
            >
              {expandedAbout ? "Read less" : "Read more ..."}
            </button>
          </div>
        </div>

        {/* desktop view */}
        <div className="hidden md:block bg-[#f4f4f4] px-24 pt-32 pb-12" id="about">
          <div className="font-semibold rounded-[15px] text-2xl uppercase py-3 px-12 text-center bg-white " style={{ fontFamily: 'Montserrat', fontWeight: 500, fontStyle: 'normal' }}>
            About {vendor?.businessName}
          </div>
          <div className="shadow-[0_4px_10px_rgba(0,0,0,0.3)] bg-white mt-12 rounded-[15px]">
            <div className="p-8 font-medium  ">
              <div className="px-2 ">
                {/* About the Artist */}
                <div className="mb-6">
                  <h3 className="text-2xl font-semibold text-black mb-2" style={{ fontFamily: 'Montserrat', fontWeight: 600 }}>About the Artist</h3>
                  <p className="text-base text-black font-normal" style={{ fontFamily: 'Montserrat', fontWeight: 400 }}>
                    {vendor?.other?.usp?.trim() ||
                      vendor?.businessDescription?.trim() ||
                      "{How are they different and what makes them special (artist's paragraph)}"}
                  </p>
                </div>
              </div>
            </div>
          </div>
          {/* Key Highlights */}
          <div className="mt-24">
            <h3 className="text-2xl font-semibold text-black mb-1" style={{ fontFamily: 'Montserrat', fontWeight: 600 }}>Key Highlights</h3>
            <div className="">
              {infoItems.map((item, index) => (
                <div key={index} className="flex items-start mt-3">
                  {/*label */}
                  <span
                    className="font-semibold bg-white text-[#840032] h-[50px] w-[270px] flex items-center justify-center rounded-[15px]"
                    style={{ fontFamily: "Montserrat", fontWeight: 600 }}
                  >
                    {item.label}
                  </span>

                  {/* value  */}
                  <div className="relative ml-10">
                    <div className="absolute -left-2 top-0 h-[50px] w-[90%] bg-[#840032] rounded-[15px]"></div>
                    <div className="relative bg-white rounded-[15px] h-[50px] px-4 flex items-center justify-center text-center">
                      <span className="font-bold" style={{ fontFamily: "Montserrat" }}>
                        {item.value}
                      </span>
                    </div>
                  </div>
                </div>
              ))}
            </div>

          </div>
        </div>

        {/* CERTIFICATIONS & AWARDS */}
        {(vendor?.other?.awards?.length > 0) && (
          <section className="bg-[#f4f4f4] py-10 hidden md:block">
            <div className="px-24">
              {/* Heading*/}
              <h2 className="text-2xl font-semibold text-black mb-10" style={{ fontFamily: 'Montserrat', fontWeight: 600 }}>
                CERTIFICATIONS & AWARDS
              </h2>

              {/* Cards*/}
              <div
                ref={scrollRef}
                className="flex gap-6 overflow-x-auto justify-center scrollbar-hide pb-4 px-4 -mx-4"
              >
                {vendor?.other?.awards.map((award, index) => (
                  <div
                    key={index}
                    className="w-60 h-80 bg-gray-300 rounded-xl flex-shrink-0"
                  >
                    <img
                      src={award.certificate}
                      className="w-full h-full object-cover rounded-xl"
                    />
                  </div>
                ))}
              </div>

              {/* Slider Indicator */}
              <div className="flex justify-center mt-4">
                <div className="h-1 w-[100%] bg-gray-200 rounded-full relative overflow-hidden">
                  <div
                    className="absolute top-0 left-0 h-1 bg-black rounded-full transition-all duration-300"
                    style={{
                      width: "12%",
                      left: `${scrollProgress * 0.88}%`,
                    }}
                  >
                  </div>
                </div>
              </div>
            </div>
          </section>
        )}


        {/* CERTIFICATIONS & AWARDS */}
        {/* {(vendor?.other?.awards?.length) && (
        <div className="bg-[#f4f4f4] mt-8 md:mt-0 px-6 md:px-24 py-8 md:py-12" id="awards">
          <h3
            className=" text-2xl md:text-3xl font-semibold uppercase"
            style={{ fontFamily: 'Montserrat' }}
          >
            CERTIFICATIONS & AWARDS
          </h3>
          <div className="mt-6 md:mt-8 flex flex-col gap-4 md:gap-6">
            {(vendor?.other?.awards || []).map(
              (award, index) => (
                <div
                  key={award?._id || index}
                  className="flex items-center gap-4 md:gap-6"
                  style={{ fontFamily: 'Montserrat' }}
                >
                  <div className="w-24 h-24 md:w-36 md:h-36 rounded-md overflow-hidden bg-[#E5E5E5] flex-shrink-0">
                    {award?.certificate && (
                      <img
                        src={award.certificate}
                        className="w-full h-full object-cover"
                      />
                    )}
                  </div>
                  <div className="text-black ml-8 text-sm md:text-base font-semibold">
                    {award?.title}
                  </div>
                </div>
              )
            )}
          </div>
        </div>
      )} */}



        {/* RATINGS AND REVIEWS Section*/}
        <div className="bg-[#f4f4f4] mt-8 md:mt-0 px-6 py-8" id="reviews">
          <div
            className="text-center text-2xl md:text-3xl font-semibold uppercase mb-10"
            style={{ fontFamily: "Montserrat" }}
          >
            RATINGS & REVIEWS
          </div>

          <div className="bg-[#f4f4f4] rounded-lg p-6 mb-6">
            <div className="flex flex-col lg:flex-row gap-6">
              <div className="w-full  lg:w-[30%] flex flex-row lg:flex-col gap-6 ">
                <div className="w-1/2 lg:w-full pr-4 border-r border-gray-500 lg:border-r-0 lg:pb-4">
                  <div className="text-gray-500 text-sm mb-2 font-semibold">Very Good</div>
                  <div className="flex items-center gap-1 mb-2">
                    {[1, 2, 3, 4, 5].map((star) => (
                      <FaStar
                        key={star}
                        size={24}
                        className={star <= 4 ? "text-[#840032]" : "text-gray-300"}
                      />
                    ))}
                  </div>
                  <div className="text-gray-500 text-sm mb-4">
                    16,464 ratings and 1,620 reviews
                  </div>
                </div>

                <div className="w-1/2 lg:w-full pl-4">
                  {[5, 4, 3, 2, 1].map((rating) => (
                    <div key={rating} className="flex items-center gap-2 mb-2">
                      <span className="text-sm font-medium w-8">{rating}★</span>
                      <div className="flex-1 bg-gray-200 rounded-full h-2">
                        <div
                          className="bg-[#840032] h-2 rounded-full"
                          style={{
                            width: `${rating === 5
                              ? 65
                              : rating === 4
                                ? 22
                                : rating === 3
                                  ? 6
                                  : rating === 2
                                    ? 2
                                    : 5
                              }%`,
                          }}
                        ></div>
                      </div>
                      <span className="text-sm text-gray-600 w-16 text-right">
                        {rating === 5
                          ? "10,676"
                          : rating === 4
                            ? "3,549"
                            : rating === 3
                              ? "1,040"
                              : rating === 2
                                ? "365"
                                : "834"}
                      </span>
                    </div>
                  ))}
                </div>
              </div>

              <div className="w-full lg:w-[70%] lg:pl-36">
                <div className="space-y-6">
                  <div className="border-b border-gray-200 pb-4">
                    <div className="flex items-center gap-2 mb-2">
                      <div className="flex items-center gap-1">
                        {[1, 2, 3, 4, 5].map((star) => (
                          <FaStar key={star} size={16} className="text-[#840032]" />
                        ))}
                      </div>
                      <span className="font-bold text-[#840032]">
                        5.0 • Perfect product!
                      </span>
                    </div>
                    <div className="text-sm text-gray-600 mb-2">
                      by <span className="font-semibold">Riya Sharma</span> • 12 Aug 2025
                    </div>
                    <div className="text-gray-500 text-sm mb-2">
                      Review for: Color Gold, Black
                    </div>
                    <div className="text-black text-sm leading-relaxed">
                      Excellent product from flipkart , Amazing design mouse and size is very
                      comfortable , This working very smoothly on my laptop and golden colour
                      mouse is very amazing.......... Thankyou!
                    </div>
                  </div>

                  <div className="border-b border-gray-200 pb-4">
                    <div className="flex items-center gap-2 mb-2">
                      <div className="flex items-center gap-1">
                        {[1, 2, 3, 4, 5].map((star) => (
                          <FaStar key={star} size={16} className="text-[#840032]" />
                        ))}
                      </div>
                      <span className="font-bold text-[#840032]">
                        5.0 • Perfect product!
                      </span>
                    </div>
                    <div className="text-sm text-gray-600 mb-2">
                      by <span className="font-semibold">Amit Verma</span> • 10 Aug 2025
                    </div>
                    <div className="text-gray-500 text-sm mb-2">
                      Review for: Color Gold, Black
                    </div>
                    <div className="text-black text-sm leading-relaxed">
                      Excellent product from flipkart , Amazing design mouse and size is very
                      comfortable , This working very smoothly on my laptop and golden colour
                      mouse is very amazing.......... Thankyou!
                    </div>
                  </div>
                </div>

                <div className="text-right mt-4">
                  <button className="text-[#840032] font-medium underline">
                    SHOW MORE
                  </button>
                </div>
              </div>
            </div>
          </div>

          <div className="bg-[#f4f4f4]  p-6">
            <div className="font-bold text-[#840032] text-lg mb-4">Write a review!</div>
            <textarea
              className="w-full p-4 border border-gray-300 rounded-lg resize-none h-32 text-black"
              placeholder="Tell us what you feel about the artist!"
              ref={reviewInputRef}
            />
            <button className="w-[100px] mt-4 bg-[#840032] text-white font-bold uppercase py-3 rounded-lg mx-auto block">
              POST
            </button>
          </div>
        </div>



        {/*similar artist*/}
        <div className="hidden md:block bg-[#f4f4f4] px-6 md:px-24 py-6 md:py-12">
          <p className="font-semibold text-2xl text-[#840032] text-center md:text-left">
            Browse similar Makeup Artists
          </p>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6 mt-8">
            {vendor?.similarVendors?.map((item, index) => (
              <div
                key={index}
                className="bg-white rounded-2xl shadow-[4px_4px_10px_rgba(0,0,0,0.3)] border border-gray-100 p-4 flex flex-col"
                style={{ fontFamily: 'Montserrat' }}
                onClick={() => {
                  router.push(`/makeup-and-beauty/artists/${item?._id}`);
                }}
              >
                <div className="relative w-full pt-[100%] rounded-xl overflow-hidden bg-gray-200">
                  <img
                    src={item?.gallery?.coverPhoto}
                    className="absolute inset-0 w-full h-full object-cover"
                  />
                </div>

                <h3 className="mt-6 text-2xl font-medium text-black">
                  {item?.name}
                </h3>

                <div className="mt-3 flex items-center justify-between">
                  <div className="flex items-center gap-2 text-[#880E4F]">
                    <FaStar size={18} />
                    <span className="text-2xl text-black font-semibold">{item?.rating}</span>
                  </div>
                  <div className="flex items-center gap-2 text-[#2F6AA8]">
                    <FaMapMarkerAlt size={18} className="text-gray-500" />
                    {/* <span className="text-base text-gray-500 font-semibold">{item?.businessAddress?.locality}, {item?.businessAddress?.city}</span> */}
                    <span className="text-base text-gray-500 font-semibold">RT Nagar, Bangalore</span>
                  </div>
                </div>

                <div className="mt-2">
                  <p className="text-base text-black">Specialist In</p>
                  <ul className="list-disc pl-5 text-base text-black">
                    {(
                      (item?.speciality ? item.speciality.split(',') : [])
                    )
                      .slice(0, 2)
                      .map((svc, i) => (
                        <li key={i}>{(svc || '').toString().trim()}</li>
                      ))}
                  </ul>
                </div>

                <div className=" ml-auto flex items-baseline gap-2">
                  <div className="text-[#880E4F] font-bold text-3xl">
                    {toPriceString(item?.prices?.bridal || 0)}
                  </div>
                  <div className="text-xs font-semibold text-gray-500">onwards</div>
                </div>
              </div>
            ))}
          </div>
        </div>



        {/* Footer*/}
        <div
          className="w-full bg-[#243761] text-white py-6 md:py-8"
          style={{ fontFamily: 'Montserrat' }}
        >
          <div className="px-6 md:px-6 max-w-7xl mx-auto">
            <div className="text-white/90 text-sm md:text-base mb-4">
              Search by our recommended tags
            </div>
            <div className="flex flex-wrap gap-8 md:gap-12 text-sm md:text-base">
              {[
                { label: 'Bestsellers', value: 'bestsellers' },
                { label: 'Top rated', value: 'top-rated' },
                { label: 'Budget friendly', value: 'budget-friendly' },
                { label: 'Premium', value: 'premium' },
              ].map((tag) => (
                <button
                  key={tag.value}
                  className="underline underline-offset-2 decoration-white/90 hover:decoration-white"
                  onClick={() => router.push(`/makeup-and-beauty/artists?tag=${encodeURIComponent(tag.value)}`)}
                >
                  {tag.label}
                </button>
              ))}
            </div>
          </div>
        </div>
      </>
      );
}

      export default MakeupAndBeauty;
