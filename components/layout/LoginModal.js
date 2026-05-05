"use client";

import {
  Modal,
  Spinner
} from "flowbite-react";
import { useEffect, useState } from "react";
import { COUNTRIES, getCountry, isIndia, detectCountryCode } from "@/utils/countries";

export default function LoginModal({
  openLoginModal,
  setOpenLoginModal,
  user,
  logIn,
  setLogIn,
  CheckLogin,
}) {
  const [data, setData] = useState({
    countryCode: "+91",
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

  const country = getCountry(data.countryCode);

  const SendOTP = () => {
    setData({ ...data, loading: true, message: "" });
    if (isIndia(data.countryCode)) {
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
    }
  };

  const handleLogin = () => {
    setData({ ...data, loading: true });
    if (isIndia(data.countryCode)) {
      fetch(`${process.env.NEXT_PUBLIC_API_URL}/auth`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          phone: `+91${data.phone}`,
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
          countryCode: data.countryCode,
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
        countryCode: data.countryCode,
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

  const isPhoneValid = isIndia(data.countryCode)
    ? /^\d{10}$/.test(data.phone)
    : data.phone.length >= Math.min(8, country.digits);

  const isDisabled = data.needsSignup
    ? !data.name || !data.email || data.loading
    : !data.phone || !isPhoneValid || data.loading || (data.otpSent ? !data.Otp : false);

  return (
    <>
      <Modal
        show={openLoginModal && logIn}
        size="md"
        popup
        onClose={() => setOpenLoginModal(false)}
      >
        <Modal.Header />
        <Modal.Body>
          <div className="space-y-6">
            <h3 className="text-xl font-medium text-gray-900 dark:text-white text-center">
              {data.needsSignup ? "Create your account" : "Login to proceed"}
            </h3>
            <div className=" gap-6 flex flex-col w-2/3 mx-auto">
              {!data.needsSignup && (
                <>
                  <div className="flex gap-2">
                    <select
                      value={data.countryCode}
                      onChange={(e) => setData({ ...data, countryCode: e.target.value, phone: "" })}
                      disabled={data.otpSent}
                      className="w-28 text-black bg-transparent border-0 border-b border-b-black focus:ring-0"
                    >
                      {COUNTRIES.map((c) => (
                        <option key={`${c.code}-${c.name}`} value={c.code} title={c.name}>
                          {c.flag} {c.code}
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
                      className="flex-1 min-w-0 focus:ring-0 text-center text-black bg-transparent border-0 border-b border-b-black outline-0 placeholder:text-black"
                    />
                  </div>
                  {data.otpSent && (
                    <input
                      type="text"
                      placeholder="OTP"
                      value={data.Otp}
                      onChange={(e) => setData({ ...data, Otp: e.target.value })}
                      name="otp"
                      className="focus:ring-0 text-center text-black bg-transparent border-0 border-b border-b-black outline-0 outline-0 placeholder:text-black"
                    />
                  )}
                </>
              )}
              {data.needsSignup && (
                <>
                  <input
                    type="text"
                    placeholder="Name"
                    value={data.name}
                    onChange={(e) => setData({ ...data, name: e.target.value })}
                    className="focus:ring-0 text-center text-black bg-transparent border-0 border-b border-b-black outline-0 placeholder:text-black"
                  />
                  <input
                    type="email"
                    placeholder="Email"
                    value={data.email}
                    onChange={(e) => setData({ ...data, email: e.target.value })}
                    className="focus:ring-0 text-center text-black bg-transparent border-0 border-b border-b-black outline-0 placeholder:text-black"
                  />
                </>
              )}
              {data.message && <p className="text-red-500">{data.message}</p>}
            </div>
            <button
              type="submit"
              className="rounded-full bg-black text-white py-2 block w-3/4 mx-auto disabled:bg-black/50"
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
        </Modal.Body>
      </Modal>
    </>
  );
}
