import React from 'react';
import ShimmerEffect from './ShimmerEffect';

const DesktopBannerSkeleton = () => {
  return (
    <div className="w-full relative hidden md:block pt-[16.2%]">
      {/* Background image skeleton */}
      <ShimmerEffect className="absolute top-0 left-0 w-full h-full bg-gray-300" />
      
      {/* Content overlay skeleton */}
      <div className="absolute top-0 left-0 w-1/2 px-4 lg:px-8 py-2 lg:py-4 h-full flex flex-col justify-around">
        {/* Main text skeleton */}
        <div className="space-y-2">
          <ShimmerEffect className="h-6 lg:h-8 xl:h-10 bg-gray-300 rounded w-5/6" />
          <ShimmerEffect className="h-6 lg:h-8 xl:h-10 bg-gray-300 rounded w-4/5" />
          <ShimmerEffect className="h-6 lg:h-8 xl:h-10 bg-gray-300 rounded w-3/4" />
        </div>
        
        {/* Button skeleton */}
        <ShimmerEffect className="h-8 lg:h-10 bg-gray-300 rounded w-24 lg:w-32" />
      </div>
    </div>
  );
};

export default DesktopBannerSkeleton;
