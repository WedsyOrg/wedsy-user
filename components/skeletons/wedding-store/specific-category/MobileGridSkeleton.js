import React from "react";
import ProductCardSkeleton from "./ProductCardSkeleton";

const MobileGridSkeleton = () => {
  return (
    <div className="block md:hidden">
      <div className="grid grid-cols-2 gap-4">
        {Array.from({ length: 14 }).map((_, index) => (
          <div key={index}>
            <ProductCardSkeleton 
              size={index % 4 === 0 || index % 4 === 3 ? "small" : "normal"} 
            />
          </div>
        ))}
      </div>
    </div>
  );
};

export default MobileGridSkeleton;
