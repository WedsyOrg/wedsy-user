import ExpertConsultModal from "@/components/modal/ExpertConsultModal";
import PlanYourEvent from "@/components/screens/PlanYourEvent";
import { LandingPageSkeleton } from "@/components/skeletons/landing_page";
import VendorUserSection from "@/pages/reuseableComponents/VendorUserSection";
import CountryCodeSelector from "@/components/other/CountryCodeSelector";
import NotificationToast from "@/components/other/NotificationToast";
import styles from "@/styles/Home.module.css";
import { processMobileNumber } from "@/utils/phoneNumber";
import { trimTitle, trimDescription, OG_IMAGES } from "@/utils/seo";
import { pushDataLayer } from "@/utils/tracking";
import { motion, AnimatePresence } from "framer-motion";
import Head from "next/head";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/router";
import { useEffect, useState, useRef } from "react";

// Animation variants for fade-in on scroll
const fadeInUp = {
  hidden: { opacity: 0, y: 30 },
  visible: { 
    opacity: 1, 
    y: 0,
    transition: { duration: 0.6, ease: "easeOut" }
  }
};

const fadeIn = {
  hidden: { opacity: 0 },
  visible: { 
    opacity: 1,
    transition: { duration: 0.6, ease: "easeOut" }
  }
};

const staggerContainer = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.03,
      delayChildren: 0
    }
  }
};

const staggerItem = {
  hidden: { opacity: 0, y: 20 },
  visible: { 
    opacity: 1, 
    y: 0,
    transition: { duration: 0.5, ease: "easeOut" }
  }
};

function Home({ packages, userLoggedIn, setOpenLoginModalv2, setSource }) {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(true);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [openExpertModal, setOpenExpertModal] = useState(false);
  const [currentReviewIndex, setCurrentReviewIndex] = useState(0);
  const videoRef = useRef(null);
  const mobileVideoRef = useRef(null);
  const trendingCarouselRef = useRef(null);
  const [trendingSlideIndex, setTrendingSlideIndex] = useState(0);

  // Reviews data
  const reviews = [
    "The creative execution by Wedsy was truly commendable. His suggestions added depth and character to the setup. The final result looked classy and cohesive. Both families were very impressed.",
    "The Wedsy team were responsible for my Wedding reception decoration at Chancery Pavilion - Bangalore. They provide really good decor designs at a reasonable cost. Thank you for the Wedsy team for your hardwork and for making our day even more wonderful.",
    "The whole team was very professional and they ensured that they completely understood my needs and budget for my event during the initial stages and later executed it perfectly. Kudos to the great work Wedsy is doing"
  ];

  // Auto-change reviews every 5 seconds
  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentReviewIndex((prevIndex) => (prevIndex + 1) % reviews.length);
    }, 5000); // Change every 5 seconds

    return () => clearInterval(interval);
  }, [reviews.length]);

  // Wedding planning cards carousel: auto-slide on mobile (3 cards)
  const TRENDING_CARDS_COUNT = 3;
  useEffect(() => {
    const el = trendingCarouselRef.current;
    if (!el) return;
    const interval = setInterval(() => {
      setTrendingSlideIndex((prev) => {
        const next = (prev + 1) % TRENDING_CARDS_COUNT;
        const slideWidth = el.scrollWidth / TRENDING_CARDS_COUNT;
        el.scrollTo({ left: next * slideWidth, behavior: "smooth" });
        return next;
      });
    }, 4500);
    return () => clearInterval(interval);
  }, []);
  
  const categoryList = [
    "Stage",
    "Pathway",
    "Entrance",
    "Photobooth",
    "Mandap",
    "Nameboard",
  ];

    {/* faq section */}
    const faqsData = [
      {
        question: "Why should I choose Wedsy for my wedding planning in Bangalore?",
        answer: "Planning a wedding is one of the most exciting yet overwhelming experiences in life. At Wedsy, we're here to make it beautiful, seamless, and truly yours. As one of the top wedding planners in Bangalore, our goal is simple — to bring your vision to life with creativity, care, and absolute attention to detail. Whether you're planning a grand celebration or an intimate gathering, Wedsy ensures your special day feels magical from start to finish."
      },
      {
        question: "What makes Wedsy different from other wedding planners?",
        answer: "At Wedsy, we understand that no two weddings are the same. From traditional South Indian ceremonies to modern fusion weddings, our team designs events that feel personal and unforgettable. Our services include: End-to-End Planning, Customized Wedding Packages, Budget-Friendly Solutions, Creative Vision, and an Experienced Vendor Network."
      },
      {
        question: "Do you offer wedding packages in Bangalore?",
        answer: "Yes, we offer a variety of wedding packages in Bangalore to suit every size, style, and setting. From classic indoor weddings to outdoor garden ceremonies, our packages are fully managed to simplify your planning journey."
      },
      {
        question: "What are your affordable wedding packages?",
        answer: "Our affordable wedding packages include venue styling, guest management, photography, entertainment, rituals, and more — all customized to your needs. We ensure quality while keeping the budget in mind."
      },
      {
        question: "Can you help with low budget wedding planning in Bangalore?",
        answer: "Absolutely. Even with a limited budget, you deserve a celebration to remember. We specialize in elegant, cost-effective solutions for couples looking for low budget wedding planners in Bangalore."
      },
      {
        question: "Do you plan destination weddings in India?",
        answer: "Yes, Wedsy specializes in stunning destination weddings across India. Whether you want a beachside wedding in Goa, hill station like Coorg, Ooty, a regal palace in Rajasthan, or a hilltop ceremony, we make it happen smoothly and affordably."
      },
      {
        question: "What's included in your affordable destination wedding packages?",
        answer: "Our affordable destination wedding packages in India include: Complete travel and accommodation coordination, Culturally sensitive planning for any location, On-site vendor and logistics management. We take care of everything so you can focus on celebrating your love."
      },
      {
        question: "Are destination weddings really affordable with Wedsy?",
        answer: "Yes. At Wedsy, we believe your dream wedding should never feel out of budget. Our affordable destination wedding packages balance style, value, and experience — with every detail handled for you."
      },
      {
        question: "Why do couples trust Wedsy for wedding event planning?",
        answer: "We're not just planners — we're partners in your journey. From your first consultation to the final dance, we make sure every detail is perfect. Choosing Wedsy means peace of mind, knowing your wedding will be exactly as planned — or even better."
      },
      {
        question: "What is the Event Tool?",
        answer: "The Event Tool is a specially designed organizational feature for your events. Simply create an event, such as \"Rahul's Wedding,\" and add multiple event days like haldi, sangeet, and the wedding ceremony. Once set up, you can easily add your selected décor from our Décor Store to the respective event days. This tool ensures your event stays well-organized and hassle-free."
      },
      {
        question: "Do you offer discounts?",
        answer: "Yes. Wedsy provides discounts on the overall list of requirements for your wedding. Don't forget to ask your wedding planner for the best available offers."
      },
      {
        question: "Who is the best wedding planner in Bangalore?",
        answer: "Wedsy is a full service wedding planner in Bangalore offering end to end wedding planning, decor execution, and makeup services. With verified vendors, transparent pricing, and managed execution, Wedsy helps couples plan stress free weddings across Bangalore and nearby destinations."
      },
      {
        question: "What wedding planning services does Wedsy offer in Bangalore?",
        answer: "Wedsy offers complete wedding planning services in Bangalore including venue selection, wedding decor, bridal and groom makeup, vendor coordination, and on ground execution for all wedding events."
      },
      {
        question: "Can I book wedding decor and makeup separately in Bangalore?",
        answer: "Yes. Wedsy allows couples to book wedding decor and makeup services separately in Bangalore without opting for full wedding planning."
      },
      {
        question: "Does Wedsy handle complete wedding execution in Bangalore?",
        answer: "Yes. From planning to on ground execution, Wedsy takes full responsibility for timelines, vendors, service quality, and coordination across all wedding events in Bangalore."
      },
      {
        question: "Why should I choose Wedsy as my wedding planner in Bangalore?",
        answer: "Wedsy combines structured planning, verified vendors, transparent pricing, and single point accountability, making it one of the most reliable wedding planners in Bangalore."
      },
    ];

    const [openIndex, setOpenIndex] = useState(null);

    const toggleFAQ = (index) => {
      setOpenIndex(openIndex === index ? null : index);
    };
    {/* faq section end */}

  const decorList = [
    {
      id: "Stage",
      text: "Your one-stop shop for affordable and elegant weddings. Simplify planning with fixed-price stage decor, creative entry ideas, stylish furniture rentals, and more. Where affordability meets creativity for your special day.",
      image: "/assets/images/stage.webp",
    },
    {
      id: "Pathway",
      text: "Your one-stop shop for affordable and elegant weddings. Simplify planning with fixed-price stage decor, creative entry ideas, stylish furniture rentals, and more. Where affordability meets creativity for your special day.",
      image: "/assets/images/pathway.webp",
    },
    {
      id: "Entrance",
      text: "Your one-stop shop for affordable and elegant weddings. Simplify planning with fixed-price stage decor, creative entry ideas, stylish furniture rentals, and more. Where affordability meets creativity for your special day.",
      image: "/assets/images/entrance.webp",
    },
    {
      id: "Photobooth",
      text: "Your one-stop shop for affordable and elegant weddings. Simplify planning with fixed-price stage decor, creative entry ideas, stylish furniture rentals, and more. Where affordability meets creativity for your special day.",
      image: "/assets/images/photobooth.webp",
    },
    {
      id: "Mandap",
      text: "Your one-stop shop for affordable and elegant weddings. Simplify planning with fixed-price stage decor, creative entry ideas, stylish furniture rentals, and more. Where affordability meets creativity for your special day.",
      image: "/assets/images/mandap.webp",
    },
    {
      id: "Nameboard",
      text: "Your one-stop shop for affordable and elegant weddings. Simplify planning with fixed-price stage decor, creative entry ideas, stylish furniture rentals, and more. Where affordability meets creativity for your special day.",
      image: "/assets/images/nameboard.webp",
    },
  ];
  const [tempDecorList, setTempDecorList] = useState([]);
  const [decorIndex, setDecorIndex] = useState(0);
  const [data, setData] = useState({
    main: { phone: "", name: "", loading: false, success: false },
    secondary: {
      phone: "",
      name: "",
      loading: false,
      success: false,
      otpSent: false,
      Otp: "",
      ReferenceId: "",
      message: "",
    },
  });
  const [isHovered, setIsHovered] = useState(false);
  const handleMouseEnter = () => {
    setIsHovered(true);
  };
  const handleMouseLeave = () => {
    setIsHovered(false);
  };

  // Wedding Requirement Form State
  const [selectedBudget, setSelectedBudget] = useState("5-10");
  const [weddingFormData, setWeddingFormData] = useState({
    name: "",
    date: "",
    phone: "",
  });
  const [isWeddingSubmitting, setIsWeddingSubmitting] = useState(false);
  const [isWeddingSubmitted, setIsWeddingSubmitted] = useState(false);
  const [phoneError, setPhoneError] = useState("");
  const [isDateDropdownOpen, setIsDateDropdownOpen] = useState(false);
  const [countryCode, setCountryCode] = useState("+91");
  const [showOTPForm, setShowOTPForm] = useState(false);
  const [otpSent, setOtpSent] = useState(false);
  const [otpValue, setOtpValue] = useState(["", "", "", "", "", ""]);
  const [otpReferenceId, setOtpReferenceId] = useState("");
  const [otpError, setOtpError] = useState("");
  const [toast, setToast] = useState({ show: false, message: "", type: "error" });
  const [resendCooldown, setResendCooldown] = useState(0);

  const dateOptions = [
    "Before 3 months",
    "Between 3-6 months",
    "Beyond 6 months",
  ];

  const handleWeddingInputChange = (field, value) => {
    if (field === 'phone') {
      // For India, limit to 10 digits, for others allow more flexibility
      const maxLength = countryCode === "+91" ? 10 : 15;
      const numericValue = value.replace(/\D/g, '').slice(0, maxLength);
      setWeddingFormData((prev) => ({ ...prev, [field]: numericValue }));
      
      // Real-time validation
      if (numericValue.length > 0) {
        validateWeddingPhone(numericValue);
      } else {
        setPhoneError("");
      }
    } else {
      setWeddingFormData((prev) => ({ ...prev, [field]: value }));
    }
  };

  const validateWeddingPhone = (phone) => {
    const cleanPhone = phone.replace(/\D/g, '');
    
    if (cleanPhone.length === 0) {
      setPhoneError("");
      return false;
    }
    
    // India-specific validation
    if (countryCode === "+91") {
      if (cleanPhone.length < 10) {
        setPhoneError("Phone number must be 10 digits");
        return false;
      }
      
      if (cleanPhone.length > 10) {
        setPhoneError("Phone number cannot exceed 10 digits");
        return false;
      }
      
      // Validate Indian phone number (should start with 6, 7, 8, or 9)
      if (!/^[6-9]/.test(cleanPhone)) {
        setPhoneError("Phone number must start with 6, 7, 8, or 9");
        return false;
      }
      
      // Final validation - must be exactly 10 digits and start with 6-9
      if (cleanPhone.length === 10 && /^[6-9]\d{9}$/.test(cleanPhone)) {
        setPhoneError("");
        return true;
      }
      
      setPhoneError("Please enter a valid 10-digit phone number");
      return false;
    } else {
      // For other countries, just check minimum length
      if (cleanPhone.length < 7) {
        setPhoneError("Please enter a valid phone number");
        return false;
      }
      
      if (cleanPhone.length > 15) {
        setPhoneError("Phone number is too long");
        return false;
      }
      
      setPhoneError("");
      return true;
    }
  };

  const sendOTP = async () => {
    if (!weddingFormData.name.trim()) {
      setToast({ show: true, message: "Please enter your name", type: "error" });
      return;
    }
    
    if (!weddingFormData.phone.trim()) {
      setPhoneError("Phone number is required");
      return;
    }
    
    if (!validateWeddingPhone(weddingFormData.phone)) {
      return;
    }
    
    setIsWeddingSubmitting(true);
    setOtpError("");
    
    try {
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/auth/otp`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          phone: `${countryCode}${weddingFormData.phone}`,
        }),
      });
      
      const result = await response.json();
      
      if (result.ReferenceId) {
        setOtpReferenceId(result.ReferenceId);
        setOtpSent(true);
        setShowOTPForm(true);
        setResendCooldown(60); // Start 60 second cooldown
        // Store phone format for verification (must match exactly)
        console.log("OTP sent successfully. Phone:", `${countryCode}${weddingFormData.phone}`, "ReferenceId:", result.ReferenceId);
      } else {
        setOtpError("Failed to send OTP. Please try again.");
      }
    } catch (error) {
      console.error("Error sending OTP:", error);
      setOtpError("Failed to send OTP. Please try again.");
    } finally {
      setIsWeddingSubmitting(false);
    }
  };

  const resendOTP = async () => {
    if (resendCooldown > 0) return; // Prevent resend during cooldown
    
    setIsWeddingSubmitting(true);
    setOtpError("");
    setOtpValue(["", "", "", "", "", ""]); // Clear previous OTP
    
    try {
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/auth/otp`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          phone: `${countryCode}${weddingFormData.phone}`,
        }),
      });
      
      const result = await response.json();
      
      if (result.ReferenceId) {
        setOtpReferenceId(result.ReferenceId);
        setResendCooldown(60); // Start 60 second cooldown
        setToast({ show: true, message: "OTP resent successfully!", type: "success" });
      } else {
        setOtpError("Failed to resend OTP. Please try again.");
      }
    } catch (error) {
      console.error("Error resending OTP:", error);
      setOtpError("Failed to resend OTP. Please try again.");
    } finally {
      setIsWeddingSubmitting(false);
    }
  };

  // Countdown timer for resend OTP
  useEffect(() => {
    let interval = null;
    if (resendCooldown > 0) {
      interval = setInterval(() => {
        setResendCooldown((prev) => {
          if (prev <= 1) {
            clearInterval(interval);
            return 0;
          }
          return prev - 1;
        });
      }, 1000);
    }
    return () => {
      if (interval) clearInterval(interval);
    };
  }, [resendCooldown]);

  const verifyOTP = async () => {
    const otpString = otpValue.join('');
    
    if (otpString.length !== 6) {
      setOtpError("Please enter complete OTP");
      return;
    }
    
    setIsWeddingSubmitting(true);
    setOtpError("");
    
    // Use the SAME endpoint as login - /auth (not /auth/otp/verify)
    const phoneNumber = `${countryCode}${weddingFormData.phone}`;
    
    // Use EXACT same pattern as login/signup
    fetch(`${process.env.NEXT_PUBLIC_API_URL}/auth`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        phone: phoneNumber,
        Otp: otpString,
        ReferenceId: otpReferenceId,
        name: weddingFormData.name,
        source: "Wedding Requirements Form",
      }),
    })
      .then((response) => response.json())
      .then((response) => {
        // Use EXACT same check as login
        if (response.message === "Login Successful" && response.token) {
          // OTP verified successfully - pass true for Verified
          submitWeddingForm(true);
        } else {
          // Use EXACT same error handling as login
          setOtpError(response.message || "Invalid OTP. Please try again.");
          setOtpValue(["", "", "", "", "", ""]);
          setIsWeddingSubmitting(false);
        }
      })
      .catch((error) => {
        console.error("Error verifying OTP:", error);
        setOtpError("Failed to verify OTP. Please try again.");
        setIsWeddingSubmitting(false);
      });
  };

  const submitWeddingForm = async (isVerified = false) => {
    const budgetMap = {
      "5-10": 750000,
      "10-15": 1250000,
      "20+": 2000000,
    };

    const budgetValue = budgetMap[selectedBudget] || 750000;

    const formDataToSend = new FormData();
    formDataToSend.append('name', weddingFormData.name || '');
    formDataToSend.append('phone', `${countryCode}${weddingFormData.phone}` || '');
    formDataToSend.append('budget', budgetValue.toString());
    formDataToSend.append('date', weddingFormData.date || '');
    formDataToSend.append('Verified', isVerified ? "Verified" : "Pending");

    await fetch(
      `${process.env.NEXT_PUBLIC_SHEET_URL}`,
      {
        method: 'POST',
        mode: 'no-cors',
        body: formDataToSend
      }
    );

    setIsWeddingSubmitted(true);
    setWeddingFormData({ name: "", date: "", phone: "" });
    setSelectedBudget("5-10");
    setPhoneError("");
    setShowOTPForm(false);
    setOtpSent(false);
    setOtpValue(["", "", "", "", "", ""]);
    setOtpReferenceId("");
    setResendCooldown(0);
  };

  const handleWeddingSubmit = async (e) => {
    e.preventDefault();
    
    // Validate name
    if (!weddingFormData.name.trim()) {
      setToast({ show: true, message: "Please enter your name", type: "error" });
      return;
    }
    
    // Validate phone
    if (!weddingFormData.phone.trim()) {
      setPhoneError("Phone number is required");
      return;
    }
    
    // Validate phone format
    if (!validateWeddingPhone(weddingFormData.phone)) {
      return;
    }
    
    // If India, send OTP first
    if (countryCode === "+91") {
      await sendOTP();
    } else {
      // For non-India, submit directly - pass false for Pending
      setIsWeddingSubmitting(true);
      try {
        await submitWeddingForm(false);
      } catch (error) {
        console.error("Error submitting form:", error);
        setToast({ show: true, message: "Error submitting form. Please try again.", type: "error" });
      } finally {
        setIsWeddingSubmitting(false);
      }
    }
  };

  const handleOtpChange = (index, value, isMobile = false) => {
    if (value.length > 1) return; // Only allow single digit
    
    const newOtp = [...otpValue];
    newOtp[index] = value.replace(/\D/g, ''); // Only digits
    setOtpValue(newOtp);
    setOtpError("");
    
    // Auto-focus next input
    if (value && index < 5) {
      const nextInputId = isMobile ? `otp-mobile-${index + 1}` : `otp-${index + 1}`;
      const nextInput = document.getElementById(nextInputId);
      if (nextInput) nextInput.focus();
    }
  };

  const handleOtpKeyDown = (index, e, isMobile = false) => {
    if (e.key === 'Backspace' && !otpValue[index] && index > 0) {
      const prevInputId = isMobile ? `otp-mobile-${index - 1}` : `otp-${index - 1}`;
      const prevInput = document.getElementById(prevInputId);
      if (prevInput) prevInput.focus();
    }
  };

  const handleMainEnquiry = async () => {
    if (await processMobileNumber(data.main.phone)) {
      setData({
        ...data,
        main: { ...data.main, loading: true },
      });
      fetch(`${process.env.NEXT_PUBLIC_API_URL}/enquiry`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          name: data.main.name,
          phone: processMobileNumber(data.main.phone),
          verified: false,
          source: "Landing Screen",
        }),
      })
        .then((response) => {
          if (response.ok) {
            setData({
              ...data,
              main: { phone: "", name: "", loading: false, success: true },
            });
            pushDataLayer("Lead", { form_name: "LandingMainEnquiry" });
            import("react-facebook-pixel")
              .then((x) => x.default)
              .then((ReactPixel) => ReactPixel.track("Lead"));
          }
        })
        .catch((error) => {
          console.error("There was a problem with the fetch operation:", error);
        });
    } else {
      setToast({ show: true, message: "Please enter valid mobile number", type: "error" });
    }
  };

  useEffect(() => {
    try {
      setIsLoggedIn(Boolean(localStorage.getItem("token")));
    } catch (e) {
      // no-op (SSR / restricted environments)
    }
  }, []);
  const handleSecondaryEnquiry = () => {
    setData({
      ...data,
      secondary: { ...data.secondary, loading: true },
    });
    fetch(`${process.env.NEXT_PUBLIC_API_URL}/enquiry`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        name: data.secondary.name,
        phone: processMobileNumber(data.secondary.phone),
        verified: true,
        source: "Landing Page | Speak to Expert",
        Otp: data.secondary.Otp,
        ReferenceId: data.secondary.ReferenceId,
      }),
    })
      .then((response) => response.json())
      .then((response) => {
        if (
          response.message === "Enquiry Added Successfully" &&
          response.token
        ) {
          setData({
            ...data,
            secondary: {
              phone: "",
              name: "",
              loading: false,
              success: true,
              otpSent: false,
              Otp: "",
              ReferenceId: "",
              message: "",
            },
          });
          localStorage.setItem("token", response.token);
          pushDataLayer("Lead", { form_name: "SpeakToExpert" });
          import("react-facebook-pixel")
            .then((x) => x.default)
            .then((ReactPixel) => ReactPixel.track("Lead"));
        } else {
          setData({
            ...data,
            secondary: {
              ...data.secondary,
              loading: false,
              Otp: "",
              message: response.message,
            },
          });
        }
      })
      .catch((error) => {
        console.error("There was a problem with the fetch operation:", error);
      });
  };
  const SendOTP = async () => {
    if (await processMobileNumber(data.secondary.phone)) {
      setData({
        ...data,
        secondary: { ...data.secondary, loading: true },
      });
      fetch(`${process.env.NEXT_PUBLIC_API_URL}/auth/otp`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          phone: processMobileNumber(data.secondary.phone),
        }),
      })
        .then((response) => response.json())
        .then((response) => {
          setData({
            ...data,
            secondary: {
              ...data.secondary,
              loading: false,
              otpSent: true,
              ReferenceId: response.ReferenceId,
            },
          });
        })
        .catch((error) => {
          console.error("There was a problem with the fetch operation:", error);
        });
    } else {
      setToast({ show: true, message: "Please enter valid mobile number", type: "error" });
    }
  };
  // Use real data loading instead of simulated loading
  useEffect(() => {
    if (packages) {
      setIsLoading(false);
    }
  }, [packages]);

  useEffect(() => {
    let length = decorList.length;
    let array = [1, 2, 3, 4, 5];
    let diff = decorIndex - array[2];
    array = array.map((i) => {
      let a1 = i + diff;
      if (a1 < 0) {
        a1 += length;
      } else if (a1 > length - 1) {
        a1 -= length;
      }
      return a1;
    });
    let list = array.map((i) => decorList[i]);
    setTempDecorList(list);
  }, [decorIndex]);
  useEffect(() => {
    const intervalId = setInterval(() => {
      if (!isHovered) {
        let length = decorList.length;
        let item = decorIndex;
        if (item === length - 1) {
          item = 0;
        } else {
          item++;
        }
        setDecorIndex(item);
      }
    }, 2000);
    return () => {
      clearInterval(intervalId);
    };
  }, [decorIndex, isHovered]);

  // Ensure video loops continuously
  const handleVideoEnded = () => {
    if (videoRef.current) {
      videoRef.current.currentTime = 0;
      videoRef.current.play();
    }
  };

  const handleMobileVideoEnded = () => {
    if (mobileVideoRef.current) {
      mobileVideoRef.current.currentTime = 0;
      mobileVideoRef.current.play();
    }
  };

  // Generate FAQ Schema
  const faqSchema = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    "mainEntity": faqsData.map((faq) => ({
      "@type": "Question",
      "name": faq.question,
      "acceptedAnswer": {
        "@type": "Answer",
        "text": faq.answer
      }
    }))
  };

  // Generate Organization Schema
  const organizationSchema = {
    "@context": "https://schema.org",
    "@type": "Organization",
    "name": "Wedsy",
    "description": "India's first online wedding planning platform. Premium wedding decorations, makeup artists, and event planning services in Bangalore.",
    "url": "https://www.wedsy.in",
    "logo": "https://www.wedsy.in/logo-black.webp",
    "contactPoint": {
      "@type": "ContactPoint",
      "telephone": "+91-6364849760",
      "contactType": "Customer Service",
      "email": "hello@wedsy.in",
      "areaServed": "IN",
      "availableLanguage": "English"
    },
    "address": {
      "@type": "PostalAddress",
      "streetAddress": "#14, HM Geneva House, Cunningham Road",
      "addressLocality": "Bangalore",
      "addressRegion": "Karnataka",
      "postalCode": "560052",
      "addressCountry": "IN"
    },
    "sameAs": [
      "https://www.facebook.com/wedsy.in",
      "https://www.instagram.com/wedsy.in",
      "https://x.com/wedsyindia"
    ]
  };

  // Show skeleton while loading
  if (isLoading) {
    return <LandingPageSkeleton />;
  }

  return (
    <>
      <Head>
        <title>
          {trimTitle("Affordable Wedding Packages in Bangalore - Best Planners in Bangalore")}
        </title>
        <meta
          name="description"
          content={trimDescription("Find affordable wedding planners in Bangalore. Explore budget-friendly wedding, event, and destination packages in India. Tailored solutions for your perfect day!")}
        />
        <meta
          name="keywords"
          content="event planners in bangalore,wedding planners in bangalore,event decorators in bangalore,best wedding planners in bangalore,top wedding planners in bangalore"
        />
        <link rel="canonical" href="https://www.wedsy.in/"/>
        <meta name="robots" content="index, follow" />
        <meta name="copyright" content="Wedsy" />
        <meta name="language" content="EN" />
        
        {/* Open Graph Tags */}
        <meta property="og:title" content="Affordable Wedding Packages in Bangalore - Best Planners in Bangalore | Wedsy" />
        <meta property="og:description" content="Find affordable wedding planners in Bangalore. Explore budget-friendly wedding, event, and destination packages in India. Tailored solutions for your perfect day!" />
        <meta property="og:image" content={OG_IMAGES.default} />
        <meta property="og:url" content="https://www.wedsy.in/" />
        <meta property="og:type" content="website" />
        <meta property="og:site_name" content="Wedsy" />
        
        {/* Twitter Card Tags */}
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:title" content="Affordable Wedding Packages in Bangalore - Best Planners in Bangalore | Wedsy" />
        <meta name="twitter:description" content="Find affordable wedding planners in Bangalore. Explore budget-friendly wedding, event, and destination packages in India." />
        <meta name="twitter:image" content={OG_IMAGES.default} />
        
        {/* Structured Data */}
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(organizationSchema) }}
        />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(faqSchema) }}
        />
      </Head>
      <div className="hidden">
        <h1>Affordable & Best Wedding Planner in Bangalore</h1>
        <h2>Best Budget-Friendly Wedding & Destination Packages in India</h2>
      </div>
      <main
        className="relative flex flex-col justify-around gap-6 md:gap-12 min-h-screen w-full overflow-hidden"
        id="mainDiv"
      >
        {/* Video Background - Desktop (lg and above) */}
        <video
          ref={videoRef}
          autoPlay
          loop
          muted
          playsInline
          onEnded={handleVideoEnded}
          className="hidden lg:block absolute inset-0 w-full h-full object-cover z-0"
          preload="auto"
        >
          {/* MP4 format for cross-browser compatibility (Chrome, Firefox, Edge, Safari) */}
          <source
            src="/assets/landing_v2/hero.mp4"
            type="video/mp4"
          />
          {/* Fallback MOV for Safari */}
          <source
            src="/assets/landing_v2/hero.MOV"
            type="video/quicktime"
          />
          {/* Fallback message */}
          Your browser does not support the video tag.
        </video>

        {/* Video Background - Mobile (below lg) */}
        <video
          ref={mobileVideoRef}
          autoPlay
          loop
          muted
          playsInline
          onEnded={handleMobileVideoEnded}
          className="block lg:hidden absolute inset-0 w-full h-full object-cover z-0"
          preload="auto"
        >
          {/* MP4 format for cross-browser compatibility (Chrome, Firefox, Edge, Safari) */}
          <source
            src="/assets/landing_v2/hero_mobile.mp4"
            type="video/mp4"
          />
          {/* Fallback MOV for Safari */}
          <source
            src="/assets/landing_v2/hero_mobile.MOV"
            type="video/quicktime"
          />
          {/* Fallback message */}
          Your browser does not support the video tag.
        </video>

        {/* Dark overlay on top of video */}
        <div className="absolute inset-0 bg-black/50 z-[1]"></div>

        {/* Content Overlay */}
        <div className="relative z-10 flex flex-col items-center justify-center min-h-screen px-4 text-center">
          {/* Main Heading */}
          <motion.h1
            className="text-4xl md:text-6xl lg:text-7xl text-white mb-3"
            style={{
              fontFamily: "'Dream Avenue', serif",
              fontWeight: 400,
              fontStyle: "normal",
            }}
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.6 }}
            transition={{ duration: 1.2, ease: [0.22, 1, 0.36, 1] }}
          >
            Luxury weddings, seamlessly planned.
          </motion.h1>

          {/* Subtext */}
          <motion.p
            className="text-md md:text-xl lg:text-3xl text-white mb-8"
            style={{
              fontFamily: "'Montserrat', sans-serif",
              fontWeight: 400,
              fontStyle: "normal",
            }}
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.6 }}
            transition={{ duration: 1.0, ease: [0.16, 1, 0.3, 1], delay: 0.2 }}
          >
            Complete wedding planning, from start to celebration.<br />
    
            <span className="hidden sm:block lg:hidden">Tech Enabled</span>
          </motion.p>

          {/* CTA Button */}
          <motion.button
            onClick={() => {
              const element = document.getElementById('wedding-requirement-section');
              if (element) {
                element.scrollIntoView({ behavior: 'smooth', block: 'start' });
              }
            }}
              className="bg-black/30 backdrop-blur-md border-2 border-white text-white py-4 text-xs md:text-lg lg:text-lg font-semibold tracking-widest px-16 rounded-2xl
                      hover:bg-white/40 transition-all duration-300 ease-in-out cursor-pointer"
              style={{
              fontFamily: "'Cinzel', serif",
                fontWeight: 600,
              }}
            initial={{ opacity: 0, scale: 0.9 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true, amount: 0.5 }}
            transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1], delay: 0.5 }}
            >
              START PLANNING
          </motion.button>
        </div>
      </main>


      {/* why choose wedsy section */}
      <main className={`${styles.main__div__2} md:mt-20 py-1 px-1`}>
        <div className="flex flex-col h-full relative">
          {/* Mobile View */}
          <motion.div 
            className="block md:hidden px-4 pb-8 mt-16"
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, amount: 0.6 }}
            variants={staggerContainer}
          >
            <motion.h1 
              className="text-lg font-semibold text-black" 
              style={{ fontFamily: 'Montserrat, sans-serif' }}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, amount: 0.6 }}
              transition={{ duration: 0.7, ease: [0.16, 1, 0.3, 1] }}
            >
              THE WEDDING STORE
            </motion.h1>
            
            <motion.p 
              className="text-lg text-black" 
              style={{ fontFamily: 'Montserrat, sans-serif', fontStyle: 'normal' }}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, amount: 0.6 }}
              transition={{ duration: 0.7, ease: [0.16, 1, 0.3, 1], delay: 0.2 }}
            >
              Everything You Need.
            </motion.p>
            <motion.p 
              className="text-lg mb-4" 
              style={{
              fontFamily: 'Montserrat, sans-serif',
              fontStyle: 'normal',
              color: '#840032',
              fontWeight: 'bold',
              }}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, amount: 0.6 }}
              transition={{ duration: 0.7, ease: [0.16, 1, 0.3, 1], delay: 0.3 }}
            >
              With Pricing.
            </motion.p>

            <motion.p 
              className="text-sm text-black" 
              style={{ fontFamily: 'Montserrat, sans-serif', fontStyle: 'normal' }}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, amount: 0.6 }}
              transition={{ duration: 0.7, ease: [0.16, 1, 0.3, 1], delay: 0.5 }}
            >
              One place to discover, price, and plan your entire wedding setup.
            </motion.p>
          </motion.div>

          {/* Desktop View */}
          <motion.div 
            className="hidden md:block px-18 md:px-20 pb-12"
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, amount: 0.6 }}
            variants={staggerContainer}
          >
            <motion.h1 
              className="text-lg md:text-lg lg:text-3xl font-semibold text-black mb-4" 
              style={{ fontFamily: 'Montserrat, sans-serif' }}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, amount: 0.6 }}
              transition={{ duration: 0.7, ease: [0.16, 1, 0.3, 1] }}
            >
              THE WEDDING STORE
            </motion.h1>
            
            <motion.p 
              className="text-[20px] md:text-[24px] text-black mb-6" 
              style={{ fontFamily: 'Montserrat, sans-serif' }}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, amount: 0.6 }}
              transition={{ duration: 0.7, ease: [0.16, 1, 0.3, 1], delay: 0.2 }}
            >
              Everything You Need. <span style={{ color: '#840032', fontWeight: 'bold' }}>With Pricing.</span>
            </motion.p>

            <motion.div 
              className="flex flex-wrap items-center gap-x-4 gap-y-2 text-black font-semibold text-sm md:text-md lg:text-sm" 
              style={{ fontFamily: 'Montserrat, sans-serif' }}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, amount: 0.6 }}
              transition={{ duration: 0.7, ease: [0.16, 1, 0.3, 1], delay: 0.5 }}
            >
              <span>DECOR & STYLING</span>
              <span>•</span>
              <span>FURNITURE & SEATING</span>
              <span>•</span>
              <span>WEDDING ENTRIES</span>
              <span>•</span>
              <span>FLORALS & GARLANDS</span>
              <span>•</span>
              <span>LIGHTING & AMBIENCE</span>
              <span>•</span>
              <span>PHOTO & EXPERIENCE</span>
            </motion.div>
          </motion.div>

          <motion.div 
            className="grid grid-cols-2 md:grid-cols-6 px-4 md:px-20 gap-1"
            initial={{ opacity: 0, scale: 0.9 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true, amount: 0.5 }}
            transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1], delay: 0.8 }}
          >

            <div className="relative overflow-hidden bg-[#3C3C3C] h-[200px] rounded-md md:h-auto md:row-span-2 md:col-span-3 md:rounded-none group">
              <Image src="/assets/landing_v2/img1.webp" alt="Grid image 1" layout="fill" objectFit="cover" className="rounded-md md:rounded-none transition-transform duration-300 group-hover:scale-105" />
            </div>

            <div className="relative overflow-hidden bg-[#3C3C3C] h-[200px] rounded-md md:col-span-1 md:rounded-none group">
              <Image src="/assets/landing_v2/img2.webp" alt="Grid image 2" layout="fill" objectFit="cover" className="rounded-md md:rounded-none transition-transform duration-300 group-hover:scale-105" />
            </div>

            <div className="relative overflow-hidden bg-[#3C3C3C] h-[200px] rounded-md md:col-span-1 md:rounded-none group">
              <Image src="/assets/landing_v2/img3.webp" alt="Grid image 3" layout="fill" objectFit="cover" className="rounded-md md:rounded-none transition-transform duration-300 group-hover:scale-105" />
            </div>

            <div className="relative overflow-hidden bg-[#3C3C3C]  h-[200px] rounded-md md:col-span-1 md:rounded-none group">
              <Image src="/assets/landing_v2/img4.webp" alt="Grid image 4" layout="fill" objectFit="cover" className="rounded-md md:rounded-none transition-transform duration-300 group-hover:scale-105" />
            </div>

            <div className="relative overflow-hidden bg-[#3C3C3C] h-[200px] rounded-md md:col-span-1 md:rounded-none group">
              <Image src="/assets/landing_v2/img5.webp" alt="Grid image 5" layout="fill" objectFit="cover" className="rounded-md md:rounded-none transition-transform duration-300 group-hover:scale-105" />
            </div>

            <div className="relative overflow-hidden bg-[#3C3C3C] h-[200px] rounded-md md:col-span-1 md:bg-[#D9D9D9] md:h-[200px] group">
              <Image src="/assets/landing_v2/img6.webp" alt="Grid image 6" layout="fill" objectFit="cover" className="rounded-md md:rounded-none transition-transform duration-300 group-hover:scale-105" />
            </div>

            <div className="relative overflow-hidden bg-[#D9D9D9] h-[200px] rounded-md md:col-span-1 hidden md:block md:rounded-none group">
              <Image src="/assets/landing_v2/img7.webp" alt="Grid image 7" layout="fill" objectFit="cover" className="rounded-md md:rounded-none transition-transform duration-300 group-hover:scale-105" />
            </div>
          </motion.div>

            <motion.div 
              className="w-full flex justify-center items-center py-8 mt-6 md:py-10 md:mt-10"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, amount: 0.5 }}
              transition={{ duration: 0.7, ease: [0.16, 1, 0.3, 1], delay: 0.3 }}
            >
              <Link href="/decor">
                <button
                  className="bg-[#840032] text-white text-sm md:text-lg px-10 md:px-16 shadow-xl py-3 rounded-2xl tracking-wider
                  hover:bg-[#6a0029] hover:shadow-lg transition-all duration-300 ease-in-out"
                  style={{ fontFamily: "'Cinzel', serif" }}
                >
                  Explore The Wedding Store
                </button>
              </Link>
            </motion.div>
                    
        </div>
      </main>

      {/* Makeup Artist Section */}
      <section className="w-full relative pb-10">
        <div className="relative w-full">
          <Image
            src="/assets/landing_v2/makeup_desktop.webp"
            alt="Book Makeup Artist"
            width={1920}
            height={600}
            layout="responsive"
            objectFit="cover"
            className="hidden md:block w-full"
          />
          <Image
            src="/assets/landing_v2/makeup_mobile.webp"
            alt="Book Makeup Artist"
            width={768}
            height={600}
            layout="responsive"
            objectFit="cover"
            className="block md:hidden w-full"
          />
          {/* Button Overlay - Positioned based on image design */}
          {/* Mobile: Centered at bottom, Desktop: Left side middle */}
          <div className="absolute bottom-4 left-1/2 -translate-x-1/2 px-4 md:bottom-auto md:left-16 md:translate-x-0 md:top-1/2 md:-translate-y-1/2 lg:ml-38  lg:mt-28 xl:left-32">
            <Link href="/makeup-and-beauty/artists">
              <button
                className="bg-white border-0  text-[#840032] px-6 md:px-10 py-2 md:py-3 rounded-lg text-xs md:text-sm font-semibold uppercase tracking-wider
                          hover:bg-[#840032] hover:text-white transition-all duration-300 ease-in-out shadow-lg"
                style={{
                  fontFamily: "'Cinzel', serif",
                  fontWeight: 600,
                }}
              >
                BOOK NOW
              </button>
            </Link>
          </div>
        </div>
      </section>

      {/* What our loved ones say section */}
      <section className="w-full" style={{ backgroundColor: '#F9F8F6' }}>
        <div className="relative w-full">
          {/* Desktop Title Overlay */}
          <div className="hidden md:flex absolute top-20 left-10 lg:left-20 z-10 items-center">
            <h2 
              className="text-3xl lg:text-4xl xl:text-5xl"
              style={{ 
                fontFamily: "'Dream Avenue', serif",
                color: '#8B6914',
                fontWeight: 'normal'
              }}
            >
              What our loved ones say
            </h2>
            
          </div>

          {/* Desktop View */}
          <div className="hidden md:block relative">
          <Image
            src="/assets/landing_v2/Whatourlovedonessay.webp"
            alt="What our loved ones say"
            width={1920}
            height={800}
            layout="responsive"
            objectFit="cover"
            />
            
            {/* Review Text Overlay - Desktop */}
            <div className="absolute inset-0 flex items-center justify-start z-20 pl-10 lg:pl-16 xl:pl-20 pr-20 lg:pr-32 xl:pr-40">
              <div className="max-w-2xl min-w-[400px] text-left">
                <AnimatePresence mode="wait">
                  <motion.div
                    key={currentReviewIndex}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -20 }}
                    transition={{ duration: 0.6, ease: "easeOut" }}
                  >
                    <p
                      className="text-sm lg:text-base xl:text-lg text-[#8B6914] leading-relaxed"
                      style={{
                        fontFamily: "'Montserrat', sans-serif",
                        fontWeight: 400,
                        fontStyle: 'italic'
                      }}
                    >
                      "{reviews[currentReviewIndex]}"
                    </p>
                  </motion.div>
                </AnimatePresence>
              </div>
            </div>

            {/* Review Indicators - Desktop */}
            <div className="absolute bottom-8 left-1/2 transform -translate-x-1/2 z-20 flex gap-2">
              {reviews.map((_, index) => (
                <button
                  key={index}
                  onClick={() => setCurrentReviewIndex(index)}
                  className={`w-2 h-2 rounded-full transition-all duration-300 ${
                    index === currentReviewIndex 
                      ? 'bg-[#8B6914] w-8' 
                      : 'bg-[#8B6914]/40 hover:bg-[#8B6914]/60'
                  }`}
                  aria-label={`Go to review ${index + 1}`}
                />
              ))}
            </div>
          </div>

          {/* Mobile View */}
          <div className="block md:hidden relative">
          <Image
            src="/assets/landing_v2/Whatourlovedonesays_mobile.webp"
            alt="What our loved ones say"
            width={768}
            height={600}
            layout="responsive"
            objectFit="cover"
            />
            
            {/* Review Text Overlay - Mobile */}
            <div className="absolute inset-0 flex items-end justify-start z-20 pl-8 pr-10 sm:pl-12 sm:pr-14 pb-16 sm:pb-20 mb-8 sm:mb-12">
              <div className="min-w-[280px] sm:min-w-[320px] text-left mb-4 sm:mb-6">
                <AnimatePresence mode="wait">
                  <motion.div
                    key={currentReviewIndex}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -20 }}
                    transition={{ duration: 0.6, ease: "easeOut" }}
                  >
                    <p
                      className="text-xs sm:text-xs text-[#8B6914] leading-relaxed"
                      style={{
                        fontFamily: "'Montserrat', sans-serif",
                        fontWeight: 400,
                        fontStyle: 'italic'
                      }}
                    >
                      "{reviews[currentReviewIndex]}"
                    </p>
                  </motion.div>
                </AnimatePresence>
              </div>
            </div>

            {/* Review Indicators - Mobile */}
            <div className="absolute bottom-6 left-1/2 transform -translate-x-1/2 z-20 flex gap-2">
              {reviews.map((_, index) => (
                <button
                  key={index}
                  onClick={() => setCurrentReviewIndex(index)}
                  className={`w-2 h-2 rounded-full transition-all duration-300 ${
                    index === currentReviewIndex 
                      ? 'bg-[#8B6914] w-6' 
                      : 'bg-[#8B6914]/40 hover:bg-[#8B6914]/60'
                  }`}
                  aria-label={`Go to review ${index + 1}`}
                />
              ))}
            </div>
          </div>
        </div>
      </section>

      
      {/* wedding venue section */}
{/* 
      <section className="w-full py-6 md:py-24 px-6 md:px-40  md:mt-10">
        <div className="mt-6 md:mt-18 max-w-7xl mx-auto">
          <div
            className="
              parent
              grid
              grid-cols-11   
              grid-rows-7    
              gap-2          
              
              min-h-[250px]  
              md:min-h-[450px]
              lg:min-h-[550px]
              
              md:gap-4       
              
              
            "
          >
            
            <div className="
              div12 relative overflow-hidden rounded-xl
              col-span-7 row-span-3   
              col-start-1 row-start-1
              p-2 md:p-8 flex flex-col justify-center items-start text-left 
            ">
              <div className="relative z-10 pl-0 pr-2 md:pr-8 rounded-md space-y-2 md:space-y-6"> 
                <h3
                  className="text-md md:text-xl text-black" 
                  style={{ fontFamily: 'Poiret One', fontWeight: 'normal' }}
                >
                  Looking For
                </h3>
                <h2
                  className="text-2xl md:text-6xl text-[#840032] leading-tight" 
                  style={{ fontFamily: 'Times New Roman', fontWeight: 'normal' }}
                >
                  WEDDING VENUES ?
                </h2>
                <p
                  className="text-xs md:text-base text-black" 
                  style={{ fontFamily: 'Montserrat', fontWeight: 'normal' }}
                >
                  We've got you covered with Wedsy's wedding venue packages!
                </p>
              </div>
            </div>

            
            <div className="
              div11 relative overflow-hidden rounded-xl shadow-md group
              col-span-4 row-span-5   
              col-start-8 row-start-1
            ">
              <Image
                src="/assets/images/3_buttom_4.webp"
                alt="Tropical wedding venue"
                layout="fill"
                objectFit="cover"
                className="rounded-xl transition-transform duration-300 group-hover:scale-105"
              />
            </div>

            
            <div className="
              div13 relative overflow-hidden rounded-xl shadow-md group
              col-span-4 row-span-4   
              col-start-1 row-start-4
            ">
              <Image
                src="/assets/images/3_buttom_1.webp"
                alt="Indoor wedding reception"
                layout="fill"
                objectFit="cover"
                className="rounded-xl transition-transform duration-300 group-hover:scale-105"
              />
            </div>

            
            <div className="
              div9 relative overflow-hidden rounded-xl shadow-md group
              col-span-3 row-span-2   
              col-start-5 row-start-4
            ">
              <Image
                src="/assets/images/3_buttom_2.webp"
                alt="Outdoor wedding setup"
                layout="fill"
                objectFit="cover"
                className="rounded-xl transition-transform duration-300 group-hover:scale-105"
              />
            </div>

            
            <div className="
              div10 relative overflow-hidden rounded-xl shadow-md group
              col-span-2 row-span-2   
              col-start-5 row-start-6
            ">
              <Image
                src="/assets/images/3_buttom_3.webp"
                alt="Wedding chairs"
                layout="fill"
                objectFit="cover"
                className="rounded-xl transition-transform duration-300 group-hover:scale-105"
              />
            </div>

            
            <div className="
              div7 relative overflow-hidden rounded-xl shadow-md group
              col-span-5 row-span-2   
              col-start-7 row-start-6
              flex items-center justify-center
            ">
              <Image
                src="/assets/images/3_buttom_3.webp"
                alt="Discover button background"
                layout="fill"
                objectFit="cover"
                className="rounded-xl transition-transform duration-300 group-hover:scale-105"
              />
              <div className="absolute inset-0 bg-black/80 rounded-xl"></div>
              <a
                href="https://venues.wedsy.in"
                target="_blank"
                rel="noopener noreferrer"
                className="relative z-10 text-white
             text-[10px] md:text-xl font-semibold 
             flex items-center justify-center md:justify-start"
              >
                Discover Wedding Spaces
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-3 w-3 md:h-5 md:w-5 ml-1 md:ml-2"
                  viewBox="0 0 20 20"
                  fill="currentColor"
                >
                  <path
                    fillRule="evenodd"
                    d="M10.293 5.293a1 1 0 011.414 0l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414-1.414L12.586 11H5a1 1 0 110-2h7.586l-2.293-2.293a1 1 0 010-1.414z"
                    clipRule="evenodd"
                  />
                </svg>
              </a>
              </div>
          </div>
        </div>
      </section>
*/}

      
      {/* triangle section */}
      <section className="relative w-full hidden md:flex justify-between items-center mt-12 md:mt-20">
        <div className="hidden md:block w-80 h-16 bg-[#840032] clip-left-triangle" />

        <motion.div 
          className="flex flex-col text-center mx-auto px-6"
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, amount: 0.6 }}
          variants={staggerContainer}
        >
          <motion.h2
            className="text-base md:text-lg lg:text-xl font-semibold text-black"
            style={{
              fontFamily: "'Montserrat', sans-serif",
              fontWeight: 600,
            }}
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.6 }}
            transition={{ duration: 1.0, ease: [0.16, 1, 0.3, 1] }}
          >
            YOUR ULTIMATE WEDDING PLANNING DESTINATION IS HERE
          </motion.h2>
          <motion.p
            className="text-sm md:text-base mt-2 text-black"
            style={{
              fontFamily: "'Montserrat', sans-serif",
              fontWeight: 500,
            }}
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.6 }}
            transition={{ duration: 1.0, ease: [0.16, 1, 0.3, 1], delay: 0.2 }}
          >
            We've got you covered with everything you need for your big day!
          </motion.p>
        </motion.div>
        <div className="hidden md:block w-80 h-16 bg-[#840032] clip-right-triangle" />
      </section>



      {/* makeup banner section */}
      <div className="py-16 md:py-5 px-6 md:px-40 mt-6 md:mt-20 hidden md:block">
        <div className="container mx-auto flex flex-col space-y-4 md:space-y-4">
          {[
            { href: null, image: "/assets/images/artist-1.webp", alt: "Makeup Artists", text: "MAKEUP ARTISTS", align: "left", isLink: false },
            { href: "/decor", image: "/assets/images/artist-3.webp", alt: "Decor", text: "DECOR", align: "right", isLink: true },
            { href: null, image: "/assets/images/artist-2.webp", alt: "Photography", text: "PHOTOGRAPHY", align: "left", isLink: false },
            { href: null, image: "/assets/images/artist-4.webp", alt: "Wedding Venues", text: "WEDDING VENUES", align: "right", isLink: false }
          ].map((item, index) => {
            const content = (
              <motion.div
                key={index}
                className="relative flex items-center overflow-hidden h-24 md:h-28 group cursor-pointer mb-4 md:mb-6 last:mb-0"
                initial={{ opacity: 0, x: index % 2 === 0 ? -20 : 20 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true, amount: 0.5 }}
                transition={{ 
                  duration: 0.8, 
                  ease: [0.16, 1, 0.3, 1], 
                  delay: index * 0.15 
                }}
              >
              <div className="absolute inset-0">
                <Image
                    src={item.image}
                    alt={item.alt}
                  layout="fill"
                  objectFit="cover"
                  className="transition-transform duration-300 group-hover:scale-105"
                />
              </div>
                <div className={`relative z-10 w-full h-full flex items-center ${item.align === "right" ? "justify-end" : ""}`}>
                  {item.align === "right" ? (
                <div className="absolute inset-y-0 right-0 w-1/2 bg-gradient-to-l from-white to-transparent transition-all duration-300 group-hover:w-full group-hover:from-white group-hover:to-white/70"></div>
                  ) : (
              <div className="absolute inset-y-0 left-0 w-1/2 bg-gradient-to-r from-white to-transparent transition-all duration-300 group-hover:w-full group-hover:from-white group-hover:to-white/70"></div>
                  )}
                  <motion.div
                    className={`relative z-20 text-black text-xl md:text-2xl font-semibold ${item.align === "right" ? "mr-4" : "ml-4"}`}
                style={{ fontFamily: 'Montserrat', letterSpacing: '0.1em' }}
                    initial={{ opacity: 0, scale: 0.9 }}
                    whileInView={{ opacity: 1, scale: 1 }}
                    viewport={{ once: true, amount: 0.5 }}
                    transition={{ 
                      duration: 1.0, 
                      ease: [0.22, 1, 0.36, 1], 
                      delay: index * 0.15 + 0.2 
                    }}
                  >
                    {item.text}
                  </motion.div>
              </div>
                {!item.isLink && (
            <div className="absolute inset-0 bg-black/70 flex items-center justify-center text-white text-lg font-semibold opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none">
              Coming Soon
            </div>
                )}
              </motion.div>
            );

            return item.isLink ? (
              <Link href={item.href} key={index}>
                {content}
              </Link>
            ) : (
              <div key={index} className="cursor-default">
                {content}
            </div>
            );
          })}
        </div>
      </div>

      {/* Bidding Section */}
      <motion.section 
        className="w-full px-6 py-16"
        initial={{ opacity: 0, y: 30 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, margin: "-100px" }}
        transition={{ duration: 0.7, ease: "easeOut", delay: 0.3 }}
      >
        {/* Desktop View - md and above */}
        <div className="hidden md:block relative w-full">
          <Image
            src="/assets/landing_v2/bidding_desktop.webp"
            alt="Bidding Process"
            width={1920}
            height={800}
            layout="responsive"
            objectFit="contain"
          />
        </div>

        {/* Mobile View - below md */}
        <div className="block md:hidden relative w-full">
          {/* Mobile Title */}
          <div className="text-center mb-6">
            <h2
              className="text-xl md:text-2xl text-black font-semibold"
              style={{
                fontFamily: "'Montserrat', sans-serif",
                fontWeight: 600,
              }}
            >
              Booking a makeup artist should not feel like gambling.
            </h2>
          </div>
          <Image
            src="/assets/landing_v2/bidding_mobile.webp"
            alt="Bidding Process"
            width={768}
            height={600}
            layout="responsive"
            objectFit="contain"
          />
        </div>

        {/* Get Quote Button */}
        <div className="w-full flex z-10 justify-center items-center mt-6 md:-mt-6">
            <button
            onClick={() => {
              // if (!userLoggedIn) {
              //   setSource("Makeup & Beauty Bidding");
              //   setOpenLoginModalv2(true);
              // } else {
              //   router.push("/makeup-and-beauty/bidding");
              // }
              router.push("/coming-soon");
            }}
            className="bg-[#840032] hover:bg-[#6a0029] text-white px-12  md:px-16 py-2 rounded-xl text-base md:text-lg font-semibold tracking-wider shadow-lg transition-all duration-300 ease-in-out cursor-pointer"
              style={{
              fontFamily: "'Cinzel', serif",
                fontWeight: 600,
              }}
            >
              Get Quote !
            </button>
        </div>
      </motion.section>

      {/* Wedding Planning Section */}
      <section className="w-full">
        {/* Mobile View */}
        <div className="block lg:hidden">
          {/* Mobile Image */}
          <motion.div 
            className="relative w-full"
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            variants={fadeIn}
          >
            <Image
              src="/assets/landing_v2/wedding_planning_mobile .webp"
              alt="Wedding Planning"
              width={768}
              height={900}
              layout="responsive"
              objectFit="contain"
            />
          </motion.div>

          {/* Mobile Content */}
          <motion.div 
            className="px-8 py-10"
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            variants={staggerContainer}
          >
            {/* Heading - Centered */}
            <motion.div 
              className="text-center mb-10"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, amount: 0.6 }}
              transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1], delay: 0.3 }}
            >
              <motion.h2
                className="text-4xl text-black leading-tight"
                style={{
                  fontFamily: "'Dream Avenue', serif",
                  fontWeight: 400,
                }}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, amount: 0.6 }}
                transition={{ duration: 0.7, ease: [0.16, 1, 0.3, 1], delay: 0.3 }}
              >
                Wedding planning
              </motion.h2>
              <motion.p
                className="text-3xl text-black mt-1"
                style={{
                  fontFamily: "'Dream Avenue', serif",
                  fontWeight: 400,
                }}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, amount: 0.6 }}
                transition={{ duration: 0.7, ease: [0.16, 1, 0.3, 1], delay: 0.3 }}
              >
                tailored for you
              </motion.p>
            </motion.div>

            {/* Points with Timeline */}
            <div className="relative mb-12 flex flex-row">
              {/* Vertical Bar Image */}
              <motion.div 
                className="flex-shrink-0 mr-4" 
                style={{ height: '300px', overflow: 'hidden' }}
                initial={{ opacity: 0, scale: 0.9 }}
                whileInView={{ opacity: 1, scale: 1 }}
                viewport={{ once: true, amount: 0.5 }}
                transition={{ duration: 0.7, ease: [0.16, 1, 0.3, 1], delay: 0.3 }}
              >
                <Image
                  src="/assets/landing_v2/bar.webp"
                  alt="Timeline bar"
                  width={14}
                  height={250}
                  className="h-full w-auto object-contain"
                  style={{ width: '14px' }}
                />
              </motion.div>

              {/* Points */}
              <div className="flex flex-col space-y-4 py-4">
                {/* Point 1 */}
                <motion.div 
                  className="relative flex flex-col"
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true, amount: 0.5 }}
                  transition={{ duration: 0.7, ease: [0.16, 1, 0.3, 1], delay: 0.3 }}
                >
                  {/* Horizontal Line */}
                  <div className="absolute left-[-20px] top-3 w-5 h-[1.5px] bg-black"></div>
                  <h3
                    className="text-xl text-black mb-2"
                    style={{
                      fontFamily: "'Spartan', sans-serif",
                      fontWeight: 400,
                    }}
                  >
                    Exclusive Wedding planner
                  </h3>
                  <p
                    className="text-sm text-black leading-relaxed"
                    style={{
                      fontFamily: "'Montserrat', sans-serif",
                      fontWeight: 400,
                    }}
                  >
                    Your story and your style guide us in creating a wedding that reflects who you are
                  </p>
                </motion.div>

                {/* Point 2 */}
                <motion.div 
                  className="relative flex flex-col"
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true, amount: 0.5 }}
                  transition={{ duration: 0.7, ease: [0.16, 1, 0.3, 1], delay: 0.3 }}
                >
                  {/* Horizontal Line */}
                  <div className="absolute left-[-20px] top-3 w-5 h-[1.5px] bg-black"></div>
                  <h3
                    className="text-xl text-black mb-2"
                    style={{
                      fontFamily: "'Spartan', sans-serif",
                      fontWeight: 400,
                    }}
                  >
                    Budget Optimisation
                  </h3>
                  <p
                    className="text-sm text-black leading-relaxed"
                    style={{
                      fontFamily: "'Montserrat', sans-serif",
                      fontWeight: 400,
                    }}
                  >
                    We design celebrations that reflect your vision while optimising costs without compromising quality
                  </p>
                </motion.div>

                {/* Point 3 */}
                <motion.div 
                  className="relative flex flex-col"
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true, amount: 0.5 }}
                  transition={{ duration: 0.7, ease: [0.16, 1, 0.3, 1], delay: 0.3 }}
                >
                  {/* Horizontal Line */}
                  <div className="absolute left-[-20px] top-3 w-5 h-[1.5px] bg-black"></div>
                  <h3
                    className="text-xl text-black mb-2"
                    style={{
                      fontFamily: "'Spartan', sans-serif",
                      fontWeight: 400,
                    }}
                  >
                    Seamless Coordination
                  </h3>
                  <p
                    className="text-sm text-black leading-relaxed"
                    style={{
                      fontFamily: "'Montserrat', sans-serif",
                      fontWeight: 400,
                    }}
                  >
                    Every detail is managed with precision, from concept to execution, ensuring a seamless and stress free experience
                  </p>
                </motion.div>
              </div>
            </div>

            {/* Mobile Button - Full Width */}
            <motion.div 
              className="px-2"
              initial={{ opacity: 0, scale: 0.9 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true, amount: 0.5 }}
              transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1], delay: 0.3 }}
            >
                <button
                onClick={() => document.getElementById('wedding-requirement-section')?.scrollIntoView({ behavior: 'smooth', block: 'start' })}
                  className="w-full bg-black text-white py-4 px-8 rounded-2xl tracking-widest text-sm
                          hover:bg-gray-800 transition-all duration-300 ease-in-out cursor-pointer"
                  style={{
                    fontFamily: "'Cinzel', serif",
                    fontWeight: 400,
                    letterSpacing: '0.12em',
                  }}
                >
                  CONNECT WITH AN EXPERT
                </button>
            </motion.div>
          </motion.div>
        </div>

        {/* Desktop View */}
        <motion.div 
        className="hidden lg:flex container mx-auto px-8 lg:px-16 xl:px-24 pt-4 pb-8 xl:pt-6 xl:pb-10"
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, amount: 0.6 }}
          variants={staggerContainer}
        >
          <div className="flex flex-row items-start justify-between w-full gap-12 xl:gap-20">
            {/* Left Content */}
            <motion.div 
              className="flex flex-col w-1/2 xl:w-[48%]"
              initial={{ opacity: 0, x: -20 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true, amount: 0.6 }}
              transition={{ duration: 0.7, ease: [0.16, 1, 0.3, 1], delay: 0.4 }}
            >
              {/* Heading */}
              <motion.div 
                className="mb-10"
                initial="hidden"
                whileInView="visible"
                viewport={{ once: true, amount: 0.6 }}
                variants={staggerContainer}
              >
                <motion.h2
                  className="text-5xl xl:text-6xl text-black leading-tight"
                  style={{
                    fontFamily: "'Dream Avenue', serif",
                    fontWeight: 400,
                  }}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true, amount: 0.6 }}
                  transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1], delay: 0.3 }}
                >
                  Wedding planning
                </motion.h2>
                <motion.p
                  className="text-4xl xl:text-5xl text-black mt-1"
                  style={{
                    fontFamily: "'Dream Avenue', serif",
                    fontWeight: 400,
                  }}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true, amount: 0.6 }}
                  transition={{ duration: 0.7, ease: [0.16, 1, 0.3, 1], delay: 0.3 }}
                >
                  tailored for you
                </motion.p>
              </motion.div>

              {/* Points with Timeline */}
              <div className="relative flex flex-row">
                {/* Vertical Bar Image */}
                <motion.div 
                  className="flex-shrink-0 mr-6" 
                  style={{ height: '400px', overflow: 'hidden' }}
                  initial={{ opacity: 0, scale: 0.9 }}
                  whileInView={{ opacity: 1, scale: 1 }}
                  viewport={{ once: true, amount: 0.5 }}
                  transition={{ duration: 0.7, ease: [0.16, 1, 0.3, 1], delay: 0.3 }}
                >
                  <Image
                    src="/assets/landing_v2/bar.webp"
                    alt="Timeline bar"
                    width={16}
                    height={350}
                    className="h-full w-auto object-contain"
                    style={{ width: '16px' }}
                  />
                </motion.div>

                {/* Points */}
                <div className="flex flex-col space-y-14 py-4">
                  {/* Point 1 */}
                  <motion.div 
                    className="relative flex flex-col"
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true, amount: 0.5 }}
                    transition={{ duration: 0.7, ease: [0.16, 1, 0.3, 1], delay: 0.3 }}
                  >
                    {/* Horizontal Line */}
                    <div className="absolute left-[-30px] top-4 w-7 h-[1.5px] bg-black"></div>
                    <h3
                      className="text-2xl xl:text-3xl text-black mb-2"
                      style={{
                        fontFamily: "'Spartan', sans-serif",
                        fontWeight: 400,
                      }}
                    >
                      Exclusive Wedding planner
                    </h3>
                    <p
                      className="text-sm xl:text-base text-black leading-relaxed max-w-md"
                      style={{
                        fontFamily: "'Montserrat', sans-serif",
                        fontWeight: 400,
                      }}
                    >
                      Your story and your style guide us in creating a wedding that reflects who you are
                    </p>
                  </motion.div>

                  {/* Point 2 */}
                  <motion.div 
                    className="relative flex flex-col"
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true, amount: 0.5 }}
                    transition={{ duration: 0.7, ease: [0.16, 1, 0.3, 1], delay: 0.3 }}
                  >
                    {/* Horizontal Line */}
                    <div className="absolute left-[-30px] top-4 w-7 h-[1.5px] bg-black"></div>
                    <h3
                      className="text-2xl xl:text-3xl text-black mb-2"
                      style={{
                        fontFamily: "'Spartan', sans-serif",
                        fontWeight: 400,
                      }}
                    >
                      Budget Optimisation
                    </h3>
                    <p
                      className="text-sm xl:text-base text-black leading-relaxed max-w-md"
                      style={{
                        fontFamily: "'Montserrat', sans-serif",
                        fontWeight: 400,
                      }}
                    >
                      We design celebrations that reflect your vision while optimising costs without compromising quality
                    </p>
                  </motion.div>

                  {/* Point 3 */}
                  <motion.div 
                    className="relative flex flex-col"
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true, amount: 0.5 }}
                    transition={{ duration: 0.7, ease: [0.16, 1, 0.3, 1], delay: 0.3 }}
                  >
                    {/* Horizontal Line */}
                    <div className="absolute left-[-30px] top-4 w-7 h-[1.5px] bg-black"></div>
                    <h3
                      className="text-2xl xl:text-3xl text-black mb-2"
                      style={{
                        fontFamily: "'Spartan', sans-serif",
                        fontWeight: 400,
                      }}
                    >
                      Seamless Coordination
                    </h3>
                    <p
                      className="text-sm xl:text-base text-black leading-relaxed max-w-md"
                      style={{
                        fontFamily: "'Montserrat', sans-serif",
                        fontWeight: 400,
                      }}
                    >
                      Every detail is managed with precision, from concept to execution, ensuring a seamless and stress free experience
                    </p>
                  </motion.div>
                  </div>
                </div>
            </motion.div>

            {/* Right Side - Image and Button */}
            <motion.div 
              className="flex flex-col items-center w-1/2 xl:w-[48%]"
              initial={{ opacity: 0, x: 20 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true, amount: 0.6 }}
              transition={{ duration: 0.7, ease: [0.16, 1, 0.3, 1], delay: 0.4 }}
            >
              {/* Wedding Image */}
              <motion.div 
                className="relative w-full"
                initial={{ opacity: 0, scale: 0.9 }}
                whileInView={{ opacity: 1, scale: 1 }}
                viewport={{ once: true, amount: 0.5 }}
                transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1], delay: 0.3 }}
              >
                <Image
                  src="/assets/landing_v2/wedding_planning.webp"
                  alt="Wedding Planning"
                  width={600}
                  height={750}
                  layout="responsive"
                  objectFit="contain"
                />
              </motion.div>

              {/* Button - Below Image */}
              <motion.button
                onClick={() => document.getElementById('wedding-requirement-section')?.scrollIntoView({ behavior: 'smooth', block: 'start' })}
                className="mt-10 lg:ml-20 bg-black text-white py-4 px-12 rounded-xl tracking-widest text-sm
                          hover:bg-gray-800 transition-all duration-300 ease-in-out cursor-pointer"
                  style={{
                    fontFamily: "'Cinzel', serif",
                    fontWeight: 400,
                    letterSpacing: '0.12em',
                  }}
                initial={{ opacity: 0, scale: 0.9 }}
                whileInView={{ opacity: 1, scale: 1 }}
                viewport={{ once: true, amount: 0.5 }}
                transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1], delay: 0.3 }}
                >
                  CONNECT WITH AN EXPERT
              </motion.button>
            </motion.div>
            </div>
        </motion.div>
      </section>

      
      {/* bueaty section */}
      {/* 
      <div className="flex flex-col md:flex-row justify-center items-stretch py-16 md:py-24 px-6 md:px-40 mt-6 md:mt-18">
        <div className="md:hidden w-full flex flex-col items-center">
          <div className="relative w-full h-[400px] overflow-hidden bg-[#EBEAF8]">
            <Image
              src="/assets/images/beauty.svg"
              alt="Makeup & Beauty Mobile Background"
              layout="fill"
              objectFit="cover"
              className="rounded-lg"
            />
            <div className="absolute inset-0 "></div>

            <div className="absolute inset-0 flex flex-col justify-start items-start p-6 text-black z-10">
              <div className="text-left w-full pt-8">
                <h2
                  className="text-5xl font-medium"
                  style={{ fontFamily: 'Montserrat' }}
                >
                  BID
                </h2>
                <p
                  className="text-xl font-medium"
                  style={{ fontFamily: 'Montserrat' }}
                >
                  COMPARE
                </p>
              </div>
            </div>
          </div>

          <p
            className="md:hidden text-lg font-medium text-black mt-4 text-center px-4"
            style={{ fontFamily: 'Montserrat' }}
          >
            Choose the ideal Makeup artist for the best glam for you gram.
          </p>

          <div className="md:hidden w-full flex justify-center mt-6">
            <Link href="/makeup-and-beauty/artists">
              <button
                className="bg-[#8783D1] text-white px-8 py-4 rounded-md flex items-center justify-center
                          hover:bg-[#6b66b3] transition-colors duration-300"
                style={{ fontFamily: 'Montserrat', fontWeight: 'semibold' }}
              >
                Visit MakeUp Artist Store{' '}
                <span className="ml-2">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="h-5 w-5"
                    viewBox="0 0 20 20"
                    fill="currentColor"
                  >
                    <path
                      fillRule="evenodd"
                      d="M10.293 5.293a1 1 0 011.414 0l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414-1.414L12.586 11H5a1 1 0 110-2h7.586l-2.293-2.293a1 1 0 010-1.414z"
                      clipRule="evenodd"
                    />
                  </svg>
                </span>
              </button>
            </Link>
          </div>
        </div>

        <div className="hidden md:flex flex-1 flex-col md:flex-row justify-center items-stretch">
          
          <div className="w-full md:w-1/2 bg-[#EBEAF8] p-6 md:p-10 flex flex-col justify-between shadow-md mb-4 md:mb-0 md:mr-4">
            <div>
              <h2
                className="text-2xl md:text-4xl font-medium text-black mb-4"
                style={{ fontFamily: 'Montserrat' }}
              >
                BID, COMPARE
              </h2>
              <p
                className="text-lg md:text-xl font-medium text-black mb-6"
                style={{ fontFamily: 'Montserrat' }}
              >
                Choose the ideal Makeup artist for the best glam for you gram.
              </p>
              <p
                className="text-sm md:text-base font-medium text-black mb-8"
                style={{ fontFamily: 'Montserrat' }}
              >
                With our makeup artist app, customers can bid on services from top
                makeup artists, compare their offers, and choose the best fit for
                their special day or go ahead and choose from among top of the line
                artists
              </p>
            </div>
            <Link href="/makeup-and-beauty/artists">
              <button
                className="bg-[#8783D1] text-black px-6 py-3 rounded-md flex items-center justify-center self-start
                          hover:bg-[#6b66b3] transition-colors duration-300"
                style={{ fontFamily: 'Montserrat', fontWeight: 'semibold' }}
              >
                Visit Make Up Artist store{' '}
                <span className="ml-2">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="h-5 w-5"
                    viewBox="0 0 20 20"
                    fill="currentColor"
                  >
                    <path
                      fillRule="evenodd"
                      d="M10.293 5.293a1 1 0 011.414 0l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414-1.414L12.586 11H5a1 1 0 110-2h7.586l-2.293-2.293a1 1 0 010-1.414z"
                      clipRule="evenodd"
                    />
                  </svg>
                </span>
              </button>
            </Link>
          </div>

          
          <div className="relative w-full md:w-1/2 flex overflow-hidden shadow-md mt-4 md:mt-0 bg-[#EBEAF8]">
            <Image
              src="/assets/images/beauty.svg"
              alt="Makeup & Beauty"
              layout="fill"
              objectFit="cover"
              className="rounded-lg"
            />
            <div className="absolute top-0 left-0 p-6 md:p-10 z-10">
              <div className="inline-block">
                <h2
                  className="text-3xl md:text-4xl font-normal leading-none"
                  style={{ fontFamily: 'Montserrat', color: '#840032' }}
                >
                  MAKEUP
                </h2>
                <p
                  className="text-xl md:text-2xl font-normal leading-none"
                  style={{ fontFamily: 'Montserrat', color: '#840032' }}
                >
                  & BEAUTY
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
      */}


      {/* furniture section */}
      {/*
      <div className="py-16 md:py-24 px-6 md:px-40 mt-6 md:mt-18">
        <div className="container mx-auto">
        
          <div className="relative w-full overflow-hidden h-96 md:h-[400px]">
            <Image
              src="/assets/images/furniture_img.webp"
              layout="fill"
              objectFit="cover"
            />

            <div className="absolute inset-0 bg-gradient-to-t from-white to-transparent z-10"></div>

            
            <div className="absolute inset-0 z-20 p-6 md:p-10 flex flex-col justify-end">
              
              <div className="flex flex-col items-center text-center space-y-4 w-full
                            md:flex-row md:justify-between md:items-end md:text-left md:space-y-0">
                <p
                  className="text-sm font-medium mb-4
                            md:text-2xl md:mb-0 md:w-2/3"
                  style={{ fontFamily: 'Montserrat' }}
                >
                  MAKE YOUR DREAM WEDDING PERFECTLY FURNISHED WITH OUR PREMIUM WEDDING FURNITURE
                </p>
                <Link href="/furniture-browse">
                  <button
                    className="bg-[#5D6F28] text-white px-8 py-3 rounded-md shadow-lg
                              hover:bg-[#4a5a20] transition-colors duration-300 whitespace-nowrap"
                    style={{ fontFamily: 'Montserrat', fontWeight: 'bold' }}
                  >
                    BROWSE NOW
                  </button>
                </Link>
              </div>
            </div>
          </div>
        </div>

        <div className="mt-8 text-black text-base md:text-xl font-semibold text-center" style={{ fontFamily: 'Montserrat', }}>
          <span className="flex flex-wrap items-center justify-center w-full hidden md:block">
            <span className="mb-2 md:mb-0">CHAIRS</span> <span className="mx-14 hidden md:inline">•</span>
            <span className="block md:hidden w-full h-2"></span>
            <span className="mb-2 md:mb-0">CHAIR COVER</span> <span className="mx-14 hidden md:inline">•</span>
            <span className="block md:hidden w-full h-2"></span>
            <span className="mb-2 md:mb-0">TABLE</span> <span className="mx-14 hidden md:inline">•</span>
            <span className="block md:hidden w-full h-2"></span>
            <span className="mb-2 md:mb-0">TABLE COVER</span> <span className="mx-14 hidden md:inline">•</span>
            <span className="block md:hidden w-full h-2"></span>
            <span className="mb-2 md:mb-0">CLOTH</span> <span className="mx-14 hidden md:inline">•</span>
            <span className="block md:hidden w-full h-2"></span>
            <span className="mb-2 md:mb-0">AND MANY MORE...</span>
          </span>
        </div>
      </div>

      <div className="flex justify-center w-full py-4 md:py-8">
        <div className="w-1/2 h-px bg-[#C6C6C6]"></div> 
      </div>
      */}
            
      {/* review section */}
      {/*
      <div className="py-8 md:py-24 px-4 md:px-40">
      <h1 className="text-3xl md:text-5xl lg:text-7xl font-regular text-center mb-10 md:mb-16" style={{ fontFamily: 'Poiret One', fontWeight: 'normal', letterSpacing: '1%' }}>
        Discover our customers experiences.
      </h1>


      <div
        className="
          parent
          grid
          grid-cols-1
          grid-rows-auto
          gap-4
          p-4 
          min-h-[500px]
          md:grid-cols-9
          md:grid-rows-10
          md:gap-2
          md:min-h-[800px]
          lg:min-h-[1000px]
        "
      >
        
        
        <div className="
          div9 relative overflow-hidden rounded-lg shadow-md group
          col-span-full row-span-auto
          md:col-span-2 md:row-span-5
          md:col-start-8 md:row-start-1
        ">
        <Link href="https://hub.wedsy.in/reviews/" target="_blank" rel="noopener noreferrer">
          <Image
            src="/assets/images/review_9.webp"
            alt="Grid Item 9"
            layout="fill"
            objectFit="cover"
            className="rounded-lg transition-transform duration-300 group-hover:scale-105"
          />
        </Link>
        </div>

        
        <div className="
          div10 relative overflow-hidden rounded-lg shadow-md group
          col-span-full row-span-auto
          md:col-span-3 md:row-span-2
          md:col-start-7 md:row-start-6
          hidden md:block
        ">
          <Image
            src="/assets/images/review_10.webp"
            alt="Grid Item 10"
            layout="fill"
            className="rounded-lg transition-transform duration-300 group-hover:scale-105"
          />
        </div>

        
        <div className="
          div11 relative overflow-hidden rounded-lg shadow-md group
          col-span-full row-span-auto
          md:col-span-3 md:row-span-3
          md:col-start-7 md:row-start-8
          hidden md:block
        ">
          <Image
            src="/assets/images/review_11.webp"
            alt="Grid Item 11"
            layout="fill"
            className="rounded-lg transition-transform duration-300 group-hover:scale-105"
          />
        </div>

        
        <div className="
          div13 relative overflow-hidden rounded-lg shadow-md group
          col-span-full row-span-auto
          md:col-span-3 md:row-span-2
          md:col-start-5 md:row-start-1
          hidden md:block
        ">
          <Image
            src="/assets/images/review_7.webp"
            alt="Grid Item 13"
            layout="fill"
            className="rounded-lg transition-transform duration-300 group-hover:scale-105"
          />
        </div>

        
        <div className="
          div14 relative overflow-hidden rounded-lg shadow-md group
          col-span-full row-span-auto
          md:col-span-3 md:row-span-3
          md:col-start-5 md:row-start-3
          hidden md:block
        ">
          <Image
            src="/assets/images/review_8.webp"
            alt="Grid Item 14"
            layout="fill"
            className="rounded-lg transition-transform duration-300 group-hover:scale-105"
          />
        </div>

        
        <div className="
          div15 relative overflow-hidden rounded-lg shadow-md group
          col-span-full row-span-auto
          md:col-span-4 md:row-span-3
          md:col-start-3 md:row-start-6
          hidden md:block
        ">
          <Image
            src="/assets/images/review_5.webp"
            alt="Grid Item 15"
            layout="fill"
            objectFit="cover"
            className="rounded-lg transition-transform duration-300 group-hover:scale-105"
          />
        </div>

        
        <div className="
          div16 relative overflow-hidden rounded-lg shadow-md group
          col-span-full row-span-auto
          md:col-span-2 md:row-span-5
          md:col-start-3 md:row-start-1
          hidden md:block
        ">
          <Image
            src="/assets/images/review_4.webp"
            alt="Grid Item 16"
            layout="fill"
            objectFit="cover"
            className="rounded-lg transition-transform duration-300 group-hover:scale-105"
          />
        </div>

        
        <div className="
          div17 relative overflow-hidden rounded-lg shadow-md group
          col-span-full row-span-auto
          md:col-span-2 md:row-span-3
          md:col-start-1 md:row-start-1
          hidden md:block
        ">
          <Image
            src="/assets/images/review_1.webp"
            alt="Grid Item 17"
            layout="fill"
            objectFit="cover"
            className="rounded-lg transition-transform duration-300 group-hover:scale-105"
          />
        </div>

        
        <div className="
          div18 relative overflow-hidden rounded-lg shadow-md group
          col-span-full row-span-auto
          md:col-span-2 md:row-span-5
          md:col-start-1 md:row-start-4
          hidden md:block
        ">
          <Image
            src="/assets/images/review_2.webp"
            alt="Grid Item 18"
            layout="fill"
            objectFit="cover"
            className="rounded-lg transition-transform duration-300 group-hover:scale-105"
          />
        </div>

        
        <div className="
          div19 relative overflow-hidden rounded-lg shadow-md group
          col-span-full row-span-auto
          md:col-span-3 md:row-span-2
          md:col-start-1 md:row-start-9
          hidden md:block
        ">
          <Image
            src="/assets/images/review_3.webp"
            alt="Grid Item 19"
            layout="fill"
            className="rounded-lg transition-transform duration-300 group-hover:scale-105"
          />
        </div>

        
        <div className="
          div20 relative overflow-hidden rounded-lg shadow-md group
          col-span-full row-span-auto
          md:col-span-3 md:row-span-2
          md:col-start-4 md:row-start-9
          hidden md:block
        ">
          <Image
            src="/assets/images/review_6.webp"
            alt="Grid Item 20"
            layout="fill"
            className="rounded-lg transition-transform duration-300 group-hover:scale-105"
          />
        </div>
      </div>

      
      <div className="mt-16 text-center">
        <Link href="https://hub.wedsy.in/reviews/" target="_blank" rel="noopener noreferrer">
        <button 
          className="bg-gray-800 text-white px-8 py-4 rounded-md text-sm md:text-lg font-semibold hover:bg-gray-700 transition-colors duration-300"
          style={{ fontFamily: "'Cinzel', serif" }}
        >
          See what our clients say about us
        </button>
        </Link>
      </div>
      </div>

      <div className="flex justify-center w-full py-4 md:py-8">
        <div className="w-1/2 h-px bg-[#C6C6C6]"></div> 
      </div>
      */}

      
      {/* wedsey section */}

      <motion.div 
      className="pt-0 md:pt-0 pb-16 md:pb-20 px-4 md:px-10 lg:px-20 text-center"
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, amount: 0.6 }}
        variants={staggerContainer}
      >
        <motion.h2
          className="text-2xl md:text-4xl lg:text-5xl text-gray-800 mb-12 md:mb-4"
          style={{ fontFamily: 'Montserrat', fontWeight: 'medium' }}
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.6 }}
          transition={{ duration: 0.3, ease: [0.22, 1, 0.36, 1] }}
        >
          Wedsy's WORK
        </motion.h2>
        
        
        <div className="md:py-8 px-4 md:px-10 lg:px-20 text-center">

          
          <motion.div 
            className="hidden md:grid grid-cols-1 md:grid-cols-3 gap-4 max-w-6xl mx-auto"
            initial={{ opacity: 0, scale: 0.9 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true, amount: 0.5 }}
            transition={{ duration: 0.2, ease: [0.22, 1, 0.36, 1], delay: 0 }}
          >
            
            <motion.div 
              className="flex flex-col gap-4"
              initial={{ opacity: 0, x: -20 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true, amount: 0.5 }}
              transition={{ duration: 0.2, ease: [0.16, 1, 0.3, 1], delay: 0.05 }}
            >
              <div className="relative overflow-hidden h-40 md:h-48 bg-gray-300 shadow-md group">
                <Image src="/assets/landing_v2/ww5.webp" alt="Desktop Grid 1" layout="fill" objectFit="cover" className="transition-transform duration-300 group-hover:scale-105" />
              </div>
              <div className="relative overflow-hidden flex-grow bg-gray-300 shadow-md h-64 md:h-80 group">
                <Image src="/assets/landing_v2/ww2.webp" alt="Desktop Grid 2" layout="fill" objectFit="cover" className="transition-transform duration-300 group-hover:scale-105" />
              </div>
            </motion.div>
            
            <motion.div 
              className="flex flex-col gap-4"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, amount: 0.5 }}
              transition={{ duration: 0.2, ease: [0.16, 1, 0.3, 1], delay: 0.1 }}
            >
              <div className="relative overflow-hidden h-40 md:h-48 bg-gray-300 shadow-md group">
                <Image src="/assets/landing_v2/ww3.webp" alt="Desktop Grid 3" layout="fill" objectFit="cover" className="transition-transform duration-300 group-hover:scale-105" />
              </div>
              <div className="relative overflow-hidden flex-grow bg-gray-300 shadow-md h-64 md:h-80 group">
                <Image src="/assets/landing_v2/ww1.webp" alt="Desktop Grid 4" layout="fill" objectFit="cover" className="transition-transform duration-300 group-hover:scale-105" />
              </div>
            </motion.div>
            
            <motion.div 
              className="flex flex-col gap-4"
              initial={{ opacity: 0, x: 20 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true, amount: 0.5 }}
              transition={{ duration: 0.2, ease: [0.16, 1, 0.3, 1], delay: 0.15 }}
            >
              <div className="relative overflow-hidden flex-grow bg-gray-300 shadow-md h-64 md:h-80 group">
                <Image src="/assets/landing_v2/ww6.webp" alt="Desktop Grid 5" layout="fill" objectFit="cover" className="transition-transform duration-300 group-hover:scale-105" />
              </div>
              <div className="relative overflow-hidden h-40 md:h-48 bg-gray-300 shadow-md group">
                <Image src="/assets/landing_v2/ww4.webp" alt="Desktop Grid 6" layout="fill" objectFit="cover" className="transition-transform duration-300 group-hover:scale-105" />
              </div>
            </motion.div>
          </motion.div>
          
          {/* Mobile Layout - Hidden on desktop */}
          <motion.div 
            className="block md:hidden flex flex-col gap-4 max-w-6xl mx-auto"
            initial={{ opacity: 0, scale: 0.9 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true, amount: 0.5 }}
            transition={{ duration: 0.2, ease: [0.16, 1, 0.3, 1], delay: 0 }}
          >
            <motion.div 
              className="relative overflow-hidden w-full h-80 bg-gray-300 shadow-md rounded-md group"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, amount: 0.5 }}
              transition={{ duration: 0.2, ease: [0.16, 1, 0.3, 1] }}
            >
              <Image src="/assets/landing_v2/ww1.webp" alt="Mobile Grid 1" layout="fill" objectFit="cover" className="rounded-md transition-transform duration-300 group-hover:scale-105" />
            </motion.div>
            <motion.div 
              className="flex flex-row gap-2 justify-between"
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true, amount: 0.5 }}
              variants={staggerContainer}
            >
              {[2, 3, 4, 5].map((imgNum, index) => (
                <motion.div
                  key={index}
                  className="relative overflow-hidden w-1/4 h-24 bg-gray-300 shadow-md rounded-md group"
                  variants={staggerItem}
                  initial={{ opacity: 0, scale: 0.9 }}
                  whileInView={{ opacity: 1, scale: 1 }}
                  viewport={{ once: true, amount: 0.5 }}
                  transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1], delay: index * 0.1 }}
                >
                  <Image 
                    src={`/assets/landing_v2/ww${imgNum}.webp`} 
                    alt={`Mobile Grid ${imgNum}`} 
                    layout="fill" 
                    objectFit="cover" 
                    className="rounded-md transition-transform duration-300 group-hover:scale-105" 
                  />
                </motion.div>
              ))}
            </motion.div>
          </motion.div>
        </div>
        
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.5 }}
          transition={{ duration: 0.2, ease: [0.16, 1, 0.3, 1], delay: 0.1 }}
        >
        <Link href="https://hub.wedsy.in/gallery/" target="_blank" rel="noopener noreferrer">
          <button
              className="mt-12 md:mt-2 px-16 py-4 rounded-md text-white shadow-lg hover:bg-[#6a0029] transition-colors duration-300"
              style={{ backgroundColor: '#840032', fontFamily: "'Cinzel', serif", fontWeight: 'semibold' }}
          >
            View more
          </button>
        </Link>
        </motion.div>
      </motion.div>


      {/*line section */}
      <div className="flex justify-center w-full py-4 md:py-8">
        <div className="w-4/5 h-px bg-[#C6C6C6]"></div> 
      </div>


      {/*tranding section */}
      
      <div className="py-6 md:py-8 px-6 md:px-40">
        <div className="max-w-7xl mx-auto">
          <motion.h2 
            className="text-2xl md:text-4xl lg:text-4xl font-semibold mb-4 md:mb-4"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.6 }}
            transition={{ duration: 0.2, ease: [0.22, 1, 0.36, 1] }}
          >
            Wedding planning, <span style={{ fontFamily: 'Montserrat', color: '#AD7200', fontWeight: 'semibold' }}>Explained clearly.</span>
          </motion.h2>

          <motion.p
            className="text-base font-semibold md:text-lg mb-6 md:mb-8"
            style={{ color: '#840032' }}
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.6 }}
            transition={{ duration: 0.2, ease: [0.22, 1, 0.36, 1], delay: 0.05 }}
          >
            Practical guides on venues, decor, budgets, vendors and real wedding costs.
          </motion.p>

          <motion.div 
            ref={trendingCarouselRef}
            className={`flex gap-6 overflow-x-auto overflow-y-hidden snap-x snap-mandatory md:overflow-visible md:snap-none scroll-smooth -mx-6 px-6 md:mx-0 md:px-0 ${styles.scrollbar_hide}`}
            style={{ WebkitOverflowScrolling: 'touch' }}
            onScroll={() => {
              const el = trendingCarouselRef.current;
              if (!el) return;
              const slideWidth = el.scrollWidth / TRENDING_CARDS_COUNT;
              const index = Math.round(el.scrollLeft / (slideWidth || 1));
              setTrendingSlideIndex(Math.min(Math.max(0, index), TRENDING_CARDS_COUNT - 1));
            }}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, amount: 0.5 }}
            variants={staggerContainer}
          >
            <motion.div 
              className="relative flex-[0_0_85vw] md:flex-1 h-56 md:h-80 bg-gray-100 overflow-hidden group snap-center shrink-0 md:min-w-0"
              initial={{ opacity: 0, x: -20 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true, amount: 0.5 }}
              transition={{ duration: 0.2, ease: [0.16, 1, 0.3, 1], delay: 0.05 }}
              onClick={() => {
                window.location.href = "https://hub.wedsy.in/decor/02/mandap-vs-stage/";
              }}
            >
              <Image
                src="/assets/landing_v2/B3.png"
                alt="Trending Image 1"
                layout="fill"
                objectFit="contain"
                className="transition-transform duration-300 group-hover:scale-105 hover:cursor-pointer"
              />
            </motion.div>

            
            <motion.div 
              className="relative flex-[0_0_85vw] md:flex-1 h-56 md:h-80 bg-gray-100 overflow-hidden group snap-center shrink-0 md:min-w-0"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, amount: 0.5 }}
              transition={{ duration: 0.9, ease: [0.16, 1, 0.3, 1], delay: 0.5 }}
              onClick={() => {
                window.location.href = "https://hub.wedsy.in/venue-2/11/a-comprehensive-guide-to-planning-your-dream-wedding-at-amita-rasa-costs-decor-and-more/";
              }}
            >
              <Image
                src="/assets/landing_v2/B2.png"
                alt="Trending Image 2"
                layout="fill"
                objectFit="contain"
                className="transition-transform duration-300 group-hover:scale-105 hover:cursor-pointer"
              />
            </motion.div>

            
            <motion.div 
              className="relative flex-[0_0_85vw] md:flex-1 h-56 md:h-80 bg-gray-100 overflow-hidden group snap-center shrink-0 md:min-w-0"
              initial={{ opacity: 0, x: 20 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true, amount: 0.5 }}
              transition={{ duration: 0.9, ease: [0.16, 1, 0.3, 1], delay: 0.8 }}
              onClick={() => {
                window.location.href = "https://hub.wedsy.in/uncategorized/02/how-much-does-a-wedding-actually-cost-in-bangalore/";
              }}
            >
              <Image
                src="/assets/landing_v2/B1.png"
                alt="Trending Image 3"
                layout="fill"
                objectFit="contain"
                className="transition-transform duration-300 group-hover:scale-105 hover:cursor-pointer"
              />
            </motion.div>
          </motion.div>

          {/* Carousel dots - mobile only */}
          <div className="flex justify-center gap-2 mt-4 md:hidden">
            {[0, 1, 2].map((i) => (
              <button
                key={i}
                type="button"
                aria-label={`Go to slide ${i + 1}`}
                onClick={() => {
                  const el = trendingCarouselRef.current;
                  if (el) {
                    setTrendingSlideIndex(i);
                    const slideWidth = el.scrollWidth / TRENDING_CARDS_COUNT;
                    el.scrollTo({ left: i * slideWidth, behavior: 'smooth' });
                  }
                }}
                className={`w-2 h-2 rounded-full transition-colors ${trendingSlideIndex === i ? 'bg-[#AD7200] scale-125' : 'bg-gray-300'}`}
              />
            ))}
          </div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.5 }}
            transition={{ duration: 1.0, ease: [0.16, 1, 0.3, 1], delay: 1.6 }}
            className="hidden md:flex justify-center mt-12"
          >
            <Link href="https://hub.wedsy.in" target="_blank" rel="noopener noreferrer">
              <button
                className="px-16 py-4 rounded-md text-white shadow-lg hover:bg-[#CE8C35] transition-colors duration-300"
                style={{ backgroundColor: '#AD7200', fontFamily: "'Cinzel', serif", fontWeight: 600 }}
              >
                EXPLORE WEDDING PLANNING GUIDE
              </button>
            </Link>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.5 }}
            transition={{ duration: 1.0, ease: [0.16, 1, 0.3, 1], delay: 1.6 }}
          >
          <Link href="https://hub.wedsy.in" target="_blank" rel="noopener noreferrer">
            <button
              className="mt-12 px-16 py-4 rounded-md text-white shadow-lg hover:bg-[#CE8C35] transition-colors duration-300
                            block mx-auto md:hidden"
                style={{ backgroundColor: '#CE8C35', fontFamily: "'Cinzel', serif", fontWeight: 'semibold' }}
            >
              Explore our BLOGS
            </button>
          </Link>
          </motion.div>
        </div>
      </div>

      {/* Wedding Requirement Section */}
      <section id="wedding-requirement-section" className="relative min-h-screen bg-[#3C2415]">
        {/* Desktop Layout - Side by Side */}
        <div className="hidden lg:flex min-h-screen mt-20">
          {/* Left Section - Image (2/3 width) */}
          <motion.div 
            className="w-2/3 relative"
            initial={{ opacity: 0, scale: 0.95 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true, amount: 0.5 }}
            transition={{ duration: 1.2, ease: [0.22, 1, 0.36, 1] }}
          >
            <Image
              src="/assets/landing_v2/wedding.webp"
              alt="Wedding couple"
              layout="fill"
              objectFit="cover"
              priority
            />
            {/* Black transparent overlay */}
            <div className="absolute inset-0 bg-black/40" />

            {/* Branding Overlay */}
            <div className="absolute inset-0 flex flex-col justify-between p-12">
              {/* Top Branding - ALISHAAN */}
              <motion.div 
                className="flex flex-col items-center justify-center"
                initial="hidden"
                whileInView="visible"
                viewport={{ once: true, amount: 0.6 }}
                variants={staggerContainer}
              >
                <motion.div 
                  className="flex items-center justify-center mb-4"
                  variants={staggerItem}
                >
                  <motion.div
                    initial={{ opacity: 0, x: -20 }}
                    whileInView={{ opacity: 1, x: 0 }}
                    viewport={{ once: true, amount: 0.5 }}
                    transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1], delay: 0.2 }}
                  >
                  <Image
                    src="/assets/landing_v2/left_bar.webp"
                    alt="decoration"
                    width={123}
                    height={5}
                    className="mr-4"
                  />
                  </motion.div>
                  <motion.h1
                    className="text-6xl font-serif text-white mx-4"
                    style={{
                      fontFamily: "'Montserrat', sans-serif",
                      fontWeight: 300,
                    }}
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true, amount: 0.5 }}
                    transition={{ duration: 1.2, ease: [0.22, 1, 0.36, 1], delay: 0.4 }}
                  >
                   WEDSY
                  </motion.h1>
                  <motion.div
                    initial={{ opacity: 0, x: 20 }}
                    whileInView={{ opacity: 1, x: 0 }}
                    viewport={{ once: true, amount: 0.5 }}
                    transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1], delay: 0.2 }}
                  >
                  <Image
                    src="/assets/landing_v2/right_bar.webp"
                    alt="decoration"
                    width={123}
                    height={5}
                    className="ml-4"
                  />
                  </motion.div>
                </motion.div>
                <motion.h2
                  className="text-white text-lg font-medium"
                  style={{
                    fontFamily: "'Montserrat', sans-serif",
                    fontWeight: 100,
                  }}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true, amount: 0.5 }}
                  transition={{ duration: 1.0, ease: [0.16, 1, 0.3, 1], delay: 0.6 }}
                >
                  WEDDINGS MADE EASY
                </motion.h2>
              </motion.div>

              {/* Bottom Elements */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, amount: 0.5 }}
                transition={{ duration: 1.2, ease: [0.22, 1, 0.36, 1], delay: 0.8 }}
              >
                <p
                  className="text-white text-2xl text-center"
                  style={{
                    fontFamily: "'Montserrat', sans-serif",
                    fontWeight: 300,
                  }}
                >
                  CURATED FOR PERFECTION
                </p>
              </motion.div>
              </div>
          </motion.div>

          {/* Right Section - Form Panel (1/3 width) */}
          <motion.div 
            className="w-2/3 bg-[#523329] flex items-center justify-center rounded-2xl p-8 px-25"
            initial={{ opacity: 0, x: 20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true, amount: 0.5 }}
            transition={{ duration: 1.2, ease: [0.22, 1, 0.36, 1], delay: 0.3 }}
          >
            <motion.div 
              className="w-full max-w-3xl border border-[#523329] p-16 rounded-2xl bg-white/75  rounded-4xl"
              initial={{ opacity: 0, scale: 0.9 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true, amount: 0.5 }}
              transition={{ duration: 1.0, ease: [0.16, 1, 0.3, 1], delay: 0.5 }}
            >
              {!isWeddingSubmitted ? (
                <>
                  {/* Form Header */}
                  <motion.div 
                    className="mb-4"
                    initial="hidden"
                    whileInView="visible"
                    viewport={{ once: true, amount: 0.6 }}
                    variants={staggerContainer}
                  >
                    <motion.p
                      className="text-[#523329] text-xl mb-2"
                      style={{
                        fontFamily: "'Spartan', sans-serif",
                        fontWeight: 350,
                      }}
                      initial={{ opacity: 0, y: 20 }}
                      whileInView={{ opacity: 1, y: 0 }}
                      viewport={{ once: true, amount: 0.6 }}
                      transition={{ duration: 0.9, ease: [0.16, 1, 0.3, 1], delay: 0.7 }}
                    >
                      Let's personalize your experience
                    </motion.p>
                    <motion.h3
                      className="text-xl font-bold text-[#3C2415]"
                      style={{
                        fontFamily: "'Spartan', sans-serif",
                        fontWeight: 400,
                      }}
                      initial={{ opacity: 0, y: 20 }}
                      whileInView={{ opacity: 1, y: 0 }}
                      viewport={{ once: true, amount: 0.6 }}
                      transition={{ duration: 0.9, ease: [0.16, 1, 0.3, 1], delay: 0.9 }}
                    >
                      Tell us about your Wedding
                    </motion.h3>
                  </motion.div>

                  <motion.form 
                    onSubmit={handleWeddingSubmit} 
                    className="space-y-6"
                    initial="hidden"
                    whileInView="visible"
                    viewport={{ once: true, amount: 0.5 }}
                    variants={staggerContainer}
                  >
                    {/* Name Field */}
                    <motion.div
                      variants={staggerItem}
                      initial={{ opacity: 0, y: 20 }}
                      whileInView={{ opacity: 1, y: 0 }}
                      viewport={{ once: true, amount: 0.5 }}
                      transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1], delay: 1.1 }}
                    >
                      <input
                        type="text"
                        placeholder="Name"
                        value={weddingFormData.name}
                        onChange={(e) =>
                          handleWeddingInputChange("name", e.target.value)
                        }
                        className="w-full bg-transparent border-0 border-b-2 py-3 text-[#523329] placeholder-[#523329] placeholder-opacity-70 text-left focus:border-[#523329] focus:outline-none focus:ring-0 transition-all duration-300 hover:border-[#523329]"
                        style={{
                          fontFamily: "'Spartan', sans-serif",
                          fontWeight: 350,
                        }}
                      />
                    </motion.div>

                    {/* Date Field */}
                    <motion.div 
                      className="relative"
                      initial={{ opacity: 0, y: 20 }}
                      whileInView={{ opacity: 1, y: 0 }}
                      viewport={{ once: true, amount: 0.5 }}
                      transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1], delay: 1.3 }}
                    >
                      <div
                        onClick={() => setIsDateDropdownOpen(!isDateDropdownOpen)}
                        className="w-full bg-transparent border-b-2 border-[#523329] py-3 text-[#523329] cursor-pointer transition-all duration-300 hover:border-[#6B3A1A] text-left"
                        style={{
                          fontFamily: "'Spartan', sans-serif",
                          fontWeight: 350,
                          opacity: weddingFormData.date ? 1 : 0.7,
                        }}
                      >
                        {weddingFormData.date || "When is your special day ?"}
                      </div>
                      {isDateDropdownOpen && (
                        <div className="absolute z-10 w-full mt-1 bg-white border border-[#523329] rounded-lg shadow-lg overflow-hidden">
                          {dateOptions.map((option) => (
                            <div
                              key={option}
                              onClick={() => {
                                handleWeddingInputChange("date", option);
                                setIsDateDropdownOpen(false);
                              }}
                              className="px-4 py-3 hover:bg-[#523329]/10 cursor-pointer transition-colors duration-200 text-[#523329]"
                              style={{
                                fontFamily: "'Spartan', sans-serif",
                                fontWeight: 350,
                              }}
                            >
                              {option}
                            </div>
                          ))}
                        </div>
                      )}
                    </motion.div>

                    {/* Budget Selection */}
                    <motion.div
                      initial={{ opacity: 0, y: 20 }}
                      whileInView={{ opacity: 1, y: 0 }}
                      viewport={{ once: true, amount: 0.5 }}
                      transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1], delay: 1.5 }}
                    >
                      <motion.p
                        className="text-[#000000] text-md lg:text-md mb-3 "
                        style={{
                          fontFamily: "'Spartan', sans-serif",
                          fontWeight: 500,
                        }}
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true, amount: 0.5 }}
                        transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1], delay: 1.5 }}
                      >
                       Please share your estimated budget for the event
                      </motion.p>
                      <motion.div 
                        className="grid grid-cols-3 gap-4"
                        initial="hidden"
                        whileInView="visible"
                        viewport={{ once: true, amount: 0.5 }}
                        variants={staggerContainer}
                      >
                        {[
                          { value: "5-10", label: "5-10 Lakhs" },
                          { value: "10-15", label: "10-15 Lakhs" },
                          { value: "20+", label: "Above 20 Lakhs" },
                        ].map((option, index) => (
                          <motion.button
                            key={option.value}
                            type="button"
                            onClick={() => setSelectedBudget(option.value)}
                            className={`p-3 rounded-lg text-center transition-all duration-300 hover:scale-105 ${
                              selectedBudget === option.value
                                ? "bg-[#523329] text-white shadow-lg"
                                : "bg-white text-[#523329] hover:bg-gray-50 hover:shadow-md"
                            }`}
                            style={{
                              fontFamily: "'Spartan', sans-serif",
                              fontWeight: 300,
                            }}
                            variants={staggerItem}
                            initial={{ opacity: 0, scale: 0.9 }}
                            whileInView={{ opacity: 1, scale: 1 }}
                            viewport={{ once: true, amount: 0.5 }}
                            transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1], delay: 1.7 + index * 0.1 }}
                          >
                            {option.label}
                          </motion.button>
                        ))}
                      </motion.div>
                    </motion.div>

                    {/* Phone Field */}
                    <motion.div
                      initial={{ opacity: 0, y: 20 }}
                      whileInView={{ opacity: 1, y: 0 }}
                      viewport={{ once: true, amount: 0.5 }}
                      transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1], delay: 2.0 }}
                    >
                      <div className="flex gap-2">
                        {/* Country Code Selector */}
                        <CountryCodeSelector
                          selectedCode={countryCode}
                          onSelect={(code) => {
                            setCountryCode(code);
                            setPhoneError("");
                          }}
                        />
                        {/* Phone Input */}
                        <input
                          type="tel"
                          inputMode="numeric"
                          pattern={countryCode === "+91" ? "[6-9][0-9]{9}" : "[0-9]*"}
                          maxLength={countryCode === "+91" ? 10 : 15}
                          placeholder="Phone number"
                          value={weddingFormData.phone}
                          onChange={(e) =>
                            handleWeddingInputChange("phone", e.target.value)
                          }
                          onKeyDown={(e) => {
                            // Allow: backspace, delete, tab, escape, enter, and decimal point
                            if ([46, 8, 9, 27, 13, 110, 190].indexOf(e.keyCode) !== -1 ||
                              // Allow: Ctrl+A, Ctrl+C, Ctrl+V, Ctrl+X
                              (e.keyCode === 65 && e.ctrlKey === true) ||
                              (e.keyCode === 67 && e.ctrlKey === true) ||
                              (e.keyCode === 86 && e.ctrlKey === true) ||
                              (e.keyCode === 88 && e.ctrlKey === true) ||
                              // Allow: home, end, left, right
                              (e.keyCode >= 35 && e.keyCode <= 39)) {
                              return;
                            }
                            // Ensure that it is a number and stop the keypress
                            if ((e.shiftKey || (e.keyCode < 48 || e.keyCode > 57)) && (e.keyCode < 96 || e.keyCode > 105)) {
                              e.preventDefault();
                            }
                          }}
                          className={`flex-1 bg-transparent border-0 border-b-2 py-3 text-[#523329] placeholder-[#523329] placeholder-opacity-70 text-left focus:outline-none focus:ring-0 transition-all duration-300 ${
                            phoneError ? 'border-red-500' : 'border-[#523329] focus:border-[#523329] hover:border-[#523329]'
                          }`}
                          style={{
                            fontFamily: "'Spartan', sans-serif",
                            fontWeight: 350,
                          }}
                        />
                      </div>
                      {phoneError && (
                        <p className="text-red-500 text-xs mt-1">
                          {phoneError}
                        </p>
                      )}
                    </motion.div>

                    {/* OTP Form - Show when OTP is sent for India */}
                    {showOTPForm && countryCode === "+91" && (
                      <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="mt-6 p-6 bg-white/50 rounded-lg"
                      >
                        <p className="text-[#523329] text-sm mb-4" style={{ fontFamily: "'Spartan', sans-serif", fontWeight: 400 }}>
                          Enter the 6-digit OTP sent to {countryCode} {weddingFormData.phone}
                        </p>
                        <div className="flex gap-2 justify-center mb-4">
                          {otpValue.map((digit, index) => (
                            <input
                              key={index}
                              id={`otp-${index}`}
                              type="text"
                              inputMode="numeric"
                              maxLength="1"
                              value={digit}
                              onChange={(e) => handleOtpChange(index, e.target.value)}
                              onKeyDown={(e) => handleOtpKeyDown(index, e)}
                              className="w-12 h-12 text-center text-lg border-2 border-[#523329] rounded-lg focus:border-[#840032] focus:outline-none transition-all"
                              style={{
                                fontFamily: "'Spartan', sans-serif",
                                fontWeight: 400,
                              }}
                            />
                          ))}
                        </div>
                        {otpError && (
                          <p className="text-red-500 text-xs text-center mb-4">
                            {otpError}
                          </p>
                        )}
                        <button
                          type="button"
                          onClick={verifyOTP}
                          disabled={isWeddingSubmitting || otpValue.join('').length !== 6}
                          className="w-full bg-[#840032] hover:bg-[#70022c] px-8 py-3 text-sm font-bold uppercase tracking-wide text-white rounded-xl transition-all duration-300 disabled:opacity-50"
                          style={{
                            fontFamily: "'Cinzel', serif",
                            fontWeight: 300,
                          }}
                        >
                          {isWeddingSubmitting ? "Verifying..." : "Verify OTP"}
                        </button>
                        <div className="flex flex-col gap-2 mt-2">
                          <button
                            type="button"
                            onClick={resendOTP}
                            disabled={resendCooldown > 0 || isWeddingSubmitting}
                            className={`w-full text-[#523329] text-sm transition-all duration-300 ${
                              resendCooldown > 0 
                                ? 'opacity-50 cursor-not-allowed' 
                                : 'hover:opacity-70 underline'
                            }`}
                            style={{
                              fontFamily: "'Spartan', sans-serif",
                              fontWeight: 350,
                            }}
                          >
                            {resendCooldown > 0 
                              ? `Resend OTP in ${resendCooldown}s` 
                              : 'Resend OTP'
                            }
                          </button>
                          <button
                            type="button"
                            onClick={() => {
                              setShowOTPForm(false);
                              setOtpSent(false);
                              setOtpValue(["", "", "", "", "", ""]);
                              setOtpReferenceId("");
                              setOtpError("");
                              setResendCooldown(0);
                            }}
                            className="w-full text-[#523329] text-sm underline hover:opacity-70 transition-opacity"
                            style={{
                              fontFamily: "'Spartan', sans-serif",
                              fontWeight: 350,
                            }}
                          >
                            Change Phone Number
                          </button>
                        </div>
                      </motion.div>
                    )}

                    {/* Submit Button */}
                    {!showOTPForm && (
                      <motion.div 
                        className="mt-8 text-left"
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true, amount: 0.5 }}
                        transition={{ duration: 1.0, ease: [0.16, 1, 0.3, 1], delay: 2.2 }}
                      >
                        <button
                          type="submit"
                          disabled={isWeddingSubmitting}
                          className="bg-[#840032] hover:bg-[#70022c] px-16 py-4 text-sm font-bold uppercase tracking-wide text-white rounded-xl transition-all duration-300 disabled:opacity-50 mt-4"
                          style={{
                            fontFamily: "'Cinzel', serif",
                            fontWeight: 300,
                          }}
                        >
                          {isWeddingSubmitting 
                            ? (countryCode === "+91" ? "Sending OTP..." : "Submitting...") 
                            : (countryCode === "+91" ? "Send OTP" : "Can't Wait to Start")
                          }
                        </button>
                      </motion.div>
                    )}
                  </motion.form>
                </>
              ) : (
                /* Success Message */
                <div className="text-center">
                  <div className="flex items-center justify-center">
                    <Image
                      src="/assets/landing_v2/thank_you.gif"
                      alt="success"
                      width={300}
                      height={100}
                      unoptimized={true}
                    />
                  </div>
                  <p
                    className="text-lg text-[#523329] pt-3"
                    style={{
                      fontFamily: "'Spartan', sans-serif",
                      fontWeight: 350,
                    }}
                  >
                    A member of our team will reach out shortly to begin your
                    experience.
                  </p>
                </div>
              )}
            </motion.div>
          </motion.div>
        </div>

        {/* Mobile Layout - Form Over Image */}
        <motion.div 
          className="lg:hidden relative min-h-screen"
          initial={{ opacity: 0, scale: 0.95 }}
          whileInView={{ opacity: 1, scale: 1 }}
          viewport={{ once: true, amount: 0.5 }}
          transition={{ duration: 1.2, ease: [0.22, 1, 0.36, 1] }}
        >
          {/* Background Image */}
          <div className="absolute inset-0">
            <Image
              src="/assets/landing_v2/wedding.webp"
              alt="Wedding couple"
              layout="fill"
              objectFit="cover"
              priority
            />
            {/* Black transparent overlay */}
            <div className="absolute inset-0 bg-black/40" />
          </div>

          {/* Content Overlay */}
          <div className="relative z-10 min-h-screen flex flex-col">
            {/* Top Branding */}
            <motion.div 
              className="pt-8 pb-4 px-4"
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true, amount: 0.6 }}
              variants={staggerContainer}
            >
              <motion.div 
                className="flex items-center justify-center mb-2"
                variants={staggerItem}
              >
                <motion.div
                  initial={{ opacity: 0, x: -20 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: true, amount: 0.5 }}
                  transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1], delay: 0.2 }}
                >
                <Image
                  src="/assets/landing_v2/left_bar.webp"
                  alt="decoration"
                  width={103}
                  height={3}
                  className="mr-2"
                />
                </motion.div>
                <motion.h1
                  className="text-4xl font-serif text-white mx-2"
                  style={{
                    fontFamily: "'Montserrat', sans-serif",
                    fontWeight: 300,
                  }}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true, amount: 0.5 }}
                  transition={{ duration: 1.2, ease: [0.22, 1, 0.36, 1], delay: 0.4 }}
                >
                  WEDSY
                </motion.h1>
                <motion.div
                  initial={{ opacity: 0, x: 20 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: true, amount: 0.5 }}
                  transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1], delay: 0.2 }}
                >
                <Image
                  src="/assets/landing_v2/right_bar.webp"
                  alt="decoration"
                  width={103}
                  height={3}
                  className="ml-2"
                />
                </motion.div>
              </motion.div>
              <motion.h2
                className="text-white text-sm text-center"
                style={{
                  fontFamily: "'Montserrat', sans-serif",
                  fontWeight: 100,
                }}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, amount: 0.5 }}
                transition={{ duration: 1.0, ease: [0.16, 1, 0.3, 1], delay: 0.6 }}
              >
               WEDDINGS MADE EASY
              </motion.h2>
            </motion.div>

            {/* Form Card - Centered */}
            <motion.div 
              className="flex-1 flex items-center justify-center px-4"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, amount: 0.5 }}
              transition={{ duration: 1.0, ease: [0.16, 1, 0.3, 1], delay: 0.3 }}
            >
              <motion.div 
                className="w-full max-w-lg bg-white/70 rounded-2xl px-4 min-h-[600px] flex flex-col justify-center"
                initial={{ opacity: 0, scale: 0.9 }}
                whileInView={{ opacity: 1, scale: 1 }}
                viewport={{ once: true, amount: 0.5 }}
                transition={{ duration: 1.0, ease: [0.16, 1, 0.3, 1], delay: 0.5 }}
              >
                {/* Form Header */}
                {!isWeddingSubmitted ? (
                  <>
                    <motion.div 
                      className="mb-6 text-center"
                      initial="hidden"
                      whileInView="visible"
                      viewport={{ once: true, amount: 0.6 }}
                      variants={staggerContainer}
                    >
                      <motion.p
                        className="text-[#523329] text-lg mb-1"
                        style={{
                          fontFamily: "'Spartan', sans-serif",
                          fontWeight: 350,
                        }}
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true, amount: 0.6 }}
                        transition={{ duration: 0.9, ease: [0.16, 1, 0.3, 1], delay: 0.7 }}
                      >
                       Let's personalize your experience
                      </motion.p>
                      <motion.h3
                        className="text-lg text-[#523329]"
                        style={{
                          fontFamily: "'Spartan', sans-serif",
                          fontWeight: 500,
                        }}
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true, amount: 0.6 }}
                        transition={{ duration: 0.9, ease: [0.16, 1, 0.3, 1], delay: 0.9 }}
                      >
Tell us about your Wedding
                      </motion.h3>
                    </motion.div>

                    <motion.form 
                      onSubmit={handleWeddingSubmit} 
                      className="space-y-8 px-4"
                      initial="hidden"
                      whileInView="visible"
                      viewport={{ once: true, amount: 0.5 }}
                      variants={staggerContainer}
                    >
                      {/* Name Field */}
                      <motion.div
                        variants={staggerItem}
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true, amount: 0.5 }}
                        transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1], delay: 1.1 }}
                      >
                        <input
                          type="text"
                          placeholder="Name"
                          value={weddingFormData.name}
                          onChange={(e) =>
                            handleWeddingInputChange("name", e.target.value)
                          }
                          className="w-full bg-transparent border-0 border-b-2 border-[#000000] py-2 text-[#000000] placeholder-[#000000] placeholder-opacity-70 text-base text-center focus:border-[#000000] focus:outline-none focus:ring-0 transition-all duration-300 hover:border-[#000000]"
                          style={{
                            fontFamily: "'Spartan', sans-serif",
                            fontWeight: 350,
                          }}
                        />
                      </motion.div>

                      {/* Date Field */}
                      <motion.div 
                        className="relative"
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true, amount: 0.5 }}
                        transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1], delay: 1.3 }}
                      >
                        <div
                          onClick={() => setIsDateDropdownOpen(!isDateDropdownOpen)}
                          className="w-full bg-transparent border-b-2 border-[#000000] py-2 text-[#000000] text-base text-center cursor-pointer transition-all duration-300 hover:border-[#000000]"
                          style={{
                            fontFamily: "'Spartan', sans-serif",
                            fontWeight: 350,
                            opacity: weddingFormData.date ? 1 : 0.7,
                          }}
                        >
                          {weddingFormData.date || "When is your special day ?"}
                        </div>
                        {isDateDropdownOpen && (
                          <div className="absolute z-10 w-full mt-1 bg-white border border-[#000000] rounded-lg shadow-lg overflow-hidden">
                            {dateOptions.map((option) => (
                              <div
                                key={option}
                                onClick={() => {
                                  handleWeddingInputChange("date", option);
                                  setIsDateDropdownOpen(false);
                                }}
                                className="px-4 py-3 hover:bg-[#000000]/10 cursor-pointer transition-colors duration-200 text-[#000000] text-center"
                                style={{
                                  fontFamily: "'Spartan', sans-serif",
                                  fontWeight: 350,
                                }}
                              >
                                {option}
                              </div>
                            ))}
                          </div>
                        )}
                      </motion.div>

                      {/* Budget Selection */}
                      <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true, amount: 0.5 }}
                        transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1], delay: 1.5 }}
                      >
                        <motion.p
                          className="text-[#000000] text-md mb-2 text-center whitespace-pre-line"
                          style={{
                            fontFamily: "'Spartan', sans-serif",
                            fontWeight: 500,
                          }}
                          initial={{ opacity: 0, y: 20 }}
                          whileInView={{ opacity: 1, y: 0 }}
                          viewport={{ once: true, amount: 0.5 }}
                          transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1], delay: 1.5 }}
                        >
                          What is your budget?
                        </motion.p>
                        <motion.div 
                          className="grid grid-cols-3 gap-2"
                          initial="hidden"
                          whileInView="visible"
                          viewport={{ once: true, amount: 0.5 }}
                          variants={staggerContainer}
                        >
                          {[
                            { value: "5-10", label: "5-10 Lakhs" },
                            { value: "10-15", label: "10-15 Lakhs" },
                            { value: "20+", label: "Above 20 Lakhs" },
                          ].map((option, index) => (
                            <motion.button
                              key={option.value}
                              type="button"
                              onClick={() => setSelectedBudget(option.value)}
                              className={`p-2 rounded-lg text-center transition-all duration-300 text-xs hover:scale-105 ${
                                selectedBudget === option.value
                                  ? "bg-[#523329] text-white shadow-lg"
                                  : "bg-white text-[#523329] hover:bg-gray-50 hover:shadow-md"
                              }`}
                              style={{
                                fontFamily: "'Spartan', sans-serif",
                                fontWeight: 350,
                              }}
                              variants={staggerItem}
                              initial={{ opacity: 0, scale: 0.9 }}
                              whileInView={{ opacity: 1, scale: 1 }}
                              viewport={{ once: true, amount: 0.5 }}
                              transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1], delay: 1.7 + index * 0.1 }}
                            >
                              {option.label}
                            </motion.button>
                          ))}
                        </motion.div>
                      </motion.div>

                      {/* Phone Field */}
                      <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true, amount: 0.5 }}
                        transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1], delay: 2.0 }}
                      >
                        <div className="flex gap-2 min-w-0 overflow-hidden">
                          {/* Country Code Selector */}
                          <CountryCodeSelector
                            selectedCode={countryCode}
                            onSelect={(code) => {
                              setCountryCode(code);
                              setPhoneError("");
                            }}
                            className="[&_button]:border-[#000000] [&_button]:text-[#000000] [&_button]:hover:border-[#000000] [&_button]:min-w-[70px] [&_button]:py-2 [&_button]:text-sm [&_div]:border-[#000000] [&_div]:text-[#000000]"
                          />
                          {/* Phone Input */}
                          <input
                            type="tel"
                            inputMode="numeric"
                            pattern={countryCode === "+91" ? "[6-9][0-9]{9}" : "[0-9]*"}
                            maxLength={countryCode === "+91" ? 10 : 15}
                            placeholder="Phone number"
                            value={weddingFormData.phone}
                            onChange={(e) =>
                              handleWeddingInputChange("phone", e.target.value)
                            }
                            onKeyDown={(e) => {
                              // Allow: backspace, delete, tab, escape, enter, and decimal point
                              if ([46, 8, 9, 27, 13, 110, 190].indexOf(e.keyCode) !== -1 ||
                                // Allow: Ctrl+A, Ctrl+C, Ctrl+V, Ctrl+X
                                (e.keyCode === 65 && e.ctrlKey === true) ||
                                (e.keyCode === 67 && e.ctrlKey === true) ||
                                (e.keyCode === 86 && e.ctrlKey === true) ||
                                (e.keyCode === 88 && e.ctrlKey === true) ||
                                // Allow: home, end, left, right
                                (e.keyCode >= 35 && e.keyCode <= 39)) {
                                return;
                              }
                              // Ensure that it is a number and stop the keypress
                              if ((e.shiftKey || (e.keyCode < 48 || e.keyCode > 57)) && (e.keyCode < 96 || e.keyCode > 105)) {
                                e.preventDefault();
                              }
                            }}
                            className={`flex-1 min-w-0 bg-transparent border-0 border-b-2 py-2 text-[#000000] placeholder-[#000000] placeholder-opacity-70 text-base text-center focus:outline-none focus:ring-0 transition-all duration-300 ${
                              phoneError ? 'border-red-500' : 'border-[#000000] focus:border-[#000000] hover:border-[#000000]'
                            }`}
                            style={{
                              fontFamily: "'Spartan', sans-serif",
                              fontWeight: 350,
                            }}
                          />
                        </div>
                        {phoneError && (
                          <p className="text-red-500 text-xs mt-1 text-center">
                            {phoneError}
                          </p>
                        )}
                      </motion.div>

                      {/* OTP Form - Show when OTP is sent for India */}
                      {showOTPForm && countryCode === "+91" && (
                        <motion.div
                          initial={{ opacity: 0, y: 20 }}
                          animate={{ opacity: 1, y: 0 }}
                          className="mt-6 p-4 bg-white/70 rounded-lg"
                        >
                          <p className="text-[#000000] text-sm mb-4 text-center" style={{ fontFamily: "'Spartan', sans-serif", fontWeight: 400 }}>
                            Enter the 6-digit OTP sent to {countryCode} {weddingFormData.phone}
                          </p>
                          <div className="flex gap-2 justify-center mb-4">
                            {otpValue.map((digit, index) => (
                              <input
                                key={index}
                                id={`otp-mobile-${index}`}
                                type="text"
                                inputMode="numeric"
                                maxLength="1"
                                value={digit}
                                onChange={(e) => handleOtpChange(index, e.target.value, true)}
                                onKeyDown={(e) => handleOtpKeyDown(index, e, true)}
                                className="w-10 h-10 text-center text-base border-2 border-[#000000] rounded-lg focus:border-[#840032] focus:outline-none transition-all"
                                style={{
                                  fontFamily: "'Spartan', sans-serif",
                                  fontWeight: 400,
                                }}
                              />
                            ))}
                          </div>
                          {otpError && (
                            <p className="text-red-500 text-xs text-center mb-4">
                              {otpError}
                            </p>
                          )}
                          <button
                            type="button"
                            onClick={verifyOTP}
                            disabled={isWeddingSubmitting || otpValue.join('').length !== 6}
                            className="w-full bg-[#840032] hover:bg-[#70022c] px-8 py-3 text-sm font-bold uppercase tracking-wide text-white rounded-xl transition-all duration-300 disabled:opacity-50"
                            style={{
                              fontFamily: "'Cinzel', serif",
                              fontWeight: 300,
                            }}
                          >
                            {isWeddingSubmitting ? "Verifying..." : "Verify OTP"}
                          </button>
                          <div className="flex flex-col gap-2 mt-2">
                            <button
                              type="button"
                              onClick={resendOTP}
                              disabled={resendCooldown > 0 || isWeddingSubmitting}
                              className={`w-full text-[#000000] text-sm transition-all duration-300 ${
                                resendCooldown > 0 
                                  ? 'opacity-50 cursor-not-allowed' 
                                  : 'hover:opacity-70 underline'
                              }`}
                              style={{
                                fontFamily: "'Spartan', sans-serif",
                                fontWeight: 350,
                              }}
                            >
                              {resendCooldown > 0 
                                ? `Resend OTP in ${resendCooldown}s` 
                                : 'Resend OTP'
                              }
                            </button>
                            <button
                              type="button"
                              onClick={() => {
                                setShowOTPForm(false);
                                setOtpSent(false);
                                setOtpValue(["", "", "", "", "", ""]);
                                setOtpReferenceId("");
                                setOtpError("");
                                setResendCooldown(0);
                              }}
                              className="w-full text-[#000000] text-sm underline hover:opacity-70 transition-opacity"
                              style={{
                                fontFamily: "'Spartan', sans-serif",
                                fontWeight: 350,
                              }}
                            >
                              Change Phone Number
                            </button>
                          </div>
                        </motion.div>
                      )}

                      {/* Submit Button */}
                      {!showOTPForm && (
                        <motion.div 
                          className="mt-8 text-center"
                          initial={{ opacity: 0, y: 20 }}
                          whileInView={{ opacity: 1, y: 0 }}
                          viewport={{ once: true, amount: 0.5 }}
                          transition={{ duration: 1.0, ease: [0.16, 1, 0.3, 1], delay: 2.2 }}
                        >
                          <button
                            type="submit"
                            disabled={isWeddingSubmitting}
                            className="w-full bg-[#840032] hover:bg-[#70022c] px-4 py-3 text-sm md:text-xl font-bold uppercase tracking-wide text-white rounded-xl transition-all duration-300 disabled:opacity-50"
                            style={{
                              fontFamily: "'Cinzel', serif",
                              fontWeight: 300,
                            }}
                          >
                            {isWeddingSubmitting 
                              ? (countryCode === "+91" ? "Sending OTP..." : "Submitting...") 
                              : (countryCode === "+91" ? "Send OTP" : "Can't Wait to Start")
                            }
                          </button>
                        </motion.div>
                      )}
                    </motion.form>
                  </>
                ) : (
                  /* Success Message */
                  <div className="text-center px-4">
                    <div className="flex items-center justify-center">
                      <Image
                        src="/assets/landing_v2/thank_you.gif"
                        alt="success"
                        width={300}
                        height={100}
                        unoptimized={true}
                      />
                    </div>
                    <p
                      className="text-lg text-[#523329]"
                      style={{
                        fontFamily: "'Spartan', sans-serif",
                        fontWeight: 350,
                      }}
                    >
                      A member of our team will reach out shortly to begin your
                      experience.
                    </p>
                  </div>
                )}
              </motion.div>
            </motion.div>
              </div>
        </motion.div>
      </section>

      {/* FAQ Section */}
      <section className="w-full" style={{ backgroundColor: '#F9F8F6' }}>
        <motion.div 
          className="relative w-full"
          initial={{ opacity: 0, scale: 0.95 }}
          whileInView={{ opacity: 1, scale: 1 }}
          viewport={{ once: true, amount: 0.5 }}
          transition={{ duration: 1.2, ease: [0.22, 1, 0.36, 1] }}
        >
          {/* Desktop Image */}
          <motion.div
            className="hidden md:block"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.5 }}
            transition={{ duration: 1.0, ease: [0.16, 1, 0.3, 1] }}
          >
          <Image
            src="/assets/landing_v2/FAQ_Desktop.webp"
            alt="Frequently Asked Questions"
            width={1920}
            height={800}
            layout="responsive"
            objectFit="cover"
              className="w-full px-4"
          />
          </motion.div>
          {/* Mobile Image */}
          <motion.div
            className="block md:hidden"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.5 }}
            transition={{ duration: 1.0, ease: [0.16, 1, 0.3, 1] }}
          >
          <Image
            src="/assets/landing_v2/FAQ_mobile.webp"
            alt="Frequently Asked Questions"
            width={768}
            height={600}
            layout="responsive"
            objectFit="cover"
              className="w-full"
          />
          </motion.div>
        </motion.div>
        
        {/* FAQ Accordion - Show only 5 FAQs */}
        <motion.div 
          className="px-6 md:px-40 py-8 md:py-8"
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, amount: 0.6 }}
          variants={staggerContainer}
        >
          <div className="max-w-7xl mx-auto">
            <motion.div 
              className="flex flex-col"
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true, amount: 0.5 }}
              variants={staggerContainer}
            >
              {faqsData.slice(0, 5).map((faq, index) => (
                <motion.div 
                  key={index} 
                  className="flex flex-col"
                  variants={staggerItem}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true, amount: 0.5 }}
                  transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1], delay: index * 0.15 }}
                >
                  <motion.button
                    className="w-full text-left py-4 md:py-6 focus:outline-none flex justify-between items-center"
                    onClick={() => toggleFAQ(index)}
                    initial={{ opacity: 0, x: -20 }}
                    whileInView={{ opacity: 1, x: 0 }}
                    viewport={{ once: true, amount: 0.5 }}
                    transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1], delay: index * 0.15 + 0.2 }}
                  >
                    <p className="text-black text-base md:text-lg font-semibold pr-4" style={{ fontFamily: 'Montserrat', letterSpacing: '0.01em' }}>
                      {faq.question}
                    </p>
                    <motion.svg
                      xmlns="http://www.w3.org/2000/svg"
                      className={`h-6 w-6 flex-shrink-0 transition-transform duration-300 ${openIndex === index ? 'rotate-45' : ''}`}
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                      strokeWidth={2}
                      initial={{ opacity: 0, scale: 0.9 }}
                      whileInView={{ opacity: 1, scale: 1 }}
                      viewport={{ once: true, amount: 0.5 }}
                      transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1], delay: index * 0.15 + 0.3 }}
                    >
                      <path strokeLinecap="round" strokeLinejoin="round" d="M12 4v16m8-8H4" />
                    </motion.svg>
                  </motion.button>
                  <div
                    className={`overflow-hidden transition-all duration-500 ease-in-out ${
                      openIndex === index ? 'max-h-96 opacity-100' : 'max-h-0 opacity-0'
                    }`}
                  >
                    <motion.p 
                      className="text-gray-700 text-sm md:text-base mb-4 md:mb-6" 
                      style={{ fontFamily: 'Montserrat', letterSpacing: '0.01em' }}
                      initial={{ opacity: 0, y: 10 }}
                      animate={openIndex === index ? { opacity: 1, y: 0 } : { opacity: 0, y: 10 }}
                      transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
                    >
                      {faq.answer}
                    </motion.p>
                  </div>
                  <div className="w-full border-b border-dashed border-gray-400"></div>
                </motion.div>
              ))}
            </motion.div>
            
            {/* View More Button */}
            <motion.div 
              className="flex justify-center mt-8 md:mt-12"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, amount: 0.5 }}
              transition={{ duration: 1.0, ease: [0.16, 1, 0.3, 1], delay: 1.0 }}
            >
              <Link href="/faq">
                <button
                  className="bg-[#840032] text-white px-10 md:px-16 py-3 md:py-4 rounded-xl text-sm md:text-base font-semibold uppercase tracking-wider hover:bg-[#6a0029] transition-all duration-300 ease-in-out shadow-lg"
                  style={{ fontFamily: "'Cinzel', serif" }}
                >
                  View More
                </button>
              </Link>
            </motion.div>
            </div>
        </motion.div>
      </section>

      {/* Most */}
      
      {/* <section className="py-16 md:py-24 px-6 md:px-40">
        <div className="max-w-7xl mx-auto  overflow-hidden">
          <div className="w-full flex justify-center">
            <div className="h-px bg-[#D6D6D6] w-full max-w-7xl px-4 md:px-10 lg:px-20"></div>
          </div>
          <div className="relative w-full h-auto" style={{ paddingTop: '56.25%' }}>
          
            <Image
              src="/assets/images/Most_asked.webp"
              alt="Most Frequently Asked Questions"
              layout="fill"
              objectFit="cover"
              className="rounded-lg"
            />
          </div>
        </div>
      </section> */}
      



      {/* say i do */}
      {/* <section className={`${styles.section__1} flex flex-col md:py-16 gap-6`}>
        <Image
          src="/assets/background/bg-section-1-mobile.webp"
          alt="Decor"
          width={0}
          height={0}
          sizes="100%"
          style={{ width: "100%", height: "auto" }}
          className="md:hidden"
        />
        <span className="text-2xl md:text-4xl -mt-16 md:mt-0 bg-white md:bg-transparent relative">
          <span className="flex gap-2 mb-2 md:mb-0">
            Say <span className="text-[#D33467] flex">I DO </span>
            <Image
              src={tickGif}
              alt="Decor"
              width={0}
              height={0}
              sizes="100%"
              style={{ width: "1em", height: "auto" }}
            />
          </span>
          
          To Expert Wedding Planning!
        </span>
        <p className="md:w-1/3 bg-white md:bg-transparent">
          Are you ready to say ‘I Do’ to a wedding that exceeds your wildest
          dreams? Our certified wedding planners are here to make it happen. Get
          a free consultation and say goodbye to wedding planning stress and
          hello to seamless perfection.{" "}
        </p>
        {data.secondary.success ? (
          <p className="md:w-1/3">
            Your Wedsy Wedding Manager will contact you and assist you in
            choosing the best!
          </p>
        ) : (
          <>
            <input
              type="text"
              placeholder="NAME"
              value={data.secondary.name}
              onChange={(e) =>
                setData({
                  ...data,
                  secondary: { ...data.secondary, name: e.target.value },
                })
              }
              name="name"
              className="md:w-1/4 text-black bg-transparent border-0 border-b-gray-500 outline-0 focus:outline-none focus:border-0 border-b focus:border-b focus:border-b-black focus:ring-0  placeholder:text-black"
            />
            <input
              type="text"
              placeholder="PHONE NO."
              value={data.secondary.phone}
              onChange={(e) =>
                setData({
                  ...data,
                  secondary: { ...data.secondary, phone: e.target.value },
                })
              }
              name="phone"
              disabled={data.secondary.otpSent}
              className="md:w-1/4 text-black bg-transparent border-0 border-b-gray-500 outline-0 focus:outline-none focus:border-0 border-b focus:border-b focus:border-b-black focus:ring-0  placeholder:text-black"
            />
            {data.secondary.otpSent && (
              <input
                type="text"
                placeholder="OTP"
                value={data.secondary.Otp}
                onChange={(e) =>
                  setData({
                    ...data,
                    secondary: { ...data.secondary, Otp: e.target.value },
                  })
                }
                name="otp"
                className="md:w-1/4 text-black bg-transparent border-0 border-b-gray-500 outline-0 focus:outline-none focus:border-0 border-b focus:border-b focus:border-b-black focus:ring-0  placeholder:text-black"
              />
            )}
            {data.secondary.message && (
              <p className="text-red-500 w-1/4">{data.secondary.message}</p>
            )}
            <button
              type="submit"
              className="md:w-1/4 rounded-full bg-black text-white py-2 disabled:bg-black/50"
              disabled={
                !data.secondary.name ||
                !data.secondary.phone ||
                // !/^\d{10}$/.test(data.secondary.phone) ||
                // processMobileNumber(data.secondary.phone) ||
                data.secondary.loading ||
                (data.secondary.otpSent ? !data.secondary.Otp : false)
              }
              onClick={() => {
                data.secondary.otpSent ? handleSecondaryEnquiry() : SendOTP();
              }}
            >
              SUBMIT
            </button>
          </>
        )}
      </section> */}

      {/* <section
        className={`${styles.section__2} flex flex-col gap-12 p-6 md:py-16 md:px-24`}
      >
        <p className="text-[#D33467] flex font-medium gap-2">
          <span className="text-4xl md:text-6xl">THE BEST</span>
          <span className="text-sm md:text-xl flex flex-col">
            <span>IN</span>

            <span>TOWN</span>
          </span>
          <span className="text-4xl md:text-6xl">!</span>
        </p>
        <p className="text-center text-2xl md:text-3xl">
          What Makes Wedsy Stand Out?
        </p>
        <div className="grid grid-cols-2 md:flex md:flex-row gap-4 md:gap-12 mx-auto">
          <div className="text-center flex flex-col items-center gap-3">
            <div className="bg-[#FFB8C0] flex justify-center rounded-3xl w-32 h-32">
              <img className="m-auto" src="/assets/icons/easy.webp" alt="Easy booking" />
            </div>
            <span>Easy</span>
          </div>
          <div className="text-center flex flex-col items-center gap-3">
            <div className="bg-[#D6FF79] flex justify-center rounded-3xl w-32 h-32">
              <img className="m-auto" src="/assets/icons/price.webp" alt="Best price" />
            </div>
            <span>Unbeatable Pricing</span>
          </div>
          <div className="text-center flex flex-col items-center gap-3">
            <div className="bg-[#F19A3E] flex justify-center rounded-3xl w-32 h-32">
              <img className="m-auto" src="/assets/icons/quality.webp" alt="Quality service" />
            </div>
            <span>Superior Quality</span>
          </div>
          <div className="text-center flex flex-col items-center gap-3">
            <div className="bg-[#70D6FF] flex justify-center rounded-3xl w-32 h-32">
              <img className="m-auto" src="/assets/icons/solutions.webp" alt="End-to-end solutions" />
            </div>
            <span>Innovative Solutions</span>
          </div>
        </div>
      </section> */}
      {/* <section
        className={`${styles.packages_section} flex flex-col  py-6 md:py-16 gap-6`}
      >
        <p className="font-semibold text-2xl md:text-4xl text-rose-900 text-center px-6 md:px-24">
          PACKAGES
        </p>
        <p className="text-lg md:text-2xl text-center px-6 md:px-24">
          Unlock Ease and Affordability with Our Packages
        </p>
        <div className="grid md:grid-cols-4 gap-8 px-6 md:px-24">
          {packages?.map((item, index) => (
            <DecorPackageCard decorPackage={item} key={index} />
          ))}
        </div>
      </section> */}



      {/* <PlanYourEvent /> */}


      {/* vendor and user sections */}

      <VendorUserSection />




      {/* footer section */}




      {/* faq section */}
      {/* 
      <section className="py-16 md:py-24 px-6 md:px-40 hidden md:block">
        <div className="max-w-7xl mx-auto">
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-12 md:mb-16 relative">
            
            <h2 className="text-2xl md:text-3xl lg:text-4xl text-gray-800 leading-tight" style={{ fontFamily: 'Montserrat', letterSpacing: '0.01em' }}>
              <span className="font-extrabold text-transparent relative inline-block mr-2" style={{ WebkitTextStroke: '2px black', textStroke: '2px black' }}>MOST</span>
              <span className="font-semibold">FREQUENTLY ASKED QUESTIONS </span>
              <br className="md:hidden" />
              <span className="font-semibold">BY OUR CUSTOMERS</span>
            </h2>
          </div>

          
          <div className="flex flex-col">
            {faqsData.map((faq, index) => (
              <div key={index} className="flex flex-col">
                <button
                  className="w-full text-left py-4 md:py-6 focus:outline-none flex justify-between items-center"
                  onClick={() => toggleFAQ(index)}
                >
                  <p className="text-black text-base md:text-lg font-semibold" style={{ fontFamily: 'Montserrat', letterSpacing: '0.01em' }}>
                    {faq.question}
                  </p>
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className={`h-6 w-6 transition-transform duration-300 ${openIndex === index ? 'rotate-45' : ''}`}
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                    strokeWidth={2}
                  >
                    <path strokeLinecap="round" strokeLinejoin="round" d="M12 4v16m8-8H4" />
                  </svg>
                </button>
                <div
                  className={`overflow-hidden transition-max-height duration-500 ease-in-out ${
                    openIndex === index ? 'max-h-96 opacity-100' : 'max-h-0 opacity-0'
                  }`}
                >
                  <p className="text-gray-700 text-sm md:text-base mb-4 md:mb-6" style={{ fontFamily: 'Montserrat', letterSpacing: '0.01em' }}>
                    {faq.answer}
                  </p>
                </div>
                <div className="w-full h-px bg-[#C6C6C6]"></div>
              </div>
            ))}
          </div>
        </div>
      </section>
      */}

      {/* <Testimonials /> */}
      {/* <section className="mt-4 mb-8">
        <div className="w-full py-12 relative">
          <p className="mb-32 md:mb-0 text-center text-rose-900 text-xl font-semibold tracking-wider uppercase px-6 md:px-16 md:w-1/2 md:translate-y-full">
            {
              "“ A wedding is not just a day, it's a journey, a story, and a promise of a lifetime “"
            }
          </p>
          <Image
            src="/assets/images/couple.webp"
            alt="flower"
            width={0}
            height={0}
            sizes="100%"
            className="absolute bottom-0 right-12 hidden md:inline"
            style={{ height: "20em", width: "auto" }}
          />
          <Image
            src="/assets/images/couple.webp"
            alt="flower"
            width={0}
            height={0}
            sizes="100%"
            className="absolute bottom-0 right-6 inline md:hidden"
            style={{ height: "15em", width: "auto" }}
          />
          <div className="w-2/3 md:w-1/2 bg-gradient-to-t from-rose-900 to-transparent rounded-bl-3xl p-6 px-8 ml-auto md:ml-0 md:translate-x-full relative">
            <Image
              src="/assets/images/flowers-1.webp"
              alt="flower"
              width={0}
              height={0}
              sizes="100%"
              className="absolute top-0 left-0 -translate-x-1/2 -translate-y-1/2 hidden md:inline"
              style={{ height: "8em", width: "auto" }}
            />
            <div className="flex flex-col items-end max-w-max">
              <span className="font-medium text-2xl text-rose-900 md:tracking-[0.4em]">
                JOIN NOW
              </span>
              <Link href={"/login"}>
                <BsArrowRightShort
                  size={48}
                  className="cursor-pointer scale-[0.5] md:scale-[1] rounded-full bg-gradient-to-b from-rose-900/0 to-rose-900"
                  color="white"
                />
              </Link>
            </div>
          </div>
        </div>
      </section> */}

      {/* Expert Consultation Modal */}
      <ExpertConsultModal 
        openModal={openExpertModal} 
        setOpenModal={setOpenExpertModal} 
      />

      {/* Toast Notification */}
      <NotificationToast
        show={toast.show}
        message={toast.message}
        type={toast.type}
        onClose={() => setToast({ show: false, message: "", type: "error" })}
      />

    </>
  );
}

export async function getServerSideProps(context) {
  try {
    const apiUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8090';
    
    if (!apiUrl) {
      console.warn("NEXT_PUBLIC_API_URL not configured; returning empty packages list");
      return {
        props: {
          packages: null,
        },
      };
    }

    const packagesResponse = await fetch(
      `${apiUrl}/decor-package?limit=8`
    );
    
    if (!packagesResponse.ok) {
      throw new Error(`API responded with status: ${packagesResponse.status}`);
    }
    
    const packagesData = await packagesResponse.json();
    return {
      props: {
        packages: packagesData.list ? packagesData.list.sort((a, b) => 0.5 - Math.random()) : null,
      },
    };
  } catch (error) {
    console.error("Error fetching data:", error);

    return {
      props: {
        packages: null,
      },
    };
  }
}

export default Home;
