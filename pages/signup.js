import { processMobileNumber } from "@/utils/phoneNumber";
import { COUNTRIES, getCountry, isIndia, detectCountryCode } from "@/utils/countries";
import { trimTitle } from "@/utils/seo";
import { Spinner } from "flowbite-react";
import Head from "next/head";
import { useRouter } from "next/router";
import { useEffect, useState } from "react";

export default function Signup({ CheckLogin }) {
  const router = useRouter();
  const [data, setData] = useState({
    countryCode: "+91",
    phone: "",
    name: "",
    email: "",
    loading: false,
    success: false,
    otpSent: false,
    Otp: "",
    ReferenceId: "",
    signupToken: "",
    message: "",
  });

  useEffect(() => {
    detectCountryCode().then((code) => {
      setData((d) => ({ ...d, countryCode: code }));
    });
  }, []);

  const country = getCountry(data.countryCode);

  const handleSignup = async () => {
    if (isIndia(data.countryCode)) {
      // Existing Indian flow: single /enquiry call verifies OTP + creates record
      if (await processMobileNumber(data.phone)) {
        setData({ ...data, loading: true });
        fetch(`${process.env.NEXT_PUBLIC_API_URL}/enquiry`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            name: data.name,
            phone: processMobileNumber(data.phone),
            verified: true,
            source: "Signup Page",
            Otp: data.Otp,
            ReferenceId: data.ReferenceId,
          }),
        })
          .then((r) => r.json())
          .then((response) => {
            if (response.message === "Enquiry Added Successfully" && response.token) {
              setData({
                ...data,
                phone: "",
                name: "",
                loading: false,
                success: true,
                otpSent: false,
                Otp: "",
                ReferenceId: "",
                message: "",
              });
              localStorage.setItem("token", response.token);
              router.push("/decor/view");
              CheckLogin();
            } else {
              setData({ ...data, loading: false, Otp: "", message: response.message });
            }
          })
          .catch((error) => {
            console.error("There was a problem with the fetch operation:", error);
            setData({ ...data, loading: false });
          });
      } else {
        alert("Please enter valid mobile number");
      }
      return;
    }

    // International flow: verify, then signup
    if (!data.email) {
      setData({ ...data, message: "Email is required" });
      return;
    }
    setData({ ...data, loading: true });
    try {
      const verifyRes = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/auth/verify/international`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            phone: data.phone,
            countryCode: data.countryCode,
            otp: data.Otp,
            referenceId: data.ReferenceId,
          }),
        }
      ).then((r) => r.json());

      if (verifyRes.userExists && verifyRes.token) {
        // Already have an account — log them straight in
        localStorage.setItem("token", verifyRes.token);
        setData({
          ...data,
          phone: "",
          name: "",
          email: "",
          loading: false,
          success: true,
          otpSent: false,
          Otp: "",
          ReferenceId: "",
          message: "",
        });
        router.push("/decor/view");
        CheckLogin();
        return;
      }

      if (verifyRes.userExists !== false || !verifyRes.signupToken) {
        setData({
          ...data,
          loading: false,
          Otp: "",
          message: verifyRes.message || "Invalid or expired OTP",
        });
        return;
      }

      const signupRes = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/auth/signup/international`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            phone: data.phone,
            countryCode: data.countryCode,
            name: data.name,
            email: data.email,
            signupToken: verifyRes.signupToken,
          }),
        }
      ).then((r) => r.json());

      if (signupRes.token) {
        localStorage.setItem("token", signupRes.token);
        setData({
          ...data,
          phone: "",
          name: "",
          email: "",
          loading: false,
          success: true,
          otpSent: false,
          Otp: "",
          ReferenceId: "",
          signupToken: "",
          message: "",
        });
        router.push("/decor/view");
        CheckLogin();
      } else {
        setData({
          ...data,
          loading: false,
          message: signupRes.message || "Account creation failed",
        });
      }
    } catch (error) {
      console.error("There was a problem with the fetch operation:", error);
      setData({ ...data, loading: false });
    }
  };

  const SendOTP = async () => {
    if (isIndia(data.countryCode)) {
      if (await processMobileNumber(data.phone)) {
        setData({ ...data, loading: true });
        fetch(`${process.env.NEXT_PUBLIC_API_URL}/auth/otp`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ phone: processMobileNumber(data.phone) }),
        })
          .then((r) => r.json())
          .then((response) => {
            setData({
              ...data,
              loading: false,
              otpSent: true,
              ReferenceId: response.ReferenceId,
            });
          })
          .catch((error) => {
            console.error("There was a problem with the fetch operation:", error);
            setData({ ...data, loading: false });
          });
      } else {
        alert("Please enter valid mobile number");
      }
      return;
    }

    if (!data.phone) {
      alert("Please enter valid mobile number");
      return;
    }
    setData({ ...data, loading: true });
    fetch(`${process.env.NEXT_PUBLIC_API_URL}/auth/otp/international`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        phone: data.phone,
        countryCode: data.countryCode,
      }),
    })
      .then((r) => r.json())
      .then((response) => {
        setData({
          ...data,
          loading: false,
          otpSent: true,
          ReferenceId: response.ReferenceId,
          message: response.message || "OTP sent on WhatsApp",
        });
      })
      .catch((error) => {
        console.error("There was a problem with the fetch operation:", error);
        setData({ ...data, loading: false });
      });
  };

  return (
    <>
      <Head>
        <title>{trimTitle("Sign Up | Wedsy")}</title>
        <meta name="robots" content="noindex, nofollow" />
        <link rel="canonical" href="https://www.wedsy.in/signup" />
      </Head>
      <div className="relative h-screen w-full flex overflow-hidden">
        {/* Left side - Background image area (60% width) */}
        <div className="hidden md:flex md:w-3/5 relative"
          style={{
            backgroundImage: 'url("/assets/background/bg-newLoginBackground.webp")',
            backgroundSize: "cover",
            backgroundRepeat: "no-repeat",
            backgroundPosition: "center",
          }}
        >
          {/* Black shadow overlay for better text visibility */}
          <div className="absolute inset-0 bg-black/30"></div>
          {/* Centered text overlay */}
          <div className="absolute inset-0 flex items-center justify-center text-white z-10">
            <div className="text-center">
              <h1 className="text-4xl font-bold mb-4">TOGETHER IS A BEAUTIFUL PLACE TO BE</h1>
              <h2 className="text-2xl font-semibold">JOIN US AS WE SAY 'I DO!'</h2>
            </div>
          </div>
        </div>

        {/* Right side - Background image area (40% width) */}
        <div
          className="flex-1 md:w-2/5 relative"
          style={{
            backgroundImage: 'url("/assets/background/bg-newSignin.webp")',
            backgroundSize: "cover",
            backgroundRepeat: "no-repeat",
            backgroundPosition: "center center",
          }}
        >
          {/* Login form overlay */}
          <div
            className="absolute inset-0 bg-white/30 flex flex-col justify-center items-center z-10 px-4 py-8 shadow-lg md:shadow-none"
            style={{
              boxShadow: "0px 4px 4px 0px #00000040"
            }}
          >

          <h2 className="text-2xl font-bold text-gray-800 mb-8 z-20">Sign up</h2>
          <div className="w-full max-w-sm space-y-6 z-20">
            <div className="relative z-30">
              <input
                type="text"
                placeholder="Name"
                value={data.name}
                onChange={(e) => setData({ ...data, name: e.target.value })}
                name="name"
                className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-red-600 focus:border-transparent relative z-30"
                style={{ boxShadow: "0px 4px 4px 0px #00000040" }}
              />
            </div>
            <div className="flex gap-2 relative z-30">
              <select
                value={data.countryCode}
                onChange={(e) => setData({ ...data, countryCode: e.target.value, phone: "" })}
                disabled={data.otpSent}
                className="px-3 py-3 rounded-lg border border-gray-300 bg-white focus:outline-none focus:ring-2 focus:ring-red-600"
                style={{ boxShadow: "0px 4px 4px 0px #00000040" }}
              >
                {COUNTRIES.map((c) => (
                  <option key={`${c.code}-${c.name}`} value={c.code}>
                    {c.flag} {c.code} {c.name}
                  </option>
                ))}
              </select>
              <input
                type="tel"
                inputMode="numeric"
                placeholder={`${country.digits} digits`}
                value={data.phone}
                maxLength={country.digits}
                onChange={(e) => setData({ ...data, phone: e.target.value.replace(/\D/g, "") })}
                disabled={data.otpSent}
                name="phone"
                className="flex-1 min-w-0 px-4 py-3 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-red-600 focus:border-transparent"
                style={{ boxShadow: "0px 4px 4px 0px #00000040" }}
              />
            </div>
            {!isIndia(data.countryCode) && (
              <div className="relative z-30">
                <input
                  type="email"
                  placeholder="Email"
                  value={data.email}
                  onChange={(e) => setData({ ...data, email: e.target.value })}
                  name="email"
                  className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-red-600 focus:border-transparent relative z-30"
                  style={{ boxShadow: "0px 4px 4px 0px #00000040" }}
                />
              </div>
            )}
            {data.otpSent && (
              <div className="relative z-30">
                <input
                  type="text"
                  placeholder="OTP"
                  value={data.Otp}
                  onChange={(e) => setData({ ...data, Otp: e.target.value })}
                  name="otp"
                  className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-red-600 focus:border-transparent relative z-30"
                  style={{ boxShadow: "0px 4px 4px 0px #00000040" }}
                />
              </div>
            )}
            {data.message && <p className="text-red-500 text-sm z-30">{data.message}</p>}
            <div className="flex justify-center w-full">
              <button
                type="button"
                className="w-2/3 text-white py-3 rounded-lg font-semibold hover:opacity-90 transition-opacity duration-200 cursor-pointer relative z-30"
                style={{
                  backgroundColor: "#840032",
                  boxShadow: "0px 4px 4px 0px #00000040"
                }}
                onClick={() => {
                  data.otpSent ? handleSignup() : SendOTP();
                }}
              >
                {data.loading ? (
                  <>
                    <Spinner size="sm" />
                    <span className="pl-3">Loading...</span>
                  </>
                ) : (
                  <>Sign up</>
                )}
              </button>
            </div>
            <p className="text-center text-sm text-gray-600 mb-4 md:mb-0">
              Already have an account? <span
                className="text-red-800 font-semibold cursor-pointer hover:underline"
                onClick={() => {
                  router.push('/login');
                }}
              >Sign in</span>
            </p>
          </div>
          </div>
        </div>
      </div>
    </>
  );
}
