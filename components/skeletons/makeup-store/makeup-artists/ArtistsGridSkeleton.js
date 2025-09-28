import React from 'react';
import ArtistCardSkeleton from './ArtistCardSkeleton';

const ArtistsGridSkeleton = ({ count = 12 }) => {
  return (
    <div className="bg-[#f4f4f4] pb-6 md:pb-12 grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3 sm:gap-4 md:gap-6 lg:gap-8 xl:gap-12 px-4 sm:px-6 md:px-12 lg:px-24">
      {Array.from({ length: count }, (_, index) => (
        <ArtistCardSkeleton key={index} />
      ))}
    </div>
  );
};

export default ArtistsGridSkeleton;
