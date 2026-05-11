import { ChevronDown, Plus, Settings } from "lucide-react";
import { useEffect, useRef, useState } from "react";

function formatWeddingDate(event) {
  const lastDay = event?.eventDays?.[event.eventDays.length - 1];
  if (!lastDay?.date) return null;
  const d = new Date(lastDay.date);
  return `${d.getDate()} ${d.toLocaleString("en-GB", { month: "short" })} ${d.getFullYear()}`;
}

function deriveTriggerMeta(event, events) {
  const count = events?.length || 1;
  const countLabel = `${count} event${count === 1 ? "" : "s"}`;
  const dateLabel = formatWeddingDate(event);
  return dateLabel ? `${dateLabel} · ${countLabel}` : countLabel;
}

const sortByCreatedDesc = (events) =>
  [...(events || [])].sort((a, b) => (b.createdAt ? new Date(b.createdAt).getTime() : 0) - (a.createdAt ? new Date(a.createdAt).getTime() : 0));

export default function EventSwitcherDropdown({ event, events, onSwitch, onCreateNew, onManageAll }) {
  const [isOpen, setIsOpen] = useState(false);
  const wrapperRef = useRef(null);
  const isMulti = (events?.length || 0) > 1;
  const triggerMeta = deriveTriggerMeta(event, events);

  useEffect(() => {
    if (!isOpen) return undefined;
    const handleClickOutside = (e) => {
      if (wrapperRef.current && !wrapperRef.current.contains(e.target)) setIsOpen(false);
    };
    const handleEsc = (e) => {
      if (e.key === "Escape") setIsOpen(false);
    };
    document.addEventListener("mousedown", handleClickOutside);
    document.addEventListener("keydown", handleEsc);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
      document.removeEventListener("keydown", handleEsc);
    };
  }, [isOpen]);

  if (!isMulti) {
    return (
      <div className="py-5 border-b border-wedsy-rose-100">
        <div className="font-serif text-[19px] leading-tight text-wedsy-ink truncate">{event?.name || "Your wedding"}</div>
        <div className="text-[11px] text-wedsy-ink-3 mt-1">{triggerMeta}</div>
      </div>
    );
  }

  const sortedEvents = sortByCreatedDesc(events);

  return (
    <div ref={wrapperRef} className="relative py-5 border-b border-wedsy-rose-100">
      <button
        type="button"
        onClick={() => setIsOpen((v) => !v)}
        className="w-full flex items-center justify-between text-left"
        aria-haspopup="listbox"
        aria-expanded={isOpen}
      >
        <div className="min-w-0">
          <div className="font-serif text-[19px] leading-tight text-wedsy-ink truncate">
            {event?.name || "Your wedding"}
          </div>
          <div className="text-[11px] text-wedsy-ink-3 mt-1">{triggerMeta}</div>
        </div>
        <ChevronDown
          size={14}
          className={`text-wedsy-rose-600 shrink-0 ml-2 transition-transform ${isOpen ? "rotate-180" : ""}`}
        />
      </button>

      {isOpen && (
        <div
          role="listbox"
          className="absolute top-full left-0 mt-2 w-[320px] bg-white border border-wedsy-rose-100 rounded z-50"
          style={{ boxShadow: "0 4px 24px rgba(122,32,24,0.06)" }}
        >
          <ul className="py-2">
            {sortedEvents.map((e) => {
              const isCurrent = e._id === event?._id;
              return (
                <li key={e._id}>
                  <button
                    type="button"
                    onClick={() => { setIsOpen(false); if (!isCurrent) onSwitch(e._id); }}
                    className={`w-full flex items-start gap-3 px-4 py-3 text-left transition-colors ${isCurrent ? "bg-wedsy-rose-50/40" : "hover:bg-wedsy-rose-50/40"}`}
                  >
                    <span className={`mt-2 h-2 w-2 rounded-full shrink-0 ${isCurrent ? "bg-wedsy-rose-600" : "border border-wedsy-ink-3"}`} />
                    <span className="flex-1 min-w-0">
                      <span className="block font-serif text-[16px] text-wedsy-ink truncate">{e.name || "Your wedding"}</span>
                      <span className="block text-[11px] text-wedsy-ink-3 mt-1">{formatWeddingDate(e) || "No date set"}</span>
                    </span>
                  </button>
                </li>
              );
            })}
          </ul>
          <button
            type="button"
            onClick={() => { setIsOpen(false); onCreateNew && onCreateNew(); }}
            className="w-full flex items-center gap-2 px-4 py-3 text-[11px] tracking-[2px] uppercase font-medium text-wedsy-rose-600 hover:bg-wedsy-rose-50/40 text-left border-t border-wedsy-rose-100"
          >
            <Plus size={14} strokeWidth={2} />
            Create a new event
          </button>
          <button
            type="button"
            onClick={() => { setIsOpen(false); onManageAll && onManageAll(); }}
            className="w-full flex items-center gap-2 px-4 py-3 text-[11px] tracking-[2px] uppercase font-medium text-wedsy-ink-3 hover:bg-wedsy-rose-50/40 text-left border-t border-wedsy-rose-100"
          >
            <Settings size={14} strokeWidth={2} />
            All events
          </button>
        </div>
      )}
    </div>
  );
}
