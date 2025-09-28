import { AiFillHeart, AiOutlineHeart } from "react-icons/ai";
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
import Image from "next/image";
import { useEffect, useState } from "react";
import { BsChevronDown, BsInfoCircle } from "react-icons/bs";
import { useRouter } from "next/router";
import { toProperCase } from "@/utils/text";
import Head from "next/head";
import DecorDisclaimer from "@/components/marquee/DecorDisclaimer";
import ImageFillCard from "@/components/cards/ImageFillCard";
import SimilarDecor from "@/components/screens/SimilarDecor";
import CreateEventModal from "@/components/modal/CreateEventModal";
import Link from "next/link";
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
          alert("Decor added to wishlist!");
        }
      })
      .catch((error) => {
        console.error("There was a problem with the fetch operation:", error);
      });
  };
  const RemoveFromWishList = () => {
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
          setIsAddedToWishlist(false);
          alert("Decor removed from wishlist!");
        }
      })
      .catch((error) => {
        console.error("There was a problem with the fetch operation:", error);
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
          alert("Item added to event!");
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
          alert("Addons added to event!");
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
          alert("Item remove from event!");
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
        className={`focus:outline-none focus:ring-0 outline-none bg-white enabled:hover:bg-white text-black shadow-md`}
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
        {isAddedToWishlist ? (
          <AiFillHeart size={20} className="text-rose-900" />
        ) : (
          <AiOutlineHeart size={20} className="text-rose-900" />
        )}
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

  return (
    <>
      <Head>
        <title>{decor.name} | Wedsy</title>
        <meta name="description" content={decor?.seoTags?.description} />
        <meta property="og:title" content={decor.name} />
        <meta property="og:description" content={decor?.seoTags?.description} />
        <meta property="og:image" content={decor?.seoTags?.image} />
        <link
          rel="canonical"
          href={`https://www.wedsy.in/decor/view/${decor_id}`}
        />
      </Head>
      <CreateEventModal
        showEventModal={showEventModal}
        setShowEventModal={setShowEventModal}
        userLoggedIn={userLoggedIn}
        setOpenLoginModal={setOpenLoginModal}
        fetchEvents={fetchEvents}
      />
      <DecorDisclaimer />
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
        <Modal.Header>
          <h3 className="text-xl font-medium text-gray-900 dark:text-white px-4">
            Add-ons &nbsp;
            <span className="text-sm">
              ({productAddOnsCart.displayIndex + 1}/{decor.productAddOns.length}
              )
            </span>
          </h3>
        </Modal.Header>
        <Modal.Body>
          {decor.productAddOns[productAddOnsCart.displayIndex]?._id &&
            decor.productAddOns
              ?.filter((_, i) => i === productAddOnsCart.displayIndex)
              ?.map((item, index) => (
                <div className="space-y-6" key={item._id}>
                  <p>
                    {item.name}: &nbsp;{" "}
                    <span className="text-rose-900">
                      ₹{" "}
                      {item.productTypes[0]?.sellingPrice +
                        (productAddOnsCart.productVariant
                          ? item.productVariants.find(
                              (i) => i.name === productAddOnsCart.productVariant
                            )?.priceModifier
                          : 0)}
                    </span>
                  </p>
                  <div className="grid grid-cols-2 gap-2">
                    <img
                      src={
                        productAddOnsCart.productVariant
                          ? item.productVariants.find(
                              (i) => i.name === productAddOnsCart.productVariant
                            )?.image
                          : item?.image
                      }
                    />
                    <div className="grid grid-cols-2 gap-2">
                      <p className="text-right">Variant</p>
                      <Select
                        value={productAddOnsCart.productVariant}
                        onChange={(e) =>
                          setProductAddOnsCart({
                            ...productAddOnsCart,
                            productVariant: e.target.value,
                          })
                        }
                      >
                        <option value={""}>Select</option>
                        {item.productVariants.map((item, index) => (
                          <option key={index} value={item.name}>
                            {item.name}
                          </option>
                        ))}
                      </Select>
                      <p className="text-right">Quantity</p>
                      <Select
                        value={productAddOnsCart.tempQuantity}
                        onChange={(e) => {
                          setProductAddOnsCart({
                            ...productAddOnsCart,
                            tempQuantity: e.target.value,
                          });
                        }}
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
                      <div className="col-span-2 border-t border-t-rose-900 grid grid-cols-2 gap-2">
                        <p className="text-right">Total</p>
                        <p className="text-rose-900">
                          ₹{" "}
                          {(item.productTypes[0]?.sellingPrice +
                            (productAddOnsCart.productVariant
                              ? item.productVariants.find(
                                  (i) =>
                                    i.name === productAddOnsCart.productVariant
                                )?.priceModifier
                              : 0)) *
                            productAddOnsCart.tempQuantity}
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
          <div className="border-t mt-6 pt-3 flex flex-row gap-4 justify-center items-center">
            <button
              className={`text-rose-900 bg-white border border-rose-900 hover:bg-rose-900 hover:text-white font-medium rounded-lg text-sm px-6 py-1 focus:outline-none`}
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
              Skip
            </button>
            <button
              className={`text-white bg-rose-900 border border-rose-900 hover:bg-rose-900 hover:text-white font-medium rounded-lg text-sm px-6 py-1 focus:outline-none`}
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
              Add
            </button>
          </div>
        </Modal.Body>
      </Modal>
      {/* Cart Model */}
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
        <Modal.Header>
          <h3 className="text-xl font-medium text-gray-900 dark:text-white px-4">
            Product add-ons
          </h3>
        </Modal.Header>
        <Modal.Body>
          <div className="space-y-6">
            {cart.flooring === undefined ? (
              <>
                <Image
                  src="/assets/images/platform.png"
                  alt="Platform"
                  width={0}
                  height={0}
                  sizes="100%"
                  style={{ width: "50%", height: "auto" }}
                />
                <div className="flex flex-row items-center gap-2">
                  <p>Do you want to add a platform?</p>
                  <button
                    className={`${
                      cart.platform
                        ? "text-white bg-rose-900"
                        : "bg-white text-rose-900"
                    }  border border-rose-900 hover:bg-rose-900 hover:text-white font-medium rounded-lg text-sm px-3 py-1.5 focus:outline-none`}
                    onClick={() => {
                      setCart({ ...cart, platform: true });
                    }}
                  >
                    Yes
                  </button>
                  <button
                    className={`${
                      !cart.platform && cart.platform !== undefined
                        ? "text-white bg-rose-900"
                        : "bg-white text-rose-900"
                    } border border-rose-900 hover:bg-rose-900 hover:text-white font-medium rounded-lg text-sm px-3 py-1.5 focus:outline-none`}
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
                    No
                  </button>
                </div>
                {cart.platform && (
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
                      <div className="flex flex-col">
                        <p>Breadth</p>
                        <TextInput
                          type="number"
                          placeholder="breadth"
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
                      <div className="flex flex-col">
                        <p>Height</p>
                        <TextInput
                          type="number"
                          placeholder="height"
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
                      <div className="flex flex-col">
                        <button
                          className={`mt-auto text-white bg-rose-900 border border-rose-900 hover:bg-rose-900 hover:text-white font-medium rounded-lg text-sm px-3 py-2.5 focus:outline-none`}
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
                          Calculate
                        </button>
                      </div>
                    </div>
                  </div>
                )}
                {cart.price > 0 && (
                  <div className="border-t border-t-black pt-2 flex flex-row gap-2">
                    <p className="font-medium flex flex-col">
                      <span>Platform Price: </span>
                      <span className="text-rose-900 font-semibold">
                        ₹{cart.price}
                      </span>
                    </p>
                    <div className="flex flex-col ml-auto">
                      <button
                        className={`mt-auto text-white bg-rose-900 border border-rose-900 hover:bg-rose-900 hover:text-white font-medium rounded-lg text-sm px-3 py-2.5 focus:outline-none`}
                        onClick={() => {
                          setCart({ ...cart, flooring: "" });
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
                {flooringPrice?.map((item) => (
                  <div
                    className="font-medium flex flex-row gap-4 items-center justify-between"
                    key={item.title}
                  >
                    {item.image && (
                      <Image
                        src={item.image}
                        alt="Platform"
                        width={0}
                        height={0}
                        sizes="100%"
                        style={{ width: "30%", height: "auto" }}
                      />
                    )}
                    <p className="font-medium flex flex-col items-center">
                      <span>{item.title}</span>
                      <span className="text-rose-900 font-semibold">
                        ₹{cart.baseCost * item.price}
                      </span>
                    </p>
                    <div className="flex flex-col">
                      <button
                        className={`${
                          cart.flooring === item.title
                            ? "text-white bg-rose-900"
                            : "bg-white text-rose-900"
                        } hover:text-white border border-rose-900 hover:bg-rose-900 hover:text-white font-medium rounded-lg text-sm px-3 py-2.5 focus:outline-none`}
                        onClick={() => {
                          setCart({
                            ...cart,
                            flooring: item.title,
                          });
                        }}
                      >
                        {cart.flooring === item.title ? "Selected" : "Select"}
                      </button>
                    </div>
                  </div>
                ))}
                {cart.flooring && (
                  <div className="flex flex-row items-center justify-between">
                    <p className="font-medium flex flex-col">
                      <span className="flex flex-row gap-2 items-center">
                        Total Price:{" "}
                        <Tooltip
                          content={`${
                            (decor?.productTypes?.find(
                              (i) => i.name === variant
                            )?.sellingPrice +
                              (productVariant
                                ? decor.productVariants.find(
                                    (i) => i.name === productVariant
                                  )?.priceModifier
                                : 0)) *
                            cart.quantity
                          } + ${cart.price} + ${
                            cart.baseCost *
                              flooringPrice.find(
                                (i) => i.title === cart.flooring
                              )?.price || 0
                          }`}
                          trigger="hover"
                        >
                          <BsInfoCircle />
                        </Tooltip>
                      </span>
                      <span className="text-rose-900 font-semibold">
                        ₹
                        {(decor?.productTypes?.find((i) => i.name === variant)
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
                      </span>
                    </p>
                    <button
                      className={`text-white bg-rose-900 border border-rose-900 hover:bg-rose-900 hover:text-white font-medium rounded-lg text-sm px-3 py-2.5 focus:outline-none`}
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
                )}
              </div>
            )}
          </div>
        </Modal.Body>
      </Modal>
      {category.websiteView === "multiple" && (
        <>
          <div className="grid grid-cols-1 md:grid-cols-5 gap-8 py-8 md:pt-3 bg-[#F4F4F4]">
            <div className="hidden md:flex col-span-5 flex-row gap-4 -mb-8 translate-x-1/2 w-2/3">
              {categoryList
                ?.filter((i) => i.name !== category.name)
                ?.map((item) => (
                  <div
                    className="bg-white rounded-full font-medium py-2 px-4 text-sm shadow-lg"
                    key={item._id}
                  >
                    <Link
                      href={`/decor/view?category=${item.name}`}
                      target="_blank"
                    >
                      {item.name}
                    </Link>
                  </div>
                ))}
            </div>
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
              <p className="hidden md:block text-2xl font-semibold tracking-wide uppercase">
                {decor.category}
              </p>
              <p className="md:hidden text-xl font-semibold mb-2 text-center">
                {decor.name} ({decor?.productInfo.id})
              </p>
              <div className={`relative pt-[56.25%] `}>
                {displayImage && (
                  <ImageFillCard
                    src={displayImage}
                    objectFit="cover"
                    className="md:rounded-xl overflow-hidden shadow-lg decor-detail-image"
                   // imageClassName="rounded-xl"
                  />
                )}
                {displayVideo && (
                  <video
                    src={displayVideo}
                    className="md:rounded-xl w-full h-full object-contain overflow-hidden absolute top-0"
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
              <div className={`relative pt-[75%] mx-8 md:mx-16`}>
                <ImageFillCard
                  src={
                    productVariant
                      ? decor.productVariants.find(
                          (i) => i.name === productVariant
                        )?.image
                      : decor?.image
                  }
                  objectFit="cover"
                 className="md:rounded-xl overflow-hidden decor-detail-image shadow-md"
                 // imageClassName="rounded-xl"
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
              <div className="rounded-l-3xl bg-white shadow-md flex flex-col gap-2 p-8 my-4 flex flex-col gap-4">
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
    const similarDecorResponse = await fetch(
      `${process.env.NEXT_PUBLIC_API_URL}/decor?similarDecorFor=${decor_id}`
    );
    const similarDecor = await similarDecorResponse.json();
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
