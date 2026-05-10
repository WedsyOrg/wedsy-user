import { useMemo } from "react";

export default function ProfileHero({
  coupleName,
  weddingDate,
  eventDayCount = 1,
  eventDayNames = [],
}) {
  const { formattedDate, countdownText } = useMemo(() => {
    const ordinalSuffix = (day) => {
      if (day >= 11 && day <= 13) return "th";
      const last = day % 10;
      if (last === 1) return "st";
      if (last === 2) return "nd";
      if (last === 3) return "rd";
      return "th";
    };

    const wedding = new Date(weddingDate);
    const today = new Date();
    const diff = Math.ceil((wedding - today) / 86400000);

    let text;
    if (diff > 0) {
      text = `${diff} ${diff === 1 ? "day" : "days"} to your wedding`;
    } else if (diff === 0) {
      text = "Today is your wedding day";
    } else {
      const past = Math.abs(diff);
      text = `${past} ${past === 1 ? "day" : "days"} since your wedding`;
    }

    const day = wedding.getDate();
    const month = wedding.toLocaleString("en-GB", { month: "long" });
    const year = wedding.getFullYear();

    return {
      formattedDate: `${day}${ordinalSuffix(day)} ${month} ${year}`,
      countdownText: text,
    };
  }, [weddingDate]);

  return (
    <section className="text-center pt-12 pb-8 px-6">
      <p className="wedsy-eyebrow">A WEDSY WEDDING</p>
      <h1 className="wedsy-title text-[44px] leading-[1.05] mt-3 text-wedsy-ink">
        {coupleName}
      </h1>
      <p className="wedsy-italic-em text-[18px] mt-2">{formattedDate}</p>
      <div className="wedsy-ornament-divider my-6 mx-auto"></div>
      <p className="text-[13px] tracking-[1px] uppercase text-wedsy-ink-3 font-medium">
        {countdownText}
      </p>
      {eventDayNames.length > 0 && (
        <p className="wedsy-subtitle mt-4 text-[12px]">
          {eventDayNames.join(" · ")} · {eventDayCount}{" "}
          {eventDayCount === 1 ? "event" : "events"}
        </p>
      )}
    </section>
  );
}
