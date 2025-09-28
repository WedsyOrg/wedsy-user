import Image from "next/image";
import { useState } from "react";
import { MdFormatQuote } from "react-icons/md";
import styles from "./Testimonials.module.css";

export default function Testimonials() {
  const [testimonial, setTestimonials] = useState({ total: 2, display: 0 });
  return (
    <>
      {/* Testimonials */}
      <div
        className={`${styles.customers_div} px-6 md:px-24 py-8 md:py-16 grid md:grid-cols-2 gap-8`}
      >
        <div className="flex flex-col justify-between gap-6 md:gap-0">
          <div>
            <p className="justify-center md:justify-start w-full text-3xl md:text-4xl font-medium text-black flex gap-2 mb-2">
              Customers
              <span className="text-rose-900 font-bold">LOVE</span>
            </p>
            <Image
              src={`/assets/images/wedsy-text.png`}
              alt="Decor"
              width={0}
              height={0}
              sizes="100%"
              className="h-16 w-auto mx-auto md:mx-0"
            />
          </div>
          <div>
            {
              [
                <Image
                  key={"image-1"}
                  src={`/assets/images/review_image-1.png`}
                  alt="Decor"
                  width={0}
                  height={0}
                  sizes="100%"
                  style={{ width: "80%", height: "auto" }}
                  className="mx-auto md:mx-0"
                />,
                <Image
                  key={"image-2"}
                  src={`/assets/images/review_image-2.png`}
                  alt="Decor"
                  width={0}
                  height={0}
                  sizes="100%"
                  style={{ width: "80%", height: "auto" }}
                  className="mx-auto md:mx-0"
                />,
              ][testimonial.display]
            }
          </div>
          <div className="flex flex-row gap-2 justify-center">
            <div
              className={`h-4 w-4 rounded-full ${
                testimonial.display === 0
                  ? "bg-black"
                  : "bg-gray-500 cursor-pointer"
              }`}
              onClick={() => {
                setTestimonials({ ...testimonial, display: 0 });
              }}
            />
            <div
              className={`h-4 w-4 rounded-full ${
                testimonial.display === 1
                  ? "bg-black"
                  : "bg-gray-500 cursor-pointer"
              }`}
              onClick={() => {
                setTestimonials({ ...testimonial, display: 1 });
              }}
            />
          </div>
        </div>
        <div className="flex flex-col justify-around text-center gap-6 md:gap-0 md:px-8 py-8">
          {
            [
              <>
                <p className="font-medium text-lg">
                  <MdFormatQuote className="rotate-180 float-left" size={24} />
                  {
                    "The first time that I met Rohaan is when I knew that he will be my wedding planner. Everything has been very seamless and everything has been executed perfectly. When you look around the venue you would really be happy with how it turned out."
                  }
                </p>
                <p className="font-medium text-lg">
                  {
                    "All thanks to him and his team, they have done a great job. He was very flexible with whatever we asked and he delivered it on time. We are very very happy with whatever was given to us. Thank you and we definitely recommend Wedsy!"
                  }
                </p>
                <p className="text-[#667080] md:text-rose-900 font-semibold text-lg">
                  ASFIYA & RAHIL
                </p>
              </>,
              <>
                <p className="font-medium text-lg">
                  <MdFormatQuote className="rotate-180 float-left" size={24} />
                  {
                    "We Chose Wedsy for my sister’s wedding. We had found them on instagram. The Decor was totally good, we really loved it! We had a lot of guests saying that all the decor was really nice!"
                  }
                </p>
                <p className="font-medium text-lg">
                  {
                    "Was really lucky to meet Wedsy, things went smooth in getting the decor and everything else done. I’d strongly recommend Wedsy to my friends and family. I’d prefer Wedsy more than others at my future events too! Cheers"
                  }
                </p>
                <p className="text-[#667080] md:text-rose-900 font-semibold text-lg">
                  KEERTHI & SHREYAS
                </p>
              </>,
            ][testimonial.display]
          }
        </div>
      </div>
    </>
  );
}
