import React from 'react';
import ShimmerEffect from './ShimmerEffect';

const PhotoboothSectionSkeleton = () => {
  return (
    <section className="py-8 md:mt-0">
      {/* Heading Skeleton */}
      <div className="w-full flex items-center justify-center relative py-8 bg-[#F4F4F4]">
        <div className="w-full max-w-[1180px] flex items-center justify-center relative px-4">
          <ShimmerEffect className="h-8 bg-gray-300 rounded w-64" />
          <ShimmerEffect className="h-6 bg-gray-300 rounded w-24 absolute right-4 hidden md:block" />
        </div>
      </div>

      {/* Desktop Grid Layout Skeleton */}
      <div className="hidden md:block max-w-[1180px] mx-auto px-4">
        <div className="grid grid-cols-3 gap-6">
          {/* Large image on the left */}
          <div className="col-span-1">
            <ShimmerEffect className="w-full h-[400px] bg-gray-300 rounded-[20px]" />
          </div>

          {/* Two medium images on the right */}
          <div className="col-span-2 space-y-6">
            <div className="grid grid-cols-2 gap-6">
              <ShimmerEffect className="w-full h-[190px] bg-gray-300 rounded-[20px]" />
              <ShimmerEffect className="w-full h-[190px] bg-gray-300 rounded-[20px]" />
            </div>

            {/* Bottom row with two images */}
            <div className="grid grid-cols-2 gap-6">
              <ShimmerEffect className="w-full h-[190px] bg-gray-300 rounded-[20px]" />
              <ShimmerEffect className="w-full h-[190px] bg-gray-300 rounded-[20px]" />
            </div>
          </div>
        </div>
      </div>

      {/* Mobile Grid Layout Skeleton */}
      <div className="md:hidden px-4">
        <div className="grid grid-cols-2 gap-4">
          {[...Array(5)].map((_, index) => (
            <div
              key={index}
              className={`relative ${
                index === 4 ? 'col-span-2' : ''
              }`}
            >
              <ShimmerEffect className="w-full h-[200px] bg-gray-300 rounded-[15px]" />
            </div>
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

export default PhotoboothSectionSkeleton;
