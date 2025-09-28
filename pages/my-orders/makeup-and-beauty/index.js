import UserProfileHeader from "@/components/layout/UserProfileHeader";
import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import {
  MdChevronRight,
  MdExpandLess,
  MdExpandMore,
  MdOutlineChevronRight,
  MdOutlineKeyboardBackspace,
} from "react-icons/md";

export default function Orders({ user }) {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [orders, setOrders] = useState([]);
  const fetchOrders = () => {
    setLoading(true);
    fetch(`${process.env.NEXT_PUBLIC_API_URL}/order`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        authorization: `Bearer ${localStorage.getItem("token")}`,
      },
    })
      .then((response) => response.json())
      .then((response) => {
        setLoading(false);
        setOrders(response);
      })
      .catch((error) => {
        console.error("There was a problem with the fetch operation:", error);
      });
  };

  useEffect(() => {
    fetchOrders();
  }, []);

  return (
    <>
      <div className="flex flex-col bg-gray-100 min-h-[70vh]">
        {/* <UserProfileHeader display={"my-orders"} /> */}
        <div className="flex flex-row justify-around items-center bg-[#2B2B2B] px-4 md:px-24 py-4 text-white">
          <p className="border-b border-b-[#2B2B2B] cursor-pointer" onClick={() => {
              router.push("/my-bids");
            }}>MY BIDS</p>
          <p className="border-b border-b-white cursor-pointer" onClick={() => {
              router.push("/my-orders");
            }}>ORDERS</p>
          <p className="border-b border-b-[#2B2B2B] cursor-pointer"
            onClick={() => {
              router.push("/my-account");
            }}>ACCOUNT</p>
        </div>
        <div className="bg-white uppercase px-12 hidden md:flex flex-row gap-6 items-center py-6 text-xl font-semibold border-b-2">
          <MdOutlineKeyboardBackspace
            className="flex-shrink-0"
            onClick={() => router.back()}
          />
          MAKEUP & BEAUTY
        </div>
        <div className="px-4 md:px-24 py-6 md:py-12 flex flex-col gap-6">
          <p className="font-medium text-xl md:text-3xl text-center md:hidden">
            MAKEUP & BEAUTY
          </p>
          <div className="md:py-6 md:px-12 flex flex-col gap-4">
            {orders?.map((item, index) => (
              <div
                key={item?._id}
                className="bg-white p-4 px-6 rounded-xl flex flex-row items-center gap-4"
              >
                <div className="flex flex-col gap-2">
                  <p className="text-lg font-medium">
                    {item?.source === "Bidding" && "Bidding Makeup Package"}
                    {item?.source === "Personal-Package" &&
                      `${item?.vendor?.name} Package`}
                    {item?.source === "Wedsy-Package" && `Basic Makeup Package`}
                  </p>
                  <p className="flex flex-row gap-2 items-center text-lg font-medium">
                    {item?.status?.lost && (
                      <span className="text-[#A20000]">BOOKING CANCELLED</span>
                    )}
                    {item?.status?.finalized && !item?.status?.completed && (
                      <span className="text-[#CE8C35]">UPCOMING</span>
                    )}
                    {item?.status?.completed && (
                      <span className="text-[#2C7300]">COMPLETED</span>
                    )}
                  </p>
                  {item?.source === "Bidding" && (
                    <p className="font-medium">
                      {" "}
                      {new Date(
                        item?.biddingBooking?.events[0]?.date
                      )?.toLocaleDateString("en-GB", {
                        day: "2-digit",
                        month: "short",
                        year: "numeric",
                      })}{" "}
                      {`${item?.biddingBooking?.events[0]?.time} ${
                        +item?.biddingBooking?.events[0]?.time.split(":")[0] <
                        12
                          ? "AM"
                          : "PM"
                      }`}
                    </p>
                  )}
                  {item?.source === "Personal-Package" && (
                    <p className="font-medium">
                      {" "}
                      {new Date(
                        item?.vendorPersonalPackageBooking?.date
                      )?.toLocaleDateString("en-GB", {
                        day: "2-digit",
                        month: "short",
                        year: "numeric",
                      })}{" "}
                      {`${item?.vendorPersonalPackageBooking?.time} ${
                        +item?.vendorPersonalPackageBooking?.time.split(
                          ":"
                        )[0] < 12
                          ? "AM"
                          : "PM"
                      }`}
                    </p>
                  )}
                  {item?.source === "Wedsy-Package" && (
                    <p className="font-medium">
                      {" "}
                      {new Date(
                        item?.wedsyPackageBooking?.date
                      )?.toLocaleDateString("en-GB", {
                        day: "2-digit",
                        month: "short",
                        year: "numeric",
                      })}{" "}
                      {`${item?.wedsyPackageBooking?.time} ${
                        +item?.wedsyPackageBooking?.time.split(":")[0] < 12
                          ? "AM"
                          : "PM"
                      }`}
                    </p>
                  )}
                </div>
                <MdOutlineChevronRight
                  className="flex-shrink-0 ml-auto"
                  cursor={"pointer"}
                  onClick={() => {
                    router.push(`/my-orders/makeup-and-beauty/${item?._id}`);
                  }}
                  size={24}
                />
              </div>
            ))}
          </div>
        </div>
      </div>
    </>
  );
}
