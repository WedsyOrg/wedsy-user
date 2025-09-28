import Image from "next/image";
import Link from "next/link";

// Add a 'size' prop with a default value of 'normal'
export default function DecorCard({ decor = {}, size = "normal" }) {
  if (!decor || !decor._id) return null;

  const {
    _id,
    thumbnail,
    name = "Decor Item",
    productTypes = [],
    category,
    unit,
    productInfo,
  } = decor;

  const displayPrice = productTypes.length
    ? productTypes.reduce(
        (min, p) => (p?.sellingPrice < min ? p.sellingPrice : min),
        productTypes[0]?.sellingPrice || 0
      )
    : 0;

  const unitSuffix = category === "Pathway" && unit ? `/ ${unit}` : "";

  // Conditionally set the height class based on the 'size' prop
  const imageHeightClass = size === "small" ? "min-h-[200px]" : "min-h-[280px]";

  return (
    <Link
      href={`/decor/view/${_id}`}
      className="group block h-full w-full flex flex-col"
    >
      {/* IMAGE SECTION */}
      {/* Apply the conditional height class here */}
      <div
        className={`relative w-full ${imageHeightClass} overflow-hidden rounded-2xl`}
      >
        <Image
          src={thumbnail || "/placeholder.jpg"}
          alt={name}
          fill
          sizes="(max-width: 768px) 50vw, 33vw"
          style={{ objectFit: "cover" }}
          className="transition-transform duration-500 ease-in-out md:group-hover:scale-110"
          placeholder="blur"
          blurDataURL="/placeholder.jpg"
        />

        {/* DESKTOP: Dark overlay on hover */}
        <div className="absolute inset-0 bg-black bg-opacity-0 md:group-hover:bg-opacity-50 transition duration-300"></div>

        {/* DESKTOP: ID appears on hover */}
        {productInfo?.id && (
          <p className="absolute top-0 right-0 p-3 hidden md:block text-white text-sm font-semibold  bg-opacity-50 rounded-bl-lg opacity-0 md:group-hover:opacity-75 transition-opacity duration-300">
            ID: {productInfo.id}
          </p>
        )}

        {/* MOBILE: Price always visible */}
        <div className="absolute bottom-2 left-2 bg-black bg-opacity-60 px-3 py-1 rounded-lg text-white font-semibold text-sm md:hidden">
          ₹ {displayPrice} {unitSuffix}
        </div>
      </div>

      {/* DESKTOP: Name & Price section */}
      <div className="mt-2 text-center flex justify-around bg-white rounded-xl md:flex hidden">
        <p className="font-semibold text-gray-800 truncate">{name}</p>
        <p className="mt-1 text-sm font-medium text-rose-900">
          ₹ {displayPrice} {unitSuffix}
        </p>
      </div>
    </Link>
  );
}
