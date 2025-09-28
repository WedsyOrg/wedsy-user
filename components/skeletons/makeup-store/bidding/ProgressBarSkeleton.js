import React from 'react';
import ShimmerEffect from './ShimmerEffect';

const ProgressBarSkeleton = () => {
  return (
    <div className="w-full sticky top-0 bg-white flex flex-row items-center">
      {/* Back button */}
      <div className="hidden md:block my-4 mx-3">
        <div className="h-5 w-5 bg-gray-300 rounded" />
      </div>
      
      {/* Progress steps */}
      <div className="grid grid-cols-3 grow items-start">
        {/* Events step */}
        <div className="h-full p-2 md:p-4 border-b-2 border-[#840032]">
          <div className="flex flex-row gap-2 items-center justify-center">
            <div className="h-5 w-5 bg-gray-300 rounded" />
            <div className="h-5 md:h-6 bg-gray-300 rounded w-16" />
          </div>
        </div>
        
        {/* Makeup step - Active */}
        <div className="h-full p-2 md:p-4 border-b-2 border-[#840032]">
          <div className="flex flex-row gap-2 items-center justify-center">
            <div className="h-5 w-5 bg-gray-300 rounded" />
            <div>
              <div className="h-5 md:h-6 bg-gray-300 rounded w-20 mb-1" />
              <div className="h-3 bg-gray-300 rounded w-24 hidden md:block" />
            </div>
          </div>
        </div>
        
        {/* Complete step */}
        <div className="h-full p-2 md:p-4 border-b-2 border-white">
          <div className="flex flex-row gap-2 items-center justify-center">
            <div className="h-5 w-5 bg-gray-300 rounded" />
            <div>
              <div className="h-5 md:h-6 bg-gray-300 rounded w-20 mb-1" />
              <div className="h-3 bg-gray-300 rounded w-24 hidden md:block" />
            </div>
          </div>
        </div>
      </div>
      
      {/* Forward button */}
      <div className="hidden md:block my-4 mx-3">
        <div className="h-5 w-5 bg-gray-300 rounded" />
      </div>
    </div>
  );
};

export default ProgressBarSkeleton;
