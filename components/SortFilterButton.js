import { MdSort, MdTune } from "react-icons/md";

export default function SortFilterButton({ onSortClick, onFilterClick }) {
  return (
    <div className="flex items-center bg-white rounded-lg shadow-[0_2px_8px_rgba(0,0,0,0.1)] overflow-hidden">
      {/* Sort Section */}
      <button
        onClick={onSortClick}
        className="flex items-center gap-2 px-4 md:px-6 py-2.5 md:py-3 transition-colors hover:bg-gray-50 flex-1 justify-center"
      >
        <MdSort className="text-[#1a1a1a] w-5 h-5 md:w-6 md:h-6" />
        <span className="text-[#1a1a1a] text-sm md:text-base font-medium">Sort</span>
      </button>

      {/* Separator */}
      <div className="w-px h-6 md:h-7 bg-gray-300"></div>

      {/* Filter Section */}
      <button
        onClick={onFilterClick}
        className="flex items-center gap-2 px-4 md:px-6 py-2.5 md:py-3 transition-colors hover:bg-gray-50 flex-1 justify-center"
      >
        <MdTune className="text-[#1a1a1a] w-5 h-5 md:w-6 md:h-6" />
        <span className="text-[#1a1a1a] text-sm md:text-base font-medium">Filter</span>
      </button>
    </div>
  );
}
