import React from 'react';
import ShimmerEffect from './ShimmerEffect';

const BestSellersSectionSkeleton = () => {
  return (
    <section className="py-8 md:mt-8">
      {/* Heading Skeleton */}
      <div className="w-full flex items-center justify-center relative py-8 bg-[#F4F4F4]">
        <div className="w-full max-w-[1180px] flex items-center justify-center relative px-4">
          <ShimmerEffect className="h-8 bg-gray-300 rounded w-64" />
          <ShimmerEffect className="h-6 bg-gray-300 rounded w-24 absolute right-4 hidden md:block" />
        </div>
      </div>

      {/* Desktop Slider Skeleton */}
      <div className="hidden md:flex relative w-full justify-center items-center my-6">
        <ShimmerEffect className="w-12 h-12 bg-gray-300 rounded-full absolute left-16 z-10" />
        <div className="flex gap-6 justify-center w-full overflow-hidden">
          <div className="flex gap-6">
            {[...Array(4)].map((_, index) => (
              <div key={index} className="relative group w-[451px] h-[241px] rounded-[30px] overflow-hidden">
                <ShimmerEffect className="w-full h-full" />
              </div>
            ))}
          </div>
        </div>
        <ShimmerEffect className="w-12 h-12 bg-gray-300 rounded-full absolute right-16 z-10" />
      </div>

      {/* Mobile Slider Skeleton */}
      <div className="md:hidden px-4">
        <div className="flex gap-4 overflow-x-auto snap-x scroll-smooth">
          <div className="min-w-full snap-start grid grid-cols-2 gap-4">
            {[...Array(4)].map((_, index) => (
              <div key={index} className="relative">
                <ShimmerEffect className="w-full h-48 rounded-lg" />
              </div>
            ))}
          </div>
        </div>

        {/* Dots Skeleton */}
        <div className="flex gap-2 items-center justify-center mt-4">
          {[...Array(3)].map((_, i) => (
            <ShimmerEffect key={i} className="h-2 w-2 bg-gray-300 rounded-full" />
          ))}
        </div>

        {/* See More Button Skeleton */}
        <div className="flex justify-center mt-4">
          <ShimmerEffect className="h-6 bg-gray-300 rounded w-24" />
        </div>
      </div>
    </section>
  );
};

export default BestSellersSectionSkeleton;
