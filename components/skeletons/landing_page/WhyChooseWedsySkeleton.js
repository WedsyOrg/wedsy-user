import React from 'react';
import ShimmerEffect from './ShimmerEffect';

const WhyChooseWedsySkeleton = () => {
  return (
    <main className="py-16 px-6">
      <div className="text-center flex flex-col h-full relative">
        {/* Title Skeleton */}
        <div className="hidden md:block text-center mb-4">
          <ShimmerEffect className="h-10 bg-gray-300 rounded w-80 mx-auto" />
        </div>

        {/* Subtitle Skeleton */}
        <div className="hidden md:block mb-8">
          <ShimmerEffect className="h-10 bg-gray-300 rounded w-96 mx-auto" />
        </div>

        {/* Content Section Skeleton */}
        <div className="flex flex-col md:flex-row items-start py-12 px-18 md:px-40 h-full justify-between">
          <div className="w-full md:w-auto flex justify-start items-center text-left md:justify-center md:items-center md:text-center h-full mb-8 md:mb-0">
            <ShimmerEffect className="h-8 bg-gray-300 rounded w-48" />
          </div>

          <div className="flex-1 flex flex-col items-center md:items-start text-left max-w-2xl self-center">
            <ShimmerEffect className="h-6 bg-gray-300 rounded w-full mb-4" />
            <ShimmerEffect className="h-6 bg-gray-300 rounded w-3/4 mb-4" />

            {/* Category Tags Skeleton */}
            <div className="w-full flex flex-col items-start hidden md:block">
              <div className="flex flex-wrap justify-end text-left gap-x-12 gap-y-2 w-full mb-2">
                <ShimmerEffect className="h-5 bg-gray-300 rounded w-16" />
                <ShimmerEffect className="h-5 bg-gray-300 rounded w-2" />
                <ShimmerEffect className="h-5 bg-gray-300 rounded w-20" />
                <ShimmerEffect className="h-5 bg-gray-300 rounded w-2" />
                <ShimmerEffect className="h-5 bg-gray-300 rounded w-24" />
                <ShimmerEffect className="h-5 bg-gray-300 rounded w-2" />
                <ShimmerEffect className="h-5 bg-gray-300 rounded w-20" />
              </div>

              <div className="w-full flex flex-wrap justify-center text-left gap-x-12 gap-y-2">
                <ShimmerEffect className="h-5 bg-gray-300 rounded w-20" />
                <ShimmerEffect className="h-5 bg-gray-300 rounded w-2" />
                <ShimmerEffect className="h-5 bg-gray-300 rounded w-24" />
                <ShimmerEffect className="h-5 bg-gray-300 rounded w-2" />
                <ShimmerEffect className="h-5 bg-gray-300 rounded w-20" />
              </div>
            </div>
          </div>
        </div>

        {/* Image Grid Skeleton */}
        <div className="grid grid-cols-2 md:grid-cols-6 md:px-40 gap-1">
          {/* Large Image Skeleton */}
          <div className="relative overflow-hidden bg-gray-300 h-[200px] rounded-md md:h-auto md:row-span-2 md:col-span-3 md:rounded-none">
            <ShimmerEffect className="w-full h-full" />
          </div>

          {/* Small Image Skeletons */}
          {[...Array(5)].map((_, index) => (
            <div key={index} className="relative overflow-hidden bg-gray-300 h-[200px] rounded-md md:col-span-1 md:rounded-none">
              <ShimmerEffect className="w-full h-full" />
            </div>
          ))}

          {/* Button Skeleton */}
          <div className="relative overflow-hidden bg-gray-300 h-[200px] rounded-md md:col-span-1 flex justify-center items-center text-center md:bg-gray-300 md:h-[200px]">
            <ShimmerEffect className="h-10 bg-gray-400 rounded w-32" />
          </div>
        </div>

        {/* Explore Button Skeleton */}
        <div className="w-full flex justify-center items-center py-10 mt-10 md:mt-10 hidden md:flex">
          <ShimmerEffect className="h-12 bg-gray-300 rounded w-48" />
        </div>
      </div>
    </main>
  );
};

export default WhyChooseWedsySkeleton;
