import React from 'react';
import ShimmerEffect from './ShimmerEffect';

const HeroSectionSkeleton = () => {
  return (
    <div className="w-full relative overflow-hidden hidden md:block mb-[56px]">
      {/* Background Image Skeleton */}
      <ShimmerEffect className="w-full h-96 bg-gray-200 rounded-lg" />
      
      {/* Text Overlay Skeleton */}
      <div className="absolute top-0 left-0 w-full h-full flex flex-col items-center justify-center z-10">
        <ShimmerEffect className="h-16 bg-gray-300 rounded w-96" />
      </div>
    </div>
  );
};

export default HeroSectionSkeleton;
