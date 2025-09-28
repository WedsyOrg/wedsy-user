import React from "react";
import Image from "next/image";
import { BsArrowLeft, BsArrowRight } from "react-icons/bs";
import { BiMap, BiSolidEditAlt, BiTrashAlt } from "react-icons/bi";
import { useEffect, useState, useCallback, useMemo } from "react";
import Link from "next/link";
import { useRouter } from "next/router";

// Clipboard Visual Component
const ClipboardVisual = React.memo(() => (
  <div className="relative flex justify-center items-center h-full">
    <Image
      src="/assets/event_tools/event/clipboard2.png"
      alt="Clipboard"
      width={450}
      height={600}
      className="object-contain"
    />
  </div>
));

export default function EventTool() {
  const router = useRouter();
  const [event, setEvent] = useState({});
  const [events, setEvents] = useState([]);
  const [displayForm, setDisplayForm] = useState(false);
  const [data, setData] = useState({
    name: "",
    time: "",
    date: "",
    venue: "",
    _id: "",
  });
  const { event_id } = router.query;

  const fetchEvents = useCallback(async () => {
    try {
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/event`, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      });
      const result = await response.json();
      setEvents(result);
    } catch (error) {
      console.error("Error fetching events:", error);
    }
  }, []);

  const fetchEvent = () => {
    if (!event_id) return; // Don't fetch if no event_id
    
    // Only fetch if we're on the current event details page, not planner
    if (router.pathname !== `/event/[event_id]`) return;
    
    fetch(`${process.env.NEXT_PUBLIC_API_URL}/event/${event_id}`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        authorization: `Bearer ${localStorage.getItem("token")}`,
      },
    })
      .then((response) => response.json())
      .then((response) => {
        if (response.message !== "error") {
          setEvent(response);
        } else {
          console.warn("Event not found, but staying on current page");
          // Don't redirect - just log the warning
        }
      })
      .catch((error) => {
        console.error("There was a problem with the fetch operation:", error);
        // Don't redirect on error - just log it
      });
  };
  
  const deleteEventDay = (dayId) => {
    fetch(
      `${process.env.NEXT_PUBLIC_API_URL}/event/${event_id}/eventDay/${dayId}`,
      {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
          authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      }
    )
      .then((response) => response.json())
      .then((response) => {
        if (response.message !== "error") {
          fetchEvent();
        }
      })
      .catch((error) => {
        console.error("There was a problem with the fetch operation:", error);
        // Don't redirect on error - just log it
      });
  };
  
  const handleEventDay = () => {
    if (data._id) {
      fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/event/${event_id}/eventDay/${data._id}`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
            authorization: `Bearer ${localStorage.getItem("token")}`,
          },
          body: JSON.stringify(data),
        }
      )
        .then((response) => response.json())
        .then((response) => {
          const { _id } = data;
          fetchEvent();
          setData({ name: "", time: "", date: "", venue: "", _id: "" });
          console.log(response);
          router.push(`/event/${event_id}/planner?eventDay=${_id}`);
        })
        .catch((error) => {
          console.error("There was a problem with the fetch operation:", error);
        });
    } else {
      fetch(`${process.env.NEXT_PUBLIC_API_URL}/event/${event_id}/eventDay`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          authorization: `Bearer ${localStorage.getItem("token")}`,
        },
        body: JSON.stringify(data),
      })
        .then((response) => response.json())
        .then((response) => {
          fetchEvent();
          setData({ name: "", time: "", date: "", venue: "", _id: "" });
        })
        .catch((error) => {
          console.error("There was a problem with the fetch operation:", error);
        });
    }
  };
  
  useEffect(() => {
    if (event_id) {
      fetchEvent();
    }
    fetchEvents();
  }, [event_id, fetchEvents]);
  
  return (
    <>
      {/* Invisible Scrollbar Styles */}
      <style jsx>{`
        .scrollbar-hide {
          -ms-overflow-style: none;  /* Internet Explorer 10+ */
          scrollbar-width: none;  /* Firefox */
        }
        .scrollbar-hide::-webkit-scrollbar { 
          display: none;  /* Safari and Chrome */
        }
      `}</style>
      
      {/* Desktop View */}
      <div className="hidden md:block bg-[#F4F4F4] min-h-screen">
        {/* Header */}
        <div className="bg-[#F4F4F4]">
          <div className="px-24 py-8">
            <div
              className="text-black text-[30px] font-medium tracking-[0.1em]"
              style={{ fontFamily: "Montserrat" }}
            >
              MY EVENT
            </div>
          </div>
          <div className="w-full h-[3px] bg-white"></div>
          
          {/* Description Paragraph */}
          <div className="px-24 py-8">
            <div className="text-[20px] leading-relaxed" style={{ color: "#5F3D30", fontFamily: "Montserrat" ,fontWeight: "500"}}>
              Congratulations! Your event has been successfully created! You can <br/> now begin adding your requirements from the Wedding Store.
            </div>
          </div>
        </div>

        {/* Main Content Grid */}
        <div className="px-24 pb-16">
          <div className="grid grid-cols-5 gap-8 items-start">
            {/* Events List Section - Takes 3 columns (moved to left) */}
            <div className="col-span-3 mt-10">
              <div className="bg-[#F4DBD5] rounded-2xl p-8 h-fit">
                <div className="flex flex-col gap-6">
                  {/* Title - matching StepForm1 dimensions */}
                  <div className="text-center text-[20px] md:text-2xl font-medium text-black">
                    YOUR EVENTS
                  </div>
                  
                  {/* Events List with Invisible Scroll */}
                  <div className="mb-8">
                    <div className="max-h-[235px] overflow-y-auto scrollbar-hide">
                      {events.length > 0 ? (
                        <div className="flex flex-col gap-2">
                          {events.map((eventItem, index) => (
                            <Link
                              href={`/event/${eventItem._id}/planner`}
                              key={eventItem._id}
                              className="flex flex-row justify-between items-center py-2 hover:text-pink-600 transition-colors"
                            >
                              <div className="flex items-center gap-4">
                                <span className="text-lg font-medium text-black" style={{ fontFamily: "Montserrat" }}>
                                  {index + 1}.
                                </span>
                                <span className="text-lg font-medium text-black" style={{ fontFamily: "Montserrat" }}>
                                  {eventItem.name}
                                </span>
                              </div>
                              <div className="flex items-center gap-4 text-sm text-gray-600">
                                <span style={{ fontFamily: "Montserrat" }}>
                                  {new Date(eventItem.createdAt).toLocaleDateString('en-GB', { 
                                    day: 'numeric',
                                    month: 'short', 
                                    year: 'numeric' 
                                  })}
                                </span>
                                <BsArrowRight size={16} className="text-gray-400" />
                              </div>
                            </Link>
                          ))}
                        </div>
                      ) : (
                        <div className="text-center py-12">
                          <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
                            <span className="text-2xl">🎉</span>
                          </div>
                          <p className="text-gray-500 text-lg mb-2" style={{ fontFamily: "Montserrat" }}>No events yet</p>
                          <p className="text-gray-400 text-sm">Create your first event to get started!</p>
                        </div>
                      )}
                    </div>
                  </div>

                  {/* Create New Event Button - matching StepForm1 button styling */}
                  <Link
                    href="/event"
                    className="bg-[#000000] rounded-2xl p-4 px-12 text-white w-max mx-auto transition-colors duration-200 text-lg font-medium hover:cursor-pointer"
                  >
                    CREATE NEW EVENT
                  </Link>
                </div>
              </div>
            </div>

            {/* Clipboard Image Section - Takes 2 columns (moved to right) */}
            <div className="col-span-2 flex justify-center items-center">
              <div className="h-[450px] flex items-center justify-center -mt:30">
                <ClipboardVisual />
              </div>
            </div>
          </div>
          {displayForm && (
            <div className="relative bg-red-200 bg-opacity-40 rounded-3xl flex flex-col gap-6 p-8 py-12">
              <div className="text-center text-3xl">
                TELL US ABOUT YOUR EVENT
              </div>
              <input
                type="text"
                className="rounded-full p-2 text-center border-0"
                placeholder="EVENT DAY (eg: Reception)"
                name="name"
                value={data.name}
                onChange={(e) => setData({ ...data, name: e.target.value })}
              />
              <div className="grid grid-cols-2 gap-8 w-full">
                <input
                  type="date"
                  className="rounded-full p-2 text-center border-0"
                  placeholder="DATE"
                  name="date"
                  value={data.date}
                  onChange={(e) => setData({ ...data, date: e.target.value })}
                />
                <input
                  type="time"
                  className="rounded-full p-2 text-center border-0"
                  placeholder="START TIME"
                  name="time"
                  value={data.time}
                  onChange={(e) => setData({ ...data, time: e.target.value })}
                />
              </div>
              <input
                type="text"
                className="rounded-full p-2 text-center border-0"
                placeholder="VENUE"
                name="venue"
                value={data.venue}
                onChange={(e) => setData({ ...data, venue: e.target.value })}
              />
              <button
                className="bg-black disabled:bg-neutral-700 rounded-full p-2 px-12 text-white w-max mx-auto"
                disabled={!data.name || !data.time || !data.date || !data.venue}
                onClick={handleEventDay}
              >
                {data._id ? "UPDATE" : "SUBMIT"}
              </button>
            </div>
          )}
        </div>
      </div>

      {/* Mobile View */}
      <div className="md:hidden bg-[#F4F4F4] min-h-screen">
        {/* Header */}
        <div className="bg-[#F4F4F4]">
          <div className="px-6 py-4">
            <Link href={"/event"} className="flex items-center gap-2 mb-4">
              {/* <BsArrowLeft size={20} /> */}
              {/* <span className="text-lg font-medium">Back to Events</span> */}
            </Link>
            <div
              className="text-black text-[24px] font-medium tracking-[0.1em]"
              style={{ fontFamily: "Montserrat" }}
            >
              MY EVENT
            </div>
          </div>
          <div className="w-full h-[2px] bg-white mx-6"></div>
          
          {/* Description Paragraph */}
          <div className="px-6 py-4">
            <div className="text-[16px] leading-relaxed" style={{ color: "#5F3D30", fontFamily: "Montserrat", fontWeight: "500"}}>
              Congratulations! Your event has been successfully created! You can now begin adding your requirements from the Wedding Store.
            </div>
          </div>
        </div>

        {/* Main Content */}
        <div className="px-6 py-4">
          <div className="bg-[#F4DBD5] rounded-3xl p-6 mb-6">
            <div className="flex flex-col gap-6">
              {/* Title - matching StepForm1 dimensions */}
              <div className="text-center text-[20px] md:text-2xl font-medium text-black">
                YOUR EVENTS
              </div>
              
              {/* Events List with Invisible Scroll */}
              <div className="mb-6">
                <div className="text-base font-semibold mb-3 text-gray-700" style={{ fontFamily: "Montserrat" }}>
                  Your Events
                </div>
                <div className="max-h-[200px] overflow-y-auto scrollbar-hide">
                  {events.length > 0 ? (
                    <div className="flex flex-col gap-2">
                      {events.map((eventItem, index) => (
                        <Link
                          href={`/event/${eventItem._id}/planner`}
                          key={eventItem._id}
                          className="flex flex-row justify-between items-center py-2 hover:text-pink-600 transition-colors"
                        >
                          <div className="flex items-center gap-3">
                            <span className="text-base font-medium text-black" style={{ fontFamily: "Montserrat" }}>
                              {index + 1}.
                            </span>
                            <span className="text-base font-medium text-black" style={{ fontFamily: "Montserrat" }}>
                              {eventItem.name}
                            </span>
                          </div>
                          <div className="flex items-center gap-3 text-xs text-gray-600">
                            <span style={{ fontFamily: "Montserrat" }}>
                              {new Date(eventItem.createdAt).toLocaleDateString('en-GB', { 
                                day: 'numeric',
                                month: 'short', 
                                year: 'numeric' 
                              })}
                            </span>
                            <BsArrowRight size={14} className="text-gray-400" />
                          </div>
                        </Link>
                      ))}
                    </div>
                  ) : (
                    <div className="text-center py-8">
                      <div className="w-12 h-12 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-3">
                        <span className="text-xl">🎉</span>
                      </div>
                      <p className="text-gray-500 text-base mb-1" style={{ fontFamily: "Montserrat" }}>No events yet</p>
                      <p className="text-gray-400 text-sm">Create your first event to get started!</p>
                    </div>
                  )}
                </div>
              </div>

              {/* Create New Event Button - matching StepForm1 button styling */}
              <Link
                href="/event"
                className="bg-[#840032] rounded-2xl p-4 px-12 text-white w-max mx-auto transition-colors duration-200 text-lg font-medium hover:cursor-pointer"
              >
                CREATE NEW EVENT
              </Link>
            </div>
          </div>

          {/* Clipboard */}
          <div className="flex justify-center rounded-3xl mb-6">
            <ClipboardVisual />
          </div>
        </div>
      </div>
    </>
  );
}