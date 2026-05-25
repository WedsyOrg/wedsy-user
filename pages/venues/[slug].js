import Head from "next/head";
import Link from "next/link";
import { useState } from "react";
import { trimTitle, trimDescription } from "@/utils/seo";

const S = {
  page: { background: "#fdf6ec", minHeight: "100vh", color: "#2c1810" },
  nav: { display: "flex", alignItems: "center", justifyContent: "space-between", padding: "0 2rem", height: 56, background: "#fffaf4", borderBottom: "0.5px solid #e8d8c4", position: "sticky", top: 0, zIndex: 10 },
  logo: { fontSize: 20, fontWeight: 500, letterSpacing: -1, color: "#2c1810", textDecoration: "none" },
  logoSpan: { color: "#6b1e2e" },
  navRight: { display: "flex", alignItems: "center", gap: 8 },
  navPill: { height: 32, border: "0.5px solid #e8d8c4", borderRadius: 100, padding: "0 14px", fontSize: 12, color: "#7a5a48", background: "#fffaf4", cursor: "pointer", display: "flex", alignItems: "center", gap: 5 },
  navPillHot: { height: 32, border: "none", borderRadius: 100, padding: "0 14px", fontSize: 12, color: "#fdf6ec", background: "#6b1e2e", cursor: "pointer", display: "flex", alignItems: "center", gap: 5, fontWeight: 500 },
  bc: { padding: "10px 2rem", fontSize: 12, color: "#b09080", display: "flex", alignItems: "center", gap: 5, background: "#fffaf4", borderBottom: "0.5px solid #e8d8c4" },
  bcLink: { color: "#6b1e2e", textDecoration: "none" },
  gallery: { display: "grid", gridTemplateColumns: "1.8fr 1fr", gridTemplateRows: "220px 180px", gap: 4 },
  gMain: { gridRow: "1/3", background: "#f0e2c8", display: "flex", alignItems: "center", justifyContent: "center", position: "relative", overflow: "hidden" },
  gMainImg: { width: "100%", height: "100%", objectFit: "cover" },
  gSub: { background: "#deeade", display: "flex", alignItems: "center", justifyContent: "center", overflow: "hidden" },
  gSubImg: { width: "100%", height: "100%", objectFit: "cover" },
  verifiedPill: { position: "absolute", top: 14, left: 14, background: "#6b1e2e", color: "#fdf6ec", fontSize: 11, fontWeight: 500, padding: "5px 12px", borderRadius: 100, display: "flex", alignItems: "center", gap: 5 },
  popularPill: { position: "absolute", top: 14, right: 14, background: "#e8c47a", color: "#4a1520", fontSize: 11, fontWeight: 500, padding: "5px 12px", borderRadius: 100 },
  galleryCount: { position: "absolute", bottom: 14, right: 14, background: "rgba(253,246,236,0.92)", border: "0.5px solid #e8d8c4", borderRadius: 100, padding: "5px 12px", fontSize: 11, color: "#7a5a48", cursor: "pointer" },
  insightBar: { background: "#4a1520", padding: "10px 2rem", display: "flex", alignItems: "center", justifyContent: "center", gap: "2rem" },
  ibItem: { display: "flex", alignItems: "center", gap: 6, fontSize: 12, color: "rgba(253,246,236,0.6)" },
  ibStrong: { color: "#e8c47a", fontWeight: 500 },
  ibDivider: { width: 0.5, height: 14, background: "rgba(232,196,122,0.15)" },
  body: { display: "grid", gridTemplateColumns: "1fr 310px", gap: 0, alignItems: "start", maxWidth: 1400, margin: "0 auto" },
  main: { padding: "2rem", borderRight: "0.5px solid #f0e4d0" },
  sidebar: { padding: "1.5rem" },
  vnameBlock: { marginBottom: "1.5rem", paddingBottom: "1.5rem", borderBottom: "0.5px solid #f0e4d0" },
  eyebrow: { display: "flex", alignItems: "center", gap: 8, marginBottom: 10 },
  eyebrowItem: { fontSize: 10, letterSpacing: 2, textTransform: "uppercase", color: "#b8852a" },
  eyebrowDot: { width: 3, height: 3, borderRadius: "50%", background: "#f0e4d0" },
  vname: { fontFamily: "Georgia, 'Times New Roman', serif", fontSize: 36, fontWeight: 400, color: "#2c1810", lineHeight: 1.05, letterSpacing: -0.5, marginBottom: 10 },
  vloc: { display: "flex", alignItems: "center", gap: 6, fontSize: 13, color: "#7a5a48" },
  vlocLink: { color: "#6b1e2e", textDecoration: "none", fontSize: 12, marginLeft: 4 },
  statStrip: { display: "flex", background: "#fdf4e6", border: "0.5px solid #e8d8c4", borderRadius: 14, overflow: "hidden", marginBottom: "1.5rem" },
  ssCell: { flex: 1, padding: "14px 10px", textAlign: "center", borderRight: "0.5px solid #f0e4d0" },
  ssVal: { fontSize: 15, fontWeight: 500, color: "#2c1810", marginBottom: 2 },
  ssValGood: { fontSize: 15, fontWeight: 500, color: "#2d6a4f", marginBottom: 2 },
  ssValBurg: { fontSize: 15, fontWeight: 500, color: "#6b1e2e", marginBottom: 2 },
  ssValGold: { fontSize: 15, fontWeight: 500, color: "#b8852a", marginBottom: 2 },
  ssLbl: { fontSize: 9, textTransform: "uppercase", letterSpacing: 1, color: "#b09080" },
  sc: { background: "#fffaf4", border: "0.5px solid #e8d8c4", borderRadius: 14, padding: "1.5rem", marginBottom: 14 },
  scH: { fontSize: 12, fontWeight: 500, color: "#2c1810", marginBottom: "1rem", textTransform: "uppercase", letterSpacing: 1, display: "flex", alignItems: "center", gap: 7 },
  desc: { fontSize: 14, color: "#7a5a48", lineHeight: 1.85 },
  amGrid: { display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: 7 },
  am: { display: "flex", alignItems: "center", gap: 8, padding: "10px 11px", background: "#fdf4e6", border: "0.5px solid #f0e4d0", borderRadius: 10 },
  amTxt: { fontSize: 12, color: "#7a5a48", flex: 1 },
  amChk: { fontSize: 12, color: "#2d6a4f", marginLeft: "auto" },
  scoreGrid: { display: "grid", gridTemplateColumns: "1fr 1fr", gap: 8 },
  sgItem: { padding: "11px 13px", background: "#fdf4e6", border: "0.5px solid #f0e4d0", borderRadius: 10 },
  sgTop: { display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 6 },
  sgLabel: { fontSize: 11, color: "#7a5a48" },
  sgVal: { fontSize: 13, fontWeight: 500, color: "#2c1810" },
  sgBar: { height: 3, background: "#f0e2c8", borderRadius: 2, overflow: "hidden" },
  sgFill: { height: 3, borderRadius: 2, background: "#6b1e2e" },
  qaList: { display: "flex", flexDirection: "column", gap: 0 },
  qaItem: { borderBottom: "0.5px solid #f0e4d0", padding: "11px 0" },
  qaQ: { fontSize: 12, fontWeight: 500, color: "#2c1810", marginBottom: 4, display: "flex", alignItems: "center", gap: 5 },
  qaA: { fontSize: 12, color: "#7a5a48", lineHeight: 1.65 },
  askList: { display: "flex", flexDirection: "column", gap: 6 },
  askItem: { display: "flex", alignItems: "center", gap: 8, padding: "9px 11px", background: "#fdf4e6", border: "0.5px solid #f0e4d0", borderRadius: 9, cursor: "pointer" },
  askQ: { fontSize: 12, color: "#7a5a48", flex: 1, lineHeight: 1.4 },
  chatBox: { background: "#fffaf4", border: "0.5px solid #e8d8c4", borderRadius: 16, overflow: "hidden", marginBottom: 14 },
  cbHeader: { background: "#6b1e2e", padding: "1.25rem" },
  cbVenueRow: { display: "flex", alignItems: "center", gap: 10, marginBottom: 10 },
  cbAv: { width: 42, height: 42, borderRadius: "50%", background: "#f0e2c8", display: "flex", alignItems: "center", justifyContent: "center", border: "2px solid rgba(253,246,236,0.2)", fontSize: 20 },
  cbVname: { fontSize: 14, fontWeight: 500, color: "#fdf6ec", marginBottom: 2 },
  cbStatus: { fontSize: 11, color: "rgba(253,246,236,0.6)", display: "flex", alignItems: "center", gap: 4 },
  onlineDot: { width: 6, height: 6, borderRadius: "50%", background: "#6fcf97" },
  cbSub: { fontSize: 12, color: "rgba(253,246,236,0.5)", lineHeight: 1.5 },
  cbForm: { padding: "1.25rem" },
  cfRow: { display: "grid", gridTemplateColumns: "1fr 1fr", gap: 8, marginBottom: 8 },
  cfField: { marginBottom: 8 },
  cfLabel: { fontSize: 10, textTransform: "uppercase", letterSpacing: 0.8, color: "#b09080", marginBottom: 4, display: "block" },
  cfInput: { width: "100%", height: 36, border: "0.5px solid #e8d8c4", borderRadius: 8, padding: "0 10px", fontSize: 13, background: "#f7edda", color: "#2c1810", outline: "none", boxSizing: "border-box" },
  vibeChips: { display: "flex", flexWrap: "wrap", gap: 5, marginBottom: 12 },
  vc: { fontSize: 11, border: "0.5px solid #e8d8c4", borderRadius: 100, padding: "4px 10px", color: "#7a5a48", cursor: "pointer", background: "#fffaf4" },
  vcOn: { fontSize: 11, border: "0.5px solid #6b1e2e", borderRadius: 100, padding: "4px 10px", color: "#6b1e2e", cursor: "pointer", background: "#f7edda" },
  chatBtn: { width: "100%", height: 44, background: "#6b1e2e", border: "none", borderRadius: 100, fontSize: 14, fontWeight: 500, color: "#fdf6ec", cursor: "pointer", marginBottom: 10 },
  cbTrust: { display: "flex", justifyContent: "center", gap: 16, paddingTop: 8, borderTop: "0.5px solid #f0e4d0" },
  trustItem: { display: "flex", alignItems: "center", gap: 3, fontSize: 10, color: "#b09080" },
  availBox: { background: "#fffaf4", border: "0.5px solid #e8d8c4", borderRadius: 14, padding: "1.25rem", marginBottom: 14 },
  availH: { fontSize: 12, fontWeight: 500, color: "#2c1810", marginBottom: 12, textTransform: "uppercase", letterSpacing: 1 },
  qaBox: { background: "#fffaf4", border: "0.5px solid #e8d8c4", borderRadius: 14, padding: "1.25rem", marginBottom: 14 },
  qaH: { fontSize: 12, fontWeight: 500, color: "#2c1810", marginBottom: 10, textTransform: "uppercase", letterSpacing: 1 },
  qalist: { display: "flex", flexDirection: "column", gap: 0 },
  qai: { borderBottom: "0.5px solid #f0e4d0", padding: "10px 0" },
  qaiQ: { fontSize: 12, fontWeight: 500, color: "#2c1810", marginBottom: 3 },
  qaiA: { fontSize: 11, color: "#7a5a48", lineHeight: 1.65 },
  simSection: { padding: "0 2rem 2rem" },
  simGrid: { display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: 12 },
  simCard: { border: "0.5px solid #e8d8c4", borderRadius: 12, overflow: "hidden", cursor: "pointer", background: "#fffaf4", textDecoration: "none", display: "block", color: "inherit" },
  simImg: { height: 100, background: "#f0e2c8", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 32 },
  simBody: { padding: "10px 12px" },
  simName: { fontSize: 13, fontWeight: 500, color: "#2c1810", marginBottom: 2 },
  simLoc: { fontSize: 11, color: "#b09080", marginBottom: 8 },
  simFoot: { display: "flex", alignItems: "center", justifyContent: "space-between" },
  simPrice: { fontSize: 12, color: "#7a5a48" },
  simRating: { fontSize: 11, color: "#b09080" },
  wsNote: { padding: "1rem 1.25rem", borderTop: "0.5px solid #e8d8c4", display: "flex", alignItems: "flex-start", gap: 6 },
  wsText: { fontSize: 11, color: "#b09080", lineHeight: 1.6 },
};

const VIBES = ["Traditional", "Contemporary", "Outdoor", "Intimate", "Grand"];

export default function VenueDetailPage({ venue, similar = [] }) {
  const [selectedVibes, setSelectedVibes] = useState(["Traditional", "Outdoor"]);
  const [eventDate, setEventDate] = useState("");
  const [guestCount, setGuestCount] = useState("");
  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [error, setError] = useState("");

  if (!venue) {
    return (
      <div style={{ textAlign: "center", padding: "4rem 2rem" }}>
        <div style={{ fontSize: 32, marginBottom: 12 }}>🏡</div>
        <div style={{ fontSize: 18, fontWeight: 500, marginBottom: 8 }}>Venue not found</div>
        <Link href="/venues" style={{ color: "#6b1e2e" }}>← Back to venues</Link>
      </div>
    );
  }

  const toggleVibe = (v) => setSelectedVibes((prev) => prev.includes(v) ? prev.filter((x) => x !== v) : [...prev, v]);
  const isVerified = venue.status === "verified";
  const vType = venue.venueType === "farmhouse" ? "Farmhouse" : "Resort";
  const photos = venue.photos || [];
  const capacityText = venue.capacity?.max > 0 ? `${venue.capacity.min || 0}–${venue.capacity.max}` : null;
  const rooms = venue.accommodation?.rooms > 0 ? `${venue.accommodation.rooms} rooms` : null;
  const catText = venue.catering === "in_house_only" ? "In-house only" : venue.catering === "outside_allowed" ? "Outside allowed" : venue.catering === "both" ? "Both" : "Ask venue";

  const jsonLd = {
    "@context": "https://schema.org",
    "@type": ["LocalBusiness", "EventVenue"],
    name: venue.name,
    description: venue.description || `${venue.name} — wedding venue in Bangalore`,
    address: { "@type": "PostalAddress", streetAddress: venue.address, addressLocality: "Bangalore", addressCountry: "IN" },
    telephone: venue.phone || "",
    url: `https://wedsy.in/venues/${venue.slug}`,
    image: venue.coverPhoto || "",
    aggregateRating: venue.googleRating ? { "@type": "AggregateRating", ratingValue: venue.googleRating, reviewCount: venue.googleReviewCount || 0 } : undefined,
  };

  return (
    <>
      <Head>
        <title>{trimTitle(`${venue.name} — Wedding Venue in Bangalore | Wedsy`)}</title>
        <meta name="description" content={trimDescription(venue.description || `${venue.name} is a premium wedding venue in Bangalore. Browse photos, pricing, availability and chat directly with the venue on Wedsy.`)} />
        <meta property="og:title" content={`${venue.name} | Wedsy`} />
        <meta property="og:description" content={venue.description?.slice(0, 160) || ""} />
        <meta property="og:image" content={venue.coverPhoto || ""} />
        <meta property="og:type" content="website" />
        <link rel="canonical" href={`https://wedsy.in/venues/${venue.slug}`} />
        <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />
      </Head>

      <main style={S.page}>
        {/* Breadcrumb */}
        <div style={S.bc}>
          <Link href="/" style={S.bcLink}>Home</Link> › 
          <Link href="/venues" style={S.bcLink}>Venues</Link> › 
          <span>{venue.name}</span>
        </div>

        {/* Gallery */}
        <div style={S.gallery}>
          <div style={S.gMain}>
            {photos[0] ? <img src={photos[0]} alt={venue.name} style={S.gMainImg} /> : <span style={{ fontSize: 80, opacity: 0.15 }}>🏡</span>}
            {isVerified && <div style={S.verifiedPill}>✓ Wedsy Verified</div>}
            <div style={S.popularPill}>🔥 Active listing</div>
            <div style={S.galleryCount}>⊞ View all {photos.length} photos</div>
          </div>
          <div style={S.gSub}>
            {photos[1] ? <img src={photos[1]} alt={venue.name} style={S.gSubImg} /> : <span style={{ fontSize: 40, opacity: 0.2 }}>🌿</span>}
          </div>
          <div style={{ ...S.gSub, background: "#e8e0f0" }}>
            {photos[2] ? <img src={photos[2]} alt={venue.name} style={S.gSubImg} /> : <span style={{ fontSize: 40, opacity: 0.2 }}>✨</span>}
          </div>
        </div>

        {/* Insight bar */}
        <div style={S.insightBar}>
          <div style={S.ibItem}>👁 <strong style={S.ibStrong}>Active</strong> listing</div>
          <div style={S.ibDivider} />
          <div style={S.ibItem}>⏱ Avg response: <strong style={S.ibStrong}>2 hours</strong></div>
          <div style={S.ibDivider} />
          {venue.googleRating && <><div style={S.ibItem}>⭐ <strong style={S.ibStrong}>{venue.googleRating}</strong> on Google</div><div style={S.ibDivider} /></>}
          <div style={S.ibItem}>💬 <strong style={S.ibStrong}>Chat directly</strong> with venue</div>
        </div>

        <div style={S.body}>
          {/* Main */}
          <div style={S.main}>
            {/* Venue header */}
            <div style={S.vnameBlock}>
              <div style={S.eyebrow}>
                <span style={S.eyebrowItem}>🌿 {vType}</span>
                <span style={S.eyebrowDot} />
                <span style={S.eyebrowItem}>Bangalore</span>
                {venue.googleReviewCount > 0 && <><span style={S.eyebrowDot} /><span style={S.eyebrowItem}>{venue.googleReviewCount} reviews</span></>}
              </div>
              <div style={S.vname}>{venue.name}</div>
              <div style={S.vloc}>
                📍 {venue.address || "Bangalore"}
                <a href={`https://maps.google.com/?q=${encodeURIComponent(venue.name + " " + venue.address)}`} target="_blank" rel="noopener noreferrer" style={S.vlocLink}>View on map →</a>
              </div>
            </div>

            {/* Stats strip */}
            <div style={S.statStrip}>
              {venue.googleRating && <div style={{ ...S.ssCell }}><div style={S.ssValGold}>{venue.googleRating} ★</div><div style={S.ssLbl}>{venue.googleReviewCount} reviews</div></div>}
              {capacityText && <div style={S.ssCell}><div style={S.ssVal}>{capacityText}</div><div style={S.ssLbl}>Guests</div></div>}
              {rooms && <div style={S.ssCell}><div style={S.ssVal}>{rooms}</div><div style={S.ssLbl}>Accommodation</div></div>}
              <div style={S.ssCell}><div style={S.ssVal}>{catText}</div><div style={S.ssLbl}>Catering</div></div>
              <div style={{ ...S.ssCell, borderRight: "none" }}><div style={S.ssValGood}>2 hrs</div><div style={S.ssLbl}>Response</div></div>
            </div>

            {/* About */}
            {venue.description && (
              <div style={S.sc}>
                <div style={S.scH}>✨ About this venue</div>
                <p style={S.desc}>{venue.description}</p>
              </div>
            )}

            {/* Amenities */}
            {venue.amenities?.length > 0 && (
              <div style={S.sc}>
                <div style={S.scH}>✓ Amenities</div>
                <div style={S.amGrid}>
                  {venue.amenities.map((a) => (
                    <div key={a} style={S.am}>
                      <span style={{ fontSize: 15, color: "#6b1e2e" }}>◆</span>
                      <span style={S.amTxt}>{a.replace(/_/g, " ").replace(/\b\w/g, (l) => l.toUpperCase())}</span>
                      <span style={S.amChk}>✓</span>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Wedsy Score Card */}
            <div style={S.sc}>
              <div style={S.scH}>🛡 Wedsy score card</div>
              <div style={S.scoreGrid}>
                {[
                  { label: "Responsiveness", val: 4.6, pct: 92 },
                  { label: "Hospitality", val: 4.8, pct: 96 },
                  { label: "Value for money", val: 4.0, pct: 80 },
                  { label: "Flexibility", val: 3.8, pct: 76 },
                  { label: "Food quality", val: 4.4, pct: 88 },
                  { label: "Photo readiness", val: 5.0, pct: 100 },
                ].map((s) => (
                  <div key={s.label} style={S.sgItem}>
                    <div style={S.sgTop}>
                      <span style={S.sgLabel}>{s.label}</span>
                      <span style={S.sgVal}>{s.val}</span>
                    </div>
                    <div style={S.sgBar}><div style={{ ...S.sgFill, width: `${s.pct}%` }} /></div>
                  </div>
                ))}
              </div>
            </div>

            {/* FAQ */}
            <div style={S.sc}>
              <div style={S.scH}>❓ Everything couples want to know</div>
              <div style={S.qaList}>
                {[
                  { q: "🍽 Catering policy", a: venue.catering === "outside_allowed" ? "Outside caterers fully welcome. No mandatory tie-up with any caterer." : venue.catering === "in_house_only" ? "In-house catering only. Please discuss menu options with the venue." : "Speak to the venue about their catering policy." },
                  { q: "🎨 Decorator policy", a: "Outside decorators permitted. Discuss setup timing with the venue manager." },
                  { q: "🔊 Sound curfew", a: "Please confirm with the venue — curfew times vary by location in Bangalore." },
                  { q: "🧾 Advance to confirm booking", a: "Typically 30% advance to block your date. Confirm exact terms with the venue." },
                  { q: "🌙 Can guests stay overnight", a: rooms ? `Yes — ${rooms} available on-site. Additional guests can stay at nearby hotels.` : "Contact the venue for accommodation options for your guests." },
                ].map((item, i) => (
                  <div key={i} style={{ ...S.qaItem, borderBottom: i < 4 ? "0.5px solid #f0e4d0" : "none", paddingBottom: i < 4 ? 11 : 0 }}>
                    <div style={S.qaQ}>{item.q}</div>
                    <div style={S.qaA}>{item.a}</div>
                  </div>
                ))}
              </div>
            </div>

            {/* Ask directly */}
            <div style={{ ...S.sc, background: "#fdf4e6" }}>
              <div style={S.scH}>💬 Ask the venue directly</div>
              <div style={{ fontSize: 12, color: "#b09080", marginBottom: 12 }}>Tap any question to send it when you start the chat</div>
              <div style={S.askList}>
                {[
                  "Is your date available for a 350-guest wedding?",
                  "Can we do a site visit this weekend?",
                  "What is the all-in cost for a 2-day wedding?",
                  "Do you have a coordinator on event day?",
                  "Are there any hidden charges we should know about?",
                ].map((q, i) => (
                  <div key={i} style={S.askItem}>
                    <span style={S.askQ}>{q}</span>
                    <span style={{ fontSize: 12, color: "#6b1e2e" }}>→</span>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Sidebar */}
          <div style={S.sidebar}>
            {/* Chat card */}
            <div style={S.chatBox}>
              <div style={S.cbHeader}>
                <div style={S.cbVenueRow}>
                  <div style={S.cbAv}>🏡</div>
                  <div>
                    <div style={S.cbVname}>{venue.name}</div>
                    <div style={S.cbStatus}><div style={S.onlineDot} /> Usually responds in 2 hrs</div>
                  </div>
                </div>
                <div style={S.cbSub}>Share your details and start a real conversation — no forms into a void.</div>
              </div>
              <div style={S.cbForm}>
                <div style={S.cfRow}>
                  <div style={S.cfField}>
                    <label style={S.cfLabel}>Wedding date</label>
                    <input style={S.cfInput} type="date" value={eventDate} onChange={(e) => setEventDate(e.target.value)} />
                  </div>
                  <div style={S.cfField}>
                    <label style={S.cfLabel}>Guest count</label>
                    <input style={S.cfInput} placeholder="350" value={guestCount} onChange={(e) => setGuestCount(e.target.value)} />
                  </div>
                </div>
                <div style={S.cfRow}>
                  <div style={S.cfField}>
                    <label style={S.cfLabel}>Your name</label>
                    <input style={S.cfInput} placeholder="Priya" value={name} onChange={(e) => setName(e.target.value)} />
                  </div>
                  <div style={S.cfField}>
                    <label style={S.cfLabel}>Phone</label>
                    <input style={S.cfInput} placeholder="+91 98xxx" value={phone} onChange={(e) => setPhone(e.target.value)} />
                  </div>
                </div>
                <div style={S.cfField}>
                  <label style={S.cfLabel}>Your wedding vibe</label>
                  <div style={S.vibeChips}>
                    {VIBES.map((v) => (
                      <span key={v} style={selectedVibes.includes(v) ? S.vcOn : S.vc} onClick={() => toggleVibe(v)}>{v}</span>
                    ))}
                  </div>
                </div>
                <button
    style={{...S.chatBtn, opacity: submitting ? 0.7 : 1}}
    disabled={submitting}
    onClick={async () => {
      if (!name || !phone) { setError('Please enter your name and phone'); return; }
      setSubmitting(true); setError('');
      try {
        const res = await fetch(process.env.NEXT_PUBLIC_API_URL + '/venues/' + venue.slug + '/enquiry', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ name, phone, eventDate, guestCount: parseInt(guestCount) || null, vibe: selectedVibes })
        });
        const data = await res.json();
        if (res.ok) { setSubmitted(true); } else { setError(data.message || 'Something went wrong'); }
      } catch(e) { setError('Could not send. Please try again.'); }
      setSubmitting(false);
    }}
  >
    {submitting ? '⏳ Sending...' : submitted ? '✓ Conversation started!' : '💬 Start conversation'}
  </button>
  {error && <div style={{fontSize:11,color:'#c0392b',textAlign:'center',marginTop:4}}>{error}</div>}
  {submitted && <div style={{fontSize:12,color:'#2d6a4f',textAlign:'center',marginTop:6,lineHeight:1.5}}>✓ Your details have been shared with the venue. They will respond shortly.</div>}
                <div style={S.cbTrust}>
                  <div style={S.trustItem}>🔒 Private</div>
                  <div style={S.trustItem}>✓ Free</div>
                  <div style={S.trustItem}>🛡 Wedsy secured</div>
                </div>
              </div>
            </div>

            {/* Quick answers */}
            <div style={S.qaBox}>
              <div style={S.qaH}>⚡ Quick answers</div>
              <div style={S.qalist}>
                {[
                  { q: "Outside caterer?", a: catText === "Outside allowed" ? "Allowed ✓" : catText },
                  { q: "Sound curfew?", a: "Confirm with venue" },
                  { q: "Advance to book?", a: "~30% to confirm date" },
                  { q: "Outside decorator?", a: "Typically permitted" },
                ].map((item, i) => (
                  <div key={i} style={{ ...S.qai, borderBottom: i < 3 ? "0.5px solid #f0e4d0" : "none", paddingBottom: i < 3 ? 10 : 0 }}>
                    <div style={S.qaiQ}>{item.q}</div>
                    <div style={S.qaiA}>{item.a}</div>
                  </div>
                ))}
              </div>
            </div>

            {/* AI Concierge */}
            <div style={{ background: "#fdf4e6", border: "0.5px solid #f0e4d0", borderRadius: 12, padding: "1rem", marginBottom: 14 }}>
              <div style={{ display: "flex", alignItems: "flex-start", gap: 8 }}>
                <div style={{ width: 32, height: 32, background: "#6b1e2e", borderRadius: 8, display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0, fontSize: 15 }}>✨</div>
                <div>
                  <div style={{ fontSize: 12, fontWeight: 500, color: "#2c1810", marginBottom: 3 }}>Not sure if this is the right venue?</div>
                  <div style={{ fontSize: 11, color: "#7a5a48", lineHeight: 1.6 }}>Tell Wedsy Concierge your exact vision and it will compare this venue against all others.</div>
                </div>
              </div>
              <button style={{ marginTop: 10, width: "100%", border: "0.5px solid #6b1e2e", borderRadius: 100, padding: 8, fontSize: 12, color: "#6b1e2e", background: "transparent", cursor: "pointer" }}>Ask Wedsy Concierge</button>
            </div>

            {/* Wedsy secured note */}
            <div style={{textAlign:'center',marginBottom:14}}>
    <a href={'/venue-claim/' + venue.slug} style={{fontSize:12,color:'#b09080',textDecoration:'none',borderBottom:'0.5px solid #e8d8c4',paddingBottom:2}}>
      Is this your venue? Claim it →
    </a>
  </div>
  <div style={S.wsNote}>
              <span style={{ fontSize: 13, color: "#6b1e2e", flexShrink: 0 }}>🛡</span>
              <div style={S.wsText}><strong style={{ color: "#7a5a48" }}>Conversation secured by Wedsy.</strong> If this venue doesn't respond within 24 hours, our team steps in to help.</div>
            </div>
          </div>
        </div>

        {/* Similar venues */}
        {similar.length > 0 && (
          <div style={S.simSection}>
            <div style={{ display: "flex", alignItems: "baseline", justifyContent: "space-between", marginBottom: "1rem" }}>
              <span style={{ fontSize: 10, letterSpacing: 2.5, textTransform: "uppercase", color: "#b8852a" }}>Similar venues nearby</span>
              <Link href="/venues" style={{ fontSize: 12, color: "#6b1e2e", textDecoration: "none" }}>View all →</Link>
            </div>
            <div style={S.simGrid}>
              {similar.map((v) => (
                <Link key={v._id} href={`/venues/${v.slug}`} style={S.simCard}>
                  <div style={{ ...S.simImg, background: v.venueType === "farmhouse" ? "#deeade" : v.venueType === "resort" ? "#f0e2c8" : "#e8e0f0" }}>
                    {v.coverPhoto ? <img src={v.coverPhoto} alt={v.name} style={{ width: "100%", height: "100%", objectFit: "cover" }} /> : <span>🏡</span>}
                  </div>
                  <div style={S.simBody}>
                    <div style={S.simName}>{v.name}</div>
                    <div style={S.simLoc}>{v.address?.split(",")[0] || "Bangalore"} · {v.venueType}</div>
                    <div style={S.simFoot}>
                      <div style={S.simPrice}>{v.pricing?.note || "Price on request"}</div>
                      {v.googleRating && <div style={S.simRating}>★ {v.googleRating}</div>}
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          </div>
        )}
      </main>
    </>
  );
}

export async function getServerSideProps({ params }) {
  try {
    const { slug } = params;
    const [venueRes, allRes] = await Promise.all([
      fetch(`${process.env.NEXT_PUBLIC_API_URL}/venues/${slug}`),
      fetch(`${process.env.NEXT_PUBLIC_API_URL}/venues?status=published&limit=4`),
    ]);
    if (!venueRes.ok) return { notFound: true };
    const { venue } = await venueRes.json();
    const { venues: allVenues = [] } = await allRes.json();
    const similar = allVenues.filter((v) => v.slug !== slug).slice(0, 3);
    return { props: { venue, similar } };
  } catch (err) {
    console.error("Venue detail SSR error:", err.message);
    return { notFound: true };
  }
}
