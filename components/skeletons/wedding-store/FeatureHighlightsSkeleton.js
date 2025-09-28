import React from 'react';
import ShimmerEffect from './ShimmerEffect';

const FeatureHighlightsSkeleton = () => {
  return (
    <div className="w-full flex flex-col items-center bg-[#F4F4F4] px-4">
      {/* Top Line Skeleton */}
      <ShimmerEffect className="w-full max-w-6xl h-px bg-gray-300 mb-4 md:mb-6" />
      
      {/* Features Grid Skeleton */}
      <div className="w-full max-w-6xl grid grid-cols-2 md:flex md:flex-row md:justify-between items-center py-4 md:py-6 gap-4 md:gap-0">
        {[...Array(4)].map((_, index) => (
          <div key={index} className="flex flex-row items-center gap-2 md:gap-4">
            {/* Icon Skeleton */}
            <ShimmerEffect className="w-8 h-8 md:w-12 md:h-12 bg-gray-300 rounded" />
            <div className="flex flex-col text-left">
              <ShimmerEffect className="h-4 md:h-6 bg-gray-300 rounded w-20 mb-1" />
              <ShimmerEffect className="h-4 md:h-6 bg-gray-300 rounded w-24" />
            </div>
          </div>
        ))}
      </div>
      
      {/* Bottom Line Skeleton */}
      <ShimmerEffect className="w-full max-w-6xl h-px bg-gray-300 mt-4 md:mt-6" />
    </div>
  );
};

export default FeatureHighlightsSkeleton;
