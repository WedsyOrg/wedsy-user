import Head from "next/head";
import Link from "next/link";
import { useState, useEffect } from "react";
import { useRouter } from "next/router";

export default function ClaimVenuePage() {
  const router = useRouter();
  const [slug, setSlug] = useState("");
  const [venue, setVenue] = useState(null);
  const [claimInfo, setClaimInfo] = useState(null);
  const [pageLoading, setPageLoading] = useState(true);

  useEffect(() => {
    if (!router.isReady) return;
    const s = router.query.slug;
    setSlug(s);
    Promise.all([
      fetch(process.env.NEXT_PUBLIC_API_URL + "/venues/" + s).then(r => r.json()),
      fetch(process.env.NEXT_PUBLIC_API_URL + "/venue-owner/claim-info/" + s).then(r => r.json()),
    ]).then(([venueData, claimData]) => {
      setVenue(venueData.venue);
      setClaimInfo(claimData);
      setPageLoading(false);
    }).catch(() => setPageLoading(false));
  }, [router.isReady, router.query.slug]);

  if (pageLoading) return <div style={{display:"flex",alignItems:"center",justifyContent:"center",minHeight:"100vh",background:"#fdf6ec",fontSize:14,color:"#7a5a48"}}>Loading...</div>;
  if (!venue) return <div style={{display:"flex",alignItems:"center",justifyContent:"center",minHeight:"100vh",background:"#fdf6ec",fontSize:14,color:"#7a5a48"}}>Venue not found. <Link href="/venues" style={{color:"#6b1e2e",marginLeft:6}}>Back to venues</Link></div>;
  if (claimInfo?.message === "This venue has already been claimed") return (
    <div style={{display:"flex",alignItems:"center",justifyContent:"center",minHeight:"100vh",background:"#fdf6ec"}}>
      <div style={{background:"#fffaf4",border:"0.5px solid #e8d8c4",borderRadius:16,padding:"2.5rem",maxWidth:440,textAlign:"center"}}>
        <div style={{fontSize:36,marginBottom:12}}>🔒</div>
        <div style={{fontSize:20,fontWeight:500,color:"#2c1810",marginBottom:8}}>Already claimed</div>
        <p style={{fontSize:14,color:"#7a5a48",marginBottom:16}}>This venue has already been claimed by its owner.</p>
        <Link href={"/venues/" + slug} style={{color:"#6b1e2e",fontSize:13}}>← Back to listing</Link>
      </div>
    </div>
  );

  return <ClaimForm venue={venue} claimInfo={claimInfo} slug={slug} />;
}

function ClaimForm({ venue, claimInfo, slug }) {
  const [step, setStep] = useState(1);
  const [tier, setTier] = useState(1);
  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [role, setRole] = useState("owner");
  const [otp, setOtp] = useState("");
  const [referenceId, setReferenceId] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [email, setEmail] = useState("");
  const [howHeard, setHowHeard] = useState("");
  const [manualMessage, setManualMessage] = useState("");
  const [uploadedDoc, setUploadedDoc] = useState(null);
  const [docType, setDocType] = useState("image/jpeg");

  const maskedPhone = claimInfo?.maskedPhone || "";
  const phoneLen = claimInfo?.phoneLength || 10;
  const first2 = maskedPhone.slice(0, 2);
  const last3 = maskedPhone.slice(-3);
  const middleLen = phoneLen - 5;
  const reconstructPhone = () => first2 + phone.replace(/\D/g, "") + last3;

  const S = {
    page: { background: "#fdf6ec", minHeight: "100vh", display: "flex", alignItems: "center", justifyContent: "center", padding: "2rem" },
    card: { background: "#fffaf4", border: "0.5px solid #e8d8c4", borderRadius: 16, padding: "2.5rem", width: "100%", maxWidth: 500 },
    eyebrow: { fontSize: 10, letterSpacing: 2, textTransform: "uppercase", color: "#b8852a", marginBottom: 12 },
    title: { fontFamily: "Georgia, serif", fontSize: 26, fontWeight: 400, color: "#2c1810", marginBottom: 8, lineHeight: 1.2 },
    sub: { fontSize: 14, color: "#7a5a48", marginBottom: "1.5rem", lineHeight: 1.6 },
    label: { fontSize: 11, textTransform: "uppercase", letterSpacing: 0.8, color: "#b09080", marginBottom: 4, display: "block" },
    input: { width: "100%", height: 42, border: "0.5px solid #e8d8c4", borderRadius: 8, padding: "0 12px", fontSize: 14, background: "#f7edda", color: "#2c1810", outline: "none", marginBottom: 12, boxSizing: "border-box" },
    select: { width: "100%", height: 42, border: "0.5px solid #e8d8c4", borderRadius: 8, padding: "0 12px", fontSize: 14, background: "#f7edda", color: "#2c1810", outline: "none", marginBottom: 12, boxSizing: "border-box" },
    textarea: { width: "100%", height: 80, border: "0.5px solid #e8d8c4", borderRadius: 8, padding: "10px 12px", fontSize: 14, background: "#f7edda", color: "#2c1810", outline: "none", marginBottom: 12, boxSizing: "border-box", resize: "none", fontFamily: "inherit" },
    btn: { width: "100%", height: 44, background: "#6b1e2e", border: "none", borderRadius: 100, fontSize: 14, fontWeight: 500, color: "#fdf6ec", cursor: "pointer", marginBottom: 10 },
    btnOutline: { width: "100%", height: 44, background: "transparent", border: "0.5px solid #e8d8c4", borderRadius: 100, fontSize: 13, color: "#7a5a48", cursor: "pointer", marginBottom: 10 },
    btnDisabled: { width: "100%", height: 44, background: "#b09080", border: "none", borderRadius: 100, fontSize: 14, fontWeight: 500, color: "#fdf6ec", cursor: "not-allowed", marginBottom: 10 },
    error: { fontSize: 12, color: "#c0392b", marginBottom: 10, padding: "10px 12px", background: "#fdf0ee", borderRadius: 8 },
    steps: { display: "flex", gap: 6, marginBottom: "1.5rem" },
    infoBox: { background: "#fdf4e6", border: "0.5px solid #f0e4d0", borderRadius: 10, padding: "12px 14px", marginBottom: 14, fontSize: 12, color: "#7a5a48", lineHeight: 1.6 },
    otpInput: { width: "100%", height: 56, border: "0.5px solid #e8d8c4", borderRadius: 8, fontSize: 24, letterSpacing: 8, background: "#f7edda", color: "#2c1810", outline: "none", marginBottom: 12, boxSizing: "border-box", textAlign: "center" },
    uploadArea: { border: "0.5px dashed #e8d8c4", borderRadius: 10, padding: "1.5rem", textAlign: "center", cursor: "pointer", marginBottom: 12, background: "#fdf4e6" },
    venueBadge: { display: "inline-flex", alignItems: "center", gap: 6, background: "#f7edda", border: "0.5px solid #e8d8c4", borderRadius: 100, padding: "6px 12px", fontSize: 13, color: "#2c1810", marginBottom: "1.5rem" },
    divider: { borderTop: "0.5px solid #f0e4d0", margin: "1.5rem 0" },
    backLink: { fontSize: 13, color: "#6b1e2e", textDecoration: "none" },
  };

  const stepColor = (n) => ({ flex: 1, height: 3, borderRadius: 2, background: n <= step ? "#6b1e2e" : "#f0e2c8" });

  const sendOTP = async () => {
    const digits = phone.replace(/\D/g, "");
    if (claimInfo?.hasPhone && digits.length !== middleLen) { setError("Please enter the " + middleLen + " missing digits"); return; }
    if (!claimInfo?.hasPhone && digits.length < 10) { setError("Please enter a valid phone number"); return; }
    if (!name.trim()) { setError("Please enter your name"); return; }
    setLoading(true); setError("");
    const fullPhone = claimInfo?.hasPhone ? reconstructPhone() : phone;
    try {
      const res = await fetch(process.env.NEXT_PUBLIC_API_URL + "/venue-owner/claim", {
        method: "POST", headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ slug, phone: fullPhone, name, role }),
      });
      const data = await res.json();
      if (res.ok) { setReferenceId(data.referenceId); setStep(2); }
      else if (data.mismatch) { setError("This number doesn't match our records."); setTier(2); }
      else { setError(data.message || "Something went wrong"); }
    } catch (e) { setError("Could not send OTP. Please try again."); }
    setLoading(false);
  };

  const verifyOTP = async () => {
    if (otp.length < 6) { setError("Please enter the 6-digit OTP"); return; }
    setLoading(true); setError("");
    const fullPhone = claimInfo?.hasPhone ? reconstructPhone() : phone;
    try {
      const res = await fetch(process.env.NEXT_PUBLIC_API_URL + "/venue-owner/claim/verify", {
        method: "POST", headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ slug, phone: fullPhone, name, role, otp, referenceId }),
      });
      const data = await res.json();
      if (res.ok) { try { localStorage.setItem("venue_owner_token", data.token); } catch(e) {} setStep(3); }
      else { setError(data.message || "Invalid OTP"); }
    } catch (e) { setError("Could not verify. Please try again."); }
    setLoading(false);
  };

  const submitDocument = async () => {
    if (!uploadedDoc) { setError("Please upload a document"); return; }
    if (!name.trim() || !phone.trim()) { setError("Please enter your name and phone"); return; }
    setLoading(true); setError("");
    try {
      const reader = new FileReader();
      reader.onload = async (e) => {
        const base64 = e.target.result.split(",")[1];
        const res = await fetch(process.env.NEXT_PUBLIC_API_URL + "/venue-owner/claim/document", {
          method: "POST", headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ slug, documentBase64: base64, documentType: docType, name, phone, role }),
        });
        const data = await res.json();
        if (res.ok && data.success) { try { localStorage.setItem("venue_owner_token", data.token); } catch(e) {} setStep(3); }
        else { setError("Document could not be verified automatically."); setTier(4); }
        setLoading(false);
      };
      reader.readAsDataURL(uploadedDoc);
    } catch (e) { setError("Upload failed."); setLoading(false); }
  };

  const submitManual = async () => {
    if (!name.trim() || !phone.trim() || !email.trim()) { setError("Name, phone, and email are required"); return; }
    setLoading(true); setError("");
    try {
      const res = await fetch(process.env.NEXT_PUBLIC_API_URL + "/venue-owner/claim/manual", {
        method: "POST", headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ slug, name, designation: role, phone, email, howHeard, message: manualMessage }),
      });
      const data = await res.json();
      if (res.ok) { setStep(3); setTier(4); }
      else { setError(data.message || "Something went wrong"); }
    } catch (e) { setError("Could not submit."); }
    setLoading(false);
  };

  return (
    <>
      <Head><title>{"Claim " + venue.name + " on Wedsy"}</title></Head>
      <div style={S.page}>
        <div style={S.card}>
          <Link href={"/venues/" + slug} style={S.backLink}>← Back to listing</Link>
          <div style={S.divider} />
          <div style={S.steps}>{[1,2,3].map(n => <div key={n} style={stepColor(n)} />)}</div>

          {step === 1 && tier === 1 && (
            <>
              <div style={S.eyebrow}>Venue claiming · Step 1 of 3</div>
              <div style={S.title}>Is this your venue?</div>
              <p style={S.sub}>Claim your listing to manage enquiries, update photos, and connect with couples on Wedsy.</p>
              <div style={S.venueBadge}>🏡 {venue.name}</div>
              <label style={S.label}>Your name</label>
              <input style={S.input} placeholder="Rajesh Kumar" value={name} onChange={e => setName(e.target.value)} />
              <label style={S.label}>Your role</label>
              <select style={S.select} value={role} onChange={e => setRole(e.target.value)}>
                <option value="owner">Owner</option>
                <option value="manager">Manager</option>
                <option value="marketing">Marketing / Sales</option>
              </select>
              {claimInfo?.hasPhone ? (
                <>
                  <div style={S.infoBox}>We have <strong style={{letterSpacing:2,fontFamily:"monospace"}}>{maskedPhone}</strong> on record. Enter the missing {middleLen} digits to verify.</div>
                  <label style={S.label}>Missing digits</label>
                  <div style={{display:"flex",alignItems:"center",gap:8,marginBottom:12}}>
                    <span style={{fontFamily:"monospace",fontSize:18,color:"#2c1810",letterSpacing:2}}>{first2}</span>
                    <input style={{...S.input,flex:1,marginBottom:0,textAlign:"center",letterSpacing:4,fontFamily:"monospace",fontSize:18}} placeholder={"•".repeat(middleLen)} value={phone} maxLength={middleLen} onChange={e => setPhone(e.target.value.replace(/\D/g,"").slice(0,middleLen))} />
                    <span style={{fontFamily:"monospace",fontSize:18,color:"#2c1810",letterSpacing:2}}>{last3}</span>
                  </div>
                </>
              ) : (
                <>
                  <label style={S.label}>Your venue phone number</label>
                  <input style={S.input} placeholder="+91 98xxx xxxxx" value={phone} onChange={e => setPhone(e.target.value)} />
                </>
              )}
              {error && <div style={S.error}>{error}</div>}
              <button style={loading ? S.btnDisabled : S.btn} onClick={sendOTP} disabled={loading}>{loading ? "Sending OTP..." : "Send OTP →"}</button>
              <div style={{fontSize:11,color:"#b09080",textAlign:"center"}}>OTP sent via SMS and WhatsApp</div>
            </>
          )}

          {step === 1 && tier === 2 && (
            <>
              <div style={S.eyebrow}>Document verification</div>
              <div style={S.title}>Verify with a document</div>
              <p style={S.sub}>Number didn't match. Upload a GST certificate, trade license, or electricity bill showing your venue name.</p>
              <div style={S.venueBadge}>🏡 {venue.name}</div>
              <label style={S.label}>Your name</label>
              <input style={S.input} placeholder="Rajesh Kumar" value={name} onChange={e => setName(e.target.value)} />
              <label style={S.label}>Your phone</label>
              <input style={S.input} placeholder="+91 98xxx xxxxx" value={phone} onChange={e => setPhone(e.target.value)} />
              <label style={S.label}>Upload document</label>
              <div style={S.uploadArea} onClick={() => globalThis.document.getElementById("doc-upload").click()}>
                {uploadedDoc ? <div style={{fontSize:13,color:"#2d6a4f"}}>✓ {uploadedDoc.name}</div> : <><div style={{fontSize:24,marginBottom:6}}>📄</div><div style={{fontSize:13,color:"#7a5a48"}}>Click to upload · JPG, PNG or PDF</div></>}
              </div>
              <input id="doc-upload" type="file" accept="image/*,.pdf" style={{display:"none"}} onChange={e => { const f = e.target.files[0]; if(f){setUploadedDoc(f);setDocType(f.type||"image/jpeg");} }} />
              {error && <div style={S.error}>{error} <span style={{color:"#6b1e2e",cursor:"pointer",textDecoration:"underline"}} onClick={() => setTier(4)}>Submit manual request →</span></div>}
              <button style={loading ? S.btnDisabled : S.btn} onClick={submitDocument} disabled={loading}>{loading ? "Verifying..." : "Verify document →"}</button>
              <button style={S.btnOutline} onClick={() => setTier(4)}>Can't upload a document?</button>
            </>
          )}

          {step === 1 && tier === 4 && (
            <>
              <div style={S.eyebrow}>Manual review</div>
              <div style={S.title}>Submit your details</div>
              <p style={S.sub}>Our team will verify your ownership and reach out within 24 hours.</p>
              <div style={S.venueBadge}>🏡 {venue.name}</div>
              <label style={S.label}>Full name</label>
              <input style={S.input} placeholder="Rajesh Kumar" value={name} onChange={e => setName(e.target.value)} />
              <label style={S.label}>Designation</label>
              <select style={S.select} value={role} onChange={e => setRole(e.target.value)}>
                <option value="owner">Owner</option>
                <option value="manager">Manager</option>
                <option value="marketing">Marketing / Sales</option>
              </select>
              <label style={S.label}>Phone</label>
              <input style={S.input} placeholder="+91 98xxx xxxxx" value={phone} onChange={e => setPhone(e.target.value)} />
              <label style={S.label}>Email</label>
              <input style={S.input} placeholder="you@venue.com" value={email} onChange={e => setEmail(e.target.value)} />
              <label style={S.label}>How did you hear about Wedsy? (optional)</label>
              <input style={S.input} placeholder="Google, Instagram, friend..." value={howHeard} onChange={e => setHowHeard(e.target.value)} />
              <label style={S.label}>Anything else? (optional)</label>
              <textarea style={S.textarea} placeholder="Additional details..." value={manualMessage} onChange={e => setManualMessage(e.target.value)} />
              {error && <div style={S.error}>{error}</div>}
              <button style={loading ? S.btnDisabled : S.btn} onClick={submitManual} disabled={loading}>{loading ? "Submitting..." : "Submit for review →"}</button>
              <div style={{fontSize:11,color:"#b09080",textAlign:"center"}}>Our team will reach out within 24 hours</div>
            </>
          )}

          {step === 2 && (
            <>
              <div style={S.eyebrow}>Verification · Step 2 of 3</div>
              <div style={S.title}>Enter your OTP</div>
              <p style={S.sub}>Sent to <strong style={{fontFamily:"monospace"}}>{claimInfo?.hasPhone ? reconstructPhone() : phone}</strong> via SMS and WhatsApp.</p>
              <input style={S.otpInput} placeholder="••••••" value={otp} onChange={e => setOtp(e.target.value.replace(/\D/g,"").slice(0,6))} maxLength={6} />
              {error && <div style={S.error}>{error}</div>}
              <button style={loading ? S.btnDisabled : S.btn} onClick={verifyOTP} disabled={loading}>{loading ? "Verifying..." : "Verify & Claim listing →"}</button>
              <div style={{fontSize:12,color:"#b09080",textAlign:"center",cursor:"pointer",marginTop:4}} onClick={() => { setStep(1); setOtp(""); setError(""); }}>← Change number</div>
            </>
          )}

          {step === 3 && (
            <>
              <div style={{fontSize:48,textAlign:"center",marginBottom:16}}>🎊</div>
              <div style={S.title}>{tier === 4 ? "Request submitted!" : "Listing claimed!"}</div>
              <p style={S.sub}>{tier === 4 ? "Our team will review and reach out within 24 hours." : "Welcome to Wedsy, " + name + ". Your listing for " + venue.name + " has been claimed."}</p>
              <div style={{...S.infoBox,background:"#e8f4ee",border:"0.5px solid #c0d8c0"}}>{tier === 4 ? "✓ Request received · ⏳ Team review within 24 hrs" : "✓ Claimed · ✓ Phone verified · ⏳ Verification pending"}</div>
              <button style={S.btn} onClick={() => window.location.href = "/venues/" + slug}>View my listing →</button>
            </>
          )}
        </div>
      </div>
    </>
  );
}
