import Image from "next/image";
import { useEffect, useState } from "react";
import { IoClose } from "react-icons/io5";
import { MdChevronLeft, MdChevronRight } from "react-icons/md";

export default function ImageLightbox({
  images = [],
  currentIndex = 0,
  isOpen = false,
  onClose,
  onNext,
  onPrev,
}) {
  const [imageLoaded, setImageLoaded] = useState(false);
  const [isAnimating, setIsAnimating] = useState(false);

  // Handle keyboard navigation
  useEffect(() => {
    if (!isOpen) return;

    const handleKeyDown = (e) => {
      if (e.key === "Escape") {
        onClose();
      } else if (e.key === "ArrowLeft" && images.length > 1) {
        onPrev();
      } else if (e.key === "ArrowRight" && images.length > 1) {
        onNext();
      }
    };

    // Prevent body scroll when lightbox is open
    document.body.style.overflow = "hidden";

    window.addEventListener("keydown", handleKeyDown);

    return () => {
      window.removeEventListener("keydown", handleKeyDown);
      document.body.style.overflow = "unset";
    };
  }, [isOpen, images.length, onClose, onNext, onPrev]);

  // Reset image loaded state when index changes
  useEffect(() => {
    if (isOpen) {
      setImageLoaded(false);
      setIsAnimating(false);
    }
  }, [currentIndex, isOpen]);

  if (!isOpen || !images[currentIndex]) return null;

  const hasMultipleImages = images.length > 1;

  return (
    <div
      className={`fixed inset-0 z-[9999] flex items-center justify-center  ${
        isOpen ? "opacity-100" : "opacity-0 pointer-events-none"
      }`}
      onClick={onClose}
    >
      {/* Blurred Background with smooth transition */}
      <div 
        className={`absolute inset-0 bg-black/30 backdrop-blur-sm transition-opacity duration-300 ${
          isOpen ? "opacity-100" : "opacity-0"
        }`}
      />

      {/* Close Button - Top Left */}
      <button
        onClick={onClose}
        className="absolute top-4 left-4 z-10 p-2.5 rounded-full bg-black/60 hover:bg-black/80 text-white transition-all duration-200 hover:scale-110 active:scale-95 focus:outline-none focus:ring-2 focus:ring-white/50 shadow-lg"
        aria-label="Close lightbox"
      >
        <IoClose size={28} />
      </button>

      {/* Image Container */}
      <div
        className="relative w-full h-full flex items-center justify-center px-4 md:px-8"
        onClick={(e) => e.stopPropagation()}
      >
        <div className={`relative max-w-7xl max-h-[90vh] w-full h-full flex items-center justify-center transition-opacity duration-200 ${
          imageLoaded ? "opacity-100" : "opacity-0"
        }`}>
          <Image
            src={images[currentIndex]}
            alt={`Image ${currentIndex + 1} of ${images.length}`}
            fill
            sizes="90vw"
            className="object-contain"
            priority
            quality={95}
            onLoad={() => setImageLoaded(true)}
          />
        </div>

        {/* Navigation Arrows */}
        {hasMultipleImages && (
          <>
            {/* Previous Button */}
            <button
              onClick={(e) => {
                e.stopPropagation();
                onPrev();
              }}
              className="absolute left-4 md:left-8 z-10 p-3 rounded-full bg-black/60 hover:bg-black/80 text-white transition-all duration-200 hover:scale-110 active:scale-95 focus:outline-none focus:ring-2 focus:ring-white/50 shadow-lg"
              aria-label="Previous image"
            >
              <MdChevronLeft size={32} />
            </button>

            {/* Next Button */}
            <button
              onClick={(e) => {
                e.stopPropagation();
                onNext();
              }}
              className="absolute right-4 md:right-8 z-10 p-3 rounded-full bg-black/60 hover:bg-black/80 text-white transition-all duration-200 hover:scale-110 active:scale-95 focus:outline-none focus:ring-2 focus:ring-white/50 shadow-lg"
              aria-label="Next image"
            >
              <MdChevronRight size={32} />
            </button>
          </>
        )}

        {/* Image Counter */}
        {hasMultipleImages && (
          <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 bg-black/70 backdrop-blur-sm text-white px-4 py-2 rounded-full text-sm font-medium shadow-lg">
            {currentIndex + 1} / {images.length}
          </div>
        )}
      </div>
    </div>
  );
}

