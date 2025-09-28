import React from 'react';
import ShimmerEffect from './ShimmerEffect';

const PackagesSectionSkeleton = () => {
  return (
    <section className="flex flex-col items-center pt-10 md:pt-20 pb-6 md:pb-10 bg-[#F4F4F4] px-4">
      {/* Title Skeleton */}
      <div className="mb-6 md:mb-10">
        <ShimmerEffect className="h-8 bg-gray-300 rounded w-48" />
      </div>

      {/* Packages Grid Skeleton */}
      <div className="grid grid-cols-2 gap-3 md:gap-8 mb-6 md:mb-8 w-full max-w-6xl">
        {[...Array(6)].map((_, index) => (
          <div
            key={index}
            className="w-full h-[60px] md:h-[100px] relative rounded-md overflow-hidden opacity-100 shadow-md"
          >
            <ShimmerEffect className="w-full h-full" />
            <div className="absolute top-0 left-0 w-full h-full flex items-center justify-center">
              <ShimmerEffect className="h-4 md:h-8 bg-gray-400 rounded w-24 md:w-32" />
            </div>
          </div>
        ))}
      </div>
    </section>
  );
};

export default PackagesSectionSkeleton;
