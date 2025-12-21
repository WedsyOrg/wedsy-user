import { useEffect, useMemo, useState } from "react";
import { useRouter } from "next/router";

export default function MobileStickyFooter({}) {
  const router = useRouter();
  const [openCategoryMenu, setOpenCategoryMenu] = useState(false);

  const activeKey = useMemo(() => {
    const path = router?.pathname || "";
    if (path === "/" || path.startsWith("/decor")) return "store";
    if (path.startsWith("/makeup-and-beauty")) return "makeup";
    if (path.startsWith("/event")) return "event";
    if (path.startsWith("/my-account")) return "profile";
    return "";
  }, [router?.pathname]);

  useEffect(() => {
    if (!document.body.classList.contains("relative")) {
      document.body.classList.add("relative");
    }
  }, []);

  const go = (href) => {
    setOpenCategoryMenu(false);
    router.push(href);
  };

  return (
    <>
      {/* Category chooser (Landing / Decor) */}
      {openCategoryMenu && (
        <>
          {/* Click-outside overlay */}
          <button
            type="button"
            aria-label="Close menu"
            className="fixed inset-0 bottom-16 md:hidden z-40 bg-transparent"
            onClick={() => setOpenCategoryMenu(false)}
          />
          <div className="fixed left-0 right-0 bottom-16 md:hidden z-50 px-4 pb-2">
            <div className="mx-auto max-w-md bg-white rounded-2xl shadow-lg border border-gray-200 p-3 flex gap-3">
              <button
                type="button"
                onClick={() => go("/")}
                className="flex-1 rounded-xl border border-gray-200 bg-white px-4 py-3 text-sm font-semibold text-gray-900 hover:bg-gray-50"
              >
                Landing
              </button>
              <button
                type="button"
                onClick={() => go("/decor")}
                className="flex-1 rounded-xl bg-black px-4 py-3 text-sm font-semibold text-white hover:bg-black/90"
              >
                Decor
              </button>
            </div>
          </div>
        </>
      )}

      <div
        className="fixed bottom-0 left-0 right-0 md:hidden z-50 bg-white border-t border-gray-200"
        style={{ paddingBottom: "env(safe-area-inset-bottom)" }}
      >
        <div className="grid grid-cols-4 h-16 items-center">
          {/* Store (Landing/Decor) */}
          <button
            type="button"
            aria-label="Store"
            onClick={() => setOpenCategoryMenu((v) => !v)}
            className="group h-full flex items-center justify-center transition-transform duration-150 active:scale-95"
          >
            <img
              src="/assets/icons/icon-category.webp"
              alt="Store"
              className={`mx-auto h-7 w-7 transition-all duration-200 ${
                activeKey === "store"
                  ? "opacity-100 brightness-0"
                  : "opacity-70 group-hover:opacity-100"
              } group-hover:scale-105`}
            />
          </button>

          {/* Makeup */}
          <button
            type="button"
            aria-label="Makeup & Beauty"
            onClick={() => go("/makeup-and-beauty")}
            className="group h-full flex items-center justify-center transition-transform duration-150 active:scale-95"
          >
            <img
              src="/assets/icons/icon-makeup.webp"
              alt="Makeup & Beauty"
              className={`mx-auto h-7 w-7 transition-all duration-200 ${
                activeKey === "makeup"
                  ? "opacity-100 brightness-0"
                  : "opacity-70 group-hover:opacity-100"
              } group-hover:scale-105`}
            />
          </button>

          {/* Event */}
          <button
            type="button"
            aria-label="Event"
            onClick={() => go("/event")}
            className="group h-full flex items-center justify-center transition-transform duration-150 active:scale-95"
          >
            <img
              src="/assets/icons/icon-event.webp"
              alt="Event"
              className={`mx-auto h-7 w-7 transition-all duration-200 ${
                activeKey === "event"
                  ? "opacity-100 brightness-0"
                  : "opacity-70 group-hover:opacity-100"
              } group-hover:scale-105`}
            />
          </button>

          {/* Profile */}
          <button
            type="button"
            aria-label="Profile"
            onClick={() => go("/my-account")}
            className="group h-full flex items-center justify-center transition-transform duration-150 active:scale-95"
          >
            <img
              src="/assets/icons/icon-user.webp"
              alt="Profile"
              className={`mx-auto h-7 w-7 transition-all duration-200 ${
                activeKey === "profile"
                  ? "opacity-100 brightness-0"
                  : "opacity-70 group-hover:opacity-100"
              } group-hover:scale-105`}
            />
          </button>
        </div>
      </div>
    </>
  );
}
