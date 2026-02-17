import { useEffect, useState, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";

export default function NotificationToast({ message, show, onClose, type = "error", duration = 5000 }) {
  const [isVisible, setIsVisible] = useState(false);
  const timerRef = useRef(null);
  const onCloseRef = useRef(onClose);

  // Keep onClose ref updated
  useEffect(() => {
    onCloseRef.current = onClose;
  }, [onClose]);

  useEffect(() => {
    if (show) {
      setIsVisible(true);
      
      // Clear any existing timer
      if (timerRef.current) {
        clearTimeout(timerRef.current);
      }
      
      // Set new timer
      timerRef.current = setTimeout(() => {
        setIsVisible(false);
        // Wait for exit animation before calling onClose
        setTimeout(() => {
          onCloseRef.current();
        }, 300);
      }, duration);

      return () => {
        if (timerRef.current) {
          clearTimeout(timerRef.current);
        }
      };
    } else {
      setIsVisible(false);
      if (timerRef.current) {
        clearTimeout(timerRef.current);
      }
    }
  }, [show, duration]);

  const getTypeStyles = () => {
    switch (type) {
      case "error":
        return {
          bg: "bg-red-50",
          border: "border-red-200",
          text: "text-red-800",
          icon: "❌",
        };
      case "success":
        return {
          bg: "bg-green-50",
          border: "border-green-200",
          text: "text-green-800",
          icon: "✅",
        };
      case "info":
        return {
          bg: "bg-blue-50",
          border: "border-blue-200",
          text: "text-blue-800",
          icon: "ℹ️",
        };
      default:
        return {
          bg: "bg-gray-50",
          border: "border-gray-200",
          text: "text-gray-800",
          icon: "ℹ️",
        };
    }
  };

  const styles = getTypeStyles();

  return (
    <AnimatePresence>
      {isVisible && (
        <motion.div
          initial={{ opacity: 0, y: 20, scale: 0.95 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          exit={{ opacity: 0, y: -10, scale: 0.95 }}
          transition={{ duration: 0.3, ease: [0.16, 1, 0.3, 1] }}
          className="fixed top-4 right-4 md:top-6 md:right-6 z-50 min-w-[280px] max-w-[400px]"
        >
          <div
            className={`${styles.bg} ${styles.border} border-2 rounded-xl shadow-lg px-4 py-3 flex items-start gap-3 backdrop-blur-sm`}
            style={{
              fontFamily: "'Spartan', sans-serif",
            }}
          >
            <span className="text-lg flex-shrink-0 mt-0.5">{styles.icon}</span>
            <div className="flex-1 min-w-0">
              <p className={`${styles.text} font-medium text-sm leading-relaxed`}>
                {message}
              </p>
            </div>
            <button
              onClick={() => {
                setIsVisible(false);
                if (timerRef.current) {
                  clearTimeout(timerRef.current);
                }
                setTimeout(() => {
                  onCloseRef.current();
                }, 300);
              }}
              className={`${styles.text} hover:opacity-70 transition-opacity flex-shrink-0 text-lg font-bold leading-none`}
              aria-label="Close"
            >
              ×
            </button>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}

