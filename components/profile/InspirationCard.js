export default function InspirationCard({
  imageSrc,
  tagline,
  headline,
  ctaLabel = "Explore",
  onTap,
}) {
  const cardStyle = imageSrc
    ? {
        backgroundImage: `url(${imageSrc})`,
        backgroundSize: "cover",
        backgroundPosition: "center",
      }
    : undefined;

  return (
    <section className="pt-2 pb-8 px-6">
      <p className="wedsy-eyebrow">INSPIRATION</p>
      <h2 className="wedsy-title text-[20px] mt-2 text-wedsy-ink">From the Wedsy archives</h2>

      <button
        type="button"
        onClick={onTap}
        style={cardStyle}
        className={`relative w-full aspect-[4/3] mt-5 border border-wedsy-rose-100 overflow-hidden text-left ${
          imageSrc ? "" : "bg-wedsy-rose-100"
        }`}
      >
        <span
          aria-hidden="true"
          className="absolute inset-0"
          style={{
            background:
              "linear-gradient(to top, rgba(31,26,23,0.65), rgba(31,26,23,0))",
          }}
        />
        <span className="absolute inset-0 p-6 flex flex-col justify-end">
          {tagline && (
            <span className="font-serif italic text-[12px] tracking-[1px] uppercase text-wedsy-rose-100">
              {tagline}
            </span>
          )}
          {headline && (
            <span className="wedsy-title text-white text-[24px] mt-1 leading-tight">
              {headline}
            </span>
          )}
          <span className="text-[12px] tracking-[2px] uppercase font-medium text-white mt-3 self-end">
            {ctaLabel} →
          </span>
        </span>
      </button>
    </section>
  );
}
