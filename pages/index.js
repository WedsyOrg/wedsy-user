import styles from "@/styles/Home.module.css";
import { Rating } from "flowbite-react";
import Image from "next/image";
import Link from "next/link";
import { useEffect, useState } from "react";
import {
  BsArrowLeftShort,
  BsArrowRightShort,
  BsFillBalloonHeartFill,
} from "react-icons/bs";
import { FcGoogle } from "react-icons/fc";
import pinkBgGif from "@/public/assets/gif/pink-bg.gif";
import heartGif from "@/public/assets/gif/heart.gif";
import tickGif from "@/public/assets/gif/tick.gif";
import { processMobileNumber } from "@/utils/phoneNumber";
import { FaHeart } from "react-icons/fa";
import PlanYourEvent from "@/components/screens/PlanYourEvent";
import DecorPackageCard from "@/components/cards/DecorPackageCard";
import Head from "next/head";
import Testimonials from "@/components/screens/Testimonials";
import VendorUserSection from "@/pages/reuseableComponents/VendorUserSection";
import { LandingPageSkeleton } from "@/components/skeletons/landing_page";

function Home({ packages }) {
  const [isLoading, setIsLoading] = useState(true);
  
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
        question: "What services do Wedsy's event planners in Bangalore offer?",
        answer: "Our team at Wedsy offers comprehensive event planning services in Bangalore, including venue selection, thematic decoration, catering, photography, makeup artists, mehendi artists, DJ, Emcee, and personalized event itineraries. We ensure your celebration in Bangalore is flawless from start to finish."
      },
      {
        question: "How do Wedsy's wedding planners in Bangalore personalize weddings?",
        answer: "At Wedsy, we ensure that every wedding reflects the couple's personality. Our wedding planners in Bangalore collaborate closely with you to understand your vision and preferences, crafting a celebration as unique as your love story. From the color of cloth to flowers, flooring type to lighting, every detail is fully customizable. Your designated wedding planner will discuss these details with you and document them in the notes on the event tool for clear communication and reference."
      },
      {
        question: "What sets Wedsy's event decorators in Bangalore apart?",
        answer: "Wedsy's event decorators stand out for their creativity and versatility. We lead in staying ahead of trends, utilizing innovative design techniques and technology to craft stunning visual experiences tailored to your event's theme and ambiance. Being India's first online store with transparent pricing, you can conveniently select and customize all decor online. We pride ourselves as a one-stop-shop for all your wedding needs."
      },
      {
        question: "What budget range does Wedsy cater to for weddings and events?",
        answer: "Being among the top wedding planners in Bangalore, Wedsy caters to a diverse range of budgets. We collaborate closely with our clients to tailor custom packages that align with their financial considerations, ensuring a high-quality execution of their special day. From as low as 10,000 INR to 10 lakhs and beyond, we accommodate a wide spectrum of budgets."
      },
      {
        question: "Does Wedsy have packages for decorators in Bangalore?",
        answer: "Yes, Wedsy offers a range of packages for wedding decorations that can be tailored to fit your specific needs and budget. Our packages include a variety of décor options curated by the best decorators in Bangalore to make your wedding truly exceptional."
      },
      {
        question: "How do I book Wedsy's services for my upcoming wedding or event?",
        answer: "Booking with Wedsy is easy. Reach out to us through our website, phone, or email. Your designated planner, your single point of contact for all wedding needs, will guide you through the entire process. We recommend scheduling a consultation with our team to discuss event details and secure our services well in advance, especially for peak seasons in Bangalore."
      },
      {
        question: "What is the event tool?",
        answer: "The event tool is a specially designed organizational tool for your events. Simply create an event, such as a Haldi wedding, and add multiple event days like Haldi, sangeet, and the wedding ceremony. Once set, you easily add your selected decor to the respective event days. This tool ensures your event stays well-organized and hassle-free."
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
      image: "/assets/images/stage.png",
    },
    {
      id: "Pathway",
      text: "Your one-stop shop for affordable and elegant weddings. Simplify planning with fixed-price stage decor, creative entry ideas, stylish furniture rentals, and more. Where affordability meets creativity for your special day.",
      image: "/assets/images/pathway.png",
    },
    {
      id: "Entrance",
      text: "Your one-stop shop for affordable and elegant weddings. Simplify planning with fixed-price stage decor, creative entry ideas, stylish furniture rentals, and more. Where affordability meets creativity for your special day.",
      image: "/assets/images/entrance.png",
    },
    {
      id: "Photobooth",
      text: "Your one-stop shop for affordable and elegant weddings. Simplify planning with fixed-price stage decor, creative entry ideas, stylish furniture rentals, and more. Where affordability meets creativity for your special day.",
      image: "/assets/images/photobooth.png",
    },
    {
      id: "Mandap",
      text: "Your one-stop shop for affordable and elegant weddings. Simplify planning with fixed-price stage decor, creative entry ideas, stylish furniture rentals, and more. Where affordability meets creativity for your special day.",
      image: "/assets/images/mandap.png",
    },
    {
      id: "Nameboard",
      text: "Your one-stop shop for affordable and elegant weddings. Simplify planning with fixed-price stage decor, creative entry ideas, stylish furniture rentals, and more. Where affordability meets creativity for your special day.",
      image: "/assets/images/nameboard.png",
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
      </Head>
      <div className="hidden">
        <h1>Affordable & Best Wedding Planner in Bangalore</h1>
        <h2>Best Budget-Friendly Wedding & Destination Packages in India</h2>
      </div>
      <main
        className={`${styles.main__div} flex flex-col justify-around gap-6 md:gap-12 `}
        id="mainDiv"
      >
      
        <div
          className="
            block
            absolute
            top-20 right-4 md:top-24 md:left-20 md:right-auto
            text-[120px] md:text-[175px]
            text-right md:text-left
            text-white md:text-black
            leading-[0.45]
            px-4 md:px-0
          "
          style={{
            fontFamily: "'Lovers Quarrel', cursive",
            margin: 0,
            padding: 0,
          }}
        >
          weddings<br />made<br />easy
        </div>

        

        {/* Mobile Wedding Store Section page starting part */}
        <div className="block md:hidden  absolute bottom-72 left-1/2 transform -translate-x-1/2 text-center text-white mb-40">
          <p className="text-lg mb-4 font-small leading-relaxed w-80 max-w-[90vw]" style={{
            fontFamily: "'Montserrat', sans-serif",
            fontWeight: 500,
          }}>
            Unveil the epitome of wedding<br />planning at our store.
          </p>

          <Link href="/decor">
            <button
              className="bg-white/10 border-2 border-white text-white px-8 py-3 text-lg font-semibold tracking-wide "
              style={{
                fontFamily: "'Montserrat', sans-serif",
                fontWeight: 600,
                fontSize: "15px"
              }}
              
            >
              WEDDING STORE
            </button>
          </Link>
        </div>


        <div className="hidden md:flex h-screen w-full p-6 md:px-8 flex-row justify-end items-end mb-28 text-black">
          <div className="hidden md:flex flex-col w-[25%] text-center gap-6 justify-center pr-5" style={{
              fontFamily: "'Montserrat', sans-serif",
              fontWeight: 600,
          }}>
            <span className="text-3xl" style={{ 
              fontFamily: "'Montserrat', sans-serif",
              fontWeight: 600,
              lineHeight: 1.4,
              margin: 0,
              padding: 0,
            }}>YOUR WEDDING VISION,<br/>OUR EXPERTISE</span>
            {data.main.success ? (
              <p>
                Your Wedsy Wedding Manager will contact you and assist you in
                choosing the best!
              </p>
            ) : (
              <>
                <input
                  type="text"
                  placeholder="NAME"
                  value={data.main.name}
                  onChange={(e) =>
                    setData({
                      ...data,
                      main: { ...data.main, name: e.target.value },
                    })
                  }
                  name="name"
                  className="text-black text-center bg-transparent border-0 border-b-black outline-0 focus:outline-none focus:border-0 border-b focus:border-b focus:border-b-black focus:ring-0 placeholder:text-black"
                />
                <input
                  type="text"
                  placeholder="PHONE NO."
                  value={data.main.phone}
                  onChange={(e) =>
                    setData({
                      ...data,
                      main: { ...data.main, phone: e.target.value },
                    })
                  }
                  name="phone"
                  className="text-black text-center bg-transparent border-0 border-b-black outline-0 focus:outline-none focus:border-0 border-b focus:border-b focus:border-b-black focus:ring-0 placeholder:text-black"
                />
                <button
                  type="submit"
                  className="bg-black text-white py-2 disabled:bg-black cursor-pointer
                            hover:-translate-y-0.5 hover:shadow-lg transition-all duration-200 ease-in-out"
                  disabled={
                    !data.main.name ||
                    !data.main.phone ||
                    // !/^\d{10}$/.test(data.main.phone) ||
                    // !processMobileNumber(data.main.phone) ||
                    data.main.loading
                  }
                  onClick={handleMainEnquiry}
                >
                  ENTER WITH WEDSY
                </button>
              </>
            )}
          </div>
        </div>
        <Image
          src="/assets/images/home_image_mobile.png"
          alt="Decor"
          width={0}
          height={0}
          sizes="100vw"
          className="block md:hidden"
          style={{ height: "auto", width: "100vw" }}
        />
      </main>


      {/* why choose wedsy section */}
      <main className={`${styles.main__div__2} md:mt-20 py-16 px-6`}>
        <div className="text-center flex flex-col h-full relative">
          <span className="hidden md:block text-center text-[36px] md:text-[36px] font-semibold text-blackpy-3 md:py-0 mt-auto block" style={{
                fontFamily: 'Montserrat, sans-serif', 
              }}>
              WHY CHOOSE WEDSY
          </span>

          <span className="hidden md:block text-[36px] md:text-[36px] font-medium"
                style={{
                  fontFamily: 'Montserrat, sans-serif',
                  letterSpacing: '5%',
                }}>
            “BECAUSE WE’RE JUST <span style={{
                            color: '#840032',
                          }}>BL**DY</span> GOOD AT OUR JOB”
          </span>

          <div
            className="flex flex-col md:flex-row items-start py-12 px-18 md:px-40 h-full justify-between"
            style={{ fontFamily: "'Montserrat', sans-serif" }}
          >
            <div className="w-full md:w-auto flex justify-start items-center text-left md:justify-center md:items-center md:text-center h-full mb-8 md:mb-0">
              <h2 className="text-[28px] md:text-[36px] font-normal tracking-wide text-black">
                NEW ARRIVALS
              </h2>
            </div>

            <div className="flex-1 flex flex-col items-center md:items-start text-left max-w-2xl self-center">
              <p className="text-[15px] text-black font-normal mb-4 w-full text-left">
                Whether you're planning an intimate ceremony or a grand celebration, our newly
                <br/> added items will help you create the perfect ambiance for your special day.
              </p>

              <div className="w-full flex flex-col items-start hidden md:block">
                <div className="flex flex-wrap justify-end text-left gap-x-12 gap-y-2 font-semibold text-black text-[17px]">
                  <span>STAGE</span>
                  <span>•</span>
                  <span>MANDAP</span>
                  <span>•</span>
                  <span>NAMEBOARD</span>
                  <span>•</span>
                  <span>PATHWAY</span>
                </div>

                <div className="w-full flex flex-wrap justify-center text-left gap-x-12 gap-y-2 mt-2 font-semibold text-black text-[17px]">
                  <span>FURNITURE</span>
                  <span>•</span>
                  <span>PHOTO BOOTH</span>
                  <span>•</span>
                  <span>LIGHTING</span>
                </div>
              </div>

            </div>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-6 md:px-40 gap-1">

            <div className="relative overflow-hidden bg-[#3C3C3C] h-[200px] rounded-md md:h-auto md:row-span-2 md:col-span-3 md:rounded-none group">
              <Image src="/assets/landing/img-1-s2.jpeg" alt="Grid image 1" layout="fill" objectFit="cover" className="rounded-md md:rounded-none transition-transform duration-300 group-hover:scale-105" />
            </div>

            <div className="relative overflow-hidden bg-[#3C3C3C] h-[200px] rounded-md md:col-span-1 md:rounded-none group">
              <Image src="/assets/landing/img-2-s2.jpg" alt="Grid image 2" layout="fill" objectFit="cover" className="rounded-md md:rounded-none transition-transform duration-300 group-hover:scale-105" />
            </div>

            <div className="relative overflow-hidden bg-[#3C3C3C] h-[200px] rounded-md md:col-span-1 md:rounded-none group">
              <Image src="/assets/landing/img-3-s2.jpg" alt="Grid image 3" layout="fill" objectFit="cover" className="rounded-md md:rounded-none transition-transform duration-300 group-hover:scale-105" />
            </div>

            <div className="relative overflow-hidden bg-[#3C3C3C]  h-[200px] rounded-md md:col-span-1 md:rounded-none group">
              <Image src="/assets/landing/img-4-s2.jpg" alt="Grid image 4" layout="fill" objectFit="cover" className="rounded-md md:rounded-none transition-transform duration-300 group-hover:scale-105" />
            </div>

            <div className="relative overflow-hidden bg-[#3C3C3C] h-[200px] rounded-md md:col-span-1 md:rounded-none group">
              <Image src="/assets/landing/img-5-s2.jpg" alt="Grid image 5" layout="fill" objectFit="cover" className="rounded-md md:rounded-none transition-transform duration-300 group-hover:scale-105" />
            </div>

            
            <div className="relative overflow-hidden bg-[#3C3C3C] h-[200px] rounded-md md:col-span-1 flex justify-center items-center text-center md:bg-[#D9D9D9] md:h-[200px] group">
              <Link href="/decor">
                <button className=" text-white font-semibold text-base px-6 py-3 rounded-md md:hidden" style={{ fontFamily: "'Montserrat', sans-serif" }}>
                  Explore our Wedding Store
                </button>
              </Link>
              
              <Image src="/assets/landing/img-6-s2.jpg" alt="Grid image 7" layout="fill" objectFit="cover" className="rounded-md md:rounded-none transition-transform duration-300 group-hover:scale-105 hidden md:block" />
            </div>

            
            <div className="relative overflow-hidden bg-[#D9D9D9] h-[200px] rounded-md md:col-span-1 hidden md:block md:rounded-none group">
              <Image src="/assets/landing/img-7-s2.jpg" alt="Grid image 8" layout="fill" objectFit="cover" className="rounded-md md:rounded-none transition-transform duration-300 group-hover:scale-105" />
            </div>
          </div>

            <div className="w-full flex justify-center items-center py-10 mt-10 md:mt-10 hidden md:flex">
              <Link href="/decor">
                <button
                  className="bg-[#3C3C3C] text-white font-semibold text-base px-6 py-3 rounded-md md:rounded-none
                  hover:-translate-y-0.5 hover:shadow-lg transition-all duration-200 ease-in-out"
                  style={{ fontFamily: "'Montserrat', sans-serif" }}
                >
                  Explore our Wedding Store
                </button>
              </Link>
            </div>
                    
        </div>
      </main>

      
      {/* wedding venue section */}

      <section className="w-full py-6 md:py-24 px-6 md:px-40  md:mt-32">
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
                src="/assets/images/3_buttom_4.png"
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
                src="/assets/images/3_buttom_1.png"
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
                src="/assets/images/3_buttom_2.png"
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
                src="/assets/images/3_buttom_3.png"
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
                src="/assets/images/3_buttom_3.png"
                alt="Discover button background"
                layout="fill"
                objectFit="cover"
                className="rounded-xl transition-transform duration-300 group-hover:scale-105"
              />
              <div className="absolute inset-0 bg-black/80 rounded-xl"></div>
              <Link
                href="/decor"
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
              </Link>
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
                  src="/assets/images/artist-1.png"
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
                  src="/assets/images/artist-2.png"
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
                src="/assets/images/artist-3.png"
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
                src="/assets/images/artist-4.png"
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
              src="/assets/images/furniture_img.png"
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
            src="/assets/images/review_9.png"
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
            src="/assets/images/review_10.png"
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
            src="/assets/images/review_11.png"
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
            src="/assets/images/review_7.png"
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
            src="/assets/images/review_8.png"
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
            src="/assets/images/review_5.png"
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
            src="/assets/images/review_4.png"
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
            src="/assets/images/review_1.png"
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
            src="/assets/images/review_2.png"
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
            src="/assets/images/review_3.png"
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
            src="/assets/images/review_6.png"
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
                <Image src="/assets/landing/img-1-s8.jpg" alt="Desktop Grid 1" layout="fill" objectFit="cover" className="transition-transform duration-300 group-hover:scale-105" />
              </div>
              <div className="relative overflow-hidden flex-grow bg-gray-300 shadow-md h-64 md:h-80 group">
                <Image src="/assets/landing/img-2-s8.jpg" alt="Desktop Grid 2" layout="fill" objectFit="cover" className="transition-transform duration-300 group-hover:scale-105" />
              </div>
            </div>
            
            <div className="flex flex-col gap-4">
              <div className="relative overflow-hidden h-40 md:h-48 bg-gray-300 shadow-md group">
                <Image src="/assets/landing/img-3-s8.jpg" alt="Desktop Grid 3" layout="fill" objectFit="cover" className="transition-transform duration-300 group-hover:scale-105" />
              </div>
              <div className="relative overflow-hidden flex-grow bg-gray-300 shadow-md h-64 md:h-80 group">
                <Image src="/assets/landing/img-5-s8.jpg" alt="Desktop Grid 4" layout="fill" objectFit="cover" className="transition-transform duration-300 group-hover:scale-105" />
              </div>
            </div>
            
            <div className="flex flex-col gap-4">
              <div className="relative overflow-hidden flex-grow bg-gray-300 shadow-md h-64 md:h-80 group">
                <Image src="/assets/landing/img-6-s8.jpg" alt="Desktop Grid 5" layout="fill" objectFit="cover" className="transition-transform duration-300 group-hover:scale-105" />
              </div>
              <div className="relative overflow-hidden h-40 md:h-48 bg-gray-300 shadow-md group">
                <Image src="/assets/landing/img-4-s8.jpg" alt="Desktop Grid 6" layout="fill" objectFit="cover" className="transition-transform duration-300 group-hover:scale-105" />
              </div>
            </div>
          </div>
          
          {/* Mobile Layout - Hidden on desktop */}
          <div className="block md:hidden flex flex-col gap-4 max-w-6xl mx-auto">
            <div className="relative overflow-hidden w-full h-80 bg-gray-300 shadow-md rounded-md group">
              <Image src="/assets/landing/img-1-s8.jpg" alt="Mobile Grid 1" layout="fill" objectFit="cover" className="rounded-md transition-transform duration-300 group-hover:scale-105" />
            </div>
            <div className="flex flex-row gap-2 justify-between">
              <div className="relative overflow-hidden w-1/4 h-24 bg-gray-300 shadow-md rounded-md group">
                <Image src="/assets/landing/img-2-s8.jpg" alt="Mobile Grid 2" layout="fill" objectFit="cover" className="rounded-md transition-transform duration-300 group-hover:scale-105" />
              </div>
              <div className="relative overflow-hidden w-1/4 h-24 bg-gray-300 shadow-md rounded-md group">
                <Image src="/assets/landing/img-3-s8.jpg" alt="Mobile Grid 3" layout="fill" objectFit="cover" className="rounded-md transition-transform duration-300 group-hover:scale-105" />
              </div>
              <div className="relative overflow-hidden w-1/4 h-24 bg-gray-300 shadow-md rounded-md group">
                <Image src="/assets/landing/img-4-s8.jpg" alt="Mobile Grid 4" layout="fill" objectFit="cover" className="rounded-md transition-transform duration-300 group-hover:scale-105" />
              </div>
              <div className="relative overflow-hidden w-1/4 h-24 bg-gray-300 shadow-md rounded-md group">
                <Image src="/assets/landing/img-5-s8.jpg" alt="Mobile Grid 5" layout="fill" objectFit="cover" className="rounded-md transition-transform duration-300 group-hover:scale-105" />
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
                src="/assets/landing/img-1-s9.jpg"
                alt="Trending Image 1"
                layout="fill"
                objectFit="cover"
                className="transition-transform duration-300 group-hover:scale-105"
              />
            </div>

            
            <div className="relative flex-1 h-64 md:h-80 bg-gray-300 overflow-hidden  group">
              <Image
                src="/assets/landing/img-2-s9.jpg"
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


      {/* Most */}
      
      <section className="py-16 md:py-24 px-6 md:px-40">
        <div className="max-w-7xl mx-auto  overflow-hidden">
          <div className="w-full flex justify-center">
            <div className="h-px bg-[#D6D6D6] w-full max-w-7xl px-4 md:px-10 lg:px-20"></div> {/* Line matching the width of content areas */}
          </div>
          <div className="relative w-full h-auto" style={{ paddingTop: '56.25%' }}>
          
            <Image
              src="/assets/images/Most_asked.png"
              alt="Most Frequently Asked Questions"
              layout="fill"
              objectFit="cover"
              className="rounded-lg"
            />
          </div>
        </div>
      </section>
      



      {/* say i do */}
      {/* <section className={`${styles.section__1} flex flex-col md:py-16 gap-6`}>
        <Image
          src="/assets/background/bg-section-1-mobile.png"
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
              <img className="m-auto" src="/assets/icons/easy.png" />
            </div>
            <span>Easy</span>
          </div>
          <div className="text-center flex flex-col items-center gap-3">
            <div className="bg-[#D6FF79] flex justify-center rounded-3xl w-32 h-32">
              <img className="m-auto" src="/assets/icons/price.png" />
            </div>
            <span>Unbeatable Pricing</span>
          </div>
          <div className="text-center flex flex-col items-center gap-3">
            <div className="bg-[#F19A3E] flex justify-center rounded-3xl w-32 h-32">
              <img className="m-auto" src="/assets/icons/quality.png" />
            </div>
            <span>Superior Quality</span>
          </div>
          <div className="text-center flex flex-col items-center gap-3">
            <div className="bg-[#70D6FF] flex justify-center rounded-3xl w-32 h-32">
              <img className="m-auto" src="/assets/icons/solutions.png" />
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

      <section className="py-16 md:py-24 px-6 md:px-40 hidden md:block">
        <div className="max-w-7xl mx-auto">
          {/* <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-12 md:mb-16 relative">
            
            <h2 className="text-2xl md:text-3xl lg:text-4xl text-gray-800 leading-tight" style={{ fontFamily: 'Montserrat', letterSpacing: '0.01em' }}>
              <span className="font-extrabold text-transparent relative inline-block mr-2" style={{ WebkitTextStroke: '2px black', textStroke: '2px black' }}>MOST</span>
              <span className="font-semibold">FREQUENTLY ASKED QUESTIONS </span>
              <br className="md:hidden" />
              <span className="font-semibold">BY OUR CUSTOMERS</span>
            </h2>
          </div> */}

          
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

      {/* <Testimonials /> */}
      {/* <section className="mt-4 mb-8">
        <div className="w-full py-12 relative">
          <p className="mb-32 md:mb-0 text-center text-rose-900 text-xl font-semibold tracking-wider uppercase px-6 md:px-16 md:w-1/2 md:translate-y-full">
            {
              "“ A wedding is not just a day, it's a journey, a story, and a promise of a lifetime “"
            }
          </p>
          <Image
            src="/assets/images/couple.png"
            alt="flower"
            width={0}
            height={0}
            sizes="100%"
            className="absolute bottom-0 right-12 hidden md:inline"
            style={{ height: "20em", width: "auto" }}
          />
          <Image
            src="/assets/images/couple.png"
            alt="flower"
            width={0}
            height={0}
            sizes="100%"
            className="absolute bottom-0 right-6 inline md:hidden"
            style={{ height: "15em", width: "auto" }}
          />
          <div className="w-2/3 md:w-1/2 bg-gradient-to-t from-rose-900 to-transparent rounded-bl-3xl p-6 px-8 ml-auto md:ml-0 md:translate-x-full relative">
            <Image
              src="/assets/images/flowers-1.png"
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
    const packagesResponse = await fetch(
      `${process.env.NEXT_PUBLIC_API_URL}/decor-package?limit=8`
    );
    const packagesData = await packagesResponse.json();
    return {
      props: {
        packages: packagesData.list.sort((a, b) => 0.5 - Math.random()),
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
