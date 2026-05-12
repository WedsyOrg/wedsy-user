export default function ThisWeekList({ milestones }) {
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  const weekEnd = new Date(today);
  weekEnd.setDate(weekEnd.getDate() + 7);
  weekEnd.setHours(23, 59, 59, 999);

  const list = Array.isArray(milestones) ? milestones : [];
  const thisWeek = list
    .filter((m) => {
      if (!m || m.status !== "PENDING" || !m.dueDate) return false;
      const due = new Date(m.dueDate);
      return due >= today && due <= weekEnd;
    })
    .slice()
    .sort((a, b) => new Date(a.dueDate) - new Date(b.dueDate));

  if (thisWeek.length === 0) return null;

  return (
    <div className="bg-wedsy-ivory border border-wedsy-rose-100 p-6 mb-7">
      <p className="wedsy-eyebrow mb-4">THIS WEEK</p>
      {thisWeek.map((m) => {
        const due = new Date(m.dueDate);
        const dayAbbr = due.toLocaleString("en-US", { weekday: "short" }).toUpperCase();
        return (
          <div
            key={m._id}
            className="flex items-start gap-3 py-2 border-b border-wedsy-rose-100 last:border-b-0"
          >
            <span className="text-[11px] tracking-[1.5px] uppercase text-wedsy-rose-600 font-medium w-[42px] shrink-0">
              {dayAbbr}
            </span>
            <span className="text-[13px] text-wedsy-ink leading-[1.4]">{m.title}</span>
          </div>
        );
      })}
    </div>
  );
}
