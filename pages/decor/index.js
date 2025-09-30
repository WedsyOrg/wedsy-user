import DecorCard from "@/components/cards/DecorCard";
import DecorQuotation from "@/components/screens/DecorQuotation";
import PlanYourEvent from "@/components/screens/PlanYourEvent";
import { processMobileNumber } from "@/utils/phoneNumber";
import { toProperCase } from "@/utils/text";
import { Spinner } from "flowbite-react";
import Head from "next/head";
import Image from "next/image";
import Link from "next/link";
import { useEffect, useRef, useState } from "react";
import { AiOutlinePlus } from "react-icons/ai";
import { BsArrowLeftShort, BsArrowRightShort } from "react-icons/bs";
import { FaInfinity } from "react-icons/fa";
import styles from "@/styles/DecorPage.module.css";
import FAQAccordion from "@/components/accordion/FAQAccordion";
import DecorDisclaimer from "@/components/marquee/DecorDisclaimer";
import { DecorPageSkeleton } from "@/components/skeletons/wedding-store";

function Decor({ bestSeller = [], popular = [], userLoggedIn, user, spotlightList = [] }) {
  const [isLoading, setIsLoading] = useState(true);
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

  // Use real data loading instead of simulated loading
  useEffect(() => {
    if (bestSeller && popular && spotlightList) {
      setIsLoading(false);
    }
  }, [bestSeller, popular, spotlightList]);

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

  // Best Seller handlers
  const handleBestSellerPrev = () => {
    const length = bestSeller ? bestSeller.length : 0;
    if (length === 0) return;
    const newIndices = bestSellerIndex.map(index =>
      (index - 1 + length) % length
    );
    setBestSellerIndex(newIndices);
    setBestSellerSlideOffset(prev => prev + 457);
  };

  const handleBestSellerNext = () => {
    const length = bestSeller ? bestSeller.length : 0;
    if (length === 0) return;
    const newIndices = bestSellerIndex.map(index =>
      (index + 1) % length
    );
    setBestSellerIndex(newIndices);
    setBestSellerSlideOffset(prev => prev - 457);
  };

  // Grand Entry handlers
  const handleGrandEntryPrev = () => {
    const length = bestSeller ? bestSeller.length : 0;
    if (length === 0) return;
    const newIndices = grandEntryIndex.map(index =>
      (index - 1 + length) % length
    );
    setGrandEntryIndex(newIndices);
    setGrandEntrySlideOffset(prev => prev + 457);
  };

  const handleGrandEntryNext = () => {
    const length = bestSeller ? bestSeller.length : 0;
    if (length === 0) return;
    const newIndices = grandEntryIndex.map(index =>
      (index + 1) % length
    );
    setGrandEntryIndex(newIndices);
    setGrandEntrySlideOffset(prev => prev - 457);
  };

  // Mandaps handlers
  const handleMandapsPrev = () => {
    const length = bestSeller ? bestSeller.length : 0;
    if (length === 0) return;
    const newIndices = mandapsIndex.map(index =>
      (index - 1 + length) % length
    );
    setMandapsIndex(newIndices);
    setMandapsSlideOffset(prev => prev + 457);
  };

  const handleMandapsNext = () => {
    const length = bestSeller ? bestSeller.length : 0;
    if (length === 0) return;
    const newIndices = mandapsIndex.map(index =>
      (index + 1) % length
    );
    setMandapsIndex(newIndices);
    setMandapsSlideOffset(prev => prev - 457);
  };

  // Furniture handlers
  const handleFurniturePrev = () => {
    const length = bestSeller ? bestSeller.length : 0;
    if (length === 0) return;
    const newIndices = furnitureIndex.map(index =>
      (index - 1 + length) % length
    );
    setFurnitureIndex(newIndices);
    setFurnitureSlideOffset(prev => prev + 457);
  };

  const handleFurnitureNext = () => {
    const length = bestSeller ? bestSeller.length : 0;
    if (length === 0) return;
    const newIndices = furnitureIndex.map(index =>
      (index + 1) % length
    );
    setFurnitureIndex(newIndices);
    setFurnitureSlideOffset(prev => prev - 457);
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
      }, 15000); // Change slide every 15 seconds
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

  // Show skeleton while loading
  if (isLoading) {
    return <DecorPageSkeleton />;
  }

  return (
    <div className="bg-[#F4F4F4] min-h-screen w-full">
      <>
        <Head>
          <meta
            name="google-site-verification"
            content="6NQH3LHjenBtdQYZzStAqCj51nFRb1P4Pb5jhIdugB0"
          />
          <title>
            Premium Wedding Decor Services | Wedding Stage Decoration in
            Bangalore
          </title>
          <meta
            name="description"
            content="Transform your wedding with Wedsy's premium decor services. Discover exquisite themes, floral arrangements, and custom setups designed to bring your dream wedding to life. Book now for a seamless experience."
          />
          <meta
            name="keywords"
            content="wedding decorations,wedding flower decoration,wedding hall decoration,flower decorators in bangalore,decorators in bangalore,wedding decorators in bangalore"
          />
          <link rel="canonical" href="https://www.wedsy.in/decor" />
          <meta name="robots" content="index, follow" />
          <meta name="copyright" content="Wedsy" />
          <meta name="language" content="EN" />
        </Head>
        {/* <div className="hidden">
          <h1>Wedding Decoration Packages - Wedsy&apos;s</h1>
          <h2>Wedding Stage Decoration in Bangalore</h2>
        </div>
        <DecorDisclaimer /> */}
        {/* MAIN SECTION (Tailwind version) */}
        <div className="w-full relative overflow-hidden hidden  md:block mb-[56px]">
          <img
            src="/assets/decor/decor-home.png"
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
                className="w-full h-[80px] sm:h-[100px] relative rounded-md overflow-hidden opacity-100 shadow-md transform transition duration-300 hover:scale-[1.03]"
              >
                <Link href={`/decor/view?category=${item}`} className="block w-full h-full">
                  <img
                    src={`/assets/decor/categories-img/${item.toLowerCase()}.jpg`}
                    alt={item}
                    className="w-full h-full object-cover brightness-75 transition duration-300 hover:brightness-100"
                  />
                  <div className="absolute top-0 left-0 w-full h-full flex items-center justify-center">
                    <span className="text-white text-[16px] sm:text-[24px] md:text-[28px] font-normal tracking-[2px] text-shadow-lg uppercase">
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
                  className="w-[calc(50%-0.5rem)] sm:max-w-[calc(50%-1.5rem)] md:max-w-[calc(50%-2rem)] h-[35px] sm:h-[100px] relative rounded-md overflow-hidden opacity-100 shadow-md transform transition duration-300 hover:scale-[1.03] bg-black flex items-center justify-start sm:justify-center cursor-pointer"
                >
                  <div className="flex items-center gap-2 text-white px-3 sm:px-0">
                    <span className="text-[10px] sm:text-[24px] md:text-[28px] font-normal tracking-[2px] uppercase">
                      {showAllCategories ? 'VIEW LESS' : 'VIEW MORE'}
                    </span>
                    <svg
                      className={`w-4 h-4 md:w-6 md:h-6 transition-transform duration-300 ${showAllCategories ? 'rotate-180' : ''}`}
                      fill="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path d="M7 14l5-5 5 5z" />
                    </svg>
                  </div>
                </div>
              </div>
              
              {/* more Section */}
              {showAllCategories && (
                <div className="w-full mt-6 bg-white rounded-md shadow-md p-4 md:p-6">
                  <div className="flex flex-wrap justify-center gap-4 md:gap-6">
                    {categoryList.map((item, index) => (
                      <div
                        key={index}
                        className="text-center px-2"
                      >
                        <Link href={`/decor/view?category=${item}`} className="hover:underline">
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
        <section className="px-6 md:px-24 mt-[60px]" id="spotlight">
          <p className="text-black text-[20px] md:text-4xl font-medium font-light leading-normal uppercase text-center mt-6">
            SPOTLIGHT
          </p>

          <div
            ref={spotlightRef}
            className="w-full max-w-[1200px] h-auto md:h-[301px] mt-[30px] md:mt-[65px] mb-[30px] mx-auto relative flex items-center justify-center"
          >

            {spotlightList.length > 0 && spotlightList[spotlightIndex]._id && (
              <div
                className="grid grid-cols-1 md:grid-cols-2 w-full h-full m-4 md:m-6 gap-4 md:gap-8"
                style={{
                  backgroundColor: spotlightList[spotlightIndex].spotlightColor,
                  borderRadius: 0,
                  boxShadow: '0 2px 24px rgba(0,0,0,0.08)',
                  overflow: 'hidden',
                }}
              >
                {/* Mobile-only thumbnail */}
                <div className="relative w-full h-48 sm:h-60 md:hidden">
                  <Image
                    src={spotlightList[spotlightIndex].thumbnail}
                    alt="Decor Image"
                    layout="fill"
                    objectFit="cover"
                    className="brightness-75"
                  />
                </div>

                {/* Text Content */}
                <div className="flex flex-col p-4 sm:p-6 justify-between order-last md:order-first gap-2 sm:gap-4">
                  <p className="text-xl md:text-3xl font-semibold">
                    {spotlightList[spotlightIndex].name}
                  </p>
                  <p className="hidden md:block font-medium">
                    {spotlightList[spotlightIndex].description}
                  </p>
                  <div className="flex justify-between items-center mt-4">
                    <p className="text-xl md:text-3xl font-semibold">
                      ₹{' '}
                      {
                        spotlightList[spotlightIndex].productInfo.variant
                          .artificialFlowers.sellingPrice ||
                        spotlightList[spotlightIndex].productInfo.variant
                          .mixedFlowers.sellingPrice ||
                        spotlightList[spotlightIndex].productInfo.variant
                          .naturalFlowers.sellingPrice
                      }
                    </p>
                    <Link href={`/decor/view/${spotlightList[spotlightIndex]._id}`}>
                      <button className="bg-black text-white py-2 px-4 md:px-8 rounded-lg">
                        View Details
                      </button>
                    </Link>
                  </div>
                </div>

                {/* Desktop-only thumbnail */}
                <div className="relative w-full hidden md:block h-full">
                  <Image
                    src={spotlightList[spotlightIndex].thumbnail}
                    alt="Decor"
                    layout="fill"
                    objectFit="cover"
                  />
                </div>
              </div>
            )}
          </div>

          {spotlightList.length > 0 && (
            <div className="flex gap-2 md:gap-3 items-center justify-center">
              {spotlightList.map((_, i) => (
                <span
                  key={i}
                  className={`cursor-pointer rounded-full transition-colors h-2 md:h-3 w-2 md:w-3 ${i === spotlightIndex ? 'bg-black' : 'bg-gray-400'
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


          {/* Desktop Slider */}
          <div className="hidden md:flex relative w-full justify-center items-center my-6">
            <img
              src="/assets/decor/icons/left-arrow.png"
              alt="Previous"
              className="cursor-pointer absolute left-16 z-10 top-1/2 -translate-y-1/2 scale-[0.5] md:scale-[1] w-12 h-12"
              onClick={handleBestSellerPrev}
            />
            <div className="flex gap-6 justify-center w-full overflow-hidden">
              <div
                className="flex gap-6 transition-transform duration-500 ease-in-out"
                style={{
                  transform: `translateX(-${bestSellerSlideOffset}px)`
                }}
              >
                {bestSellerIndex.map((index, idx) =>
                  bestSeller[index] ? (
                    <div key={`${index}-${bestSellerSlideOffset}`} className="relative group w-[451px] h-[241px] rounded-[30px] overflow-hidden">
                      <div className="w-full h-full transition-transform duration-300 group-hover:scale-105">
                        <DecorCard
                          decor={bestSeller[index]}
                          className="w-full h-full rounded-[30px] overflow-hidden"
                          hideInfo={true}
                        />
                      </div>
                      {/* Hover overlay for name and price */}
                      <div className="hidden md:flex flex-col justify-end absolute inset-0 bg-gradient-to-t from-black/60 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 p-6">
                        <h3 className="text-lg font-semibold text-white mb-1">{bestSeller[index].name}</h3>
                        <p className="text-base font-semibold text-white">₹ {bestSeller[index].productTypes?.[0]?.sellingPrice}</p>
                      </div>
                    </div>
                  ) : null
                )}
              </div>
            </div>
            <img
              src="/assets/decor/icons/right-arrow.png"
              alt="Next"
              className="cursor-pointer absolute right-16 z-10 top-1/2 -translate-y-1/2 scale-[0.5] md:scale-[1] w-12 h-12"
              onClick={handleBestSellerNext}
            />
          </div>


          {/* Mobile Slider - 4 boxes per slide */}
          <div className="md:hidden px-4">
            <div
              className="flex gap-4 overflow-x-auto snap-x scroll-smooth hide-scrollbar mobile-slider"
              onScroll={(e) => {
                const scrollLeft = e.target.scrollLeft;
                const slideWidth = e.target.scrollWidth / Math.ceil(bestSeller.length / 4);
                const newSlide = Math.round(scrollLeft / slideWidth);
                setCurrentSlide(newSlide);
              }}
            >
              {Array.from({ length: Math.ceil(bestSeller.length / 4) }, (_, groupIndex) => (
                <div
                  key={groupIndex}
                  className="min-w-full snap-start grid grid-cols-2 gap-4"
                >
                  {bestSeller
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
              {Array.from({ length: Math.ceil(bestSeller.length / 4) }, (_, i) => (
                <span
                  key={i}
                  className={`rounded-full h-2 w-2 cursor-pointer transition-colors duration-300 ${i === currentSlide ? 'bg-black' : 'bg-gray-400'
                    }`}
                  onClick={() => {
                    const slider = document.querySelector('.overflow-x-auto');
                    if (slider) {
                      const slideWidth = slider.scrollWidth / Math.ceil(bestSeller.length / 4);
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
                  GRAND ENTRY
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


          {/* Desktop Slider */}
          <div className="hidden md:flex relative w-full justify-center items-center my-6">
            <img
              src="/assets/decor/icons/left-arrow.png"
              alt="Previous"
              className="cursor-pointer absolute left-16 z-10 top-1/2 -translate-y-1/2 scale-[0.5] md:scale-[1] w-12 h-12"
              onClick={handleGrandEntryPrev}
            />
            <div className="flex gap-6 justify-center w-full overflow-hidden">
              <div
                className="flex gap-6 transition-transform duration-500 ease-in-out"
                style={{
                  transform: `translateX(-${grandEntrySlideOffset}px)`
                }}
              >
                {grandEntryIndex.map((index, idx) =>
                  bestSeller[index] ? (
                    <div key={`${index}-${grandEntrySlideOffset}`} className="relative group w-[451px] h-[241px] rounded-[30px] overflow-hidden">
                      <div className="w-full h-full transition-transform duration-300 group-hover:scale-105">
                        <DecorCard
                          decor={bestSeller[index]}
                          className="w-full h-full rounded-[30px] overflow-hidden"
                          hideInfo={true}
                        />
                      </div>
                      {/* Hover overlay for name and price */}
                      <div className="hidden md:flex flex-col justify-end absolute inset-0 bg-gradient-to-t from-black/60 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 p-6">
                        <h3 className="text-lg font-semibold text-white mb-1">{bestSeller[index].name}</h3>
                        <p className="text-base font-semibold text-white">₹ {bestSeller[index].productTypes?.[0]?.sellingPrice}</p>
                      </div>
                    </div>
                  ) : null
                )}
              </div>
            </div>
            <img
              src="/assets/decor/icons/right-arrow.png"
              alt="Next"
              className="cursor-pointer absolute right-16 z-10 top-1/2 -translate-y-1/2 scale-[0.5] md:scale-[1] w-12 h-12"
              onClick={handleGrandEntryNext}
            />
          </div>


          {/* Mobile Slider - 4 boxes per slide */}
          <div className="md:hidden px-4">
            <div
              className="flex gap-4 overflow-x-auto snap-x scroll-smooth hide-scrollbar mobile-slider"
              onScroll={(e) => {
                const scrollLeft = e.target.scrollLeft;
                const slideWidth = e.target.scrollWidth / Math.ceil(bestSeller.length / 4);
                const newSlide = Math.round(scrollLeft / slideWidth);
                setCurrentSlide(newSlide);
              }}
            >
              {Array.from({ length: Math.ceil(bestSeller.length / 4) }, (_, groupIndex) => (
                <div
                  key={groupIndex}
                  className="min-w-full snap-start grid grid-cols-2 gap-4"
                >
                  {bestSeller
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
              {Array.from({ length: Math.ceil(bestSeller.length / 4) }, (_, i) => (
                <span
                  key={i}
                  className={`rounded-full h-2 w-2 cursor-pointer transition-colors duration-300 ${i === currentSlide ? 'bg-black' : 'bg-gray-400'
                    }`}
                  onClick={() => {
                    const slider = document.querySelector('.overflow-x-auto');
                    if (slider) {
                      const slideWidth = slider.scrollWidth / Math.ceil(bestSeller.length / 4);
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
              { label: "NORTH INDIAN", image: "north-indian.jpg" },
              { label: "SOUTH INDIAN", image: "south indian.jpg" },
              { label: "MUSLIM", image: "muslim.jpg" },
              { label: "RECEPTION", image: "reception.jpg" },
              { label: "ADD ONS", image: "add ons.jpg" },
            ].map((pkg, index) => (
              <div
                key={index}
                className="w-full h-[60px] md:h-[100px] relative rounded-md overflow-hidden opacity-100 shadow-md transform transition duration-300 hover:scale-[1.03]"
              >
                <a href="#" className="block w-full h-full">
                  <img
                    src={`/assets/decor/packages-img/${pkg.image}`}
                    alt={pkg.label}
                    className="w-full h-full object-cover brightness-75 transition duration-300 hover:brightness-100"
                  />
                  <div className="absolute top-0 left-0 w-full h-full flex items-center justify-center">
                    <span className="text-white text-[12px] md:text-[32px] font-normal tracking-[0.5px] md:tracking-[2px] text-shadow-lg uppercase text-center px-1 md:px-0">
                      {pkg.label}
                    </span>
                  </div>
                </a>
              </div>
            ))}

            {/* View More */}
            <div className="w-full h-[60px] md:h-[100px] relative rounded-md overflow-hidden opacity-100 shadow-md bg-black flex items-center justify-center transform transition duration-300 hover:scale-[1.03]">
              <a href="#" className="block w-full h-full flex items-center justify-center">
                <span className="text-white text-[12px] md:text-[32px] font-normal tracking-[0.5px] md:tracking-[2px] text-shadow-lg uppercase">
                  VIEW MORE
                </span>
              </a>
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
              <img src="/assets/decor/icons/exclusive designs.png" alt="Rainbow" className="w-8 h-8 md:w-12 md:h-12" />
              <div className="flex flex-col text-left">
                <span className="font-semibold text-sm md:text-lg leading-tight">EXCLUSIVE</span>
                <span className="font-semibold text-sm md:text-lg leading-tight">DESIGNS</span>
              </div>
            </div>
            {/* Customization Options */}
            <div className="flex flex-row items-center gap-2 md:gap-4">
              {/* Sliders Icon */}
              <img src="/assets/decor/icons/customization options.png" alt="Sliders" className="w-8 h-8 md:w-12 md:h-12" />
              <div className="flex flex-col text-left">
                <span className="font-semibold text-sm md:text-lg leading-tight">CUSTOMIZATION</span>
                <span className="font-semibold text-sm md:text-lg leading-tight">OPTIONS</span>
              </div>
            </div>
            {/* Exceptional Customer Service */}
            <div className="flex flex-row items-center gap-2 md:gap-4">
              {/* Headset Icon */}
              <img src="/assets/decor/icons/exceptional customer service.png" alt="Headset" className="w-8 h-8 md:w-12 md:h-12" />
              <div className="flex flex-col text-left">
                <span className="font-semibold text-sm md:text-lg leading-tight">EXCEPTIONAL</span>
                <span className="font-semibold text-sm md:text-lg leading-tight">CUSTOMER SERVICE</span>
              </div>
            </div>
            {/* Competitive Pricing */}
            <div className="flex flex-row items-center gap-2 md:gap-4">
              {/* Badge Icon */}
              <img src="/assets/decor/icons/competetive pricing.png" alt="Badge" className="w-8 h-8 md:w-12 md:h-12" />
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


          {/* Desktop Slider */}
          <div className="hidden md:flex relative w-full justify-center items-center my-6">
            <img
              src="/assets/decor/icons/left-arrow.png"
              alt="Previous"
              className="cursor-pointer absolute left-16 z-10 top-1/2 -translate-y-1/2 scale-[0.5] md:scale-[1] w-12 h-12"
              onClick={handleMandapsPrev}
            />
            <div className="flex gap-6 justify-center w-full overflow-hidden">
              <div
                className="flex gap-6 transition-transform duration-500 ease-in-out"
                style={{
                  transform: `translateX(-${mandapsSlideOffset}px)`
                }}
              >
                {mandapsIndex.map((index, idx) =>
                  bestSeller[index] ? (
                    <div key={`${index}-${mandapsSlideOffset}`} className="relative group w-[451px] h-[241px] rounded-[30px] overflow-hidden">
                      <div className="w-full h-full transition-transform duration-300 group-hover:scale-105">
                        <DecorCard
                          decor={bestSeller[index]}
                          className="w-full h-full rounded-[30px] overflow-hidden"
                          hideInfo={true}
                        />
                      </div>
                      {/* Hover overlay for name and price */}
                      <div className="hidden md:flex flex-col justify-end absolute inset-0 bg-gradient-to-t from-black/60 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 p-6">
                        <h3 className="text-lg font-semibold text-white mb-1">{bestSeller[index].name}</h3>
                        <p className="text-base font-semibold text-white">₹ {bestSeller[index].productTypes?.[0]?.sellingPrice}</p>
                      </div>
                    </div>
                  ) : null
                )}
              </div>
            </div>
            <img
              src="/assets/decor/icons/right-arrow.png"
              alt="Next"
              className="cursor-pointer absolute right-16 z-10 top-1/2 -translate-y-1/2 scale-[0.5] md:scale-[1] w-12 h-12"
              onClick={handleMandapsNext}
            />
          </div>


          {/* Mobile Slider - 4 boxes per slide */}
          <div className="md:hidden px-4">
            <div
              className="flex gap-4 overflow-x-auto snap-x scroll-smooth hide-scrollbar mobile-slider"
              onScroll={(e) => {
                const scrollLeft = e.target.scrollLeft;
                const slideWidth = e.target.scrollWidth / Math.ceil(bestSeller.length / 4);
                const newSlide = Math.round(scrollLeft / slideWidth);
                setCurrentSlide(newSlide);
              }}
            >
              {Array.from({ length: Math.ceil(bestSeller.length / 4) }, (_, groupIndex) => (
                <div
                  key={groupIndex}
                  className="min-w-full snap-start grid grid-cols-2 gap-4"
                >
                  {bestSeller
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
              {Array.from({ length: Math.ceil(bestSeller.length / 4) }, (_, i) => (
                <span
                  key={i}
                  className={`rounded-full h-2 w-2 cursor-pointer transition-colors duration-300 ${i === currentSlide ? 'bg-black' : 'bg-gray-400'
                    }`}
                  onClick={() => {
                    const slider = document.querySelector('.overflow-x-auto');
                    if (slider) {
                      const slideWidth = slider.scrollWidth / Math.ceil(bestSeller.length / 4);
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


          {/* Desktop Slider */}
          <div className="hidden md:flex relative w-full justify-center items-center my-6">
            <img
              src="/assets/decor/icons/left-arrow.png"
              alt="Previous"
              className="cursor-pointer absolute left-16 z-10 top-1/2 -translate-y-1/2 scale-[0.5] md:scale-[1] w-12 h-12"
              onClick={handleFurniturePrev}
            />
            <div className="flex gap-6 justify-center w-full overflow-hidden">
              <div
                className="flex gap-6 transition-transform duration-500 ease-in-out"
                style={{
                  transform: `translateX(-${furnitureSlideOffset}px)`
                }}
              >
                {furnitureIndex.map((index, idx) =>
                  bestSeller[index] ? (
                    <div key={`${index}-${furnitureSlideOffset}`} className="relative group w-[451px] h-[241px] rounded-[30px] overflow-hidden">
                      <div className="w-full h-full transition-transform duration-300 group-hover:scale-105">
                        <DecorCard
                          decor={bestSeller[index]}
                          className="w-full h-full rounded-[30px] overflow-hidden"
                          hideInfo={true}
                        />
                      </div>
                      {/* Hover overlay for name and price */}
                      <div className="hidden md:flex flex-col justify-end absolute inset-0 bg-gradient-to-t from-black/60 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 p-6">
                        <h3 className="text-lg font-semibold text-white mb-1">{bestSeller[index].name}</h3>
                        <p className="text-base font-semibold text-white">₹ {bestSeller[index].productTypes?.[0]?.sellingPrice}</p>
                      </div>
                    </div>
                  ) : null
                )}
              </div>
            </div>
            <img
              src="/assets/decor/icons/right-arrow.png"
              alt="Next"
              className="cursor-pointer absolute right-16 z-10 top-1/2 -translate-y-1/2 scale-[0.5] md:scale-[1] w-12 h-12"
              onClick={handleFurnitureNext}
            />
          </div>


          {/* Mobile Slider - 4 boxes per slide */}
          <div className="md:hidden px-4">
            <div
              className="flex gap-4 overflow-x-auto snap-x scroll-smooth hide-scrollbar mobile-slider"
              onScroll={(e) => {
                const scrollLeft = e.target.scrollLeft;
                const slideWidth = e.target.scrollWidth / Math.ceil(bestSeller.length / 4);
                const newSlide = Math.round(scrollLeft / slideWidth);
                setCurrentSlide(newSlide);
              }}
            >
              {Array.from({ length: Math.ceil(bestSeller.length / 4) }, (_, groupIndex) => (
                <div
                  key={groupIndex}
                  className="min-w-full snap-start grid grid-cols-2 gap-4"
                >
                  {bestSeller
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
              {Array.from({ length: Math.ceil(bestSeller.length / 4) }, (_, i) => (
                <span
                  key={i}
                  className={`rounded-full h-2 w-2 cursor-pointer transition-colors duration-300 ${i === currentSlide ? 'bg-black' : 'bg-gray-400'
                    }`}
                  onClick={() => {
                    const slider = document.querySelector('.overflow-x-auto');
                    if (slider) {
                      const slideWidth = slider.scrollWidth / Math.ceil(bestSeller.length / 4);
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
                    src="/assets/decor/photobooth-img/pb1.png"
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
                      src="/assets/decor/photobooth-img/pb2.jpg"
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
                      src="/assets/decor/photobooth-img/pb3.png"
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
                      src="/assets/decor/photobooth-img/pb4.jpg"
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
                      src="/assets/decor/photobooth-img/pb5.jpg"
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
                  src="/assets/decor/photobooth-img/pb1.png"
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
                  src="/assets/decor/photobooth-img/pb2.jpg"
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
                  src="/assets/decor/photobooth-img/pb3.png"
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
                  src="/assets/decor/photobooth-img/pb4.jpg"
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
                  src="/assets/decor/photobooth-img/pb5.jpg"
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
                  <img
                    src={src}
                    alt={`image-${index}`}
                    className="w-full h-full object-cover"
                  />
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
                    href={`/decor/view?category=${item}`}
                    className="hover:z-40 transition-all"
                  >
                    <Image
                      src={`/assets/images/${item.toLowerCase()}.png`}
                      alt="Decor"
                      width={0}
                      height={0}
                      sizes="100%"
                      style={{ width: "100%", height: "auto" }}
                      className="hover:scale-125 transition-all duration-500 hidden md:inline"
                    />
                    <Image
                      src={`/assets/images/${item.toLowerCase()}-mobile-text.png`}
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
                    href={`/decor/view?category=${item}`}
                    className="rounded-lg hover:overflow-hidden hover:z-40 transition-all"
                  >
                    <Image
                      src={`/assets/images/${item.toLowerCase()}.png`}
                      alt="Decor"
                      width={0}
                      height={0}
                      sizes="100%"
                      style={{ width: "100%", height: "auto" }}
                      className="hover:scale-125 transition-all duration-500 hidden md:inline"
                    />
                    <Image
                      src={`/assets/images/${item.toLowerCase()}-mobile-text.png`}
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
            src="/assets/images/decor-faq-img.png"
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
          bestSeller: [],
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

    const [bestSellerData, popularData, spotlightListData] = await Promise.all([
      fetchJson(`${apiUrl}/decor?label=bestSeller`),
      fetchJson(`${apiUrl}/decor?label=popular`),
      fetchJson(`${apiUrl}/decor?spotlight=true&random=false`),
    ]);

    const bestSeller = Array.isArray(bestSellerData?.list)
      ? bestSellerData.list.sort((a, b) => 0.5 - Math.random())
      : [];
    const popular = Array.isArray(popularData?.list)
      ? popularData.list.sort((a, b) => 0.5 - Math.random())
      : [];
    const spotlightList = Array.isArray(spotlightListData?.list)
      ? spotlightListData.list
      : [];

    return {
      props: { bestSeller, popular, spotlightList },
    };
  } catch (error) {
    console.error("Error fetching data:", error);
    return {
      props: { bestSeller: [], popular: [], spotlightList: [] },
    };
  }
}

export default Decor;
