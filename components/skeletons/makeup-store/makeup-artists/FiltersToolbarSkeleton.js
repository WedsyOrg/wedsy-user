import React from 'react';
import ShimmerEffect from './ShimmerEffect';

const FiltersToolbarSkeleton = () => {
  return (
    <div className="hidden md:block bg-white p-2 shadow-lg relative z-10">
      <div className="flex items-center justify-between gap-2 sm:gap-4">
        {/* Filter button */}
        <div className="flex items-center gap-1 sm:gap-2 p-1 sm:p-2 pr-2 sm:pr-4 flex-shrink-0">
          <ShimmerEffect className="h-4 w-4 sm:h-5 sm:w-5 bg-gray-300 rounded" />
          <ShimmerEffect className="h-4 sm:h-5 bg-gray-300 rounded w-12" />
        </div>
        
        {/* Divider */}
        <div className="h-6 sm:h-8 border-l border-gray-300"></div>

        {/* Filter options */}
        <div className="flex-grow flex items-center justify-between gap-x-8 px-3 overflow-x-auto scrollbar-hide">
          {[1, 2, 3, 4, 5, 6].map((index) => (
            <div key={index} className="flex items-center gap-2">
              <ShimmerEffect className="h-4 sm:h-5 bg-gray-300 rounded w-16 sm:w-20" />
              <ShimmerEffect className="h-3 w-3 bg-gray-300 rounded" />
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default FiltersToolbarSkeleton;
