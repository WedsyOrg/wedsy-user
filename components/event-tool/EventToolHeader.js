import Link from "next/link";
import { BsArrowLeft } from "react-icons/bs";
import EventToolShareButton from "./EventToolShareButton";
import { BiEditAlt } from "react-icons/bi";
import { AiOutlinePlusSquare } from "react-icons/ai";
import EventToolAccessModal from "./EventToolAccessModal";

export default function EventToolHeader({
  fetchEvent,
  event,
  setEventDay,
  eventDay,
  setAddEventDayModalOpen,
  event_id,
  allowEdit,
}) {
  return (
    <>
      <div className="md:bg-[#DBB9BD] md:px-8 flex-wrap flex flex-col md:flex-row gap-0 md:gap-4 items-center justify-evenly font-medium text-center text-lg text-gray-500 border-b border-gray-200 dark:border-gray-700 dark:text-gray-400">
        <div className="text-black font-medium px-8 md:px-0 py-4 md:py-0 md:pr-8 text-left flex flex-row justify-between items-center w-full md:w-auto">
          {allowEdit && (
            <Link href={`/event/${event_id}`} className="md:hidden">
              <BsArrowLeft size={24} />
            </Link>
          )}
          <span className="mx-auto md:mr-0">{event.name}</span>
          {allowEdit && (
            <Link
              href={`/event/${event_id}`}
              className="hidden md:block ml-1 mr-1"
            >
              <BiEditAlt size={20} />
            </Link>
          )}
          {allowEdit ? (
            <EventToolAccessModal
              eventName={event?.name}
              eventId={event?._id}
              accessList={event.eventAccess || []}
              fetchEvent={fetchEvent}
            />
          ) : (
            <EventToolShareButton
              eventName={event?.name}
              eventId={event?._id}
            />
          )}
        </div>
        <div className="hidden md:flex md:flex-row gap-6 mx-auto">
          {event?.eventDays?.map((item, index) => (
            <div
              key={item._id}
              className={`hidden md:block px-8 mx-1 py-2 my-2 cursor-pointer ${
                eventDay === item._id
                  ? " font-semibold bg-white rounded-2xl text-rose-900"
                  : "font-normal text-black"
              }`}
              onClick={() => {
                setEventDay(item._id);
              }}
            >
              {item.name}
            </div>
          ))}
        </div>
        <div className="overflow-hidden md:hidden w-full">
          <div className="flex md:hidden flex-row gap-3 w-full overflow-x-auto mb-3 items-center">
            {event?.eventDays?.map((item, index) => (
              <div
                key={item._id}
                className={`md:hidden px-6 mx-1 py-2 cursor-pointer text-xs shadow-md rounded-full font-semibold ${
                  eventDay === item._id
                    ? "bg-rose-900 text-white"
                    : "text-black bg-gray-300"
                }`}
                onClick={() => {
                  setEventDay(item._id);
                }}
              >
                {item.name}
              </div>
            ))}
            {allowEdit && !event?.status?.approved && (
              <AiOutlinePlusSquare
                size={24}
                onClick={() => setAddEventDayModalOpen(true)}
                cursor={"pointer"}
                className="ml-auto mr-6"
              />
            )}
          </div>
        </div>
        {allowEdit && !event?.status?.approved && (
          <AiOutlinePlusSquare
            size={24}
            onClick={() => setAddEventDayModalOpen(true)}
            cursor={"pointer"}
            className="hidden md:block"
          />
        )}
      </div>
    </>
  );
}
