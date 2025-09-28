import UserProfileHeader from "@/components/layout/UserProfileHeader";
import { toPriceString } from "@/utils/text";
import { Button, Label, TextInput } from "flowbite-react";
import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import { FaMapMarkerAlt } from "react-icons/fa";
import {
  MdChevronRight,
  MdExpandLess,
  MdExpandMore,
  MdOutlineChevronRight,
  MdOutlineKeyboardBackspace,
  MdOutlineLocationOn,
  MdPersonOutline,
} from "react-icons/md";
import { RxDashboard } from "react-icons/rx";

export default function Orders({ user }) {
  const router = useRouter();
  const { orderId } = router.query;
  const [loading, setLoading] = useState(false);
  const [order, setOrder] = useState(null);
  const [orders, setOrders] = useState([]);
  const fetchOrder = () => {
    setLoading(true);
    fetch(`${process.env.NEXT_PUBLIC_API_URL}/order/${orderId}?populate=true`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        authorization: `Bearer ${localStorage.getItem("token")}`,
      },
    })
      .then((response) => response.json())
      .then((response) => {
        setLoading(false);
        setOrder(response);
      })
      .catch((error) => {
        console.error("There was a problem with the fetch operation:", error);
      });
  };

  useEffect(() => {
    fetchOrder();
  }, []);

  return (
    <>
      <div className="flex flex-col bg-gray-100 min-h-[70vh]">
        <div className="flex flex-row justify-around items-center bg-[#2B2B2B] px-4 md:px-24 py-4 text-white">
          <p
            className="border-b border-b-[#2B2B2B] cursor-pointer"
            onClick={() => {
              router.push("/my-bids");
            }}
          >
            MY BIDS
          </p>
          <p
            className="border-b border-b-white cursor-pointer"
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
        <div className="bg-white uppercase px-12 hidden md:flex flex-row gap-6 items-center py-6 text-xl font-semibold border-b-2">
          <MdOutlineKeyboardBackspace
            className="flex-shrink-0"
            onClick={() => router.back()}
          />
          MAKEUP & BEAUTY
        </div>
        <div className="p-0 md:px-24 md:py-12 grid grid-cols-1 md:grid-cols-2 gap-2 md:gap-12">
          <div className="col-span-2 hidden md:block">
            {order?.source === "Bidding" && (
              <>
                <p className="text-lg font-medium uppercase mb-6">
                  Bidding Makeup Package
                </p>
                <p className="flex flex-row gap-2 items-center text-lg font-medium">
                  {order?.status?.lost && (
                    <span className="text-[#A20000]">BOOKING CANCELLED</span>
                  )}
                  {order?.status?.finalized && !order?.status?.completed && (
                    <span className="text-[#CE8C35]">UPCOMING</span>
                  )}
                  {order?.status?.completed && (
                    <span className="text-[#2C7300]">COMPLETED</span>
                  )}
                </p>
              </>
            )}
            {order?.source === "Personal-Package" && (
              <>
                <p className="text-lg font-medium uppercase mb-6">
                  {order?.vendor?.name}
                  <br />
                  Basic Makeup Package
                </p>
                <p className="flex flex-row gap-2 items-center text-lg font-medium">
                  {order?.status?.lost && (
                    <span className="text-[#A20000]">BOOKING CANCELLED</span>
                  )}
                  {order?.status?.finalized && !order?.status?.completed && (
                    <span className="text-[#CE8C35]">UPCOMING</span>
                  )}
                  {order?.status?.completed && (
                    <span className="text-[#2C7300]">COMPLETED</span>
                  )}
                </p>
              </>
            )}
            {order?.source === "Wedsy-Package" && (
              <>
                <p className="text-lg font-medium uppercase mb-6">
                  Basic Makeup Package
                </p>
                <p className="flex flex-row gap-2 items-center text-lg font-medium">
                  {order?.status?.lost && (
                    <span className="text-[#A20000]">BOOKING CANCELLED</span>
                  )}
                  {order?.status?.finalized && !order?.status?.completed && (
                    <span className="text-[#CE8C35]">UPCOMING</span>
                  )}
                  {order?.status?.completed && (
                    <span className="text-[#2C7300]">COMPLETED</span>
                  )}
                </p>
              </>
            )}
          </div>
          <div>
            {order?.source === "Bidding" && (
              <>
                <div className="flex flex-col space-y-4 divide-y rounded-xl p-6 bg-white">
                  {order?.biddingBooking?.events?.map((item, index) => (
                    <div className="text-lg pt-4" key={index}>
                      <div className="flex flex-row justify-between mb-3">
                        <p className="text-xl font-semibold">
                          {item?.eventName}
                        </p>
                        <div>
                          {new Date(item?.date)?.toLocaleDateString("en-GB", {
                            day: "2-digit",
                            month: "short",
                            year: "numeric",
                          })}{" "}
                          {`${item?.time} ${
                            +item?.time.split(":")[0] < 12 ? "AM" : "PM"
                          }`}
                        </div>
                      </div>
                      <div className="flex flex-row gap-4 items-top">
                        <p className="my-0 py-0 flex flex-row items-center gap-1">
                          <MdOutlineLocationOn className="flex-shrink-0 text-base" />
                          {"   "}
                          {item?.location}
                        </p>
                      </div>
                      {item?.peoples?.map((rec, recIndex) => (
                        <>
                          <div
                            className="flex flex-row gap-4 items-top"
                            key={recIndex}
                          >
                            <p className="my-0 py-0 flex flex-row items-center gap-1">
                              <MdPersonOutline className="flex-shrink-0 text-base" />
                              {"   "}
                              {rec?.noOfPeople}
                            </p>
                            <p className="">{rec.makeupStyle}</p>
                            <p className="">{rec.preferredLook}</p>
                          </div>
                          <div
                            className="flex flex-row gap-4 items-top mb-2"
                            key={recIndex}
                          >
                            <p className="my-0 py-0 flex flex-row items-center gap-1">
                              <RxDashboard className="flex-shrink-0 text-base" />
                              {"   "}
                              {rec?.addOns}
                            </p>
                          </div>
                        </>
                      ))}
                      {item?.notes?.length > 0 && (
                        <>
                          <Label className="mt-4" value="NOTES" />
                          <div className="border rounded-lg  p-2 bg-white">
                            {item?.notes?.join("\n")}
                          </div>
                        </>
                      )}
                    </div>
                  ))}
                </div>
                <div className="hidden md:flex flex-row gap-2 mt-6">
                  <Button className="enabled:hover:bg-rose-900 bg-rose-900">
                    Book Again
                  </Button>
                  <Button color="dark">Download Invoice</Button>
                </div>
              </>
            )}
            {order?.source === "Personal-Package" && (
              <>
                <div className="bg-white p-6 rounded-lg grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="md:col-span-2">
                    <Label value="Address" />
                    <div
                      className={`flex items-center gap-4 bg-white p-4 rounded-lg border`}
                    >
                      <FaMapMarkerAlt className="text-[#840032]" size={20} />
                      <p className="text-gray-600 text-sm">
                        {
                          order?.vendorPersonalPackageBooking?.address
                            ?.formatted_address
                        }
                      </p>
                    </div>
                  </div>
                  <div>
                    <Label value="Date" />
                    <TextInput
                      type="date"
                      readOnly={true}
                      value={order?.vendorPersonalPackageBooking.date}
                    />
                  </div>
                  <div>
                    <Label value="Time" />
                    <TextInput
                      type="time"
                      readOnly={true}
                      value={order?.vendorPersonalPackageBooking.time}
                    />
                  </div>
                </div>
                <div className="hidden md:flex flex-row gap-2 mt-6">
                  <Button className="enabled:hover:bg-rose-900 bg-rose-900">
                    Book Again
                  </Button>
                  <Button color="dark">Download Invoice</Button>
                </div>
              </>
            )}
            {order?.source === "Wedsy-Package" && (
              <>
                <div className="bg-white p-6 rounded-lg grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="md:col-span-2">
                    <Label value="Address" />
                    <div
                      className={`flex items-center gap-4 bg-white p-4 rounded-lg border`}
                    >
                      <FaMapMarkerAlt className="text-[#840032]" size={20} />
                      <p className="font-semibold text-base uppercase">
                        {order?.wedsyPackageBooking?.address?.address_type}
                      </p>
                      <p className="text-gray-600 text-sm">
                        {order?.wedsyPackageBooking?.address?.house_no},{" "}
                        {order?.wedsyPackageBooking?.address?.formatted_address}
                      </p>
                    </div>
                  </div>
                  <div>
                    <Label value="Date" />
                    <TextInput
                      type="date"
                      readOnly={true}
                      value={order?.wedsyPackageBooking.date}
                    />
                  </div>
                  <div>
                    <Label value="Time" />
                    <TextInput
                      type="time"
                      readOnly={true}
                      value={order?.wedsyPackageBooking.time}
                    />
                  </div>
                </div>
                <div className="hidden md:flex flex-row gap-2 mt-6">
                  <Button color="dark">Download Invoice</Button>
                </div>
              </>
            )}
          </div>
          <div>
            {order?.source === "Bidding" && (
              <>
                <div className="bg-white rounded-lg p-6 flex flex-col gap-4">
                  <p className="text-xl font-semibold">Payment Summary</p>
                  <div className="grid grid-cols-2 gap-4">
                    <p className="text-lg">Bidding Package</p>
                    <p className="text-lg text-right">
                      {toPriceString(order?.amount?.price)}
                    </p>
                    <div className="col-span-2 h-[1px] bg-black w-full" />
                    <p className="text-lg font-medium">Taxes & fees</p>
                    <p className="text-lg font-medium text-right">
                      {toPriceString(order?.amount?.cgst + order?.amount?.sgst)}
                    </p>
                    <div className="col-span-2 h-[2px] bg-black w-full" />
                    <p className="text-xl font-semibold">Total</p>
                    <p className="text-xl font-semibold text-right">
                      {toPriceString(order?.amount?.total)}
                    </p>
                  </div>
                </div>
                <div className="bg-white rounded-lg p-6 grid grid-cols-2 gap-4 mt-2 md:mt-6">
                  <p className="text-xl font-semibold">Amount Paid</p>
                  <p className="text-xl font-semibold text-right text-[#840032]">
                    {toPriceString(order?.amount?.paid)}
                  </p>
                </div>
              </>
            )}
            {order?.source === "Personal-Package" && (
              <>
                <div className="bg-white rounded-lg p-6 flex flex-col gap-4">
                  <p className="text-xl font-semibold">Payment Summary</p>
                  <div className="grid grid-cols-2 gap-4">
                    {order?.vendorPersonalPackageBooking?.personalPackages?.map(
                      (item, index) => (
                        <>
                          <p className="text-lg">
                            {item?.package?.name} x {item?.quantity}
                          </p>
                          <p className="text-lg text-right">
                            {toPriceString(item?.quantity * item?.price)}
                          </p>
                        </>
                      )
                    )}
                    <div className="col-span-2 h-[1px] bg-black w-full" />
                    <p className="text-lg font-medium">Taxes & fees</p>
                    <p className="text-lg font-medium text-right">
                      {toPriceString(order?.amount?.cgst + order?.amount?.sgst)}
                    </p>
                    <div className="col-span-2 h-[2px] bg-black w-full" />
                    <p className="text-xl font-semibold">Total</p>
                    <p className="text-xl font-semibold text-right">
                      {toPriceString(order?.amount?.total)}
                    </p>
                  </div>
                </div>
                <div className="bg-white rounded-lg p-6 grid grid-cols-2 gap-4 mt-2 md:mt-6">
                  <p className="text-xl font-semibold">Amount Paid</p>
                  <p className="text-xl font-semibold text-right text-[#840032]">
                    {toPriceString(order?.amount?.paid)}
                  </p>
                </div>
              </>
            )}
            {order?.source === "Wedsy-Package" && (
              <>
                <div className="bg-white rounded-lg p-6 flex flex-col gap-4">
                  <p className="text-xl font-semibold">Payment Summary</p>
                  <div className="grid grid-cols-2 gap-4">
                    {order?.wedsyPackageBooking?.wedsyPackages?.map(
                      (item, index) => (
                        <>
                          <p className="text-lg">
                            {item?.package?.name} x {item?.quantity}
                          </p>
                          <p className="text-lg text-right">
                            {toPriceString(item?.quantity * item?.price)}
                          </p>
                        </>
                      )
                    )}
                    <div className="col-span-2 h-[1px] bg-black w-full" />
                    <p className="text-lg font-medium">Taxes & fees</p>
                    <p className="text-lg font-medium text-right">
                      {toPriceString(order?.amount?.cgst + order?.amount?.sgst)}
                    </p>
                    <div className="col-span-2 h-[2px] bg-black w-full" />
                    <p className="text-xl font-semibold">Total</p>
                    <p className="text-xl font-semibold text-right">
                      {toPriceString(order?.amount?.total)}
                    </p>
                  </div>
                </div>
                <div className="bg-white rounded-lg p-6 grid grid-cols-2 gap-4 mt-2 md:mt-6">
                  <p className="text-xl font-semibold">Amount Paid</p>
                  <p className="text-xl font-semibold text-right text-[#840032]">
                    {toPriceString(order?.amount?.paid)}
                  </p>
                </div>
              </>
            )}
          </div>
        </div>
      </div>
    </>
  );
}
