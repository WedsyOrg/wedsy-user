import Head from "next/head";
import Image from "next/image";
import Link from "next/link";
import { motion } from "framer-motion";

export default function ComingSoon() {
  return (
    <>
      <Head>
        <title>Coming Soon | Wedsy</title>
        <meta name="description" content="Something amazing is coming soon. Stay tuned!" />
        <meta name="robots" content="noindex, nofollow" />
        <link rel="canonical" href="https://www.wedsy.in/coming-soon" />
      </Head>
      
      <div className="relative min-h-screen flex flex-col bg-stone-50">
        {/* Full Background Image - Only covers content area, not footer */}
        <div className="absolute inset-0 z-0 min-h-screen">
          <Image
            src="/assets/coming_soon/coming-soon.webp"
            alt="Coming Soon Background"
            fill
            className="object-cover"
            priority
            quality={90}
          />
        </div>
        
        {/* Black transparency overlay */}
        <div className="absolute inset-0 bg-black/40 backdrop-blur-[2px] z-[1] min-h-screen"></div>
        <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-black/20 z-[1] min-h-screen"></div>
        
        {/* Content Container - Takes available space but allows footer below */}
        <div className="relative z-10 flex-1 flex items-center justify-center">
          <div className="max-w-4xl mx-auto text-center px-4 sm:px-6 md:px-8 w-full py-12 md:py-20">
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, ease: "easeOut" }}
            >
              {/* Coming Very Soon Badge */}
              <motion.span
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.2, duration: 0.8 }}
                className="inline-block px-4 py-1.5 bg-[#840032]/20 backdrop-blur-md border border-[#840032]/30 rounded-full text-white text-[10px] sm:text-xs uppercase tracking-[0.2em] font-semibold mb-6 md:mb-8"
                style={{
                  fontFamily: "'Montserrat', sans-serif",
                }}
              >
                Coming Very Soon
              </motion.span>
              
              {/* Main Heading */}
              <h2
                className="text-5xl sm:text-6xl md:text-7xl lg:text-8xl text-white mb-4 md:mb-6 tracking-tight leading-tight"
                style={{
                  fontFamily: "'Dream Avenue', serif",
                  fontWeight: 400,
                  fontStyle: "normal",
                  textShadow: '2px 2px 12px rgba(0,0,0,0.5)',
                }}
              >
                Something Beautiful <br />
                <span className="italic font-light">is Blooming</span>
              </h2>
              
              {/* Description */}
              <motion.p
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.4, duration: 1 }}
                className="text-base sm:text-lg md:text-xl text-white/90 mb-8 md:mb-12 max-w-2xl mx-auto font-light leading-relaxed"
                style={{
                  fontFamily: "'Montserrat', sans-serif",
                  fontWeight: 300,
                  textShadow: '1px 1px 4px rgba(0,0,0,0.5)',
                }}
              >
                We're meticulously crafting a new digital experience for WEDSY. 
                Soon, your dream wedding and makeup experiences will be just a click away.
              </motion.p>
            </motion.div>

            {/* Back to Homepage Button */}
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.8, duration: 0.8 }}
              className="mt-8 md:mt-12"
            >
              <Link 
                href="/"
                className="inline-flex items-center gap-2 text-white/80 hover:text-white transition-colors group"
                style={{
                  fontFamily: "'Montserrat', sans-serif",
                }}
              >
                <svg 
                  className="w-4 h-4 group-hover:-translate-x-1 transition-transform" 
                  fill="none" 
                  stroke="currentColor" 
                  viewBox="0 0 24 24"
                >
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
                </svg>
                <span className="text-sm uppercase tracking-widest font-medium">Back to Homepage</span>
              </Link>
            </motion.div>
          </div>
        </div>

        {/* Decorative Elements */}
        <div className="fixed top-0 right-0 w-96 h-96 bg-[#840032]/10 blur-[120px] rounded-full -translate-y-1/2 translate-x-1/2 pointer-events-none z-0"></div>
        <div className="fixed bottom-0 left-0 w-96 h-96 bg-[#840032]/10 blur-[120px] rounded-full translate-y-1/2 -translate-x-1/2 pointer-events-none z-0"></div>
      </div>
    </>
  );
}

