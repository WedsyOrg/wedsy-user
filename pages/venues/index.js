import Head from "next/head";
import Link from "next/link";
import { useState, useCallback, useMemo, useEffect, useRef } from "react";

import { trimTitle, trimDescription } from "@/utils/seo";

// ─── Filter option vocabularies ───
const VENUE_TYPE_TABS = [
  { value: "", label: "All" },
  { value: "resort", label: "Resorts" },
  { value: "farmhouse", label: "Farmhouses" },
  { value: "villa", label: "Villas" },
];

const CAPACITY_OPTIONS = [
  { value: "", label: "Any capacity" },
  { value: "0-100", label: "Up to 100" },
  { value: "100-250", label: "100 – 250" },
  { value: "250-500", label: "250 – 500" },
  { value: "500+", label: "500+" },
];

const PRICE_OPTIONS = [
  { value: "", label: "Any price" },
  { value: "0-200000", label: "Under ₹2L" },
  { value: "200000-500000", label: "₹2L – ₹5L" },
  { value: "500000-1000000", label: "₹5L – ₹10L" },
  { value: "1000000+", label: "Above ₹10L" },
];

// Zones map 1:1 to venue.zone enum values on the backend (see models/Venue.js).
// "all" is the no-filter sentinel — never sent as a query param.
const ZONES = [
  { value: "all", label: "All" },
  { value: "airport", label: "Near Airport" },
  { value: "north", label: "North" },
  { value: "east", label: "East" },
  { value: "south", label: "South" },
  { value: "west", label: "West" },
  { value: "central", label: "Central" },
];

// Pretty labels for the zone chip on venue cards.
const ZONE_LABEL = {
  airport: "Near Airport",
  north: "North Bangalore",
  east: "East Bangalore",
  south: "South Bangalore",
  west: "West Bangalore",
  central: "Central Bangalore",
};

// Top-level category pills in the sticky filter bar. Maps to venue.venueType.
const CATEGORIES = [
  { value: "", label: "All" },
  { value: "resort", label: "Resorts" },
  { value: "farmhouse", label: "Farmhouses" },
  { value: "banquet_hall", label: "Banquet Halls" },
  { value: "hotel", label: "Hotels" },
  { value: "heritage", label: "Heritage" },
  { value: "club", label: "Clubs" },
];

// Amenity filter keys must match the venue.amenities schema so filtering works
// without a translation step.
const AMENITY_FILTERS = [
  { key: "swimmingPool", label: "Pool", icon: "🏊", path: ["amenities", "swimmingPool"] },
  { key: "accommodation", label: "Accommodation", icon: "🛏", path: ["accommodation", "available"] },
  { key: "generatorBackup", label: "Generator", icon: "🔌", path: ["amenities", "generatorBackup"] },
  { key: "parking", label: "Parking", icon: "🅿️", path: ["amenities", "parking"] },
  { key: "garden", label: "Outdoor lawn", icon: "🌿", path: ["amenities", "garden"] },
];

// Helpers
const formatINR = (n) => {
  if (typeof n !== "number" || !isFinite(n) || n <= 0) return null;
  try { return n.toLocaleString("en-IN"); } catch (e) { return String(n); }
};

// Derive a "lowest tier price" — used for sorting + the Under ₹X filter.
const venueLowestPrice = (v) => {
  const tiers = Array.isArray(v?.pricing?.tiers) ? v.pricing.tiers : [];
  const prices = tiers.map((t) => Number(t?.price) || 0).filter((p) => p > 0);
  return prices.length ? Math.min(...prices) : null;
};

// Max guest capacity from spaces (preferred) or legacy capacity.max.
const venueMaxCapacity = (v) => {
  const spaces = Array.isArray(v?.spaces) ? v.spaces : [];
  const fromSpaces = spaces.reduce(
    (acc, s) => Math.max(acc, Number(s?.capacitySeated) || 0, Number(s?.capacityStanding) || 0),
    0,
  );
  return Math.max(fromSpaces, Number(v?.capacity?.max) || 0);
};

const venueHasAmenity = (v, path) =>
  path.reduce((cur, k) => (cur && typeof cur === "object" ? cur[k] : undefined), v) === true;

// Capacity-bucket predicate matching CAPACITY_OPTIONS values
const inCapacityBucket = (cap, bucket) => {
  if (!bucket) return true;
  if (cap <= 0) return false;
  if (bucket === "0-100") return cap <= 100;
  if (bucket === "100-250") return cap > 100 && cap <= 250;
  if (bucket === "250-500") return cap > 250 && cap <= 500;
  if (bucket === "500+") return cap > 500;
  return true;
};

// Price-bucket predicate matching PRICE_OPTIONS values
const inPriceBucket = (price, bucket) => {
  if (!bucket) return true;
  if (price === null) return false;
  if (bucket === "0-200000") return price < 200000;
  if (bucket === "200000-500000") return price >= 200000 && price < 500000;
  if (bucket === "500000-1000000") return price >= 500000 && price < 1000000;
  if (bucket === "1000000+") return price >= 1000000;
  return true;
};

// ─── Styles (inline) ───
const C = { ivory: "#fdf6ec", ivoryWarm: "#fffaf4", burgundy: "#6b1e2e", gold: "#b8852a" };

const S = {
  page: { background: C.ivory, minHeight: "100vh", color: "#2c1810" },

  // HERO
  hero: {
    position: "relative",
    background: C.ivoryWarm,
    borderBottom: "0.5px solid #e8d8c4",
    padding: "5rem 2rem 3rem",
    textAlign: "center",
    overflow: "hidden",
    backgroundImage:
      "radial-gradient(circle at 15% 20%, rgba(184,133,42,0.12), transparent 45%), radial-gradient(circle at 85% 80%, rgba(184,133,42,0.10), transparent 50%), radial-gradient(circle at 50% 100%, rgba(107,30,46,0.06), transparent 55%)",
  },
  heroEyebrow: { fontSize: 11, letterSpacing: 3, textTransform: "uppercase", color: C.gold, marginBottom: "1rem" },
  heroTitle: {
    fontFamily: "Georgia, 'Times New Roman', serif",
    fontSize: 52,
    fontWeight: 400,
    lineHeight: 1.06,
    letterSpacing: -1,
    color: "#2c1810",
    marginBottom: "0.85rem",
    maxWidth: 820,
    margin: "0 auto 0.85rem",
  },
  heroTitleEm: { fontStyle: "italic", color: C.burgundy },
  heroSub: { fontSize: 16, color: "#7a5a48", lineHeight: 1.65, maxWidth: 540, margin: "0 auto 2.25rem" },

  searchBar: {
    display: "flex",
    maxWidth: 680,
    margin: "0 auto 2rem",
    background: C.ivoryWarm,
    border: "0.5px solid #e8d8c4",
    borderRadius: 100,
    overflow: "hidden",
    boxShadow: "0 2px 24px rgba(107,30,46,0.06)",
  },
  searchInput: {
    flex: 1,
    background: "transparent",
    border: "none",
    padding: "0 1.5rem",
    fontSize: 14,
    color: "#2c1810",
    height: 52,
    outline: "none",
  },
  searchDivider: { width: 0.5, background: "#e8d8c4", margin: "10px 0" },
  searchSelect: {
    background: "transparent",
    border: "none",
    padding: "0 1rem",
    fontSize: 13,
    color: "#7a5a48",
    height: 52,
    outline: "none",
    cursor: "pointer",
  },
  searchBtn: {
    background: C.burgundy,
    border: "none",
    borderRadius: 100,
    margin: 6,
    padding: "0 24px",
    fontSize: 13,
    color: C.ivory,
    fontWeight: 500,
    cursor: "pointer",
    whiteSpace: "nowrap",
  },

  statsRow: {
    display: "flex",
    flexWrap: "wrap",
    justifyContent: "center",
    gap: "1rem 2.5rem",
    fontSize: 13,
    color: "#7a5a48",
  },
  statSep: { color: "#d8c4a8" },
  statNum: { color: "#2c1810", fontWeight: 500 },

  // TYPE TABS
  tabsWrap: {
    display: "flex",
    justifyContent: "center",
    gap: 8,
    padding: "1.5rem 2rem",
    background: C.ivoryWarm,
    borderBottom: "0.5px solid #e8d8c4",
    flexWrap: "wrap",
  },
  tab: {
    padding: "8px 18px",
    borderRadius: 100,
    border: "0.5px solid #e8d8c4",
    background: C.ivoryWarm,
    color: "#7a5a48",
    fontSize: 13,
    fontWeight: 500,
    cursor: "pointer",
  },
  tabOn: {
    padding: "8px 18px",
    borderRadius: 100,
    border: "0.5px solid " + C.burgundy,
    background: C.burgundy,
    color: C.ivory,
    fontSize: 13,
    fontWeight: 500,
    cursor: "pointer",
  },

  // FEATURED
  featuredSec: { padding: "2.5rem 2rem 1.5rem", maxWidth: 1400, margin: "0 auto" },
  featuredKicker: { fontSize: 11, textTransform: "uppercase", letterSpacing: 2.4, color: C.gold, fontWeight: 500, marginBottom: 6 },
  featuredTitle: {
    fontFamily: "Georgia, 'Times New Roman', serif",
    fontSize: 26,
    fontWeight: 400,
    color: "#2c1810",
    marginBottom: 20,
    letterSpacing: -0.3,
  },
  featuredGrid: { display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(300px, 1fr))", gap: 18 },

  // BODY
  body: { display: "grid", gridTemplateColumns: "260px 1fr", gap: "1.75rem", padding: "1.5rem 2rem 0", maxWidth: 1400, margin: "0 auto", alignItems: "start" },

  // SIDEBAR
  sidebar: { display: "flex", flexDirection: "column", gap: 12, position: "sticky", top: 16 },
  filterCard: {
    background: C.ivoryWarm,
    border: "0.5px solid #e8d8c4",
    borderRadius: 14,
    padding: "1.1rem 1.25rem",
    boxShadow: "0 2px 16px rgba(107,30,46,0.04)",
  },
  filterHeader: {
    fontSize: 10,
    textTransform: "uppercase",
    letterSpacing: 1.4,
    color: C.gold,
    fontWeight: 500,
    marginBottom: 12,
  },
  filterOption: { display: "flex", alignItems: "center", gap: 9, marginBottom: 9, cursor: "pointer" },
  filterLabel: { fontSize: 13, color: "#3a2820", flex: 1, cursor: "pointer" },
  filterCount: { fontSize: 10, color: "#b09080", background: "#fdf4e6", padding: "2px 8px", borderRadius: 100, border: "0.5px solid #f0e4d0" },
  filterSelect: {
    width: "100%",
    height: 38,
    border: "0.5px solid #e8d8c4",
    background: C.ivory,
    borderRadius: 10,
    padding: "0 10px",
    fontSize: 13,
    color: "#3a2820",
    outline: "none",
    cursor: "pointer",
  },
  filterToggleRow: { display: "flex", alignItems: "center", justifyContent: "space-between", gap: 12 },
  filterToggleText: { fontSize: 13, color: "#3a2820" },
  filterTogglePill: { width: 36, height: 20, borderRadius: 100, padding: 2, cursor: "pointer", border: "none", flexShrink: 0 },
  filterToggleKnob: { width: 16, height: 16, borderRadius: "50%", background: "#fff", transition: "transform 0.18s ease" },
  resetBtn: {
    width: "100%",
    height: 38,
    border: "0.5px solid " + C.burgundy,
    background: C.ivoryWarm,
    color: C.burgundy,
    borderRadius: 100,
    fontSize: 12,
    fontWeight: 500,
    cursor: "pointer",
  },

  // RESULTS
  main: { minWidth: 0 },
  resultsHeader: { display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 16, flexWrap: "wrap", gap: 12 },
  resultsCount: { fontSize: 14, color: "#7a5a48" },
  resultsCountStrong: { color: "#2c1810", fontWeight: 500 },
  sortSelect: {
    height: 34,
    border: "0.5px solid #e8d8c4",
    borderRadius: 100,
    padding: "0 14px",
    fontSize: 12,
    color: "#7a5a48",
    background: C.ivoryWarm,
    outline: "none",
    cursor: "pointer",
  },
  grid: { display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(290px, 1fr))", gap: 16 },

  // Location two-level filter (zone tabs + area search) — sits above the grid
  locationFilterWrap: { display: "flex", flexDirection: "column", gap: 12, marginBottom: 18 },
  zoneTabsRow: { display: "flex", flexWrap: "wrap", gap: 6 },
  zoneTab: { padding: "7px 14px", borderRadius: 100, border: "0.5px solid #e8d8c4", background: C.ivoryWarm, color: "#7a5a48", fontSize: 12, fontWeight: 500, cursor: "pointer", letterSpacing: 0.2 },
  zoneTabOn: { padding: "7px 14px", borderRadius: 100, border: "0.5px solid " + C.burgundy, background: C.burgundy, color: C.ivory, fontSize: 12, fontWeight: 500, cursor: "pointer", letterSpacing: 0.2 },
  areaSearchWrap: { position: "relative", width: "100%" },
  areaSearchInput: { width: "100%", height: 44, border: "0.5px solid #e8d8c4", background: C.ivoryWarm, borderRadius: 100, padding: "0 44px 0 18px", fontSize: 13, color: "#2c1810", outline: "none", boxSizing: "border-box" },
  areaSearchClear: { position: "absolute", top: "50%", right: 12, transform: "translateY(-50%)", width: 24, height: 24, borderRadius: "50%", border: "none", background: "#f0e4d0", color: "#7a5a48", fontSize: 14, lineHeight: 1, cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center" },
  locationNote: { fontSize: 11, color: "#b09080", lineHeight: 1.55, marginTop: 6 },
  cardZoneChip: { fontSize: 11, color: "#b09080", display: "flex", alignItems: "center", gap: 4, marginBottom: 10 },

  // Load more pagination
  loadMoreWrap: { display: "flex", justifyContent: "center", marginTop: 28, marginBottom: 12 },
  loadMoreBtn: { padding: "12px 32px", borderRadius: 100, border: "0.5px solid " + C.burgundy, background: C.ivoryWarm, color: C.burgundy, fontSize: 13, fontWeight: 500, cursor: "pointer", letterSpacing: 0.3 },
  loadMoreBtnBusy: { padding: "12px 32px", borderRadius: 100, border: "0.5px solid " + C.burgundy, background: C.ivoryWarm, color: C.burgundy, fontSize: 13, fontWeight: 500, cursor: "default", opacity: 0.55, letterSpacing: 0.3 },

  // CARDS
  card: {
    background: C.ivoryWarm,
    border: "0.5px solid #e8d8c4",
    borderRadius: 16,
    overflow: "hidden",
    textDecoration: "none",
    color: "inherit",
    display: "block",
    transition: "transform 0.18s ease, box-shadow 0.18s ease, border-color 0.18s ease",
  },
  cardImgWrap: { position: "relative", height: 220, overflow: "hidden", background: "#f0e2c8" },
  cardImg: { width: "100%", height: "100%", objectFit: "cover", display: "block" },
  cardImgPlaceholder: { width: "100%", height: "100%", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 44, color: "#b8852a", opacity: 0.4 },
  cardBadgeType: {
    position: "absolute", top: 12, left: 12,
    fontSize: 10, fontWeight: 500, letterSpacing: 0.5,
    padding: "5px 11px", borderRadius: 100,
    background: "rgba(253,246,236,0.95)", color: "#7a5a48",
    border: "0.5px solid rgba(232,196,122,0.4)",
    backdropFilter: "blur(6px)", WebkitBackdropFilter: "blur(6px)",
  },
  cardBadgeVerified: {
    position: "absolute", top: 12, right: 12,
    fontSize: 10, fontWeight: 500, letterSpacing: 0.5,
    padding: "5px 11px", borderRadius: 100,
    background: C.burgundy, color: C.ivory,
    display: "inline-flex", alignItems: "center", gap: 4,
  },
  cardBody: { padding: "14px 16px 16px" },
  cardName: {
    fontFamily: "Georgia, 'Times New Roman', serif",
    fontSize: 19, fontWeight: 400, letterSpacing: -0.2,
    color: "#2c1810", marginBottom: 4, lineHeight: 1.25,
  },
  cardLoc: { fontSize: 12, color: "#b09080", display: "flex", alignItems: "center", gap: 5, marginBottom: 10 },
  cardCapacityChip: {
    display: "inline-flex", alignItems: "center", gap: 4,
    fontSize: 11, padding: "3px 10px", borderRadius: 100,
    background: "#fdf4e6", border: "0.5px solid #f0e4d0", color: "#7a5a48",
    marginBottom: 10,
  },
  cardPriceRow: { display: "flex", alignItems: "baseline", justifyContent: "space-between", gap: 8, marginBottom: 10 },
  cardPrice: { fontFamily: "Georgia, serif", fontSize: 16, color: C.gold, fontWeight: 500 },
  cardPriceSub: { fontSize: 11, color: "#b09080" },
  cardAmens: { display: "flex", gap: 8, marginBottom: 10, fontSize: 14, color: C.burgundy },
  cardFooter: { display: "flex", alignItems: "center", justifyContent: "space-between", paddingTop: 10, borderTop: "0.5px solid #f0e4d0" },
  cardRating: { fontSize: 12, color: "#7a5a48", display: "flex", alignItems: "center", gap: 5 },
  cardRatingStar: { color: C.gold, fontSize: 11 },
  cardViewBtn: { fontSize: 11, color: C.burgundy, fontWeight: 500 },

  // Featured card variant — slightly bigger imagery
  fcard: {
    background: C.ivoryWarm,
    border: "0.5px solid #e8d4a8",
    borderRadius: 16,
    overflow: "hidden",
    textDecoration: "none",
    color: "inherit",
    display: "block",
    boxShadow: "0 2px 24px rgba(184,133,42,0.10)",
    transition: "transform 0.18s ease, box-shadow 0.18s ease",
  },
  fcardImgWrap: { position: "relative", height: 220, overflow: "hidden", background: "#f0e2c8" },

  // EMPTY
  empty: {
    textAlign: "center",
    padding: "4rem 2rem",
    background: C.ivoryWarm,
    border: "0.5px dashed #e8d8c4",
    borderRadius: 16,
    color: "#7a5a48",
  },
  emptyIcon: { fontSize: 40, marginBottom: 14, color: C.gold, opacity: 0.7 },
  emptyTitle: { fontFamily: "Georgia, serif", fontSize: 20, color: "#2c1810", marginBottom: 6 },
  emptyText: { fontSize: 13, marginBottom: 18 },
  emptyBtn: {
    padding: "9px 18px",
    borderRadius: 100,
    border: "0.5px solid " + C.burgundy,
    background: C.burgundy,
    color: C.ivory,
    fontSize: 13, fontWeight: 500, cursor: "pointer",
  },

  // BOTTOM CTA
  ownerBand: {
    background: C.ivoryWarm,
    borderTop: "0.5px solid #e8d8c4",
    padding: "2.5rem 2rem",
    textAlign: "center",
    marginTop: "3rem",
  },
  ownerKicker: { fontSize: 11, textTransform: "uppercase", letterSpacing: 2, color: C.gold, marginBottom: 8 },
  ownerHeadline: { fontFamily: "Georgia, serif", fontSize: 22, color: "#2c1810", marginBottom: 14 },
  ownerLink: {
    display: "inline-flex", alignItems: "center", gap: 6,
    padding: "10px 22px", borderRadius: 100,
    background: C.burgundy, color: C.ivory,
    textDecoration: "none", fontSize: 13, fontWeight: 500,
  },
};

// ─── Extended styles for the rebuilt page (sections 1-7) ───
Object.assign(S, {
  // SECTION 1 — Couture-style hero. No photography — typography + warm
  // champagne gradient + tiny gold ornament. Cream/ivory continuous with the
  // sections below so the page reads as one editorial spread.
  heroV3: { position: "relative", width: "100%", minHeight: "55vh", display: "flex", alignItems: "center", justifyContent: "center", overflow: "hidden", background: "linear-gradient(180deg, #fbf3e2 0%, #fdf6ec 48%, #f7ead0 100%)" },
  heroV3Bg: { position: "absolute", inset: 0, pointerEvents: "none", backgroundImage: "radial-gradient(ellipse 75% 50% at 50% -8%, rgba(184,133,42,0.20), transparent 60%), radial-gradient(circle at 12% 82%, rgba(107,30,46,0.08), transparent 50%), radial-gradient(circle at 88% 76%, rgba(184,133,42,0.14), transparent 55%)" },
  heroV3Glow: { position: "absolute", left: "50%", top: "32%", width: 720, height: 720, transform: "translate(-50%, -50%)", background: "radial-gradient(circle, rgba(255,235,180,0.32) 0%, transparent 65%)", pointerEvents: "none", filter: "blur(40px)" },
  heroV3Content: { position: "relative", zIndex: 2, textAlign: "center", maxWidth: 920, padding: "4rem 2rem 3rem", margin: "0 auto" },
  heroV3OrnamentTop: { display: "flex", justifyContent: "center", marginBottom: 24 },
  heroV3Eyebrow: { fontSize: 11, letterSpacing: 5.5, color: C.gold, textTransform: "uppercase", marginBottom: 32, fontWeight: 500 },
  heroV3Title: { fontFamily: "Georgia, 'Times New Roman', serif", fontSize: "clamp(3rem, 7.4vw, 6rem)", fontWeight: 400, lineHeight: 1.02, letterSpacing: -2, color: "#2c1810", margin: "0 auto 26px", maxWidth: 820 },
  heroV3TitleEm: { fontStyle: "italic", color: C.gold, fontWeight: 400 },
  heroV3Sub: { fontFamily: "Georgia, 'Times New Roman', serif", fontStyle: "italic", fontSize: 16, color: "#7a5a48", lineHeight: 1.75, maxWidth: 580, margin: "0 auto 42px" },
  heroV3SearchBar: { display: "flex", alignItems: "center", background: "#fffaf4", borderRadius: 100, padding: "8px 8px 8px 20px", border: "0.5px solid rgba(184,133,42,0.40)", boxShadow: "0 12px 48px rgba(107,30,46,0.10)", maxWidth: 580, margin: "0 auto 52px", gap: 10 },
  heroV3SearchIcon: { display: "inline-flex", alignItems: "center", flexShrink: 0 },
  heroV3SearchInput: { flex: 1, border: "none", outline: "none", padding: "12px 4px", fontSize: 15, color: "#2c1810", background: "transparent", fontFamily: "Georgia, 'Times New Roman', serif" },
  heroV3SearchBtn: { background: C.burgundy, color: C.ivory, border: "none", borderRadius: 100, padding: "12px 26px", fontSize: 13, fontWeight: 500, cursor: "pointer", letterSpacing: 0.6, whiteSpace: "nowrap", fontFamily: "Georgia, 'Times New Roman', serif" },
  heroV3Stats: { display: "flex", alignItems: "center", justifyContent: "center", gap: 40, flexWrap: "wrap", marginBottom: 32 },
  heroV3Stat: { display: "flex", flexDirection: "column", alignItems: "center", gap: 8, minWidth: 110 },
  heroV3StatNum: { fontFamily: "Georgia, 'Times New Roman', serif", fontSize: 44, color: C.gold, fontWeight: 400, letterSpacing: -1, lineHeight: 1 },
  heroV3StatNumWord: { fontFamily: "Georgia, 'Times New Roman', serif", fontSize: 28, color: C.gold, fontWeight: 400, lineHeight: 1, fontStyle: "italic", paddingTop: 8 },
  heroV3StatLbl: { fontSize: 10, color: "#7a5a48", letterSpacing: 2.8, textTransform: "uppercase", fontWeight: 500 },
  heroV3StatRule: { width: 0.5, height: 44, background: "rgba(184,133,42,0.4)" },
  heroV3Footnote: { fontSize: 10, letterSpacing: 4.5, color: "rgba(184,133,42,0.75)", textTransform: "uppercase", fontWeight: 500 },

  // SECTION 2 — Why Wedsy
  whySec: { background: C.ivory, padding: "4rem 2rem" },
  whyInner: { maxWidth: 1200, margin: "0 auto" },
  whyEyebrow: { fontSize: 11, letterSpacing: 2.5, color: C.gold, textTransform: "uppercase", textAlign: "center", marginBottom: 36, fontWeight: 500 },
  whyGrid: { display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(280px, 1fr))", gap: 22 },
  whyCard: { background: "#ffffff", borderRadius: 16, padding: "2rem", boxShadow: "0 4px 24px rgba(107,30,46,0.07)", border: "0.5px solid #f0e4d0", display: "flex", flexDirection: "column", alignItems: "center", textAlign: "center", gap: 12 },
  whyIcon: { width: 52, height: 52, borderRadius: "50%", background: "#fdf4e6", display: "flex", alignItems: "center", justifyContent: "center", color: C.burgundy, marginBottom: 4 },
  whyTitle: { fontFamily: "Georgia, 'Times New Roman', serif", fontSize: 20, color: "#2c1810", fontWeight: 400, letterSpacing: -0.2 },
  whyDesc: { fontSize: 13, color: "#7a5a48", lineHeight: 1.65, maxWidth: 280 },

  // SECTION 3 — Vibes
  vibesSec: { background: "#ffffff", padding: "4rem 2rem" },
  vibesInner: { maxWidth: 1400, margin: "0 auto" },
  vibesEyebrow: { fontSize: 11, letterSpacing: 2.5, color: C.gold, textTransform: "uppercase", marginBottom: 8, fontWeight: 500 },
  vibesTitle: { fontFamily: "Georgia, 'Times New Roman', serif", fontSize: 32, fontWeight: 400, color: "#2c1810", letterSpacing: -0.6, marginBottom: 28, lineHeight: 1.1 },
  vibesRow: { display: "flex", gap: 14, overflowX: "auto", paddingBottom: 12, marginLeft: -4, marginRight: -4, paddingLeft: 4, paddingRight: 4, scrollbarWidth: "thin" },
  vibeCard: { flex: "0 0 280px", height: 360, borderRadius: 16, overflow: "hidden", position: "relative", border: "none", padding: 0, cursor: "pointer", background: "#2c1810" },
  vibeCardImg: { position: "absolute", inset: 0, width: "100%", height: "100%", objectFit: "cover", display: "block" },
  vibeCardOverlay: { position: "absolute", inset: 0, background: "linear-gradient(to top, rgba(0,0,0,0.85) 0%, rgba(0,0,0,0.35) 55%, rgba(0,0,0,0.05) 100%)", pointerEvents: "none" },
  vibeCardText: { position: "absolute", left: 20, right: 20, bottom: 22, color: "#fdf6ec", textAlign: "left" },
  vibeCardName: { fontFamily: "Georgia, 'Times New Roman', serif", fontSize: 24, fontWeight: 400, color: "#fdf6ec", letterSpacing: -0.3, marginBottom: 6, lineHeight: 1.15 },
  vibeCardDesc: { fontSize: 12, color: "rgba(253,246,236,0.85)", lineHeight: 1.5 },

  // SECTION 4 — Areas
  areasSec: { background: C.ivory, padding: "4rem 2rem" },
  areasInner: { maxWidth: 1200, margin: "0 auto" },
  areasEyebrow: { fontSize: 11, letterSpacing: 2.5, color: C.gold, textTransform: "uppercase", marginBottom: 8, fontWeight: 500 },
  areasTitle: { fontFamily: "Georgia, 'Times New Roman', serif", fontSize: 32, fontWeight: 400, color: "#2c1810", letterSpacing: -0.6, marginBottom: 28, lineHeight: 1.1 },
  areasGrid: { display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: 14 },
  zoneAreaCard: { position: "relative", height: 200, borderRadius: 14, overflow: "hidden", border: "none", padding: 0, cursor: "pointer", background: "#2c1810" },
  zoneAreaCardImg: { position: "absolute", inset: 0, width: "100%", height: "100%", objectFit: "cover", display: "block" },
  zoneAreaCardOverlay: { position: "absolute", inset: 0, background: "linear-gradient(to top, rgba(0,0,0,0.78) 0%, rgba(0,0,0,0.25) 55%, rgba(0,0,0,0.05) 100%)", pointerEvents: "none" },
  zoneAreaCardText: { position: "absolute", left: 18, right: 18, bottom: 16, color: "#fdf6ec", textAlign: "left" },
  zoneAreaCardName: { fontFamily: "Georgia, 'Times New Roman', serif", fontSize: 22, fontWeight: 400, color: "#fdf6ec", letterSpacing: -0.3, lineHeight: 1.15, marginBottom: 4 },
  zoneAreaCardCount: { fontSize: 12, color: C.gold, fontWeight: 500, letterSpacing: 0.3 },

  // SECTION 5 — Curated rows
  curatedSec: { background: "#ffffff", padding: "4rem 2rem" },
  curatedInner: { maxWidth: 1400, margin: "0 auto" },
  curatedEyebrow: { fontSize: 11, letterSpacing: 2.5, color: C.gold, textTransform: "uppercase", marginBottom: 32, fontWeight: 500 },
  curatedRow: { marginBottom: 40 },
  curatedRowHeader: { display: "flex", alignItems: "baseline", justifyContent: "space-between", gap: 12, marginBottom: 14, flexWrap: "wrap" },
  curatedRowTitle: { fontFamily: "Georgia, 'Times New Roman', serif", fontSize: 22, fontWeight: 400, color: "#2c1810", letterSpacing: -0.3, margin: 0 },
  curatedRowLink: { background: "transparent", border: "none", color: C.burgundy, fontSize: 12, fontWeight: 500, cursor: "pointer", letterSpacing: 0.2 },
  curatedRowScroll: { display: "flex", gap: 16, overflowX: "auto", paddingBottom: 8, marginLeft: -4, marginRight: -4, paddingLeft: 4, paddingRight: 4, scrollbarWidth: "thin" },
  curatedRowCard: { flex: "0 0 280px" },

  // SECTION 6 — All Venues wrapper
  allVenuesSec: { background: C.ivory, padding: "3rem 0 0" },
  allVenuesInner: { maxWidth: 1400, margin: "0 auto", padding: "0 2rem" },
  allVenuesTitle: { fontFamily: "Georgia, 'Times New Roman', serif", fontSize: 32, fontWeight: 400, color: "#2c1810", letterSpacing: -0.6, marginBottom: 24, lineHeight: 1.1, scrollMarginTop: 16 },

  // SECTION 7 — Owner CTA
  ownerCtaSec: { background: "#1a0208", padding: "5rem 2rem", textAlign: "center" },
  ownerCtaEyebrow: { fontSize: 11, letterSpacing: 2.5, color: C.gold, textTransform: "uppercase", marginBottom: 14, fontWeight: 500 },
  ownerCtaTitle: { fontFamily: "Georgia, 'Times New Roman', serif", fontSize: 36, fontWeight: 400, color: "#ffffff", letterSpacing: -0.6, marginBottom: 12, lineHeight: 1.1 },
  ownerCtaSub: { fontSize: 14, color: "rgba(253,246,236,0.7)", marginBottom: 28, maxWidth: 540, marginLeft: "auto", marginRight: "auto", lineHeight: 1.65 },
  ownerCtaBtns: { display: "inline-flex", gap: 12, flexWrap: "wrap", justifyContent: "center" },
  ownerCtaBtnPrimary: { display: "inline-flex", alignItems: "center", padding: "12px 28px", borderRadius: 100, background: C.ivory, color: C.burgundy, textDecoration: "none", fontSize: 14, fontWeight: 500, letterSpacing: 0.3 },
  ownerCtaBtnSecondary: { display: "inline-flex", alignItems: "center", padding: "12px 28px", borderRadius: 100, background: "transparent", color: C.ivory, textDecoration: "none", fontSize: 14, fontWeight: 500, border: "0.5px solid rgba(253,246,236,0.5)", letterSpacing: 0.3 },

  // STICKY FILTER BAR (sits above All Venues, becomes sticky on scroll)
  filterBar: { position: "sticky", top: 0, zIndex: 100, background: "#ffffff", borderBottom: "0.5px solid #e8d8c4", padding: "0 2rem", boxShadow: "0 1px 16px rgba(107,30,46,0.04)" },
  filterBarInner: { maxWidth: 1400, margin: "0 auto" },
  catPillsRow: { display: "flex", gap: 8, overflowX: "auto", padding: "16px 0 12px", scrollbarWidth: "none", msOverflowStyle: "none" },
  catPill: { flexShrink: 0, padding: "8px 16px", borderRadius: 100, border: "0.5px solid " + C.burgundy, background: C.ivory, color: C.burgundy, fontSize: 13, fontWeight: 500, cursor: "pointer", whiteSpace: "nowrap", letterSpacing: 0.2 },
  catPillOn: { flexShrink: 0, padding: "8px 16px", borderRadius: 100, border: "0.5px solid " + C.burgundy, background: C.burgundy, color: C.ivory, fontSize: 13, fontWeight: 500, cursor: "pointer", whiteSpace: "nowrap", letterSpacing: 0.2 },
  chipsRow: { display: "flex", gap: 10, flexWrap: "wrap", alignItems: "center", padding: "0 0 14px" },
  filterChipWrap: { position: "relative", display: "inline-block" },
  filterChip: { display: "inline-flex", alignItems: "center", gap: 6, padding: "10px 16px", borderRadius: 100, border: "0.5px solid " + C.burgundy, background: C.ivory, color: C.burgundy, fontSize: 12, fontWeight: 500, cursor: "pointer", letterSpacing: 0.2 },
  filterChipOn: { display: "inline-flex", alignItems: "center", gap: 6, padding: "10px 16px", borderRadius: 100, border: "0.5px solid " + C.burgundy, background: C.burgundy, color: C.ivory, fontSize: 12, fontWeight: 500, cursor: "pointer", letterSpacing: 0.2 },
  filterChipX: { display: "inline-flex", alignItems: "center", justifyContent: "center", width: 16, height: 16, borderRadius: "50%", background: "rgba(253,246,236,0.25)", color: C.ivory, fontSize: 11, lineHeight: 1, cursor: "pointer", marginLeft: 2, border: "none", padding: 0 },
  filterChipCaret: { fontSize: 9, opacity: 0.75, marginLeft: 2 },
  filterDropdown: { position: "absolute", top: "calc(100% + 8px)", left: 0, background: "#ffffff", borderRadius: 12, boxShadow: "0 12px 36px rgba(107,30,46,0.18)", padding: 14, minWidth: 220, zIndex: 110, border: "0.5px solid #e8d8c4" },
  filterDropdownItem: { display: "flex", alignItems: "center", gap: 10, padding: "8px 6px", cursor: "pointer", fontSize: 13, color: "#3a2820", borderRadius: 6 },
  resetLink: { marginLeft: "auto", background: "transparent", border: "none", color: C.burgundy, fontSize: 12, fontWeight: 500, cursor: "pointer", textDecoration: "underline", letterSpacing: 0.2 },

  // FULL-WIDTH ALL VENUES SECTION (replaces 2-col sidebar layout)
  allVenuesSecFull: { background: C.ivory, padding: "2.5rem 2rem 3rem" },
  allVenuesInnerFull: { maxWidth: 1400, margin: "0 auto" },
  allVenuesHeader: { display: "flex", alignItems: "baseline", justifyContent: "space-between", flexWrap: "wrap", gap: 12, marginBottom: 22 },
  allVenuesTitleFull: { fontFamily: "Georgia, 'Times New Roman', serif", fontSize: 28, fontWeight: 400, color: "#2c1810", letterSpacing: -0.5, margin: 0 },
  allVenuesCount: { fontSize: 13, color: "#7a5a48" },
  allVenuesCountStrong: { color: "#2c1810", fontWeight: 500 },
  sortRow: { display: "flex", justifyContent: "flex-end", marginBottom: 14 },
  fullWidthGrid: { display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(320px, 1fr))", gap: 24 },

  // MINI VENUE CARD (curated horizontal-scroll rows)
  miniCard: { flexShrink: 0, width: 280, display: "block", textDecoration: "none", color: "inherit", background: "#fffaf4", borderRadius: 10, border: "0.5px solid #e8d8c4", overflow: "hidden", transition: "transform 0.18s ease, box-shadow 0.18s ease, border-color 0.18s ease" },
  miniCardImgWrap: { width: "100%", height: 180, overflow: "hidden", background: "#f0e2c8" },
  miniCardImg: { width: "100%", height: "100%", objectFit: "cover", display: "block", borderRadius: "10px 10px 0 0" },
  miniCardImgPlaceholder: { width: "100%", height: "100%", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 36, color: C.gold, opacity: 0.4 },
  miniCardBody: { padding: "12px 14px 14px" },
  miniCardName: { fontFamily: "Georgia, 'Times New Roman', serif", fontSize: 15, color: "#2c1810", fontWeight: 400, letterSpacing: -0.2, marginBottom: 6, lineHeight: 1.25 },
  miniCardZone: { fontSize: 11, color: "#b09080", display: "flex", alignItems: "center", gap: 4, marginBottom: 10 },
  miniCardFooter: { display: "flex", alignItems: "baseline", justifyContent: "space-between", gap: 8, paddingTop: 8, borderTop: "0.5px solid #f0e4d0" },
  miniCardPrice: { fontSize: 13, color: C.gold, fontWeight: 500 },
  miniCardRating: { fontSize: 12, color: "#7a5a48" },
});

// ─── Card components ───
function PriceSignal({ venue }) {
  const lowest = venueLowestPrice(venue);
  if (lowest) {
    return (
      <div style={S.cardPriceRow}>
        <div style={S.cardPrice}>From ₹{formatINR(lowest)}</div>
        <div style={S.cardPriceSub}>venue cost</div>
      </div>
    );
  }
  const perPlateVeg = Number(venue?.pricing?.perPlate?.veg) || 0;
  if (perPlateVeg > 0) {
    return (
      <div style={S.cardPriceRow}>
        <div style={S.cardPrice}>₹{formatINR(perPlateVeg)}/plate</div>
        <div style={S.cardPriceSub}>veg per plate</div>
      </div>
    );
  }
  return (
    <div style={S.cardPriceRow}>
      <div style={{ ...S.cardPrice, color: "#7a5a48", fontSize: 14 }}>Price on request</div>
    </div>
  );
}

function AmenityIcons({ venue }) {
  const icons = [];
  if (venueHasAmenity(venue, ["amenities", "swimmingPool"])) icons.push("🏊");
  if (venueHasAmenity(venue, ["accommodation", "available"])) icons.push("🛏");
  if (venueHasAmenity(venue, ["amenities", "garden"])) icons.push("🌿");
  if (venueHasAmenity(venue, ["amenities", "parking"])) icons.push("🅿️");
  if (icons.length === 0) return null;
  return <div style={S.cardAmens}>{icons.map((ic, i) => <span key={i} aria-hidden="true">{ic}</span>)}</div>;
}

function VenueCard({ venue, featured = false }) {
  const isVerified = venue.status === "verified";
  const vTypeLabel = venue.venueType
    ? venue.venueType.charAt(0).toUpperCase() + venue.venueType.slice(1)
    : "Venue";
  const shortAddr = (venue.address || "Bangalore")
    .replace(", Bangalore", "")
    .replace(", Bengaluru", "")
    .replace("Bangalore", "")
    .trim() || "Bangalore";
  const cap = venueMaxCapacity(venue);
  const capacityText = cap > 0 ? `Up to ${cap} guests` : null;

  return (
    <Link
      href={`/venues/${venue.slug}`}
      className="venue-card"
      style={featured ? S.fcard : S.card}
    >
      <div style={featured ? S.fcardImgWrap : S.cardImgWrap}>
        {venue.coverPhoto ? (
          <img src={venue.coverPhoto} alt={venue.name} style={S.cardImg} loading="lazy" />
        ) : (
          <div style={S.cardImgPlaceholder}>🏡</div>
        )}
        <span style={S.cardBadgeType}>{vTypeLabel}</span>
        {isVerified && <span style={S.cardBadgeVerified}>✓ Verified</span>}
      </div>
      <div style={S.cardBody}>
        <div style={S.cardName}>{venue.name}</div>
        <div style={S.cardLoc}><span aria-hidden="true">📍</span> {shortAddr}</div>
        {venue.zone && ZONE_LABEL[venue.zone] && (
          <div style={S.cardZoneChip}>
            <span aria-hidden="true">📍</span> {ZONE_LABEL[venue.zone]}
          </div>
        )}
        {capacityText && <div style={S.cardCapacityChip}><span aria-hidden="true">👥</span> {capacityText}</div>}
        <PriceSignal venue={venue} />
        <AmenityIcons venue={venue} />
        <div style={S.cardFooter}>
          {venue.googleRating ? (
            <div style={S.cardRating}>
              <span style={S.cardRatingStar}>★</span> {venue.googleRating}
              {venue.googleReviewCount > 0 && <span style={{ color: "#b09080" }}>({venue.googleReviewCount})</span>}
            </div>
          ) : <span />}
          <span style={S.cardViewBtn}>View →</span>
        </div>
      </div>
    </Link>
  );
}

// Compact card used in the curated horizontal-scroll rows. Same data
// model as VenueCard, but fixed-width (280px) with a shorter 180px photo.
function MiniVenueCard({ venue }) {
  const shortAddr = (venue.address || "Bangalore")
    .replace(", Bangalore", "")
    .replace(", Bengaluru", "")
    .replace("Bangalore", "")
    .trim() || "Bangalore";
  return (
    <Link href={`/venues/${venue.slug}`} style={S.miniCard} className="venue-card">
      <div style={S.miniCardImgWrap}>
        {venue.coverPhoto ? (
          <img src={venue.coverPhoto} alt={venue.name} style={S.miniCardImg} loading="lazy" />
        ) : (
          <div style={S.miniCardImgPlaceholder}>🏡</div>
        )}
      </div>
      <div style={S.miniCardBody}>
        <div style={S.miniCardName}>{venue.name}</div>
        {venue.zone && ZONE_LABEL[venue.zone] && (
          <div style={S.miniCardZone}>
            <span aria-hidden="true">📍</span> {ZONE_LABEL[venue.zone]}
          </div>
        )}
        <div style={S.miniCardFooter}>
          <div style={S.miniCardPrice}><PriceSignal venue={venue} /></div>
          {venue.googleRating ? (
            <div style={S.miniCardRating}>
              <span style={{ color: C.gold }}>★</span> {venue.googleRating}
            </div>
          ) : <span />}
        </div>
      </div>
    </Link>
  );
}

// ─── Page ───
export default function VenuesPage({ venues: initialVenues = [], total: initialTotal = 0 }) {
  const [search, setSearch] = useState("");
  const [venueType, setVenueType] = useState("");
  const [capacityBucket, setCapacityBucket] = useState("");
  const [priceBucket, setPriceBucket] = useState("");
  const [amenitySet, setAmenitySet] = useState({});
  const [verifiedOnly, setVerifiedOnly] = useState(false);
  const [sort, setSort] = useState("recommended");
  // Location filters — zone refetches from the server when changed. The SSR
  // slice is dataCompleteness-sorted across all zones, so small zones (e.g.
  // "west", which has only 2 venues total) may have zero cards in the first
  // 24 — a pure client-side filter would render "no venues found" even
  // though matching venues exist on the server. Area stays client-side for
  // live-typing feedback and rides along on Load-More fetches.
  const [activeZone, setActiveZone] = useState("all");
  // Sticky filter bar dropdown — only one open at a time, null when closed.
  const [openDropdown, setOpenDropdown] = useState(null);
  // Pagination — SSR delivers the first 24, "Load more" appends in 24-chunks.
  // `total` is in state (not just a prop) so zone refetches can update it.
  const [venues, setVenues] = useState(initialVenues);
  const [total, setTotal] = useState(initialTotal);
  const [page, setPage] = useState(1);
  const [loadMoreBusy, setLoadMoreBusy] = useState(false);
  const hasMore = venues.length < total;

  const buildFetchUrl = useCallback((skip) => {
    const params = new URLSearchParams({
      status: "published",
      limit: "24",
      skip: String(skip),
    });
    if (activeZone && activeZone !== "all") params.set("zone", activeZone);
    return `${process.env.NEXT_PUBLIC_API_URL}/venues?${params.toString()}`;
  }, [activeZone]);

  const loadMore = useCallback(async () => {
    if (loadMoreBusy || !hasMore) return;
    setLoadMoreBusy(true);
    try {
      const res = await fetch(buildFetchUrl(page * 24));
      if (!res.ok) throw new Error(`HTTP ${res.status}`);
      const data = await res.json();
      const fresh = Array.isArray(data.venues) ? data.venues : [];
      if (fresh.length > 0) {
        setVenues((prev) => [...prev, ...fresh]);
        setPage((p) => p + 1);
      }
    } catch (e) {
      // Silent — keep the existing list visible; user can retry.
    } finally {
      setLoadMoreBusy(false);
    }
  }, [page, loadMoreBusy, hasMore, buildFetchUrl]);

  // Refetch from the server whenever the zone changes. Skips on first mount
  // (the SSR slice is already loaded). `total` is replaced with the
  // zone-filtered count so the Load-More button is accurate.
  const isFirstZoneRender = useRef(true);
  useEffect(() => {
    if (isFirstZoneRender.current) { isFirstZoneRender.current = false; return; }
    let cancelled = false;
    (async () => {
      try {
        const params = new URLSearchParams({ status: "published", limit: "24", skip: "0" });
        if (activeZone && activeZone !== "all") params.set("zone", activeZone);
        const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/venues?${params.toString()}`);
        if (!res.ok) return;
        const data = await res.json();
        if (cancelled) return;
        setVenues(Array.isArray(data.venues) ? data.venues : []);
        setTotal(Number(data.total) || 0);
        setPage(1);
      } catch (e) {
        // Keep the previous list; user can retry by toggling the zone.
      }
    })();
    return () => { cancelled = true; };
  }, [activeZone]);

  const toggleAmenity = useCallback((key) => {
    setAmenitySet((prev) => ({ ...prev, [key]: !prev[key] }));
  }, []);
  const resetFilters = () => {
    setSearch("");
    setVenueType("");
    setActiveZone("all");
    setCapacityBucket("");
    setPriceBucket("");
    setAmenitySet({});
    setVerifiedOnly(false);
    setOpenDropdown(null);
  };

  // ─── Animated stat counters — count up from 0 over 1.4s on mount ───
  const verifiedCount = useMemo(
    () => venues.filter((v) => v.status === "verified").length,
    [venues]
  );
  const [statVenues, setStatVenues] = useState(0);
  const [statVerified, setStatVerified] = useState(0);
  useEffect(() => {
    const targetA = total || 0;
    const targetB = verifiedCount || 0;
    const steps = 40;
    const ms = 35;
    let n = 0;
    const id = setInterval(() => {
      n++;
      const p = n / steps;
      setStatVenues(Math.round(targetA * p));
      setStatVerified(Math.round(targetB * p));
      if (n >= steps) {
        setStatVenues(targetA);
        setStatVerified(targetB);
        clearInterval(id);
      }
    }, ms);
    return () => clearInterval(id);
  }, [total, verifiedCount]);

  // ─── Scroll target for "All Venues" section (vibes + zones jump here) ───
  const allVenuesRef = useRef(null);
  const scrollToListing = useCallback(() => {
    if (typeof window === "undefined") return;
    const el = allVenuesRef.current;
    if (el && typeof el.scrollIntoView === "function") {
      el.scrollIntoView({ behavior: "smooth", block: "start" });
    }
  }, []);

  // ─── Sticky filter bar — click-outside closes the active dropdown. The
  // chip wrappers carry a [data-filter-dropdown] attribute so we can scope
  // the "inside" check tightly. ───
  useEffect(() => {
    if (!openDropdown) return undefined;
    const onMouseDown = (e) => {
      if (!e.target.closest || !e.target.closest("[data-filter-dropdown]")) {
        setOpenDropdown(null);
      }
    };
    document.addEventListener("mousedown", onMouseDown);
    return () => document.removeEventListener("mousedown", onMouseDown);
  }, [openDropdown]);

  const filterActiveFlags = useMemo(() => ({
    zone: !!activeZone && activeZone !== "all",
    price: !!priceBucket,
    capacity: !!capacityBucket,
    amenities: verifiedOnly || Object.values(amenitySet).some(Boolean),
  }), [activeZone, priceBucket, capacityBucket, verifiedOnly, amenitySet]);

  const anyFilterActive =
    !!venueType ||
    filterActiveFlags.zone ||
    filterActiveFlags.price ||
    filterActiveFlags.capacity ||
    filterActiveFlags.amenities ||
    !!search;

  const clearFilterGroup = useCallback((group) => {
    if (group === "zone") setActiveZone("all");
    else if (group === "price") setPriceBucket("");
    else if (group === "capacity") setCapacityBucket("");
    else if (group === "amenities") { setAmenitySet({}); setVerifiedOnly(false); }
  }, []);

  // ─── Section 4 — Area cards (zones). Photo + count from loaded venues. ───
  const ZONE_AREA_DEFS = useMemo(() => [
    { value: "airport", label: "Near Airport" },
    { value: "north", label: "North Bangalore" },
    { value: "east", label: "East Bangalore" },
    { value: "south", label: "South Bangalore" },
    { value: "west", label: "West Bangalore" },
    { value: "central", label: "Central Bangalore" },
  ], []);
  const zoneCards = useMemo(() => ZONE_AREA_DEFS.map((z) => ({
    ...z,
    count: venues.filter((v) => v.zone === z.value).length,
    image: venues.find((v) => v.zone === z.value && v.coverPhoto)?.coverPhoto || "",
  })), [venues, ZONE_AREA_DEFS]);
  const applyZone = useCallback((zoneValue) => {
    resetFilters();
    setActiveZone(zoneValue);
    setTimeout(scrollToListing, 60);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [scrollToListing]);

  // ─── Section 5 — Curated rows. Pure derivations off loaded venues. ───
  const curatedRows = useMemo(() => {
    const sortedByRating = [...venues].sort((a, b) => (b.googleRating || 0) - (a.googleRating || 0));
    const rows = [
      {
        key: "north-resorts",
        title: "Best in North Bangalore",
        predicate: (v) => (v.zone === "north" || v.zone === "airport") && v.venueType === "resort",
        viewAll: () => { resetFilters(); setActiveZone("north"); setVenueType("resort"); setTimeout(scrollToListing, 60); },
      },
      {
        key: "loved",
        title: "Highly Loved Venues",
        predicate: (v) => (v.googleRating || 0) > 0,
        sorted: sortedByRating,
        viewAll: () => { resetFilters(); setSort("rating"); setTimeout(scrollToListing, 60); },
      },
    ];
    return rows.map((row) => {
      const matches = (row.sorted || venues).filter(row.predicate);
      return {
        key: row.key,
        title: row.title,
        venues: matches.slice(0, 4),
        totalCount: matches.length,
        viewAll: row.viewAll,
      };
    });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [venues, scrollToListing]);

  // ─── Counts (per facet — based on the loaded slice, so badges grow as the
  // user paginates). verifiedCount is already declared above for the hero
  // stat counter; reuse it.
  const typeCounts = useMemo(() => {
    const m = { "": venues.length };
    VENUE_TYPE_TABS.forEach((t) => {
      if (!t.value) return;
      m[t.value] = venues.filter((v) => v.venueType === t.value).length;
    });
    return m;
  }, [venues]);

  // ─── Filtered + sorted list ───
  const filtered = useMemo(() => {
    return venues
      .filter((v) => {
        if (!search) return true;
        const q = search.toLowerCase();
        return v.name?.toLowerCase().includes(q) || v.address?.toLowerCase().includes(q);
      })
      .filter((v) => (venueType ? v.venueType === venueType : true))
      // Zone filter is server-authoritative — we refetch on change. If the
      // API response omits `v.zone` (older deployment), trust the server
      // filter rather than dropping every card.
      .filter((v) => {
        if (!activeZone || activeZone === "all") return true;
        if (v.zone === undefined) return true;
        return v.zone === activeZone;
      })
      .filter((v) => inCapacityBucket(venueMaxCapacity(v), capacityBucket))
      .filter((v) => inPriceBucket(venueLowestPrice(v), priceBucket))
      .filter((v) => {
        const active = AMENITY_FILTERS.filter((a) => amenitySet[a.key]);
        if (active.length === 0) return true;
        return active.every((a) => venueHasAmenity(v, a.path));
      })
      .filter((v) => (verifiedOnly ? v.status === "verified" : true))
      .sort((a, b) => {
        if (sort === "rating") return (b.googleRating || 0) - (a.googleRating || 0);
        if (sort === "capacity") return venueMaxCapacity(b) - venueMaxCapacity(a);
        if (sort === "price") {
          const pa = venueLowestPrice(a) ?? Infinity;
          const pb = venueLowestPrice(b) ?? Infinity;
          return pa - pb;
        }
        return (b.dataCompleteness || 0) - (a.dataCompleteness || 0);
      });
  }, [venues, search, venueType, activeZone, capacityBucket, priceBucket, amenitySet, verifiedOnly, sort]);

  const featured = useMemo(() => {
    return [...venues]
      .sort((a, b) => (b.dataCompleteness || 0) - (a.dataCompleteness || 0))
      .slice(0, 3);
  }, [venues]);

  return (
    <>
      <Head>
        <title>{trimTitle("Wedding Venues in Bangalore — Resorts, Farmhouses & Villas | Wedsy")}</title>
        <meta name="description" content={trimDescription(`Browse ${total} curated wedding venues in Bangalore — luxury resorts, farmhouses, and villas. Real photos, verified pricing, and instant chat with venues.`)} />
        <meta property="og:title" content="Wedding Venues in Bangalore | Wedsy" />
        <meta property="og:description" content={`${total} curated wedding venues in Bangalore. Browse, compare, and chat directly with venues.`} />
        <meta property="og:type" content="website" />
        <link rel="canonical" href="https://wedsy.in/venues" />
        <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify({ "@context": "https://schema.org", "@type": "ItemList", name: "Wedding Venues in Bangalore", description: "Curated wedding resorts, farmhouses, and villas in Bangalore", numberOfItems: total, url: "https://wedsy.in/venues" }) }} />
      </Head>

      <main style={S.page}>
        {/* ────────── 1 — COUTURE HERO (typography-led, no imagery) ────────── */}
        <section style={S.heroV3}>
          <div style={S.heroV3Bg} aria-hidden="true" />
          <div style={S.heroV3Glow} aria-hidden="true" />
          <div style={S.heroV3Content}>
            <div style={S.heroV3OrnamentTop} aria-hidden="true">
              <svg className="hero-ornament" width="120" height="20" viewBox="0 0 120 20" fill="none">
                <line x1="0" y1="10" x2="48" y2="10" stroke="#b8852a" strokeWidth="0.6" strokeLinecap="round" />
                <path d="M55 10 L60 5 L65 10 L60 15 Z" stroke="#b8852a" strokeWidth="0.7" fill="none" strokeLinejoin="round" />
                <circle cx="60" cy="10" r="0.8" fill="#b8852a" />
                <line x1="72" y1="10" x2="120" y2="10" stroke="#b8852a" strokeWidth="0.6" strokeLinecap="round" />
              </svg>
            </div>
            <div className="hero-eyebrow" style={S.heroV3Eyebrow}>An Invitation</div>
            <h1 className="hero-title" style={S.heroV3Title}>
              Find where your<br />
              <em style={S.heroV3TitleEm}>forever</em> begins.
            </h1>
            <p className="hero-sub" style={S.heroV3Sub}>
              An invitation to {total} of Bangalore's most considered wedding venues — visited, photographed, and verified by our team.
            </p>
            <form
              className="hero-search"
              style={S.heroV3SearchBar}
              onSubmit={(e) => { e.preventDefault(); scrollToListing(); }}
            >
              <span style={S.heroV3SearchIcon} aria-hidden="true">
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#b8852a" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round">
                  <circle cx="11" cy="11" r="7" />
                  <path d="M21 21l-4.35-4.35" />
                </svg>
              </span>
              <input
                style={S.heroV3SearchInput}
                placeholder="Search by name, area, or vibe…"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                aria-label="Search venues"
              />
              <button type="submit" style={S.heroV3SearchBtn}>Begin →</button>
            </form>
            <div className="hero-stats" style={S.heroV3Stats}>
              <div style={S.heroV3Stat}>
                <div style={S.heroV3StatNum}>{statVenues}</div>
                <div style={S.heroV3StatLbl}>Curated venues</div>
              </div>
              <div style={S.heroV3StatRule} aria-hidden="true" />
              <div style={S.heroV3Stat}>
                <div style={S.heroV3StatNum}>{statVerified}</div>
                <div style={S.heroV3StatLbl}>Personally verified</div>
              </div>
              <div style={S.heroV3StatRule} aria-hidden="true" />
              <div style={S.heroV3Stat}>
                <div style={S.heroV3StatNumWord}>Always</div>
                <div style={S.heroV3StatLbl}>Free for couples</div>
              </div>
            </div>
            <div className="hero-foot" style={S.heroV3Footnote}>Curated in Bangalore</div>
          </div>
        </section>

        {/* ────────── 2 — WHY WEDSY IS DIFFERENT ────────── */}
        <section style={S.whySec}>
          <div style={S.whyInner}>
            <div style={S.whyEyebrow}>WHY COUPLES CHOOSE WEDSY</div>
            <div style={S.whyGrid}>
              <div style={S.whyCard}>
                <div style={S.whyIcon}>
                  <svg width="26" height="26" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true"><path d="M23 19a2 2 0 0 1-2 2H3a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h4l2-3h6l2 3h4a2 2 0 0 1 2 2z" /><circle cx="12" cy="13" r="4" /></svg>
                </div>
                <div style={S.whyTitle}>Real photos, not stock</div>
                <div style={S.whyDesc}>Every photo is from the actual venue — no staged shoots</div>
              </div>
              <div style={S.whyCard}>
                <div style={S.whyIcon}>
                  <svg width="26" height="26" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true"><path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z" /></svg>
                </div>
                <div style={S.whyTitle}>Chat directly, no middleman</div>
                <div style={S.whyDesc}>Enquire and chat with venue teams right here on Wedsy</div>
              </div>
              <div style={S.whyCard}>
                <div style={S.whyIcon}>
                  <svg width="26" height="26" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true"><path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z" /></svg>
                </div>
                <div style={S.whyTitle}>Free forever for couples</div>
                <div style={S.whyDesc}>Zero commission, zero booking fees — always</div>
              </div>
            </div>
          </div>
        </section>

        {/* ────────── 3 — EXPLORE BY AREA ────────── */}
        <section style={S.areasSec}>
          <div style={S.areasInner}>
            <div style={S.areasEyebrow}>EXPLORE BY AREA</div>
            <h2 style={S.areasTitle}>Where in Bangalore?</h2>
            <div style={S.areasGrid}>
              {zoneCards.map((z) => (
                <button
                  key={z.value}
                  type="button"
                  className="zone-area-card"
                  style={S.zoneAreaCard}
                  onClick={() => applyZone(z.value)}
                  aria-label={`Filter by ${z.label}`}
                >
                  {z.image && <img src={z.image} alt="" aria-hidden="true" style={S.zoneAreaCardImg} />}
                  <div style={S.zoneAreaCardOverlay} />
                  <div style={S.zoneAreaCardText}>
                    <div style={S.zoneAreaCardName}>{z.label}</div>
                    <div style={S.zoneAreaCardCount}>{z.count} venue{z.count === 1 ? "" : "s"}</div>
                  </div>
                </button>
              ))}
            </div>
          </div>
        </section>

        {/* ────────── 5 — CURATED CATEGORY ROWS ────────── */}
        <section style={S.curatedSec}>
          <div style={S.curatedInner}>
            <div style={S.curatedEyebrow}>HANDPICKED FOR YOU</div>
            {curatedRows.map((row) => row.venues.length > 0 && (
              <div key={row.key} style={S.curatedRow}>
                <div style={S.curatedRowHeader}>
                  <h3 style={S.curatedRowTitle}>{row.title}</h3>
                  <button type="button" style={S.curatedRowLink} onClick={row.viewAll}>
                    See all {row.totalCount} →
                  </button>
                </div>
                <div style={S.curatedRowScroll} className="curated-scroll">
                  {row.venues.map((v) => (
                    <MiniVenueCard key={v._id} venue={v} />
                  ))}
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* ────────── 5 — STICKY FILTER BAR ────────── */}
        <div style={S.filterBar}>
          <div style={S.filterBarInner}>
            {/* Row 1 — category pills */}
            <div className="cat-pills-row" style={S.catPillsRow} role="tablist" aria-label="Filter by venue category">
              {CATEGORIES.map((c) => (
                <button
                  key={c.value || "all"}
                  type="button"
                  role="tab"
                  aria-selected={venueType === c.value}
                  style={venueType === c.value ? S.catPillOn : S.catPill}
                  onClick={() => setVenueType(c.value)}
                >
                  {c.label}
                </button>
              ))}
            </div>

            {/* Row 2 — filter chip dropdowns */}
            <div style={S.chipsRow}>
              {/* Zone dropdown */}
              <div style={S.filterChipWrap} data-filter-dropdown>
                <button
                  type="button"
                  style={filterActiveFlags.zone ? S.filterChipOn : S.filterChip}
                  onClick={() => setOpenDropdown(openDropdown === "zone" ? null : "zone")}
                  aria-expanded={openDropdown === "zone"}
                  aria-haspopup="listbox"
                >
                  <span>Zone</span>
                  <span style={S.filterChipCaret} aria-hidden="true">▾</span>
                  {filterActiveFlags.zone && (
                    <span
                      role="button"
                      tabIndex={0}
                      aria-label="Clear zone filter"
                      style={S.filterChipX}
                      onClick={(e) => { e.stopPropagation(); clearFilterGroup("zone"); }}
                      onKeyDown={(e) => { if (e.key === "Enter" || e.key === " ") { e.preventDefault(); e.stopPropagation(); clearFilterGroup("zone"); } }}
                    >×</span>
                  )}
                </button>
                {openDropdown === "zone" && (
                  <div style={S.filterDropdown} role="listbox">
                    {ZONES.map((z) => (
                      <label key={z.value} style={S.filterDropdownItem}>
                        <input
                          type="radio"
                          name="zoneFilter"
                          checked={activeZone === z.value}
                          onChange={() => { setActiveZone(z.value); setOpenDropdown(null); }}
                          style={{ accentColor: C.burgundy }}
                        />
                        <span>{z.label}</span>
                      </label>
                    ))}
                  </div>
                )}
              </div>

              {/* Price dropdown */}
              <div style={S.filterChipWrap} data-filter-dropdown>
                <button
                  type="button"
                  style={filterActiveFlags.price ? S.filterChipOn : S.filterChip}
                  onClick={() => setOpenDropdown(openDropdown === "price" ? null : "price")}
                  aria-expanded={openDropdown === "price"}
                  aria-haspopup="listbox"
                >
                  <span>Price</span>
                  <span style={S.filterChipCaret} aria-hidden="true">▾</span>
                  {filterActiveFlags.price && (
                    <span
                      role="button"
                      tabIndex={0}
                      aria-label="Clear price filter"
                      style={S.filterChipX}
                      onClick={(e) => { e.stopPropagation(); clearFilterGroup("price"); }}
                      onKeyDown={(e) => { if (e.key === "Enter" || e.key === " ") { e.preventDefault(); e.stopPropagation(); clearFilterGroup("price"); } }}
                    >×</span>
                  )}
                </button>
                {openDropdown === "price" && (
                  <div style={S.filterDropdown} role="listbox">
                    {PRICE_OPTIONS.map((o) => (
                      <label key={o.value} style={S.filterDropdownItem}>
                        <input
                          type="radio"
                          name="priceFilter"
                          checked={priceBucket === o.value}
                          onChange={() => { setPriceBucket(o.value); setOpenDropdown(null); }}
                          style={{ accentColor: C.burgundy }}
                        />
                        <span>{o.label}</span>
                      </label>
                    ))}
                  </div>
                )}
              </div>

              {/* Capacity dropdown */}
              <div style={S.filterChipWrap} data-filter-dropdown>
                <button
                  type="button"
                  style={filterActiveFlags.capacity ? S.filterChipOn : S.filterChip}
                  onClick={() => setOpenDropdown(openDropdown === "capacity" ? null : "capacity")}
                  aria-expanded={openDropdown === "capacity"}
                  aria-haspopup="listbox"
                >
                  <span>Capacity</span>
                  <span style={S.filterChipCaret} aria-hidden="true">▾</span>
                  {filterActiveFlags.capacity && (
                    <span
                      role="button"
                      tabIndex={0}
                      aria-label="Clear capacity filter"
                      style={S.filterChipX}
                      onClick={(e) => { e.stopPropagation(); clearFilterGroup("capacity"); }}
                      onKeyDown={(e) => { if (e.key === "Enter" || e.key === " ") { e.preventDefault(); e.stopPropagation(); clearFilterGroup("capacity"); } }}
                    >×</span>
                  )}
                </button>
                {openDropdown === "capacity" && (
                  <div style={S.filterDropdown} role="listbox">
                    {CAPACITY_OPTIONS.map((o) => (
                      <label key={o.value} style={S.filterDropdownItem}>
                        <input
                          type="radio"
                          name="capacityFilter"
                          checked={capacityBucket === o.value}
                          onChange={() => { setCapacityBucket(o.value); setOpenDropdown(null); }}
                          style={{ accentColor: C.burgundy }}
                        />
                        <span>{o.label}</span>
                      </label>
                    ))}
                  </div>
                )}
              </div>

              {/* Amenities dropdown (multi-select + Verified only) */}
              <div style={S.filterChipWrap} data-filter-dropdown>
                <button
                  type="button"
                  style={filterActiveFlags.amenities ? S.filterChipOn : S.filterChip}
                  onClick={() => setOpenDropdown(openDropdown === "amenities" ? null : "amenities")}
                  aria-expanded={openDropdown === "amenities"}
                  aria-haspopup="listbox"
                >
                  <span>Amenities</span>
                  <span style={S.filterChipCaret} aria-hidden="true">▾</span>
                  {filterActiveFlags.amenities && (
                    <span
                      role="button"
                      tabIndex={0}
                      aria-label="Clear amenity filters"
                      style={S.filterChipX}
                      onClick={(e) => { e.stopPropagation(); clearFilterGroup("amenities"); }}
                      onKeyDown={(e) => { if (e.key === "Enter" || e.key === " ") { e.preventDefault(); e.stopPropagation(); clearFilterGroup("amenities"); } }}
                    >×</span>
                  )}
                </button>
                {openDropdown === "amenities" && (
                  <div style={S.filterDropdown}>
                    {AMENITY_FILTERS.filter((a) => a.key !== "accommodation").map((a) => (
                      <label key={a.key} style={S.filterDropdownItem}>
                        <input
                          type="checkbox"
                          checked={!!amenitySet[a.key]}
                          onChange={() => toggleAmenity(a.key)}
                          style={{ accentColor: C.burgundy }}
                        />
                        <span>{a.label}</span>
                      </label>
                    ))}
                    <label style={S.filterDropdownItem}>
                      <input
                        type="checkbox"
                        checked={verifiedOnly}
                        onChange={(e) => setVerifiedOnly(e.target.checked)}
                        style={{ accentColor: C.burgundy }}
                      />
                      <span>Verified only</span>
                    </label>
                  </div>
                )}
              </div>

              {anyFilterActive && (
                <button type="button" style={S.resetLink} onClick={resetFilters}>Reset all filters</button>
              )}
            </div>
          </div>
        </div>

        {/* ────────── 6 — ALL VENUES (full-width 3-col grid) ────────── */}
        <section id="all-venues" ref={allVenuesRef} style={S.allVenuesSecFull}>
          <div style={S.allVenuesInnerFull}>
            <div style={S.allVenuesHeader}>
              <h2 style={S.allVenuesTitleFull}>All venues in Bangalore</h2>
              <div style={S.allVenuesCount}>
                Showing <span style={S.allVenuesCountStrong}>{filtered.length}</span> of {total} venues
              </div>
            </div>
            <div style={S.sortRow}>
              <select style={S.sortSelect} value={sort} onChange={(e) => setSort(e.target.value)} aria-label="Sort venues">
                <option value="recommended">Sort: Recommended</option>
                <option value="rating">Rating: Highest</option>
                <option value="capacity">Capacity: Largest</option>
                <option value="price">Price: Low to high</option>
              </select>
            </div>
            {filtered.length > 0 ? (
              <>
                <div className="all-venues-grid" style={S.fullWidthGrid}>
                  {filtered.map((v) => <VenueCard key={v._id} venue={v} />)}
                </div>
                {hasMore && (
                  <div style={S.loadMoreWrap}>
                    <button
                      type="button"
                      style={loadMoreBusy ? S.loadMoreBtnBusy : S.loadMoreBtn}
                      onClick={loadMore}
                      disabled={loadMoreBusy}
                      aria-busy={loadMoreBusy}
                    >
                      {loadMoreBusy ? "Loading venues..." : "Load more venues"}
                    </button>
                  </div>
                )}
              </>
            ) : (
              <div style={S.empty}>
                <div style={S.emptyIcon}>🔍</div>
                <div style={S.emptyTitle}>No venues match those filters</div>
                <div style={S.emptyText}>Try widening your capacity, price, or zone selection — there's a fit out there.</div>
                <button type="button" style={S.emptyBtn} onClick={resetFilters}>Clear filters</button>
              </div>
            )}
          </div>
        </section>

        {/* ────────── 7 — VENUE OWNER CTA ────────── */}
        <section style={S.ownerCtaSec}>
          <div style={S.ownerCtaEyebrow}>FOR VENUE OWNERS</div>
          <h2 style={S.ownerCtaTitle}>List your venue on Wedsy</h2>
          <p style={S.ownerCtaSub}>
            Join {total} venues already reaching thousands of couples every month
          </p>
          <div style={S.ownerCtaBtns}>
            <Link href="/venues/join" style={S.ownerCtaBtnPrimary}>
              List your venue <span aria-hidden="true" style={{ marginLeft: 6 }}>→</span>
            </Link>
            <a href="mailto:venues@wedsy.in" style={S.ownerCtaBtnSecondary}>Contact us</a>
          </div>
        </section>
      </main>

      <style jsx>{`
        :global(.venue-card):hover {
          transform: translateY(-2px);
          box-shadow: 0 6px 28px rgba(107, 30, 46, 0.12);
          border-color: ${C.gold} !important;
        }
        /* Hero entrance — slide-only, no opacity fade. Earlier versions used
           opacity: 0 in the @from frame with animation-fill-mode: both, which
           left the entire hero invisible for ~1s after page load while the
           ornament/title/etc. waited for their staggered delays — making the
           hero look like a blank cream screen on first paint. */
        @keyframes heroSlideUp {
          from { transform: translateY(14px); }
          to   { transform: translateY(0); }
        }
        :global(.hero-ornament) { animation: heroSlideUp 1.2s cubic-bezier(0.22, 1, 0.36, 1); }
        :global(.hero-eyebrow)  { animation: heroSlideUp 0.9s ease-out; }
        :global(.hero-title)    { animation: heroSlideUp 1s cubic-bezier(0.22, 1, 0.36, 1); }
        :global(.hero-sub)      { animation: heroSlideUp 0.9s ease-out; }
        :global(.hero-search)   { animation: heroSlideUp 0.9s ease-out; }
        :global(.hero-stats)    { animation: heroSlideUp 0.9s ease-out; }
        :global(.hero-foot)     { animation: heroSlideUp 0.9s ease-out; }
        /* Hide scrollbars on horizontal scrollers (category pills, curated rows). */
        :global(.cat-pills-row)::-webkit-scrollbar,
        :global(.curated-scroll)::-webkit-scrollbar { display: none; }
        :global(.cat-pills-row), :global(.curated-scroll) {
          scrollbar-width: none;
          -ms-overflow-style: none;
        }
      `}</style>
    </>
  );
}

export async function getServerSideProps() {
  try {
    const res = await fetch(
      `${process.env.NEXT_PUBLIC_API_URL}/venues?status=published&limit=24&skip=0`,
      { headers: { "Content-Type": "application/json" } }
    );
    if (!res.ok) throw new Error("Failed to fetch venues");
    const data = await res.json();
    return { props: { venues: data.venues || [], total: data.total || 0 } };
  } catch (err) {
    console.error("Venues SSR error:", err.message);
    return { props: { venues: [], total: 0 } };
  }
}
