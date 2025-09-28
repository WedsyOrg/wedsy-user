import React from "react";
import ProductCardSkeleton from "./ProductCardSkeleton";

const DesktopGridSkeleton = () => {
  // Grid classes matching the original layout
  const gridClasses = [
    "md:col-span-2 md:row-span-2",
    "md:col-span-4 md:row-span-2 md:col-start-3",
    "md:col-span-2 md:row-span-2 md:col-start-7",
    "md:col-span-2 md:row-span-2 md:row-start-3",
    "md:col-span-3 md:row-span-2 md:col-start-3 md:row-start-3",
    "md:col-span-3 md:row-span-2 md:col-start-6 md:row-start-3",
    "md:col-span-4 md:row-span-3 md:row-start-5",
    "md:col-span-4 md:row-span-3 md:col-start-5 md:row-start-5",
    "md:col-span-4 md:row-span-2 md:row-start-8",
    "md:col-span-4 md:row-span-2 md:col-start-5 md:row-start-8",
    "md:col-span-3 md:row-span-2 md:row-start-10",
    "md:col-span-4 md:row-span-2 md:col-start-4 md:row-start-10",
    "md:col-span-4 md:row-span-2 md:row-start-12",
    "md:col-span-3 md:row-span-2 md:col-start-5 md:row-start-12",
  ];

  return (
    <div className="hidden md:grid grid-cols-2 sm:grid-cols-3 md:grid-cols-8 md:grid-rows-13 gap-2 md:gap-4 min-h-[1600px]">
      {Array.from({ length: 14 }).map((_, index) => (
        <div
          key={index}
          className={
            gridClasses[index] ||
            "col-span-1 sm:col-span-1 md:col-span-3 md:row-span-2"
          }
        >
          <ProductCardSkeleton />
        </div>
      ))}
    </div>
  );
};

export default DesktopGridSkeleton;
