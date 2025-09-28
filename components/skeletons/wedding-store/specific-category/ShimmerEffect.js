import React from "react";

const ShimmerEffect = ({ className = "" }) => {
  return (
    <div
      className={`bg-gradient-to-r from-gray-200 via-gray-300 to-gray-200 bg-[length:200%_100%] animate-shimmer ${className}`}
    />
  );
};

export default ShimmerEffect;
