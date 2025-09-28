import React from 'react';
import ShimmerEffect from './ShimmerEffect';
import EventFormStep1Skeleton from './EventFormStep1Skeleton';
import EventFormStep2Skeleton from './EventFormStep2Skeleton';
import EventFormStep3Skeleton from './EventFormStep3Skeleton';
import ClipboardSkeleton from './ClipboardSkeleton';

const EventPageSkeleton = ({ formStep = 1 }) => {
  const renderFormSkeleton = () => {
    switch (formStep) {
      case 1:
        return <EventFormStep1Skeleton />;
      case 2:
        return <EventFormStep2Skeleton />;
      case 3:
        return <EventFormStep3Skeleton />;
      default:
        return <EventFormStep1Skeleton />;
    }
  };

  return (
    <>
      {/* Desktop View */}
      <div className="hidden md:block bg-[#F4F4F4] min-h-screen">
        {/* Header */}
        <div className="bg-[#F4F4F4]">
          <div className="px-24 py-8">
            <ShimmerEffect className="h-8 bg-gray-300 rounded w-48" />
          </div>
          <div className="w-full h-[3px] bg-white"></div>
          
          {/* Description Paragraph */}
          <div className="px-24 py-8">
            <div className="space-y-2">
              <ShimmerEffect className="h-5 bg-gray-300 rounded w-full max-w-2xl" />
              <ShimmerEffect className="h-5 bg-gray-300 rounded w-full max-w-2xl" />
              <ShimmerEffect className="h-5 bg-gray-300 rounded w-3/4 max-w-xl" />
            </div>
          </div>
        </div>

        {/* Main Content Grid */}
        <div className="px-24 pb-16">
          <div className="grid grid-cols-5 gap-8 items-start">
            {/* Form Section - Takes 3 columns */}
            <div className="col-span-3 mt-10">
              <div className="bg-[#F4DBD5] rounded-2xl p-8 h-fit">
                {renderFormSkeleton()}
              </div>
            </div>

            {/* Visual Section - Takes 2 columns for more height */}
            <div className="col-span-2 flex justify-center">
              <div className="h-[650px] flex items-center justify-center -mt-40">
                <ClipboardSkeleton />
              </div>
            </div>
          </div>
        </div>

        {/* Existing Events List Skeleton */}
        <div className="px-24 pb-12">
          <div className="bg-white rounded-3xl p-8 shadow-md">
            <div className="flex flex-row items-end gap-4 max-w-max mb-6">
              <ShimmerEffect className="h-8 bg-gray-300 rounded w-64" />
              <ShimmerEffect className="h-6 bg-gray-300 rounded w-6" />
            </div>
            <div className="flex flex-col gap-2">
              <ShimmerEffect className="h-6 bg-gray-300 rounded w-48" />
              <ShimmerEffect className="h-6 bg-gray-300 rounded w-52" />
              <ShimmerEffect className="h-6 bg-gray-300 rounded w-44" />
            </div>
          </div>
        </div>
      </div>

      {/* Mobile View */}
      <div className="md:hidden bg-[#F4F4F4] pb-2">
        {/* Header */}
        <div className="bg-[#F4F4F4]">
          <div className="px-6 py-4">
            <ShimmerEffect className="h-6 bg-gray-300 rounded w-32 mx-auto" />
          </div>
          <div className="w-full h-[3px] bg-white"></div>
          <div className="px-6 py-4">
            <div className="space-y-2">
              <ShimmerEffect className="h-4 bg-gray-300 rounded w-full" />
              <ShimmerEffect className="h-4 bg-gray-300 rounded w-full" />
              <ShimmerEffect className="h-4 bg-gray-300 rounded w-3/4" />
            </div>
          </div>
        </div>

        {/* Main Content */}
        <div className="px-6 py-2">
          <div className="bg-[#F4DBD5] rounded-3xl p-4 mb-2">
            {renderFormSkeleton()}
          </div>

          {/* Clipboard */}
          <div className="flex justify-center rounded-3xl mb-2">
            <div className="w-[150px] h-[200px] bg-gray-300 rounded-lg" />
          </div>

          {/* Existing Events List Skeleton */}
          <div className="bg-white rounded-3xl p-4 mb-2">
            <div className="flex flex-row items-end gap-2 mb-2">
              <ShimmerEffect className="h-4 bg-gray-300 rounded w-32" />
              <div className="h-4 w-4 bg-gray-300 rounded" />
            </div>
            <div className="flex flex-col gap-1">
              <ShimmerEffect className="h-3 bg-gray-300 rounded w-24" />
              <ShimmerEffect className="h-3 bg-gray-300 rounded w-28" />
            </div>
          </div>
        </div>

      </div>

      <div className="mb-4 md:mb-20">
        <div className="py-2 px-6 md:py-16 md:p-24">
          <ShimmerEffect className="h-6 bg-gray-300 rounded w-48 mx-auto mb-2 md:mb-8" />
          <div className="grid grid-cols-1 md:grid-cols-3 gap-2 md:gap-8">
            <div className="text-center space-y-1 md:space-y-4">
              <ShimmerEffect className="h-16 md:h-32 bg-gray-300 rounded-lg mx-auto w-full max-w-xs" />
              <ShimmerEffect className="h-3 md:h-6 bg-gray-300 rounded w-24 md:w-48 mx-auto" />
            </div>
            <div className="text-center space-y-1 md:space-y-4">
              <ShimmerEffect className="h-16 md:h-32 bg-gray-300 rounded-lg mx-auto w-full max-w-xs" />
              <ShimmerEffect className="h-3 md:h-6 bg-gray-300 rounded w-24 md:w-48 mx-auto" />
            </div>
            <div className="text-center space-y-1 md:space-y-4">
              <ShimmerEffect className="h-16 md:h-32 bg-gray-300 rounded-lg mx-auto w-full max-w-xs" />
              <ShimmerEffect className="h-3 md:h-6 bg-gray-300 rounded w-24 md:w-48 mx-auto" />
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default EventPageSkeleton;
