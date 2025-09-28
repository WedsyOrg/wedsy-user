import React from 'react';
import ShimmerEffect from './ShimmerEffect';

const EventFormStep3Skeleton = () => {
  return (
    <div className="flex flex-col gap-6">
      {/* Event Name Title */}
      <ShimmerEffect className="h-8 bg-gray-300 rounded w-64 mx-auto" />
      
      {/* Event Details Card */}
      <div className="bg-white rounded-lg p-4 text-center">
        <ShimmerEffect className="h-4 bg-gray-300 rounded w-80 mx-auto" />
      </div>
      
      {/* Action Buttons */}
      <div className="flex flex-row gap-4 justify-center">
        <ShimmerEffect className="h-10 bg-gray-300 rounded w-48" />
        <ShimmerEffect className="h-10 bg-gray-300 rounded w-48" />
      </div>
    </div>
  );
};

export default EventFormStep3Skeleton;
