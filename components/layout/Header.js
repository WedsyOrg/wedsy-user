import { Dropdown, Navbar } from "flowbite-react";
import { FaRegUserCircle } from "react-icons/fa";
import { useEffect, useRef, useState } from "react";
import styles from "./Header.module.css";
import Link from "next/link";
import { BiLogIn, BiLogOut } from "react-icons/bi";
import { useRouter } from "next/router";
import { FiSearch } from "react-icons/fi";

export default function Header({ userLoggedIn, user, Logout }) {
  const router = useRouter();
  const [variant, setVariant] = useState("light");
  const [displayHeaderLinks, setDisplayHeaderLinks] = useState(true);
  const [isExpanded, setIsExpanded] = useState(false);
  const navbarRef = useRef();
  useEffect(() => {
    const myElement = document.getElementById("mainDiv");
    const isElementVisible = () => {
      if (!myElement) return false;
      const rect = myElement.getBoundingClientRect();
      return (
        rect.bottom >= 0 &&
        rect.right >= 0 &&
        rect.top <=
          (window.innerHeight || document.documentElement.clientHeight) &&
        rect.left <= (window.innerWidth || document.documentElement.clientWidth)
      );
    };
    const checkVisibility = () => {
      if (isElementVisible()) {
        setVariant("dark");
      } else {
        setVariant("light");
      }
    };
    checkVisibility();
    window.addEventListener("scroll", checkVisibility);
    return () => {
      window.removeEventListener("scroll", checkVisibility);
    };
  }, []);
  useEffect(() => {
    if (router?.pathname === "/weddings-made-easy") {
      setDisplayHeaderLinks(false);
    }
  }, [router?.pathname]);
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (navbarRef.current && !navbarRef.current.contains(event.target)) {
        document.getElementById("nav-div").classList.add("hidden");
        setIsExpanded(false);
      }
    };

    if (isExpanded) {
      document.body.addEventListener("click", handleClickOutside);
      document.body.addEventListener("touchstart", handleClickOutside);
    }
    return () => {
      document.body.removeEventListener("click", handleClickOutside);
      document.body.removeEventListener("touchstart", handleClickOutside);
    };
  }, [isExpanded]);

  return router?.pathname === `/my-payments/[paymentId]/invoice` ? null : (
    <>
      {/* Mobile Header */}
      <div className="flex md:hidden items-center justify-between w-full h-[60px] px-4 bg-[#FAFBFF] shadow-md sticky top-0 z-50">
        {/* Logo */}
        <Link href="/" className="flex items-center">
          <img
            alt="Wedsy Logo"
            className="object-contain w-[140px] h-[35.49px]"
            src={variant === "dark" ? "/logo-black.png" : "/logo-black.png"}
          />
        </Link>
        {/* Icons */}
        <div className="flex items-center gap-6">
          <button className="p-0 m-0 bg-transparent border-none hover:cursor-pointer">
            <FiSearch className="w-[28px] h-[28px] text-[#2C365A] hover:text-[#840032] transition-colors duration-200" />
          </button>
          <Dropdown
            inline
            arrowIcon={false}
            label={
              <FaRegUserCircle className="w-[28px] h-[28px] text-[#2C365A] hover:text-[#840032] transition-colors duration-200" />
            }
            className="w-44"
          >
            {userLoggedIn ? (
              <>
                <Dropdown.Header as={Link} href="/my-account">
                  <span className="block text-sm truncate">{user?.name || "My Account"}</span>
                </Dropdown.Header>
                <Dropdown.Item as={Link} href="/my-account">
                  My Account
                </Dropdown.Item>
                <Dropdown.Item as={Link} href="/my-bids">
                  My Bids
                </Dropdown.Item>
                <Dropdown.Item as={Link} href="/my-orders">
                  Orders
                </Dropdown.Item>
                <Dropdown.Item as={Link} href="/event">
                  Events
                </Dropdown.Item>
                <Dropdown.Item as={Link} href="/chats">
                  Chats
                </Dropdown.Item>
                <Dropdown.Divider />
                <Dropdown.Item className="flex items-center gap-2" onClick={Logout}>
                  <BiLogOut />
                  Logout
                </Dropdown.Item>
              </>
            ) : (
              <Dropdown.Item as={Link} href="/login" className="flex items-center gap-2">
                <BiLogIn />
                Login
              </Dropdown.Item>
            )}
          </Dropdown>
        </div>
      </div>
      {/* Desktop Header */}
      <div ref={navbarRef} className="hidden md:flex sticky top-0 z-50 w-full bg-[#FAFBFF] shadow items-center h-[60px]">
        <div className="w-full max-w-[1550px] mx-auto flex justify-between items-center px-6">
          
          {/* Left: Links */}
          <div className="flex items-center gap-32">
            <Link
              href="/decor"
              className="font-medium text-[15px] transition-colors duration-200 hover:text-[#840032] hover:cursor-pointer"
              style={{
                fontFamily: 'Montserrat, sans-serif',
                color: router?.pathname === '/decor' ? '#840032' : '#000000',
              }}
            >
              WEDDING STORE
            </Link>
            <Link
              href="/makeup-and-beauty"
              className="font-medium text-[15px] transition-colors duration-200 hover:text-[#840032] hover:cursor-pointer"
              style={{
                fontFamily: 'Montserrat, sans-serif',
                color: router?.pathname === '/makeup-and-beauty' ? '#840032' : '#000000',
              }}
            >
              MAKEUP ARTIST
            </Link>
          </div>

          {/* Center: Logo */}
          <Link href="/" className="flex items-center justify-center">
            <img
              src="/logo-black.png"
              alt="Wedsy Logo"
              className="w-[140px] h-[35px] object-contain"
            />
          </Link>

          {/* Right: Search & User Icon */}
          <div className="flex items-center gap-32">
            {/* Search Bar */}
            <div className="relative w-[320px] h-[34px] hidden lg:block">
              <FiSearch className="absolute top-1/2 left-3 transform -translate-y-1/2 text-gray-400" size={18} />
              <input
                type="text"
                placeholder="Looking for something specific ?"
                className="w-full h-full pl-10 pr-4 rounded-full border border-gray-200 bg-white shadow-sm text-sm placeholder:text-xs placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-[#840032] font-light"
                style={{
                  fontFamily: 'Montserrat, sans-serif',
                }}
              />
            </div>
            {/* User Icon */}
            <Dropdown
              inline
              label={
                <FaRegUserCircle className="text-black w-[26px] h-[26px] hover:text-[#840032] transition-colors duration-200 hover:cursor-pointer" />
              }
              arrowIcon={false}
            >
              {userLoggedIn ? (
                <>
                  <Dropdown.Header as={Link} href="/my-account" className="hover:bg-gray-50 hover:cursor-pointer">
                    <span className="block text-sm">{user.name}</span>
                  </Dropdown.Header>
                  <Dropdown.Item as={Link} href="/my-account" className="hover:bg-gray-50 hover:cursor-pointer">
                    My Account
                  </Dropdown.Item>
                  <Dropdown.Item as={Link} href="/my-bids" className="hover:bg-gray-50 hover:cursor-pointer">
                    My Bids
                  </Dropdown.Item>
                  <Dropdown.Item as={Link} href="/my-orders" className="hover:bg-gray-50 hover:cursor-pointer">Orders</Dropdown.Item>
                  <Dropdown.Item as={Link} href="/event" className="hover:bg-gray-50 hover:cursor-pointer">Events</Dropdown.Item>
                  <Dropdown.Divider />
                  <Dropdown.Item className="flex gap-2 hover:bg-gray-50 hover:cursor-pointer" onClick={Logout}>
                    <BiLogOut />
                    Logout
                  </Dropdown.Item>
                </>
              ) : (
                <Dropdown.Item as={Link} href="/login" className="flex gap-2 hover:bg-gray-50 hover:cursor-pointer">
                  <BiLogIn />
                  Login
                </Dropdown.Item>
              )}
            </Dropdown>
          </div>
        </div>
      </div>

    </>
  );
}
