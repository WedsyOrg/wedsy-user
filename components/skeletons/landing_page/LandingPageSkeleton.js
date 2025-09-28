import React from 'react';
import HeroSectionSkeleton from './HeroSectionSkeleton';
import WhyChooseWedsySkeleton from './WhyChooseWedsySkeleton';
import WeddingVenuesSkeleton from './WeddingVenuesSkeleton';
import ServiceCategoriesSkeleton from './ServiceCategoriesSkeleton';
import BidCompareSkeleton from './BidCompareSkeleton';
import FurnitureSectionSkeleton from './FurnitureSectionSkeleton';
import ReviewsSectionSkeleton from './ReviewsSectionSkeleton';
import WorkGallerySkeleton from './WorkGallerySkeleton';
import FAQSkeleton from './FAQSkeleton';

const LandingPageSkeleton = () => {
  return (
    <>
      {/* Hero Section */}
      <HeroSectionSkeleton />

      {/* Why Choose Wedsy Section */}
      <WhyChooseWedsySkeleton />

      {/* Wedding Venues Section */}
      <WeddingVenuesSkeleton />

      {/* Triangle Section */}
      <section className="relative w-full flex justify-between items-center mt-12 md:mt-20">
        <div className="hidden md:block w-80 h-16 bg-gray-300" />
        <div className="flex flex-col text-center mx-auto px-6">
          <div className="h-8 bg-gray-300 rounded w-96 mx-auto mb-2" />
          <div className="h-6 bg-gray-300 rounded w-80 mx-auto" />
        </div>
        <div className="hidden md:block w-80 h-16 bg-gray-300" />
      </section>

      {/* Service Categories */}
      <ServiceCategoriesSkeleton />

      {/* Bid & Compare Section */}
      <BidCompareSkeleton />

      {/* Furniture Section */}
      <FurnitureSectionSkeleton />

      {/* Line Section */}
      <div className="flex justify-center w-full py-4 md:py-8">
        <div className="w-1/2 h-px bg-gray-300"></div>
      </div>

      {/* Reviews Section */}
      <ReviewsSectionSkeleton />

      {/* Line Section */}
      <div className="flex justify-center w-full py-4 md:py-8">
        <div className="w-1/2 h-px bg-gray-300"></div>
      </div>

      {/* Work Gallery Section */}
      <WorkGallerySkeleton />

      {/* Line Section */}
      <div className="flex justify-center w-full py-4 md:py-8">
        <div className="w-1/2 h-px bg-gray-300"></div>
      </div>

      {/* Trending Section */}
      <div className="py-6 md:py-8 px-6 md:px-40">
        <div className="max-w-7xl mx-auto">
          <div className="h-12 bg-gray-300 rounded w-64 mb-10 md:mb-16 hidden md:block" />
          
          <div className="flex flex-col md:flex-row gap-6">
            <div className="relative flex-1 h-64 md:h-80 bg-gray-300 overflow-hidden">
              <div className="w-full h-full bg-gray-300" />
            </div>
            <div className="relative flex-1 h-64 md:h-80 bg-gray-300 overflow-hidden">
              <div className="w-full h-full bg-gray-300" />
            </div>
            <div className="flex-1 bg-gray-300 flex items-center justify-between p-6 md:p-8 relative overflow-hidden">
              <div className="space-y-4">
                <div className="h-12 bg-gray-400 rounded w-32" />
                <div className="h-8 bg-gray-400 rounded w-48" />
              </div>
              <div className="h-8 w-8 bg-gray-400 rounded" />
            </div>
          </div>

          <div className="mt-12 hidden md:block">
            <div className="h-12 bg-gray-300 rounded w-48 mx-auto" />
          </div>
        </div>
      </div>

      {/* Most Asked Section */}
      <section className="py-16 md:py-24 px-6 md:px-40">
        <div className="max-w-7xl mx-auto overflow-hidden">
          <div className="w-full flex justify-center">
            <div className="h-px bg-gray-300 w-full max-w-7xl px-4 md:px-10 lg:px-20"></div>
          </div>
          <div className="relative w-full h-auto mt-8" style={{ paddingTop: '56.25%' }}>
            <div className="absolute inset-0 bg-gray-300 rounded-lg" />
          </div>
        </div>
      </section>

      {/* FAQ Section */}
      <FAQSkeleton />
    </>
  );
};

export default LandingPageSkeleton;
