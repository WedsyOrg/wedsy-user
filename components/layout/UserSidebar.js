import { Sidebar } from "flowbite-react";
import { useEffect, useState } from "react";

export default function UserSidebar({ display }) {
  const [events, setEvents] = useState([]);
  const fetchEvents = () => {
    fetch(`${process.env.NEXT_PUBLIC_API_URL}/event`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        authorization: `Bearer ${localStorage.getItem("token")}`,
      },
    })
      .then((response) => response.json())
      .then((response) => {
        setEvents(response);
      })
      .catch((error) => {
        console.error("There was a problem with the fetch operation:", error);
      });
  };
  useEffect(() => {
    fetchEvents();
  }, []);
  return (
    <Sidebar className="h-auto bg-rose-900" id="sidebar">
      <Sidebar.Items className="text-center">
        <Sidebar.ItemGroup>
          <Sidebar.Item
            href="/my-account"
            className={`text-white border-b border-white hover:bg-rose-900 rounded-none ${
              display === "my-account" && "font-semibold text-lg"
            }`}
          >
            MY ACCOUNT
          </Sidebar.Item>
          <Sidebar.Item
            href="/my-orders"
            className={`text-white border-b border-white hover:bg-rose-900 rounded-none ${
              display === "my-orders" && "font-semibold text-lg"
            }`}
          >
            ORDERS
          </Sidebar.Item>
          <Sidebar.Item
            href="/payments"
            className={`text-white border-b border-white hover:bg-rose-900 rounded-none ${
              display === "my-payments" && "font-semibold text-lg"
            }`}
          >
            PAYMENTS
          </Sidebar.Item>
          <Sidebar.Item
            href={
              (events.length > 0 && events[0].eventDays?.length) > 0
                ? `/event/${events[0]?._id}/planner`
                : "/event"
            }
            className={`text-white border-b border-white hover:bg-rose-900 rounded-none ${
              display === "events" && "font-semibold text-lg"
            }`}
          >
            EVENTS
          </Sidebar.Item>
        </Sidebar.ItemGroup>
      </Sidebar.Items>
    </Sidebar>
  );
}
