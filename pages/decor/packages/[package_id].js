import { AiFillHeart } from "react-icons/ai";
import {
  Button,
  Checkbox,
  Dropdown,
  Label,
  Modal,
  Rating,
  Select,
  Table,
  TextInput,
  Tooltip,
} from "flowbite-react";
import Image from "next/image";
import SearchBar from "@/components/searchBar/SearchBar";
import { useEffect, useState } from "react";
import {
  BsArrowLeftShort,
  BsArrowRightShort,
  BsChevronDown,
  BsInfoCircle,
} from "react-icons/bs";
import { useRouter } from "next/router";
import Link from "next/link";
import { toProperCase } from "@/utils/text";
import Head from "next/head";
import DecorPackageCard from "@/components/cards/DecorPackageCard";
import DecorDisclaimer from "@/components/marquee/DecorDisclaimer";

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

function DecorListing({
  similarDecorPackages,
  decorPackage,
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
  return (
    <>
      <Head>
        <title>{decorPackage.name} | Wedsy</title>
        <meta name="description" content={decorPackage?.seoTags?.description} />
        <meta property="og:title" content={decorPackage.name} />
        <meta
          property="og:description"
          content={decorPackage?.seoTags?.description}
        />
        <meta property="og:image" content={decorPackage?.seoTags?.image} />
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
      <div className="p-6 md:py-16 md:px-24">
        <p className="font-semibold text-2xl md:text-4xl text-rose-900 mb-3">
          {decorPackage.name}
        </p>
        <div className="grid md:grid-cols-3 gap-8 mb-3">
          <div
            className={`p-6 border bg-white shadow-md flex flex-col gap-2 rounded-xl border-b-4 border-b-rose-900`}
          >
            <div className={`grid grid-cols-2 gap-2`}>
              {decorPackage.decor
                .map((item) => item.thumbnail)
                .map((item, index) => (
                  <div className="relative pt-[100%]" key={index}>
                    <Image
                      key={index}
                      src={`${item}`}
                      alt="Decor"
                      sizes="50%"
                      layout={"fill"}
                      objectFit="cover"
                      className="rounded-md"
                    />
                  </div>
                ))}
            </div>
            <p className="font-semibold">{decorPackage.name}</p>
            <p className="">
              {decorPackage.decor.map((item) => item.category).join(", ")}
            </p>
            <p className="flex">
              Price for &nbsp;
              {decorPackage.variant.artificialFlowers.sellingPrice > 0 ? (
                <Dropdown
                  inline
                  renderTrigger={() => (
                    <span className="font-semibold text-rose-900 cursor-pointer flex items-center gap-1">
                      {variant === "artificialFlowers"
                        ? "Artificial"
                        : variant === "naturalFlowers"
                        ? "Natural"
                        : variant === "mixedFlowers"
                        ? "Mixed"
                        : ""}{" "}
                      Flowers <BsChevronDown />
                    </span>
                  )}
                  className="text-rose-900"
                >
                  {decorPackage.variant.artificialFlowers.sellingPrice > 0 &&
                    variant !== "artificialFlowers" && (
                      <Dropdown.Item
                        onClick={() => {
                          setVariant("artificialFlowers");
                        }}
                      >
                        Artifical Flowers
                      </Dropdown.Item>
                    )}
                  {decorPackage.variant.naturalFlowers.sellingPrice > 0 &&
                    variant !== "naturalFlowers" && (
                      <Dropdown.Item
                        onClick={() => {
                          setVariant("naturalFlowers");
                        }}
                      >
                        Natural Flowers
                      </Dropdown.Item>
                    )}
                  {decorPackage.variant.mixedFlowers.sellingPrice > 0 &&
                    variant !== "mixedFlowers" && (
                      <Dropdown.Item
                        onClick={() => {
                          setVariant("mixedFlowers");
                        }}
                      >
                        Mixed Flowers
                      </Dropdown.Item>
                    )}
                </Dropdown>
              ) : (
                <span className="font-semibold text-rose-900 flex items-center gap-1">
                  {variant === "artificialFlowers"
                    ? "Artificial"
                    : variant === "naturalFlowers"
                    ? "Natural"
                    : variant === "mixedFlowers"
                    ? "Mixed"
                    : ""}{" "}
                  Flowers
                </span>
              )}
            </p>
            <p className="font-semibold text-xl">
              ₹ {decorPackage.variant[variant].sellingPrice}
            </p>
            <div className="flex flex-row flex-wrap gap-4 items-center justify-start mt-3">
              <Dropdown
                inline
                arrowIcon={false}
                dismissOnClick={false}
                label={
                  <button
                    type="button"
                    className="text-white bg-rose-900 hover:bg-rose-900 font-medium rounded-lg text-sm px-5 py-2.5 focus:outline-none"
                    onClick={() => {
                      if (!userLoggedIn) {
                        setOpenLoginModal(true);
                      }
                    }}
                  >
                    Add to Event
                  </button>
                }
                className="border border-black rounded-lg bg-black"
              >
                <Dropdown.Item className="text-white">Event List</Dropdown.Item>
                {eventList?.map((item) => (
                  <>
                    <Dropdown.Divider className="bg-black h-[1px] my-0" />
                    <Dropdown.Item
                      className="bg-white flex flex-row gap-4"
                      as="p"
                    >
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
                            rec.packages.filter((i) => i.package === package_id)
                              .length > 0
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
                                decorItems: decorPackage.decor.map(
                                  (tempItem, tempIndex) => ({
                                    quantity: 1,
                                    unit: tempItem.unit,
                                    decor: tempItem._id,
                                    platform: [
                                      "Stage",
                                      "Photobooth",
                                      "Mandap",
                                    ].includes(tempItem.category)
                                      ? undefined
                                      : false,
                                    flooring: [
                                      "Stage",
                                      "Photobooth",
                                      "Mandap",
                                    ].includes(tempItem.category)
                                      ? undefined
                                      : "",
                                    dimensions: {
                                      length: 0,
                                      breadth: 0,
                                      height: 0,
                                    },
                                    category: tempItem.category,
                                    baseCost: 0,
                                  })
                                ),
                              });
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
                  as={Link}
                  href="/event"
                  className="bg-white text-cyan-600"
                >
                  + Create New Event
                </Dropdown.Item>
              </Dropdown>
              <button
                className={`${
                  isAddedToWishlist
                    ? "text-rose-900 bg-white hover:bg-white"
                    : "text-white bg-rose-900 hover:bg-rose-900"
                } cursor-pointer px-5 py-2.5 focus:outline-none rounded-lg border-rose-900 border `}
                onClick={() => {
                  if (userLoggedIn) {
                    isAddedToWishlist ? RemoveFromWishList() : AddToWishlist();
                  } else {
                    setOpenLoginModal(true);
                  }
                }}
              >
                <AiFillHeart size={20} />
              </button>
            </div>
          </div>
          <div className="hidden md:block col-span-2">
            <p className="font-semibold text-2xl md:text-3xl mb-2">
              Similar Packages
            </p>
            <div className="grid grid-cols-3 gap-4">
              <DecorPackageCard decorPackage={decorPackage} />
              <DecorPackageCard decorPackage={decorPackage} />
              <DecorPackageCard decorPackage={decorPackage} />
            </div>
          </div>
        </div>
        <div className="flex flex-col gap-3 mt-16 mb-3">
          {decorPackage.decor.map((item, index) => (
            <div className="" key={index}>
              <p className="font-semibold text-2xl md:text-2xl mb-2 text-rose-900">
                {item.category}: {item.name}
              </p>
              <div className="grid md:grid-cols-3 gap-2 md:gap-6">
                <div className="order-last md:order-first border-b pb-2 md:pb-0 md:border-b-0 border-black flex flex-col md:divide-y gap-2 md:divide-black md:pr-6">
                  <p className="text-xl font-medium hidden md:block">
                    Description
                  </p>
                  {item.category !== "Mandap" && (
                    <div className="flex flex-col px-4 md:px-0">
                      <p className="text-lg flex flex-row justify-between">
                        Can be used for
                      </p>
                      <ul className="list-disc pl-4 flex flex-col gap-1">
                        {item.productVariation.occassion.map((rec, index) => (
                          <li className="" key={index}>
                            {toProperCase(rec)}
                          </li>
                        ))}
                      </ul>
                    </div>
                  )}
                  <div className="flex flex-col px-4 md:px-0 ">
                    <p className="text-lg flex flex-row justify-between">
                      Included
                    </p>
                    <ul className="list-disc pl-4 flex flex-col gap-1">
                      {item.productInfo.included.map((rec, index) => (
                        <li className="" key={index}>
                          {toProperCase(rec)}
                        </li>
                      ))}
                    </ul>
                  </div>
                  <div className="flex flex-col px-4 md:px-0 ">
                    <p className="text-lg flex flex-row justify-between">
                      Sizes:
                    </p>
                    <ul className="list-disc pl-4 flex flex-col gap-1">
                      {item.productInfo.measurements.length > 0 && (
                        <li>
                          Length: {item.productInfo.measurements.length} ft.
                        </li>
                      )}
                      {item.productInfo.measurements.width > 0 && (
                        <li>
                          Width: {item.productInfo.measurements.width} ft.
                        </li>
                      )}
                      {item.productInfo.measurements.height > 0 && (
                        <li>
                          Height: {item.productInfo.measurements.height} ft.
                        </li>
                      )}
                    </ul>
                  </div>
                </div>
                <div className="relative md:col-span-2 md:px-12">
                  <Image
                    src={item.image}
                    alt="Decor"
                    width={0}
                    height={0}
                    sizes="100%"
                    style={{ width: "100%", height: "auto" }}
                    className="rounded-xl"
                  />
                </div>
              </div>
            </div>
          ))}
        </div>
        <div className="md:w-1/3 mx-auto mt-6">
          <Table className="border mx-auto">
            <Table.Body className="divide-y">
              {decorPackage.decor?.map((item, index) => (
                <Table.Row
                  className="bg-white dark:border-gray-700 dark:bg-gray-800"
                  key={index}
                >
                  <Table.Cell>{index + 1}</Table.Cell>
                  <Table.Cell className="whitespace-nowrap font-medium text-gray-900 dark:text-white">
                    [{item.category}] {item.name}
                  </Table.Cell>
                  <Table.Cell>₹{item.price}</Table.Cell>
                </Table.Row>
              ))}
              <Table.Row className="bg-white dark:border-gray-700 dark:bg-gray-800">
                <Table.Cell></Table.Cell>
                <Table.Cell className="text-right whitespace-nowrap font-medium text-gray-900 dark:text-white">
                  Total
                </Table.Cell>
                <Table.Cell>₹</Table.Cell>
              </Table.Row>
            </Table.Body>
          </Table>
        </div>
      </div>
    </>
  );
}

export async function getServerSideProps(context) {
  try {
    const { package_id } = context.params;
    const response = await fetch(
      `${process.env.NEXT_PUBLIC_API_URL}/decor-package`
    );
    const similarDecorPackages = await response.json();
    const decorPackageResponse = await fetch(
      `${process.env.NEXT_PUBLIC_API_URL}/decor-package/${package_id}`
    );
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
        similarDecorPackages: similarDecorPackages.list,
        decorPackage,
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
