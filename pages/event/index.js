import React, { useEffect, useState, useCallback, useMemo } from "react";
import Image from "next/image";
import { BsArrowRight } from "react-icons/bs";
import Link from "next/link";
import { useRouter } from "next/router";
import EventHowItWorks from "@/components/screens/EventHowItWorks";
import MobileStickyFooter from "@/components/layout/MobileStickyFooter";
import { EventPageSkeleton } from "@/components/skeletons/event";

// Step 1
const EventFormStep1 = React.memo(({ data, errors, onChange, onSubmit }) => (
  <div className="flex flex-col gap-6">
    <div className="text-center text-[20px] md:text-2xl  font-medium text-black">
      TELL US ABOUT YOUR EVENT
    </div>
    <div className="flex flex-col gap-6">
      <div>
        <div className="text-center text-[10px] md:text-sm italic mb-4" style={{ color: "#2B3F6C" }}>
          Give your event a name! It could be 'Rahul&apos;s Wedding' or 'Rahul x Anjali'
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
        {errors.name && <p className="text-red-500 text-sm mt-2 text-center">{errors.name}</p>}
      </div>
      <div>
        <div className="text-center text-[10px] md:text-sm italic mb-4" style={{ color: "#2B3F6C" }}>
          This is not mandatory but helps in understanding your rituals and event flow.
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
          <p className="text-red-500 text-sm mt-2 text-center">{errors.community}</p>
        )}
      </div>
    </div>
    <button
      className="bg-[#000000]  rounded-2xl p-4 px-12 
                 text-white w-max mx-auto transition-colors duration-200 text-lg font-medium hover:cursor-pointer"
      disabled={!data.name || !data.community}
      onClick={onSubmit}
    >
      NEXT
    </button>
  </div>
));

// Step 2
const EventFormStep2 = React.memo(({ data, errors, onChange, onSubmit, eventName }) => (
  <div className="flex flex-col gap-6">
    <div className="text-center text-2xl font-medium">{eventName.toUpperCase()}</div>
    <div className="text-center text-sm text-gray-600 mb-4">(Muhurattam, Haldi, Reception etc)</div>
    <div className="flex flex-col gap-4">
      <div className="grid grid-cols-2 gap-4">
        <div>
          <input
            type="text"
            className="w-full rounded-full p-3 text-center border-0 bg-white 
                       focus:outline-none focus:ring-2 focus:ring-pink-300"
            placeholder="Event day"
            name="eventDay"
            value={data.eventDay}
            onChange={onChange}
          />
          {errors.eventDay && <p className="text-red-500 text-sm mt-1 text-center">{errors.eventDay}</p>}
        </div>
        <div>
          <input
            type="text"
            className="w-full rounded-full p-3 text-center border-0 bg-white 
                       focus:outline-none focus:ring-2 focus:ring-pink-300"
            placeholder="Venue Location"
            name="venue"
            value={data.venue}
            onChange={onChange}
          />
          {errors.venue && <p className="text-red-500 text-sm mt-1 text-center">{errors.venue}</p>}
        </div>
      </div>
      <div className="grid grid-cols-2 gap-4">
        <div>
          <input
            type="date"
            className="w-full rounded-full p-3 text-center border-0 bg-white 
                       focus:outline-none focus:ring-2 focus:ring-pink-300"
            name="date"
            value={data.date}
            onChange={onChange}
          />
          {errors.date && <p className="text-red-500 text-sm mt-1 text-center">{errors.date}</p>}
        </div>
        <div>
          <input
            type="time"
            className="w-full rounded-full p-3 text-center border-0 bg-white 
                       focus:outline-none focus:ring-2 focus:ring-pink-300"
            name="time"
            value={data.time}
            onChange={onChange}
          />
          {errors.time && <p className="text-red-500 text-sm mt-1 text-center">{errors.time}</p>}
        </div>
      </div>
    </div>
    <div className="text-center text-[10px] md:text-sm italic mb-4" style={{ color: "#2B3F6C" }}>
      *For multiple event days, You can add them in the next page!
    </div>
    <button
      className="bg-black  rounded-full p-3 px-12 text-white w-max mx-auto transition-colors duration-200"
      disabled={!data.eventDay || !data.venue || !data.date || !data.time}
      onClick={onSubmit}
    >
      NEXT
    </button>
  </div>
));

// Step 3
const EventFormStep3 = React.memo(({ data, eventName, onAddMoreDays, onViewEvent }) => (
  <div className="flex flex-col gap-6">
    <div className="text-center text-2xl font-medium">{eventName.toUpperCase()}</div>
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
));

// Clipboard (no overlay text)
const ClipboardVisual = React.memo(() => (
  <div className="relative flex justify-center items-center h-full">
    <Image
      src="/assets/event_tools/event/clipboard2.png"
      alt="Clipboard"
      width={450}
      height={600}
      className="z-10 relative object-contain"
    />
  </div>
));

export default function EventTool({ userLoggedIn, setOpenLoginModal }) {
  const router = useRouter();
  const [events, setEvents] = useState([]);
  const [formStep, setFormStep] = useState(1);
  const [data, setData] = useState({
    name: "",
    community: "",
    eventDay: "",
    time: "",
    date: "",
    venue: "",
  });
  const [validationErrors, setValidationErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  const validateField = useCallback((name, value) => {
    const errors = { ...validationErrors };
    if (!value.trim()) {
      errors[name] = `${name.charAt(0).toUpperCase() + name.slice(1)} is required`;
    } else {
      delete errors[name];
    }
    setValidationErrors(errors);
  }, [validationErrors]);

  const handleDataChange = useCallback((e) => {
    const { name, value } = e.target;
    setData((prev) => ({ ...prev, [name]: value }));
    validateField(name, value);
  }, [validateField]);

  const fetchEvents = useCallback(async () => {
    try {
      setIsLoading(true);
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
    } finally {
      setIsLoading(false);
    }
  }, []);

  const handleCreateEvent = useCallback(async () => {
    if (!userLoggedIn) {
      setOpenLoginModal(true);
      return;
    }

    setIsSubmitting(true);
    try {
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/event`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          authorization: `Bearer ${localStorage.getItem("token")}`,
        },
        body: JSON.stringify(data),
      });
      const result = await response.json();
      router.push(`/event/${result._id}`);
    } catch (error) {
      console.error("Error creating event:", error);
    } finally {
      setIsSubmitting(false);
    }
  }, [userLoggedIn, data, router, setOpenLoginModal]);

  const handleNextStep = useCallback(() => {
    if (formStep === 1) {
      if (!data.name || !data.community) return;
      setFormStep(2);
    } else if (formStep === 2) {
      if (!data.eventDay || !data.venue || !data.date || !data.time) return;
      setFormStep(3);
    }
  }, [formStep, data]);

  const handleAddMoreDays = useCallback(() => {
    setData((prev) => ({
      ...prev,
      eventDay: "",
      venue: "",
      date: "",
      time: "",
    }));
    setFormStep(2);
  }, []);

  const handleViewEvent = useCallback(() => {
    handleCreateEvent();
  }, [handleCreateEvent]);

  const isFormValid = useMemo(() => {
    if (formStep === 1) return data.name && data.community;
    if (formStep === 2) return data.eventDay && data.venue && data.date && data.time;
    return true;
  }, [formStep, data]);

  useEffect(() => {
    if (userLoggedIn) {
      fetchEvents();
    } else {
      // If user is not logged in, still show the form but hide loading
      setIsLoading(false);
    }
  }, [userLoggedIn, fetchEvents]);

  if (isLoading) {
    return (
      <>
        <EventPageSkeleton formStep={formStep} />
        <MobileStickyFooter />
      </>
    );
  }

  return (
    <>
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
              Explore the ease of planning with our event tool at Wedsy. <br/>
              Utilize the tool to shortlist and choose your decorations effortlessly -  <br/> all in one
              place, at Wedsy.
            </div>
          </div>
        </div>

        {/* Main Content Grid */}
        <div className="px-24 pb-16">
          <div className="grid grid-cols-5 gap-8 items-start">
            {/* Form Section - Takes 2 columns */}
            <div className="col-span-3 mt-10">
              <div className="bg-[#F4DBD5] rounded-2xl p-8 h-fit">
                {formStep === 1 && (
                  <EventFormStep1
                    data={data}
                    errors={validationErrors}
                    onChange={handleDataChange}
                    onSubmit={handleNextStep}
                  />
                )}
                {formStep === 2 && (
                  <EventFormStep2
                    data={data}
                    errors={validationErrors}
                    onChange={handleDataChange}
                    onSubmit={handleNextStep}
                    eventName={data.name}
                  />
                )}
                {formStep === 3 && (
                  <EventFormStep3
                    data={data}
                    eventName={data.name}
                    onAddMoreDays={handleAddMoreDays}
                    onViewEvent={handleViewEvent}
                  />
                )}
              </div>
            </div>

            {/* Visual Section - Takes 3 columns for more height */}
            <div className="col-span-2 flex justify-center ">
              <div className="h-[650px] flex items-center justify-center -mt-40">
                <ClipboardVisual />
              </div>
            </div>
          </div>
        </div>

        {/* Existing Events List */}
        {events.length > 0 && (
          <div className="px-24 pb-12">
            <div className="bg-white rounded-3xl p-8 shadow-md">
              <div className="text-3xl font-medium border-b-2 border-b-black h-max pb-4 
                              flex flex-row items-end gap-4 max-w-max mb-6">
                <span>
                  Start making <br />
                  your event now
                </span>
                <BsArrowRight size={24} />
              </div>
              <div className="flex flex-col gap-2">
                {events.map((item, index) => (
                  <div className="flex flex-row justify-between" key={index}>
                    <Link
                      href={`/event/${item._id}`}
                      className="text-lg hover:text-pink-600 transition-colors"
                    >
                      {index + 1}. {item.name}
                    </Link>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Mobile View */}
      <div className="md:hidden bg-[#F4F4F4] min-h-screen ">
        {/* Header */}
        <div className="bg-[#F4F4F4]">
          <div className="px-6 py-4">
            <div
              className="text-black text-[20px] Explore the ease of planning with our 
event tool at Wedsy.
Utilize the tool to shortlist and choose your decorations effortlessly - all in one place, at Wedsy.px] font-medium tracking-[0.1em] text-center"
              style={{ fontFamily: "Montserrat" }}
            >
              MY EVENT
            </div>
          </div>
          <div className="w-full h-[3px] bg-white"></div>
          <div className="px-6 py-4">
            <div className="text-[14px]" style={{ color: "#5F3D30", fontFamily: "Montserrat" ,fontWeight: "500"}}>
            Explore the ease of planning with our 
event tool at Wedsy. <br/>
Utilize the tool to shortlist and choose your decorations effortlessly - all in one place, at Wedsy.
            </div>
          </div>
        </div>

        {/* Main Content */}
        <div className="px-6 py-6">
          <div className="bg-[#F4DBD5] rounded-3xl p-6 mb-6">
            {formStep === 1 && (
              <EventFormStep1
                data={data}
                errors={validationErrors}
                onChange={handleDataChange}
                onSubmit={handleNextStep}
              />
            )}
            {formStep === 2 && (
              <EventFormStep2
                data={data}
                errors={validationErrors}
                onChange={handleDataChange}
                onSubmit={handleNextStep}
                eventName={data.name}
              />
            )}
            {formStep === 3 && (
              <EventFormStep3
                data={data}
                eventName={data.name}
                onAddMoreDays={handleAddMoreDays}
                onViewEvent={handleViewEvent}
              />
            )}
          </div>

          {/* Clipboard */}
          <div className="flex justify-center rounded-3xl mb-6">
            <ClipboardVisual />
          </div>

          {/* Existing Events List */}
          {events.length > 0 && (
            <div className="bg-white rounded-3xl p-6  md:mb-6">
              <div className="text-xl font-medium border-b-2 border-b-black h-max pb-4 
                              flex flex-row items-end gap-4 max-w-max mb-4">
                <span>
                  Start making <br />
                  your event now
                </span>
                <BsArrowRight size={20} />
              </div>
              <div className="flex flex-col gap-2">
                {events.map((item, index) => (
                  <Link
                    href={`/event/${item._id}`}
                    className="text-sm hover:text-pink-600 transition-colors"
                    key={index}
                  >
                    {index + 1}. {item.name}
                  </Link>
                ))}
              </div>
            </div>
          )}
        </div>

        <MobileStickyFooter />
      </div>
<div className="mb-20">
<EventHowItWorks />
</div>
     
    </>
  );
}