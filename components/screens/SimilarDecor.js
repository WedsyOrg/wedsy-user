import DecorCard from "../cards/DecorCard";
import Masonry from "react-masonry-css";

const breakpointCols = { default: 4, 1280: 4, 1024: 3, 768: 2, 500: 2 };

export default function SimilarDecor({ similarDecor }) {
  if (!similarDecor?.length) return null;
  return (
    <div className="p-8 bg-[#F4F4F4]">
      <p className="text-2xl font-semibold px-12 text-center">BROWSE SIMILAR DECOR</p>
      <div className="my-6">
        <Masonry
          breakpointCols={breakpointCols}
          className="my-masonry-grid"
          columnClassName="my-masonry-grid_column"
        >
          {similarDecor.map((item, index) => (
            <div key={item._id || index}>
              <DecorCard decor={item} size={index % 4 === 0 || index % 4 === 3 ? "small" : "normal"} />
            </div>
          ))}
        </Masonry>
      </div>
    </div>
  );
}
