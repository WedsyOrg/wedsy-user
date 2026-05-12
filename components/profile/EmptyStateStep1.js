import { useState } from "react";

const COMMUNITIES = ["Hindu", "Muslim", "Christian", "Sikh", "Jain", "Jewish", "Other"];

export default function EmptyStateStep1({ onContinue }) {
  const [eventName, setEventName] = useState("");
  const [community, setCommunity] = useState("");

  const canContinue = eventName.trim().length > 0 && community.length > 0;

  const handleContinue = () => {
    if (!canContinue) return;
    onContinue({ eventName: eventName.trim(), community });
  };

  return (
    <section className="text-center pt-12 pb-10 px-6 lg:max-w-[600px] lg:mx-auto lg:py-16">
      <p className="wedsy-eyebrow">STEP 1 OF 2</p>
      <h1 className="wedsy-title text-[36px] leading-[1.1] mt-3 text-wedsy-ink lg:text-[44px]">
        Tell us about your wedding
      </h1>
      <p className="wedsy-italic-em text-[15px] mt-2 lg:text-[16px]">
        We&apos;ll build your dashboard around this
      </p>
      <div className="wedsy-ornament-divider my-6 mx-auto"></div>

      <div className="text-left mt-8 space-y-6">
        <div>
          <label
            htmlFor="profile-event-name"
            className="block text-[11px] tracking-[1px] uppercase text-wedsy-ink-3 font-medium mb-2"
          >
            What should we call this celebration?
          </label>
          <input
            id="profile-event-name"
            type="text"
            value={eventName}
            onChange={(e) => setEventName(e.target.value)}
            placeholder="e.g., Rohaan & Asiya"
            className="w-full bg-wedsy-ivory-2 border border-wedsy-rose-100 px-4 py-3 text-wedsy-ink placeholder:font-serif placeholder:italic placeholder:text-wedsy-ink-3 focus:outline-none focus:border-wedsy-burgundy-soft transition-colors"
          />
        </div>

        <div>
          <label
            htmlFor="profile-community"
            className="block text-[11px] tracking-[1px] uppercase text-wedsy-ink-3 font-medium mb-2"
          >
            Community
          </label>
          <select
            id="profile-community"
            value={community}
            onChange={(e) => setCommunity(e.target.value)}
            className="w-full bg-wedsy-ivory-2 border border-wedsy-rose-100 px-4 py-3 text-wedsy-ink focus:outline-none focus:border-wedsy-burgundy-soft transition-colors appearance-none"
          >
            <option value="" disabled>
              Select community…
            </option>
            {COMMUNITIES.map((c) => (
              <option key={c} value={c}>
                {c}
              </option>
            ))}
          </select>
        </div>
      </div>

      <button
        type="button"
        disabled={!canContinue}
        onClick={handleContinue}
        className="mt-10 w-full py-3 bg-wedsy-rose-600 text-white text-[13px] tracking-[2px] uppercase font-medium disabled:bg-wedsy-ink-3 disabled:cursor-not-allowed transition-colors lg:w-auto lg:px-12 lg:mx-auto lg:block"
      >
        Continue
      </button>
    </section>
  );
}
