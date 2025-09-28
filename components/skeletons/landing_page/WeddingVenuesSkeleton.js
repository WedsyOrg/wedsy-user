import React from 'react';
import ShimmerEffect from './ShimmerEffect';

const WeddingVenuesSkeleton = () => {
  return (
    <section className="w-full py-6 md:py-24 px-6 md:px-40 md:mt-32">
      <div className="mt-6 md:mt-18 max-w-7xl mx-auto">
        <div className="grid grid-cols-11 grid-rows-7 gap-2 min-h-[250px] md:min-h-[450px] lg:min-h-[550px] md:gap-4">
          
          {/* Text Content Area Skeleton */}
          <div className="col-span-7 row-span-3 col-start-1 row-start-1 p-2 md:p-8 flex flex-col justify-center items-start text-left">
            <div className="space-y-2 md:space-y-6">
              <ShimmerEffect className="h-6 bg-gray-300 rounded w-32" />
              <ShimmerEffect className="h-12 bg-gray-300 rounded w-64" />
              <ShimmerEffect className="h-5 bg-gray-300 rounded w-80" />
            </div>
          </div>

          {/* Large Image Skeleton */}
          <div className="col-span-4 row-span-5 col-start-8 row-start-1 relative overflow-hidden rounded-xl shadow-md">
            <ShimmerEffect className="w-full h-full" />
          </div>

          {/* Medium Image Skeleton */}
          <div className="col-span-4 row-span-4 col-start-1 row-start-4 relative overflow-hidden rounded-xl shadow-md">
            <ShimmerEffect className="w-full h-full" />
          </div>

          {/* Small Image 1 Skeleton */}
          <div className="col-span-3 row-span-2 col-start-5 row-start-4 relative overflow-hidden rounded-xl shadow-md">
            <ShimmerEffect className="w-full h-full" />
          </div>

          {/* Small Image 2 Skeleton */}
          <div className="col-span-2 row-span-2 col-start-5 row-start-6 relative overflow-hidden rounded-xl shadow-md">
            <ShimmerEffect className="w-full h-full" />
          </div>

          {/* Button Area Skeleton */}
          <div className="col-span-5 row-span-2 col-start-7 row-start-6 flex items-center justify-center relative overflow-hidden rounded-xl shadow-md">
            <div className="absolute inset-0 bg-gray-300"></div>
            <ShimmerEffect className="h-8 bg-gray-400 rounded w-40" />
          </div>
        </div>
      </div>
    </section>
  );
};

export default WeddingVenuesSkeleton;
