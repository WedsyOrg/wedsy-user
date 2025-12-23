import EventHowItWorks from "@/components/screens/EventHowItWorks";
import { EventPageSkeleton } from "@/components/skeletons/event";
import { formatDate, sortEventsByDate } from "@/utils/common";
import { loadGoogleMaps } from "@/utils/loadGoogleMaps";
import Head from "next/head";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/router";
import React, { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { BsArrowRight } from "react-icons/bs";

// Step 1
const EventFormStep1 = React.memo(function EventFormStep1({
  data,
  errors,
  onChange,
  onSubmit,
  onPrevStep,
}) {
  return (
    <div className="flex flex-col gap-6">
      <div className="text-center text-[20px] md:text-2xl  font-medium text-black">
        TELL US ABOUT YOUR EVENT
      </div>
      <div className="flex flex-col gap-6">
        <div>
          <div
            className="text-center text-[10px] md:text-sm italic mb-4"
            style={{color: "#2B3F6C"}}
          >
            Give your event a name! It could be 'Rahul&apos;s Wedding' or 'Rahul
            x Anjali'
          </div>
          <input
            type="text"
            className="w-full rounded-2xl p-4 text-center border-0 bg-white 
                     focus:outline-none focus:ring-2 focus:ring-pink-300 text-gray-600"
            placeholder="Name your event"
            name="name"
            value={data.name}
            onChange={onChange}
          />
          {errors.name && (
            <p className="text-red-500 text-sm mt-2 text-center">
              {errors.name}
            </p>
          )}
        </div>
        <div>
          <div
            className="text-center text-[10px] md:text-sm italic mb-4"
            style={{color: "#2B3F6C"}}
          >
            This is not mandatory but helps in understanding your rituals and
            event flow.
          </div>
          <input
            type="text"
            className="w-full rounded-2xl p-4 text-center border-0 bg-white 
                     focus:outline-none focus:ring-2 focus:ring-pink-300 text-gray-600"
            placeholder="Community"
            name="community"
            value={data.community}
            onChange={onChange}
          />
          {errors.community && (
            <p className="text-red-500 text-sm mt-2 text-center">
              {errors.community}
            </p>
          )}
        </div>
      </div>
      <div className="flex flex-row gap-4 justify-center">
        <button
          className="bg-gray-300 text-black rounded-full p-3 px-8 w-max transition-colors duration-200"
          onClick={onPrevStep}
        >
          BACK
        </button>
        <button
          className="bg-black rounded-full p-3 px-12 text-white w-max transition-colors duration-200"
          disabled={!data.name || !data.community}
          onClick={onSubmit}
        >
          NEXT
        </button>
      </div>
    </div>
  );
});

// Step 2
const EventFormStep2 = React.memo(function EventFormStep2({
  data,
  errors,
  onChange,
  onSubmit,
  onPrevStep,
  eventName,
  venueInputRef,
}) {
  return (
    <div className="flex flex-col gap-6">
      <div className="text-center text-[20px] md:text-2xl  font-medium text-black">
        {eventName.toUpperCase()}
      </div>
      <div className="flex flex-col gap-4">
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
              className="w-full rounded-full p-3 text-center border-0 bg-white 
                       focus:outline-none focus:ring-2 focus:ring-pink-300"
              placeholder="Event day"
              name="eventDay"
              value={data.eventDay}
              onChange={onChange}
            />
            {errors.eventDay && (
              <p className="text-red-500 text-sm mt-1 text-center">
                {errors.eventDay}
              </p>
            )}
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
              className="w-full rounded-full p-3 text-center border-0 bg-white 
                       focus:outline-none focus:ring-2 focus:ring-pink-300"
              placeholder="Venue Location (Bengaluru only)"
              name="venue"
              value={data.venue}
              onChange={onChange}
              ref={venueInputRef}
            />
            {errors.venue && (
              <p className="text-red-500 text-sm mt-1 text-center">
                {errors.venue}
              </p>
            )}
            <p className="text-xs text-gray-500 mt-1 text-center">
              Please select a venue in Bengaluru from the dropdown
            </p>
          </div>
        </div>
        <div className="grid grid-cols-2 gap-4">
          <div className="relative">
            <input
              type="date"
              className="w-full rounded-full p-3 text-center border-0 bg-white 
                       focus:outline-none focus:ring-2 focus:ring-pink-300"
              name="date"
              value={data.date}
              onChange={onChange}
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
            {errors.date && (
              <p className="text-red-500 text-sm mt-1 text-center">
                {errors.date}
              </p>
            )}
          </div>
          <div className="relative">
            <input
              type="time"
              className="w-full rounded-full p-3 text-center border-0 bg-white 
                       focus:outline-none focus:ring-2 focus:ring-pink-300"
              name="time"
              value={data.time}
              onChange={onChange}
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
            {errors.time && (
              <p className="text-red-500 text-sm mt-1 text-center">
                {errors.time}
              </p>
            )}
          </div>
        </div>
      </div>
      <div
        className="text-center text-[10px] md:text-sm italic mb-4"
        style={{color: "#2B3F6C"}}
      >
        *For multiple event days, You can add them in the next page!
      </div>
      <div className="flex flex-row gap-4 justify-center">
        <button
          className="bg-gray-300 text-black rounded-full p-3 px-8 w-max transition-colors duration-200"
          onClick={onPrevStep}
        >
          BACK
        </button>
        <button
          className="bg-black rounded-full p-3 px-12 text-white w-max transition-colors duration-200"
          disabled={!data.eventDay || !data.venue || !data.date || !data.time}
          onClick={onSubmit}
        >
          NEXT
        </button>
      </div>
    </div>
  );
});

// Step 3
const EventFormStep3 = React.memo(function EventFormStep3({
  data,
  eventName,
  onAddMoreDays,
  onViewEvent,
  onPrevStep,
}) {
  console.log("EventFormStep3 received eventName:", eventName);
  return (
    <div className="flex flex-col gap-6">
      <div className="text-center text-2xl font-medium">
        {eventName.toUpperCase()}
      </div>
      <div className="bg-white rounded-lg p-4 text-center">
        <p className="text-sm text-gray-600">
          {data.eventDay} • {data.venue} • {data.date} • {data.time}
        </p>
      </div>
      <div className="flex flex-row gap-4 justify-center">
        <button
          className="bg-[#000000] text-white rounded-2xl 
                   transition-colors duration-200 text-sm font-medium
                   w-[192px] h-[40px] flex items-center justify-center"
          onClick={onAddMoreDays}
        >
          ADD MORE DAYS
        </button>
        <button
          className="bg-[#840032] text-white rounded-2xl 
                   transition-colors duration-200 hover:bg-gray-800 text-sm font-medium
                   w-[192px] h-[40px] flex items-center justify-center"
          onClick={onViewEvent}
        >
          VIEW EVENT
        </button>
      </div>
    </div>
  );
});

// Clipboard (no overlay text)
const ClipboardVisual = React.memo(() => (
  <div className="relative flex justify-center items-center h-full">
    <Image
      src="/assets/event_tools/event/clipboard2.webp"
      alt="Clipboard"
      width={450}
      height={600}
      className="z-10 relative object-contain"
    />
  </div>
));

export default function EventTool({userLoggedIn, setOpenLoginModal}) {
  const router = useRouter();
  const [events, setEvents] = useState([]);
  const [formStep, setFormStep] = useState(1);
  const [previousFormStep, setPreviousFormStep] = useState(1);
  const [lastCompletedDay, setLastCompletedDay] = useState(null);
  const [isAddingAdditionalDay, setIsAddingAdditionalDay] = useState(false);
  const [showCreateForm, setShowCreateForm] = useState(false);
  const [data, setData] = useState({
    name: "",
    community: "",
    eventDay: "",
    time: "",
    date: "",
    venue: "",
    address: {},
  });
  const [validationErrors, setValidationErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [refreshKey, setRefreshKey] = useState(0);

  // Check for ?new=true query parameter to show creation form
  useEffect(() => {
    if (router.query.new === "true") {
      setShowCreateForm(true);
    }
  }, [router.query]);

  // Simple function to get the correct event date
  const getEventDisplayDate = (event) => {
    if (!event) return "Date not available";

    // Check eventDays first (actual form date)
    if (
      event.eventDays &&
      event.eventDays.length > 0 &&
      event.eventDays[0].date
    ) {
      return formatDate(event.eventDays[0].date);
    }

    // Fallback to eventDate
    if (event.eventDate) {
      return formatDate(event.eventDate);
    }

    // Last resort - createdAt
    if (event.createdAt) {
      return formatDate(event.createdAt);
    }

    return "Date not available";
  };
  const venueInputRefDesktop = useRef(null);
  const venueInputRefMobile = useRef(null);
  const [googleInstance, setGoogleInstance] = useState(null);
  const [isLoaded, setIsLoaded] = useState(false);

  const validateField = useCallback(
    (name, value) => {
      const errors = {...validationErrors};
      if (!value.trim()) {
        errors[name] = `${
          name.charAt(0).toUpperCase() + name.slice(1)
        } is required`;
      } else {
        delete errors[name];
      }
      setValidationErrors(errors);
    },
    [validationErrors]
  );

  // Helper function to extract address components from Google Maps result
  const extractAddressComponents = (components) => {
    if (!components || !Array.isArray(components)) {
      // Invalid address components; return empty structure
      return {
        city: "",
        postal_code: "",
        state: "",
        country: "",
        locality: "",
      };
    }

    const result = {
      city: "",
      postal_code: "",
      state: "",
      country: "",
      locality: "",
    };

    // First pass: get primary components
    components.forEach((component) => {
      if (component.types.includes("locality")) {
        result.city = component.long_name; // Locality usually represents the city
      }
      if (component.types.includes("postal_code")) {
        result.postal_code = component.long_name; // Extract postal code
      }
      if (component.types.includes("administrative_area_level_1")) {
        result.state = component.long_name; // Extract state
      }
      if (component.types.includes("country")) {
        result.country = component.long_name; // Extract country
      }
      if (
        component.types.includes("sublocality_level_1") ||
        component.types.includes("sublocality") ||
        component.types.includes("neighborhood")
      ) {
        result.locality = component.long_name; // More granular locality info
      }
    });

    // Second pass: fill in fallbacks if primary fields are empty
    if (!result.city) {
      // Try to find city from other components if locality was not found
      for (const component of components) {
        if (component.types.includes("administrative_area_level_2")) {
          result.city = component.long_name;
          break;
        } else if (component.types.includes("sublocality_level_1")) {
          result.city = component.long_name;
          break;
        }
      }
    }

    // If locality is empty but we have a city, use city as fallback
    if (!result.locality && result.city) {
      result.locality = result.city;
    }

    // Address components extracted

    return result;

    return result;
  };

  const handleDataChange = useCallback(
    (e) => {
      const {name, value} = e.target;
      setData((prev) => ({...prev, [name]: value}));
      validateField(name, value);
    },
    [validateField]
  );

  useEffect(() => {
    console.log("Component mounted or updated. Current events:", events);
  }, [events]);

  const fetchEvents = useCallback(async () => {
    console.log("fetchEvents function triggered");
    try {
      setIsLoading(true);
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/event?populate=true`,
        {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
            authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        }
      );
      const result = await response.json();

      console.log("API response received:", result);
      console.log(
        "Event days in response:",
        result.map((event) => event.eventDays)
      );

      const processEvents = (events) => {
        return events.map((event) => {
          const processedEvent = {...event};
          const isDateCreationDate =
            processedEvent.date &&
            processedEvent.createdAt &&
            new Date(processedEvent.date).toDateString() ===
              new Date(processedEvent.createdAt).toDateString();

          if (isDateCreationDate && processedEvent.eventDate) {
            processedEvent.date = processedEvent.eventDate;
            processedEvent._dateFixed = true;
          }

          return processedEvent;
        });
      };

      const processedEvents = processEvents(result);
      const sortedEvents = sortEventsByDate(processedEvents);
      const eventsWithTimestamp = sortedEvents.map((event) => ({
        ...event,
        _renderTimestamp: Date.now(),
      }));

      console.log("Processed and sorted events:", eventsWithTimestamp);
      setEvents(eventsWithTimestamp);
    } catch (error) {
      console.error("Error fetching events:", error);
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    const handleVisibilityChange = () => {
      if (document.visibilityState === "visible") {
        console.log("Page became visible. Refetching events.");
        fetchEvents();
      }
    };

    document.addEventListener("visibilitychange", handleVisibilityChange);
    return () => {
      document.removeEventListener("visibilitychange", handleVisibilityChange);
    };
  }, [fetchEvents]);

  const handleCreateEvent = useCallback(async () => {
    if (!userLoggedIn) {
      setOpenLoginModal(true);
      return;
    }

    setIsSubmitting(true);
    try {
      // Log the data being sent to server
      console.log("Creating event with data:", {
        name: data.name,
        community: data.community,
        eventDay: data.eventDay,
        date: data.date,
        time: data.time,
        venue: data.venue,
        dateType: typeof data.date,
      });

      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/event`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          authorization: `Bearer ${localStorage.getItem("token")}`,
        },
        body: JSON.stringify(data),
      });
      const result = await response.json();
      console.log("Event creation response:", result);

      // Refresh the events list to show the new event with correct date
      await fetchEvents();

      // Reset form to step 1 and hide create form
      setFormStep(1);
      setShowCreateForm(false);
      setData({
        name: "",
        community: "",
        eventDay: "",
        date: "",
        time: "",
        venue: "",
        address: {},
      });

      // Optional: still navigate to the event page after a short delay
      setTimeout(() => {
        router.push(`/event/${result._id}`);
      }, 1000);
    } catch (error) {
      console.error("Error creating event:", error);
    } finally {
      setIsSubmitting(false);
    }
  }, [userLoggedIn, data, router, setOpenLoginModal]);

  const forceRefreshEvents = useCallback(() => {
    console.log("Force refreshing events...");
    setRefreshKey((prev) => prev + 1);
    fetchEvents();
  }, [fetchEvents]);

  const handleNextStep = useCallback(() => {
    // proceed to next step

    if (formStep === 1) {
      if (!data.name || !data.community) {
        // Step 1 validation failed
        return;
      }
      setPreviousFormStep(1);
      setFormStep(2);
    } else if (formStep === 2) {
      if (!data.eventDay || !data.venue || !data.date || !data.time) {
        // Step 2 validation failed
        return;
      }
      setPreviousFormStep(2);
      setLastCompletedDay({...data});
      setIsAddingAdditionalDay(false);
      setFormStep(3);
    }
  }, [formStep, data]);

  const handlePrevStep = useCallback(() => {
    if (formStep > 1) {
      if (formStep === 2 && (previousFormStep === 3 || isAddingAdditionalDay)) {
        if (lastCompletedDay) {
          setData(lastCompletedDay);
        }
        setIsAddingAdditionalDay(false);
        setFormStep(3);
      } else {
        setFormStep(formStep - 1);
      }
    } else if (formStep === 1) {
      // If user has events and is creating a new one, go back to events list
      if (events.length > 0 && showCreateForm) {
        setShowCreateForm(false);
        // Remove ?new=true from URL
        router.replace("/event", undefined, { shallow: true });
      } else {
        // Otherwise go back to the previous page in history
        router.back();
      }
    }
  }, [formStep, previousFormStep, isAddingAdditionalDay, lastCompletedDay, router, events.length, showCreateForm]);

  const handleAddMoreDays = useCallback(() => {
    setData((prev) => ({
      ...prev,
      eventDay: "",
      venue: "",
      date: "",
      time: "",
    }));
    setPreviousFormStep(3);
    setFormStep(2);
    setIsAddingAdditionalDay(true);
  }, []);

  const handleViewEvent = useCallback(() => {
    handleCreateEvent();
  }, [handleCreateEvent]);

  const isFormValid = useMemo(() => {
    if (formStep === 1) return data.name && data.community;
    if (formStep === 2)
      return data.eventDay && data.venue && data.date && data.time;
    return true;
  }, [formStep, data]);

  // Initialize Google Maps Places Autocomplete
  useEffect(() => {
    if (formStep === 2) {
      const initializeAutocomplete = async () => {
        try {
          // Load Google Maps API
          // Loading Google Maps API...
          const google = await loadGoogleMaps();

          if (!google?.maps?.places) {
            console.error("Google Maps Places library not available");
            return;
          }

          console.log("Google Maps API loaded successfully");

          // Define Bengaluru bounds
          const bengaluruBounds = new google.maps.LatLngBounds(
            new google.maps.LatLng(12.8236, 77.3832), // Southwest corner
            new google.maps.LatLng(13.1721, 77.8369) // Northeast corner
          );

          // Setup for Desktop Input
          if (venueInputRefDesktop.current) {
            // Setting up autocomplete for desktop input
            const autocompleteDesktop = new google.maps.places.Autocomplete(
              venueInputRefDesktop.current,
              {
                types: ["geocode", "establishment"],
                componentRestrictions: {country: "in"},
                bounds: bengaluruBounds,
                strictBounds: true,
              }
            );

            autocompleteDesktop.addListener("place_changed", () => {
              const place = autocompleteDesktop.getPlace();
              if (!place.geometry) return;

              handlePlaceSelection(place, venueInputRefDesktop.current);

              // Force React state update by triggering a manual change event
              const event = {
                target: {name: "venue", value: place.formatted_address},
              };
              handleDataChange(event);
            });
          }

          // Setup for Mobile Input
          if (venueInputRefMobile.current) {
            // Setting up autocomplete for mobile input
            const autocompleteMobile = new google.maps.places.Autocomplete(
              venueInputRefMobile.current,
              {
                types: ["geocode", "establishment"],
                componentRestrictions: {country: "in"},
                bounds: bengaluruBounds,
                strictBounds: true,
              }
            );

            autocompleteMobile.addListener("place_changed", () => {
              const place = autocompleteMobile.getPlace();
              if (!place.geometry) return;

              handlePlaceSelection(place, venueInputRefMobile.current);

              // Force React state update by triggering a manual change event
              const event = {
                target: {name: "venue", value: place.formatted_address},
              };
              handleDataChange(event);
            });
          }
        } catch (error) {
          console.error("Error initializing Google Maps:", error);
        }
      };

      // Helper function to handle place selection
      const handlePlaceSelection = (place, inputElement) => {
        // Selected place

        const {city, postal_code, state, country, locality} =
          extractAddressComponents(place.address_components);

        // Check if in Bengaluru
        const addressStr = place.formatted_address?.toLowerCase() || "";
        const cityStr = city?.toLowerCase() || "";
        const localityStr = locality?.toLowerCase() || "";

        const isBengaluru =
          addressStr.includes("bengaluru") ||
          addressStr.includes("bangalore") ||
          cityStr.includes("bengaluru") ||
          cityStr.includes("bangalore") ||
          localityStr.includes("bengaluru") ||
          localityStr.includes("bangalore");

        if (!isBengaluru) {
          alert("Please select a location within Bengaluru only.");
          inputElement.value = "";
          setData((prev) => ({
            ...prev,
            venue: "",
            address: {},
          }));
          // Make sure to validate the empty venue field to show error
          validateField("venue", "");
          return;
        }

        // Update data with location info and validate the field
        const venueValue = place.formatted_address;

        // Set input element value explicitly
        inputElement.value = venueValue;
        // Setting venue value

        setData((prev) => {
          const newData = {
            ...prev,
            venue: venueValue,
            address: {
              city,
              postal_code,
              state,
              country,
              locality,
              place_id: place.place_id,
              formatted_address: place.formatted_address,
              geometry: {
                lat: place.geometry.location.lat(),
                lng: place.geometry.location.lng(),
              },
            },
          };
          // Updated form data
          return newData;
        });

        // Validate the venue field to clear any errors
        validateField("venue", venueValue);
      };

      initializeAutocomplete();
    }
  }, [formStep, validateField, handleDataChange]);

  useEffect(() => {
    if (userLoggedIn) {
      fetchEvents();
    } else {
      setIsLoading(false);
    }
  }, [userLoggedIn, fetchEvents]);

  // Refetch events when page becomes visible (user returns from planner)
  useEffect(() => {
    const handleVisibilityChange = () => {
      if (!document.hidden && userLoggedIn) {
        fetchEvents();
      }
    };

    const handleFocus = () => {
      if (userLoggedIn) {
        fetchEvents();
      }
    };

    document.addEventListener("visibilitychange", handleVisibilityChange);
    window.addEventListener("focus", handleFocus);

    return () => {
      document.removeEventListener("visibilitychange", handleVisibilityChange);
      window.removeEventListener("focus", handleFocus);
    };
  }, [userLoggedIn, fetchEvents]);

  // Refetch events when user navigates back to this page
  useEffect(() => {
    const handleRouteChange = () => {
      if (userLoggedIn) {
        fetchEvents();
      }
    };

    router.events.on("routeChangeComplete", handleRouteChange);
    return () => {
      router.events.off("routeChangeComplete", handleRouteChange);
    };
  }, [userLoggedIn, fetchEvents, router.events]);

  if (isLoading) {
    return (
      <>
        <EventPageSkeleton formStep={formStep} />
      </>
    );
  }

  const deriveEventDisplayName = (event) => {
    if (event?.eventDays?.length) {
      const sortedDays = [...event.eventDays].sort((a, b) => {
        const dateA = new Date(a.updatedAt || a.date || 0);
        const dateB = new Date(b.updatedAt || b.date || 0);
        return dateB - dateA;
      });
      return sortedDays[0]?.name || event.name;
    }
    return event?.eventDay || event?.name || "";
  };

  return (
    <>
      <Head>
        <title>My Events | Wedsy</title>
        <meta name="robots" content="noindex, nofollow" />
        <link rel="canonical" href="https://www.wedsy.in/event" />
      </Head>
      {/* Desktop View */}
      <div className="hidden md:block bg-[#F4F4F4] min-h-screen">
        {/* Header */}
        <div className="bg-[#F4F4F4]">
          <div className="px-24 py-8">
            <div
              className="text-black text-[30px] font-medium tracking-[0.1em]"
              style={{fontFamily: "Montserrat"}}
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
              {events.length > 0 && !showCreateForm ? (
                <>
                  Congratulations! Your event has been successfully created! You can{" "}
                  <br /> now begin adding your requirements from the Wedding Store.
                </>
              ) : (
                <>
                  Explore the ease of planning with our event tool at Wedsy. <br />
                  Utilize the tool to shortlist and choose your decorations
                  effortlessly - <br /> all in one place, at Wedsy.
                </>
              )}
            </div>
            {events.length > 0 && !showCreateForm && (
              <Link
                href="/decor"
                className="text-black underline mt-2 inline-block"
                style={{ fontFamily: "Montserrat" }}
              >
                Visit Store
              </Link>
            )}
          </div>
        </div>

        {/* Main Content Grid */}
        <div className="px-24 pb-16">
          <div className="grid grid-cols-5 gap-8 items-start">
            {/* Content Section - Takes 3 columns */}
            <div className="col-span-3 mt-10">
              {events.length === 0 || showCreateForm ? (
                /* Form Section - Only show when no events */
                <div className="bg-[#F4DBD5] rounded-2xl p-8 h-fit">
                  {formStep === 1 && (
                    <EventFormStep1
                      data={data}
                      errors={validationErrors}
                      onChange={handleDataChange}
                      onSubmit={handleNextStep}
                      onPrevStep={handlePrevStep}
                    />
                  )}
                  {formStep === 2 && (
                    <EventFormStep2
                      data={data}
                      errors={validationErrors}
                      onChange={handleDataChange}
                      onSubmit={handleNextStep}
                      onPrevStep={handlePrevStep}
                      eventName={data.name}
                      venueInputRef={venueInputRefDesktop}
                    />
                  )}
                  {formStep === 3 && (
                    <EventFormStep3
                      data={data}
                      eventName={data.name}
                      onAddMoreDays={handleAddMoreDays}
                      onViewEvent={handleViewEvent}
                      onPrevStep={handlePrevStep}
                    />
                  )}
                </div>
              ) : (
                /* Events List Section - Only show when has events */
                <div className="bg-[#F4DBD5] rounded-2xl p-8 h-fit">
                  <div className="flex flex-col gap-6">
                    {/* Title */}
                    <div className="text-center text-[20px] md:text-2xl font-medium text-black">
                      YOUR EVENTS
                    </div>

                    {/* Events List with Scroll */}
                    <div className="max-h-[235px] overflow-y-auto scrollbar-hide mb-4">
                      <div className="flex flex-col gap-2" key={`events-${refreshKey}`}>
                        {events.map((item, index) => {
                          const displayName = deriveEventDisplayName(item);
                          return (
                            <Link
                              href={`/event/${item._id}`}
                              key={`desktop-${item._id}-${index}-${refreshKey}`}
                              className="flex flex-row justify-between items-center py-2 hover:text-pink-600 transition-colors"
                            >
                              <div className="flex items-center gap-2">
                                <span
                                  className="text-lg font-medium text-black"
                                  style={{ fontFamily: "Montserrat" }}
                                >
                                  {index + 1}. {displayName}
                                </span>
                              </div>
                              <div className="flex items-center gap-4">
                                <span className="text-gray-600" style={{ fontFamily: "Montserrat" }}>
                                  {getEventDisplayDate(item)}
                                </span>
                                <BsArrowRight size={16} className="text-gray-400" />
                              </div>
                            </Link>
                          );
                        })}
                      </div>
                    </div>

                    {/* Create New Event Button */}
                    <Link
                      href="/event?new=true"
                      className="bg-[#000000] rounded-2xl p-4 px-12 text-white w-max mx-auto transition-colors duration-200 text-lg font-medium hover:bg-gray-800"
                    >
                      CREATE NEW EVENT
                    </Link>
                  </div>
                </div>
              )}
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
      <div className="md:hidden bg-[#F4F4F4] min-h-screen ">
        {/* Header */}
        <div className="bg-[#F4F4F4]">
          <div className="px-6 py-4">
            <div
              className="text-black text-[20px] font-medium tracking-[0.1em] text-center"
              style={{fontFamily: "Montserrat"}}
            >
              MY EVENT
            </div>
          </div>
          <div className="w-full h-[3px] bg-white"></div>
          <div className="px-6 py-4">
            <div
              className="text-[14px]"
              style={{
                color: "#5F3D30",
                fontFamily: "Montserrat",
                fontWeight: "500",
              }}
            >
              {events.length > 0 && !showCreateForm ? (
                <>
                  Congratulations! Your event has been successfully created! You can
                  now begin adding your requirements from the Wedding Store.
                </>
              ) : (
                <>
                  Explore the ease of planning with our event tool at Wedsy. <br />
                  Utilize the tool to shortlist and choose your decorations
                  effortlessly - all in one place, at Wedsy.
                </>
              )}
            </div>
            {events.length > 0 && !showCreateForm && (
              <Link
                href="/decor"
                className="text-black underline mt-2 inline-block text-sm"
                style={{ fontFamily: "Montserrat" }}
              >
                Visit Store
              </Link>
            )}
          </div>
        </div>

        {/* Main Content */}
        <div className="px-6 py-6">
          {events.length === 0 || showCreateForm ? (
            /* Form Section - Only show when no events */
            <div className="bg-[#F4DBD5] rounded-3xl p-6 mb-6">
              {formStep === 1 && (
                <EventFormStep1
                  data={data}
                  errors={validationErrors}
                  onChange={handleDataChange}
                  onSubmit={handleNextStep}
                  onPrevStep={handlePrevStep}
                />
              )}
              {formStep === 2 && (
                <EventFormStep2
                  data={data}
                  errors={validationErrors}
                  onChange={handleDataChange}
                  onSubmit={handleNextStep}
                  onPrevStep={handlePrevStep}
                  eventName={data.name}
                  venueInputRef={venueInputRefMobile}
                />
              )}
              {formStep === 3 && (
                <EventFormStep3
                  data={data}
                  eventName={data.name}
                  onAddMoreDays={handleAddMoreDays}
                  onViewEvent={handleViewEvent}
                  onPrevStep={handlePrevStep}
                />
              )}
            </div>
          ) : (
            /* Events List Section - Only show when has events */
            <div className="bg-[#F4DBD5] rounded-3xl p-6 mb-6">
              <div className="flex flex-col gap-6">
                {/* Title */}
                <div className="text-center text-[18px] font-medium text-black">
                  YOUR EVENTS
                </div>

                {/* Events List with Scroll */}
                <div className="max-h-[200px] overflow-y-auto scrollbar-hide mb-4">
                  <div className="flex flex-col gap-2" key={`mobile-events-${refreshKey}`}>
                    {events.map((item, index) => {
                      const displayName = deriveEventDisplayName(item);
                      return (
                        <Link
                          href={`/event/${item._id}`}
                          key={`mobile-${item._id}-${index}-${refreshKey}`}
                          className="flex flex-row justify-between items-center py-2 hover:text-pink-600 transition-colors"
                        >
                          <div className="flex items-center gap-2">
                            <span
                              className="text-base font-medium text-black"
                              style={{ fontFamily: "Montserrat" }}
                            >
                              {index + 1}. {displayName}
                            </span>
                          </div>
                          <div className="flex items-center gap-3">
                            <span className="text-sm text-gray-600" style={{ fontFamily: "Montserrat" }}>
                              {getEventDisplayDate(item)}
                            </span>
                            <BsArrowRight size={14} className="text-gray-400" />
                          </div>
                        </Link>
                      );
                    })}
                  </div>
                </div>

                {/* Create New Event Button */}
                <Link
                  href="/event?new=true"
                  className="bg-[#000000] rounded-2xl p-3 px-8 text-white w-max mx-auto transition-colors duration-200 text-base font-medium hover:bg-gray-800"
                >
                  CREATE NEW EVENT
                </Link>
              </div>
            </div>
          )}

          {/* Clipboard */}
          <div className="flex justify-center rounded-3xl mb-6">
            <ClipboardVisual />
          </div>
        </div>

      </div>
      <div className="mb-20">
        <EventHowItWorks />
      </div>
    </>
  );
}
