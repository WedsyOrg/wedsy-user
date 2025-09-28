import CustomItemsTable from "@/components/event-tool/CustomItemsTable";
import DecorItemsList from "@/components/event-tool/DecorItemsList";
import DecorPackagesList from "@/components/event-tool/DecorPackagesList";
import EventDayInfo from "@/components/event-tool/EventDayInfo";
import EventSummaryTable from "@/components/event-tool/EventSummaryTable";
import EventToolHeader from "@/components/event-tool/EventToolHeader";
import EventToolSidebar from "@/components/event-tool/EventToolSidebar";
import MandatoryItemsList from "@/components/event-tool/MandatoryItemsList";
import NotesModal from "@/components/event-tool/NotesModal";
import SetupLocationImageModal from "@/components/event-tool/SetupLocationImageModal";
import TotalSummaryTable from "@/components/event-tool/TotalSummaryTable";
import { toPriceString } from "@/utils/text";
import Link from "next/link";
import { useRouter } from "next/router";
import { useEffect, useRef, useState } from "react";

export default function EventTool({ user }) {
  const divRef = useRef(null);
  const plannerRef = useRef(null);
  const [divSize, setDivSize] = useState({ width: 0, height: 0 });
  const [displayKey, setDisplayKey] = useState("");
  const router = useRouter();
  const [event, setEvent] = useState({});
  const [eventDay, setEventDay] = useState();
  const { event_id } = router.query;
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
  const [platformPrice, setPlatformPrice] = useState({ price: 0, image: "" });
  const [flooringPrice, setFlooringPrice] = useState([]);
  const [categoryList, setCategoryList] = useState([]);
  const fetchCategoryList = () => {
    fetch(`${process.env.NEXT_PUBLIC_API_URL}/category`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        authorization: `Bearer ${localStorage.getItem("token")}`,
      },
    })
      .then((response) => response.json())
      .then((response) => {
        setCategoryList(response);
      })
      .catch((error) => {
        console.error("There was a problem with the fetch operation:", error);
      });
  };
  const fetchPlatformInfo = () => {
    fetch(`${process.env.NEXT_PUBLIC_API_URL}/config?code=platform`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
      },
    })
      .then((response) => response.json())
      .then((response) => {
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
    fetch(`${process.env.NEXT_PUBLIC_API_URL}/config?code=flooring`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
      },
    })
      .then((response) => response.json())
      .then((response) => {
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
      `${process.env.NEXT_PUBLIC_API_URL}/event/${event_id}?populate=true&display=true`,
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
          if (response.userAccess) {
            router.push(`/event/${event_id}/planner`);
            return;
          } else if (response.eventDays?.length > 0) {
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
  useEffect(() => {
    if (event_id) {
      fetchEvent();
      fetchCategoryList();
      fetchFlooringInfo();
      fetchPlatformInfo();
    }
  }, [router, event_id]);
  useEffect(() => {
    const handleResize = () => {
      if (divRef.current) {
        const { width, height } = divRef.current.getBoundingClientRect();
        const { top } = divRef.current.getBoundingClientRect();
        const totalHeight = window.innerHeight;
        setDivSize({ width, height: totalHeight - top });
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
  return (
    <>
      <NotesModal notes={notes} setNotes={setNotes} allowEdit={false} />
      <SetupLocationImageModal
        setSetupLocationImage={setSetupLocationImage}
        setupLocationImage={setupLocationImage}
      />
      <div className="flex flex-col overflow-hidden hide-scrollbar bg-gray-100">
        <EventToolHeader
          fetchEvent={fetchEvent}
          event={event}
          setEventDay={setEventDay}
          eventDay={eventDay}
          allowEdit={false}
          event_id={event_id}
        />
        <div
          className="grid md:grid-cols-5 gap-6 py-4 overflow-hidden hide-scrollbar grow"
          ref={divRef}
          style={{ height: divSize.height ?? "100vh" }}
        >
          <EventToolSidebar
            tempEventDay={event.eventDays?.filter((i) => i._id === eventDay)[0]}
            categoryList={categoryList}
            displayKey={displayKey}
            handlePlannerClick={handlePlannerClick}
          />
          <div
            className="overflow-y-auto hide-scrollbar col-span-4 flex flex-col md:px-6 md:px-0"
            ref={plannerRef}
            onScroll={handlePlannerScroll}
          >
            {event.eventDays
              ?.filter((i) => i._id === eventDay)
              ?.map((tempEventDay, tempIndex) => (
                <>
                  <EventDayInfo
                    tempEventDay={tempEventDay}
                    status={event?.status}
                    eventPlanner={event?.eventPlanner}
                  />
                  <DecorItemsList
                    setSetupLocationImage={setSetupLocationImage}
                    setupLocationImage={setupLocationImage}
                    decorItems={tempEventDay?.decorItems}
                    categoryList={categoryList}
                    status={event?.status}
                    setNotes={setNotes}
                    event_id={event_id}
                    eventDay={eventDay}
                    allowEdit={false}
                    platformPrice={platformPrice}
                    flooringPrice={flooringPrice}
                  />
                  <DecorPackagesList
                    packages={tempEventDay?.packages}
                    status={tempEventDay?.status}
                    setNotes={setNotes}
                    event_id={event_id}
                    eventDay={eventDay}
                    allowEdit={false}
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
                    </>
                  )}
                </>
              ))}
          </div>
        </div>
      </div>
    </>
  );
}
