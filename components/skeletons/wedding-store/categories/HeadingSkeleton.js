import React from "react";
import ShimmerEffect from "./ShimmerEffect";

const HeadingSkeleton = () => {
  return (
    <div className="text-center mb-6 sm:mb-10">
      <ShimmerEffect className="h-8 sm:h-12 w-48 sm:w-64 mx-auto rounded" />
    </div>
  );
};

export default HeadingSkeleton;
