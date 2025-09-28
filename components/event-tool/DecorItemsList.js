import { Button, Dropdown, Label, Select, Tooltip } from "flowbite-react";
import Image from "next/image";
import { AiOutlinePlus } from "react-icons/ai";
import { BsChevronDown, BsInfoCircle } from "react-icons/bs";
import { MdDelete, MdNote, MdNotes, MdOutlineImage } from "react-icons/md";
import ImageFillCard from "../cards/ImageFillCard";
import { toPriceString } from "@/utils/text";

export default function DecorItemsList({
  decorItems,
  categoryList,
  status,
  RemoveDecorFromEvent,
  setNotes,
  event_id,
  eventDay,
  allowEdit,
  platformPrice,
  flooringPrice,
  UpdateDecorItemInEvent,
  setupLocationImage,
  setSetupLocationImage,
}) {
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
      {decorItems.length > 0 && (
        <>
          {decorItems
            ?.filter(
              (i) =>
                categoryList?.find((r) => r.name === i.category)
                  ?.adminEventToolView === "single"
            )
            ?.sort(
              (a, b) =>
                [
                  "Nameboard",
                  "Entrance",
                  "Pathway",
                  "Photobooth",
                  "Stage",
                  "Mandap",
                ].indexOf(a.category) -
                [
                  "Nameboard",
                  "Entrance",
                  "Pathway",
                  "Photobooth",
                  "Stage",
                  "Mandap",
                ].indexOf(b.category)
            )
            ?.map((item) => (
              <div
                className="flex flex-col gap-4 mt-8 pt-2 border-b border-b-black"
                key={item._id}
                data-key={`decor-${item.decor._id}`}
              >
                <div className="grid grid-cols-1 md:grid-cols-4 gap-6 md:px-4">
                  <div className="relative md:col-span-2">
                    <div className="flex flex-row items-center justify-between mb-2.5 px-4 md:px-0">
                      <p className="text-base font-semibold">
                        {item.decor?.name} ({item?.decor?.productInfo?.id})
                      </p>
                      {allowEdit && !status.finalized && (
                        <Image
                          src="/assets/new_icons/delete2.svg"
                          alt="Delete"
                          width={15}
                          height={10}
                          className="cursor-pointer"
                          onClick={() => {
                            RemoveDecorFromEvent({
                              decor_id: item.decor._id,
                            });
                          }}
                        />
                      )}
                    </div>
                    <div className={`relative pt-[56.25%]`}>
                      <ImageFillCard
                        src={item.decor?.image}
                        objectFit="contain"
                        className="rounded-xl"
                      />
                    </div>
                    <div className="mt-4 flex md:hidden flex-row px-4 justify-between items-center gap-3">
                      <div className="p-2 px-6 rounded-lg bg-white">
                        <p>
                          Quantity:{" | "}
                          <span className="font-medium">{item.quantity}</span>
                        </p>
                      </div>
                      <Button
                        color="light"
                        onClick={() => {
                          setSetupLocationImage({
                            ...setupLocationImage,
                            image: item.setupLocationImage,
                            open: true,
                          });
                        }}
                      >
                        <Image
                          src="/assets/new_icons/gallery.svg"
                          alt="Gallery"
                          width={20}
                          height={20}
                        />
                      </Button>
                      <Button
                        className="grow"
                        color="dark"
                        onClick={() => {
                          setNotes({
                            open: true,
                            edit: false,
                            loading: false,
                            event_id: event_id,
                            eventDay: eventDay,
                            decor_id: item.decor._id,
                            package_id: "",
                            admin_notes: item.admin_notes,
                            user_notes: item.user_notes,
                            notes: item.notes || [],
                          });
                        }}
                      >
                        View Notes
                      </Button>
                    </div>
                    {(item.platform || item.flooring) && (
                      <div className="flex flex-row mt-4 gap-4 px-4 md:px-0 w-full md:w-auto justify-between items-center">
                        {item?.platform && (
                          <div className="w-[221px] h-[126px]">
                            <Image
                              src={
                                platformPrice.image ||
                                "/assets/images/platform.png"
                              }
                              alt="Platform"
                              width={221}
                              height={126}
                              className="object-cover rounded-lg w-full h-full"
                            />
                            <p className="font-medium text-center mt-2 text-sm md:text-base">
                              Platform (
                              {`${item.dimensions.length} x ${item.dimensions.breadth} x ${item.dimensions.height}`}
                              )
                            </p>
                          </div>
                        )}
                        {item?.platform && item?.flooring && (
                          <AiOutlinePlus size={24} className="md:mx-3" />
                        )}
                        {item?.flooring && (
                          <div className="w-[221px] h-[126px]">
                            <Image
                              src={
                                flooringPrice.find(
                                  (i) => i.title === item.flooring
                                )?.image
                                  ? flooringPrice.find(
                                      (i) => i.title === item.flooring
                                    )?.image
                                  : item.flooring === "Carpet"
                                  ? "/assets/images/carpet.png"
                                  : item.flooring === "Flex"
                                  ? "/assets/images/flex.png"
                                  : item.flooring === "PrintedFlex"
                                  ? "/assets/images/printedFlex.png"
                                  : "/assets/images/carpet.png"
                              }
                              alt="Flooring"
                              width={221}
                              height={126}
                              className="object-cover rounded-lg w-full h-full"
                            />
                            <p className="font-medium text-center mt-2 text-sm md:text-base">
                              Flooring:
                              {` ${
                                item.flooring !== "PrintedFlex"
                                  ? item.flooring
                                  : "Printed Flex"
                              } `}
                              (
                              {`${item.dimensions.length} x ${item.dimensions.breadth}`}
                              )
                            </p>
                          </div>
                        )}
                      </div>
                    )}
                  </div>
                  <div className="md:col-span-2 flex flex-col gap-3">
                    <div className="p-2 rounded-lg md:bg-white w-full border-t-2 border-t-white md:border-t-0">
                      <p className="text-lg font-medium mb-2">Inclusive of:</p>
                      <ul className="list-disc ml-6">
                        {item.included.map((rec, recIndex) => (
                          <li key={recIndex}>{rec}</li>
                        ))}
                      </ul>
                    </div>
                    <div className="hidden md:block p-4 px-6 rounded-lg bg-white w-full">
                      <p>
                        Primary Color:{" "}
                        <span className="font-medium">{item.primaryColor}</span>
                      </p>
                      <p>
                        Secondary Color:
                        <span className="font-medium">
                          {item.secondaryColor}
                        </span>
                      </p>
                    </div>
                    <div className="p-4 px-6 rounded-lg bg-white hidden md:block  w-full">
                      <p>
                        Quantity:{" "}
                        <span className="font-medium">
                          {item.quantity}{" "}
                          {item?.decor?.category === "Pathway" && (
                            <> / {item?.decor?.unit}</>
                          )}
                        </span>
                      </p>
                    </div>
                    <Button
                      color="light"
                      className="hidden md:flex"
                      onClick={() => {
                        setSetupLocationImage({
                          ...setupLocationImage,
                          image: item.setupLocationImage,
                          open: true,
                        });
                      }}
                    >
                      View Setup Location{" "}
                      <Image
                        src="/assets/new_icons/gallery.svg"
                        alt="Gallery"
                        width={20}
                        height={20}
                        className="ml-2"
                      />
                    </Button>
                    <Button
                      className="hidden md:flex "
                      color="dark"
                      onClick={() => {
                        setNotes({
                          open: true,
                          edit: false,
                          loading: false,
                          event_id: event_id,
                          eventDay: eventDay,
                          decor_id: item.decor._id,
                          package_id: "",
                          admin_notes: item.admin_notes,
                          user_notes: item.user_notes,
                          notes: item.notes || [],
                        });
                      }}
                    >
                      Click to view Notes
                    </Button>
                  </div>
                </div>
                <div className=" md:rounded-tl-full flex flex-row items-center md:w-1/2 md:ml-auto justify-between py-2 md:px-10 bg-rose-900 text-white">
                  {allowEdit && !status.finalized ? (
                    <Dropdown
                      renderTrigger={() => (
                        <span className="cursor-pointer flex items-center gap-1 font-medium md:text-lg mt-auto text-right px-10 ">
                          {item.variant} <BsChevronDown />
                        </span>
                      )}
                      className="text-rose-900"
                    >
                      {item?.decor?.productTypes
                        .filter((i) => i.name != item.variant)
                        .map((rec) => (
                          <Dropdown.Item
                            onClick={() => {
                              let {
                                platform,
                                platformRate,
                                flooring,
                                flooringRate,
                                dimensions,
                                quantity,
                                category,
                                unit,
                                addOns,
                                productVariant,
                                priceModifier,
                              } = item;
                              UpdateDecorItemInEvent({
                                event_id,
                                eventDay,
                                decor_id: item.decor?._id,
                                platform,
                                platformRate,
                                flooring,
                                flooringRate,
                                decorPrice: item.decor?.productTypes.find(
                                  (i) => i.name === rec.name
                                )?.sellingPrice,
                                dimensions,
                                quantity,
                                variant: rec.name,
                                category,
                                unit,
                                addOns,
                                productVariant,
                                priceModifier,
                              });
                            }}
                            key={rec.name}
                          >
                            {rec.name}
                          </Dropdown.Item>
                        ))}
                    </Dropdown>
                  ) : (
                    <p className="font-medium md:text-lg mt-auto text-right px-10 ">
                      {item.variant}
                    </p>
                  )}
                  <div className="flex flex-row items-center justify-end gap-2 mr-6 md:mr-0 text-lg text-white font-medium ">
                    ₹ {item.price}{" "}
                    <Tooltip
                      content={
                        <div className="flex flex-col gap-1">
                          <div className="flex flex-row justify-between gap-2">
                            <span>{item.category}:</span>
                            <span>₹{item.decorPrice * item.quantity}</span>
                          </div>
                          {item.platform && (
                            <div className="flex flex-row justify-between gap-2">
                              <span>Platform:</span>
                              <span>
                                ₹
                                {item.dimensions.length *
                                  item.dimensions.breadth *
                                  item.platformRate}
                              </span>
                            </div>
                          )}
                          {item.flooring && (
                            <div className="flex flex-row justify-between gap-2">
                              <span>Flooring:</span>
                              <span>
                                ₹
                                {(item.dimensions.length +
                                  item.dimensions.height) *
                                  (item.dimensions.breadth +
                                    item.dimensions.height) *
                                  item.flooringRate}
                              </span>
                            </div>
                          )}
                          {item.addOns?.map((rec, recIndex) => (
                            <div
                              className="flex flex-row justify-between gap-2"
                              key={recIndex}
                            >
                              <span>{rec.name}:</span>
                              <span>₹{rec.price}</span>
                            </div>
                          ))}
                        </div>
                      }
                      trigger="hover"
                      style="light"
                    >
                      <BsInfoCircle size={16} />
                    </Tooltip>
                  </div>
                </div>
              </div>
            ))}
          {categoryList
            ?.filter((r) => r.adminEventToolView === "group")
            .filter(
              (r) => decorItems?.filter((i) => i.category === r.name).length > 0
            )
            .map((rec, index) => (
              <>
                <p
                  className="text-xl mt-4 font-medium px-4"
                  data-key={`category-${rec.name}`}
                >
                  {rec.name}
                </p>
                <div className="grid grid-cols-1 md:grid-cols-4 gap-4 py-3 px-6 md:px-0">
                  {decorItems
                    ?.filter((i) => i.category === rec.name)
                    ?.map((item, index) => (
                      <>
                        <div
                          className="flex flex-col gap-3  bg-white rounded-2xl shadow-md border-2 px-4 py-2"
                          key={item._id}
                        >
                          <div className="flex flex-row items-center justify-between">
                            <p className="text-sm flex">
                              <Image
                                src="/assets/new_icons/gallery.svg"
                                alt="Gallery"
                                width={15}
                                height={10}
                                className="cursor-pointer text-gray-600 font-bold text-xl mr-2"
                                onClick={() => {
                                  setSetupLocationImage({
                                    ...setupLocationImage,
                                    image: item.setupLocationImage,
                                    open: true,
                                  });
                                }}
                              />
                              {item?.decor?.name} (
                              {item?.decor?.productInfo?.id})
                            </p>
                            {!status.finalized && allowEdit && (
                              <Image
                                src="/assets/new_icons/delete2.svg"
                                alt="Delete"
                                width={15}
                                height={10}
                                className="cursor-pointer"
                                onClick={() => {
                                  if (!loading) {
                                    if (
                                      confirm(
                                        "Do you want to delete the item from the event?"
                                      )
                                    ) {
                                      RemoveDecorFromEvent({
                                        decor_id: item.decor._id,
                                      });
                                    }
                                  }
                                }}
                              />
                            )}
                          </div>
                          <div className="relative pt-[100%]">
                            <Image
                              src={item.decor?.thumbnail}
                              alt="Decor"
                              sizes="100%"
                              layout={"fill"}
                              objectFit="contain"
                              className="rounded-xl "
                            />
                          </div>
                          {rec?.multipleAllowed && (
                            <div className="flex flex-row items-center gap-2">
                              <Label value="Qt." />
                              <Select
                                value={item.quantity.toString()}
                                disabled={status.finalized || !allowEdit}
                                sizing={"sm"}
                                onChange={(e) => {
                                  let {
                                    platform,
                                    platformRate,
                                    flooring,
                                    flooringRate,
                                    dimensions,
                                    category,
                                    unit,
                                    addOns,
                                    variant,
                                    decorPrice,
                                    productVariant,
                                    priceModifier,
                                  } = item;
                                  UpdateDecorItemInEvent({
                                    event_id,
                                    eventDay,
                                    decor_id: item.decor?._id,
                                    platform,
                                    platformRate,
                                    flooring,
                                    flooringRate,
                                    decorPrice,
                                    dimensions,
                                    quantity: parseInt(e.target.value),
                                    variant,
                                    category,
                                    unit,
                                    addOns,
                                    productVariant,
                                    priceModifier,
                                  });
                                }}
                              >
                                <option value={item.quantity}>
                                  {item.quantity}
                                </option>
                                {item?.decor?.productInfo
                                  ?.minimumOrderQuantity &&
                                item?.decor?.productInfo
                                  ?.maximumOrderQuantity ? (
                                  <QuantityOptions
                                    max={
                                      item?.decor?.productInfo
                                        ?.maximumOrderQuantity
                                    }
                                    min={
                                      item?.decor?.productInfo
                                        ?.minimumOrderQuantity
                                    }
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
                          <div className="flex flex-row items-center justify-between">
                            <p className="font-medium text-rose-900">
                              {toPriceString(item.price)}
                            </p>
                            <p
                              className="underline text-base flex items-center cursor-pointer"
                              onClick={() => {
                                setNotes({
                                  open: true,
                                  edit: false,
                                  loading: false,
                                  event_id: event_id,
                                  eventDay: eventDay,
                                  decor_id: item.decor._id,
                                  package_id: "",
                                  admin_notes: item.admin_notes,
                                  user_notes: item.user_notes,
                                  notes: item.notes || [],
                                });
                              }}
                            >
                              <MdNotes /> Notes
                            </p>
                          </div>
                        </div>
                      </>
                    ))}
                </div>
                <div className=" md:rounded-tl-full flex flex-row items-center md:w-1/2 md:ml-auto justify-end py-2 md:px-10 font-medium bg-rose-900 text-white">
                  <div className="flex flex-row items-center justify-end gap-2 mr-6 md:mr-0 text-lg text-white  ">
                    ₹{" "}
                    {decorItems
                      ?.filter((i) => rec.name === i.category)
                      ?.reduce((accumulator, currentValue) => {
                        return accumulator + currentValue.price;
                      }, 0)}{" "}
                    <Tooltip
                      content={
                        <div className="flex flex-col gap-1">
                          {decorItems
                            ?.filter((i) => rec.name === i.category)
                            ?.map((i, index) => (
                              <div
                                className="flex flex-row justify-between gap-2"
                                key={index}
                              >
                                <span>{i?.decor?.name}:</span>
                                <span>₹{i?.price}</span>
                              </div>
                            ))}
                        </div>
                      }
                      trigger="hover"
                      style="light"
                    >
                      <BsInfoCircle size={16} />
                    </Tooltip>
                  </div>
                </div>
                <div className="border-b border-black" />
              </>
            ))}
        </>
      )}
    </>
  );
}
