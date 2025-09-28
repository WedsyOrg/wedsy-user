import UserProfileHeader from "@/components/layout/UserProfileHeader";
import MobileStickyFooter from "@/components/layout/MobileStickyFooter";
import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import {
  MdChevronRight,
  MdExpandLess,
  MdExpandMore,
  MdOutlineChevronRight,
} from "react-icons/md";

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
      .then((response) => response.json())
      .then((response) => {
        setLoading(false);
        setBidding(response);
      })
      .catch((error) => {
        console.error("There was a problem with the fetch operation:", error);
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
          <div className="md:py-6 md:px-12 flex flex-col gap-4">
            {bidding?.map((item, index) => {
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
