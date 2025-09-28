import React from 'react';
import ShimmerEffect from './ShimmerEffect';

const ServiceCategoriesSkeleton = () => {
  return (
    <div className="py-16 md:py-24 px-6 md:px-40 mt-6 md:mt-20 hidden md:block">
      <div className="container mx-auto flex flex-col space-y-4 md:space-y-6">
        
        {/* Makeup Artists Banner Skeleton */}
        <div className="relative flex items-center overflow-hidden h-24 md:h-32 group cursor-pointer mb-4 md:mb-6">
          <div className="absolute inset-0">
            <ShimmerEffect className="w-full h-full" />
          </div>
          <div className="relative z-10 w-full h-full flex items-center">
            <div className="absolute inset-y-0 left-0 w-1/2 bg-gradient-to-r from-white to-transparent"></div>
            <div className="relative z-20 text-black text-xl md:text-2xl font-semibold ml-4">
              <ShimmerEffect className="h-8 bg-gray-400 rounded w-48" />
            </div>
          </div>
        </div>

        {/* Decor Banner Skeleton */}
        <div className="relative flex items-center overflow-hidden h-24 md:h-32 group cursor-pointer mb-4 md:mb-6">
          <div className="absolute inset-0">
            <ShimmerEffect className="w-full h-full" />
          </div>
          <div className="relative z-10 w-full h-full flex items-center justify-end">
            <div className="absolute inset-y-0 right-0 w-1/2 bg-gradient-to-l from-white to-transparent"></div>
            <div className="relative z-20 text-black text-xl md:text-2xl font-semibold mr-4">
              <ShimmerEffect className="h-8 bg-gray-400 rounded w-24" />
            </div>
          </div>
        </div>

        {/* Photography Banner Skeleton */}
        <div className="relative flex items-center overflow-hidden h-24 md:h-32 group cursor-default mb-4 md:mb-6">
          <div className="absolute inset-0">
            <ShimmerEffect className="w-full h-full" />
          </div>
          <div className="relative z-10 w-full h-full flex items-center">
            <div className="absolute inset-y-0 left-0 w-1/2 bg-gradient-to-r from-white to-transparent"></div>
            <div className="relative z-20 text-black text-xl md:text-2xl font-semibold ml-4">
              <ShimmerEffect className="h-8 bg-gray-400 rounded w-36" />
            </div>
          </div>
          <div className="absolute inset-0 bg-black/70 flex items-center justify-center text-white text-lg font-semibold opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none">
            <ShimmerEffect className="h-6 bg-gray-400 rounded w-24" />
          </div>
        </div>

        {/* Wedding Venues Banner Skeleton */}
        <div className="relative flex items-center overflow-hidden h-24 md:h-32 group cursor-default mb-4 md:mb-6">
          <div className="absolute inset-0">
            <ShimmerEffect className="w-full h-full" />
          </div>
          <div className="relative z-10 w-full h-full flex items-center justify-end">
            <div className="absolute inset-y-0 right-0 w-1/2 bg-gradient-to-l from-white to-transparent"></div>
            <div className="relative z-20 text-black text-xl md:text-2xl font-semibold mr-4">
              <ShimmerEffect className="h-8 bg-gray-400 rounded w-40" />
            </div>
          </div>
          <div className="absolute inset-0 bg-black/70 flex items-center justify-center text-white text-lg font-semibold opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none">
            <ShimmerEffect className="h-6 bg-gray-400 rounded w-24" />
          </div>
        </div>
      </div>
    </div>
  );
};

export default ServiceCategoriesSkeleton;
