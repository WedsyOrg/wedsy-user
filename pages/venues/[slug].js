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
  gallV2_tab: { fontSize: 11, fontWeight: 500, padding: "5px 10px 5px 12px", borderRadius: 100, border: "0.5px solid rgba(255,255,255,0.3)", background: "rgba(0,0,0,0.35)", color: "#fdf6ec", cursor: "pointer", letterSpacing: 0.3, display: "inline-flex", alignItems: "center", gap: 6 },
  gallV2_tabOn: { fontSize: 11, fontWeight: 500, padding: "5px 10px 5px 12px", borderRadius: 100, border: "0.5px solid #b8852a", background: "#6b1e2e", color: "#fdf6ec", cursor: "pointer", letterSpacing: 0.3, display: "inline-flex", alignItems: "center", gap: 6 },
  gallV2_tabBadge: { fontSize: 9, fontWeight: 600, color: "#fdf6ec", background: "rgba(255,255,255,0.18)", borderRadius: 100, padding: "1px 6px", minWidth: 18, textAlign: "center", letterSpacing: 0.2 },
  gallV2_tabBadgeOn: { fontSize: 9, fontWeight: 600, color: "#6b1e2e", background: "#b8852a", borderRadius: 100, padding: "1px 6px", minWidth: 18, textAlign: "center", letterSpacing: 0.2 },
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
  gallV2_close: { position: "absolute", top: 18, right: 22, width: 38, height: 38, borderRadius: "50%", background: "rgba(255,255,255,0.1)", border: "0.5px solid rgba(255,255,255,0.25)", color: "#fff", fontSize: 18, cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center", lineHeight: 1, zIndex: 9999 },
  gallV2_counter: { position: "absolute", top: 22, left: "50%", transform: "translateX(-50%)", color: "#fff", fontSize: 13, fontWeight: 500, letterSpacing: 0.5, background: "rgba(0,0,0,0.45)", padding: "6px 14px", borderRadius: 100, border: "0.5px solid rgba(255,255,255,0.18)", zIndex: 9998 },
  gallV2_chev: { position: "absolute", top: "50%", transform: "translateY(-50%)", width: 46, height: 46, borderRadius: "50%", background: "rgba(255,255,255,0.1)", border: "0.5px solid rgba(255,255,255,0.25)", color: "#fff", fontSize: 22, cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center", lineHeight: 1, zIndex: 9998 },
  gallV2_chevLeft: { left: 18 },
  gallV2_chevRight: { right: 18 },
  // Back-to-grid button shown inside the lightbox when stacked on the grid.
  gallV2_back: { position: "absolute", bottom: 22, left: 22, display: "inline-flex", alignItems: "center", gap: 7, padding: "8px 14px", borderRadius: 100, background: "rgba(255,255,255,0.1)", border: "0.5px solid rgba(255,255,255,0.25)", color: "#fff", fontSize: 12, fontWeight: 500, cursor: "pointer", zIndex: 9998 },
  // Thumbnail grid modal (entry point — opens before the lightbox)
  tgrid_overlay: { position: "fixed", inset: 0, background: "rgba(0,0,0,0.9)", zIndex: 1000, display: "flex", flexDirection: "column" },
  tgrid_topbar: { display: "flex", alignItems: "center", gap: 14, padding: "16px 22px", borderBottom: "0.5px solid rgba(255,255,255,0.08)", flexShrink: 0 },
  tgrid_topbarLeft: { display: "flex", flexWrap: "wrap", gap: 6, alignItems: "center", flex: 1, minWidth: 0 },
  tgrid_count: { color: "#fff", fontSize: 13, fontWeight: 500, letterSpacing: 0.5, background: "rgba(0,0,0,0.45)", padding: "6px 14px", borderRadius: 100, border: "0.5px solid rgba(255,255,255,0.18)", flexShrink: 0 },
  tgrid_close: { width: 38, height: 38, borderRadius: "50%", background: "rgba(255,255,255,0.1)", border: "0.5px solid rgba(255,255,255,0.25)", color: "#fff", fontSize: 18, cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center", lineHeight: 1, flexShrink: 0 },
  tgrid_body: { flex: 1, overflowY: "auto", padding: "22px", scrollBehavior: "smooth" },
  tgrid_inner: { display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(260px, 1fr))", gap: 12, maxWidth: 1400, margin: "0 auto" },
  tgrid_thumb: { height: 180, borderRadius: 8, overflow: "hidden", cursor: "pointer", background: "#2c1810", border: "2px solid transparent", padding: 0, transition: "transform 0.18s ease, border-color 0.18s ease" },
  tgrid_img: { width: "100%", height: "100%", objectFit: "cover", display: "block" },
  // --- v3 redesign: hero, sticky bar, sections, etc. ---
  hero: { position: "relative", width: "100%", minHeight: "65vh", display: "flex", alignItems: "flex-end", background: "#2c1810", overflow: "hidden" },
  heroImg: { position: "absolute", inset: 0, width: "100%", height: "100%", objectFit: "cover", display: "block" },
  heroOverlay: { position: "absolute", inset: 0, background: "linear-gradient(180deg, rgba(0,0,0,0.05) 0%, rgba(0,0,0,0.15) 40%, rgba(0,0,0,0.6) 100%)" },
  heroFade: { position: "absolute", left: 0, right: 0, bottom: 0, height: 80, background: "linear-gradient(180deg, rgba(253,246,236,0) 0%, #fdf6ec 100%)", pointerEvents: "none" },
  heroInner: { position: "relative", width: "100%", maxWidth: 1400, margin: "0 auto", padding: "4rem 2rem 3rem", color: "#fdf6ec", zIndex: 2 },
  heroEyebrow: { display: "flex", flexWrap: "wrap", gap: 8, marginBottom: 14 },
  heroChip: { display: "inline-flex", alignItems: "center", gap: 5, padding: "5px 12px", borderRadius: 100, background: "rgba(253,246,236,0.16)", border: "0.5px solid rgba(253,246,236,0.28)", fontSize: 11, color: "#fdf6ec", backdropFilter: "blur(6px)", WebkitBackdropFilter: "blur(6px)" },
  heroName: { fontFamily: "Georgia, 'Times New Roman', serif", fontSize: 56, fontWeight: 400, lineHeight: 1.02, letterSpacing: -1, color: "#fdf6ec", textShadow: "0 2px 24px rgba(0,0,0,0.35)", marginBottom: 14 },
  heroSub: { fontSize: 14, color: "rgba(253,246,236,0.9)", display: "flex", alignItems: "center", gap: 8, marginBottom: 6 },
  heroVerified: { position: "absolute", top: 22, left: 22, display: "inline-flex", alignItems: "center", gap: 6, padding: "6px 14px", borderRadius: 100, background: "rgba(107,30,46,0.92)", color: "#fdf6ec", fontSize: 11, fontWeight: 500, letterSpacing: 0.3, zIndex: 3, boxShadow: "0 2px 16px rgba(107,30,46,0.35)" },
  heroViewAll: { position: "absolute", top: 22, right: 22, display: "inline-flex", alignItems: "center", gap: 6, padding: "8px 16px", borderRadius: 100, background: "rgba(253,246,236,0.92)", color: "#6b1e2e", fontSize: 12, fontWeight: 500, border: "0.5px solid rgba(253,246,236,0.5)", cursor: "pointer", zIndex: 3, backdropFilter: "blur(6px)", WebkitBackdropFilter: "blur(6px)" },
  // sticky quick-facts bar
  stickyBar: { position: "sticky", top: 0, zIndex: 9, background: "#6b1e2e", borderBottom: "0.5px solid rgba(232,196,122,0.18)" },
  stickyBarInner: { maxWidth: 1400, margin: "0 auto", padding: "10px 2rem", display: "flex", alignItems: "center", gap: 18, overflowX: "auto", whiteSpace: "nowrap", scrollbarWidth: "none" },
  stickyChip: { display: "inline-flex", alignItems: "center", gap: 6, fontSize: 12, color: "rgba(253,246,236,0.85)", flexShrink: 0 },
  stickyChipNum: { color: "#e8c47a", fontWeight: 500 },
  stickyDivider: { width: 0.5, height: 14, background: "rgba(232,196,122,0.22)", flexShrink: 0 },
  // section title (Georgia + gold underline)
  sTitleWrap: { marginBottom: 18 },
  sTitle: { fontFamily: "Georgia, 'Times New Roman', serif", fontSize: 26, fontWeight: 400, color: "#2c1810", letterSpacing: -0.4, lineHeight: 1.2, marginBottom: 8 },
  sTitleSub: { fontSize: 13, color: "#7a5a48", marginTop: 6, lineHeight: 1.5 },
  sTitleRule: { width: 40, height: 2, background: "#b8852a", borderRadius: 2 },
  // body grid v3 (320 sidebar)
  bodyV3: { display: "grid", gridTemplateColumns: "1fr 320px", gap: "2.5rem", alignItems: "start", maxWidth: 1400, margin: "0 auto", padding: "2.5rem 2rem 0" },
  mainV3: { minWidth: 0 },
  sidebarV3: { position: "sticky", top: 80, display: "flex", flexDirection: "column", gap: 14 },
  // Full-width section wrappers — used by Reviews / Nearby / Similar / FAQ
  // that sit OUTSIDE the two-column grid so their background spans edge-to-edge.
  fwBand: { width: "100%", padding: "3rem 2rem", marginTop: "2rem" },
  fwBandWhite: { background: "#fffaf4" },
  fwBandIvory: { background: "#fdf6ec" },
  fwBandInner: { maxWidth: 1400, margin: "0 auto" },
  section: { marginBottom: "3rem" },
  // about + highlights split
  abSplit: { display: "grid", gridTemplateColumns: "1.4fr 1fr", gap: 28, alignItems: "start" },
  dropCap: { float: "left", fontFamily: "Georgia, 'Times New Roman', serif", fontSize: 56, lineHeight: 0.9, color: "#b8852a", paddingRight: 10, paddingTop: 4, fontWeight: 400 },
  aboutText: { fontSize: 15, color: "#3a2820", lineHeight: 1.85, fontFamily: "Georgia, 'Times New Roman', serif" },
  highlightsCard: { background: "#fdf4e6", borderLeft: "3px solid #b8852a", borderRadius: 8, padding: "1.25rem 1.25rem 1.25rem 1.1rem", boxShadow: "0 2px 16px rgba(107,30,46,0.06)" },
  highlightsTitle: { fontFamily: "Georgia, 'Times New Roman', serif", fontSize: 16, fontWeight: 400, color: "#2c1810", marginBottom: 12, letterSpacing: -0.2 },
  highlightItem: { display: "flex", alignItems: "flex-start", gap: 9, padding: "6px 0", fontSize: 13, color: "#3a2820", lineHeight: 1.45 },
  highlightIcon: { fontSize: 14, lineHeight: 1.2, flexShrink: 0, marginTop: 1 },
  // event spaces horizontal scroller
  spacesScroller: { display: "flex", gap: 14, overflowX: "auto", paddingBottom: 8, scrollbarWidth: "thin", marginLeft: -4, marginRight: -4, paddingLeft: 4, paddingRight: 4 },
  spaceCard: { flex: "0 0 300px", background: "#ffffff", border: "0.5px solid #e8d8c4", borderRadius: 14, padding: "1.1rem 1.15rem", boxShadow: "0 2px 16px rgba(107,30,46,0.06)", display: "flex", flexDirection: "column", gap: 10 },
  spaceTopRow: { display: "flex", alignItems: "center", justifyContent: "space-between", gap: 8 },
  spaceName: { fontFamily: "Georgia, 'Times New Roman', serif", fontSize: 18, color: "#2c1810", fontWeight: 400, letterSpacing: -0.2 },
  spaceTypeBadge: { display: "inline-flex", alignItems: "center", gap: 4, padding: "3px 9px", borderRadius: 100, background: "#fdf4e6", border: "0.5px solid #e8d8c4", fontSize: 10, color: "#7a5a48", fontWeight: 500, textTransform: "uppercase", letterSpacing: 0.5, flexShrink: 0 },
  spaceStatRow: { display: "grid", gridTemplateColumns: "1fr 1fr", gap: 8 },
  spaceStat: { background: "#fdf4e6", border: "0.5px solid #f0e4d0", borderRadius: 10, padding: "8px 10px", textAlign: "center" },
  spaceStatVal: { fontSize: 16, fontWeight: 500, color: "#2c1810", fontFamily: "Georgia, serif" },
  spaceStatLbl: { fontSize: 9, textTransform: "uppercase", letterSpacing: 0.8, color: "#b09080", marginTop: 2 },
  spaceTagRow: { display: "flex", flexWrap: "wrap", gap: 5 },
  spaceTag: { fontSize: 10, padding: "3px 9px", borderRadius: 100, fontWeight: 500, letterSpacing: 0.3 },
  spaceDesc: { fontSize: 12, color: "#7a5a48", lineHeight: 1.55 },
  // accommodation
  roomGrid: { display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(220px, 1fr))", gap: 14 },
  roomCard: { background: "#ffffff", border: "0.5px solid #e8d8c4", borderRadius: 14, padding: "1.1rem 1.15rem", boxShadow: "0 2px 16px rgba(107,30,46,0.06)" },
  roomNameRow: { display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 8 },
  roomName: { fontFamily: "Georgia, 'Times New Roman', serif", fontSize: 16, color: "#2c1810", fontWeight: 400 },
  roomCountBadge: { fontSize: 10, fontWeight: 500, padding: "3px 9px", borderRadius: 100, background: "#6b1e2e", color: "#fdf6ec", letterSpacing: 0.3 },
  roomMeta: { fontSize: 12, color: "#7a5a48", marginBottom: 4 },
  roomPrice: { fontFamily: "Georgia, serif", fontSize: 18, color: "#b8852a", fontWeight: 500, marginTop: 6 },
  roomPriceLbl: { fontSize: 10, color: "#b09080", textTransform: "uppercase", letterSpacing: 0.5, marginLeft: 4 },
  totalCapNote: { marginTop: 14, padding: "10px 14px", background: "#fdf4e6", borderRadius: 10, border: "0.5px solid #e8d8c4", fontSize: 12, color: "#7a5a48" },
  simpleAccomCard: { background: "#ffffff", border: "0.5px solid #e8d8c4", borderRadius: 14, padding: "1.4rem 1.5rem", boxShadow: "0 2px 16px rgba(107,30,46,0.06)", display: "flex", alignItems: "center", gap: 18 },
  simpleAccomNum: { fontFamily: "Georgia, serif", fontSize: 40, color: "#b8852a", fontWeight: 400, lineHeight: 1 },
  // pricing
  pricingBadge: { display: "inline-flex", alignItems: "center", gap: 6, padding: "5px 12px", borderRadius: 100, background: "#fdf4e6", border: "0.5px solid #e8d8c4", fontSize: 11, color: "#7a5a48", fontWeight: 500, marginBottom: 14 },
  tierGrid: { display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(180px, 1fr))", gap: 12, marginBottom: 14 },
  tierCard: { background: "#ffffff", border: "0.5px solid #e8d8c4", borderRadius: 14, padding: "1.1rem 1.15rem", boxShadow: "0 2px 16px rgba(107,30,46,0.06)", textAlign: "center" },
  tierHours: { fontSize: 11, textTransform: "uppercase", letterSpacing: 1, color: "#b09080", marginBottom: 6 },
  tierPrice: { fontFamily: "Georgia, serif", fontSize: 28, color: "#b8852a", fontWeight: 500, letterSpacing: -0.5 },
  perPlateRow: { display: "flex", gap: 12, marginBottom: 12, flexWrap: "wrap" },
  perPlateCard: { flex: "1 1 160px", background: "#fdf4e6", borderRadius: 12, padding: "12px 14px", border: "0.5px solid #e8d8c4" },
  perPlateLbl: { fontSize: 10, textTransform: "uppercase", letterSpacing: 0.8, color: "#b09080", marginBottom: 4 },
  perPlateVal: { fontFamily: "Georgia, serif", fontSize: 18, color: "#2c1810" },
  pricingChips: { display: "flex", flexWrap: "wrap", gap: 8, marginBottom: 12 },
  pricingChip: { fontSize: 11, padding: "5px 12px", borderRadius: 100, background: "#fdf4e6", border: "0.5px solid #e8d8c4", color: "#7a5a48" },
  pricingChipWarn: { fontSize: 11, padding: "5px 12px", borderRadius: 100, background: "#fff4dc", border: "0.5px solid #e8c47a", color: "#8a5a1a", fontWeight: 500 },
  pricingFoot: { fontSize: 11, color: "#b09080", textAlign: "center", paddingTop: 10, borderTop: "0.5px solid #f0e4d0", fontStyle: "italic" },
  pricingNote: { background: "#ffffff", border: "0.5px solid #e8d8c4", borderRadius: 14, padding: "1.5rem 1.75rem", fontFamily: "Georgia, 'Times New Roman', serif", fontSize: 15, color: "#3a2820", lineHeight: 1.75, boxShadow: "0 2px 16px rgba(107,30,46,0.06)", fontStyle: "italic" },
  // Pricing calculator
  calcTierPills: { display: "flex", flexWrap: "wrap", gap: 8, marginBottom: 20 },
  calcPill: { padding: "9px 18px", borderRadius: 100, border: "0.5px solid #e8d8c4", background: "#fdf6ec", color: "#7a5a48", fontSize: 13, fontWeight: 500, cursor: "pointer", letterSpacing: 0.2 },
  calcPillOn: { padding: "9px 18px", borderRadius: 100, border: "0.5px solid #6b1e2e", background: "#6b1e2e", color: "#fdf6ec", fontSize: 13, fontWeight: 500, cursor: "pointer", letterSpacing: 0.2 },
  calcPriceDisplay: { background: "#ffffff", border: "0.5px solid #e8d8c4", borderRadius: 14, padding: "1.75rem 1.75rem", textAlign: "center", marginBottom: 18, boxShadow: "0 2px 16px rgba(184,133,42,0.08)" },
  calcPriceLabel: { fontSize: 11, textTransform: "uppercase", letterSpacing: 1.4, color: "#b09080", marginBottom: 10 },
  calcPriceBig: { fontFamily: "Georgia, 'Times New Roman', serif", fontSize: 44, color: "#b8852a", fontWeight: 500, letterSpacing: -1, lineHeight: 1 },
  calcPriceSub: { fontSize: 12, color: "#7a5a48", marginTop: 8 },
  calcGuestBlock: { background: "#fdf4e6", border: "0.5px solid #e8d8c4", borderRadius: 14, padding: "1.25rem 1.5rem", marginBottom: 18 },
  calcGuestLabel: { fontSize: 11, textTransform: "uppercase", letterSpacing: 1.2, color: "#b8852a", fontWeight: 500, marginBottom: 10, display: "block" },
  calcGuestInput: { width: "100%", height: 44, border: "0.5px solid #e8d8c4", borderRadius: 10, padding: "0 14px", fontSize: 16, color: "#2c1810", background: "#fffaf4", outline: "none", boxSizing: "border-box", fontFamily: "Georgia, serif" },
  calcCateringRow: { display: "grid", gridTemplateColumns: "1fr 1fr", gap: 10, marginTop: 12 },
  calcCateringChip: { background: "#fffaf4", border: "0.5px solid #f0e4d0", borderRadius: 10, padding: "10px 12px", display: "flex", flexDirection: "column", gap: 2 },
  calcCateringLbl: { fontSize: 11, color: "#b09080" },
  calcCateringVal: { fontSize: 16, fontFamily: "Georgia, serif", color: "#2c1810", fontWeight: 500 },
  calcCateringSub: { fontSize: 10, color: "#b09080" },
  calcTotalCard: { background: "linear-gradient(135deg, #6b1e2e 0%, #4a1520 100%)", borderRadius: 14, padding: "1.4rem 1.75rem", textAlign: "center", marginBottom: 18, color: "#fdf6ec", boxShadow: "0 2px 24px rgba(107,30,46,0.18)" },
  calcTotalLbl: { fontSize: 11, textTransform: "uppercase", letterSpacing: 1.4, color: "#e8c47a", marginBottom: 8 },
  calcTotalVal: { fontFamily: "Georgia, serif", fontSize: 36, fontWeight: 500, letterSpacing: -0.5, lineHeight: 1 },
  calcTotalSub: { fontSize: 12, color: "rgba(253,246,236,0.72)", marginTop: 8 },
  calcPeakWarn: { background: "#fff4dc", border: "0.5px solid #e8c47a", borderRadius: 12, padding: "11px 14px", display: "flex", alignItems: "flex-start", gap: 9, fontSize: 12, color: "#8a5a1a", marginBottom: 14, lineHeight: 1.5 },
  // Location section
  locMapWrap: { width: "100%", height: 350, borderRadius: 12, overflow: "hidden", border: "0.5px solid #e8d8c4", marginBottom: 16, boxShadow: "0 2px 16px rgba(107,30,46,0.06)" },
  locMap: { width: "100%", height: "100%", border: 0, display: "block" },
  locDesc: { fontFamily: "Georgia, 'Times New Roman', serif", fontSize: 15, color: "#3a2820", lineHeight: 1.8, marginBottom: 16 },
  locMapsBtn: { display: "inline-flex", alignItems: "center", gap: 7, padding: "10px 18px", borderRadius: 100, background: "#fffaf4", border: "0.5px solid #e8d8c4", color: "#6b1e2e", textDecoration: "none", fontSize: 13, fontWeight: 500 },
  // policies 2x2
  policyGrid: { display: "grid", gridTemplateColumns: "1fr 1fr", gap: 16 },
  policyCard: { background: "#ffffff", border: "0.5px solid #e8d8c4", borderRadius: 14, padding: "1.25rem 1.35rem", boxShadow: "0 2px 16px rgba(107,30,46,0.06)" },
  policyCardSoft: { background: "#f3f9f3", border: "0.5px solid #d4e4d4", borderRadius: 14, padding: "1.25rem 1.35rem", boxShadow: "0 2px 16px rgba(107,30,46,0.06)" },
  policyCardWarn: { background: "#fff8ec", border: "0.5px solid #e8d4a8", borderRadius: 14, padding: "1.25rem 1.35rem", boxShadow: "0 2px 16px rgba(107,30,46,0.06)" },
  policyIcon: { fontSize: 22, marginBottom: 8 },
  policyKicker: { fontSize: 10, textTransform: "uppercase", letterSpacing: 1.4, color: "#b8852a", fontWeight: 500, marginBottom: 6 },
  policyHeadline: { fontFamily: "Georgia, 'Times New Roman', serif", fontSize: 18, color: "#2c1810", fontWeight: 400, marginBottom: 10, letterSpacing: -0.2 },
  policyRow: { fontSize: 12, color: "#7a5a48", lineHeight: 1.65, marginBottom: 5 },
  policyChipRow: { display: "flex", flexWrap: "wrap", gap: 6, marginTop: 8 },
  policyChip: { fontSize: 10, padding: "3px 9px", borderRadius: 100, background: "#fdf4e6", border: "0.5px solid #e8d8c4", color: "#7a5a48" },
  policyRestriction: { fontSize: 12, color: "#8a5a1a", fontStyle: "italic", marginTop: 8, lineHeight: 1.6 },
  // amenities icon grid
  amSubGroup: { marginBottom: 18 },
  amSubH: { fontSize: 10, textTransform: "uppercase", letterSpacing: 1.4, color: "#b8852a", fontWeight: 500, marginBottom: 10 },
  amIconGrid: { display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(170px, 1fr))", gap: 10 },
  amIconItem: { display: "flex", alignItems: "center", gap: 9, padding: "8px 10px", borderRadius: 8 },
  amIconItemOff: { display: "flex", alignItems: "center", gap: 9, padding: "8px 10px", borderRadius: 8, opacity: 0.4 },
  amIcon: { fontSize: 15, color: "#6b1e2e", flexShrink: 0, width: 18, textAlign: "center" },
  amIconOff: { fontSize: 15, color: "#b09080", flexShrink: 0, width: 18, textAlign: "center" },
  amLabel: { fontSize: 12, color: "#3a2820" },
  amLabelOff: { fontSize: 12, color: "#7a5a48", textDecoration: "line-through" },
  // contact
  contactCard: { background: "#ffffff", border: "0.5px solid #e8d8c4", borderRadius: 14, padding: "1.5rem 1.75rem", boxShadow: "0 2px 16px rgba(107,30,46,0.06)" },
  contactName: { fontFamily: "Georgia, 'Times New Roman', serif", fontSize: 20, color: "#2c1810", fontWeight: 400, letterSpacing: -0.2, marginBottom: 4 },
  contactRole: { fontSize: 11, textTransform: "uppercase", letterSpacing: 1.2, color: "#b8852a", fontWeight: 500, marginBottom: 14 },
  contactLink: { display: "inline-flex", alignItems: "center", gap: 7, padding: "8px 13px", borderRadius: 100, background: "#fdf4e6", border: "0.5px solid #e8d8c4", color: "#6b1e2e", textDecoration: "none", fontSize: 13, fontWeight: 500, marginRight: 8, marginBottom: 8 },
  contactChips: { display: "flex", flexWrap: "wrap", gap: 6, marginTop: 6 },
  contactChip: { fontSize: 10, padding: "3px 9px", borderRadius: 100, background: "#fdf4e6", border: "0.5px solid #e8d8c4", color: "#7a5a48", letterSpacing: 0.3 },
  contactTag: { fontSize: 13, color: "#7a5a48", marginTop: 14, fontFamily: "Georgia, serif", fontStyle: "italic", paddingTop: 12, borderTop: "0.5px solid #f0e4d0" },
  // FAQ cards
  faqList: { display: "flex", flexDirection: "column", gap: 10 },
  faqCard: { display: "flex", alignItems: "center", gap: 10, padding: "13px 16px", background: "#ffffff", border: "0.5px solid #e8d8c4", borderLeft: "3px solid transparent", borderRadius: 12, cursor: "pointer", boxShadow: "0 2px 16px rgba(107,30,46,0.04)", transition: "transform 0.18s ease, border-color 0.18s ease", textDecoration: "none", color: "inherit" },
  faqText: { fontSize: 13, color: "#3a2820", flex: 1, lineHeight: 1.4 },
  faqArrow: { fontSize: 14, color: "#6b1e2e", flexShrink: 0 },
  // reviews v3
  reviewScroller: { display: "flex", gap: 14, overflowX: "auto", paddingBottom: 8, paddingLeft: 4, paddingRight: 4, marginLeft: -4, marginRight: -4 },
  reviewCard: { flex: "0 0 320px", background: "#ffffff", border: "0.5px solid #e8d8c4", borderRadius: 14, padding: "1.25rem 1.3rem", boxShadow: "0 2px 16px rgba(107,30,46,0.06)" },
  reviewAvatar: { width: 42, height: 42, borderRadius: "50%", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 14, fontWeight: 500, letterSpacing: 0.5, color: "#fdf6ec", flexShrink: 0 },
  reviewHead: { display: "flex", alignItems: "center", gap: 11, marginBottom: 12 },
  reviewerName: { fontSize: 13, fontWeight: 500, color: "#2c1810", marginBottom: 2 },
  reviewMeta: { display: "flex", alignItems: "center", gap: 6, fontSize: 11, color: "#b09080" },
  reviewStars: { color: "#b8852a", letterSpacing: 1 },
  reviewStarsOff: { color: "#f0e4d0" },
  reviewText: { fontSize: 13, color: "#3a2820", lineHeight: 1.7, fontFamily: "Georgia, serif" },
  reviewMoreBtn: { background: "none", border: "none", padding: 0, color: "#6b1e2e", cursor: "pointer", fontSize: 12, fontWeight: 500, textDecoration: "underline" },
  reviewFooter: { display: "flex", alignItems: "center", justifyContent: "space-between", flexWrap: "wrap", gap: 8, marginTop: 16, paddingTop: 14, borderTop: "0.5px solid #f0e4d0" },
  // nearby v3
  nearbyIntro: { fontSize: 13, color: "#7a5a48", marginBottom: 14, fontFamily: "Georgia, serif", fontStyle: "italic" },
  nearbyGrid: { display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(220px, 1fr))", gap: 14 },
  nearbyCard: { display: "flex", flexDirection: "column", background: "#ffffff", border: "0.5px solid #e8d8c4", borderRadius: 14, overflow: "hidden", boxShadow: "0 2px 16px rgba(107,30,46,0.06)", textDecoration: "none", color: "inherit", transition: "transform 0.18s ease" },
  nearbyImg: { height: 120, background: "#f0e2c8", display: "flex", alignItems: "center", justifyContent: "center", position: "relative", overflow: "hidden" },
  nearbyDistance: { position: "absolute", top: 10, left: 10, padding: "4px 10px", borderRadius: 100, background: "#b8852a", color: "#fff", fontSize: 11, fontWeight: 500, letterSpacing: 0.3 },
  nearbyBody: { padding: "12px 14px 14px" },
  // similar v3
  simCardV3: { display: "block", background: "#ffffff", border: "0.5px solid #e8d8c4", borderRadius: 14, overflow: "hidden", textDecoration: "none", color: "inherit", boxShadow: "0 2px 16px rgba(107,30,46,0.06)", transition: "transform 0.2s ease, box-shadow 0.2s ease" },
  simImgV3: { height: 160, background: "#f0e2c8", display: "flex", alignItems: "center", justifyContent: "center", overflow: "hidden" },
  simBodyV3: { padding: "14px 16px 16px" },
  simNameV3: { fontFamily: "Georgia, 'Times New Roman', serif", fontSize: 18, color: "#2c1810", fontWeight: 400, letterSpacing: -0.2, marginBottom: 4 },
  // sidebar v3
  sideCard: { background: "#ffffff", border: "0.5px solid #e8d8c4", borderRadius: 14, overflow: "hidden", boxShadow: "0 2px 16px rgba(107,30,46,0.08)" },
  sideChatHeader: { background: "linear-gradient(135deg, #6b1e2e 0%, #4a1520 100%)", padding: "1.35rem 1.35rem 1.25rem" },
  sideAvatarBig: { width: 56, height: 56, borderRadius: "50%", background: "#b8852a", color: "#fdf6ec", display: "flex", alignItems: "center", justifyContent: "center", fontFamily: "Georgia, serif", fontSize: 24, fontWeight: 500, position: "relative", marginBottom: 12, border: "2px solid rgba(253,246,236,0.2)" },
  sideOnlineDot: { position: "absolute", bottom: 1, right: 1, width: 12, height: 12, borderRadius: "50%", background: "#6fcf97", border: "2px solid #6b1e2e" },
  sideVname: { fontFamily: "Georgia, serif", fontSize: 17, color: "#fdf6ec", fontWeight: 400, letterSpacing: -0.2, marginBottom: 3 },
  sideStatus: { fontSize: 11, color: "rgba(253,246,236,0.7)", display: "flex", alignItems: "center", gap: 5 },
  sideQfCard: { background: "#fffaf4", border: "0.5px solid #e8d8c4", borderRadius: 14, padding: "1.25rem", boxShadow: "0 2px 16px rgba(107,30,46,0.06)" },
  sideQfTitle: { fontFamily: "Georgia, serif", fontSize: 14, color: "#2c1810", fontWeight: 400, marginBottom: 12, paddingBottom: 8, borderBottom: "0.5px solid #f0e4d0" },
  sideQfItem: { display: "flex", alignItems: "flex-start", gap: 10, padding: "8px 0", borderBottom: "0.5px solid #f7eedb" },
  sideQfIcon: { fontSize: 15, lineHeight: 1.3, color: "#b8852a", flexShrink: 0, width: 18 },
  sideQfQ: { fontSize: 11, color: "#b09080", marginBottom: 2 },
  sideQfA: { fontSize: 12, color: "#2c1810", fontWeight: 500 },
  sideConcierge: { background: "linear-gradient(135deg, #fdf4e6 0%, #f7edda 100%)", border: "0.5px solid #e8d4a8", borderRadius: 14, padding: "1.25rem", boxShadow: "0 2px 16px rgba(184,133,42,0.1)" },
  sideConciergeH: { fontFamily: "Georgia, serif", fontSize: 14, color: "#2c1810", fontWeight: 400, marginBottom: 6, letterSpacing: -0.2 },
  sideConciergeBody: { fontSize: 11, color: "#7a5a48", lineHeight: 1.55, marginBottom: 10 },
  sideConciergeLink: { display: "inline-flex", alignItems: "center", gap: 6, fontSize: 12, color: "#6b1e2e", textDecoration: "none", fontWeight: 500, borderBottom: "0.5px solid #b8852a", paddingBottom: 2 },
  sideSecurity: { fontSize: 10, color: "#b09080", textAlign: "center", lineHeight: 1.55, padding: "0 0.5rem" },
};

const VIBES = ["Traditional", "Contemporary", "Outdoor", "Intimate", "Grand"];

// Format INR currency without paise — used for prices, deposits, per-plate.
const formatINR = (n) => {
  if (typeof n !== "number" || !isFinite(n) || n <= 0) return null;
  try {
    return n.toLocaleString("en-IN");
  } catch (e) {
    return String(n);
  }
};

// Space "Best for" tag → color mapping per spec
const SPACE_TAG_COLORS = {
  ceremony: { bg: "#6b1e2e", color: "#fdf6ec" },
  reception: { bg: "#b8852a", color: "#fdf6ec" },
  sangeet: { bg: "#7a3d7a", color: "#fdf6ec" },
  mehendi: { bg: "#3a7a4d", color: "#fdf6ec" },
  haldi: { bg: "#d4a017", color: "#3a2820" },
  cocktail: { bg: "#3a6b8a", color: "#fdf6ec" },
};

const SPACE_TYPE_LABEL = {
  outdoor: { icon: "🌿", label: "Outdoor" },
  indoor: { icon: "🏛", label: "Indoor" },
  "semi-outdoor": { icon: "⛅", label: "Semi-outdoor" },
};

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
  // Gallery v2 state — thumbnail grid modal → lightbox modal, plus category tab filter.
  // Thumbnail grid is the entry point; lightbox stacks on top when a thumb is clicked.
  const [thumbnailGridOpen, setThumbnailGridOpen] = useState(false);
  const [lightboxOpen, setLightboxOpen] = useState(false);
  const [lightboxIndex, setLightboxIndex] = useState(0);
  const [galleryTab, setGalleryTab] = useState("all");
  // "What couples say" — track which review cards are expanded (read more)
  const [expandedReviews, setExpandedReviews] = useState({});
  // Pricing calculator state — selected tier index + guest count for catering math
  const [selectedTierIndex, setSelectedTierIndex] = useState(0);
  const [calcGuestCount, setCalcGuestCount] = useState("");

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

  // Gallery v2 — body scroll lock when either modal is open + keyboard handler.
  // Escape: closes the topmost modal only (lightbox first, then grid).
  // Arrows: only navigate when lightbox is open.
  // Computes the active photo list inline so this hook stays above the early
  // `if (!venue)` return (hooks can't be conditional).
  useEffect(() => {
    if (!thumbnailGridOpen && !lightboxOpen) return undefined;
    let len = 0;
    if (lightboxOpen) {
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
          list = raw[galleryTab].slice();
        }
      } else if (Array.isArray(raw)) {
        list = raw.slice();
      }
      if (galleryTab === "all" && venue?.coverPhoto && !list.includes(venue.coverPhoto)) {
        list = [venue.coverPhoto, ...list];
      }
      len = list.length;
      if (len === 0) setLightboxOpen(false);
    }
    const onKey = (e) => {
      if (e.key === "Escape") {
        if (lightboxOpen) setLightboxOpen(false);
        else if (thumbnailGridOpen) setThumbnailGridOpen(false);
      } else if (lightboxOpen && len > 0) {
        if (e.key === "ArrowRight") setLightboxIndex((i) => (i + 1) % len);
        else if (e.key === "ArrowLeft") setLightboxIndex((i) => (i - 1 + len) % len);
      }
    };
    window.addEventListener("keydown", onKey);
    const prevOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      window.removeEventListener("keydown", onKey);
      document.body.style.overflow = prevOverflow;
    };
  }, [thumbnailGridOpen, lightboxOpen, galleryTab, venue]);

  // Reset lightbox index when the active tab changes so we don't land on a
  // stale out-of-bounds photo from the previous category.
  useEffect(() => {
    setLightboxIndex(0);
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
    : Array.isArray(rawPhotos) && rawPhotos.length > 0
    ? [{ key: "venue", label: "Venue", list: rawPhotos }]
    : [];
  const allPhotos = (() => {
    const list = photoCats.reduce((acc, c) => acc.concat(c.list), []);
    // Ensure the cover photo is part of the gallery (prepended if not already present).
    if (venue.coverPhoto && !list.includes(venue.coverPhoto)) {
      return [venue.coverPhoto, ...list];
    }
    return list;
  })();
  // Photos visible after the active tab filter (drives both grid + modal)
  const activeCat = photoCats.find((c) => c.key === galleryTab) || null;
  const photos = activeCat ? activeCat.list : allPhotos;
  const showTabs = photoCats.length > 0;
  const totalPhotos = photos.length;
  const gridSlots = [0, 1, 2, 3, 4];
  const remainingBeyondGrid = Math.max(0, totalPhotos - 5);
  const openThumbnailGrid = () => {
    if (totalPhotos === 0) return;
    setThumbnailGridOpen(true);
  };
  const openLightboxAt = (i) => {
    if (totalPhotos === 0) return;
    setLightboxIndex(Math.min(Math.max(i, 0), totalPhotos - 1));
    setLightboxOpen(true);
  };
  const closeLightbox = () => setLightboxOpen(false);
  const closeAll = () => {
    setLightboxOpen(false);
    setThumbnailGridOpen(false);
  };
  const lightboxStep = (dir) => {
    if (totalPhotos === 0) return;
    setLightboxIndex((idx) => (idx + dir + totalPhotos) % totalPhotos);
  };
  const capacityText = venue.capacity?.max > 0 ? `${venue.capacity.min || 0}–${venue.capacity.max}` : null;
  const rooms = venue.accommodation?.rooms > 0 ? `${venue.accommodation.rooms} rooms` : null;
  const catText = venue.catering === "in_house_only" ? "In-house only" : venue.catering === "outside_allowed" ? "Outside allowed" : venue.catering === "both" ? "Both" : "Ask venue";

  // --- v3 redesign derivations ---
  // Hero cover photo: prefer explicit coverPhoto, then featurePhoto, then first available photo
  const heroCover = venue.coverPhoto || venue.featurePhoto || (allPhotos.length > 0 ? allPhotos[0] : null);

  // Catering policy — schema lives under cateringPolicy.type; older code used venue.catering
  const catPolicyType = venue.cateringPolicy?.type || venue.catering || "unknown";
  const catPolicyLabel = catPolicyType === "in_house_only"
    ? "In-house only"
    : catPolicyType === "outside_allowed"
    ? "Outside allowed"
    : catPolicyType === "both"
    ? "Both options available"
    : "Ask the venue";
  const catPolicyHeadline = catPolicyType === "in_house_only"
    ? "In-house kitchen only"
    : catPolicyType === "outside_allowed"
    ? "Outside caterers welcome"
    : catPolicyType === "both"
    ? "In-house or outside caterers"
    : "Catering — to be confirmed";

  // Capacity derivation — schema doesn't have venue.capacity, derive from spaces
  const spaces = Array.isArray(venue.spaces) ? venue.spaces : [];
  const totalSeated = spaces.reduce((acc, s) => acc + (Number(s.capacitySeated) || 0), 0);
  const totalStanding = spaces.reduce((acc, s) => acc + (Number(s.capacityStanding) || 0), 0);
  const maxSpaceSeated = spaces.reduce((acc, s) => Math.max(acc, Number(s.capacitySeated) || 0), 0);
  const maxSpaceStanding = spaces.reduce((acc, s) => Math.max(acc, Number(s.capacityStanding) || 0), 0);
  // Best estimate of "max guests" across all spaces — prefer the largest single space
  const guestsMax = Math.max(maxSpaceSeated, maxSpaceStanding, Number(venue.capacity?.max) || 0);
  const guestsMin = Number(venue.capacity?.min) || 0;
  const guestsRange = guestsMax > 0
    ? (guestsMin > 0 && guestsMin < guestsMax ? `${guestsMin}-${guestsMax}` : `up to ${guestsMax}`)
    : null;

  // Accommodation derivations
  const acc = venue.accommodation || {};
  const accRoomTypes = Array.isArray(acc.roomTypes) ? acc.roomTypes : [];
  const accTotalRooms = accRoomTypes.reduce((sum, rt) => sum + (Number(rt.count) || 0), 0)
    || (Number(acc.rooms) || 0);
  const accTotalCap = Number(acc.totalCapacity) || accRoomTypes.reduce((sum, rt) => sum + ((Number(rt.count) || 0) * (Number(rt.maxPeoplePerRoom) || Number(rt.occupancyPerRoom) || 0)), 0);

  // Pricing derivations
  const pricing = venue.pricing || {};
  const tiers = Array.isArray(pricing.tiers) ? pricing.tiers.filter((t) => t && (t.hours || t.price)) : [];
  const lowestTierPrice = tiers.length > 0 ? Math.min(...tiers.map((t) => Number(t.price) || Infinity).filter((p) => isFinite(p))) : null;
  const perPlateVeg = Number(pricing.perPlate?.veg) || 0;
  const perPlateNonVeg = Number(pricing.perPlate?.nonVeg) || 0;
  const securityDeposit = Number(pricing.securityDeposit) || 0;
  const advancePercent = Number(pricing.advancePercent) || 0;
  const peakMarkup = Number(pricing.peakSeasonMarkup) || 0;
  const minDuration = Number(pricing.minimumDuration) || 0;
  const hasTieredPricing = tiers.length > 0;
  const hasPricingNote = !!(pricing.note && String(pricing.note).trim().length > 0);
  const showPricingSection = hasTieredPricing || hasPricingNote;

  // Calculator derivations — clamp index, parse guest count, compute estimate.
  // Veg per-plate is the base catering estimate (non-veg shown separately).
  const safeTierIndex = hasTieredPricing ? Math.min(Math.max(selectedTierIndex, 0), tiers.length - 1) : 0;
  const selectedTier = hasTieredPricing ? tiers[safeTierIndex] : null;
  const selectedTierPrice = Number(selectedTier?.price) || 0;
  const numGuests = parseInt(calcGuestCount, 10) || 0;
  const cateringEstimateVeg = perPlateVeg > 0 ? perPlateVeg * numGuests : 0;
  const cateringEstimateNonVeg = perPlateNonVeg > 0 ? perPlateNonVeg * numGuests : 0;
  const totalEstimate = selectedTierPrice + cateringEstimateVeg;

  // Music policy
  const mp = venue.musicPolicy || {};
  const musicPermissive = mp.djAllowed !== false && mp.liveMusicAllowed !== false;

  // Amenities — schema has them as an object of booleans (not the legacy array)
  const am = venue.amenities && typeof venue.amenities === "object" && !Array.isArray(venue.amenities) ? venue.amenities : null;
  // Legacy array form support (older docs may still use this)
  const amenitiesArrayLegacy = Array.isArray(venue.amenities) ? venue.amenities : null;

  // Build the highlights list dynamically — only items the venue actually has
  const highlights = [];
  if (am?.swimmingPool) highlights.push({ icon: "🏊", text: "Swimming pool on premises" });
  if (am?.garden || spaces.some((s) => s.type === "outdoor" || s.type === "semi-outdoor")) highlights.push({ icon: "🌿", text: "Beautiful outdoor ceremony spaces" });
  if (mp.djAllowed !== false || mp.liveMusicAllowed !== false) highlights.push({ icon: "🎵", text: "DJ and live music welcome" });
  if (am?.outsideAlcohol === "yes") highlights.push({ icon: "🍷", text: "Outside alcohol permitted" });
  if (acc.available) highlights.push({ icon: "🛏", text: "On-site accommodation for guests" });
  if (am?.dayOfCoordinator) highlights.push({ icon: "📋", text: "Dedicated day-of coordinator" });
  // Cap to 6
  const highlightsTrimmed = highlights.slice(0, 6);

  // Sticky-bar quick facts — only render the chips we actually have data for
  const stickyChips = [];
  if (vType) stickyChips.push({ icon: "🏠", text: vType });
  if (guestsRange) stickyChips.push({ icon: "👥", text: <><span style={S.stickyChipNum}>{guestsRange}</span> guests</> });
  if (accTotalRooms > 0) stickyChips.push({ icon: "🛏", text: <><span style={S.stickyChipNum}>{accTotalRooms}</span> rooms</> });
  if (venue.googleRating) stickyChips.push({ icon: "⭐", text: <><span style={S.stickyChipNum}>{venue.googleRating}</span> rating</> });
  stickyChips.push({ icon: "🍽", text: catPolicyLabel });
  if (mp.outdoorCurfew) stickyChips.push({ icon: "🎵", text: <>Outdoor till <span style={S.stickyChipNum}>{mp.outdoorCurfew}</span></> });
  if (lowestTierPrice) stickyChips.push({ icon: "💰", text: <>from <span style={S.stickyChipNum}>₹{formatINR(lowestTierPrice)}</span></> });

  // FAQ entries — pre-fill from venue data where possible, keep tappable
  const faqEntries = [
    { q: "Is your date available for our guest count?", a: "Ask the venue directly to confirm date + capacity." },
    { q: "Can we do a site visit this weekend?", a: "Coordinate a visit in chat." },
    { q: "What is the all-in cost for a 2-day wedding?", a: hasTieredPricing && lowestTierPrice ? `Tiered pricing starts from ₹${formatINR(lowestTierPrice)} — ask for a 2-day quote.` : "Ask for a full quote in chat." },
    { q: "Do you have a coordinator on event day?", a: am?.dayOfCoordinator ? "Yes — dedicated day-of coordinator available." : "Confirm with the venue." },
    { q: "Are there any hidden charges we should know about?", a: "Ask about kitchen fee, peak markup, security deposit." },
  ];

  // Sort nearby by distanceKm client-side (defensive — server should already do this)
  const nearbySorted = [...(Array.isArray(nearby) ? nearby : [])].sort((a, b) => {
    const da = typeof a?.distanceKm === "number" ? a.distanceKm : Infinity;
    const db = typeof b?.distanceKm === "number" ? b.distanceKm : Infinity;
    return da - db;
  });

  // Initials for venue chat avatar
  const venueInitial = (venue.name || "?").trim().charAt(0).toUpperCase() || "?";

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

  // Build a stable palette for review avatars (alternates burgundy/gold tones)
  const reviewAvatarColors = ["#6b1e2e", "#b8852a", "#8a3045", "#a07020", "#4a1520"];

  // Amenity icon map — drives the amenities grid below
  const AMENITY_ICONS = {
    swimmingPool: { icon: "🏊", label: "Swimming pool" },
    generatorBackup: { icon: "🔌", label: "Generator backup" },
    parking: { icon: "🅿️", label: "Parking" },
    helipad: { icon: "🚁", label: "Helipad" },
    garden: { icon: "🌳", label: "Garden" },
    airConditioning: { icon: "❄️", label: "Air conditioning" },
    cctv: { icon: "📹", label: "CCTV" },
    wifi: { icon: "📶", label: "WiFi" },
    elevator: { icon: "🛗", label: "Elevator" },
    bridalSuite: { icon: "👰", label: "Bridal suite" },
    groomRoom: { icon: "🤵", label: "Groom room" },
    makeupRoom: { icon: "💄", label: "Makeup room" },
    changingRooms: { icon: "🚪", label: "Changing rooms" },
    prayerRoom: { icon: "🛕", label: "Prayer room" },
    fireNOC: { icon: "🧯", label: "Fire NOC" },
    liquorLicense: { icon: "🍾", label: "Liquor license" },
    dayOfCoordinator: { icon: "📋", label: "Day-of coordinator" },
    securityStaff: { icon: "🛡", label: "Security staff" },
    housekeeping: { icon: "🧹", label: "Housekeeping" },
    valetParking: { icon: "🚗", label: "Valet parking" },
    shuttleService: { icon: "🚐", label: "Shuttle service" },
    petFriendly: { icon: "🐾", label: "Pet friendly" },
  };
  const AMENITY_GROUPS = [
    {
      title: "Facilities",
      keys: ["swimmingPool", "garden", "airConditioning", "elevator", "wifi", "generatorBackup", "cctv", "parking", "helipad"],
    },
    {
      title: "Wedding Facilities",
      keys: ["bridalSuite", "groomRoom", "makeupRoom", "changingRooms", "prayerRoom"],
    },
    {
      title: "Services",
      keys: ["dayOfCoordinator", "housekeeping", "securityStaff", "valetParking", "shuttleService", "fireNOC", "liquorLicense", "petFriendly"],
    },
  ];

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

  // First letter of description for the drop-cap — only when there's meaningful body text
  const descRest = venue.description && venue.description.length > 1 ? venue.description.slice(1) : "";
  const descFirst = venue.description && venue.description.length > 0 ? venue.description.charAt(0) : "";

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
          <Link href="/" style={S.bcLink}>Home</Link> ›{" "}
          <Link href="/venues" style={S.bcLink}>Venues</Link> ›{" "}
          <span>{venue.name}</span>
        </div>

        {/* ───────────────────────────── 1. HERO ───────────────────────────── */}
        <section style={S.hero} aria-label={`${venue.name} cover`}>
          {heroCover ? (
            <img src={heroCover} alt={`${venue.name} cover photo`} style={S.heroImg} />
          ) : (
            <div style={{ ...S.heroImg, background: "linear-gradient(135deg, #4a1520 0%, #2c1810 100%)" }} />
          )}
          <div style={S.heroOverlay} />
          {isVerified && (
            <div style={S.heroVerified}>
              <span aria-hidden="true">✓</span> Wedsy Verified
            </div>
          )}
          {totalPhotos > 0 && (
            <button
              type="button"
              style={S.heroViewAll}
              onClick={openThumbnailGrid}
              aria-label={`View all ${totalPhotos} photos`}
            >
              <span aria-hidden="true">⊞</span> View all {totalPhotos} photos
            </button>
          )}
          <div style={S.heroInner}>
            <div style={S.heroEyebrow}>
              <span style={S.heroChip}>📍 {venue.address?.split(",")[0] || venue.city || "Bangalore"}</span>
              <span style={S.heroChip}>🌿 {vType}</span>
              {venue.googleRating && (
                <span style={S.heroChip}>
                  <span style={{ color: "#e8c47a" }}>★</span> {venue.googleRating}
                  {venue.googleReviewCount > 0 && <span style={{ opacity: 0.7 }}> · {venue.googleReviewCount} reviews</span>}
                </span>
              )}
            </div>
            <h1 style={S.heroName}>{venue.name}</h1>
            {venue.tagline && (
              <div style={{ fontSize: 15, color: "rgba(253,246,236,0.85)", fontFamily: "Georgia, serif", fontStyle: "italic", maxWidth: 640 }}>
                {venue.tagline}
              </div>
            )}
          </div>
          <div style={S.heroFade} />
        </section>

        {/* ───────────────────── 2. STICKY QUICK FACTS BAR ───────────────────── */}
        {stickyChips.length > 0 && (
          <div style={S.stickyBar} aria-label="Quick facts">
            <div style={S.stickyBarInner}>
              {stickyChips.map((chip, i) => (
                <span key={i} style={{ display: "inline-flex", alignItems: "center", gap: 14, flexShrink: 0 }}>
                  <span style={S.stickyChip}>
                    <span aria-hidden="true">{chip.icon}</span> {chip.text}
                  </span>
                  {i < stickyChips.length - 1 && <span style={S.stickyDivider} />}
                </span>
              ))}
            </div>
          </div>
        )}

        {/* Gallery v2 — thumbnail grid modal (entry point opened from hero "view all") */}
        {thumbnailGridOpen && (
          <div
            style={S.tgrid_overlay}
            role="dialog"
            aria-modal="true"
            aria-label="All photos"
          >
            <div style={S.tgrid_topbar}>
              <div style={S.tgrid_topbarLeft}>
                {showTabs && (
                  <>
                    <button
                      type="button"
                      style={galleryTab === "all" ? S.gallV2_tabOn : S.gallV2_tab}
                      onClick={() => setGalleryTab("all")}
                    >
                      <span>All</span>
                      <span style={galleryTab === "all" ? S.gallV2_tabBadgeOn : S.gallV2_tabBadge}>{allPhotos.length}</span>
                    </button>
                    {photoCats.map((c) => (
                      <button
                        key={c.key}
                        type="button"
                        style={galleryTab === c.key ? S.gallV2_tabOn : S.gallV2_tab}
                        onClick={() => setGalleryTab(c.key)}
                      >
                        <span>{c.label}</span>
                        <span style={galleryTab === c.key ? S.gallV2_tabBadgeOn : S.gallV2_tabBadge}>{c.list.length}</span>
                      </button>
                    ))}
                  </>
                )}
              </div>
              <div style={S.tgrid_count}>{totalPhotos} photo{totalPhotos === 1 ? "" : "s"}</div>
              <button
                type="button"
                style={S.tgrid_close}
                aria-label="Close gallery"
                onClick={closeAll}
              >
                ✕
              </button>
            </div>
            <div style={S.tgrid_body}>
              <div style={S.tgrid_inner}>
                {photos.map((p, i) => (
                  <button
                    key={`${p}-${i}`}
                    type="button"
                    className="tgrid-thumb"
                    style={S.tgrid_thumb}
                    onClick={() => openLightboxAt(i)}
                    aria-label={`Open photo ${i + 1} of ${totalPhotos}`}
                  >
                    <img src={p} alt={`${venue.name} photo ${i + 1}`} style={S.tgrid_img} />
                  </button>
                ))}
              </div>
            </div>
            <style jsx>{`
              .tgrid-thumb:hover {
                transform: scale(1.02);
                border-color: #6b1e2e !important;
              }
            `}</style>
          </div>
        )}

        {/* Gallery v2 — lightbox modal (stacks above the thumbnail grid) */}
        {lightboxOpen && photos[lightboxIndex] && (
          <div
            style={{ ...S.gallV2_overlay, zIndex: 1100 }}
            onClick={closeLightbox}
            role="dialog"
            aria-modal="true"
            aria-label="Photo lightbox"
          >
            <div style={S.gallV2_counter}>{lightboxIndex + 1} of {totalPhotos}</div>
            <button
              type="button"
              style={S.gallV2_close}
              aria-label="Close gallery"
              onClick={(e) => { e.stopPropagation(); closeAll(); }}
            >
              ✕
            </button>
            {totalPhotos > 1 && (
              <button
                type="button"
                style={{ ...S.gallV2_chev, ...S.gallV2_chevLeft }}
                aria-label="Previous photo"
                onClick={(e) => { e.stopPropagation(); lightboxStep(-1); }}
              >
                ‹
              </button>
            )}
            <div style={S.gallV2_stage} onClick={(e) => e.stopPropagation()}>
              <img
                src={photos[lightboxIndex]}
                alt={`${venue.name} photo ${lightboxIndex + 1} of ${totalPhotos}`}
                style={S.gallV2_stageImg}
              />
            </div>
            {totalPhotos > 1 && (
              <button
                type="button"
                style={{ ...S.gallV2_chev, ...S.gallV2_chevRight }}
                aria-label="Next photo"
                onClick={(e) => { e.stopPropagation(); lightboxStep(1); }}
              >
                ›
              </button>
            )}
            {thumbnailGridOpen && (
              <button
                type="button"
                style={S.gallV2_back}
                aria-label="Back to all photos"
                onClick={(e) => { e.stopPropagation(); closeLightbox(); }}
              >
                <span aria-hidden="true">←</span> Back to all photos
              </button>
            )}
          </div>
        )}

        {/* ───────────────────────── 3. BODY GRID ───────────────────────── */}
        <div style={S.bodyV3}>
          {/* MAIN COLUMN */}
          <div style={S.mainV3}>
            {/* ───── 4. ABOUT + HIGHLIGHTS ───── */}
            {(venue.description || highlightsTrimmed.length > 0) && (
              <section style={S.section}>
                <div style={S.sTitleWrap}>
                  <div style={S.sTitle}>About {venue.name}</div>
                  <div style={S.sTitleRule} />
                </div>
                <div style={S.abSplit}>
                  <div>
                    {venue.description ? (
                      <p style={S.aboutText}>
                        <span style={S.dropCap}>{descFirst}</span>
                        {descRest}
                      </p>
                    ) : (
                      <p style={S.aboutText}>A premium wedding venue in {venue.city || "Bangalore"} — chat directly with the team to learn more.</p>
                    )}
                  </div>
                  {highlightsTrimmed.length > 0 && (
                    <aside style={S.highlightsCard}>
                      <div style={S.highlightsTitle}>Why couples love this venue</div>
                      <div>
                        {highlightsTrimmed.map((h, i) => (
                          <div key={i} style={S.highlightItem}>
                            <span style={S.highlightIcon} aria-hidden="true">{h.icon}</span>
                            <span>{h.text}</span>
                          </div>
                        ))}
                      </div>
                    </aside>
                  )}
                </div>
              </section>
            )}

            {/* ───── 5. EVENT SPACES ───── */}
            {spaces.length > 0 && (
              <section style={S.section}>
                <div style={S.sTitleWrap}>
                  <div style={S.sTitle}>Event Spaces</div>
                  <div style={S.sTitleRule} />
                  <div style={S.sTitleSub}>{spaces.length} {spaces.length === 1 ? "space" : "spaces"} available for your wedding</div>
                </div>
                <div style={S.spacesScroller}>
                  {spaces.map((sp, i) => {
                    const typeInfo = SPACE_TYPE_LABEL[sp.type] || { icon: "✦", label: sp.type || "Space" };
                    const bestFor = Array.isArray(sp.bestFor) ? sp.bestFor : [];
                    return (
                      <article key={i} style={S.spaceCard}>
                        <div style={S.spaceTopRow}>
                          <div style={S.spaceName}>{sp.name || `Space ${i + 1}`}</div>
                          <span style={S.spaceTypeBadge}>{typeInfo.icon} {typeInfo.label}</span>
                        </div>
                        {(sp.capacitySeated > 0 || sp.capacityStanding > 0) && (
                          <div style={S.spaceStatRow}>
                            <div style={S.spaceStat}>
                              <div style={S.spaceStatVal}>{sp.capacitySeated || "—"}</div>
                              <div style={S.spaceStatLbl}>Seated</div>
                            </div>
                            <div style={S.spaceStat}>
                              <div style={S.spaceStatVal}>{sp.capacityStanding || "—"}</div>
                              <div style={S.spaceStatLbl}>Standing</div>
                            </div>
                          </div>
                        )}
                        {bestFor.length > 0 && (
                          <div>
                            <div style={{ fontSize: 10, textTransform: "uppercase", letterSpacing: 1, color: "#b09080", marginBottom: 6 }}>Best for</div>
                            <div style={S.spaceTagRow}>
                              {bestFor.map((tag, ti) => {
                                const key = String(tag).toLowerCase();
                                const palette = SPACE_TAG_COLORS[key] || { bg: "#fdf4e6", color: "#7a5a48" };
                                return (
                                  <span key={ti} style={{ ...S.spaceTag, background: palette.bg, color: palette.color }}>
                                    {tag}
                                  </span>
                                );
                              })}
                            </div>
                          </div>
                        )}
                        {sp.description && <div style={S.spaceDesc}>{sp.description}</div>}
                      </article>
                    );
                  })}
                </div>
              </section>
            )}

            {/* ───── 6. ACCOMMODATION ───── */}
            {acc.available === true && (
              <section style={S.section}>
                <div style={S.sTitleWrap}>
                  <div style={S.sTitle}>Stay at the venue</div>
                  <div style={S.sTitleRule} />
                  <div style={S.sTitleSub}>Keep your guests close — on-site rooms available</div>
                </div>
                {accRoomTypes.length > 0 ? (
                  <>
                    <div style={S.roomGrid}>
                      {accRoomTypes.map((rt, i) => {
                        const sleeps = rt.maxPeoplePerRoom && rt.maxPeoplePerRoom !== rt.occupancyPerRoom
                          ? `${rt.occupancyPerRoom || 1}-${rt.maxPeoplePerRoom}`
                          : `${rt.occupancyPerRoom || rt.maxPeoplePerRoom || 2}`;
                        return (
                          <article key={i} style={S.roomCard}>
                            <div style={S.roomNameRow}>
                              <div style={S.roomName}>{rt.name || `Room type ${i + 1}`}</div>
                              {rt.count > 0 && <span style={S.roomCountBadge}>× {rt.count}</span>}
                            </div>
                            <div style={S.roomMeta}>Sleeps {sleeps}{rt.isAC ? " · ❄️ AC" : ""}</div>
                            {rt.description && <div style={{ ...S.roomMeta, fontSize: 11, color: "#b09080", lineHeight: 1.5 }}>{rt.description}</div>}
                            {rt.pricePerNight > 0 && (
                              <div>
                                <span style={S.roomPrice}>₹{formatINR(rt.pricePerNight)}</span>
                                <span style={S.roomPriceLbl}>/ night</span>
                              </div>
                            )}
                          </article>
                        );
                      })}
                    </div>
                    {(accTotalCap > 0 || accTotalRooms > 0) && (
                      <div style={S.totalCapNote}>
                        {accTotalCap > 0 && <><strong style={{ color: "#2c1810" }}>Total capacity: {accTotalCap} guests</strong></>}
                        {accTotalCap > 0 && accTotalRooms > 0 && <> across </>}
                        {accTotalRooms > 0 && <><strong style={{ color: "#2c1810" }}>{accTotalRooms} rooms</strong></>}
                      </div>
                    )}
                  </>
                ) : (
                  (Number(acc.rooms) > 0 || accTotalCap > 0) && (
                    <div style={S.simpleAccomCard}>
                      <div style={S.simpleAccomNum}>{accTotalRooms || acc.rooms || accTotalCap}</div>
                      <div>
                        <div style={{ fontFamily: "Georgia, serif", fontSize: 17, color: "#2c1810" }}>
                          {accTotalRooms || acc.rooms ? `${accTotalRooms || acc.rooms} rooms on-site` : `${accTotalCap} guests can stay`}
                        </div>
                        <div style={{ fontSize: 12, color: "#7a5a48", marginTop: 4 }}>Talk to the venue for room types and pricing.</div>
                      </div>
                    </div>
                  )
                )}
              </section>
            )}

            {/* ───── 7. PRICING ───── */}
            {showPricingSection && (
              <section style={S.section}>
                <div style={S.sTitleWrap}>
                  <div style={S.sTitle}>Pricing</div>
                  <div style={S.sTitleRule} />
                  <div style={S.sTitleSub}>Transparent and clear — final pricing subject to package negotiation</div>
                </div>
                {hasTieredPricing ? (
                  <>
                    {/* Duration pill buttons — one per tier */}
                    <div style={S.calcTierPills}>
                      {tiers.map((t, i) => (
                        <button
                          key={i}
                          type="button"
                          style={safeTierIndex === i ? S.calcPillOn : S.calcPill}
                          onClick={() => setSelectedTierIndex(i)}
                        >
                          {t.hours ? `${t.hours} hrs` : `Tier ${i + 1}`}
                        </button>
                      ))}
                    </div>

                    {/* Large gold price for the selected tier */}
                    <div style={S.calcPriceDisplay}>
                      <div style={S.calcPriceLabel}>
                        {selectedTier?.hours ? `${selectedTier.hours}-hour package` : "Package"}
                      </div>
                      <div style={S.calcPriceBig}>
                        {selectedTierPrice > 0 ? `₹${formatINR(selectedTierPrice)}` : "Ask the venue"}
                      </div>
                      <div style={S.calcPriceSub}>venue cost</div>
                    </div>

                    {/* Guest count + catering math (only if per-plate exists) */}
                    {(perPlateVeg > 0 || perPlateNonVeg > 0) && (
                      <div style={S.calcGuestBlock}>
                        <label htmlFor="calc-guest-count" style={S.calcGuestLabel}>How many guests?</label>
                        <input
                          id="calc-guest-count"
                          type="number"
                          min={0}
                          max={10000}
                          placeholder="e.g. 250"
                          value={calcGuestCount}
                          onChange={(e) => setCalcGuestCount(e.target.value)}
                          style={S.calcGuestInput}
                        />
                        {numGuests > 0 && (
                          <div style={S.calcCateringRow}>
                            {perPlateVeg > 0 && (
                              <div style={S.calcCateringChip}>
                                <span style={S.calcCateringLbl}>🥦 Veg catering</span>
                                <span style={S.calcCateringVal}>₹{formatINR(cateringEstimateVeg)}</span>
                                <span style={S.calcCateringSub}>{numGuests} × ₹{formatINR(perPlateVeg)}</span>
                              </div>
                            )}
                            {perPlateNonVeg > 0 && (
                              <div style={S.calcCateringChip}>
                                <span style={S.calcCateringLbl}>🍖 Non-veg catering</span>
                                <span style={S.calcCateringVal}>₹{formatINR(cateringEstimateNonVeg)}</span>
                                <span style={S.calcCateringSub}>{numGuests} × ₹{formatINR(perPlateNonVeg)}</span>
                              </div>
                            )}
                          </div>
                        )}
                      </div>
                    )}

                    {/* Total estimate (venue + veg catering) */}
                    {totalEstimate > 0 && (
                      <div style={S.calcTotalCard}>
                        <div style={S.calcTotalLbl}>Estimated total</div>
                        <div style={S.calcTotalVal}>₹{formatINR(totalEstimate)}</div>
                        <div style={S.calcTotalSub}>
                          Venue ₹{formatINR(selectedTierPrice)}
                          {numGuests > 0 && cateringEstimateVeg > 0 && (
                            <> · veg catering ₹{formatINR(cateringEstimateVeg)}</>
                          )}
                        </div>
                      </div>
                    )}

                    {/* Booking chips */}
                    <div style={S.pricingChips}>
                      {securityDeposit > 0 && <span style={S.pricingChip}>🔒 Security deposit ₹{formatINR(securityDeposit)}</span>}
                      {advancePercent > 0 && <span style={S.pricingChip}>📅 Advance {advancePercent}% to book</span>}
                      {minDuration > 0 && <span style={S.pricingChip}>⏱ Minimum {minDuration}-hour booking</span>}
                    </div>

                    {/* Peak season warning */}
                    {peakMarkup > 0 && (
                      <div style={S.calcPeakWarn}>
                        <span aria-hidden="true">⚡</span>
                        <span>
                          <strong>Peak season +{peakMarkup}%</strong> — rates may be higher during November, December, and February.
                        </span>
                      </div>
                    )}

                    <div style={S.pricingFoot}>All prices in {pricing.currency || "INR"} · Final pricing subject to package negotiation</div>
                  </>
                ) : (
                  hasPricingNote && (
                    <div style={S.pricingNote}>&ldquo;{pricing.note}&rdquo;</div>
                  )
                )}
              </section>
            )}

            {/* ───── 8. POLICIES — 2×2 GRID ───── */}
            <section style={S.section}>
              <div style={S.sTitleWrap}>
                <div style={S.sTitle}>Policies & Rules</div>
                <div style={S.sTitleRule} />
              </div>
              <div style={S.policyGrid}>
                {/* CATERING */}
                <article style={S.policyCard}>
                  <div style={S.policyIcon} aria-hidden="true">🍽</div>
                  <div style={S.policyKicker}>Catering</div>
                  <div style={S.policyHeadline}>{catPolicyHeadline}</div>
                  {catPolicyType !== "in_house_only" && venue.cateringPolicy?.outsideKitchenFee > 0 && (
                    <div style={S.policyRow}>Outside kitchen fee: ₹{formatINR(venue.cateringPolicy.outsideKitchenFee)}</div>
                  )}
                  {catPolicyType !== "in_house_only" && venue.cateringPolicy?.outsideSetupFrom && (
                    <div style={S.policyRow}>Caterer setup access: {venue.cateringPolicy.outsideSetupFrom}</div>
                  )}
                  {Array.isArray(venue.cateringPolicy?.dietaryOptions) && venue.cateringPolicy.dietaryOptions.length > 0 && (
                    <div style={S.policyChipRow}>
                      {venue.cateringPolicy.dietaryOptions.map((d, i) => {
                        const key = String(d).toLowerCase();
                        const icon = key === "veg" ? "🥦" : key === "non-veg" || key === "non_veg" || key === "nonveg" ? "🍖" : key === "jain" ? "🫙" : key === "halal" ? "🥩" : "✦";
                        return <span key={i} style={S.policyChip}>{icon} {d}</span>;
                      })}
                    </div>
                  )}
                  {Array.isArray(venue.cateringPolicy?.cuisines) && venue.cateringPolicy.cuisines.length > 0 && (
                    <div style={S.policyChipRow}>
                      {venue.cateringPolicy.cuisines.slice(0, 6).map((c, i) => <span key={i} style={S.policyChip}>{c}</span>)}
                    </div>
                  )}
                </article>

                {/* DECORATION */}
                <article style={S.policyCard}>
                  <div style={S.policyIcon} aria-hidden="true">🎨</div>
                  <div style={S.policyKicker}>Decoration</div>
                  <div style={S.policyHeadline}>
                    {venue.decorPolicy?.outsideAllowed === false
                      ? "In-house decor only"
                      : "Outside decorators welcome"}
                  </div>
                  {venue.decorPolicy?.inHouseAvailable && (
                    <div style={S.policyRow}>✓ In-house decor team available</div>
                  )}
                  {venue.decorPolicy?.setupAccessFrom && (
                    <div style={S.policyRow}>Setup access: {venue.decorPolicy.setupAccessFrom}</div>
                  )}
                  {venue.decorPolicy?.restrictions && (
                    <div style={S.policyRestriction}>“{venue.decorPolicy.restrictions}”</div>
                  )}
                </article>

                {/* MUSIC */}
                <article style={musicPermissive ? S.policyCardSoft : S.policyCardWarn}>
                  <div style={S.policyIcon} aria-hidden="true">🎵</div>
                  <div style={S.policyKicker}>Music & Sound</div>
                  <div style={S.policyHeadline}>
                    {musicPermissive ? "DJ + live music welcome" : "Some restrictions apply"}
                  </div>
                  <div style={S.policyRow}>{mp.djAllowed !== false ? "✓" : "✗"} DJ allowed</div>
                  <div style={S.policyRow}>{mp.liveMusicAllowed !== false ? "✓" : "✗"} Live music allowed</div>
                  {mp.outdoorCurfew && <div style={S.policyRow}>🌙 Outdoor curfew: {mp.outdoorCurfew}</div>}
                  {mp.indoorCurfew && <div style={S.policyRow}>🏛 Indoor curfew: {mp.indoorCurfew}</div>}
                  {mp.inHouseSoundSystem && <div style={S.policyRow}>🔊 In-house sound system</div>}
                </article>

                {/* STAY & EXTRAS */}
                <article style={S.policyCard}>
                  <div style={S.policyIcon} aria-hidden="true">🏘</div>
                  <div style={S.policyKicker}>Stay & Extras</div>
                  <div style={S.policyHeadline}>House rules at a glance</div>
                  <div style={S.policyRow}>
                    🍷 Outside alcohol: {am?.outsideAlcohol === "yes" ? "Allowed" : am?.outsideAlcohol === "extra_charge" ? "Allowed with extra charge" : "Not allowed"}
                  </div>
                  <div style={S.policyRow}>🐾 Pets: {am?.petFriendly ? "Welcome" : "Not allowed"}</div>
                  <div style={S.policyRow}>🚬 Smoking: {am?.smokingAllowed ? "Designated areas" : "Not allowed indoors"}</div>
                  {venue.policies?.cancellation && (
                    <div style={S.policyRestriction}>Cancellation: {String(venue.policies.cancellation).slice(0, 140)}{String(venue.policies.cancellation).length > 140 ? "…" : ""}</div>
                  )}
                </article>
              </div>
            </section>

            {/* ───── 9. AMENITIES — ICON GRID ───── */}
            {(am || amenitiesArrayLegacy) && (
              <section style={S.section}>
                <div style={S.sTitleWrap}>
                  <div style={S.sTitle}>Amenities & Facilities</div>
                  <div style={S.sTitleRule} />
                </div>
                {am ? (
                  AMENITY_GROUPS.map((group) => {
                    const items = group.keys
                      .map((k) => ({ key: k, available: am[k] === true, meta: AMENITY_ICONS[k] }))
                      .filter((it) => it.meta && typeof am[it.key] === "boolean");
                    if (items.length === 0) return null;
                    return (
                      <div key={group.title} style={S.amSubGroup}>
                        <div style={S.amSubH}>{group.title}</div>
                        <div style={S.amIconGrid}>
                          {items.map((it) => (
                            <div key={it.key} style={it.available ? S.amIconItem : S.amIconItemOff}>
                              <span style={it.available ? S.amIcon : S.amIconOff} aria-hidden="true">{it.meta.icon}</span>
                              <span style={it.available ? S.amLabel : S.amLabelOff}>{it.meta.label}</span>
                            </div>
                          ))}
                        </div>
                      </div>
                    );
                  })
                ) : (
                  // Legacy array-of-strings fallback
                  <div style={S.amIconGrid}>
                    {amenitiesArrayLegacy.map((a) => (
                      <div key={a} style={S.amIconItem}>
                        <span style={S.amIcon} aria-hidden="true">✦</span>
                        <span style={S.amLabel}>{String(a).replace(/_/g, " ").replace(/\b\w/g, (l) => l.toUpperCase())}</span>
                      </div>
                    ))}
                  </div>
                )}
              </section>
            )}

            {/* ───── 10. CONTACT ───── */}
            {venue.contact?.primaryName && (
              <section style={S.section}>
                <div style={S.sTitleWrap}>
                  <div style={S.sTitle}>Speak to someone at {venue.name}</div>
                  <div style={S.sTitleRule} />
                </div>
                <div style={S.contactCard}>
                  <div style={S.contactName}>{venue.contact.primaryName}</div>
                  <div style={S.contactRole}>Venue Coordinator</div>
                  <div>
                    {venue.contact.primaryPhone && (
                      <a href={`tel:${venue.contact.primaryPhone}`} style={S.contactLink}>
                        <span aria-hidden="true">📞</span> {venue.contact.primaryPhone}
                      </a>
                    )}
                    {venue.contact.email && (
                      <a href={`mailto:${venue.contact.email}`} style={S.contactLink}>
                        <span aria-hidden="true">✉️</span> {venue.contact.email}
                      </a>
                    )}
                  </div>
                  {(venue.contact.bestTimeToReach || (Array.isArray(venue.contact.languages) && venue.contact.languages.length > 0)) && (
                    <div style={S.contactChips}>
                      {venue.contact.bestTimeToReach && (
                        <span style={S.contactChip}>🕒 Best time: {venue.contact.bestTimeToReach}</span>
                      )}
                      {Array.isArray(venue.contact.languages) && venue.contact.languages.map((l, i) => (
                        <span key={i} style={S.contactChip}>🗣 {l}</span>
                      ))}
                    </div>
                  )}
                  <div style={S.contactTag}>Connect directly with {venue.contact.primaryName} at {venue.name}.</div>
                </div>
              </section>
            )}

            {/* ───── 11. LOCATION & SURROUNDINGS ───── */}
            {Array.isArray(venue.location?.coordinates) && venue.location.coordinates.length === 2 && (() => {
              const [lng, lat] = venue.location.coordinates;
              const mapsKey = "AIzaSyBX3lYHUerv0i4Yje05KKCxI2DGyM0KooY";
              return (
                <section style={S.section}>
                  <div style={S.sTitleWrap}>
                    <div style={S.sTitle}>Location & Surroundings</div>
                    <div style={S.sTitleRule} />
                  </div>
                  <div style={S.locMapWrap}>
                    <iframe
                      title={`Map of ${venue.name}`}
                      src={`https://www.google.com/maps/embed/v1/place?key=${mapsKey}&q=${lat},${lng}&zoom=14`}
                      style={S.locMap}
                      loading="lazy"
                      referrerPolicy="no-referrer-when-downgrade"
                      allowFullScreen
                    />
                  </div>
                  {venue.locationDescription && (
                    <p style={S.locDesc}>{venue.locationDescription}</p>
                  )}
                  <a
                    href={`https://www.google.com/maps?q=${lat},${lng}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    style={S.locMapsBtn}
                  >
                    <span aria-hidden="true">📍</span> View on Google Maps <span aria-hidden="true">→</span>
                  </a>
                </section>
              );
            })()}

            {/* FAQ / Reviews / Nearby / Similar moved to full-width bands below the grid (rendered after </div> closing bodyV3). */}
          </div>

          {/* SIDEBAR (320px sticky) */}
          <aside style={S.sidebarV3}>
            {/* Chat card */}
            <div style={S.sideCard}>
              <div style={S.sideChatHeader}>
                <div style={S.sideAvatarBig}>
                  {venueInitial}
                  <span style={S.sideOnlineDot} aria-hidden="true" />
                </div>
                <div style={S.sideVname}>{venue.name}</div>
                <div style={S.sideStatus}><span style={S.onlineDot} /> Usually replies in 2 hours</div>
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
                  style={{ ...S.chatBtn, opacity: submitting ? 0.7 : (authUser ? 1 : 0.85), boxShadow: "0 4px 16px rgba(107,30,46,0.25)" }}
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
                {error && <div style={{ fontSize: 11, color: '#c0392b', textAlign: 'center', marginTop: 4 }}>{error}</div>}
                {submitted && authUser && conversationId && (
                  <>
                    <div style={{ fontSize: 12, color: '#2d6a4f', textAlign: 'center', marginTop: 6, lineHeight: 1.5 }}>✓ Your details have been shared with the venue. They will respond shortly.</div>
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
                  <div style={{ fontSize: 12, color: '#7a5a48', textAlign: 'center', marginTop: 8, lineHeight: 1.6 }}>
                    <div style={{ color: '#2d6a4f', marginBottom: 6 }}>✓ Enquiry sent! The venue will respond shortly.</div>
                    <button
                      type="button"
                      onClick={openLogin}
                      style={{ background: 'none', border: 'none', padding: 0, color: '#6b1e2e', textDecoration: 'underline', cursor: 'pointer', font: 'inherit' }}
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

            {/* Quick facts card */}
            <div style={S.sideQfCard}>
              <div style={S.sideQfTitle}>Quick facts</div>
              {[
                { icon: "🍽", q: "Outside caterer?", a: catPolicyLabel },
                { icon: "🎨", q: "Outside decorator?", a: venue.decorPolicy?.outsideAllowed === false ? "In-house only" : "Permitted" },
                { icon: "🎵", q: "Sound curfew?", a: mp.outdoorCurfew ? `Outdoor: ${mp.outdoorCurfew}` : "Confirm with venue" },
                { icon: "🧾", q: "Advance to book?", a: advancePercent > 0 ? `${advancePercent}% to confirm` : "~30% to confirm" },
              ].map((item, i, arr) => (
                <div key={i} style={{ ...S.sideQfItem, borderBottom: i < arr.length - 1 ? "0.5px solid #f7eedb" : "none" }}>
                  <span style={S.sideQfIcon} aria-hidden="true">{item.icon}</span>
                  <div style={{ flex: 1, minWidth: 0 }}>
                    <div style={S.sideQfQ}>{item.q}</div>
                    <div style={S.sideQfA}>{item.a}</div>
                  </div>
                </div>
              ))}
            </div>

            {/* Concierge nudge */}
            <div style={S.sideConcierge}>
              <div style={S.sideConciergeH}>Not sure this is right for you?</div>
              <div style={S.sideConciergeBody}>
                Tell Wedsy Concierge your vision and we'll match you against every venue in Bangalore.
              </div>
              <Link href="/" style={S.sideConciergeLink}>Tell Wedsy Concierge your vision →</Link>
            </div>

            {/* Claim link */}
            <div style={{ textAlign: 'center' }}>
              <a href={'/venue-claim/' + venue.slug} style={{ fontSize: 11, color: '#b09080', textDecoration: 'none', borderBottom: '0.5px solid #e8d8c4', paddingBottom: 2 }}>
                Is this your venue? Claim it →
              </a>
            </div>

            {/* Security note */}
            <div style={S.sideSecurity}>
              <span aria-hidden="true">🛡</span> Conversation secured by Wedsy. If the venue doesn't respond within 24 hours, our team steps in.
            </div>
          </aside>
        </div>

        {/* ───── 12. GOOGLE REVIEWS — full-width band (white) ───── */}
        {reviewsList.length > 0 && (
          <section style={{ ...S.fwBand, ...S.fwBandWhite }}>
            <div style={S.fwBandInner}>
              <div style={S.sTitleWrap}>
                <div style={S.sTitle}>What couples say</div>
                <div style={S.sTitleRule} />
                <div style={S.sTitleSub}>
                  {reviews?.rating ? <><span style={{ color: "#b8852a" }}>★</span> <strong style={{ color: "#2c1810", fontWeight: 500 }}>{reviews.rating}</strong></> : null}
                  {reviews?.rating && reviews?.total ? <span style={{ color: "#e8d8c4", margin: "0 6px" }}>·</span> : null}
                  {reviews?.total ? <span>{reviews.total} reviews on Google</span> : null}
                </div>
              </div>
              <div style={S.reviewScroller}>
                {reviewsList.slice(0, 8).map((r, i) => {
                  const isExpanded = !!expandedReviews[i];
                  const text = r.text || "";
                  const needsTruncate = text.length > REVIEW_PREVIEW_CHARS;
                  const shownText = !needsTruncate || isExpanded ? text : text.slice(0, REVIEW_PREVIEW_CHARS).trimEnd() + "…";
                  const rating = Math.round(Number(r.rating) || 0);
                  const avatarBg = reviewAvatarColors[i % reviewAvatarColors.length];
                  return (
                    <article key={i} style={S.reviewCard}>
                      <div style={S.reviewHead}>
                        <div style={{ ...S.reviewAvatar, background: avatarBg }}>{initialsFromName(r.authorName)}</div>
                        <div style={{ flex: 1, minWidth: 0 }}>
                          <div style={S.reviewerName}>{r.authorName || "Anonymous"}</div>
                          <div style={S.reviewMeta}>
                            <span style={S.reviewStars}>
                              {"★★★★★".slice(0, rating)}
                              <span style={S.reviewStarsOff}>{"★★★★★".slice(rating)}</span>
                            </span>
                            <span style={{ color: "#e8d8c4" }}>·</span>
                            <span>{formatRelativeTime(r.time)}</span>
                          </div>
                        </div>
                      </div>
                      <div style={S.reviewText}>
                        {shownText}
                        {needsTruncate && (
                          <>
                            {" "}
                            <button
                              type="button"
                              onClick={() => setExpandedReviews((prev) => ({ ...prev, [i]: !prev[i] }))}
                              style={S.reviewMoreBtn}
                            >
                              {isExpanded ? "Show less" : "Read more"}
                            </button>
                          </>
                        )}
                      </div>
                    </article>
                  );
                })}
              </div>
              <div style={S.reviewFooter}>
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
          </section>
        )}

        {/* ───── 13. NEARBY ACCOMMODATION — full-width band (ivory) ───── */}
        {nearbySorted.length > 0 && (
          <section style={{ ...S.fwBand, ...S.fwBandIvory }}>
            <div style={S.fwBandInner}>
              <div style={S.sTitleWrap}>
                <div style={S.sTitle}>Nearby stays for your guests</div>
                <div style={S.sTitleRule} />
              </div>
              <div style={S.nearbyIntro}>For your guests · Within 5km of this venue</div>
              <div style={S.nearbyGrid}>
                {nearbySorted.slice(0, 6).map((hotel, i) => {
                  const vicinityShort = hotel.vicinity && hotel.vicinity.length > 60
                    ? hotel.vicinity.slice(0, 60).trimEnd() + "…"
                    : (hotel.vicinity || "");
                  const priceTier = (() => {
                    const lvl = hotel.priceLevel;
                    if (typeof lvl !== "number" || lvl <= 0) return null;
                    const clamped = Math.max(1, Math.min(4, lvl));
                    const label = ["Budget", "Mid-range", "Upscale", "Luxury"][clamped - 1];
                    return { symbols: "₹".repeat(clamped), label };
                  })();
                  return (
                    <a
                      key={hotel.placeId || i}
                      href={`https://www.google.com/maps/place/?q=place_id:${hotel.placeId}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      style={S.nearbyCard}
                      onMouseEnter={(e) => { e.currentTarget.style.transform = "translateY(-2px)"; }}
                      onMouseLeave={(e) => { e.currentTarget.style.transform = "translateY(0)"; }}
                    >
                      <div style={S.nearbyImg}>
                        {hotel.photoReference ? (
                          <img
                            src={`/api/places-photo?ref=${encodeURIComponent(hotel.photoReference)}`}
                            alt={hotel.name || "Hotel"}
                            style={{ width: "100%", height: "100%", objectFit: "cover" }}
                          />
                        ) : (
                          <span style={{ fontSize: 28, opacity: 0.25 }}>🏨</span>
                        )}
                        {typeof hotel.distanceKm === "number" && (
                          <span style={S.nearbyDistance}>{hotel.distanceKm} km</span>
                        )}
                      </div>
                      <div style={S.nearbyBody}>
                        <div style={{ fontFamily: "Georgia, serif", fontSize: 15, color: "#2c1810", marginBottom: 4, lineHeight: 1.3 }}>
                          {hotel.name}
                        </div>
                        {vicinityShort && (
                          <div style={{ fontSize: 11, color: "#b09080", marginBottom: 8, lineHeight: 1.4 }}>
                            {vicinityShort}
                          </div>
                        )}
                        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", gap: 4 }}>
                          {typeof hotel.rating === "number" ? (
                            <span style={{ fontSize: 12, color: "#b8852a", fontWeight: 500 }}>★ {hotel.rating}</span>
                          ) : <span />}
                          {priceTier && (
                            <span
                              title={priceTier.label}
                              style={{
                                fontSize: 11,
                                color: "#b8852a",
                                fontWeight: 600,
                                background: "rgba(184,133,42,0.10)",
                                border: "0.5px solid rgba(184,133,42,0.35)",
                                borderRadius: 100,
                                padding: "2px 9px",
                                letterSpacing: 0.3,
                                display: "inline-flex",
                                alignItems: "center",
                                gap: 4,
                              }}
                            >
                              <span>{priceTier.symbols}</span>
                              <span style={{ fontSize: 9, color: "#7a5a48", fontWeight: 500, textTransform: "uppercase", letterSpacing: 0.5 }}>
                                {priceTier.label}
                              </span>
                            </span>
                          )}
                        </div>
                      </div>
                    </a>
                  );
                })}
              </div>
              <div style={{ marginTop: 14, fontSize: 10, color: "#b09080", textAlign: "right", letterSpacing: 0.3 }}>
                Powered by Google
              </div>
            </div>
          </section>
        )}

        {/* ───── 14. SIMILAR VENUES — full-width band (white) ───── */}
        {similar.length > 0 && (
          <section style={{ ...S.fwBand, ...S.fwBandWhite }}>
            <div style={S.fwBandInner}>
              <div style={S.sTitleWrap}>
                <div style={S.sTitle}>You might also love</div>
                <div style={S.sTitleRule} />
                <div style={S.sTitleSub}>Similar venues nearby</div>
              </div>
              <div style={S.simGrid}>
                {similar.map((v) => (
                  <Link
                    key={v._id}
                    href={`/venues/${v.slug}`}
                    style={S.simCardV3}
                    onMouseEnter={(e) => { e.currentTarget.style.transform = "translateY(-3px)"; e.currentTarget.style.boxShadow = "0 8px 28px rgba(107,30,46,0.14)"; }}
                    onMouseLeave={(e) => { e.currentTarget.style.transform = "translateY(0)"; e.currentTarget.style.boxShadow = "0 2px 16px rgba(107,30,46,0.06)"; }}
                  >
                    <div style={{ ...S.simImgV3, background: v.venueType === "farmhouse" ? "#deeade" : v.venueType === "resort" ? "#f0e2c8" : "#e8e0f0" }}>
                      {v.coverPhoto ? <img src={v.coverPhoto} alt={v.name} style={{ width: "100%", height: "100%", objectFit: "cover" }} /> : <span style={{ fontSize: 36 }}>🏡</span>}
                    </div>
                    <div style={S.simBodyV3}>
                      <div style={S.simNameV3}>{v.name}</div>
                      <div style={{ fontSize: 12, color: "#b09080", marginBottom: 10, letterSpacing: 0.2 }}>
                        {v.address?.split(",")[0] || "Bangalore"} · {v.venueType}
                      </div>
                      <div style={S.simFoot}>
                        <div style={S.simPrice}>{v.pricing?.note || "Price on request"}</div>
                        {v.googleRating && <div style={{ fontSize: 12, color: "#b8852a", fontWeight: 500 }}>★ {v.googleRating}</div>}
                      </div>
                    </div>
                  </Link>
                ))}
              </div>
            </div>
          </section>
        )}

        {/* ───── 11. FAQ / ASK DIRECTLY — full-width band (white) ───── */}
        <section style={{ ...S.fwBand, ...S.fwBandWhite }}>
          <div style={S.fwBandInner}>
            <div style={S.sTitleWrap}>
              <div style={S.sTitle}>Ask the venue directly</div>
              <div style={S.sTitleRule} />
              <div style={S.sTitleSub}>Tap any question to send it when you start the chat.</div>
            </div>
            <div style={S.faqList}>
              {faqEntries.map((item, i) => (
                <div
                  key={i}
                  style={S.faqCard}
                  onMouseEnter={(e) => { e.currentTarget.style.borderLeftColor = "#6b1e2e"; e.currentTarget.style.transform = "translateX(2px)"; }}
                  onMouseLeave={(e) => { e.currentTarget.style.borderLeftColor = "transparent"; e.currentTarget.style.transform = "translateX(0)"; }}
                >
                  <div style={S.faqText}>{item.q}</div>
                  <span style={S.faqArrow} aria-hidden="true">→</span>
                </div>
              ))}
            </div>
          </div>
        </section>
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
    // Lazy-generate the location blurb once if missing. The endpoint is
    // idempotent — it persists the result and returns cached values on every
    // subsequent SSR, so this only hits Claude on the first view per venue.
    if (
      venue &&
      Array.isArray(venue.location?.coordinates) &&
      venue.location.coordinates.length === 2 &&
      !venue.locationDescription
    ) {
      try {
        const r = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/venues/${slug}/generate-location-description`, { method: "POST" });
        if (r.ok) {
          const j = await r.json();
          if (j && j.locationDescription) venue.locationDescription = j.locationDescription;
        }
      } catch (e) {}
    }
    return { props: { venue, similar, nearby, reviews } };
  } catch (err) {
    console.error("Venue detail SSR error:", err.message);
    return { notFound: true };
  }
}
