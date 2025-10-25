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
      <div className="relative h-screen w-full flex overflow-hidden">
        {/* Left side - Background image area (60% width) */}
        <div className="hidden md:flex md:w-3/5 relative"
          style={{
            backgroundImage: 'url("/assets/background/bg-newLoginBackground.jpg")',
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
        <div className="flex-1 md:w-2/5 relative">
          {/* Background image */}
          <div 
            className="absolute inset-0"
            style={{
              backgroundImage: 'url("/assets/background/bg-newSignin.jpg")',
              backgroundSize: "cover",
              backgroundRepeat: "no-repeat",
              backgroundPosition: "center center",
            }}
          ></div>
          {/* Login form overlay */}
          <div className="absolute inset-0 bg-white/30 flex flex-col justify-center items-center">
          {/* Decorative border with flowers */}
          <div className="absolute inset-0 border-4 border-white/20 rounded-lg" style={{
            backgroundImage: 'url("data:image/svg+xml,%3Csvg xmlns=\'http://www.w3.org/2000/svg\' viewBox=\'0 0 100 100\'%3E%3Ccircle cx=\'50\' cy=\'50\' r=\'2\' fill=\'%23ffffff\' opacity=\'0.3\'/%3E%3C/svg%3E")',
            backgroundSize: '20px 20px'
          }}></div>
          
          <h2 className="text-2xl font-bold text-gray-800 mb-8">Sign in</h2>
          <div className="w-full max-w-sm space-y-6">
            <div>
              <input
                type="text"
                placeholder="Phone number"
                value={data.phone}
                onChange={(e) =>
                  setData({
                    ...data,
                    phone: e.target.value,
                  })
                }
                name="phone"
                className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-red-600 focus:border-transparent"
              />
            </div>
            {data.otpSent && (
              <div>
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
                  className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-red-600 focus:border-transparent"
                />
              </div>
            )}
            {data.message && <p className="text-red-500 text-sm">{data.message}</p>}
            <button
              type="submit"
              className="w-full bg-red-800 text-white py-3 rounded-lg font-semibold hover:bg-red-700 transition-colors duration-200 disabled:bg-gray-400"
              disabled={
                !data.phone ||
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
            <p className="text-center text-sm text-gray-600">
              Not signed in yet? <span className="text-red-800 font-semibold cursor-pointer">Sign up</span>
            </p>
          </div>
          </div>
        </div>
      </div>
    </>
  );
}
