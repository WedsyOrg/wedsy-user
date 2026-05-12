import AccountList from "@/components/profile/AccountList";
import DesktopLayout from "@/components/profile/DesktopLayout";
import EmptyStateStep1 from "@/components/profile/EmptyStateStep1";
import EmptyStateStep2 from "@/components/profile/EmptyStateStep2";
import EventDaysCarousel from "@/components/profile/EventDaysCarousel";
import InspirationCard from "@/components/profile/InspirationCard";
import ProfileHero from "@/components/profile/ProfileHero";
import StatsGrid from "@/components/profile/StatsGrid";
import TimelineCanvas from "@/components/profile/TimelineCanvas";
import TimelineCard from "@/components/profile/TimelineCard";
import useProfileData from "@/hooks/useProfileData";
import { regenerateTimeline } from "@/utils/api/wedding-timeline";
import Head from "next/head";
import { useRouter } from "next/router";
import { useEffect, useState } from "react";

const MOCK_STATS = [
  { label: "Days to wedding", value: 11 },
  { label: "Vendors booked", value: 5, sublabel: "of 7 expected" },
  { label: "Paid", value: "₹4.2L", sublabel: "of ₹6.8L total" },
  { label: "Open milestones", value: 3 },
];

const MOCK_INSPIRATION = {
  imageSrc: "https://images.unsplash.com/photo-1519741497674-611481863552?w=1200&q=80",
  tagline: "CURATED FOR YOU",
  headline: "Stories of weddings like yours",
  ctaLabel: "Explore",
};

const REGEN_ERROR_MESSAGES = { SERVICE_UNAVAILABLE: "AI is taking a moment — please try again.", BAD_REQUEST: "Something's off with your event data. Please reload." };

const MOCK_ACCOUNT_ITEMS = [
  { label: "Orders", href: "/my-orders", iconName: "Package" },
  { label: "Payments", href: "/my-payments", iconName: "CreditCard" },
  { label: "My Bids", href: "/my-bids", iconName: "Hammer", badge: "3 new" },
  { label: "Wishlist", href: "/wishlist", iconName: "Heart" },
  { label: "Support", href: "#", iconName: "MessageCircle", onTap: () => console.log("Mock support") },
];

function deriveCoupleName(event) {
  return event?.name || "Your wedding";
}

function deriveWeddingDate(event) {
  if (!event?.eventDays?.length) return null;
  const dates = event.eventDays.map((d) => d.date).filter(Boolean).sort();
  return dates[dates.length - 1] || null;
}

function deriveEventDayNames(event) {
  return event?.eventDays?.map((d) => d.name).filter(Boolean) || [];
}

function shouldShowEmpty1(event, eventLoading) {
  return !eventLoading && !event;
}

function shouldShowEmpty2(event, eventLoading) {
  return !eventLoading && !!event && (!event.eventDays || event.eventDays.length === 0);
}

export default function Profile({ user, userLoggedIn, CheckLogin, setOpenLoginModalv2 }) {
  const router = useRouter();
  const [token, setToken] = useState(null);
  const [regenerating, setRegenerating] = useState(false);
  const [regenerateError, setRegenerateError] = useState(null);
  const [regenerateResult, setRegenerateResult] = useState(null);
  const [selectedEventId, setSelectedEventId] = useState(null);

  useEffect(() => {
    CheckLogin();
  }, []);

  useEffect(() => {
    if (typeof window !== "undefined") {
      setToken(localStorage.getItem("token"));
    }
  }, []);

  useEffect(() => {
    if (!router.isReady) return;
    const urlId = typeof router.query.eventId === "string" ? router.query.eventId : "";
    try {
      const id = urlId || localStorage.getItem("wedsy.selectedEventId");
      if (id) setSelectedEventId(id);
      if (urlId) localStorage.setItem("wedsy.selectedEventId", urlId);
    } catch {}
  }, [router.isReady, router.query.eventId]);

  const {
    event,
    events,
    eventLoading,
    eventError,
    milestones,
    milestonesLoading,
    milestonesError,
    refetchMilestones,
  } = useProfileData({ token, selectedEventId });

  if (!user?.name) {
    return (
      <div className="wedsy-screen-container">
        <p className="wedsy-subtitle" style={{ padding: "60px 24px", textAlign: "center" }}>Loading…</p>
      </div>
    );
  }

  const handleRegenerate = async () => {
    if (!event?._id || !token) return;
    setRegenerating(true);
    setRegenerateError(null);
    setRegenerateResult(null);
    const { data, error } = await regenerateTimeline(event._id, token);
    if (error) setRegenerateError(error);
    else { setRegenerateResult(data?.suggestions || { add: [], adjust: [], remove: [] }); await refetchMilestones(); }
    setRegenerating(false);
  };
  const explicitEmptyState = router.query.state;
  const weddingDate = deriveWeddingDate(event);
  const isEventPast = weddingDate ? new Date(weddingDate) < new Date() : false;
  const showPastEventCard = isEventPast && !!regenerateResult && !regenerateResult.add?.length && !regenerateResult.adjust?.length && !regenerateResult.remove?.length;
  const handleCreateNewEvent = () => router.push("/profile?state=empty1");
  const handleSwitchEvent = (eventId) => router.push({ pathname: "/profile", query: { eventId } }, undefined, { shallow: true });
  const handleManageAll = () => router.push("/event");

  return (
    <>
      <Head>
        <title>Profile · Wedsy</title>
      </Head>
      <div className="wedsy-screen-container wedsy-desktop-container">
        {eventLoading ? (
          <p className="wedsy-subtitle" style={{ padding: "60px 24px", textAlign: "center" }}>Loading…</p>
        ) : eventError ? (
          <p className="font-serif italic text-[13px] text-wedsy-ink-3 text-center" style={{ padding: "60px 24px" }}>Unable to load your wedding. Please reload.</p>
        ) : explicitEmptyState === "empty1" || shouldShowEmpty1(event, eventLoading) ? (
          <EmptyStateStep1
            onContinue={(data) => console.log("Mock create event step 1:", data)}
          />
        ) : explicitEmptyState === "empty2" || shouldShowEmpty2(event, eventLoading) ? (
          <EmptyStateStep2
            eventName={event.name || "Your wedding"}
            community={event.community || "Hindu"}
            onBack={() => console.log("Mock back from step 2")}
            onComplete={(data) => console.log("Mock complete event days:", data)}
          />
        ) : (
          <DesktopLayout event={event} events={events} milestones={milestones} eventId={event?._id} token={token} inspiration={MOCK_INSPIRATION} onSwitchEvent={handleSwitchEvent} onCreateNewEvent={handleCreateNewEvent} onManageAllEvents={handleManageAll} onMilestoneComplete={refetchMilestones} onInspirationTap={() => console.log("Mock inspiration tap")}>
            <ProfileHero
              coupleName={deriveCoupleName(event)}
              weddingDate={deriveWeddingDate(event)}
              eventDayCount={event.eventDays?.length || 0}
              eventDayNames={deriveEventDayNames(event)}
            />
            <div className="lg:hidden">
              <TimelineCard milestones={milestones} onRegenerate={handleRegenerate} onViewAll={() => console.log("Mock view all")} regenerating={regenerating} />
            </div>
            <div className="hidden lg:block">
              <TimelineCanvas milestones={milestones} weddingDate={deriveWeddingDate(event)} loading={milestonesLoading} error={milestonesError} regenerating={regenerating} onRegenerate={handleRegenerate} />
            </div>
            {milestonesLoading && <p className="px-6 -mt-4 mb-6 font-serif italic text-[12px] text-wedsy-ink-3 text-center">Loading timeline…</p>}
            {milestonesError && <p className="px-6 -mt-4 mb-6 font-serif italic text-[12px] text-wedsy-ink-3 text-center">Unable to load timeline. Please reload.</p>}
            {regenerateError && <p className="px-6 -mt-4 mb-6 font-serif italic text-[12px] text-wedsy-ink-3 text-center">{REGEN_ERROR_MESSAGES[regenerateError.code] || "Couldn't regenerate. Please try again."}</p>}
            {showPastEventCard && (
              <div className="px-6 mt-4 mb-8 text-center">
                <p className="font-serif italic text-[15px] text-wedsy-ink leading-snug">Your celebration is complete — we hope it was unforgettable.</p>
                <p className="font-sans text-[12px] text-wedsy-ink-3 mt-3 mb-3">Planning another?</p>
                <button onClick={handleCreateNewEvent} className="text-[11px] tracking-[2px] uppercase font-medium text-wedsy-rose-600">Create a new event →</button>
              </div>
            )}
            <EventDaysCarousel eventDays={event.eventDays || []} />
            <StatsGrid stats={MOCK_STATS} />
            <div className="lg:hidden">
              <InspirationCard imageSrc={MOCK_INSPIRATION.imageSrc} tagline={MOCK_INSPIRATION.tagline} headline={MOCK_INSPIRATION.headline} ctaLabel={MOCK_INSPIRATION.ctaLabel} onTap={() => console.log("Mock inspiration tap")} />
            </div>
            <div className="lg:hidden">
              <AccountList items={MOCK_ACCOUNT_ITEMS} onSignOut={() => console.log("Mock sign out")} />
            </div>
          </DesktopLayout>
        )}
      </div>
    </>
  );
}
