import { Footer } from "flowbite-react";
import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import { BsFacebook, BsInstagram, BsTwitter } from "react-icons/bs";
import { FaGoogle } from "react-icons/fa";

export default function FooterComponent() {
  const [displayFooter, setDisplayFooter] = useState(true);
  const router = useRouter();
  useEffect(() => {
    if (
      router?.pathname === "/weddings-made-easy" ||
      // router?.pathname === "/decor/view" ||
      // router?.pathname?.startsWith("/event") ||
      router.pathname === "/my-payments/[paymentId]/invoice" ||
      router?.pathname === "/makeup-and-beauty/bidding" ||
      router?.pathname?.startsWith("/my-bids") ||
      router?.pathname?.startsWith("/chats")
    ) {
      setDisplayFooter(false);
    } else {
      setDisplayFooter(true);
    }
  }, [router?.pathname]);
  return (
    displayFooter && (
      <>
        <Footer container className="bg-white text-black p-0 rounded-none">
          <div className="w-full">
            {router?.pathname !== "/my-payments" && (
              <div className="grid w-full grid-cols-1 gap-8 px-6 py-8 md:grid-cols-3">
                <div className="px-4 md:px-8">
                  <Footer.LinkGroup
                    col
                    className="text-black uppercase font-semibold space-y-3 md:space-y-4"
                  >
                    <Footer.Link href="/privacy-policy" className="text-black hover:text-gray-600 transition-colors">
                      Privacy Policy
                    </Footer.Link>
                    <Footer.Link href="/terms-and-conditions" className="text-black hover:text-gray-600 transition-colors">
                      Terms and conditions
                    </Footer.Link>
                    <Footer.Link href="/hub/refund-policy/" className="text-black hover:text-gray-600 transition-colors">
                      Refund Policy
                    </Footer.Link>
                  </Footer.LinkGroup>
                </div>
                <div className="px-4 md:px-8 md:flex md:flex-col md:items-center md:justify-start">
                  <Footer.LinkGroup
                    col
                    className="text-black uppercase font-semibold space-y-3 md:space-y-4"
                  >
                    <Footer.Link
                      href="/hub/gallery/"
                      className="text-black hover:text-gray-600 transition-colors"
                    >
                      Wedsy's Work
                    </Footer.Link>
                    <Footer.Link
                      href="/hub/reviews/"
                      className="text-black hover:text-gray-600 transition-colors"
                    >
                      Wedsy Reviews
                    </Footer.Link>
                  </Footer.LinkGroup>
                </div>
                <div className="px-4 md:px-8 md:flex md:flex-col md:items-end">
                  <Footer.Title
                    title="GET IN TOUCH"
                    className="text-black font-bold text-base md:text-lg mb-3"
                  />
                  <Footer.LinkGroup col className="space-y-2 text-black">
                    <Footer.Link href="tel:+916364849760" className="text-black hover:text-gray-600 transition-colors">
                      +91 6364849760
                    </Footer.Link>
                    <Footer.Link href="mailto:hello@wedsy.in" className="text-black hover:text-gray-600 transition-colors">
                      hello@wedsy.in
                    </Footer.Link>
                    <span className="block text-black">
                      Gate 5, Palace Grounds
                      <br />
                      Bangalore - 560006
                    </span>
                  </Footer.LinkGroup>
                  <div className="mt-4 flex space-x-4 text-black">
                    <a
                      href="https://www.facebook.com/wedsy.in?mibextid=LQQJ4d"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-black hover:text-gray-600 transition-colors"
                    >
                      <BsFacebook size={20} />
                    </a>
                    <a
                      href="https://x.com/wedsyindia?s=11&t=cw__PWAfpNh_XaLeRkSHcg"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-black hover:text-gray-600 transition-colors"
                    >
                      <BsTwitter size={20} />
                    </a>
                    <a
                      href="https://www.instagram.com/wedsy.in?igsh=MTV3bWszMjVrM2pzbQ=="
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-black hover:text-gray-600 transition-colors"
                    >
                      <BsInstagram size={20} />
                    </a>
                    <a
                      href="https://g.co/kgs/F3kbQei"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-black hover:text-gray-600 transition-colors"
                    >
                      <FaGoogle size={20} />
                    </a>
                  </div>
                </div>
              </div>
            )}

            <div className="bg-black text-white text-sm px-6 py-4 w-full">
              Copyright &copy; WEDSY INDIA PRIVATE LIMITED. All rights reserved.
            </div>
          </div>
        </Footer>
      </>
    )
  );
}
