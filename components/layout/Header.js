import SearchBar from "@/components/searchBar/SearchBar";
import { Dropdown } from "flowbite-react";
import Link from "next/link";
import { useRouter } from "next/router";
import { useEffect, useRef, useState } from "react";
import { BiLogIn, BiLogOut } from "react-icons/bi";
import { FaRegUserCircle } from "react-icons/fa";
import { FiSearch } from "react-icons/fi";

export default function Header({ userLoggedIn, user, Logout }) {
  const router = useRouter();
  const [variant, setVariant] = useState("light");
  const [displayHeaderLinks, setDisplayHeaderLinks] = useState(true);
  const [isExpanded, setIsExpanded] = useState(false);
  const [searchValue, setSearchValue] = useState("");
  const [showSearchSuggestions, setShowSearchSuggestions] = useState(false);
  const [searchLoading, setSearchLoading] = useState(false);
  const [searchResults, setSearchResults] = useState([]);
  const [mobileSearchOpen, setMobileSearchOpen] = useState(false);
  const searchWrapRef = useRef(null);
  const navbarRef = useRef();

  const getToken = () => {
    try {
      return localStorage.getItem("token") || "";
    } catch (e) {
      return "";
    }
  };

  const navigateFromResult = (r) => {
    if (!r) return;
    setShowSearchSuggestions(false);
    setMobileSearchOpen(false);
    setSearchValue("");
    if (r.type === "decorCategory") {
      router.push(`/decor/view?category=${encodeURIComponent(r.id)}`);
      return;
    }
    if (r.type === "decorItem") {
      router.push(`/decor/view/${r.id}`);
      return;
    }
    if (r.type === "decorPackage") {
      router.push(`/decor/packages/${r.id}`);
      return;
    }
    if (r.type === "vendor") {
      router.push(`/makeup-and-beauty/artists/${r.id}`);
      return;
    }
    if (r.type === "event") {
      router.push(`/event/${r.id}`);
      return;
    }
  };

  const goToFirstSuggestion = () => {
    if (!searchResults.length) return;
    navigateFromResult(searchResults[0]);
  };

  useEffect(() => {
    const q = searchValue.trim();
    if (!q) {
      setSearchResults([]);
      setSearchLoading(false);
      return;
    }

    let cancelled = false;
    setSearchLoading(true);

    const t = setTimeout(async () => {
      try {
        const token = getToken();
        const resp = await fetch(
          `${process.env.NEXT_PUBLIC_API_URL}/search?q=${encodeURIComponent(q)}&limit=10`,
          {
            method: "GET",
            headers: {
              "Content-Type": "application/json",
              ...(token ? { authorization: `Bearer ${token}` } : {}),
            },
          }
        );
        const data = await resp.json().catch(() => null);
        if (cancelled) return;
        setSearchResults(Array.isArray(data?.results) ? data.results : []);
      } catch (e) {
        if (!cancelled) setSearchResults([]);
      } finally {
        if (!cancelled) setSearchLoading(false);
      }
    }, 220);

    return () => {
      cancelled = true;
      clearTimeout(t);
    };
  }, [searchValue]);
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
      <nav aria-label="Main navigation" className="flex md:hidden items-center justify-between w-full h-[60px] px-4 bg-[#FAFBFF] shadow-md sticky top-0 z-50">
        {/* Logo */}
        <Link href="/" className="flex items-center">
          <img
            alt="Wedsy Logo"
            className="object-contain w-[140px] h-[35.49px]"
            src={variant === "dark" ? "/logo-black.webp" : "/logo-black.webp"}
          />
        </Link>
        {/* Icons */}
        <div className="flex items-center gap-6">
          <button
            type="button"
            aria-label="Search"
            className="p-0 m-0 bg-transparent border-none hover:cursor-pointer"
            onClick={() => {
              setMobileSearchOpen((v) => !v);
              if (searchValue.trim()) setShowSearchSuggestions(true);
            }}
          >
            <FiSearch className="w-[28px] h-[28px] text-[#2C365A] hover:text-[#840032] transition-colors duration-200" />
          </button>
          <Dropdown
            inline
            arrowIcon={false}
            label={
              <span className="inline-flex" aria-label="Account menu">
                <FaRegUserCircle className="w-[28px] h-[28px] text-[#2C365A] hover:text-[#840032] transition-colors duration-200" />
              </span>
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
                {/* <Dropdown.Item as={Link} href="/my-bids">
                  My Bids
                </Dropdown.Item> */}
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
      </nav>

      {/* Mobile Search (dropdown) */}
      {mobileSearchOpen && (
        <div className="md:hidden sticky top-[60px] z-50 bg-[#FAFBFF] px-4 pb-3 shadow">
          <div ref={searchWrapRef} className="relative">
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
                  setMobileSearchOpen(false);
                }
              }}
              placeholder="Search decor, packages, artists..."
              inputClassName="text-sm"
              autoFocus
            />

            {showSearchSuggestions && (searchLoading || searchResults.length > 0) && (
              <div className="absolute top-full mt-2 w-full bg-white border border-gray-200 rounded-xl shadow-lg overflow-hidden z-50">
                {searchLoading && (
                  <div className="px-4 py-3 text-sm text-gray-500">Searching…</div>
                )}
                {!searchLoading &&
                  searchResults.map((r) => (
                    <button
                      key={`${r.type}:${r.id}`}
                      type="button"
                      className="w-full text-left px-4 py-3 hover:bg-gray-50"
                      style={{ fontFamily: "Montserrat, sans-serif" }}
                      onClick={() => navigateFromResult(r)}
                    >
                      <div className="text-sm text-gray-900">{r.label}</div>
                      {r.meta ? (
                        <div className="text-xs text-gray-500 mt-0.5">{r.meta}</div>
                      ) : null}
                    </button>
                  ))}
              </div>
            )}
          </div>
        </div>
      )}

      {/* Desktop Header */}
      <nav ref={navbarRef} aria-label="Main navigation" className="hidden md:flex sticky top-0 z-50 w-full bg-[#FAFBFF] shadow items-center h-[60px]">
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
              href="/coming-soon"
              className="font-medium text-[15px] transition-colors duration-200 hover:text-[#840032] hover:cursor-pointer"
              style={{
                fontFamily: 'Montserrat, sans-serif',
               // color: router?.pathname === '/makeup-and-beauty' ? '#840032' : '#000000',
                color: router?.pathname === '/coming-soon' ? '#840032' : '#000000',
              }}
            >
              MAKEUP ARTIST
            </Link>
          </div>

          {/* Center: Logo */}
          <Link href="/" className="flex items-center justify-center">
            <img
              src="/logo-black.webp"
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
                placeholder="Search decor, packages, artists..."
                inputClassName="text-sm"
              />
              {/* keyboard handling */}
              <div className="hidden">
                {/* placeholder for future a11y combobox wiring */}
              </div>

              {showSearchSuggestions && (searchLoading || searchResults.length > 0) && (
                <div className="absolute top-full mt-2 w-full bg-white border border-gray-200 rounded-xl shadow-lg overflow-hidden z-50">
                  {searchLoading && (
                    <div className="px-4 py-3 text-sm text-gray-500">Searching…</div>
                  )}
                  {!searchLoading &&
                    searchResults.map((r) => (
                      <button
                        key={`${r.type}:${r.id}`}
                        type="button"
                        className="w-full text-left px-4 py-3 hover:bg-gray-50"
                        style={{ fontFamily: "Montserrat, sans-serif" }}
                        onClick={() => navigateFromResult(r)}
                      >
                        <div className="text-sm text-gray-900">{r.label}</div>
                        {r.meta ? (
                          <div className="text-xs text-gray-500 mt-0.5">{r.meta}</div>
                        ) : null}
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
                  {/* <Dropdown.Item as={Link} href="/my-bids" className="hover:bg-gray-50 hover:cursor-pointer">
                    My Bids
                  </Dropdown.Item> */}
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
      </nav>

    </>
  );
}
