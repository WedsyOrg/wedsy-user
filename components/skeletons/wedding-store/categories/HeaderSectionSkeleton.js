import React from "react";
import ShimmerEffect from "./ShimmerEffect";

const HeaderSectionSkeleton = () => {
  return (
    <div className="flex flex-col md:flex-row md:justify-between md:items-center mb-6 gap-4">
      {/* Category Buttons */}
      <div className="flex py-3 flex-nowrap justify-start gap-2 overflow-x-auto max-w-full scrollbar-hide md:flex-1 md:pr-4">
        {Array.from({ length: 6 }).map((_, index) => (
          <div
            key={index}
            className="py-2 px-5 rounded-full flex-shrink-0"
          >
            <ShimmerEffect className="h-8 w-20 rounded-full" />
          </div>
        ))}
      </div>

      {/* Sort and Filter Section */}
      <div className="flex flex-col sm:flex-row sm:justify-end items-stretch sm:items-center gap-2 sm:gap-0 md:w-auto">
        <div className="flex w-full sm:w-auto bg-white rounded-md overflow-hidden border divide-x">
          {/* Sort Dropdown */}
          <div className="flex-1">
            <div className="ml-10 md:ml-0 px-4 py-2 flex items-center justify-center text-center gap-2 flex-1 min-h-[44px]">
              <ShimmerEffect className="h-4 w-4 rounded" />
              <ShimmerEffect className="h-4 w-12 rounded" />
            </div>
          </div>

          {/* Filter Dropdown */}
          <div className="flex-1">
            <div className="ml-10 md:ml-0 px-4 py-2 flex items-center justify-center text-center gap-2 flex-1 min-h-[44px]">
              <ShimmerEffect className="h-4 w-4 rounded" />
              <ShimmerEffect className="h-4 w-12 rounded" />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default HeaderSectionSkeleton;
