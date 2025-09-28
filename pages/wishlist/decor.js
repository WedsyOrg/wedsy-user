import DecorCard from "@/components/cards/DecorCard";
import Image from "next/image";
import Link from "next/link";
import { useEffect, useState } from "react";
import { AiOutlinePlusSquare } from "react-icons/ai";

function Wishlist() {
  const [list, setList] = useState([]);
  const fetchList = () => {
    fetch(`${process.env.NEXT_PUBLIC_API_URL}/user/wishlist/decor`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        authorization: `Bearer ${localStorage.getItem("token")}`,
      },
    })
      .then((response) => response.json())
      .then((response) => {
        setList(response);
      })
      .catch((error) => {
        console.error("There was a problem with the fetch operation:", error);
      });
  };
  useEffect(() => {
    fetchList();
  }, []);
  return (
    <>
      <div className="px-6 py-6 md:py-12 md:px-24 flex flex-col gap-4 md:gap-8 md:pt-24">
        <div className="text-black text-2xl md:text-4xl font-semibold">
          Decor Wishlist
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-16">
          {list.map((item, index) => (
            <DecorCard key={index} decor={item} />
          ))}
          {/* <div className="bg-white rounded-lg shadow-xl p-3 cursor-pointer">
            <AiOutlinePlusSquare size={96} className="mx-auto my-12 " />
            <p className="font-medium text-center">+ CREATE A NEW COLLECTION</p>
          </div> */}
        </div>
      </div>
    </>
  );
}

export default Wishlist;
