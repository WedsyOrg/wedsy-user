import { Dropdown, Navbar } from "flowbite-react";
import { FaRegUserCircle } from "react-icons/fa";
import { useEffect, useMemo, useRef, useState } from "react";
import styles from "./Header.module.css";
import Link from "next/link";
import { BiLogIn, BiLogOut } from "react-icons/bi";
import { useRouter } from "next/router";
import { FiSearch } from "react-icons/fi";
import SearchBar from "@/components/searchBar/SearchBar";

export default function Header({ userLoggedIn, user, Logout }) {
  const router = useRouter();
  const [variant, setVariant] = useState("light");
  const [displayHeaderLinks, setDisplayHeaderLinks] = useState(true);
  const [isExpanded, setIsExpanded] = useState(false);
  const [searchValue, setSearchValue] = useState("");
  const [showSearchSuggestions, setShowSearchSuggestions] = useState(false);
  const searchWrapRef = useRef(null);
  const navbarRef = useRef();

  const SEARCH_ITEMS = useMemo(
    () => [
      { label: "Wedding Store (Decor)", href: "/decor", keywords: ["decor", "wedding store", "wedding", "store"] },
      { label: "Decor Packages", href: "/decor/packages", keywords: ["decor", "packages", "package"] },
      { label: "Makeup Artist Store", href: "/makeup-and-beauty", keywords: ["makeup", "artist", "beauty", "mua"] },
      { label: "Makeup Artists", href: "/makeup-and-beauty/artists", keywords: ["makeup", "artist", "artists", "beauty"] },
      { label: "My Account", href: "/my-account", keywords: ["my", "account", "profile"] },
      { label: "My Orders", href: "/my-orders", keywords: ["my", "orders", "order"] },
      { label: "My Bids", href: "/my-bids", keywords: ["my", "bids", "bid"] },
      { label: "My Payments", href: "/my-payments", keywords: ["my", "payments", "payment", "invoice"] },
      { label: "Wishlist", href: "/wishlist", keywords: ["my", "wishlist", "saved", "favorites", "favourites"] },
      { label: "Events", href: "/event", keywords: ["event", "events", "planner"] },
      { label: "Chats", href: "/chats", keywords: ["chat", "chats", "messages"] },
      { label: "Login", href: "/login", keywords: ["login", "sign in", "signin"] },
      { label: "Signup", href: "/signup", keywords: ["signup", "sign up", "register"] },
    ],
    []
  );

  const suggestions = useMemo(() => {
    const q = searchValue.trim().toLowerCase();
    if (!q) return [];

    const scored = SEARCH_ITEMS.map((item) => {
      const hay = [item.label, ...(item.keywords || [])].join(" ").toLowerCase();
      let score = 0;
      if (item.label.toLowerCase().startsWith(q)) score += 3;
      if (hay.startsWith(q)) score += 2;
      if (hay.includes(q)) score += 1;
      return { item, score };
    })
      .filter((x) => x.score > 0)
      .sort((a, b) => b.score - a.score)
      .slice(0, 8)
      .map((x) => x.item);

    return scored;
  }, [SEARCH_ITEMS, searchValue]);

  const goToFirstSuggestion = () => {
    if (!suggestions.length) return;
    const first = suggestions[0];
    setShowSearchSuggestions(false);
    setSearchValue("");
    router.push(first.href);
  };
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
      if (searchWrapRef.current && !searchWrapRef.current.contains(event.target)) {
        setShowSearchSuggestions(false);
      }
    };

    if (isExpanded) {
      document.body.addEventListener("click", handleClickOutside);
      document.body.addEventListener("touchstart", handleClickOutside);
    }
    if (showSearchSuggestions) {
      document.body.addEventListener("click", handleClickOutside);
      document.body.addEventListener("touchstart", handleClickOutside);
    }
    return () => {
      document.body.removeEventListener("click", handleClickOutside);
      document.body.removeEventListener("touchstart", handleClickOutside);
    };
  }, [isExpanded, showSearchSuggestions]);

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
                <Dropdown.Item as={Link} href="/wishlist">
                  Wishlist
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
            <div ref={searchWrapRef} className="hidden lg:block w-[320px] relative">
              <SearchBar
                value={searchValue}
                onChange={(e) => {
                  const v = e.target.value;
                  setSearchValue(v);
                  setShowSearchSuggestions(!!v.trim());
                }}
                onFocus={() => {
                  if (searchValue.trim()) setShowSearchSuggestions(true);
                }}
                onKeyDown={(e) => {
                  if (e.key === "Enter") {
                    e.preventDefault();
                    goToFirstSuggestion();
                  }
                  if (e.key === "Escape") {
                    setShowSearchSuggestions(false);
                  }
                }}
                placeholder="Search..."
                inputClassName="text-sm"
              />
              {/* keyboard handling */}
              <div className="hidden">
                {/* placeholder for future a11y combobox wiring */}
              </div>

              {showSearchSuggestions && suggestions.length > 0 && (
                <div className="absolute top-full mt-2 w-full bg-white border border-gray-200 rounded-xl shadow-lg overflow-hidden z-50">
                  {suggestions.map((sug) => (
                    <button
                      key={sug.href}
                      type="button"
                      className="w-full text-left px-4 py-3 text-sm hover:bg-gray-50"
                      style={{ fontFamily: "Montserrat, sans-serif" }}
                      onClick={() => {
                        setShowSearchSuggestions(false);
                        setSearchValue("");
                        router.push(sug.href);
                      }}
                    >
                      {sug.label}
                      <span className="text-gray-400 ml-2">{sug.href}</span>
                    </button>
                  ))}
                </div>
              )}
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
                  <Dropdown.Item as={Link} href="/wishlist" className="hover:bg-gray-50 hover:cursor-pointer">Wishlist</Dropdown.Item>
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
