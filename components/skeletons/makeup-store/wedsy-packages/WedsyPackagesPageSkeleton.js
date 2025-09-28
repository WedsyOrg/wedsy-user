import React from 'react';
import ShimmerEffect from './ShimmerEffect';

const WedsyPackagesPageSkeleton = () => {
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

      {/* Mobile Header */}
      <div className="bg-[#f4f4f4] uppercase px-6 text-center md:hidden pt-14 py-6 text-3xl font-semibold">
        <ShimmerEffect className="h-10 bg-gray-300 rounded w-64 mx-auto" />
      </div>

      {/* Mobile Grid Images */}
      <div className="bg-[#f4f4f4] py-4 px-6 grid grid-cols-2 gap-4 md:hidden">
        <ShimmerEffect className="h-32 bg-gray-300 rounded" />
        <ShimmerEffect className="h-32 bg-gray-300 rounded" />
        <ShimmerEffect className="h-32 bg-gray-300 rounded" />
        <ShimmerEffect className="h-32 bg-gray-300 rounded" />
      </div>

      {/* Mobile Package Categories */}
      <div className="flex flex-col bg-white gap-1 md:hidden">
        {[1, 2].map((categoryIndex) => (
          <div key={categoryIndex} className="bg-[#f4f4f4] pt-10 rounded-lg mt-2">
            {/* Category title */}
            <div className="text-center mb-6">
              <ShimmerEffect className="h-8 bg-gray-300 rounded w-48 mx-auto" />
            </div>
            
            {/* Package cards */}
            <div className="flex flex-col gap-1 bg-white">
              {[1, 2, 3].map((packageIndex) => (
                <div key={packageIndex} className="pt-16 pb-12 p-8 bg-[#f4f4f4]">
                  <div className="grid grid-cols-3 gap-4">
                    {/* Left side - Package details */}
                    <div className="col-span-2 h-full flex flex-col">
                      {/* Package name */}
                      <ShimmerEffect className="h-6 bg-gray-300 rounded w-48 mb-4" />
                      
                      {/* Reviews and time */}
                      <div className="grid grid-cols-[16px_auto] gap-x-2 pt-4">
                        <ShimmerEffect className="h-4 w-4 bg-gray-300 rounded" />
                        <ShimmerEffect className="h-5 bg-gray-300 rounded w-24" />
                        <ShimmerEffect className="h-1.5 w-1.5 bg-gray-300 rounded-full self-center" />
                        <ShimmerEffect className="h-5 bg-gray-300 rounded w-16" />
                      </div>

                      {/* Price */}
                      <div className="text-right mt-auto border-dashed border-b-2 border-gray-400 pt-4">
                        <ShimmerEffect className="h-8 bg-gray-300 rounded w-32 ml-auto" />
                      </div>
                    </div>
                    
                    {/* Right side - Package image */}
                    <ShimmerEffect className="h-32 bg-gray-300 rounded" />
                  </div>
                  
                  {/* Details section */}
                  <div className="grid grid-cols-3 gap-4">
                    <div className="col-span-2 pt-3">
                      <ShimmerEffect className="h-4 bg-gray-300 rounded w-full mb-2" />
                      <ShimmerEffect className="h-4 bg-gray-300 rounded w-3/4 mb-2" />
                      <ShimmerEffect className="h-4 bg-gray-300 rounded w-1/2 mb-4" />
                      <ShimmerEffect className="h-5 bg-gray-300 rounded w-24" />
                    </div>
                    
                    {/* Add button */}
                    <div className="flex justify-center">
                      <ShimmerEffect className="h-10 w-24 bg-gray-300 rounded" />
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>

      {/* Desktop Layout */}
      <div className="hidden md:block">
        {/* Desktop Header */}
        <div className="hidden md:grid grid-cols-2 bg-[#f4f4f4] px-24 py-12 mb-1">
          <div className="uppercase text-4xl font-medium">
            <ShimmerEffect className="h-12 bg-gray-300 rounded w-48" />
          </div>
          <div className="flex flex-row justify-around items-center gap-6 px-6">
            <ShimmerEffect className="h-12 bg-gray-300 rounded w-64" />
            <div className="flex items-center gap-1">
              <ShimmerEffect className="h-5 w-5 bg-gray-300 rounded" />
              <ShimmerEffect className="h-8 bg-gray-300 rounded w-32" />
            </div>
          </div>
        </div>

        {/* Desktop Two Column Layout */}
        <div className="hidden md:grid grid-cols-2 gap-1 relative overflow-hidden hide-scrollbar bg-white">
          {/* Left Column - Packages */}
          <div className="bg-[#f4f4f4] hide-scrollbar overflow-y-auto px-28 py-12 flex flex-col gap-12 mt-1">
            {[1, 2, 3].map((categoryIndex) => (
              <div key={categoryIndex} className="bg-white rounded-lg p-8">
                {/* Category title */}
                <div className="text-center mb-8">
                  <ShimmerEffect className="h-8 bg-gray-300 rounded w-48 mx-auto" />
                </div>
                
                {/* Package cards */}
                <div className="flex flex-col gap-4 divide-y-[6px] divide-y-gray-500">
                  {[1, 2, 3, 4].map((packageIndex) => (
                    <div key={packageIndex} className="pt-16 pb-12">
                      <div className="grid grid-cols-3 gap-4">
                        {/* Left side - Package details */}
                        <div className="col-span-2 h-full flex flex-col">
                          {/* Package name */}
                          <ShimmerEffect className="h-6 bg-gray-300 rounded w-48 mb-3" />
                          
                          {/* Reviews and time */}
                          <div className="grid grid-cols-[16px_auto] gap-x-2 pt-3">
                            <ShimmerEffect className="h-4 w-4 bg-gray-300 rounded" />
                            <ShimmerEffect className="h-4 bg-gray-300 rounded w-20" />
                            <ShimmerEffect className="h-1.5 w-1.5 bg-gray-300 rounded-full self-center" />
                            <ShimmerEffect className="h-4 bg-gray-300 rounded w-16" />
                          </div>

                          {/* Price */}
                          <div className="text-right mt-auto border-dashed border-b-2 pt-4">
                            <ShimmerEffect className="h-8 bg-gray-300 rounded w-32 ml-auto" />
                          </div>
                        </div>
                        
                        {/* Right side - Package image */}
                        <ShimmerEffect className="h-40 bg-gray-300 rounded" />
                      </div>
                      
                      {/* Details section */}
                      <div className="grid grid-cols-3 gap-4">
                        <div className="col-span-2 pt-3">
                          <ShimmerEffect className="h-4 bg-gray-300 rounded w-full mb-2" />
                          <ShimmerEffect className="h-4 bg-gray-300 rounded w-3/4 mb-2" />
                          <ShimmerEffect className="h-4 bg-gray-300 rounded w-1/2 mb-4" />
                          <ShimmerEffect className="h-5 bg-gray-300 rounded w-24" />
                        </div>
                        
                        {/* Add button */}
                        <div className="flex justify-center">
                          <ShimmerEffect className="h-10 w-24 bg-gray-300 rounded" />
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>

          {/* Right Column - Package Details */}
          <div className="bg-[#f4f4f4] hide-scrollbar overflow-y-auto p-12 flex flex-col gap-4 mt-1 pr-36">
            {/* Package name */}
            <ShimmerEffect className="h-12 bg-gray-300 rounded w-64" />
            
            {/* Process list */}
            <div className="p-6 flex flex-col gap-2">
              {[1, 2, 3, 4, 5].map((index) => (
                <div key={index} className="space-y-2">
                  <ShimmerEffect className="h-5 bg-gray-300 rounded w-3/4" />
                  <ShimmerEffect className="h-4 bg-gray-300 rounded w-full" />
                </div>
              ))}
            </div>
            
            {/* Divider */}
            <ShimmerEffect className="h-1 bg-gray-300 rounded w-full my-4" />
            
            {/* Overview title */}
            <ShimmerEffect className="h-8 bg-gray-300 rounded w-32" />
            
            {/* Overview grid */}
            <div className="grid grid-cols-2 gap-4">
              {[1, 2, 3, 4].map((index) => (
                <div key={index} className="bg-white rounded-lg p-4 grid grid-cols-3 gap-2 items-center w-72">
                  <ShimmerEffect className="h-6 bg-gray-300 rounded col-span-2" />
                  <ShimmerEffect className="h-8 w-8 bg-gray-300 rounded" />
                </div>
              ))}
            </div>
            
            {/* Divider */}
            <ShimmerEffect className="h-1 bg-gray-300 rounded w-full my-4" />
            
            {/* Reviews title */}
            <ShimmerEffect className="h-8 bg-gray-300 rounded w-24" />
            
            {/* Divider */}
            <ShimmerEffect className="h-1 bg-gray-300 rounded w-full my-4" />
            
            {/* All Reviews title */}
            <ShimmerEffect className="h-8 bg-gray-300 rounded w-32" />
          </div>
        </div>
      </div>

      {/* Mobile Modal Skeleton */}
      <div className="md:hidden">
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4">
          <div className="bg-[#F4F4F4] rounded-lg p-6 w-full max-w-md">
            <div className="flex justify-between items-center mb-4">
              <ShimmerEffect className="h-6 bg-gray-300 rounded w-32" />
              <ShimmerEffect className="h-6 w-6 bg-gray-300 rounded" />
            </div>
            
            {/* Package details */}
            <div className="space-y-4">
              <ShimmerEffect className="h-6 bg-gray-300 rounded w-48" />
              
              {/* Process list */}
              <div className="space-y-2">
                {[1, 2, 3, 4].map((index) => (
                  <div key={index} className="space-y-1">
                    <ShimmerEffect className="h-5 bg-gray-300 rounded w-3/4" />
                    <ShimmerEffect className="h-4 bg-gray-300 rounded w-full" />
                  </div>
                ))}
              </div>
              
              {/* Overview section */}
              <div className="space-y-4">
                <ShimmerEffect className="h-6 bg-gray-300 rounded w-24" />
                <div className="grid grid-cols-2 gap-4">
                  {[1, 2, 3, 4].map((index) => (
                    <div key={index} className="bg-white rounded-lg p-4 flex flex-col gap-2 items-center">
                      <ShimmerEffect className="h-12 w-12 bg-gray-300 rounded" />
                      <ShimmerEffect className="h-4 bg-gray-300 rounded w-24" />
                    </div>
                  ))}
                </div>
              </div>
              
              {/* Reviews section */}
              <div className="space-y-2">
                <ShimmerEffect className="h-6 bg-gray-300 rounded w-20" />
                <ShimmerEffect className="h-6 bg-gray-300 rounded w-24" />
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default WedsyPackagesPageSkeleton;
