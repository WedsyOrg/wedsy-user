import React from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { motion } from 'framer-motion';

const VendorUserSection = () => {
  return (
    <section className="w-full py-16 md:py-24">
      <motion.div 
        className="w-full flex flex-col md:flex-row"
        initial="hidden"
        whileInView="visible"
        viewport={{ once: false, amount: 0.5 }}
        variants={{
          hidden: {},
          visible: {
            transition: {
              staggerChildren: 0.2
            }
          }
        }}
      >
        {/* Left Section - Partner */}
        <motion.div 
          className="relative flex-1 h-96 md:h-[450px] overflow-hidden shadow-lg flex flex-col items-center justify-center p-6 md:p-10"
          initial={{ opacity: 0, x: -20 }}
          whileInView={{ opacity: 1, x: 0 }}
          viewport={{ once: false, amount: 0.5 }}
          transition={{ duration: 1.0, ease: [0.16, 1, 0.3, 1] }}
        >
          <motion.div
            className="absolute inset-0 z-0"
            initial={{ opacity: 0, scale: 0.95 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: false, amount: 0.5 }}
            transition={{ duration: 1.2, ease: [0.22, 1, 0.36, 1] }}
          >
          <Image
            src="/assets/images/vendor_landing.webp"
            alt="People collaborating at a table"
            layout="fill"
            objectFit="cover"
            className="z-0"
          />
          </motion.div>
          <div className="absolute inset-0 bg-black/30 z-10"></div>
          <motion.div 
            className="relative z-20 text-center"
            initial="hidden"
            whileInView="visible"
            viewport={{ once: false, amount: 0.6 }}
            variants={{
              hidden: {},
              visible: {
                transition: {
                  staggerChildren: 0.2
                }
              }
            }}
          >
            <motion.h2
              className="text-white text-3xl md:text-5xl font-normal leading-tight mb-8 hidden md:block"
              style={{ fontFamily: 'Moul, serif' }}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: false, amount: 0.6 }}
              transition={{ duration: 1.2, ease: [0.22, 1, 0.36, 1], delay: 0.2 }}
            >
              " Lets grow together! "
            </motion.h2>
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: false, amount: 0.5 }}
              transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1], delay: 0.4 }}
            >
            <Link href="/join-as-vendor">
              <button
                className="bg-white text-[#2B3F6C] px-8 py-3 rounded-md font-bold shadow-md hover:bg-gray-100 transition-colors duration-300"
                style={{ fontFamily: 'Montserrat', fontWeight: 'bold' }}
              >
                JOIN AS PARTNER
              </button>
            </Link>
            </motion.div>
          </motion.div>
        </motion.div>

        {/* Right Section - User */}
        <motion.div 
          className="relative flex-1 md:h-[450px] overflow-hidden shadow-lg flex flex-col items-center justify-center p-6 md:p-100"
          initial={{ opacity: 0, x: 20 }}
          whileInView={{ opacity: 1, x: 0 }}
          viewport={{ once: false, amount: 0.5 }}
          transition={{ duration: 1.0, ease: [0.16, 1, 0.3, 1], delay: 0.2 }}
        >
          <motion.div
            className="absolute inset-0 z-0"
            initial={{ opacity: 0, scale: 0.95 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: false, amount: 0.5 }}
            transition={{ duration: 1.2, ease: [0.22, 1, 0.36, 1], delay: 0.3 }}
          >
          <Image
            src="/assets/images/user_landing.webp"
            alt="Couple celebrating"
            layout="fill"
            objectFit="cover"
            className="z-0"
          />
          </motion.div>
          <div className="absolute inset-0 bg-black/30 z-10"></div>
          <motion.div 
            className="relative z-20 text-center"
            initial="hidden"
            whileInView="visible"
            viewport={{ once: false, amount: 0.6 }}
            variants={{
              hidden: {},
              visible: {
                transition: {
                  staggerChildren: 0.2
                }
              }
            }}
          >
            <motion.h2
              className="text-white text-3xl md:text-5xl font-normal leading-tight mb-8 hidden md:block"
              style={{ fontFamily: 'Montaga, serif' }}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: false, amount: 0.6 }}
              transition={{ duration: 1.2, ease: [0.22, 1, 0.36, 1], delay: 0.4 }}
            >
              "To new beginnings"
            </motion.h2>
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: false, amount: 0.5 }}
              transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1], delay: 0.6 }}
            >
            <Link href="/login">
              <button
                className="bg-white text-[#840032] px-8 py-3 rounded-md font-bold shadow-md hover:bg-gray-100 transition-colors duration-300"
                style={{ fontFamily: 'Montserrat', fontWeight: 'bold' }}
              >
                JOIN AS USER
              </button>
            </Link>
            </motion.div>
          </motion.div>
        </motion.div>
      </motion.div>
    </section>
  );
};

export default VendorUserSection;