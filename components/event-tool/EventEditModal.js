import {useEffect, useRef, useState} from "react";
import {Modal} from "flowbite-react";
import {BsArrowLeft} from "react-icons/bs";
import {useRouter} from "next/router";
import {loadGoogleMaps} from "@/utils/loadGoogleMaps";

export default function EventEditModal({
  show,
  onClose,
  event,
  onSaved,
  eventDayId,
}) {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [eventData, setEventData] = useState({name: "", community: ""});
  const [dayData, setDayData] = useState({
    eventDay: "",
    venue: "",
    date: "",
    time: "",
  });
  const venueInputRef = useRef(null);
  // Prefer the explicitly selected day, else default to first available day
  const targetEventDayId = eventDayId || event?.eventDays?.[0]?._id;

  useEffect(() => {
    if (event) {
      setEventData({
        name: event.name || "",
        community: event.community || "",
      });
      // Prefill from selected event day (or first)
      const currentDay =
        (eventDayId && event?.eventDays?.find((d) => d._id === eventDayId)) ||
        event?.eventDays?.[0];
      if (currentDay) {
        setDayData({
          eventDay: currentDay.name || "",
          venue: currentDay.venue || "",
          date: currentDay.date || "",
          time: currentDay.time || "",
        });
      }
    }
  }, [event, eventDayId]);

  // Initialize Google Places Autocomplete for venue (Bengaluru only)
  useEffect(() => {
    if (!show) return;
    let autocomplete;
    const init = async () => {
      try {
        const google = await loadGoogleMaps();
        if (!google?.maps?.places || !venueInputRef.current) return;
        const bengaluruBounds = new google.maps.LatLngBounds(
          new google.maps.LatLng(12.8236, 77.3832),
          new google.maps.LatLng(13.1721, 77.8369)
        );
        autocomplete = new google.maps.places.Autocomplete(
          venueInputRef.current,
          {
            types: ["geocode", "establishment"],
            componentRestrictions: {country: "in"},
            bounds: bengaluruBounds,
            strictBounds: true,
          }
        );
        autocomplete.addListener("place_changed", () => {
          const place = autocomplete.getPlace();
          const formatted =
            place?.formatted_address || venueInputRef.current?.value || "";
          const lower = formatted.toLowerCase();
          if (!lower.includes("bengaluru") && !lower.includes("bangalore")) {
            alert("Please select a location within Bengaluru only.");
            if (venueInputRef.current) venueInputRef.current.value = "";
            setDayData((prev) => ({...prev, venue: ""}));
            return;
          }
          setDayData((prev) => ({...prev, venue: formatted}));
        });
      } catch (e) {
        console.error("Failed to initialize Google Places", e);
      }
    };
    init();
    return () => {
      // Autocomplete doesn't have an explicit destroy; rely on GC
    };
  }, [show]);

  const handleSave = async () => {
    if (targetEventDayId) {
      // Require all event-day fields when we know which day is being edited
      if (
        !dayData.eventDay?.trim() ||
        !dayData.venue?.trim() ||
        !dayData.date ||
        !dayData.time
      ) {
        alert("Please fill event day, venue, date and time.");
        return;
      }
    }
    
    try {
      setLoading(true);

      // Update the selected (or default) event day
      if (targetEventDayId) {
        const dayRes = await fetch(
          `${process.env.NEXT_PUBLIC_API_URL}/event/${event._id}/eventDay/${targetEventDayId}`,
          {
            method: "PUT",
            headers: {
              "Content-Type": "application/json",
              authorization: `Bearer ${localStorage.getItem("token")}`,
            },
            body: JSON.stringify({
              name: dayData.eventDay,
              venue: dayData.venue,
              date: dayData.date,
              time: dayData.time,
              _id: targetEventDayId,
            }),
          }
        );
        const dayResult = await dayRes.json();
        if (dayResult?.message !== "success")
          throw new Error("Failed to update event day");

        // Also update the main event name to keep listings in sync
        const eventRes = await fetch(
          `${process.env.NEXT_PUBLIC_API_URL}/event/${event._id}`,
          {
            method: "PUT",
            headers: {
              "Content-Type": "application/json",
              authorization: `Bearer ${localStorage.getItem("token")}`,
            },
            body: JSON.stringify({
              name: dayData.eventDay,
              community:
                eventData.community?.trim() || event.community || "Community",
            }),
          }
        );
        const eventResult = await eventRes.json();
        if (eventResult?.message !== "success")
          console.warn(
            "Failed to update main event name, but event day was updated"
          );
      } else {
        // No event day available to update
        alert("No event day found to update.");
        return;
      }

      onSaved?.();
      onClose?.();
    } catch (err) {
      console.error("Failed to update event", err);
      alert("Failed to update event. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <Modal
      show={show}
      size="2xl"
      popup
      onClose={() => {
        onClose?.();
      }}
      theme={{
        content: {
          base: "relative w-full p-0 md:h-auto bg-transparent shadow-none",
          inner: "bg-transparent rounded-none shadow-none p-0",
        },
        body: {
          base: "p-0",
        },
      }}
    >
      <Modal.Body>
        {/* Match the create-event modal card: exact background and shape */}
        <div className="relative bg-[#F4DBD5] rounded-2xl flex flex-col gap-4 p-8 max-w-5xl mx-auto w-full">
          {/* Inline header inside colored card */}
          <div className="flex items-center gap-2 text-sm text-gray-700">
            <button
              type="button"
              onClick={() => router.back()}
              className="flex items-center gap-1 hover:text-black"
            >
              <BsArrowLeft /> Back
            </button>
          </div>
          {/* Event day details (like Event addition page) */}
          <div className="grid grid-cols-2 gap-4">
            <div>
              <div
                className="text-center text-[10px] md:text-sm italic mb-2"
                style={{color: "#2B3F6C"}}
              >
                (Muhurattam, Haldi, Reception etc)
              </div>
              <input
                type="text"
                placeholder="Event day"
                className="w-full rounded-full p-3 text-center border-0 bg-white focus:outline-none focus:ring-2 focus:ring-pink-300"
                value={dayData.eventDay}
                onChange={(e) =>
                  setDayData((p) => ({...p, eventDay: e.target.value}))
                }
              />
            </div>
            <div className="relative">
              {/* spacer to align with the Event day helper above */}
              <div
                className="text-center text-[10px] md:text-sm italic mb-2 invisible"
                style={{color: "#2B3F6C"}}
              >
                (Muhurattam, Haldi, Reception etc)
              </div>
              <input
                type="text"
                placeholder="Venue Location (Bengaluru only)"
                className="w-full rounded-full p-3 text-center border-0 bg-white focus:outline-none focus:ring-2 focus:ring-pink-300"
                ref={venueInputRef}
                value={dayData.venue}
                onChange={(e) =>
                  setDayData((p) => ({...p, venue: e.target.value}))
                }
              />
              <p className="text-xs text-gray-500 mt-1 text-center">
                Please select a venue in Bengaluru from the dropdown
              </p>
            </div>
            <div className="relative">
              <input
                type="date"
                placeholder="DATE"
                className="w-full rounded-full p-3 text-center border-0 bg-white focus:outline-none focus:ring-2 focus:ring-pink-300"
                value={dayData.date}
                onChange={(e) =>
                  setDayData((p) => ({...p, date: e.target.value}))
                }
              />
              <div className="absolute inset-y-0 right-3 flex items-center pointer-events-none">
                <svg
                  className="h-5 w-5 text-gray-500"
                  fill="currentColor"
                  viewBox="0 0 20 20"
                >
                  <path
                    fillRule="evenodd"
                    d="M6 2a1 1 0 00-1 1v1H4a2 2 0 00-2 2v10a2 2 0 002 2h12a2 2 0 002-2V6a2 2 0 00-2-2h-1V3a1 1 0 10-2 0v1H7V3a1 1 0 00-1-1zm0 5a1 1 0 000 2h8a1 1 0 100-2H6z"
                    clipRule="evenodd"
                  />
                </svg>
              </div>
            </div>
            <div className="relative">
              <input
                type="time"
                placeholder="START TIME"
                className="w-full rounded-full p-3 text-center border-0 bg-white focus:outline-none focus:ring-2 focus:ring-pink-300"
                value={dayData.time}
                onChange={(e) =>
                  setDayData((p) => ({...p, time: e.target.value}))
                }
              />
              <div className="absolute inset-y-0 right-3 flex items-center pointer-events-none">
                <svg
                  className="h-5 w-5 text-gray-500"
                  fill="currentColor"
                  viewBox="0 0 20 20"
                >
                  <path
                    fillRule="evenodd"
                    d="M10 18a8 8 0 100-16 8 8 0 000 16zm1-12a1 1 0 10-2 0v4a1 1 0 00.293.707l2.828 2.829a1 1 0 101.415-1.415L11 9.586V6z"
                    clipRule="evenodd"
                  />
                </svg>
              </div>
            </div>
          </div>
          <div className="flex flex-row gap-4 justify-center mt-2">
            <button
              type="button"
              onClick={() => onClose?.()}
              className="bg-gray-300 text-black rounded-full p-3 px-8 w-max transition-colors duration-200"
            >
              BACK
            </button>
            <button
              className={`bg-black rounded-full p-3 px-12 text-white w-max transition-colors duration-200 disabled:bg-gray-400`}
              disabled={
                loading ||
                !targetEventDayId ||
                !dayData.eventDay ||
                !dayData.venue ||
                !dayData.date ||
                !dayData.time
              }
              onClick={handleSave}
            >
              {loading ? "Saving..." : "SAVE CHANGES"}
            </button>
          </div>
        </div>
      </Modal.Body>
    </Modal>
  );
}
