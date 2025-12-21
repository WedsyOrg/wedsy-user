import { useEffect, useState } from "react";
import { AiFillHeart, AiOutlineHeart } from "react-icons/ai";

export default function Toast({ message, show, onClose, duration = 3000, isRemoved = false }) {
  const [isVisible, setIsVisible] = useState(false);
  const [isAnimating, setIsAnimating] = useState(false);

  useEffect(() => {
    if (show) {
      setIsVisible(true);
      // Trigger animation after mount
      setTimeout(() => setIsAnimating(true), 10);
      
      // Auto hide after duration
      const timer = setTimeout(() => {
        setIsAnimating(false);
        setTimeout(() => {
          setIsVisible(false);
          onClose();
        }, 300); // Wait for fade out animation
      }, duration);

      return () => clearTimeout(timer);
    } else {
      setIsVisible(false);
      setIsAnimating(false);
    }
  }, [show, duration, onClose]);

  if (!isVisible) return null;

  return (
    <div
      className={`fixed bottom-24 md:bottom-8 right-4 md:right-8 z-50 transition-all duration-300 ease-out ${
        isAnimating
          ? "opacity-100 translate-y-0 scale-100"
          : "opacity-0 translate-y-4 scale-95"
      }`}
    >
      <div className="bg-white rounded-lg shadow-2xl px-6 py-4 flex items-center gap-3 border border-gray-200 min-w-[280px] max-w-[400px]">
        <div className="flex-shrink-0">
          {isRemoved ? (
            <AiOutlineHeart 
              size={24} 
              className="text-rose-900 animate-heartBeat" 
            />
          ) : (
            <AiFillHeart 
              size={24} 
              className="text-rose-900 animate-heartBeat" 
            />
          )}
        </div>
        <div className="flex-1">
          <p className="text-gray-900 font-medium text-sm md:text-base">
            {message}
          </p>
        </div>
      </div>
    </div>
  );
}

