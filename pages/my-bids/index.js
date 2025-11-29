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
} from "react-icons/md";
import Link from "next/link";

export default function Orders({ user }) {
  const router = useRouter();
  const [bidding, setBidding] = useState([]);
  const [loading, setLoading] = useState(false);
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
            {Array.isArray(bidding) && bidding.length > 0 && (
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
            {Array.isArray(bidding) && bidding.length > 0 && bidding.map((item, index) => {
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
