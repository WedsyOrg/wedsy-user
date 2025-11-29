import UserProfileHeader from "@/components/layout/UserProfileHeader";
import MobileStickyFooter from "@/components/layout/MobileStickyFooter";
import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import { Spinner } from "flowbite-react";
import {
  MdChevronRight,
  MdExpandLess,
  MdExpandMore,
  MdOutlineChevronRight,
  MdSort,
  MdTune,
} from "react-icons/md";
import Link from "next/link";

export default function Orders({ user }) {
  const router = useRouter();
  const [bidding, setBidding] = useState([]);
  const [loading, setLoading] = useState(false);
  const [showFilterSort, setShowFilterSort] = useState(false);
  const [activeTab, setActiveTab] = useState("sort"); // "sort" or "filter"
  const [selectedSection, setSelectedSection] = useState(null);
  const [sortOption, setSortOption] = useState(null);
  const [filterOptions, setFilterOptions] = useState({
    occasion: [],
  });
  const fetchBidding = () => {
    setLoading(true);
    fetch(`${process.env.NEXT_PUBLIC_API_URL}/bidding`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        authorization: `Bearer ${localStorage.getItem("token")}`,
      },
    })
      .then((response) => {
        if (!response.ok) {
          throw new Error(`Request failed with status ${response.status}`);
        }
        return response.json();
      })
      .then((response) => {
        setBidding(Array.isArray(response) ? response : []);
        setLoading(false);
      })
      .catch((error) => {
        console.error("There was a problem with the fetch operation:", error);
        setBidding([]);
        setLoading(false);
      });
  };
  useEffect(() => {
    fetchBidding();
  }, []);

  const getStatus = (item) => {
    const s = item?.status || {};
    if (s.lost) return { text: "BOOKING CANCELLED", color: "text-[#A20000]" };
    if (s.completed) return { text: "COMPLETED", color: "text-[#2C7300]" };
    if (s.finalized && !s.completed) return { text: "UPCOMING", color: "text-[#CE8C35]" };
    return { text: "BIDDING", color: "text-[#2B3F6C]" };
  };

  const applyFiltersAndSort = () => {
    let filteredData = [...bidding];

    // Apply filters
    if (filterOptions.occasion.length > 0) {
      filteredData = filteredData.filter((item) => {
        const eventTypes = item?.events?.map((e) => e?.type) || [];
        return eventTypes.some((type) => filterOptions.occasion.includes(type));
      });
    }

    // Apply sorting
    if (sortOption === "price-low") {
      // Sort by lowest bid price (ascending)
      filteredData.sort((a, b) => {
        const priceA = Math.min(...(a?.bids?.map((bid) => bid?.price) || [Number.MAX_VALUE]));
        const priceB = Math.min(...(b?.bids?.map((bid) => bid?.price) || [Number.MAX_VALUE]));
        return priceA - priceB;
      });
    } else if (sortOption === "price-high") {
      // Sort by lowest bid price (descending)
      filteredData.sort((a, b) => {
        const priceA = Math.min(...(a?.bids?.map((bid) => bid?.price) || [Number.MAX_VALUE]));
        const priceB = Math.min(...(b?.bids?.map((bid) => bid?.price) || [Number.MAX_VALUE]));
        return priceB - priceA;
      });
    }

    return filteredData;
  };

  return (
    <>
      <MobileStickyFooter />
      <div className="flex flex-col bg-gray-100 min-h-[100vh]">
        <div className="flex flex-row justify-around items-center bg-[#2B2B2B] px-4 md:px-24 py-4 text-white">
          <p
            className="border-b border-b-white cursor-pointer"
            onClick={() => {
              router.push("/my-bids");
            }}
          >
            MY BIDS
          </p>
          <p
            className="border-b border-b-[#2B2B2B] cursor-pointer"
            onClick={() => {
              router.push("/my-orders");
            }}
          >
            ORDERS
          </p>
          <p
            className="border-b border-b-[#2B2B2B] cursor-pointer"
            onClick={() => {
              router.push("/my-account");
            }}
          >
            ACCOUNT
          </p>
        </div>
        <div className="px-4 md:px-24 py-6 md:py-12 flex flex-col gap-6">
          <p className="font-medium text-xl md:text-3xl text-center">
            MAKEUP & BEAUTY
          </p>
          <div className="flex justify-center">
            <button
              className="rounded-full bg-[#840032] text-white px-6 py-2 text-sm md:text-base font-medium shadow-sm hover:bg-[#6b002a] transition-colors"
              onClick={() => router.push("/makeup-and-beauty/bidding")}
            >
              Create New Bidding Request
            </button>
          </div>
          
          {/* Filter/Sort Button */}
          <div className="flex justify-center gap-4">
            <button
              onClick={() => {
                setActiveTab("sort");
                setSelectedSection("price");
                setShowFilterSort(true);
              }}
              className="flex items-center gap-2 px-4 py-2 bg-white border border-gray-300 rounded-full text-sm font-medium hover:bg-gray-50 transition-colors"
            >
              <MdSort size={20} />
              Sort
            </button>
            <button
              onClick={() => {
                setActiveTab("filter");
                setSelectedSection("occasion");
                setShowFilterSort(true);
              }}
              className="flex items-center gap-2 px-4 py-2 bg-white border border-gray-300 rounded-full text-sm font-medium hover:bg-gray-50 transition-colors"
            >
              <MdTune size={20} />
              Filter
            </button>
          </div>

          {/* Filter/Sort Modal */}
          {showFilterSort && (
            <div 
              className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4"
              onClick={() => setShowFilterSort(false)}
            >
              <div 
                className="bg-white rounded-lg w-full max-w-2xl max-h-[80vh] flex flex-col"
                onClick={(e) => e.stopPropagation()}
              >
                {/* Tabs */}
                <div className="flex border-b">
                  <button
                    onClick={() => {
                      setActiveTab("sort");
                      setSelectedSection("price");
                    }}
                    className={`flex items-center gap-2 px-6 py-4 font-medium ${
                      activeTab === "sort" ? "bg-white border-b-2 border-black" : "bg-gray-50"
                    }`}
                  >
                    <MdSort size={20} />
                    Sort
                  </button>
                  <button
                    onClick={() => {
                      setActiveTab("filter");
                      setSelectedSection("occasion");
                    }}
                    className={`flex items-center gap-2 px-6 py-4 font-medium ${
                      activeTab === "filter" ? "bg-white border-b-2 border-black" : "bg-gray-50"
                    }`}
                  >
                    <MdTune size={20} />
                    Filter
                  </button>
                </div>

                {/* Content Area */}
                <div className="flex md:flex-row flex-col flex-1 overflow-hidden">
                  {/* Left Panel - Sections */}
                  <div className="md:w-1/2 w-full md:border-r border-b overflow-y-auto bg-gray-50">
                    {activeTab === "sort" ? (
                      <div className="p-4 space-y-1">
                        <button
                          onClick={() => setSelectedSection("price")}
                          className={`w-full text-left px-4 py-3 rounded ${
                            selectedSection === "price" ? "bg-white shadow-sm" : "hover:bg-gray-100"
                          }`}
                        >
                          Price range
                        </button>
                      </div>
                    ) : (
                      <div className="p-4 space-y-1">
                        <button
                          onClick={() => setSelectedSection("occasion")}
                          className={`w-full text-left px-4 py-3 rounded ${
                            selectedSection === "occasion" ? "bg-white shadow-sm" : "hover:bg-gray-100"
                          }`}
                        >
                          Occasion
                        </button>
                      </div>
                    )}
                  </div>

                  {/* Right Panel - Options */}
                  <div className="md:w-1/2 w-full p-4 overflow-y-auto">
                    {activeTab === "sort" && selectedSection === "price" && (
                      <div className="space-y-2">
                        <button
                          onClick={() => setSortOption("price-low")}
                          className={`w-full text-left px-4 py-3 rounded ${
                            sortOption === "price-low" ? "bg-gray-100 font-medium" : "hover:bg-gray-50"
                          }`}
                        >
                          Price - Low to high
                        </button>
                        <button
                          onClick={() => setSortOption("price-high")}
                          className={`w-full text-left px-4 py-3 rounded ${
                            sortOption === "price-high" ? "bg-gray-100 font-medium" : "hover:bg-gray-50"
                          }`}
                        >
                          Price - High to low
                        </button>
                      </div>
                    )}
                    
                    {activeTab === "filter" && selectedSection === "occasion" && (
                      <div className="space-y-2">
                        {["Reception", "Engagement", "Sangeet", "Wedding", "Haldi", "Mehendi", "Muhurtham"].map((occasion) => (
                          <label key={occasion} className="flex items-center gap-3 px-4 py-3 rounded hover:bg-gray-50 cursor-pointer">
                            <input
                              type="checkbox"
                              checked={filterOptions.occasion.includes(occasion)}
                              onChange={(e) => {
                                if (e.target.checked) {
                                  setFilterOptions({
                                    ...filterOptions,
                                    occasion: [...filterOptions.occasion, occasion],
                                  });
                                } else {
                                  setFilterOptions({
                                    ...filterOptions,
                                    occasion: filterOptions.occasion.filter((o) => o !== occasion),
                                  });
                                }
                              }}
                              className="w-4 h-4 border-gray-300 rounded"
                            />
                            <span>{occasion}</span>
                          </label>
                        ))}
                      </div>
                    )}
                    
                    {(!selectedSection || (activeTab === "filter" && filterOptions.occasion.length === 0 && selectedSection === "occasion")) && (
                      <div className="text-gray-400 text-center py-8">
                        Select a section to see options
                      </div>
                    )}
                  </div>
                </div>

                {/* Bottom Buttons */}
                <div className="flex border-t p-4 gap-3">
                  <button
                    onClick={() => {
                      setSortOption(null);
                      setFilterOptions({ occasion: [] });
                      setSelectedSection(null);
                    }}
                    className="flex-1 px-6 py-3 border border-gray-300 rounded font-medium hover:bg-gray-50 transition-colors"
                  >
                    Reset
                  </button>
                  <button
                    onClick={() => {
                      setShowFilterSort(false);
                      // Apply filters/sort logic here
                      applyFiltersAndSort();
                    }}
                    className="flex-1 px-6 py-3 bg-black text-white rounded font-medium hover:bg-gray-800 transition-colors"
                  >
                    Apply
                  </button>
                </div>
              </div>
            </div>
          )}

          <div className="md:py-6 md:px-12 flex flex-col gap-4">
            {loading && (
              <div className="bg-white rounded-xl p-8 text-center shadow flex flex-col items-center gap-3">
                <Spinner size="lg" />
                <p className="text-sm text-gray-500">Loading your bids...</p>
              </div>
            )}
            {!loading && Array.isArray(bidding) && bidding.length === 0 && (
              <div className="bg-white rounded-xl p-8 text-center shadow flex flex-col gap-2">
                <p className="text-lg font-medium text-gray-700">No bids yet</p>
                <p className="text-sm text-gray-500">
                  You haven&apos;t created any bidding requests. Start by exploring our makeup &amp; beauty services and request a quote.
                </p>
                <Link
                  href="/makeup-and-beauty/bidding"
                  className="mx-auto mt-2 inline-flex items-center justify-center rounded-full bg-rose-900 text-white px-6 py-2 text-sm hover:bg-rose-800 transition-colors"
                >
                  Create a bidding request
                </Link>
              </div>
            )}
            {Array.isArray(bidding) && bidding.length > 0 && applyFiltersAndSort().length > 0 && (
              <div className="bg-white border border-rose-100 rounded-xl p-4 flex flex-wrap items-center gap-4 shadow-sm">
                <div className="flex-1 min-w-[220px]">
                  <p className="text-sm text-gray-600 uppercase tracking-wide">Need help finalising?</p>
                  <p className="text-lg font-semibold text-rose-900">Chat with vendors instantly to discuss quotations.</p>
                </div>
                <Link href="/chats" className="inline-flex items-center px-4 py-2 rounded-full bg-rose-900 text-white text-sm font-medium hover:bg-rose-800 transition-colors">
                  Go to Chats
                </Link>
              </div>
            )}
            {Array.isArray(bidding) && bidding.length > 0 && applyFiltersAndSort().length === 0 && (
              <div className="bg-white rounded-xl p-8 text-center shadow flex flex-col gap-2">
                <p className="text-lg font-medium text-gray-700">No results found</p>
                <p className="text-sm text-gray-500">
                  Try adjusting your filters to see more results.
                </p>
              </div>
            )}
            {Array.isArray(bidding) && bidding.length > 0 && applyFiltersAndSort().map((item, index) => {
              const { text, color } = getStatus(item);
              return (
                <div
                  key={item?._id}
                  className="bg-white p-4 px-6 rounded-xl flex flex-row items-center gap-4"
                >
                  <div className="flex flex-col gap-3">
                    <p className="text-lg font-medium">
                      {item?.events?.length} {item?.events?.length > 1 ? "Events" : "Event"}
                    </p>
                    <div className="flex items-center gap-6 text-lg font-semibold">
                      <span className={`${color} uppercase tracking-wide`}>{text}</span>
                    </div>
                    <div className="font-medium">
                      {new Date(item?.events?.[0]?.date)?.toLocaleDateString("en-GB", {
                        day: "2-digit",
                        month: "short",
                        year: "numeric",
                      })}
                      {" "}
                      {`${item?.events?.[0]?.time} ${
                        +item?.events?.[0]?.time?.split(":")?.[0] < 12 ? "AM" : "PM"
                      }`}
                    </div>
                  </div>
                  <MdOutlineChevronRight
                    className="flex-shrink-0 ml-auto"
                    cursor={"pointer"}
                    onClick={() => {
                      router.push(`/my-bids/${item?._id}`);
                    }}
                    size={24}
                  />
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </>
  );
}
