import React from 'react';
import ShimmerEffect from './ShimmerEffect';

const EventsSkeleton = () => {
  return (
    <div className="py-16 px-6 md:p-32 bg-[#FAFBFF] flex flex-col md:items-center gap-6 min-h-[80vh]">
      {/* Title */}
      <ShimmerEffect className="h-8 bg-gray-300 rounded w-64 mx-auto" />
      
      {/* Description */}
      <ShimmerEffect className="h-5 bg-gray-300 rounded w-80 mx-auto" />
      
      {/* Example text for desktop */}
      <ShimmerEffect className="h-4 bg-gray-300 rounded w-96 mx-auto hidden md:block" />
      
      {/* Input field */}
      <ShimmerEffect className="h-12 bg-gray-300 rounded w-64" />
      
      {/* Next button */}
      <ShimmerEffect className="h-12 bg-gray-300 rounded w-32" />
      
      {/* Example text for mobile */}
      <ShimmerEffect className="h-4 bg-gray-300 rounded w-80 mx-auto md:hidden" />
    </div>
  );
};

export default EventsSkeleton;
