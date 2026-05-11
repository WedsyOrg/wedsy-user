import Breadcrumbs from "@/components/Breadcrumbs";
import DecorDisclaimer from "@/components/marquee/DecorDisclaimer";
import CreateEventModal from "@/components/modal/CreateEventModal";
import Toast from "@/components/other/Toast";
import { Button, Checkbox, Dropdown, Label, TextInput } from "flowbite-react";
import Head from "next/head";
import Image from "next/image";
import Link from "next/link";
import { useEffect, useState } from "react";

export default function PlatformPage({
  platformConfig,
  categoryList,
  userLoggedIn,
  setOpenLoginModal,
}) {
  const rate = parseInt(platformConfig?.data?.price || 0);
  const image = platformConfig?.data?.image || "/assets/images/platform.webp";

  const [eventList, setEventList] = useState([]);
  const [showEventModal, setShowEventModal] = useState(false);
  const [showToast, setShowToast] = useState(false);
  const [toastMessage, setToastMessage] = useState("");
  const [dimensions, setDimensions] = useState({ length: "", breadth: "", height: "" });

  const l = parseFloat(dimensions.length) || 0;
  const b = parseFloat(dimensions.breadth) || 0;
  const h = parseFloat(dimensions.height) || 0;
  const price = l > 0 && b > 0 && h > 0 ? Math.round(l * b * rate) : 0;
  const canAdd = userLoggedIn && l > 0 && b > 0 && h > 0;

  const fetchEvents = () => {
    fetch(`${process.env.NEXT_PUBLIC_API_URL}/event`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        authorization: `Bearer ${localStorage.getItem("token")}`,
      },
    })
      .then((res) => (res.ok ? res.json() : null))
      .then((data) => { if (data) setEventList(data); })
      .catch(console.error);
  };

  useEffect(() => {
    if (userLoggedIn) fetchEvents();
  }, [userLoggedIn]);

  const AddToEvent = ({ eventId, eventDayId }) => {
    if (!canAdd) return;
    fetch(
      `${process.env.NEXT_PUBLIC_API_URL}/event/${eventId}/decor/${eventDayId}`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          authorization: `Bearer ${localStorage.getItem("token")}`,
        },
        body: JSON.stringify({
          decor: "platform",
          category: "Furniture",
          variant: "",
          quantity: 1,
          unit: "sq.ft",
          platform: false,
          flooring: "",
          dimensions: { length: l, breadth: b, height: h },
          price,
          platformRate: 0,
          flooringRate: 0,
          decorPrice: price,
          included: [],
        }),
      }
    )
      .then((res) => (res.ok ? res.json() : null))
      .then((data) => {
        if (data?.message === "success") {
          fetchEvents();
          const event = eventList.find((e) => e._id === eventId);
          const day = event?.eventDays?.find((d) => d._id === eventDayId);
          const msg = day?.name
            ? `Added to ${event.name} - ${day.name}`
            : `Added to ${event?.name || "your event"}`;
          setToastMessage(msg);
          setShowToast(true);
        }
      })
      .catch(console.error);
  };

  function AddToEventButton() {
    if (!userLoggedIn) {
      return (
        <Button
          onClick={() => setOpenLoginModal(true)}
          className="bg-black enabled:hover:bg-black md:bg-rose-900 md:enabled:hover:bg-rose-900 text-white text-center w-full shadow-lg"
        >
          ADD TO EVENT
        </Button>
      );
    }

    return (
      <Dropdown
        inline
        arrowIcon={false}
        dismissOnClick={false}
        label={
          <Button
            className="bg-black enabled:hover:bg-black md:bg-rose-900 md:enabled:hover:bg-rose-900 text-white text-center w-full shadow-lg disabled:opacity-50"
            disabled={!canAdd}
          >
            ADD TO EVENT
          </Button>
        }
        className="border border-black rounded-lg bg-black"
      >
        <Dropdown.Item className="text-white bg-black">Event List</Dropdown.Item>
        <div className="max-h-[400px] overflow-y-auto p-1">
          {eventList?.map((item) => (
            <div key={item._id}>
              <Dropdown.Divider className="bg-black h-[1px] my-0" />
              <Dropdown.Item className="bg-white flex flex-row gap-4" as="p">
                <Label className="flex">{item.name}</Label>
              </Dropdown.Item>
              {item.eventDays?.map((rec) => (
                <Dropdown.Item
                  key={rec._id}
                  className="bg-white flex flex-row gap-4"
                  as={Label}
                >
                  <Checkbox
                    checked={rec.decorItems?.some((i) => i.decor === "platform")}
                    className={item.status?.finalized ? "sr-only" : ""}
                    disabled={item.status?.finalized}
                    onChange={(e) => {
                      if (e.target.checked && !item.status?.finalized) {
                        AddToEvent({ eventId: item._id, eventDayId: rec._id });
                      }
                    }}
                  />
                  {rec.name}
                </Dropdown.Item>
              ))}
            </div>
          ))}
        </div>
        <Dropdown.Divider className="bg-black h-[1px] my-0" />
        <Dropdown.Item
          onClick={() => setShowEventModal(true)}
          className="bg-white text-cyan-600"
        >
          + Create New Event
        </Dropdown.Item>
      </Dropdown>
    );
  }

  return (
    <>
      <Head>
        <title>Platform | Wedding Furniture Decor | Wedsy</title>
        <meta
          name="description"
          content="Add a platform to elevate your wedding decor setup for better visibility. Custom dimensions, competitive pricing. Book now with Wedsy."
        />
        <meta name="robots" content="index, follow" />
        <link rel="canonical" href="https://www.wedsy.in/decor/view/platform" />
        <meta property="og:title" content="Platform | Wedding Furniture Decor | Wedsy" />
        <meta
          property="og:description"
          content="Add a platform to elevate your wedding decor setup. Custom dimensions at competitive prices."
        />
        {image && <meta property="og:image" content={image} />}
        <meta property="og:url" content="https://www.wedsy.in/decor/view/platform" />
        <meta property="og:type" content="product" />
        <meta property="og:site_name" content="Wedsy" />
      </Head>

      <CreateEventModal
        showEventModal={showEventModal}
        setShowEventModal={setShowEventModal}
        userLoggedIn={userLoggedIn}
        setOpenLoginModal={setOpenLoginModal}
        fetchEvents={fetchEvents}
      />
      <Toast
        message={toastMessage}
        show={showToast}
        onClose={() => setShowToast(false)}
      />
      <DecorDisclaimer />

      <div className="max-w-screen-xl mx-auto px-4 md:px-8 py-2">
        <Breadcrumbs
          items={[
            { name: "Home", href: "/" },
            { name: "Decor", href: "/decor" },
            { name: "Furniture", href: "/decor/view?category=Furniture" },
            { name: "Platform" },
          ]}
        />
      </div>

      {/* Category filter pills */}
      <div className="w-full bg-white border-b border-gray-200 sticky top-0 z-30">
        <div className="relative">
          <div className="overflow-x-auto scrollbar-hide px-4 py-3">
            <div className="flex flex-row gap-3 flex-nowrap min-w-max">
              {categoryList?.map((item) => (
                <Link
                  href={`/decor/view?category=${encodeURIComponent(item.name)}`}
                  key={item._id}
                  className={`whitespace-nowrap rounded-full font-medium py-2 px-5 text-sm transition-all duration-200 flex-shrink-0 ${
                    item.name === "Furniture"
                      ? "bg-[#840032] text-white shadow-md"
                      : "bg-gray-100 text-gray-700 hover:bg-gray-200 hover:shadow-sm"
                  }`}
                >
                  {item.name}
                </Link>
              ))}
            </div>
          </div>
          <div className="absolute right-0 top-0 bottom-0 w-8 bg-gradient-to-l from-white to-transparent pointer-events-none hidden md:block" />
        </div>
      </div>

      {/* Layout B — single image, 4-column grid */}
      <div className="relative grid grid-cols-1 md:grid-cols-4 gap-8 py-8 decor-bg-image border-b-2 border-b-white">
        {/* Left col: About */}
        <div className="hidden md:flex flex-col gap-6">
          <div className="rounded-r-3xl bg-white shadow-md flex flex-col gap-2 p-8 my-4">
            <p className="text-lg font-medium">About</p>
            <ul className="list-disc pl-8 flex flex-col gap-2 text-sm font-normal">
              <li>Platforms elevate your decor for better visibility and presentation</li>
              <li>Rate: ₹{rate} per sq.ft</li>
              <li>Price is calculated as Length × Breadth × Rate</li>
              <li>Enter your dimensions on the right to get the total cost</li>
            </ul>
          </div>
        </div>

        {/* Center col: Image */}
        <div className="flex flex-col gap-6 md:col-span-2 md:px-8 md:mx-6 md:border-x-4 md:border-x-white">
          <p className="text-2xl font-semibold text-center tracking-wide uppercase">Platform <span className="text-base font-normal text-gray-400">(fp01)</span></p>
          <div className="max-h-[500px] w-full bg-white flex items-center justify-center rounded-xl overflow-hidden mx-8 md:mx-16">
            <Image
              src={image}
              alt="Platform"
              width={0}
              height={0}
              sizes="100vw"
              style={{ width: "100%", height: "100%", maxHeight: "500px", objectFit: "contain" }}
            />
          </div>

          {/* Mobile: dimension inputs */}
          <div className="grid grid-cols-2 items-center md:hidden gap-3 px-8 mt-2">
            <p className="text-sm font-medium">Length (ft)</p>
            <TextInput
              type="number"
              placeholder="0"
              value={dimensions.length}
              min={0}
              onChange={(e) => setDimensions({ ...dimensions, length: e.target.value })}
            />
            <p className="text-sm font-medium">Breadth (ft)</p>
            <TextInput
              type="number"
              placeholder="0"
              value={dimensions.breadth}
              min={0}
              onChange={(e) => setDimensions({ ...dimensions, breadth: e.target.value })}
            />
            <p className="text-sm font-medium">Height (ft)</p>
            <TextInput
              type="number"
              placeholder="0"
              value={dimensions.height}
              min={0}
              onChange={(e) => setDimensions({ ...dimensions, height: e.target.value })}
            />
            <div className="col-span-2 flex flex-col mt-1">
              <AddToEventButton />
            </div>
          </div>

          {/* Mobile: about */}
          <div className="flex md:hidden flex-col gap-2 p-8">
            <p className="text-lg font-medium">About</p>
            <ul className="list-disc pl-8 flex flex-col gap-2 text-sm font-normal">
              <li>Platforms elevate your decor for better visibility</li>
              <li>Rate: ₹{rate} per sq.ft</li>
              <li>Price = Length × Breadth × Rate</li>
            </ul>
          </div>
        </div>

        {/* Mobile: fixed bottom bar */}
        <div className="fixed z-50 bottom-0 w-full grid md:hidden grid-cols-2 gap-4 bg-white p-4 border-t border-gray-200">
          <p className="text-xl font-semibold text-rose-900">
            {price > 0 ? `₹ ${price}` : `₹ ${rate}/sq.ft`}
          </p>
          <p className="text-xl font-semibold text-right text-gray-600">
            {price > 0 ? `Total ₹ ${price}` : "Enter dimensions"}
          </p>
        </div>

        {/* Right col: Price panel */}
        <div className="hidden md:flex flex-col gap-6">
          <div className="rounded-l-3xl bg-white shadow-md flex flex-col gap-4 p-8 my-4">
            <div className="border-b-2 border-gray-500 pb-2">
              <p className="text-xl font-semibold">
                ₹ {rate}{" "}
                <span className="text-sm font-normal">per sq.ft</span>
              </p>
            </div>

            {/* Dimension inputs */}
            <div className="border-b-2 border-gray-500 pb-4 flex flex-col gap-3">
              <p className="text-sm font-medium">Dimensions (ft)</p>
              <div className="grid grid-cols-2 items-center gap-y-3">
                <p className="text-sm">Length</p>
                <TextInput
                  type="number"
                  placeholder="0"
                  value={dimensions.length}
                  min={0}
                  sizing="sm"
                  onChange={(e) => setDimensions({ ...dimensions, length: e.target.value })}
                />
                <p className="text-sm">Breadth</p>
                <TextInput
                  type="number"
                  placeholder="0"
                  value={dimensions.breadth}
                  min={0}
                  sizing="sm"
                  onChange={(e) => setDimensions({ ...dimensions, breadth: e.target.value })}
                />
                <p className="text-sm">Height</p>
                <TextInput
                  type="number"
                  placeholder="0"
                  value={dimensions.height}
                  min={0}
                  sizing="sm"
                  onChange={(e) => setDimensions({ ...dimensions, height: e.target.value })}
                />
              </div>
            </div>

            {price > 0 && (
              <div className="border-b-2 border-gray-500 pb-2 grid grid-cols-2 items-center gap-y-4">
                <p className="text-sm">Total Price</p>
                <p className="text-xl font-semibold">₹ {price}</p>
              </div>
            )}

            <AddToEventButton />
          </div>
        </div>
      </div>
    </>
  );
}

export async function getServerSideProps() {
  try {
    const [platformRes, categoryRes] = await Promise.all([
      fetch(`${process.env.NEXT_PUBLIC_API_URL}/config?code=platform`),
      fetch(`${process.env.NEXT_PUBLIC_API_URL}/category`),
    ]);
    const [platformConfig, categoryList] = await Promise.all([
      platformRes.json(),
      categoryRes.json(),
    ]);
    return {
      props: {
        platformConfig: platformConfig || {},
        categoryList: Array.isArray(categoryList) ? categoryList : [],
      },
    };
  } catch {
    return { props: { platformConfig: {}, categoryList: [] } };
  }
}
