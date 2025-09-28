import React from 'react';
import ShimmerEffect from './ShimmerEffect';

const InstagramSectionSkeleton = () => {
  return (
    <>
      {/* Instagram Header Skeleton */}
      <div className="flex flex-col items-center py-6 md:py-8 px-4">
        <div className="flex items-center gap-2 md:gap-3 mb-3 md:mb-4">
          <ShimmerEffect className="w-6 h-6 md:w-8 md:h-8 bg-gray-300 rounded" />
          <ShimmerEffect className="h-6 md:h-8 bg-gray-300 rounded w-32" />
        </div>
        <ShimmerEffect className="h-6 bg-gray-300 rounded w-full max-w-4xl" />
        <ShimmerEffect className="h-6 bg-gray-300 rounded w-3/4 max-w-4xl mt-2" />
      </div>

      {/* Instagram Grid Skeleton */}
      <div className="w-full max-w-4xl mx-auto px-4 mb-8">
        <div className="grid grid-cols-3 md:grid-cols-5">
          {[...Array(10)].map((_, index) => (
            <div
              key={index}
              className={`aspect-square ${index >= 9 ? 'hidden md:block' : ''}`}
            >
              <ShimmerEffect className="w-full h-full bg-gray-300 rounded" />
            </div>
          ))}
        </div>
      </div>
    </>
  );
};

export default InstagramSectionSkeleton;
