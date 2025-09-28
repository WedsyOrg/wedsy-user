import React from "react";
import HeaderSectionSkeleton from "./HeaderSectionSkeleton";
import HeadingSkeleton from "./HeadingSkeleton";
import MobileGridSkeleton from "./MobileGridSkeleton";
import DesktopGridSkeleton from "./DesktopGridSkeleton";
import PaginationSkeleton from "./PaginationSkeleton";

const DecorViewSkeleton = () => {
  return (
    <div className="bg-[#F4F4F4]">
      <main className="p-4 md:p-8 max-w-screen-xl mx-auto">
        {/* Header Section with Categories and Filters */}
        <HeaderSectionSkeleton />
        
        {/* Dynamic Heading */}
        <HeadingSkeleton />
        
        {/* Product Grids */}
        <MobileGridSkeleton />
        <DesktopGridSkeleton />
        
        {/* Pagination */}
        <PaginationSkeleton />
      </main>
    </div>
  );
};

export default DecorViewSkeleton;
