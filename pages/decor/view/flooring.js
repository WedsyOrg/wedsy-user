import Breadcrumbs from "@/components/Breadcrumbs";
import DecorDisclaimer from "@/components/marquee/DecorDisclaimer";
import CreateEventModal from "@/components/modal/CreateEventModal";
import Toast from "@/components/other/Toast";
import { Button, Checkbox, Dropdown, Label, Select, TextInput } from "flowbite-react";
import Head from "next/head";
import Image from "next/image";
import Link from "next/link";
import { useEffect, useState } from "react";

export default function FlooringPage({
  flooringConfig,
  categoryList,
  userLoggedIn,
  setOpenLoginModal,
}) {
  const flooringList = flooringConfig?.data?.flooringList || [];

  const [eventList, setEventList] = useState([]);
  const [showEventModal, setShowEventModal] = useState(false);
  const [showToast, setShowToast] = useState(false);
  const [toastMessage, setToastMessage] = useState("");
  const [selectedFlooring, setSelectedFlooring] = useState(null);
  const [dimensions, setDimensions] = useState({ length: "", breadth: "" });

  const l = parseFloat(dimensions.length) || 0;
  const b = parseFloat(dimensions.breadth) || 0;
  const rate = selectedFlooring ? parseInt(selectedFlooring.price || 0) : 0;
  const price = l > 0 && b > 0 && selectedFlooring ? Math.round(l * b * rate) : 0;
  const canAdd = userLoggedIn && l > 0 && b > 0 && selectedFlooring != null;

  const displayImage =
    selectedFlooring?.image ||
    flooringList[0]?.image ||
    "/assets/images/carpet.webp";

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

  // Default to first flooring option on load
  useEffect(() => {
    if (flooringList.length > 0 && !selectedFlooring) {
      setSelectedFlooring(flooringList[0]);
    }
  }, []);

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
          decor: "flooring",
          category: "Furniture",
          variant: selectedFlooring.title,
          quantity: 1,
          unit: "sq.ft",
          platform: false,
          flooring: "",
          dimensions: { length: l, breadth: b, height: 0 },
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
                    checked={rec.decorItems?.some((i) => i.decor === "flooring")}
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
        <title>Flooring | Wedding Furniture Decor | Wedsy</title>
        <meta
          name="description"
          content="Choose from our premium flooring options for your wedding setup. Carpet, vinyl, printed flex and more. Custom dimensions at competitive prices. Book with Wedsy."
        />
        <meta name="robots" content="index, follow" />
        <link rel="canonical" href="https://www.wedsy.in/decor/view/flooring" />
        <meta property="og:title" content="Flooring | Wedding Furniture Decor | Wedsy" />
        <meta
          property="og:description"
          content="Premium flooring options for wedding setups. Custom dimensions at competitive prices."
        />
        {displayImage && <meta property="og:image" content={displayImage} />}
        <meta property="og:url" content="https://www.wedsy.in/decor/view/flooring" />
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
            { name: "Flooring" },
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
              <li>Choose from multiple premium flooring types</li>
              <li>Pricing calculated as Length × Breadth × Rate</li>
              {flooringList.map((f) => (
                <li key={f.title}>
                  {f.title}: ₹{parseInt(f.price || 0)}/sq.ft
                </li>
              ))}
            </ul>
          </div>
        </div>

        {/* Center col: Image + flooring selector */}
        <div className="flex flex-col gap-6 md:col-span-2 md:px-8 md:mx-6 md:border-x-4 md:border-x-white">
          <p className="text-2xl font-semibold text-center tracking-wide uppercase">Flooring</p>

          <div className="max-h-[500px] w-full bg-white flex items-center justify-center rounded-xl overflow-hidden mx-8 md:mx-16">
            <Image
              src={displayImage}
              alt={selectedFlooring?.title || "Flooring"}
              width={0}
              height={0}
              sizes="100vw"
              style={{ width: "100%", height: "100%", maxHeight: "500px", objectFit: "contain" }}
            />
          </div>

          {/* Flooring type thumbnails */}
          {flooringList.length > 1 && (
            <div className="flex flex-row gap-3 items-center justify-center flex-wrap px-4">
              {flooringList.map((f) => (
                <button
                  key={f.title}
                  onClick={() => setSelectedFlooring(f)}
                  className={`relative h-16 w-16 rounded-lg overflow-hidden border-2 transition-all ${
                    selectedFlooring?.title === f.title
                      ? "border-rose-900 shadow-md"
                      : "border-gray-200 hover:border-gray-400"
                  }`}
                  title={f.title}
                >
                  {f.image ? (
                    <img
                      src={f.image}
                      alt={f.title}
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <div className="w-full h-full bg-gray-100 flex items-center justify-center">
                      <span className="text-xs text-gray-500 text-center px-1">{f.title}</span>
                    </div>
                  )}
                </button>
              ))}
            </div>
          )}

          {/* Mobile: inputs + button */}
          <div className="grid grid-cols-2 items-center md:hidden gap-3 px-8 mt-2">
            <p className="col-span-2 text-sm font-medium">Flooring Type</p>
            <div className="col-span-2">
              <Select
                value={selectedFlooring?.title || ""}
                onChange={(e) => {
                  const found = flooringList.find((f) => f.title === e.target.value);
                  setSelectedFlooring(found || null);
                }}
              >
                {flooringList.map((f) => (
                  <option key={f.title} value={f.title}>
                    {f.title} — ₹{parseInt(f.price || 0)}/sq.ft
                  </option>
                ))}
              </Select>
            </div>
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
            <div className="col-span-2 flex flex-col mt-1">
              <AddToEventButton />
            </div>
          </div>

          {/* Mobile: about */}
          <div className="flex md:hidden flex-col gap-2 p-8">
            <p className="text-lg font-medium">About</p>
            <ul className="list-disc pl-8 flex flex-col gap-2 text-sm font-normal">
              <li>Choose from multiple premium flooring types</li>
              <li>Price = Length × Breadth × Rate per sq.ft</li>
            </ul>
          </div>
        </div>

        {/* Mobile: fixed bottom bar */}
        <div className="fixed z-50 bottom-0 w-full grid md:hidden grid-cols-2 gap-4 bg-white p-4 border-t border-gray-200">
          <p className="text-xl font-semibold text-rose-900">
            {selectedFlooring ? `₹ ${rate}/sq.ft` : "Select type"}
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
                {selectedFlooring ? (
                  <>₹ {rate} <span className="text-sm font-normal">per sq.ft</span></>
                ) : (
                  <span className="text-base font-normal text-gray-500">Select flooring type</span>
                )}
              </p>
            </div>

            {/* Flooring type select */}
            <div className="border-b-2 border-gray-500 pb-4 flex flex-col gap-2">
              <p className="text-sm">Flooring Type</p>
              <Select
                value={selectedFlooring?.title || ""}
                onChange={(e) => {
                  const found = flooringList.find((f) => f.title === e.target.value);
                  setSelectedFlooring(found || null);
                }}
              >
                {flooringList.map((f) => (
                  <option key={f.title} value={f.title}>
                    {f.title} — ₹{parseInt(f.price || 0)}/sq.ft
                  </option>
                ))}
              </Select>
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
    const [flooringRes, categoryRes] = await Promise.all([
      fetch(`${process.env.NEXT_PUBLIC_API_URL}/config?code=flooring`),
      fetch(`${process.env.NEXT_PUBLIC_API_URL}/category`),
    ]);
    const [flooringConfig, categoryList] = await Promise.all([
      flooringRes.json(),
      categoryRes.json(),
    ]);
    return {
      props: {
        flooringConfig: flooringConfig || {},
        categoryList: Array.isArray(categoryList) ? categoryList : [],
      },
    };
  } catch {
    return { props: { flooringConfig: {}, categoryList: [] } };
  }
}
