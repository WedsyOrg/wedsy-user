import React from 'react';
import ShimmerEffect from './ShimmerEffect';

const ArtistCardSkeleton = () => {
  return (
    <div className="bg-white p-2 sm:p-3 md:p-4 rounded-lg flex flex-col gap-1 sm:gap-2 md:gap-3 lg:gap-4 shadow-md">
      {/* Image skeleton */}
      <div className="bg-gray-500 pt-[100%] w-full relative rounded-xl">
        <ShimmerEffect className="absolute inset-0 bg-gray-300 rounded-xl" />
      </div>
      
      {/* Content skeleton */}
      <div className="flex flex-col gap-1">
        {/* Name */}
        <ShimmerEffect className="h-4 sm:h-5 md:h-6 bg-gray-300 rounded w-3/4" />
        
        {/* Rating and Location (desktop only) */}
        <div className="hidden md:flex flex-row items-end gap-1 lg:gap-2 justify-between">
          <div className="flex items-center gap-1">
            <ShimmerEffect className="h-3 w-3 bg-gray-300 rounded" />
            <ShimmerEffect className="h-3 bg-gray-300 rounded w-8" />
          </div>
          <div className="flex items-center gap-1">
            <ShimmerEffect className="h-3 w-3 bg-gray-300 rounded" />
            <ShimmerEffect className="h-3 bg-gray-300 rounded w-16" />
          </div>
        </div>
        
        {/* Speciality */}
        <div>
          <ShimmerEffect className="h-3 bg-gray-300 rounded w-20 mb-1" />
          <ShimmerEffect className="h-3 bg-gray-300 rounded w-24" />
        </div>
        
        {/* Price */}
        <div className="flex flex-col md:flex-row justify-end md:gap-1 items-end">
          <ShimmerEffect className="h-4 md:h-5 bg-gray-300 rounded w-20" />
          <ShimmerEffect className="h-3 bg-gray-300 rounded w-12" />
        </div>
      </div>
    </div>
  );
};

export default ArtistCardSkeleton;
