import Breadcrumbs from "@/components/Breadcrumbs";
import ImageFillCard from "@/components/cards/ImageFillCard";
import DecorDisclaimer from "@/components/marquee/DecorDisclaimer";
import CreateEventModal from "@/components/modal/CreateEventModal";
import SimilarDecor from "@/components/screens/SimilarDecor";
import Toast from "@/components/other/Toast";
import ImageLightbox from "@/components/lightbox/ImageLightbox";
import { toProperCase } from "@/utils/text";
import { trimTitle, trimDescription, OG_IMAGES } from "@/utils/seo";
import { pushDataLayer } from "@/utils/tracking";
import {
  Button,
  Checkbox,
  Dropdown,
  Label,
  Modal,
  Rating,
  Select,
  TextInput,
  Tooltip,
} from "flowbite-react";
import Head from "next/head";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import { AiFillHeart, AiOutlineHeart } from "react-icons/ai";
import { BsChevronDown, BsInfoCircle } from "react-icons/bs";
import { MdOutlinePlayCircle } from "react-icons/md";

function DecorListing({
  similarDecor,
  decor,
  category,
  userLoggedIn,
  setOpenLoginModal,
  categoryList,
}) {
  const router = useRouter();
  const { decor_id } = router.query;
  const [loading, setLoading] = useState(false);
  const [displayImage, setDisplayImage] = useState(decor.image);
  const [displayVideo, setDisplayVideo] = useState("");
  const [isAddedToWishlist, setIsAddedToWishlist] = useState(false);
  const [eventList, setEventList] = useState([]);
  const [variant, setVariant] = useState(
    decor?.productTypes?.length > 0 ? decor?.productTypes[0]?.name : ""
  );
  const [productVariant, setProductVariant] = useState(
    ""
    // decor?.productVariants?.length > 0 ? decor?.productVariants[0]?.name : ""
  );
  const [cart, setCart] = useState({
    open: false,
    quantity:
      decor?.productInfo?.minimumOrderQuantity &&
      decor?.productInfo?.maximumOrderQuantity
        ? decor?.productInfo?.minimumOrderQuantity
        : 1,
    platform: false,
    flooring: "",
    dimensions: {
      length: 0,
      breadth: 0,
      height: 0,
    },
    price: 0,
    eventId: "",
    eventDayId: "",
  });
  const [productAddOnsCart, setProductAddOnsCart] = useState({
    open: false,
    displayIndex: -1,
    quantity: 1,
    productAddOns: [],
    platform: false,
    flooring: "",
    dimensions: {
      length: 0,
      breadth: 0,
      height: 0,
    },
    eventId: "",
    eventDayId: "",
    tempQuantity: 1,
    productVariant: "",
  });
  const [showEventModal, setShowEventModal] = useState(false);
  const [platformPrice, setPlatformPrice] = useState({ price: 0, image: "" });
  const [flooringPrice, setFlooringPrice] = useState([]);
  const [showToast, setShowToast] = useState(false);
  const [toastMessage, setToastMessage] = useState("");
  const [heartAnimating, setHeartAnimating] = useState(false);
  const [isRemoving, setIsRemoving] = useState(false);
  const [lightboxOpen, setLightboxOpen] = useState(false);
  const [lightboxIndex, setLightboxIndex] = useState(0);

  const fetchPlatformInfo = () => {
    setLoading(true);
    fetch(`${process.env.NEXT_PUBLIC_API_URL}/config?code=platform`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
      },
    })
      .then((response) => response.json())
      .then((response) => {
        setLoading(false);
        setPlatformPrice({
          image: "",
          ...response?.data,
          price: parseInt(response?.data?.price),
        });
      })
      .catch((error) => {
        console.error("There was a problem with the fetch operation:", error);
      });
  };
  const fetchFlooringInfo = () => {
    setLoading(true);
    fetch(`${process.env.NEXT_PUBLIC_API_URL}/config?code=flooring`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
      },
    })
      .then((response) => response.json())
      .then((response) => {
        setLoading(false);
        setFlooringPrice(
          response?.data?.flooringList?.map((i) => ({
            ...i,
            price: parseInt(i.price),
          })) || []
        );
      })
      .catch((error) => {
        console.error("There was a problem with the fetch operation:", error);
      });
  };
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
  const AddToWishlist = () => {
    // Trigger heart animation immediately for smooth UX
    setHeartAnimating(true);
    
    fetch(`${process.env.NEXT_PUBLIC_API_URL}/user/wishlist/decor`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        authorization: `Bearer ${localStorage.getItem("token")}`,
      },
      body: JSON.stringify({ _id: decor_id }),
    })
      .then((response) => (response.ok ? response.json() : null))
      .then((response) => {
        if (response.message === "success") {
          setIsAddedToWishlist(true);
          setToastMessage("Added to Wishlist");
          setShowToast(true);
          // Stop animation after transition completes
          setTimeout(() => setHeartAnimating(false), 600);
        } else {
          setHeartAnimating(false);
        }
      })
      .catch((error) => {
        console.error("There was a problem with the fetch operation:", error);
        setHeartAnimating(false);
      });
  };
  const RemoveFromWishList = () => {
    // Trigger reverse heart animation
    setIsRemoving(true);
    setHeartAnimating(true);
    
    fetch(`${process.env.NEXT_PUBLIC_API_URL}/user/wishlist/decor`, {
      method: "DELETE",
      headers: {
        "Content-Type": "application/json",
        authorization: `Bearer ${localStorage.getItem("token")}`,
      },
      body: JSON.stringify({ _id: decor_id }),
    })
      .then((response) => (response.ok ? response.json() : null))
      .then((response) => {
        if (response.message === "success") {
          setToastMessage("Removed from Wishlist");
          setShowToast(true);
          // Wait for animation to complete before updating state
          setTimeout(() => {
            setIsAddedToWishlist(false);
            setHeartAnimating(false);
            setIsRemoving(false);
          }, 600);
        } else {
          setHeartAnimating(false);
          setIsRemoving(false);
        }
      })
      .catch((error) => {
        console.error("There was a problem with the fetch operation:", error);
        setHeartAnimating(false);
        setIsRemoving(false);
      });
  };
  const AddToEvent = ({
    eventId,
    eventDayId,
    platform,
    flooring,
    dimensions,
    price,
    quantity,
  }) => {
    fetch(
      `${process.env.NEXT_PUBLIC_API_URL}/event/${eventId}/decor/${eventDayId}`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          authorization: `Bearer ${localStorage.getItem("token")}`,
        },
        body: JSON.stringify({
          decor: decor_id,
          platform,
          flooring,
          dimensions,
          price,
          category: decor.category,
          variant,
          productVariant,
          priceModifier: productVariant
            ? decor.productVariants.find((i) => i.name === productVariant)
                ?.priceModifier
            : 0,
          quantity,
          unit: decor.unit,
          platformRate: platform ? platformPrice?.price : 0,
          flooringRate: flooring
            ? flooringPrice.find((i) => i.title === flooring)?.price || 0
            : 0,
          decorPrice: decor?.productTypes?.find((i) => i.name === variant)
            ?.sellingPrice,
          included: decor?.productInfo?.included || [],
        }),
      }
    )
      .then((response) => (response.ok ? response.json() : null))
      .then((response) => {
        if (response.message === "success") {
          fetchEvents();
          // A12 + A13: AddToCart
          const addToCartPayload = {
            content_name: decor.name,
            content_ids: [decor_id],
            content_type: "product",
            value: (decor?.productTypes?.[0]?.sellingPrice ?? 0) * quantity,
            currency: "INR",
          };
          pushDataLayer("AddToCart", addToCartPayload);
          import("react-facebook-pixel")
            .then((x) => x.default)
            .then((ReactPixel) => ReactPixel.track("AddToCart", addToCartPayload));
          if (decor.productAddOns.length > 0) {
            setProductAddOnsCart({
              ...productAddOnsCart,
              displayIndex: 0,
              open: true,
              quantity,
              productAddOns: [],
              platform,
              flooring,
              dimensions,
              eventId,
              eventDayId,
              tempQuantity: quantity,
              productVariant: "",
            });
          }
          if (category.platformAllowed || category.flooringAllowed) {
            setCart({
              ...cart,
              open: false,
              platform: false,
              flooring: "",
              dimensions: { length: 0, breadth: 0, height: 0 },
              price: 0,
              eventId: "",
              eventDayId: "",
            });
          }
          // Get event name for toast message
          const event = eventList.find((e) => e._id === eventId);
          const eventDay = event?.eventDays.find((d) => d._id === eventDayId);
          const eventName = event?.name || "your event";
          const dayName = eventDay?.name || "";
          const message = dayName 
            ? `Added to ${eventName} - ${dayName}`
            : `Added to ${eventName}`;
          setToastMessage(message);
          setShowToast(true);
        }
      })
      .catch((error) => {
        console.error("There was a problem with the fetch operation:", error);
      });
  };
  const AddProductAddOnsToEvent = ({ tempCart }) => {
    if (tempCart.productAddOns.length > 0) {
      Promise.all(
        tempCart.productAddOns?.map((item) => {
          fetch(
            `${process.env.NEXT_PUBLIC_API_URL}/event/${tempCart.eventId}/decor/${tempCart.eventDayId}`,
            {
              method: "POST",
              headers: {
                "Content-Type": "application/json",
                authorization: `Bearer ${localStorage.getItem("token")}`,
              },
              body: JSON.stringify({
                decor: item._id,
                platform: tempCart.platform,
                flooring: tempCart.flooring,
                dimensions: tempCart.dimensions,
                price:
                  (item.decor.productTypes[0]?.sellingPrice +
                    (item.productVariant
                      ? item.decor.productVariants.find(
                          (i) => i.name === item.productVariant
                        )?.priceModifier
                      : 0)) *
                  item.quantity,
                category: item.decor.category,
                variant: item.decor?.productTypes[0]?.name,
                productVariant: item.productVariant,
                priceModifier: item.productVariant
                  ? item.decor.productVariants.find(
                      (i) => i.name === item.productVariant
                    )?.priceModifier
                  : 0,
                quantity: item.quantity,
                unit: item.decor.unit,
                platformRate: tempCart.platform ? platformPrice?.price : 0,
                flooringRate: tempCart.flooring
                  ? flooringPrice.find((i) => i.title === tempCart.flooring)
                      ?.price || 0
                  : 0,
                decorPrice: item.decor?.productTypes[0]?.sellingPrice,
                included: item.decor?.productInfo?.included || [],
              }),
            }
          )
            .then((response) => (response.ok ? response.json() : null))
            .catch((error) => {
              console.error(
                "There was a problem with the fetch operation:",
                error
              );
            });
        })
      )
        .then((result) => {
          setProductAddOnsCart({
            ...productAddOnsCart,
            displayIndex: -1,
            open: false,
            quantity: 1,
            productAddOns: [],
            platform: false,
            flooring: "",
            dimensions: {
              length: 0,
              breadth: 0,
              height: 0,
            },
            eventId: "",
            eventDayId: "",
          });
          // Get event name for toast message
          const event = eventList.find((e) => e._id === tempCart.eventId);
          const eventDay = event?.eventDays.find((d) => d._id === tempCart.eventDayId);
          const eventName = event?.name || "your event";
          const dayName = eventDay?.name || "";
          const message = dayName 
            ? `Add-ons added to ${eventName} - ${dayName}`
            : `Add-ons added to ${eventName}`;
          setToastMessage(message);
          setShowToast(true);
        })
        .catch((error) => {
          console.error("There was a problem with the fetch operation:", error);
        });
    }
  };
  const RemoveFromEvent = ({ eventId, eventDayId }) => {
    fetch(
      `${process.env.NEXT_PUBLIC_API_URL}/event/${eventId}/decor/${eventDayId}`,
      {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
          authorization: `Bearer ${localStorage.getItem("token")}`,
        },
        body: JSON.stringify({
          decor: decor_id,
        }),
      }
    )
      .then((response) => (response.ok ? response.json() : null))
      .then((response) => {
        if (response.message === "success") {
          fetchEvents();
          // Get event name for toast message
          const event = eventList.find((e) => e._id === eventId);
          const eventDay = event?.eventDays.find((d) => d._id === eventDayId);
          const eventName = event?.name || "your event";
          const dayName = eventDay?.name || "";
          const message = dayName 
            ? `Removed from ${eventName} - ${dayName}`
            : `Removed from ${eventName}`;
          setToastMessage(message);
          setShowToast(true);
        }
      })
      .catch((error) => {
        console.error("There was a problem with the fetch operation:", error);
      });
  };

  useEffect(() => {
    if (decor_id && userLoggedIn) {
      fetchEvents();
      fetchFlooringInfo();
      fetchPlatformInfo();
      fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/user/is-added-to-wishlist?product=decor&_id=${decor_id}`,
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
  }, [decor_id, userLoggedIn]);

  // Meta Pixel ViewContent (A10) + GTM dataLayer (A13)
  useEffect(() => {
    if (!decor_id || !decor?.name) return;
    const payload = {
      content_name: decor.name,
      content_ids: [decor_id],
      content_type: "product",
      content_category: decor.category || "decor",
      value: decor?.productTypes?.[0]?.sellingPrice ?? 0,
      currency: "INR",
    };
    pushDataLayer("ContentView", payload);
    import("react-facebook-pixel")
      .then((x) => x.default)
      .then((ReactPixel) => {
        ReactPixel.track("ViewContent", payload);
      });
  }, [decor_id, decor?._id, decor?.name]);

  // UI Components
  function AddToEventButton({}) {
    return (
      <Dropdown
        inline
        arrowIcon={false}
        dismissOnClick={false}
        label={
          <Button
            onClick={() => {
              if (!userLoggedIn) {
                setOpenLoginModal(true);
              }
            }}
            className="bg-black enabled:hover:bg-black md:bg-rose-900 md:enabled:hover:bg-rose-900 text-white text-center w-full shadow-lg"
            disabled={loading}
          >
            ADD TO EVENT
          </Button>
        }
        className="border border-black rounded-lg bg-black"
      >
        <Dropdown.Item className="text-white bg-black">
          Event List
        </Dropdown.Item>
        <div className="max-h-[400px] overflow-y-auto p-1">
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
                      rec.decorItems.filter((i) => i.decor === decor_id).length >
                      0
                    }
                    className={item.status.finalized ? "sr-only" : ""}
                    disabled={item.status.finalized}
                    onChange={(e) => {
                      if (e.target.checked) {
                        if (
                          category.websiteView === "single" &&
                          decor.productVariants.length > 0 &&
                          !productVariant
                        ) {
                          alert("Select Option(variant)");
                        } else if (
                          category.flooringAllowed ||
                          category.platformAllowed
                        ) {
                          setCart({
                            ...cart,
                            open: true,
                            platform: undefined,
                            flooring: undefined,
                            dimensions: {
                              length: 0,
                              breadth: 0,
                              height: 0,
                            },
                            price: 0,
                            eventDayId: rec._id,
                            eventId: item._id,
                          });
                        } else {
                          AddToEvent({
                            quantity: cart.quantity,
                            unit: decor.unit,
                            eventDayId: rec._id,
                            eventId: item._id,
                            platform: false,
                            flooring: "",
                            dimensions: {
                              length: 0,
                              breadth: 0,
                              height: 0,
                            },
                            price:
                              (decor.productTypes.find((i) => i.name === variant)
                                ?.sellingPrice +
                                (productVariant
                                  ? decor.productVariants.find(
                                      (i) => i.name === productVariant
                                    )?.priceModifier
                                  : 0)) *
                              cart.quantity,
                          });
                        }
                      } else {
                        RemoveFromEvent({
                          eventDayId: rec._id,
                          eventId: item._id,
                        });
                      }
                    }}
                  />
                  {rec.name}
                </Dropdown.Item>
              ))}
            </>
          ))}
        </div>
        <Dropdown.Divider className="bg-black h-[1px] my-0" />
        <Dropdown.Item
          onClick={() => {
            setShowEventModal(true);
          }}
          className="bg-white text-cyan-600"
        >
          + Create New Event
        </Dropdown.Item>
      </Dropdown>
    );
  }

  function WishlistButton({}) {
    return (
      <Button
        className={`focus:outline-none focus:ring-0 outline-none bg-white enabled:hover:bg-white text-black shadow-md transition-all duration-200`}
        onClick={() => {
          if (userLoggedIn) {
            isAddedToWishlist ? RemoveFromWishList() : AddToWishlist();
          } else {
            setOpenLoginModal(true);
          }
        }}
        disabled={loading}
      >
        {isAddedToWishlist ? "REMOVE FROM FAVORITES" : "ADD TO FAVOURITES"}
        &nbsp;
        <span className="relative inline-flex items-center justify-center w-5 h-5">
          {isAddedToWishlist ? (
            <>
              <AiFillHeart 
                size={20} 
                className={`text-rose-900 absolute transition-all duration-300 ${
                  heartAnimating && isRemoving ? "opacity-0 scale-0 animate-heartEmpty" : "opacity-100 scale-100"
                }`}
              />
              {heartAnimating && isRemoving && (
                <AiOutlineHeart 
                  size={20} 
                  className="text-rose-900 absolute animate-heartFill"
                />
              )}
            </>
          ) : (
            <>
              <AiOutlineHeart 
                size={20} 
                className={`text-rose-900 absolute transition-all duration-300 ${
                  heartAnimating ? "opacity-0 scale-0" : "opacity-100 scale-100"
                }`} 
              />
              {heartAnimating && (
                <AiFillHeart 
                  size={20} 
                  className="text-rose-900 absolute animate-heartFill"
                />
              )}
            </>
          )}
        </span>
      </Button>
    );
  }

  function QuantityOptions({ min, max }) {
    const listItems = [];
    for (let i = min; i <= max; i++) {
      listItems.push(i);
    }

    return (
      <>
        {listItems.map((number) => (
          <option key={number} value={number}>
            {number}
          </option>
        ))}
      </>
    );
  }

  // Generate Product Schema
  const productSchema = {
    "@context": "https://schema.org",
    "@type": "Product",
    "name": decor.name,
    "description": decor?.seoTags?.description || decor.description || `${decor.name} - Wedding decoration item from Wedsy`,
    "image": decor?.seoTags?.image ? [decor.seoTags.image] : decor.image ? [decor.image] : [],
    "offers": {
      "@type": "Offer",
      "price": String(decor?.productTypes?.[0]?.sellingPrice ?? 0),
      "priceCurrency": "INR",
      "availability": "https://schema.org/InStock",
      "url": `https://www.wedsy.in/decor/view/${decor_id}`
    },
    "brand": {
      "@type": "Brand",
      "name": "Wedsy"
    },
    "category": decor.category || "Wedding Decoration"
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
        "name": decor.category || "Category",
        "item": `https://www.wedsy.in/decor/view?category=${decor.category || ""}`
      },
      {
        "@type": "ListItem",
        "position": 4,
        "name": decor.name,
        "item": `https://www.wedsy.in/decor/view/${decor_id}`
      }
    ]
  };

  // Get all images for lightbox
  const getAllImages = () => {
    const images = [decor.image];
    if (decor.additionalImages && decor.additionalImages.length > 0) {
      images.push(...decor.additionalImages);
    }
    return images;
  };

  // Lightbox handlers
  const openLightbox = (index = 0) => {
    setLightboxIndex(index);
    setLightboxOpen(true);
  };

  const closeLightbox = () => {
    setLightboxOpen(false);
  };

  const nextImage = () => {
    const images = getAllImages();
    setLightboxIndex((prev) => (prev + 1) % images.length);
  };

  const prevImage = () => {
    const images = getAllImages();
    setLightboxIndex((prev) => (prev - 1 + images.length) % images.length);
  };

  const pageTitle = decor?.seoTags?.title || `${decor.name} | Wedding ${decor.category || "Decoration"} | Wedsy`;
  const pageDescription = decor?.seoTags?.description || `${decor.name} - ${decor.description?.substring(0, 150) || "Premium wedding decoration item"} | Starting at ₹${decor?.productTypes?.[0]?.sellingPrice || "0"}. Book now for your special day in Bangalore.`;
  const pageKeywords = decor?.seoTags?.keywords || `${decor.name}, ${decor.category || "wedding decoration"}, wedding decor bangalore, ${decor.category?.toLowerCase()} decoration, wedding planning bangalore`;
  const ogImage = decor?.seoTags?.image || decor.image || OG_IMAGES.decor;

  return (
    <>
      <Head>
        <title>{trimTitle(pageTitle)}</title>
        <meta name="description" content={trimDescription(pageDescription)} />
        <meta name="keywords" content={pageKeywords} />
        <meta name="robots" content="index, follow" />
        <link rel="canonical" href={`https://www.wedsy.in/decor/view/${decor_id}`} />
        
        {/* Open Graph Tags */}
        <meta property="og:title" content={pageTitle} />
        <meta property="og:description" content={pageDescription} />
        <meta property="og:image" content={ogImage} />
        <meta property="og:url" content={`https://www.wedsy.in/decor/view/${decor_id}`} />
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
      <CreateEventModal
        showEventModal={showEventModal}
        setShowEventModal={setShowEventModal}
        userLoggedIn={userLoggedIn}
        setOpenLoginModal={setOpenLoginModal}
        fetchEvents={fetchEvents}
      />
      <Toast
        message={toastMessage}
        show={showToast}
        onClose={() => setShowToast(false)}
        isRemoved={toastMessage === "Removed from Wishlist"}
      />
      <DecorDisclaimer />
      <div className="max-w-screen-xl mx-auto px-4 md:px-8 py-2">
        <Breadcrumbs
          items={[
            { name: "Home", href: "/" },
            { name: "Decor", href: "/decor" },
            { name: decor?.category || "Decor", href: `/decor/view?category=${encodeURIComponent(decor?.category || "")}` },
            { name: decor?.name || "Product" },
          ]}
        />
      </div>
      {/* Image Lightbox */}
      <ImageLightbox
        images={getAllImages()}
        currentIndex={lightboxIndex}
        isOpen={lightboxOpen}
        onClose={closeLightbox}
        onNext={nextImage}
        onPrev={prevImage}
      />
      <Modal
        show={productAddOnsCart.open}
        size="lg"
        popup
        onClose={() =>
          setProductAddOnsCart({
            ...productAddOnsCart,
            displayIndex: -1,
            open: false,
            quantity: 1,
            productAddOns: [],
            platform: false,
            flooring: "",
            dimensions: {
              length: 0,
              breadth: 0,
              height: 0,
            },
            eventId: "",
            eventDayId: "",
          })
        }
      >
        <Modal.Header className="border-b border-gray-200">
          <div className="flex items-center justify-between w-full">
            <h3 className="text-xl font-semibold text-gray-900">
              Enhance Your Decor
            </h3>
            <span className="text-sm text-gray-500 bg-gray-100 px-3 py-1 rounded-full">
              {productAddOnsCart.displayIndex + 1} of {decor.productAddOns.length}
            </span>
          </div>
        </Modal.Header>
        <Modal.Body className="p-6">
          {decor.productAddOns[productAddOnsCart.displayIndex]?._id &&
            decor.productAddOns
              ?.filter((_, i) => i === productAddOnsCart.displayIndex)
              ?.map((item, index) => (
                <div className="space-y-5" key={item._id}>
                  {/* Product Header */}
                  <div className="flex items-center justify-between pb-3 border-b border-gray-100">
                    <h4 className="text-lg font-medium text-gray-900">
                      {item.name}
                    </h4>
                    <span className="text-lg font-semibold text-[#840032]">
                      ₹{item.productTypes[0]?.sellingPrice +
                        (productAddOnsCart.productVariant
                          ? item.productVariants.find(
                              (i) => i.name === productAddOnsCart.productVariant
                            )?.priceModifier
                          : 0)}
                    </span>
                  </div>
                  
                  {/* Product Image & Options */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="aspect-square rounded-xl overflow-hidden bg-gray-100">
                      <img
                        src={
                          productAddOnsCart.productVariant
                            ? item.productVariants.find(
                                (i) => i.name === productAddOnsCart.productVariant
                              )?.image
                            : item?.image
                        }
                        alt={item.name}
                        className="w-full h-full object-cover"
                      />
                    </div>
                    <div className="flex flex-col gap-4">
                      {/* Variant Selection */}
                      {item.productVariants.length > 0 && (
                        <div className="space-y-2">
                          <label className="text-sm font-medium text-gray-700">Select Variant</label>
                          <Select
                            value={productAddOnsCart.productVariant}
                            onChange={(e) =>
                              setProductAddOnsCart({
                                ...productAddOnsCart,
                                productVariant: e.target.value,
                              })
                            }
                            className="w-full"
                          >
                            <option value={""}>Choose an option</option>
                            {item.productVariants.map((variant, idx) => (
                              <option key={idx} value={variant.name}>
                                {variant.name}
                              </option>
                            ))}
                          </Select>
                        </div>
                      )}
                      
                      {/* Quantity Selection */}
                      <div className="space-y-2">
                        <label className="text-sm font-medium text-gray-700">Quantity</label>
                        <Select
                          value={productAddOnsCart.tempQuantity}
                          onChange={(e) => {
                            setProductAddOnsCart({
                              ...productAddOnsCart,
                              tempQuantity: e.target.value,
                            });
                          }}
                          className="w-full"
                        >
                          {item?.productInfo?.minimumOrderQuantity &&
                          item?.productInfo?.maximumOrderQuantity &&
                          (item?.productInfo?.minimumOrderQuantity >
                            productAddOnsCart.tempQuantity ||
                            item?.productInfo?.maximumOrderQuantity <
                              productAddOnsCart.tempQuantity) ? (
                            <option
                              key={productAddOnsCart.tempQuantity}
                              value={productAddOnsCart.tempQuantity}
                            >
                              {productAddOnsCart.tempQuantity}
                            </option>
                          ) : (
                            productAddOnsCart.tempQuantity > 30 && (
                              <option
                                key={productAddOnsCart.tempQuantity}
                                value={productAddOnsCart.tempQuantity}
                              >
                                {productAddOnsCart.tempQuantity}
                              </option>
                            )
                          )}
                          {item?.productInfo?.minimumOrderQuantity &&
                          item?.productInfo?.maximumOrderQuantity ? (
                            <QuantityOptions
                              max={item?.productInfo?.maximumOrderQuantity}
                              min={item?.productInfo?.minimumOrderQuantity}
                            />
                          ) : (
                            <>
                              {Array.from(
                                { length: 30 },
                                (_, index) => index + 1
                              ).map((value) => (
                                <option key={value} value={value}>
                                  {value}
                                </option>
                              ))}
                            </>
                          )}
                        </Select>
                      </div>
                      
                      {/* Total Price Card */}
                      <div className="mt-auto p-4 bg-gradient-to-r from-[#840032]/10 to-[#840032]/5 rounded-xl border border-[#840032]/20">
                        <div className="flex items-center justify-between">
                          <span className="text-sm font-medium text-gray-600">Total Amount</span>
                          <span className="text-2xl font-bold text-[#840032]">
                            ₹{(item.productTypes[0]?.sellingPrice +
                              (productAddOnsCart.productVariant
                                ? item.productVariants.find(
                                    (i) =>
                                      i.name === productAddOnsCart.productVariant
                                  )?.priceModifier
                                : 0)) *
                              productAddOnsCart.tempQuantity}
                          </span>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
          
          {/* Action Buttons */}
          <div className="flex flex-row gap-3 justify-end items-center mt-6 pt-4 border-t border-gray-200">
            <button
              className="px-6 py-2.5 text-sm font-medium text-gray-700 bg-gray-100 rounded-lg hover:bg-gray-200 transition-colors focus:outline-none focus:ring-2 focus:ring-gray-300"
              onClick={() => {
                if (
                  productAddOnsCart.displayIndex + 1 ===
                  decor.productAddOns.length
                ) {
                  AddProductAddOnsToEvent({
                    tempCart: {
                      ...productAddOnsCart,
                      displayIndex: productAddOnsCart.displayIndex + 1,
                      tempQuantity: productAddOnsCart.quantity,
                      productVariant: "",
                    },
                  });
                } else {
                  setProductAddOnsCart({
                    ...productAddOnsCart,
                    displayIndex: productAddOnsCart.displayIndex + 1,
                    tempQuantity: productAddOnsCart.quantity,
                    productVariant: "",
                  });
                }
              }}
            >
              Skip This Add-on
            </button>
            <button
              className="px-6 py-2.5 text-sm font-medium text-white bg-[#840032] rounded-lg hover:bg-[#6d002a] transition-colors focus:outline-none focus:ring-2 focus:ring-[#840032]/50"
              onClick={() => {
                if (
                  productAddOnsCart.displayIndex + 1 ===
                  decor.productAddOns.length
                ) {
                  AddProductAddOnsToEvent({
                    tempCart: {
                      ...productAddOnsCart,
                      displayIndex: productAddOnsCart.displayIndex + 1,
                      productAddOns: [
                        ...productAddOnsCart.productAddOns,
                        {
                          _id: decor.productAddOns[
                            productAddOnsCart.displayIndex
                          ]?._id,
                          decor:
                            decor.productAddOns[productAddOnsCart.displayIndex],
                          quantity: productAddOnsCart.tempQuantity,
                          productVariant: productAddOnsCart.productVariant,
                        },
                      ],
                      tempQuantity: productAddOnsCart.quantity,
                      productVariant: "",
                    },
                  });
                } else {
                  setProductAddOnsCart({
                    ...productAddOnsCart,
                    displayIndex: productAddOnsCart.displayIndex + 1,
                    productAddOns: [
                      ...productAddOnsCart.productAddOns,
                      {
                        _id: decor.productAddOns[productAddOnsCart.displayIndex]
                          ?._id,
                        decor:
                          decor.productAddOns[productAddOnsCart.displayIndex],
                        quantity: productAddOnsCart.tempQuantity,
                        productVariant: productAddOnsCart.productVariant,
                      },
                    ],
                    tempQuantity: productAddOnsCart.quantity,
                    productVariant: "",
                  });
                }
              }}
            >
              Add to Event
            </button>
          </div>
        </Modal.Body>
      </Modal>
      {/* Cart Model - Platform & Flooring */}
      <Modal
        show={cart.open}
        size="lg"
        popup
        onClose={() =>
          setCart({
            ...cart,
            open: false,
            platform: false,
            flooring: "",
            dimensions: { length: 0, breadth: 0, height: 0 },
            price: 0,
            eventId: "",
            eventDayId: "",
          })
        }
      >
        <Modal.Header className="border-b border-gray-200">
          <h3 className="text-xl font-semibold text-gray-900">
            {cart.flooring === undefined ? "Add Platform" : "Select Flooring"}
          </h3>
        </Modal.Header>
        <Modal.Body className="p-6">
          <div className="space-y-6">
            {cart.flooring === undefined ? (
              <>
                {/* Platform Section */}
                <div className="flex flex-col md:flex-row gap-6 items-start">
                  <div className="w-full md:w-1/3 aspect-square rounded-xl overflow-hidden bg-gray-100">
                    <Image
                      src="/assets/images/platform.webp"
                      alt="Platform"
                      width={200}
                      height={200}
                      className="w-full h-full object-cover"
                    />
                  </div>
                  <div className="flex-1">
                    <h4 className="text-lg font-medium text-gray-900 mb-3">
                      Would you like to add a platform?
                    </h4>
                    <p className="text-sm text-gray-500 mb-4">
                      A platform elevates your decor setup for better visibility and presentation.
                    </p>
                    <div className="flex flex-row gap-3">
                      <button
                        className={`px-6 py-2.5 text-sm font-medium rounded-lg transition-all ${
                          cart.platform
                            ? "text-white bg-[#840032] shadow-md"
                            : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                        }`}
                        onClick={() => {
                          setCart({ ...cart, platform: true });
                        }}
                      >
                        Yes, Add Platform
                      </button>
                      <button
                        className={`px-6 py-2.5 text-sm font-medium rounded-lg transition-all ${
                          !cart.platform && cart.platform !== undefined
                            ? "text-white bg-gray-600 shadow-md"
                            : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                        }`}
                        onClick={() => {
                          AddToEvent({
                            quantity: cart.quantity,
                            eventDayId: cart.eventDayId,
                            eventId: cart.eventId,
                            platform: false,
                            flooring: "",
                            dimensions: {
                              length: 0,
                              breadth: 0,
                              height: 0,
                            },
                            price:
                              (decor?.productTypes?.find((i) => i.name === variant)
                                ?.sellingPrice +
                                (productVariant
                                  ? decor.productVariants.find(
                                      (i) => i.name === productVariant
                                    )?.priceModifier
                                  : 0)) *
                              cart.quantity,
                          });
                        }}
                      >
                        No, Continue
                      </button>
                    </div>
                  </div>
                </div>
                
                {/* Dimensions Input */}
                {cart.platform && (
                  <div className="bg-gray-50 rounded-xl p-5 border border-gray-200">
                    <h5 className="font-medium text-gray-900 mb-4">
                      Enter Platform Dimensions (in feet)
                    </h5>
                    <div className="grid grid-cols-3 gap-4 mb-4">
                      <div className="space-y-2">
                        <label className="text-sm font-medium text-gray-600">Length</label>
                        <TextInput
                          type="number"
                          placeholder="0"
                          required
                          value={cart.dimensions.length}
                          onChange={(e) => {
                            setCart({
                              ...cart,
                              dimensions: {
                                ...cart.dimensions,
                                length: e.target.value,
                              },
                            });
                          }}
                          disabled={cart.price > 0}
                        />
                      </div>
                      <div className="space-y-2">
                        <label className="text-sm font-medium text-gray-600">Breadth</label>
                        <TextInput
                          type="number"
                          placeholder="0"
                          required
                          value={cart.dimensions.breadth}
                          onChange={(e) => {
                            setCart({
                              ...cart,
                              dimensions: {
                                ...cart.dimensions,
                                breadth: e.target.value,
                              },
                            });
                          }}
                          disabled={cart.price > 0}
                        />
                      </div>
                      <div className="space-y-2">
                        <label className="text-sm font-medium text-gray-600">Height</label>
                        <TextInput
                          type="number"
                          placeholder="0"
                          required
                          value={cart.dimensions.height}
                          onChange={(e) => {
                            setCart({
                              ...cart,
                              dimensions: {
                                ...cart.dimensions,
                                height: e.target.value,
                              },
                            });
                          }}
                          disabled={cart.price > 0}
                        />
                      </div>
                    </div>
                    <button
                      className="w-full py-2.5 text-sm font-medium text-white bg-[#840032] rounded-lg hover:bg-[#6d002a] transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                      onClick={() => {
                        try {
                          let l = parseFloat(cart.dimensions.length);
                          let b = parseFloat(cart.dimensions.breadth);
                          let h = parseFloat(cart.dimensions.height);
                          if (l > 0 && b > 0 && h > 0) {
                            let cost = l * b * platformPrice.price;
                            let baseCost = (l + h) * (b + h);
                            setCart({
                              ...cart,
                              dimensions: {
                                length: l,
                                breadth: b,
                                height: h,
                              },
                              price: cost,
                              baseCost,
                            });
                          } else {
                            alert("Enter possible values");
                          }
                        } catch (e) {
                          alert("Error, try again");
                        }
                      }}
                      disabled={
                        !cart.dimensions.length ||
                        !cart.dimensions.breadth ||
                        !cart.dimensions.height
                      }
                    >
                      Calculate Price
                    </button>
                  </div>
                )}
                
                {/* Platform Price Result */}
                {cart.price > 0 && (
                  <div className="bg-gradient-to-r from-[#840032]/10 to-[#840032]/5 rounded-xl p-5 border border-[#840032]/20">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-sm text-gray-600">Platform Price</p>
                        <p className="text-2xl font-bold text-[#840032]">₹{cart.price}</p>
                      </div>
                      <button
                        className="px-6 py-2.5 text-sm font-medium text-white bg-[#840032] rounded-lg hover:bg-[#6d002a] transition-colors"
                        onClick={() => {
                          setCart({ ...cart, flooring: "" });
                        }}
                      >
                        Next: Select Flooring
                      </button>
                    </div>
                  </div>
                )}
              </>
            ) : (
              <div className="space-y-4">
                <p className="text-sm text-gray-500 mb-2">Choose a flooring type for your platform</p>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {flooringPrice?.map((item) => (
                    <div
                      className={`relative rounded-xl overflow-hidden border-2 transition-all cursor-pointer ${
                        cart.flooring === item.title
                          ? "border-[#840032] shadow-lg"
                          : "border-gray-200 hover:border-gray-300"
                      }`}
                      key={item.title}
                      onClick={() => {
                        setCart({
                          ...cart,
                          flooring: item.title,
                        });
                      }}
                    >
                      {item.image && (
                        <div className="aspect-video bg-gray-100">
                          <Image
                            src={item.image}
                            alt={item.title}
                            width={300}
                            height={200}
                            className="w-full h-full object-cover"
                          />
                        </div>
                      )}
                      <div className="p-4 flex items-center justify-between">
                        <div>
                          <p className="font-medium text-gray-900">{item.title}</p>
                          <p className="text-lg font-bold text-[#840032]">
                            ₹{cart.baseCost * item.price}
                          </p>
                        </div>
                        <div className={`w-6 h-6 rounded-full border-2 flex items-center justify-center ${
                          cart.flooring === item.title
                            ? "border-[#840032] bg-[#840032]"
                            : "border-gray-300"
                        }`}>
                          {cart.flooring === item.title && (
                            <svg className="w-4 h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />
                            </svg>
                          )}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
                
                {/* Total Price & Add Button */}
                {cart.flooring && (
                  <div className="mt-6 p-5 bg-gradient-to-r from-[#840032]/10 to-[#840032]/5 rounded-xl border border-[#840032]/20">
                    <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
                      <div>
                        <div className="flex items-center gap-2 mb-1">
                          <span className="text-sm text-gray-600">Total Price</span>
                          <Tooltip
                            content={`Decor: ₹${
                              (decor?.productTypes?.find(
                                (i) => i.name === variant
                              )?.sellingPrice +
                                (productVariant
                                  ? decor.productVariants.find(
                                      (i) => i.name === productVariant
                                    )?.priceModifier
                                  : 0)) *
                              cart.quantity
                            } + Platform: ₹${cart.price} + Flooring: ₹${
                              cart.baseCost *
                                flooringPrice.find(
                                  (i) => i.title === cart.flooring
                                )?.price || 0
                            }`}
                            trigger="hover"
                          >
                            <BsInfoCircle className="text-gray-400 hover:text-gray-600 cursor-pointer" />
                          </Tooltip>
                        </div>
                        <p className="text-3xl font-bold text-[#840032]">
                          ₹{(decor?.productTypes?.find((i) => i.name === variant)
                            ?.sellingPrice +
                            (productVariant
                              ? decor.productVariants.find(
                                  (i) => i.name === productVariant
                                )?.priceModifier
                              : 0)) *
                            cart.quantity +
                            cart.price +
                            (cart.baseCost *
                              flooringPrice.find((i) => i.title === cart.flooring)
                                ?.price || 0)}
                        </p>
                      </div>
                      <button
                        className="w-full md:w-auto px-8 py-3 text-sm font-medium text-white bg-[#840032] rounded-lg hover:bg-[#6d002a] transition-colors shadow-lg"
                        onClick={() => {
                          AddToEvent({
                            quantity: cart.quantity,
                            eventDayId: cart.eventDayId,
                            eventId: cart.eventId,
                            platform: true,
                            flooring: cart.flooring,
                            dimensions: cart.dimensions,
                            price:
                              (decor?.productTypes?.find(
                                (i) => i.name === variant
                              )?.sellingPrice +
                                (productVariant
                                  ? decor.productVariants.find(
                                      (i) => i.name === productVariant
                                    )?.priceModifier
                                  : 0)) *
                                cart.quantity +
                              cart.price +
                              (cart.baseCost *
                                flooringPrice.find(
                                  (i) => i.title === cart.flooring
                                )?.price || 0),
                          });
                        }}
                      >
                        Add to Event
                      </button>
                    </div>
                  </div>
                )}
              </div>
            )}
          </div>
        </Modal.Body>
      </Modal>
      {category.websiteView === "multiple" && (
        <>
          {/* Category Navigation - Scrollable */}
          <div className="w-full bg-white border-b border-gray-200 sticky top-0 z-30">
            <div className="relative">
              {/* Scroll container */}
              <div className="overflow-x-auto scrollbar-hide px-4 py-3">
                <div className="flex flex-row gap-3 flex-nowrap min-w-max">
                  {categoryList?.map((item) => (
                    <Link
                      href={`/decor/view?category=${encodeURIComponent(item.name)}`}
                      key={item._id}
                      className={`whitespace-nowrap rounded-full font-medium py-2 px-5 text-sm transition-all duration-200 flex-shrink-0 ${
                        item.name === category.name
                          ? "bg-[#840032] text-white shadow-md"
                          : "bg-gray-100 text-gray-700 hover:bg-gray-200 hover:shadow-sm"
                      }`}
                    >
                      {item.name}
                    </Link>
                  ))}
                </div>
              </div>
              {/* Right fade indicator for scroll */}
              <div className="absolute right-0 top-0 bottom-0 w-8 bg-gradient-to-l from-white to-transparent pointer-events-none hidden md:block" />
            </div>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-5 gap-8 py-8 md:pt-6 bg-[#F4F4F4]">
            <div className="hidden md:flex flex-col gap-6">
              <p className="text-xl font-medium text-center">DESCRIPTION</p>
              <div className="rounded-r-3xl bg-white shadow-md flex flex-col gap-2 p-4 px-6">
                <p className="text-lg font-medium">Backdrop size (ft)</p>
                <p className="text-sm font-normal flex flex-row justify-around">
                  {decor.productInfo.measurements.length > 0 && (
                    <span>L: {decor.productInfo.measurements.length} ft.</span>
                  )}
                  {decor.productInfo.measurements.width > 0 && (
                    <span>W: {decor.productInfo.measurements.width} ft.</span>
                  )}
                  {decor.productInfo.measurements.height > 0 && (
                    <span>H: {decor.productInfo.measurements.height} ft.</span>
                  )}
                </p>
              </div>
              <div className="rounded-r-3xl bg-white shadow-md flex flex-col gap-2 p-4 px-6">
                <p className="text-lg font-medium">Includes</p>
                <ul className="list-disc pl-8 flex flex-col text-sm font-normal">
                  {decor.productInfo.included.map((item, index) => (
                    <li key={index}>{toProperCase(item)}</li>
                  ))}
                </ul>
              </div>
            </div>
            <div className="flex flex-col gap-6 md:col-span-3">
              <div className="hidden md:flex items-center gap-3">
                <p className="text-2xl font-semibold tracking-wide uppercase">
                  {decor.category}
                </p>
                {["Stage", "Mandap", "Pathway", "Photobooth", "Entrance", "Nameboard"].some(
                  cat => cat.toLowerCase() === decor.category?.toLowerCase()
                ) && (
                  <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-semibold bg-[#840032] text-white shadow-md">
                    Customisable
                  </span>
                )}
              </div>
              <p className="md:hidden text-xl font-semibold mb-2 text-center">
                {decor.name} ({decor?.productInfo.id})
              </p>
              <div>
                {displayImage && (
                  <div
                    className="max-h-[500px] w-full bg-white flex items-center justify-center rounded-xl overflow-hidden shadow-lg decor-detail-image cursor-pointer"
                    onClick={() => {
                      const images = getAllImages();
                      const index = images.findIndex((img) => img === displayImage);
                      openLightbox(index >= 0 ? index : 0);
                    }}
                  >
                    <Image
                      src={displayImage}
                      alt={decor.name}
                      width={0}
                      height={0}
                      sizes="100vw"
                      style={{ width: "100%", height: "100%", maxHeight: "500px", objectFit: "contain" }}
                      className="transition-transform duration-300 hover:scale-105"
                    />
                  </div>
                )}
                {displayVideo && (
                  <video
                    src={displayVideo}
                    className="rounded-xl w-full object-contain overflow-hidden"
                    controls
                    autoPlay
                    muted
                    loop
                  >
                    Your browser does not support the video tag.
                  </video>
                )}
              </div>
              <div className="flex flex-row gap-3 items-center justify-center">
                {displayImage !== decor?.image && (
                  <img
                    src={decor?.image}
                    className="h-24 w-24 rounded-lg object-cover cursor-pointer"
                    onClick={() => {
                      setDisplayImage(decor?.image);
                      setDisplayVideo("");
                    }}
                  />
                )}
                {decor?.additionalImages
                  ?.filter((i) => i !== displayImage)
                  ?.map((item, index) => (
                    <img
                      src={item}
                      className="h-24 w-24 rounded-lg object-cover cursor-pointer"
                      key={index}
                      onClick={() => {
                        setDisplayImage(item);
                        setDisplayVideo("");
                      }}
                    />
                  ))}
                {displayImage && decor?.video && (
                  <div
                    className="relative h-24 w-24 cursor-pointer"
                    onClick={() => {
                      setDisplayImage("");
                      setDisplayVideo(decor?.video);
                    }}
                  >
                    <img
                      src={decor?.thumbnail}
                      className="w-full h-full object-cover rounded-lg"
                    />
                    <MdOutlinePlayCircle className="h-8 w-8 absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2" />
                  </div>
                )}
              </div>
              <div className="grid grid-cols-2 items-center md:hidden gap-2 px-8">
                {category?.multipleAllowed && (
                  <>
                    <p className="text-sm">Quantity</p>
                    <Select
                      value={cart.quantity}
                      onChange={(e) => {
                        setCart({ ...cart, quantity: e.target.value });
                      }}
                    >
                      {decor?.productInfo?.minimumOrderQuantity &&
                      decor?.productInfo?.maximumOrderQuantity ? (
                        <QuantityOptions
                          max={decor?.productInfo?.maximumOrderQuantity}
                          min={decor?.productInfo?.minimumOrderQuantity}
                        />
                      ) : (
                        <>
                          {Array.from(
                            { length: 30 },
                            (_, index) => index + 1
                          ).map((value) => (
                            <option key={value} value={value}>
                              {value}
                            </option>
                          ))}
                        </>
                      )}
                    </Select>
                  </>
                )}
                <div className="col-span-2 flex flex-col">
                  <AddToEventButton />
                </div>
              </div>
              <div className="md:bg-white md:rounded-3xl md:shadow-lg p-8 md:px-12 text-sm">
                {decor.description}
              </div>
              <div className="flex md:hidden flex-col gap-2 p-4 ">
                <p className="text-lg font-medium">Backdrop size (ft)</p>
                <p className="text-sm font-normal flex flex-row justify-around">
                  {decor.productInfo.measurements.length > 0 && (
                    <span>L: {decor.productInfo.measurements.length} ft.</span>
                  )}
                  {decor.productInfo.measurements.width > 0 && (
                    <span>W: {decor.productInfo.measurements.width} ft.</span>
                  )}
                  {decor.productInfo.measurements.height > 0 && (
                    <span>H: {decor.productInfo.measurements.height} ft.</span>
                  )}
                </p>
              </div>
              <div className="flex md:hidden flex-col gap-2 p-4 ">
                <p className="text-lg font-medium">Includes</p>
                <ul className="list-disc pl-8 flex flex-col text-sm font-normal">
                  {decor.productInfo.included.map((item, index) => (
                    <li key={index}>{toProperCase(item)}</li>
                  ))}
                </ul>
              </div>
            </div>
            <div className="fixed z-50 bottom-0 w-full flex md:hidden flex-row justify-between items-center gap-4 bg-white p-4">
              {decor.productTypes.filter((i) => i.name != variant).length ==
              0 ? (
                <span className="font-semibold text-rose-900 cursor-pointer flex items-center gap-1 uppercase bg-white w-fit text-sm">
                  {variant}
                </span>
              ) : (
                <Dropdown
                  renderTrigger={() => (
                    <span className="font-semibold text-rose-900 cursor-pointer flex items-center gap-1 uppercase bg-white w-fit text-sm">
                      {variant} <BsChevronDown />
                    </span>
                  )}
                  className="text-rose-900"
                >
                  {decor.productTypes
                    .filter((i) => i.name != variant)
                    .map((item) => (
                      <Dropdown.Item
                        onClick={() => {
                          setVariant(item.name);
                        }}
                        key={item.name}
                      >
                        {item.name}
                      </Dropdown.Item>
                    ))}
                </Dropdown>
              )}
              <p className="text-xl font-semibold text-right">
                ₹{" "}
                {(decor.productTypes.find((i) => i.name === variant)
                  ?.sellingPrice +
                  (productVariant
                    ? decor.productVariants.find(
                        (i) => i.name === productVariant
                      )?.priceModifier
                    : 0)) *
                  cart.quantity}
                {category?.multipleAllowed && `/${decor.unit}`}
              </p>
            </div>
            <div className="hidden md:flex flex-col gap-6">
              <p className="text-2xl font-semibold tracking-wide">&nbsp;</p>
              <div className="border-b-2 border-gray-500 pb-4">
                <p className="text-xl font-semibold mb-2">
                  {decor.name} ({decor?.productInfo.id})
                </p>
                <Rating size={"md"}>
                  {[null, null, null, null, null].map((i, index) => (
                    <Rating.Star
                      key={index}
                      filled={index + 1 <= decor.rating}
                    />
                  ))}
                </Rating>
              </div>
              <div className="border-b-2 border-gray-500 pb-4 flex flex-col gap-2">
                <p className="text-sm">Price for</p>
                {decor.productTypes.filter((i) => i.name != variant).length ==
                0 ? (
                  <span className="font-semibold text-rose-900 cursor-pointer flex items-center gap-1 uppercase bg-white p-3 w-fit text-sm shadow-md">
                    {variant}
                  </span>
                ) : (
                  <Dropdown
                    renderTrigger={() => (
                      <span className="font-semibold text-rose-900 cursor-pointer flex items-center gap-1 uppercase bg-white p-3 w-fit text-sm shadow-md rounded-md">
                        {variant} <BsChevronDown />
                      </span>
                    )}
                    className="text-rose-900"
                  >
                    {decor.productTypes
                      .filter((i) => i.name != variant)
                      .map((item) => (
                        <Dropdown.Item
                          onClick={() => {
                            setVariant(item.name);
                          }}
                          key={item.name}
                        >
                          {item.name}
                        </Dropdown.Item>
                      ))}
                  </Dropdown>
                )}
                <p className="text-xl font-semibold">
                  ₹{" "}
                  {
                    decor.productTypes.find((i) => i.name === variant)
                      ?.sellingPrice
                  }{" "}
                  {category?.multipleAllowed && `/${decor.unit}`}
                </p>
              </div>
              {category?.multipleAllowed && (
                <div className="border-b-2 border-gray-500 pb-4 flex flex-col gap-2">
                  <p className="text-sm">Quantity</p>
                  <Select
                    className="w-fit"
                    value={cart.quantity}
                    onChange={(e) => {
                      setCart({ ...cart, quantity: e.target.value });
                    }}
                  >
                    {decor?.productInfo?.minimumOrderQuantity &&
                    decor?.productInfo?.maximumOrderQuantity ? (
                      <QuantityOptions
                        max={decor?.productInfo?.maximumOrderQuantity}
                        min={decor?.productInfo?.minimumOrderQuantity}
                      />
                    ) : (
                      <>
                        {Array.from(
                          { length: 30 },
                          (_, index) => index + 1
                        ).map((value) => (
                          <option key={value} value={value}>
                            {value}
                          </option>
                        ))}
                      </>
                    )}
                  </Select>
                </div>
              )}
              <div className="flex flex-col gap-4 pr-8">
                <WishlistButton />
                <AddToEventButton />
              </div>
            </div>
          </div>
        </>
      )}
      {category.websiteView === "single" && (
        <>
          <div className="relative grid grid-cols-1 md:grid-cols-4 gap-8 py-8 decor-bg-image border-b-2 border-b-white">
            <div className="hidden md:flex flex-col gap-6">
              <div className="rounded-r-3xl bg-white shadow-md flex flex-col gap-2 p-8 my-4 ">
                <p className="text-lg font-medium">About</p>
                <ul className="list-disc pl-8 flex flex-col gap-2 text-sm font-normal">
                  {decor.description.split("\n").map((i, index) => (
                    <li key={index}>{i}</li>
                  ))}
                </ul>
              </div>
            </div>
            <div className="flex flex-col gap-6 md:col-span-2 md:px-8 md:mx-6 md:border-x-4 md:border-x-white">
              <p className="text-2xl font-semibold text-center tracking-wide uppercase">
                {decor.name} ({decor?.productInfo.id})
              </p>
              <div
                className="max-h-[500px] w-full bg-white flex items-center justify-center rounded-xl overflow-hidden mx-8 md:mx-16 cursor-pointer"
                onClick={() => {
                  const currentImage = productVariant
                    ? decor.productVariants.find(
                        (i) => i.name === productVariant
                      )?.image
                    : decor?.image;
                  const images = getAllImages();
                  const index = currentImage && images.includes(currentImage)
                    ? images.findIndex((img) => img === currentImage)
                    : 0;
                  openLightbox(index >= 0 ? index : 0);
                }}
              >
                <Image
                  src={
                    productVariant
                      ? decor.productVariants.find(
                          (i) => i.name === productVariant
                        )?.image
                      : decor?.image
                  }
                  alt={decor.name}
                  width={0}
                  height={0}
                  sizes="100vw"
                  style={{ width: "100%", height: "100%", maxHeight: "500px", objectFit: "contain" }}
                  className="transition-transform duration-300 hover:scale-105"
                />
              </div>
            </div>
            <div className="grid grid-cols-2 items-center md:hidden gap-2 px-8">
              {category?.multipleAllowed && (
                <>
                  <p className="text-sm">Quantity</p>
                  <Select
                    value={cart.quantity}
                    onChange={(e) => {
                      setCart({ ...cart, quantity: e.target.value });
                    }}
                  >
                    {decor?.productInfo?.minimumOrderQuantity &&
                    decor?.productInfo?.maximumOrderQuantity ? (
                      <QuantityOptions
                        max={decor?.productInfo?.maximumOrderQuantity}
                        min={decor?.productInfo?.minimumOrderQuantity}
                      />
                    ) : (
                      <>
                        {Array.from(
                          { length: 30 },
                          (_, index) => index + 1
                        ).map((value) => (
                          <option key={value} value={value}>
                            {value}
                          </option>
                        ))}
                      </>
                    )}
                  </Select>
                </>
              )}
              {decor.productVariants.length > 0 && (
                <>
                  <p className="text-sm">Options</p>
                  <Select
                    value={productVariant}
                    onChange={(e) => setProductVariant(e.target.value)}
                  >
                    <option value={""}>Select</option>
                    {decor.productVariants.map((item, index) => (
                      <option key={index} value={item.name}>
                        {item.name}
                      </option>
                    ))}
                  </Select>
                </>
              )}
              <div className="col-span-2 flex flex-col">
                <AddToEventButton />
              </div>
            </div>
            <div className="flex md:hidden flex-col gap-2 mp-4 p-8">
              <p className="text-lg font-medium">About</p>
              <ul className="list-disc pl-8 flex flex-col gap-2 text-sm font-normal">
                <li>{decor.description}</li>
              </ul>
            </div>
            <div className="fixed z-50 bottom-0 w-full grid md:hidden grid-cols-2 gap-4 bg-white p-4">
              <p className="text-xl font-semibold text-rose-900">
                ₹{" "}
                {decor.productTypes.find((i) => i.name === variant)
                  ?.sellingPrice +
                  (productVariant
                    ? decor.productVariants.find(
                        (i) => i.name === productVariant
                      )?.priceModifier
                    : 0)}{" "}
                <span className="text-sm font-normal">per {decor.unit}</span>
              </p>
              <p className="text-xl font-semibold text-right">
                Total &nbsp;&nbsp;₹{" "}
                {(decor.productTypes.find((i) => i.name === variant)
                  ?.sellingPrice +
                  (productVariant
                    ? decor.productVariants.find(
                        (i) => i.name === productVariant
                      )?.priceModifier
                    : 0)) *
                  cart.quantity}
              </p>
            </div>
            <div className="hidden md:flex flex-col gap-6">
              <div className="rounded-l-3xl bg-white shadow-md flex flex-col gap-4 p-8 my-4">
                <div className="border-b-2 border-gray-500 pb-2">
                  <p className="text-xl font-semibold">
                    ₹{" "}
                    {decor.productTypes.find((i) => i.name === variant)
                      ?.sellingPrice +
                      (productVariant
                        ? decor.productVariants.find(
                            (i) => i.name === productVariant
                          )?.priceModifier
                        : 0)}{" "}
                    <span className="text-sm font-normal">
                      per {decor.unit}
                    </span>
                  </p>
                </div>
                {decor.productVariants.length > 0 && (
                  <div className="border-b-2 border-gray-500 pb-2 grid grid-cols-2 items-center">
                    <p className="text-sm">Options</p>
                    <Select
                      value={productVariant}
                      onChange={(e) => setProductVariant(e.target.value)}
                    >
                      <option value={""}>Select</option>
                      {decor.productVariants.map((item, index) => (
                        <option key={index} value={item.name}>
                          {item.name}
                        </option>
                      ))}
                    </Select>
                  </div>
                )}
                <div className="border-b-2 border-gray-500 pb-2 grid grid-cols-2 items-center gap-y-4">
                  {category?.multipleAllowed && (
                    <>
                      <p className="text-sm">Quantity</p>
                      <Select
                        value={cart.quantity}
                        onChange={(e) => {
                          setCart({ ...cart, quantity: e.target.value });
                        }}
                      >
                        {decor?.productInfo?.minimumOrderQuantity &&
                        decor?.productInfo?.maximumOrderQuantity ? (
                          <QuantityOptions
                            max={decor?.productInfo?.maximumOrderQuantity}
                            min={decor?.productInfo?.minimumOrderQuantity}
                          />
                        ) : (
                          <>
                            {Array.from(
                              { length: 30 },
                              (_, index) => index + 1
                            ).map((value) => (
                              <option key={value} value={value}>
                                {value}
                              </option>
                            ))}
                          </>
                        )}
                      </Select>
                    </>
                  )}
                  <p className="text-sm">Total Price</p>
                  <p className="text-xl font-semibold">
                    ₹{" "}
                    {(decor.productTypes.find((i) => i.name === variant)
                      ?.sellingPrice +
                      (productVariant
                        ? decor.productVariants.find(
                            (i) => i.name === productVariant
                          )?.priceModifier
                        : 0)) *
                      cart.quantity}
                  </p>
                </div>
                <AddToEventButton />
              </div>
            </div>
          </div>
        </>
      )}
      <SimilarDecor similarDecor={similarDecor} />
    </>
  );
}

export async function getServerSideProps(context) {
  try {
    const { decor_id } = context.params;
    
    // First fetch the decor to get its category
    const decorResponse = await fetch(
      `${process.env.NEXT_PUBLIC_API_URL}/decor/${decor_id}?populate=productAddOns`
    );
    const decor = await decorResponse.json();
    
    if (!decor || decorResponse.status !== 200) {
      return {
        redirect: {
          permanent: false,
          destination: "/decor/view",
        },
      };
    }
    
    // Fetch similar decor filtered by the same category
    const similarDecorResponse = await fetch(
      `${process.env.NEXT_PUBLIC_API_URL}/decor?similarDecorFor=${decor_id}&category=${encodeURIComponent(decor.category)}`
    );
    const similarDecor = await similarDecorResponse.json();
    
    const categoryResponse = await fetch(
      `${process.env.NEXT_PUBLIC_API_URL}/category`
    );
    const categoryList = await categoryResponse.json();
    const category = categoryList.find((i) => i.name === decor.category);
    return {
      props: {
        similarDecor: similarDecor.list,
        decor,
        category,
        categoryList,
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
