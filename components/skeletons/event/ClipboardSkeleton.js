import React from 'react';
import ShimmerEffect from './ShimmerEffect';

const ClipboardSkeleton = () => {
  return (
    <div className="relative flex justify-center items-center h-full">
      <ShimmerEffect className="w-[450px] h-[600px] bg-gray-300 rounded-lg" />
    </div>
  );
};

export default ClipboardSkeleton;
