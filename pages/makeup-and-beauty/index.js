import React,{Suspense} from "react";
import FAQAccordion from "@/components/accordion/FAQAccordion";
import MobileStickyFooter from "@/components/layout/MobileStickyFooter";
import { MakeupAndBeautyPageSkeleton } from "@/components/skeletons/makeup-store";
import { toPriceString } from "@/utils/text";
import Link from "next/link";
import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import {
  FaArrowLeft,
  FaArrowRight,
  FaChevronLeft,
  FaChevronRight,
  FaMapMarkerAlt,
  FaSearch,
  FaStar,
} from "react-icons/fa";
import { MdChevronRight } from "react-icons/md";
const VendorUserSection = React.lazy(() => import("@/pages/reuseableComponents/VendorUserSection"));


function MakeupAndBeauty({ userLoggedIn, setOpenLoginModalv2, setSource }) {
  const router = useRouter();
  const [search, setSearch] = useState("");
  const [wedsyPackages, setWedsyPackages] = useState([]);
  const [vendors, setVendors] = useState([]);
  const [displayWedsyPackages, setDisplayWedsyPackages] = useState([
    0, 1, 2, 3,
  ]);
  const [selectedPackages, setSelectedPackages] = useState([]);
  const [taxationData, setTaxationData] = useState({});
  const [wedsyPackageTaxMultiply, setWedsyPackageTaxMultiply] = useState(1);
  const [isLoading, setIsLoading] = useState(true);
  const fetchTaxationData = () => {
    return fetch(`${process.env.NEXT_PUBLIC_API_URL}/config?code=MUA-Taxation`, {
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
    return fetch(`${process.env.NEXT_PUBLIC_API_URL}/wedsy-package`, {
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
        return Promise.all(
          response.map((i) => ({
            _id: i._id,
            quantity: 0,
            price: i.price,
          }))
        ).then((r) => {
          setSelectedPackages(r);
          setWedsyPackages(response);
          if (response.length < 4) {
            if (response.length === 1) {
              setDisplayWedsyPackages([0, 0, 0, 0]);
            }
            if (response.length === 2) {
              setDisplayWedsyPackages([0, 1, 0, 1]);
            }
            if (response.length === 3) {
              setDisplayWedsyPackages([0, 1, 2, 0]);
            }
          }
        });
      })
      .catch((error) => {
        console.error("There was a problem with the fetch operation:", error);
      });
  };
  const fetchVendors = () => {
    return fetch(`${process.env.NEXT_PUBLIC_API_URL}/vendor`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        authorization: `Bearer ${localStorage.getItem("token")}`,
      },
    })
      .then((response) => response.json())
      .then((response) => {
        console.log(response);
        setVendors(response);
      })
      .catch((error) => {
        console.error("There was a problem with the fetch operation:", error);
      });
  };
  useEffect(() => {
    setIsLoading(true);
    Promise.all([fetchWedsyPackages(), fetchVendors(), fetchTaxationData()]).finally(() => {
      setTimeout(() => setIsLoading(false), 1500);
    });
  }, []);

  // Custom colors from the provided image
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


  if (isLoading) {
    return <MakeupAndBeautyPageSkeleton />;
  }

  return (
    <>
      <MobileStickyFooter />
      {selectedPackages?.reduce((accumulator, item) => {
        return accumulator + item.quantity;
      }, 0) > 0 && (
        <div className="bg-white fixed left-0 bottom-16 md:bottom-0 px-4 md:px-24 py-3 w-full z-50 flex flex-row items-center gap-4 items-center">
          <button
            className="py-2 px-6 rounded-md bg-black text-white shadow-md"
            onClick={() => {
              localStorage.setItem(
                "wedsy-package-cart",
                JSON.stringify(selectedPackages)
              );
              if (!userLoggedIn) {
                setSource("Makeup & Beauty Packages");
                setOpenLoginModalv2(true);
              } else {
                router.push("/makeup-and-beauty/wedsy-packages/checkout");
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
                }, 0) * wedsyPackageTaxMultiply
              )}
            </span>
          </div>
        </div>
      )}

      <div className="bg-[#f4f4f4] uppercase px-12 text-center md:text-left md:px-24 py-6 md:py-12 text-2xl md:text-4xl font-semibold md:font-medium mb-1">
        Makeup & Beauty
      </div>


      <div className="bg-[#f4f4f4] py-4 px-6 md:hidden mb-1">
        <p className="text-lg text-center font-medium">
          BOOK YOUR MAKEUP ARTIST NOW
        </p>
        <p className="text-center uppercase text-xs my-2">
          Compare free quotes from local wedding makeup artists now!
        </p>
        <button
          className="w-full rounded-lg py-3 text-white bg-[#840032]"
          onClick={() => router.push("/makeup-and-beauty/artists")}
        >
          BOOK NOW
        </button>
      </div>


      <div className="bg-[#f4f4f4] py-4 px-6 grid grid-cols-2 gap-4 md:hidden">
        <img
          src="/assets/images/makeup-landing-page-4.png"
          className="w-full"
          onClick={() => router.push("/makeup-and-beauty/wedsy-packages")}
        />
        <img
          src="/assets/images/makeup-landing-page-5.png"
          className="w-full"
          onClick={() => router.push("/makeup-and-beauty/artists")}
        />
        <img
          src="/assets/images/makeup-landing-page-6.png"
          className="w-full"
          onClick={() => router.push("/makeup-and-beauty/bidding")}
        />
        <img
          src="/assets/images/makeup-landing-page-7.png"
          className="w-full"
          onClick={() => router.push("/makeup-and-beauty/artists")}
        />
      </div>

      <img
        src="/assets/images/makeup-landing-page-8.png"
        className="w-full md:hidden"
      />

      {/* wedsy top-image section */}
      <div className="bg-[#f4f4f4] py-12 grid-cols-4 gap-4 px-24 mb-1 hidden md:grid">
        <div className="flex flex-col gap-4 py-12 mr-24">
          <Link
            className="flex flex-row justify-between text-2xl items-center"
            href="/makeup-and-beauty/wedsy-packages"
          >
            <span>Makeup Packages</span>
            <MdChevronRight cursor={"pointer"} />
          </Link>
          <Link
            className="flex flex-row justify-between text-2xl items-center"
            href="/makeup-and-beauty/artists"
          >
            <span>Vendor Packages</span>
            <MdChevronRight cursor={"pointer"} />
          </Link>
          <Link
            className="flex flex-row justify-between text-2xl items-center"
            href="/makeup-and-beauty/bidding"
          >
            <span>Bidding</span>
            <MdChevronRight cursor={"pointer"} />
          </Link>
          <Link
            className="flex flex-row justify-between text-2xl items-center"
            href="/makeup-and-beauty/artists"
          >
            <span>Makeup Artists</span>
            <MdChevronRight cursor={"pointer"} />
          </Link>
        </div>
        <img
          className="w-full col-span-3"
          src="/assets/images/makeup-landing-page-1.png"
          alt="Makeup and Beauty Landing Image"
        />
      </div>


      <div className="bg-[#f4f4f4] uppercase px-24 py-12 text-4xl font-medium md:mb-1">
        Packages
      </div>

      
      {/* Wedsy Packages bottom section*/}
      {/* MOBILE-ONLY PACKAGE SECTION */}
        <div className="bg-[#f4f4f4] pt-0 md:hidden mb-1">
          <div className="px-6 flex flex-col gap-8 md:px-0 w-full mb-8">
            {wedsyPackages.length > 0 &&
              wedsyPackages.slice(0, 2).map((pkg, index) => {
                const colorSet = MobileColors[index] || MobileColors[0];
                const isSelected = selectedPackages?.find((i) => i._id === pkg._id)?.quantity > 0;
                const quantity = isSelected ? selectedPackages?.find((i) => i._id === pkg._id)?.quantity : 0;
                const originalPrice = pkg?.price || 0;
                const discountedPrice = (pkg?.price || 0) * wedsyPackageTaxMultiply;

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
                          {pkg?.process ? pkg.process.map((i, i1) => (
                            <li key={i1}>&bull; {i.topic}</li>
                          )) : <li>No services listed</li>}
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
        <div className="bg-[#f4f4f4] px-24 py-12 pt-0 mb-1 hidden md:block">
          <div className="relative flex items-center justify-center">
            {/* Left Arrow Navigation */}
            <div className="absolute left-0 w-24 hidden md:flex flex-col justify-center items-center z-10">
              {displayWedsyPackages[0] > 0 && (
                <div
                  className="rounded-full border border-black p-2 cursor-pointer"
                  onClick={() => {
                    setDisplayWedsyPackages((prev) => {
                      let startIndex = prev[0] - 4;
                      if (startIndex < 0) {
                        startIndex = 0;
                      }
                      return [
                        startIndex,
                        startIndex + 1,
                        startIndex + 2,
                        startIndex + 3,
                      ];
                    });
                  }}
                >
                  <FaArrowLeft size={20} />
                </div>
              )}
            </div>
            {/* Right Arrow Navigation */}
            <div className="absolute right-0 w-24 hidden md:flex flex-col justify-center items-center z-10">
              {displayWedsyPackages[3] < wedsyPackages.length - 1 && (
                <div
                  className="rounded-full border border-black p-2 cursor-pointer"
                  onClick={() => {
                    setDisplayWedsyPackages((prev) => {
                      let endIndex = prev[3] + 4;
                      if (endIndex > wedsyPackages.length - 1)
                        endIndex = wedsyPackages.length - 1;
                      return [endIndex - 3, endIndex - 2, endIndex - 1, endIndex];
                    });
                  }}
                >
                  <FaArrowRight size={20} />
                </div>
              )}
            </div>
            {/* Package Grid */}
            {wedsyPackages.length > 0 && (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8 md:gap-0 px-6 md:px-0 w-full mb-8">
                {[
                  wedsyPackages[displayWedsyPackages[0]],
                  wedsyPackages[displayWedsyPackages[1]],
                  wedsyPackages[displayWedsyPackages[2]],
                  wedsyPackages[displayWedsyPackages[3]],
                ].map((pkg, index) => {
                  const colorSet = colors[index] || colors[0];
                  return (
                    <div
                      key={pkg?._id}
                      className="flex flex-col rounded-2xl md:rounded-none overflow-hidden shadow-md md:border-2 md:border-white"
                    >
                      {/* Package Name Header */}
                      <div
                        className="text-center py-4 font-semibold text-black uppercase md:border-b-2 md:border-white"
                        style={{ backgroundColor: colorSet.header,fontFamily: "Montserrat" }}
                      >
                        {pkg?.name || "Package"}
                      </div>
                      
                      {/* Services Section */}
                      <div
                        className="flex flex-col items-center justify-center py-6 md:py-10"
                        style={{ backgroundColor: colorSet.services,fontFamily: "Montserrat" }}
                      >
                        <h4 className="mb-1 text-black font-normal uppercase">Services</h4>
                        <p className="hidden md:block text-black font-semibold text-xl text-center px-4">
                          {pkg?.process ? pkg.process.map((i) => i.topic).join(", ") : "No services listed"}
                        </p>
                        <ul className="md:hidden text-center">
                          {pkg?.process ? pkg.process.map((i, i1) => (
                            <li key={i1} className="font-medium text-black">
                              {i.topic}
                            </li>
                          )) : <li className="font-medium text-black">No services listed</li>}
                        </ul>
                      </div>
                      
                      {/* Products Section */}
                      <div
                        className="relative flex flex-col items-center justify-center py-6 md:py-10"
                        style={{ backgroundColor: colorSet.products,fontFamily: "Montserrat" }}
                      >
                        <div className="absolute inset-0 bg-black/20"></div>
                        
                        <h4 className="mb-1 text-black font-normal uppercase relative z-10">Products</h4>
                        <p className="hidden md:block text-black font-semibold text-xl text-center px-4 relative z-10">
                          {pkg?.products ? pkg.products.split(",").map((p, pIndex) => (
                            <React.Fragment key={pIndex}>
                              {p.trim()}
                              {pIndex < pkg.products.split(",").length - 1 && <br />}
                            </React.Fragment>
                          )) : "No products listed"}
                        </p>
                        <p className="md:hidden text-black font-normal text-sm text-center px-4 relative z-10">
                          {pkg?.products || "No products listed"}
                        </p>
                      </div>
                      
                      {/* Bottom Add/Price Section */}
                      <div
                        className="flex items-center justify-between py-4 px-6 border-t md:border-b md:border-white"
                        style={{ backgroundColor: colorSet.priceBg, borderColor: '#C6C6C6' }}
                      >
                        <div className="flex items-center gap-1 rounded-lg bg-white overflow-hidden border border-[#C6C6C6]">
                          {selectedPackages?.find((i) => i._id === pkg._id)
                            ?.quantity > 0 && (
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
                          <span className="p-2">
                            {selectedPackages?.find((i) => i._id === pkg._id)
                              ?.quantity > 0
                              ? selectedPackages?.find((i) => i._id === pkg._id)?.quantity
                              : "Add"}
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
                        <div className="text-black font-semibold text-right">
                          <p className="text-xs font-normal text-black">Per Person</p>
                          <p className="text-[#840032] font-semibold text-lg">
                            {toPriceString((pkg?.price || 0) * wedsyPackageTaxMultiply)}
                          </p>
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
              <button
                className="rounded-md md:rounded-full bg-black text-white py-2 px-12"
              >
                View More
              </button>
            </Link>
          </div>
        </div>

      
      {/* BID BOOK SECTION */}
      <div className="hidden md:block bg-[#EDE5E3] px-24 py-8">
        <p className="uppercase text-[#46646C] text-3xl text-center">
          <span className="font-semibold">
            <span className="text-4xl">B</span>id
          </span>
          , <span className="font-semibold">book</span>, and{" "}
          <span className="font-semibold">beautify</span> with unbeatable makeup
          artist prices
        </p>
        <div className="grid grid-cols-3 gap-4 mt-4">
          <div className="col-span-2 text-[#5F7982] text-xl pr-12 mt-8">
            <p>
              {`The first-ever bidding tool for your perfect makeup artist. Simply share your dream look, and let the artists bid for the chance to make it a reality. Your beauty, your terms. Ready to turn heads? Click 'Book Now' below and let the bidding begin`}
            </p>
            <Link href="/artise">
              <button className="mt-12 bg-[#002630] text-white px-6 py-3 rounded-md w-max">
                Book Now
              </button>
            </Link>
          </div>
          <img
            src="/assets/images/makeup-landing-page-2.png"
            className="w-full"
            alt="Makeup artist working on a model"
          />
        </div>
      </div>

      {/* wedsy Promises section */}
      <img
        src="/assets/images/makeup-landing-page-3.png"
        className="w-full hidden md:block"
      />

      {/* search section */}
      <div className="bg-[#f4f4f4] py-12 pt-16 grid grid-cols-1 md:grid-cols-2 gap-4 px-6 md:px-24">
        <div className="">
          <span className="hidden md:block text-3xl font-medium">
            OUR <span className="text-[#840032]">TOP</span> MAKEUP ARTISTS
          </span>
          <p className="hidden md:block text-lg">{`“ If flawless beauty is your desire “`}</p>
          <p className="md:hidden text-center font-medium text-lg">
            Our Top Rated
          </p>
          <p className="text-[#840032] font-semibold text-2xl text-center md:hidden">
            MAKEUP ARTSITS
          </p>
        </div>
        <div className="flex flex-col items-end gap-3">
          <div className="hidden md:flex items-center gap-1">
            <span className="text-black">&#x1F4CD;</span>
            <h2 className="text-xl font-semibold text-[#880E4F]">
              Bangalore, IN
            </h2>
          </div>
          <div className="md:hidden relative w-full">
            <button
              className="absolute left-2 top-1/2 transform -translate-y-1/2 p-2 rounded-full text-gray-500"
              aria-label="Search"
            >
              <FaSearch size={16} />
            </button>
            <input
              type="text"
              value={search}
              onChange={(e) => {
                setSearch(e.target.value);
              }}
              placeholder="Search by name..."
              className="w-full py-2 px-4 text-gray-700 rounded-lg border border-gray-300 focus:ring-2 focus:ring-[#880E4F] focus:outline-none pl-12"
            />
          </div>
          <div className="hidden md:block relative w-full max-w-sm">
            <input
              type="text"
              value={search}
              onChange={(e) => {
                setSearch(e.target.value);
              }}
              placeholder="Search by name..."
              className="w-full py-2 px-4 text-gray-700 rounded-full border border-gray-300 focus:ring-2 focus:ring-[#880E4F] focus:outline-none"
            />
            <button
              className="absolute right-2 top-1/2 transform -translate-y-1/2 bg-[#880E4F] p-2 rounded-full text-white hover:bg-[#6d0b3a]"
              aria-label="Search"
            >
              <FaSearch size={16} />
            </button>
          </div>
        </div>
      </div>

      {/* card section */}
      <div className="bg-[#f4f4f4] pb-12 grid grid-cols-2 md:grid-cols-3 gap-4 md:gap-16 px-8 md:px-36">
        {vendors
          ?.filter((i) =>
            search ? i.name.toLowerCase().includes(search.toLowerCase()) : true
          )
          .slice(0, 9)
          ?.map((item, index) => (
            <div
              className="bg-white p-4 rounded-lg flex flex-col gap-4"
              key={index}
            >
              <div className="bg-gray-500 pt-[100%] w-full relative">
                <img
                  src={item?.gallery?.coverPhoto}
                  className="absolute top-0 w-full h-full object-cover rounded-xl"
                />
              </div>
              <div className="flex flex-col gap-1">
                <h3 className="text-lg font-semibold text-gray-800">
                  {item?.name}
                </h3>
                <div className="flex items-center gap-1 text-[#880E4F]">
                  <FaStar size={14} />
                  <span className="text-sm font-medium">4.5</span>
                </div>
                <div className="flex items-center gap-1 text-gray-500 text-sm">
                  <FaMapMarkerAlt size={14} />
                  <span>RT Nagar, Bangalore</span>
                </div>
                <p className="text-xs text-gray-400 mt-1">
                  Bridal makeup price
                </p>
                <p className="text-[#880E4F] font-bold text-lg">
                  {toPriceString(item?.prices?.bridal || 0)}
                </p>
              </div>
            </div>
          ))}
        <div className="flex flex-row justify-center col-span-3">
          <button
            className="rounded-lg md:rounded-full bg-black md:bg-[#840032] text-white py-2 px-12"
            onClick={() => {
              router.push("/makeup-and-beauty/artists");
            }}
          >
            View More
          </button>
        </div>
      </div>


      {/* FAQ section */}
      <div className="bg-[#f4f4f4] py-12 px-6 md:px-24">
        <img
          src="/assets/images/faq-title-1.png"
          className="border-t w-full hidden md:block"
        />
        <img
          src="/assets/images/faq-title-2.png"
          className="border-t w-full md:hidden"
        />
        <div className="divide-dashed divide-y-2 divide-black flex flex-col [&>div]:pb-0 [&>div]:mt-0 px-0 md:px-12 mt-4 md:mt-8 md:text-xl">
          <FAQAccordion
            question={
              "What services do Wedsy's event planners in Bangalore offer?"
            }
            answer={
              "Our team at Wedsy offers comprehensive event planning services in Bangalore, including venue selection, thematic decoration, catering, photography, makeup artists, mehendi artists, DJ, Emcee, and personalized event itineraries. We ensure your celebration in Bangalore is flawless from start to finish."
            }
          />
          <FAQAccordion
            question={
              "How do Wedsy's wedding planners in Bangalore personalize weddings?"
            }
            answer={
              " At Wedsy, we ensure that every wedding reflects the couple's personality. Our wedding planners in Bangalore collaborate closely with you to understand your vision and preferences, crafting a celebration as unique as your love story. From the color of cloth to flowers, flooring type to lighting, every detail is fully customizable. Your designated wedding planner will discuss these details with you and document them in the notes on the event tool for clear communication and reference."
            }
          />
          <FAQAccordion
            question={"What sets Wedsy's event decorators in Bangalore apart?"}
            answer={
              "Wedsy's event decorators stand out for their creativity and versatility. We lead in staying ahead of trends, utilizing innovative design techniques and technology to craft stunning visual experiences tailored to your event's theme and ambiance. Being India's first online store with transparent pricing, you can conveniently select and customize all decor online. We pride ourselves as a one-stop-shop for all your wedding needs."
            }
          />
          <FAQAccordion
            question={
              "What budget range does Wedsy cater to for weddings and events?"
            }
            answer={
              "Being among the top wedding planners in Bangalore, Wedsy caters to a diverse range of budgets. We collaborate closely with our clients to tailor custom packages that align with their financial considerations, ensuring a high-quality execution of their special day. From as low as 10,000 INR to 10 lakhs and beyond, we accommodate a wide spectrum of budgets."
            }
          />
          <FAQAccordion
            question={"Does Wedsy have packages for decorators in Bangalore?"}
            answer={
              "Yes, Wedsy offers a range of packages for wedding decorations that can be tailored to fit your specific needs and budget. Our packages include a variety of décor options curated by the best decorators in Bangalore to make your wedding truly exceptional."
            }
          />
          <FAQAccordion
            question={
              "How do I book Wedsy's services for my upcoming wedding or event?"
            }
            answer={
              "Booking with Wedsy is easy. Reach out to us through our website, phone, or email. Your designated planner, your single point of contact for all wedding needs, will guide you through the entire process. We recommend scheduling a consultation with our team to discuss event details and secure our services well in advance, especially for peak seasons in Bangalore."
            }
          />
          <FAQAccordion
            question={"What is the event tool?"}
            answer={`The event tool is a specially designed organizational tool for your events. Simply create an event, such as "Rahul's wedding," and add multiple event days like haldi, sangeet, and the wedding ceremony. Once set up, easily add your selected decor to the respective event days. This tool ensures your event stays well-organized and hassle-free.`}
          />
        </div>
      </div>

      <VendorUserSection />
    </>
  );
}

export default MakeupAndBeauty;
