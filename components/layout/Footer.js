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
      router?.pathname?.startsWith("/my-bids")
    ) {
      setDisplayFooter(false);
    }
  }, [router?.pathname]);
  return (
    displayFooter && (
      <>
        <Footer container className="bg-white text-black p-0 rounded-none">
          <div className="w-full">
            {router?.pathname !== "/my-payments" && (
              <div className="grid w-full grid-cols-1 gap-8 px-6 py-8 md:grid-cols-2">
                <div className="px-4 md:px-20">
                  <Footer.LinkGroup
                    col
                    className="text-black uppercase font-semibold space-y-3 md:space-y-4"
                  >
                    <Footer.Link href="/terms-and-conditions" className="text-black hover:text-gray-600 transition-colors">
                      TERMS & CONDITIONS
                    </Footer.Link>
                    <Footer.Link href="/privacy-policy" className="text-black hover:text-gray-600 transition-colors">
                      PRIVACY POLICY
                    </Footer.Link>
                    <Footer.Link href="tel:+916364849760" className="text-black hover:text-gray-600 transition-colors">
                      CALL US AT +91 6364849760
                    </Footer.Link>
                  </Footer.LinkGroup>
                </div>
                <div className="px-4 md:px-20">
                  <Footer.Title
                    title="GET IN TOUCH"
                    className="text-black font-bold text-base md:text-lg mb-3"
                  />
                  <Footer.LinkGroup col className="space-y-2 text-black">
                    <Footer.Link href="mailto:hello@wedsy.in" className="text-black hover:text-gray-600 transition-colors">
                      hello@wedsy.in
                    </Footer.Link>
                    <Footer.Link href="#" className="text-black hover:text-gray-600 transition-colors">
                      #14, HM Geneva House, Cunningham Road Bangalore
                    </Footer.Link>
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
