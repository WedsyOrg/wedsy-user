import React from 'react';
import ShimmerEffect from './ShimmerEffect';

const CompleteSkeleton = () => {
  return (
    <div className="py-8 px-6 md:p-24 bg-[#FAFBFF] flex flex-col md:items-center gap-8 min-h-[80vh]">
      {/* Title */}
      <ShimmerEffect className="h-8 bg-gray-300 rounded w-96 mx-auto" />
      
      {/* Form fields */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 min-w-fit md:w-1/2">
        {/* City field */}
        <div className="md:col-span-2">
          <ShimmerEffect className="h-4 bg-gray-300 rounded w-12 mb-2" />
          <ShimmerEffect className="h-10 bg-gray-300 rounded w-full" />
        </div>
        
        {/* Gender field */}
        <div className="md:col-span-2">
          <ShimmerEffect className="h-4 bg-gray-300 rounded w-16 mb-2" />
          <ShimmerEffect className="h-10 bg-gray-300 rounded w-full" />
        </div>
        
        {/* Spacer */}
        <div className="hidden md:block" />
        
        {/* Category field */}
        <div className="md:col-span-2">
          <ShimmerEffect className="h-4 bg-gray-300 rounded w-20 mb-2" />
          <ShimmerEffect className="h-10 bg-gray-300 rounded w-full" />
        </div>
        
        {/* Spacer */}
        <div className="hidden md:block" />
        
        {/* Studio makeup question */}
        <div className="md:col-span-4 flex flex-col gap-4 mt-4 justify-center items-center">
          <ShimmerEffect className="h-5 bg-gray-300 rounded w-80" />
          <div className="flex flex-col md:flex-row gap-4">
            <ShimmerEffect className="h-6 bg-gray-300 rounded w-48" />
            <ShimmerEffect className="h-6 bg-gray-300 rounded w-48" />
          </div>
        </div>
      </div>
      
      {/* Submit button */}
      <ShimmerEffect className="h-12 bg-gray-300 rounded w-32" />
    </div>
  );
};

export default CompleteSkeleton;
