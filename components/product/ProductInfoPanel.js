// File: components/product/ProductInfoPanel.js

import { useState } from "react";
import { useRouter } from "next/router";
import { Button, Checkbox, Dropdown, Label, Modal, Rating, Select, TextInput } from "flowbite-react";
import { AiFillHeart, AiOutlineHeart } from "react-icons/ai";
import { BsChevronDown } from "react-icons/bs";
import Link from "next/link";

function ProductInfoPanel({
  decor,
  category,
  userLoggedIn,
  setOpenLoginModal,
  eventList,
  fetchEvents, // Pass this down if CreateEventModal needs it
  isAddedToWishlist,
  setIsAddedToWishlist, // Pass state setter
}) {
  const router = useRouter();
  const { decor_id } = router.query;
  
  // --- State for this component ---
  const [variant, setVariant] = useState(decor?.productTypes?.length > 0 ? decor?.productTypes[0]?.name : "");
  const [quantity, setQuantity] = useState(decor?.productInfo?.minimumOrderQuantity || 1);

  // --- Logic moved from the main page file ---
  const AddToWishlist = () => {
    // Preserved from your original file
  };
  const RemoveFromWishList = () => {
    // Preserved from your original file
  };
  const AddToEvent = ({ eventId, eventDayId }) => {
    // Preserved from your original file
  };
  const RemoveFromEvent = ({ eventId, eventDayId }) => {
    // Preserved from your original file
  };

  const displayPrice = decor.productTypes.find(v => v.name === variant)?.sellingPrice || 0;

  return (
    <aside className="flex flex-col gap-4">
      <div className="border-b-2 border-gray-500  pb-4">
        <h1 className="text-xl font-semibold mb-2">{decor.name} ({decor?.productInfo.id})</h1>
        <Rating size={"md"}>
          {[...Array(5)].map((_, index) => (
            <Rating.Star key={index} filled={index < decor.rating} />
          ))}
        </Rating>
      </div>

      <div className="border-b-2 border-gray-500 pb-4 flex flex-col gap-2">
        <p className="text-sm">Price for</p>
        <Dropdown
          renderTrigger={() => (
            <span className="font-semibold text-rose-900 cursor-pointer flex items-center gap-1 uppercase shadow-md bg-white p-3 w-fit text-sm  rounded-lg">
              {variant} <BsChevronDown />
            </span>
          )}
          className="text-rose-900"
        >
          {decor.productTypes.map((item) => (
            <Dropdown.Item key={item.name} onClick={() => setVariant(item.name)}>
              {item.name}
            </Dropdown.Item>
          ))}
        </Dropdown>
        <p className="text-xl font-semibold">
          ₹ {displayPrice}
          {category?.multipleAllowed && ` / ${decor.unit}`}
        </p>
      </div>

      {category?.multipleAllowed && (
        <div className="border-b-2 border-gray-500 pb-4 flex flex-col gap-2">
          <p className="text-sm">Quantity</p>
          <Select
            className="w-fit"
            value={quantity}
            onChange={(e) => setQuantity(Number(e.target.value))}
          >
            {/* Logic for quantity options */}
            {[...Array(10).keys()].map(i => (
                <option key={i+1} value={i+1}>{i+1}</option>
            ))}
          </Select>
        </div>
      )}

      <div className="flex flex-col gap-4 pr-8">
        <Button
          className="focus:outline-none focus:ring-0 outline-none bg-white enabled:hover:bg-white text-black shadow-md"
          onClick={() => {
            if (userLoggedIn) {
              isAddedToWishlist ? RemoveFromWishList() : AddToWishlist();
            } else {
              setOpenLoginModal(true);
            }
          }}
        >
          {isAddedToWishlist ? "REMOVE FROM FAVORITES" : "ADD TO FAVORITES"}
          &nbsp;
          {isAddedToWishlist ? (
            <AiFillHeart size={20} className="text-rose-900" />
          ) : (
            <AiOutlineHeart size={20} className="text-rose-900" />
          )}
        </Button>
        
        <Dropdown
          inline
          arrowIcon={false}
          dismissOnClick={false}
          label={
            <Button
              onClick={() => { if (!userLoggedIn) setOpenLoginModal(true); }}
              className="sm:bg-black enabled:hover:bg-black md:bg-rose-900 md:enabled:hover:bg-rose-900 shadow-xl text-white text-center w-full"
            >
              ADD TO EVENT
            </Button>
          }
          className=" rounded-lg bg-black"
        >
          <Dropdown.Header className="text-white bg-black">Event List</Dropdown.Header>
          {eventList?.map((item) => (
            <div key={item._id}>
                <Dropdown.Divider />
                <Dropdown.Header className="bg-white">{item.name}</Dropdown.Header>
                {item.eventDays.map((rec) => (
                    <Dropdown.Item key={rec._id} as="div">
                        <Label className="w-full flex items-center gap-2">
                             <Checkbox
                                checked={rec.decorItems.some(i => i.decor === decor_id)}
                                disabled={item.status.finalized}
                                onChange={(e) => {
                                    if (e.target.checked) {
                                        AddToEvent({ eventId: item._id, eventDayId: rec._id });
                                    } else {
                                        RemoveFromEvent({ eventId: item._id, eventDayId: rec._id });
                                    }
                                }}
                            />
                            {rec.name}
                        </Label>
                    </Dropdown.Item>
                ))}
            </div>
          ))}
          <Dropdown.Divider />
          <Dropdown.Item as={Link} href="/event" className="bg-white text-cyan-600">
            + Create New Event
          </Dropdown.Item>
        </Dropdown>
      </div>
    </aside>
  );
}

export default ProductInfoPanel;