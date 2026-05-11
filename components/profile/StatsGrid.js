export default function StatsGrid({ stats = [] }) {
  if (stats.length === 0) return null;

  return (
    <section className="pt-2 pb-8 px-6">
      <p className="wedsy-eyebrow">AT A GLANCE</p>
      <h2 className="wedsy-title text-[24px] mt-2 text-wedsy-ink">How things stand</h2>

      <div className="grid grid-cols-2 gap-3 mt-5">
        {stats.map((s, i) => (
          <div key={i} className="bg-wedsy-ivory-2 border border-wedsy-rose-100 p-4">
            <p className="text-[10px] tracking-[1px] uppercase font-medium text-wedsy-rose-600">
              {s.label}
            </p>
            <p className="wedsy-title text-[32px] text-wedsy-burgundy mt-1 leading-none">
              {s.value}
            </p>
            {s.sublabel && (
              <p className="wedsy-italic-em text-[11px] mt-2 text-wedsy-ink-3">{s.sublabel}</p>
            )}
          </div>
        ))}
      </div>
    </section>
  );
}
