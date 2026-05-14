import { useState } from "react";

const blankDay = () => ({ name: "", date: "", time: "", venue: "" });

const fieldClass =
  "w-full bg-transparent border-b border-wedsy-rose-100 px-0 py-2 text-wedsy-ink placeholder:font-serif placeholder:italic placeholder:text-wedsy-ink-3 focus:outline-none focus:border-wedsy-burgundy-soft transition-colors";

export default function EmptyStateStep2({ groomName, brideName, eventName, community, onBack, onComplete }) {
  const displayName =
    groomName && brideName
      ? `${groomName} x ${brideName}`
      : eventName || "Your wedding";
  const [sameVenue, setSameVenue] = useState(true);
  const [commonVenue, setCommonVenue] = useState("");
  const [eventDays, setEventDays] = useState([blankDay()]);
  const [submitting, setSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState(null);

  const updateDay = (idx, patch) =>
    setEventDays((days) => days.map((d, i) => (i === idx ? { ...d, ...patch } : d)));
  const addDay = () => setEventDays((days) => [...days, blankDay()]);
  const removeDay = (idx) =>
    setEventDays((days) => (days.length > 1 ? days.filter((_, i) => i !== idx) : days));

  const isValid = (() => {
    if (!eventDays.every((d) => d.name.trim() && d.date)) return false;
    if (sameVenue) return commonVenue.trim().length > 0;
    return eventDays.every((d) => d.venue.trim().length > 0);
  })();

  const handleCreate = async () => {
    if (!isValid || submitting) return;
    const finalDays = sameVenue
      ? eventDays.map((d) => ({ ...d, venue: commonVenue.trim() }))
      : eventDays;
    setSubmitting(true);
    setSubmitError(null);
    try {
      await onComplete({ eventDays: finalDays });
    } catch (err) {
      setSubmitError(err?.message || "Couldn't create your event. Please try again.");
      setSubmitting(false);
    }
  };

  return (
    <section className="pt-12 pb-10 px-6 lg:max-w-[720px] lg:mx-auto lg:py-16">
      <div className="text-center">
        <p className="wedsy-eyebrow">STEP 2 OF 2</p>
        <h1 className="wedsy-title text-[36px] leading-[1.1] mt-3 text-wedsy-ink lg:text-[44px]">Your celebration days</h1>
        <p className="wedsy-italic-em text-[15px] mt-2 lg:text-[16px]">Add each event of your wedding</p>
        <div className="wedsy-ornament-divider my-6 mx-auto"></div>
        <p className="text-[12px] tracking-[1px] uppercase text-wedsy-ink-3 font-medium">{displayName} · {community}</p>
      </div>

      <div className="mt-8 flex items-center justify-between">
        <span className="text-[13px] text-wedsy-ink-2">Same venue for all events?</span>
        <button
          type="button"
          role="switch"
          aria-checked={sameVenue}
          onClick={() => setSameVenue((v) => !v)}
          className={`relative inline-flex h-6 w-11 items-center transition-colors ${sameVenue ? "bg-wedsy-rose-600" : "bg-wedsy-ink-3"}`}
        >
          <span className={`inline-block h-5 w-5 transform bg-white transition-transform ${sameVenue ? "translate-x-[22px]" : "translate-x-0.5"}`} />
        </button>
      </div>

      {sameVenue && (
        <div className="mt-6">
          <label htmlFor="profile-common-venue" className="block text-[11px] tracking-[1px] uppercase text-wedsy-ink-3 font-medium mb-2">Common venue</label>
          <input
            id="profile-common-venue"
            type="text"
            value={commonVenue}
            onChange={(e) => setCommonVenue(e.target.value)}
            placeholder="e.g., The Leela Palace, Bangalore"
            className="w-full bg-wedsy-ivory-2 border border-wedsy-rose-100 px-4 py-3 text-wedsy-ink placeholder:font-serif placeholder:italic placeholder:text-wedsy-ink-3 focus:outline-none focus:border-wedsy-burgundy-soft transition-colors"
          />
        </div>
      )}

      <div className="mt-6 space-y-4 lg:grid lg:grid-cols-2 lg:gap-4 lg:space-y-0">
        {eventDays.map((day, idx) => (
          <div key={idx} className="relative bg-wedsy-ivory-2 border border-wedsy-rose-100 p-4">
            <button
              type="button"
              disabled={eventDays.length === 1}
              onClick={() => removeDay(idx)}
              aria-label="Remove day"
              className="absolute top-2 right-2 w-6 h-6 flex items-center justify-center text-wedsy-ink-3 text-lg leading-none disabled:opacity-30 disabled:cursor-not-allowed"
            >
              ×
            </button>
            <input
              type="text"
              value={day.name}
              onChange={(e) => updateDay(idx, { name: e.target.value })}
              placeholder="e.g., Mehendi"
              className={fieldClass}
            />
            <div className="mt-3 flex gap-3">
              <input type="date" value={day.date} onChange={(e) => updateDay(idx, { date: e.target.value })} className={`${fieldClass} flex-1 text-[13px]`} />
              <input type="time" value={day.time} onChange={(e) => updateDay(idx, { time: e.target.value })} className={`${fieldClass} flex-1 text-[13px]`} />
            </div>
            {!sameVenue && (
              <input
                type="text"
                value={day.venue}
                onChange={(e) => updateDay(idx, { venue: e.target.value })}
                placeholder="Venue for this day"
                className={`${fieldClass} mt-3 text-[13px]`}
              />
            )}
          </div>
        ))}
      </div>

      <button
        type="button"
        onClick={addDay}
        className="mt-4 w-full py-2 border border-wedsy-rose-400 text-wedsy-rose-600 text-[12px] tracking-[1px] uppercase font-medium hover:bg-wedsy-rose-50 transition-colors lg:w-auto lg:px-8 lg:mx-auto lg:block"
      >
        + Add another day
      </button>

      <div className="mt-10 flex gap-3">
        <button
          type="button"
          onClick={onBack}
          disabled={submitting}
          className="flex-1 py-3 border border-wedsy-rose-400 text-wedsy-rose-600 text-[13px] tracking-[2px] uppercase font-medium hover:bg-wedsy-rose-50 transition-colors disabled:opacity-50"
        >
          Back
        </button>
        <button
          type="button"
          disabled={!isValid || submitting}
          onClick={handleCreate}
          className="flex-1 py-3 bg-wedsy-rose-600 text-white text-[13px] tracking-[2px] uppercase font-medium disabled:bg-wedsy-ink-3 disabled:cursor-not-allowed transition-colors"
        >
          {submitting ? "Creating…" : "Create"}
        </button>
      </div>
      {submitError && (
        <p className="mt-4 font-serif italic text-[12px] text-wedsy-burgundy text-center">
          {submitError}
        </p>
      )}
    </section>
  );
}
