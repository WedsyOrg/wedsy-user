import DecorCard from "@/components/cards/DecorCard";
import DecorDisclaimer from "@/components/marquee/DecorDisclaimer";
import { SpecificCategorySkeleton } from "@/components/skeletons/wedding-store/specific-category";
import { Dropdown } from "flowbite-react";
import Head from "next/head";
import { useRouter } from "next/router";
import { useEffect, useRef, useState } from "react";
import Masonry from "react-masonry-css";
import { Circle, Check } from "lucide-react";

// SEO Configuration for Different Categories
const CATEGORY_SEO_MAP = {
  Stage: {
    title: "Best Wedding Stage Decoration For Marriage | Wedsy",
    description:
      "Find the perfect wedding stage decoration at Wedsy. Our best stage decoration for marriage will make your day unforgettable. Book now!",
    keywords:
      "wedding stage decoration, best stage decoration for marriage, best wedding stage decoration",
  },
  Mandap: {
    title: "Affordable Mandap Decoration Prices | Elegant Designs by Wedsy",
    description:
      "Wedsy offers competitive mandap decoration prices for weddings. Explore our cost-effective packages for breathtaking designs.",
    keywords: "mandap decoration price, wedding mandap designs",
  },
  Entrance: {
    title: "Stunning Wedding Entrance Decorations | Wedsy",
    description:
      "Make a grand entrance with our exquisite wedding entrance decorations. Custom designs to match your wedding theme.",
    keywords: "wedding entrance decoration, marriage entrance designs",
  },
  default: {
    title: "Premium {category} Decorations | Wedsy",
    description:
      "Browse our exquisite collection of {category} decorations for weddings and events. Custom designs at competitive prices.",
    keywords: "wedding {category} decoration, {category} designs",
  },
};

function DecorListing({
  initialData,
  categoryList,
  totalPages: initialTotalPages,
}) {
  const router = useRouter();
  const { category, page: queryPage } = router.query;

  const [list, setList] = useState(initialData || []);
  const [loading, setLoading] = useState(false);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(initialTotalPages);

  const [filters, setFilters] = useState({
    category: category || "Stage",
    sort: "Sort",
    occasion: [],
    colours: [],
    type: [],
    priceRange: [0, 115000],
  });

  const [showFilterModal, setShowFilterModal] = useState(false);
  const [selectedSection, setSelectedSection] = useState("occasion");
  const [tempFilters, setTempFilters] = useState({
    occasion: [],
    colours: [],
    type: [],
    priceRange: [0, 115000],
  });
  const filterDropdownRef = useRef(null);
  const filterButtonRef = useRef(null);
  const filterDropdownContentRef = useRef(null);

  const occasionList = [
    "Reception",
    "Engagement",
    "Sangeet",
    "Wedding",
    "Haldi",
    "Mehendi",
    "Muhurtham",
  ];

  const coloursList = [
    { name: "Black", color: "#000000" },
    { name: "Silver", color: "#C0C0C0" },
    { name: "Gray", color: "#808080" },
    { name: "White", color: "#FFFFFF" },
    { name: "Maroon", color: "#800000" },
    { name: "Red", color: "#FF0000" },
    { name: "Purple", color: "#800080" },
    { name: "Green", color: "#008000" },
    { name: "Lime", color: "#00FF00" },
    { name: "Olive", color: "#808000" },
    { name: "Yellow", color: "#FFFF00" },
    { name: "Navy", color: "#000080" },
    { name: "Blue", color: "#0000FF" },
    { name: "Peach", color: "#FFC0CB" },
  ];

  const typeList = ["Modern", "Traditional"];

  // Helper functions to check if filters/sort are active
  const hasActiveFilters = () => {
    return (
      filters.occasion.length > 0 ||
      filters.colours.length > 0 ||
      filters.type.length > 0 ||
      filters.priceRange[0] !== 0 ||
      filters.priceRange[1] !== 115000
    );
  };

  const hasActiveSort = () => {
    return filters.sort && filters.sort !== "Sort";
  };

  // Generate dynamic SEO content
  const currentCategory = filters.category || "Stage";
  const seoConfig =
    CATEGORY_SEO_MAP[currentCategory] || CATEGORY_SEO_MAP.default;
  const seoTitle = seoConfig.title.replace(/{category}/g, currentCategory);
  const seoDescription = seoConfig.description.replace(
    /{category}/g,
    currentCategory.toLowerCase()
  );
  const seoKeywords = seoConfig.keywords.replace(
    /{category}/g,
    currentCategory.toLowerCase()
  );


  useEffect(() => {
    const fetchList = async (currentPage) => {
      setLoading(true);
      const params = new URLSearchParams({
        page: currentPage.toString(),
        limit: "14",
        displayVisible: "true",
        displayAvailable: "true",
      });

      if (filters.category) params.append("category", filters.category);
      if (
        filters.sort &&
        filters.sort !== "Sort" &&
        filters.sort !== "New-Arrivals"
      ) {
        params.append("sort", filters.sort);
      }
      if (filters.occasion.length > 0) {
        params.append("occassion", filters.occasion.join("|"));
      }
      if (filters.colours.length > 0) {
        params.append("color", filters.colours.join("|"));
      }
      if (filters.type.length === 1) {
        // Backend accepts single style value
        params.append("style", filters.type[0]);
      }
      if (filters.priceRange && (filters.priceRange[0] !== 0 || filters.priceRange[1] !== 115000)) {
        params.append("priceLower", filters.priceRange[0].toString());
        params.append("priceHigher", filters.priceRange[1].toString());
      }

      try {
        const response = await fetch(
          `${process.env.NEXT_PUBLIC_API_URL}/decor?${params.toString()}`
        );
        const data = await response.json();

        let sortedList = data.list || [];
        if (filters.sort === "New-Arrivals") {
          sortedList = [...sortedList].sort(
            (a, b) => new Date(b.createdAt) - new Date(a.createdAt)
          );
        }

        setList(sortedList);
        setTotalPages(data.totalPages || 1);
      } catch (error) {
        console.error("Error fetching products:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchList(page);
  }, [page, filters]);

  useEffect(() => {
    setFilters((prev) => ({ ...prev, category: category || "Stage" }));
    setPage(parseInt(queryPage) || 1);
  }, [category, queryPage]);

  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }, [page]);

  useEffect(() => {
    if (showFilterModal) {
      setTempFilters({
        occasion: [...filters.occasion],
        colours: [...filters.colours],
        type: [...filters.type],
        priceRange: [...filters.priceRange],
      });
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [showFilterModal]);

  useEffect(() => {
    if (!showFilterModal) return;

    const handleClickOutside = (event) => {
      const isClickOnButton = filterButtonRef.current && filterButtonRef.current.contains(event.target);
      const isClickOnDropdown = filterDropdownContentRef.current && filterDropdownContentRef.current.contains(event.target);
      
      if (!isClickOnButton && !isClickOnDropdown) {
        setShowFilterModal(false);
      }
    };

    // Add a delay to allow the button click to complete first
    const timeoutId = setTimeout(() => {
      document.addEventListener("click", handleClickOutside);
    }, 200);

    return () => {
      clearTimeout(timeoutId);
      document.removeEventListener("click", handleClickOutside);
    };
  }, [showFilterModal]);

  const handleCategoryChange = (categoryName) => {
    router.push(`/decor/view?category=${categoryName}`);
  };

  const handleFilterChange = (filterType, value) => {
    setFilters((prev) => ({
      ...prev,
      [filterType]: prev[filterType].includes(value)
        ? prev[filterType].filter((item) => item !== value)
        : [...prev[filterType], value],
    }));
  };

  const handleSortChange = (sortValue) => {
    setFilters((prev) => ({ ...prev, sort: sortValue }));
  };

  const handlePriceRangeChange = (newRange) => {
    setFilters((prev) => ({ ...prev, priceRange: newRange }));
  };

  const handleTempFilterChange = (filterType, value) => {
    setTempFilters((prev) => ({
      ...prev,
      [filterType]: prev[filterType].includes(value)
        ? prev[filterType].filter((item) => item !== value)
        : [...prev[filterType], value],
    }));
  };

  const handleTempPriceRangeChange = (newRange) => {
    setTempFilters((prev) => ({ ...prev, priceRange: newRange }));
  };

  const handleApplyFilters = () => {
    setFilters((prev) => ({
      ...prev,
      occasion: [...tempFilters.occasion],
      colours: [...tempFilters.colours],
      type: [...tempFilters.type],
      priceRange: [...tempFilters.priceRange],
    }));
    setShowFilterModal(false);
  };

  const handleResetFilters = () => {
    const resetFilters = {
      occasion: [],
      colours: [],
      type: [],
      priceRange: [0, 115000],
    };
    setTempFilters(resetFilters);
    setFilters((prev) => ({ ...prev, ...resetFilters }));
  };

  const dynamicHeading = filters.category ? `${filters.category}` : "All Decor";

  const gridClasses = [
    "md:col-span-2 md:row-span-2",
    "md:col-span-4 md:row-span-2 md:col-start-3",
    "md:col-span-2 md:row-span-2 md:col-start-7",
    "md:col-span-2 md:row-span-2 md:row-start-3",
    "md:col-span-3 md:row-span-2 md:col-start-3 md:row-start-3",
    "md:col-span-3 md:row-span-2 md:col-start-6 md:row-start-3",
    "md:col-span-4 md:row-span-3 md:row-start-5",
    "md:col-span-4 md:row-span-3 md:col-start-5 md:row-start-5",
    "md:col-span-4 md:row-span-2 md:row-start-8",
    "md:col-span-4 md:row-span-2 md:col-start-5 md:row-start-8",
    "md:col-span-3 md:row-span-2 md:row-start-10",
    "md:col-span-4 md:row-span-2 md:col-start-4 md:row-start-10",
    "md:col-span-4 md:row-span-2 md:row-start-12",
    "md:col-span-3 md:row-span-2 md:col-start-5 md:row-start-12",
  ];

  const renderPaginationNumbers = () => {
    const numbers = [];

    numbers.push(1);

    const rangeStart = Math.max(1, page - 1);
    const rangeEnd = Math.min(totalPages, page + 1);

    if (rangeStart > 2) {
      numbers.push("...");
    }

    for (let i = rangeStart; i <= rangeEnd; i++) {
      if (i !== 1) {
        numbers.push(i);
      }
    }

    if (rangeEnd < totalPages - 1) {
      numbers.push("...");
    }

    if (totalPages > 1 && rangeEnd < totalPages) {
      numbers.push(totalPages);
    }

    return numbers;
  };

  // Generate structured data for the first 5 items
  const structuredData = {
    "@context": "https://schema.org",
    "@type": "ItemList",
    itemListElement: list.slice(0, 5).map((item, index) => ({
      "@type": "ListItem",
      position: index + 1,
      item: {
        "@type": "Product",
        name: item.name,
        description: item.description || `${item.name} decoration for weddings`,
        image: item.images?.[0] || "",
        offers: {
          "@type": "Offer",
          price: item.price,
          priceCurrency: "INR",
        },
      },
    })),
  };


  return (
    <>
      <DecorDisclaimer />
      <Head>
        <title>{seoTitle}</title>
        <meta name="description" content={seoDescription} />
        <meta name="keywords" content={seoKeywords} />
        <meta name="robots" content="index, follow" />
        <meta name="copyright" content="Wedsy" />
        <meta name="language" content="EN" />

        <link
          rel="canonical"
          href={`https://www.wedsy.in/decor/view?category=${filters.category}${
            page > 1 ? `&page=${page}` : ""
          }`}
        />

        {/* Open Graph Tags */}
        <meta property="og:title" content={seoTitle} />
        <meta property="og:description" content={seoDescription} />
        <meta property="og:image" content="https://www.wedsy.in/logo-black.webp" />
        <meta
          property="og:url"
          content={`https://www.wedsy.in/decor/view?category=${filters.category || ""}`}
        />
        <meta property="og:type" content="website" />
        <meta property="og:site_name" content="Wedsy" />

        {/* Twitter Card Tags */}
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:title" content={seoTitle} />
        <meta name="twitter:description" content={seoDescription} />
        <meta name="twitter:image" content="https://www.wedsy.in/logo-black.webp" />

        {/* Breadcrumb Schema */}
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              "@context": "https://schema.org",
              "@type": "BreadcrumbList",
              "itemListElement": [
                {
                  "@type": "ListItem",
                  "position": 1,
                  "name": "Home",
                  "item": "https://www.wedsy.in"
                },
                {
                  "@type": "ListItem",
                  "position": 2,
                  "name": "Decor",
                  "item": "https://www.wedsy.in/decor"
                },
                {
                  "@type": "ListItem",
                  "position": 3,
                  "name": filters.category || "All Categories",
                  "item": `https://www.wedsy.in/decor/view?category=${filters.category || ""}`
                }
              ]
            })
          }}
        />

        {/* ItemList Schema */}
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(structuredData) }}
        />
      </Head>

      <div className="bg-[#F4F4F4]">
        <main className="p-4 md:p-8 max-w-screen-xl mx-auto">
          <div className="flex flex-col md:flex-row md:justify-between md:items-center mb-6 gap-4">
            <div className="flex py-3 flex-nowrap justify-start gap-2 overflow-x-auto max-w-full scrollbar-hide md:flex-1 md:pr-4">
              {categoryList.map((cat) => (
                <button
                  key={cat.name}
                  onClick={() => handleCategoryChange(cat.name)}
                  className={`py-2 px-5 rounded-full text-sm font-semibold transition-colors shadow-md whitespace-nowrap flex-shrink-0 ${
                    filters.category === cat.name
                      ? "bg-[#840032] text-white"
                      : "bg-white text-black hover:bg-gray-100"
                  }`}
                >
                  {cat.name}
                </button>
              ))}
            </div>

            <div className="flex flex-col sm:flex-row sm:justify-end items-stretch sm:items-center gap-2 sm:gap-0 md:w-auto">
              <div className="flex w-full sm:w-auto bg-white rounded-md border divide-x relative">
                <div className="flex-1">
                  <Dropdown
                    inline
                    arrowIcon={false}
                    label={
                      <div className="ml-10 md:ml-0 px-4 py-2 flex items-center justify-center text-center gap-2 flex-1 min-h-[44px] relative">
                        <img
                          src="/assets/new_icons/sort.svg"
                          alt="sort"
                          className="h-4 w-4"
                        />
                        <span className="text-sm font-medium">Sort</span>
                        {hasActiveSort() && (
                          <Circle className="absolute top-1 right-1 h-2 w-2 fill-black text-black" />
                        )}
                      </div>
                    }
                  >
                    <Dropdown.Item
                      onClick={() => handleSortChange("Price:Low-to-High")}
                      className="flex items-center justify-between"
                    >
                      <span>Price: Low to High</span>
                      {filters.sort === "Price:Low-to-High" && (
                        <Circle className="h-2 w-2 fill-black text-black ml-2" />
                      )}
                    </Dropdown.Item>
                    <Dropdown.Item
                      onClick={() => handleSortChange("Price:High-to-Low")}
                      className="flex items-center justify-between"
                    >
                      <span>Price: High to Low</span>
                      {filters.sort === "Price:High-to-Low" && (
                        <Circle className="h-2 w-2 fill-black text-black ml-2" />
                      )}
                    </Dropdown.Item>
                    <Dropdown.Item
                      onClick={() => handleSortChange("New-Arrivals")}
                      className="flex items-center justify-between"
                    >
                      <span>New Arrivals</span>
                      {filters.sort === "New-Arrivals" && (
                        <Circle className="h-2 w-2 fill-black text-black ml-2" />
                      )}
                    </Dropdown.Item>
                    <Dropdown.Item 
                      onClick={() => handleSortChange("Sort")}
                      className="flex items-center justify-between"
                    >
                      <span>Default</span>
                      {filters.sort === "Sort" && (
                        <Circle className="h-2 w-2 fill-black text-black ml-2" />
                      )}
                    </Dropdown.Item>
                  </Dropdown>
                </div>

                <div className="flex-1 relative" ref={filterDropdownRef}>
                  <button
                    ref={filterButtonRef}
                    onClick={() => {
                      setSelectedSection("occasion");
                      setShowFilterModal((prev) => !prev);
                    }}
                    className="ml-10 md:ml-0 px-4 py-2 flex items-center justify-center text-center gap-2 flex-1 min-h-[44px] w-full relative"
                  >
                    <img
                      src="/assets/new_icons/filter.svg"
                      alt="filter"
                      className="h-4 w-4"
                    />
                    <span className="text-sm font-medium">Filter</span>
                    {hasActiveFilters() && (
                      <Circle className="absolute top-1 right-1 h-2 w-2 fill-black text-black" />
                    )}
                  </button>

                  {/* Filter Dropdown */}
                  {showFilterModal && (
                    <div 
                      ref={filterDropdownContentRef}
                      className="absolute top-full right-0 mt-1 bg-white rounded-lg shadow-xl border z-50 flex flex-col max-h-[450px] w-[90vw] sm:w-[600px]"
                    >
                      {/* Content Area */}
                      <div className="flex flex-row flex-1 overflow-hidden">
                        {/* Left Panel - Sections */}
                        <div className="w-1/3 border-r bg-gray-50">
                          <div className="p-4 space-y-1">
                            <button
                              onClick={() => setSelectedSection("occasion")}
                              className={`w-full text-left px-4 py-3 text-sm rounded transition-colors flex items-center justify-between ${
                                selectedSection === "occasion"
                                  ? "bg-white shadow-sm font-medium"
                                  : "hover:bg-gray-100"
                              }`}
                            >
                              <span>Occasion</span>
                              {tempFilters.occasion.length > 0 && (
                                <Check className="h-4 w-4 text-black" />
                              )}
                            </button>
                            <button
                              onClick={() => setSelectedSection("colours")}
                              className={`w-full text-left px-4 py-3 text-sm rounded transition-colors flex items-center justify-between ${
                                selectedSection === "colours"
                                  ? "bg-white shadow-sm font-medium"
                                  : "hover:bg-gray-100"
                              }`}
                            >
                              <span>Colours</span>
                              {tempFilters.colours.length > 0 && (
                                <Check className="h-4 w-4 text-black" />
                              )}
                            </button>
                            <button
                              onClick={() => setSelectedSection("type")}
                              className={`w-full text-left px-4 py-3 text-sm rounded transition-colors flex items-center justify-between ${
                                selectedSection === "type"
                                  ? "bg-white shadow-sm font-medium"
                                  : "hover:bg-gray-100"
                              }`}
                            >
                              <span>Type</span>
                              {tempFilters.type.length > 0 && (
                                <Check className="h-4 w-4 text-black" />
                              )}
                            </button>
                            <button
                              onClick={() => setSelectedSection("price-range")}
                              className={`w-full text-left px-4 py-3 text-sm rounded transition-colors flex items-center justify-between ${
                                selectedSection === "price-range"
                                  ? "bg-white shadow-sm font-medium"
                                  : "hover:bg-gray-100"
                              }`}
                            >
                              <span>Price range</span>
                              {(tempFilters.priceRange[0] !== 0 || tempFilters.priceRange[1] !== 115000) && (
                                <Check className="h-4 w-4 text-black" />
                              )}
                            </button>
                          </div>
                        </div>

                        {/* Right Panel - Options */}
                        <div className="w-2/3 p-4 overflow-y-auto">
                          {selectedSection === "occasion" && (
                            <div className="space-y-2">
                              {occasionList.map((o) => (
                                <button
                                  key={o}
                                  onClick={() => handleTempFilterChange("occasion", o)}
                                  className={`w-full text-left px-4 py-3 text-sm rounded transition-colors ${
                                    tempFilters.occasion.includes(o)
                                      ? "bg-gray-100 font-medium"
                                      : "hover:bg-gray-50"
                                  }`}
                                >
                                  <div className="flex items-center gap-2">
                                    <input
                                      type="checkbox"
                                      checked={tempFilters.occasion.includes(o)}
                                      onChange={() => handleTempFilterChange("occasion", o)}
                                      className="w-4 h-4"
                                    />
                                    <span>{o}</span>
                                  </div>
                                </button>
                              ))}
                            </div>
                          )}

                          {selectedSection === "colours" && (
                            <div className="space-y-2">
                              {coloursList.map((colour) => (
                                <button
                                  key={colour.name}
                                  onClick={() => handleTempFilterChange("colours", colour.name)}
                                  className={`w-full text-left px-4 py-3 text-sm rounded transition-colors ${
                                    tempFilters.colours.includes(colour.name)
                                      ? "bg-gray-100 font-medium"
                                      : "hover:bg-gray-50"
                                  }`}
                                >
                                  <div className="flex items-center justify-between w-full">
                                    <div className="flex items-center gap-3">
                                      <input
                                        type="checkbox"
                                        checked={tempFilters.colours.includes(colour.name)}
                                        onChange={() =>
                                          handleTempFilterChange("colours", colour.name)
                                        }
                                        className="w-4 h-4"
                                      />
                                      <div
                                        className="w-4 h-4 rounded-full border border-gray-300"
                                        style={{ backgroundColor: colour.color }}
                                      />
                                      <span>{colour.name}</span>
                                    </div>
                                    {tempFilters.colours.includes(colour.name) && (
                                      <Circle className="h-2 w-2 fill-black text-black" />
                                    )}
                                  </div>
                                </button>
                              ))}
                            </div>
                          )}

                          {selectedSection === "type" && (
                            <div className="space-y-2">
                              {typeList.map((type) => (
                                <button
                                  key={type}
                                  onClick={() => handleTempFilterChange("type", type)}
                                  className={`w-full text-left px-4 py-3 text-sm rounded transition-colors ${
                                    tempFilters.type.includes(type)
                                      ? "bg-gray-100 font-medium"
                                      : "hover:bg-gray-50"
                                  }`}
                                >
                                  <div className="flex items-center justify-between w-full">
                                    <div className="flex items-center gap-2">
                                      <input
                                        type="checkbox"
                                        checked={tempFilters.type.includes(type)}
                                        onChange={() => handleTempFilterChange("type", type)}
                                        className="w-4 h-4"
                                      />
                                      <span>{type}</span>
                                    </div>
                                    {tempFilters.type.includes(type) && (
                                      <Circle className="h-2 w-2 fill-black text-black" />
                                    )}
                                  </div>
                                </button>
                              ))}
                            </div>
                          )}

                          {selectedSection === "price-range" && (
                            <div className="space-y-6">
                              {/* Min Price Slider */}
                              <div>
                                <label className="text-sm font-medium text-gray-700">
                                  Minimum Price
                                </label>
                                <input
                                  type="range"
                                  min={0}
                                  max={115000}
                                  step={1000}
                                  value={tempFilters.priceRange[0]}
                                  onChange={(e) => {
                                    const min = Math.min(
                                      Number(e.target.value),
                                      tempFilters.priceRange[1] - 1000
                                    );
                                    handleTempPriceRangeChange([min, tempFilters.priceRange[1]]);
                                  }}
                                  className="w-full"
                                />
                              </div>

                              {/* Max Price Slider */}
                              <div>
                                <label className="text-sm font-medium text-gray-700">
                                  Maximum Price
                                </label>
                                <input
                                  type="range"
                                  min={0}
                                  max={315000}
                                  step={1000}
                                  value={tempFilters.priceRange[1]}
                                  onChange={(e) => {
                                    const max = Math.max(
                                      Number(e.target.value),
                                      tempFilters.priceRange[0] + 1000
                                    );
                                    handleTempPriceRangeChange([tempFilters.priceRange[0], max]);
                                  }}
                                  className="w-full"
                                />
                              </div>

                              {/* Display Selected Range */}
                              <div className="text-sm text-center font-medium text-gray-700">
                                ₹{tempFilters.priceRange[0].toLocaleString()} – ₹
                                {tempFilters.priceRange[1].toLocaleString()}
                              </div>
                            </div>
                          )}
                          
                        </div>
                      </div>

                      {/* Bottom Buttons */}
                      <div className="flex border-t p-4 gap-3">
                        <button
                          onClick={handleResetFilters}
                          className="flex-1 px-4 py-2 text-sm border border-gray-300 rounded font-medium hover:bg-gray-50 transition-colors"
                        >
                          Reset
                        </button>
                        <button
                          onClick={handleApplyFilters}
                          className="flex-1 px-4 py-2 text-sm bg-black text-white rounded font-medium hover:bg-gray-800 transition-colors"
                        >
                          Apply
                        </button>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>

          <h1 className="text-xl sm:text-3xl font-semibold text-center mb-6 sm:mb-10 uppercase tracking-widest">
            {dynamicHeading}
          </h1>

          {loading ? (
            <SpecificCategorySkeleton />
          ) : list.length > 0 ? (
            <>
              {/* Mobile Grid */}
              <div className="block md:hidden">
                <Masonry
                  breakpointCols={2}
                  className="my-masonry-grid"
                  columnClassName="my-masonry-grid_column"
                >
                  {list.map((item, index) => (
                    <div key={item._id}>
                      <DecorCard
                        decor={item}
                        size={
                          index % 4 === 0 || index % 4 === 3
                            ? "small"
                            : "normal"
                        }
                      />
                    </div>
                  ))}
                </Masonry>
              </div>

              <div className="hidden md:grid grid-cols-2 sm:grid-cols-3 md:grid-cols-8 md:grid-rows-13 gap-2 md:gap-4 min-h-[1600px]">
                {list.map((item, index) => (
                  <div
                    key={item._id}
                    className={
                      gridClasses[index] ||
                      "col-span-1 sm:col-span-1 md:col-span-3 md:row-span-2"
                    }
                  >
                    <DecorCard decor={item} />
                  </div>
                ))}
              </div>

              <div className="flex flex-col items-center mt-12 gap-4">
                <button
                  onClick={() => setPage((p) => p + 1)}
                  disabled={page >= totalPages}
                  className="px-6 py-2 bg-white rounded-full text-sm font-medium disabled:opacity-50 transition-colors shadow-md hover:bg-gray-100 flex items-center gap-2"
                >
                  Next page &rarr;
                </button>
                <div className="flex flex-wrap justify-center items-center gap-2">
                  {totalPages <= 1 ? (
                    <button className="flex justify-center items-center h-10 w-10 border rounded-full bg-rose-900 text-white border-rose-900">
                      1
                    </button>
                  ) : totalPages <= 3 ? (
                    Array.from({ length: totalPages }, (_, i) => i + 1).map(
                      (pageNum) => (
                        <button
                          key={pageNum}
                          onClick={() => setPage(pageNum)}
                          className={`flex justify-center items-center h-10 w-10 border rounded-full transition-colors ${
                            page === pageNum
                              ? "bg-rose-900 text-white border-rose-900"
                              : "bg-white hover:bg-gray-100"
                          }`}
                        >
                          {pageNum}
                        </button>
                      )
                    )
                  ) : (
                    renderPaginationNumbers().map((pageNum, index) =>
                      pageNum === "..." ? (
                        <span
                          key={`dots-${index}`}
                          className="px-2 py-2 text-gray-500"
                        >
                          ...
                        </span>
                      ) : (
                        <button
                          key={pageNum}
                          onClick={() => setPage(pageNum)}
                          className={`flex justify-center items-center h-10 w-10 border rounded-full transition-colors ${
                            page === pageNum
                              ? "bg-rose-900 text-white border-rose-900"
                              : "bg-white hover:bg-gray-100"
                          }`}
                        >
                          {pageNum}
                        </button>
                      )
                    )
                  )}
                </div>
                <button
                  onClick={() => setPage((p) => p - 1)}
                  disabled={page <= 1}
                  className="px-6 py-2 bg-white rounded-full text-sm font-medium disabled:opacity-50 transition-colors shadow-md hover:bg-gray-100 flex items-center gap-2"
                >
                  &larr; Previous page
                </button>
              </div>
            </>
          ) : (
            <div className="text-center py-16">
              <h2 className="text-2xl font-semibold">No Products Found</h2>
              <p className="text-gray-600 mt-2">Try adjusting your filters.</p>
            </div>
          )}
        </main>
      </div>
    </>
  );
}

export async function getServerSideProps(context) {
  try {
    const { query } = context;
    const currentPage = query.page || "1";
    const params = new URLSearchParams({
      page: currentPage,
      limit: "14",
      displayVisible: "true",
      displayAvailable: "true",
    });
    const categoryToFetch = query.category || "Stage";
    params.append("category", categoryToFetch);
    const decorResponse = await fetch(
      `${process.env.NEXT_PUBLIC_API_URL}/decor?${params.toString()}`
    );
    const decorData = await decorResponse.json();
    const categoryResponse = await fetch(
      `${process.env.NEXT_PUBLIC_API_URL}/category`
    );
    const categoryList = await categoryResponse.json();
    return {
      props: {
        initialData: decorData.list || [],
        categoryList: categoryList || [],
        totalPages: decorData.totalPages || 1,
      },
    };
  } catch (error) {
    console.error("Error fetching initial data:", error);
    return {
      props: { initialData: [], categoryList: [], totalPages: 1 },
    };
  }
}

export default DecorListing;
