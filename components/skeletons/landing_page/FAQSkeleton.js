import React from 'react';
import ShimmerEffect from './ShimmerEffect';

const FAQSkeleton = () => {
  return (
    <section className="py-16 md:py-24 px-6 md:px-40 hidden md:block">
      <div className="max-w-7xl mx-auto">
        
        {/* FAQ Items Skeleton */}
        <div className="flex flex-col">
          {[...Array(6)].map((_, index) => (
            <div key={index} className="flex flex-col">
              <div className="w-full py-4 md:py-6 flex justify-between items-center">
                <ShimmerEffect className="h-6 bg-gray-300 rounded w-3/4" />
                <ShimmerEffect className="h-6 w-6 bg-gray-300 rounded" />
              </div>
              <div className="w-full h-px bg-gray-200"></div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default FAQSkeleton;
