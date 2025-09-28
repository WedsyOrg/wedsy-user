import FAQAccordion from "@/components/accordion/FAQAccordion";
import ChatSideBar from "@/components/chat/ChatSideBar";
import { toPriceString } from "@/utils/text";
import { Modal } from "flowbite-react";
import Link from "next/link";
import { useRouter } from "next/router";
import { useEffect, useRef, useState } from "react";
import {
  FaArrowLeft,
  FaArrowRight,
  FaChevronLeft,
  FaChevronRight,
  FaMapMarkerAlt,
  FaSearch,
  FaStar,
} from "react-icons/fa";
import {
  MdChevronRight,
  MdClear,
  MdOutlineKeyboardBackspace,
} from "react-icons/md";

function Chat({}) {
  const router = useRouter();
  const divRef = useRef(null);
  const [divSize, setDivSize] = useState({ width: 0, height: 0 });
  const [taxationData, setTaxationData] = useState({});

  const fetchTaxationData = () => {
    fetch(`${process.env.NEXT_PUBLIC_API_URL}/config?code=MUA-Taxation`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        authorization: `Bearer ${localStorage.getItem("token")}`,
      },
    })
      .then((response) => response.json())
      .then((response) => {
        setTaxationData(response.data);
      })
      .catch((error) => {
        console.error("There was a problem with the fetch operation:", error);
      });
  };

  useEffect(() => {
    if (!document.body.classList.contains("relative")) {
      document.body.classList.add("relative");
    }
    fetchTaxationData();
  }, []);

  useEffect(() => {
    const handleResize = () => {
      if (divRef.current) {
        const { width, height } = divRef.current.getBoundingClientRect();
        const { top } = divRef.current.getBoundingClientRect();
        const totalHeight = window.innerHeight;
        setDivSize({ width, height: totalHeight - top });
      }
    };

    // Call handleResize initially to set the initial size
    handleResize();

    // Attach the event listener for window resize
    window.addEventListener("resize", handleResize);

    // Cleanup the event listener on component unmount
    return () => {
      window.removeEventListener("resize", handleResize);
    };
  }, []);

  return (
    <>
      <div className="fixed grid grid-cols-4 md:hidden bottom-0 p-4 h-16 w-full items-center bg-white z-50">
        <img src="/assets/icons/icon-category.png" className="mx-auto" />
        <img src="/assets/icons/icon-makeup.png" className="mx-auto" />
        <img src="/assets/icons/icon-event.png" className="mx-auto" />
        <img src="/assets/icons/icon-user.png" className="mx-auto" />
      </div>
      <div className="bg-white uppercase px-12 hidden md:flex flex-row gap-6 items-center py-6 text-xl font-semibold border-b-2">
        <MdOutlineKeyboardBackspace className="flex-shrink-0 sr-only" />
        CHATS
      </div>
      <div
        className="grid grid-cols-1 md:grid-cols-3 relative overflow-hidden hide-scrollbar"
        ref={divRef}
        style={{ height: divSize.height ?? "100vh" }}
      >
        <ChatSideBar />
        <div className="bg-white hide-scrollbar overflow-y-auto hidden md:flex flex-col gap-4 col-span-2" />
      </div>
    </>
  );
}

export default Chat;
