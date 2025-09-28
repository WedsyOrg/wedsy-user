import React from 'react';
import ShimmerEffect from './ShimmerEffect';

const ReviewsSectionSkeleton = () => {
  return (
    <div className="py-8 md:py-24 px-4 md:px-40">
      {/* Title Skeleton */}
      <div className="text-center mb-10 md:mb-16">
        <ShimmerEffect className="h-16 bg-gray-300 rounded w-96 mx-auto" />
      </div>

      {/* Grid Layout Skeleton */}
      <div className="grid grid-cols-1 grid-rows-auto gap-4 p-4 min-h-[500px] md:grid-cols-9 md:grid-rows-10 md:gap-2 md:min-h-[800px] lg:min-h-[1000px]">
        
        {/* Review Image 1 - Large */}
        <div className="col-span-full row-span-auto md:col-span-2 md:row-span-5 md:col-start-8 md:row-start-1 relative overflow-hidden rounded-lg shadow-md">
          <ShimmerEffect className="w-full h-full" />
        </div>

        {/* Review Image 2 */}
        <div className="col-span-full row-span-auto md:col-span-3 md:row-span-2 md:col-start-7 md:row-start-6 hidden md:block relative overflow-hidden rounded-lg shadow-md">
          <ShimmerEffect className="w-full h-full" />
        </div>

        {/* Review Image 3 */}
        <div className="col-span-full row-span-auto md:col-span-3 md:row-span-3 md:col-start-7 md:row-start-8 hidden md:block relative overflow-hidden rounded-lg shadow-md">
          <ShimmerEffect className="w-full h-full" />
        </div>

        {/* Review Image 4 */}
        <div className="col-span-full row-span-auto md:col-span-3 md:row-span-2 md:col-start-5 md:row-start-1 hidden md:block relative overflow-hidden rounded-lg shadow-md">
          <ShimmerEffect className="w-full h-full" />
        </div>

        {/* Review Image 5 */}
        <div className="col-span-full row-span-auto md:col-span-3 md:row-span-3 md:col-start-5 md:row-start-3 hidden md:block relative overflow-hidden rounded-lg shadow-md">
          <ShimmerEffect className="w-full h-full" />
        </div>

        {/* Review Image 6 */}
        <div className="col-span-full row-span-auto md:col-span-4 md:row-span-3 md:col-start-3 md:row-start-6 hidden md:block relative overflow-hidden rounded-lg shadow-md">
          <ShimmerEffect className="w-full h-full" />
        </div>

        {/* Review Image 7 */}
        <div className="col-span-full row-span-auto md:col-span-2 md:row-span-5 md:col-start-3 md:row-start-1 hidden md:block relative overflow-hidden rounded-lg shadow-md">
          <ShimmerEffect className="w-full h-full" />
        </div>

        {/* Review Image 8 */}
        <div className="col-span-full row-span-auto md:col-span-2 md:row-span-3 md:col-start-1 md:row-start-1 hidden md:block relative overflow-hidden rounded-lg shadow-md">
          <ShimmerEffect className="w-full h-full" />
        </div>

        {/* Review Image 9 */}
        <div className="col-span-full row-span-auto md:col-span-2 md:row-span-5 md:col-start-1 md:row-start-4 hidden md:block relative overflow-hidden rounded-lg shadow-md">
          <ShimmerEffect className="w-full h-full" />
        </div>

        {/* Review Image 10 */}
        <div className="col-span-full row-span-auto md:col-span-3 md:row-span-2 md:col-start-1 md:row-start-9 hidden md:block relative overflow-hidden rounded-lg shadow-md">
          <ShimmerEffect className="w-full h-full" />
        </div>

        {/* Review Image 11 */}
        <div className="col-span-full row-span-auto md:col-span-3 md:row-span-2 md:col-start-4 md:row-start-9 hidden md:block relative overflow-hidden rounded-lg shadow-md">
          <ShimmerEffect className="w-full h-full" />
        </div>
      </div>

      {/* Button Skeleton */}
      <div className="mt-16 text-center">
        <ShimmerEffect className="h-12 bg-gray-300 rounded w-80 mx-auto" />
      </div>
    </div>
  );
};

export default ReviewsSectionSkeleton;
