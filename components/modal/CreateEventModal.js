import { Modal, TextInput } from "flowbite-react";
import { useState } from "react";

export default function CreateEventModal({
  showEventModal,
  setShowEventModal,
  userLoggedIn,
  setOpenLoginModal,
  fetchEvents,
}) {
  const [eventData, setEventData] = useState({
    name: "",
    community: "",
    eventDay: "",
    time: "",
    date: "",
    venue: "",
  });
  const createEvent = () => {
    if (!userLoggedIn) {
      setOpenLoginModal(true);
    } else {
      fetch(`${process.env.NEXT_PUBLIC_API_URL}/event`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          authorization: `Bearer ${localStorage.getItem("token")}`,
        },
        body: JSON.stringify(eventData),
      })
        .then((response) => response.json())
        .then((response) => {
          if (response._id) {
            setShowEventModal(false);
            setEventData({
              name: "",
              community: "",
              eventDay: "",
              time: "",
              date: "",
              venue: "",
            });
            fetchEvents();
            alert("Event Created Successfully!");
          }
        })
        .catch((error) => {
          console.error("There was a problem with the fetch operation:", error);
        });
    }
  };
  return (
    <Modal
      show={showEventModal}
      size="lg"
      popup
      onClose={() => {
        setShowEventModal(false);
        setEventData({
          name: "",
          community: "",
          eventDay: "",
          time: "",
          date: "",
          venue: "",
        });
      }}
    >
      <Modal.Header>
        <h3 className="text-xl font-medium text-gray-900 dark:text-white px-4">
          Create New Event
        </h3>
      </Modal.Header>
      <Modal.Body>
        <div className="flex flex-col gap-3">
          <TextInput
            type="text"
            placeholder="EVENT NAME"
            value={eventData.name}
            onChange={(e) =>
              setEventData({ ...eventData, name: e.target.value })
            }
          />
          <TextInput
            type="text"
            name="eventDay"
            placeholder="EVENT DAY (eg: Reception)"
            value={eventData.eventDay}
            onChange={(e) =>
              setEventData({ ...eventData, eventDay: e.target.value })
            }
          />
          <TextInput
            type="text"
            name="community"
            placeholder="COMMUNITY"
            value={eventData.community}
            onChange={(e) =>
              setEventData({ ...eventData, community: e.target.value })
            }
          />
          <TextInput
            type="date"
            name="date"
            placeholder="DATE"
            value={eventData.date}
            onChange={(e) => {
              if (new Date(e.target.value) > new Date()) {
                setEventData({ ...eventData, date: e.target.value });
              } else {
                alert("Please enter a future date.");
              }
            }}
          />
          <TextInput
            type="time"
            name="time"
            placeholder="START TIME"
            value={eventData.time}
            onChange={(e) =>
              setEventData({ ...eventData, time: e.target.value })
            }
          />
          <TextInput
            type="text"
            name="venue"
            placeholder="VENUE"
            value={eventData.venue}
            onChange={(e) =>
              setEventData({ ...eventData, venue: e.target.value })
            }
          />
          <button
            className={`text-white bg-rose-900 border border-rose-900 hover:bg-rose-900 hover:text-white disabled:bg-rose-800 font-medium rounded-lg text-sm px-3 py-1.5 focus:outline-none`}
            disabled={
              !eventData.name ||
              !eventData.community ||
              !eventData.eventDay ||
              !eventData.time ||
              !eventData.date ||
              !eventData.venue
            }
            onClick={() => {
              createEvent();
            }}
          >
            Create Event
          </button>
        </div>
      </Modal.Body>
    </Modal>
  );
}
