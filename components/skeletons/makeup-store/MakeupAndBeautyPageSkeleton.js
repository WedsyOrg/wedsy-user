import React from 'react';
import ShimmerEffect from './ShimmerEffect';

const MakeupAndBeautyPageSkeleton = () => {
  return (
    <div className="bg-[#f4f4f4] w-full">
      {/* Mobile Sticky Footer Skeleton */}
      <div className="fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 p-4 md:hidden">
        <div className="flex justify-center space-x-4">
          <ShimmerEffect className="h-10 bg-gray-300 rounded w-20" />
          <ShimmerEffect className="h-10 bg-gray-300 rounded w-20" />
          <ShimmerEffect className="h-10 bg-gray-300 rounded w-20" />
        </div>
      </div>

      {/* Main Title Section */}
      <div className="bg-[#f4f4f4] uppercase px-12 text-center md:text-left md:px-24 py-6 md:py-12 text-2xl md:text-4xl font-semibold md:font-medium mb-1">
        <ShimmerEffect className="h-8 md:h-12 bg-gray-300 rounded w-64 mx-auto md:mx-0" />
      </div>

      {/* Mobile Book Now Section */}
      <div className="bg-[#f4f4f4] py-4 px-6 md:hidden mb-1">
        <div className="text-center space-y-2 mb-4">
          <ShimmerEffect className="h-6 bg-gray-300 rounded w-80 mx-auto" />
          <ShimmerEffect className="h-4 bg-gray-300 rounded w-72 mx-auto" />
        </div>
        <ShimmerEffect className="h-12 bg-gray-300 rounded w-full" />
      </div>

      {/* Mobile Grid Images */}
      <div className="bg-[#f4f4f4] py-4 px-6 grid grid-cols-2 gap-4 md:hidden">
        <ShimmerEffect className="h-32 bg-gray-300 rounded" />
        <ShimmerEffect className="h-32 bg-gray-300 rounded" />
        <ShimmerEffect className="h-32 bg-gray-300 rounded" />
        <ShimmerEffect className="h-32 bg-gray-300 rounded" />
      </div>

      {/* Mobile Full Width Image */}
      <ShimmerEffect className="w-full h-48 md:hidden bg-gray-300" />

      {/* Desktop Hero Section with Background Image and Buttons */}
      <div
        className="relative w-full mb-1 hidden md:block overflow-hidden"
        style={{
          aspectRatio: '16/9',
          maxHeight: '600px'
        }}
      >
        {/* Background Image Skeleton */}
        <ShimmerEffect className="absolute inset-0 bg-gray-300" />

        {/* Button Grid Skeleton */}
        <div className="absolute left-[8%] md:left-[10%] top-[58%] md:top-[62%] flex flex-col gap-3 md:gap-4 w-[32%] md:w-[28%]">
          <div className="grid grid-cols-2 gap-x-3 md:gap-x-6 lg:gap-x-8 gap-y-2 md:gap-y-3">
            <ShimmerEffect className="h-10 md:h-11 lg:h-12 bg-gray-200 rounded-lg lg:rounded-xl" />
            <ShimmerEffect className="h-10 md:h-11 lg:h-12 bg-gray-200 rounded-lg lg:rounded-xl" />
            <ShimmerEffect className="h-10 md:h-11 lg:h-12 bg-gray-200 rounded-lg lg:rounded-xl" />
            <ShimmerEffect className="h-10 md:h-11 lg:h-12 bg-gray-200 rounded-lg lg:rounded-xl" />
          </div>
        </div>
      </div>

      {/* Packages Section Title */}
      <div className="bg-[#f4f4f4] uppercase px-24 py-12 text-4xl font-medium md:mb-1">
        <ShimmerEffect className="h-12 bg-gray-300 rounded w-48" />
      </div>

      {/* Mobile Packages Section */}
      <div className="bg-[#f4f4f4] pt-0 md:hidden mb-1">
        <div className="px-6 flex flex-col gap-8 md:px-0 w-full mb-8">
          {/* Package 1 */}
          <div className="flex flex-col rounded-2xl overflow-hidden shadow-md">
            <ShimmerEffect className="h-16 bg-gray-300 rounded-t-2xl" />
            <div className="bg-white flex flex-col p-6 gap-4">
              <div className="space-y-2">
                <ShimmerEffect className="h-6 bg-gray-300 rounded w-24" />
                <div className="space-y-1">
                  <ShimmerEffect className="h-5 bg-gray-300 rounded w-full" />
                  <ShimmerEffect className="h-5 bg-gray-300 rounded w-3/4" />
                  <ShimmerEffect className="h-5 bg-gray-300 rounded w-1/2" />
                </div>
              </div>
              <div className="space-y-2">
                <ShimmerEffect className="h-6 bg-gray-300 rounded w-20" />
                <div className="space-y-1">
                  <ShimmerEffect className="h-5 bg-gray-300 rounded w-full" />
                  <ShimmerEffect className="h-5 bg-gray-300 rounded w-2/3" />
                </div>
              </div>
              <div className="flex justify-between items-center pt-4">
                <ShimmerEffect className="h-8 bg-gray-300 rounded w-32" />
                <ShimmerEffect className="h-10 bg-gray-300 rounded w-24" />
              </div>
            </div>
          </div>

          {/* Package 2 */}
          <div className="flex flex-col rounded-2xl overflow-hidden shadow-md">
            <ShimmerEffect className="h-16 bg-gray-300 rounded-t-2xl" />
            <div className="bg-white flex flex-col p-6 gap-4">
              <div className="space-y-2">
                <ShimmerEffect className="h-6 bg-gray-300 rounded w-24" />
                <div className="space-y-1">
                  <ShimmerEffect className="h-5 bg-gray-300 rounded w-full" />
                  <ShimmerEffect className="h-5 bg-gray-300 rounded w-3/4" />
                  <ShimmerEffect className="h-5 bg-gray-300 rounded w-1/2" />
                </div>
              </div>
              <div className="space-y-2">
                <ShimmerEffect className="h-6 bg-gray-300 rounded w-20" />
                <div className="space-y-1">
                  <ShimmerEffect className="h-5 bg-gray-300 rounded w-full" />
                  <ShimmerEffect className="h-5 bg-gray-300 rounded w-2/3" />
                </div>
              </div>
              <div className="flex justify-between items-center pt-4">
                <ShimmerEffect className="h-8 bg-gray-300 rounded w-32" />
                <ShimmerEffect className="h-10 bg-gray-300 rounded w-24" />
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Desktop Packages Section */}
      <div className="bg-[#f4f4f4] py-12 px-24 hidden md:block">
        <div className="grid grid-cols-4 gap-8">
          {[1, 2, 3, 4].map((index) => (
            <div key={index} className="flex flex-col rounded-2xl overflow-hidden shadow-md">
              <ShimmerEffect className="h-20 bg-gray-300 rounded-t-2xl" />
              <div className="bg-white flex flex-col p-6 gap-4">
                <div className="space-y-2">
                  <ShimmerEffect className="h-6 bg-gray-300 rounded w-24" />
                  <div className="space-y-1">
                    <ShimmerEffect className="h-4 bg-gray-300 rounded w-full" />
                    <ShimmerEffect className="h-4 bg-gray-300 rounded w-3/4" />
                    <ShimmerEffect className="h-4 bg-gray-300 rounded w-1/2" />
                  </div>
                </div>
                <div className="space-y-2">
                  <ShimmerEffect className="h-6 bg-gray-300 rounded w-20" />
                  <div className="space-y-1">
                    <ShimmerEffect className="h-4 bg-gray-300 rounded w-full" />
                    <ShimmerEffect className="h-4 bg-gray-300 rounded w-2/3" />
                  </div>
                </div>
                <div className="flex justify-between items-center pt-4">
                  <ShimmerEffect className="h-8 bg-gray-300 rounded w-32" />
                  <ShimmerEffect className="h-10 bg-gray-300 rounded w-24" />
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Bidding Intro Section Skeleton */}
      <div className="mb-1">
        {/* Mobile Bidding Image Skeleton */}
        <div className="md:hidden relative">
          <ShimmerEffect className="w-full h-96 bg-gray-300" />
          <div className="absolute bottom-12 left-1/2 -translate-x-1/2 w-full px-12">
            <ShimmerEffect className="h-10 bg-gray-200 rounded-lg w-full" />
          </div>
        </div>

        {/* Desktop Bidding Image Skeleton */}
        <div className="hidden md:block relative">
          <ShimmerEffect className="w-full h-[500px] bg-gray-300" />
          <div className="absolute bottom-8 lg:bottom-12 left-1/2 -translate-x-1/2">
            <ShimmerEffect className="h-10 w-32 bg-gray-200 rounded-lg" />
          </div>
        </div>
      </div>

      {/* Vendor Packages Section */}
      <div className="bg-[#f4f4f4] py-12 px-6 md:px-24">
        <div className="mb-8">
          <ShimmerEffect className="h-12 bg-gray-300 rounded w-64 mb-4" />
          <ShimmerEffect className="h-6 bg-gray-300 rounded w-96" />
        </div>

        {/* Mobile Vendor Grid */}
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 md:hidden">
          {[1, 2, 3, 4, 5, 6].map((index) => (
            <div key={index} className="bg-white rounded-lg overflow-hidden shadow-md">
              <ShimmerEffect className="h-32 bg-gray-300" />
              <div className="p-4 space-y-2">
                <ShimmerEffect className="h-5 bg-gray-300 rounded w-3/4" />
                <ShimmerEffect className="h-4 bg-gray-300 rounded w-1/2" />
                <ShimmerEffect className="h-6 bg-gray-300 rounded w-20" />
              </div>
            </div>
          ))}
        </div>

        {/* Desktop Vendor Grid */}
        <div className="hidden md:grid grid-cols-3 lg:grid-cols-4 gap-6">
          {[1, 2, 3, 4, 5, 6, 7, 8].map((index) => (
            <div key={index} className="bg-white rounded-lg overflow-hidden shadow-md">
              <ShimmerEffect className="h-48 bg-gray-300" />
              <div className="p-6 space-y-3">
                <ShimmerEffect className="h-6 bg-gray-300 rounded w-3/4" />
                <ShimmerEffect className="h-4 bg-gray-300 rounded w-1/2" />
                <ShimmerEffect className="h-8 bg-gray-300 rounded w-24" />
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* FAQ Section */}
      <div className="bg-[#f4f4f4] py-12 px-6 md:px-24">
        <div className="mb-8">
          <ShimmerEffect className="h-12 bg-gray-300 rounded w-48 mx-auto" />
        </div>
        <div className="space-y-4">
          {[1, 2, 3, 4, 5].map((index) => (
            <div key={index} className="bg-white rounded-lg p-6">
              <ShimmerEffect className="h-6 bg-gray-300 rounded w-3/4 mb-2" />
              <ShimmerEffect className="h-4 bg-gray-300 rounded w-full" />
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default MakeupAndBeautyPageSkeleton;
