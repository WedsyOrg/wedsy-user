import { Button, Label, Modal, TextInput } from "flowbite-react";
import { useState } from "react";

export default function AddEventDayModal({
  fetchEvent,
  show,
  onClose,
  loading,
  setLoading,
  event_id,
}) {
  const [data, setData] = useState({
    name: "",
    time: "",
    date: "",
    venue: "",
  });
  const addEventDay = () => {
    setLoading(true);
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
        setLoading(false);
        setData({ name: "", time: "", date: "", venue: "" });
        onClose();
        fetchEvent();
      })
      .catch((error) => {
        console.error("There was a problem with the fetch operation:", error);
      });
  };
  return (
    <>
      <Modal
        show={show}
        size="lg"
        popup
        onClose={() => {
          setData({
            name: "",
            time: "",
            date: "",
            venue: "",
          });
          onClose();
        }}
      >
        <Modal.Header>
          <h3 className="text-xl font-medium text-gray-900 dark:text-white px-4">
            Add Event Day
          </h3>
        </Modal.Header>
        <Modal.Body>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <Label value="Event Day" />
              <TextInput
                placeholder="Event Name"
                value={data.name}
                disabled={loading}
                onChange={(e) => {
                  setData({
                    ...data,
                    name: e.target.value,
                  });
                }}
              />
            </div>
            <div>
              <Label value="Date" />
              <TextInput
                placeholder="Date"
                type="date"
                value={data.date}
                disabled={loading}
                onChange={(e) => {
                  setData({
                    ...data,
                    date: e.target.value,
                  });
                }}
              />
            </div>
            <div>
              <Label value="Time" />
              <TextInput
                placeholder="Time"
                type="time"
                value={data.time}
                disabled={loading}
                onChange={(e) => {
                  setData({
                    ...data,
                    time: e.target.value,
                  });
                }}
              />
            </div>
            <div>
              <Label value="Venue" />
              <TextInput
                placeholder="Event Venue"
                value={data.venue}
                disabled={loading}
                onChange={(e) => {
                  setData({
                    ...data,
                    venue: e.target.value,
                  });
                }}
              />
            </div>
            <div className="md:col-span-2">
              <Button
                color="dark"
                onClick={() => {
                  addEventDay();
                }}
                disabled={loading}
                className="mx-auto"
              >
                Add Event Day
              </Button>
            </div>
          </div>
        </Modal.Body>
      </Modal>
    </>
  );
}
