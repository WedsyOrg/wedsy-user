// File: components/product/BrowseMoreDecor.js

import DecorCard from "../cards/DecorCard";

function BrowseMoreDecor({ similarDecor }) {
  // The precise grid classes you provided for the masonry layout
  const gridClasses = [
    "md:col-span-2 md:row-span-2",
    "md:col-span-4 md:row-span-2 md:col-start-3",
    "md:col-span-2 md:row-span-2 md:col-start-7",
    "md:col-span-2 md:row-span-2 md:row-start-3",
    "md:col-span-3 md:row-span-2 md:col-start-3 md:row-start-3",
    "md:col-span-3 md:row-span-2 md:col-start-6 md:row-start-3",
    "md:col-span-4 md:row-span-4 md:row-start-5",
    "md:col-span-4 md:row-span-4 md:col-start-5 md:row-start-5",
    "md:col-span-4 md:row-span-2 md:row-start-8",
    "md:col-span-4 md:row-span-2 md:col-start-5 md:row-start-8",
    "md:col-span-3 md:row-span-2 md:row-start-10",
    "md:col-span-4 md:row-span-2 md:col-start-4 md:row-start-10",
    "md:col-span-4 md:row-span-2 md:row-start-12",
    "md:col-span-3 md:row-span-2 md:col-start-5 md:row-start-12",
  ];
  
  // The mobile-specific grid classes you provided
  const mobileGridClasses = [
    "min-h-[160px]", "row-span-2 min-h-[240px]", "row-span-2 min-h-[240px]",
    "col-start-2 row-start-3 min-h-[160px]", "row-start-4 min-h-[160px]", "row-span-2 row-start-4 min-h-[240px]",
    "row-span-2 row-start-5 min-h-[240px]", "col-start-2 row-start-6 min-h-[160px]", "row-start-7 min-h-[160px]",
    "row-span-2 row-start-7 min-h-[240px]", "row-span-2 row-start-8 min-h-[240px]", "col-start-2 row-start-9 min-h-[160px]",
    "col-span-2 row-span-2 row-start-10 min-h-[280px]", "",
  ];

  return (
    <div className=" bg-[#F4F4F4] p-8 mt-12 sm:px-1 md:px-20">
      <h2 className="text-2xl font-semibold px-12 text-center mb-8">
        BROWSE MORE DECOR
      </h2>
      
      {/* Mobile Grid */}
      <div className="grid grid-cols-2 gap-4 md:hidden">
        {similarDecor.map((item, index) => (
          <div key={item._id} className={mobileGridClasses[index] || "min-h-[160px]"}>
            <DecorCard decor={item} />
          </div>
        ))}
      </div>
      
      {/* Desktop Grid */}
      <div className="hidden md:grid grid-cols-2 sm:grid-cols-3 md:grid-cols-8 md:grid-rows-13 gap-2 md:gap-4 min-h-[1200px]">
        {similarDecor.map((item, index) => (
          <div key={item._id} className={gridClasses[index] || 'col-span-2 row-span-2'}>
            <DecorCard decor={item} />
          </div>
        ))}
      </div>
    </div>
  );
}

export default BrowseMoreDecor;