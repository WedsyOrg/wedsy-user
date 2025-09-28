import React from "react";
import ShimmerEffect from "./ShimmerEffect";

const ProductCardSkeleton = ({ size = "normal" }) => {
  const isSmall = size === "small";
  
  return (
    <div className={`bg-white rounded-lg shadow-md overflow-hidden ${isSmall ? 'min-h-[200px]' : 'min-h-[300px]'}`}>
      {/* Image */}
      <ShimmerEffect className={`w-full ${isSmall ? 'h-32' : 'h-48'} rounded-t-lg`} />
      
      {/* Content */}
      <div className="p-4">
        {/* Title */}
        <ShimmerEffect className="h-4 w-3/4 mb-2 rounded" />
        
        {/* Price */}
        <ShimmerEffect className="h-5 w-1/2 mb-3 rounded" />
        
        {/* Description */}
        <div className="space-y-2">
          <ShimmerEffect className="h-3 w-full rounded" />
          <ShimmerEffect className="h-3 w-2/3 rounded" />
        </div>
        
        {/* Button */}
        <div className="mt-4">
          <ShimmerEffect className="h-8 w-full rounded" />
        </div>
      </div>
    </div>
  );
};

export default ProductCardSkeleton;
