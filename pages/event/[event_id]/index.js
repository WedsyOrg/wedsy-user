import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/router";
import React, { useCallback, useEffect, useState, useRef } from "react";
import { IoClose } from "react-icons/io5";
import { loadGoogleMaps } from "@/utils/loadGoogleMaps";
import { trimTitle } from "@/utils/seo";
import Head from "next/head";

// Clipboard Visual Component
const ClipboardVisual = React.memo(() => (
  <div className="relative flex justify-center items-center h-full">
    <Image
      src="/assets/event_tools/event/clipboard2.webp"
      alt="Clipboard"
      width={450}
      height={600}
      className="object-contain"
    />
  </div>
));

// Add Event Day Modal Component
const AddEventDayModal = React.memo(function AddEventDayModal({
  isOpen,
  onClose,
  data,
  setData,
  onSubmit,
  isSubmitting,
  venueInputRef,
}) {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-2xl p-6 w-full max-w-md mx-4 relative">
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-gray-500 hover:text-gray-700"
        >
          <IoClose size={24} />
        </button>
        
        <h2 className="text-xl font-semibold mb-6">Add Event Day</h2>
        
        <div className="flex flex-col gap-4">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm text-gray-600 mb-1">Event Day</label>
              <input
                type="text"
                className="w-full rounded-lg p-3 border border-gray-300 focus:outline-none focus:ring-2 focus:ring-pink-300"
                placeholder="Event Name"
                name="name"
                value={data.name}
                onChange={(e) => setData({...data, name: e.target.value})}
              />
            </div>
            <div>
              <label className="block text-sm text-gray-600 mb-1">Date</label>
              <input
                type="date"
                className="w-full rounded-lg p-3 border border-gray-300 focus:outline-none focus:ring-2 focus:ring-pink-300"
                name="date"
                value={data.date}
                onChange={(e) => setData({...data, date: e.target.value})}
              />
            </div>
          </div>
          
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm text-gray-600 mb-1">Time</label>
              <input
                type="time"
                className="w-full rounded-lg p-3 border border-gray-300 focus:outline-none focus:ring-2 focus:ring-pink-300"
                name="time"
                value={data.time}
                onChange={(e) => setData({...data, time: e.target.value})}
              />
            </div>
            <div>
              <label className="block text-sm text-gray-600 mb-1">Venue</label>
              <input
                type="text"
                className="w-full rounded-lg p-3 border border-gray-300 focus:outline-none focus:ring-2 focus:ring-pink-300"
                placeholder="Event Venue"
                name="venue"
                value={data.venue}
                onChange={(e) => setData({...data, venue: e.target.value})}
                ref={venueInputRef}
              />
            </div>
          </div>
          
          <button
            className="mt-4 bg-[#1a1a1a] text-white rounded-lg py-3 px-6 w-full font-medium disabled:bg-gray-400 disabled:cursor-not-allowed"
            disabled={!data.name || !data.date || !data.time || !data.venue || isSubmitting}
            onClick={onSubmit}
          >
            {isSubmitting ? "Adding..." : "Add Event Day"}
          </button>
        </div>
      </div>
    </div>
  );
});

export default function EventDetailsPage() {
  const router = useRouter();
  const { event_id } = router.query;
  
  const [event, setEvent] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [showAddDayModal, setShowAddDayModal] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [eventDayData, setEventDayData] = useState({
    name: "",
    time: "",
    date: "",
    venue: "",
  });
  
  const venueInputRef = useRef(null);

  // Format date helper
  const formatDisplayDate = useCallback((isoLike) => {
    if (!isoLike) return "";
    const d = new Date(isoLike);
    if (Number.isNaN(d.getTime())) return "";
    return d.toLocaleDateString("en-GB", {
      day: "numeric",
      month: "short",
      year: "numeric",
    });
  }, []);

  // Format time helper
  const formatDisplayTime = useCallback((time) => {
    if (!time) return "";
    try {
      const [hours, minutes] = time.split(":");
      const hour = parseInt(hours, 10);
      const ampm = hour >= 12 ? "pm" : "am";
      const hour12 = hour % 12 || 12;
      return `${hour12}:${minutes}${ampm}`;
    } catch {
      return time;
    }
  }, []);

  // Fetch the specific event
  const fetchEvent = useCallback(async () => {
    if (!event_id) return;
    
    setIsLoading(true);
    try {
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/event/${event_id}?populate=true`,
        {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
            authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        }
      );
      const result = await response.json();
      
      if (result && result._id) {
        setEvent(result);
      } else {
        console.error("Event not found");
        router.push("/event");
      }
    } catch (error) {
      console.error("Error fetching event:", error);
    } finally {
      setIsLoading(false);
    }
  }, [event_id, router]);

  // Add event day
  const handleAddEventDay = useCallback(async () => {
    if (!event_id) return;
    
    setIsSubmitting(true);
    try {
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/event/${event_id}/eventDay`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            authorization: `Bearer ${localStorage.getItem("token")}`,
          },
          body: JSON.stringify(eventDayData),
        }
      );
      const result = await response.json();
      
      if (result) {
        // Reset form and close modal
        setEventDayData({ name: "", time: "", date: "", venue: "" });
        setShowAddDayModal(false);
        // Refresh event data
        fetchEvent();
      }
    } catch (error) {
      console.error("Error adding event day:", error);
    } finally {
      setIsSubmitting(false);
    }
  }, [event_id, eventDayData, fetchEvent]);

  // Initialize Google Maps for venue autocomplete in modal
  useEffect(() => {
    if (showAddDayModal && venueInputRef.current) {
      const initAutocomplete = async () => {
        try {
          const google = await loadGoogleMaps();
          if (!google?.maps?.places) return;

          const bengaluruBounds = new google.maps.LatLngBounds(
            new google.maps.LatLng(12.8236, 77.3832),
            new google.maps.LatLng(13.1721, 77.8369)
          );

          const autocomplete = new google.maps.places.Autocomplete(
            venueInputRef.current,
            {
              types: ["geocode", "establishment"],
              componentRestrictions: { country: "in" },
              bounds: bengaluruBounds,
              strictBounds: true,
            }
          );

          autocomplete.addListener("place_changed", () => {
            const place = autocomplete.getPlace();
            if (place?.formatted_address) {
              setEventDayData((prev) => ({
                ...prev,
                venue: place.formatted_address,
              }));
            }
          });
        } catch (error) {
          console.error("Error initializing Google Maps:", error);
        }
      };

      initAutocomplete();
    }
  }, [showAddDayModal]);

  useEffect(() => {
    if (event_id) {
      fetchEvent();
    }
  }, [event_id, fetchEvent]);

  if (isLoading) {
    return (
      <div className="min-h-screen bg-[#F4F4F4] flex items-center justify-center">
        <div className="animate-pulse text-gray-500">Loading event...</div>
      </div>
    );
  }

  if (!event) {
    return (
      <div className="min-h-screen bg-[#F4F4F4] flex items-center justify-center">
        <div className="text-gray-500">Event not found</div>
      </div>
    );
  }

  return (
    <>
      <Head>
        <title>{trimTitle(`${event?.name || "Event"} | Wedsy`)}</title>
        <meta name="robots" content="noindex, nofollow" />
      </Head>

      {/* Add Event Day Modal */}
      <AddEventDayModal
        isOpen={showAddDayModal}
        onClose={() => {
          setShowAddDayModal(false);
          setEventDayData({ name: "", time: "", date: "", venue: "" });
        }}
        data={eventDayData}
        setData={setEventDayData}
        onSubmit={handleAddEventDay}
        isSubmitting={isSubmitting}
        venueInputRef={venueInputRef}
      />

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
            <div
              className="text-[20px] leading-relaxed"
              style={{
                color: "#5F3D30",
                fontFamily: "Montserrat",
                fontWeight: "500",
              }}
            >
              Congratulations! Your event has been successfully created! You can{" "}
              <br /> now begin adding your requirements from the Wedding Store.
            </div>
            <Link
              href="/decor"
              className="text-black underline mt-2 inline-block"
              style={{ fontFamily: "Montserrat" }}
            >
              Visit Store
            </Link>
          </div>
        </div>

        {/* Main Content Grid */}
        <div className="px-24 pb-16">
          <div className="grid grid-cols-5 gap-8 items-start">
            {/* Event Details Section - Takes 3 columns */}
            <div className="col-span-3 mt-10">
              <div className="bg-[#F4DBD5] rounded-2xl p-8 h-fit">
                <div className="flex flex-col gap-6">
                  {/* Event Name */}
                  <div
                    className="text-center text-[20px] md:text-2xl font-medium text-black tracking-wider"
                    style={{ fontFamily: "Montserrat" }}
                  >
                    {event?.name?.toUpperCase()}
                  </div>

                  {/* Event Days List */}
                  <div className="flex flex-col gap-3 mb-4">
                    {event?.eventDays && event.eventDays.length > 0 ? (
                      event.eventDays.map((day, index) => (
                        <div
                          key={day._id || index}
                          className="flex justify-between items-center py-2"
                        >
                          <div className="flex items-center gap-2">
                            <span
                              className="text-lg font-medium text-black"
                              style={{ fontFamily: "Montserrat" }}
                            >
                              {index + 1}. {day.name}
                            </span>
                          </div>
                          <div className="flex items-center gap-6">
                            <span
                              className="text-gray-600"
                              style={{ fontFamily: "Montserrat" }}
                            >
                              {formatDisplayDate(day.date)}
                            </span>
                            <span
                              className="text-gray-600"
                              style={{ fontFamily: "Montserrat" }}
                            >
                              {formatDisplayTime(day.time)}
                            </span>
                          </div>
                        </div>
                      ))
                    ) : (
                      <div className="text-center py-6 text-gray-500">
                        No event days added yet. Click below to add your first event day.
                      </div>
                    )}
                  </div>

                  {/* Action Buttons */}
                  <div className="flex flex-row gap-4 justify-center">
                    <button
                      onClick={() => setShowAddDayModal(true)}
                      className="bg-black text-white rounded-2xl py-3 px-8 font-medium transition-colors duration-200 hover:bg-gray-800"
                      style={{ fontFamily: "Montserrat" }}
                    >
                      + Add more days
                    </button>
                    <Link
                      href={`/event/${event_id}/planner`}
                      className="bg-[#840032] text-white rounded-2xl py-3 px-8 font-medium transition-colors duration-200 hover:bg-[#6a0029] text-center"
                      style={{ fontFamily: "Montserrat" }}
                    >
                      VIEW EVENT
                    </Link>
                  </div>
                </div>
              </div>
            </div>

            {/* Clipboard Image Section - Takes 2 columns */}
            <div className="col-span-2 flex justify-center items-center">
              <div className="h-[450px] flex items-center justify-center">
                <ClipboardVisual />
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Mobile View */}
      <div className="md:hidden bg-[#F4F4F4] min-h-screen">
        {/* Header */}
        <div className="bg-[#F4F4F4]">
          <div className="px-6 py-4">
            <div
              className="text-black text-[24px] font-medium tracking-[0.1em]"
              style={{ fontFamily: "Montserrat" }}
            >
              MY EVENT
            </div>
          </div>
          <div className="w-full h-[2px] bg-white"></div>

          {/* Description Paragraph */}
          <div className="px-6 py-4">
            <div
              className="text-[16px] leading-relaxed"
              style={{
                color: "#5F3D30",
                fontFamily: "Montserrat",
                fontWeight: "500",
              }}
            >
              Congratulations! Your event has been successfully created! You can
              now begin adding your requirements from the Wedding Store.
            </div>
            <Link
              href="/decor"
              className="text-black underline mt-2 inline-block text-sm"
              style={{ fontFamily: "Montserrat" }}
            >
              Visit Store
            </Link>
          </div>
        </div>

        {/* Main Content */}
        <div className="px-6 py-4">
          <div className="bg-[#F4DBD5] rounded-3xl p-6 mb-6">
            <div className="flex flex-col gap-6">
              {/* Event Name */}
              <div
                className="text-center text-[18px] font-medium text-black tracking-wider"
                style={{ fontFamily: "Montserrat" }}
              >
                {event?.name?.toUpperCase()}
              </div>

              {/* Event Days List */}
              <div className="flex flex-col gap-2 mb-4">
                {event?.eventDays && event.eventDays.length > 0 ? (
                  event.eventDays.map((day, index) => (
                    <div
                      key={day._id || index}
                      className="flex justify-between items-center py-2"
                    >
                      <div className="flex items-center gap-2">
                        <span
                          className="text-base font-medium text-black"
                          style={{ fontFamily: "Montserrat" }}
                        >
                          {index + 1}. {day.name}
                        </span>
                      </div>
                      <div className="flex items-center gap-3 text-sm">
                        <span
                          className="text-gray-600"
                          style={{ fontFamily: "Montserrat" }}
                        >
                          {formatDisplayDate(day.date)}
                        </span>
                        <span
                          className="text-gray-600"
                          style={{ fontFamily: "Montserrat" }}
                        >
                          {formatDisplayTime(day.time)}
                        </span>
                      </div>
                    </div>
                  ))
                ) : (
                  <div className="text-center py-4 text-gray-500 text-sm">
                    No event days added yet. Click below to add your first event day.
                  </div>
                )}
              </div>

              {/* Action Buttons */}
              <div className="flex flex-col gap-3">
                <button
                  onClick={() => setShowAddDayModal(true)}
                  className="bg-black text-white rounded-2xl py-3 px-6 font-medium transition-colors duration-200 hover:bg-gray-800 text-center"
                  style={{ fontFamily: "Montserrat" }}
                >
                  + Add more days
                </button>
                <Link
                  href={`/event/${event_id}/planner`}
                  className="bg-[#840032] text-white rounded-2xl py-3 px-6 font-medium transition-colors duration-200 hover:bg-[#6a0029] text-center"
                  style={{ fontFamily: "Montserrat" }}
                >
                  VIEW EVENT
                </Link>
              </div>
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
