import Head from "next/head";
import Link from "next/link";
import { useState } from "react";
import { trimTitle } from "@/utils/seo";

const S = {
  page: { background: "#fdf6ec", minHeight: "100vh", color: "#2c1810", display: "flex", alignItems: "center", justifyContent: "center", padding: "2rem" },
  card: { background: "#fffaf4", border: "0.5px solid #e8d8c4", borderRadius: 16, padding: "2.5rem", width: "100%", maxWidth: 480 },
  eyebrow: { fontSize: 10, letterSpacing: 2, textTransform: "uppercase", color: "#b8852a", marginBottom: 12 },
  title: { fontFamily: "Georgia, 'Times New Roman', serif", fontSize: 28, fontWeight: 400, color: "#2c1810", marginBottom: 6, lineHeight: 1.2 },
  sub: { fontSize: 14, color: "#7a5a48", marginBottom: "1.5rem", lineHeight: 1.6 },
  venueBadge: { display: "inline-flex", alignItems: "center", gap: 6, background: "#f7edda", border: "0.5px solid #e8d8c4", borderRadius: 100, padding: "6px 12px", fontSize: 13, color: "#2c1810", marginBottom: "1.5rem" },
  label: { fontSize: 11, textTransform: "uppercase", letterSpacing: 0.8, color: "#b09080", marginBottom: 4, display: "block" },
  input: { width: "100%", height: 42, border: "0.5px solid #e8d8c4", borderRadius: 8, padding: "0 12px", fontSize: 14, background: "#f7edda", color: "#2c1810", outline: "none", marginBottom: 12, boxSizing: "border-box" },
  select: { width: "100%", height: 42, border: "0.5px solid #e8d8c4", borderRadius: 8, padding: "0 12px", fontSize: 14, background: "#f7edda", color: "#2c1810", outline: "none", marginBottom: 12, boxSizing: "border-box" },
  btn: { width: "100%", height: 44, background: "#6b1e2e", border: "none", borderRadius: 100, fontSize: 14, fontWeight: 500, color: "#fdf6ec", cursor: "pointer", marginBottom: 10 },
  btnDisabled: { width: "100%", height: 44, background: "#b09080", border: "none", borderRadius: 100, fontSize: 14, fontWeight: 500, color: "#fdf6ec", cursor: "not-allowed", marginBottom: 10 },
  error: { fontSize: 12, color: "#c0392b", marginBottom: 10, textAlign: "center" },
  success: { fontSize: 13, color: "#2d6a4f", marginBottom: 10, textAlign: "center", lineHeight: 1.6 },
  divider: { borderTop: "0.5px solid #f0e4d0", margin: "1.5rem 0" },
  backLink: { fontSize: 13, color: "#6b1e2e", textDecoration: "none", display: "flex", alignItems: "center", gap: 4 },
  otpInput: { width: "100%", height: 56, border: "0.5px solid #e8d8c4", borderRadius: 8, padding: "0 12px", fontSize: 24, letterSpacing: 8, background: "#f7edda", color: "#2c1810", outline: "none", marginBottom: 12, boxSizing: "border-box", textAlign: "center" },
  steps: { display: "flex", gap: 8, marginBottom: "1.5rem" },
  step: { flex: 1, height: 3, borderRadius: 2, background: "#f0e2c8" },
  stepActive: { flex: 1, height: 3, borderRadius: 2, background: "#6b1e2e" },
};

export default function ClaimVenuePage({ venue }) {
  const [step, setStep] = useState(1); // 1=details, 2=otp, 3=success
  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [role, setRole] = useState("owner");
  const [otp, setOtp] = useState("");
  const [referenceId, setReferenceId] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  if (!venue) {
    return (
      <div style={S.page}>
        <div style={S.card}>
          <div style={S.title}>Venue not found</div>
          <Link href="/venues" style={S.backLink}>← Back to venues</Link>
        </div>
      </div>
    );
  }

  const sendOTP = async () => {
    if (!name.trim() || !phone.trim()) { setError("Please enter your name and phone"); return; }
    if (phone.replace(/\D/g, "").length < 10) { setError("Please enter a valid phone number"); return; }
    setLoading(true); setError("");
    try {
      const res = await fetch(process.env.NEXT_PUBLIC_API_URL + "/venue-owner/claim", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ slug: venue.slug, phone, name, role }),
      });
      const data = await res.json();
      if (res.ok) { setReferenceId(data.referenceId); setStep(2); }
      else { setError(data.message || "Something went wrong"); }
    } catch (e) { setError("Could not send OTP. Please try again."); }
    setLoading(false);
  };

  const verifyOTP = async () => {
    if (!otp.trim() || otp.length < 6) { setError("Please enter the 6-digit OTP"); return; }
    setLoading(true); setError("");
    try {
      const res = await fetch(process.env.NEXT_PUBLIC_API_URL + "/venue-owner/claim/verify", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ slug: venue.slug, phone, name, role, otp, referenceId }),
      });
      const data = await res.json();
      if (res.ok) {
        localStorage.setItem("venue_owner_token", data.token);
        localStorage.setItem("venue_owner", JSON.stringify(data.venueOwner));
        setStep(3);
      } else { setError(data.message || "Invalid OTP"); }
    } catch (e) { setError("Could not verify OTP. Please try again."); }
    setLoading(false);
  };

  return (
    <>
      <Head>
        <title>{trimTitle(`Claim ${venue.name} on Wedsy`)}</title>
      </Head>
      <div style={S.page}>
        <div style={S.card}>
          <Link href={`/venues/${venue.slug}`} style={S.backLink}>← Back to listing</Link>
          <div style={S.divider} />

          {/* Progress steps */}
          <div style={S.steps}>
            <div style={step >= 1 ? S.stepActive : S.step} />
            <div style={step >= 2 ? S.stepActive : S.step} />
            <div style={step >= 3 ? S.stepActive : S.step} />
          </div>

          {step === 1 && (
            <>
              <div style={S.eyebrow}>Venue claiming</div>
              <div style={S.title}>Is this your venue?</div>
              <p style={S.sub}>Claim your listing on Wedsy to manage enquiries, update photos, and connect with couples looking for their perfect wedding venue.</p>
              <div style={S.venueBadge}>🏡 {venue.name}</div>
              <label style={S.label}>Your name</label>
              <input style={S.input} placeholder="Rajesh Kumar" value={name} onChange={(e) => setName(e.target.value)} />
              <label style={S.label}>Your phone number</label>
              <input style={S.input} placeholder="+91 98xxx xxxxx" value={phone} onChange={(e) => setPhone(e.target.value)} />
              <label style={S.label}>Your role at this venue</label>
              <select style={S.select} value={role} onChange={(e) => setRole(e.target.value)}>
                <option value="owner">Owner</option>
                <option value="manager">Manager</option>
                <option value="marketing">Marketing / Sales</option>
              </select>
              {error && <div style={S.error}>{error}</div>}
              <button style={loading ? S.btnDisabled : S.btn} onClick={sendOTP} disabled={loading}>
                {loading ? "Sending OTP..." : "Send OTP →"}
              </button>
              <div style={{ fontSize: 11, color: "#b09080", textAlign: "center" }}>
                We'll send a 6-digit OTP to verify your phone number
              </div>
            </>
          )}

          {step === 2 && (
            <>
              <div style={S.eyebrow}>Verification</div>
              <div style={S.title}>Enter your OTP</div>
              <p style={S.sub}>We've sent a 6-digit OTP to <strong>{phone}</strong> via SMS and WhatsApp.</p>
              <input
                style={S.otpInput}
                placeholder="••••••"
                value={otp}
                onChange={(e) => setOtp(e.target.value.replace(/\D/g, "").slice(0, 6))}
                maxLength={6}
              />
              {error && <div style={S.error}>{error}</div>}
              <button style={loading ? S.btnDisabled : S.btn} onClick={verifyOTP} disabled={loading}>
                {loading ? "Verifying..." : "Verify & Claim listing →"}
              </button>
              <div style={{ fontSize: 12, color: "#b09080", textAlign: "center", cursor: "pointer" }} onClick={() => { setStep(1); setOtp(""); setError(""); }}>
                ← Change phone number
              </div>
            </>
          )}

          {step === 3 && (
            <>
              <div style={{ fontSize: 48, textAlign: "center", marginBottom: 16 }}>🎊</div>
              <div style={S.title}>Listing claimed!</div>
              <p style={S.sub}>Welcome to Wedsy, {name}. Your listing for <strong>{venue.name}</strong> has been claimed successfully. Our team will review and upgrade your listing to Verified status shortly.</p>
              <div style={{ ...S.success, background: "#e8f4ee", padding: "12px", borderRadius: 8, marginBottom: 16 }}>
                ✓ Venue claimed · ✓ Phone verified · ⏳ Verification pending
              </div>
              <button style={S.btn} onClick={() => window.location.href = "/venues/" + venue.slug}>
                View my listing →
              </button>
            </>
          )}
        </div>
      </div>
    </>
  );
}

export async function getServerSideProps({ params }) {
  try {
    const { slug } = params;
    const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/venues/${slug}`);
    if (!res.ok) return { notFound: true };
    const { venue } = await res.json();
    return { props: { venue } };
  } catch (err) {
    return { notFound: true };
  }
}
