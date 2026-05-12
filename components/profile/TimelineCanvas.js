import { RefreshCw } from "lucide-react";

function formatShortDate(date) {
  if (!date) return "";
  const day = date.getDate();
  const month = date.toLocaleString("en-GB", { month: "short" });
  return `${day} ${month}`;
}

function formatRelativeDate(isoDate) {
  const due = new Date(isoDate);
  const today = new Date();
  const stripTime = (d) => new Date(d.getFullYear(), d.getMonth(), d.getDate());
  const diff = Math.round((stripTime(due) - stripTime(today)) / 86400000);
  if (diff < 0) {
    const past = Math.abs(diff);
    return `${past} day${past === 1 ? "" : "s"} overdue`;
  }
  if (diff === 0) return "today";
  if (diff === 1) return "tomorrow";
  if (diff <= 14) return `in ${diff} days`;
  const day = due.getDate();
  const month = due.toLocaleString("en-GB", { month: "short" });
  return `${day} ${month}`;
}

function formatLabelDate(isoDate, status) {
  const source = status === "COMPLETED" ? "done" : formatRelativeDate(isoDate);
  return source;
}

function calculatePosition(dueDate, today, wedding) {
  const due = new Date(dueDate);
  due.setHours(0, 0, 0, 0);
  const totalDays = (wedding - today) / 86400000;
  if (totalDays <= 0) return 0;
  const milestoneDays = (due - today) / 86400000;
  const pct = (milestoneDays / totalDays) * 100;
  return Math.max(0, Math.min(100, pct));
}

export default function TimelineCanvas({
  milestones,
  weddingDate,
  loading,
  error,
  regenerating,
  onRegenerate,
}) {
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  const wedding = weddingDate ? new Date(weddingDate) : null;
  if (wedding) wedding.setHours(0, 0, 0, 0);
  const isPastOrInvalid = !wedding || wedding < today;

  if (isPastOrInvalid) return null;

  const list = Array.isArray(milestones) ? milestones : [];
  const visibleMilestones = list.filter((m) => !!m?.dueDate);
  const milestonesWithoutDate = list.filter((m) => !m?.dueDate);

  const upcoming = visibleMilestones
    .filter((m) => m.status !== "COMPLETED")
    .slice()
    .sort((a, b) => new Date(a.dueDate) - new Date(b.dueDate));
  const nextMilestone = upcoming[0] || null;

  return (
    <section className="py-10 border-b border-wedsy-rose-100">
      <div className="flex justify-between items-baseline mb-4">
        <div>
          <p className="wedsy-eyebrow">Planning timeline</p>
          <h2 className="font-serif text-[30px] font-normal text-wedsy-ink mt-2">
            Your road to the wedding
          </h2>
          <p className="font-serif italic text-[14px] text-wedsy-rose-600 mt-1">
            Today on the left, the wedding on the right
          </p>
        </div>
        <a className="text-[11px] tracking-[2px] uppercase text-wedsy-rose-600 font-medium cursor-pointer">
          View all milestones →
        </a>
      </div>

      <div className="relative h-[200px] mt-6 mb-4">
        <div className="absolute left-0 right-0 top-[100px] h-px bg-wedsy-rose-100"></div>

        <div className="absolute left-0 top-[80px]">
          <p className="text-[10px] tracking-[2px] uppercase text-wedsy-rose-600 font-medium mb-1">Today</p>
          <p className="font-serif italic text-[13px] text-wedsy-ink">{formatShortDate(today)}</p>
        </div>
        <div className="absolute w-[9px] h-[9px] rounded-full bg-wedsy-rose-600 top-[95.5px] left-[-4.5px]"></div>

        <div className="absolute right-0 top-[80px] text-right">
          <p className="text-[10px] tracking-[2px] uppercase text-wedsy-rose-600 font-medium mb-1">Wedding</p>
          <p className="font-serif italic text-[13px] text-wedsy-ink">{formatShortDate(wedding)}</p>
        </div>
        <div className="absolute w-[9px] h-[9px] rounded-full bg-wedsy-burgundy top-[95.5px] right-[-4.5px]"></div>

        {visibleMilestones.map((m, i) => {
          const pos = calculatePosition(m.dueDate, today, wedding);
          const isCompleted = m.status === "COMPLETED";
          const isAI = m.source === "AI" && !isCompleted;
          const labelAbove = i % 2 === 0;
          const dotClasses = isCompleted
            ? "bg-wedsy-ink-3 opacity-50"
            : isAI
            ? "bg-wedsy-rose-600"
            : "bg-wedsy-ivory border-[1.5px] border-wedsy-rose-600";
          return (
            <div
              key={m._id}
              className="absolute group cursor-pointer"
              style={{ left: `${pos}%`, top: "100px", transform: "translateX(-50%)" }}
            >
              <div
                className={`relative w-[11px] h-[11px] rounded-full transition-transform hover:scale-150 ${dotClasses}`}
                style={{ marginTop: "-5px" }}
              >
                {isAI && (
                  <div className="absolute inset-[-4px] rounded-full border border-wedsy-rose-600 opacity-50 animate-ping"></div>
                )}
              </div>
              <div
                className={`absolute left-1/2 -translate-x-1/2 ${
                  labelAbove ? "bottom-[18px]" : "top-[18px]"
                } bg-wedsy-ivory border border-wedsy-rose-100 px-3 py-1.5 rounded-sm whitespace-nowrap opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none z-10 shadow-sm`}
              >
                <p className={`text-[11px] text-wedsy-ink ${isCompleted ? "opacity-60" : ""}`}>{m.title}</p>
                <p className="font-serif italic text-[10px] text-wedsy-rose-600 mt-0.5">
                  {formatLabelDate(m.dueDate, m.status)}
                </p>
              </div>
            </div>
          );
        })}
      </div>

      {loading && (
        <p className="text-center text-[12px] text-wedsy-ink-3 font-serif italic">Loading milestones…</p>
      )}
      {error && (
        <p className="text-center text-[12px] text-wedsy-ink-3 font-serif italic">Unable to load timeline.</p>
      )}

      {nextMilestone ? (
        <p className="font-serif italic text-[15px] text-wedsy-ink text-center pt-3">
          Next: <span className="text-wedsy-burgundy">{nextMilestone.title}</span>, {formatRelativeDate(nextMilestone.dueDate)}
          <button
            onClick={onRegenerate}
            disabled={regenerating}
            className="ml-4 inline-flex items-center gap-1.5 text-[11px] tracking-[2px] uppercase text-wedsy-rose-600 font-medium align-middle hover:text-wedsy-burgundy disabled:opacity-50"
          >
            <RefreshCw size={12} className={regenerating ? "animate-spin" : ""} />
            {regenerating ? "Regenerating…" : "Regenerate"}
          </button>
        </p>
      ) : (
        <p className="font-serif italic text-[15px] text-wedsy-ink text-center pt-3">
          Tap Regenerate to start your timeline.
          <button
            onClick={onRegenerate}
            disabled={regenerating}
            className="ml-4 inline-flex items-center gap-1.5 text-[11px] tracking-[2px] uppercase text-wedsy-rose-600 font-medium align-middle hover:text-wedsy-burgundy disabled:opacity-50"
          >
            <RefreshCw size={12} className={regenerating ? "animate-spin" : ""} />
            {regenerating ? "Regenerating…" : "Regenerate"}
          </button>
        </p>
      )}

      {milestonesWithoutDate.length > 0 && (
        <p className="text-center text-[11px] text-wedsy-ink-3 mt-2">
          {milestonesWithoutDate.length} milestone{milestonesWithoutDate.length === 1 ? "" : "s"} without a date — not shown on canvas
        </p>
      )}
    </section>
  );
}
