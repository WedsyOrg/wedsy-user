import React from 'react';
import DesktopBannerSkeleton from './DesktopBannerSkeleton';
import FiltersToolbarSkeleton from './FiltersToolbarSkeleton';
import SearchSectionSkeleton from './SearchSectionSkeleton';
import ArtistsGridSkeleton from './ArtistsGridSkeleton';
import PaginationSkeleton from './PaginationSkeleton';

const MakeupArtistsPageSkeleton = () => {
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

      {/* Desktop Banner */}
      <DesktopBannerSkeleton />

      {/* Filters Toolbar */}
      <FiltersToolbarSkeleton />

      {/* Search Section */}
      <SearchSectionSkeleton />

      {/* Artists Grid */}
      <ArtistsGridSkeleton count={12} />

      {/* Pagination */}
      <PaginationSkeleton />
      
      {/* Bottom spacing */}
      <div className="h-8 md:h-12"></div>
    </div>
  );
};

export default MakeupArtistsPageSkeleton;
