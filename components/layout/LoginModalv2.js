"use client";

import {
  Button,
  Checkbox,
  Label,
  Modal,
  Spinner,
  TextInput,
} from "flowbite-react";
import { useState } from "react";

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
    phone: "",
    name: "",
    loading: false,
    success: false,
    otpSent: false,
    Otp: "",
    ReferenceId: "",
    message: "",
  });
  const SendOTP = () => {
    setData({
      ...data,
      loading: true,
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
        });
      })
      .catch((error) => {
        console.error("There was a problem with the fetch operation:", error);
      });
  };
  const handleLogin = () => {
    setData({
      ...data,
      loading: true,
    });
    fetch(`${process.env.NEXT_PUBLIC_API_URL}/auth`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        name: data.name,
        phone: `+91${data.phone}`,
        Otp: data.Otp,
        ReferenceId: data.ReferenceId,
        source: source || "",
      }),
    })
      .then((response) => response.json())
      .then((response) => {
        if (response.message === "Login Successful" && response.token) {
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
          CheckLogin();
        } else {
          setData({
            ...data,
            loading: false,
            Otp: "",
            message: response.message,
          });
        }
      })
      .catch((error) => {
        console.error("There was a problem with the fetch operation:", error);
      });
  };
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
              Login to proceed
            </h3>
            <div className=" gap-6 flex flex-col w-2/3 mx-auto">
              <input
                type="text"
                placeholder="NAME (First and Last Name)"
                value={data.name}
                onChange={(e) =>
                  setData({
                    ...data,
                    name: e.target.value,
                  })
                }
                name="name"
                className="focus:ring-0 text-center text-black bg-transparent border-0 border-b border-b-black outline-0 outline-0 placeholder:text-black"
              />
              <input
                type="text"
                placeholder="PHONE NO."
                value={data.phone}
                onChange={(e) =>
                  setData({
                    ...data,
                    phone: e.target.value,
                  })
                }
                name="phone"
                className="focus:ring-0 text-center text-black bg-transparent border-0 border-b border-b-black outline-0 outline-0 placeholder:text-black"
              />
              {data.otpSent && (
                <input
                  type="text"
                  placeholder="OTP"
                  value={data.Otp}
                  onChange={(e) =>
                    setData({
                      ...data,
                      Otp: e.target.value,
                    })
                  }
                  name="otp"
                  className="focus:ring-0 text-center text-black bg-transparent border-0 border-b border-b-black outline-0 outline-0 placeholder:text-black"
                />
              )}
              {data.message && <p className="text-red-500">{data.message}</p>}
            </div>
            <button
              type="submit"
              className="rounded-full bg-black text-white py-2 block w-3/4 mx-auto disabled:bg-black/50"
              disabled={
                !data.name ||
                !data.phone ||
                !/^\d{10}$/.test(data.phone) ||
                data.loading ||
                (data.otpSent ? !data.Otp : false)
              }
              onClick={() => {
                data.otpSent ? handleLogin() : SendOTP();
              }}
            >
              {data.loading ? (
                <>
                  <Spinner size="sm" />
                  <span className="pl-3">Loading...</span>
                </>
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
