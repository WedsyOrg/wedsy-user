function formatDay(isoDate) {
  const d = new Date(isoDate);
  const weekday = d.toLocaleString("en-GB", { weekday: "long" });
  const day = d.getDate();
  const month = d.toLocaleString("en-GB", { month: "short" });
  return `${weekday}, ${day} ${month}`;
}

const SPELLED = ["Zero", "One", "Two", "Three", "Four", "Five", "Six", "Seven", "Eight", "Nine"];
const spell = (n) => (n < SPELLED.length ? SPELLED[n] : String(n));

export default function EventDaysCarousel({ eventDays = [] }) {
  const heading =
    eventDays.length === 1
      ? "One day of celebration"
      : `${spell(eventDays.length)} days of celebration`;

  return (
    <section className="pt-2 pb-8 px-0">
      <p className="wedsy-eyebrow px-6">YOUR EVENTS</p>
      <h2 className="wedsy-title text-[24px] mt-2 text-wedsy-ink px-6">{heading}</h2>

      <div className="mt-5 flex gap-3 overflow-x-auto scrollbar-hide px-6">
        {eventDays.length === 0 ? (
          <div className="w-[260px] shrink-0 bg-wedsy-ivory-2 border border-wedsy-rose-100 p-5">
            <p className="wedsy-italic-em text-[13px] text-wedsy-ink-3 text-center">
              Add your event days to see them here
            </p>
          </div>
        ) : (
          eventDays.map((day, i) => (
            <article
              key={i}
              className="w-[260px] shrink-0 bg-wedsy-ivory-2 border border-wedsy-rose-100 p-5"
            >
              <p className="text-[10px] tracking-[1px] uppercase font-medium text-wedsy-rose-600">
                Day {i + 1}
              </p>
              <h3 className="wedsy-title text-[20px] mt-1 text-wedsy-ink">{day.name}</h3>
              <p className="text-[13px] mt-2 text-wedsy-ink-2">{formatDay(day.date)}</p>
              <p className="text-[13px] mt-1 text-wedsy-ink-2">{day.time}</p>
              <p className="wedsy-italic-em text-[12px] mt-3">{day.venue}</p>
            </article>
          ))
        )}
      </div>
    </section>
  );
}
