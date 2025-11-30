import DecorCard from "@/components/cards/DecorCard";
import DecorDisclaimer from "@/components/marquee/DecorDisclaimer";
import { Dropdown } from "flowbite-react";
import Image from "next/image";
import Link from "next/link";
import Head from "next/head";
import { useEffect, useRef, useState } from "react";
import { BsInstagram } from "react-icons/bs";

function WeddingStore({ bestSeller, popular, spotlightList, categoryList }) {
  const [spotlightIndex, setSpotlightIndex] = useState(0);
  const spotlightRef = useRef(null);
  const spotlightHorizontalRef = useRef(null);
  const [spotlightSwipe, setSpotlightSwipe] = useState(null);

  useEffect(() => {
    let intervalId;
    const startAutoPlay = () => {
      intervalId = setInterval(() => {
        setSpotlightIndex(
          (prevSlide) => (prevSlide + 1) % spotlightList.length
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
  }, [spotlightIndex]);

  useEffect(() => {
    const handleTouchStart = (e) => {
      spotlightHorizontalRef.current = e.touches[0].clientX;
    };
    const handleTouchMove = (e) => {
      if (!spotlightHorizontalRef.current) return;
      const deltaX = e.touches[0].clientX - spotlightHorizontalRef.current;
      let sensitivity = 100;
      let l = spotlightList.length;
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

  // Generate ItemList Schema
  const itemListSchema = {
    "@context": "https://schema.org",
    "@type": "ItemList",
    "name": "Wedding Store - Decoration Items",
    "description": "Browse wedding decoration items including stages, mandaps, pathways, entrances, and more",
    "itemListElement": [
      ...(bestSeller?.slice(0, 10) || []).map((item, index) => ({
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
        "name": "Wedding Store",
        "item": "https://www.wedsy.in/wedding-store"
      }
    ]
  };

  return (
    <>
      <Head>
        <title>Wedding Store | Premium Wedding Decorations in Bangalore | Wedsy</title>
        <meta name="description" content="Explore Wedsy's wedding store for premium wedding decorations in Bangalore. Browse stages, mandaps, pathways, entrances, and more decoration items." />
        <meta name="keywords" content="wedding store, wedding decorations bangalore, wedding decor items, wedding stage decoration, wedding mandap decoration" />
        <meta name="robots" content="index, follow" />
        <link rel="canonical" href="https://www.wedsy.in/wedding-store" />
        
        {/* Open Graph Tags */}
        <meta property="og:title" content="Wedding Store | Premium Wedding Decorations in Bangalore | Wedsy" />
        <meta property="og:description" content="Explore Wedsy's wedding store for premium wedding decorations in Bangalore. Browse stages, mandaps, pathways, and more." />
        <meta property="og:image" content="https://www.wedsy.in/logo-black.png" />
        <meta property="og:url" content="https://www.wedsy.in/wedding-store" />
        <meta property="og:type" content="website" />
        <meta property="og:site_name" content="Wedsy" />
        
        {/* Twitter Card Tags */}
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:title" content="Wedding Store | Premium Wedding Decorations in Bangalore | Wedsy" />
        <meta name="twitter:description" content="Explore Wedsy's wedding store for premium wedding decorations in Bangalore." />
        <meta name="twitter:image" content="https://www.wedsy.in/logo-black.png" />
        
        {/* Structured Data */}
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(itemListSchema) }}
        />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbSchema) }}
        />
      </Head>
      <DecorDisclaimer />
      <div className="hidden md:block relative pt-[31%] mb-6">
        <Image
          src={"/assets/background/bg-wedding-store-text.png"}
          alt="Weddings Store"
          sizes="100%"
          layout={"fill"}
          objectFit="cover"
        />
      </div>
      <div className="flex flex-col gap-6 py-8 md:py-12 px-6 md:px-24 border-b">
        <p className="text-xl md:text-4xl font-medium text-center">
          THE <span className="font-bold">WEDDING</span> STORE
        </p>
        <div className="grid grid-cols-2 gap-2 md:gap-4">
          {categoryList?.map((item, index) => (
            <div
              key={index}
              className="h-20 md:h-24 object-cover text-white bg-gray-600 flex flex-col items-center justify-center uppercase md:text-lg rounded-lg md:rounded-none"
              style={
                item?.images?.landscapeImage
                  ? {
                      backgroundImage: `url(${item.images.landscapeImage})`,
                      backgroundSize: "cover",
                      backgroundPosition: "center",
                    }
                  : undefined
              }
            >
              {item?.name}
            </div>
          ))}
        </div>
      </div>
      {/* Spotlight */}
      <section className="md:px-24 md:py-12" id="spotlight">
        <p className="hidden md:block text-black text-lg md:text-2xl font-medium uppercase text-center mt-6">
          SPOTLIGHT
        </p>
        <div ref={spotlightRef} className="relative overflow-hidden">
          {spotlightList.length > 0 && (
            <div className="relative w-full" style={{ minHeight: '400px' }}>
              {spotlightList.map((item, index) => (
                item._id && (
                  <div
                    key={item._id || index}
                    className="absolute inset-0 w-full"
                    style={{
                      opacity: index === spotlightIndex ? 1 : 0,
                      transform: `translateX(${index === spotlightIndex ? 0 : index < spotlightIndex ? -30 : 30}px)`,
                      transition: 'opacity 0.3s cubic-bezier(0.4, 0, 0.2, 1), transform 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
                      pointerEvents: index === spotlightIndex ? 'auto' : 'none',
                      willChange: 'opacity, transform',
                    }}
                  >
                    <div
                      className={`grid grid-cols-1 md:grid-cols-2 md:m-6 mt-10 md:gap-8`}
                      style={{
                        backgroundColor: item.spotlightColor,
                      }}
                    >
                      <div className="relative h-72 md:hidden">
                        <Image
                          src={item.thumbnail}
                          alt="Decor Image"
                          width={0}
                          height={0}
                          sizes="100%"
                          layout={"fill"}
                          objectFit="cover"
                          className="w-full"
                        />
                        <div className="absolute p-4 bottom-0 w-full bg-black/70 text-white flex flex-row items-center">
                          <p className="text-xl grow">
                            {item.name}
                          </p>
                          <p className="text-xl">
                            ₹{" "}
                            {item.productInfo?.variant?.artificialFlowers?.sellingPrice ||
                              item.productInfo?.variant?.mixedFlowers?.sellingPrice ||
                              item.productInfo?.variant?.naturalFlowers?.sellingPrice}
                          </p>
                        </div>
                      </div>
                      <div className="hidden md:flex flex-col p-6 justify-between md:py-8 order-last md:order-first gap-4 md:gap-4">
                        <p className="text-xl md:text-3xl font-semibold">
                          {item.name}
                        </p>
                        <p className="hidden md:block">
                          {item.description}
                        </p>
                        <div className="flex flex-row justify-between mt-auto">
                          <p className="text-xl md:text-3xl font-semibold text-right md:text-left">
                            ₹{" "}
                            {item.productInfo?.variant?.artificialFlowers?.sellingPrice ||
                              item.productInfo?.variant?.mixedFlowers?.sellingPrice ||
                              item.productInfo?.variant?.naturalFlowers?.sellingPrice}
                          </p>
                          <Link
                            href={`/decor/view/${item._id}`}
                          >
                            <button className="mt-0 bg-black text-white py-2 px-4 md:px-8 rounded-lg">
                              View More
                            </button>
                          </Link>
                        </div>
                      </div>
                      <div className="relative h-full hidden md:block w-full">
                        <Image
                          src={item.thumbnail}
                          alt="Decor"
                          sizes="100%"
                          layout={"fill"}
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
          <div className="hidden md:flex flex-row gap-2 md:gap-4 items-center justify-center">
            {spotlightList.map((item, index) => (
              <span
                key={index}
                className={`cursor-pointer rounded-full transition-all duration-200 ease-in-out h-2 md:h-4 w-2 md:w-4 ${
                  index === spotlightIndex 
                    ? "bg-black scale-125" 
                    : "bg-gray-400 hover:bg-gray-500"
                }`}
                onClick={() => {
                  setSpotlightIndex(index);
                }}
              ></span>
            ))}
          </div>
        )}
      </section>

      <div className="py-8 flex flex-col gap-4 md:gap-6">
        <p className="text-2xl md:text-3xl font-medium text-center px-6 md:px-24">
          BEST SELLING <span className="text-rose-900">BACKDROPS</span>
          <span className="hidden md:inline float-right text-sm underline">
            see more
          </span>
        </p>
        <div className="hide-scrollbar grid grid-cols-2 md:flex flex-row gap-1 md:gap-8 flex-nowrap items-center px-3 md:px-0 my-2 md:my-6 overflow-x-auto">
          {bestSeller.map((item, index) => (
            <div className="md:min-w-[30vw] md:w-[33vw]" key={index}>
              <DecorCard decor={item} hideInfo={true} />
            </div>
          ))}
        </div>
      </div>
      <div className="py-8 flex flex-col gap-4 md:gap-6">
        <p className="text-2xl md:text-3xl font-medium text-center px-6 md:px-24">
          IDEAS FOR YOUR <span className="text-rose-900">GRAND ENTRY</span>
          <span className="hidden md:inline float-right text-sm underline">
            see more
          </span>
        </p>
        <div className="hide-scrollbar grid grid-cols-2 md:flex flex-row gap-1 md:gap-8 flex-nowrap items-center px-3 md:px-0 my-2 md:my-6 overflow-x-auto">
          {bestSeller.map((item, index) => (
            <div className="md:min-w-[30vw] md:w-[33vw]" key={index}>
              <DecorCard decor={item} hideInfo={true} />
            </div>
          ))}
        </div>
      </div>

      <div className="px-4 md:px-24 md:pb-6">
        <p className="text-black text-lg md:text-2xl font-medium uppercase text-center">
          PACKAGES
        </p>
        <div className="mt-8 grid grid-cols-2 gap-2 md:gap-4">
          <div className="bg-gray-500 h-20 md:h-24 rounded-lg md:rounded-none w-full" />
          <div className="bg-gray-500 h-20 md:h-24 rounded-lg md:rounded-none w-full" />
          <div className="bg-gray-500 h-20 md:h-24 rounded-lg md:rounded-none w-full" />
          <div className="bg-gray-500 h-20 md:h-24 rounded-lg md:rounded-none w-full" />
          <div className="bg-gray-500 h-20 md:h-24 rounded-lg md:rounded-none w-full" />
          <div className="bg-gray-500 h-20 md:h-24 rounded-lg md:rounded-none w-full" />
        </div>
      </div>
      <div className="hidden md:flex flex-row justify-between gap-12 my-4 py-4 border-y mx-24">
        <div className="flex flex-row items-center gap-4">
          <img src="/assets/icons/stage.png" className="h-12 w-12" />
          <p className="font-semibold">
            EXCLUSIVE
            <br /> DESIGNS
          </p>
        </div>
        <div className="flex flex-row items-center gap-4">
          <img src="/assets/icons/customize.png" className="h-12 w-12" />
          <p className="font-semibold">
            CUSTOMIZATION
            <br /> OPTIONS
          </p>
        </div>
        <div className="flex flex-row items-center gap-4">
          <img src="/assets/icons/customer-service.png" className="h-12 w-12" />
          <p className="font-semibold">
            EXCEPTIONAL
            <br /> CUSTOMER SERVICE
          </p>
        </div>
        <div className="flex flex-row items-center gap-4">
          <img src="/assets/icons/offer.png" className="h-12 w-12" />
          <p className="font-semibold">
            COMPETETIVE
            <br /> PRICING
          </p>
        </div>
      </div>

      <div className="py-8 flex flex-col gap-4 md:gap-6">
        <p className="text-2xl md:text-3xl font-medium text-center px-6 md:px-24">
          BEST SELLING <span className="text-rose-900">MANDAPS</span>
          <span className="hidden md:inline float-right text-sm underline">
            see more
          </span>
        </p>
        <div className="hide-scrollbar grid grid-cols-2 md:flex flex-row gap-1 md:gap-8 flex-nowrap items-center px-3 md:px-0 my-2 md:my-6 overflow-x-auto">
          {bestSeller.map((item, index) => (
            <div className="md:min-w-[30vw] md:w-[33vw]" key={index}>
              <DecorCard decor={item} hideInfo={true} />
            </div>
          ))}
        </div>
      </div>
      <div className="py-8 flex flex-col gap-4 md:gap-6">
        <p className="text-2xl md:text-3xl font-medium text-center px-6 md:px-24">
          BROWSE FROM A VARIETY OF{" "}
          <span className="text-rose-900">FURNITURE</span>
          <span className="hidden md:inline float-right text-sm underline">
            see more
          </span>
        </p>
        <div className="hide-scrollbar grid grid-cols-2 md:flex flex-row gap-1 md:gap-8 flex-nowrap items-center px-3 md:px-0 my-2 md:my-6 overflow-x-auto">
          {bestSeller.map((item, index) => (
            <div className="md:min-w-[30vw] md:w-[33vw]" key={index}>
              <DecorCard decor={item} hideInfo={true} />
            </div>
          ))}
        </div>
      </div>
      <div className="py-8 flex flex-col gap-4 md:gap-6">
        <p className="text-2xl md:text-3xl font-medium text-center px-6 md:px-24">
          <span className="text-rose-900">HALDI</span> DESIGNS
          <span className="hidden md:inline float-right text-sm underline">
            see more
          </span>
        </p>
        <div className="hide-scrollbar grid grid-cols-2 md:flex flex-row gap-1 md:gap-8 flex-nowrap items-center px-3 md:px-0 my-2 md:my-6 overflow-x-auto">
          {bestSeller.map((item, index) => (
            <div className="md:min-w-[30vw] md:w-[33vw]" key={index}>
              <DecorCard decor={item} hideInfo={true} />
            </div>
          ))}
        </div>
      </div>

      <div className="px-4 md:px-16 py-6 pb-12 flex flex-col gap-4">
        <div className="flex flex-row justify-center items-center gap-2 md:gap-4 text-xl md:text-3xl font-medium">
          <BsInstagram className="flex-shrink-0 text-rose-900" />
          <span>@ wedsy.in</span>
        </div>
        <p className="text-center text-sm md:text-lg md:px-16">
          {
            '"Looking for wedding inspirations? Visit our Instagram page to have a glimpse into the latest trends, stunning bridal looks, and real wedding stories."'
          }
        </p>
        <img
          src="/assets/images/instagram-image-desktop.png"
          className="hidden md:block w-full"
        />
        <img
          src="/assets/images/instagram-image-mobile.png"
          className="md:hidden w-full"
        />
      </div>
      <div className="pt-8 flex flex-col">
        <p className="md:hidden px-4 font-semibold text-center mb-4">
          {`“ A WEDDING IS NOT JUST A DAY, IT'S A JOURNEY, A STORY, AND A PROMISE OF A LIFETIME “`}
        </p>
        <img
          src="/assets/images/join-as-user-mobile.png"
          className="md:hidden w-full"
        />
        <img
          src="/assets/images/join-as-vendor-mobile.png"
          className="md:hidden w-full"
        />
        <div className="hidden md:grid grid-cols-2">
          <img
            src="/assets/images/join-as-vendor-desktop.png"
            className="w-full"
          />
          <img
            src="/assets/images/join-as-user-desktop.png"
            className="w-full"
          />
        </div>
      </div>
    </>
  );
}

export async function getServerSideProps(context) {
  try {
    const bestSellerResponse = await fetch(
      `${process.env.NEXT_PUBLIC_API_URL}/decor?label=bestSeller`
    );
    const bestSellerData = await bestSellerResponse.json();
    const popularResponse = await fetch(
      `${process.env.NEXT_PUBLIC_API_URL}/decor?label=popular`
    );
    const popularData = await popularResponse.json();
    const spotlightListResponse = await fetch(
      `${process.env.NEXT_PUBLIC_API_URL}/decor?spotlight=true&random=false`
    );
    const spotlightListData = await spotlightListResponse.json();
    const categoryListResponse = await fetch(
      `${process.env.NEXT_PUBLIC_API_URL}/category`
    );
    const categoryListData = await categoryListResponse.json();
    return {
      props: {
        bestSeller: bestSellerData.list.sort((a, b) => 0.5 - Math.random()),
        popular: popularData.list.sort((a, b) => 0.5 - Math.random()),
        spotlightList: spotlightListData.list,
        categoryList: categoryListData,
      },
    };
  } catch (error) {
    console.error("Error fetching data:", error);
    return {
      props: {
        bestSeller: null,
        popular: null,
        spotlightList: null,
        categoryList: null,
      },
    };
  }
}

export default WeddingStore;
