import DecorDisclaimer from "@/components/marquee/DecorDisclaimer";
import {
  Checkbox,
  Dropdown,
  Label,
  Modal,
  Select,
  TextInput
} from "flowbite-react";
import Head from "next/head";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import { AiFillHeart } from "react-icons/ai";

const CATEGORY_OPTIONS = [
  "Reception",
  "Haldi",
  "Mehendi",
  "Nikah",
  "Sangeet",
  "Muhurattam",
  "Add Ons",
];

const addOnsInitialValues = {
  open: false,
  eventId: "",
  eventDayId: "",
  package: "",
  price: 0,
  variant: "",
  decorItems: [
    {
      quantity: 1,
      unit: "",
      decor: "",
      platform: undefined,
      flooring: undefined,
      dimensions: { length: 0, breadth: 0, height: 0 },
      category: "",
      baseCost: 0,
    },
  ],
};

function buildQueryString(obj) {
  const params = new URLSearchParams();
  Object.entries(obj).forEach(([k, v]) => {
    if (v === undefined || v === null || v === "") return;
    params.set(k, String(v));
  });
  return params.toString();
}

function matchesOccasionFilter(pkg, category) {
  const cLower = String(category || "").toLowerCase().trim();
  if (!cLower) return true;
  const decor = Array.isArray(pkg?.decor) ? pkg.decor : [];
  return decor.some((d) => {
    const tags = Array.isArray(d?.tags) ? d.tags : [];
    const occ = Array.isArray(d?.productVariation?.occassion)
      ? d.productVariation.occassion
      : [];
    return (
      tags.map((t) => String(t).toLowerCase()).includes(cLower) ||
      occ.map((o) => String(o).toLowerCase()).includes(cLower)
    );
  });
}

function sortPackagesByNameNumber(list) {
  const getNum = (pkg) => {
    const m = String(pkg?.name || "").match(/(\d+)/);
    return m ? parseInt(m[1], 10) : Number.MAX_SAFE_INTEGER;
  };
  return [...list].sort((a, b) => getNum(a) - getNum(b));
}

function DecorListing({
  similarDecorPackages,
  decorPackage,
  packagesForTabs = [],
  category = "",
  firstPackageIdByCategory = {},
  userLoggedIn,
  setOpenLoginModal,
}) {
  const router = useRouter();
  const [similarIndex, setSimilarIndex] = useState([0, 1, 2]);
  const [isAddedToWishlist, setIsAddedToWishlist] = useState(false);
  const [eventList, setEventList] = useState([]);
  const [variant, setVariant] = useState(
    decorPackage.variant.artificialFlowers.sellingPrice > 0
      ? "artificialFlowers"
      : "naturalFlowers"
  );
  const [addOns, setAddOns] = useState(addOnsInitialValues);
  const { package_id } = router.query;
  const fetchEvents = () => {
    fetch(`${process.env.NEXT_PUBLIC_API_URL}/event`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        authorization: `Bearer ${localStorage.getItem("token")}`,
      },
    })
      .then((response) => (response.ok ? response.json() : null))
      .then((response) => {
        if (response) {
          setEventList(response);
        }
      })
      .catch((error) => {
        console.error("There was a problem with the fetch operation:", error);
      });
  };
  useEffect(() => {
    if (package_id && userLoggedIn) {
      fetchEvents();
      fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/user/is-added-to-wishlist?product=decorPackage&_id=${package_id}`,
        {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
            authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        }
      )
        .then((response) => (response.ok ? response.json() : null))
        .then((response) => {
          if (response) {
            setIsAddedToWishlist(response.wishlist);
          }
        })
        .catch((error) => {
          console.error("There was a problem with the fetch operation:", error);
        });
    }
  }, [package_id, userLoggedIn]);
  const AddToWishlist = () => {
    fetch(`${process.env.NEXT_PUBLIC_API_URL}/user/wishlist/decorPackage`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        authorization: `Bearer ${localStorage.getItem("token")}`,
      },
      body: JSON.stringify({ _id: package_id }),
    })
      .then((response) => (response.ok ? response.json() : null))
      .then((response) => {
        if (response.message === "success") {
          setIsAddedToWishlist(true);
        }
      })
      .catch((error) => {
        console.error("There was a problem with the fetch operation:", error);
      });
  };
  const RemoveFromWishList = () => {
    fetch(`${process.env.NEXT_PUBLIC_API_URL}/user/wishlist/decorPackage`, {
      method: "DELETE",
      headers: {
        "Content-Type": "application/json",
        authorization: `Bearer ${localStorage.getItem("token")}`,
      },
      body: JSON.stringify({ _id: package_id }),
    })
      .then((response) => (response.ok ? response.json() : null))
      .then((response) => {
        if (response.message === "success") {
          setIsAddedToWishlist(false);
        }
      })
      .catch((error) => {
        console.error("There was a problem with the fetch operation:", error);
      });
  };
  const AddToEvent = ({ eventId, eventDayId, variant, decorItems }) => {
    let price = decorPackage.variant[variant].sellingPrice;
    let decorItemsAmount = decorPackage.decor.reduce(
      (accumulator, currentObject) => {
        if (currentObject.category === "Pathway") {
          return (
            accumulator +
            currentObject.productInfo.variant[variant].sellingPrice *
              (addOns.decorItems.find((i) => i.decor === currentObject._id)
                ?.quantity -
                1)
          );
        } else {
          return accumulator;
        }
      },
      0
    );
    let addOnsAmount = decorItems.reduce((accumulator, currentObject) => {
      if (["Stage", "Photobooth", "Mandap"].includes(currentObject.category)) {
        let flooringCost =
          currentObject.flooring === "Carpet"
            ? currentObject.baseCost * 8
            : currentObject.flooring === "Flex"
            ? currentObject.baseCost * 10
            : currentObject.flooring === "PrintedFlex"
            ? currentObject.baseCost * 15
            : 0;
        return (
          accumulator +
          currentObject.dimensions.length *
            currentObject.dimensions.breadth *
            25 +
          flooringCost
        );
      } else {
        return accumulator;
      }
    }, 0);
    price += decorItemsAmount + addOnsAmount;
    fetch(
      `${process.env.NEXT_PUBLIC_API_URL}/event/${eventId}/decor-package/${eventDayId}`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          authorization: `Bearer ${localStorage.getItem("token")}`,
        },
        body: JSON.stringify({
          package: package_id,
          price,
          variant,
          decorItems,
        }),
      }
    )
      .then((response) => (response.ok ? response.json() : null))
      .then((response) => {
        if (response.message === "success") {
          setAddOns({ ...addOns, addOnsInitialValues, open: false });
          fetchEvents();
          alert("Item added to event!");
        }
      })
      .catch((error) => {
        console.error("There was a problem with the fetch operation:", error);
      });
  };
  const RemoveFromEvent = ({ eventId, eventDayId }) => {
    fetch(
      `${process.env.NEXT_PUBLIC_API_URL}/event/${eventId}/decor-package/${eventDayId}`,
      {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
          authorization: `Bearer ${localStorage.getItem("token")}`,
        },
        body: JSON.stringify({
          package: package_id,
        }),
      }
    )
      .then((response) => (response.ok ? response.json() : null))
      .then((response) => {
        if (response.message === "success") {
          fetchEvents();
          alert("Item remove from event!");
        }
      })
      .catch((error) => {
        console.error("There was a problem with the fetch operation:", error);
      });
  };
  // Generate Product Schema for Package
  const packagePrice = decorPackage.variant?.[variant]?.sellingPrice || decorPackage.variant?.artificialFlowers?.sellingPrice || "0";
  const productSchema = {
    "@context": "https://schema.org",
    "@type": "Product",
    "name": decorPackage.name,
    "description": decorPackage?.seoTags?.description || decorPackage.description || `${decorPackage.name} - Wedding decoration package from Wedsy`,
    "image": decorPackage?.seoTags?.image ? [decorPackage.seoTags.image] : decorPackage.image ? [decorPackage.image] : [],
    "offers": {
      "@type": "Offer",
      "price": packagePrice,
      "priceCurrency": "INR",
      "availability": "https://schema.org/InStock",
      "url": `https://www.wedsy.in/decor/packages/${package_id}`
    },
    "brand": {
      "@type": "Brand",
      "name": "Wedsy"
    },
    "category": "Wedding Decoration Package"
  };

  // Generate Breadcrumb Schema
  const breadcrumbSchema = {
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
        "name": "Packages",
        "item": "https://www.wedsy.in/decor/packages"
      },
      {
        "@type": "ListItem",
        "position": 4,
        "name": decorPackage.name,
        "item": `https://www.wedsy.in/decor/packages/${package_id}`
      }
    ]
  };

  const pageTitle = decorPackage?.seoTags?.title || `${decorPackage.name} | Wedding Decoration Package | Wedsy`;
  const pageDescription = decorPackage?.seoTags?.description || `${decorPackage.name} - ${decorPackage.description?.substring(0, 150) || "Complete wedding decoration package"} | Starting at ₹${packagePrice}. Book now for your special day in Bangalore.`;
  const pageKeywords = decorPackage?.seoTags?.keywords || `${decorPackage.name}, wedding decoration package, wedding decor bangalore, decoration package, wedding planning bangalore`;
  const ogImage = decorPackage?.seoTags?.image || decorPackage.image || "https://www.wedsy.in/logo-black.png";

  const [selectedByCategory, setSelectedByCategory] = useState({});

  // Group package items by category (Stage, Entrance, Pathway, Mandap, ...)
  const grouped = (Array.isArray(decorPackage?.decor) ? decorPackage.decor : []).reduce(
    (acc, item) => {
      const key = item?.category || "Other";
      acc[key] = acc[key] || [];
      acc[key].push(item);
      return acc;
    },
    {}
  );

  useEffect(() => {
    // Initialize selected item per category to first item
    const next = {};
    Object.entries(grouped).forEach(([cat, items]) => {
      if (items?.[0]?._id) next[cat] = items[0]._id;
    });
    setSelectedByCategory(next);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [decorPackage?._id]);

  const selectedItemFor = (cat) => {
    const items = grouped[cat] || [];
    const id = selectedByCategory[cat];
    return items.find((i) => i?._id === id) || items[0] || null;
  };

  const totalPackagePrice =
    decorPackage?.variant?.[variant]?.sellingPrice ||
    decorPackage?.variant?.artificialFlowers?.sellingPrice ||
    decorPackage?.variant?.mixedFlowers?.sellingPrice ||
    decorPackage?.variant?.naturalFlowers?.sellingPrice ||
    0;

  return (
    <>
      <Head>
        <title>{pageTitle}</title>
        <meta name="description" content={pageDescription} />
        <meta name="keywords" content={pageKeywords} />
        <meta name="robots" content="index, follow" />
        <link rel="canonical" href={`https://www.wedsy.in/decor/packages/${package_id}`} />
        
        {/* Open Graph Tags */}
        <meta property="og:title" content={pageTitle} />
        <meta property="og:description" content={pageDescription} />
        <meta property="og:image" content={ogImage} />
        <meta property="og:url" content={`https://www.wedsy.in/decor/packages/${package_id}`} />
        <meta property="og:type" content="product" />
        <meta property="og:site_name" content="Wedsy" />
        
        {/* Twitter Card Tags */}
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:title" content={pageTitle} />
        <meta name="twitter:description" content={pageDescription} />
        <meta name="twitter:image" content={ogImage} />
        
        {/* Structured Data */}
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(productSchema) }}
        />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbSchema) }}
        />
      </Head>
      <DecorDisclaimer />
      <Modal
        show={addOns.open}
        size="lg"
        popup
        onClose={() =>
          setAddOns({
            ...addOns,
            addOnsInitialValues,
          })
        }
      >
        <Modal.Header>
          <h3 className="text-xl font-medium text-gray-900 dark:text-white px-4">
            Select Product add-ons{" "}
            <span className="text-sm block">(For Required Products)</span>
          </h3>
        </Modal.Header>
        <Modal.Body>
          <div className="space-y-6 overflow-y-auto">
            {decorPackage.decor
              .filter((item, index) =>
                ["Stage", "Photobooth", "Mandap", "Pathway"].includes(
                  item.category
                )
              )
              .map((item, index) => (
                <div className="space-y-3" key={index}>
                  <p className="text-xl text-rose-900 font-medium">
                    Product: {item.name}
                  </p>
                  {item.category === "Pathway" && (
                    <div className="flex flex-row gap-6">
                      <Label>Setect Pathway Quantity (Unit: {item.unit})</Label>
                      {/* <TextInput
                        type="Number"
                        value={
                          addOns.decorItems.find((i) => i.decor === item._id)
                            ?.quantity
                        }
                        onChange={(e) => {
                          setAddOns({
                            ...addOns,
                            decorItems: addOns.decorItems.map((tempItem) => {
                              if (tempItem.decor === item._id) {
                                return {
                                  ...tempItem,
                                  quantity: parseInt(e.target.value),
                                };
                              } else {
                                return tempItem;
                              }
                            }),
                          });
                        }}
                      /> */}
                      <Select
                        value={
                          addOns.decorItems.find((i) => i.decor === item._id)
                            ?.quantity
                        }
                        onChange={(e) => {
                          setAddOns({
                            ...addOns,
                            decorItems: addOns.decorItems.map((tempItem) => {
                              if (tempItem.decor === item._id) {
                                return {
                                  ...tempItem,
                                  quantity: parseInt(e.target.value),
                                };
                              } else {
                                return tempItem;
                              }
                            }),
                          });
                        }}
                      >
                        {Array.from(
                          { length: 25 },
                          (_, index) => index + 1
                        ).map((value) => (
                          <option key={value} value={value}>
                            {value}
                          </option>
                        ))}
                      </Select>
                    </div>
                  )}
                  {["Stage", "Photobooth", "Mandap"].includes(
                    item.category
                  ) && (
                    <>
                      {addOns.decorItems.find((i) => i.decor === item._id)
                        ?.flooring === undefined ? (
                        <>
                          {addOns.decorItems.find((i) => i.decor === item._id)
                            ?.platform === undefined && (
                            <Image
                              src="/assets/images/platform.png"
                              alt="Platform"
                              width={0}
                              height={0}
                              sizes="100%"
                              style={{ width: "50%", height: "auto" }}
                            />
                          )}
                          {addOns.decorItems.find((i) => i.decor === item._id)
                            ?.platform === undefined && (
                            <div className="flex flex-row items-center gap-2">
                              <p>Do you want to add a platform?</p>
                              <button
                                className={`${
                                  addOns.decorItems.find(
                                    (i) => i.decor === item._id
                                  )?.platform
                                    ? "text-white bg-rose-900"
                                    : "bg-white text-rose-900"
                                }  border border-rose-900 hover:bg-rose-900 font-medium rounded-lg text-sm px-3 py-1.5 focus:outline-none`}
                                onClick={() => {
                                  setAddOns({
                                    ...addOns,
                                    decorItems: addOns.decorItems.map(
                                      (tempItem) => {
                                        if (tempItem.decor === item._id) {
                                          return {
                                            ...tempItem,
                                            platform: true,
                                          };
                                        } else {
                                          return tempItem;
                                        }
                                      }
                                    ),
                                  });
                                }}
                              >
                                Yes
                              </button>
                              <button
                                className={`${
                                  !addOns.decorItems.find(
                                    (i) => i.decor === item._id
                                  )?.platform &&
                                  addOns.decorItems.find(
                                    (i) => i.decor === item._id
                                  )?.platform !== undefined
                                    ? "text-white bg-rose-900"
                                    : "bg-white text-rose-900"
                                } border border-rose-900 hover:bg-rose-900 font-medium rounded-lg text-sm px-3 py-1.5 focus:outline-none`}
                                onClick={() => {
                                  setAddOns({
                                    ...addOns,
                                    decorItems: addOns.decorItems.map(
                                      (tempItem) => {
                                        if (tempItem.decor === item._id) {
                                          return {
                                            ...tempItem,
                                            platform: false,
                                          };
                                        } else {
                                          return tempItem;
                                        }
                                      }
                                    ),
                                  });
                                }}
                              >
                                No
                              </button>
                            </div>
                          )}
                          {addOns.decorItems.find((i) => i.decor === item._id)
                            ?.platform &&
                            addOns.decorItems.find((i) => i.decor === item._id)
                              ?.baseCost <= 0 && (
                              <div className="border-t border-t-black pt-2 flex flex-col gap-2">
                                <p className="font-medium">
                                  Dimensions for platform (in feet)
                                </p>
                                <div className="flex flex-row gap-2 itms-end">
                                  <div className="flex flex-col">
                                    <p>Length</p>
                                    <TextInput
                                      type="number"
                                      placeholder="length"
                                      required
                                      value={
                                        addOns.decorItems.find(
                                          (i) => i.decor === item._id
                                        )?.dimensions.length
                                      }
                                      onChange={(e) => {
                                        setAddOns({
                                          ...addOns,
                                          decorItems: addOns.decorItems.map(
                                            (tempItem) => {
                                              if (tempItem.decor === item._id) {
                                                return {
                                                  ...tempItem,
                                                  dimensions: {
                                                    ...tempItem.dimensions,
                                                    length: e.target.value,
                                                  },
                                                };
                                              } else {
                                                return tempItem;
                                              }
                                            }
                                          ),
                                        });
                                      }}
                                    />
                                  </div>
                                  <div className="flex flex-col">
                                    <p>Breadth</p>
                                    <TextInput
                                      type="number"
                                      placeholder="breadth"
                                      required
                                      value={
                                        addOns.decorItems.find(
                                          (i) => i.decor === item._id
                                        )?.dimensions.breadth
                                      }
                                      onChange={(e) => {
                                        setAddOns({
                                          ...addOns,
                                          decorItems: addOns.decorItems.map(
                                            (tempItem) => {
                                              if (tempItem.decor === item._id) {
                                                return {
                                                  ...tempItem,
                                                  dimensions: {
                                                    ...tempItem.dimensions,
                                                    breadth: e.target.value,
                                                  },
                                                };
                                              } else {
                                                return tempItem;
                                              }
                                            }
                                          ),
                                        });
                                      }}
                                    />
                                  </div>
                                  <div className="flex flex-col">
                                    <p>Height</p>
                                    <TextInput
                                      type="number"
                                      placeholder="height"
                                      required
                                      value={
                                        addOns.decorItems.find(
                                          (i) => i.decor === item._id
                                        )?.dimensions.height
                                      }
                                      onChange={(e) => {
                                        setAddOns({
                                          ...addOns,
                                          decorItems: addOns.decorItems.map(
                                            (tempItem) => {
                                              if (tempItem.decor === item._id) {
                                                return {
                                                  ...tempItem,
                                                  dimensions: {
                                                    ...tempItem.dimensions,
                                                    height: e.target.value,
                                                  },
                                                };
                                              } else {
                                                return tempItem;
                                              }
                                            }
                                          ),
                                        });
                                      }}
                                    />
                                  </div>
                                  <div className="flex flex-col">
                                    <button
                                      className={`mt-auto text-white bg-rose-900 border border-rose-900 hover:bg-rose-900 font-medium rounded-lg text-sm px-3 py-2.5 focus:outline-none`}
                                      onClick={() => {
                                        try {
                                          let l = parseFloat(
                                            addOns.decorItems.find(
                                              (i) => i.decor === item._id
                                            )?.dimensions.length
                                          );
                                          let b = parseFloat(
                                            addOns.decorItems.find(
                                              (i) => i.decor === item._id
                                            )?.dimensions.breadth
                                          );
                                          let h = parseFloat(
                                            addOns.decorItems.find(
                                              (i) => i.decor === item._id
                                            )?.dimensions.height
                                          );
                                          if (l > 0 && b > 0 && h > 0) {
                                            let baseCost = (l + h) * (b + h);
                                            setAddOns({
                                              ...addOns,
                                              decorItems: addOns.decorItems.map(
                                                (tempItem) => {
                                                  if (
                                                    tempItem.decor === item._id
                                                  ) {
                                                    return {
                                                      ...tempItem,
                                                      dimensions: {
                                                        length: l,
                                                        breadth: b,
                                                        height: h,
                                                      },
                                                      baseCost,
                                                    };
                                                  } else {
                                                    return tempItem;
                                                  }
                                                }
                                              ),
                                            });
                                          } else {
                                            alert("Enter possible values");
                                          }
                                        } catch (e) {
                                          alert("Error, try again");
                                        }
                                      }}
                                      disabled={
                                        !addOns.decorItems.find(
                                          (i) => i.decor === item._id
                                        )?.dimensions.length ||
                                        !addOns.decorItems.find(
                                          (i) => i.decor === item._id
                                        )?.dimensions.breadth ||
                                        !addOns.decorItems.find(
                                          (i) => i.decor === item._id
                                        )?.dimensions.height
                                      }
                                    >
                                      Calculate
                                    </button>
                                  </div>
                                </div>
                              </div>
                            )}
                          {addOns.decorItems.find((i) => i.decor === item._id)
                            ?.baseCost > 0 && (
                            <div className="border-t border-t-black pt-2 flex flex-row gap-2">
                              <p className="font-medium flex flex-col">
                                <span>Platform Price: </span>
                                <span className="text-rose-900 font-semibold">
                                  ₹
                                  {addOns.decorItems.find(
                                    (i) => i.decor === item._id
                                  )?.dimensions.length *
                                    addOns.decorItems.find(
                                      (i) => i.decor === item._id
                                    )?.dimensions.breadth *
                                    25}
                                </span>
                              </p>
                              <div className="flex flex-col ml-auto">
                                <button
                                  className={`mt-auto text-white bg-rose-900 border border-rose-900 hover:bg-rose-900 font-medium rounded-lg text-sm px-3 py-2.5 focus:outline-none`}
                                  onClick={() => {
                                    setAddOns({
                                      ...addOns,
                                      decorItems: addOns.decorItems.map(
                                        (tempItem) => {
                                          if (tempItem.decor === item._id) {
                                            return {
                                              ...tempItem,
                                              flooring: "",
                                            };
                                          } else {
                                            return tempItem;
                                          }
                                        }
                                      ),
                                    });
                                  }}
                                >
                                  Select Flooring Type
                                </button>
                              </div>
                            </div>
                          )}
                        </>
                      ) : (
                        <div className="flex flex-col gap-4">
                          <div className="font-medium flex flex-row gap-4 items-center justify-between">
                            <Image
                              src="/assets/images/carpet.png"
                              alt="Platform"
                              width={0}
                              height={0}
                              sizes="100%"
                              style={{ width: "30%", height: "auto" }}
                            />
                            <p className="font-medium flex flex-col items-center">
                              <span>Carpet</span>
                              <span className="text-rose-900 font-semibold">
                                ₹
                                {addOns.decorItems.find(
                                  (i) => i.decor === item._id
                                )?.baseCost * 8}
                              </span>
                            </p>
                            <div className="flex flex-col">
                              <button
                                className={`${
                                  addOns.decorItems.find(
                                    (i) => i.decor === item._id
                                  )?.flooring === "Carpet"
                                    ? "text-white bg-rose-900"
                                    : "bg-white text-rose-900"
                                } hover:text-white border border-rose-900 hover:bg-rose-900 font-medium rounded-lg text-sm px-3 py-2.5 focus:outline-none`}
                                onClick={() => {
                                  setAddOns({
                                    ...addOns,
                                    decorItems: addOns.decorItems.map(
                                      (tempItem) => {
                                        if (tempItem.decor === item._id) {
                                          return {
                                            ...tempItem,
                                            flooring: "Carpet",
                                          };
                                        } else {
                                          return tempItem;
                                        }
                                      }
                                    ),
                                  });
                                }}
                              >
                                {addOns.decorItems.find(
                                  (i) => i.decor === item._id
                                )?.flooring === "Carpet"
                                  ? "Selected"
                                  : "Select"}
                              </button>
                            </div>
                          </div>
                          <div className="font-medium flex flex-row gap-4 items-center justify-between">
                            <Image
                              src="/assets/images/flex.png"
                              alt="Platform"
                              width={0}
                              height={0}
                              sizes="100%"
                              style={{ width: "30%", height: "auto" }}
                            />
                            <p className="font-medium flex flex-col items-center">
                              <span>Flex</span>
                              <span className="text-rose-900 font-semibold">
                                ₹
                                {addOns.decorItems.find(
                                  (i) => i.decor === item._id
                                )?.baseCost * 10}
                              </span>
                            </p>
                            <div className="flex flex-col">
                              <button
                                className={`${
                                  addOns.decorItems.find(
                                    (i) => i.decor === item._id
                                  )?.flooring === "Flex"
                                    ? "text-white bg-rose-900"
                                    : "bg-white text-rose-900"
                                } hover:text-white border border-rose-900 hover:bg-rose-900 font-medium rounded-lg text-sm px-3 py-2.5 focus:outline-none`}
                                onClick={() => {
                                  setAddOns({
                                    ...addOns,
                                    decorItems: addOns.decorItems.map(
                                      (tempItem) => {
                                        if (tempItem.decor === item._id) {
                                          return {
                                            ...tempItem,
                                            flooring: "Flex",
                                          };
                                        } else {
                                          return tempItem;
                                        }
                                      }
                                    ),
                                  });
                                }}
                              >
                                {addOns.decorItems.find(
                                  (i) => i.decor === item._id
                                )?.flooring === "Flex"
                                  ? "Selected"
                                  : "Select"}
                              </button>
                            </div>
                          </div>
                          <div className="font-medium flex flex-row gap-4 items-center justify-between">
                            <Image
                              src="/assets/images/printedFlex.png"
                              alt="Platform"
                              width={0}
                              height={0}
                              sizes="100%"
                              style={{ width: "30%", height: "auto" }}
                            />
                            <p className="font-medium flex flex-col items-center">
                              <span>Printed Flex</span>
                              <span className="text-rose-900 font-semibold">
                                ₹
                                {addOns.decorItems.find(
                                  (i) => i.decor === item._id
                                )?.baseCost * 15}
                              </span>
                            </p>
                            <div className="flex flex-col">
                              <button
                                className={`${
                                  addOns.decorItems.find(
                                    (i) => i.decor === item._id
                                  )?.flooring === "PrintedFlex"
                                    ? "text-white bg-rose-900"
                                    : "bg-white text-rose-900"
                                } hover:text-white border border-rose-900 hover:bg-rose-900 font-medium rounded-lg text-sm px-3 py-2.5 focus:outline-none`}
                                onClick={() => {
                                  setAddOns({
                                    ...addOns,
                                    decorItems: addOns.decorItems.map(
                                      (tempItem) => {
                                        if (tempItem.decor === item._id) {
                                          return {
                                            ...tempItem,
                                            flooring: "PrintedFlex",
                                          };
                                        } else {
                                          return tempItem;
                                        }
                                      }
                                    ),
                                  });
                                }}
                              >
                                {addOns.decorItems.find(
                                  (i) => i.decor === item._id
                                )?.flooring === "PrintedFlex"
                                  ? "Selected"
                                  : "Select"}
                              </button>
                            </div>
                          </div>
                        </div>
                      )}
                    </>
                  )}
                </div>
              ))}
            <button
              className={`text-white bg-rose-900 border border-rose-900 hover:bg-rose-900 font-medium rounded-lg text-sm px-3 py-2.5 focus:outline-none`}
              disabled={
                addOns.decorItems.filter(
                  (item, index) =>
                    ["Stage", "Photobooth", "Mandap"].includes(item.category) &&
                    (item.platform === undefined ||
                      (item.platform === false && item.platform === ""))
                ).length > 0
              }
              onClick={() => {
                setAddOns({
                  ...addOns,
                  addOnsInitialValues,
                });
                AddToEvent({
                  eventDayId: addOns.eventDayId,
                  eventId: addOns.eventId,
                  variant,
                  decorItems: addOns.decorItems,
                });
              }}
            >
              Add to Event
            </button>
          </div>
        </Modal.Body>
      </Modal>
      <div className="w-full bg-white">
        <div className="max-w-7xl mx-auto px-4 md:px-8 py-10">
          {/* Title */}
          <h1
            className="text-center text-xl md:text-2xl tracking-[0.35em] text-gray-800"
            style={{ fontFamily: "Montserrat, sans-serif" }}
          >
            PACKAGES
          </h1>
          <div className="mt-4 h-px bg-gray-200" />

          <div className="mt-8 grid grid-cols-1 md:grid-cols-[240px_1fr] gap-8">
            {/* Left filters */}
            <aside className="relative">
              <div className="hidden md:block absolute right-0 top-0 bottom-0 w-px bg-gray-200" />
              <div className="flex md:flex-col gap-3 md:gap-4 md:pr-8 overflow-x-auto md:overflow-visible py-1">
                {CATEGORY_OPTIONS.map((c) => {
                  const active = c === category;
                  const targetId = firstPackageIdByCategory?.[c] || package_id;
                  return (
                    <Link
                      key={c}
                      href={
                        active
                          ? `/decor/packages/${package_id}`
                          : `/decor/packages/${targetId}?${buildQueryString({ category: c })}`
                      }
                      className={`shrink-0 md:shrink rounded-full px-6 py-2 text-sm border transition-colors ${
                        active
                          ? "bg-black text-white border-black"
                          : "bg-white text-gray-900 border-gray-300 hover:border-gray-400"
                      }`}
                      style={{ fontFamily: "Montserrat, sans-serif" }}
                    >
                      {c}
                    </Link>
                  );
                })}
              </div>
            </aside>

            {/* Right content */}
            <section>
              {/* Top package tabs */}
              {Array.isArray(packagesForTabs) && packagesForTabs.length > 0 && (
                <div className="flex gap-2 overflow-x-auto pb-3">
                  {packagesForTabs.map((p) => {
                    const active = p?._id === package_id;
                    return (
                      <Link
                        key={p?._id}
                        href={`/decor/packages/${p?._id}${
                          category ? `?${buildQueryString({ category })}` : ""
                        }`}
                        className={`shrink-0 px-5 py-2 rounded-full text-xs border ${
                          active
                            ? "bg-[#D46A78] text-white border-[#D46A78]"
                            : "bg-[#F2D7DB] text-gray-900 border-[#F2D7DB] hover:opacity-90"
                        }`}
                        style={{ fontFamily: "Montserrat, sans-serif" }}
                      >
                        {p?.name || "Package"}
                      </Link>
                    );
                  })}
                </div>
              )}

              {/* Sections */}
              <div className="mt-6 space-y-10">
                {Object.keys(grouped).map((cat) => {
                  const items = grouped[cat] || [];
                  const selected = selectedItemFor(cat);
                  if (!selected) return null;
                  const included = Array.isArray(selected?.productInfo?.included)
                    ? selected.productInfo.included
                    : [];

                  return (
                    <div key={cat} className="border-t border-gray-200 pt-8">
                      <div className="flex items-center justify-between mb-4">
                        <p
                          className="text-sm font-semibold text-gray-800 tracking-widest"
                          style={{ fontFamily: "Montserrat, sans-serif" }}
                        >
                          {String(cat).toUpperCase()}
                        </p>
                      </div>

                      <div className="grid grid-cols-1 md:grid-cols-[320px_1fr] gap-6">
                        {/* Left image */}
                        <div className="relative w-full aspect-[4/3] rounded-lg overflow-hidden bg-gray-200">
                          {selected?.image ? (
                            <Image
                              src={selected.image}
                              alt={selected?.name || cat}
                              fill
                              sizes="(min-width: 768px) 320px, 100vw"
                              className="object-cover"
                            />
                          ) : (
                            <div className="w-full h-full bg-gradient-to-br from-gray-200 to-gray-300" />
                          )}
                        </div>

                        {/* Right info */}
                        <div className="space-y-4">
                          <div className="rounded-lg border border-gray-200 bg-white p-4">
                            <p className="text-xs font-semibold text-gray-700 mb-2">
                              Inclusive of:
                            </p>
                            <ul className="text-xs text-gray-700 space-y-1 list-disc pl-4">
                              {included.length > 0 ? (
                                included.map((x, idx) => (
                                  <li key={idx}>{x}</li>
                                ))
                              ) : (
                                <li>—</li>
                              )}
                            </ul>
                          </div>

                          <div className="flex items-center gap-3">
                            <span className="text-xs text-gray-700">Quantity</span>
                            <div className="rounded-full border border-gray-300 px-4 py-1 text-xs">
                              {selected?.productInfo?.quantity || 1}
                            </div>
                          </div>

                          {/* Thumbnails (swap options) */}
                          <div>
                            <div className="inline-flex items-center bg-[#F5E27A] text-[11px] px-3 py-1 rounded">
                              Swap between different options
                            </div>

                            <div className="mt-3 grid grid-cols-4 gap-3">
                              {Array.from({ length: 4 }).map((_, idx) => {
                                const option = items[idx];
                                const active = option?._id === selected?._id;
                                return (
                                  <button
                                    key={option?._id || idx}
                                    type="button"
                                    onClick={() => {
                                      if (!option?._id) return;
                                      setSelectedByCategory((prev) => ({
                                        ...prev,
                                        [cat]: option._id,
                                      }));
                                    }}
                                    className={`relative aspect-square rounded-md overflow-hidden border ${
                                      active
                                        ? "border-[#840032]"
                                        : "border-gray-200 hover:border-gray-300"
                                    } bg-gray-200`}
                                    aria-label={`Select ${cat} option ${idx + 1}`}
                                  >
                                    {option?.thumbnail ? (
                                      <Image
                                        src={option.thumbnail}
                                        alt={option?.name || `${cat} option`}
                                        fill
                                        sizes="80px"
                                        className="object-cover"
                                      />
                                    ) : (
                                      <div className="w-full h-full bg-gradient-to-br from-gray-200 to-gray-300" />
                                    )}
                                  </button>
                                );
                              })}
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>

              {/* Bottom bar */}
              <div className="mt-10 pt-6 border-t border-gray-200 flex items-center justify-between gap-4 flex-wrap">
                <div className="text-sm">
                  <span className="text-gray-700">Total package price: </span>
                  <span className="font-semibold text-gray-900">₹ {totalPackagePrice}</span>
                </div>

                <div className="flex items-center gap-3">
                  <button
                    className={`${
                      isAddedToWishlist
                        ? "text-rose-900 bg-white hover:bg-white"
                        : "text-white bg-rose-900 hover:bg-rose-900"
                    } cursor-pointer px-4 py-2 focus:outline-none rounded-lg border-rose-900 border `}
                    onClick={() => {
                      if (userLoggedIn) {
                        isAddedToWishlist ? RemoveFromWishList() : AddToWishlist();
                      } else {
                        setOpenLoginModal(true);
                      }
                    }}
                  >
                    <AiFillHeart size={18} />
                  </button>

                  <Dropdown
                    inline
                    arrowIcon={false}
                    dismissOnClick={false}
                    label={
                      <button
                        type="button"
                        className="text-white bg-[#840032] hover:bg-[#6a0029] font-medium rounded-lg text-sm px-5 py-2.5 focus:outline-none"
                        onClick={() => {
                          if (!userLoggedIn) setOpenLoginModal(true);
                        }}
                      >
                        ADD TO EVENT
                      </button>
                    }
                    className="border border-black rounded-lg bg-black"
                  >
                    <Dropdown.Item className="text-white">Event List</Dropdown.Item>
                    {eventList?.map((item) => (
                      <>
                        <Dropdown.Divider className="bg-black h-[1px] my-0" />
                        <Dropdown.Item className="bg-white flex flex-row gap-4" as="p">
                          <Label className="flex">{item.name}</Label>
                        </Dropdown.Item>
                        {item.eventDays.map((rec) => (
                          <Dropdown.Item
                            key={rec._id}
                            className="bg-white flex flex-row gap-4"
                            onClick={() => {}}
                            as={Label}
                          >
                            <Checkbox
                              checked={
                                rec.packages.filter((i) => i.package === package_id).length > 0
                              }
                              disabled={rec.status.finalized}
                              onChange={(e) => {
                                if (e.target.checked) {
                                  setAddOns({
                                    open: true,
                                    eventDayId: rec._id,
                                    eventId: item._id,
                                    package: package_id,
                                    price: 0,
                                    variant,
                                    decorItems: decorPackage.decor.map((tempItem) => ({
                                      quantity: 1,
                                      unit: tempItem.unit,
                                      decor: tempItem._id,
                                      platform: ["Stage", "Photobooth", "Mandap"].includes(
                                        tempItem.category
                                      )
                                        ? undefined
                                        : false,
                                      flooring: ["Stage", "Photobooth", "Mandap"].includes(
                                        tempItem.category
                                      )
                                        ? undefined
                                        : "",
                                      dimensions: { length: 0, breadth: 0, height: 0 },
                                      category: tempItem.category,
                                      baseCost: 0,
                                    })),
                                  });
                                } else {
                                  RemoveFromEvent({ eventDayId: rec._id, eventId: item._id });
                                }
                              }}
                            />
                            {rec.name}
                          </Dropdown.Item>
                        ))}
                      </>
                    ))}
                    <Dropdown.Divider className="bg-black h-[1px] my-0" />
                    <Dropdown.Item as={Link} href="/event" className="bg-white text-cyan-600">
                      + Create New Event
                    </Dropdown.Item>
                  </Dropdown>
                </div>
              </div>
            </section>
          </div>
        </div>
      </div>
    </>
  );
}

export async function getServerSideProps(context) {
  try {
    const { package_id } = context.params;
    const apiUrl = process.env.NEXT_PUBLIC_API_URL;
    const category = String(context.query.category || "");

    const response = await fetch(`${apiUrl}/decor-package?${buildQueryString({ limit: 1000 })}`);
    const allPackagesData = await response.json().catch(() => null);
    const allPackagesRaw = Array.isArray(allPackagesData?.list) ? allPackagesData.list : [];
    const allPackages = sortPackagesByNameNumber(allPackagesRaw);

    const packagesForTabs = category
      ? allPackages.filter((p) => matchesOccasionFilter(p, category))
      : allPackages;

    const firstPackageIdByCategory = CATEGORY_OPTIONS.reduce((acc, c) => {
      const list = allPackages.filter((p) => matchesOccasionFilter(p, c));
      acc[c] = list?.[0]?._id || "";
      return acc;
    }, {});

    const decorPackageResponse = await fetch(`${apiUrl}/decor-package/${package_id}`);
    if (decorPackageResponse.status !== 200) {
      return {
        redirect: {
          permanent: false,
          destination: "/decor/packages",
        },
      };
    }
    const decorPackage = await decorPackageResponse.json();
    if (!decorPackage || decorPackageResponse.status !== 200) {
      return {
        redirect: {
          permanent: false,
          destination: "/decor/packages",
        },
      };
    }
    return {
      props: {
        similarDecorPackages: [],
        decorPackage,
        packagesForTabs,
        category,
        firstPackageIdByCategory,
      },
    };
  } catch (error) {
    console.error("Error fetching data:", error);
    return {
      props: {
        similarDecor: [],
      },
    };
  }
}

export default DecorListing;
