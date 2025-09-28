import Image from "next/image";
import Link from "next/link";

export default function DecorPackageCard({ className, key, decorPackage }) {
  const { _id, name } = decorPackage;
  return (
    <>
      <Link
        href={`/decor/packages/${_id}`}
        className={`p-6 border bg-white shadow-md rounded-lg flex flex-col gap-2 ${className}`}
        key={key}
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
                  // width={0}
                  // height={0}
                  sizes="50%"
                  layout={"fill"}
                  objectFit="cover"
                  // style={{ width: "100%", height: "auto" }}
                  className="rounded-md"
                />
              </div>
            ))}
        </div>
        <p className="font-semibold">{name}</p>
        <p className="">
          {decorPackage.decor.map((item) => item.category).join(", ")}
        </p>
        <p className="text-xl text-rose-900 font-semibold">
          ₹{" "}
          {decorPackage.variant.artificialFlowers.sellingPrice ||
            decorPackage.variant.mixedFlowers.sellingPrice ||
            decorPackage.variant.naturalFlowers.sellingPrice}
        </p>
      </Link>
    </>
  );
}
