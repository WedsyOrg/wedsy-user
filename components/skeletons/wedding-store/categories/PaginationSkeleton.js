import React from "react";
import ShimmerEffect from "./ShimmerEffect";

const PaginationSkeleton = () => {
  return (
    <div className="flex flex-col items-center mt-12 gap-4">
      {/* Next Page Button */}
      <ShimmerEffect className="h-10 w-32 rounded-full" />
      
      {/* Page Numbers */}
      <div className="flex flex-wrap justify-center items-center gap-2">
        {Array.from({ length: 5 }).map((_, index) => (
          <ShimmerEffect key={index} className="h-10 w-10 rounded-full" />
        ))}
      </div>
      
      {/* Previous Page Button */}
      <ShimmerEffect className="h-10 w-32 rounded-full" />
    </div>
  );
};

export default PaginationSkeleton;
