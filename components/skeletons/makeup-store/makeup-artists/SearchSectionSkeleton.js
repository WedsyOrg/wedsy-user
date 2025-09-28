import React from 'react';
import ShimmerEffect from './ShimmerEffect';

const SearchSectionSkeleton = () => {
  return (
    <div className="bg-[#f4f4f4] py-6 md:pt-16 grid grid-cols-1 md:grid-cols-3 gap-4 px-4 sm:px-6 md:px-12 lg:px-24">
      {/* Title section */}
      <div className="hidden md:block">
        <ShimmerEffect className="h-8 lg:h-10 bg-gray-300 rounded w-48 mb-2" />
        <ShimmerEffect className="h-5 lg:h-6 bg-gray-300 rounded w-32" />
      </div>
      
      {/* Search input */}
      <div className="flex flex-col items-end gap-3 col-span-2 md:col-span-1">
        <div className="relative w-full">
          <ShimmerEffect className="h-10 sm:h-12 bg-gray-300 rounded-full w-full" />
        </div>
      </div>
      
      {/* Sort dropdown */}
      <div className="hidden md:block">
        <ShimmerEffect className="h-10 lg:h-12 bg-gray-300 rounded w-32 lg:w-40 ml-auto" />
      </div>
    </div>
  );
};

export default SearchSectionSkeleton;
