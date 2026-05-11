import { useMemo } from "react";

export default function ProfileHero({
  coupleName,
  weddingDate,
  eventDayCount = 1,
  eventDayNames = [],
}) {
  const { formattedDate, countdownText, variant, daysAbs, rightEyebrow, rightCaption } = useMemo(() => {
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
    const v = diff > 0 ? "future" : diff === 0 ? "today" : "past";
    const abs = Math.abs(diff);

    let text;
    if (v === "future") text = `${diff} ${diff === 1 ? "day" : "days"} to your wedding`;
    else if (v === "today") text = "Today is your wedding day";
    else text = `${abs} ${abs === 1 ? "day" : "days"} since your wedding`;

    const eyebrow = v === "future" ? "COUNTDOWN" : v === "today" ? "TODAY" : "SINCE";
    const caption = v === "future" ? "days to your wedding" : v === "today" ? "your wedding day" : "days since your wedding";

    const day = wedding.getDate();
    const month = wedding.toLocaleString("en-GB", { month: "long" });
    const year = wedding.getFullYear();

    return {
      formattedDate: `${day}${ordinalSuffix(day)} ${month} ${year}`,
      countdownText: text,
      variant: v,
      daysAbs: abs,
      rightEyebrow: eyebrow,
      rightCaption: caption,
    };
  }, [weddingDate]);

  return (
    <section>
      <div className="lg:hidden text-center pt-12 pb-8 px-6">
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
      </div>
      <div className="hidden lg:flex lg:items-stretch lg:gap-10 lg:pt-2 lg:pb-10 lg:border-b lg:border-wedsy-rose-100">
        <div className="flex-1">
          <p className="wedsy-eyebrow">A WEDSY WEDDING</p>
          <h1 className="font-serif text-[56px] xl:text-[64px] font-normal leading-[1.04] tracking-[-0.6px] text-wedsy-ink mt-3">
            {coupleName}
          </h1>
          <p className="font-serif italic text-[20px] text-wedsy-burgundy mt-3">{formattedDate}</p>
        </div>
        <div className="w-px self-stretch bg-wedsy-rose-100"></div>
        <div className="w-[280px] text-right flex flex-col justify-center">
          <p className="wedsy-eyebrow">{rightEyebrow}</p>
          <p className="font-serif text-[88px] font-normal text-wedsy-burgundy leading-[0.9] tracking-[-2px] mt-2">
            {variant === "today" ? "0" : daysAbs}
          </p>
          <p className="font-serif italic text-[17px] text-wedsy-rose-600 mt-2">{rightCaption}</p>
        </div>
      </div>
    </section>
  );
}
