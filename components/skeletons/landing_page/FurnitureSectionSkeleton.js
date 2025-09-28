import React from 'react';
import ShimmerEffect from './ShimmerEffect';

const FurnitureSectionSkeleton = () => {
  return (
    <div className="py-16 md:py-24 px-6 md:px-40 mt-6 md:mt-18">
      <div className="container mx-auto">
        
        {/* Main Furniture Image Skeleton */}
        <div className="relative w-full overflow-hidden h-96 md:h-[400px]">
          <ShimmerEffect className="w-full h-full" />
          <div className="absolute inset-0 bg-gradient-to-t from-white to-transparent z-10"></div>
          
          {/* Content Overlay Skeleton */}
          <div className="absolute inset-0 z-20 p-6 md:p-10 flex flex-col justify-end">
            <div className="flex flex-col items-center text-center space-y-4 w-full md:flex-row md:justify-between md:items-end md:text-left md:space-y-0">
              <ShimmerEffect className="h-6 bg-gray-300 rounded w-full md:w-2/3" />
              <ShimmerEffect className="h-12 bg-gray-300 rounded w-32" />
            </div>
          </div>
        </div>

        {/* Category Tags Skeleton */}
        <div className="mt-8 text-center">
          <div className="flex flex-wrap items-center justify-center w-full hidden md:block">
            <ShimmerEffect className="h-6 bg-gray-300 rounded w-20 mx-2" />
            <ShimmerEffect className="h-2 bg-gray-300 rounded w-2 mx-2" />
            <ShimmerEffect className="h-6 bg-gray-300 rounded w-24 mx-2" />
            <ShimmerEffect className="h-2 bg-gray-300 rounded w-2 mx-2" />
            <ShimmerEffect className="h-6 bg-gray-300 rounded w-16 mx-2" />
            <ShimmerEffect className="h-2 bg-gray-300 rounded w-2 mx-2" />
            <ShimmerEffect className="h-6 bg-gray-300 rounded w-20 mx-2" />
            <ShimmerEffect className="h-2 bg-gray-300 rounded w-2 mx-2" />
            <ShimmerEffect className="h-6 bg-gray-300 rounded w-12 mx-2" />
            <ShimmerEffect className="h-2 bg-gray-300 rounded w-2 mx-2" />
            <ShimmerEffect className="h-6 bg-gray-300 rounded w-32 mx-2" />
          </div>
        </div>
      </div>
    </div>
  );
};

export default FurnitureSectionSkeleton;
