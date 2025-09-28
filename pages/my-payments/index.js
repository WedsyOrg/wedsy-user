import UserProfileHeader from "@/components/layout/UserProfileHeader";
import UserSidebar from "@/components/layout/UserSidebar";
import { toProperCase } from "@/utils/text";
import { Button, Pagination, Select, Table } from "flowbite-react";
import Link from "next/link";
import { useEffect, useState } from "react";
import { BsBell } from "react-icons/bs";

export default function Payments({ user }) {
  const [payments, setPayments] = useState([]);
  const [paymentStats, setPaymentStats] = useState({
    totalAmount: 0,
    amountPaid: 0,
    amountDue: 0,
  });
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(false);
  const [paymentType, setPaymentType] = useState("All");
  const [paymentPage, setPaymentPage] = useState(1);
  const [paymentPageSize, setPaymentPageSize] = useState(10);
  const [paymentList, setPaymentList] = useState([]);
  const [paymentTotalPages, setPaymentTotalPages] = useState(1);
  const fetchPayments = () => {
    setLoading(true);
    fetch(`${process.env.NEXT_PUBLIC_API_URL}/payment`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        authorization: `Bearer ${localStorage.getItem("token")}`,
      },
    })
      .then((response) => response.json())
      .then((response) => {
        const { totalAmount, amountPaid, amountDue } = response;
        setLoading(false);
        setPayments(response.payments.reverse());
        setEvents(response.events);
        setPaymentStats({ totalAmount, amountPaid, amountDue });
      })
      .catch((error) => {
        console.error("There was a problem with the fetch operation:", error);
      });
  };
  useEffect(() => {
    fetchPayments();
  }, []);
  useEffect(() => {
    if (payments.length > 0) {
      let temp_payment = payments.filter((i) =>
        paymentType == "All"
          ? true
          : paymentType == "Complete" && i.status === "paid"
          ? true
          : paymentType === "Rejected" &&
            ["expired", "canceled"].includes(i.status)
          ? true
          : paymentType === "Pending" &&
            !["expired", "canceled", "paid"].includes(i.status)
          ? true
          : false
      );
      let temp_total = temp_payment.length;
      let temp_total_pages = Math.ceil(temp_total / paymentPageSize);
      let temp_page = paymentPage <= temp_total_pages ? paymentPage : 1;
      let s = (temp_page - 1) * paymentPageSize;
      let e = temp_page * paymentPageSize;
      let temp_list = temp_payment.filter(
        (_, index) => index >= s && index < e
      );
      setPaymentList(temp_list);
      setPaymentTotalPages(temp_total_pages);
    }
  }, [payments, paymentPage, paymentPageSize, paymentType]);
  return (
    <>
      <div className="flex flex-col bg-gray-100 min-h-[85vh]">
        <UserProfileHeader display={"my-payments"} />
        <div className="flex flex-col gap-3 px-8 md:px-36 mb-12 md:my-12">
          <div className="flex flex-row justify-center items-center bg-white p-1 text-black mx-auto rounded-xl">
            <span className="uppercase bg-black text-white px-8 py-2 rounded-lg">
              Decor
            </span>
            {/* <span className="uppercase px-8 py-2">Makeup</span> */}
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 divide-y-2 md:divide-y-0 divide-black md:divide-x-2 mt-8 border-b-2 bg-white rounded-2xl px-8 py-4 mx-auto">
            <div className="flex flex-col items-center justify-center gap-2 px-4 py-2">
              <p className="text-lg font-medium uppercase text-black">
                Total Bill
              </p>
              <p className="text-3xl font-medium">
                {paymentStats?.totalAmount?.toLocaleString("en-IN", {
                  maximumFractionDigits: 2,
                  style: "currency",
                  currency: "INR",
                })}
              </p>
            </div>
            <div className="flex flex-col items-center justify-center gap-2 text-green-500 px-4 py-2">
              <p className="text-lg font-medium uppercase text-black">
                Amount Paid
              </p>
              <p className="text-3xl font-medium ">
                {paymentStats?.amountPaid?.toLocaleString("en-IN", {
                  maximumFractionDigits: 2,
                  style: "currency",
                  currency: "INR",
                })}
              </p>
            </div>
            <div className="flex flex-col items-center justify-center gap-2 text-rose-900 px-4 py-2">
              <p className="text-lg font-medium uppercase text-black">
                Balance Amount
              </p>
              <p className="text-3xl font-medium ">
                {paymentStats?.amountDue?.toLocaleString("en-IN", {
                  maximumFractionDigits: 2,
                  style: "currency",
                  currency: "INR",
                })}
              </p>
            </div>
          </div>
          <div className="flex flex-col gap-4 mt-12">
            {events
              ?.filter((e) => e?.status?.approved && e?.amount?.due > 0)
              ?.map((item, index) => (
                <div
                  className="bg-white rounded-xl px-8 py-4 shadow-xl flex flex-col md:flex-row gap-4 justify-between md:items-center font-medium"
                  key={index}
                >
                  <div className="flex flex-col">
                    <p>
                      {index + 1}. {item.name}
                    </p>
                    <p>
                      Total Bill:{" "}
                      {(item?.amount?.total).toLocaleString("en-IN", {
                        maximumFractionDigits: 2,
                        style: "currency",
                        currency: "INR",
                      })}
                    </p>
                    <p className="text-green-500">
                      Amount Paid:{" "}
                      {(item?.amount?.paid).toLocaleString("en-IN", {
                        maximumFractionDigits: 2,
                        style: "currency",
                        currency: "INR",
                      })}
                    </p>
                    <p className="text-red-500">
                      Amount Due:{" "}
                      {(item?.amount?.due).toLocaleString("en-IN", {
                        maximumFractionDigits: 2,
                        style: "currency",
                        currency: "INR",
                      })}
                    </p>
                  </div>
                  <Link
                    className="font-semibold bg-rose-900 rounded-full p-2 px-16 text-white text-center"
                    href={`/event/${item._id}/payment`}
                    target="_blank"
                  >
                    Pay Now
                  </Link>
                </div>
              ))}
          </div>
        </div>
        <div className="flex flex-row gap-2 items-center justify-center py-2 px-6 bg-gray-300 text-lg">
          <BsBell />
          <span>
            Last Payment made on{" "}
            {new Date(payments[0]?.createdAt).toLocaleDateString("en-GB", {
              day: "2-digit",
              month: "2-digit",
              year: "numeric",
            }) || ""}
            <span className="font-semibold ml-6">
              {(payments[0]?.amount / 100).toLocaleString("en-IN", {
                maximumFractionDigits: 2,
                style: "currency",
                currency: "INR",
              })}
            </span>
          </span>
        </div>
        <div className="flex flex-col gap-3 px-8 md:px-36 mb-12 my-6 md:my-12">
          <p className="text-lg md:text-md">Payment History</p>
          <div className="flex flex-row gap-2 md:gap-6 items-center flex-wrap">
            {["All", "Complete", "Pending", "Rejected"].map((i) => (
              <div
                key={i}
                className={`text-xs md:text-base rounded-full border bg-white py-1 px-3 md:py-2 md:px-8 cursor-pointer ${
                  paymentType == i ? "border-black" : "border-white"
                }`}
                onClick={() => {
                  setPaymentType(i);
                  setPaymentPage(1);
                }}
              >
                {i}
              </div>
            ))}
          </div>
          <div className="bg-white rounded-2xl flex-col flex gap-3 shadow-xl md:overflow-hidden">
            <div className="w-full md:overflow-x-auto">
              <Table
                hoverable
                className="w-full md:overflow-x-auto text-sm md:text-md"
              >
                <Table.Head>
                  <Table.HeadCell className="hidden md:table-cell">
                    Payment ID
                  </Table.HeadCell>
                  <Table.HeadCell className="py-1 px-2 md:px-6 md:py-3">
                    Date
                  </Table.HeadCell>
                  <Table.HeadCell className="py-1 px-2 md:px-6 md:py-3">
                    Amount
                  </Table.HeadCell>
                  <Table.HeadCell className="py-1 px-2 md:px-6 md:py-3">
                    Payment Mode
                  </Table.HeadCell>
                  <Table.HeadCell className="py-1 px-2 md:px-6 md:py-3">
                    Status
                  </Table.HeadCell>
                  <Table.HeadCell className="py-1 px-2 md:px-6 md:py-3 hidden md:table-cell">
                    Invoice
                  </Table.HeadCell>
                </Table.Head>
                <Table.Body className="divide-y">
                  {paymentList?.map((item, index) => (
                    <Table.Row
                      className="bg-white dark:border-gray-700 dark:bg-gray-800"
                      key={item._id}
                    >
                      <Table.Cell className="hidden md:table-cell whitespace-nowrap font-medium text-gray-900 dark:text-white">
                        {item.razporPayId || item._id}
                      </Table.Cell>
                      <Table.Cell className="py-1 px-2 md:px-6 md:py-4">
                        {new Date(item.createdAt).toLocaleDateString("en-US", {
                          day: "numeric",
                          month: "short",
                          year: "numeric",
                        })}
                      </Table.Cell>
                      <Table.Cell className="font-medium py-1 px-2 md:px-6 md:py-4 hidden md:table-cell">
                        ₹{item.amount / 100}
                      </Table.Cell>{" "}
                      <Table.Cell className="font-medium py-1 px-2 md:px-6 md:py-4  md:hidden">
                        {item.status === "paid" ? (
                          <Link
                            href={`/my-payments/${item._id}/invoice`}
                            className="text-black font-medium hover:text-blue-500"
                            target="_blank"
                          >
                            {`₹${item.amount / 100}`}
                          </Link>
                        ) : (
                          `₹${item.amount / 100}`
                        )}
                      </Table.Cell>
                      <Table.Cell className="py-1 px-2 md:px-6 md:py-4">
                        {toProperCase(
                          ["cash", "upi", "bank-transfer"].includes(
                            item.paymentMethod
                          )
                            ? item?.paymentMethod.replace("-", " ")
                            : item?.transactions[0]?.method
                                ?.split("_")
                                .join(" ") || ""
                        )}
                      </Table.Cell>
                      <Table.Cell className="py-1 px-2 md:px-6 md:py-4">
                        {toProperCase(item.status.split("_").join(" "))}
                      </Table.Cell>
                      <Table.Cell className="py-1 px-2 md:px-6 md:py-4 hidden md:table-cell">
                        {item.status === "paid" && (
                          <Link
                            href={`/my-payments/${item._id}/invoice`}
                            className="text-black font-medium hover:text-blue-500"
                            target="_blank"
                          >
                            Invoice
                          </Link>
                        )}
                      </Table.Cell>
                    </Table.Row>
                  ))}
                </Table.Body>
              </Table>
            </div>
            <div className="p-4 flex flex-row justify-between items-center">
              <Select
                value={paymentPageSize}
                onChange={(e) => {
                  setPaymentPageSize(e.target.value);
                }}
                disabled={loading}
              >
                <option value={10}>10</option>
                <option value={25}>25</option>
                <option value={50}>50</option>
                <option value={100}>100</option>
              </Select>
              <Pagination
                currentPage={paymentPage}
                layout="pagination"
                nextLabel=""
                onPageChange={(newPage) => {
                  setPaymentPage(newPage);
                }}
                previousLabel=""
                showIcons
                totalPages={paymentTotalPages}
              />
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
