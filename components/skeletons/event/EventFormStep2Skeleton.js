import React from 'react';
import ShimmerEffect from './ShimmerEffect';

const EventFormStep2Skeleton = () => {
  return (
    <div className="flex flex-col gap-6">
      {/* Event Name Title */}
      <ShimmerEffect className="h-8 bg-gray-300 rounded w-64 mx-auto" />
      
      {/* Subtitle */}
      <ShimmerEffect className="h-4 bg-gray-300 rounded w-72 mx-auto mb-4" />
      
      {/* Form Fields */}
      <div className="flex flex-col gap-4">
        {/* First Row - Event Day and Venue */}
        <div className="grid grid-cols-2 gap-4">
          <ShimmerEffect className="h-12 bg-gray-300 rounded w-full" />
          <ShimmerEffect className="h-12 bg-gray-300 rounded w-full" />
        </div>
        
        {/* Second Row - Date and Time */}
        <div className="grid grid-cols-2 gap-4">
          <ShimmerEffect className="h-12 bg-gray-300 rounded w-full" />
          <ShimmerEffect className="h-12 bg-gray-300 rounded w-full" />
        </div>
      </div>
      
      {/* Helper Text */}
      <ShimmerEffect className="h-4 bg-gray-300 rounded w-80 mx-auto mb-4" />
      
      {/* Next Button */}
      <ShimmerEffect className="h-12 bg-gray-300 rounded w-24 mx-auto" />
    </div>
  );
};

export default EventFormStep2Skeleton;
