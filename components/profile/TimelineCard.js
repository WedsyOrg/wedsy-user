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
  if (diff === 14) return "in 2 weeks";
  if (diff <= 14) return `in ${diff} days`;
  const day = due.getDate();
  const month = due.toLocaleString("en-GB", { month: "short" });
  return `${day} ${month}`;
}

const sourceColor = (source) => {
  if (source === "AI") return "text-wedsy-rose-600";
  if (source === "Custom") return "text-wedsy-green";
  return "text-wedsy-ink-3";
};

export default function TimelineCard({
  milestones = [],
  onRegenerate,
  onViewAll,
  regenerating = false,
}) {
  const next = [...milestones]
    .sort((a, b) => new Date(a.dueDate) - new Date(b.dueDate))
    .slice(0, 3);

  return (
    <section className="pt-2 pb-8 px-6">
      <div className="flex items-center justify-between">
        <p className="wedsy-eyebrow">PLANNING TIMELINE</p>
        <button
          type="button"
          onClick={onViewAll}
          className="text-[10px] tracking-[1px] uppercase font-medium text-wedsy-rose-600"
        >
          View all
        </button>
      </div>
      <h2 className="wedsy-title text-[24px] mt-2 text-wedsy-ink">Your road to the wedding</h2>
      <p className="wedsy-italic-em text-[14px] mt-1">What&apos;s next, in date order</p>

      <div className="mt-4 bg-wedsy-ivory-2 border border-wedsy-rose-100 p-5">
        {next.length === 0 ? (
          <p className="wedsy-italic-em text-[13px] text-center text-wedsy-ink-3">
            No milestones yet. Tap Regenerate to get started.
          </p>
        ) : (
          <ul className="space-y-3">
            {next.map((m) => (
              <li key={m._id} className="flex items-center gap-3">
                {m.status === "COMPLETED" ? (
                  <span className="h-3 w-3 rounded-full border border-wedsy-ink-3 flex items-center justify-center text-wedsy-ink-3 text-[8px] leading-none shrink-0">
                    ✓
                  </span>
                ) : (
                  <span className="h-3 w-3 rounded-full bg-wedsy-rose-600 shrink-0" />
                )}
                <span className="flex-1 text-[15px] text-wedsy-ink line-clamp-1">{m.title}</span>
                <span className={`text-[9px] tracking-[1px] uppercase font-medium shrink-0 ${sourceColor(m.source)}`}>
                  {m.source.toUpperCase()}
                </span>
                <span className="text-[11px] tracking-[1px] uppercase font-medium text-wedsy-ink-3 shrink-0">
                  {m.status === "COMPLETED" ? "DONE" : formatRelativeDate(m.dueDate)}
                </span>
              </li>
            ))}
          </ul>
        )}
      </div>

      <button
        type="button"
        onClick={onRegenerate}
        disabled={regenerating}
        className="mt-4 text-[11px] tracking-[2px] uppercase font-medium text-wedsy-rose-600 disabled:text-wedsy-ink-3 disabled:cursor-not-allowed"
      >
        ↻ {regenerating ? "Regenerating…" : "Regenerate"}
      </button>
    </section>
  );
}
