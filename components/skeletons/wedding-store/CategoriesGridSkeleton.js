import React from 'react';
import ShimmerEffect from './ShimmerEffect';

const CategoriesGridSkeleton = () => {
  return (
    <section className="flex flex-col items-center pt-10 px-4">
      {/* Title Skeleton */}
      <div className="w-full flex justify-center mb-8 bg-[#F4F4F4]">
        <ShimmerEffect className="h-8 bg-gray-300 rounded w-80" />
      </div>

      {/* Categories Grid Skeleton */}
      <div className="grid grid-cols-2 gap-4 sm:gap-6 md:gap-8 justify-center w-full max-w-7xl">
        {[...Array(8)].map((_, index) => (
          <div
            key={index}
            className="w-full h-[80px] sm:h-[100px] relative rounded-md overflow-hidden opacity-100 shadow-md"
          >
            <ShimmerEffect className="w-full h-full" />
            <div className="absolute top-0 left-0 w-full h-full flex items-center justify-center">
              <ShimmerEffect className="h-6 bg-gray-400 rounded w-24" />
            </div>
          </div>
        ))}
      </div>

      {/* View More Button Skeleton */}
      <div className="flex flex-col items-center w-full max-w-7xl mt-4 sm:mt-6 md:mt-8">
        <div className="flex justify-start md:justify-center w-full sm:px-0">
          <ShimmerEffect className="w-[calc(50%-0.5rem)] sm:max-w-[calc(50%-1.5rem)] md:max-w-[calc(50%-2rem)] h-[35px] sm:h-[100px] rounded-md" />
        </div>
      </div>
    </section>
  );
};

export default CategoriesGridSkeleton;
