import PlanYourEvent from "@/components/screens/PlanYourEvent";
import { LandingPageSkeleton } from "@/components/skeletons/landing_page";
import VendorUserSection from "@/pages/reuseableComponents/VendorUserSection";
import styles from "@/styles/Home.module.css";
import { processMobileNumber } from "@/utils/phoneNumber";
import Head from "next/head";
import Image from "next/image";
import Link from "next/link";
import { useEffect, useState, useRef } from "react";

function Home({ packages }) {
  const [isLoading, setIsLoading] = useState(true);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const videoRef = useRef(null);
  const mobileVideoRef = useRef(null);
  
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

  const dateOptions = [
    "Before 3 months",
    "Between 3-6 months",
    "Beyond 6 months",
  ];

  const handleWeddingInputChange = (field, value) => {
    setWeddingFormData((prev) => ({ ...prev, [field]: value }));
    if (field === 'phone' && phoneError) {
      setPhoneError("");
    }
  };

  const validateWeddingPhone = (phone) => {
    const cleanPhone = phone.replace(/\D/g, '');
    return cleanPhone.length === 10 && /^\d{10}$/.test(cleanPhone);
  };

  const handleWeddingSubmit = async (e) => {
    e.preventDefault();
    
    if (!weddingFormData.name.trim() || !weddingFormData.phone.trim()) {
      alert("Please fill in all required fields (Name and Phone)");
      return;
    }
    
    if (weddingFormData.phone && !validateWeddingPhone(weddingFormData.phone)) {
      setPhoneError("Phone number must be exactly 10 digits");
      return;
    }
    
    setIsWeddingSubmitting(true);

    try {
      const budgetMap = {
        "5-10": 750000,
        "10-15": 1250000,
        "20+": 2000000,
      };

      const budgetValue = budgetMap[selectedBudget] || 750000;

      const formDataToSend = new FormData();
      formDataToSend.append('name', weddingFormData.name || '');
      formDataToSend.append('phone', weddingFormData.phone || '');
      formDataToSend.append('budget', budgetValue.toString());
      formDataToSend.append('date', weddingFormData.date || '');
      formDataToSend.append('formType', 'wedding-requirements');

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
    } catch (error) {
      console.error("Error submitting form:", error);
      alert("Error submitting form. Please try again.");
    } finally {
      setIsWeddingSubmitting(false);
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
          }
        })
        .catch((error) => {
          console.error("There was a problem with the fetch operation:", error);
        });
    } else {
      alert("Please enter valid mobile number");
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
      alert("Please enter valid mobile number");
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
          Affordable Wedding Packages in Bangalore - Best Planners in Bangalore
        </title>
        <meta
          name="description"
          content="Find affordable wedding planners in Bangalore. Explore budget-friendly wedding, event, and destination packages in India. Tailored solutions for your perfect day!"
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
        <meta property="og:image" content="https://www.wedsy.in/logo-black.webp" />
        <meta property="og:url" content="https://www.wedsy.in/" />
        <meta property="og:type" content="website" />
        <meta property="og:site_name" content="Wedsy" />
        
        {/* Twitter Card Tags */}
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:title" content="Affordable Wedding Packages in Bangalore - Best Planners in Bangalore | Wedsy" />
        <meta name="twitter:description" content="Find affordable wedding planners in Bangalore. Explore budget-friendly wedding, event, and destination packages in India." />
        <meta name="twitter:image" content="https://www.wedsy.in/logo-black.webp" />
        
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
          <h1
            className="text-4xl md:text-6xl lg:text-7xl text-white mb-3"
            style={{
              fontFamily: "'Dream Avenue', serif",
              fontWeight: 400,
              fontStyle: "normal",
            }}
          >
            Luxury weddings, seamlessly planned.
          </h1>

          {/* Subtext */}
          <p
            className="text-md md:text-xl lg:text-3xl text-white mb-8"
            style={{
              fontFamily: "'Montserrat', sans-serif",
              fontWeight: 400,
              fontStyle: "normal",
            }}
          >
            Complete wedding planning, from start to celebration.<br />
    
            <span className="hidden sm:block lg:hidden">Tech Enabled</span>
          </p>

          {/* CTA Button */}
          <Link href="/decor">
            <button
              className="bg-black/30 backdrop-blur-md border-2 border-white text-white py-4 text-lg font-semibold tracking-widest px-16 rounded-2xl
                        hover:bg-white/40 transition-all duration-300 ease-in-out"
              style={{
                fontFamily: "'Montserrat', sans-serif",
                fontWeight: 600,
              }}
            >
              START PLANNING
            </button>
          </Link>
        </div>
      </main>


      {/* why choose wedsy section */}
      <main className={`${styles.main__div__2} md:mt-20 py-1 px-1`}>
        <div className="flex flex-col h-full relative">
          {/* Mobile View */}
          <div className="block md:hidden px-4 pb-8 mt-16">
            <h1 className="text-lg font-semibold text-black" style={{
              fontFamily: 'Montserrat, sans-serif',
            }}>
              THE WEDDING STORE
            </h1>
            
            <p className="text-lg text-black" style={{
              fontFamily: 'Montserrat, sans-serif',
              fontStyle: 'normal',
            }}>
              Everything You Need.
            </p>
            <p className="text-lg mb-4" style={{
              fontFamily: 'Montserrat, sans-serif',
              fontStyle: 'normal',
              color: '#840032',
              fontWeight: 'bold',
            }}>
              With Pricing.
            </p>

            <p className="text-sm text-black" style={{
              fontFamily: 'Montserrat, sans-serif',
              fontStyle: 'normal',
            }}>
              One place to discover, price, and plan your entire wedding setup.
            </p>
          </div>

          {/* Desktop View */}
          <div className="hidden md:block px-18 md:px-20 pb-12">
            <h1 className="text-lg md:text-lg lg:text-3xl font-semibold text-black mb-4" style={{
              fontFamily: 'Montserrat, sans-serif',
            }}>
              THE WEDDING STORE
            </h1>
            
            <p className="text-[20px] md:text-[24px] text-black mb-6" style={{
              fontFamily: 'Montserrat, sans-serif',
            }}>
              Everything You Need. <span style={{ color: '#840032', fontWeight: 'bold' }}>With Pricing.</span>
            </p>

            <div className="flex flex-wrap items-center gap-x-4 gap-y-2 text-black font-semibold text-sm md:text-md lg:text-sm" style={{
              fontFamily: 'Montserrat, sans-serif',
            }}>
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
            </div>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-6 px-4 md:px-20 gap-1">

            <div className="relative overflow-hidden bg-[#3C3C3C] h-[200px] rounded-md md:h-auto md:row-span-2 md:col-span-3 md:rounded-none group">
              <Image src="/assets/landing/img-1-s2.webp" alt="Grid image 1" layout="fill" objectFit="cover" className="rounded-md md:rounded-none transition-transform duration-300 group-hover:scale-105" />
            </div>

            <div className="relative overflow-hidden bg-[#3C3C3C] h-[200px] rounded-md md:col-span-1 md:rounded-none group">
              <Image src="/assets/landing/img-2-s2.webp" alt="Grid image 2" layout="fill" objectFit="cover" className="rounded-md md:rounded-none transition-transform duration-300 group-hover:scale-105" />
            </div>

            <div className="relative overflow-hidden bg-[#3C3C3C] h-[200px] rounded-md md:col-span-1 md:rounded-none group">
              <Image src="/assets/landing/img-3-s2.webp" alt="Grid image 3" layout="fill" objectFit="cover" className="rounded-md md:rounded-none transition-transform duration-300 group-hover:scale-105" />
            </div>

            <div className="relative overflow-hidden bg-[#3C3C3C]  h-[200px] rounded-md md:col-span-1 md:rounded-none group">
              <Image src="/assets/landing/img-4-s2.webp" alt="Grid image 4" layout="fill" objectFit="cover" className="rounded-md md:rounded-none transition-transform duration-300 group-hover:scale-105" />
            </div>

            <div className="relative overflow-hidden bg-[#3C3C3C] h-[200px] rounded-md md:col-span-1 md:rounded-none group">
              <Image src="/assets/landing/img-5-s2.webp" alt="Grid image 5" layout="fill" objectFit="cover" className="rounded-md md:rounded-none transition-transform duration-300 group-hover:scale-105" />
            </div>

            
            <div className="relative overflow-hidden bg-[#3C3C3C] h-[200px] rounded-md md:col-span-1 md:bg-[#D9D9D9] md:h-[200px] group">
              <Image src="/assets/landing/img-6-s2.webp" alt="Grid image 6" layout="fill" objectFit="cover" className="rounded-md md:rounded-none transition-transform duration-300 group-hover:scale-105" />
            </div>

            
            <div className="relative overflow-hidden bg-[#D9D9D9] h-[200px] rounded-md md:col-span-1 hidden md:block md:rounded-none group">
              <Image src="/assets/landing/img-7-s2.webp" alt="Grid image 8" layout="fill" objectFit="cover" className="rounded-md md:rounded-none transition-transform duration-300 group-hover:scale-105" />
            </div>
          </div>

            <div className="w-full flex justify-center items-center py-8 mt-6 md:py-10 md:mt-10">
              <Link href="/decor">
                <button
                  className="bg-[#840032] text-white text-sm md:text-lg px-10 md:px-16 shadow-xl py-3 rounded-2xl tracking-wider
                  hover:bg-[#6a0029] hover:shadow-lg transition-all duration-300 ease-in-out"
                  style={{ fontFamily: "'Cinzel', serif" }}
                >
                  Explore The Wedding Store
                </button>
              </Link>
            </div>
                    
        </div>
      </main>

      {/* Makeup Artist Section */}
      <section className="w-full relative pb-10">
        <div className="relative w-full">
          <Image
            src="/assets/landing_v2/makeup_desktop.png"
            alt="Book Makeup Artist"
            width={1920}
            height={600}
            layout="responsive"
            objectFit="cover"
            className="hidden md:block w-full"
          />
          <Image
            src="/assets/landing_v2/makeup_mobile.png"
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
                  fontFamily: "'Montserrat', sans-serif",
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

          <Image
            src="/assets/landing_v2/Whatourlovedonessay.png"
            alt="What our loved ones say"
            width={1920}
            height={800}
            layout="responsive"
            objectFit="cover"
            className="hidden md:block"
          />
          <Image
            src="/assets/landing_v2/Whatourlovedonesays_mobile.png"
            alt="What our loved ones say"
            width={768}
            height={600}
            layout="responsive"
            objectFit="cover"
            className="block md:hidden"
          />
        </div>
      </section>

      
      {/* wedding venue section */}

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
                  We’ve got you covered with Wedsy’s wedding venue packages!
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

      
      {/* triangle section */}
      <section className="relative w-full flex justify-between items-center mt-12 md:mt-20">
        <div className="hidden md:block w-80 h-16 bg-[#840032] clip-left-triangle" />

        <div className="flex flex-col text-center mx-auto px-6">
          <h2
            className="text-base md:text-lg lg:text-xl font-semibold text-black"
            style={{
              fontFamily: "'Montserrat', sans-serif",
              fontWeight: 600,
            }}
          >
            YOUR ULTIMATE WEDDING PLANNING DESTINATION IS HERE
          </h2>
          <p
            className="text-sm md:text-base mt-2 text-black"
            style={{
              fontFamily: "'Montserrat', sans-serif",
              fontWeight: 500,
            }}
          >
            We’ve got you covered with everything you need for your big day!
          </p>
        </div>
        <div className="hidden md:block w-80 h-16 bg-[#840032] clip-right-triangle" />
      </section>



      {/* makeup banner section */}
      <div className="py-16 md:py-24 px-6 md:px-40 mt-6 md:mt-20 hidden md:block">
        <div className="container mx-auto flex flex-col space-y-4 md:space-y-6">

          <Link href="/makeup-and-beauty/artists">
            <div className="relative flex items-center overflow-hidden h-24 md:h-32 group cursor-pointer mb-4 md:mb-6 last:mb-0">
              <div className="absolute inset-0">
                <Image
                  src="/assets/images/artist-1.webp"
                  alt="Makeup Artists"
                  layout="fill"
                  objectFit="cover"
                  className="transition-transform duration-300 group-hover:scale-105"
                />
              </div>
              <div className="relative z-10 w-full h-full flex items-center">
                <div className="absolute inset-y-0 left-0 w-1/2 bg-gradient-to-r from-white to-transparent transition-all duration-300 group-hover:w-full group-hover:from-white group-hover:to-white/70"></div>
                <div
                  className="relative z-20 text-black text-xl md:text-2xl font-semibold ml-4"
                  style={{ fontFamily: 'Montserrat', letterSpacing: '0.1em' }}
                >
                  MAKEUP ARTISTS
                </div>
              </div>
            </div>
          </Link>

          <Link href="/decor">
            <div className="relative flex items-center overflow-hidden h-24 md:h-32 group cursor-pointer mb-4 md:mb-6 last:mb-0">
              <div className="absolute inset-0">
                <Image
                  src="/assets/images/artist-2.webp"
                  alt="Decor"
                  layout="fill"
                  objectFit="cover"
                  className="transition-transform duration-300 group-hover:scale-105"
                />
              </div>
              <div className="relative z-10 w-full h-full flex items-center justify-end">
                <div className="absolute inset-y-0 right-0 w-1/2 bg-gradient-to-l from-white to-transparent transition-all duration-300 group-hover:w-full group-hover:from-white group-hover:to-white/70"></div>
                <div
                  className="relative z-20 text-black text-xl md:text-2xl font-semibold mr-4"
                  style={{ fontFamily: 'Montserrat', letterSpacing: '0.1em' }}
                >
                  DECOR
                </div>
              </div>
            </div>
          </Link>

          <div className="relative flex items-center overflow-hidden h-24 md:h-32 group cursor-default mb-4 md:mb-6 last:mb-0">
            <div className="absolute inset-0">
              <Image
                src="/assets/images/artist-3.webp"
                alt="Photography"
                layout="fill"
                objectFit="cover"
                className="transition-transform duration-300 group-hover:scale-105"
              />
            </div>
            <div className="relative z-10 w-full h-full flex items-center">
              <div className="absolute inset-y-0 left-0 w-1/2 bg-gradient-to-r from-white to-transparent transition-all duration-300 group-hover:w-full group-hover:from-white group-hover:to-white/70"></div>
              <div
                className="relative z-20 text-black text-xl md:text-2xl font-semibold ml-4"
                style={{ fontFamily: 'Montserrat', letterSpacing: '0.1em' }}
              >
                PHOTOGRAPHY
              </div>
            </div>
            <div className="absolute inset-0 bg-black/70 flex items-center justify-center text-white text-lg font-semibold opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none">
              Coming Soon
            </div>
          </div>

          <div className="relative flex items-center overflow-hidden h-24 md:h-32 group cursor-default mb-4 md:mb-6 last:mb-0">
            <div className="absolute inset-0">
              <Image
                src="/assets/images/artist-4.webp"
                alt="Wedding Venues"
                layout="fill"
                objectFit="cover"
                className="transition-transform duration-300 group-hover:scale-105"
              />
            </div>
            <div className="relative z-10 w-full h-full flex items-center justify-end">
              <div className="absolute inset-y-0 right-0 w-1/2 bg-gradient-to-l from-white to-transparent transition-all duration-300 group-hover:w-full group-hover:from-white group-hover:to-white/70"></div>
              <div
                className="relative z-20 text-black text-xl md:text-2xl font-semibold mr-4"
                style={{ fontFamily: 'Montserrat', letterSpacing: '0.1em' }}
              >
                WEDDING VENUES
              </div>
            </div>
            <div className="absolute inset-0 bg-black/70 flex items-center justify-center text-white text-lg font-semibold opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none">
              Coming Soon
            </div>
          </div>
        </div>
      </div>

      {/* Bidding Section */}
      <section className="w-full px-6 py-16">
        {/* Desktop View - md and above */}
        <div className="hidden md:block relative w-full">
          <Image
            src="/assets/landing_v2/bidding_desktop.png"
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
              className="text-md md:text-2xl text-black font-semibold"
              style={{
                fontFamily: "'Montserrat', sans-serif",
                fontWeight: 600,
              }}
            >
              Booking a makeup artist should not feel like gambling.
            </h2>
          </div>
          <Image
            src="/assets/landing_v2/bidding_mobile.png"
            alt="Bidding Process"
            width={768}
            height={600}
            layout="responsive"
            objectFit="contain"
          />
        </div>

        {/* Get Quote Button */}
        <div className="w-full flex justify-center items-center mt-8 md:mt-12">
          <Link href="/makeup-and-beauty/artists">
            <button
              className="bg-[#840032] hover:bg-[#6a0029] text-white px-12  md:px-16 py-2 rounded-xl text-base md:text-lg font-semibold tracking-wider shadow-lg transition-all duration-300 ease-in-out"
              style={{
                fontFamily: "'Montserrat', sans-serif",
                fontWeight: 600,
              }}
            >
              Get Quote !
            </button>
          </Link>
        </div>
      </section>

      {/* Wedding Planning Section */}
      <section className="w-full">
        {/* Mobile View */}
        <div className="block lg:hidden">
          {/* Mobile Image */}
          <div className="relative w-full">
            <Image
              src="/assets/landing_v2/wedding_planning_mobile .png"
              alt="Wedding Planning"
              width={768}
              height={900}
              layout="responsive"
              objectFit="contain"
            />
          </div>

          {/* Mobile Content */}
          <div className="px-8 py-10">
            {/* Heading - Centered */}
            <div className="text-center mb-10">
              <h2
                className="text-4xl text-black leading-tight"
                style={{
                  fontFamily: "'Dream Avenue', serif",
                  fontWeight: 400,
                }}
              >
                Wedding planning
              </h2>
              <p
                className="text-3xl text-black mt-1"
                style={{
                  fontFamily: "'Dream Avenue', serif",
                  fontWeight: 400,
                }}
              >
                tailored for you
              </p>
            </div>

            {/* Points with Timeline */}
            <div className="relative mb-12 flex flex-row">
              {/* Vertical Bar Image */}
              <div className="flex-shrink-0 mr-4" style={{ height: '300px', overflow: 'hidden' }}>
                <Image
                  src="/assets/landing_v2/bar.png"
                  alt="Timeline bar"
                  width={14}
                  height={250}
                  className="h-full w-auto object-contain"
                  style={{ width: '14px' }}
                />
              </div>

              {/* Points */}
              <div className="flex flex-col space-y-4 py-4">
                {/* Point 1 */}
                <div className="relative flex flex-col">
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
                </div>

                {/* Point 2 */}
                <div className="relative flex flex-col">
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
                </div>

                {/* Point 3 */}
                <div className="relative flex flex-col">
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
                </div>
              </div>
            </div>

            {/* Mobile Button - Full Width */}
            <div className="px-2">
              <Link href="/contact">
                <button
                  className="w-full bg-black text-white py-4 px-8 rounded-2xl tracking-widest text-sm
                            hover:bg-gray-800 transition-all duration-300 ease-in-out"
                  style={{
                    fontFamily: "'Cinzel', serif",
                    fontWeight: 400,
                    letterSpacing: '0.12em',
                  }}
                >
                  CONNECT WITH AN EXPERT
                </button>
              </Link>
            </div>
          </div>
        </div>

        {/* Desktop View */}
        <div className="hidden lg:flex container mx-auto px-8 lg:px-16 xl:px-24 py-16 xl:py-24">
          <div className="flex flex-row items-start justify-between w-full gap-12 xl:gap-20">
            {/* Left Content */}
            <div className="flex flex-col w-1/2 xl:w-[48%]">
              {/* Heading */}
              <div className="mb-10">
                <h2
                  className="text-5xl xl:text-6xl text-black leading-tight"
                  style={{
                    fontFamily: "'Dream Avenue', serif",
                    fontWeight: 400,
                  }}
                >
                  Wedding planning
                </h2>
                <p
                  className="text-4xl xl:text-5xl text-black mt-1"
                  style={{
                    fontFamily: "'Dream Avenue', serif",
                    fontWeight: 400,
                  }}
                >
                  tailored for you
                </p>
              </div>

              {/* Points with Timeline */}
              <div className="relative flex flex-row">
                {/* Vertical Bar Image */}
                <div className="flex-shrink-0 mr-6" style={{ height: '400px', overflow: 'hidden' }}>
                  <Image
                    src="/assets/landing_v2/bar.png"
                    alt="Timeline bar"
                    width={16}
                    height={350}
                    className="h-full w-auto object-contain"
                    style={{ width: '16px' }}
                  />
                </div>

                {/* Points */}
                <div className="flex flex-col space-y-14 py-4">
                  {/* Point 1 */}
                  <div className="relative flex flex-col">
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
                  </div>

                  {/* Point 2 */}
                  <div className="relative flex flex-col">
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
                  </div>

                  {/* Point 3 */}
                  <div className="relative flex flex-col">
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
                  </div>
                </div>
              </div>
            </div>

            {/* Right Side - Image and Button */}
            <div className="flex flex-col items-center w-1/2 xl:w-[48%]">
              {/* Wedding Image */}
              <div className="relative w-full">
                <Image
                  src="/assets/landing_v2/wedding_planning.png"
                  alt="Wedding Planning"
                  width={600}
                  height={750}
                  layout="responsive"
                  objectFit="contain"
                />
              </div>

              {/* Button - Below Image */}
              <Link href="/contact">
                <button
                  className="mt-10 bg-black text-white py-4 px-12 rounded-xl tracking-widest text-sm
                            hover:bg-gray-800 transition-all duration-300 ease-in-out"
                  style={{
                    fontFamily: "'Cinzel', serif",
                    fontWeight: 400,
                    letterSpacing: '0.12em',
                  }}
                >
                  CONNECT WITH AN EXPERT
                </button>
              </Link>
            </div>
          </div>
        </div>
      </section>

      
      {/* bueaty section */}
      <div className="flex flex-col md:flex-row justify-center items-stretch py-16 md:py-24 px-6 md:px-40 mt-6 md:mt-18">
        {/* Mobile-only View Wrapper */}
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

        {/* Desktop View (md:flex-row) */}
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


      {/* furniture section */}
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
              
              <div className="flex flex-col items-center text-center space-y-4 w-full /* Mobile styles */
                            md:flex-row md:justify-between md:items-end md:text-left md:space-y-0 /* Desktop original styles */">
                <p
                  className="text-sm font-medium mb-4 /* Mobile font size and margin */
                            md:text-2xl md:mb-0 md:w-2/3 /* Desktop original font size and width */"
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

      {/*line section */}
      <div className="flex justify-center w-full py-4 md:py-8">
        <div className="w-1/2 h-px bg-[#C6C6C6]"></div> 
      </div>
            
      {/* review section */}
      
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
        <Link href="https://hub.wedsy.in/reviews/">
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
        <Link href="https://hub.wedsy.in/reviews/">
        <button className="bg-gray-800 text-white px-8 py-4 rounded-md text-sm md:text-lg font-semibold hover:bg-gray-700 transition-colors duration-300">
          See what our clients say about us
        </button>
        </Link>
      </div>
      </div>

      {/*line section */}
      <div className="flex justify-center w-full py-4 md:py-8">
        <div className="w-1/2 h-px bg-[#C6C6C6]"></div> 
      </div>

      
      {/* wedsey section */}

      <div className="py-16 md:py-24 px-4 md:px-10 lg:px-20 text-center">
        <h2
          className="text-2xl md:text-4xl lg:text-5xl text-gray-800 mb-12 md:mb-16"
          style={{ fontFamily: 'Montserrat', fontWeight: 'medium' }}
        >
          Wedsy’s WORK
        </h2>
        
        
        <div className="md:py-24 px-4 md:px-10 lg:px-20 text-center">

          
          <div className="hidden md:grid grid-cols-1 md:grid-cols-3 gap-4 max-w-6xl mx-auto">
            
            <div className="flex flex-col gap-4">
              <div className="relative overflow-hidden h-40 md:h-48 bg-gray-300 shadow-md group">
                <Image src="/assets/landing/img-1-s8.webp" alt="Desktop Grid 1" layout="fill" objectFit="cover" className="transition-transform duration-300 group-hover:scale-105" />
              </div>
              <div className="relative overflow-hidden flex-grow bg-gray-300 shadow-md h-64 md:h-80 group">
                <Image src="/assets/landing/img-2-s8.webp" alt="Desktop Grid 2" layout="fill" objectFit="cover" className="transition-transform duration-300 group-hover:scale-105" />
              </div>
            </div>
            
            <div className="flex flex-col gap-4">
              <div className="relative overflow-hidden h-40 md:h-48 bg-gray-300 shadow-md group">
                <Image src="/assets/landing/img-3-s8.webp" alt="Desktop Grid 3" layout="fill" objectFit="cover" className="transition-transform duration-300 group-hover:scale-105" />
              </div>
              <div className="relative overflow-hidden flex-grow bg-gray-300 shadow-md h-64 md:h-80 group">
                <Image src="/assets/landing/img-5-s8.webp" alt="Desktop Grid 4" layout="fill" objectFit="cover" className="transition-transform duration-300 group-hover:scale-105" />
              </div>
            </div>
            
            <div className="flex flex-col gap-4">
              <div className="relative overflow-hidden flex-grow bg-gray-300 shadow-md h-64 md:h-80 group">
                <Image src="/assets/landing/img-6-s8.webp" alt="Desktop Grid 5" layout="fill" objectFit="cover" className="transition-transform duration-300 group-hover:scale-105" />
              </div>
              <div className="relative overflow-hidden h-40 md:h-48 bg-gray-300 shadow-md group">
                <Image src="/assets/landing/img-4-s8.webp" alt="Desktop Grid 6" layout="fill" objectFit="cover" className="transition-transform duration-300 group-hover:scale-105" />
              </div>
            </div>
          </div>
          
          {/* Mobile Layout - Hidden on desktop */}
          <div className="block md:hidden flex flex-col gap-4 max-w-6xl mx-auto">
            <div className="relative overflow-hidden w-full h-80 bg-gray-300 shadow-md rounded-md group">
              <Image src="/assets/landing/img-1-s8.webp" alt="Mobile Grid 1" layout="fill" objectFit="cover" className="rounded-md transition-transform duration-300 group-hover:scale-105" />
            </div>
            <div className="flex flex-row gap-2 justify-between">
              <div className="relative overflow-hidden w-1/4 h-24 bg-gray-300 shadow-md rounded-md group">
                <Image src="/assets/landing/img-2-s8.webp" alt="Mobile Grid 2" layout="fill" objectFit="cover" className="rounded-md transition-transform duration-300 group-hover:scale-105" />
              </div>
              <div className="relative overflow-hidden w-1/4 h-24 bg-gray-300 shadow-md rounded-md group">
                <Image src="/assets/landing/img-3-s8.webp" alt="Mobile Grid 3" layout="fill" objectFit="cover" className="rounded-md transition-transform duration-300 group-hover:scale-105" />
              </div>
              <div className="relative overflow-hidden w-1/4 h-24 bg-gray-300 shadow-md rounded-md group">
                <Image src="/assets/landing/img-4-s8.webp" alt="Mobile Grid 4" layout="fill" objectFit="cover" className="rounded-md transition-transform duration-300 group-hover:scale-105" />
              </div>
              <div className="relative overflow-hidden w-1/4 h-24 bg-gray-300 shadow-md rounded-md group">
                <Image src="/assets/landing/img-5-s8.webp" alt="Mobile Grid 5" layout="fill" objectFit="cover" className="rounded-md transition-transform duration-300 group-hover:scale-105" />
              </div>
            </div>
          </div>
        </div>
        
        <Link href="https://hub.wedsy.in/gallery/">
          <button
            className="mt-12 md:mt-12 px-16 py-4 rounded-md text-white shadow-lg hover:bg-[#6a0029] transition-colors duration-300"
            style={{ backgroundColor: '#840032', fontFamily: 'Montserrat', fontWeight: 'semibold' }}
          >
            View more
          </button>
        </Link>
      </div>


      {/*line section */}
      <div className="flex justify-center w-full py-4 md:py-8">
        <div className="w-1/2 h-px bg-[#C6C6C6]"></div> 
      </div>


      {/*tranding section */}
      
      <div className="py-6 md:py-8 px-6 md:px-40">
        <div className="max-w-7xl mx-auto">
          <h2 className="text-2xl md:text-4xl lg:text-5xl font-semibold mb-10 md:mb-16 hidden md:block">
            What’s <span style={{ fontFamily: 'Montserrat', color: '#AD7200', fontWeight: 'semibold' }}>trending</span>?
          </h2>

          <div className="flex flex-col md:flex-row gap-6">
            
            <div className="relative flex-1 h-64 md:h-80 bg-gray-300 overflow-hidden group">
              <Image
                src="/assets/landing/img-1-s9.webp"
                alt="Trending Image 1"
                layout="fill"
                objectFit="cover"
                className="transition-transform duration-300 group-hover:scale-105"
              />
            </div>

            
            <div className="relative flex-1 h-64 md:h-80 bg-gray-300 overflow-hidden  group">
              <Image
                src="/assets/landing/img-2-s9.webp"
                alt="Trending Image 2"
                layout="fill"
                objectFit="cover"
                className="transition-transform duration-300 group-hover:scale-105"
              />
            </div>

            
            <div className="flex-1 bg-[#AD7200] flex items-center justify-between p-6 md:p-8 relative overflow-hidden">
              <div className="text-white relative z-10">
                <h3
                  className="text-4xl md:text-5xl font-semibold leading-none"
                  style={{ fontFamily: 'Montserrat', letterSpacing: '-0.05em' }}
                >
                  DO’s<br />DONT’s
                </h3>
                <p
                  className="text-lg md:text-xl font-medium mt-4"
                  style={{ fontFamily: 'Montserrat' }}
                >
                  FOR YOUR
                  <br />
                  WEDDING
                  <br />
                  PLANNING
                </p>
              </div>
              <div className="relative z-10">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-8 w-8 md:h-10 md:w-10 text-white"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                  strokeWidth={2}
                >
                  <path strokeLinecap="round" strokeLinejoin="round" d="M17 8l4 4m0 0l-4 4m4-4H3" />
                </svg>
              </div>
              <span
                className="absolute top-4 right-4 text-white text-7xl md:text-9xl font-bold opacity-20"
                style={{ fontFamily: 'Times New Roman', lineHeight: 1 }}
              >
                &
              </span>
            </div>
          </div>

          <Link href="https://hub.wedsy.in">
            <button
              className="mt-12 px-16 py-4 rounded-md text-white shadow-lg hover:bg-[#CE8C35] transition-colors duration-300
                            block mx-auto md:hidden"
              style={{ backgroundColor: '#CE8C35', fontFamily: 'Montserrat', fontWeight: 'semibold' }}
            >
              Explore our BLOGS
            </button>
          </Link>
        </div>
      </div>

      {/* Wedding Requirement Section */}
      <section className="relative min-h-screen bg-[#3C2415]">
        {/* Desktop Layout - Side by Side */}
        <div className="hidden lg:flex min-h-screen mt-20">
          {/* Left Section - Image (2/3 width) */}
          <div className="w-2/3 relative">
            <Image
              src="/assets/landing_v2/wedding.png"
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
              <div className="flex flex-col items-center justify-center">
                <div className="flex items-center justify-center mb-4">
                  <Image
                    src="/assets/landing_v2/left_bar.png"
                    alt="decoration"
                    width={123}
                    height={5}
                    className="mr-4"
                  />
                  <h1
                    className="text-6xl font-serif text-white mx-4"
                    style={{
                      fontFamily: "'Montserrat', sans-serif",
                      fontWeight: 300,
                    }}
                  >
                   WEDSY
                  </h1>
                  <Image
                    src="/assets/landing_v2/right_bar.png"
                    alt="decoration"
                    width={123}
                    height={5}
                    className="ml-4"
                  />
                </div>
                <h2
                  className="text-white text-lg font-medium"
                  style={{
                    fontFamily: "'Montserrat', sans-serif",
                    fontWeight: 100,
                  }}
                >
                  WEDDINGS MADE EASY
                </h2>
              </div>

              {/* Bottom Elements */}
              <div>
                <p
                  className="text-white text-2xl text-center"
                  style={{
                    fontFamily: "'Montserrat', sans-serif",
                    fontWeight: 300,
                  }}
                >
                  CURATED FOR PERFECTION
                </p>
              </div>
            </div>
          </div>

          {/* Right Section - Form Panel (1/3 width) */}
          <div className="w-2/3 bg-[#523329] flex items-center justify-center rounded-2xl p-8 px-25 ">
            <div className="w-full max-w-3xl border border-[#523329] p-16 rounded-2xl bg-white/75  rounded-4xl">
              {!isWeddingSubmitted ? (
                <>
                  {/* Form Header */}
                  <div className="mb-4">
                    <p
                      className="text-[#523329] text-xl mb-2"
                      style={{
                        fontFamily: "'Spartan', sans-serif",
                        fontWeight: 350,
                      }}
                    >
                      Let’s personalize your experience
                    </p>
                    <h3
                      className="text-xl font-bold text-[#3C2415]"
                      style={{
                        fontFamily: "'Spartan', sans-serif",
                        fontWeight: 400,
                      }}
                    >
                      Tell us about your Wedding
                    </h3>
                  </div>

                  <form onSubmit={handleWeddingSubmit} className="space-y-6 ">
                    {/* Name Field */}
                    <div>
                      <input
                        type="text"
                        placeholder="Name"
                        value={weddingFormData.name}
                        onChange={(e) =>
                          handleWeddingInputChange("name", e.target.value)
                        }
                        className="w-full bg-transparent border-0 border-b-2 py-3 text-[#523329] placeholder-[#523329] focus:border-[#523329] focus:outline-none focus:ring-0 transition-all duration-300 hover:border-[#523329]"
                        style={{
                          fontFamily: "'Spartan', sans-serif",
                          fontWeight: 350,
                        }}
                      />
                    </div>

                    {/* Date Field */}
                    <div className="relative">
                      <div
                        onClick={() => setIsDateDropdownOpen(!isDateDropdownOpen)}
                        className="w-full bg-transparent border-b-2 border-[#523329] py-3 text-[#523329] cursor-pointer transition-all duration-300 hover:border-[#6B3A1A]"
                        style={{
                          fontFamily: "'Spartan', sans-serif",
                          fontWeight: 350,
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
                    </div>

                    {/* Budget Selection */}
                    <div>
                      <p
                        className="text-[#000000] text-md lg:text-md mb-3 "
                        style={{
                          fontFamily: "'Spartan', sans-serif",
                          fontWeight: 500,
                        }}
                      >
                       Please share your estimated budget for the event
                      </p>
                      <div className="grid grid-cols-3 gap-4">
                        {[
                          { value: "5-10", label: "5-10 Lakhs" },
                          { value: "10-15", label: "10-15 Lakhs" },
                          { value: "20+", label: "Above 20 Lakhs" },
                        ].map((option) => (
                          <button
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
                          >
                            {option.label}
                          </button>
                        ))}
                      </div>
                    </div>

                    {/* Phone Field */}
                    <div>
                      <input
                        type="tel"
                        placeholder="Phone number"
                        value={weddingFormData.phone}
                        onChange={(e) =>
                          handleWeddingInputChange("phone", e.target.value)
                        }
                        className={`w-full bg-transparent border-0 border-b-2 py-3 text-[#523329] placeholder-[#523329] focus:outline-none focus:ring-0 transition-all duration-300 ${
                          phoneError ? 'border-red-500' : 'border-[#523329] focus:border-[#523329] hover:border-[#523329]'
                        }`}
                        style={{
                          fontFamily: "'Spartan', sans-serif",
                          fontWeight: 350,
                        }}
                      />
                      {phoneError && (
                        <p className="text-red-500 text-xs mt-1">
                          {phoneError}
                        </p>
                      )}
                    </div>

                    {/* Submit Button */}
                    <div className="mt-8 text-left">
                      <button
                        type="submit"
                        disabled={isWeddingSubmitting}
                        className="bg-[#840032] hover:bg-[#70022c] px-16 py-4 text-sm font-bold uppercase tracking-wide text-white rounded-xl transition-all duration-300 disabled:opacity-50 mt-4"
                        style={{
                          fontFamily: "'Cinzel', serif",
                          fontWeight: 300,
                        }}
                      >
                      
                        {isWeddingSubmitting ? "Submitting..." : "Can’t  Wait to Start"}
                      </button>
                    </div>
                  </form>
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
            </div>
          </div>
        </div>

        {/* Mobile Layout - Form Over Image */}
        <div className="lg:hidden relative min-h-screen">
          {/* Background Image */}
          <div className="absolute inset-0">
            <Image
              src="/assets/landing_v2/wedding.png"
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
            <div className="pt-8 pb-4 px-4">
              <div className="flex items-center justify-center mb-2">
                <Image
                  src="/assets/landing_v2/left_bar.png"
                  alt="decoration"
                  width={103}
                  height={3}
                  className="mr-2"
                />
                <h1
                  className="text-4xl font-serif text-white mx-2"
                  style={{
                    fontFamily: "'Montserrat', sans-serif",
                    fontWeight: 300,
                  }}
                >
                  WEDSY
                </h1>
                <Image
                  src="/assets/landing_v2/right_bar.png"
                  alt="decoration"
                  width={103}
                  height={3}
                  className="ml-2"
                />
              </div>
              <h2
                className="text-white text-sm text-center"
                style={{
                  fontFamily: "'Montserrat', sans-serif",
                  fontWeight: 100,
                }}
              >
               WEDDINGS MADE EASY
              </h2>
            </div>

            {/* Form Card - Centered */}
            <div className="flex-1 flex items-center justify-center px-4">
              <div className="w-full max-w-lg bg-white/70 rounded-2xl px-4 min-h-[600px] flex flex-col justify-center">
                {/* Form Header */}
                {!isWeddingSubmitted ? (
                  <>
                    <div className="mb-6 text-center">
                      <p
                        className="text-[#523329] text-lg mb-1"
                        style={{
                          fontFamily: "'Spartan', sans-serif",
                          fontWeight: 350,
                        }}
                      >
                       Let’s personalize your experience
                      </p>
                      <h3
                        className="text-lg text-[#523329]"
                        style={{
                          fontFamily: "'Spartan', sans-serif",
                          fontWeight: 500,
                        }}
                      >
Tell us about your Wedding
                      </h3>
                    </div>

                    <form onSubmit={handleWeddingSubmit} className="space-y-8 px-4">
                      {/* Name Field */}
                      <div>
                        <input
                          type="text"
                          placeholder="Name"
                          value={weddingFormData.name}
                          onChange={(e) =>
                            handleWeddingInputChange("name", e.target.value)
                          }
                          className="w-full bg-transparent border-0 border-b-2 border-[#000000] py-2 text-[#000000] placeholder-[#000000] text-md text-center focus:border-[#000000] focus:outline-none focus:ring-0 transition-all duration-300 hover:border-[#000000]"
                          style={{
                            fontFamily: "'Spartan', sans-serif",
                            fontWeight: 350,
                          }}
                        />
                      </div>

                      {/* Date Field */}
                      <div className="relative">
                        <div
                          onClick={() => setIsDateDropdownOpen(!isDateDropdownOpen)}
                          className="w-full bg-transparent border-b-2 border-[#000000] py-2 text-[#000000] text-md text-center cursor-pointer transition-all duration-300 hover:border-[#000000]"
                          style={{
                            fontFamily: "'Spartan', sans-serif",
                            fontWeight: 350,
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
                      </div>

                      {/* Budget Selection */}
                      <div>
                        <p
                          className="text-[#000000] text-md mb-2 text-center whitespace-pre-line"
                          style={{
                            fontFamily: "'Spartan', sans-serif",
                            fontWeight: 500,
                          }}
                        >
                          What is your budget?
                        </p>
                        <div className="grid grid-cols-3 gap-2 ">
                          {[
                            { value: "5-10", label: "5-10 Lakhs" },
                            { value: "10-15", label: "10-15 Lakhs" },
                            { value: "20+", label: "Above 20 Lakhs" },
                          ].map((option) => (
                            <button
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
                            >
                              {option.label}
                            </button>
                          ))}
                        </div>
                      </div>

                      {/* Phone Field */}
                      <div>
                        <input
                          type="tel"
                          placeholder="Phone number"
                          value={weddingFormData.phone}
                          onChange={(e) =>
                            handleWeddingInputChange("phone", e.target.value)
                          }
                          className={`w-full bg-transparent border-0 border-b-2 py-2 text-[#000000] placeholder-[#000000] text-lg text-center focus:outline-none focus:ring-0 transition-all duration-300 ${
                            phoneError ? 'border-red-500' : 'border-[#000000] focus:border-[#000000] hover:border-[#000000]'
                          }`}
                          style={{
                            fontFamily: "'Spartan', sans-serif",
                            fontWeight: 350,
                          }}
                        />
                        {phoneError && (
                          <p className="text-red-500 text-xs mt-1 text-center">
                            {phoneError}
                          </p>
                        )}
                      </div>

                      {/* Submit Button */}
                      <div className="mt-8 text-center">
                        <button
                          type="submit"
                          disabled={isWeddingSubmitting}
                          className="w-full bg-[#840032] hover:bg-[#70022c] px-4 py-3 text-sm md:text-xl font-bold uppercase tracking-wide text-white rounded-xl transition-all duration-300 disabled:opacity-50"
                          style={{
                            fontFamily: "'Cinzel', serif",
                            fontWeight: 300,
                          }}
                        >
                          {isWeddingSubmitting ? "Submitting..." : "Can’t Wait to Start"}
                        </button>
                      </div>
                    </form>
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
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* FAQ Section */}
      <section className="w-full" style={{ backgroundColor: '#F9F8F6' }}>
        <div className="relative w-full">
          {/* Desktop Image */}
          <Image
            src="/assets/landing_v2/FAQ_Desktop.png"
            alt="Frequently Asked Questions"
            width={1920}
            height={800}
            layout="responsive"
            objectFit="cover"
            className="hidden md:block w-full px-4 "
          />
          {/* Mobile Image */}
          <Image
            src="/assets/landing_v2/FAQ_mobile.png"
            alt="Frequently Asked Questions"
            width={768}
            height={600}
            layout="responsive"
            objectFit="cover"
            className="block md:hidden w-full"
          />
        </div>
        
        {/* FAQ Accordion - Show only 5 FAQs */}
        <div className="px-6 md:px-40 py-8 md:py-8">
          <div className="max-w-7xl mx-auto">
            <div className="flex flex-col">
              {faqsData.slice(0, 5).map((faq, index) => (
                <div key={index} className="flex flex-col">
                  <button
                    className="w-full text-left py-4 md:py-6 focus:outline-none flex justify-between items-center"
                    onClick={() => toggleFAQ(index)}
                  >
                    <p className="text-black text-base md:text-lg font-semibold pr-4" style={{ fontFamily: 'Montserrat', letterSpacing: '0.01em' }}>
                      {faq.question}
                    </p>
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      className={`h-6 w-6 flex-shrink-0 transition-transform duration-300 ${openIndex === index ? 'rotate-45' : ''}`}
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                      strokeWidth={2}
                    >
                      <path strokeLinecap="round" strokeLinejoin="round" d="M12 4v16m8-8H4" />
                    </svg>
                  </button>
                  <div
                    className={`overflow-hidden transition-all duration-500 ease-in-out ${
                      openIndex === index ? 'max-h-96 opacity-100' : 'max-h-0 opacity-0'
                    }`}
                  >
                    <p className="text-gray-700 text-sm md:text-base mb-4 md:mb-6" style={{ fontFamily: 'Montserrat', letterSpacing: '0.01em' }}>
                      {faq.answer}
                    </p>
                  </div>
                  <div className="w-full border-b border-dashed border-gray-400"></div>
                </div>
              ))}
            </div>
            
            {/* View More Button */}
            <div className="flex justify-center mt-8 md:mt-12">
              <Link href="/faq">
                <button
                  className="bg-[#840032] text-white px-10 md:px-16 py-3 md:py-4 rounded-xl text-sm md:text-base font-semibold uppercase tracking-wider hover:bg-[#6a0029] transition-all duration-300 ease-in-out shadow-lg"
                  style={{ fontFamily: "'Montserrat', sans-serif" }}
                >
                  View More
                </button>
              </Link>
            </div>
          </div>
        </div>
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
              <img className="m-auto" src="/assets/icons/easy.webp" />
            </div>
            <span>Easy</span>
          </div>
          <div className="text-center flex flex-col items-center gap-3">
            <div className="bg-[#D6FF79] flex justify-center rounded-3xl w-32 h-32">
              <img className="m-auto" src="/assets/icons/price.webp" />
            </div>
            <span>Unbeatable Pricing</span>
          </div>
          <div className="text-center flex flex-col items-center gap-3">
            <div className="bg-[#F19A3E] flex justify-center rounded-3xl w-32 h-32">
              <img className="m-auto" src="/assets/icons/quality.webp" />
            </div>
            <span>Superior Quality</span>
          </div>
          <div className="text-center flex flex-col items-center gap-3">
            <div className="bg-[#70D6FF] flex justify-center rounded-3xl w-32 h-32">
              <img className="m-auto" src="/assets/icons/solutions.webp" />
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



      <PlanYourEvent />


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
