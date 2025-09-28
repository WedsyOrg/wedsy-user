import Footer from "@/components/layout/Footer";
import Header from "@/components/layout/Header";
import "@/styles/globals.css";
import { Spinner } from "flowbite-react";
import { useRouter } from "next/router";
import { MakeupAndBeautyPageSkeleton, WedsyPackagesPageSkeleton, MakeupArtistsPageSkeleton, BiddingPageSkeleton } from "@/components/skeletons/makeup-store";
import { EventPageSkeleton } from "@/components/skeletons/event";
import { useEffect, useState } from "react";
import Script from "next/script";
import LoginModal from "@/components/layout/LoginModal";
import Head from "next/head";
import LoginModalv2 from "@/components/layout/LoginModalv2";

function App({ Component, pageProps }) {
  const router = useRouter();
  const [loading, setLoading] = useState(true);
  const [logIn, setLogIn] = useState(false);
  const [user, setUser] = useState({});
  const [openLoginModal, setOpenLoginModal] = useState(false);
  const [openLoginModalv2, setOpenLoginModalv2] = useState(false);
  const [loginSource, setLoginSource] = useState("");
  const restrictedPaths = [
    "/wishlist", "/my-account", "/event", "/payments", "/my-orders", "/my-bids", "/chat",
    "/makeup-and-beauty/wedsy-packages/checkout",
  ];

  const isPathRestricted = () => {
    return router.pathname === "/event" || router.pathname === "/event/[event_id]/view"
      ? false
      : restrictedPaths.includes(router.pathname) ||
          restrictedPaths.filter((item) => router.pathname.startsWith(item)).length > 0;
  };

  const Logout = () => {
    setLogIn(true);
    setUser({});
    localStorage.removeItem("token");
    router.push("/login");
  };

  const CheckLogin = () => {
    fetch(`${process.env.NEXT_PUBLIC_API_URL}/auth/`, {
      method: "GET",
      headers: { "Content-Type": "application/json", authorization: `Bearer ${localStorage.getItem("token")}` },
    })
      .then((response) => {
        if (!response.ok) {
          if (isPathRestricted()) router.push("/login");
          localStorage.removeItem("token");
          setLogIn(true);
          return null;
        }
        return response.json();
      })
      .then((response) => {
        if (response) {
          setLogIn(false);
          setUser(response);
        }
        setLoading(false);
      })
      .catch((error) => console.error("There was a problem with the fetch operation:", error));
  };

  useEffect(() => {
    if (!localStorage.getItem("token")) {
      if (isPathRestricted()) router.push("/login");
      setLogIn(true);
      setLoading(false);
    } else {
      setLoading(true);
      CheckLogin();
    }
  }, []);

  useEffect(() => {
    // This logic ensures the Meta Pixel script runs correctly on client-side navigation.
    const handleRouteChange = () => {
      import("react-facebook-pixel")
        .then((x) => x.default)
        .then((ReactPixel) => {
          ReactPixel.pageView();
        });
    };

    import("react-facebook-pixel")
      .then((x) => x.default)
      .then((ReactPixel) => {
        ReactPixel.init("367919122511166");
        ReactPixel.pageView();
        router.events.on("routeChangeComplete", handleRouteChange);
      });
    
    // This is the cleanup function to prevent memory leaks as recommended.
    return () => {
      router.events.off("routeChangeComplete", handleRouteChange);
    };
  }, [router.events]);

  return (
    <>
      <Head>
        <link rel="icon" href="/favicon.ico" />
        {/* Specific meta tags for homepage */}
        {router.pathname === "/" && (
          <>
            <title>Affordable Wedding Packages in Bangalore - Best Planners in Bangalore</title>
            <meta name="description" content="Find affordable wedding planners in Bangalore. Explore budget-friendly wedding, event, and destination packages in India. Tailored solutions for your perfect day!" />
          </>
        )}
        {/* Specific meta tags for decor page */}
        {router.pathname === "/decor" && (
          <>
            <title>Premium Wedding Decor Services | Wedding Stage Decoration in Bangalore</title>
            <meta name="description" content="Transform your wedding with Wedsy's premium decor services. Discover exquisite themes, floral arrangements, and custom setups designed to bring your dream wedding to life. Book now for a seamless experience." />
          </>
        )}
        {/* Default meta tags for other pages */}
        {router.pathname !== "/" && router.pathname !== "/decor" && (
          <>
            <title>Wedsy | Weddings Made Easy</title>
            <meta name="description" content="Elevate your wedding experience with Wedsy - your affordable Wedtech partner. Explore stunning flower decor, captivating stage setups, and budget-friendly planning." />
          </>
        )}
        <link rel="canonical" href={`https://www.wedsy.in${router.asPath === "/" ? "" : router.asPath.split("?")[0]}`} />
        <meta name="viewport" content="width=device-width, initial-scale=1.0" />
        <meta httpEquiv="content-type" content="text/html;charset=UTF-8" />
        <meta property="og:locale" content="en_IN" />
        <meta property="og:title" content="Wedsy | Weddings Made Easy" />
        <meta property="og:description" content="Elevate your wedding experience with Wedsy - your affordable Wedtech partner." />
        <meta property="og:image" content="https://wedsy.vercel.app/wedsy-logo.jpg" />
        <meta property="og:url" content="https://www.wedsy.in/" />
        <meta property="og:type" content="website" />
        <meta property="og:site_name" content="Wedsy | Weddings Made Easy" />
        <meta name="robots" content="index, follow" />
        <meta name="google-site-verification" content="0rZGstdf8ZBfbVvggmIOXJAq-5kDHnKwFM8bRpUnRKU" />
      </Head>

      {/* --- SCRIPT MANAGEMENT --- */}
      <Script id="gtm-script" strategy="afterInteractive" dangerouslySetInnerHTML={{
          __html: `
            (function(w,d,s,l,i){w[l]=w[l]||[];w[l].push({'gtm.start':
            new Date().getTime(),event:'gtm.js'});var f=d.getElementsByTagName(s)[0],
            j=d.createElement(s),dl=l!='dataLayer'?'&l='+l:'';j.async=true;j.src=
            'https://www.googletagmanager.com/gtm.js?id='+i+dl;f.parentNode.insertBefore(j,f);
            })(window,document,'script','dataLayer','GTM-KH7RV8NN');
          `,
        }}
      />
      <Script id="google-analytics" strategy="afterInteractive" src={`https://www.googletagmanager.com/gtag/js?id=G-ZL6YG37MF0`} />
      <Script id="google-analytics-config" strategy="afterInteractive" dangerouslySetInnerHTML={{
          __html: `
            window.dataLayer = window.dataLayer || [];
            function gtag(){dataLayer.push(arguments);}
            gtag('js', new Date());
            gtag('config', 'G-ZL6YG37MF0', { page_path: window.location.pathname });
          `,
        }}
      />
      <Script id="google-ads" strategy="lazyOnload" async src="https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=ca-pub-5861954260216854" crossOrigin="anonymous" />
      <Script id="interakt-kiwi-sdk" strategy="lazyOnload" src="https://app.interakt.ai/kiwi-sdk/kiwi-sdk-17-prod-min.js"
        onLoad={() => {
            if (
            router.pathname !== "/event/[event_id]/view" &&
            router.pathname !== "/event/[event_id]/planner" &&
            router.pathname !== "/my-account" &&
            router.pathname !== "/my-payments" &&
            router.pathname !== "/my-orders" &&
            !router.pathname.includes("/decor/view") &&
            !router.pathname.includes("/chats")
            ) {
              if (typeof kiwi !== 'undefined') {
                kiwi.init("", "YSNtpXF4Dmqafpa8XeSZzWfcawpPm4QP", {});
              }
            }
        }}
      />
      
      {/* GTM Noscript Fallback */}
      <noscript>
        <iframe src="https://www.googletagmanager.com/ns.html?id=GTM-KH7RV8NN" height="0" width="0" style={{ display: "none", visibility: "hidden" }}></iframe>
      </noscript>

      {/* Hidden SEO headings */}
      {router.pathname === "/" && (
        <div className="hidden">
            <h1>Affordable & Best Wedding Planner in Bangalore</h1>
            <h2>Best Budget-Friendly Wedding & Destination Packages in India</h2>
        </div>
      )}
      {router.pathname === "/decor" && (
        <div className="hidden">
            <h1>Wedding Decoration Packages - Wedsy&apos;s</h1>
            <h2>Wedding Stage Decoration in Bangalore</h2>
        </div>
      )}

        <div className="flex flex-col min-h-screen">
          <Header userLoggedIn={!logIn} user={user} Logout={Logout} />
          <LoginModal openLoginModal={openLoginModal} setOpenLoginModal={setOpenLoginModal} user={user} logIn={logIn} setLogIn={setLogIn} CheckLogin={CheckLogin} />
          <LoginModalv2 openLoginModal={openLoginModalv2} setOpenLoginModal={setOpenLoginModalv2} user={user} logIn={logIn} setLogIn={setLogIn} CheckLogin={CheckLogin} source={loginSource} />
          <main className="flex-grow">
            {loading ? (
              router.pathname === '/makeup-and-beauty' ? (
                <MakeupAndBeautyPageSkeleton />
              ) : router.pathname.startsWith('/makeup-and-beauty/wedsy-packages') ? (
                <WedsyPackagesPageSkeleton />
              ) : router.pathname.startsWith('/makeup-and-beauty/artists') ? (
                <MakeupArtistsPageSkeleton />
              ) : router.pathname.startsWith('/makeup-and-beauty/bidding') ? (
                <BiddingPageSkeleton />
              ) : router.pathname === '/event' ? (
                <EventPageSkeleton formStep={1} />
              ) : (
                <div className="grid place-content-center h-screen "><Spinner size="xl" /></div>
              )
            ) : (
              <Component {...pageProps} userLoggedIn={!logIn} user={user} setOpenLoginModal={setOpenLoginModal} setOpenLoginModalv2={setOpenLoginModalv2} CheckLogin={CheckLogin} setSource={setLoginSource} />
            )}
          </main>
          <Footer />
        </div>
    </>
  );
}

export default App;