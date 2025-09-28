// File: components/product/ProductImageGallery.js

import Image from "next/image";
import { useState } from "react";
import { MdOutlinePlayCircle } from "react-icons/md";

function ProductImageGallery({ images = [], video }) {
  // Use the first image as the default, or a placeholder
  const [mainDisplay, setMainDisplay] = useState({ type: 'image', src: images[0] || '/placeholder.jpg' });

  // Combine all images for the thumbnail gallery
  const thumbnailSources = [...images];

  return (
    <div className="flex flex-col gap-4">
      {/* Main Display Area */}
      <div className="relative w-full aspect-square rounded-xl overflow-hidden">
        {mainDisplay.type === 'image' ? (
          <Image
            src={mainDisplay.src}
            alt="Main decor image"
            fill
            sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
            style={{ objectFit: 'cover' }}
            className="rounded-xl"
            priority // Preload the main image for better LCP
          />
        ) : (
          <video
            key={mainDisplay.src} // Key helps React re-render the video player
            src={mainDisplay.src}
            className="w-full h-full object-contain rounded-xl"
            controls
            autoPlay
            muted
            loop
          >
            Your browser does not support the video tag.
          </video>
        )}
      </div>

      {/* Thumbnails */}
      <div className="flex items-center justify-center gap-3">
        {thumbnailSources.map((src, index) => (
          <div
            key={index}
            className={`relative h-24 w-24 rounded-lg overflow-hidden cursor-pointer border-2 ${mainDisplay.src === src ? 'border-rose-900' : 'border-transparent'}`}
            onClick={() => setMainDisplay({ type: 'image', src })}
          >
            <Image
              src={src}
              alt={`Thumbnail ${index + 1}`}
              fill
              sizes="10vw"
              style={{ objectFit: 'cover' }}
              className="rounded-md"
            />
          </div>
        ))}
        {video && (
           <div
            className={`relative h-24 w-24 rounded-lg overflow-hidden cursor-pointer border-2 ${mainDisplay.type === 'video' ? 'border-rose-900' : 'border-transparent'}`}
            onClick={() => setMainDisplay({ type: 'video', src: video })}
          >
            <Image
              src={images[0] || '/placeholder.jpg'} // Use first image as video thumbnail
              alt="Video thumbnail"
              fill
              sizes="10vw"
              style={{ objectFit: 'cover' }}
              className="rounded-md brightness-75"
            />
            <MdOutlinePlayCircle className="h-10 w-10 text-white absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2" />
          </div>
        )}
      </div>
    </div>
  );
}

export default ProductImageGallery;