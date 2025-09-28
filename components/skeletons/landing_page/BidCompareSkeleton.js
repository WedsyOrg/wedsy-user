import React from 'react';
import ShimmerEffect from './ShimmerEffect';

const BidCompareSkeleton = () => {
  return (
    <div className="flex flex-col md:flex-row justify-center items-stretch py-16 md:py-24 px-6 md:px-40 mt-6 md:mt-18">
      
      {/* Mobile-only View Skeleton */}
      <div className="md:hidden w-full flex flex-col items-center">
        <div className="relative w-full h-[400px] overflow-hidden bg-gray-200 rounded-lg">
          <ShimmerEffect className="w-full h-full" />
        </div>

        <div className="md:hidden w-full flex justify-center mt-6">
          <ShimmerEffect className="h-12 bg-gray-300 rounded w-64" />
        </div>
      </div>

      {/* Desktop View Skeleton */}
      <div className="hidden md:flex flex-1 flex-col md:flex-row justify-center items-stretch">
        
        {/* Text Content Skeleton */}
        <div className="w-full md:w-1/2 bg-gray-100 p-6 md:p-10 flex flex-col justify-between shadow-md mb-4 md:mb-0 md:mr-4">
          <div className="space-y-4">
            <ShimmerEffect className="h-12 bg-gray-300 rounded w-48" />
            <ShimmerEffect className="h-8 bg-gray-300 rounded w-full" />
            <ShimmerEffect className="h-6 bg-gray-300 rounded w-3/4" />
            <ShimmerEffect className="h-20 bg-gray-300 rounded w-full" />
          </div>
          <ShimmerEffect className="h-12 bg-gray-300 rounded w-56 self-start" />
        </div>

        {/* Image Content Skeleton */}
        <div className="relative w-full md:w-1/2 flex overflow-hidden shadow-md mt-4 md:mt-0 bg-gray-200">
          <ShimmerEffect className="w-full h-full" />
          <div className="absolute top-0 left-0 p-6 md:p-10 z-10">
            <div className="space-y-2">
              <ShimmerEffect className="h-12 bg-gray-400 rounded w-32" />
              <ShimmerEffect className="h-8 bg-gray-400 rounded w-24" />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default BidCompareSkeleton;
