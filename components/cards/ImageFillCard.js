import Image from "next/image";
import { useState, useEffect } from "react";
export default function ImageFillCard({
  src,
  className,
  objectFit,
  imageClassName,
}) {
  const [isEnlarged, setIsEnlarged] = useState(false);
  useEffect(() => {
    const handleScroll = () => {
      // Shrink the image on scroll
      setIsEnlarged(false);
    };

    if (isEnlarged) {
      window.addEventListener("scroll", handleScroll);
    } else {
      window.removeEventListener("scroll", handleScroll);
    }

    // Cleanup: Remove event listener when component is unmounted or when the image is not enlarged
    return () => {
      window.removeEventListener("scroll", handleScroll);
    };
  }, [isEnlarged]);

  const handleImageClick = () => {
    // Enlarge the image on click
    setIsEnlarged(!isEnlarged);
  };
  return (
    <div className={`${className} overflow-hidden`}>
      <div
        className={` ${
          isEnlarged
            ? "blur-md inset-0 bg-white opacity-50 backdrop-filter-blur fixed z-50 h-screen w-screen top-0 left-0"
            : ""
        }`}
      ></div>
      <Image
        src={src}
        alt="Enlargable Image Card"
        layout={"fill"}
        objectFit={objectFit}
        sizes="100%"
        className={`cursor-pointer w-full h-full transition-all duration-75 ease-in-out ${imageClassName}`}
        onClick={handleImageClick}
      />
      {isEnlarged && (
        <Image
          src={src}
          alt="Enlargable Image Card"
          width={0}
          height={0}
          sizes="100%"
          style={{ width: "100%", height: "auto" }}
          className={`cursor-pointer w-full h-full transition-all duration-75 ease-in-out  ${
            isEnlarged
              ? "max-h-screen max-w-screen object-contain fixed z-50 p-8 top-0 left-0 rounded-2xl"
              : ""
          }`}
          onClick={handleImageClick}
        />
      )}
    </div>
  );
}
