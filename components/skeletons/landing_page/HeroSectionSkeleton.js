import React from 'react';
import ShimmerEffect from './ShimmerEffect';

const HeroSectionSkeleton = () => {
  return (
    <main className="flex flex-col justify-around gap-6 md:gap-12 relative min-h-screen">
      {/* Background Image Skeleton */}
      <div className="absolute inset-0">
        <ShimmerEffect className="w-full h-full bg-gray-200 rounded-lg" />
      </div>

      {/* Mobile Wedding Store Section Skeleton */}
      <div className="block md:hidden absolute bottom-72 left-1/2 transform -translate-x-1/2 text-center mb-40">
        <div className="w-80 max-w-[90vw] space-y-4">
          <ShimmerEffect className="h-6 bg-gray-300 rounded w-3/4 mx-auto" />
          <ShimmerEffect className="h-12 bg-gray-300 rounded w-48 mx-auto" />
        </div>
      </div>

      {/* Desktop Form Section Skeleton */}
      <div className="hidden md:flex h-screen w-full p-6 md:px-8 flex-row justify-end items-end mb-28">
        <div className="hidden md:flex flex-col w-[25%] text-center gap-6 justify-center pr-5">
          <ShimmerEffect className="h-8 bg-gray-300 rounded w-full" />
          <ShimmerEffect className="h-10 bg-gray-300 rounded w-full" />
          <ShimmerEffect className="h-10 bg-gray-300 rounded w-full" />
          <ShimmerEffect className="h-12 bg-gray-300 rounded w-full" />
        </div>
      </div>

      {/* Mobile Image Skeleton */}
      <div className="block md:hidden">
        <ShimmerEffect className="w-full h-96 bg-gray-200 rounded-lg" />
      </div>
    </main>
  );
};

export default HeroSectionSkeleton;
