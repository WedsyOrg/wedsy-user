import AccountList from "@/components/profile/AccountList";
import EmptyStateStep1 from "@/components/profile/EmptyStateStep1";
import EmptyStateStep2 from "@/components/profile/EmptyStateStep2";
import EventDaysCarousel from "@/components/profile/EventDaysCarousel";
import InspirationCard from "@/components/profile/InspirationCard";
import ProfileHero from "@/components/profile/ProfileHero";
import StatsGrid from "@/components/profile/StatsGrid";
import TimelineCard from "@/components/profile/TimelineCard";
import useProfileData from "@/hooks/useProfileData";
import Head from "next/head";
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
  const [token, setToken] = useState(null);
  const [regenerating, setRegenerating] = useState(false);

  useEffect(() => {
    CheckLogin();
  }, []);

  useEffect(() => {
    if (typeof window !== "undefined") {
      setToken(localStorage.getItem("token"));
    }
  }, []);

  const {
    event,
    eventLoading,
    eventError,
    milestones,
    milestonesLoading,
    milestonesError,
    refetchMilestones,
  } = useProfileData({ token });

  if (!user?.name) {
    return (
      <div className="wedsy-screen-container">
        <p className="wedsy-subtitle" style={{ padding: "60px 24px", textAlign: "center" }}>Loading…</p>
      </div>
    );
  }

  const handleRegenerate = () => {
    setRegenerating(true);
    setTimeout(() => {
      refetchMilestones();
      setRegenerating(false);
      console.log("Mock regenerate complete (real Anthropic call deferred to 1.4.C)");
    }, 1500);
  };

  return (
    <>
      <Head>
        <title>Profile · Wedsy</title>
      </Head>
      <div className="wedsy-screen-container">
        {eventLoading ? (
          <p className="wedsy-subtitle" style={{ padding: "60px 24px", textAlign: "center" }}>Loading…</p>
        ) : eventError ? (
          <p className="font-serif italic text-[13px] text-wedsy-ink-3 text-center" style={{ padding: "60px 24px" }}>Unable to load your wedding. Please reload.</p>
        ) : shouldShowEmpty1(event, eventLoading) ? (
          <EmptyStateStep1
            onContinue={(data) => console.log("Mock create event step 1:", data)}
          />
        ) : shouldShowEmpty2(event, eventLoading) ? (
          <EmptyStateStep2
            eventName={event.name || "Your wedding"}
            community={event.community || "Hindu"}
            onBack={() => console.log("Mock back from step 2")}
            onComplete={(data) => console.log("Mock complete event days:", data)}
          />
        ) : (
          <>
            <ProfileHero
              coupleName={deriveCoupleName(event)}
              weddingDate={deriveWeddingDate(event)}
              eventDayCount={event.eventDays?.length || 0}
              eventDayNames={deriveEventDayNames(event)}
            />
            <TimelineCard
              milestones={milestones}
              onRegenerate={handleRegenerate}
              onViewAll={() => console.log("Mock view all")}
              regenerating={regenerating}
            />
            {milestonesLoading && <p className="px-6 -mt-4 mb-6 font-serif italic text-[12px] text-wedsy-ink-3 text-center">Loading timeline…</p>}
            {milestonesError && <p className="px-6 -mt-4 mb-6 font-serif italic text-[12px] text-wedsy-ink-3 text-center">Unable to load timeline. Please reload.</p>}
            <EventDaysCarousel eventDays={event.eventDays || []} />
            <StatsGrid stats={MOCK_STATS} />
            <InspirationCard
              imageSrc={MOCK_INSPIRATION.imageSrc}
              tagline={MOCK_INSPIRATION.tagline}
              headline={MOCK_INSPIRATION.headline}
              ctaLabel={MOCK_INSPIRATION.ctaLabel}
              onTap={() => console.log("Mock inspiration tap")}
            />
            <AccountList
              items={MOCK_ACCOUNT_ITEMS}
              onSignOut={() => console.log("Mock sign out")}
            />
          </>
        )}
      </div>
    </>
  );
}
