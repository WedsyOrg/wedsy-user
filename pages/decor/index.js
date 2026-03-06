import DecorCard from "@/components/cards/DecorCard";
import { processMobileNumber } from "@/utils/phoneNumber";
import { trimTitle, trimDescription, OG_IMAGES } from "@/utils/seo";
import { pushDataLayer } from "@/utils/tracking";
import Head from "next/head";
import Image from "next/image";
import Link from "next/link";
import { useEffect, useRef, useState } from "react";

function Decor({
  bestSellerBackdrops = [],
  grandEntry = [],
  bestSellerMandaps = [],
  furniture = [],
  popular = [],
  userLoggedIn,
  user,
  spotlightList = [],
}) {
  const [spotlightIndex, setSpotlightIndex] = useState(0);
  const spotlightRef = useRef(null);
  const spotlightHorizontalRef = useRef(null);
  const [spotlightSwipe, setSpotlightSwipe] = useState(null);
  const [enquiryForm, setEnquiryForm] = useState({
    phone: "",
    name: "",
    loading: false,
    success: false,
    otpSent: false,
    Otp: "",
    ReferenceId: "",
    message: "",
  });
  const [categoryList, setCategoryList] = useState([
    "Stage",
    "Pathway",
    "Entrance",
    "Photobooth",
    "Mandap",
    "Nameboard",
    "Furniture",
    "Sound & Light",
    "Entry Ideas",
    "Props"
  ]);
  const [showAllCategories, setShowAllCategories] = useState(false);
  const [bestSellerIndex, setBestSellerIndex] = useState([0, 1, 2, 3]);
  const [popularIndex, setPopularIndex] = useState([0, 1]);
  const [currentSlide, setCurrentSlide] = useState(0);
  const [slideOffset, setSlideOffset] = useState(0);

  // Separate state for each section
  const [bestSellerSlideOffset, setBestSellerSlideOffset] = useState(0);
  const [grandEntrySlideOffset, setGrandEntrySlideOffset] = useState(0);
  const [mandapsSlideOffset, setMandapsSlideOffset] = useState(0);
  const [furnitureSlideOffset, setFurnitureSlideOffset] = useState(0);

  // Separate indices for each section
  const [grandEntryIndex, setGrandEntryIndex] = useState([0, 1, 2, 3]);
  const [mandapsIndex, setMandapsIndex] = useState([0, 1, 2, 3]);
  const [furnitureIndex, setFurnitureIndex] = useState([0, 1, 2, 3]);

  // True sliding carousel states
  const [backdropsTranslateX, setBackdropsTranslateX] = useState(0);
  const [grandEntryTranslateX, setGrandEntryTranslateX] = useState(0);
  const [mandapsTranslateX, setMandapsTranslateX] = useState(0);
  const [furnitureTranslateX, setFurnitureTranslateX] = useState(0);
  
  // Pause states for hover functionality
  const [isPaused, setIsPaused] = useState({
    backdrops: false,
    grandEntry: false,
    mandaps: false,
    furniture: false
  });
  
  // Item width calculation (451px + 24px gap = 475px)
  const itemWidth = 475;

  const handleEnquiry = () => {
    setEnquiryForm({
      ...enquiryForm,
      loading: true,
    });
    fetch(`${process.env.NEXT_PUBLIC_API_URL}/enquiry`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        name: enquiryForm.name,
        phone: processMobileNumber(enquiryForm.phone),
        verified: true,
        source: "Decor Landing Page",
        Otp: enquiryForm.Otp,
        ReferenceId: enquiryForm.ReferenceId,
      }),
    })
      .then((response) => response.json())
      .then((response) => {
        if (
          response.message === "Enquiry Added Successfully" &&
          response.token
        ) {
          setEnquiryForm({
            phone: "",
            name: "",
            loading: false,
            success: true,
            otpSent: false,
            Otp: "",
            ReferenceId: "",
            message: "",
          });
          localStorage.setItem("token", response.token);
          pushDataLayer("Lead", { form_name: "DecorEnquiry" });
          import("react-facebook-pixel")
            .then((x) => x.default)
            .then((ReactPixel) => ReactPixel.track("Lead"));
        } else {
          setEnquiryForm({
            ...enquiryForm,
            loading: false,
            Otp: "",
            message: response.message,
          });
        }
      })
      .catch((error) => {
        console.error("There was a problem with the fetch operation:", error);
      });
  };
  const SendOTP = async () => {
    if (await processMobileNumber(enquiryForm.phone)) {
      setEnquiryForm({
        ...enquiryForm,
        loading: true,
      });
      fetch(`${process.env.NEXT_PUBLIC_API_URL}/auth/otp`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          phone: processMobileNumber(enquiryForm.phone),
        }),
      })
        .then((response) => response.json())
        .then((response) => {
          setEnquiryForm({
            ...enquiryForm,
            loading: false,
            otpSent: true,
            ReferenceId: response.ReferenceId,
          });
        })
        .catch((error) => {
          console.error("There was a problem with the fetch operation:", error);
        });
    } else {
      alert("Please enter valid mobile number");
    }
  };

  // Best Seller (Backdrops) handlers
  const handleBestSellerPrev = () => {
    const length = bestSellerBackdrops?.length ?? 0;
    if (length === 0) return;
    const newIndices = bestSellerIndex.map((index) => (index - 1 + length) % length);
    setBestSellerIndex(newIndices);
    setBestSellerSlideOffset((prev) => prev + 457);
  };
  const handleBestSellerNext = () => {
    const length = bestSellerBackdrops?.length ?? 0;
    if (length === 0) return;
    const newIndices = bestSellerIndex.map((index) => (index + 1) % length);
    setBestSellerIndex(newIndices);
    setBestSellerSlideOffset((prev) => prev - 457);
  };

  // Grand Entry handlers
  const handleGrandEntryPrev = () => {
    const length = grandEntry?.length ?? 0;
    if (length === 0) return;
    const newIndices = grandEntryIndex.map((index) => (index - 1 + length) % length);
    setGrandEntryIndex(newIndices);
    setGrandEntrySlideOffset((prev) => prev + 457);
  };
  const handleGrandEntryNext = () => {
    const length = grandEntry?.length ?? 0;
    if (length === 0) return;
    const newIndices = grandEntryIndex.map((index) => (index + 1) % length);
    setGrandEntryIndex(newIndices);
    setGrandEntrySlideOffset((prev) => prev - 457);
  };

  // Mandaps handlers
  const handleMandapsPrev = () => {
    const length = bestSellerMandaps?.length ?? 0;
    if (length === 0) return;
    const newIndices = mandapsIndex.map((index) => (index - 1 + length) % length);
    setMandapsIndex(newIndices);
    setMandapsSlideOffset((prev) => prev + 457);
  };
  const handleMandapsNext = () => {
    const length = bestSellerMandaps?.length ?? 0;
    if (length === 0) return;
    const newIndices = mandapsIndex.map((index) => (index + 1) % length);
    setMandapsIndex(newIndices);
    setMandapsSlideOffset((prev) => prev - 457);
  };

  // Furniture handlers
  const handleFurniturePrev = () => {
    const length = furniture?.length ?? 0;
    if (length === 0) return;
    const newIndices = furnitureIndex.map((index) => (index - 1 + length) % length);
    setFurnitureIndex(newIndices);
    setFurnitureSlideOffset((prev) => prev + 457);
  };
  const handleFurnitureNext = () => {
    const length = furniture?.length ?? 0;
    if (length === 0) return;
    const newIndices = furnitureIndex.map((index) => (index + 1) % length);
    setFurnitureIndex(newIndices);
    setFurnitureSlideOffset((prev) => prev - 457);
  };

  useEffect(() => {
    let intervalId;
    const listLength = Array.isArray(spotlightList) ? spotlightList.length : 0;
    if (listLength === 0) return;
    const startAutoPlay = () => {
      intervalId = setInterval(() => {
        setSpotlightIndex(
          (prevSlide) => (prevSlide + 1) % listLength
        );
      }, 4000); // Change slide every 4 seconds
    };
    const resetAutoPlay = () => {
      clearInterval(intervalId);
      startAutoPlay();
    };
    startAutoPlay();
    const spotLightContainer = document.getElementById("spotlight");
    if (spotLightContainer) {
      spotLightContainer.addEventListener("mouseenter", resetAutoPlay);
      spotLightContainer.addEventListener("mouseleave", resetAutoPlay);
    }
    return () => {
      clearInterval(intervalId);
      if (spotLightContainer) {
        spotLightContainer.removeEventListener("mouseenter", resetAutoPlay);
        spotLightContainer.removeEventListener("mouseleave", resetAutoPlay);
      }
    };
  }, [spotlightIndex, spotlightList]);

  // Generate ItemList Schema for Decor Listing
  const itemListSchema = {
    "@context": "https://schema.org",
    "@type": "ItemList",
    "name": "Wedding Decoration Items",
    "description": "Browse our collection of wedding decoration items including stages, mandaps, pathways, entrances, and more",
    "itemListElement": [
      ...(bestSellerBackdrops?.slice(0, 10) || []).map((item, index) => ({
        "@type": "ListItem",
        "position": index + 1,
        "name": item.name,
        "url": `https://www.wedsy.in/decor/view/${item._id}`
      }))
    ]
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
        "name": "Decor",
        "item": "https://www.wedsy.in/decor"
      }
    ]
  };

  useEffect(() => {
    if (!spotlightRef.current || !Array.isArray(spotlightList) || spotlightList.length === 0) {
      return;
    }
    const handleTouchStart = (e) => {
      spotlightHorizontalRef.current = e.touches[0].clientX;
    };
    const handleTouchMove = (e) => {
      if (!spotlightHorizontalRef.current) return;
      const deltaX = e.touches[0].clientX - spotlightHorizontalRef.current;
      let sensitivity = 100;
      let l = Array.isArray(spotlightList) ? spotlightList.length : 0;
      if (l === 0) return;
      if (deltaX > sensitivity) {
        setSpotlightSwipe("right");
        if (spotlightSwipe) {
          setSpotlightIndex(spotlightIndex === 0 ? l - 1 : spotlightIndex - 1);
        }
      } else if (deltaX < -1 * sensitivity) {
        setSpotlightSwipe("left");
        if (spotlightSwipe === null) {
          setSpotlightIndex(spotlightIndex === l - 1 ? 0 : spotlightIndex + 1);
        }
      }
    };
    const handleTouchEnd = () => {
      setSpotlightSwipe(null);
      spotlightHorizontalRef.current = null;
    };
    const div = spotlightRef.current;
    div.addEventListener("touchstart", handleTouchStart);
    div.addEventListener("touchmove", handleTouchMove);
    div.addEventListener("touchend", handleTouchEnd);

    return () => {
      div.removeEventListener("touchstart", handleTouchStart);
      div.removeEventListener("touchmove", handleTouchMove);
      div.removeEventListener("touchend", handleTouchEnd);
    };
  }, [spotlightRef, spotlightList, spotlightIndex, spotlightSwipe]);

  // Optimized carousel - reduced frequency for better performance
  useEffect(() => {
    const hasAny =
      (bestSellerBackdrops?.length > 0) ||
      (grandEntry?.length > 0) ||
      (bestSellerMandaps?.length > 0) ||
      (furniture?.length > 0);
    if (!hasAny) return;

    let animationId;
    let lastTime = Date.now();
    const constantSpeedPerSecond = itemWidth / 8;
    let accumulatedMovement = 0;

    const animate = () => {
      const currentTime = Date.now();
      const deltaTime = currentTime - lastTime;
      lastTime = currentTime;
      const constantMovement = (deltaTime / 1000) * constantSpeedPerSecond;
      accumulatedMovement += constantMovement;

      if (accumulatedMovement >= 2) {
        const movementToApply = Math.floor(accumulatedMovement);
        accumulatedMovement -= movementToApply;
        const updates = {};

        if (!isPaused.backdrops && bestSellerBackdrops?.length > 0) {
          const len = Math.min(bestSellerBackdrops.length, 6);
          updates.backdrops = (prev) => {
            let newX = prev - movementToApply;
            if (newX <= -len * itemWidth) newX += len * itemWidth;
            return newX;
          };
        }
        if (!isPaused.grandEntry && grandEntry?.length > 0) {
          const len = Math.min(grandEntry.length, 6);
          updates.grandEntry = (prev) => {
            let newX = prev - movementToApply;
            if (newX <= -len * itemWidth) newX += len * itemWidth;
            return newX;
          };
        }
        if (!isPaused.mandaps && bestSellerMandaps?.length > 0) {
          const len = Math.min(bestSellerMandaps.length, 6);
          updates.mandaps = (prev) => {
            let newX = prev - movementToApply;
            if (newX <= -len * itemWidth) newX += len * itemWidth;
            return newX;
          };
        }
        if (!isPaused.furniture && furniture?.length > 0) {
          const len = Math.min(furniture.length, 6);
          updates.furniture = (prev) => {
            let newX = prev - movementToApply;
            if (newX <= -len * itemWidth) newX += len * itemWidth;
            return newX;
          };
        }

        if (updates.backdrops) setBackdropsTranslateX(updates.backdrops);
        if (updates.grandEntry) setGrandEntryTranslateX(updates.grandEntry);
        if (updates.mandaps) setMandapsTranslateX(updates.mandaps);
        if (updates.furniture) setFurnitureTranslateX(updates.furniture);
      }

      animationId = requestAnimationFrame(animate);
    };

    animationId = requestAnimationFrame(animate);
    return () => cancelAnimationFrame(animationId);
  }, [
    bestSellerBackdrops,
    grandEntry,
    bestSellerMandaps,
    furniture,
    isPaused,
    itemWidth,
  ]);

  return (
    <div className="bg-[#F4F4F4] min-h-screen w-full">
      <>
        <Head>
          <meta
            name="google-site-verification"
            content="6NQH3LHjenBtdQYZzStAqCj51nFRb1P4Pb5jhIdugB0"
          />
          <title>
            {trimTitle("Premium Wedding Decor Services | Wedding Stage Decoration in Bangalore")}
          </title>
          <meta
            name="description"
            content={trimDescription("Transform your wedding with Wedsy's premium decor services. Discover exquisite themes, floral arrangements, and custom setups designed to bring your dream wedding to life. Book now for a seamless experience.")}
          />
          <meta
            name="keywords"
            content="wedding decorations,wedding flower decoration,wedding hall decoration,flower decorators in bangalore,decorators in bangalore,wedding decorators in bangalore"
          />
          <link rel="canonical" href="https://www.wedsy.in/decor" />
          <meta name="robots" content="index, follow" />
          <meta name="copyright" content="Wedsy" />
          <meta name="language" content="EN" />
          
          {/* Open Graph Tags */}
          <meta property="og:title" content="Wedding Decorations | Premium Wedding Decor in Bangalore | Wedsy" />
          <meta property="og:description" content="Transform your wedding with Wedsy's premium decor services. Discover exquisite themes, floral arrangements, and custom setups designed to bring your dream wedding to life." />
          <meta property="og:image" content={OG_IMAGES.decor} />
          <meta property="og:url" content="https://www.wedsy.in/decor" />
          <meta property="og:type" content="website" />
          <meta property="og:site_name" content="Wedsy" />
          
          {/* Twitter Card Tags */}
          <meta name="twitter:card" content="summary_large_image" />
          <meta name="twitter:title" content="Wedding Decorations | Premium Wedding Decor in Bangalore | Wedsy" />
          <meta name="twitter:description" content="Transform your wedding with Wedsy's premium decor services. Discover exquisite themes, floral arrangements, and custom setups." />
          <meta name="twitter:image" content={OG_IMAGES.decor} />
          
          {/* Structured Data */}
          <script
            type="application/ld+json"
            dangerouslySetInnerHTML={{ __html: JSON.stringify(itemListSchema) }}
          />
          <script
            type="application/ld+json"
            dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbSchema) }}
          />
          <style jsx>{`
            @keyframes slideInFromRight {
              0% {
                opacity: 0;
                transform: translateX(100px) scale(0.9);
              }
              50% {
                opacity: 0.7;
                transform: translateX(-10px) scale(0.95);
              }
              100% {
                opacity: 1;
                transform: translateX(0) scale(1);
              }
            }
            
            @keyframes slideOutToLeft {
              0% {
                opacity: 1;
                transform: translateX(0) scale(1);
              }
              50% {
                opacity: 0.7;
                transform: translateX(10px) scale(0.95);
              }
              100% {
                opacity: 0;
                transform: translateX(-100px) scale(0.9);
              }
            }
            
            @keyframes fadeInScale {
              0% {
                opacity: 0;
                transform: scale(0.8);
              }
              100% {
                opacity: 1;
                transform: scale(1);
              }
            }
            
            .carousel-item {
              animation: fadeInScale 0.6s ease-out;
            }
            
            .carousel-item.slide-in {
              animation: slideInFromRight 0.7s ease-out;
            }
            
            .carousel-item.slide-out {
              animation: slideOutToLeft 0.5s ease-in;
            }
            
            @keyframes subtlePulse {
              0%, 100% {
                transform: scale(1);
              }
              50% {
                transform: scale(1.02);
              }
            }
            
            .carousel-container {
              animation: subtlePulse 4s ease-in-out infinite;
            }
            
            .carousel-item {
              will-change: transform;
              backface-visibility: hidden;
              transform: translateZ(0);
              contain: layout style paint;
              isolation: isolate;
            }
            
            .carousel-container {
              will-change: transform;
              backface-visibility: hidden;
              transform: translateZ(0);
              contain: layout style paint;
              isolation: isolate;
            }
            
            /* Optimize images for better performance */
            .carousel-item img {
              image-rendering: optimizeSpeed;
              image-rendering: -moz-crisp-edges;
              image-rendering: -webkit-optimize-contrast;
              image-rendering: crisp-edges;
              transform: translateZ(0);
            }
            
            /* Reduce repaints during animation */
            .carousel-item * {
              transform: translateZ(0);
            }
          `}</style>
        </Head>
        {/* <div className="hidden">
          <h1>Wedding Decoration Packages - Wedsy&apos;s</h1>
          <h2>Wedding Stage Decoration in Bangalore</h2>
        </div>
        <DecorDisclaimer /> */}
        {/* MAIN SECTION (Tailwind version) */}
        <div className="w-full relative overflow-hidden hidden  md:block mb-[56px]">
          <img
            src="/assets/decor/decor-home.webp"
            alt="Decor Hero"
            className="w-full h-auto block filter brightness-[80%]"
          />

          <div className="absolute top-0 left-0 w-full h-full flex flex-col items-center justify-center z-10">
            <h1 className="text-white text-[65px] font-medium tracking-[2px] text-center drop-shadow-lg">
              MAKE IT UNIQUE<br />MAKE IT YOURS
            </h1>
          </div>
        </div>

        {/* Enquiry Form (commented out as per new design) */}
        {/**
        <div className="hidden md:flex absolute top-2/3 left-2/3 w-1/4 flex-col gap-3 text-center">
          {enquiryForm.success ? (
            <p className="text-white">
              Your Wedsy Wedding Manager will contact you and assist you in
              choosing the best!
            </p>
          ) : (
            <>
              <input
                type="text"
                placeholder="NAME"
                value={enquiryForm.name}
                onChange={(e) =>
                  setEnquiryForm({ ...enquiryForm, name: e.target.value })
                }
                name="name"
                className="text-center text-white bg-transparent border-0 border-b-white/80 outline-0 focus:outline-none focus:border-0 border-b focus:border-b focus:border-b-white focus:ring-0  placeholder:text-white"
              />
              <input
                type="text"
                placeholder="PHONE NO."
                value={enquiryForm.phone}
                onChange={(e) =>
                  setEnquiryForm({
                    ...enquiryForm,
                    phone: e.target.value,
                  })
                }
                name="phone"
                disabled={enquiryForm.otpSent}
                className="text-center text-white bg-transparent border-0 border-b-white/80 outline-0 focus:outline-none focus:border-0 border-b focus:border-b focus:border-b-white focus:ring-0  placeholder:text-white"
              />
              {enquiryForm.otpSent && (
                <input
                  type="text"
                  placeholder="OTP"
                  value={enquiryForm.Otp}
                  onChange={(e) =>
                    setEnquiryForm({
                      ...enquiryForm,
                      Otp: e.target.value,
                    })
                  }
                  name="otp"
                  className="text-center text-white bg-transparent border-0 border-b-white/80 outline-0 focus:outline-none focus:border-0 border-b focus:border-b focus:border-b-white focus:ring-0  placeholder:text-white"
                />
              )}
              {enquiryForm.message && (
                <p className="text-red-500">{enquiryForm.message}</p>
              )}
              <button
                type="submit"
                className="rounded-full bg-white text-black py-2 disabled:bg-white/50"
                disabled={
                  !enquiryForm.name ||
                  !enquiryForm.phone ||
                  enquiryForm.loading ||
                  (enquiryForm.otpSent ? !enquiryForm.Otp : false)
                }
                onClick={() => {
                  enquiryForm.otpSent ? handleEnquiry() : SendOTP();
                }}
              >
                SUBMIT
              </button>
            </>
          )}
        </div>
        */}

        {/* Categories Grid (redesigned) */}
        <section className="flex flex-col items-center pt-10 px-4">
          <div className="w-full flex justify-center mb-8 bg-[#F4F4F4]">
            <h2
              className="w-[338px] h-[24px] sm:w-auto sm:h-[37px] text-[20px] sm:text-[32px] font-normal text-center tracking-[1px] opacity-100"
            >
              THE <span className="font-bold">WEDDING</span> STORE
            </h2>
          </div>

          <div className="grid grid-cols-2 gap-4 sm:gap-6 md:gap-8 justify-center w-full max-w-7xl">
            {categoryList.slice(0, 8).map((item, index) => (
              <div
                key={index}
                className="group w-full h-[80px] sm:h-[100px] lg:h-[80px] relative rounded-md overflow-hidden opacity-100 shadow-md transform transition duration-300 hover:scale-[1.03]"
              >
                <Link href={`/decor/view?category=${encodeURIComponent(item)}`} className="block w-full h-full">
                  <img
                    src={`/assets/decor/categories-img/${item.toLowerCase()}.webp`}
                    alt={item}
                    className="w-full h-full object-cover brightness-75 transition-transform duration-300 group-hover:scale-105"
                  />
                  {/* black sweep from bottom appears only on hover */}
                  <div
                    className="absolute inset-x-0 bottom-0 h-0 group-hover:h-full transition-all duration-300 opacity-0 group-hover:opacity-70 bg-gradient-to-t from-black to-transparent"
                  />
                  <div className="absolute top-0 left-0 w-full h-full flex items-center justify-center">
                    <span className="relative z-10 text-white text-[16px] sm:text-[24px] md:text-[28px] font-normal tracking-[2px] text-shadow-lg uppercase">
                      {item.toUpperCase()}
                    </span>
                  </div>
                </Link>
              </div>
            ))}
          </div>

          {/* View More/Less Button */}
          {categoryList.length > 8 && (
            <div className="flex flex-col items-center w-full max-w-7xl mt-4 sm:mt-6 md:mt-8">
              <div className="flex justify-start md:justify-center w-full sm:px-0">
                <div
                  onClick={() => setShowAllCategories(!showAllCategories)}
                  className="w-[calc(50%-0.5rem)] sm:max-w-[calc(50%-1.5rem)] md:max-w-[calc(50%-2rem)] h-[35px] sm:h-[100px] lg:h-[80px] relative rounded-md overflow-hidden opacity-100 shadow-md transform transition duration-300 hover:scale-[1.03] bg-[#FFFFFF] flex items-center justify-start sm:justify-center cursor-pointer"
                >
                  <div className="flex items-center gap-3 text-black px-3 sm:px-0">
                    <span className="text-[10px] sm:text-[24px] md:text-[28px] font-normal tracking-[2px] uppercase">
                      {showAllCategories ? 'VIEW LESS' : 'VIEW MORE'}
                    </span>
                    <svg
                      className={`w-4 h-4 md:w-5 md:h-5 transition-transform duration-300 ${showAllCategories ? '' : 'rotate-180'}`}
                      viewBox="0 0 18 11"
                      fill="none"
                      xmlns="http://www.w3.org/2000/svg"
                    >
                      <path d="M1.05469 10.5H16.9453L9 0.789062L1.05469 10.5Z" stroke="currentColor" strokeWidth="1"/>
                    </svg>
                  </div>
                </div>
              </div>
              
              {/* more Section – only categories not already shown in tiles */}
              {showAllCategories && (
                <div className="w-full mt-6 bg-white rounded-md shadow-md p-4 md:p-6">
                  <div className="flex flex-wrap justify-center gap-4 md:gap-6">
                    {categoryList.slice(8).map((item, index) => (
                      <div
                        key={index}
                        className="text-center px-2"
                      >
                        <Link href={`/decor/view?category=${encodeURIComponent(item)}`} className="hover:underline">
                          <span className="text-black text-xs sm:text-sm md:text-base font-medium uppercase tracking-wide whitespace-nowrap">
                            {item.toUpperCase()}
                          </span>
                        </Link>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          )}
        </section>

        {/*margin*/}
        {/* <div class="w-[1200px] h-[1px] bg-[#D9D9D9] mt-[96px] mx-auto"></div> */}

        {/* Spotlight Section  */}
        <section className="px-6 md:px-24 mt-[80px] md:mt-[120px]" id="spotlight">
          <p className="text-black text-[20px] md:text-4xl font-medium font-light leading-normal uppercase text-center mt-6">
            SPOTLIGHT
          </p>

          <div
            ref={spotlightRef}
            className="w-full max-w-[1200px] mt-[30px] md:mt-[65px] mb-[30px] mx-auto relative overflow-hidden"
          >
            {spotlightList.length > 0 && (
              <div className="relative w-full">
                {spotlightList.map((item, index) => (
                  item._id && (
                    <div
                      key={item._id || index}
                      className="w-full"
                      style={{
                        display: index === spotlightIndex ? 'block' : 'none',
                      }}
                    >
                      <div
                        className="flex flex-col md:grid md:grid-cols-2 w-full m-0 md:m-6 gap-0 md:gap-8 md:h-[301px]"
                        style={{
                          backgroundColor: item.spotlightColor || '#f5f5f5',
                          borderRadius: 0,
                          boxShadow: '0 2px 24px rgba(0,0,0,0.08)',
                          overflow: 'hidden',
                        }}
                      >
                        {/* Mobile-only thumbnail */}
                        <div className="w-full h-[200px] md:hidden">
                          <img
                            src={item.thumbnail || item.image || "/assets/decor/decor-home.webp"}
                            alt={item.name || "Decor Image"}
                            className="w-full h-full object-contain brightness-75"
                            onError={(e) => {
                              e.target.onerror = null;
                              e.target.src = "/assets/decor/decor-home.webp";
                            }}
                          />
                        </div>

                        {/* Text Content */}
                        <div className="flex flex-col p-4 sm:p-6 justify-between h-full overflow-hidden">
                          <p className="text-xl md:text-2xl font-semibold flex-shrink-0">
                            {item.name}
                          </p>
                          <p className="hidden md:block font-medium text-sm overflow-hidden flex-1 min-h-0 my-2 line-clamp-5">
                            {item.description}
                          </p>
                          <div className="flex justify-between items-center flex-shrink-0 mt-auto pt-2">
                            <p className="text-xl md:text-2xl font-semibold">
                              ₹{' '}
                              {
                                item.productInfo?.variant?.artificialFlowers?.sellingPrice ||
                                item.productInfo?.variant?.mixedFlowers?.sellingPrice ||
                                item.productInfo?.variant?.naturalFlowers?.sellingPrice
                              }
                            </p>
                            <Link href={`/decor/view/${item._id}`}>
                              <button className="bg-black text-white py-2 px-4 md:px-8 rounded-lg whitespace-nowrap">
                                View Details
                              </button>
                            </Link>
                          </div>
                        </div>

                        {/* Desktop-only thumbnail */}
                        <div className="relative w-full hidden md:block h-full">
                          <Image
                            src={item.thumbnail || item.image || "/assets/decor/decor-home.webp"}
                            alt={item.name || "Decor"}
                            layout="fill"
                            objectFit="cover"
                          />
                        </div>
                      </div>
                    </div>
                  )
                ))}
              </div>
            )}
          </div>

          {spotlightList.length > 0 && (
            <div className="flex gap-2 md:gap-3 items-center justify-center">
              {spotlightList.map((_, i) => (
                <span
                  key={i}
                  className={`cursor-pointer rounded-full transition-all duration-200 ease-in-out h-2 md:h-3 w-2 md:w-3 ${
                    i === spotlightIndex 
                      ? 'bg-black scale-125' 
                      : 'bg-gray-400 hover:bg-gray-500'
                  }`}
                  onClick={() => setSpotlightIndex(i)}
                />
              ))}
            </div>
          )}
        </section>


        {/* BestSellers section */}
        <section className="py-8 md:mt-8">
          {/* Heading */}
          <div className="w-full flex items-center justify-center relative py-8 bg-[#F4F4F4]">
            <div className="w-full max-w-[1180px] flex items-center justify-center relative px-4">
              <h2 className="flex items-center justify-center text-[20px] sm:text-[26px] md:text-[30px] font-medium font-['Montserrat'] tracking-[0.1em] text-center m-auto opacity-100 whitespace-nowrap">
                <span>BEST SELLING</span>
                <span className="text-[#8B0034] font-semibold ml-2 font-['Montserrat']">
                  BACKDROPS
                </span>
              </h2>
              <Link
                href="/decor/view"
                className="hidden md:block absolute right-4 text-[14px] sm:text-[16px] underline text-black font-medium font-['Montserrat'] cursor-pointer"
              >
                see more
              </Link>
            </div>
          </div>


          {/* Desktop Slider - Moving Carousel */}
          <div 
            className="hidden md:flex relative w-full justify-center items-center my-6"
            onMouseEnter={() => {
              // Pause moving carousel on hover
              setIsPaused(prev => ({ ...prev, backdrops: true }));
            }}
            onMouseLeave={() => {
              // Resume moving carousel when mouse leaves
              setIsPaused(prev => ({ ...prev, backdrops: false }));
            }}
          >
            <div className="flex gap-6 justify-center w-full overflow-hidden carousel-container">
              <div 
                className="flex gap-6"
                style={{
                  transform: `translateX(${backdropsTranslateX}px)`,
                  width: `${Math.min(bestSellerBackdrops.length, 6) * 3 * itemWidth}px` // Triple width for seamless circular flow
                }}
              >
                {/* Render cards three times for seamless circular loop */}
                    {[...bestSellerBackdrops.slice(0, 6), ...bestSellerBackdrops.slice(0, 6), ...bestSellerBackdrops.slice(0, 6)].map((decor, index) => (
                  <div 
                    key={`backdrops-${index}`} 
                    className="carousel-item relative group w-[451px] h-[241px] rounded-[30px] overflow-hidden transition-all duration-700 ease-in-out transform hover:scale-105 flex-shrink-0"
                  >
                    <div className="w-full h-full transition-transform duration-300 group-hover:scale-105">
                      <DecorCard
                        decor={decor}
                        className="w-full h-full rounded-[30px] overflow-hidden"
                        hideInfo={true}
                      />
                    </div>
                    {/* Hover overlay for name and price */}
                    <div className="hidden md:flex flex-col justify-end absolute inset-0 bg-gradient-to-t from-black/60 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 p-6">
                      <h3 className="text-lg font-semibold text-white mb-1">{decor.name}</h3>
                      <p className="text-base font-semibold text-white">₹ {decor.productTypes?.[0]?.sellingPrice}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>


          {/* Mobile Slider - 4 boxes per slide */}
          <div className="md:hidden px-4">
            <div
              className="flex gap-4 overflow-x-auto snap-x scroll-smooth hide-scrollbar mobile-slider"
              style={{ scrollBehavior: 'auto' }}
              onScroll={(e) => {
                const scrollLeft = e.target.scrollLeft;
                const slideWidth = e.target.scrollWidth / Math.ceil(bestSellerBackdrops.length / 4);
                const newSlide = Math.round(scrollLeft / slideWidth);
                setCurrentSlide(newSlide);
              }}
            >
              {Array.from({ length: Math.ceil(Math.min(bestSellerBackdrops.length, 8) / 4) }, (_, groupIndex) => (
                <div
                  key={groupIndex}
                  className="min-w-full snap-start grid grid-cols-2 gap-4"
                >
                  {bestSellerBackdrops
                    .slice(groupIndex * 4, groupIndex * 4 + 4)
                    .map((item, index) => (
                      <div key={index}>
                        <DecorCard
                          decor={item}
                          hideInfo={true}
                          className="[&>div]:pt-[100%]" // Makes it square
                        />
                      </div>
                    ))}
                </div>
              ))}
            </div>

            {/* Dots below slider*/}
            <div className="flex gap-2 items-center justify-center mt-4">
              {Array.from({ length: Math.ceil(Math.min(bestSellerBackdrops.length, 8) / 4) }, (_, i) => (
                <span
                  key={i}
                  className={`rounded-full h-2 w-2 cursor-pointer transition-colors duration-300 ${i === currentSlide ? 'bg-black' : 'bg-gray-400'
                    }`}
                  onClick={() => {
                    const slider = document.querySelector('.overflow-x-auto');
                    if (slider) {
                      const slideWidth = slider.scrollWidth / Math.ceil(bestSellerBackdrops.length / 4);
                      slider.scrollTo({
                        left: i * slideWidth,
                        behavior: 'smooth'
                      });
                      setCurrentSlide(i);
                    }
                  }}
                ></span>
              ))}
            </div>

            {/* See More Button */}
            <div className="flex justify-center mt-4">
              <Link
                href="/decor/view"
                className="text-[16px] underline text-black font-medium font-['Montserrat']"
              >
                See More
              </Link>
            </div>
          </div>
        </section>

        {/* Ideas for your grand entry section*/}
        <section className="py-8 md:mt-0">
          {/* Heading */}
          <div className="w-full flex items-center justify-center relative py-8 bg-[#F4F4F4]">
            <div className="w-full max-w-[1180px] flex items-center justify-center relative px-4">
              <h2 className="flex items-center justify-center text-[20px] sm:text-[26px] md:text-[30px] font-medium font-['Montserrat'] tracking-[0.1em] text-center m-auto opacity-100 flex-wrap md:flex-nowrap">
                <span>IDEAS FOR YOUR</span>
                <span className="text-[#8B0034] font-semibold ml-2 font-['Montserrat']">
                  GRAND ENTRANCE
                </span>
              </h2>
              <Link
                href="/decor/view"
                className="hidden md:block absolute right-4 text-[14px] sm:text-[16px] underline text-black font-medium font-['Montserrat'] cursor-pointer"
              >
                see more
              </Link>
            </div>
          </div>


          {/* Desktop Slider - Moving Carousel */}
          <div 
            className="hidden md:flex relative w-full justify-center items-center my-6"
            onMouseEnter={() => {
              // Pause moving carousel on hover
              setIsPaused(prev => ({ ...prev, grandEntry: true }));
            }}
            onMouseLeave={() => {
              // Resume moving carousel when mouse leaves
              setIsPaused(prev => ({ ...prev, grandEntry: false }));
            }}
          >
            <div className="flex gap-6 justify-center w-full overflow-hidden carousel-container">
              <div className="flex gap-6" style={{ transform: `translateX(${grandEntryTranslateX}px)`, width: `${Math.min(grandEntry.length, 6) * 3 * itemWidth}px` }}>
                {[...grandEntry.slice(0, 6), ...grandEntry.slice(0, 6), ...grandEntry.slice(0, 6)].map((decor, index) => (
                  <div 
                    key={`grandEntry-${index}`} 
                    className="carousel-item relative group w-[451px] h-[241px] rounded-[30px] overflow-hidden transition-all duration-700 ease-in-out transform hover:scale-105 flex-shrink-0"
                  >
                    <div className="w-full h-full transition-transform duration-300 group-hover:scale-105">
                      <DecorCard
                        decor={decor}
                        className="w-full h-full rounded-[30px] overflow-hidden"
                        hideInfo={true}
                      />
                    </div>
                    {/* Hover overlay for name and price */}
                    <div className="hidden md:flex flex-col justify-end absolute inset-0 bg-gradient-to-t from-black/60 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 p-6">
                      <h3 className="text-lg font-semibold text-white mb-1">{decor.name}</h3>
                      <p className="text-base font-semibold text-white">₹ {decor.productTypes?.[0]?.sellingPrice}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>


          {/* Mobile Slider - 4 boxes per slide */}
          <div className="md:hidden px-4">
            <div
              className="flex gap-4 overflow-x-auto snap-x scroll-smooth hide-scrollbar mobile-slider"
              style={{ scrollBehavior: 'auto' }}
              onScroll={(e) => {
                const scrollLeft = e.target.scrollLeft;
                const slideWidth = e.target.scrollWidth / Math.ceil(grandEntry.length / 4);
                const newSlide = Math.round(scrollLeft / slideWidth);
                setCurrentSlide(newSlide);
              }}
            >
              {Array.from({ length: Math.ceil(Math.min(grandEntry.length, 8) / 4) }, (_, groupIndex) => (
                <div
                  key={groupIndex}
                  className="min-w-full snap-start grid grid-cols-2 gap-4"
                >
                  {grandEntry
                    .slice(groupIndex * 4, groupIndex * 4 + 4)
                    .map((item, index) => (
                      <div key={index}>
                        <DecorCard
                          decor={item}
                          hideInfo={true}
                          className="[&>div]:pt-[100%]" // Makes it square
                        />
                      </div>
                    ))}
                </div>
              ))}
            </div>

            {/* Dots below slider*/}
            <div className="flex gap-2 items-center justify-center mt-4">
              {Array.from({ length: Math.ceil(Math.min(grandEntry.length, 8) / 4) }, (_, i) => (
                <span
                  key={i}
                  className={`rounded-full h-2 w-2 cursor-pointer transition-colors duration-300 ${i === currentSlide ? 'bg-black' : 'bg-gray-400'
                    }`}
                  onClick={() => {
                    const slider = document.querySelector('.overflow-x-auto');
                    if (slider) {
                      const slideWidth = slider.scrollWidth / Math.ceil(grandEntry.length / 4);
                      slider.scrollTo({
                        left: i * slideWidth,
                        behavior: 'smooth'
                      });
                      setCurrentSlide(i);
                    }
                  }}
                ></span>
              ))}
            </div>

            {/* See More Button */}
            <div className="flex justify-center mt-4">
              <Link
                href="/decor/view"
                className="text-[16px] underline text-black font-medium font-['Montserrat']"
              >
                See More
              </Link>
            </div>
          </div>
        </section>



        {/* PACKAGES SECTION  */}
        <section className="flex flex-col items-center pt-10 md:pt-20 pb-6 md:pb-10 bg-[#F4F4F4] px-4">
          <h2
            className="text-[24px] md:text-[30px] font-medium font-['Montserrat'] tracking-[0.05em] text-center uppercase mb-6 md:mb-10 opacity-100"
            style={{ letterSpacing: '5%' }}
          >
            PACKAGES
          </h2>
          <div className="grid grid-cols-2 gap-3 md:gap-8 mb-6 md:mb-8 w-full max-w-6xl">
            {/* Package Items */}
            {[
              { label: "NORTH INDIAN", image: "north-indian.webp" },
              { label: "SOUTH INDIAN", image: "south indian.webp" },
              { label: "MUSLIM", image: "muslim.webp" },
              { label: "RECEPTION", image: "reception.webp" },
              { label: "ADD ONS", image: "add ons.webp" },
            ].map((pkg, index) => (
              <div
                key={index}
                className="group w-full h-[60px] md:h-[100px] relative rounded-md overflow-hidden opacity-100 shadow-md transform transition duration-300 hover:scale-[1.03]"
              >
                <a href="#" className="block w-full h-full">
                  <img
                    src={`/assets/decor/packages-img/${pkg.image}`}
                    alt={pkg.label}
                    className="w-full h-full object-cover brightness-75 transition-transform duration-300 group-hover:scale-105"
                  />
                  <div className="absolute inset-x-0 bottom-0 h-0 group-hover:h-full transition-all duration-300 opacity-0 group-hover:opacity-70 bg-gradient-to-t from-black to-transparent" />
                  <div className="absolute top-0 left-0 w-full h-full flex items-center justify-center">
                    <span className="relative z-10 text-white text-[12px] md:text-[32px] font-normal tracking-[0.5px] md:tracking-[2px] text-shadow-lg uppercase text-center px-1 md:px-0">
                      {pkg.label}
                    </span>
                  </div>
                </a>
              </div>
            ))}

            {/* View More */}
            <div className="group w-full h-[60px] md:h-[100px] relative rounded-md overflow-hidden opacity-100 shadow-md bg-black flex items-center justify-center transform transition duration-300 hover:scale-[1.03]">
              <Link href="/decor/packages" className="block w-full h-full flex items-center justify-center relative">
                <div className="absolute inset-x-0 bottom-0 h-0 group-hover:h-full transition-all duration-300 opacity-0 group-hover:opacity-70 bg-gradient-to-t from-black to-transparent" />
                <span className="relative z-10 text-white text-[12px] md:text-[32px] font-normal tracking-[0.5px] md:tracking-[2px] text-shadow-lg uppercase">
                  VIEW MORE
                </span>
              </Link>
            </div>
          </div>
        </section>

        {/* Feature Highlights Section  */}
        <div className="w-full flex flex-col items-center bg-[#F4F4F4] px-4">
          <hr className="w-full max-w-6xl border-t border-[#C6C6C6] mb-4 md:mb-6" />
          <div className="w-full max-w-6xl grid grid-cols-2 md:flex md:flex-row md:justify-between items-center py-4 md:py-6 gap-4 md:gap-0">
            {/* Exclusive Designs */}
            <div className="flex flex-row items-center gap-2 md:gap-4">
              {/* Rainbow Icon */}
              <img src="/assets/decor/icons/exclusive designs.webp" alt="Rainbow" className="w-8 h-8 md:w-12 md:h-12" />
              <div className="flex flex-col text-left">
                <span className="font-semibold text-sm md:text-lg leading-tight">EXCLUSIVE</span>
                <span className="font-semibold text-sm md:text-lg leading-tight">DESIGNS</span>
              </div>
            </div>
            {/* Customization Options */}
            <div className="flex flex-row items-center gap-2 md:gap-4">
              {/* Sliders Icon */}
              <img src="/assets/decor/icons/customization options.webp" alt="Sliders" className="w-8 h-8 md:w-12 md:h-12" />
              <div className="flex flex-col text-left">
                <span className="font-semibold text-sm md:text-lg leading-tight">CUSTOMIZATION</span>
                <span className="font-semibold text-sm md:text-lg leading-tight">OPTIONS</span>
              </div>
            </div>
            {/* Exceptional Customer Service */}
            <div className="flex flex-row items-center gap-2 md:gap-4">
              {/* Headset Icon */}
              <img src="/assets/decor/icons/exceptional customer service.webp" alt="Headset" className="w-8 h-8 md:w-12 md:h-12" />
              <div className="flex flex-col text-left">
                <span className="font-semibold text-sm md:text-lg leading-tight">EXCEPTIONAL</span>
                <span className="font-semibold text-sm md:text-lg leading-tight">CUSTOMER SERVICE</span>
              </div>
            </div>
            {/* Competitive Pricing */}
            <div className="flex flex-row items-center gap-2 md:gap-4">
              {/* Badge Icon */}
              <img src="/assets/decor/icons/competetive pricing.webp" alt="Badge" className="w-8 h-8 md:w-12 md:h-12" />
              <div className="flex flex-col text-left">
                <span className="font-semibold text-sm md:text-lg leading-tight">COMPETETIVE</span>
                <span className="font-semibold text-sm md:text-lg leading-tight">PRICING</span>
              </div>
            </div>
          </div>
          <hr className="w-full max-w-6xl border-t border-[#C6C6C6] mt-4 md:mt-6" />
        </div>

        {/* MARQUEE FOR CATEGORIES NAMES */}
        {/* <section className="bg-[#840032] text-white font-semibold">
          <div className="relative flex overflow-x-hidden">
            <div className="py-4 animate-marquee whitespace-nowrap">
              <span className="mx-8 text-xl text-white">PATHWAY</span>
              <span className="mx-0 text-xl text-white">&#x2022;</span>
              <span className="mx-8 text-xl text-white">ENTRANCE</span>
              <span className="mx-0 text-xl text-white">&#x2022;</span>
              <span className="mx-8 text-xl text-white">STAGE</span>
              <span className="mx-0 text-xl text-white">&#x2022;</span>
              <span className="mx-8 text-xl text-black">MANDAP</span>
              <span className="mx-0 text-xl text-white">&#x2022;</span>
              <span className="mx-8 text-xl text-white">PHOTOBOOTH</span>
              <span className="mx-0 text-xl text-white">&#x2022;</span>
              <span className="mx-8 text-xl text-black">NAMEBOARD</span>
              <span className="mx-0 text-xl text-white">&#x2022;</span>
              <span className="mx-8 text-xl text-white">ENTRANCE</span>
              <span className="mx-0 text-xl text-white">&#x2022;</span>
              <span className="mx-8 text-xl text-black">PATHWAY</span>
              <span className="mx-0 text-xl text-white">&#x2022;</span>
              <span className="mx-8 text-xl text-white">MANDAP</span>
              <span className="mx-0 text-xl text-white">&#x2022;</span>
              <span className="mx-8 text-xl text-black">STAGE</span>
              <span className="mx-0 text-xl text-white">&#x2022;</span>
              <span className="mx-8 text-xl text-white">NAMEBOARD</span>
              <span className="mx-0 text-xl text-white">&#x2022;</span>
              <span className="mx-8 text-xl text-black">PHOTOBOOTH</span>
              <span className="mx-0 text-xl text-white">&#x2022;</span>
            </div>
            <div className="absolute top-0 py-4 animate-marquee2 whitespace-nowrap">
              <span className="mx-8 text-xl text-white">PATHWAY</span>
              <span className="mx-0 text-xl text-white">&#x2022;</span>
              <span className="mx-8 text-xl text-black">ENTRANCE</span>
              <span className="mx-0 text-xl text-white">&#x2022;</span>
              <span className="mx-8 text-xl text-white">STAGE</span>
              <span className="mx-0 text-xl text-white">&#x2022;</span>
              <span className="mx-8 text-xl text-black">MANDAP</span>
              <span className="mx-0 text-xl text-white">&#x2022;</span>
              <span className="mx-8 text-xl text-white">PHOTOBOOTH</span>
              <span className="mx-0 text-xl text-white">&#x2022;</span>
              <span className="mx-8 text-xl text-black">NAMEBOARD</span>
              <span className="mx-0 text-xl text-white">&#x2022;</span>
              <span className="mx-8 text-xl text-white">ENTRANCE</span>
              <span className="mx-0 text-xl text-white">&#x2022;</span>
              <span className="mx-8 text-xl text-black">PATHWAY</span>
              <span className="mx-0 text-xl text-white">&#x2022;</span>
              <span className="mx-8 text-xl text-white">MANDAP</span>
              <span className="mx-0 text-xl text-white">&#x2022;</span>
              <span className="mx-8 text-xl text-black">STAGE</span>
              <span className="mx-0 text-xl text-white">&#x2022;</span>
              <span className="mx-8 text-xl text-white">NAMEBOARD</span>
              <span className="mx-0 text-xl text-white">&#x2022;</span>
              <span className="mx-8 text-xl text-black">PHOTOBOOTH</span>
              <span className="mx-0 text-xl text-white">&#x2022;</span>
            </div>
          </div>
        </section> */}

        {/* Best selling mandaps section */}
        <section className="py-8 md:mt-4">
          {/* Heading */}
          <div className="w-full flex items-center justify-center relative py-8 bg-[#F4F4F4]">
            <div className="w-full max-w-[1180px] flex items-center justify-center relative px-4">
              <h2 className="flex items-center justify-center text-[20px] sm:text-[26px] md:text-[30px] font-medium font-['Montserrat'] tracking-[0.1em] text-center m-auto opacity-100 flex-wrap md:flex-nowrap">
                <span>BEST SELLING</span>
                <span className="text-[#8B0034] font-semibold ml-2 font-['Montserrat']">
                  MANDAPS
                </span>
              </h2>
              <Link
                href="/decor/view"
                className="hidden md:block absolute right-4 text-[14px] sm:text-[16px] underline text-black font-medium font-['Montserrat'] cursor-pointer"
              >
                see more
              </Link>
            </div>
          </div>


          {/* Desktop Slider - Moving Carousel */}
          <div 
            className="hidden md:flex relative w-full justify-center items-center my-6"
            onMouseEnter={() => {
              // Pause moving carousel on hover
              setIsPaused(prev => ({ ...prev, mandaps: true }));
            }}
            onMouseLeave={() => {
              // Resume moving carousel when mouse leaves
              setIsPaused(prev => ({ ...prev, mandaps: false }));
            }}
          >
            <div className="flex gap-6 justify-center w-full overflow-hidden carousel-container">
              <div 
                className="flex gap-6"
                style={{
                  transform: `translateX(${mandapsTranslateX}px)`,
                  width: `${Math.min(bestSellerMandaps.length, 6) * 3 * itemWidth}px` // Triple width for seamless circular flow
                }}
              >
                {/* Render cards three times for seamless circular loop */}
                    {[...bestSellerMandaps.slice(0, 6), ...bestSellerMandaps.slice(0, 6), ...bestSellerMandaps.slice(0, 6)].map((decor, index) => (
                  <div 
                    key={`mandaps-${index}`} 
                    className="carousel-item relative group w-[451px] h-[241px] rounded-[30px] overflow-hidden transition-all duration-700 ease-in-out transform hover:scale-105 flex-shrink-0"
                  >
                    <div className="w-full h-full transition-transform duration-300 group-hover:scale-105">
                      <DecorCard
                        decor={decor}
                        className="w-full h-full rounded-[30px] overflow-hidden"
                        hideInfo={true}
                      />
                    </div>
                    {/* Hover overlay for name and price */}
                    <div className="hidden md:flex flex-col justify-end absolute inset-0 bg-gradient-to-t from-black/60 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 p-6">
                      <h3 className="text-lg font-semibold text-white mb-1">{decor.name}</h3>
                      <p className="text-base font-semibold text-white">₹ {decor.productTypes?.[0]?.sellingPrice}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>


          {/* Mobile Slider - 4 boxes per slide */}
          <div className="md:hidden px-4">
            <div
              className="flex gap-4 overflow-x-auto snap-x scroll-smooth hide-scrollbar mobile-slider"
              style={{ scrollBehavior: 'auto' }}
              onScroll={(e) => {
                const scrollLeft = e.target.scrollLeft;
                const slideWidth = e.target.scrollWidth / Math.ceil(bestSellerMandaps.length / 4);
                const newSlide = Math.round(scrollLeft / slideWidth);
                setCurrentSlide(newSlide);
              }}
            >
              {Array.from({ length: Math.ceil(Math.min(bestSellerMandaps.length, 8) / 4) }, (_, groupIndex) => (
                <div
                  key={groupIndex}
                  className="min-w-full snap-start grid grid-cols-2 gap-4"
                >
                  {bestSellerMandaps
                    .slice(groupIndex * 4, groupIndex * 4 + 4)
                    .map((item, index) => (
                      <div key={index}>
                        <DecorCard
                          decor={item}
                          hideInfo={true}
                          className="[&>div]:pt-[100%]" // Makes it square
                        />
                      </div>
                    ))}
                </div>
              ))}
            </div>

            {/* Dots below slider*/}
            <div className="flex gap-2 items-center justify-center mt-4">
              {Array.from({ length: Math.ceil(Math.min(bestSellerMandaps.length, 8) / 4) }, (_, i) => (
                <span
                  key={i}
                  className={`rounded-full h-2 w-2 cursor-pointer transition-colors duration-300 ${i === currentSlide ? 'bg-black' : 'bg-gray-400'
                    }`}
                  onClick={() => {
                    const slider = document.querySelector('.overflow-x-auto');
                    if (slider) {
                      const slideWidth = slider.scrollWidth / Math.ceil(bestSellerMandaps.length / 4);
                      slider.scrollTo({
                        left: i * slideWidth,
                        behavior: 'smooth'
                      });
                      setCurrentSlide(i);
                    }
                  }}
                ></span>
              ))}
            </div>

            {/* See More Button */}
            <div className="flex justify-center mt-4">
              <Link
                href="/decor/view"
                className="text-[16px] underline text-black font-medium font-['Montserrat']"
              >
                See More
              </Link>
            </div>
          </div>
        </section>

        {/* Furniture section */}
        <section className="py-8 md:mt-0">
          {/* Heading */}
          <div className="w-full flex items-center justify-center relative py-8 bg-[#F4F4F4]">
            <div className="w-full max-w-[1180px] flex items-center justify-center relative px-4">
              <h2 className="flex items-center justify-center text-[20px] sm:text-[26px] md:text-[30px] font-medium font-['Montserrat'] tracking-[0.1em] text-center m-auto opacity-100 flex-wrap md:flex-nowrap">
                <span>BROWSE FROM A VARIETY OF</span>
                <span className="text-[#8B0034] font-semibold ml-2 font-['Montserrat']">
                  FURNITURE
                </span>
              </h2>
              <Link
                href="/decor/view"
                className="hidden md:block absolute right-4 text-[14px] sm:text-[16px] underline text-black font-medium font-['Montserrat'] cursor-pointer"
              >
                see more
              </Link>
            </div>
          </div>


          {/* Desktop Slider - Moving Carousel */}
          <div 
            className="hidden md:flex relative w-full justify-center items-center my-6"
            onMouseEnter={() => {
              // Pause moving carousel on hover
              setIsPaused(prev => ({ ...prev, furniture: true }));
            }}
            onMouseLeave={() => {
              // Resume moving carousel when mouse leaves
              setIsPaused(prev => ({ ...prev, furniture: false }));
            }}
          >
            <div className="flex gap-6 justify-center w-full overflow-hidden carousel-container">
              <div className="flex gap-6" style={{ transform: `translateX(${furnitureTranslateX}px)`, width: `${Math.min(furniture.length, 6) * 3 * itemWidth}px` }}>
                {[...furniture.slice(0, 6), ...furniture.slice(0, 6), ...furniture.slice(0, 6)].map((decor, index) => (
                  <div 
                    key={`furniture-${index}`} 
                    className="carousel-item relative group w-[451px] h-[241px] rounded-[30px] overflow-hidden transition-all duration-700 ease-in-out transform hover:scale-105 flex-shrink-0"
                  >
                    <div className="w-full h-full transition-transform duration-300 group-hover:scale-105">
                      <DecorCard
                        decor={decor}
                        className="w-full h-full rounded-[30px] overflow-hidden"
                        hideInfo={true}
                      />
                    </div>
                    {/* Hover overlay for name and price */}
                    <div className="hidden md:flex flex-col justify-end absolute inset-0 bg-gradient-to-t from-black/60 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 p-6">
                      <h3 className="text-lg font-semibold text-white mb-1">{decor.name}</h3>
                      <p className="text-base font-semibold text-white">₹ {decor.productTypes?.[0]?.sellingPrice}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>


          {/* Mobile Slider - 4 boxes per slide */}
          <div className="md:hidden px-4">
            <div
              className="flex gap-4 overflow-x-auto snap-x scroll-smooth hide-scrollbar mobile-slider"
              style={{ scrollBehavior: 'auto' }}
              onScroll={(e) => {
                const scrollLeft = e.target.scrollLeft;
                const slideWidth = e.target.scrollWidth / Math.ceil(furniture.length / 4);
                const newSlide = Math.round(scrollLeft / slideWidth);
                setCurrentSlide(newSlide);
              }}
            >
              {Array.from({ length: Math.ceil(Math.min(furniture.length, 8) / 4) }, (_, groupIndex) => (
                <div
                  key={groupIndex}
                  className="min-w-full snap-start grid grid-cols-2 gap-4"
                >
                  {furniture
                    .slice(groupIndex * 4, groupIndex * 4 + 4)
                    .map((item, index) => (
                      <div key={index}>
                        <DecorCard
                          decor={item}
                          hideInfo={true}
                          className="[&>div]:pt-[100%]" // Makes it square
                        />
                      </div>
                    ))}
                </div>
              ))}
            </div>

            {/* Dots below slider*/}
            <div className="flex gap-2 items-center justify-center mt-4">
              {Array.from({ length: Math.ceil(Math.min(furniture.length, 8) / 4) }, (_, i) => (
                <span
                  key={i}
                  className={`rounded-full h-2 w-2 cursor-pointer transition-colors duration-300 ${i === currentSlide ? 'bg-black' : 'bg-gray-400'
                    }`}
                  onClick={() => {
                    const slider = document.querySelector('.overflow-x-auto');
                    if (slider) {
                      const slideWidth = slider.scrollWidth / Math.ceil(furniture.length / 4);
                      slider.scrollTo({
                        left: i * slideWidth,
                        behavior: 'smooth'
                      });
                      setCurrentSlide(i);
                    }
                  }}
                ></span>
              ))}
            </div>

            {/* See More Button */}
            <div className="flex justify-center mt-4">
              <Link
                href="/decor/view"
                className="text-[16px] underline text-black font-medium font-['Montserrat']"
              >
                See More
              </Link>
            </div>
          </div>
        </section>

        {/* Photobooth section */}
        <section className="py-8 md:mt-0">
          {/* Heading */}
          <div className="w-full flex items-center justify-center relative py-8 bg-[#F4F4F4]">
            <div className="w-full max-w-[1180px] flex items-center justify-center relative px-4">
              <h2 className="flex items-center justify-center text-[20px] sm:text-[26px] md:text-[30px] font-medium font-['Montserrat'] tracking-[0.1em] text-center m-auto opacity-100 flex-wrap md:flex-nowrap">
                <span className="text-[#8B0034] font-semibold ml-2 font-['Montserrat']">
                  PHOTOBOOTH
                </span>
                <span className="ml-1">DESIGNS</span>
              </h2>
              <Link
                href="/decor/view"
                className="hidden md:block absolute right-4 text-[14px] sm:text-[16px] underline text-black font-medium font-['Montserrat'] cursor-pointer"
              >
                see more
              </Link>
            </div>
          </div>

          {/* Desktop Grid Layout */}
          <div className="hidden md:block max-w-[1180px] mx-auto px-4">
            <div className="grid grid-cols-3 gap-6">
              {/* Large image on the left */}
              <div className="col-span-1">
                <div className="relative group cursor-pointer overflow-hidden rounded-[20px] shadow-lg hover:shadow-xl transition-all duration-300">
                  <img
                    src="/assets/decor/photobooth-img/pb1.webp"
                    alt="Photobooth Design 1"
                    className="w-full h-[400px] object-cover group-hover:scale-105 transition-transform duration-300"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                  <div className="absolute bottom-4 left-4 text-white opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                    <h3 className="text-lg font-semibold">Elegant Floral</h3>
                    <p className="text-sm">Premium Design</p>
                  </div>
                </div>
              </div>

              {/* Two medium images on the right */}
              <div className="col-span-2 space-y-6">
                <div className="grid grid-cols-2 gap-6">
                  <div className="relative group cursor-pointer overflow-hidden rounded-[20px] shadow-lg hover:shadow-xl transition-all duration-300">
                    <img
                      src="/assets/decor/photobooth-img/pb2.webp"
                      alt="Photobooth Design 2"
                      className="w-full h-[190px] object-cover group-hover:scale-105 transition-transform duration-300"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                    <div className="absolute bottom-4 left-4 text-white opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                      <h3 className="text-lg font-semibold">Modern Minimal</h3>
                      <p className="text-sm">Contemporary Style</p>
                    </div>
                  </div>

                  <div className="relative group cursor-pointer overflow-hidden rounded-[20px] shadow-lg hover:shadow-xl transition-all duration-300">
                    <img
                      src="/assets/decor/photobooth-img/pb3.webp"
                      alt="Photobooth Design 3"
                      className="w-full h-[190px] object-cover group-hover:scale-105 transition-transform duration-300"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                    <div className="absolute bottom-4 left-4 text-white opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                      <h3 className="text-lg font-semibold">Royal Gold</h3>
                      <p className="text-sm">Luxury Theme</p>
                    </div>
                  </div>
                </div>

                {/* Bottom row with two images */}
                <div className="grid grid-cols-2 gap-6">
                  <div className="relative group cursor-pointer overflow-hidden rounded-[20px] shadow-lg hover:shadow-xl transition-all duration-300">
                    <img
                      src="/assets/decor/photobooth-img/pb4.webp"
                      alt="Photobooth Design 4"
                      className="w-full h-[190px] object-cover group-hover:scale-105 transition-transform duration-300"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                    <div className="absolute bottom-4 left-4 text-white opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                      <h3 className="text-lg font-semibold">Vintage Charm</h3>
                      <p className="text-sm">Classic Elegance</p>
                    </div>
                  </div>

                  <div className="relative group cursor-pointer overflow-hidden rounded-[20px] shadow-lg hover:shadow-xl transition-all duration-300">
                    <img
                      src="/assets/decor/photobooth-img/pb5.webp"
                      alt="Photobooth Design 5"
                      className="w-full h-[190px] object-cover group-hover:scale-105 transition-transform duration-300"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                    <div className="absolute bottom-4 left-4 text-white opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                      <h3 className="text-lg font-semibold">Nature Inspired</h3>
                      <p className="text-sm">Organic Beauty</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Mobile Grid Layout */}
          <div className="md:hidden px-4">
            <div className="grid grid-cols-2 gap-4">
              <div className="relative group cursor-pointer overflow-hidden rounded-[15px] shadow-lg hover:shadow-xl transition-all duration-300">
                <img
                  src="/assets/decor/photobooth-img/pb1.webp"
                  alt="Photobooth Design 1"
                  className="w-full h-[200px] object-cover group-hover:scale-105 transition-transform duration-300"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                <div className="absolute bottom-3 left-3 text-white opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                  <h3 className="text-sm font-semibold">Elegant Floral</h3>
                </div>
              </div>

              <div className="relative group cursor-pointer overflow-hidden rounded-[15px] shadow-lg hover:shadow-xl transition-all duration-300">
                <img
                  src="/assets/decor/photobooth-img/pb2.webp"
                  alt="Photobooth Design 2"
                  className="w-full h-[200px] object-cover group-hover:scale-105 transition-transform duration-300"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                <div className="absolute bottom-3 left-3 text-white opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                  <h3 className="text-sm font-semibold">Modern Minimal</h3>
                </div>
              </div>

              <div className="relative group cursor-pointer overflow-hidden rounded-[15px] shadow-lg hover:shadow-xl transition-all duration-300">
                <img
                  src="/assets/decor/photobooth-img/pb3.webp"
                  alt="Photobooth Design 3"
                  className="w-full h-[200px] object-cover group-hover:scale-105 transition-transform duration-300"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                <div className="absolute bottom-3 left-3 text-white opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                  <h3 className="text-sm font-semibold">Royal Gold</h3>
                </div>
              </div>

              <div className="relative group cursor-pointer overflow-hidden rounded-[15px] shadow-lg hover:shadow-xl transition-all duration-300">
                <img
                  src="/assets/decor/photobooth-img/pb4.webp"
                  alt="Photobooth Design 4"
                  className="w-full h-[200px] object-cover group-hover:scale-105 transition-transform duration-300"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                <div className="absolute bottom-3 left-3 text-white opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                  <h3 className="text-sm font-semibold">Vintage Charm</h3>
                </div>
              </div>

              <div className="relative group cursor-pointer overflow-hidden rounded-[15px] shadow-lg hover:shadow-xl transition-all duration-300 col-span-2">
                <img
                  src="/assets/decor/photobooth-img/pb5.webp"
                  alt="Photobooth Design 5"
                  className="w-full h-[200px] object-cover group-hover:scale-105 transition-transform duration-300"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                <div className="absolute bottom-3 left-3 text-white opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                  <h3 className="text-sm font-semibold">Nature Inspired</h3>
                </div>
              </div>
            </div>
            <div className="flex justify-center mt-4">
              <Link
                href="/decor/view"
                className="text-[16px] underline text-black font-medium font-['Montserrat']"
              >
                See More
              </Link>
            </div>
          </div>
        </section>


        {/* Instagram Section */}
        <div className="flex flex-col items-center py-6 md:py-8 px-4">
          <div className="flex items-center gap-2 md:gap-3 mb-3 md:mb-4">
            <div className="w-6 h-6 md:w-8 md:h-8 bg-[#8B0034] rounded flex items-center justify-center">
              <svg className="w-4 h-4 md:w-5 md:h-5 text-white" fill="currentColor" viewBox="0 0 24 24">
                <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z" />
              </svg>
            </div>
            <span className="text-black text-xl md:text-3xl font-medium">@wedsy.in</span>
          </div>
          <p className="text-black text-center text-sm md:text-xl w-full max-w-4xl leading-relaxed">
            "Looking for wedding inspirations? Visit our Instagram page to have a glimpse into the latest trends, stunning bridal looks, and real wedding stories."
          </p>
        </div>

        {/* Instagram Grid Placeholder */}
        <div className="w-full max-w-4xl mx-auto px-4 mb-8">
          <div className="grid grid-cols-3 md:grid-cols-5">
            {[
              'https://hub.wedsy.in/wp-content/uploads/2025/02/1640848248851.jpeg',
              'https://hub.wedsy.in/wp-content/uploads/2025/02/1640848248766.jpg',
              'https://hub.wedsy.in/wp-content/uploads/2025/02/IMG_1480-scaled.jpg',
              'https://hub.wedsy.in/wp-content/uploads/2025/02/FullSizeRender12-scaled.jpg',
              'https://hub.wedsy.in/wp-content/uploads/2025/02/1640848248866.jpeg',
              'https://hub.wedsy.in/wp-content/uploads/2025/02/1640848248557.jpg',
              'https://hub.wedsy.in/wp-content/uploads/2025/02/1640848248453.jpg',
              'https://hub.wedsy.in/wp-content/uploads/2024/10/2020-11-05.jpg',
              'https://hub.wedsy.in/wp-content/uploads/2025/02/11ab4f28-5fb3-4ac2-b3b1-03964a5407d3-2.jpg',
              'https://hub.wedsy.in/wp-content/uploads/2025/02/FullSizeRender15.jpg',
            ].map((src, index) => (
              <div
                key={index}
                className={`aspect-square ${index >= 9 ? 'hidden md:block' : ''}`}
              >
                {src && (
                  <a
                    href="https://www.instagram.com/wedsy.in/"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="block w-full h-full cursor-pointer"
                  >
                    <img
                      src={src}
                      alt={`image-${index}`}
                      className="w-full h-full object-cover"
                    />
                  </a>
                )}
              </div>
            ))}
          </div>
        </div>



        {/* Popular searches section */}
        {/* <section className="px-6 md:px-24 py-8 md:mt-0">
          <div className="flex justify-between">
            <h2 className="font-light text-2xl md:text-4xl">
              <span className="font-medium">POPULAR</span> searches
            </h2>
            <Link
              href="/decor/view"
              className="hidden md:inline px-12 py-2 bg-[#840032] text-white rounded-lg mr-20"
            >
              View More
            </Link>
          </div> */}
        {/* Popular Desktop */}
        {/* <div className="hidden md:flex flex-row md:gap-12 justify-between items-center my-6">
            <BsArrowLeftShort
              size={48}
              className="cursor-pointer scale-[0.5] md:scale-[1]"
              onClick={() => {
                let length = popular.length;
                let prev = popularIndex[0];
                let next = popularIndex[1];
                next = prev;
                if (prev === 0) {
                  prev = length - 1;
                } else {
                  prev--;
                }
                setPopularIndex([prev, next]);
              }}
            />
            <div className="grid sm:grid-cols-1 md:grid-cols-2 gap-12 grow">
              {popular[popularIndex[0]] && (
                <DecorCard decor={popular[popularIndex[0]]} />
              )}
              {popular[popularIndex[1]] && (
                <DecorCard
                  decor={popular[popularIndex[1]]}
                  className="hidden md:inline"
                />
              )}
            </div>
            <BsArrowRightShort
              size={48}
              className="cursor-pointer scale-[0.5] md:scale-[1]"
              onClick={() => {
                let length = popular.length;
                let prev = popularIndex[0];
                let next = popularIndex[1];
                prev = next;
                if (next === length - 1) {
                  next = 0;
                } else {
                  next++;
                }
                setPopularIndex([prev, next]);
              }}
            />
          </div> */}
        {/* Popular Mobile */}
        {/* <div className="hide-scrollbar flex md:hidden flex-row gap-8 flex-nowrap items-center my-6 overflow-x-auto">
            {popular.map((item, index) => (
              <div className="min-w-[75vw] w-[80vw]" key={index}>
                <DecorCard decor={item} />
              </div>
            ))}
          </div>
        </section> */}

        {/* <div
          className="p-8 flex flex-row justify-around items-center md:px-48"
          style={{
            background:
              "linear-gradient(180deg, rgba(245, 211, 215, 0.00) 0%, #EDA4AC 25%, #EDA4AC 75%, rgba(245, 211, 215, 0.00) 100%)",
          }}
        >
          <div className="flex flex-col items-center">
            <span className="text-xl md:text-4xl font-bold">750+</span>
            <span className="font-semibold text-sm md:text-lg">DESIGNS</span>
          </div>
          <div className="flex flex-col items-center">
            <span className="text-xl md:text-4xl font-bold">1000+</span>
            <span className="font-semibold text-sm md:text-lg">WEDDINGS</span>
          </div>
          <div className="flex flex-col items-center">
            <span className="text-2xl md:text-6xl font-bold">
              <FaInfinity />
            </span>
            <span className="font-semibold text-sm md:text-lg">
              <span className="md:hidden">{"😁"}</span>
              <span className="hidden md:inline">{"HAPPY"}</span> CUSTOMERS
            </span>
          </div>
        </div>{" "} */}
        {/* Categories Image Marquee */}
        {/* <div className="py-8">
          <p className="md:mt-6 text-2xl md:text-3xl mb-4 md:mb-8 font-semibold text-center">
            CATEGORIES
          </p>
          <div className="relative overflow-x-hidden flex flex-row flex-nowrap">
            <div className="animate-marquee whitespace-nowrap flex flex-row gap-3">
              {categoryList.map((item, index) => (
                <div
                  key={index}
                  className="overflow-hidden rounded-lg w-[33vw] md:w-[20vw] relative"
                >
                  <Link
                    href={`/decor/view?category=${encodeURIComponent(item)}`}
                    className="hover:z-40 transition-all"
                  >
                    <Image
                      src={`/assets/images/${item.toLowerCase()}.webp`}
                      alt="Decor"
                      width={0}
                      height={0}
                      sizes="100%"
                      style={{ width: "100%", height: "auto" }}
                      className="hover:scale-125 transition-all duration-500 hidden md:inline"
                    />
                    <Image
                      src={`/assets/images/${item.toLowerCase()}-mobile-text.webp`}
                      alt="Decor"
                      width={0}
                      height={0}
                      sizes="100%"
                      style={{ width: "100%", height: "auto" }}
                      className="hover:scale-125 transition-all duration-500 md:hidden"
                    />
                    <div className="hidden md:block origin-top-left bg-gradient-to-b to-white from-white/0 via-white/60 via-30% absolute bottom-0 pb-4 pt-6 w-full">
                      <p className="text-center">{item.toUpperCase()}</p>
                    </div>
                  </Link>
                </div>
              ))}
            </div>
            <div className="absolute top-0 animate-marquee2 whitespace-nowrap flex flex-row left-3 gap-3">
              {categoryList.map((item, index) => (
                <div
                  key={index}
                  className="relative overflow-hidden rounded-lg w-[33vw] md:w-[20vw]"
                >
                  <Link
                    href={`/decor/view?category=${encodeURIComponent(item)}`}
                    className="rounded-lg hover:overflow-hidden hover:z-40 transition-all"
                  >
                    <Image
                      src={`/assets/images/${item.toLowerCase()}.webp`}
                      alt="Decor"
                      width={0}
                      height={0}
                      sizes="100%"
                      style={{ width: "100%", height: "auto" }}
                      className="hover:scale-125 transition-all duration-500 hidden md:inline"
                    />
                    <Image
                      src={`/assets/images/${item.toLowerCase()}-mobile-text.webp`}
                      alt="Decor"
                      width={0}
                      height={0}
                      sizes="100%"
                      style={{ width: "100%", height: "auto" }}
                      className="hover:scale-125 transition-all duration-500 md:hidden"
                    />
                    <div className="hidden md:block origin-top-left bg-gradient-to-b to-white from-white/0 via-white/60 via-30% absolute bottom-0 pb-4 pt-6 w-full">
                      <p className="text-center">{item.toUpperCase()}</p>
                    </div>
                  </Link>
                </div>
              ))}
            </div>
          </div>
        </div> */}
        {/* <PlanYourEvent /> */}
        {/* <DecorQuotation userLoggedIn={userLoggedIn} user={user} /> */}
        {/* <div
          className={`py-6 md:py-20 px-4 md:px-24 text-center flex flex-col gap-6 ${styles.bg_main_section} mt-8`}
        >
          <h1 className="text-3xl uppercase font-semibold leading-relaxed">
            &#34;Transforming Wedding Dreams into Reality: The Art of Bespoke
            Decorations by Wedsy&#34;
          </h1>
          <p className="text-xl font-normal">
            Elevate your special day with Wedsy, renowned wedding decorators in
            Bangalore. Specializing in enchanting hall and flower decorations, our
            team creates bespoke experiences capturing the essence of your love
            story. From concept to the final touch, our flower decorators use only
            the freshest blooms for a stunning backdrop. Whether a lavish affair
            or intimate gathering, Wedsy&#39;s commitment to excellence brings
            your wedding visions to life with elegance. Trust us for unforgettable
            decorations as timeless as your wedding day.
          </p>
        </div> */}
        {/* <div className="py-6 md:py-12 px-4 md:px-24 flex flex-col gap-6 bg-gradient-to-b from-white to-[#CEA15B]">
          <Image
            src="/assets/images/decor-faq-img.webp"
            alt="Decor"
            width={0}
            height={0}
            sizes="100%"
            style={{
              width: "80vw",
              height: "auto",
              margin: "2em auto",
              marginBottom: "4em",
            }}
          />
          <h2 className="text-2xl uppercase font-semibold text-center mb-8">
            MOST FREQUENTLY ASKED QUESTIONS BY OUR CUSTOMERS
          </h2>
          <div className="divide-y-2 divide-black divide-dashed text-lg">
            <FAQAccordion
              question={"What is the event tool?"}
              answer={`The event tool is a specially designed organizational tool for your events. Simply create an event, such as "Rahul's wedding," and add multiple event days like haldi, sangeet, and the wedding ceremony. Once set up, easily add your selected decor to the respective event days. This tool ensures your event stays well-organized and hassle-free.`}
            />
            <FAQAccordion
              question={
                "What unique wedding decoration themes can Wedsy offer for my wedding in Bangalore?"
              }
              answer={`At Wedsy, we create a variety of stunning themes that range from traditional to contemporary for your wedding decoration needs. Our team specializes in customizing themes that resonate with your story, all the while incorporating the beauty of Bangalore's diverse culture.`}
            />
            <FAQAccordion
              question={`How can Wedsy enhance my wedding venue with exceptional wedding hall decoration?`}
              answer={`Our expert decorators at Wedsy are skilled in transforming any wedding hall in Bangalore into a magical setting. We carefully consider every element, from lighting to layout, ensuring that your wedding hall decoration is both breathtaking and memorable.`}
            />
            <FAQAccordion
              question={`Can I request specific types of flowers for my wedding flower decoration?`}
              answer={`Absolutely! We pride ourselves on personalizing each wedding flower decoration to your taste. Share your preferred flowers with us, and our talented flower decorators in Bangalore will incorporate them into your wedding's design palette with creativity and flair.`}
            />
            <FAQAccordion
              question={`Does Wedsy have packages for decorators in Bangalore?`}
              answer={`Yes, Wedsy offers a range of packages for wedding decorations that can be tailored to fit your specific needs and budget. Our packages include a variety of décor options curated by the best decorators in Bangalore to make your wedding truly exceptional.`}
            />
            <FAQAccordion
              question={`What makes Wedsy stand out from other wedding decorators in Bangalore?`}
              answer={`What sets Wedsy apart is our attention to detail and commitment to delivering personalized service. As leading wedding decorators in Bangalore, we pride ourselves on working closely with you to understand your vision and executing it beyond your expectations.`}
            />
            <FAQAccordion
              question={`How does Wedsy ensure the quality of wedding flower decoration?`}
              answer={`At Wedsy, quality is our top priority. Our flower decorators in Bangalore meticulously source the freshest, most vibrant flowers on the day of the event. Our designs are crafted to ensure the flowers maintain their beauty throughout your entire wedding day.`}
            />
          </div>
        </div> */}


      </>
    </div>
  );
}

export async function getServerSideProps(context) {
  try {
    const apiUrl = process.env.NEXT_PUBLIC_API_URL;
    if (!apiUrl) {
      console.warn("NEXT_PUBLIC_API_URL not configured; returning empty decor lists");
      return {
        props: {
          bestSellerBackdrops: [],
          grandEntry: [],
          bestSellerMandaps: [],
          furniture: [],
          popular: [],
          spotlightList: [],
        },
      };
    }

    const fetchJson = async (url) => {
      const res = await fetch(url, {
        method: 'GET',
        headers: { 'Content-Type': 'application/json' },
        signal: AbortSignal.timeout(10000),
      });
      if (!res.ok) {
        console.warn(`Decor API ${url} responded ${res.status}`);
        return null;
      }
      const ct = res.headers.get('content-type') || '';
      if (!ct.includes('application/json')) {
        console.warn(`Decor API ${url} returned non-JSON content-type: ${ct}`);
        return null;
      }
      return res.json().catch(() => null);
    };

    const [
      bestSellerBackdropsData,
      grandEntryData,
      bestSellerMandapsData,
      furnitureData,
      popularData,
      spotlightListData,
    ] = await Promise.all([
      fetchJson(`${apiUrl}/decor?label=bestSeller&category=Stage`),
      fetchJson(`${apiUrl}/decor?category=Entrance`),
      fetchJson(`${apiUrl}/decor?label=bestSeller&category=Mandap`),
      fetchJson(`${apiUrl}/decor?category=Furniture`),
      fetchJson(`${apiUrl}/decor?label=popular`),
      fetchJson(`${apiUrl}/decor?spotlight=true&random=false`),
    ]);

    const toList = (data) =>
      Array.isArray(data?.list) ? data.list.sort((a, b) => 0.5 - Math.random()) : [];
    const bestSellerBackdrops = toList(bestSellerBackdropsData);
    const grandEntry = toList(grandEntryData);
    const bestSellerMandaps = toList(bestSellerMandapsData);
    const furniture = toList(furnitureData);
    const popular = toList(popularData);
    const spotlightList = Array.isArray(spotlightListData?.list) ? spotlightListData.list : [];

    return {
      props: {
        bestSellerBackdrops,
        grandEntry,
        bestSellerMandaps,
        furniture,
        popular,
        spotlightList,
      },
    };
  } catch (error) {
    console.error("Error fetching data:", error);
    return {
      props: {
        bestSellerBackdrops: [],
        grandEntry: [],
        bestSellerMandaps: [],
        furniture: [],
        popular: [],
        spotlightList: [],
      },
    };
  }
}

export default Decor;
