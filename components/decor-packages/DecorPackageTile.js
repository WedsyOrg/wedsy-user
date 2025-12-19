import Image from "next/image";
import Link from "next/link";

function getPackagePrice(decorPackage) {
  const v = decorPackage?.variant || {};
  return (
    v?.artificialFlowers?.sellingPrice ||
    v?.mixedFlowers?.sellingPrice ||
    v?.naturalFlowers?.sellingPrice ||
    0
  );
}

function getThumbs(decorPackage) {
  const decor = Array.isArray(decorPackage?.decor) ? decorPackage.decor : [];
  return decor
    .map((d) => d?.thumbnail)
    .filter(Boolean)
    .slice(0, 4);
}

function getPackageLabel(decorPackage) {
  // Prefer the backend name like "Package 4"
  const raw =
    decorPackage?.name ||
    decorPackage?.seoTags?.title ||
    "";
  const label = String(raw).trim();
  return label ? label.toUpperCase() : "PACKAGE";
}

export default function DecorPackageTile({ decorPackage }) {
  const id = decorPackage?._id;
  const name = decorPackage?.name || "Package";
  const price = getPackagePrice(decorPackage);
  const thumbs = getThumbs(decorPackage);
  const label = getPackageLabel(decorPackage);

  if (!id) return null;

  return (
    <Link
      href={`/decor/packages/${id}`}
      className="group block w-full max-w-[260px]"
    >
      <div className="relative rounded-2xl bg-white shadow-sm border border-gray-200 overflow-hidden transition-transform duration-200 group-hover:-translate-y-0.5">
        {/* Top ribbon */}
        <div className="h-10 bg-[#D46A78] flex items-center justify-center">
          <span
            className="text-white text-xs font-semibold tracking-widest"
            style={{ fontFamily: "Montserrat, sans-serif" }}
          >
            {label}
          </span>
        </div>

        {/* Images */}
        <div className="p-4">
          <div className="grid grid-cols-2 gap-2">
            {Array.from({ length: 4 }).map((_, i) => {
              const src = thumbs[i];
              return (
                <div
                  key={i}
                  className="relative aspect-square rounded-md overflow-hidden bg-gray-200"
                >
                  {src ? (
                    <Image
                      src={src}
                      alt={name}
                      fill
                      sizes="120px"
                      className="object-cover"
                    />
                  ) : (
                    <div className="w-full h-full bg-gradient-to-br from-gray-200 to-gray-300" />
                  )}
                </div>
              );
            })}
          </div>

          {/* Name + included categories */}
          <div className="mt-4 space-y-2">

            {/* categories line like "Stage + Entrance + Pathway + Nameboard" */}
            <p className="text-[11px] text-gray-800 leading-snug">
              {Array.isArray(decorPackage?.decor) && decorPackage.decor.length > 0
                ? decorPackage.decor
                    .map((d) => d?.category)
                    .filter(Boolean)
                    .slice(0, 4)
                    .join(" + ")
                : ""}
            </p>

            <p
              className="text-center text-sm font-semibold text-[#840032]"
              style={{ fontFamily: "Montserrat, sans-serif" }}
            >
              ₹ {price}
            </p>
          </div>
        </div>
      </div>
    </Link>
  );
}


