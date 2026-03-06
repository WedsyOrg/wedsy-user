import { loadGoogleMaps } from "@/utils/loadGoogleMaps";
import { toPriceString } from "@/utils/text";
import { trimTitle, trimDescription, OG_IMAGES } from "@/utils/seo";
import { Label, Modal, TextInput } from "flowbite-react";
import Head from "next/head";
import Link from "next/link";
import { useRouter } from "next/router";
import { useEffect, useRef, useState } from "react";
import { BsShareFill } from "react-icons/bs";
import {
  FaArrowLeft,
  FaArrowRight,
  FaHeart,
  FaMapMarkerAlt,
  FaRegHeart,
  FaRegStar,
  FaStar
} from "react-icons/fa";
import { MdClear } from "react-icons/md";
import { RWebShare } from "react-web-share";
import Toast from "@/components/other/Toast";

function MakeupAndBeauty({ userLoggedIn, setOpenLoginModalv2, setSource }) {
  const router = useRouter();
  const { vendorId } = router.query;
  const share = typeof router?.query?.share === "string" ? router.query.share : "";
  const [loading, setLoading] = useState(false);
  const [personalPackages, setPersonalPackages] = useState([]);
  const [vendor, setVendor] = useState([]);
  const [similarVendors, setSimilarVendors] = useState([]);
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
  const [galleryExpanded, setGalleryExpanded] = useState(false);
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [viewBookingModal, setViewBookingModal] = useState(false);
  const [expandedAbout, setExpandedAbout] = useState(false);
  const scrollRef = useRef(null);
  const [scrollProgress, setScrollProgress] = useState(0);
  const reviewInputRef = useRef(null);
  const [shortUrl, setShortUrl] = useState("");
  const [showToast, setShowToast] = useState(false);
  const [toastMessage, setToastMessage] = useState("");
  const [heartAnimating, setHeartAnimating] = useState(false);

  const [reviewsLoading, setReviewsLoading] = useState(false);
  const [reviews, setReviews] = useState([]);
  const [reviewStats, setReviewStats] = useState({
    total: 0,
    avgRating: 0,
    distribution: { 1: 0, 2: 0, 3: 0, 4: 0, 5: 0 },
  });
  const [showAllReviews, setShowAllReviews] = useState(false);
  const [reviewForm, setReviewForm] = useState({
    rating: 5,
    category: "Makeup",
    text: "",
    customerName: "",
    customerPhone: "",
  });
  const [reviewSubmitting, setReviewSubmitting] = useState(false);

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

  const fetchReviews = async () => {
    if (!vendorId) return;
    setReviewsLoading(true);
    try {
      const listRes = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/vendor-review/public?vendorId=${vendorId}&limit=20&page=1`
      );
      const listJson = await listRes.json().catch(() => null);
      setReviews(Array.isArray(listJson?.list) ? listJson.list : []);

      const statsRes = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/vendor-review/public/stats?vendorId=${vendorId}`
      );
      const statsJson = await statsRes.json().catch(() => null);
      if (statsJson?.stats) setReviewStats(statsJson.stats);
      else
        setReviewStats({
          total: 0,
          avgRating: 0,
          distribution: { 1: 0, 2: 0, 3: 0, 4: 0, 5: 0 },
        });
    } catch (e) {
      setReviews([]);
      setReviewStats({
        total: 0,
        avgRating: 0,
        distribution: { 1: 0, 2: 0, 3: 0, 4: 0, 5: 0 },
      });
    } finally {
      setReviewsLoading(false);
    }
  };

  useEffect(() => {
    fetchReviews();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [vendorId]);

  const submitReview = async () => {
    const text = String(reviewForm.text || "").trim();
    if (!vendorId) return;
    if (!text) return alert("Please write a review.");

    setReviewSubmitting(true);
    try {
      // Share-link flow (guest allowed)
      if (share) {
        const resp = await fetch(
          `${process.env.NEXT_PUBLIC_API_URL}/vendor-review/public?share=${encodeURIComponent(
            share
          )}`,
          {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
              review: text,
              rating: reviewForm.rating,
              category: reviewForm.category || "Makeup",
              customerName: reviewForm.customerName,
              customerPhone: reviewForm.customerPhone,
              images: [],
            }),
          }
        );
        const data = await resp.json().catch(() => null);
        if (!resp.ok || data?.message !== "success") {
          alert(data?.message || "Failed to submit review.");
          return;
        }
        alert("Review submitted!");
        setReviewForm((p) => ({ ...p, text: "" }));
        fetchReviews();
        return;
      }

      // Normal flow: must be logged in
      if (!userLoggedIn) {
        setSource(`Review for [${vendor?.name || "Makeup Artist"}]`);
        setOpenLoginModalv2(true);
        return;
      }

      const resp = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/vendor-review`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          authorization: `Bearer ${localStorage.getItem("token")}`,
        },
        body: JSON.stringify({
          vendorId,
          review: text,
          rating: reviewForm.rating,
          category: reviewForm.category || "Makeup",
          images: [],
        }),
      });
      const data = await resp.json().catch(() => null);
      if (!resp.ok || data?.message !== "success") {
        alert(data?.message || "Failed to submit review.");
        return;
      }
      alert("Review submitted!");
      setReviewForm((p) => ({ ...p, text: "" }));
      fetchReviews();
    } catch (e) {
      alert("Failed to submit review.");
    } finally {
      setReviewSubmitting(false);
    }
  };


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

  // Keyboard navigation for gallery modal
  useEffect(() => {
    if (galleryViewAll && vendor?.gallery?.photos) {
      const handleKeyPress = (e) => {
        if (e.key === 'ArrowLeft') {
          setCurrentImageIndex((prev) => 
            prev === 0 ? vendor.gallery.photos.length - 1 : prev - 1
          );
        } else if (e.key === 'ArrowRight') {
          setCurrentImageIndex((prev) => 
            prev === vendor.gallery.photos.length - 1 ? 0 : prev + 1
          );
        } else if (e.key === 'Escape') {
          setGalleryViewAll(false);
        }
      };
      window.addEventListener('keydown', handleKeyPress);
      return () => window.removeEventListener('keydown', handleKeyPress);
    }
  }, [galleryViewAll, vendor?.gallery?.photos]);

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
    setHeartAnimating(true);
    setTimeout(() => setHeartAnimating(false), 600);
    
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
          setToastMessage("Added to Favourites");
          setShowToast(true);
        }
      })
      .catch((error) => {
        console.error("There was a problem with the fetch operation:", error);
      });
  };
  const RemoveFromWishList = () => {
    setHeartAnimating(true);
    setTimeout(() => setHeartAnimating(false), 600);
    
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
          setToastMessage("Removed from Favourites");
          setShowToast(true);
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
          // Fetch similar vendors after vendor is loaded
          fetchSimilarVendors(response);
        } else {
          router.push("/makeup-and-beauty/artists");
        }
      })
      .catch((error) => {
        console.error("There was a problem with the fetch operation:", error);
      });
  };

  const fetchSimilarVendors = (currentVendor) => {
    if (!currentVendor) return;
    
    const queryParams = new URLSearchParams();
    queryParams.append('applyFilters', 'true');
    queryParams.append('page', '1');
    queryParams.append('limit', '10');
    
    // Filter by same speciality if available
    if (currentVendor?.speciality) {
      const specialityArray = Array.isArray(currentVendor.speciality) 
        ? currentVendor.speciality 
        : String(currentVendor.speciality).split(',').map(s => s.trim());
      if (specialityArray.length > 0) {
        queryParams.append('speciality', specialityArray.join(','));
      }
    }
    
    // Filter by same locality if available
    if (currentVendor?.businessAddress?.locality) {
      queryParams.append('locality', currentVendor.businessAddress.locality);
    }

    const apiUrl = `${process.env.NEXT_PUBLIC_API_URL}/vendor?${queryParams.toString()}`;

    fetch(apiUrl, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        authorization: `Bearer ${localStorage.getItem("token")}`,
      },
    })
      .then((response) => response.json())
      .then((response) => {
        // Handle different response structures (same as index.js)
        let vendorsData = [];
        
        if (Array.isArray(response)) {
          vendorsData = response;
        } else if (response && response.data && Array.isArray(response.data)) {
          vendorsData = response.data;
        } else if (response && response.vendors && Array.isArray(response.vendors)) {
          vendorsData = response.vendors;
        } else if (response && response.results && Array.isArray(response.results)) {
          vendorsData = response.results;
        } else if (response && response.items && Array.isArray(response.items)) {
          vendorsData = response.items;
        } else if (response && response.list && Array.isArray(response.list)) {
          vendorsData = response.list;
        }
        
        // Filter out current vendor and apply profileVisible filter
        const filtered = vendorsData
          .filter((item) => item?._id !== vendorId) // Exclude current vendor
          .filter((item) => item?.profileVisible === true); // Only show visible profiles
        
        setSimilarVendors(filtered);
      })
      .catch((error) => {
        console.error("Error fetching similar vendors:", error);
        setSimilarVendors([]);
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


  // Generate LocalBusiness Schema
  const localBusinessSchema = {
    "@context": "https://schema.org",
    "@type": "LocalBusiness",
    "name": vendor?.name || "Makeup Artist",
    "description": vendor?.about || `${vendor?.name} - ${vendor?.speciality || "Professional Makeup Artist"} in ${vendor?.businessAddress?.city || "Bangalore"}`,
    "image": vendor?.gallery?.coverPhoto ? [vendor.gallery.coverPhoto] : [],
    "address": {
      "@type": "PostalAddress",
      "addressLocality": vendor?.businessAddress?.city || "Bangalore",
      "addressRegion": vendor?.businessAddress?.state || "Karnataka",
      "addressCountry": "IN",
      "postalCode": vendor?.businessAddress?.postalCode || ""
    },
    "aggregateRating": vendor?.rating != null ? {
      "@type": "AggregateRating",
      "ratingValue": Number(vendor.rating).toFixed(1),
      "reviewCount": String(vendor.reviewCount ?? 0),
      "bestRating": "5"
    } : undefined,
    "priceRange": vendor?.priceRange || "₹₹",
    "telephone": vendor?.phone || "",
    "url": `https://www.wedsy.in/makeup-and-beauty/artists/${vendorId}`
  };

  // Remove undefined fields
  if (!localBusinessSchema.aggregateRating) {
    delete localBusinessSchema.aggregateRating;
  }

  // Person schema for artist (A7 – richer snippets)
  const personSchema = {
    "@context": "https://schema.org",
    "@type": "Person",
    "name": vendor?.name || "Makeup Artist",
    "description": vendor?.about || `${vendor?.speciality || "Professional Makeup Artist"} in ${vendor?.businessAddress?.city || "Bangalore"}`,
    "image": vendor?.gallery?.coverPhoto ? [vendor.gallery.coverPhoto] : [],
    "url": `https://www.wedsy.in/makeup-and-beauty/artists/${vendorId}`
  };

  // Generate Breadcrumb Schema
  const breadcrumbSchema = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    "itemListElement": [
      {
        "@type": "ListItem",
        "position": 1,
        "name": "Home",
        "item": "https://www.wedsy.in"
      },
      {
        "@type": "ListItem",
        "position": 2,
        "name": "Makeup & Beauty",
        "item": "https://www.wedsy.in/makeup-and-beauty"
      },
      {
        "@type": "ListItem",
        "position": 3,
        "name": "Artists",
        "item": "https://www.wedsy.in/makeup-and-beauty/artists"
      },
      {
        "@type": "ListItem",
        "position": 4,
        "name": vendor?.name || "Artist",
        "item": `https://www.wedsy.in/makeup-and-beauty/artists/${vendorId}`
      }
    ]
  };

  const pageTitle = vendor?.name ? `${vendor.name} | ${vendor.speciality || "Makeup Artist"} in ${vendor.businessAddress?.city || "Bangalore"} | Wedsy` : "Makeup Artist | Wedsy";
  const pageDescription = vendor?.about || `${vendor?.name || "Professional Makeup Artist"} - ${vendor?.speciality || "Makeup Artist"} in ${vendor?.businessAddress?.city || "Bangalore"}. ${vendor?.rating ? `Rated ${vendor.rating}/5. ` : ""}Book now for your special day.`;
  const pageKeywords = `${vendor?.name || ""}, ${vendor?.speciality || "makeup artist"}, makeup artist ${vendor?.businessAddress?.city || "bangalore"}, bridal makeup, wedding makeup, makeup artist near me`.trim();
  const ogImage = vendor?.gallery?.coverPhoto || OG_IMAGES.makeup;
  const coverPhoto = vendor?.gallery?.coverPhoto || "/assets/images/makeup-artist-cover.webp";

  return (
    <>
      <Head>
        <title>{trimTitle(pageTitle)}</title>
        <meta name="description" content={trimDescription(pageDescription)} />
        <meta name="keywords" content={pageKeywords} />
        <meta name="robots" content="index, follow" />
        <link rel="canonical" href={`https://www.wedsy.in/makeup-and-beauty/artists/${vendorId}`} />
        
        {/* Open Graph Tags */}
        <meta property="og:title" content={pageTitle} />
        <meta property="og:description" content={pageDescription} />
        <meta property="og:image" content={ogImage} />
        <meta property="og:url" content={`https://www.wedsy.in/makeup-and-beauty/artists/${vendorId}`} />
        <meta property="og:type" content="profile" />
        <meta property="og:site_name" content="Wedsy" />
        
        {/* Twitter Card Tags */}
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:title" content={pageTitle} />
        <meta name="twitter:description" content={pageDescription} />
        <meta name="twitter:image" content={ogImage} />
        
        {/* Structured Data */}
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(localBusinessSchema) }}
        />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbSchema) }}
        />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(personSchema) }}
        />
      </Head>
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
            <img src="/assets/icons/icon-message.webp" className="h-5 w-5 md:h-6 md:w-6" />
            <span className="font-semibold text-sm md:text-base">CHAT</span>
          </div>
          <div
            className="flex flex-row items-center gap-2 md:gap-3 px-4 md:px-8 lg:px-12 cursor-pointer flex-1 justify-center min-w-0"
            onClick={() => {
              document
                .getElementById("gallery")
                ?.scrollIntoView({ behavior: "smooth", block: "start" });
            }}
          >
            <img src="/assets/icons/icon-image.webp" className="h-5 w-5 md:h-6 md:w-6" />
            <span className="font-semibold text-sm md:text-base">100 PHOTOS</span>
          </div>
          <div
            className="flex flex-row items-center gap-2 md:gap-3 px-4 md:px-8 lg:px-12 cursor-pointer flex-1 justify-center min-w-0"
            onClick={() => {
              document
                .getElementById("about")
                ?.scrollIntoView({ behavior: "smooth", block: "start" });
            }}
          >
            <img src="/assets/icons/icon-info.webp" className="h-5 w-5 md:h-6 md:w-6" />
            <span className="font-semibold text-sm md:text-base">ABOUT</span>
          </div>
          <div
            className="flex flex-row items-center gap-2 md:gap-3 px-4 md:px-8 lg:px-12 cursor-pointer flex-1 justify-center min-w-0"
            onClick={() => {
              document
                .getElementById("reviews")
                ?.scrollIntoView({ behavior: "smooth", block: "start" });
            }}
          >
            <img src="/assets/icons/icon-review.webp" className="h-5 w-5 md:h-6 md:w-6" />
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
            <img src="/assets/icons/icon-call.webp" className="h-5 w-5 md:h-6 md:w-6" />
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
              <img
                src={coverPhoto}
                className="w-full h-full object-cover"
                alt={vendor?.name ? `${vendor.name} cover` : "Makeup artist cover"}
                onError={(e) => {
                  // Fallback if remote image fails to load
                  e.currentTarget.src = "/assets/images/makeup-artist-cover.webp";
                }}
              />
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
                  className={`text-[#840032] cursor-pointer transition-all duration-300 ease-out hover:scale-110 active:scale-95 ${
                    heartAnimating ? "animate-heartBeat scale-125" : ""
                  }`}
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
                  className={`text-[#840032] cursor-pointer transition-all duration-300 ease-out hover:scale-110 hover:text-[#840032]/80 active:scale-95 ${
                    heartAnimating ? "animate-heartBeat scale-125" : ""
                  }`}
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
              {!!vendor?.tag && (
                <div className="bg-[#EF2471] text-white uppercase w-[180px] h-[35px] rounded-none flex items-center justify-center font-bold">
                  {vendor?.tag}
                </div>
              )}
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
          {!!vendor?.tag && (
            <div className="absolute top-8 left-0 px-4 py-1 bg-[#EF2471] text-white uppercase">
              {vendor?.tag}
            </div>
          )}
          <div className="absolute top-8 right-8">
            {isAddedToWishlist ? (
              <FaHeart
                size={32}
                className={`text-[#840032] cursor-pointer transition-all duration-300 ease-out hover:scale-110 active:scale-95 ${
                  heartAnimating ? "animate-[heartBeat_0.6s_ease-in-out] scale-125" : ""
                }`}
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
                className={`text-[#840032] cursor-pointer transition-all duration-300 ease-out hover:scale-110 hover:text-[#840032]/80 active:scale-95 ${
                  heartAnimating ? "animate-[heartBeat_0.6s_ease-in-out] scale-125" : ""
                }`}
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
                src="/assets/icons/icon-image.webp"
                className="h-6 w-6"
                onClick={() => {
                  router.push("#gallery");
                }}
              />
            </div>

            <div className="bg-white p-2 rounded-lg">
              <img
                src="/assets/icons/icon-review.webp"
                className="h-6 w-6"
                onClick={() => {
                  document
                    .getElementById("reviews")
                    ?.scrollIntoView({ behavior: "smooth", block: "start" });
                }}
              />
            </div>
            <div className="bg-white p-2 rounded-lg">
              <img
                src="/assets/icons/icon-info.webp"
                className="h-6 w-6"
                onClick={() => {
                  router.push("#about");
                }}
              />
            </div>
          </div>
          <img
            src={coverPhoto}
            className="-mt-4 w-full h-auto object-cover"
            alt={vendor?.name ? `${vendor.name} cover` : "Makeup artist cover"}
            onError={(e) => {
              e.currentTarget.src = "/assets/images/makeup-artist-cover.webp";
            }}
          />
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
              <img src="/assets/icons/icon-message-2.webp" className="h-6 w-6" />
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
              <img src="/assets/icons/icon-call-3.webp" className="h-6 w-6" />
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
              const isSelected = selectedPackages?.find((i) => i._id === pkg?._id)?.quantity > 0;
              const quantity = isSelected ? selectedPackages?.find((i) => i._id === pkg?._id)?.quantity : 0;
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
        ].filter(Boolean).map((pkg, index) => {
          const colorSet = colors[index] || colors[0];
          const originalPrice = pkg?.price || 0;
          const discountedPrice = originalPrice * personalPackageTaxMultiply;
          const selected = selectedPackages?.find((i) => i._id === pkg?._id);
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
        {/* Gallery Section - Only show if images exist */}
        {vendor?.gallery?.photos && vendor.gallery.photos.length > 0 && (
          <>
            <style dangerouslySetInnerHTML={{__html: `
              .scrollbar-hide {
                -ms-overflow-style: none;
                scrollbar-width: none;
              }
              .scrollbar-hide::-webkit-scrollbar {
                display: none;
              }
            `}} />
            <div className="bg-[#f4f4f4] mt-8 uppercase px-6 md:px-24 py-8 md:py-16 text-2xl md:text-3xl font-semibold md:mt-0 md:mb-0 text-center">
          {"Gallery"}
        </div>
            
            {(() => {
              const photos = vendor.gallery.photos;
              const totalPhotos = photos.length;
              const hasMoreThanFive = totalPhotos > 5;

              // For 1-4 images: Use a clean horizontal row layout
              if (totalPhotos <= 4) {
                return (
                  <div className="bg-[#f4f4f4] pb-12 px-6 md:px-28">
                    {/* Mobile: Horizontal scrollable row */}
                    <div className="flex md:hidden gap-3 overflow-x-auto pb-2 scrollbar-hide snap-x snap-mandatory">
                      {photos.map((photo, index) => (
                        <div
                          key={index}
                          className="relative flex-shrink-0 w-[85vw] aspect-square rounded-xl overflow-hidden cursor-pointer group shadow-lg snap-center"
                          onClick={() => {
                            setCurrentImageIndex(index);
                            setGalleryViewAll(true);
                          }}
                        >
                          <img
                            src={photo}
                            alt={`Gallery image ${index + 1}`}
                            className="absolute top-0 left-0 h-full w-full object-cover group-hover:scale-110 transition-transform duration-300"
                            onError={(e) => {
                              e.target.src = '/assets/images/placeholder.jpg';
                            }}
                          />
                          <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-20 transition-opacity duration-300"></div>
                        </div>
                      ))}
                    </div>
                    {/* Desktop: Grid layout */}
                    <div className={`hidden md:grid gap-3 md:gap-4 ${
                      totalPhotos === 1 
                        ? 'grid-cols-1 max-w-4xl mx-auto' 
                        : totalPhotos === 2
                        ? 'grid-cols-2 max-w-5xl mx-auto'
                        : totalPhotos === 3
                        ? 'grid-cols-3 max-w-6xl mx-auto'
                        : 'grid-cols-4 max-w-7xl mx-auto'
                    }`}>
                      {photos.map((photo, index) => (
                        <div
                          key={index}
                          className="relative aspect-square rounded-xl overflow-hidden cursor-pointer group shadow-lg hover:shadow-xl transition-all duration-300"
                          onClick={() => {
                            setCurrentImageIndex(index);
                            setGalleryViewAll(true);
                          }}
                        >
                          <img
                            src={photo}
                            alt={`Gallery image ${index + 1}`}
                            className="absolute top-0 left-0 h-full w-full object-cover group-hover:scale-110 transition-transform duration-300"
                            onError={(e) => {
                              e.target.src = '/assets/images/placeholder.jpg';
                            }}
                          />
                          <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-20 transition-opacity duration-300"></div>
                        </div>
                      ))}
                    </div>
                  </div>
                );
              }

              // For 5+ images: Show preview or expanded grid
              if (galleryExpanded) {
                // Expanded view: Horizontal scroll on mobile, grid on desktop
                return (
                  <div className="bg-[#f4f4f4] pb-12 px-6 md:px-28">
                    {/* Mobile: Horizontal scrollable row */}
                    <div className="flex md:hidden gap-3 overflow-x-auto pb-2 scrollbar-hide snap-x snap-mandatory">
                      {photos.map((photo, index) => (
                        <div
                          key={index}
                          className="relative flex-shrink-0 w-[85vw] aspect-square rounded-xl overflow-hidden cursor-pointer group shadow-lg snap-center"
                          onClick={() => {
                            setCurrentImageIndex(index);
                            setGalleryViewAll(true);
                          }}
                        >
                          <img
                            src={photo}
                            alt={`Gallery image ${index + 1}`}
                            className="absolute top-0 left-0 h-full w-full object-cover group-hover:scale-110 transition-transform duration-300"
                            onError={(e) => {
                              e.target.src = '/assets/images/placeholder.jpg';
                            }}
                          />
                          <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-20 transition-opacity duration-300"></div>
                        </div>
                      ))}
                    </div>
                    {/* Desktop: Grid layout */}
                    <div className="hidden md:grid grid-cols-5 gap-2 md:gap-3">
                      {photos.map((photo, index) => (
                        <div
                          key={index}
                          className="relative aspect-square rounded-xl overflow-hidden cursor-pointer group shadow-lg hover:shadow-xl transition-all duration-300"
                          onClick={() => {
                            setCurrentImageIndex(index);
                            setGalleryViewAll(true);
                          }}
                        >
                          <img
                            src={photo}
                            alt={`Gallery image ${index + 1}`}
                            className="absolute top-0 left-0 h-full w-full object-cover group-hover:scale-110 transition-transform duration-300"
                            onError={(e) => {
                              e.target.src = '/assets/images/placeholder.jpg';
                            }}
                          />
                          <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-20 transition-opacity duration-300"></div>
                        </div>
                      ))}
                    </div>
                    
                    {/* Collapse button */}
                    <div className="flex justify-center mt-6">
                      <button
                        onClick={() => setGalleryExpanded(false)}
                        className="bg-[#840032] text-white rounded-lg px-8 py-2 hover:bg-[#6b0028] transition-colors font-semibold"
                      >
                        VIEW LESS
                      </button>
                    </div>
                  </div>
                );
              }

              // Preview view: Zomato-style layout (first 4 + View More)
              return (
                <>
                  {/* Mobile: Horizontal scrollable row */}
                  <div className="flex md:hidden bg-[#f4f4f4] gap-3 overflow-x-auto pb-12 px-6 scrollbar-hide snap-x snap-mandatory">
                    {photos.slice(0, hasMoreThanFive ? 4 : 5).map((photo, index) => (
                      <div
                        key={index}
                        className="relative flex-shrink-0 w-[85vw] aspect-square rounded-xl overflow-hidden cursor-pointer group shadow-lg snap-center"
                        onClick={() => {
                          setCurrentImageIndex(index);
                          setGalleryViewAll(true);
                        }}
                      >
                        <img
                          src={photo}
                          alt={`Gallery image ${index + 1}`}
                          className="absolute top-0 left-0 h-full w-full object-cover group-hover:scale-110 transition-transform duration-300"
                          onError={(e) => {
                            e.target.style.display = 'none';
                          }}
                        />
                        <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-20 transition-opacity duration-300"></div>
                      </div>
                    ))}
                    {hasMoreThanFive && (
                      <div
                        className="relative flex-shrink-0 w-[85vw] aspect-square rounded-xl bg-[#333] flex flex-col items-center justify-center text-white hover:bg-[#444] transition cursor-pointer snap-center"
                        onClick={() => setGalleryExpanded(true)}
                      >
                        <div className="text-sm font-semibold tracking-wider mb-3">
                          VIEW MORE
                        </div>
                        <div className="w-8 h-8 border-2 border-white rounded-full flex items-center justify-center">
                          <span className="text-lg">›</span>
                        </div>
                        <div className="text-xs mt-2 opacity-80">
                          +{totalPhotos - 4} more
                        </div>
                      </div>
                    )}
                  </div>
                  {/* Desktop: Zomato-style grid */}
                  <div className="hidden md:grid bg-[#f4f4f4] grid-cols-5 md:grid-rows-2 pb-12 gap-2 md:px-28">
                  {/* S1 - Large image (first photo) */}
                  <div 
                    className="bg-gray-300 aspect-square rounded-xl md:row-span-2 md:col-span-2 relative overflow-hidden cursor-pointer group"
                    onClick={() => {
                      setCurrentImageIndex(0);
                      setGalleryViewAll(true);
                    }}
                  >
                    <img
                      src={photos[0]}
                      alt={`Gallery image 1`}
                      className="absolute top-0 left-0 h-full w-full object-cover group-hover:scale-105 transition-transform duration-300"
                      onError={(e) => {
                        e.target.style.display = 'none';
                      }}
                    />
                  </div>

                  {/* S2 - Second photo */}
                  <div 
                    className="bg-gray-300 aspect-square rounded-xl relative overflow-hidden cursor-pointer group"
                    onClick={() => {
                      setCurrentImageIndex(1);
                      setGalleryViewAll(true);
                    }}
                  >
                    <img
                      src={photos[1]}
                      alt={`Gallery image 2`}
                      className="absolute top-0 left-0 h-full w-full object-cover group-hover:scale-105 transition-transform duration-300"
                      onError={(e) => {
                        e.target.style.display = 'none';
                      }}
                    />
                  </div>

                  {/* S3 - Third photo (rectangular) */}
                  <div 
                    className="bg-gray-300 aspect-square rounded-xl md:col-span-2 md:aspect-auto relative overflow-hidden cursor-pointer group"
                    onClick={() => {
                      setCurrentImageIndex(2);
                      setGalleryViewAll(true);
                    }}
                  >
                    <img
                      src={photos[2]}
                      alt={`Gallery image 3`}
                      className="absolute top-0 left-0 h-full w-full object-cover group-hover:scale-105 transition-transform duration-300"
                      onError={(e) => {
                        e.target.style.display = 'none';
                      }}
                    />
                  </div>

                  {/* S4 - Fourth photo */}
                  <div 
                    className="bg-gray-300 aspect-square rounded-xl relative overflow-hidden cursor-pointer group"
                    onClick={() => {
                      setCurrentImageIndex(3);
                      setGalleryViewAll(true);
                    }}
                  >
                    <img
                      src={photos[3]}
                      alt={`Gallery image 4`}
                      className="absolute top-0 left-0 h-full w-full object-cover group-hover:scale-105 transition-transform duration-300"
                      onError={(e) => {
                        e.target.style.display = 'none';
                      }}
                    />
                  </div>

                  {/* S5 - Fifth photo OR "View More" overlay */}
                  {hasMoreThanFive ? (
                    <div
                      className="bg-[#333] aspect-square rounded-xl flex flex-col items-center justify-center text-white hover:bg-[#444] transition cursor-pointer"
                      onClick={() => setGalleryExpanded(true)}
          >
            <div className="text-sm font-semibold tracking-wider mb-3">
              VIEW MORE
            </div>
            <div className="w-8 h-8 border-2 border-white rounded-full flex items-center justify-center">
              <span className="text-lg">›</span>
            </div>
                      <div className="text-xs mt-2 opacity-80">
                        +{totalPhotos - 4} more
                      </div>
                    </div>
                  ) : (
                    <div 
                      className="bg-gray-300 aspect-square rounded-xl relative overflow-hidden cursor-pointer group"
                      onClick={() => {
                        setCurrentImageIndex(4);
                        setGalleryViewAll(true);
                      }}
                    >
                      <img
                        src={photos[4]}
                        alt={`Gallery image 5`}
                        className="absolute top-0 left-0 h-full w-full object-cover group-hover:scale-105 transition-transform duration-300"
                        onError={(e) => {
                          e.target.style.display = 'none';
                        }}
                      />
                    </div>
                  )}
                  </div>
                </>
              );
            })()}

            {/* Zomato-style Gallery Modal (Lightbox) */}
            <Modal 
              show={galleryViewAll} 
              onClose={() => setGalleryViewAll(false)}
              size="7xl"
              className="gallery-modal"
            >
              <style dangerouslySetInnerHTML={{__html: `
                .gallery-modal [data-modal-backdrop] {
                  backdrop-filter: blur(12px) !important;
                  -webkit-backdrop-filter: blur(12px) !important;
                  background-color: rgba(0, 0, 0, 0.75) !important;
                }
              `}} />
              <Modal.Body className="relative bg-black/80 backdrop-blur-2xl p-0 overflow-hidden">
                {/* Close button */}
                <button
                  onClick={() => setGalleryViewAll(false)}
                  className="absolute top-4 right-4 z-50 text-white hover:text-gray-300 transition-colors"
                  style={{ fontSize: '24px', lineHeight: '1' }}
                >
                  <MdClear size={32} />
                </button>

                {/* Gallery title */}
                <div className="absolute top-4 left-4 z-50 text-white text-xl font-semibold uppercase">
                  Gallery
        </div>
        
                {/* Main image container */}
                {vendor?.gallery?.photos && vendor.gallery.photos.length > 0 && (
                  <div className="relative w-full" style={{ minHeight: '70vh' }}>
                    <img
                      src={vendor.gallery.photos[currentImageIndex]}
                      alt={`Gallery image ${currentImageIndex + 1}`}
                      className="w-full h-auto object-contain"
                      style={{ maxHeight: '80vh' }}
                      onError={(e) => {
                        e.target.src = '/assets/images/placeholder.jpg';
                      }}
                    />

                    {/* Image counter */}
                    <div className="absolute bottom-4 right-4 bg-black bg-opacity-50 text-white px-4 py-2 rounded text-sm">
                      {currentImageIndex + 1} of {vendor.gallery.photos.length}
                    </div>

                    {/* Navigation arrows */}
                    {vendor.gallery.photos.length > 1 && (
                      <>
                        {/* Left arrow */}
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            setCurrentImageIndex((prev) => 
                              prev === 0 ? vendor.gallery.photos.length - 1 : prev - 1
                            );
                          }}
                          className="absolute left-4 top-1/2 transform -translate-y-1/2 bg-black bg-opacity-50 hover:bg-opacity-70 text-white p-3 rounded-full transition-all z-50"
                          aria-label="Previous image"
                        >
                          <FaArrowLeft size={20} />
                        </button>

                        {/* Right arrow */}
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            setCurrentImageIndex((prev) => 
                              prev === vendor.gallery.photos.length - 1 ? 0 : prev + 1
                            );
                          }}
                          className="absolute right-4 top-1/2 transform -translate-y-1/2 bg-black bg-opacity-50 hover:bg-opacity-70 text-white p-3 rounded-full transition-all z-50"
                          aria-label="Next image"
                        >
                          <FaArrowRight size={20} />
                        </button>
                      </>
                    )}
                  </div>
                )}

                {/* Thumbnail strip */}
                {vendor?.gallery?.photos && vendor.gallery.photos.length > 1 && (
                  <div className="bg-gray-900 px-4 py-3 overflow-x-auto">
                    <div className="flex gap-2 justify-center">
                      {vendor.gallery.photos.map((photo, index) => (
                        <button
                          key={index}
                          onClick={() => setCurrentImageIndex(index)}
                          className={`flex-shrink-0 w-20 h-20 rounded overflow-hidden border-2 transition-all ${
                            index === currentImageIndex 
                              ? 'border-white scale-110' 
                              : 'border-transparent opacity-60 hover:opacity-100'
                          }`}
                        >
                          <img
                            src={photo}
                            alt={`Thumbnail ${index + 1}`}
                            className="w-full h-full object-cover"
                            onError={(e) => {
                              e.target.src = '/assets/images/placeholder.jpg';
                            }}
                          />
                        </button>
                      ))}
                    </div>
                  </div>
                )}
              </Modal.Body>
            </Modal>
          </>
        )}
        



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
                  <div className="text-gray-500 text-sm mb-2 font-semibold">
                    {reviewStats.avgRating >= 4.5
                      ? "Excellent"
                      : reviewStats.avgRating >= 3.5
                      ? "Very Good"
                      : reviewStats.avgRating >= 2.5
                      ? "Good"
                      : reviewStats.avgRating > 0
                      ? "Average"
                      : "No ratings yet"}
                  </div>
                  <div className="flex items-center gap-1 mb-2">
                    {[1, 2, 3, 4, 5].map((star) => (
                      <FaStar
                        key={star}
                        size={24}
                        className={
                          star <= Math.round(reviewStats.avgRating || 0)
                            ? "text-[#840032]"
                            : "text-gray-300"
                        }
                      />
                    ))}
                  </div>
                  <div className="text-gray-500 text-sm mb-4">
                    {reviewStats.total} reviews
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
                            width: `${
                              reviewStats.total > 0
                                ? Math.round(
                                    ((reviewStats.distribution?.[rating] || 0) /
                                      reviewStats.total) *
                                      100
                                  )
                                : 0
                            }%`,
                          }}
                        ></div>
                      </div>
                      <span className="text-sm text-gray-600 w-16 text-right">
                        {reviewStats.distribution?.[rating] || 0}
                      </span>
                    </div>
                  ))}
                </div>
              </div>

              <div className="w-full lg:w-[70%] lg:pl-36">
                <div className="space-y-6">
                  {reviewsLoading ? (
                    <div className="text-sm text-gray-500">Loading reviews…</div>
                  ) : (showAllReviews ? reviews : reviews.slice(0, 3)).length > 0 ? (
                    (showAllReviews ? reviews : reviews.slice(0, 3)).map((r, idx) => {
                      const name =
                        r?.customer?.name ||
                        r?.user?.name ||
                        "Customer";
                      const dateStr = r?.createdAt
                        ? new Date(r.createdAt).toLocaleDateString()
                        : "";
                      return (
                        <div key={r?._id || idx} className="border-b border-gray-200 pb-4">
                          <div className="flex items-center gap-2 mb-2">
                            <div className="flex items-center gap-1">
                              {[1, 2, 3, 4, 5].map((star) => (
                                <FaStar
                                  key={star}
                                  size={16}
                                  className={
                                    star <= (r?.rating || 0)
                                      ? "text-[#840032]"
                                      : "text-gray-300"
                                  }
                                />
                              ))}
                            </div>
                            <span className="font-bold text-[#840032]">
                              {(r?.rating || 0).toFixed ? r.rating.toFixed(1) : r?.rating} •{" "}
                              {r?.category || "Review"}
                            </span>
                          </div>
                          <div className="text-sm text-gray-600 mb-2">
                            by <span className="font-semibold">{name}</span>
                            {dateStr ? ` • ${dateStr}` : ""}
                          </div>
                          <div className="text-black text-sm leading-relaxed">
                            {r?.review}
                          </div>
                        </div>
                      );
                    })
                  ) : (
                    <div className="text-sm text-gray-500">No reviews yet.</div>
                  )}
                </div>

                <div className="text-right mt-4">
                  {reviews.length > 3 && (
                    <button
                      className="text-[#840032] font-medium underline"
                      onClick={() => setShowAllReviews((v) => !v)}
                      type="button"
                    >
                      {showAllReviews ? "SHOW LESS" : "SHOW MORE"}
                    </button>
                  )}
                </div>
              </div>
            </div>
          </div>

          <div className="bg-[#f4f4f4]  p-6">
            <div className="font-bold text-[#840032] text-lg mb-4">Write a review!</div>
            <div className="flex items-center gap-2 mb-3">
              {[1, 2, 3, 4, 5].map((star) => (
                <button
                  key={star}
                  type="button"
                  className="p-0 m-0 bg-transparent border-none"
                  onClick={() => setReviewForm((p) => ({ ...p, rating: star }))}
                  aria-label={`Rate ${star}`}
                >
                  <FaStar
                    size={20}
                    className={star <= reviewForm.rating ? "text-[#840032]" : "text-gray-300"}
                  />
                </button>
              ))}
              <span className="text-sm text-gray-600 ml-2">{reviewForm.rating}/5</span>
            </div>

            {share && !userLoggedIn && (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3 mb-3">
                <input
                  className="w-full p-3 border border-gray-300 rounded-lg text-black"
                  placeholder="Your name (optional)"
                  value={reviewForm.customerName}
                  onChange={(e) => setReviewForm((p) => ({ ...p, customerName: e.target.value }))}
                />
                <input
                  className="w-full p-3 border border-gray-300 rounded-lg text-black"
                  placeholder="Phone (optional)"
                  value={reviewForm.customerPhone}
                  onChange={(e) => setReviewForm((p) => ({ ...p, customerPhone: e.target.value }))}
                />
              </div>
            )}

            <textarea
              className="w-full p-4 border border-gray-300 rounded-lg resize-none h-32 text-black"
              placeholder="Tell us what you feel about the artist!"
              ref={reviewInputRef}
              value={reviewForm.text}
              onChange={(e) => setReviewForm((p) => ({ ...p, text: e.target.value }))}
            />
            <button
              type="button"
              onClick={() => submitReview()}
              disabled={reviewSubmitting}
              className="w-[120px] mt-4 bg-[#840032] disabled:bg-[#840032]/50 text-white font-bold uppercase py-3 rounded-lg mx-auto block"
            >
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
            {(Array.isArray(similarVendors) ? similarVendors : [])
              .map((item, index) => {
              const href = `/makeup-and-beauty/artists/${item?._id}`;
              const imgSrc = item?.gallery?.coverPhoto || "/assets/images/makeup-artist-cover.webp";
              const locationText =
                item?.businessAddress?.locality && item?.businessAddress?.city
                  ? `${item.businessAddress.locality}, ${item.businessAddress.city}`
                  : item?.businessAddress?.city || item?.businessAddress?.locality || "Bangalore";
              const ratingText =
                item?.rating !== undefined && item?.rating !== null && item?.rating !== ""
                  ? String(item.rating)
                  : "4.5";
              const specialityList = Array.isArray(item?.speciality)
                ? item.speciality
                : item?.speciality
                ? String(item.speciality).split(",")
                : [];

              return (
              <Link
                key={item?._id || index}
                href={href}
                className="bg-white rounded-2xl shadow-[4px_4px_10px_rgba(0,0,0,0.3)] border border-gray-100 p-4 flex flex-col cursor-pointer transition-transform duration-200 hover:-translate-y-0.5 hover:shadow-[6px_6px_16px_rgba(0,0,0,0.25)] focus:outline-none focus:ring-2 focus:ring-[#880E4F]/40"
                style={{ fontFamily: "Montserrat" }}
                aria-label={`View ${item?.name || "makeup artist"}`}
              >
                <div className="relative w-full pt-[100%] rounded-xl overflow-hidden bg-gray-200">
                  <img
                    src={imgSrc}
                    className="absolute inset-0 w-full h-full object-cover"
                    alt={item?.name ? `${item.name} cover` : "Similar makeup artist"}
                    onError={(e) => {
                      e.currentTarget.src = "/assets/images/makeup-artist-cover.webp";
                    }}
                  />
                </div>

                <h3 className="mt-6 text-2xl font-medium text-black">
                  {item?.name}
                </h3>

                <div className="mt-3 flex items-center justify-between">
                  <div className="flex items-center gap-2 text-[#880E4F]">
                    <FaStar size={18} />
                    <span className="text-2xl text-black font-semibold">{ratingText}</span>
                  </div>
                  <div className="flex items-center gap-2 text-[#2F6AA8]">
                    <FaMapMarkerAlt size={18} className="text-gray-500" />
                    <span className="text-base text-gray-500 font-semibold">{locationText}</span>
                  </div>
                </div>

                <div className="mt-2">
                  <p className="text-base text-black">Specialist In</p>
                  <ul className="list-disc pl-5 text-base text-black">
                    {(specialityList || [])
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
              </Link>
              );
            })}
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
      <Toast
        message={toastMessage}
        show={showToast}
        onClose={() => setShowToast(false)}
        isRemoved={toastMessage === "Removed from Favourites"}
      />
      </>
      );
}

      export default MakeupAndBeauty;
