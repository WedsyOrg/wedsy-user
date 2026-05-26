import Head from "next/head";
import Link from "next/link";
import { useEffect, useState } from "react";
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
  // --- Gallery v2: 5-photo grid + lightbox modal + category tabs ---
  gallV2_wrap: { padding: "0 2rem", background: "#fffaf4", borderBottom: "0.5px solid #e8d8c4" },
  gallV2_tabs: { display: "flex", flexWrap: "wrap", gap: 6, padding: "12px 0 10px" },
  gallV2_tab: { fontSize: 11, fontWeight: 500, padding: "5px 12px", borderRadius: 100, border: "0.5px solid #e8d8c4", background: "#fffaf4", color: "#7a5a48", cursor: "pointer", letterSpacing: 0.3 },
  gallV2_tabOn: { fontSize: 11, fontWeight: 500, padding: "5px 12px", borderRadius: 100, border: "0.5px solid #6b1e2e", background: "#6b1e2e", color: "#fdf6ec", cursor: "pointer", letterSpacing: 0.3 },
  gallV2_grid: { display: "grid", gridTemplateColumns: "1.8fr 1fr 1fr", gridTemplateRows: "200px 200px", gap: 4, paddingBottom: 14 },
  gallV2_main: { gridColumn: "1/2", gridRow: "1/3", background: "#f0e2c8", display: "flex", alignItems: "center", justifyContent: "center", position: "relative", overflow: "hidden", cursor: "pointer", borderRadius: 4 },
  gallV2_cell: { background: "#f0e2c8", display: "flex", alignItems: "center", justifyContent: "center", position: "relative", overflow: "hidden", cursor: "pointer", borderRadius: 4 },
  gallV2_cellEmpty: { background: "#f7edda", display: "flex", alignItems: "center", justifyContent: "center", overflow: "hidden", borderRadius: 4, border: "0.5px dashed #e8d8c4" },
  gallV2_img: { width: "100%", height: "100%", objectFit: "cover", display: "block" },
  gallV2_more: { position: "absolute", inset: 0, background: "rgba(44,24,16,0.55)", display: "flex", alignItems: "center", justifyContent: "center", color: "#fdf6ec", fontSize: 14, fontWeight: 500, letterSpacing: 0.3, cursor: "pointer" },
  gallV2_emptyIcon: { fontSize: 32, opacity: 0.18 },
  gallV2_viewAllBtn: { position: "absolute", bottom: 14, right: 14, background: "rgba(253,246,236,0.94)", border: "0.5px solid #e8d8c4", borderRadius: 100, padding: "6px 13px", fontSize: 11, color: "#6b1e2e", cursor: "pointer", fontWeight: 500, display: "flex", alignItems: "center", gap: 6 },
  // Modal
  gallV2_overlay: { position: "fixed", inset: 0, background: "rgba(0,0,0,0.92)", zIndex: 1000, display: "flex", alignItems: "center", justifyContent: "center" },
  gallV2_stage: { position: "relative", width: "100%", height: "100%", display: "flex", alignItems: "center", justifyContent: "center", padding: "60px 70px" },
  gallV2_stageImg: { maxWidth: "100%", maxHeight: "100%", objectFit: "contain", display: "block" },
  gallV2_close: { position: "absolute", top: 18, right: 22, width: 38, height: 38, borderRadius: "50%", background: "rgba(255,255,255,0.1)", border: "0.5px solid rgba(255,255,255,0.25)", color: "#fff", fontSize: 18, cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center", lineHeight: 1 },
  gallV2_counter: { position: "absolute", top: 22, left: "50%", transform: "translateX(-50%)", color: "#fff", fontSize: 13, fontWeight: 500, letterSpacing: 0.5, background: "rgba(0,0,0,0.45)", padding: "6px 14px", borderRadius: 100, border: "0.5px solid rgba(255,255,255,0.18)" },
  gallV2_chev: { position: "absolute", top: "50%", transform: "translateY(-50%)", width: 46, height: 46, borderRadius: "50%", background: "rgba(255,255,255,0.1)", border: "0.5px solid rgba(255,255,255,0.25)", color: "#fff", fontSize: 22, cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center", lineHeight: 1 },
  gallV2_chevLeft: { left: 18 },
  gallV2_chevRight: { right: 18 },
};

const VIBES = ["Traditional", "Contemporary", "Outdoor", "Intimate", "Grand"];

export default function VenueDetailPage({ venue, similar = [], nearby = [], reviews = null, setOpenLoginModalv2, setSource }) {
  const [selectedVibes, setSelectedVibes] = useState(["Traditional", "Outdoor"]);
  const [eventDate, setEventDate] = useState("");
  const [guestCount, setGuestCount] = useState("");
  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [error, setError] = useState("");
  // _app.js short-circuits its own CheckLogin for /venues (public path), so
  // user/userLoggedIn props from the parent are unreliable here — we look the
  // couple up ourselves from the same /auth/ endpoint _app.js uses.
  const [authUser, setAuthUser] = useState(null);
  const [conversationId, setConversationId] = useState(null);
  // Gallery v2 state — modal lightbox + category tab filter
  const [galleryOpen, setGalleryOpen] = useState(false);
  const [galleryIndex, setGalleryIndex] = useState(0);
  const [galleryTab, setGalleryTab] = useState("all");
  // "What couples say" — track which review cards are expanded (read more)
  const [expandedReviews, setExpandedReviews] = useState({});

  // The server's GET /auth/ returns { name, phone, email, event } — no _id.
  // The JWT payload (signed by /auth/otp verify) carries { _id, isAdmin, isVendor },
  // so we decode it client-side to get the couple's user id and merge the
  // /auth/ response in for name/phone/email enrichment.
  const decodeJwtPayload = (token) => {
    try {
      const part = token.split(".")[1];
      if (!part) return null;
      const padded = part.replace(/-/g, "+").replace(/_/g, "/");
      const pad = padded.length % 4 === 0 ? "" : "=".repeat(4 - (padded.length % 4));
      const json = typeof atob === "function"
        ? atob(padded + pad)
        : Buffer.from(padded + pad, "base64").toString("utf-8");
      return JSON.parse(json);
    } catch (e) {
      return null;
    }
  };

  const fetchAuthUser = async () => {
    if (typeof window === "undefined") return null;
    const token = localStorage.getItem("token");
    if (!token) return null;
    const payload = decodeJwtPayload(token);
    if (!payload || !payload._id || payload.isAdmin || payload.isVendor) return null;
    try {
      const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/auth/`, {
        method: "GET",
        headers: { "Content-Type": "application/json", authorization: `Bearer ${token}` },
      });
      if (!res.ok) return null;
      const data = await res.json();
      return { _id: payload._id, ...data };
    } catch (e) {
      return null;
    }
  };

  useEffect(() => {
    fetchAuthUser().then((u) => { if (u) setAuthUser(u); });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // After the LoginModalv2 succeeds, the parent updates the token in
  // localStorage but doesn't notify us directly. Poll briefly while not
  // authed so the form reactively picks up a fresh login.
  useEffect(() => {
    if (authUser) return;
    let cancelled = false;
    const id = setInterval(async () => {
      if (cancelled) return;
      if (typeof window === "undefined") return;
      if (!localStorage.getItem("token")) return;
      const u = await fetchAuthUser();
      if (!cancelled && u) setAuthUser(u);
    }, 1500);
    return () => { cancelled = true; clearInterval(id); };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [authUser]);

  // Anonymous → identified upgrade. If the couple submits anonymously and
  // then signs in, re-POST the enquiry with userId so the backend creates a
  // matching VenueConversation. The UI then flips to "View your conversation →"
  // without any further user action.
  useEffect(() => {
    if (!authUser || !submitted || conversationId) return;
    let cancelled = false;
    (async () => {
      try {
        const body = {
          name,
          phone,
          eventDate,
          guestCount: parseInt(guestCount) || null,
          vibe: selectedVibes,
          userId: authUser._id,
        };
        const res = await fetch(
          `${process.env.NEXT_PUBLIC_API_URL}/venues/${venue.slug}/enquiry`,
          {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(body),
          }
        );
        if (!res.ok) return;
        const data = await res.json();
        if (!cancelled && data && data.conversationId) {
          setConversationId(data.conversationId);
        }
      } catch (e) {
        // silent — couple can retry with a fresh enquiry
      }
    })();
    return () => { cancelled = true; };
    // Deps intentionally limited to authUser/submitted — the form values are
    // captured at submit time and should not refire on subsequent edits.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [authUser, submitted]);

  // Fire-and-forget view tracking. Pings the server once we know which couple
  // is viewing this venue. The server dedups within a 30-min window.
  useEffect(() => {
    if (!authUser || !venue?.slug) return;
    try {
      fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/venues/${venue.slug}/view`,
        {
          method: "POST",
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        }
      ).catch(() => {});
    } catch (e) {
      // swallow — view tracking must never affect the page
    }
  }, [authUser, venue?.slug]);

  const openLogin = () => {
    if (setSource) setSource("venue_enquiry");
    if (setOpenLoginModalv2) setOpenLoginModalv2(true);
  };

  // Gallery v2 modal — keyboard nav + body scroll lock while open.
  // Computes the active photo list inside the effect so this hook stays above
  // the early `if (!venue)` return (hooks can't be conditional).
  useEffect(() => {
    if (!galleryOpen) return undefined;
    const raw = venue?.photos;
    const v2 =
      !!raw &&
      !Array.isArray(raw) &&
      typeof raw === "object" &&
      (Array.isArray(raw.venue) ||
        Array.isArray(raw.decor) ||
        Array.isArray(raw.rooms) ||
        Array.isArray(raw.spaces));
    let list = [];
    if (v2) {
      if (galleryTab === "all") {
        list = ["venue", "decor", "rooms", "spaces"].reduce(
          (acc, k) => (Array.isArray(raw[k]) ? acc.concat(raw[k]) : acc),
          []
        );
      } else if (Array.isArray(raw[galleryTab])) {
        list = raw[galleryTab];
      }
    } else if (Array.isArray(raw)) {
      list = raw;
    }
    const len = list.length;
    if (len === 0) {
      setGalleryOpen(false);
      return undefined;
    }
    const onKey = (e) => {
      if (e.key === "Escape") setGalleryOpen(false);
      else if (e.key === "ArrowRight") setGalleryIndex((i) => (i + 1) % len);
      else if (e.key === "ArrowLeft") setGalleryIndex((i) => (i - 1 + len) % len);
    };
    window.addEventListener("keydown", onKey);
    const prevOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      window.removeEventListener("keydown", onKey);
      document.body.style.overflow = prevOverflow;
    };
  }, [galleryOpen, galleryTab, venue]);

  // Keep galleryIndex within bounds when the active tab changes.
  useEffect(() => {
    setGalleryIndex(0);
  }, [galleryTab]);

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
  // Photo shape detection — supports two backend formats:
  //   V1: venue.photos is a flat string[] (legacy)
  //   V2: venue.photos is { venue, decor, rooms, spaces } each a string[]
  const rawPhotos = venue.photos;
  const isPhotosV2 =
    !!rawPhotos &&
    !Array.isArray(rawPhotos) &&
    typeof rawPhotos === "object" &&
    (Array.isArray(rawPhotos.venue) ||
      Array.isArray(rawPhotos.decor) ||
      Array.isArray(rawPhotos.rooms) ||
      Array.isArray(rawPhotos.spaces));
  const photoCats = isPhotosV2
    ? [
        { key: "venue", label: "Venue", list: Array.isArray(rawPhotos.venue) ? rawPhotos.venue : [] },
        { key: "decor", label: "Decor", list: Array.isArray(rawPhotos.decor) ? rawPhotos.decor : [] },
        { key: "rooms", label: "Rooms", list: Array.isArray(rawPhotos.rooms) ? rawPhotos.rooms : [] },
        { key: "spaces", label: "Spaces", list: Array.isArray(rawPhotos.spaces) ? rawPhotos.spaces : [] },
      ].filter((c) => c.list.length > 0)
    : [];
  const allPhotos = isPhotosV2
    ? photoCats.reduce((acc, c) => acc.concat(c.list), [])
    : Array.isArray(rawPhotos)
    ? rawPhotos
    : [];
  // Photos visible after the active tab filter (drives both grid + modal)
  const activeCat = isPhotosV2 ? photoCats.find((c) => c.key === galleryTab) : null;
  const photos = activeCat ? activeCat.list : allPhotos;
  const showTabs = isPhotosV2 && photoCats.length > 0;
  const totalPhotos = photos.length;
  const gridSlots = [0, 1, 2, 3, 4];
  const remainingBeyondGrid = Math.max(0, totalPhotos - 5);
  const openGalleryAt = (i) => {
    if (totalPhotos === 0) return;
    setGalleryIndex(Math.min(Math.max(i, 0), totalPhotos - 1));
    setGalleryOpen(true);
  };
  const closeGallery = () => setGalleryOpen(false);
  const gallStep = (dir) => {
    if (totalPhotos === 0) return;
    setGalleryIndex((idx) => (idx + dir + totalPhotos) % totalPhotos);
  };
  const capacityText = venue.capacity?.max > 0 ? `${venue.capacity.min || 0}–${venue.capacity.max}` : null;
  const rooms = venue.accommodation?.rooms > 0 ? `${venue.accommodation.rooms} rooms` : null;
  const catText = venue.catering === "in_house_only" ? "In-house only" : venue.catering === "outside_allowed" ? "Outside allowed" : venue.catering === "both" ? "Both" : "Ask venue";

  // --- "What couples say" helpers ---
  // Relative time string from a Unix-seconds timestamp (Google Places format).
  // Coarse buckets only — Google's own reviews UI does the same ("3 weeks ago").
  const formatRelativeTime = (unixSeconds) => {
    if (!unixSeconds) return "";
    const diffSec = Math.max(0, Math.floor(Date.now() / 1000 - unixSeconds));
    const min = 60, hr = 3600, day = 86400, week = 604800, month = 2592000, year = 31536000;
    if (diffSec < min) return "just now";
    if (diffSec < hr) { const n = Math.floor(diffSec / min); return `${n} minute${n === 1 ? "" : "s"} ago`; }
    if (diffSec < day) { const n = Math.floor(diffSec / hr); return `${n} hour${n === 1 ? "" : "s"} ago`; }
    if (diffSec < week) { const n = Math.floor(diffSec / day); return `${n} day${n === 1 ? "" : "s"} ago`; }
    if (diffSec < month) { const n = Math.floor(diffSec / week); return `${n} week${n === 1 ? "" : "s"} ago`; }
    if (diffSec < year) { const n = Math.floor(diffSec / month); return `${n} month${n === 1 ? "" : "s"} ago`; }
    const n = Math.floor(diffSec / year);
    return `${n} year${n === 1 ? "" : "s"} ago`;
  };
  // Initials for the circular avatar — avoids loading profile_photo_url which
  // Google requires to be proxied (auth + size). Keep it simple, no images.
  const initialsFromName = (name) => {
    if (!name) return "?";
    const parts = String(name).trim().split(/\s+/);
    const first = parts[0] ? parts[0][0] : "";
    const last = parts.length > 1 ? parts[parts.length - 1][0] : "";
    return (first + last).toUpperCase() || "?";
  };
  const reviewsList = Array.isArray(reviews?.reviews) ? reviews.reviews : [];
  const REVIEW_PREVIEW_CHARS = 200;

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

        {/* Gallery v2 — up-to-5-photo grid with optional category tabs */}
        <div style={S.gallV2_wrap}>
          {showTabs && (
            <div style={S.gallV2_tabs} role="tablist" aria-label="Photo categories">
              <button
                type="button"
                role="tab"
                aria-selected={galleryTab === "all"}
                style={galleryTab === "all" ? S.gallV2_tabOn : S.gallV2_tab}
                onClick={() => setGalleryTab("all")}
              >
                All ({allPhotos.length})
              </button>
              {photoCats.map((c) => (
                <button
                  key={c.key}
                  type="button"
                  role="tab"
                  aria-selected={galleryTab === c.key}
                  style={galleryTab === c.key ? S.gallV2_tabOn : S.gallV2_tab}
                  onClick={() => setGalleryTab(c.key)}
                >
                  {c.label} ({c.list.length})
                </button>
              ))}
            </div>
          )}
          <div style={S.gallV2_grid}>
            {gridSlots.map((slot) => {
              const photo = photos[slot];
              const isMain = slot === 0;
              const cellStyle = isMain ? S.gallV2_main : S.gallV2_cell;
              const isLastVisible = slot === 4;
              const showMoreOverlay = isLastVisible && remainingBeyondGrid > 0 && photo;
              if (!photo) {
                return (
                  <div key={slot} style={isMain ? { ...S.gallV2_main, cursor: "default" } : S.gallV2_cellEmpty} aria-hidden="true">
                    <span style={S.gallV2_emptyIcon}>{isMain ? "🏡" : "✦"}</span>
                  </div>
                );
              }
              return (
                <div
                  key={slot}
                  style={cellStyle}
                  onClick={() => openGalleryAt(slot)}
                  role="button"
                  tabIndex={0}
                  onKeyDown={(e) => { if (e.key === "Enter" || e.key === " ") { e.preventDefault(); openGalleryAt(slot); } }}
                  aria-label={`Open photo ${slot + 1} of ${totalPhotos}`}
                >
                  <img src={photo} alt={`${venue.name} photo ${slot + 1}`} style={S.gallV2_img} />
                  {isMain && isVerified && <div style={S.verifiedPill}>✓ Wedsy Verified</div>}
                  {isMain && <div style={S.popularPill}>🔥 Active listing</div>}
                  {isMain && totalPhotos > 1 && (
                    <button
                      type="button"
                      style={S.gallV2_viewAllBtn}
                      onClick={(e) => { e.stopPropagation(); openGalleryAt(0); }}
                    >
                      ⊞ View all {totalPhotos} photos
                    </button>
                  )}
                  {showMoreOverlay && (
                    <div
                      style={S.gallV2_more}
                      onClick={(e) => { e.stopPropagation(); openGalleryAt(slot); }}
                    >
                      +{remainingBeyondGrid} more
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </div>

        {/* Gallery v2 — lightbox modal */}
        {galleryOpen && photos[galleryIndex] && (
          <div
            style={S.gallV2_overlay}
            onClick={closeGallery}
            role="dialog"
            aria-modal="true"
            aria-label="Photo gallery"
          >
            <div style={S.gallV2_counter}>{galleryIndex + 1} of {totalPhotos}</div>
            <button
              type="button"
              style={S.gallV2_close}
              aria-label="Close gallery"
              onClick={(e) => { e.stopPropagation(); closeGallery(); }}
            >
              ✕
            </button>
            {totalPhotos > 1 && (
              <button
                type="button"
                style={{ ...S.gallV2_chev, ...S.gallV2_chevLeft }}
                aria-label="Previous photo"
                onClick={(e) => { e.stopPropagation(); gallStep(-1); }}
              >
                ‹
              </button>
            )}
            <div style={S.gallV2_stage} onClick={(e) => e.stopPropagation()}>
              <img
                src={photos[galleryIndex]}
                alt={`${venue.name} photo ${galleryIndex + 1} of ${totalPhotos}`}
                style={S.gallV2_stageImg}
              />
            </div>
            {totalPhotos > 1 && (
              <button
                type="button"
                style={{ ...S.gallV2_chev, ...S.gallV2_chevRight }}
                aria-label="Next photo"
                onClick={(e) => { e.stopPropagation(); gallStep(1); }}
              >
                ›
              </button>
            )}
          </div>
        )}

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

            {/* What couples say — Google Reviews */}
            {reviewsList.length > 0 && (
              <div style={S.sc}>
                <div style={S.scH}>💬 What couples say</div>
                <div style={{ fontSize: 12, color: "#b8852a", marginTop: -6, marginBottom: 14, letterSpacing: 0.3 }}>
                  {reviews?.rating ? <><span style={{ color: "#b8852a" }}>★</span> <strong style={{ color: "#2c1810", fontWeight: 500 }}>{reviews.rating}</strong></> : null}
                  {reviews?.rating && reviews?.total ? <span style={{ color: "#e8d8c4", margin: "0 6px" }}>·</span> : null}
                  {reviews?.total ? <span style={{ color: "#7a5a48" }}>{reviews.total} reviews on Google</span> : null}
                </div>
                <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
                  {reviewsList.slice(0, 5).map((r, i) => {
                    const isExpanded = !!expandedReviews[i];
                    const text = r.text || "";
                    const needsTruncate = text.length > REVIEW_PREVIEW_CHARS;
                    const shownText = !needsTruncate || isExpanded ? text : text.slice(0, REVIEW_PREVIEW_CHARS).trimEnd() + "…";
                    const rating = Math.round(Number(r.rating) || 0);
                    return (
                      <div key={i} style={{ background: "#fdf4e6", border: "0.5px solid #f0e4d0", borderRadius: 12, padding: "14px 16px" }}>
                        <div style={{ display: "flex", alignItems: "center", gap: 11, marginBottom: 10 }}>
                          <div style={{ width: 38, height: 38, borderRadius: "50%", background: "#6b1e2e", color: "#fdf6ec", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 13, fontWeight: 500, letterSpacing: 0.5, flexShrink: 0 }}>
                            {initialsFromName(r.authorName)}
                          </div>
                          <div style={{ flex: 1, minWidth: 0 }}>
                            <div style={{ fontSize: 13, fontWeight: 500, color: "#2c1810", marginBottom: 2 }}>{r.authorName || "Anonymous"}</div>
                            <div style={{ display: "flex", alignItems: "center", gap: 6, fontSize: 11, color: "#b09080" }}>
                              <span style={{ color: "#b8852a", letterSpacing: 1 }}>
                                {"★★★★★".slice(0, rating)}<span style={{ color: "#f0e4d0" }}>{"★★★★★".slice(rating)}</span>
                              </span>
                              <span style={{ color: "#e8d8c4" }}>·</span>
                              <span>{formatRelativeTime(r.time)}</span>
                            </div>
                          </div>
                        </div>
                        <div style={{ fontSize: 13, color: "#7a5a48", lineHeight: 1.7 }}>
                          {shownText}
                          {needsTruncate && (
                            <>
                              {" "}
                              <button
                                type="button"
                                onClick={() => setExpandedReviews((prev) => ({ ...prev, [i]: !prev[i] }))}
                                style={{ background: "none", border: "none", padding: 0, color: "#6b1e2e", cursor: "pointer", fontSize: 12, fontWeight: 500, font: "inherit", textDecoration: "underline" }}
                              >
                                {isExpanded ? "Show less" : "Read more"}
                              </button>
                            </>
                          )}
                        </div>
                      </div>
                    );
                  })}
                </div>
                <div style={{ marginTop: 14, display: "flex", alignItems: "center", justifyContent: "space-between", flexWrap: "wrap", gap: 8 }}>
                  <div style={{ fontSize: 10, letterSpacing: 1, textTransform: "uppercase", color: "#b09080" }}>Reviews powered by Google</div>
                  {venue.googlePlaceId && (
                    <a
                      href={`https://www.google.com/maps/place/?q=place_id:${venue.googlePlaceId}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      style={{ fontSize: 12, color: "#6b1e2e", textDecoration: "none", fontWeight: 500 }}
                    >
                      See all reviews on Google Maps →
                    </a>
                  )}
                </div>
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

            {/* Nearby accommodation */}
            {nearby.length > 0 && (
              <div style={S.sc}>
                <div style={S.scH}>🏨 Nearby accommodation</div>
                <div style={{ fontSize: 12, color: "#b09080", marginBottom: 12 }}>Within 5km</div>
                <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: 10 }}>
                  {nearby.slice(0, 6).map((hotel, i) => {
                    const vicinityShort = hotel.vicinity && hotel.vicinity.length > 60
                      ? hotel.vicinity.slice(0, 60).trimEnd() + "…"
                      : (hotel.vicinity || "");
                    const priceDollars = typeof hotel.priceLevel === "number"
                      ? "$".repeat(Math.max(0, Math.min(4, hotel.priceLevel)))
                      : "";
                    return (
                      <a
                        key={hotel.placeId || i}
                        href={`https://www.google.com/maps/place/?q=place_id:${hotel.placeId}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        style={{
                          border: "0.5px solid #e8d8c4",
                          borderRadius: 10,
                          overflow: "hidden",
                          background: "#fdf4e6",
                          textDecoration: "none",
                          color: "inherit",
                          display: "flex",
                          flexDirection: "column",
                        }}
                      >
                        <div style={{ height: 84, background: "#f0e2c8", display: "flex", alignItems: "center", justifyContent: "center", overflow: "hidden" }}>
                          {hotel.photoReference ? (
                            <img
                              src={`/api/places-photo?ref=${encodeURIComponent(hotel.photoReference)}`}
                              alt={hotel.name || "Hotel"}
                              style={{ width: "100%", height: "100%", objectFit: "cover" }}
                            />
                          ) : (
                            <span style={{ fontSize: 26, opacity: 0.25 }}>🏨</span>
                          )}
                        </div>
                        <div style={{ padding: "9px 11px 11px" }}>
                          <div style={{ fontSize: 12, fontWeight: 500, color: "#2c1810", marginBottom: 3, lineHeight: 1.25 }}>
                            {hotel.name}
                          </div>
                          {vicinityShort && (
                            <div style={{ fontSize: 10, color: "#b09080", marginBottom: 6, lineHeight: 1.4 }}>
                              {vicinityShort}
                            </div>
                          )}
                          <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", gap: 4 }}>
                            {typeof hotel.rating === "number" ? (
                              <span style={{ fontSize: 11, color: "#b8852a", fontWeight: 500 }}>{hotel.rating} ★</span>
                            ) : <span />}
                            {priceDollars && (
                              <span style={{ fontSize: 11, color: "#2d6a4f", fontWeight: 500 }}>{priceDollars}</span>
                            )}
                          </div>
                        </div>
                      </a>
                    );
                  })}
                </div>
                <div style={{ marginTop: 12, fontSize: 10, color: "#b09080", textAlign: "right", letterSpacing: 0.3 }}>
                  Powered by Google
                </div>
              </div>
            )}
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
                {/* Two-state CTA:
                    - Not logged in: muted "Enquire about this venue" → anonymous enquiry (no userId)
                    - Logged in: full-opacity "💬 Start conversation" → enquiry + conversation */}
                <button
    style={{...S.chatBtn, opacity: submitting ? 0.7 : (authUser ? 1 : 0.8)}}
    disabled={submitting}
    onClick={async () => {
      if (!name || !phone) { setError('Please enter your name and phone'); return; }
      setSubmitting(true); setError('');
      try {
        const body = { name, phone, eventDate, guestCount: parseInt(guestCount) || null, vibe: selectedVibes };
        if (authUser && authUser._id) body.userId = authUser._id;
        const res = await fetch(process.env.NEXT_PUBLIC_API_URL + '/venues/' + venue.slug + '/enquiry', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(body)
        });
        const data = await res.json();
        if (res.ok) {
          setSubmitted(true);
          if (data && data.conversationId) setConversationId(data.conversationId);
        } else { setError(data.message || 'Something went wrong'); }
      } catch(e) { setError('Could not send. Please try again.'); }
      setSubmitting(false);
    }}
  >
    {submitting
      ? '⏳ Sending...'
      : submitted
        ? (authUser ? '✓ Conversation started!' : '✓ Enquiry sent!')
        : (authUser ? '💬 Start conversation' : 'Enquire about this venue')}
  </button>
  {error && <div style={{fontSize:11,color:'#c0392b',textAlign:'center',marginTop:4}}>{error}</div>}
  {submitted && authUser && conversationId && (
    <>
      <div style={{fontSize:12,color:'#2d6a4f',textAlign:'center',marginTop:6,lineHeight:1.5}}>✓ Your details have been shared with the venue. They will respond shortly.</div>
      <Link
        href={`/chats/venue/${conversationId}`}
        style={{
          display: 'block', marginTop: 10, padding: '10px 14px',
          background: '#fdf4e6', border: '0.5px solid #6b1e2e', borderRadius: 100,
          color: '#6b1e2e', textDecoration: 'none', textAlign: 'center', fontSize: 13, fontWeight: 500,
        }}
      >
        View your conversation →
      </Link>
    </>
  )}
  {submitted && !authUser && (
    <div style={{fontSize:12,color:'#7a5a48',textAlign:'center',marginTop:8,lineHeight:1.6}}>
      <div style={{color:'#2d6a4f',marginBottom:6}}>✓ Enquiry sent! The venue will respond shortly.</div>
      <button
        type="button"
        onClick={openLogin}
        style={{background:'none',border:'none',padding:0,color:'#6b1e2e',textDecoration:'underline',cursor:'pointer',font:'inherit'}}
      >
        Sign in
      </button>
      {' '}to track this conversation in your inbox.
    </div>
  )}
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
    let nearby = [];
    try {
      const r = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/venues/${slug}/nearby`, { method: "POST" });
      if (r.ok) {
        const j = await r.json();
        nearby = Array.isArray(j.results) ? j.results : [];
      }
    } catch (e) {}
    let reviews = { reviews: [], rating: null, total: 0 };
    try {
      const r = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/venues/${slug}/reviews`, { method: "POST" });
      if (r.ok) reviews = await r.json();
    } catch (e) {}
    return { props: { venue, similar, nearby, reviews } };
  } catch (err) {
    console.error("Venue detail SSR error:", err.message);
    return { notFound: true };
  }
}
