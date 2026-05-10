import EmptyStateStep1 from "@/components/profile/EmptyStateStep1";
import EmptyStateStep2 from "@/components/profile/EmptyStateStep2";
import ProfileHero from "@/components/profile/ProfileHero";
import Head from "next/head";
import { useRouter } from "next/router";
import { useEffect, useState } from "react";

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
          <ProfileHero
            coupleName="Rohaan & Asiya"
            weddingDate="2026-05-21"
            eventDayCount={3}
            eventDayNames={["Mehendi", "Sangeet", "Wedding"]}
          />
        )}
      </div>
    </>
  );
}
