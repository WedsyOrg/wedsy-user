import React from 'react';
import ShimmerEffect from './ShimmerEffect';

const SuccessSkeleton = () => {
  return (
    <>
      {/* Mobile View */}
      <div className="md:hidden relative">
        <ShimmerEffect className="w-full h-96 bg-gray-300" />
        <div className="absolute bottom-12 left-1/2 -translate-x-1/2 w-full px-12 flex flex-row w-full">
          <ShimmerEffect className="bg-gray-300 rounded-lg w-full h-10" />
        </div>
      </div>
      
      {/* Desktop View */}
      <div className="hidden md:block relative">
        <ShimmerEffect className="w-full h-96 bg-gray-300" />
        <ShimmerEffect className="absolute bottom-8 lg:bottom-12 left-1/2 -translate-x-1/2 h-10 w-32 bg-gray-300 rounded-lg" />
      </div>
    </>
  );
};

export default SuccessSkeleton;
