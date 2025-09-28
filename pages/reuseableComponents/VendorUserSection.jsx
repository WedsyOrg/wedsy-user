import React from 'react';
import Image from 'next/image';
import Link from 'next/link';

const VendorUserSection = () => {
  return (
    <section className="w-full py-16 md:py-24">
      <div className="w-full flex flex-col md:flex-row">
        <div className="relative flex-1 h-96 md:h-[450px] overflow-hidden shadow-lg flex flex-col items-center justify-center p-6 md:p-10">
          <Image
            src="/assets/images/vendor_landing.png"
            alt="People collaborating at a table"
            layout="fill"
            objectFit="cover"
            className="z-0"
          />
          <div className="absolute inset-0 bg-black/30 z-10"></div>
          <div className="relative z-20 text-center">
            <h2
              className="text-white text-3xl md:text-5xl font-normal leading-tight mb-8 hidden md:block"
              style={{ fontFamily: 'Moul, serif' }}
            >
              “ Lets grow together! ”
            </h2>
            <Link href="/join-as-vendor">
              <button
                className="bg-white text-[#2B3F6C] px-8 py-3 rounded-md font-bold shadow-md hover:bg-gray-100 transition-colors duration-300"
                style={{ fontFamily: 'Montserrat', fontWeight: 'bold' }}
              >
                JOIN AS VENDOR
              </button>
            </Link>
          </div>
        </div>

        <div className="relative flex-1 md:h-[450px] overflow-hidden shadow-lg flex flex-col items-center justify-center p-6 md:p-100">
          <Image
            src="/assets/images/user_landing.png"
            alt="Couple celebrating"
            layout="fill"
            objectFit="cover"
            className="z-0"
          />
          <div className="absolute inset-0 bg-black/30 z-10"></div>
          <div className="relative z-20 text-center">
            <h2
              className="text-white text-3xl md:text-5xl font-normal leading-tight mb-8 hidden md:block"
              style={{ fontFamily: 'Montaga, serif' }}
            >
              “To new beginnings”
            </h2>
            <Link href="/login">
              <button
                className="bg-white text-[#840032] px-8 py-3 rounded-md font-bold shadow-md hover:bg-gray-100 transition-colors duration-300"
                style={{ fontFamily: 'Montserrat', fontWeight: 'bold' }}
              >
                JOIN AS USER
              </button>
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
};

export default VendorUserSection;