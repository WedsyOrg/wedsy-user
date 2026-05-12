import { useState } from "react";
import { markMilestoneComplete } from "@/utils/api/wedding-timeline";

function formatShortDate(isoDate) {
  const d = new Date(isoDate);
  const day = d.getDate();
  const month = d.toLocaleString("en-GB", { month: "short" });
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
  return formatShortDate(isoDate);
}

export default function NextUpCard({ milestones, eventId, token, onComplete }) {
  const [isMarking, setIsMarking] = useState(false);
  const [error, setError] = useState(null);

  const list = Array.isArray(milestones) ? milestones : [];
  const nextMilestone = list
    .filter((m) => m && m.status === "PENDING" && m.dueDate)
    .slice()
    .sort((a, b) => new Date(a.dueDate) - new Date(b.dueDate))[0];

  if (!nextMilestone) return null;

  const handleComplete = async () => {
    if (!eventId || !token || isMarking) return;
    setIsMarking(true);
    setError(null);
    const { error: err } = await markMilestoneComplete(eventId, nextMilestone._id, token);
    if (err) {
      setError("Couldn't mark complete. Try again.");
      setIsMarking(false);
      return;
    }
    setIsMarking(false);
    if (onComplete) onComplete();
  };

  return (
    <div className="bg-wedsy-ivory border border-wedsy-rose-100 p-6 mb-7">
      <p className="wedsy-eyebrow mb-3">NEXT UP</p>
      <p className="font-serif text-[22px] leading-[1.15] text-wedsy-ink">{nextMilestone.title}</p>
      <p className="font-serif italic text-[14px] text-wedsy-burgundy mt-2">
        {formatRelativeDate(nextMilestone.dueDate)} · {formatShortDate(nextMilestone.dueDate)}
      </p>
      <button
        type="button"
        onClick={handleComplete}
        disabled={isMarking}
        className="text-[11px] tracking-[2px] uppercase font-medium text-wedsy-rose-600 hover:text-wedsy-burgundy disabled:opacity-50 mt-3"
      >
        {isMarking ? "Marking…" : "Mark as done →"}
      </button>
      {error && (
        <p className="font-serif italic text-[11px] text-wedsy-ink-3 mt-2">{error}</p>
      )}
    </div>
  );
}
