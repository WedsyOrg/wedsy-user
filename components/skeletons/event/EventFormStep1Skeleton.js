import React from 'react';
import ShimmerEffect from './ShimmerEffect';

const EventFormStep1Skeleton = () => {
  return (
    <div className="flex flex-col gap-6">
      {/* Title */}
      <ShimmerEffect className="h-8 bg-gray-300 rounded w-80 mx-auto" />
      
      {/* Form Fields */}
      <div className="flex flex-col gap-6">
        {/* First Field */}
        <div>
          <ShimmerEffect className="h-4 bg-gray-300 rounded w-72 mx-auto mb-4" />
          <ShimmerEffect className="h-12 bg-gray-300 rounded w-full" />
        </div>
        
        {/* Second Field */}
        <div>
          <ShimmerEffect className="h-4 bg-gray-300 rounded w-80 mx-auto mb-4" />
          <ShimmerEffect className="h-12 bg-gray-300 rounded w-full" />
        </div>
      </div>
      
      {/* Next Button */}
      <ShimmerEffect className="h-12 bg-gray-300 rounded w-32 mx-auto" />
    </div>
  );
};

export default EventFormStep1Skeleton;
