"use client";

import { Modal, Spinner } from "flowbite-react";
import { useState } from "react";

export default function ExpertConsultModal({
  openModal,
  setOpenModal,
}) {
  const [data, setData] = useState({
    name: "",
    phone: "",
    loading: false,
    success: false,
    otpSent: false,
    Otp: "",
    ReferenceId: "",
    message: "",
  });

  const resetModal = () => {
    setData({
      name: "",
      phone: "",
      loading: false,
      success: false,
      otpSent: false,
      Otp: "",
      ReferenceId: "",
      message: "",
    });
  };

  const handleClose = () => {
    setOpenModal(false);
    setTimeout(resetModal, 300);
  };

  const SendOTP = () => {
    if (!data.name.trim()) {
      setData({ ...data, message: "Please enter your name" });
      return;
    }
    setData({
      ...data,
      loading: true,
      message: "",
    });
    fetch(`${process.env.NEXT_PUBLIC_API_URL}/auth/otp`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        phone: `+91${data.phone}`,
      }),
    })
      .then((response) => response.json())
      .then((response) => {
        setData({
          ...data,
          loading: false,
          otpSent: true,
          ReferenceId: response.ReferenceId,
          message: "",
        });
      })
      .catch((error) => {
        console.error("There was a problem with the fetch operation:", error);
        setData({
          ...data,
          loading: false,
          message: "Failed to send OTP. Please try again.",
        });
      });
  };

  const handleSubmit = () => {
    setData({
      ...data,
      loading: true,
      message: "",
    });

    // First verify OTP
    fetch(`${process.env.NEXT_PUBLIC_API_URL}/auth/otp/verify`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        phone: `+91${data.phone}`,
        Otp: data.Otp,
        ReferenceId: data.ReferenceId,
      }),
    })
      .then((response) => response.json())
      .then((response) => {
        if (response.verified || response.success || response.message === "OTP Verified") {
          // Submit expert consultation request
          return fetch(`${process.env.NEXT_PUBLIC_API_URL}/expert-consult`, {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify({
              name: data.name,
              phone: `+91${data.phone}`,
              source: "Landing Page - Connect With Expert",
            }),
          });
        } else {
          throw new Error(response.message || "Invalid OTP");
        }
      })
      .then((response) => {
        if (response) return response.json();
      })
      .then((response) => {
        setData({
          ...data,
          loading: false,
          success: true,
          message: "",
        });
      })
      .catch((error) => {
        console.error("There was a problem:", error);
        setData({
          ...data,
          loading: false,
          message: error.message || "Something went wrong. Please try again.",
        });
      });
  };

  return (
    <Modal
      show={openModal}
      size="md"
      popup
      onClose={handleClose}
    >
      <Modal.Header />
      <Modal.Body>
        <div className="space-y-6 pb-4">
          {!data.success ? (
            <>
              <div className="text-center">
                <h3 
                  className="text-2xl text-[#840032] mb-2"
                  style={{ fontFamily: "'Cinzel', serif", fontWeight: 500 }}
                >
                  Connect With An Expert
                </h3>
                <p className="text-sm text-gray-600">
                  Share your details and our wedding expert will reach out to you
                </p>
              </div>

              <div className="space-y-4">
                {/* Name Field */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Name
                  </label>
                  <input
                    type="text"
                    placeholder="Enter your name"
                    value={data.name}
                    onChange={(e) =>
                      setData({ ...data, name: e.target.value, message: "" })
                    }
                    disabled={data.otpSent}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#840032] focus:border-transparent outline-none transition-all disabled:bg-gray-100"
                  />
                </div>

                {/* Phone Field */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Phone Number
                  </label>
                  <div className="flex">
                    <span className="inline-flex items-center px-3 text-gray-600 bg-gray-100 border border-r-0 border-gray-300 rounded-l-lg">
                      +91
                    </span>
                    <input
                      type="tel"
                      placeholder="Enter 10-digit number"
                      value={data.phone}
                      onChange={(e) => {
                        const value = e.target.value.replace(/\D/g, '').slice(0, 10);
                        setData({ ...data, phone: value, message: "" });
                      }}
                      disabled={data.otpSent}
                      className="w-full px-4 py-3 border border-gray-300 rounded-r-lg focus:ring-2 focus:ring-[#840032] focus:border-transparent outline-none transition-all disabled:bg-gray-100"
                    />
                  </div>
                </div>

                {/* OTP Field - Shows after sending OTP */}
                {data.otpSent && (
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Enter OTP
                    </label>
                    <input
                      type="text"
                      placeholder="Enter 6-digit OTP"
                      value={data.Otp}
                      onChange={(e) => {
                        const value = e.target.value.replace(/\D/g, '').slice(0, 6);
                        setData({ ...data, Otp: value, message: "" });
                      }}
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#840032] focus:border-transparent outline-none transition-all text-center tracking-widest text-lg"
                    />
                    <p className="text-xs text-gray-500 mt-1 text-center">
                      OTP sent to +91{data.phone}
                    </p>
                  </div>
                )}

                {/* Error Message */}
                {data.message && (
                  <p className="text-red-500 text-sm text-center">{data.message}</p>
                )}
              </div>

              {/* Submit Button */}
              <button
                type="button"
                className="w-full bg-[#840032] text-white py-3 px-6 rounded-lg font-semibold tracking-wider
                          hover:bg-[#6a0029] transition-all duration-300 ease-in-out disabled:bg-gray-400 disabled:cursor-not-allowed"
                disabled={
                  !data.name.trim() ||
                  !data.phone ||
                  !/^\d{10}$/.test(data.phone) ||
                  data.loading ||
                  (data.otpSent && (!data.Otp || data.Otp.length < 4))
                }
                onClick={() => {
                  data.otpSent ? handleSubmit() : SendOTP();
                }}
                style={{ fontFamily: "'Montserrat', sans-serif" }}
              >
                {data.loading ? (
                  <span className="flex items-center justify-center">
                    <Spinner size="sm" className="mr-2" />
                    {data.otpSent ? "Verifying..." : "Sending OTP..."}
                  </span>
                ) : (
                  <>{data.otpSent ? "Submit" : "Get OTP"}</>
                )}
              </button>

              {/* Resend OTP */}
              {data.otpSent && (
                <button
                  type="button"
                  className="w-full text-[#840032] text-sm underline"
                  onClick={() => {
                    setData({ ...data, otpSent: false, Otp: "", ReferenceId: "", message: "" });
                  }}
                >
                  Change phone number
                </button>
              )}
            </>
          ) : (
            /* Success State */
            <div className="text-center py-6">
              <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <svg className="w-8 h-8 text-green-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                </svg>
              </div>
              <h3 
                className="text-2xl text-[#840032] mb-2"
                style={{ fontFamily: "'Cinzel', serif", fontWeight: 500 }}
              >
                Thank You!
              </h3>
              <p className="text-gray-600 mb-6">
                Our wedding expert will connect with you shortly.
              </p>
              <button
                type="button"
                className="bg-[#840032] text-white py-3 px-8 rounded-lg font-semibold
                          hover:bg-[#6a0029] transition-all duration-300 ease-in-out"
                onClick={handleClose}
                style={{ fontFamily: "'Montserrat', sans-serif" }}
              >
                Close
              </button>
            </div>
          )}
        </div>
      </Modal.Body>
    </Modal>
  );
}

