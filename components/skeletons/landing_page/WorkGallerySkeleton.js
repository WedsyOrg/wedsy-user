import React from 'react';
import ShimmerEffect from './ShimmerEffect';

const WorkGallerySkeleton = () => {
  return (
    <div className="py-16 md:py-24 px-4 md:px-10 lg:px-20 text-center">
      {/* Title Skeleton */}
      <div className="mb-12 md:mb-16">
        <ShimmerEffect className="h-12 bg-gray-300 rounded w-64 mx-auto" />
      </div>
      
      {/* Desktop Grid Skeleton */}
      <div className="hidden md:grid grid-cols-1 md:grid-cols-3 gap-4 max-w-6xl mx-auto">
        
        {/* Column 1 */}
        <div className="flex flex-col gap-4">
          <div className="relative overflow-hidden h-40 md:h-48 bg-gray-300 shadow-md">
            <ShimmerEffect className="w-full h-full" />
          </div>
          <div className="relative overflow-hidden flex-grow bg-gray-300 shadow-md h-64 md:h-80">
            <ShimmerEffect className="w-full h-full" />
          </div>
        </div>
        
        {/* Column 2 */}
        <div className="flex flex-col gap-4">
          <div className="relative overflow-hidden h-40 md:h-48 bg-gray-300 shadow-md">
            <ShimmerEffect className="w-full h-full" />
          </div>
          <div className="relative overflow-hidden flex-grow bg-gray-300 shadow-md h-64 md:h-80">
            <ShimmerEffect className="w-full h-full" />
          </div>
        </div>
        
        {/* Column 3 */}
        <div className="flex flex-col gap-4">
          <div className="relative overflow-hidden flex-grow bg-gray-300 shadow-md h-64 md:h-80">
            <ShimmerEffect className="w-full h-full" />
          </div>
          <div className="relative overflow-hidden h-40 md:h-48 bg-gray-300 shadow-md">
            <ShimmerEffect className="w-full h-full" />
          </div>
        </div>
      </div>
      
      {/* Mobile Layout Skeleton */}
      <div className="block md:hidden flex flex-col gap-4 max-w-6xl mx-auto">
        <div className="relative overflow-hidden w-full h-80 bg-gray-300 shadow-md rounded-md">
          <ShimmerEffect className="w-full h-full" />
        </div>
        <div className="flex flex-row gap-2 justify-between">
          {[...Array(4)].map((_, index) => (
            <div key={index} className="relative overflow-hidden w-1/4 h-24 bg-gray-300 shadow-md rounded-md">
              <ShimmerEffect className="w-full h-full" />
            </div>
          ))}
        </div>
      </div>
      
      {/* Button Skeleton */}
      <div className="mt-12 md:mt-12">
        <ShimmerEffect className="h-12 bg-gray-300 rounded w-32 mx-auto" />
      </div>
    </div>
  );
};

export default WorkGallerySkeleton;
