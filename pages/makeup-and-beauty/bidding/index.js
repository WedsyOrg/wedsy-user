import MobileStickyFooter from "@/components/layout/MobileStickyFooter";
import { loadGoogleMaps } from "@/utils/loadGoogleMaps";
import { Label, Select, TextInput, Textarea } from "flowbite-react";
import Link from "next/link";
import { useRouter } from "next/router";
import { useEffect, useRef, useState } from "react";
import { BsArrowLeft, BsArrowRight } from "react-icons/bs";
import { FaRegEdit } from "react-icons/fa";
import {
  MdCalendarToday,
  MdClear,
  MdDelete,
  MdDone,
  MdPersonOutline,
} from "react-icons/md";

function MakeupAndBeauty({ userLoggedIn, setOpenLoginModalv2, setSource }) {
  const router = useRouter();
  const inputRef = useRef(null); // Reference to the input element
  const cityRef = useRef(null);
  const [googleInstance, setGoogleInstance] = useState(null);
  const [loading, setLoading] = useState(false);
  const [isLoaded, setIsLoaded] = useState(false);
  const [display, setDisplay] = useState("HowItWorks"); // HowItWorks, Events, Makeup,  Complete, Success
  const [eventsCount, setEventsCount] = useState("");
  const [eventIndex, setEventIndex] = useState(0);
  const [events, setEvents] = useState([]);
  const [requirements, setRequirements] = useState({
    city: "",
    gender: "",
    category: "",
    studioMakeup: null,
  });
  
  const [preferredLook, setPreferredLook] = useState([]);
  const [makeupStyle, setMakeupStyle] = useState([]);
  const [addOns, setAddOns] = useState([]);
  const [vendorcategory, setVendorCategory] = useState([]);

  // Notes state management for dynamic functionality
  const [notesState, setNotesState] = useState({}); // Track notes state per event

  const getNotesState = (eventIdx) => {
    return notesState[eventIdx] || { 
      buttonState: 'add', // 'add', 'save', 'edit'
      isEditing: false,
      noteText: '',
      isSaved: false
    };
  };

  const updateNotesState = (eventIdx, newState) => {
    setNotesState(prev => ({
      ...prev,
      [eventIdx]: { ...getNotesState(eventIdx), ...newState }
    }));
  };

  const handleNotesButtonClick = (eventIdx) => {
    const currentState = getNotesState(eventIdx);
    
    if (currentState.buttonState === 'add') {
      // Add Notes -> Show textbox and change to Save Notes
      updateNotesState(eventIdx, {
        buttonState: 'save',
        isEditing: true
      });
    } else if (currentState.buttonState === 'save') {
      // Save Notes -> Save the content and change to Edit Notes
      if (currentState.noteText.trim()) {
        setEvents((prev) => {
          const updated = [...prev];
          updated[eventIdx] = {
            ...updated[eventIdx],
            notes: [currentState.noteText.trim()]
          };
          return updated;
        });
        
        updateNotesState(eventIdx, {
          buttonState: 'edit',
          isEditing: false,
          isSaved: true
        });
      }
    } else if (currentState.buttonState === 'edit') {
      // Edit Notes -> Enable editing and change to Save Notes
      updateNotesState(eventIdx, {
        buttonState: 'save',
        isEditing: true
      });
    }
  };

  const handleNotesTextChange = (eventIdx, value) => {
    // Limit to 150 characters
    const limitedValue = value.slice(0, 150);
    updateNotesState(eventIdx, {
      noteText: limitedValue
    });
  };

  const getNotesButtonText = (eventIdx) => {
    const state = getNotesState(eventIdx).buttonState;
    switch (state) {
      case 'add': return '+ Add Notes';
      case 'save': return 'Save Notes';
      case 'edit': return 'Edit Notes';
      default: return '+ Add Notes';
    }
  };

  const extractAddressComponents = (components) => {
    const result = {
      city: "",
      postal_code: "",
      state: "",
      country: "",
      locality: "",
    };

    components.forEach((component) => {
      if (component.types.includes("locality")) {
        result.city = component.long_name; // Locality usually represents the city
      }
      if (
        component.types.includes("administrative_area_level_2") &&
        !result.city
      ) {
        result.city = component.long_name; // Fallback if locality isn't available
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
        component.types.includes("sublocality") ||
        component.types.includes("neighborhood")
      ) {
        result.locality = component.long_name; // More granular locality info
      }
    });

    return result;
  };

  const CheckIfAllEventData = () => {
    let tempEvents = events?.filter(
      (item) =>
        !item?.eventName || !item?.date || !item?.time || !item?.location
    );
    console.log(tempEvents);

    return !(tempEvents.length > 0);
  };

  useEffect(() => {
    const initializeAutocomplete = async () => {
      try {
        let google = null;
        if (!isLoaded) {
          google = await loadGoogleMaps(); // Load Google Maps API
          setGoogleInstance(google);
          setIsLoaded(true);
        } else {
          google = googleInstance;
        }
        if (!google?.maps) {
          throw new Error("Google Maps library is not loaded properly.");
        }
        // Check if inputRef.current exists before initializing Autocomplete
        if (inputRef.current) {
          const autocomplete = new google.maps.places.Autocomplete(
            inputRef.current,
            {
              types: ["geocode"], // Restrict results to addresses only
              componentRestrictions: { country: "in" }, // Restrict to India
              bounds: new google.maps.LatLngBounds(
                new google.maps.LatLng(12.9141, 77.4563), // Southwest corner of Bengaluru
                new google.maps.LatLng(13.1129, 77.7343)  // Northeast corner of Bengaluru
              ),
              strictBounds: true, // Only show results within the bounds
            }
          );

          // Listen for place selection
          autocomplete.addListener("place_changed", () => {
            const place = autocomplete.getPlace();
            if (place.geometry) {
              const { city, postal_code, state, country, locality } =
                extractAddressComponents(place.address_components);
              
              // Validate that the selected location is in Bengaluru
              const isBengaluru = city.toLowerCase().includes('bengaluru') || 
                                 city.toLowerCase().includes('bangalore') ||
                                 locality.toLowerCase().includes('bengaluru') ||
                                 locality.toLowerCase().includes('bangalore');
              
              if (!isBengaluru) {
                alert("Please select a location within Bengaluru only.");
                // Clear the input
                setEvents((prevItems) => {
                  const updatedItems = [...prevItems];
                  updatedItems[eventIndex] = {
                    ...updatedItems[eventIndex],
                    location: "",
                    address: {},
                  };
                  return updatedItems;
                });
                return;
              }
              
              setEvents((prevItems) => {
                const updatedItems = [...prevItems];
                updatedItems[eventIndex] = {
                  ...updatedItems[eventIndex],
                  location: place.formatted_address,
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
                return updatedItems;
              });
            }
          });
        } else {
          console.warn("Input reference is not available yet.");
        }
      } catch (error) {
        console.error("Error loading Google Maps:", error);
      }
    };
    if (display === "Makeup") {
      initializeAutocomplete();
    }
  }, [eventIndex, display]);
  
  // Comment out Google Maps autocomplete for city in Complete section
  /*
  useEffect(() => {
    const initializeAutocomplete = async () => {
      try {
        let google = null;
        if (!isLoaded) {
          google = await loadGoogleMaps(); // Load Google Maps API
          setGoogleInstance(google);
          setIsLoaded(true);
        } else {
          google = googleInstance;
        }
        if (!google?.maps) {
          throw new Error("Google Maps library is not loaded properly.");
        }
        // Check if inputRef.current exists before initializing Autocomplete
        if (cityRef.current) {
          const autocomplete = new google.maps.places.Autocomplete(
            cityRef.current,
            {
              types: ["(cities)"], // Restrict results to addresses only
            }
          );

          // Listen for place selection
          autocomplete.addListener("place_changed", () => {
            const place = autocomplete.getPlace();
            if (place.geometry) {
              setRequirements((prev) => ({ ...prev, city: place.name }));
            }
          });
        } else {
          console.warn("Input reference is not available yet.");
        }
      } catch (error) {
        console.error("Error loading Google Maps:", error);
      }
    };
    if (display === "Complete") {
      initializeAutocomplete();
    }
  }, [display]);
  */

  const fetchVendorCategory = () => {
    setLoading(true);
    fetch(`${process.env.NEXT_PUBLIC_API_URL}/vendor-category`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        authorization: `Bearer ${localStorage.getItem("token")}`,
      },
    })
      .then((response) => response.json())
      .then((response) => {
        setLoading(false);
        setVendorCategory(response);
      })
      .catch((error) => {
        console.error("There was a problem with the fetch operation:", error);
      });
  };
  const fetchPreferredLook = () => {
    setLoading(true);
    fetch(`${process.env.NEXT_PUBLIC_API_URL}/vendor-preferred-look`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        authorization: `Bearer ${localStorage.getItem("token")}`,
      },
    })
      .then((response) => response.json())
      .then((response) => {
        setLoading(false);
        setPreferredLook(response);
      })
      .catch((error) => {
        console.error("There was a problem with the fetch operation:", error);
      });
  };
  const fetchMakeupStyle = () => {
    setLoading(true);
    fetch(`${process.env.NEXT_PUBLIC_API_URL}/vendor-makeup-style`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        authorization: `Bearer ${localStorage.getItem("token")}`,
      },
    })
      .then((response) => response.json())
      .then((response) => {
        setLoading(false);
        setMakeupStyle(response);
      })
      .catch((error) => {
        console.error("There was a problem with the fetch operation:", error);
      });
  };
  const fetchAddOns = () => {
    setLoading(true);
    fetch(`${process.env.NEXT_PUBLIC_API_URL}/vendor-add-ons`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        authorization: `Bearer ${localStorage.getItem("token")}`,
      },
    })
      .then((response) => response.json())
      .then((response) => {
        setLoading(false);
        setAddOns(response);
      })
      .catch((error) => {
        console.error("There was a problem with the fetch operation:", error);
      });
  };
  
  useEffect(() => {
    if (!document.body.classList.contains("relative")) {
      document.body.classList.add("relative");
    }
  }, []);

  useEffect(() => {
    if (eventIndex > events.length - 1) {
      setEventIndex(0);
    }
  }, [eventIndex, events]);

  const handleSubmit = () => {
    setLoading(true);
    fetch(`${process.env.NEXT_PUBLIC_API_URL}/bidding`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        authorization: `Bearer ${localStorage.getItem("token")}`,
      },
      body: JSON.stringify({
        events,
        requirements,
      }),
    })
      .then((response) => response.json())
      .then((response) => {
        setLoading(false);
        if (response.message === "success") {
          setDisplay("Success");
        } else {
          alert("Please try again later");
        }
      })
      .catch((error) => {
        console.error("There was a problem with the fetch operation:", error);
      });
  };
  
  useEffect(() => {
    fetchAddOns();
    fetchMakeupStyle();
    fetchPreferredLook();
    fetchVendorCategory();
  }, []);

  // Initialize notes state when events change
  useEffect(() => {
    events.forEach((event, index) => {
      if (event.notes && event.notes.length > 0 && !getNotesState(index).isSaved) {
        updateNotesState(index, {
          noteText: event.notes[0] || '',
          buttonState: 'edit',
          isSaved: true,
          isEditing: false
        });
      }
    });
  }, [events]);

  return (
    <>
      <MobileStickyFooter />
      {display === "HowItWorks" && (
        <>
          <div className="md:hidden relative">
            <img
              src="/assets/images/bidding-mobile.png"
              className="w-full h-full"
            />
            <div className="absolute bottom-12 left-1/2 -translate-x-1/2 w-full px-12 flex flex-row">
              <button
                className="bg-[#840032] text-white rounded-lg w-full grow text-center px-auto py-2 font-medium"
                onClick={() => {
                  if (!userLoggedIn) {
                    setSource("Makeup & Beauty Bidding");
                    setOpenLoginModalv2(true);
                  } else {
                    setDisplay("Events");
                  }
                }}
              >
                Next
              </button>
            </div>
          </div>
          <div className="hidden md:block relative">
            <img
              src="/assets/images/bidding-desktop.png"
              className="w-full h-full"
            />
            <button
              className="bg-[#840032] text-white rounded-lg absolute bottom-8 lg:bottom-12 left-1/2 -translate-x-1/2 px-16 py-2 lg:text-lg font-medium"
              onClick={() => {
                if (!userLoggedIn) {
                  setSource("Makeup & Beauty Bidding");
                  setOpenLoginModalv2(true);
                } else {
                  setDisplay("Events");
                }
              }}
            >
              Next
            </button>
          </div>
        </>
      )}
      {(display === "Events" ||
        display === "Makeup" ||
        display === "Complete") && (
        <>
          <div className="relative w-full">
            <div className="w-full sticky top-0 bg-white flex flex-row items-center">
              <div className="hidden md:block my-4 mx-3">
                <BsArrowLeft
                  size={20}
                  cursor={"pointer"}
                  onClick={() => {
                    //  HowItWorks, Events, Makeup,  Complete, Success
                    if (display === "Events") {
                      setDisplay("HowItWorks");
                    } else if (display === "Makeup") {
                      setDisplay("Events");
                    } else if (display === "Complete") {
                      setDisplay("Makeup");
                    }
                  }}
                />
              </div>
              <div className="grid grid-cols-3 grow items-start">
                <div
                  className={`h-full p-2 md:p-4 ${
                    display === "Events" ? "border-b-[#840032]" : "border-white"
                  } border-b-2`}
                  onClick={() => {
                    //  HowItWorks, Events, Makeup,  Complete, Success
                    if (display === "Makeup") {
                      setDisplay("Events");
                    } else if (display === "Complete") {
                      setDisplay("Events");
                    }
                  }}
                >
                  <div className="flex flex-row gap-2 items-center justify-center">
                    <MdCalendarToday size={20} className="text-gray-500" />
                    <span className="text-sm md:text-xl font-medium md:font-semibold">
                      Events
                    </span>
                  </div>
                </div>
                <div
                  className={`h-full p-2 md:p-4 ${
                    display === "Makeup" ? "border-b-[#840032]" : "border-white"
                  } border-b-2`}
                  onClick={() => {
                    //  HowItWorks, Events, Makeup,  Complete, Success
                    if (display === "Events" && events.length > 0) {
                      setDisplay("Makeup");
                    } else if (display === "Complete") {
                      setDisplay("Makeup");
                    }
                  }}
                >
                  <div className="flex flex-row gap-2 items-center justify-center">
                    <FaRegEdit
                      size={24}
                      className="hidden md:block text-gray-500"
                    />
                    <FaRegEdit size={20} className="md:hidden text-gray-500" />
                    <div>
                      <p className="text-sm md:text-xl font-medium md:font-semibold">
                        Makeup
                      </p>
                      <div className="hidden md:block w-full uppercase font-semibold text-gray-500 text-sm">
                        Requirements
                      </div>
                    </div>
                  </div>
                </div>
                <div
                  className={`h-full p-2 md:p-4 ${
                    display === "Complete"
                      ? "border-b-[#840032]"
                      : "border-white"
                  } border-b-2`}
                  onClick={() => {
                    //  HowItWorks, Events, Makeup,  Complete, Success
                    if (CheckIfAllEventData()) {
                      if (display === "Events" && events.length > 0) {
                        setDisplay("Complete");
                      } else if (display === "Makeup") {
                        setDisplay("Complete");
                      }
                    }
                  }}
                >
                  <div className="flex flex-row gap-2 items-center justify-center">
                    <MdDone size={24} className="text-gray-500" />
                    <div>
                      <p className=" text-sm md:text-xl font-medium md:font-semibold">
                        Complete
                      </p>
                      <div className="hidden md:block text-center w-full uppercase font-semibold text-gray-500 text-sm">
                        Schedule Date
                      </div>
                    </div>
                  </div>
                </div>
              </div>
              <div className="hidden md:block my-4 mx-3">
                <BsArrowRight
                  size={20}
                  cursor={"pointer"}
                  onClick={() => {
                    //  HowItWorks, Events, Makeup,  Complete, Success
                    if (display === "Events" && eventsCount) {
                      setDisplay("Makeup");
                    } else if (display === "Makeup" && CheckIfAllEventData()) {
                      setDisplay("Complete");
                    }
                  }}
                />
              </div>
            </div>
            {display === "Events" && (
              <>
                <div className="py-16 px-6 md:p-32 bg-[#FAFBFF] flex flex-col md:items-center gap-6 min-h-[80vh]">
                  <p className="font-semibold text-2xl text-center">
                    How many events?
                  </p>
                  <p className="text-gray-500 md:text-lg text-center">
                  Please enter the number of events you would require makeup for
                  </p>
                  
                  {/* Example text above button for desktop screens */}
                  <p className="text-gray-500 text-sm text-center italic hidden md:block">
                  eg : Specify 1 for engagement, 3 for Sangeet, Reception & Wedding
                  </p>

                  <TextInput
                    className="bg-white"
                    type="number"
                    placeholder="Number of Events"
                    value={eventsCount}
                    onChange={(e) => {
                      setEventsCount(e.target.value);
                    }}
                  />
                  <button
                    className="bg-[#840032] text-white rounded-lg px-16 py-2 text-lg font-medium"
                    onClick={() => {
                      if (parseInt(eventsCount) >= 1) {
                        setDisplay("Makeup");
                        setEvents(
                          new Array(parseInt(eventsCount))
                            ?.fill("")
                            ?.map((_) => ({
                              eventName: "",
                              date: "",
                              time: "",
                              location: "",
                              address: {},
                              notes: [],
                              peoples: [
                                {
                                  noOfPeople: "",
                                  makeupStyle: "",
                                  preferredLook: "",
                                  addOns: "",
                                },
                              ],
                            }))
                        );
                        setEventIndex(0);
                      } else {
                        alert("Enter valid numbe of events");
                      }
                    }}
                  >
                    Next
                  </button>
                  
                  {/* Example text below Next button for mobile screens */}
                  <p className="text-gray-500 text-sm text-center italic md:hidden">
                  eg : Specify 1 for engagement, 3 for Sangeet, Reception & Wedding
                  </p>
                </div>
              </>
            )}
            {display === "Makeup" && (
              <>
                {/* Mobile View */}
                <div className="bg-[#FAFBFF] flex md:hidden flex-col gap-4 overflow-y-auto min-h-screen pb-20">
                  <div className="grid grid-cols-3 gap-4 p-4 items-center border-b-4 border-b-white">
                    {events?.map((item, index) => (
                      <div
                        className={`relative p-2 rounded-full font-medium text-center border ${
                          eventIndex === index
                            ? "border-[#840032] bg-[#840032] text-white"
                            : "border-gray-500 bg-white text-gray-500"
                        }`}
                        key={index}
                        onClick={() => {
                          setEventIndex(index);
                        }}
                      >
                        {item?.eventName || `Event ${index + 1}`}
                      </div>
                    ))}

                    <div
                      onClick={() => {
                        let tempCount = parseInt(eventsCount);
                        tempCount++;
                        setEvents([
                          ...events,
                          {
                            eventName: "",
                            date: "",
                            time: "",
                            location: "",
                            address: {},
                            notes: [],
                            peoples: [
                              {
                                noOfPeople: "",
                                makeupStyle: "",
                                preferredLook: "",
                                addOns: "",
                              },
                            ],
                          },
                        ]);
                        setEventIndex(tempCount - 1);
                        setEventsCount(String(tempCount));
                      }}
                      className={`p-2 rounded-full font-medium text-center border-2 bg-gray-700 text-white cursor-pointer`}
                    >
                      + Add
                    </div>
                    {events.length > 1 && (
                      <MdDelete
                        className={`h-10 w-10 p-2 rounded-lg bg-white border ml-auto col-start-3 text-[#840032]`}
                        onClick={() => {
                          let tempCount = parseInt(eventsCount);
                          tempCount--;
                          setEventIndex(0);
                          setEventsCount(String(tempCount));
                          setEvents(
                            events.filter(
                              (_, recIndex) => recIndex !== eventIndex
                            )
                          );
                        }}
                        cursor={"pointer"}
                      />
                    )}
                  </div>
                  
                  {/* Event Details */}
                  <div className="grid grid-cols-2 gap-4 p-4 border-b-4 border-b-white">
                    <div className="col-span-2">
                      <Label value="Event Name" />
                      <TextInput
                        value={events[eventIndex]?.eventName}
                        placeholder="eg : Haldi"
                        onChange={(e) => {
                          setEvents(
                            events?.map((rec, recIndex) =>
                              recIndex === eventIndex
                                ? { ...rec, eventName: e.target.value }
                                : rec
                            )
                          );
                        }}
                      />
                    </div>
                    <div>
                      <Label value="Date" />
                      <TextInput
                        type="date"
                        value={events[eventIndex]?.date}
                        onChange={(e) => {
                          setEvents(
                            events?.map((rec, recIndex) =>
                              recIndex === eventIndex
                                ? { ...rec, date: e.target.value }
                                : rec
                            )
                          );
                        }}
                      />
                    </div>
                    <div>
                      <Label value="Time" />
                      <TextInput
                        type="time"
                        value={events[eventIndex]?.time}
                        onChange={(e) => {
                          setEvents(
                            events?.map((rec, recIndex) =>
                              recIndex === eventIndex
                                ? { ...rec, time: e.target.value }
                                : rec
                            )
                          );
                        }}
                      />
                    </div>
                    <div className="col-span-2">
                      <Label value="Location" />
                      <TextInput
                        ref={inputRef}
                        value={events[eventIndex]?.location}
                        placeholder="Bengaluru"
                        onChange={(e) => {
                          setEvents(
                            events?.map((rec, recIndex) =>
                              recIndex === eventIndex
                                ? { ...rec, location: e.target.value }
                                : rec
                            )
                          );
                        }}
                      />
                    </div>
                  </div>
                  
                  {/* People Details */}
                  {events[eventIndex]?.peoples?.map((item, index) => (
                    <div
                      key={index}
                      className="grid grid-cols-2 gap-4 border-b-4 border-b-white p-4"
                    >
                      <div>
                        <TextInput
                          icon={MdPersonOutline}
                          value={item?.preferredLook === "Bridal" ? "1" : item?.noOfPeople}
                          placeholder="1"
                          type="number"
                          min="1"
                          max="15"
                          disabled={item?.preferredLook === "Bridal"}
                          onChange={(e) => {
                            // Don't allow changes if Preferred Look is Bridal
                            if (item?.preferredLook === "Bridal") {
                              return;
                            }
                            const value = parseInt(e.target.value);
                            if (value > 15) {
                              alert("Maximum 15 people allowed");
                              return;
                            }
                            if (value < 1) {
                              return;
                            }
                            setEvents((prev) => {
                              const updated = [...prev];
                              updated[eventIndex] = {
                                ...updated[eventIndex],
                                peoples: updated[eventIndex]?.peoples.map(
                                  (person, i) =>
                                    i === index
                                      ? {
                                          ...person,
                                          noOfPeople: e.target.value,
                                        }
                                      : person
                                ),
                              };
                              return updated;
                            });
                          }}
                        />
                      </div>
                      <div>
                        <Select
                          value={item?.makeupStyle}
                          onChange={(e) => {
                            setEvents((prev) => {
                              const updated = [...prev];
                              updated[eventIndex] = {
                                ...updated[eventIndex],
                                peoples: updated[eventIndex]?.peoples.map(
                                  (person, i) =>
                                    i === index
                                      ? {
                                          ...person,
                                          makeupStyle: e.target.value,
                                        }
                                      : person
                                ),
                              };
                              return updated;
                            });
                          }}
                        >
                          <option value={""}>Select Makeup Style</option>
                          {makeupStyle?.map((r, i) => (
                            <option value={r?.title} key={i}>
                              {r.title}
                            </option>
                          ))}
                        </Select>
                      </div>
                      <div>
                        <Select
                          value={item?.preferredLook}
                          onChange={(e) => {
                            const selectedLook = e.target.value;
                            setEvents((prev) => {
                              const updated = [...prev];
                              updated[eventIndex] = {
                                ...updated[eventIndex],
                                peoples: updated[
                                  eventIndex
                                ]?.peoples.map((person, i) =>
                                  i === index
                                    ? {
                                        ...person,
                                        preferredLook: selectedLook,
                                        // If Bridal is selected, set noOfPeople to 1
                                        noOfPeople: selectedLook === "Bridal" ? "1" : person.noOfPeople,
                                      }
                                    : person
                                ),
                              };
                              return updated;
                            });
                          }}
                        >
                          <option value={""}>Select Preferred Look</option>
                          {preferredLook?.map((r, i) => (
                            <option value={r?.title} key={i}>
                              {r.title}
                            </option>
                          ))}
                        </Select>
                      </div>
                      <div>
                        <Select
                          value={item?.addOns}
                          onChange={(e) => {
                            setEvents((prev) => {
                              const updated = [...prev];
                              updated[eventIndex] = {
                                ...updated[eventIndex],
                                peoples: updated[eventIndex]?.peoples.map(
                                  (person, i) =>
                                    i === index
                                      ? {
                                          ...person,
                                          addOns: e.target.value,
                                        }
                                      : person
                                ),
                              };
                              return updated;
                            });
                          }}
                        >
                          <option value={""}>Select AddOns</option>
                          {addOns?.map((r, i) => (
                            <option value={r?.title} key={i}>
                              {r.title}
                            </option>
                          ))}
                        </Select>
                      </div>
                    </div>
                  ))}
                  
                  {/* Dynamic Notes Section - Mobile */}
                  {getNotesState(eventIndex).isEditing && (
                      <div className="border-b-4 border-b-white p-4">
                        <Label value="Notes" />
                      <div className="relative">
                        <Textarea
                          value={getNotesState(eventIndex).noteText}
                          onChange={(e) => handleNotesTextChange(eventIndex, e.target.value)}
                          placeholder="Mention anything that you think artist should know before they send you a quote"
                          maxLength={150}
                          rows={3}
                          className="resize-none"
                        />
                        <div className="text-xs text-gray-500 mt-1 text-right">
                          {getNotesState(eventIndex).noteText.length}/150 characters
                      </div>
                      </div>
                    </div>
                  )}
                  
                  {/* Saved Notes Display - Mobile */}
                  {getNotesState(eventIndex).isSaved && !getNotesState(eventIndex).isEditing && (
                    <div className="border-b-4 border-b-white p-4">
                      <Label value="Notes" />
                      <div className="bg-gray-50 p-3 rounded-lg">
                        <div className="text-sm text-gray-700 whitespace-pre-wrap break-words">{getNotesState(eventIndex).noteText}</div>
                      </div>
                    </div>
                  )}

                  {/* Action Buttons - Mobile */}
                  <div className="grid grid-cols-2 gap-4 p-4">
                    <button
                      onClick={() => {
                        setEvents((prev) => {
                          const updated = [...prev];
                          updated[eventIndex] = {
                            ...updated[eventIndex],
                            peoples: [
                              ...updated[eventIndex]?.peoples,
                              {
                                noOfPeople: "",
                                makeupStyle: "",
                                preferredLook: "",
                                addOns: "",
                              },
                            ],
                          };
                          return updated;
                        });
                      }}
                      className={`py-2 px-4 rounded-lg font-medium text-center bg-[#2B3F6C] text-white cursor-pointer h-10`}
                    >
                      + Add more people
                    </button>
                    <button
                      onClick={() => handleNotesButtonClick(eventIndex)}
                      className={`py-2 px-4 rounded-lg font-medium text-center bg-[#FFC700] text-[#2B3F6C] cursor-pointer h-10`}
                    >
                      {getNotesButtonText(eventIndex)}
                    </button>
                  </div>
                  
                  {/* Helper Text - Mobile */}
                  {!getNotesState(eventIndex).isEditing && !getNotesState(eventIndex).isSaved && (
                  <div className="px-4 pb-4">
                    <p className="text-xs text-gray-500 text-center bg-gray-50 rounded-lg p-3">
                      Mention anything that you think artist should know before they send you a quote
                    </p>
                  </div>
                  )}
                  
                  <button
                    className="bg-[#840032] text-white rounded-lg px-16 py-2 text-lg font-medium m-4 mb-8"
                    onClick={() => {
                      if (events.length > 0 && CheckIfAllEventData()) {
                        setDisplay("Complete");
                      } else {
                        alert("Enter complete information of events");
                      }
                    }}
                  >
                    Next
                  </button>
                </div>

                {/* Desktop View */}
                <div className="px-24 py-8 min-h-screen bg-[#FAFBFF] hidden md:grid grid-cols-4 gap-4 items-center">
                  <p className="text-2xl font-semibold">Requirements</p>
                  <p className="col-span-3 text-gray-500">
                  Enter your requirements in detail for our artists to quote you better
                  </p>
                  <div className="border-r flex flex-col gap-4 justify-center h-full py-8">
                    {events?.map((item, index) => (
                      <div
                        className={`relative py-3 px-4 rounded-lg font-semibold text-lg text-center mr-8 border-2 ${
                          eventIndex === index
                            ? "border-[#840032] text-[#840032]"
                            : "border-gray-500 text-gray-500"
                        }`}
                        key={index}
                        onClick={() => {
                          setEventIndex(index);
                        }}
                      >
                        {item?.eventName || `Event ${index + 1}`}
                        {events?.length > 1 && (
                          <MdClear
                            className={`absolute -top-3 -right-3 text-white h-6 w-6 rounded-full ${
                              eventIndex === index
                                ? "bg-[#840032]"
                                : "bg-gray-500"
                            }`}
                            onClick={() => {
                              let tempCount = parseInt(eventsCount);
                              tempCount--;
                              setEventIndex(0);
                              setEventsCount(String(tempCount));
                              setEvents(
                                events.filter(
                                  (_, recIndex) => recIndex !== index
                                )
                              );
                            }}
                            cursor={"pointer"}
                          />
                        )}
                      </div>
                    ))}
                    <div
                      onClick={() => {
                        let tempCount = parseInt(eventsCount);
                        tempCount++;
                        setEvents([
                          ...events,
                          {
                            eventName: "",
                            date: "",
                            time: "",
                            location: "",
                            address: {},
                            notes: [],
                            peoples: [
                              {
                                noOfPeople: "",
                                makeupStyle: "",
                                preferredLook: "",
                                addOns: "",
                              },
                            ],
                          },
                        ]);
                        setEventIndex(tempCount - 1);
                        setEventsCount(String(tempCount));
                      }}
                      className={`py-3 px-4 rounded-lg font-semibold text-lg text-center mr-8 border-2 bg-gray-700 text-white cursor-pointer`}
                    >
                      + Add
                    </div>
                  </div>
                  {eventIndex < events.length &&
                    events?.map(
                      (tEvent, tIndex) =>
                        tIndex === eventIndex && (
                          <div
                            className="flex flex-col gap-4 col-span-3 py-4 self-start"
                            key={tIndex}
                          >
                            <div
                              className="grid grid-cols-5 gap-4"
                              key={tIndex}
                            >
                              <div classname="text-gray-500">
                                <Label value="Event Name" />
                                <TextInput
                                  value={events[eventIndex]?.eventName}
                                  placeholder="eg : Haldi"
                                  onChange={(e) => {
                                    setEvents(
                                      events?.map((rec, recIndex) =>
                                        recIndex === eventIndex
                                          ? {
                                              ...rec,
                                              eventName: e.target.value,
                                            }
                                          : rec
                                      )
                                    );
                                  }}
                                />
                              </div>
                              <div>
                                <Label value="Date" />
                                <TextInput
                                  type="date"
                                  value={events[eventIndex]?.date}
                                  onChange={(e) => {
                                    setEvents(
                                      events?.map((rec, recIndex) =>
                                        recIndex === eventIndex
                                          ? { ...rec, date: e.target.value }
                                          : rec
                                      )
                                    );
                                  }}
                                />
                              </div>
                              <div>
                                <Label value="Time" />
                                <TextInput
                                  type="time"
                                  value={events[eventIndex]?.time}
                                  onChange={(e) => {
                                    setEvents(
                                      events?.map((rec, recIndex) =>
                                        recIndex === eventIndex
                                          ? { ...rec, time: e.target.value }
                                          : rec
                                      )
                                    );
                                  }}
                                />
                              </div>
                              <div className="col-span-2">
                                <Label value="Location" />
                                <TextInput
                                  ref={inputRef}
                                  value={events[eventIndex]?.location}
                                  onChange={(e) => {
                                    setEvents(
                                      events?.map((rec, recIndex) =>
                                        recIndex === eventIndex
                                          ? { ...rec, location: e.target.value }
                                          : rec
                                      )
                                    );
                                  }}
                                />
                              </div>
                            </div>
                            {events[eventIndex]?.peoples?.map((item, index) => (
                              <div
                                key={index}
                                className="grid grid-cols-5 gap-4"
                              >
                                <div>
                                  <Label value="No. of People" />
                                  <TextInput
                                    value={item?.preferredLook === "Bridal" ? "1" : item?.noOfPeople}
                                    placeholder="1"
                                    type="number"
                                    min="1"
                                    max="15"
                                    disabled={item?.preferredLook === "Bridal"}
                                    onChange={(e) => {
                                      // Don't allow changes if Preferred Look is Bridal
                                      if (item?.preferredLook === "Bridal") {
                                        return;
                                      }
                                      const value = parseInt(e.target.value);
                                      if (value > 15) {
                                        alert("Maximum 15 people allowed");
                                        return;
                                      }
                                      if (value < 1) {
                                        return;
                                      }
                                      setEvents((prev) => {
                                        const updated = [...prev];
                                        updated[eventIndex] = {
                                          ...updated[eventIndex],
                                          peoples: updated[
                                            eventIndex
                                          ]?.peoples.map((person, i) =>
                                            i === index
                                              ? {
                                                  ...person,
                                                  noOfPeople: e.target.value,
                                                }
                                              : person
                                          ),
                                        };
                                        return updated;
                                      });
                                    }}
                                  />
                                </div>
                                <div className="col-span-4 grid grid-cols-3 gap-4">
                                  <div>
                                    <Label value="Makeup Style" />
                                    <Select
                                      value={item?.makeupStyle}
                                      onChange={(e) => {
                                        setEvents((prev) => {
                                          const updated = [...prev];
                                          updated[eventIndex] = {
                                            ...updated[eventIndex],
                                            peoples: updated[
                                              eventIndex
                                            ]?.peoples.map((person, i) =>
                                              i === index
                                                ? {
                                                    ...person,
                                                    makeupStyle: e.target.value,
                                                  }
                                                : person
                                            ),
                                          };
                                          return updated;
                                        });
                                      }}
                                    >
                                      <option value={""}>
                                        Select Makeup Style
                                      </option>
                                      {makeupStyle?.map((r, i) => (
                                        <option value={r?.title} key={i}>
                                          {r.title}
                                        </option>
                                      ))}
                                    </Select>
                                  </div>
                                  <div>
                                    <Label value="Preferred Look" />
                                    <Select
                                      value={item?.preferredLook}
                                      onChange={(e) => {
                                        const selectedLook = e.target.value;
                                        setEvents((prev) => {
                                          const updated = [...prev];
                                          updated[eventIndex] = {
                                            ...updated[eventIndex],
                                            peoples: updated[
                                              eventIndex
                                            ]?.peoples.map((person, i) =>
                                              i === index
                                                ? {
                                                    ...person,
                                                    preferredLook:
                                                      e.target.value,
                                                  }
                                                : person
                                            ),
                                          };
                                          return updated;
                                        });
                                      }}
                                    >
                                      <option value={""}>
                                        Select Preferred Look
                                      </option>
                                      {preferredLook?.map((r, i) => (
                                        <option value={r?.title} key={i}>
                                          {r.title}
                                        </option>
                                      ))}
                                    </Select>
                                  </div>
                                  <div>
                                    <Label value="Add Ons" />
                                    <Select
                                      value={item?.addOns}
                                      onChange={(e) => {
                                        setEvents((prev) => {
                                          const updated = [...prev];
                                          updated[eventIndex] = {
                                            ...updated[eventIndex],
                                            peoples: updated[
                                              eventIndex
                                            ]?.peoples.map((person, i) =>
                                              i === index
                                                ? {
                                                    ...person,
                                                    addOns: e.target.value,
                                                  }
                                                : person
                                            ),
                                          };
                                          return updated;
                                        });
                                      }}
                                    >
                                      <option value={""}>Select AddOns</option>
                                      {addOns?.map((r, i) => (
                                        <option value={r?.title} key={i}>
                                          {r.title}
                                        </option>
                                      ))}
                                    </Select>
                                  </div>
                                </div>
                              </div>
                            ))}
                            
                            {/* Dynamic Notes Section - Desktop */}
                            {getNotesState(eventIndex).isEditing && (
                                <div>
                                  <Label value="Notes" />
                                <div className="relative">
                                  <Textarea
                                    value={getNotesState(eventIndex).noteText}
                                    onChange={(e) => handleNotesTextChange(eventIndex, e.target.value)}
                                    placeholder="Mention anything that you think artist should know before they send you a quote"
                                    maxLength={150}
                                    rows={4}
                                    className="resize-none"
                                  />
                                  <div className="text-xs text-gray-500 mt-1 text-right">
                                    {getNotesState(eventIndex).noteText.length}/150 characters
                                  </div>
                                </div>
                              </div>
                            )}
                            
                            {/* Saved Notes Display - Desktop */}
                            {getNotesState(eventIndex).isSaved && !getNotesState(eventIndex).isEditing && (
                              <div>
                                <Label value="Notes" />
                                <div className="bg-gray-50 p-3 rounded-lg">
                                  <div className="text-sm text-gray-700 whitespace-pre-wrap break-words">{getNotesState(eventIndex).noteText}</div>
                                </div>
                              </div>
                            )}

                            <div className="grid grid-cols-4 gap-4">
                              <button
                                onClick={() => {
                                  setEvents((prev) => {
                                    const updated = [...prev];
                                    updated[eventIndex] = {
                                      ...updated[eventIndex],
                                      peoples: [
                                        ...updated[eventIndex]?.peoples,
                                        {
                                          noOfPeople: "",
                                          makeupStyle: "",
                                          preferredLook: "",
                                          addOns: "",
                                        },
                                      ],
                                    };
                                    return updated;
                                  });
                                }}
                                className={`py-2 px-4 rounded-lg font-medium sm:text-sm text-center bg-[#2B3F6C] text-white cursor-pointer h-10`}
                              >
                                + Add more people
                              </button>
                              <div className="flex flex-row gap-2 items-center col-span-3">
                                <button
                                  onClick={() => handleNotesButtonClick(eventIndex)}
                                  className={`py-2 px-4 rounded-lg font-medium text-center bg-[#FFC700] text-[#2B3F6C] cursor-pointer h-10 w-[50%]`}
                                >
                                  {getNotesButtonText(eventIndex)}
                                </button>
                                {!getNotesState(eventIndex).isEditing && !getNotesState(eventIndex).isSaved && (
                                <p className="text-xs text-gray-500 h-10 flex items-center px-2 bg-gray-50 rounded-lg w-full">
                                  Mention anything that you think artist should <br/> know before they send you a quote
                                </p>
                                )}
                              </div>
                            </div>
                          </div>
                        )
                    )}
                  <div className="col-span-4 flex flex-col items-center justify-center">
                    <button
                      className="bg-[#840032] text-white rounded-lg px-16 py-2 text-lg font-medium"
                      onClick={() => {
                        if (events.length > 0 && CheckIfAllEventData()) {
                          setDisplay("Complete");
                        } else {
                          alert("Enter complete information of events");
                        }
                      }}
                    >
                      Next
                    </button>
                  </div>
                </div>
              </>
            )}
            {display === "Complete" && (
              <>
                <div className="py-8 px-6 md:p-24 bg-[#FAFBFF] flex flex-col md:items-center gap-8 min-h-[80vh]">
                  <p className="font-semibold text-xl text-center">
                    Send requirements to makeup artist belonging to...
                  </p>
                  <div className="grid grid-cols-1 md:grid-cols-4 gap-4 min-w-fit md:w-1/2">
                    <div className="md:col-span-2">
                      <Label value="City" />
                      <Select
                        value={requirements?.city}
                        onChange={(e) => {
                          setRequirements({
                            ...requirements,
                            city: e.target.value,
                          });
                        }}
                      >
                        <option value="">Select City</option>
                        <option value="Bengaluru">Bengaluru</option>
                      </Select>
                    </div>
                    <div className="md:col-span-2">
                      <Label value="Gender" />
                      <Select
                        value={requirements?.gender}
                        onChange={(e) => {
                          setRequirements({
                            ...requirements,
                            gender: e.target.value,
                          });
                        }}
                      >
                        <option value={""}>Select Gender</option>
                        <option value={"Male"}>Male</option>
                        <option value={"Female"}>Female</option>
                        <option value={"Both"}>Both</option>
                      </Select>
                    </div>

                    
                    <div className="hidden md:block" />
                    <div className="md:col-span-2">
                      <Label value="Category" />
                      <Select
                        value={requirements?.category || "Makeup & Hairstyling"}
                        onChange={(e) => {
                          setRequirements({
                            ...requirements,
                            category: e.target.value,
                          });
                        }}
                      >
                        <option value="Makeup & Hairstyling">Makeup & Hairstyling</option>
                      </Select>
                    </div>
                    <div className="hidden md:block" />

                    {/*studio makeup question */}
                      <div className="md:col-span-4 flex flex-col gap-4 mt-4 justify-center items-center" style={{fontFamily: "'Montserrat', sans-serif"}}>
                          <p className="text-sm md:text-base font-semibold text-gray-700">
                              Are you open to getting your makeup done at the studio?
                              <span className="text-xs text-gray-500 inline">(Studio location varies for each artist)</span>
                          </p>
                          <div className="flex flex-col md:flex-row gap-4">
                              <label className="flex items-center gap-2 cursor-pointer">
                                  <input
                                      type="radio"
                                      name="studio-option"
                                      value="Yes"
                                      checked={requirements.studioMakeup === "Yes"}
                                      onChange={() => setRequirements({ ...requirements, studioMakeup: "Yes" })}
                                      className="form-radio h-4 w-4 text-green-600"
                                  />
                                  <span className="text-gray-600 text-sm md:text-base">Yes <span className="text-xs text-gray-500">(This could get you a better price)</span></span>
                              </label>
                              <label className="flex items-center gap-2 cursor-pointer">
                                  <input
                                      type="radio"
                                      name="studio-option"
                                      value="No"
                                      checked={requirements.studioMakeup === "No"}
                                      onChange={() => setRequirements({ ...requirements, studioMakeup: "No" })}
                                      className="form-radio h-4 w-4 text-red-600"
                                  />
                                  <span className="text-gray-600 text-sm md:text-base">No <span className="text-xs text-gray-500">(Artists usually charge for travel)</span></span>
                              </label>
                          </div>
                      </div>
                    {/* End*/}

                  </div>
                  <button
                    className="bg-[#840032] text-white rounded-lg px-16 py-2 text-lg font-medium"
                    onClick={() => {
                      handleSubmit();
                    }}
                  >
                    Submit
                  </button>
                </div>
              </>
            )}
          </div>
        </>
      )}
      {display === "Success" && (
        <>
          <div className="md:hidden relative">
            <img
              src="/assets/images/bidding-mobile-success.png"
              className="w-full h-full"
            />
            <div className="absolute bottom-12 left-1/2 -translate-x-1/2 w-full px-12 flex flex-row">
              <button
                className="bg-[#840032] text-white rounded-lg w-full grow text-center px-auto py-2 font-medium"
                onClick={() => {
                  router.push("/makeup-and-beauty");
                }}
              >
                Home
              </button>
            </div>
          </div>
          <div className="hidden md:block relative">
            <img
              src="/assets/images/bidding-desktop-success.png"
              className="w-full h-full"
            />
            <button
              className="bg-[#840032] text-white rounded-lg absolute bottom-8 lg:bottom-12 left-1/2 -translate-x-1/2 px-16 py-2 lg:text-lg font-medium"
              onClick={() => {
                router.push("/makeup-and-beauty");
              }}
            >
              Home
            </button>
          </div>
        </>
      )}
    </>
  );
}

export default MakeupAndBeauty;
