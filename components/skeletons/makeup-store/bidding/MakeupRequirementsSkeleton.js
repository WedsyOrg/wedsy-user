import React from 'react';
import ShimmerEffect from './ShimmerEffect';

const MakeupRequirementsSkeleton = () => {
  return (
    <>
      {/* Mobile View */}
      <div className="bg-[#FAFBFF] flex md:hidden flex-col gap-4">
        {/* Event tabs */}
        <div className="grid grid-cols-3 gap-4 p-4 items-center border-b-4 border-b-white">
          <div className="h-10 bg-gray-300 rounded-full" />
          <div className="h-10 bg-gray-300 rounded-full" />
          <div className="h-10 bg-gray-300 rounded-full" />
        </div>
        
        {/* Event details form */}
        <div className="grid grid-cols-2 gap-4 p-4 border-b-4 border-b-white">
          <div className="col-span-2">
            <div className="h-4 bg-gray-300 rounded w-20 mb-2" />
            <div className="h-10 bg-gray-300 rounded w-full" />
          </div>
          <div>
            <div className="h-4 bg-gray-300 rounded w-12 mb-2" />
            <div className="h-10 bg-gray-300 rounded w-full" />
          </div>
          <div>
            <div className="h-4 bg-gray-300 rounded w-12 mb-2" />
            <div className="h-10 bg-gray-300 rounded w-full" />
          </div>
          <div className="col-span-2">
            <div className="h-4 bg-gray-300 rounded w-16 mb-2" />
            <div className="h-10 bg-gray-300 rounded w-full" />
          </div>
        </div>
        
        {/* People details */}
        <div className="grid grid-cols-2 gap-4 border-b-4 border-b-white p-4">
          <div>
            <div className="h-10 bg-gray-300 rounded w-full" />
          </div>
          <div>
            <div className="h-10 bg-gray-300 rounded w-full" />
          </div>
          <div>
            <div className="h-10 bg-gray-300 rounded w-full" />
          </div>
          <div>
            <div className="h-10 bg-gray-300 rounded w-full" />
          </div>
        </div>
        
        {/* Action buttons */}
        <div className="grid grid-cols-2 gap-4 p-4">
          <div className="h-10 bg-gray-300 rounded w-full" />
          <div className="h-10 bg-gray-300 rounded w-full" />
        </div>
        
        {/* Next button */}
        <div className="h-12 bg-gray-300 rounded w-32 mx-4 mb-8" />
      </div>

      {/* Desktop View */}
      <div className="px-24 py-8 bg-[#FAFBFF] hidden md:grid grid-cols-4 gap-4 items-center">
        {/* Title and description */}
        <div className="h-8 bg-gray-300 rounded w-48" />
        <div className="col-span-3 h-5 bg-gray-300 rounded w-96" />
        
        {/* Event tabs sidebar */}
        <div className="border-r flex flex-col gap-4 justify-center h-full py-8">
          <div className="h-12 bg-gray-300 rounded-lg mr-8" />
          <div className="h-12 bg-gray-300 rounded-lg mr-8" />
        </div>
        
        {/* Form content */}
        <div className="flex flex-col gap-4 col-span-3 py-4 self-start">
          {/* Event details */}
          <div className="grid grid-cols-5 gap-4">
            <div>
              <div className="h-4 bg-gray-300 rounded w-20 mb-2" />
              <div className="h-10 bg-gray-300 rounded w-full" />
            </div>
            <div>
              <div className="h-4 bg-gray-300 rounded w-12 mb-2" />
              <div className="h-10 bg-gray-300 rounded w-full" />
            </div>
            <div>
              <div className="h-4 bg-gray-300 rounded w-12 mb-2" />
              <div className="h-10 bg-gray-300 rounded w-full" />
            </div>
            <div className="col-span-2">
              <div className="h-4 bg-gray-300 rounded w-16 mb-2" />
              <div className="h-10 bg-gray-300 rounded w-full" />
            </div>
          </div>
          
          {/* People details */}
          <div className="grid grid-cols-5 gap-4">
            <div>
              <div className="h-4 bg-gray-300 rounded w-24 mb-2" />
              <div className="h-10 bg-gray-300 rounded w-full" />
            </div>
            <div className="col-span-4 grid grid-cols-3 gap-4">
              <div>
                <div className="h-4 bg-gray-300 rounded w-20 mb-2" />
                <div className="h-10 bg-gray-300 rounded w-full" />
              </div>
              <div>
                <div className="h-4 bg-gray-300 rounded w-24 mb-2" />
                <div className="h-10 bg-gray-300 rounded w-full" />
              </div>
              <div>
                <div className="h-4 bg-gray-300 rounded w-16 mb-2" />
                <div className="h-10 bg-gray-300 rounded w-full" />
              </div>
            </div>
          </div>
          
          {/* Action buttons */}
          <div className="grid grid-cols-4 gap-4">
            <div className="h-10 bg-gray-300 rounded w-full" />
            <div className="flex flex-row gap-2 items-center col-span-3">
              <div className="h-10 bg-gray-300 rounded w-1/2" />
              <div className="h-10 bg-gray-300 rounded w-full" />
            </div>
          </div>
        </div>
        
        {/* Next button */}
        <div className="col-span-4 flex flex-col items-center justify-center">
          <div className="h-12 bg-gray-300 rounded w-32" />
        </div>
      </div>
    </>
  );
};

export default MakeupRequirementsSkeleton;
