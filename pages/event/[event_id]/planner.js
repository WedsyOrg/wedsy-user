import AddEventDayModal from "@/components/event-tool/AddEventDayModal";
import CustomItemsTable from "@/components/event-tool/CustomItemsTable";
import DecorItemsList from "@/components/event-tool/DecorItemsList";
import DecorPackagesList from "@/components/event-tool/DecorPackagesList";
import EventDayInfo from "@/components/event-tool/EventDayInfo";
import EventSummaryTable from "@/components/event-tool/EventSummaryTable";
import EventToolHeader from "@/components/event-tool/EventToolHeader";
import EventEditModal from "@/components/event-tool/EventEditModal";
import EventToolSidebar from "@/components/event-tool/EventToolSidebar";
import MandatoryItemsList from "@/components/event-tool/MandatoryItemsList";
import NotesModal from "@/components/event-tool/NotesModal";
import SetupLocationImageModal from "@/components/event-tool/SetupLocationImageModal";
import TotalSummaryTable from "@/components/event-tool/TotalSummaryTable";
import {toPriceString} from "@/utils/text";
import Link from "next/link";
import {useRouter} from "next/router";
import React, {useEffect, useRef, useState} from "react";

export default function EventTool({user}) {
  const divRef = useRef(null);
  const plannerRef = useRef(null);
  const [divSize, setDivSize] = useState({width: 0, height: 0});
  const [displayKey, setDisplayKey] = useState("");
  const router = useRouter();
  const [event, setEvent] = useState({});
  const [eventDay, setEventDay] = useState();
  const {event_id} = router.query;
  const [loading, setLoading] = useState(false);
  const [setupLocationImage, setSetupLocationImage] = useState({
    open: false,
    image: "",
  });
  const [notes, setNotes] = useState({
    open: false,
    edit: false,
    loading: false,
    event_id: "",
    eventDay: "",
    decor_id: "",
    package_id: "",
    admin_notes: "",
    user_notes: "",
  });
  const [editModalOpen, setEditModalOpen] = useState(false);
  const [addEventDayModalOpen, setAddEventDayModalOpen] = useState(false);
  const [platformPrice, setPlatformPrice] = useState({price: 0, image: ""});
  const [flooringPrice, setFlooringPrice] = useState([]);
  const [categoryList, setCategoryList] = useState([]);
  const fetchCategoryList = () => {
    setLoading(true);
    fetch(`${process.env.NEXT_PUBLIC_API_URL}/category`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        authorization: `Bearer ${localStorage.getItem("token")}`,
      },
    })
      .then((response) => response.json())
      .then((response) => {
        setLoading(false);
        setCategoryList(response);
      })
      .catch((error) => {
        console.error("There was a problem with the fetch operation:", error);
      });
  };
  const fetchPlatformInfo = () => {
    setLoading(true);
    fetch(`${process.env.NEXT_PUBLIC_API_URL}/config?code=platform`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
      },
    })
      .then((response) => response.json())
      .then((response) => {
        setLoading(false);
        setPlatformPrice({
          image: "",
          ...response?.data,
          price: parseInt(response?.data?.price),
        });
      })
      .catch((error) => {
        console.error("There was a problem with the fetch operation:", error);
      });
  };
  const fetchFlooringInfo = () => {
    setLoading(true);
    fetch(`${process.env.NEXT_PUBLIC_API_URL}/config?code=flooring`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
      },
    })
      .then((response) => response.json())
      .then((response) => {
        setLoading(false);
        setFlooringPrice(
          response?.data?.flooringList?.map((i) => ({
            ...i,
            price: parseInt(i.price),
          })) || []
        );
      })
      .catch((error) => {
        console.error("There was a problem with the fetch operation:", error);
      });
  };
  const fetchEvent = () => {
    fetch(
      `${process.env.NEXT_PUBLIC_API_URL}/event/${event_id}?populate=true`,
      {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      }
    )
      .then((response) => response.json())
      .then((response) => {
        if (response.message !== "error") {
          if (response.eventDays.length > 0) {
            setEvent(response);
            if (router.query.eventDay) {
              setEventDay(router.query.eventDay);
            } else {
              setEventDay(response.eventDays[0]._id);
            }
          } else {
            router.push(`/event/${event_id}`);
          }
        } else {
          router.push("/event");
        }
      })
      .catch((error) => {
        console.error("There was a problem with the fetch operation:", error);
        router.push("/event");
      });
  };
  const finalizeEvent = () => {
    fetch(`${process.env.NEXT_PUBLIC_API_URL}/event/${event_id}/finalize`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        authorization: `Bearer ${localStorage.getItem("token")}`,
      },
    })
      .then((response) => (response.ok ? response.json() : null))
      .then((response) => {
        if (response.message === "success") {
          fetchEvent();
          alert("Finalized the event!");
        } else {
          alert("Error, finalizing the event. Try Again.");
        }
      })
      .catch((error) => {
        console.error("There was a problem with the fetch operation:", error);
      });
  };
  const UpdateDecorItemInEvent = ({
    decor_id,
    platform,
    platformRate,
    flooring,
    flooringRate,
    decorPrice,
    dimensions,
    quantity,
    variant,
    category,
    unit,
    addOns,
    productVariant,
    priceModifier,
    event_id,
    eventDay,
  }) => {
    setLoading(true);
    fetch(
      `${process.env.NEXT_PUBLIC_API_URL}/event/${event_id}/decor/${eventDay}`,
      {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          authorization: `Bearer ${localStorage.getItem("token")}`,
        },
        body: JSON.stringify({
          decor_id,
          platform,
          flooring,
          dimensions,
          category,
          variant,
          quantity,
          unit,
          decorPrice,
          platformRate,
          flooringRate,
          price:
            quantity * (decorPrice + priceModifier) +
            (platform
              ? dimensions.length * dimensions.breadth * platformPrice.price
              : 0) +
            (dimensions.length + dimensions.height) *
              (dimensions.breadth + dimensions.height) *
              (flooringPrice.find((i) => i.title === flooring)?.price || 0) +
            addOns?.reduce((accumulator, currentValue) => {
              return accumulator + currentValue.price;
            }, 0),
          productVariant,
          priceModifier,
        }),
      }
    )
      .then((response) => (response.ok ? response.json() : null))
      .then((response) => {
        if (response.message === "success") {
          setLoading(false);
          fetchEvent();
        }
      })
      .catch((error) => {
        console.error("There was a problem with the fetch operation:", error);
      });
  };
  const UpdateNotes = () => {
    fetch(
      `${process.env.NEXT_PUBLIC_API_URL}/event/${event_id}/eventDay/${eventDay}/notes`,
      {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          authorization: `Bearer ${localStorage.getItem("token")}`,
        },
        body: JSON.stringify({
          decor_id: notes.decor_id,
          package_id: notes.package_id,
          admin_notes: notes.admin_notes,
          user_notes: notes.user_notes,
        }),
      }
    )
      .then((response) => (response.ok ? response.json() : null))
      .then((response) => {
        if (response.message === "success") {
          setNotes({
            open: false,
            edit: false,
            loading: false,
            event_id: "",
            eventDay: "",
            decor_id: "",
            package_id: "",
            admin_notes: "",
            user_notes: "",
          });
          fetchEvent();
        }
      })
      .catch((error) => {
        console.error("There was a problem with the fetch operation:", error);
      });
  };
  useEffect(() => {
    fetchEvent();
    fetchCategoryList();
    fetchFlooringInfo();
    fetchPlatformInfo();
  }, []);
  useEffect(() => {
    const handleResize = () => {
      if (divRef.current) {
        const {width, height} = divRef.current.getBoundingClientRect();
        const {top} = divRef.current.getBoundingClientRect();
        const totalHeight = window.innerHeight;
        setDivSize({width, height: totalHeight - top});
      }
    };
    // Call handleResize initially to set the initial size
    handleResize();
    // Attach the event listener for window resize
    window.addEventListener("resize", handleResize);
    // Cleanup the event listener on component unmount
    return () => {
      window.removeEventListener("resize", handleResize);
    };
  }, []);
  const handlePlannerScroll = () => {
    if (plannerRef.current) {
      const plannerElements = Array.from(plannerRef.current.children);
      for (let i = plannerElements.length - 1; i >= 0; i--) {
        if (plannerElements[i].getAttribute("data-key")) {
          const rect = plannerElements[i].getBoundingClientRect();
          if (rect.top <= plannerRef.current.offsetTop + 5) {
            setDisplayKey(plannerElements[i].getAttribute("data-key"));
            break;
          }
        }
      }
    }
  };
  const handlePlannerClick = (key) => {
    if (plannerRef.current) {
      const plannerElement = plannerRef.current.querySelector(
        `[data-key="${key}"]`
      );
      if (plannerElement) {
        const offsetTop = plannerElement.offsetTop - divRef.current.offsetTop;
        plannerRef.current.scrollTo({
          top: offsetTop,
          behavior: "smooth",
        });
      }
    }
  };
  const RemoveDecorFromEvent = ({decor_id}) => {
    fetch(
      `${process.env.NEXT_PUBLIC_API_URL}/event/${event_id}/decor/${eventDay}`,
      {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
          authorization: `Bearer ${localStorage.getItem("token")}`,
        },
        body: JSON.stringify({
          decor: decor_id,
        }),
      }
    )
      .then((response) => (response.ok ? response.json() : null))
      .then((response) => {
        if (response.message === "success") {
          fetchEvent();
          alert("Item removed from event!");
        }
      })
      .catch((error) => {
        console.error("There was a problem with the fetch operation:", error);
      });
  };
  const RemovePackageFromEvent = ({package_id}) => {
    fetch(
      `${process.env.NEXT_PUBLIC_API_URL}/event/${event_id}/decor-package/${eventDay}`,
      {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
          authorization: `Bearer ${localStorage.getItem("token")}`,
        },
        body: JSON.stringify({
          package: package_id,
        }),
      }
    )
      .then((response) => (response.ok ? response.json() : null))
      .then((response) => {
        if (response.message === "success") {
          fetchEvent();
          alert("Item removed from event!");
        }
      })
      .catch((error) => {
        console.error("There was a problem with the fetch operation:", error);
      });
  };
  return (
    <>
      <NotesModal
        notes={notes}
        setNotes={setNotes}
        UpdateNotes={UpdateNotes}
        allowEdit={true}
      />
      <EventEditModal
        show={editModalOpen}
        onClose={() => setEditModalOpen(false)}
        event={event}
        onSaved={fetchEvent}
        eventDayId={eventDay}
      />
      <SetupLocationImageModal
        setSetupLocationImage={setSetupLocationImage}
        setupLocationImage={setupLocationImage}
      />
      <AddEventDayModal
        fetchEvent={fetchEvent}
        show={addEventDayModalOpen}
        onClose={() => setAddEventDayModalOpen(false)}
        loading={loading}
        setLoading={setLoading}
        event_id={event_id}
      />
      <div className="flex flex-col overflow-hidden hide-scrollbar bg-gray-100">
        <EventToolHeader
          fetchEvent={fetchEvent}
          event={event}
          setEventDay={setEventDay}
          eventDay={eventDay}
          setAddEventDayModalOpen={setAddEventDayModalOpen}
          allowEdit={true}
          event_id={event_id}
          onEditEvent={() => setEditModalOpen(true)}
        />
        <div
          className="grid md:grid-cols-5 gap-6 py-4 overflow-hidden hide-scrollbar grow"
          ref={divRef}
          style={{height: divSize.height ?? "100vh"}}
        >
          <EventToolSidebar
            tempEventDay={event.eventDays?.filter((i) => i._id === eventDay)[0]}
            categoryList={categoryList}
            displayKey={displayKey}
            handlePlannerClick={handlePlannerClick}
          />
          <div
            className="overflow-y-auto hide-scrollbar col-span-4 flex flex-col md:px-0"
            ref={plannerRef}
            onScroll={handlePlannerScroll}
          >
            {event.eventDays
              ?.filter((i) => i._id === eventDay)
              ?.map((tempEventDay) => (
                <React.Fragment key={tempEventDay._id}>
                  <EventDayInfo
                    tempEventDay={tempEventDay}
                    status={event?.status}
                    eventPlanner={event?.eventPlanner}
                  />
                  <DecorItemsList
                    setSetupLocationImage={setSetupLocationImage}
                    setupLocationImage={setupLocationImage}
                    UpdateDecorItemInEvent={UpdateDecorItemInEvent}
                    decorItems={tempEventDay?.decorItems}
                    categoryList={categoryList}
                    status={event?.status}
                    RemoveDecorFromEvent={RemoveDecorFromEvent}
                    setNotes={setNotes}
                    event_id={event_id}
                    eventDay={eventDay}
                    allowEdit={true}
                    platformPrice={platformPrice}
                    flooringPrice={flooringPrice}
                  />
                  <DecorPackagesList
                    packages={tempEventDay?.packages}
                    status={tempEventDay?.status}
                    RemovePackageFromEvent={RemovePackageFromEvent}
                    setNotes={setNotes}
                    event_id={event_id}
                    eventDay={eventDay}
                    allowEdit={true}
                  />
                  <CustomItemsTable
                    setSetupLocationImage={setSetupLocationImage}
                    setupLocationImage={setupLocationImage}
                    customItems={tempEventDay?.customItems || []}
                    customItemsTitle={tempEventDay?.customItemsTitle || ""}
                  />
                  <MandatoryItemsList
                    mandatoryItems={tempEventDay?.mandatoryItems.filter(
                      (i) => i.itemRequired
                    )}
                  />
                  {tempEventDay?.decorItems.length <= 0 &&
                  tempEventDay?.packages.length <= 0 &&
                  tempEventDay?.customItems.length <= 0 &&
                  tempEventDay?.mandatoryItems.length <= 0 ? (
                    <p className="text-center py-8">
                      No decor selected.{" "}
                      <Link href={"/decor"} className="underline">
                        Click here
                      </Link>{" "}
                      to browse
                    </p>
                  ) : (
                    <>
                      <EventSummaryTable tempEventDay={tempEventDay} />
                      <TotalSummaryTable event={event} />
                      {event?.status?.approved && (
                        <>
                          <div className="md:w-2/3 mx-auto flex flex-col gap-3 mb-6">
                            <div className="grid grid-cols-2 gap-4">
                              <div className="text-left">Item Bill</div>
                              <div className="text-rose-900 text-right">
                                {toPriceString(event.amount.preTotal)}
                              </div>
                            </div>
                            <div className="grid grid-cols-2 gap-4 border-b-black border-b pb-3">
                              <div className="text-left">
                                Coupon code discount
                              </div>
                              <div className="text-rose-900 text-right">
                                {toPriceString(event.amount.discount)}
                              </div>
                            </div>
                            <div className="grid grid-cols-2 gap-4 font-medium">
                              <div className="text-left">Amount Payable</div>
                              <div className="text-rose-900 text-right">
                                {toPriceString(event.amount.total)}
                              </div>
                            </div>
                          </div>
                        </>
                      )}
                      {event?.status.finalized ? (
                        event?.status.approved ? (
                          <div className="text-center py-8 flex flex-col gap-2">
                            <div className="p-6 bg-black text-white text-center w-screen -mx-6 md:w-auto md:mx-0 font-medium">
                              Your event has been verified and approved! You can
                              now proceed to payment
                            </div>
                            {event?.status.paymentDone ? (
                              <p className="text-lg font-medium">
                                Your payment is done!
                              </p>
                            ) : (
                              <Link href={`/event/${event._id}/payment`}>
                                <button className="font-semibold bg-rose-900 rounded-full p-2 px-16 text-white w-max mx-auto my-6">
                                  Proceed with Payment
                                </button>
                              </Link>
                            )}
                          </div>
                        ) : (
                          <div className="text-center py-8 flex flex-col gap-2">
                            <p className="text-lg font-medium">Thank you!</p>
                            <p>
                              Your design has been sent for approval. You can
                              proceed to payment once approved by your
                              designated planner!
                            </p>
                            <p className="text-sm">
                              {
                                "(You'll be notified on your email and phone number)"
                              }
                            </p>
                          </div>
                        )
                      ) : (
                        <button
                          onClick={() => {
                            finalizeEvent();
                          }}
                          className="font-semibold bg-rose-900 rounded-full p-2 px-16 text-white w-max mx-auto my-6"
                        >
                          Finalize
                        </button>
                      )}
                    </>
                  )}
                </React.Fragment>
              ))}
          </div>
        </div>
      </div>
    </>
  );
}
