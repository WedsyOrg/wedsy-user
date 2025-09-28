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

      {/* Desktop Main Layout */}
      <div className="bg-[#f4f4f4] py-12 grid-cols-4 gap-4 px-24 mb-1 hidden md:grid">
        {/* Left Sidebar Navigation */}
        <div className="flex flex-col gap-4 py-12 mr-24">
          <div className="flex flex-row justify-between text-2xl items-center">
            <ShimmerEffect className="h-8 bg-gray-300 rounded w-48" />
            <ShimmerEffect className="h-6 w-6 bg-gray-300 rounded" />
          </div>
          <div className="flex flex-row justify-between text-2xl items-center">
            <ShimmerEffect className="h-8 bg-gray-300 rounded w-48" />
            <ShimmerEffect className="h-6 w-6 bg-gray-300 rounded" />
          </div>
          <div className="flex flex-row justify-between text-2xl items-center">
            <ShimmerEffect className="h-8 bg-gray-300 rounded w-48" />
            <ShimmerEffect className="h-6 w-6 bg-gray-300 rounded" />
          </div>
          <div className="flex flex-row justify-between text-2xl items-center">
            <ShimmerEffect className="h-8 bg-gray-300 rounded w-48" />
            <ShimmerEffect className="h-6 w-6 bg-gray-300 rounded" />
          </div>
        </div>
        
        {/* Main Banner Image */}
        <ShimmerEffect className="w-full col-span-3 h-96 bg-gray-300 rounded" />
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
