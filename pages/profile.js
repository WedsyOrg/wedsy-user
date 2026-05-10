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
        <div style={{ padding: "60px 24px", textAlign: "center" }}>
          <p className="wedsy-eyebrow">WELCOME</p>
          <h1
            className="wedsy-title"
            style={{ fontSize: "32px", marginTop: "12px" }}
          >
            Hello, {user.name || "friend"}
          </h1>
          <p className="wedsy-italic-em" style={{ marginTop: "8px" }}>
            Your wedding journey, in one place
          </p>
          <div
            className="wedsy-ornament-divider"
            style={{ margin: "24px auto" }}
          ></div>
          <p className="wedsy-subtitle" style={{ marginTop: "16px" }}>
            We&apos;re rebuilding your dashboard. Check back soon for the full
            experience.
          </p>
        </div>
      </div>
    </>
  );
}
