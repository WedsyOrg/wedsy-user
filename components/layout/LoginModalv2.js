"use client";

import { useEffect, useState } from "react";
import { COUNTRIES, getCountry, isIndia, isOther, isValidCustomCode, effectiveCountryCode, detectCountryCode } from "@/utils/countries";

export default function LoginModalv2({
  openLoginModal,
  setOpenLoginModal,
  user,
  logIn,
  setLogIn,
  CheckLogin,
  source,
}) {
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

  // Auto-close the success state 1.5s after a successful login/signup.
  useEffect(() => {
    if (!data.success) return;
    const t = setTimeout(() => setOpenLoginModal(false), 1500);
    return () => clearTimeout(t);
  }, [data.success, setOpenLoginModal]);

  const country = getCountry(data.countryCode);
  const effectiveCC = effectiveCountryCode(data.countryCode, data.customCountryCode);

  const SendOTP = () => {
    setData({ ...data, loading: true, message: "" });
    if (isOther(data.countryCode) && !isValidCustomCode(data.customCountryCode)) {
      setData({ ...data, loading: false, message: "Enter a valid country code (e.g. +49)" });
      return;
    }
    if (isIndia(effectiveCC)) {
      fetch(`${process.env.NEXT_PUBLIC_API_URL}/auth/otp`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ phone: `+91${data.phone}` }),
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
          phone: `+91${data.phone}`,
          Otp: data.Otp,
          ReferenceId: data.ReferenceId,
          source: source || "",
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
    if (!data.name || !data.email) {
      setData({ ...data, message: "Name and email are required" });
      return;
    }
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

  const isPhoneValid = isIndia(effectiveCC)
    ? /^\d{10}$/.test(data.phone)
    : data.phone.length >= Math.min(8, country.digits);

  const customCodeOK = !isOther(data.countryCode) || isValidCustomCode(data.customCountryCode);

  const isDisabled = data.needsSignup
    ? !data.name || !data.email || data.loading
    : !data.phone || !isPhoneValid || !customCodeOK || data.loading || (data.otpSent ? !data.Otp : false);

  if (!(openLoginModal && logIn)) return null;

  const subtitle = data.needsSignup
    ? "Create your account"
    : source === "venue_enquiry"
    ? "Sign in to track your venue conversation"
    : "Welcome back";

  const serif = { fontFamily: "Georgia, 'Times New Roman', serif" };

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm"
      onClick={() => setOpenLoginModal(false)}
      role="dialog"
      aria-modal="true"
    >
      <div
        className="relative bg-[#fdf6ec] rounded-2xl shadow-2xl max-w-sm w-full mx-4 p-8"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Close X */}
        <button
          type="button"
          aria-label="Close"
          onClick={() => setOpenLoginModal(false)}
          className="absolute top-4 right-4 w-8 h-8 flex items-center justify-center text-[#6b1e2e] hover:opacity-70 transition-opacity"
        >
          <svg width="16" height="16" viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round">
            <line x1="3" y1="3" x2="13" y2="13" />
            <line x1="13" y1="3" x2="3" y2="13" />
          </svg>
        </button>

        {/* Header */}
        <div className="text-center">
          <h2 style={serif} className="text-[#6b1e2e] text-2xl tracking-widest">WEDSY</h2>
          <div className="h-px bg-[#b8852a] opacity-40 w-12 mx-auto my-2" />
          {!data.success && (
            <p className="text-[#7a5a48] text-sm">{subtitle}</p>
          )}
        </div>

        {data.success ? (
          <div className="mt-8 text-center">
            <div className="text-[#b8852a] text-5xl leading-none mb-3">✓</div>
            <div style={serif} className="text-[#6b1e2e] text-xl">You&apos;re signed in!</div>
          </div>
        ) : (
          <>
            <div className="mt-6 flex flex-col gap-5">
              {!data.needsSignup && (
                <>
                  <div className="flex gap-2 items-center border-b border-[#e8d8c4]">
                    {isOther(data.countryCode) ? (
                      <div className="w-[110px] flex items-center">
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
                          className="flex-1 min-w-0 bg-transparent border-0 outline-none focus:ring-0 text-[#2c1810] placeholder-[#b09080] text-center py-2"
                        />
                        <button
                          type="button"
                          onClick={() => setData({ ...data, countryCode: "+91", customCountryCode: "+" })}
                          disabled={data.otpSent}
                          title="Back to country list"
                          aria-label="Back to country list"
                          className="text-[#b09080] hover:text-[#6b1e2e] text-lg leading-none px-1"
                        >
                          ×
                        </button>
                      </div>
                    ) : (
                      <select
                        value={data.countryCode}
                        onChange={(e) => setData({ ...data, countryCode: e.target.value, phone: "" })}
                        disabled={data.otpSent}
                        className="w-[110px] bg-transparent border-0 outline-none focus:ring-0 text-[#2c1810] py-2"
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
                      className="flex-1 min-w-0 bg-transparent border-0 outline-none focus:ring-0 text-[#2c1810] placeholder-[#b09080] py-2"
                    />
                  </div>

                  {data.otpSent && (
                    <div className="border-b border-[#e8d8c4]">
                      <input
                        type="text"
                        placeholder="Enter OTP"
                        value={data.Otp}
                        onChange={(e) => setData({ ...data, Otp: e.target.value })}
                        name="otp"
                        className="w-full bg-transparent border-0 outline-none focus:ring-0 text-[#2c1810] placeholder-[#b09080] text-center tracking-widest py-2"
                      />
                    </div>
                  )}
                </>
              )}

              {data.needsSignup && (
                <>
                  <div className="border-b border-[#e8d8c4]">
                    <input
                      type="text"
                      placeholder="Your name"
                      value={data.name}
                      onChange={(e) => setData({ ...data, name: e.target.value })}
                      className="w-full bg-transparent border-0 outline-none focus:ring-0 text-[#2c1810] placeholder-[#b09080] py-2"
                    />
                  </div>
                  <div className="border-b border-[#e8d8c4]">
                    <input
                      type="email"
                      placeholder="Email address"
                      value={data.email}
                      onChange={(e) => setData({ ...data, email: e.target.value })}
                      className="w-full bg-transparent border-0 outline-none focus:ring-0 text-[#2c1810] placeholder-[#b09080] py-2"
                    />
                  </div>
                </>
              )}

              {data.message && (
                <p className="text-red-400 text-xs text-center">{data.message}</p>
              )}
            </div>

            <button
              type="submit"
              disabled={isDisabled}
              onClick={() => {
                if (data.needsSignup) {
                  handleSignup();
                } else if (data.otpSent) {
                  handleLogin();
                } else {
                  SendOTP();
                }
              }}
              className="mt-6 w-full bg-[#6b1e2e] text-[#fdf6ec] rounded-full py-3 hover:bg-[#8b2a3e] transition-colors disabled:opacity-50 flex items-center justify-center gap-2"
            >
              {data.loading ? (
                <>
                  <span className="inline-block w-4 h-4 rounded-full border-2 border-[#fdf6ec]/40 border-t-[#6b1e2e] animate-spin" />
                  <span>Loading...</span>
                </>
              ) : data.needsSignup ? (
                <>Create account</>
              ) : (
                <>Login</>
              )}
            </button>

            <p className="mt-3 text-[#b09080] text-xs text-center">
              By continuing, you agree to Wedsy&apos;s Terms
            </p>
          </>
        )}
      </div>
    </div>
  );
}
