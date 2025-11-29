import { useState, useEffect } from "react";
import { useRouter } from "next/router";
import Head from "next/head";
import { Checkbox, Label, Dropdown } from "flowbite-react";
import { MdSort, MdTune } from "react-icons/md";
import DecorCard from "@/components/cards/DecorCard";
import DecorDisclaimer from "@/components/marquee/DecorDisclaimer";
import Masonry from "react-masonry-css";
import { SpecificCategorySkeleton } from "@/components/skeletons/wedding-store/specific-category";
import SortFilterButton from "@/components/SortFilterButton";

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
  const [showingRandomProducts, setShowingRandomProducts] = useState(false);

  const [filters, setFilters] = useState({
    category: category || "Stage",
    sort: "Sort",
    occasion: [],
    colours: [], // Multi-select: Previous filter category
    type: [], // Multi-select: 'Modern', 'Traditional'
    size: [], // Multi-select: 'Small', 'Medium', 'Large' (category-specific)
    style: [], // Multi-select: 'Single', 'Running' (only for Pathway)
    priceRange: [0, 115000],
  });

  const [showFilterSort, setShowFilterSort] = useState(false);
  const [activeTab, setActiveTab] = useState("sort"); // "sort" or "filter"
  const [selectedSection, setSelectedSection] = useState(null);
  
  // Temporary state for pending filter/sort changes (only applied on Apply button click)
  const [tempFilters, setTempFilters] = useState(filters);

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

  // Helper function to get category-specific filter configuration
  const getCategoryFilters = (cat) => {
    // Map "Stage" to "Backdrop" for filtering purposes
    const normalizedCat = cat === "Stage" ? "Backdrop" : cat;
    const categoryMap = {
      Backdrop: {
        occasion: true,
        colours: true, // Keep previous filter
        type: true,
        size: true,
        style: false,
      },
      Mandap: {
        occasion: true,
        colours: true, // Keep previous filter
        type: true,
        size: true,
        style: false,
      },
      Photobooth: {
        occasion: true,
        colours: true, // Keep previous filter
        type: true,
        size: false,
        style: false,
      },
      Entrance: {
        occasion: true,
        colours: true, // Keep previous filter
        type: true,
        size: true,
        style: false,
      },
      Pathway: {
        occasion: true,
        colours: true, // Keep previous filter
        type: true,
        size: false,
        style: true,
      },
      Nameboard: {
        occasion: true,
        colours: true, // Keep previous filter
        type: true,
        size: true,
        style: false,
      },
    };
    return categoryMap[normalizedCat] || {
      occasion: true,
      colours: true, // Keep previous filter
      type: true,
      size: false,
      style: false,
    };
  };

  // Helper function to get size options based on category
  const getSizeOptions = (cat) => {
    // Map "Stage" to "Backdrop" for filtering purposes
    const normalizedCat = cat === "Stage" ? "Backdrop" : cat;
    if (normalizedCat === "Backdrop") {
      return ["Small", "Medium", "Large"];
    } else if (normalizedCat === "Mandap" || normalizedCat === "Entrance" || normalizedCat === "Nameboard") {
      return ["Medium", "Large"];
    }
    return [];
  };

  // Helper function to map product length to size category (for Backdrop)
  const getProductSize = (product) => {
    const length = product.length || product.productInfo?.length || 0;
    if (length <= 16) return "Small";
    if (length <= 30) return "Medium";
    return "Large";
  };

  // Helper function to map product quantity_unit to style (for Pathway)
  const getProductStyle = (product) => {
    const unit = product.unit || product.quantity_unit || "";
    if (unit.toLowerCase() === "pc" || unit.toLowerCase() === "piece") {
      return "Single";
    }
    if (unit.toLowerCase() === "ft" || unit.toLowerCase() === "meter" || unit.toLowerCase().includes("running")) {
      return "Running";
    }
    return null;
  };

  // Helper function to get product type (Modern/Traditional)
  // This would need to be based on your actual data structure
  // For now, we'll check if product has a type field or use a default
  const getProductType = (product) => {
    return product.type || product.style || "Modern"; // Default to Modern if not specified
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
      if (filters.occasion.length > 0) {
        params.append("occassion", filters.occasion.join("|"));
      }

      try {
        const response = await fetch(
          `${process.env.NEXT_PUBLIC_API_URL}/decor?${params.toString()}`
        );
        const data = await response.json();

        let filteredList = data.list || [];

        // Apply client-side filtering
        filteredList = filteredList.filter((product) => {
          // Filter by occasion
          if (filters.occasion.length > 0) {
            const productOccasions = product.occasions || product.occasion || [];
            const hasMatchingOccasion = filters.occasion.some((occ) =>
              Array.isArray(productOccasions)
                ? productOccasions.includes(occ)
                : productOccasions === occ
            );
            if (!hasMatchingOccasion) return false;
          }

          // Filter by colours (previous filter category)
          if (filters.colours.length > 0) {
            const productColours = product.colours || product.colors || product.color || [];
            const hasMatchingColour = filters.colours.some((colour) =>
              Array.isArray(productColours)
                ? productColours.some((pc) => 
                    typeof pc === "string" ? pc.toLowerCase() === colour.toLowerCase() : pc.name?.toLowerCase() === colour.toLowerCase()
                  )
                : (typeof productColours === "string" ? productColours.toLowerCase() === colour.toLowerCase() : productColours.name?.toLowerCase() === colour.toLowerCase())
            );
            if (!hasMatchingColour) return false;
          }

          // Filter by type (Modern/Traditional)
          if (filters.type.length > 0) {
            const productType = getProductType(product);
            if (!filters.type.includes(productType)) return false;
          }

          // Filter by size (category-specific)
          const normalizedCategory = currentCategory === "Stage" ? "Backdrop" : currentCategory;
          if (filters.size.length > 0 && normalizedCategory === "Backdrop") {
            const productSize = getProductSize(product);
            if (!filters.size.includes(productSize)) return false;
          } else if (filters.size.length > 0 && ["Mandap", "Entrance", "Nameboard"].includes(normalizedCategory)) {
            // For Mandap, Entrance, and Nameboard, we need to determine size based on product dimensions
            // This is a placeholder - you may need to adjust based on your actual product data structure
            // For now, we'll check if product has size field or derive from dimensions
            const productSize = product.size || 
                               (product.length > 20 ? "Large" : "Medium") || 
                               "Medium";
            if (!filters.size.includes(productSize)) return false;
          }

          // Filter by style (Pathway only)
          if (filters.style.length > 0 && normalizedCategory === "Pathway") {
            const productStyle = getProductStyle(product);
            if (!productStyle || !filters.style.includes(productStyle)) return false;
          }

          // Filter by price range
          const minPrice = product.productTypes?.reduce((min, pt) => 
            Math.min(min, pt.sellingPrice || 0), 
            product.productTypes[0]?.sellingPrice || 0
          ) || 0;
          if (minPrice < filters.priceRange[0] || minPrice > filters.priceRange[1]) {
            return false;
          }

          return true;
        });

        // Apply sorting
        let sortedList = [...filteredList];
        if (filters.sort === "Newest to Oldest") {
          sortedList.sort((a, b) => {
            const dateA = new Date(a.createdAt || a.date_added || 0);
            const dateB = new Date(b.createdAt || b.date_added || 0);
            return dateB - dateA;
          });
        } else if (filters.sort === "Oldest to Newest") {
          sortedList.sort((a, b) => {
            const dateA = new Date(a.createdAt || a.date_added || 0);
            const dateB = new Date(b.createdAt || b.date_added || 0);
            return dateA - dateB;
          });
        } else if (filters.sort === "Price: Low to High") {
          sortedList.sort((a, b) => {
            const priceA = a.productTypes?.reduce((min, pt) => 
              Math.min(min, pt.sellingPrice || 0), 
              a.productTypes[0]?.sellingPrice || 0
            ) || 0;
            const priceB = b.productTypes?.reduce((min, pt) => 
              Math.min(min, pt.sellingPrice || 0), 
              b.productTypes[0]?.sellingPrice || 0
            ) || 0;
            return priceA - priceB;
          });
        } else if (filters.sort === "Price: High to Low") {
          sortedList.sort((a, b) => {
            const priceA = a.productTypes?.reduce((min, pt) => 
              Math.min(min, pt.sellingPrice || 0), 
              a.productTypes[0]?.sellingPrice || 0
            ) || 0;
            const priceB = b.productTypes?.reduce((min, pt) => 
              Math.min(min, pt.sellingPrice || 0), 
              b.productTypes[0]?.sellingPrice || 0
            ) || 0;
            return priceB - priceA;
          });
        }

        // If no products found after filtering, fetch random products
        if (sortedList.length === 0 && currentPage === 1) {
          setShowingRandomProducts(true);
          try {
            const randomParams = new URLSearchParams({
              page: "1",
              limit: "14",
              displayVisible: "true",
              displayAvailable: "true",
            });
            const randomResponse = await fetch(
              `${process.env.NEXT_PUBLIC_API_URL}/decor?${randomParams.toString()}`
            );
            const randomData = await randomResponse.json();
            const allProducts = randomData.list || [];
            // Shuffle and take 14 random products
            const shuffled = [...allProducts].sort(() => 0.5 - Math.random());
            sortedList = shuffled.slice(0, 14);
          } catch (error) {
            console.error("Error fetching random products:", error);
            setShowingRandomProducts(false);
          }
        } else {
          setShowingRandomProducts(false);
        }

        setList(sortedList);
        setTotalPages(Math.ceil(sortedList.length / 14) || 1);
      } catch (error) {
        console.error("Error fetching products:", error);
        setShowingRandomProducts(false);
      } finally {
        setLoading(false);
      }
    };
    fetchList(page);
  }, [page, filters, currentCategory]);

  useEffect(() => {
    setFilters((prev) => ({ 
      ...prev, 
      category: category || "Stage",
      // Reset filters that don't apply to new category
      size: [],
      style: [],
    }));
    setPage(parseInt(queryPage) || 1);
  }, [category, queryPage]);

  const handleCategoryChange = (categoryName) => {
    router.push(`/decor/view?category=${categoryName}`);
  };

  const handleFilterChange = (filterType, value) => {
    setTempFilters((prev) => ({
      ...prev,
      [filterType]: prev[filterType].includes(value)
        ? prev[filterType].filter((item) => item !== value)
        : [...prev[filterType], value],
    }));
  };

  const handleSortChange = (sortValue) => {
    setTempFilters((prev) => ({ ...prev, sort: sortValue }));
  };

  const handleTempPriceRangeChange = (newRange) => {
    setTempFilters((prev) => ({ ...prev, priceRange: newRange }));
  };

  // Initialize temp filters when modal opens
  useEffect(() => {
    if (showFilterSort) {
      setTempFilters({ ...filters });
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [showFilterSort]);

  // Lock body scroll when filter/sort modal is open
  useEffect(() => {
    if (showFilterSort) {
      // Save current scroll position
      const scrollY = window.scrollY;
      document.body.style.position = 'fixed';
      document.body.style.top = `-${scrollY}px`;
      document.body.style.width = '100%';
      document.body.style.overflow = 'hidden';
      
      return () => {
        // Restore scroll position when modal closes
        document.body.style.position = '';
        document.body.style.top = '';
        document.body.style.width = '';
        document.body.style.overflow = '';
        window.scrollTo(0, scrollY);
      };
    }
  }, [showFilterSort]);

  // Apply filters/sort when Apply button is clicked
  const handleApplyFilters = () => {
    setFilters(tempFilters);
    setShowFilterSort(false);
  };

  // Reset filters (both temp and actual)
  const handleResetFilters = () => {
    const resetFilters = {
      category: filters.category, // Keep current category
      sort: "Sort",
      occasion: [],
      colours: [],
      type: [],
      size: [],
      style: [],
      priceRange: [0, 115000],
    };
    setTempFilters(resetFilters);
    setFilters(resetFilters);
    setSelectedSection(null);
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

  // const mobileGridClasses = [
  //   "min-h-[160px]",
  //   "row-span-2 min-h-[240px]",
  //   "row-span-2 min-h-[240px]",
  //   "col-start-2 row-start-3 min-h-[160px]",
  //   "row-start-4 min-h-[160px]",
  //   "row-span-2 row-start-4 min-h-[240px]",
  //   "row-span-2 row-start-5 min-h-[240px]",
  //   "col-start-2 row-start-6 min-h-[160px]",
  //   "row-start-7 min-h-[160px]",
  //   "row-span-2 row-start-7 min-h-[240px]",
  //   "row-span-2 row-start-8 min-h-[240px]",
  //   "col-start-2 row-start-9 min-h-[160px]",
  //   "col-span-2 row-span-2 row-start-10 min-h-[280px]",
  //   "",
  // ];

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
        <meta property="og:image" content="https://www.wedsy.in/logo-black.png" />
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
        <meta name="twitter:image" content="https://www.wedsy.in/logo-black.png" />

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

            <div className="flex justify-end">
              <SortFilterButton
                onSortClick={() => {
                  setActiveTab("sort");
                  setSelectedSection("sort-options");
                  setShowFilterSort(true);
                }}
                onFilterClick={() => {
                  setActiveTab("filter");
                  const categoryFilters = getCategoryFilters(currentCategory);
                  // Set first available filter section as selected
                  if (categoryFilters.occasion) {
                  setSelectedSection("occasion");
                  } else if (categoryFilters.colours) {
                    setSelectedSection("colours");
                  } else if (categoryFilters.type) {
                    setSelectedSection("type");
                  } else if (categoryFilters.size) {
                    setSelectedSection("size");
                  } else if (categoryFilters.style) {
                    setSelectedSection("style");
                  } else {
                    setSelectedSection("price-range");
                  }
                  setShowFilterSort(true);
                }}
              />
            </div>
          </div>

          <h1 className="text-xl sm:text-3xl font-semibold text-center mb-6 sm:mb-10 uppercase tracking-widest">
            {dynamicHeading}
          </h1>

          {/* Filter/Sort Modal */}
          {showFilterSort && (
            <div 
              className="fixed inset-0 bg-black bg-opacity-30 z-40"
              onClick={() => setShowFilterSort(false)}
            >
              <div className="absolute top-[180px] right-4 md:right-8 z-50">
                <div 
                  className="bg-white rounded-lg w-[420px] max-h-[500px] flex flex-col shadow-xl"
                  onClick={(e) => e.stopPropagation()}
                >
                  {/* Content Area */}
                  <div className="flex md:flex-row flex-col flex-1 overflow-hidden pt-2">
                    {/* Left Panel - Sections */}
                    <div className="md:w-1/2 w-full md:border-r border-b overflow-y-auto bg-gray-50">
                      <div className="p-3 space-y-1">
                        {activeTab === "filter" && (() => {
                          const categoryFilters = getCategoryFilters(currentCategory);
                          return (
                          <>
                              {categoryFilters.occasion && (
                            <button
                              onClick={() => setSelectedSection("occasion")}
                              className={`w-full text-left px-3 py-2 text-sm rounded ${
                                selectedSection === "occasion" ? "bg-white shadow-sm" : "hover:bg-gray-100"
                              }`}
                            >
                              Occasion
                            </button>
                              )}
                              {categoryFilters.colours && (
                            <button
                              onClick={() => setSelectedSection("colours")}
                              className={`w-full text-left px-3 py-2 text-sm rounded ${
                                selectedSection === "colours" ? "bg-white shadow-sm" : "hover:bg-gray-100"
                              }`}
                            >
                              Colours
                            </button>
                              )}
                              {categoryFilters.type && (
                            <button
                                  onClick={() => setSelectedSection("type")}
                              className={`w-full text-left px-3 py-2 text-sm rounded ${
                                    selectedSection === "type" ? "bg-white shadow-sm" : "hover:bg-gray-100"
                              }`}
                            >
                                  Type
                            </button>
                              )}
                              {categoryFilters.size && (
                            <button
                              onClick={() => setSelectedSection("size")}
                              className={`w-full text-left px-3 py-2 text-sm rounded ${
                                selectedSection === "size" ? "bg-white shadow-sm" : "hover:bg-gray-100"
                              }`}
                            >
                                  Size
                            </button>
                              )}
                              {categoryFilters.style && (
                                <button
                                  onClick={() => setSelectedSection("style")}
                                  className={`w-full text-left px-3 py-2 text-sm rounded ${
                                    selectedSection === "style" ? "bg-white shadow-sm" : "hover:bg-gray-100"
                                  }`}
                                >
                                  Style
                                </button>
                              )}
                            <button
                              onClick={() => setSelectedSection("price-range")}
                              className={`w-full text-left px-3 py-2 text-sm rounded ${
                                selectedSection === "price-range" ? "bg-white shadow-sm" : "hover:bg-gray-100"
                              }`}
                            >
                              Price Range
                            </button>
                          </>
                          );
                        })()}
                        {activeTab === "sort" && (
                          <button
                            onClick={() => setSelectedSection("sort-options")}
                            className={`w-full text-left px-3 py-2 text-sm rounded ${
                              selectedSection === "sort-options" ? "bg-white shadow-sm" : "hover:bg-gray-100"
                            }`}
                          >
                            Sort Options
                          </button>
                        )}
                      </div>
                    </div>

                    {/* Right Panel - Options */}
                    <div className="md:w-1/2 w-full p-3 overflow-y-auto">
                      {activeTab === "sort" && selectedSection === "sort-options" && (
                        <div className="space-y-1">
                          <button
                            onClick={() => {
                              handleSortChange("Newest to Oldest");
                            }}
                            className={`w-full text-left px-3 py-2 text-sm rounded ${
                              tempFilters.sort === "Newest to Oldest" ? "bg-gray-100 font-medium" : "hover:bg-gray-50"
                            }`}
                          >
                            Newest to Oldest
                          </button>
                          <button
                            onClick={() => {
                              handleSortChange("Oldest to Newest");
                            }}
                            className={`w-full text-left px-3 py-2 text-sm rounded ${
                              tempFilters.sort === "Oldest to Newest" ? "bg-gray-100 font-medium" : "hover:bg-gray-50"
                            }`}
                          >
                            Oldest to Newest
                          </button>
                          <button
                            onClick={() => {
                              handleSortChange("Price: Low to High");
                            }}
                            className={`w-full text-left px-3 py-2 text-sm rounded ${
                              tempFilters.sort === "Price: Low to High" ? "bg-gray-100 font-medium" : "hover:bg-gray-50"
                            }`}
                          >
                            Price: Low to High
                          </button>
                          <button
                            onClick={() => {
                              handleSortChange("Price: High to Low");
                            }}
                            className={`w-full text-left px-3 py-2 text-sm rounded ${
                              tempFilters.sort === "Price: High to Low" ? "bg-gray-100 font-medium" : "hover:bg-gray-50"
                            }`}
                          >
                            Price: High to Low
                          </button>
                        </div>
                      )}
                      
                      {activeTab === "filter" && selectedSection === "occasion" && (
                        <div className="space-y-1">
                          {occasionList.map((occasion) => (
                            <label key={occasion} className="flex items-center gap-2 px-3 py-2 text-sm rounded hover:bg-gray-50 cursor-pointer">
                              <input
                                type="checkbox"
                                checked={tempFilters.occasion.includes(occasion)}
                                onChange={(e) => {
                                  handleFilterChange("occasion", occasion);
                                }}
                                className="w-4 h-4 border-gray-300 rounded"
                              />
                              <span>{occasion}</span>
                            </label>
                          ))}
                        </div>
                      )}
                      
                      {activeTab === "filter" && selectedSection === "colours" && (
                        <div className="space-y-1">
                          {coloursList.map((colour) => (
                            <label key={colour.name} className="flex items-center gap-3 px-3 py-2 text-sm rounded hover:bg-gray-50 cursor-pointer">
                              <input
                                type="checkbox"
                                checked={tempFilters.colours.includes(colour.name)}
                                onChange={(e) => {
                                  handleFilterChange("colours", colour.name);
                                }}
                                className="w-4 h-4 border-gray-300 rounded"
                              />
                              <div 
                                className="w-4 h-4 rounded-full border border-gray-300"
                                style={{ backgroundColor: colour.color }}
                              />
                              <span>{colour.name}</span>
                            </label>
                          ))}
                        </div>
                      )}
                      
                      {activeTab === "filter" && selectedSection === "type" && (
                        <div className="space-y-1">
                          {["Modern", "Traditional"].map((type) => (
                            <label key={type} className="flex items-center gap-2 px-3 py-2 text-sm rounded hover:bg-gray-50 cursor-pointer">
                              <input
                                type="checkbox"
                                checked={tempFilters.type.includes(type)}
                                onChange={() => {
                                  handleFilterChange("type", type);
                                }}
                                className="w-4 h-4 border-gray-300 rounded"
                              />
                              <span>{type}</span>
                            </label>
                          ))}
                              </div>
                      )}
                      
                      {activeTab === "filter" && selectedSection === "size" && (
                        <div className="space-y-1">
                          {getSizeOptions(currentCategory).map((size) => (
                            <label key={size} className="flex items-center gap-2 px-3 py-2 text-sm rounded hover:bg-gray-50 cursor-pointer">
                              <input
                                type="checkbox"
                                checked={tempFilters.size.includes(size)}
                                onChange={() => {
                                  handleFilterChange("size", size);
                                }}
                                className="w-4 h-4 border-gray-300 rounded"
                              />
                              <span>{size}</span>
                            </label>
                          ))}
                              </div>
                      )}
                      
                      {activeTab === "filter" && selectedSection === "style" && (
                        <div className="space-y-1">
                          {["Single", "Running"].map((style) => (
                            <label key={style} className="flex items-center gap-2 px-3 py-2 text-sm rounded hover:bg-gray-50 cursor-pointer">
                              <input
                                type="checkbox"
                                checked={tempFilters.style.includes(style)}
                                onChange={() => {
                                  handleFilterChange("style", style);
                                }}
                                className="w-4 h-4 border-gray-300 rounded"
                              />
                              <span>{style}</span>
                            </label>
                          ))}
                        </div>
                      )}
                      
                      {activeTab === "filter" && selectedSection === "price-range" && (
                        <div className="space-y-4 -m-3">
                          <label className="flex items-center gap-2 px-3 py-2 text-sm cursor-pointer">
                            <input
                              type="checkbox"
                              className="w-4 h-4 border-gray-300 rounded"
                            />
                            <span>Apply Price filter</span>
                          </label>
                          
                          {/* Range Slider */}
                          <style jsx>{`
                            input[type="range"]::-webkit-slider-thumb {
                              appearance: none;
                              height: 20px;
                              width: 20px;
                              border-radius: 50%;
                              background: #2563eb;
                              cursor: pointer;
                              border: 2px solid white;
                              box-shadow: 0 2px 4px rgba(0,0,0,0.2);
                              position: relative;
                            }
                            input[type="range"]::-webkit-slider-thumb::after {
                              content: '';
                              position: absolute;
                              top: 50%;
                              left: 50%;
                              transform: translate(-50%, -50%);
                              width: 8px;
                              height: 2px;
                              background: white;
                            }
                            input[type="range"]::-moz-range-thumb {
                              height: 20px;
                              width: 20px;
                              border-radius: 50%;
                              background: #2563eb;
                              cursor: pointer;
                              border: 2px solid white;
                              box-shadow: 0 2px 4px rgba(0,0,0,0.2);
                            }
                            input[type="range"]::-webkit-slider-track {
                              background: transparent;
                              height: 2px;
                            }
                            input[type="range"]::-moz-range-track {
                              background: transparent;
                              height: 2px;
                            }
                          `}</style>
                          <div className="px-3 py-4 pb-6">
                            <div className="relative max-w-xs mx-auto">
                              <div className="absolute h-0.5 w-full bg-gray-300 rounded-lg" />
                              <input
                                type="range"
                                min="0"
                                max="115000"
                                value={tempFilters.priceRange[0]}
                                onChange={(e) => {
                                  const newMin = Math.min(Number(e.target.value), tempFilters.priceRange[1]);
                                  handleTempPriceRangeChange([newMin, tempFilters.priceRange[1]]);
                                }}
                                className="absolute w-full h-0.5 rounded-lg appearance-none cursor-pointer"
                                style={{
                                  zIndex: 3,
                                  pointerEvents: tempFilters.priceRange[0] === tempFilters.priceRange[1] ? 'auto' : 'none'
                                }}
                              />
                              <input
                                type="range"
                                min="0"
                                max="115000"
                                value={tempFilters.priceRange[1]}
                                onChange={(e) => {
                                  const newMax = Math.max(Number(e.target.value), tempFilters.priceRange[0]);
                                  handleTempPriceRangeChange([tempFilters.priceRange[0], newMax]);
                                }}
                                className="absolute w-full h-0.5 rounded-lg appearance-none cursor-pointer"
                                style={{ zIndex: 3 }}
                              />
                              <div 
                                className="absolute h-0.5 bg-blue-600"
                                style={{
                                  left: `${(tempFilters.priceRange[0] / 115000) * 100}%`,
                                  width: `${((tempFilters.priceRange[1] - tempFilters.priceRange[0]) / 115000) * 100}%`,
                                  zIndex: 0
                                }}
                              />
                              {/* Static Min/Max Labels */}
                              <span className="absolute text-xs text-gray-600 -bottom-5 -left-2">0</span>
                              <span className="absolute text-xs text-gray-600 -bottom-5 -right-2">115000</span>
                            </div>
                          </div>
                        </div>
                      )}

                      {!selectedSection && (
                        <div className="text-gray-400 text-center py-8">
                          Select a section to see options
                        </div>
                      )}
                    </div>
                  </div>

                  {/* Bottom Buttons */}
                  <div className="flex border-t p-3 gap-3">
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
              </div>
            </div>
          )}

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
          ) : null}
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
