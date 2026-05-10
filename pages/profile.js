import AccountList from "@/components/profile/AccountList";
import EmptyStateStep1 from "@/components/profile/EmptyStateStep1";
import EmptyStateStep2 from "@/components/profile/EmptyStateStep2";
import EventDaysCarousel from "@/components/profile/EventDaysCarousel";
import InspirationCard from "@/components/profile/InspirationCard";
import ProfileHero from "@/components/profile/ProfileHero";
import StatsGrid from "@/components/profile/StatsGrid";
import TimelineCard from "@/components/profile/TimelineCard";
import Head from "next/head";
import { useRouter } from "next/router";
import { useEffect, useState } from "react";

const MOCK_MILESTONES = [
  { _id: "m1", title: "Final venue walkthrough", dueDate: "2026-05-14", status: "PENDING", source: "Custom" },
  { _id: "m2", title: "Confirm guest count", dueDate: "2026-05-15", status: "PENDING", source: "AI" },
  { _id: "m3", title: "Pickup outfits", dueDate: "2026-05-18", status: "PENDING", source: "Custom" },
  { _id: "m4", title: "Book photographer", dueDate: "2026-04-10", status: "COMPLETED", source: "AI" },
];

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

  useEffect(() => {
    CheckLogin();
  }, []);

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
              milestones={MOCK_MILESTONES}
              onRegenerate={() => console.log("Mock regenerate")}
              onViewAll={() => console.log("Mock view all")}
            />
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
