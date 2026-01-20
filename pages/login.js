import { processMobileNumber } from "@/utils/phoneNumber";
import { Spinner } from "flowbite-react";
import Head from "next/head";
import { useRouter } from "next/router";
import { useState } from "react";

export default function Login({ CheckLogin }) {
  const router = useRouter();
  const [data, setData] = useState({
    phone: "",
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
      <Head>
        <title>Login | Wedsy</title>
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
          
          <h2 className="text-2xl font-bold text-gray-800 mb-8 z-20">Sign in</h2>
          <div className="w-full max-w-sm space-y-6 z-20">
            <div className="relative z-30">
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
                className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-red-600 focus:border-transparent relative z-30"
                style={{
                  boxShadow: "0px 4px 4px 0px #00000040"
                }}
              />
            </div>
            {data.otpSent && (
              <div className="relative z-30">
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
                  className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-red-600 focus:border-transparent relative z-30"
                  style={{
                    boxShadow: "0px 4px 4px 0px #00000040"
                  }}
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
