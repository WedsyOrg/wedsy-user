import React from 'react';
import ShimmerEffect from './ShimmerEffect';

const PaginationSkeleton = () => {
  return (
    <div className="col-span-2 md:col-span-3 lg:col-span-4 flex flex-row gap-2 lg:gap-3 items-center justify-center">
      {[1, 2, 3, 4, 5].map((index) => (
        <ShimmerEffect 
          key={index}
          className="h-6 w-6 sm:h-7 sm:w-7 md:h-8 md:w-8 rounded-full bg-gray-300" 
        />
      ))}
    </div>
  );
};

export default PaginationSkeleton;
