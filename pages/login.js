import { Spinner } from "flowbite-react";
import Image from "next/image";
import { useState } from "react";
import { useRouter } from "next/router";
import { processMobileNumber } from "@/utils/phoneNumber";

export default function Login({ CheckLogin }) {
  let router = useRouter();
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
        phone: processMobileNumber(data.phone),
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
        phone: processMobileNumber(data.phone),
        Otp: data.Otp,
        ReferenceId: data.ReferenceId,
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
          router.push("/decor/view");
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
      <div
        className="relative h-[max-content] grid grid-cols-1 md:grid-cols-3"
        style={{
          backgroundImage: 'url("/assets/images/login-mobile.png")',
          backgroundSize: "cover",
          backgroundRepeat: "no-repeat",
        }}
      >
        <div className="hidden md:block md:col-span-2">
          <Image
            src={`/assets/images/login-image.png`}
            alt="Decor"
            width={0}
            height={0}
            sizes="100%"
            style={{ width: "100%", height: "auto" }}
          />
        </div>
        <div className="h-[189vw] md:h-auto m-6 md:m-0 bg-white/80 md:bg-gradient-to-t md:to-[#ABBBC7] md:from-white flex flex-col p-8 md:p-0 rounded-2xl md:rounded-none gap-6 md:gap-16 md:px-8 md:pb-32 items-center justify-center">
          <p className="font-semibold text-lg text-center mb-12 md:mb-0">{`"Together is a beautiful place to be. Join us as we say 'I do'!"`}</p>
          <div className=" gap-6 flex flex-col w-3/4">
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
            className="rounded-full bg-black text-white py-2 w-3/4 disabled:bg-black/50"
            disabled={
              !data.name ||
              !data.phone ||
              // !/^\d{10}$/.test(data.phone) ||
              !processMobileNumber(data.phone) ||
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
      </div>
    </>
  );
}
