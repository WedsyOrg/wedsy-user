import DecorCard from "../cards/DecorCard";
import Masonry from 'react-masonry-css';
const gridClasses = [
  "md:col-span-2 md:row-span-2",
  "md:col-span-4 md:row-span-2 md:col-start-3",
  "md:col-span-2 md:row-span-2 md:col-start-7",
  "md:col-span-2 md:row-span-2 md:row-start-3",
  "md:col-span-3 md:row-span-2 md:col-start-3 md:row-start-3",
  "md:col-span-3 md:row-span-2 md:col-start-6 md:row-start-3",
  "md:col-span-4 md:row-span-3 md:row-start-5",
  "md:col-span-4 md:row-span-3 md:col-start-5 md:row-start-5",
  "md:col-span-4 md:row-span-2 md:row-start-8",
  "md:col-span-4 md:row-span-2 md:col-start-5 md:row-start-8",
  "md:col-span-3 md:row-span-2 md:row-start-10",
  "md:col-span-4 md:row-span-2 md:col-start-4 md:row-start-10",
  "md:col-span-4 md:row-span-2 md:row-start-12",
  "md:col-span-3 md:row-span-2 md:col-start-5 md:row-start-12",
];

const mobileGridClasses = [
  "min-h-[160px]",
  "row-span-2 min-h-[240px]",
  "row-span-2 min-h-[240px]",
  "col-start-2 row-start-3 min-h-[160px]",
  "row-start-4 min-h-[160px]",
  "row-span-2 row-start-4 min-h-[240px]",
  "row-span-2 row-start-5 min-h-[240px]",
  "col-start-2 row-start-6 min-h-[160px]",
  "row-start-7 min-h-[160px]",
  "row-span-2 row-start-7 min-h-[240px]",
  "row-span-2 row-start-8 min-h-[240px]",
  "col-start-2 row-start-9 min-h-[160px]",
  "col-span-2 row-span-2 row-start-10 min-h-[280px]",
  "",
];

export default function SimilarDecor({ similarDecor }) {
  // Define breakpoints for the masonry component
  const breakpointColumnsObj = {
    default: 2, // default number of columns
  };
  return (
    <div className=" p-8 bg-[#F4F4F4]">
      <p className="text-2xl font-semibold px-12 text-center">
        BROWSE MORE DECOR{" "}
      </p>
         {/* Mobile grid */}
        <div className="block md:hidden my-6">
          <Masonry
            breakpointCols={breakpointColumnsObj}
            className="my-masonry-grid"
            columnClassName="my-masonry-grid_column"
          >
            {similarDecor.map((item, index) => (
              <div key={item._id || index}>
                {/* Conditionally pass the 'size' prop based on the item's index */}
                <DecorCard decor={item} size={(index % 4 === 0 || index % 4 === 3) ? 'small' : 'normal'} />
              </div>
            ))}
          </Masonry>
        </div>

      {/* Desktop grid */}
      <div className="hidden md:grid grid-cols-2 sm:grid-cols-3 md:grid-cols-8 md:grid-rows-13 gap-2 md:gap-4  my-6 px-4 md:px-12">
        {similarDecor.map((item, index) => (
          <div
            key={item._id || index}
            className={
              gridClasses[index] ||
              "col-span-1 sm:col-span-1 md:col-span-3 md:row-span-2"
            }
          >
            <DecorCard decor={item} />
          </div>
        ))}
      </div>
    </div>
  );
}