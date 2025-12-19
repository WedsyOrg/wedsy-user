import Head from "next/head";
import Image from "next/image";
import Link from "next/link";

export default function Custom404() {
  return (
    <>
      <Head>
        <title>404 - Page Not Found | Wedsy</title>
        <meta name="description" content="The page you are looking for does not exist." />
        <meta name="robots" content="noindex, nofollow" />
        <link rel="canonical" href="https://www.wedsy.in/404" />
      </Head>
      <div className="min-h-screen bg-[#F4F4F4] flex flex-col">
      {/* Main Content Area */}
      <div className="flex-1 flex items-center justify-center px-4 py-8">
        <div className="max-w-6xl w-full">
          {/* Illustration Section */}
          <div className="relative mb-8">
            <Image
              src="/assets/404/404.webp"
              alt="404 Error Illustration"
              width={800}
              height={600}
              className="w-full h-auto max-w-4xl mx-auto"
              priority
            />
          </div>

          {/* Error Message and CTA */}
          <div className="text-center">
            <div className="bg-[#840032] text-white py-6 px-8 rounded-2xl mb-6">
              <h1 className="text-2xl md:text-3xl font-bold mb-2">
                THE PAGE YOU'RE LOOKING FOR DOES NOT EXIST
              </h1>
            </div>
            
            <Link 
              href="/"
              className="inline-block bg-white text-[#840032] font-bold py-4 px-8 rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-105"
            >
              Back to Homepage
            </Link>
          </div>
        </div>
      </div>
      </div>
    </>
  );
}
