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
import { useRouter } from "next/router";
import { useEffect, useState } from "react";

const MOCK_EVENT_DAYS = [
  { name: "Mehendi", date: "2026-05-19", time: "4:00 PM", venue: "Bangalore International Centre" },
  { name: "Sangeet", date: "2026-05-20", time: "7:00 PM", venue: "Bangalore International Centre" },
  { name: "Wedding", date: "2026-05-21", time: "11:00 AM", venue: "Bangalore International Centre" },
];

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

export default function Profile({ user, userLoggedIn, CheckLogin, setOpenLoginModalv2 }) {
  const router = useRouter();
  const [step1Data, setStep1Data] = useState({ eventName: "", community: "" });
  const [token, setToken] = useState(null);

  useEffect(() => {
    CheckLogin();
  }, []);

  useEffect(() => {
    if (typeof window !== "undefined") {
      setToken(localStorage.getItem("token"));
    }
  }, []);

  const eventIdFromUrl = router.query.eventId || null;
  const { milestones, milestonesLoading, milestonesError } = useProfileData({
    eventId: eventIdFromUrl,
    token,
  });

  if (!user?.name) {
    return (
      <div className="wedsy-screen-container">
        <p
          className="wedsy-subtitle"
          style={{ padding: "60px 24px", textAlign: "center" }}
        >
          Loading…
        </p>
      </div>
    );
  }

  const previewState = router.query.state;

  return (
    <>
      <Head>
        <title>Profile · Wedsy</title>
      </Head>
      <div className="wedsy-screen-container">
        {previewState === "empty1" ? (
          <EmptyStateStep1
            onContinue={(data) => {
              setStep1Data(data);
              router.push("/profile?state=empty2");
            }}
          />
        ) : previewState === "empty2" ? (
          <EmptyStateStep2
            eventName={step1Data.eventName || "Your wedding"}
            community={step1Data.community || "Hindu"}
            onBack={() => router.push("/profile?state=empty1")}
            onComplete={(data) => {
              console.log("Mock create event:", data);
              router.push("/profile");
            }}
          />
        ) : (
          <>
            <ProfileHero
              coupleName="Rohaan & Asiya"
              weddingDate="2026-05-21"
              eventDayCount={3}
              eventDayNames={["Mehendi", "Sangeet", "Wedding"]}
            />
            <TimelineCard
              milestones={milestones}
              onRegenerate={() => console.log("Mock regenerate (wired in 1.4.B)")}
              onViewAll={() => console.log("Mock view all")}
            />
            {milestonesLoading && (
              <p className="px-6 -mt-4 mb-6 font-serif italic text-[12px] text-wedsy-ink-3 text-center">
                Loading timeline…
              </p>
            )}
            {milestonesError && (
              <p className="px-6 -mt-4 mb-6 font-serif italic text-[12px] text-wedsy-ink-3 text-center">
                Unable to load timeline. Please reload.
              </p>
            )}
            <EventDaysCarousel eventDays={MOCK_EVENT_DAYS} />
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
