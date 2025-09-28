import Testimonials from "@/components/screens/Testimonials";
import styles from "@/styles/LandingPage.module.css";
import { processMobileNumber } from "@/utils/phoneNumber";
import { Checkbox, Footer, Label, Select, TextInput } from "flowbite-react";
import Image from "next/image";
import Link from "next/link";
import Script from "next/script";
import { useState } from "react";
import { BsFacebook, BsInstagram, BsTwitter, BsGoogle } from "react-icons/bs";

export default function HomePage({}) {
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [data, setData] = useState({
    phone: "",
    name: "",
    event_date: "",
    whatsapp_updates: false,
  });
  const handleSubmit = async (e) => {
    e.preventDefault();
    return new Promise(async (resolve, reject) => {
      if (await processMobileNumber(data.phone)) {
        setLoading(true);
        fetch(`${process.env.NEXT_PUBLIC_API_URL}/enquiry`, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            name: data.name,
            phone: processMobileNumber(data.phone),
            verified: false,
            source: "Landing Screen | Ads (Google & Facebook)",
            additionalInfo: {
              event_date: data.event_date,
              whatsapp_updates: data.whatsapp_updates,
            },
          }),
        })
          .then((response) => {
            if (response.ok) {
              setData({
                ...data,
                phone: "",
                name: "",
                event_date: "",
                whatsapp_updates: false,
              });
              setLoading(false);
              setSuccess(true);
              resolve();
            }
          })
          .catch((error) => {
            console.error(
              "There was a problem with the fetch operation:",
              error
            );
            reject(error);
          });
      } else {
        alert("Please enter valid mobile number");
        reject();
      }
    });
  };
  function gtag_report_conversion(url) {
    var callback = function () {
      if (typeof url != "undefined") {
        window.location = url;
      }
    };
    gtag("event", "conversion", {
      send_to: "AW-468340693/XR5HCPaW7oQYENWfqd8B",
      event_callback: callback,
    });
    return false;
  }
  return (
    <>
      <Script
        strategy="afterInteractive"
        src={`https://www.googletagmanager.com/gtag/js?id=AW-468340693`}
      />
      <Script
        id="google-analytics"
        strategy="afterInteractive"
        dangerouslySetInnerHTML={{
          __html: `
          window.dataLayer = window.dataLayer || [];
          function gtag(){dataLayer.push(arguments);}
          gtag('js', new Date());
          gtag('config', 'AW-468340693');
          function gtag_report_conversion(url) { var callback = function () { if (typeof(url) != 'undefined') { window.location = url; } }; gtag('event', 'conversion', { 'send_to': 'AW-468340693/XR5HCPaW7oQYENWfqd8B', 'event_callback': callback }); return false; }
        `,
        }}
      />
      {/* Landing Screen with form */}
      <div
        className={`${styles.main__div} grid md:grid-cols-3 gap-0 md:px-12 md:py-12 relative`}
        id="mainDiv"
      >
        <div className="md:col-span-2 flex jusitfy-end h-[90vh] md:h-auto z-10">
          <p
            className="block w-full text-2xl md:text-3xl text-center md:text-left italic font-semibold tracking-wide text-white md:ml-6 mb-36 mt-auto"
            style={{ textShadow: "0px 0px 19px #FFFFFF" }}
          >
            #WEDDINGSMADEEASY
          </p>
        </div>
        <div className="md:hidden h-12" id="enquiryFormDiv" />
        <form
          className="z-10 bg-white md:bg-black/70 h-full w-full rounded-tl-3xl rounded-tr-3xl md:rounded-xl p-8 flex flex-col gap-6 md:text-white"
          id="enquiryForm"
        >
          <p className="hidden md:block font-semibold text-2xl">
            SPEAK TO OUR WEDDING EXPERT
          </p>
          <p className="text-center md:hidden font-semibold text-2xl text-rose-900">
            Speak to our wedding expert!
          </p>
          {success ? (
            <p className="font-medium md:font-normal">
              Thank you for submitting your details. Our wedding experts will
              contact you at the earliest!
            </p>
          ) : (
            <>
              <p className="font-medium md:font-normal">
                Have all your questions answered and get a free competitive
                quote
              </p>
              <div>
                <Label value="Full name*" className="md:text-white" />
                <TextInput
                  required
                  className=""
                  disabled={loading}
                  value={data.name}
                  onChange={(e) => setData({ ...data, name: e.target.value })}
                />
              </div>
              <div>
                <Label value="Phone number*" className="md:text-white" />
                <TextInput
                  required
                  className=""
                  disabled={loading}
                  value={data.phone}
                  onChange={(e) => setData({ ...data, phone: e.target.value })}
                />
              </div>
              <div>
                <Label value="Event date" className="md:text-white" />
                <Select
                  disabled={loading}
                  value={data.event_date}
                  onChange={(e) =>
                    setData({ ...data, event_date: e.target.value })
                  }
                >
                  <option value={""}>Select Answer</option>
                  <option value={"In 1-3 months"}>In 1-3 months</option>
                  <option value={"In 3-6 months"}>In 3-6 months</option>
                  <option value={"Post 6 months"}>Post 6 months</option>
                </Select>
              </div>
              <div className="flex items-center gap-2">
                <Label htmlFor="whatsapp" className="md:text-white">
                  Send updates on whatsapp
                </Label>{" "}
                <Checkbox
                  id="whatsapp"
                  disabled={loading}
                  checked={data.whatsapp_updates}
                  onChange={(e) =>
                    setData({ ...data, whatsapp_updates: e.target.checked })
                  }
                />
              </div>
              <button
                disabled={loading || !data.name || !data.phone}
                type="submit"
                className="bg-rose-900 text-white py-2 px-12 rounded-lg font-medium disabled:bg-rose-900/80 disabled:cursor-not-allowed"
                style={{ boxShadow: "0px 5px 25px 0px rgba(132, 0, 50, 1)" }}
                onClick={async (e) => {
                  handleSubmit(e)
                    .then((r) => {
                      gtag_report_conversion(
                        `${window.location.origin}/weddings-made-easy`
                      ); // Add the gtag_report_conversion function call here
                    })
                    .catch((e) => {
                      console.log(e);
                    }); // Call the existing handleSubmit function
                  // gtag_report_conversion(
                  //   `${window.location.origin}/weddings-made-easy`
                  // ); // Add the gtag_report_conversion function call here
                }}
              >
                GET INSTANT QUOTE!
              </button>
            </>
          )}
        </form>
      </div>
      {/* India’s First Online Wedding Planinng ! */}
      <div className="px-6 py-8 md:px-24 md:py-16 grid md:grid-cols-3 gap-12 bg-white">
        <div className="col-span-2 flex flex-col gap-8 text-center md:text-left">
          <p className="font-semibold text-2xl ">
            {"India’s First Online Wedding Planinng !"}
          </p>
          <div className="md:hidden mx-auto w-4/5">
            <video
              id="weddingStoreVideo"
              autoPlay
              muted
              loop
              className="w-80 mx-auto"
              style={{ pointerEvents: "none" }}
              src={"assets/videos/wedding_store_video-mobile.mov"}
            />
          </div>
          <p className="text-lg  hidden md:block">
            {
              "Effortlessly bring your dream wedding to life with India's premier online decor store. Explore diverse categories such as stages, mandaps, entrances, and more, all with fixed pricing. Simply browse, click, and select decor to enhance your event. Your perfect celebration begins with ease and transparency. Allow us to transform your vision into reality, ensuring every detail reflects your unique love story on this special day. Start your perfect celebration right here!"
            }
          </p>
          <p className="text-lg  md:hidden">
            {
              "Create your dream wedding effortlessly with India's premier online decor store. Explore diverse categories, select with fixed pricing, and let us transform your vision into reality. Your perfect celebration begins right here!"
            }
          </p>
          <Link
            href={"#enquiryFormDiv"}
            className="md:hidden ml-auto md:ml-0 mr-auto"
          >
            <button
              className="bg-rose-900 text-white py-2 px-12 rounded-full font-medium"
              style={{ boxShadow: "0px 5px 25px 0px rgba(132, 0, 50, 1)" }}
            >
              Plan your wedding now!
            </button>
          </Link>
          <Link
            href={"#mainDiv"}
            className="hidden md:block ml-auto md:ml-0 mr-auto"
          >
            <button
              className="bg-rose-900 text-white py-2 px-12 rounded-full font-medium"
              style={{ boxShadow: "0px 5px 25px 0px rgba(132, 0, 50, 1)" }}
            >
              Plan your wedding now!
            </button>
          </Link>
        </div>
        <div className="hidden md:block">
          <video
            id="weddingStoreVideo"
            autoPlay
            muted
            loop
            className="w-80 mx-auto"
            style={{ pointerEvents: "none" }}
          >
            <source
              src={"assets/videos/wedding_store_video.mp4"}
              type="video/mp4"
            />
          </video>
        </div>
      </div>
      {/* Service Offered */}
      <div className="px-6 md:px-36 py-8 md:py-16 bg-white">
        <p className="text-rose-900 font-semibold text-2xl md:text-3xl text-center mb-6 md:mb-16">
          SERVICES WE OFFER
        </p>
        <div className="grid md:grid-cols-2 gap-8 md:gap-16">
          <div className="bg-[#FFE4EE] p-3 md:p-6 rounded-3xl flex flex-col items-center gap-3 text-center">
            <Image
              src={`/assets/images/service_wedding_decorations.png`}
              alt="Decor"
              width={0}
              height={0}
              sizes="100%"
              style={{ width: "100%", height: "auto" }}
            />
            <p className="text-xl font-medium">Wedding Decorations</p>
            <p className="px-4 hidden md:block">
              {
                "From complimentary consulting to seamless execution, we've got every aspect covered with expertise and precision!"
              }
            </p>
            <p className="px-4 md:hidden">
              {
                "From thoughtful consultation to flawless execution, we have every aspect expertly managed for you"
              }
            </p>
          </div>
          <div className="bg-[#D1E3FF] p-3 md:p-6 rounded-3xl flex flex-col items-center gap-3 text-center">
            <Image
              src={`/assets/images/service_wedding_photography.png`}
              alt="Decor"
              width={0}
              height={0}
              sizes="100%"
              style={{ width: "100%", height: "auto" }}
            />
            <p className="text-xl font-medium">Wedding Photography</p>
            <p className="px-4 hidden md:block">
              {
                "Each click captures the distinctive tale of your love in timeless frames. Wedsy simplifies the process and assists you seamlessly in choosing the perfect photographer hassle-free."
              }
            </p>
            <p className="px-4 md:hidden">
              {
                "Every click tells your unique love story. Wedsy simplifies and seamlessly assists you in choosing the perfect photographer."
              }
            </p>
          </div>
          <div className="bg-[#FFC9CB] p-3 md:p-6 rounded-3xl flex flex-col items-center gap-3 text-center">
            <Image
              src={`/assets/images/service_makeup_assistance.png`}
              alt="Decor"
              width={0}
              height={0}
              sizes="100%"
              style={{ width: "100%", height: "auto" }}
            />
            <p className="text-xl font-medium">Makeup Assistance</p>
            <p className="px-4 hidden md:block">
              {
                "Wedsy partners with top-notch makeup artists to enhance your best features on your special day. We'll help you choose the right artist within your budget."
              }
            </p>
            <p className="px-4 md:hidden">
              {
                "Wedsy links you to top makeup artists, ensuring your best features shine on your special day, all within your budget."
              }
            </p>
          </div>
          <div className="bg-[#FFDCC6] p-3 md:p-6 rounded-3xl flex flex-col items-center gap-3 text-center">
            <Image
              src={`/assets/images/service_venue_consultation.png`}
              alt="Decor"
              width={0}
              height={0}
              sizes="100%"
              style={{ width: "100%", height: "auto" }}
            />
            <p className="text-xl font-medium">Venue Consultation</p>
            <p className="px-4 hidden md:block">
              {
                "Discover the ideal venue where every detail aligns seamlessly. With connections to 200+ venues, unlocking your perfect space is a hassle-free choice."
              }
            </p>
            <p className="px-4 md:hidden">
              {
                "Find your perfect venue effortlessly with Wedsy's 200+ venue connections, ensuring every detail aligns seamlessly."
              }
            </p>
          </div>
        </div>
        <div className="flex items-center justify-center mt-16">
          <Link href={"#enquiryFormDiv"} className="md:hidden">
            <button
              className="bg-rose-900 text-white py-2 px-6 rounded-full font-medium"
              style={{ boxShadow: "0px 0px 19px 0px #FFFFFF" }}
            >
              Get Free Quote
            </button>
          </Link>
          <Link href={"#mainDiv"} className="hidden md:block">
            <button
              className="bg-rose-900 text-white py-2 px-6 rounded-full font-medium"
              style={{ boxShadow: "0px 0px 19px 0px #FFFFFF" }}
            >
              Get Free Quote
            </button>
          </Link>
        </div>
      </div>
      {/* Why Choose Us */}
      <div className="px-8 md:px-24 py-8 md:py-16 grid md:grid-cols-3 gap-12 bg-white">
        <p className="md:hidden font-semibold text-2xl text-[#204D96] order-first text-center">
          Why choose <span className="text-rose-900">WEDSY</span>?
        </p>
        <Link
          href={"#enquiryFormDiv"}
          className="block md:hidden order-last md:col-span-3  mx-auto mt-4 md:mt-16 mb-12 md:mb-0"
        >
          <button
            className="bg-rose-900 text-white py-2 px-6 rounded-full font-medium "
            style={{ boxShadow: "0px 0px 19px 0px #FFFFFF" }}
          >
            Contact us to know more
          </button>
        </Link>
        <Link
          href={"#mainDiv"}
          className="order-last md:col-span-3 hidden md:block mx-auto mt-4 md:mt-16 mb-12 md:mb-0"
        >
          <button
            className="bg-rose-900 text-white py-2 px-6 rounded-full font-medium "
            style={{ boxShadow: "0px 0px 19px 0px #FFFFFF" }}
          >
            Contact us to know more
          </button>
        </Link>
        <div className="hidden md:flex md:col-start-2 md:row-span-2 p-6 gap-6 flex-col">
          <Image
            src={`/assets/images/why_choose_wedsy-text.png`}
            alt="Decor"
            width={0}
            height={0}
            sizes="100%"
            style={{ width: "80%", height: "auto" }}
            className="mx-auto"
          />
          <Image
            src={`/assets/images/choose_customer_safety.png`}
            alt="Decor"
            width={0}
            height={0}
            sizes="100%"
            style={{ width: "80%", height: "auto" }}
            className="mx-auto"
          />
          <ul className="text-center font-medium">
            <li>Customer Safeguard Assurance</li>
            <li>Quality Assurance</li>
            <li>Quantity Ensured</li>
            <li>Damage Protection</li>
            <li>Color Accuracy</li>
            <li>Timely Delivery</li>
            <li>Full Refund Guarantee</li>
          </ul>
        </div>
        <div className="md:p-6 flex flex-col items-center gap-3 text-center md:order-first">
          <Image
            src={`/assets/images/choose_affordable_elegance.png`}
            alt="Decor"
            width={0}
            height={0}
            sizes="100%"
            style={{ width: "100%", height: "auto" }}
          />
          <p className="text-xl font-medium">Affordable Elegance</p>
          <p className="md:px-4">
            {
              "Our pricing reflects actual costs, ensuring the most elegant decor without the hefty price tag"
            }
          </p>
        </div>
        <div className="md:p-6 hidden md:flex flex-col items-center gap-3 text-center">
          <Image
            src={`/assets/images/choose_first_online_decor_store.png`}
            alt="Decor"
            width={0}
            height={0}
            sizes="100%"
            style={{ width: "100%", height: "auto" }}
          />
          <p className="text-xl font-medium">First Online Decor Store</p>
          <p className="px-4">
            {
              "Revolutionary decor store: Explore stages, mandaps, and more. Browse, view prices, and book for your event."
            }
          </p>
        </div>
        <div className="grid md:hidden grid-cols-2 gap-6">
          <div className="md:p-6 flex md:hidden flex-col items-center gap-3 text-center">
            <Image
              src={`/assets/images/choose_first_online_decor_store-mobile.png`}
              alt="Decor"
              width={0}
              height={0}
              sizes="100%"
              style={{ width: "100%", height: "auto" }}
            />
            <p className="text-xl font-medium">First Online Decor Store</p>
            <p className="">
              {
                "Revolutionary decor store: Explore stages, mandaps, and more. Browse, view prices, and book for your event."
              }
            </p>
          </div>
          <div className="md:p-6 flex md:hidden flex-col items-center gap-3 text-center">
            <Image
              src={`/assets/images/choose_seamless_planning-mobile.png`}
              alt="Decor"
              width={0}
              height={0}
              sizes="100%"
              style={{ width: "100%", height: "auto" }}
            />
            <p className="text-xl font-medium">Seamless Planning</p>
            <p className="">
              {
                "Enjoy personalized planning at no extra cost—a single point of contact for seamless execution."
              }
            </p>
          </div>
        </div>
        <div className="md:p-6 flex flex-col items-center gap-3 text-center">
          <Image
            src={`/assets/images/choose_ultimate_one-stop_wedding_hub.png`}
            alt="Decor"
            width={0}
            height={0}
            sizes="100%"
            style={{ width: "100%", height: "auto" }}
          />
          <p className="text-xl font-medium">Ultimate One-Stop Wedding Hub</p>
          <p className="md:px-4">
            {
              "Explore our one-stop wedding solution—venue, decor, catering, photography, and makeup—all under one roof for the ultimate experience."
            }
          </p>
        </div>
        <div className="md:p-6 hidden md:flex flex-col items-center gap-3 text-center">
          <Image
            src={`/assets/images/choose_seamless_planning.png`}
            alt="Decor"
            width={0}
            height={0}
            sizes="100%"
            style={{ width: "100%", height: "auto" }}
          />
          <p className="text-xl font-medium">Seamless Planning</p>
          <p className="px-4">
            {
              "Enjoy personalized planning at no extra cost—a single point of contact for seamless execution."
            }
          </p>
        </div>
        <div className="flex md:hidden md:p-6 gap-6 flex-col">
          <Image
            src={`/assets/images/choose_customer_safety-mobile.png`}
            alt="Decor"
            width={0}
            height={0}
            sizes="100%"
            style={{ width: "80%", height: "auto" }}
            className="mx-auto"
          />
          <ul className="text-center text-xl font-semibold">
            <li>Customer Safeguard Assurance</li>
            <li>Quality Assurance</li>
            <li>Quantity Ensured</li>
            <li>Damage Protection</li>
            <li>Color Accuracy</li>
            <li>Timely Delivery</li>
            <li>Full Refund Guarantee</li>
          </ul>
        </div>
      </div>
      {/* Testimonials */}
      <Testimonials />
      <div className="bg-rose-900 flex flex-col justify-center items-center p-12 gap-10 text-center">
        <p className="text-white font-semibold text-2xl md:text-3xl">
          Speak to our certified Wedding Specialist today!
        </p>
        <Link href={"#enquiryFormDiv"} className="md:hidden">
          <button
            className="bg-white text-rose-900 py-2 px-6 rounded-full md:rounded-lg font-medium"
            style={{ boxShadow: "0px 0px 19px 0px #FFFFFF" }}
          >
            Contact us to know more
          </button>
        </Link>
        <Link href={"#mainDiv"} className="hidden md:block">
          <button
            className="bg-white text-rose-900 py-2 px-6 rounded-full md:rounded-lg font-medium"
            style={{ boxShadow: "0px 0px 19px 0px #FFFFFF" }}
          >
            Contact us to know more
          </button>
        </Link>
      </div>

      {/* Footer */}
      <Footer container className="bg-white text-black p-0 pt-6 rounded-none">
        <div className="w-full">
          <div className="grid w-full grid-cols-1 gap-8 px-6 py-8 md:grid-cols-3">
            <div className="md:col-span-2">
              <Footer.LinkGroup
                col
                className="text-black uppercase font-medium space-y-2 md:space-y-6"
              >
                <Footer.Link href="/terms-and-conditions">
                  TERMS & CONDITIONS
                </Footer.Link>
                <Footer.Link href="/privacy-policy">PRIVACY POLICY</Footer.Link>
                <Footer.Link href="tel:+916364849760">
                  CALL US AT +91 6364849760
                </Footer.Link>
              </Footer.LinkGroup>
            </div>
            <div>
              <Footer.Title title="GET IN TOUCH" className="text-black mb-2" />
              <Footer.LinkGroup col className="space-y-1 text-black">
                <Footer.Link href="mailto:hello@wedsy.in">
                  hello@wedsy.in
                </Footer.Link>
                <Footer.Link href="#">
                  #14, HM Geneva House, Cunningham Road Bangalore
                </Footer.Link>
              </Footer.LinkGroup>
              <div className="md:mt-4 flex space-x-6 sm:mt-0 text-black">
                <Footer.Icon
                  href="https://www.facebook.com/wedsy.in?mibextid=LQQJ4d"
                  icon={BsFacebook}
                  className="text-black"
                />
                <Footer.Icon
                  href="https://x.com/wedsyindia?s=11&t=cw__PWAfpNh_XaLeRkSHcg"
                  icon={BsTwitter}
                  className="text-black"
                />
                <Footer.Icon
                  href="https://www.instagram.com/wedsy.in?igsh=MTV3bWszMjVrM2pzbQ=="
                  icon={BsInstagram}
                  className="text-black"
                />
                <Footer.Icon
                  href="https://g.co/kgs/F3kbQei"
                  icon={BsGoogle}
                  className="text-black"
                />
              </div>
            </div>
          </div>

          <div className="bg-black text-white text-sm px-8 py-3 w-full">
            Copyright &copy; WEDSY INDIA PRIVATE LIMITED. All rights reserved.
          </div>
        </div>
      </Footer>
    </>
  );
}
