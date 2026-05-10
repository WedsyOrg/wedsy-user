import ProfileHero from "@/components/profile/ProfileHero";
import Head from "next/head";
import { useRouter } from "next/router";
import { useEffect } from "react";

export default function Profile({ user, userLoggedIn, CheckLogin, setOpenLoginModalv2 }) {
  const router = useRouter();

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

  return (
    <>
      <Head>
        <title>Profile · Wedsy</title>
      </Head>
      <div className="wedsy-screen-container">
        <ProfileHero
          coupleName="Rohaan & Asiya"
          weddingDate="2026-05-21"
          eventDayCount={3}
          eventDayNames={["Mehendi", "Sangeet", "Wedding"]}
        />
      </div>
    </>
  );
}
