import { useEffect, useRef, useState } from "react";
import { MdDelete, MdShare } from "react-icons/md";
import { Modal, Button, TextInput, Label } from "flowbite-react";
import { AiOutlineLink } from "react-icons/ai";
import { processMobileNumber } from "@/utils/phoneNumber";
import { BsClipboardCheck } from "react-icons/bs";

export default function EventToolAccessModal({
  eventName,
  eventId,
  accessList,
  fetchEvent,
}) {
  const modalRef = useRef(null);
  const [loading, setLoading] = useState(false);
  const [modalVisible, setModalVisible] = useState(false);
  const [phoneNumber, setPhoneNumber] = useState("");
  const [copied, setCopied] = useState(false);
  const handleAddPhoneNumber = async () => {
    setLoading(true);
    if (phoneNumber && !accessList.includes(phoneNumber)) {
      if (await processMobileNumber(phoneNumber)) {
        fetch(
          `${process.env.NEXT_PUBLIC_API_URL}/event/${eventId}/event-access`,
          {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
              authorization: `Bearer ${localStorage.getItem("token")}`,
            },
            body: JSON.stringify({
              phone: await processMobileNumber(phoneNumber),
            }),
          }
        )
          .then((response) => response.json())
          .then((response) => {
            if (response.message === "success") {
              setLoading(false);
              setPhoneNumber("");
              fetchEvent();
            }
          })
          .catch((error) => {
            console.error(
              "There was a problem with the fetch operation:",
              error
            );
          });
      } else {
        alert("Enter a valid phone number.");
        setLoading(false);
      }
    } else {
      setLoading(false);
    }
  };
  const handleDeletePhoneNumber = (number) => {
    setLoading(true);
    fetch(`${process.env.NEXT_PUBLIC_API_URL}/event/${eventId}/event-access`, {
      method: "DELETE",
      headers: {
        "Content-Type": "application/json",
        authorization: `Bearer ${localStorage.getItem("token")}`,
      },
      body: JSON.stringify({
        phone: number,
      }),
    })
      .then((response) => response.json())
      .then((response) => {
        if (response.message === "success") {
          setLoading(false);
          fetchEvent();
        }
      })
      .catch((error) => {
        console.error("There was a problem with the fetch operation:", error);
      });
  };
  const handleClickOutside = (event) => {
    if (modalRef.current && !modalRef.current.contains(event.target)) {
      setModalVisible(false);
    }
  };
  useEffect(() => {
    if (modalVisible) {
      document.addEventListener("mousedown", handleClickOutside);
    } else {
      document.removeEventListener("mousedown", handleClickOutside);
    }

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [modalVisible]);
  return (
    <>
      <MdShare
        className="ml-1"
        cursor={"pointer"}
        onClick={() => setModalVisible(true)}
      />
      <Modal
        show={modalVisible}
        // onClose={() => setModalVisible(false)}
        size={"md"}
      >
        <div ref={modalRef}>
          <Modal.Body className="p-0 overflow-hidden rounded-t-lg">
            <div className="flex flex-row items-center justify-between text-white bg-gray-500 py-2 px-4">
              <span className="font-semibold">Share this event</span>
              <div
                className="text-sm text-blue-400 flex flex-row gap-1 items-center cursor-pointer"
                onClick={async () => {
                  try {
                    await navigator.clipboard.writeText(
                      `https://wedsy.in/event/${eventId}/view`
                    );
                    setCopied(true);
                    setTimeout(() => setCopied(false), 5000); // Reset copied state after 2 seconds
                  } catch (err) {
                    console.error("Failed to copy: ", err);
                  }
                }}
              >
                {copied ? (
                  <>
                    <BsClipboardCheck /> Link Copied!
                  </>
                ) : (
                  <>
                    <AiOutlineLink />
                    Copy link
                  </>
                )}
              </div>
            </div>
            <div className="space-y-4 px-4 mb-3">
              <Label
                value={
                  "Add phone no to allow users to edit your event. Copy link for “view-only” access."
                }
              />
              <div className="flex items-center space-x-2">
                <TextInput
                  placeholder="Enter phone no."
                  value={phoneNumber}
                  onChange={(e) => setPhoneNumber(e.target.value)}
                  className="flex-grow"
                  disabled={loading}
                />
                <Button
                  onClick={handleAddPhoneNumber}
                  className="bg-blue-700 hover:bg-blue-700 enabled:hover:bg-blue-700 px-4"
                  disabled={!phoneNumber}
                >
                  Add
                </Button>
              </div>
            </div>
            <div className="space-y-4 ">
              <ul className="space-y-2 divide-y-2 divide-gray-400 border-t-2 border-t-gray-400 ">
                {accessList.map((number, index) => (
                  <li
                    key={index}
                    className="flex justify-between items-center py-2 px-4"
                  >
                    {number}
                    <MdDelete
                      size={24}
                      onClick={() => handleDeletePhoneNumber(number)}
                      className="cursor-pointer"
                    />
                  </li>
                ))}
              </ul>
            </div>
          </Modal.Body>
        </div>
      </Modal>
    </>
  );
}
