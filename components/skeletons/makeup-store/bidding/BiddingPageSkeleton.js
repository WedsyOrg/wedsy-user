import React from 'react';
import HowItWorksSkeleton from './HowItWorksSkeleton';
import EventsSkeleton from './EventsSkeleton';
import ProgressBarSkeleton from './ProgressBarSkeleton';
import MakeupRequirementsSkeleton from './MakeupRequirementsSkeleton';
import CompleteSkeleton from './CompleteSkeleton';
import SuccessSkeleton from './SuccessSkeleton';

const BiddingPageSkeleton = () => {
  return (
    <div className="w-full">
      {/* Mobile Sticky Footer Skeleton */}
      <div className="md:hidden fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 p-4">
        <div className="flex justify-center space-x-4">
          <div className="h-10 bg-gray-300 rounded w-20" />
          <div className="h-10 bg-gray-300 rounded w-20" />
          <div className="h-10 bg-gray-300 rounded w-20" />
        </div>
      </div>

      {/* Progress Bar + Makeup Requirements Step (Current Step) */}
      <div className="relative overflow-hidden w-full">
        <ProgressBarSkeleton />
        <MakeupRequirementsSkeleton />
      </div>
    </div>
  );
};

export default BiddingPageSkeleton;
