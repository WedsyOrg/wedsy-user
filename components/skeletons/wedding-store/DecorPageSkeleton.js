import React from 'react';
import HeroSectionSkeleton from './HeroSectionSkeleton';
import CategoriesGridSkeleton from './CategoriesGridSkeleton';
import SpotlightSectionSkeleton from './SpotlightSectionSkeleton';
import BestSellersSectionSkeleton from './BestSellersSectionSkeleton';
import PackagesSectionSkeleton from './PackagesSectionSkeleton';
import FeatureHighlightsSkeleton from './FeatureHighlightsSkeleton';
import PhotoboothSectionSkeleton from './PhotoboothSectionSkeleton';
import InstagramSectionSkeleton from './InstagramSectionSkeleton';

const DecorPageSkeleton = () => {
  return (
    <div className="bg-[#F4F4F4] min-h-screen w-full">
      {/* Hero Section */}
      <HeroSectionSkeleton />

      {/* Categories Grid */}
      <CategoriesGridSkeleton />

      {/* Spotlight Section */}
      <SpotlightSectionSkeleton />

      {/* Best Sellers Section */}
      <BestSellersSectionSkeleton />

      {/* Ideas for Grand Entry Section */}
      <BestSellersSectionSkeleton />

      {/* Best Selling Mandaps Section */}
      <BestSellersSectionSkeleton />

      {/* Furniture Section */}
      <BestSellersSectionSkeleton />

      {/* Photobooth Section */}
      <PhotoboothSectionSkeleton />

      {/* Instagram Section */}
      <InstagramSectionSkeleton />

      {/* Packages Section */}
      <PackagesSectionSkeleton />

      {/* Feature Highlights */}
      <FeatureHighlightsSkeleton />
    </div>
  );
};

export default DecorPageSkeleton;
