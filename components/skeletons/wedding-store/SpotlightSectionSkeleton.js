import React from 'react';
import ShimmerEffect from './ShimmerEffect';

const SpotlightSectionSkeleton = () => {
  return (
    <section className="px-6 md:px-24 mt-[60px]">
      {/* Title Skeleton */}
      <div className="text-center mb-8">
        <ShimmerEffect className="h-8 bg-gray-300 rounded w-48 mx-auto" />
      </div>

      {/* Spotlight Card Skeleton */}
      <div className="w-full max-w-[1200px] h-auto md:h-[301px] mt-[30px] md:mt-[65px] mb-[30px] mx-auto relative flex items-center justify-center">
        <div className="grid grid-cols-1 md:grid-cols-2 w-full h-full m-4 md:m-6 gap-4 md:gap-8 bg-gray-200 rounded-lg overflow-hidden">
          {/* Text Content Skeleton */}
          <div className="flex flex-col p-4 sm:p-6 justify-between order-last md:order-first gap-2 sm:gap-4">
            <ShimmerEffect className="h-8 bg-gray-300 rounded w-3/4" />
            <ShimmerEffect className="h-6 bg-gray-300 rounded w-full hidden md:block" />
            <ShimmerEffect className="h-6 bg-gray-300 rounded w-2/3 hidden md:block" />
            <div className="flex justify-between items-center mt-4">
              <ShimmerEffect className="h-8 bg-gray-300 rounded w-24" />
              <ShimmerEffect className="h-10 bg-gray-300 rounded w-32" />
            </div>
          </div>

          {/* Image Skeleton */}
          <div className="relative w-full h-48 sm:h-60 md:h-full">
            <ShimmerEffect className="w-full h-full" />
          </div>
        </div>
      </div>

      {/* Dots Skeleton */}
      <div className="flex gap-2 md:gap-3 items-center justify-center">
        {[...Array(3)].map((_, i) => (
          <ShimmerEffect key={i} className="h-2 w-2 md:h-3 md:w-3 bg-gray-300 rounded-full" />
        ))}
      </div>
    </section>
  );
};

export default SpotlightSectionSkeleton;
