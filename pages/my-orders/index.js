import UserProfileHeader from "@/components/layout/UserProfileHeader";
import MobileStickyFooter from "@/components/layout/MobileStickyFooter";
import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import { MdChevronRight, MdExpandLess, MdExpandMore } from "react-icons/md";

export default function Orders({ user }) {
  const router = useRouter();
  const [events, setEvents] = useState([]);
  const [event, setEvent] = useState({});
  const [loading, setLoading] = useState(false);
  const [eventId, setEventId] = useState("");
  const [eventDayId, setEventDayId] = useState([]);
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
  const fetchEvents = () => {
    setLoading(true);
    fetch(`${process.env.NEXT_PUBLIC_API_URL}/event`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        authorization: `Bearer ${localStorage.getItem("token")}`,
      },
    })
      .then((response) => response.json())
      .then((response) => {
        setLoading(false);
        setEvents(response);
      })
      .catch((error) => {
        console.error("There was a problem with the fetch operation:", error);
      });
  };
  const fetchEvent = () => {
    setLoading(true);
    fetch(`${process.env.NEXT_PUBLIC_API_URL}/event/${eventId}?populate=true`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        authorization: `Bearer ${localStorage.getItem("token")}`,
      },
    })
      .then((response) => response.json())
      .then((response) => {
        if (response.message !== "error") {
          setLoading(false);
          setEvent(response);
        } else {
          router.push("/event");
        }
      })
      .catch((error) => {
        console.error("There was a problem with the fetch operation:", error);
        router.push("/event");
      });
  };

  useEffect(() => {
    fetchEvents();
    fetchOrders();
  }, []);
  useEffect(() => {
    if (eventId && !loading) {
      fetchEvent();
    }
  }, [eventId]);
  return (
    <>
    <MobileStickyFooter />
      <div className="flex flex-col bg-gray-100 min-h-[100vh]">
        {/* <UserProfileHeader display={"my-orders"} /> */}
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
        <div className="flex flex-col gap-3 px-8 md:px-36 mb-12 md:my-12">
          {eventId && event?._id ? (
            <div className="flex flex-col gap-4">
              <p className="flex flex-row gap-2 text-rose-900 font-semibold text-lg">
                ORDER CONFIRMED ✅
              </p>
              <p className="text-sm mx-4">Order Details</p>
              <div className="divide-y divide-black border-b-2 border-b-rose-900">
                {event?.eventDays?.map((item, index) => (
                  <div
                    className="flex flex-col md:px-4 md:mx-4 py-3"
                    key={index}
                  >
                    <div className="grid grid-cols-2 md:grid-cols-4 md:text-lg gap-6">
                      <div className="flex flex-row items-center gap-6">
                        {eventDayId.includes(item._id) ? (
                          <MdExpandLess
                            cursor={"pointer"}
                            onClick={() => {
                              if (!loading) {
                                setEventDayId(
                                  eventDayId.filter((i) => i._id !== item._id)
                                );
                              }
                            }}
                            size={24}
                          />
                        ) : (
                          <MdExpandMore
                            cursor={"pointer"}
                            onClick={() => {
                              if (!loading) {
                                setEventDayId([...eventDayId, item._id]);
                              }
                            }}
                            size={24}
                          />
                        )}
                        <span className="font-medium">{item.name}</span>
                      </div>
                      <span className="hidden md:block font-medium mr-auto">
                        ₹
                        {item?.decorItems.reduce(
                          (accumulator, currentValue) => {
                            return accumulator + currentValue.price;
                          },
                          0
                        ) +
                          item?.packages.reduce((accumulator, currentValue) => {
                            return accumulator + currentValue.price;
                          }, 0) +
                          item?.customItems.reduce(
                            (accumulator, currentValue) => {
                              return accumulator + currentValue.price;
                            },
                            0
                          ) +
                          item?.mandatoryItems.reduce(
                            (accumulator, currentValue) => {
                              return accumulator + currentValue.price;
                            },
                            0
                          )}
                      </span>
                      <span className="md:col-span-2 place-self-end">
                        {new Date(item.date).toLocaleDateString("en-GB", {
                          day: "numeric",
                          month: "short",
                          year: "numeric",
                        })}
                      </span>
                    </div>
                    {eventDayId.includes(item._id) && (
                      <div className="px-6 md:px-12 py-4 md:w-1/2 gap-2 flex flex-col text-sm md:text-md">
                        <div className="grid grid-cols-3 gap-4">
                          <p className="col-span-2">Product</p>
                          <p className="text-right">Price</p>
                        </div>
                        {item?.decorItems?.map((rec, recIndex) => (
                          <div
                            className="grid grid-cols-3 gap-4"
                            key={rec?._id}
                          >
                            <p className="col-span-2">
                              {recIndex + 1}. [{rec.decor.category}]{" "}
                              {rec.decor.name}
                            </p>
                            <p className="text-right">₹{rec.price}</p>
                          </div>
                        ))}
                        {item?.packages?.map((rec, recIndex) => (
                          <div
                            className="grid grid-cols-3 gap-4"
                            key={rec?._id}
                          >
                            <p className="col-span-2">
                              {item?.decorItems.length + recIndex + 1}.
                              [Package] {rec.package.name}
                            </p>
                            <p className="text-right">₹{rec.price}</p>
                          </div>
                        ))}
                        {item.customItems.length > 0 && (
                          <div className="grid grid-cols-3 gap-4">
                            <p className="col-span-2">
                              {item?.decorItems.length +
                                item?.packages.length +
                                1}
                              . {item.customItemsTitle || "ADD ONS"}
                            </p>
                            <p className="text-right">
                              ₹
                              {item?.customItems.reduce(
                                (accumulator, currentValue) => {
                                  return accumulator + currentValue.price;
                                },
                                0
                              )}
                            </p>
                          </div>
                        )}
                        {item?.mandatoryItems
                          .filter((i) => i.itemRequired)
                          ?.map((rec, recIndex) => (
                            <div
                              className="grid grid-cols-3 gap-4"
                              key={recIndex}
                            >
                              <p className="col-span-2">
                                {item?.decorItems.length +
                                  item?.packages.length +
                                  (item.customItems.length ? 1 : 0) +
                                  recIndex +
                                  1}
                                . {rec.description}
                              </p>
                              <p className="text-right">₹{rec.price}</p>
                            </div>
                          ))}
                        <div className="grid grid-cols-3 gap-4 border-t border-t-rose-900 py-2 font-medium">
                          <p className="col-span-2">Total</p>
                          <p className="text-right">
                            ₹
                            {item?.decorItems.reduce(
                              (accumulator, currentValue) => {
                                return accumulator + currentValue.price;
                              },
                              0
                            ) +
                              item?.packages.reduce(
                                (accumulator, currentValue) => {
                                  return accumulator + currentValue.price;
                                },
                                0
                              ) +
                              item?.customItems.reduce(
                                (accumulator, currentValue) => {
                                  return accumulator + currentValue.price;
                                },
                                0
                              ) +
                              item?.mandatoryItems.reduce(
                                (accumulator, currentValue) => {
                                  return accumulator + currentValue.price;
                                },
                                0
                              )}
                          </p>
                        </div>
                      </div>
                    )}
                  </div>
                ))}
              </div>
              <div className="grid grid-cols-2 md:grid-cols-4 text-lg gap-6 mx-4 md:px-4">
                <div className="flex flex-row items-center gap-6">
                  <span className="font-medium mr-12">Total bill</span>
                </div>
                <p className="font-semibold mr-auto text-rose-900 w-full md:w-auto text-right md:text-left">
                  ₹
                  {event.eventDays?.reduce(
                    (masterAccumulator, masterCurrentValue) => {
                      return (
                        masterAccumulator +
                        masterCurrentValue.decorItems.reduce(
                          (accumulator, currentValue) => {
                            return accumulator + currentValue.price;
                          },
                          0
                        ) +
                        masterCurrentValue?.packages.reduce(
                          (accumulator, currentValue) => {
                            return accumulator + currentValue.price;
                          },
                          0
                        ) +
                        masterCurrentValue?.customItems.reduce(
                          (accumulator, currentValue) => {
                            return accumulator + currentValue.price;
                          },
                          0
                        ) +
                        masterCurrentValue?.mandatoryItems.reduce(
                          (accumulator, currentValue) => {
                            return accumulator + currentValue.price;
                          },
                          0
                        )
                      );
                    },
                    0
                  )}
                </p>
              </div>
            </div>
          ) : (
            <div className="flex flex-col gap-4 mt-6 bg-white md:bg-gray-100 p-4 md:p-0 rounded-lg md:border-b md:border-b-black pb-4">
              <p className="text-xl font-medium">DECOR</p>
              {events.map((item, index) => (
                <div
                  className="flex flex-row justify-between items-center px-4 font-medium text-lg"
                  key={index}
                >
                  <span>{item.name}</span>
                  <MdChevronRight
                    cursor={"pointer"}
                    onClick={() => {
                      if (!loading) {
                        setEventId(item._id);
                        setEvent({});
                      }
                    }}
                  />
                </div>
              ))}
            </div>
          )}
          <div className="flex flex-col gap-4 mt-6 bg-white md:bg-gray-100 p-4 md:p-0 rounded-lg md:border-b md:border-b pb-4">
            <div
              className="flex flex-row justify-between items-center px-4 pl-0 font-medium text-lg cursor-pointer"
              onClick={() => {
                router.push("/my-orders/makeup-and-beauty");
              }}
            >
              <p className="text-xl font-medium">MAKEUP & BEAUTY</p>
              <MdChevronRight cursor={"pointer"} />
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
