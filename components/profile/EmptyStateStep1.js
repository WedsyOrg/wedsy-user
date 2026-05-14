import { useState } from "react";

const COMMUNITIES = ["Hindu", "Muslim", "Christian", "Sikh", "Jain", "Jewish", "Other"];

const NAME_INPUT_CLASS =
  "w-full bg-wedsy-ivory-2 border border-wedsy-rose-100 px-4 py-3 text-wedsy-ink placeholder:font-serif placeholder:italic placeholder:text-wedsy-ink-3 focus:outline-none focus:border-wedsy-burgundy-soft transition-colors";

const NAME_LABEL_CLASS =
  "block text-[11px] tracking-[1px] uppercase text-wedsy-ink-3 font-medium mb-2";

export default function EmptyStateStep1({ onContinue, initialValues }) {
  const [groomName, setGroomName] = useState(initialValues?.groomName || "");
  const [brideName, setBrideName] = useState(initialValues?.brideName || "");
  const [community, setCommunity] = useState(initialValues?.community || "");

  const canContinue =
    groomName.trim().length > 0 &&
    brideName.trim().length > 0 &&
    community.length > 0;

  const handleContinue = () => {
    if (!canContinue) return;
    onContinue({
      groomName: groomName.trim(),
      brideName: brideName.trim(),
      community,
    });
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
        <div className="space-y-6 lg:grid lg:grid-cols-2 lg:gap-4 lg:space-y-0">
          <div>
            <label htmlFor="profile-groom-name" className={NAME_LABEL_CLASS}>
              Groom&apos;s name
            </label>
            <input
              id="profile-groom-name"
              type="text"
              value={groomName}
              onChange={(e) => setGroomName(e.target.value)}
              placeholder="e.g., Rohaan"
              className={NAME_INPUT_CLASS}
            />
          </div>
          <div>
            <label htmlFor="profile-bride-name" className={NAME_LABEL_CLASS}>
              Bride&apos;s name
            </label>
            <input
              id="profile-bride-name"
              type="text"
              value={brideName}
              onChange={(e) => setBrideName(e.target.value)}
              placeholder="e.g., Asiya"
              className={NAME_INPUT_CLASS}
            />
          </div>
        </div>

        <div>
          <label htmlFor="profile-community" className={NAME_LABEL_CLASS}>
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
