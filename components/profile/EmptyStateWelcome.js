export default function EmptyStateWelcome({ onCreateEvent }) {
  return (
    <section className="text-center pt-16 pb-12 px-6 lg:max-w-[560px] lg:mx-auto lg:py-24">
      <p className="wedsy-eyebrow">WELCOME</p>
      <h1 className="wedsy-title text-[36px] leading-[1.1] mt-3 text-wedsy-ink lg:text-[44px]">
        Your planning home, ready to begin
      </h1>
      <div className="wedsy-ornament-divider my-6 mx-auto"></div>
      <p className="wedsy-italic-em text-[15px] mt-2 lg:text-[16px] text-wedsy-ink-2">
        Create your event to unlock your timeline, vendor tracker, and planning console.
      </p>
      <button
        type="button"
        onClick={onCreateEvent}
        className="mt-10 w-full py-3 bg-wedsy-rose-600 text-white text-[13px] tracking-[2px] uppercase font-medium hover:bg-wedsy-burgundy transition-colors lg:w-auto lg:px-12 lg:mx-auto lg:block"
      >
        Create your event →
      </button>
    </section>
  );
}
