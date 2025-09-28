import Image from "next/image";
import Link from "next/link";
import { AiOutlinePlusSquare } from "react-icons/ai";

function Wishlist() {
  return (
    <>
      <div className="px-6 py-6 md:py-12 md:px-24 flex flex-col gap-4 md:gap-8 md:pt-24">
        <div className="text-black text-2xl md:text-4xl font-semibold">
          WISHLIST
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-16">
          <Link
            href={"/wishlist/decor"}
            className="bg-white rounded-lg shadow-xl p-3"
          >
            <Image
              src={`/assets/temp/w1.png`}
              alt="Decor"
              width={0}
              height={0}
              sizes="100%"
              style={{ width: "100%", height: "auto" }}
            />
            <p className="font-medium text-center">DECOR</p>
          </Link>
          <Link
            href={"wishlist/venue"}
            className="bg-white rounded-lg shadow-xl p-3"
          >
            <Image
              src={`/assets/temp/w2.png`}
              alt="Decor"
              width={0}
              height={0}
              sizes="100%"
              style={{ width: "100%", height: "auto" }}
            />
            <p className="font-medium text-center">VENUES</p>
          </Link>
          <div className="bg-white rounded-lg shadow-xl p-3 cursor-pointer">
            <AiOutlinePlusSquare size={96} className="mx-auto my-12 " />
            <p className="font-medium text-center">+ CREATE A NEW COLLECTION</p>
          </div>
        </div>
      </div>
    </>
  );
}

export default Wishlist;
