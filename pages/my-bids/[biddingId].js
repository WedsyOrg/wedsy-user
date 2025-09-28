import UserProfileHeader from "@/components/layout/UserProfileHeader";
import { toPriceString } from "@/utils/text";
import { Button, Label } from "flowbite-react";
import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import DesktopSubHeader from "@/components/layout/DesktopSubHeader";
import {
  MdChevronRight,
  MdClear,
  MdEdit,
  MdExpandLess,
  MdExpandMore,
  MdOutlineChevronRight,
  MdOutlineKeyboardArrowDown,
  MdOutlineKeyboardArrowUp,
  MdOutlineLocationOn,
  MdPersonOutline,
} from "react-icons/md";
import { RxDashboard } from "react-icons/rx";

export default function Orders({ user }) {
  const router = useRouter();
  const { biddingId } = router.query;
  const [bidding, setBidding] = useState({});
  const [loading, setLoading] = useState(false);
  const [view, setView] = useState("");
  const [expand, setExpand] = useState(false);
  const [showEdit, setShowEdit] = useState(false);
  const [editCity, setEditCity] = useState("");
  const [editDate, setEditDate] = useState("");
  const [editTime, setEditTime] = useState("");
  const openEdit = () => {
    setEditCity(bidding?.requirements?.city || "");
    const d = bidding?.events?.[0];
    setEditDate(d?.date || "");
    setEditTime(d?.time || "");
    setShowEdit(true);
  };
  const saveEdit = async () => {
    const nextEvents = Array.isArray(bidding?.events) && bidding.events.length > 0
      ? [{ ...bidding.events[0], date: editDate, time: editTime }, ...bidding.events.slice(1)]
      : [{ eventName: "", date: editDate, time: editTime, location: "", notes: [], peoples: [] }];
    const body = { events: nextEvents, requirements: { ...(bidding?.requirements || {}), city: editCity } };
    await fetch(`${process.env.NEXT_PUBLIC_API_URL}/bidding/${biddingId}`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
        authorization: `Bearer ${localStorage.getItem("token")}`,
      },
      body: JSON.stringify(body),
    })
      .then((r) => r.json())
      .then(() => {
        setShowEdit(false);
        fetchBidding();
      })
      .catch((e) => console.error(e));
  };
  const fetchBidding = () => {
    setLoading(true);
    fetch(`${process.env.NEXT_PUBLIC_API_URL}/bidding/${biddingId}`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        authorization: `Bearer ${localStorage.getItem("token")}`,
      },
    })
      .then((response) => response.json())
      .then((response) => {
        setLoading(false);
        if (response?._id) {
          setBidding(response);
        } else {
          router.push("/my-bids");
        }
      })
      .catch((error) => {
        console.error("There was a problem with the fetch operation:", error);
      });
  };
  const ViewBid = (_id) => {
    setLoading(true);
    fetch(
      `${process.env.NEXT_PUBLIC_API_URL}/bidding/${biddingId}/view/${_id}`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      }
    )
      .then((response) => response.json())
      .then((response) => {
        setLoading(false);
        if (response.message === "success") {
          fetchBidding();
        }
      })
      .catch((error) => {
        console.error("There was a problem with the fetch operation:", error);
      });
  };
  const AcceptBid = (_id) => {
    setLoading(true);
    fetch(
      `${process.env.NEXT_PUBLIC_API_URL}/bidding/${biddingId}/accept/${_id}`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      }
    )
      .then((response) => response.json())
      .then((response) => {
        setLoading(false);
        if (response.message === "success") {
          // fetchBidding();\
          router.push(`/chats/${response?.chat}`);
        }
      })
      .catch((error) => {
        console.error("There was a problem with the fetch operation:", error);
      });
  };
  const RejectBid = (_id) => {
    setLoading(true);
    fetch(
      `${process.env.NEXT_PUBLIC_API_URL}/bidding/${biddingId}/reject/${_id}`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      }
    )
      .then((response) => response.json())
      .then((response) => {
        setLoading(false);
        if (response.message === "success") {
          fetchBidding();
        }
      })
      .catch((error) => {
        console.error("There was a problem with the fetch operation:", error);
      });
  };
  useEffect(() => {
    if (!document.body.classList.contains("relative")) {
      document.body.classList.add("relative");
    }
    if (biddingId) {
      fetchBidding();
    }
  }, [biddingId]);

  return (
    <>
      <div className="fixed grid grid-cols-4 md:hidden bottom-0 p-4 h-16 w-full items-center bg-white z-50">
        <img src="/assets/icons/icon-category.png" className="mx-auto" />
        <img src="/assets/icons/icon-makeup.png" className="mx-auto" />
        <img src="/assets/icons/icon-event.png" className="mx-auto" />
        <img src="/assets/icons/icon-user.png" className="mx-auto" />
      </div>
      <DesktopSubHeader title="My Bids" />
      {view && (
        <div className="md:hidden bg-white fixed left-0 bottom-12 px-4 py-3 pb-8 w-full z-50 flex flex-col gap-4 rounded-t-[2em]">
          {view &&
            bidding?.bids
              ?.filter((item) => item._id === view)
              ?.map((item, index) => (
                <>
                  <p className="text-2xl text-center relative pt-6">
                    {item?.vendor?.name}{" "}
                    <MdClear
                      className="absolute right-0 top-0"
                      cursor={"pointer"}
                      onClick={() => {
                        setView("");
                      }}
                    />
                  </p>
                  <div className="flex flex-row gap-4 p-6 pt-0 space-y-4">
                    <div className="relative">
                      <div className="bg-gray-300 w-40 h-40 rounded-md pt-[100%] relative">
                        <img
                          src={item?.vendor?.gallery?.coverPhoto}
                          className="absolute top-0 w-full h-full object-cover rounded-xl"
                        />
                      </div>
                      <button
                        onClick={() => {
                          router.push(
                            `/makeup-and-beauty/artists/${item?.vendor?._id}`
                          );
                        }}
                        className="w-max absolute bottom-0 translate-y-1/2 left-1/2 -translate-x-1/2 bg-white text-rose-900 font-medium py-1.5 px-6 rounded-md shadow-sm text-sm transition-all duration-200 hover:shadow-md hover:ring-1 hover:ring-rose-900 active:scale-95"
                      >
                        View
                      </button>
                                             {item?.vendor?.tag && (
                         <div className="absolute top-0 right-0 transform translate-x-1/2 -translate-y-1/2 bg-pink-500 text-white text-xs font-bold py-1 px-2 sm:px-3 rounded-tr-md rounded-bl-md uppercase whitespace-nowrap z-10">
                           {item?.vendor?.tag}
                         </div>
                       )}
                    </div>
                    <div className="space-y-1 pt-6">
                      <p className="text-gray-700 text-sm">
                        {item?.vendor?.other?.experience
                          ? `${item.vendor.other.experience}+ years of experience`
                          : null}
                      </p>
                      <p className="text-gray-700 text-sm">
                        {item?.vendor?.other?.clients
                          ? `${item.vendor.other.clients}+ orders done`
                          : null}
                      </p>
                      <p className="text-gray-700 text-sm">
                        {(item?.vendor?.reviewsCount ?? 0) + " + reviews"}
                      </p>
                      <p className="text-gray-700 text-sm flex items-center">
                        <MdOutlineLocationOn size={18} className="text-black-700 mr-1" />
                        {item?.vendor?.businessAddress?.locality ||
                          item?.vendor?.businessAddress?.city ||
                          "-"}
                      </p>
                    </div>
                  </div>
                  <Label value="Note by the Artist:" className="text-lg" />
                  <div className="bg-[#FFDA57] p-4 rounded-lg w-full">
                    {item?.vendor_notes}
                  </div>
                  {!item?.status?.userAccepted &&
                    !item?.status?.userRejected && (
                      <div className="bg-white rounded-lg grid grid-cols-2 px-8 py-4 gap-6">
                        <button
                          className="bg-white border border-rose-900 text-rose-900 rounded-lg text-sm py-1 transition-all duration-200 hover:bg-rose-50 hover:shadow-sm active:scale-95"
                          onClick={() => {
                            RejectBid(item?._id);
                          }}
                        >
                          Decline
                        </button>
                        <button
                          className="bg-rose-900 border border-rose-900 text-white rounded-lg text-sm py-1 transition-all duration-200 hover:bg-rose-800 hover:shadow-sm active:scale-95"
                          onClick={() => {
                            AcceptBid(item?._id);
                          }}
                        >
                          Accept & Chat
                        </button>
                      </div>
                    )}
                </>
              ))}
        </div>
      )}
      <div className="flex flex-col bg-gray-100 h-screen">
        <div className="grid md:grid-cols-5 gap-4 px-6 md:px-24 py-6 flex-1 overflow-auto">
          <div className="md:col-span-2 md:px-4 relative flex flex-col gap-6">
            <div
              className={`${
                expand ? "text-[#2B3F6C] bg-white" : "bg-[#2B3F6C] text-white"
              } p-6 rounded-lg flex md:hidden flex-col space-y-4 divide-y`}
            >
              <div className="flex flex-row gap-4 items-center justify-between">
                <span className="text-lg font-medium">MY REQUIREMENTS</span>
                <div className="flex items-center gap-3">
                  {expand && (
                    <button
                      onClick={openEdit}
                      className="p-1.5 rounded bg-white text-[#2B3F6C] active:scale-95"
                      aria-label="Edit requirements"
                    >
                      <MdEdit size={18} />
                    </button>
                  )}
                  {expand ? (
                    <MdOutlineKeyboardArrowUp
                      size={24}
                      cursor={"pointer"}
                      onClick={() => {
                        setExpand(false);
                      }}
                    />
                  ) : (
                    <MdOutlineKeyboardArrowDown
                      size={24}
                      cursor={"pointer"}
                      onClick={() => {
                        setExpand(true);
                      }}
                    />
                  )}
                </div>
              </div>
              {expand && (
                <>
                  {bidding?.events?.map((item, index) => (
                    <div className="text-sm pt-4" key={index}>
                      <div className="flex flex-row justify-between mb-4">
                        <p className="text-lg font-semibold">
                          {item?.eventName}
                        </p>
                        <div className="text-right">
                          <div className="text-sm font-medium">
                            {new Date(item?.date)?.toLocaleDateString("en-GB", {
                              day: "2-digit",
                              month: "short",
                              year: "numeric",
                            })}
                          </div>
                          <div className="text-xs text-gray-600 mt-1">
                            {`${item?.time} ${
                              +item?.time.split(":")[0] < 12 ? "AM" : "PM"
                            }`}
                          </div>
                        </div>
                      </div>
                      <div className="flex flex-row gap-3 items-center mb-3">
                        <MdOutlineLocationOn className="flex-shrink-0 text-sm" />
                        <p className="text-sm text-gray-700">
                          {item?.location}
                        </p>
                      </div>
                      {item?.peoples?.map((rec, recIndex) => (
                        <div key={recIndex} className="mb-3">
                          <div className="flex flex-row gap-3 items-center mb-2">
                            <MdPersonOutline className="flex-shrink-0 text-sm" />
                            <p className="text-sm text-gray-700">{rec?.noOfPeople}</p>
                            <p className="text-sm text-gray-600">{rec.makeupStyle}</p>
                            <p className="text-sm text-gray-600">{rec.preferredLook}</p>
                          </div>
                          <div className="flex flex-row gap-3 items-center">
                            <RxDashboard className="flex-shrink-0 text-sm" />
                            <p className="text-sm text-gray-600">{rec?.addOns}</p>
                          </div>
                        </div>
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
                </>
              )}
            </div>
            <div className="hidden md:block absolute right-0 top-8 h-3/4 w-px bg-black/20" />
            <div className="hidden bg-[#2B3F6C] p-6 rounded-lg md:flex flex-row gap-4 items-center justify-between">
              <span className="text-lg text-white font-medium">
                MY REQUIREMENTS
              </span>
              <MdChevronRight
                size={24}
                cursor={"pointer"}
                color="white"
                onClick={() => {
                  setView("");
                }}
              />
            </div>
            <div className="flex items-center space-x-4 my-2">
              <p className="text-xl ">New Quotations</p>
              <div className="flex-grow border-t border-gray-300" />
              <div className="flex items-center justify-center w-6 h-6 bg-rose-900 text-white rounded-full text-xs">
                {((bidding?.bids ?? []).filter((i) => !i?.status?.userViewed)).length}
              </div>
            </div>
            {bidding?.bids
              ?.filter((i) => !i?.status?.userViewed)
              ?.map((item, index) => (
                <div
                  key={item?._id}
                  className="p-4 grid grid-cols-4 md:grid-cols-5 gap-4 bg-white rounded-xl transition-all duration-200 hover:shadow-lg hover:-translate-y-0.5"
                >
                  <div className="bg-gray-500 pt-[100%] w-full relative">
                    <img
                      src={item?.vendor?.gallery?.coverPhoto}
                      className="absolute top-0 w-full h-full object-cover rounded-xl"
                    />
                  </div>
                  <div className="col-span-3 md:col-span-4 relative flex flex-col justify-between">
                    <p className="uppercase text-base md:text-xl font-medium">
                      {item?.vendor?.name}
                    </p>
                    <p className="text-xs md:text-sm">
                      Price Offered &nbsp;
                      <span className="text-rose-900 text-lg md:text-2xl font-medium">
                        {toPriceString(item?.bid)}
                      </span>
                    </p>
                    <MdOutlineChevronRight
                      className="absolute right-0 top-1/2 -translate-y-1/2 transition-transform duration-200 group-hover:translate-x-1"
                      size={24}
                      cursor={"pointer"}
                      onClick={() => {
                        setView(item._id);
                        ViewBid(item?._id);
                      }}
                    />
                  </div>
                </div>
              ))}

              {/* left cards of vendor for All dimensions*/}
            <div className="w-full border-t border-gray-300" />
            {bidding?.bids
              ?.filter((i) => i?.status?.userViewed && !i?.status?.userRejected)
              ?.map((item, index) => (
                <div
                  key={item?._id}
                  className="p-4 grid grid-cols-4 md:grid-cols-5 gap-4 bg-white rounded-xl transition-all duration-200 hover:shadow-lg hover:-translate-y-0.5"
                >
                  <div className="bg-gray-500 pt-[100%] w-full relative">
                    <img
                      src={item?.vendor?.gallery?.coverPhoto}
                      className="absolute top-0 w-full h-full object-cover rounded-xl"
                    />
                    {/* {item?.vendor?.tag && (
                      <div className="absolute top-[1%] right-[0%] bg-pink-500 text-white text-[10px] sm:text-[9px] md:text-[10px] font-bold py-0.5 px-1 sm:py-1 sm:px-2 rounded-tr-sm rounded-bl-sm uppercase whitespace-nowrap z-10">
                        {item?.vendor?.tag}
                      </div>
                    )} */}
                  </div>
                  <div className="col-span-3 md:col-span-4 relative flex flex-col justify-between">
                    <p className="uppercase text-base md:text-xl font-medium">
                      {item?.vendor?.name}
                    </p>
                    
                    <p className="text-xs md:text-sm">
                      Price Offered &nbsp;
                      <span className="text-rose-900 text-lg md:text-2xl font-medium">
                        {toPriceString(item?.bid)}
                      </span>
                    </p>
                    <MdOutlineChevronRight
                      className="absolute right-0 top-1/2 -translate-y-1/2 transition-transform duration-200 group-hover:translate-x-1"
                      size={24}
                      cursor={"pointer"}
                      onClick={() => {
                        setView(item._id);
                      }}
                    />
                  </div>
                </div>
              ))}
          </div>
          <div className="hidden md:flex flex-col gap-6 col-span-3 p-4">
            {view === "" && (
              <>
                <div className="flex flex-row items-center justify-between">
                  <p className="text-2xl">Your Requirements</p>
                  <Button color="dark" onClick={openEdit}>
                    Edit &nbsp; <MdEdit />
                  </Button>
                </div>
                <div className="flex flex-col space-y-4 divide-y rounded-xl p-6 bg-white">
                  {bidding?.events?.map((item, index) => (
                    <div className="pt-6" key={index}>
                      <div className="flex items-start justify-between mb-4">
                        <p className="text-2xl font-semibold text-[#2B3F6C]">
                          {item?.eventName}
                        </p>
                        <div className="text-right text-gray-700 leading-tight">
                          <div>
                            {new Date(item?.date)?.toLocaleDateString("en-GB", {
                              day: "2-digit",
                              month: "short",
                              year: "numeric",
                            })}
                          </div>
                          <div className="font-medium">
                            {`${item?.time} ${
                              +item?.time.split(":")[0] < 12 ? "AM" : "PM"
                            }`}
                          </div>
                        </div>
                      </div>
                      <div className="flex items-center gap-3 text-gray-900 mb-3">
                        <MdOutlineLocationOn size={20} className="text-[#2B3F6C]" />
                        <span>{item?.location}</span>
                      </div>
                      {item?.peoples?.map((rec, recIndex) => (
                        <div key={recIndex} className="mb-3">
                          <div className="flex items-center gap-8 text-gray-900">
                            <span className="flex items-center gap-2">
                              <MdPersonOutline size={20} className="text-[#2B3F6C]" />
                              {rec?.noOfPeople}
                            </span>
                            <span>{rec.makeupStyle}</span>
                            <span>{rec.preferredLook}</span>
                          </div>
                          <div className="flex items-center gap-3 mt-2 text-gray-900">
                            <RxDashboard size={18} className="text-[#2B3F6C]" />
                            <span>{rec?.addOns}</span>
                          </div>
                        </div>
                      ))}
                      {item?.notes?.length > 0 && (
                        <>
                          <Label className="mt-4" value="NOTES" />
                          <div className="border rounded-lg p-2 bg-white">
                            {item?.notes?.join("\n")}
                          </div>
                        </>
                      )}
                    </div>
                  ))}
                </div>
              </>
            )}
            {view &&
              bidding?.bids
                ?.filter((item) => item._id === view)
                ?.map((item, index) => (
                  <>
                    <p className="text-2xl">{item?.vendor?.name}</p>
                    <div className="flex flex-row gap-4 bg-white rounded-lg shadow-md p-6 space-y-4">
                      <div className="relative">
                        <div className="bg-gray-300 w-40 h-40 rounded-md pt-[100%] relative">
                          <img
                            src={item?.vendor?.gallery?.coverPhoto}
                            className="absolute top-0 w-full h-full object-cover rounded-xl"
                          />
                        </div>
                        <button
                          onClick={() => {
                            router.push(
                              `/makeup-and-beauty/artists/${item?.vendor?._id}`
                            );
                          }}
                          className="w-max absolute bottom-0 translate-y-1/2 left-1/2 -translate-x-1/2 bg-white text-rose-900 text-sm font-medium py-1.5 px-4 rounded-full shadow-sm"
                        >
                          View profile
                        </button>
                                                 {item?.vendor?.tag && (
                           <div className="absolute top-0 right-0 transform translate-x-1/2 -translate-y-1/2 bg-pink-500 text-white text-xs font-bold py-1 px-2 sm:px-3 rounded-tr-md rounded-bl-md uppercase whitespace-nowrap z-10">
                             {item?.vendor?.tag}
                           </div>
                         )}
                      </div>
                      <div className="space-y-1 pt-6">
                        <p className="text-gray-700 text-sm">
                          {item?.vendor?.other?.experience
                            ? `${item.vendor.other.experience}+ years of experience`
                            : null}
                        </p>
                        <p className="text-gray-700 text-sm">
                          {item?.vendor?.other?.clients
                            ? `${item.vendor.other.clients}+ orders done`
                            : null}
                        </p>
                        <p className="text-gray-700 text-sm">
                          {(item?.vendor?.reviewsCount ?? 0) + " + reviews"}
                        </p>
                        <p className="text-gray-700 text-sm flex items-center">
                          <MdOutlineLocationOn size={18} className="text-black-700 mr-1" />
                          {item?.vendor?.businessAddress?.locality ||
                            item?.vendor?.businessAddress?.city ||
                            "-"}
                        </p>
                      </div>
                    </div>
                    <Label value="Note by the Artist:" className="text-lg" />
                    <div className="bg-[#FFDA57] p-4 rounded-lg">
                      {item?.vendor_notes}
                    </div>
                    {!item?.status?.userAccepted &&
                      !item?.status?.userRejected && (
                        <div className="bg-white rounded-lg grid grid-cols-2 px-8 py-4 gap-6">
                          <button
                            className="bg-white border border-rose-900 text-rose-900 rounded-lg text-sm py-1"
                            onClick={() => {
                              RejectBid(item?._id);
                            }}
                          >
                            Decline
                          </button>
                          <button
                            className="bg-rose-900 border border-rose-900 text-white rounded-lg text-sm py-1"
                            onClick={() => {
                              AcceptBid(item?._id);
                            }}
                          >
                            Accept & Chat
                          </button>
                        </div>
                      )}
                  </>
                ))}
          </div>
        </div>
      </div>
      {showEdit && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40">
          <div className="bg-white rounded-lg shadow-lg p-6 w-[90%] max-w-md">
            <p className="text-xl font-semibold mb-4">Edit Requirements</p>
            <div className="space-y-3">
              <label className="block text-sm">City</label>
              <input className="w-full border rounded px-3 py-2" value={editCity} onChange={(e)=>setEditCity(e.target.value)} />
              <label className="block text-sm mt-3">Date</label>
              <input type="date" className="w-full border rounded px-3 py-2" value={editDate} onChange={(e)=>setEditDate(e.target.value)} />
              <label className="block text-sm mt-3">Time</label>
              <input type="time" className="w-full border rounded px-3 py-2" value={editTime} onChange={(e)=>setEditTime(e.target.value)} />
            </div>
            <div className="flex justify-end gap-3 mt-6">
              <button className="px-4 py-2 rounded border" onClick={()=>setShowEdit(false)}>Cancel</button>
              <button className="px-4 py-2 rounded bg-rose-900 text-white" onClick={saveEdit}>Save</button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
