/**
 * Public-facing "coming soon" gate shown when a page is hidden from
 * scraping. Internal team bypasses via the server-side preview key.
 *
 * `pageName` ("decor" | "wedding-store") is accepted for future
 * per-page copy; v1 copy is identical for both.
 */
export default function ComingSoonPage({ pageName }) {
  return (
    <main className="min-h-screen flex items-center justify-center bg-wedsy-ivory px-5 sm:px-6">
      <section className="w-full max-w-[600px] mx-auto text-center">
        <p className="wedsy-eyebrow">COMING SOON</p>

        <h1 className="wedsy-title text-[34px] leading-[1.15] mt-4 text-wedsy-ink sm:text-[44px]">
          Something beautiful is coming
        </h1>

        <div className="wedsy-ornament-divider my-7 mx-auto"></div>

        <p className="wedsy-italic-em text-[17px] leading-[1.5] mt-2 sm:text-[19px]">
          {"We're curating Bangalore's most stunning wedding collection."}
        </p>

        <p className="wedsy-subtitle mt-6 text-[14px]">Launching soon.</p>

        <p className="mt-12 font-sans text-[12px] tracking-[0.3px] text-wedsy-ink-3">
          Questions? Reach us at{" "}
          <a
            href="mailto:hello@wedsy.in"
            className="text-wedsy-ink-3 no-underline hover:underline"
          >
            hello@wedsy.in
          </a>{" "}
          or{" "}
          <a
            href="tel:+916364849765"
            className="text-wedsy-ink-3 no-underline hover:underline"
          >
            +91 63648 49765
          </a>
        </p>
      </section>
    </main>
  );
}
