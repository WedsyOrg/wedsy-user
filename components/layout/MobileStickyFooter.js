import { useEffect } from "react";

export default function MobileStickyFooter({}) {
  useEffect(() => {
    if (!document.body.classList.contains("relative")) {
      document.body.classList.add("relative");
    }
  }, []);
  return (
    <div className="fixed grid grid-cols-4 md:hidden bottom-0 p-4 h-16 w-full items-center bg-white z-50">
      <img src="/assets/icons/icon-category.webp" className="mx-auto" />
      <img src="/assets/icons/icon-makeup.webp" className="mx-auto" />
      <img src="/assets/icons/icon-event.webp" className="mx-auto" />
      <img src="/assets/icons/icon-user.webp" className="mx-auto" />
    </div>
  );
}
