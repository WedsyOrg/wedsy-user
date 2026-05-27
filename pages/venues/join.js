import Head from "next/head";
import Link from "next/link";
import { useState } from "react";

// Self sign-up for venue owners whose venue isn't on Wedsy yet. Posts to the
// existing /venue-owner/claim/manual endpoint with slug:null — the server
// branches on the missing slug + newVenueName presence and stores the request
// under tier "new_venue_signup" for the team to review within 24 hours.
//
// V1 deliberately skips OTP: the only verify-only OTP route also creates a
// couple account as a side effect, and the team calls every submission within
// a day anyway, so phone confirmation happens on that call.

const VENUE_TYPES = [
  { value: "resort", label: "Resort" },
  { value: "farmhouse", label: "Farmhouse" },
  { value: "villa", label: "Villa" },
  { value: "hotel", label: "Hotel" },
  { value: "heritage", label: "Heritage" },
  { value: "other", label: "Other" },
];

const S = {
  page: {
    background: "#fdf6ec",
    minHeight: "100vh",
    color: "#2c1810",
    fontFamily: "inherit",
    padding: "3rem 1.5rem 4rem",
  },
  wrap: { maxWidth: 560, margin: "0 auto" },
  backLink: { fontSize: 13, color: "#6b1e2e", textDecoration: "none" },
  eyebrow: {
    fontSize: 11,
    letterSpacing: 3,
    textTransform: "uppercase",
    color: "#b8852a",
    marginBottom: 14,
    marginTop: "1.75rem",
    display: "flex",
    alignItems: "center",
    gap: 10,
  },
  eyebrowLine: { width: 28, height: 0.5, background: "#b8852a", opacity: 0.6, display: "block" },
  title: {
    fontFamily: "Georgia, 'Times New Roman', serif",
    fontSize: 38,
    fontWeight: 400,
    lineHeight: 1.15,
    color: "#2c1810",
    marginBottom: 10,
    letterSpacing: -0.4,
  },
  titleEm: { fontStyle: "italic", color: "#6b1e2e" },
  sub: { fontSize: 15, color: "#7a5a48", lineHeight: 1.65, marginBottom: "2rem" },
  card: {
    background: "#fffaf4",
    border: "0.5px solid #e8d8c4",
    borderRadius: 16,
    padding: "2rem",
  },
  field: { marginBottom: "1.25rem" },
  label: {
    fontSize: 10,
    textTransform: "uppercase",
    letterSpacing: 1,
    color: "#b09080",
    marginBottom: 6,
    display: "block",
  },
  // Hairline-bottom-border input style, matching the venue enquiry form
  // language (warm, understated, no boxy edges).
  input: {
    width: "100%",
    height: 38,
    border: "none",
    borderBottom: "0.5px solid #e8d8c4",
    background: "transparent",
    padding: "0 0 4px",
    fontSize: 14,
    color: "#2c1810",
    outline: "none",
    boxSizing: "border-box",
    fontFamily: "inherit",
  },
  inputFocused: { borderBottom: "0.5px solid #6b1e2e" },
  phoneWrap: { display: "flex", alignItems: "center", gap: 8, borderBottom: "0.5px solid #e8d8c4" },
  phonePrefix: { fontSize: 14, color: "#7a5a48", fontFamily: "inherit", paddingBottom: 4 },
  phoneInput: {
    flex: 1,
    height: 38,
    border: "none",
    background: "transparent",
    padding: "0 0 4px",
    fontSize: 14,
    color: "#2c1810",
    outline: "none",
    boxSizing: "border-box",
    fontFamily: "inherit",
  },
  select: {
    width: "100%",
    height: 38,
    border: "none",
    borderBottom: "0.5px solid #e8d8c4",
    background: "transparent",
    padding: "0 0 4px",
    fontSize: 14,
    color: "#2c1810",
    outline: "none",
    boxSizing: "border-box",
    fontFamily: "inherit",
    cursor: "pointer",
  },
  textarea: {
    width: "100%",
    minHeight: 80,
    border: "0.5px solid #e8d8c4",
    borderRadius: 10,
    background: "#fdf4e6",
    padding: "10px 12px",
    fontSize: 14,
    color: "#2c1810",
    outline: "none",
    boxSizing: "border-box",
    fontFamily: "inherit",
    resize: "vertical",
    lineHeight: 1.5,
  },
  hint: { fontSize: 11, color: "#b09080", marginTop: 6 },
  btn: {
    width: "100%",
    height: 48,
    background: "#6b1e2e",
    border: "none",
    borderRadius: 100,
    fontSize: 14,
    fontWeight: 500,
    color: "#fdf6ec",
    cursor: "pointer",
    marginTop: "0.5rem",
    letterSpacing: 0.2,
  },
  btnDisabled: {
    width: "100%",
    height: 48,
    background: "#d4c0a8",
    border: "none",
    borderRadius: 100,
    fontSize: 14,
    fontWeight: 500,
    color: "#fdf6ec",
    cursor: "not-allowed",
    marginTop: "0.5rem",
    letterSpacing: 0.2,
  },
  error: {
    fontSize: 12,
    color: "#c0392b",
    marginTop: 10,
    padding: "10px 12px",
    background: "#fdf0ee",
    border: "0.5px solid #f0d0cc",
    borderRadius: 8,
  },
  legal: {
    fontSize: 11,
    color: "#b09080",
    textAlign: "center",
    marginTop: 14,
    lineHeight: 1.6,
  },
  // Success state
  successCard: {
    background: "#fffaf4",
    border: "0.5px solid #e8d8c4",
    borderRadius: 16,
    padding: "2.5rem",
    textAlign: "center",
  },
  successEmoji: { fontSize: 48, marginBottom: 16 },
  successTitle: {
    fontFamily: "Georgia, serif",
    fontSize: 28,
    fontWeight: 400,
    color: "#2c1810",
    marginBottom: 12,
  },
  successBody: { fontSize: 15, color: "#7a5a48", lineHeight: 1.7, marginBottom: 18 },
  successBadge: {
    display: "inline-block",
    background: "#e8f4ee",
    border: "0.5px solid #c0d8c0",
    borderRadius: 100,
    padding: "8px 16px",
    fontSize: 12,
    color: "#2d6a4f",
    marginBottom: 24,
  },
  successCta: {
    display: "inline-block",
    background: "#6b1e2e",
    color: "#fdf6ec",
    borderRadius: 100,
    padding: "12px 24px",
    fontSize: 14,
    fontWeight: 500,
    textDecoration: "none",
  },
};

export default function JoinVenuePage() {
  const [step, setStep] = useState(1);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState("");

  const [newVenueName, setNewVenueName] = useState("");
  const [newVenueType, setNewVenueType] = useState("resort");
  const [newVenueAddress, setNewVenueAddress] = useState("");
  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [email, setEmail] = useState("");
  const [howHeard, setHowHeard] = useState("");

  const phoneDigits = phone.replace(/\D/g, "");
  const emailValid = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.trim());
  const allValid =
    newVenueName.trim().length > 0 &&
    newVenueType &&
    newVenueAddress.trim().length > 0 &&
    name.trim().length > 0 &&
    phoneDigits.length === 10 &&
    emailValid;

  const submit = async () => {
    if (!allValid || submitting) return;
    setSubmitting(true);
    setError("");
    try {
      const res = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/venue-owner/claim/manual`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            slug: null,
            name: name.trim(),
            phone: "+91" + phoneDigits,
            email: email.trim(),
            designation: "owner",
            howHeard: howHeard.trim(),
            message:
              "Self sign-up from wedsy.in/venues/join — new venue not yet in database",
            newVenueName: newVenueName.trim(),
            newVenueType,
            newVenueAddress: newVenueAddress.trim(),
          }),
        }
      );
      const data = await res.json().catch(() => ({}));
      if (res.ok) {
        setStep(2);
      } else {
        setError(data.message || "Something went wrong. Please try again.");
      }
    } catch (e) {
      setError("Could not submit. Please check your connection and try again.");
    }
    setSubmitting(false);
  };

  return (
    <>
      <Head>
        <title>List your venue on Wedsy — Bangalore wedding venues</title>
        <meta
          name="description"
          content="List your wedding venue on Wedsy. Join 74+ resorts and farmhouses already receiving warm couple leads in Bangalore."
        />
        <meta name="robots" content="index, follow" />
        <link rel="canonical" href="https://wedsy.in/venues/join" />
      </Head>

      <main style={S.page}>
        <div style={S.wrap}>
          <Link href="/venues" style={S.backLink}>
            ← Back to venues
          </Link>

          {step === 1 && (
            <>
              <div style={S.eyebrow}>
                <span style={S.eyebrowLine} />
                For venue owners
              </div>
              <h1 style={S.title}>
                List your venue on <em style={S.titleEm}>Wedsy</em>
              </h1>
              <p style={S.sub}>
                Join 74+ venues already on Wedsy and start receiving warm
                couple leads. Tell us about your venue and our team will get
                your listing live within 24 hours.
              </p>

              <div style={S.card}>
                <div style={S.field}>
                  <label style={S.label}>Venue name</label>
                  <input
                    style={S.input}
                    placeholder="e.g. The Grove Estate"
                    value={newVenueName}
                    onChange={(e) => setNewVenueName(e.target.value)}
                  />
                </div>

                <div style={S.field}>
                  <label style={S.label}>Venue type</label>
                  <select
                    style={S.select}
                    value={newVenueType}
                    onChange={(e) => setNewVenueType(e.target.value)}
                  >
                    {VENUE_TYPES.map((t) => (
                      <option key={t.value} value={t.value}>
                        {t.label}
                      </option>
                    ))}
                  </select>
                </div>

                <div style={S.field}>
                  <label style={S.label}>Full address in Bangalore</label>
                  <textarea
                    style={S.textarea}
                    placeholder="Street, area, landmark, pincode"
                    value={newVenueAddress}
                    onChange={(e) => setNewVenueAddress(e.target.value)}
                  />
                </div>

                <div style={S.field}>
                  <label style={S.label}>Primary contact name</label>
                  <input
                    style={S.input}
                    placeholder="Rajesh Kumar"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                  />
                </div>

                <div style={S.field}>
                  <label style={S.label}>Phone number</label>
                  <div style={S.phoneWrap}>
                    <span style={S.phonePrefix}>+91</span>
                    <input
                      style={S.phoneInput}
                      placeholder="98xxxxxxxx"
                      value={phone}
                      onChange={(e) =>
                        setPhone(e.target.value.replace(/\D/g, "").slice(0, 10))
                      }
                      inputMode="numeric"
                    />
                  </div>
                  {phone.length > 0 && phoneDigits.length !== 10 && (
                    <div style={S.hint}>Enter a 10-digit Indian mobile number</div>
                  )}
                </div>

                <div style={S.field}>
                  <label style={S.label}>Email address</label>
                  <input
                    style={S.input}
                    type="email"
                    placeholder="you@venue.com"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                  />
                </div>

                <div style={S.field}>
                  <label style={S.label}>
                    How did you hear about Wedsy? (optional)
                  </label>
                  <input
                    style={S.input}
                    placeholder="Google, Instagram, a friend..."
                    value={howHeard}
                    onChange={(e) => setHowHeard(e.target.value)}
                  />
                </div>

                {error && <div style={S.error}>{error}</div>}

                <button
                  style={allValid && !submitting ? S.btn : S.btnDisabled}
                  onClick={submit}
                  disabled={!allValid || submitting}
                  type="button"
                >
                  {submitting ? "Sending..." : "Continue →"}
                </button>

                <div style={S.legal}>
                  By continuing, you agree to be contacted by Wedsy about your
                  listing.
                </div>
              </div>
            </>
          )}

          {step === 2 && (
            <>
              <div style={S.eyebrow}>
                <span style={S.eyebrowLine} />
                Request received
              </div>
              <div style={S.successCard}>
                <div style={S.successEmoji}>🎊</div>
                <div style={S.successTitle}>You&apos;re on the list!</div>
                <p style={S.successBody}>
                  We&apos;ll review your listing and have it live within 24
                  hours. Our team will reach out on{" "}
                  <strong style={{ color: "#2c1810" }}>+91 {phoneDigits}</strong>{" "}
                  to confirm your details.
                </p>
                <div style={S.successBadge}>
                  ✓ Request received · ⏳ Listing live within 24 hrs
                </div>
                <div>
                  <Link href="/venues" style={S.successCta}>
                    Browse our existing venues →
                  </Link>
                </div>
              </div>
            </>
          )}
        </div>
      </main>
    </>
  );
}
