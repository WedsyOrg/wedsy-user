import { processMobileNumber } from "@/utils/phoneNumber";
import { COUNTRIES, getCountry, isIndia, isOther, isValidCustomCode, effectiveCountryCode, detectCountryCode } from "@/utils/countries";
import { trimTitle } from "@/utils/seo";
import { Spinner } from "flowbite-react";
import Head from "next/head";
import { useRouter } from "next/router";
import { useEffect, useState } from "react";

export default function Login({ CheckLogin }) {
  const router = useRouter();
  const [data, setData] = useState({
    countryCode: "+91",
    customCountryCode: "+",
    phone: "",
    loading: false,
    success: false,
    otpSent: false,
    Otp: "",
    ReferenceId: "",
    message: "",
    // International signup fields (only used when effective code !== '+91')
    signupToken: "",
    needsSignup: false,
    name: "",
    email: "",
  });

  useEffect(() => {
    detectCountryCode().then((code) => {
      setData((d) => ({ ...d, countryCode: code }));
    });
  }, []);

  const country = getCountry(data.countryCode);
  const effectiveCC = effectiveCountryCode(data.countryCode, data.customCountryCode);

  const SendOTP = () => {
    setData({ ...data, loading: true, message: "" });
    if (isIndia(effectiveCC)) {
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
      fetch(`${process.env.NEXT_PUBLIC_API_URL}/auth/otp/international`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          phone: data.phone,
          countryCode: effectiveCC,
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
    }
  };

  const handleLogin = () => {
    setData({ ...data, loading: true });
    if (isIndia(effectiveCC)) {
      fetch(`${process.env.NEXT_PUBLIC_API_URL}/auth`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          phone: processMobileNumber(data.phone),
          Otp: data.Otp,
          ReferenceId: data.ReferenceId,
        }),
      })
        .then((r) => r.json())
        .then((response) => {
          if (response.message === "Login Successful" && response.token) {
            setData({
              ...data,
              phone: "",
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
      fetch(`${process.env.NEXT_PUBLIC_API_URL}/auth/verify/international`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          phone: data.phone,
          countryCode: effectiveCC,
          otp: data.Otp,
          referenceId: data.ReferenceId,
        }),
      })
        .then((r) => r.json())
        .then((response) => {
          if (response.userExists && response.token) {
            localStorage.setItem("token", response.token);
            setData({
              ...data,
              phone: "",
              loading: false,
              success: true,
              otpSent: false,
              Otp: "",
              ReferenceId: "",
              message: "",
            });
            router.push("/decor/view");
            CheckLogin();
          } else if (response.userExists === false && response.signupToken) {
            setData({
              ...data,
              loading: false,
              needsSignup: true,
              signupToken: response.signupToken,
              message: "",
            });
          } else {
            setData({
              ...data,
              loading: false,
              Otp: "",
              message: response.message || "Invalid or expired OTP",
            });
          }
        })
        .catch((error) => {
          console.error("There was a problem with the fetch operation:", error);
          setData({ ...data, loading: false });
        });
    }
  };

  const handleSignup = () => {
    setData({ ...data, loading: true });
    fetch(`${process.env.NEXT_PUBLIC_API_URL}/auth/signup/international`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        phone: data.phone,
        countryCode: effectiveCC,
        name: data.name,
        email: data.email,
        signupToken: data.signupToken,
      }),
    })
      .then((r) => r.json())
      .then((response) => {
        if (response.token) {
          localStorage.setItem("token", response.token);
          setData({
            ...data,
            phone: "",
            loading: false,
            success: true,
            otpSent: false,
            needsSignup: false,
            Otp: "",
            ReferenceId: "",
            signupToken: "",
            name: "",
            email: "",
            message: "",
          });
          router.push("/decor/view");
          CheckLogin();
        } else {
          setData({
            ...data,
            loading: false,
            message: response.message || "Account creation failed",
          });
        }
      })
      .catch((error) => {
        console.error("There was a problem with the fetch operation:", error);
        setData({ ...data, loading: false });
      });
  };

  const handleSubmit = () => {
    if (data.needsSignup) {
      if (!data.name || !data.email) {
        setData({ ...data, message: "Name and email are required" });
        return;
      }
      handleSignup();
      return;
    }
    if (isOther(data.countryCode) && !isValidCustomCode(data.customCountryCode)) {
      setData({ ...data, message: "Enter a valid country code (e.g. +49)" });
      return;
    }
    if (data.otpSent) {
      handleLogin();
    } else {
      SendOTP();
    }
  };

  return (
    <>
      <Head>
        <title>{trimTitle("Login | Wedsy")}</title>
        <meta name="robots" content="noindex, nofollow" />
        <link rel="canonical" href="https://www.wedsy.in/login" />
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

          <h2 className="text-2xl font-bold text-gray-800 mb-8 z-20">
            {data.needsSignup ? "Create your account" : "Sign in"}
          </h2>
          <div className="w-full max-w-sm space-y-6 z-20">
            {!data.needsSignup && (
              <>
                <div className="flex gap-2 relative z-30">
                  {isOther(data.countryCode) ? (
                    <div
                      className="w-[120px] flex items-center px-2 rounded-lg border border-gray-300 bg-white focus-within:ring-2 focus-within:ring-red-600"
                      style={{ boxShadow: "0px 4px 4px 0px #00000040" }}
                    >
                      <input
                        type="text"
                        inputMode="numeric"
                        placeholder="+49"
                        value={data.customCountryCode}
                        maxLength={5}
                        autoFocus
                        onChange={(e) => {
                          const digits = e.target.value.replace(/\D/g, "").slice(0, 4);
                          const newCustom = "+" + digits;
                          if (newCustom === "+91") {
                            setData({ ...data, countryCode: "+91", customCountryCode: "+" });
                          } else {
                            setData({ ...data, customCountryCode: newCustom });
                          }
                        }}
                        disabled={data.otpSent}
                        className="flex-1 min-w-0 py-3 bg-transparent border-0 focus:outline-none focus:ring-0"
                      />
                      <button
                        type="button"
                        onClick={() => setData({ ...data, countryCode: "+91", customCountryCode: "+" })}
                        disabled={data.otpSent}
                        title="Back to country list"
                        aria-label="Back to country list"
                        className="text-gray-500 hover:text-gray-800 text-lg leading-none px-1"
                      >
                        ×
                      </button>
                    </div>
                  ) : (
                    <select
                      value={data.countryCode}
                      onChange={(e) => setData({ ...data, countryCode: e.target.value, phone: "" })}
                      disabled={data.otpSent}
                      className="w-[120px] px-3 py-3 rounded-lg border border-gray-300 bg-white focus:outline-none focus:ring-2 focus:ring-red-600"
                      style={{ boxShadow: "0px 4px 4px 0px #00000040" }}
                    >
                      {COUNTRIES.map((c) => (
                        <option key={`${c.code}-${c.name}`} value={c.code} title={c.name}>
                          {c.flag} {isOther(c.code) ? "Other" : c.code}
                        </option>
                      ))}
                    </select>
                  )}
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
              </>
            )}
            {data.needsSignup && (
              <>
                <div className="relative z-30">
                  <input
                    type="text"
                    placeholder="Name"
                    value={data.name}
                    onChange={(e) => setData({ ...data, name: e.target.value })}
                    className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-red-600 focus:border-transparent"
                    style={{ boxShadow: "0px 4px 4px 0px #00000040" }}
                  />
                </div>
                <div className="relative z-30">
                  <input
                    type="email"
                    placeholder="Email"
                    value={data.email}
                    onChange={(e) => setData({ ...data, email: e.target.value })}
                    className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-red-600 focus:border-transparent"
                    style={{ boxShadow: "0px 4px 4px 0px #00000040" }}
                  />
                </div>
              </>
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
                onClick={handleSubmit}
              >
                {data.loading ? (
                  <>
                    <Spinner size="sm" />
                    <span className="pl-3">Loading...</span>
                  </>
                ) : data.needsSignup ? (
                  <>Create account</>
                ) : (
                  <>Login</>
                )}
              </button>
            </div>
            <p className="text-center text-sm text-gray-600 mb-4 md:mb-0">
              Not signed in yet?               <span
                className="text-red-800 font-semibold cursor-pointer hover:underline"
                onClick={() => {
                  router.push('/signup');
                }}
              >Sign up</span>
            </p>
          </div>
          </div>
        </div>
      </div>
    </>
  );
}
