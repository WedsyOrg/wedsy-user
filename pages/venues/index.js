import Head from "next/head";
import Link from "next/link";
import { useRouter } from "next/router";
import { useState, useCallback, useMemo, useEffect, useRef } from "react";

import { trimTitle, trimDescription } from "@/utils/seo";

// Tracks viewport width client-side. Initial value is fixed (1200) so the
// SSR markup matches the first client render and React doesn't warn about
// hydration mismatch — the useEffect runs right after mount and re-renders
// with the real width, accepting a brief desktop-layout flash on mobile.
const useWindowWidth = () => {
  const [width, setWidth] = useState(1200);
  useEffect(() => {
    const handler = () => setWidth(window.innerWidth);
    handler();
    window.addEventListener("resize", handler);
    return () => window.removeEventListener("resize", handler);
  }, []);
  return width;
};

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

// ─── Smart area search ───
// Centroid (lat/lng) for each known Bangalore micro-locality. Used to compute
// "X km from {area}" labels and to distance-sort cards once an area is picked.
// Keys are lowercased locality names — look up via name.toLowerCase().
const AREA_CENTROIDS = {
  "yelahanka": { lat: 13.1007, lng: 77.5963 },
  "devanahalli": { lat: 13.2468, lng: 77.7137 },
  "bagalur": { lat: 13.3012, lng: 77.7560 },
  "jakkur": { lat: 13.0674, lng: 77.5998 },
  "hebbal": { lat: 13.0450, lng: 77.5950 },
  "thanisandra": { lat: 13.0590, lng: 77.6280 },
  "kogilu": { lat: 13.0780, lng: 77.5890 },
  "whitefield": { lat: 12.9698, lng: 77.7500 },
  "marathahalli": { lat: 12.9563, lng: 77.7011 },
  "sarjapur": { lat: 12.8604, lng: 77.7860 },
  "bellandur": { lat: 12.9257, lng: 77.6750 },
  "koramangala": { lat: 12.9352, lng: 77.6245 },
  "hsr layout": { lat: 12.9116, lng: 77.6389 },
  "btm layout": { lat: 12.9165, lng: 77.6101 },
  "jp nagar": { lat: 12.9063, lng: 77.5857 },
  "bannerghatta": { lat: 12.8002, lng: 77.5773 },
  "electronic city": { lat: 12.8399, lng: 77.6770 },
  "kanakapura": { lat: 12.5479, lng: 77.4178 },
  "rajajinagar": { lat: 12.9925, lng: 77.5560 },
  "yeshwanthpur": { lat: 13.0289, lng: 77.5430 },
  "magadi road": { lat: 12.9752, lng: 77.5125 },
  "indiranagar": { lat: 12.9784, lng: 77.6408 },
  "domlur": { lat: 12.9609, lng: 77.6387 },
  "mg road": { lat: 12.9758, lng: 77.6096 },
  "jayanagar": { lat: 12.9308, lng: 77.5830 },
  "banashankari": { lat: 12.9255, lng: 77.5468 },
  "malleshwaram": { lat: 13.0035, lng: 77.5709 },
  "sadashivanagar": { lat: 13.0100, lng: 77.5810 },
  "electronic city phase 1": { lat: 12.8452, lng: 77.6602 },
  "electronic city phase 2": { lat: 12.8345, lng: 77.6756 },
  "varthur": { lat: 12.9396, lng: 77.7456 },
  "brookefield": { lat: 12.9675, lng: 77.7121 },
  "kadugodi": { lat: 12.9991, lng: 77.7470 },
  "kr puram": { lat: 13.0098, lng: 77.6947 },
  "hoodi": { lat: 12.9877, lng: 77.7173 },
  "doddanekundi": { lat: 12.9756, lng: 77.7134 },
  "hennur": { lat: 13.0519, lng: 77.6329 },
  "banaswadi": { lat: 13.0195, lng: 77.6465 },
  "horamavu": { lat: 13.0293, lng: 77.6607 },
  "ramamurthy nagar": { lat: 13.0134, lng: 77.6661 },
  "bommasandra": { lat: 12.8094, lng: 77.6975 },
  "chandapura": { lat: 12.7938, lng: 77.6846 },
  "attibele": { lat: 12.7704, lng: 77.7659 },
  "anekal": { lat: 12.7085, lng: 77.6966 },
  "begur": { lat: 12.8713, lng: 77.6165 },
  "gottigere": { lat: 12.8560, lng: 77.5978 },
  "hulimavu": { lat: 12.8723, lng: 77.5875 },
  "kengeri": { lat: 12.9081, lng: 77.4862 },
  "mysore road": { lat: 12.9421, lng: 77.5095 },
  "vijayanagar": { lat: 12.9713, lng: 77.5297 },
  "peenya": { lat: 13.0289, lng: 77.5178 },
};

// Great-circle distance in km between two lat/lng points (Haversine).
function haversineKm(lat1, lng1, lat2, lng2) {
  const R = 6371;
  const dLat = ((lat2 - lat1) * Math.PI) / 180;
  const dLng = ((lng2 - lng1) * Math.PI) / 180;
  const a = Math.sin(dLat / 2) ** 2 + Math.cos(lat1 * Math.PI / 180) * Math.cos(lat2 * Math.PI / 180) * Math.sin(dLng / 2) ** 2;
  return R * 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
}

// Loose match for the area search box: substring either way, else a cheap
// positional-overlap heuristic for short typo-tolerant matches.
function fuzzyMatch(input, target) {
  const a = input.toLowerCase().trim();
  const b = target.toLowerCase().trim();
  if (b.includes(a) || a.includes(b)) return true;
  // Simple Levenshtein for short strings
  if (Math.abs(a.length - b.length) > 4) return false;
  let matches = 0;
  for (let i = 0; i < Math.min(a.length, b.length); i++) {
    if (a[i] === b[i]) matches++;
  }
  return matches / Math.max(a.length, b.length) > 0.7;
}

// Zone labels + display order for the grouped Area dropdown.
const ZONE_LABELS = {
  airport: "Near Airport", north: "North Bangalore",
  east: "East Bangalore", south: "South Bangalore",
  west: "West Bangalore", central: "Central Bangalore",
};
const ZONE_ORDER = ["airport", "north", "east", "south", "west", "central"];

// Top-level category pills in the sticky filter bar. Maps to venue.venueType.
const CATEGORIES = [
  { value: "", label: "All" },
  { value: "resort", label: "Resorts" },
  { value: "farmhouse", label: "Farmhouses" },
  { value: "banquet_hall", label: "Banquet Halls" },
  { value: "hotel", label: "Hotels" },
];

// Amenity filter keys must match the venue.amenities schema so filtering works
// without a translation step.
const AMENITY_FILTERS = [
  { key: "swimmingPool", label: "Pool", icon: "🏊", path: ["amenities", "swimmingPool"] },
  { key: "accommodation", label: "Accommodation", icon: "🛏", path: ["accommodation", "available"] },
  { key: "generatorBackup", label: "Generator", icon: "🔌", path: ["amenities", "generatorBackup"] },
  { key: "parking", label: "Parking", icon: "🅿️", path: ["amenities", "parking"] },
  { key: "garden", label: "Outdoor lawn", icon: "🌿", path: ["amenities", "garden"] },
  { key: "kalyanMandap", label: "Kalyani Mandap", icon: "🛕", path: ["amenities", "kalyanMandap"] },
  { key: "floatingMandap", label: "Floating Mandap", icon: "🪷", path: ["amenities", "floatingMandap"] },
  { key: "evCharging", label: "EV Charging", icon: "🔋", path: ["amenities", "evCharging"] },
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

  // STICKY FILTER BAR — one horizontal-scroll row with: search + dividers +
  // category pills + filter chips. Reset link sits outside the scroller on
  // the right so it's always visible regardless of scroll position.
  filterBar: { position: "sticky", top: 0, zIndex: 100, background: "#ffffff", borderBottom: "1px solid #f0e8dc", boxShadow: "0 2px 8px rgba(0,0,0,0.06)" },
  filterBarFlex: { display: "flex", alignItems: "center", maxWidth: 1400, margin: "0 auto", padding: "10px 2rem", gap: 10 },
  filterBarRow: { display: "flex", alignItems: "center", gap: 6, overflowX: "auto", flex: 1, minWidth: 0 },
  filterBarSearch: { flexShrink: 0, display: "inline-flex", alignItems: "center", gap: 8, width: 200, height: 34, padding: "0 14px", borderRadius: 100, border: "1px solid #e8d8c4", background: "#ffffff" },
  filterBarSearchIcon: { display: "inline-flex", color: "#7a5a48", flexShrink: 0 },
  filterBarSearchInput: { flex: 1, border: "none", outline: "none", background: "transparent", fontSize: 13, color: "#2c1810", minWidth: 0 },
  filterDivider: { flexShrink: 0, width: 1, height: 20, background: "#e8d8c4", margin: "0 8px" },
  // Unified pill/chip dimensions per spec — 34px, padding 0 14px, radius 100.
  catPill: { flexShrink: 0, height: 34, padding: "0 14px", borderRadius: 100, border: "1px solid #e8d8c4", background: "#ffffff", color: "#5a3a2a", fontSize: 13, fontWeight: 500, cursor: "pointer", whiteSpace: "nowrap", letterSpacing: 0.2, transition: "all 150ms ease" },
  catPillOn: { flexShrink: 0, height: 34, padding: "0 14px", borderRadius: 100, border: "1px solid " + C.burgundy, background: C.burgundy, color: C.ivory, fontSize: 13, fontWeight: 500, cursor: "pointer", whiteSpace: "nowrap", letterSpacing: 0.2, boxShadow: "0 2px 8px rgba(107,30,46,0.2)", transition: "all 150ms ease" },
  filterChipWrap: { flexShrink: 0, position: "relative", display: "inline-block" },
  filterChip: { display: "inline-flex", alignItems: "center", gap: 4, height: 34, padding: "0 14px", borderRadius: 100, border: "1px solid #e8d8c4", background: "#ffffff", color: "#5a3a2a", fontSize: 13, fontWeight: 500, cursor: "pointer", whiteSpace: "nowrap", letterSpacing: 0.2, transition: "all 150ms ease" },
  filterChipOn: { display: "inline-flex", alignItems: "center", gap: 4, height: 34, padding: "0 14px", borderRadius: 100, border: "1px solid " + C.burgundy, background: C.burgundy, color: C.ivory, fontSize: 13, fontWeight: 500, cursor: "pointer", whiteSpace: "nowrap", letterSpacing: 0.2, boxShadow: "0 2px 8px rgba(107,30,46,0.2)", transition: "all 150ms ease" },
  filterChipCaret: { fontSize: 10, marginLeft: 0, lineHeight: 1 },
  filterChipX: { display: "inline-flex", alignItems: "center", justifyContent: "center", marginLeft: 0, fontSize: 14, lineHeight: 1, cursor: "pointer", background: "transparent", border: "none", color: "inherit", padding: 0, width: 14, height: 14, borderRadius: "50%" },
  // Dropdown is position: fixed (not absolute) so it escapes the filter bar's
  // overflow-x: auto clipping. The chip's onClick captures its bounding rect
  // and stores top/left in `dropdownAnchor`; we merge those into the inline
  // style at render. zIndex 200 sits above the sticky bar (zIndex 100).
  filterDropdown: { position: "fixed", background: "#ffffff", border: "1px solid #e8d8c4", borderRadius: 12, boxShadow: "0 8px 24px rgba(0,0,0,0.12)", padding: 16, minWidth: 200, zIndex: 200 },
  filterDropdownItem: { display: "flex", alignItems: "center", gap: 10, padding: "8px 6px", cursor: "pointer", fontSize: 13, color: "#3a2820", borderRadius: 6 },
  resetLink: { flexShrink: 0, background: "transparent", border: "none", color: C.burgundy, fontSize: 12, fontWeight: 500, cursor: "pointer", letterSpacing: 0.2, padding: "0 4px", whiteSpace: "nowrap" },

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

  // ─── Responsive overrides — merged in conditionally via isMobile/isTablet ───
  filterBarFlexMobile: { flexDirection: "column", alignItems: "stretch", gap: 8, padding: "10px 16px" },
  filterBarRowMobile: { width: "100%", flex: "none" },
  filterBarSearchMobile: { width: "100%" },
  filterDropdownMobile: { top: "auto", bottom: 0, left: 0, right: 0, minWidth: "100%", borderRadius: "16px 16px 0 0", padding: 20, boxShadow: "0 -8px 32px rgba(0,0,0,0.18)" },
  fullWidthGridMobile: { gridTemplateColumns: "1fr", gap: 18 },
  fullWidthGridTablet: { gridTemplateColumns: "repeat(2, 1fr)", gap: 20 },

  // ─── Area dropdown (smart area search) ───
  areaDropdown: { position: "fixed", background: "#ffffff", borderRadius: 12, border: "1px solid #e8d8c4", boxShadow: "0 8px 32px rgba(107,30,46,0.12)", width: 260, maxHeight: 380, overflow: "hidden", zIndex: 300, display: "flex", flexDirection: "column" },
  areaDropdownHeader: { padding: "10px 12px 8px", borderBottom: "0.5px solid #f0e8dc" },
  areaDropdownSearch: { width: "100%", border: "1px solid #e8d8c4", borderRadius: 8, padding: "7px 12px", fontSize: 12, color: "#2c1810", outline: "none", boxSizing: "border-box" },
  areaDropdownBody: { flex: 1, overflowY: "auto" },
  areaZoneHeader: { padding: "8px 14px 4px", fontSize: 9, color: "#b8852a", letterSpacing: 2, textTransform: "uppercase", fontWeight: 600 },
  areaRow: { display: "flex", justifyContent: "space-between", alignItems: "center", gap: 8, padding: "8px 14px", fontSize: 13, color: "#1a0a0a", cursor: "pointer", background: "transparent", border: "none", width: "100%", textAlign: "left" },
  areaSuggestRow: { display: "flex", justifyContent: "space-between", alignItems: "center", gap: 8, padding: "9px 14px", cursor: "pointer", background: "transparent", border: "none", width: "100%", textAlign: "left" },
  areaRowLeft: { display: "flex", alignItems: "center", gap: 6, minWidth: 0 },
  areaRowCheck: { color: C.burgundy, fontSize: 12, lineHeight: 1, flexShrink: 0 },
  areaRowName: { fontSize: 13, color: "#1a0a0a", whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" },
  areaRowCount: { fontSize: 10, color: "#b09080", flexShrink: 0 },
  areaRowZone: { fontSize: 10, color: "#b09080", flexShrink: 0 },
  areaEmpty: { padding: "16px 14px", fontSize: 12, color: "#b09080", textAlign: "center" },
  // Suggestions box (highlighted) + multi-select checkboxes
  areaSuggestBox: { background: "#fffbf5", borderBottom: "0.5px solid #f0e8dc" },
  areaSuggestLabel: { fontSize: 9, textTransform: "uppercase", color: "#b09080", letterSpacing: 2, padding: "10px 14px 4px", fontWeight: 600 },
  areaCheckbox: { width: 16, height: 16, borderRadius: 4, border: "1.5px solid #d8c4a8", display: "inline-flex", alignItems: "center", justifyContent: "center", flexShrink: 0, fontSize: 11, lineHeight: 1, color: "transparent" },
  areaCheckboxOn: { width: 16, height: 16, borderRadius: 4, border: "1.5px solid " + C.burgundy, background: C.burgundy, display: "inline-flex", alignItems: "center", justifyContent: "center", flexShrink: 0, fontSize: 11, lineHeight: 1, color: "#fff" },

  // ─── Search suggestions dropdown (sticky-bar search) ───
  searchSuggestDropdown: { position: "absolute", top: "calc(100% + 6px)", left: 0, right: 0, background: "#ffffff", borderRadius: 12, border: "1px solid #e8d8c4", boxShadow: "0 8px 32px rgba(107,30,46,0.12)", maxHeight: 300, overflowY: "auto", zIndex: 9999 },
  searchSuggestHeader: { fontSize: 9, textTransform: "uppercase", color: "#b8852a", letterSpacing: 1, padding: "8px 14px 4px", fontWeight: 600 },
  searchSuggestRow: { display: "flex", justifyContent: "space-between", alignItems: "center", gap: 8, padding: "10px 14px", cursor: "pointer", background: "transparent", border: "none", width: "100%", textAlign: "left" },
  searchSuggestName: { fontSize: 13, fontWeight: 500, color: "#1a0a0a", whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" },
  searchSuggestMeta: { fontSize: 10, color: "#b09080", flexShrink: 0 },
  searchClearBtn: { flexShrink: 0, width: 18, height: 18, borderRadius: "50%", border: "none", background: "#f0e4d0", color: "#7a5a48", fontSize: 13, lineHeight: 1, cursor: "pointer", display: "inline-flex", alignItems: "center", justifyContent: "center", padding: 0 },
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

function VenueCard({ venue, featured = false, distanceLabel = null }) {
  // Verified badge renders ONLY when the API marks the venue verified. Prefer
  // the documented `isVerified` boolean; fall back to the legacy status flag.
  const isVerified = venue.isVerified === true || venue.status === "verified";
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
        {venue.featured === true && (
          <div
            style={{
              position: "absolute", top: 10, right: 10,
              background: "linear-gradient(135deg, #b8852a, #d4a843)",
              color: "white", fontSize: 10, fontWeight: 700,
              padding: "4px 8px", borderRadius: 4,
              letterSpacing: "0.5px", zIndex: 2,
              textTransform: "uppercase",
            }}
          >
            ✦ FEATURED
          </div>
        )}
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
        {venue.featured === true && (
          <div
            style={{
              display: "inline-flex", alignItems: "center", gap: 4,
              fontSize: 10, fontWeight: 600, color: "#6b1e2e",
              background: "rgba(107,30,46,0.08)",
              padding: "3px 8px", borderRadius: 20,
              letterSpacing: "0.3px", marginTop: 4,
              textTransform: "uppercase",
            }}
          >
            ✦ Managed by Wedsy
          </div>
        )}
        <div style={S.cardLoc}><span aria-hidden="true">📍</span> {shortAddr}</div>
        {venue.zone && ZONE_LABEL[venue.zone] && (
          <div style={S.cardZoneChip}>
            <span aria-hidden="true">📍</span> {ZONE_LABEL[venue.zone]}
          </div>
        )}
        {distanceLabel && (
          <span style={{ fontSize: 11, color: "#7a5a48", marginTop: 2, display: "block", marginBottom: 10 }}>
            📍 {distanceLabel}
          </span>
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
export default function VenuesPage({
  venues: initialVenues = [],
  total: initialTotal = 0,
  zoneCounts = { airport: 0, north: 0, south: 0, east: 0, west: 0, central: 0 },
}) {
  const router = useRouter();
  // Responsive breakpoint flags — drive style overrides in mobile/tablet.
  const viewportWidth = useWindowWidth();
  const isMobile = viewportWidth < 768;
  const isTablet = viewportWidth >= 768 && viewportWidth < 1024;

  // Search is split: what's typed (drives suggestions only) vs what actually
  // filters the listing (applied on Enter / suggestion select).
  const [searchInputValue, setSearchInputValue] = useState("");
  const [appliedSearch, setAppliedSearch] = useState("");
  const [showSearchSuggestions, setShowSearchSuggestions] = useState(false);
  // Anchor for the hero search dropdown — it uses position: fixed off this
  // input's rect so the hero section's overflow:hidden doesn't clip it.
  const heroSearchRef = useRef(null);
  const [venueType, setVenueType] = useState("");
  const [capacityBucket, setCapacityBucket] = useState("");
  const [priceBucket, setPriceBucket] = useState("");
  const [amenitySet, setAmenitySet] = useState({});
  const [verifiedOnly, setVerifiedOnly] = useState(false);
  // Catering diet filters → veg=true / nonVeg=true on the GET /venues endpoint.
  const [vegOnly, setVegOnly] = useState(false);
  const [nonVegOnly, setNonVegOnly] = useState(false);
  const [sort, setSort] = useState("recommended");
  // Location filters — zone refetches from the server when changed. The SSR
  // slice is dataCompleteness-sorted across all zones, so small zones (e.g.
  // "west", which has only 2 venues total) may have zero cards in the first
  // 24 — a pure client-side filter would render "no venues found" even
  // though matching venues exist on the server. Area stays client-side for
  // live-typing feedback and rides along on Load-More fetches.
  const [selectedZones, setSelectedZones] = useState([]);
  // Smart area filter — client-side, layered on top of the loaded slice.
  // Multi-select: `selectedAreas` is an array of { name, zone, lat, lng }
  // (lat/lng may be undefined if the locality isn't in AREA_CENTROIDS — distance
  // labels/sort just skip those).
  const [areaFilterSearch, setAreaFilterSearch] = useState("");
  const [selectedAreas, setSelectedAreas] = useState([]);
  // Sticky filter bar dropdown — only one open at a time, null when closed.
  // `dropdownAnchor` holds the {top,left} viewport coords captured from the
  // chip's getBoundingClientRect() at the moment it was clicked; the dropdown
  // renders position: fixed so it escapes the bar row's overflow clipping.
  const [openDropdown, setOpenDropdown] = useState(null);
  const [dropdownAnchor, setDropdownAnchor] = useState({ top: 0, left: 0, right: 0 });
  // Pagination — SSR delivers the first 24, "Load more" appends in 24-chunks.
  // `total` is in state (not just a prop) so zone refetches can update it.
  const [venues, setVenues] = useState(initialVenues);
  const [total, setTotal] = useState(initialTotal);
  const [page, setPage] = useState(1);
  const [loadMoreBusy, setLoadMoreBusy] = useState(false);
  const hasMore = venues.length < total;

  // Map the capacity/price bucket sentinels to the numeric min/max params the
  // GET /venues endpoint understands.
  const serverFilterParams = useCallback(() => {
    const params = new URLSearchParams({ status: "published" });
    if (selectedZones.length > 0) params.set("zone", selectedZones.join(","));
    if (appliedSearch.trim()) params.set("search", appliedSearch.trim());
    if (venueType) params.set("venueType", venueType);
    // Capacity bucket → minCapacity (only a floor is server-supported).
    if (capacityBucket === "100-250") params.set("minCapacity", "100");
    else if (capacityBucket === "250-500") params.set("minCapacity", "250");
    else if (capacityBucket === "500+") params.set("minCapacity", "500");
    // Price bucket → min/maxPrice.
    if (priceBucket === "0-200000") params.set("maxPrice", "200000");
    else if (priceBucket === "200000-500000") { params.set("minPrice", "200000"); params.set("maxPrice", "500000"); }
    else if (priceBucket === "500000-1000000") { params.set("minPrice", "500000"); params.set("maxPrice", "1000000"); }
    else if (priceBucket === "1000000+") params.set("minPrice", "1000000");
    // Amenities (incl. evCharging) — CSV of amenity keys the schema exposes.
    const amenKeys = AMENITY_FILTERS.filter((a) => amenitySet[a.key] && a.path[0] === "amenities").map((a) => a.key);
    if (amenKeys.length > 0) params.set("amenities", amenKeys.join(","));
    if (vegOnly) params.set("veg", "true");
    if (nonVegOnly) params.set("nonVeg", "true");
    // Sort mapping → endpoint vocabulary.
    if (sort === "price") params.set("sort", "price_low");
    else if (sort === "capacity") params.set("sort", "capacity");
    else if (sort === "rating") params.set("sort", "relevance");
    else if (sort === "newest") params.set("sort", "newest");
    return params;
  }, [selectedZones, appliedSearch, venueType, capacityBucket, priceBucket, amenitySet, sort, vegOnly, nonVegOnly]);

  const buildFetchUrl = useCallback((skip) => {
    const params = serverFilterParams();
    params.set("limit", "24");
    params.set("skip", String(skip));
    return `${process.env.NEXT_PUBLIC_API_URL}/venues?${params.toString()}`;
  }, [serverFilterParams]);

  const loadMore = useCallback(async () => {
    if (loadMoreBusy || !hasMore) return;
    setLoadMoreBusy(true);
    try {
      // Skip past exactly what's already loaded. The SSR initial page can be
      // larger than one 24-chunk (the endpoint caps each page at 200), so
      // deriving skip from venues.length keeps paging correct regardless of
      // the initial count. Dedupe by slug defends against any overlap.
      const res = await fetch(buildFetchUrl(venues.length));
      if (!res.ok) throw new Error(`HTTP ${res.status}`);
      const data = await res.json();
      const fresh = Array.isArray(data.venues) ? data.venues : [];
      if (fresh.length > 0) {
        setVenues((prev) => {
          const have = new Set(prev.map((v) => v.slug || v._id));
          const merged = [...prev];
          for (const v of fresh) {
            const id = v.slug || v._id;
            if (!have.has(id)) { merged.push(v); have.add(id); }
          }
          return merged;
        });
        setPage((p) => p + 1);
      }
    } catch (e) {
      // Silent — keep the existing list visible; user can retry.
    } finally {
      setLoadMoreBusy(false);
    }
  }, [venues.length, loadMoreBusy, hasMore, buildFetchUrl]);

  // Refetch from the server whenever any server-supported filter changes
  // (zone, search, venueType, capacity/price bucket, amenities, sort). Skips on
  // first mount (the SSR slice is already loaded). `total` is replaced with the
  // server's filtered count so Load-More + skip math stay accurate. The
  // client-side `filtered` memo then layers on the remaining UI filters (area,
  // featured ordering). A short debounce coalesces rapid changes.
  const isFirstFilterRender = useRef(true);
  const serverFilterKey = useMemo(
    () => serverFilterParams().toString(),
    [serverFilterParams],
  );
  useEffect(() => {
    if (isFirstFilterRender.current) { isFirstFilterRender.current = false; return; }
    let cancelled = false;
    const t = setTimeout(async () => {
      try {
        const params = serverFilterParams();
        params.set("limit", "24");
        params.set("skip", "0");
        const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/venues?${params.toString()}`);
        if (!res.ok) return;
        const data = await res.json();
        if (cancelled) return;
        setVenues(Array.isArray(data.venues) ? data.venues : []);
        setTotal(Number(data.total) || 0);
        setPage(1);
      } catch (e) {
        // Keep the previous list; user can retry by toggling a filter.
      }
    }, 250);
    return () => { cancelled = true; clearTimeout(t); };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [serverFilterKey]);

  const toggleAmenity = useCallback((key) => {
    setAmenitySet((prev) => ({ ...prev, [key]: !prev[key] }));
  }, []);
  const resetFilters = () => {
    setSearchInputValue("");
    setAppliedSearch("");
    setShowSearchSuggestions(false);
    setVenueType("");
    setSelectedZones([]);
    setCapacityBucket("");
    setPriceBucket("");
    setAmenitySet({});
    setVerifiedOnly(false);
    setVegOnly(false);
    setNonVegOnly(false);
    setSelectedAreas([]);
    setAreaFilterSearch("");
    setOpenDropdown(null);
  };

  // ─── URL ⇄ filter state sync (shareable / back-button safe) ───
  // All filter state is reflected in the URL query string so a filtered view
  // can be copied/shared and the browser back button restores prior filters.
  // `urlHydrated` gates the writeback effect so it never runs before we've
  // read the initial query (which would clobber a shared link's params).
  const urlHydrated = useRef(false);
  useEffect(() => {
    if (!router.isReady || urlHydrated.current) return;
    const q = router.query;
    if (typeof q.search === "string") { setAppliedSearch(q.search); setSearchInputValue(q.search); }
    if (typeof q.venueType === "string") setVenueType(q.venueType);
    if (typeof q.capacity === "string") setCapacityBucket(q.capacity);
    if (typeof q.price === "string") setPriceBucket(q.price);
    if (typeof q.sort === "string") setSort(q.sort);
    if (typeof q.zone === "string" && q.zone) setSelectedZones(q.zone.split(",").filter(Boolean));
    if (q.verified === "1" || q.verified === "true") setVerifiedOnly(true);
    if (q.veg === "1" || q.veg === "true") setVegOnly(true);
    if (q.nonVeg === "1" || q.nonVeg === "true") setNonVegOnly(true);
    if (typeof q.amenities === "string" && q.amenities) {
      const next = {};
      q.amenities.split(",").filter(Boolean).forEach((k) => { next[k] = true; });
      setAmenitySet(next);
    }
    if (typeof q.areas === "string" && q.areas) {
      const areas = q.areas.split(",").filter(Boolean).map((name) => {
        const c = AREA_CENTROIDS[name.toLowerCase()];
        return { name, zone: undefined, lat: c?.lat, lng: c?.lng };
      });
      setSelectedAreas(areas);
    }
    urlHydrated.current = true;
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [router.isReady]);

  // Write current filter state back to the URL (shallow — no SSR refetch). Only
  // non-default values are written so a clean /venues stays clean.
  useEffect(() => {
    if (!router.isReady || !urlHydrated.current) return;
    const query = {};
    if (appliedSearch) query.search = appliedSearch;
    if (venueType) query.venueType = venueType;
    if (capacityBucket) query.capacity = capacityBucket;
    if (priceBucket) query.price = priceBucket;
    if (sort && sort !== "recommended") query.sort = sort;
    if (selectedZones.length > 0) query.zone = selectedZones.join(",");
    if (verifiedOnly) query.verified = "1";
    if (vegOnly) query.veg = "1";
    if (nonVegOnly) query.nonVeg = "1";
    const amenKeys = Object.keys(amenitySet).filter((k) => amenitySet[k]);
    if (amenKeys.length > 0) query.amenities = amenKeys.join(",");
    if (selectedAreas.length > 0) query.areas = selectedAreas.map((a) => a.name).join(",");

    const current = router.query;
    // Cheap shallow-equality check so we don't push duplicate history entries.
    const sameKeys = Object.keys(query).length === Object.keys(current).filter((k) => current[k] !== undefined && current[k] !== "").length;
    const sameVals = Object.keys(query).every((k) => String(current[k] ?? "") === String(query[k]));
    if (sameKeys && sameVals) return;

    router.replace({ pathname: "/venues", query }, undefined, { shallow: true, scroll: false });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [appliedSearch, venueType, capacityBucket, priceBucket, sort, selectedZones, verifiedOnly, vegOnly, nonVegOnly, amenitySet, selectedAreas, router.isReady]);

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
  // the "inside" check tightly. Dropdown panels render position: fixed but
  // remain DOM descendants of the wrapper, so closest() still matches them.
  // ───
  useEffect(() => {
    if (!openDropdown) return undefined;
    const onOutside = (e) => {
      if (!e.target.closest || !e.target.closest("[data-filter-dropdown]")) {
        setOpenDropdown(null);
      }
    };
    // Listen for both mouse (desktop) and touch (mobile) so tapping outside
    // the dropdown closes it on touch devices too.
    document.addEventListener("mousedown", onOutside);
    document.addEventListener("touchstart", onOutside);
    return () => {
      document.removeEventListener("mousedown", onOutside);
      document.removeEventListener("touchstart", onOutside);
    };
  }, [openDropdown]);

  // Close any open dropdown the moment the user scrolls — the dropdown's
  // fixed coords were captured at open time and would otherwise drift away
  // from the chip once the sticky bar's chip moves with the scroll. The area
  // dropdown is now a compact chip-anchored panel (like Zone), so it closes on
  // scroll the same way — no special-casing or body scroll-lock.
  useEffect(() => {
    if (!openDropdown) return undefined;
    const close = () => setOpenDropdown(null);
    window.addEventListener("scroll", close, { passive: true, once: true });
    return () => window.removeEventListener("scroll", close);
  }, [openDropdown]);

  // Toggle a filter chip's dropdown. Captures the chip's bounding rect so
  // the (position: fixed) dropdown panel sits exactly below it regardless
  // of where the chip is on screen.
  //
  // IMPORTANT: rect MUST be captured synchronously here, before any setState
  // call. React nulls out `event.currentTarget` after the synthetic event
  // handler returns, so reading it inside a setState updater (which runs
  // during batch flush) throws and the state update silently fails.
  const toggleDropdown = useCallback((name, event) => {
    const rect = event.currentTarget.getBoundingClientRect();
    setOpenDropdown((cur) => (cur === name ? null : name));
    setDropdownAnchor({ top: rect.bottom + 8, left: rect.left, right: rect.right });
  }, []);

  const filterActiveFlags = useMemo(() => ({
    zone: selectedZones.length > 0,
    price: !!priceBucket,
    capacity: !!capacityBucket,
    amenities: verifiedOnly || vegOnly || nonVegOnly || Object.values(amenitySet).some(Boolean),
  }), [selectedZones, priceBucket, capacityBucket, verifiedOnly, amenitySet, vegOnly, nonVegOnly]);

  const anyFilterActive =
    !!venueType ||
    filterActiveFlags.zone ||
    filterActiveFlags.price ||
    filterActiveFlags.capacity ||
    filterActiveFlags.amenities ||
    selectedAreas.length > 0 ||
    !!appliedSearch;

  const clearFilterGroup = useCallback((group) => {
    if (group === "zone") setSelectedZones([]);
    else if (group === "price") setPriceBucket("");
    else if (group === "capacity") setCapacityBucket("");
    else if (group === "amenities") { setAmenitySet({}); setVerifiedOnly(false); setVegOnly(false); setNonVegOnly(false); }
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
    count: zoneCounts[z.value] || 0,
    image: venues.find((v) => v.zone === z.value && v.coverPhoto)?.coverPhoto || "",
  })), [venues, ZONE_AREA_DEFS, zoneCounts]);
  const applyZone = useCallback((zoneValue) => {
    resetFilters();
    setSelectedZones([zoneValue]);
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
        viewAll: () => { resetFilters(); setSelectedZones(["north"]); setVenueType("resort"); setTimeout(scrollToListing, 60); },
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

  // ─── Smart area filter — derive the grouped area list, fuzzy suggestions,
  // and per-card distance labels off the loaded venue slice. ───
  const areasByZone = useMemo(() => {
    const map = {};
    ZONE_ORDER.forEach((z) => { map[z] = []; });
    const seen = new Set();
    venues.forEach((v) => {
      if (v.locality && v.zone && !seen.has(v.locality.toLowerCase())) {
        seen.add(v.locality.toLowerCase());
        const count = venues.filter((x) => x.locality?.toLowerCase() === v.locality.toLowerCase()).length;
        if (map[v.zone]) map[v.zone].push({ name: v.locality, count, zone: v.zone });
      }
    });
    // Sort alphabetically within each zone
    ZONE_ORDER.forEach((z) => {
      map[z].sort((a, b) => a.name.localeCompare(b.name));
    });
    return map;
  }, [venues]);

  const areaSuggestions = useMemo(() => {
    if (!areaFilterSearch || areaFilterSearch.length < 2) return [];
    const results = [];
    ZONE_ORDER.forEach((zone) => {
      (areasByZone[zone] || []).forEach((area) => {
        if (fuzzyMatch(areaFilterSearch, area.name)) {
          results.push({ ...area, zoneLabel: ZONE_LABELS[zone] });
        }
      });
    });
    return results.slice(0, 8);
  }, [areaFilterSearch, areasByZone]);

  const hasAnyArea = useMemo(
    () => ZONE_ORDER.some((z) => (areasByZone[z] || []).length > 0),
    [areasByZone],
  );

  // Live suggestions for the sticky-bar search — areas + venue names. Driven by
  // searchInputValue (what's typed); does NOT touch the applied filter.
  const searchSuggestions = useMemo(() => {
    if (!searchInputValue || searchInputValue.length < 2) return [];
    const q = searchInputValue.toLowerCase().trim();
    const suggestions = [];

    // Area suggestions
    ZONE_ORDER.forEach((zone) => {
      (areasByZone[zone] || []).forEach((area) => {
        if (area.name.toLowerCase().includes(q) || fuzzyMatch(q, area.name)) {
          suggestions.push({ type: "area", name: area.name, zone: area.zone, zoneLabel: ZONE_LABELS[zone] });
        }
      });
    });

    // Venue name suggestions (top 5)
    venues
      .filter((v) => v.name && v.name.toLowerCase().includes(q))
      .slice(0, 5)
      .forEach((v) => suggestions.push({ type: "venue", name: v.name, slug: v.slug, locality: v.locality }));

    return suggestions.slice(0, 8);
  }, [searchInputValue, areasByZone, venues]);

  // "In {area}" / "{n} km from {area}" relative to the CLOSEST selected area —
  // null when no area is picked or the venue lacks coordinates.
  const getDistanceLabel = useCallback((venue) => {
    if (!selectedAreas.length) return null;
    if (!venue.location?.coordinates) return null;
    const [lng, lat] = venue.location.coordinates;
    let closestArea = null;
    let closestDist = Infinity;
    selectedAreas.forEach((area) => {
      const centroid = AREA_CENTROIDS[area.name.toLowerCase()];
      if (!centroid) return;
      const dist = haversineKm(centroid.lat, centroid.lng, lat, lng);
      if (dist < closestDist) { closestDist = dist; closestArea = area; }
    });
    if (!closestArea) return null;
    if (closestDist < 0.5) return "In " + closestArea.name;
    return closestDist.toFixed(1) + " km from " + closestArea.name;
  }, [selectedAreas]);

  // Toggle an area in the multi-select. Area and Zone are separate filters — so
  // picking an area clears any zone selection. The dropdown stays open so the
  // user can keep selecting (a "Done" button closes it).
  const selectArea = useCallback((area) => {
    const centroid = AREA_CENTROIDS[area.name.toLowerCase()];
    const areaObj = { name: area.name, zone: area.zone, lat: centroid?.lat, lng: centroid?.lng };
    setSelectedAreas((prev) => {
      const exists = prev.find((a) => a.name.toLowerCase() === area.name.toLowerCase());
      if (exists) return prev.filter((a) => a.name.toLowerCase() !== area.name.toLowerCase());
      return [...prev, areaObj];
    });
    setSelectedZones([]);
    setAreaFilterSearch("");
  }, []);

  const clearArea = useCallback(() => {
    setSelectedAreas([]);
    setAreaFilterSearch("");
    setOpenDropdown(null);
  }, []);

  // Pick a search suggestion: area → set as the (single) area filter; venue →
  // apply its name as the listing search.
  const handleSuggestionSelect = useCallback((s) => {
    if (s.type === "area") {
      const centroid = AREA_CENTROIDS[s.name.toLowerCase()];
      setSelectedAreas([{ name: s.name, zone: s.zone, lat: centroid?.lat, lng: centroid?.lng }]);
      setSelectedZones([]);
      setSearchInputValue("");
      setAppliedSearch("");
    } else {
      setSearchInputValue(s.name);
      setAppliedSearch(s.name);
    }
    setShowSearchSuggestions(false);
  }, []);

  // Shared suggestions dropdown — used by BOTH the hero search and the sticky
  // filter-bar search. Renders nothing unless suggestions are open and present.
  // Without anchorRef: absolute, relative to a position:relative parent.
  // With anchorRef (hero search): position:fixed off the input's rect, so the
  // hero section's overflow:hidden can't clip it.
  const renderSuggestionsDropdown = (anchorRef) => {
    if (!showSearchSuggestions || searchSuggestions.length === 0) return null;
    let dropdownStyle = S.searchSuggestDropdown;
    if (anchorRef?.current) {
      const rect = anchorRef.current.getBoundingClientRect();
      dropdownStyle = {
        position: "fixed",
        top: rect.bottom + 4,
        left: rect.left,
        width: rect.width,
        zIndex: 9999,
        background: "#ffffff",
        borderRadius: 12,
        border: "1px solid #e8d8c4",
        boxShadow: "0 8px 32px rgba(107,30,46,0.12)",
        maxHeight: 300,
        overflowY: "auto",
      };
    }
    return (
      <div style={dropdownStyle}>
        {searchSuggestions.some((s) => s.type === "area") && (
          <div style={S.searchSuggestHeader}>📍 Areas</div>
        )}
        {searchSuggestions.filter((s) => s.type === "area").map((s, i) => (
          <button
            key={`sa-${s.name}-${i}`}
            type="button"
            className="area-row"
            style={S.searchSuggestRow}
            onMouseDown={(e) => e.preventDefault()}
            onClick={() => handleSuggestionSelect(s)}
          >
            <span style={S.searchSuggestName}>{s.name}</span>
            <span style={S.searchSuggestMeta}>{s.zoneLabel}</span>
          </button>
        ))}
        {searchSuggestions.some((s) => s.type === "venue") && (
          <div style={S.searchSuggestHeader}>🏛️ Venues</div>
        )}
        {searchSuggestions.filter((s) => s.type === "venue").map((s, i) => (
          <button
            key={`sv-${s.name}-${i}`}
            type="button"
            className="area-row"
            style={S.searchSuggestRow}
            onMouseDown={(e) => e.preventDefault()}
            onClick={() => handleSuggestionSelect(s)}
          >
            <span style={S.searchSuggestName}>{s.name}</span>
            <span style={S.searchSuggestMeta}>{s.locality || ""}</span>
          </button>
        ))}
      </div>
    );
  };

  // Sticky-bar search box (rendered once, used on both mobile and desktop).
  // Typing only updates suggestions; the listing filter (appliedSearch) changes
  // on Enter, suggestion select, or clear.
  const renderSearchBox = () => (
    <div style={{ ...S.filterBarSearch, ...(isMobile ? S.filterBarSearchMobile : {}), position: "relative" }}>
      <span style={S.filterBarSearchIcon} aria-hidden="true">
        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <circle cx="11" cy="11" r="7" />
          <path d="M21 21l-4.35-4.35" />
        </svg>
      </span>
      <input
        type="text"
        style={S.filterBarSearchInput}
        placeholder="Search venues..."
        value={searchInputValue}
        onChange={(e) => { setSearchInputValue(e.target.value); setShowSearchSuggestions(true); }}
        onKeyDown={(e) => {
          if (e.key === "Enter") { setAppliedSearch(searchInputValue); setShowSearchSuggestions(false); }
          if (e.key === "Escape") { setShowSearchSuggestions(false); }
        }}
        onFocus={() => { if (searchInputValue.length >= 2) setShowSearchSuggestions(true); }}
        onBlur={() => { setTimeout(() => setShowSearchSuggestions(false), 150); }}
        aria-label="Search venues by name or area"
      />
      {searchInputValue && (
        <button
          type="button"
          aria-label="Clear search"
          style={S.searchClearBtn}
          onClick={() => { setSearchInputValue(""); setAppliedSearch(""); setShowSearchSuggestions(false); }}
        >×</button>
      )}
      {renderSuggestionsDropdown()}
    </div>
  );

  // ─── Counts (per facet — based on the loaded slice, so badges grow as the
  // user paginates). ───
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
    let result = venues
      .filter((v) => {
        if (!appliedSearch) return true;
        const q = appliedSearch.toLowerCase();
        return v.name?.toLowerCase().includes(q) || v.address?.toLowerCase().includes(q);
      })
      .filter((v) => (venueType ? v.venueType === venueType : true))
      // Zone filter is server-authoritative — we refetch on change. If the
      // API response omits `v.zone` (older deployment), trust the server
      // filter rather than dropping every card.
      .filter((v) => {
        if (selectedZones.length === 0) return true;
        if (v.zone === undefined) return true;
        return selectedZones.includes(v.zone);
      })
      .filter((v) => inCapacityBucket(venueMaxCapacity(v), capacityBucket))
      .filter((v) => inPriceBucket(venueLowestPrice(v), priceBucket))
      .filter((v) => {
        const active = AMENITY_FILTERS.filter((a) => amenitySet[a.key]);
        if (active.length === 0) return true;
        return active.every((a) => venueHasAmenity(v, a.path));
      })
      .filter((v) => (verifiedOnly ? (v.isVerified === true || v.status === "verified") : true))
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

    // Area filter (multi-select) — narrow to ANY selected area's zone, then
    // surface venues whose locality matches ANY selected area first, ordered by
    // distance to the CLOSEST selected area centroid.
    if (selectedAreas.length > 0) {
      const names = new Set(selectedAreas.map((a) => a.name.toLowerCase()));
      // Nearest selected-area centroid distance for a venue (Infinity if none).
      const closestDist = (v) => {
        if (!v.location?.coordinates) return Infinity;
        const [lng, lat] = v.location.coordinates;
        let min = Infinity;
        selectedAreas.forEach((a) => {
          const c = AREA_CENTROIDS[a.name.toLowerCase()];
          if (!c) return;
          const d = haversineKm(c.lat, c.lng, lat, lng);
          if (d < min) min = d;
        });
        return min;
      };
      result = result.filter((v) => selectedAreas.some((a) => a.zone === v.zone));
      result = [...result].sort((a, b) => {
        const aExact = names.has((a.locality || "").toLowerCase());
        const bExact = names.has((b.locality || "").toLowerCase());
        if (aExact && !bExact) return -1;
        if (!aExact && bExact) return 1;
        return closestDist(a) - closestDist(b);
      });
    }

    // Final pass — featured venues (e.g. Crown Estate) always sort first.
    result = [...result].sort((a, b) => {
      if (a.featured && !b.featured) return -1;
      if (!a.featured && b.featured) return 1;
      return 0;
    });
    return result;
  }, [venues, appliedSearch, venueType, selectedZones, capacityBucket, priceBucket, amenitySet, verifiedOnly, sort, selectedAreas]);

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
        <meta property="og:url" content="https://wedsy.in/venues" />
        <meta property="og:site_name" content="Wedsy" />
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:title" content="Wedding Venues in Bangalore | Wedsy" />
        <meta name="twitter:description" content={`${total} curated wedding venues in Bangalore. Browse, compare, and chat directly with venues.`} />
        <link rel="canonical" href="https://wedsy.in/venues" />
        <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify({ "@context": "https://schema.org", "@type": "ItemList", name: "Wedding Venues in Bangalore", description: "Curated wedding resorts, farmhouses, and villas in Bangalore", numberOfItems: total, url: "https://wedsy.in/venues" }) }} />
      </Head>

      <main style={S.page}>
        {/* ────────── 1 — HERO (Option K: Ivory + Crown Divider, centered) ────────── */}
        <section
          style={{
            padding: "40px 24px 36px",
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            justifyContent: "center",
            textAlign: "center",
            background: "#ffffff",
            overflow: "hidden",
          }}
        >
          {/* Gold crown divider */}
          <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 20, maxWidth: 560, width: "100%" }}>
            <div
              style={{
                flex: 1,
                height: 0.5,
                background: "linear-gradient(to right, transparent, #b8852a)",
              }}
              aria-hidden="true"
            />
            <div
              style={{
                fontSize: 9,
                color: "#b8852a",
                letterSpacing: 4,
                textTransform: "uppercase",
                whiteSpace: "nowrap",
              }}
            >
              WEDSY · BANGALORE
            </div>
            <div
              style={{
                flex: 1,
                height: 0.5,
                background: "linear-gradient(to left, transparent, #b8852a)",
              }}
              aria-hidden="true"
            />
          </div>

          <h1 style={{ fontFamily: "Georgia, 'Times New Roman', serif", fontWeight: 400, margin: 0 }}>
            <span
              style={{
                color: "#1a0a0a",
                fontSize: "clamp(2.2rem, 4vw, 3.4rem)",
                display: "block",
                lineHeight: 1.1,
              }}
            >
              Find your
            </span>
            <span
              style={{
                color: "#b8852a",
                fontStyle: "italic",
                fontSize: "clamp(3rem, 5.5vw, 5rem)",
                display: "block",
                lineHeight: 0.95,
                marginTop: -4,
              }}
            >
              perfect
            </span>
            <span
              style={{
                color: "#1a0a0a",
                fontSize: "clamp(2.2rem, 4vw, 3.4rem)",
                display: "block",
                lineHeight: 1.1,
                marginTop: -4,
              }}
            >
              wedding venue.
            </span>
          </h1>

          <p
            style={{
              maxWidth: 480,
              textAlign: "center",
              margin: "16px auto 0",
              fontSize: 13,
              color: "#5a3a2a",
              lineHeight: 1.7,
              fontStyle: "italic",
            }}
          >
            Not every venue in Bangalore is on Wedsy. Just the ones worth your time.
          </p>

          {/* Search (sharp-edged, no border-radius) */}
          <form
            onSubmit={(e) => { e.preventDefault(); setAppliedSearch(searchInputValue); setShowSearchSuggestions(false); scrollToListing(); }}
            style={{
              position: "relative",
              marginTop: 18,
              maxWidth: 480,
              width: "100%",
              display: "flex",
              alignItems: "center",
              background: "#ffffff",
              border: "1px solid #1a0a0a",
              padding: "8px 8px 8px 16px",
            }}
          >
            <svg
              width="14"
              height="14"
              viewBox="0 0 24 24"
              fill="none"
              stroke="#b8852a"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
              aria-hidden="true"
            >
              <circle cx="11" cy="11" r="7" />
              <path d="M21 21l-4.35-4.35" />
            </svg>
            <input
              ref={heroSearchRef}
              className="hero-k-input"
              value={searchInputValue}
              onChange={(e) => { setSearchInputValue(e.target.value); setShowSearchSuggestions(true); }}
              onKeyDown={(e) => { if (e.key === "Escape") setShowSearchSuggestions(false); }}
              onFocus={() => { if (searchInputValue.length >= 2) setShowSearchSuggestions(true); }}
              onBlur={() => { setTimeout(() => setShowSearchSuggestions(false), 150); }}
              placeholder="Search by name, area, or vibe…"
              aria-label="Search venues"
              style={{
                flex: 1,
                marginLeft: 10,
                border: "none",
                outline: "none",
                fontSize: 12,
                background: "transparent",
                color: "#1a0a0a",
              }}
            />
            <button
              type="submit"
              style={{
                background: "#1a0a0a",
                color: "#f8f4ef",
                border: "none",
                padding: "9px 18px",
                fontSize: 11,
                cursor: "pointer",
                letterSpacing: 0.5,
                fontWeight: 500,
              }}
            >
              Search →
            </button>
            {renderSuggestionsDropdown(heroSearchRef)}
          </form>

          {/* Stat panels — horizontal row BELOW search, same width */}
          <div
            style={{
              marginTop: 24,
              maxWidth: 480,
              width: "100%",
              display: "flex",
              flexDirection: "row",
              border: "0.5px solid #e8d8c4",
              background: "#fafafa",
            }}
          >
            {[
              { number: total, label: "Curated venues" },
              { number: "4.8★", label: "Avg rating" },
              { number: "₹0", label: "Commission" },
            ].map((p, i, arr) => {
              const last = i === arr.length - 1;
              return (
                <div
                  key={i}
                  style={{
                    flex: 1,
                    padding: isMobile ? "10px 8px" : "14px 16px",
                    borderRight: !last ? "0.5px solid #e8d8c4" : "none",
                    textAlign: "center",
                  }}
                >
                  <div
                    style={{
                      fontFamily: "Georgia, 'Times New Roman', serif",
                      fontSize: isMobile ? 20 : 26,
                      color: "#6b1e2e",
                      lineHeight: 1,
                    }}
                  >
                    {p.number}
                  </div>
                  <div
                    style={{
                      fontSize: isMobile ? 7 : 8,
                      color: "#b09080",
                      letterSpacing: 2,
                      textTransform: "uppercase",
                      marginTop: 4,
                    }}
                  >
                    {p.label}
                  </div>
                </div>
              );
            })}
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

        {/* ────────── 5 — STICKY FILTER BAR ──────────
           Desktop: one horizontal-scroll row with search inside.
           Mobile: search becomes its own full-width row above a scrolling
                   row of category pills + filter chips. */}
        <div style={S.filterBar}>
          <div style={{ ...S.filterBarFlex, ...(isMobile ? S.filterBarFlexMobile : {}) }}>
            {/* Search box rendered OUTSIDE the overflow-x scroller below, so its
                absolutely-positioned suggestions dropdown isn't clipped. */}
            {renderSearchBox()}
            <div className="filter-bar-row" style={{ ...S.filterBarRow, ...(isMobile ? S.filterBarRowMobile : {}) }}>
              {!isMobile && <div style={S.filterDivider} aria-hidden="true" />}

              {/* Category pills */}
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

              <div style={S.filterDivider} aria-hidden="true" />

              {/* Zone dropdown (multi-select checkboxes) */}
              <div style={S.filterChipWrap} data-filter-dropdown>
                <button
                  type="button"
                  style={filterActiveFlags.zone ? S.filterChipOn : S.filterChip}
                  onClick={(e) => toggleDropdown("zone", e)}
                  aria-expanded={openDropdown === "zone"}
                  aria-haspopup="listbox"
                >
                  <span>
                    {selectedZones.length === 0
                      ? "Zone"
                      : selectedZones.length === 1
                        ? `Zone: ${ZONES.find((z) => z.value === selectedZones[0])?.label || selectedZones[0]}`
                        : `Zone: ${selectedZones.length} selected`}
                  </span>
                  {filterActiveFlags.zone ? (
                    <span
                      role="button"
                      tabIndex={0}
                      aria-label="Clear zone filter"
                      style={S.filterChipX}
                      onClick={(e) => { e.stopPropagation(); clearFilterGroup("zone"); }}
                      onKeyDown={(e) => { if (e.key === "Enter" || e.key === " ") { e.preventDefault(); e.stopPropagation(); clearFilterGroup("zone"); } }}
                    >×</span>
                  ) : (
                    !isMobile && <span style={S.filterChipCaret} aria-hidden="true">▾</span>
                  )}
                </button>
                {openDropdown === "zone" && (
                  <div style={{ ...S.filterDropdown, top: dropdownAnchor.top, left: dropdownAnchor.left }}>
                    {ZONES.map((z) => {
                      const isAll = z.value === "all";
                      const checked = isAll ? selectedZones.length === 0 : selectedZones.includes(z.value);
                      return (
                        <label key={z.value} style={S.filterDropdownItem}>
                          <input
                            type="checkbox"
                            checked={checked}
                            onChange={() => {
                              // Zone and Area are separate filters — picking a
                              // zone clears any selected areas.
                              setSelectedAreas([]);
                              if (isAll) {
                                setSelectedZones([]);
                              } else {
                                setSelectedZones((prev) =>
                                  prev.includes(z.value)
                                    ? prev.filter((x) => x !== z.value)
                                    : [...prev, z.value]
                                );
                              }
                            }}
                            style={{ accentColor: C.burgundy }}
                          />
                          <span>{z.label}</span>
                        </label>
                      );
                    })}
                  </div>
                )}
              </div>

              {/* Area dropdown (smart area search) */}
              <div style={S.filterChipWrap} data-filter-dropdown>
                <button
                  type="button"
                  style={selectedAreas.length > 0 ? S.filterChipOn : S.filterChip}
                  onClick={(e) => toggleDropdown("area", e)}
                  onTouchStart={(e) => e.stopPropagation()}
                  aria-expanded={openDropdown === "area"}
                  aria-haspopup="listbox"
                >
                  <span>
                    {selectedAreas.length === 0
                      ? "Area"
                      : selectedAreas.length === 1
                        ? `📍 ${selectedAreas[0].name}`
                        : selectedAreas.length === 2
                          ? `📍 ${selectedAreas[0].name}, ${selectedAreas[1].name}`
                          : `📍 ${selectedAreas.length} areas`}
                  </span>
                  {selectedAreas.length > 0 ? (
                    <span
                      role="button"
                      tabIndex={0}
                      aria-label="Clear area filter"
                      style={S.filterChipX}
                      onClick={(e) => { e.stopPropagation(); clearArea(); }}
                      onKeyDown={(e) => { if (e.key === "Enter" || e.key === " ") { e.preventDefault(); e.stopPropagation(); clearArea(); } }}
                    >×</span>
                  ) : (
                    !isMobile && <span style={S.filterChipCaret} aria-hidden="true">▾</span>
                  )}
                </button>
                {openDropdown === "area" && (
                  <div
                    style={{
                      ...S.areaDropdown,
                      // Compact chip-anchored dropdown on ALL screen sizes (same
                      // behaviour as the Zone dropdown). Clamp to the chip's right
                      // edge if a left-anchored 260px panel would overflow the
                      // viewport's right side.
                      top: dropdownAnchor.top,
                      left:
                        typeof window !== "undefined" && dropdownAnchor.left + 260 > window.innerWidth - 8
                          ? Math.max(8, dropdownAnchor.right - 260)
                          : dropdownAnchor.left,
                      width: 260,
                      maxHeight: 320,
                    }}
                  >
                    <div style={S.areaDropdownHeader}>
                      <input
                        type="search"
                        style={S.areaDropdownSearch}
                        placeholder="Search areas..."
                        value={areaFilterSearch}
                        onChange={(e) => setAreaFilterSearch(e.target.value)}
                        aria-label="Search areas"
                        autoFocus
                      />
                    </div>
                    <div style={S.areaDropdownBody}>
                      {areaFilterSearch.length >= 2 ? (
                        areaSuggestions.length > 0 ? (
                          <div style={S.areaSuggestBox}>
                            <div style={S.areaSuggestLabel}>Suggestions</div>
                            {areaSuggestions.map((area) => {
                              const isSelected = selectedAreas.some(
                                (a) => a.name.toLowerCase() === area.name.toLowerCase(),
                              );
                              return (
                                <button
                                  key={`${area.zone}-${area.name}`}
                                  type="button"
                                  className="area-row"
                                  style={S.areaSuggestRow}
                                  onClick={() => selectArea(area)}
                                >
                                  <span style={S.areaRowLeft}>
                                    <span style={isSelected ? S.areaCheckboxOn : S.areaCheckbox} aria-hidden="true">
                                      {isSelected ? "✓" : ""}
                                    </span>
                                    <span style={{ ...S.areaRowName, fontWeight: 600 }}>{area.name}</span>
                                    <span style={S.areaRowCount}>({area.count})</span>
                                  </span>
                                  <span style={{ fontSize: 10, color: "#b8852a" }}>{area.zoneLabel}</span>
                                </button>
                              );
                            })}
                          </div>
                        ) : (
                          <div style={S.areaEmpty}>No areas found</div>
                        )
                      ) : hasAnyArea ? (
                        ZONE_ORDER.map((zone) => {
                          const list = areasByZone[zone] || [];
                          if (list.length === 0) return null;
                          return (
                            <div key={zone}>
                              <div style={S.areaZoneHeader}>{ZONE_LABELS[zone]}</div>
                              {list.map((area) => {
                                const isSelected = selectedAreas.some(
                                  (a) => a.name.toLowerCase() === area.name.toLowerCase(),
                                );
                                return (
                                  <button
                                    key={`${zone}-${area.name}`}
                                    type="button"
                                    className="area-row"
                                    style={S.areaRow}
                                    onClick={() => selectArea(area)}
                                  >
                                    <span style={S.areaRowLeft}>
                                      <span style={isSelected ? S.areaCheckboxOn : S.areaCheckbox} aria-hidden="true">
                                        {isSelected ? "✓" : ""}
                                      </span>
                                      <span style={S.areaRowName}>{area.name}</span>
                                    </span>
                                    <span style={S.areaRowCount}>({area.count})</span>
                                  </button>
                                );
                              })}
                            </div>
                          );
                        })
                      ) : (
                        <div style={S.areaEmpty}>No areas available</div>
                      )}
                    </div>
                    {selectedAreas.length > 0 && (
                      <button
                        type="button"
                        onClick={() => setOpenDropdown(null)}
                        style={{
                          width: "100%", padding: "10px", background: "#6b1e2e", color: "white",
                          border: "none", borderRadius: "0 0 12px 12px", cursor: "pointer",
                          fontSize: 13, fontWeight: 600,
                        }}
                      >
                        Done
                      </button>
                    )}
                  </div>
                )}
              </div>

              {/* Price dropdown */}
              <div style={S.filterChipWrap} data-filter-dropdown>
                <button
                  type="button"
                  style={filterActiveFlags.price ? S.filterChipOn : S.filterChip}
                  onClick={(e) => toggleDropdown("price", e)}
                  aria-expanded={openDropdown === "price"}
                  aria-haspopup="listbox"
                >
                  <span>Price</span>
                  {filterActiveFlags.price ? (
                    <span
                      role="button"
                      tabIndex={0}
                      aria-label="Clear price filter"
                      style={S.filterChipX}
                      onClick={(e) => { e.stopPropagation(); clearFilterGroup("price"); }}
                      onKeyDown={(e) => { if (e.key === "Enter" || e.key === " ") { e.preventDefault(); e.stopPropagation(); clearFilterGroup("price"); } }}
                    >×</span>
                  ) : (
                    !isMobile && <span style={S.filterChipCaret} aria-hidden="true">▾</span>
                  )}
                </button>
                {openDropdown === "price" && (
                  <div style={{ ...S.filterDropdown, top: dropdownAnchor.top, left: dropdownAnchor.left, ...(isMobile ? S.filterDropdownMobile : {}) }} role="listbox">
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
                  onClick={(e) => toggleDropdown("capacity", e)}
                  aria-expanded={openDropdown === "capacity"}
                  aria-haspopup="listbox"
                >
                  <span>Capacity</span>
                  {filterActiveFlags.capacity ? (
                    <span
                      role="button"
                      tabIndex={0}
                      aria-label="Clear capacity filter"
                      style={S.filterChipX}
                      onClick={(e) => { e.stopPropagation(); clearFilterGroup("capacity"); }}
                      onKeyDown={(e) => { if (e.key === "Enter" || e.key === " ") { e.preventDefault(); e.stopPropagation(); clearFilterGroup("capacity"); } }}
                    >×</span>
                  ) : (
                    !isMobile && <span style={S.filterChipCaret} aria-hidden="true">▾</span>
                  )}
                </button>
                {openDropdown === "capacity" && (
                  <div style={{ ...S.filterDropdown, top: dropdownAnchor.top, left: dropdownAnchor.left, ...(isMobile ? S.filterDropdownMobile : {}) }} role="listbox">
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
                  onClick={(e) => toggleDropdown("amenities", e)}
                  aria-expanded={openDropdown === "amenities"}
                  aria-haspopup="listbox"
                >
                  <span>Amenities</span>
                  {filterActiveFlags.amenities ? (
                    <span
                      role="button"
                      tabIndex={0}
                      aria-label="Clear amenity filters"
                      style={S.filterChipX}
                      onClick={(e) => { e.stopPropagation(); clearFilterGroup("amenities"); }}
                      onKeyDown={(e) => { if (e.key === "Enter" || e.key === " ") { e.preventDefault(); e.stopPropagation(); clearFilterGroup("amenities"); } }}
                    >×</span>
                  ) : (
                    !isMobile && <span style={S.filterChipCaret} aria-hidden="true">▾</span>
                  )}
                </button>
                {openDropdown === "amenities" && (
                  <div style={{ ...S.filterDropdown, top: dropdownAnchor.top, left: dropdownAnchor.left, ...(isMobile ? S.filterDropdownMobile : {}) }}>
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
                        checked={vegOnly}
                        onChange={(e) => setVegOnly(e.target.checked)}
                        style={{ accentColor: C.burgundy }}
                      />
                      <span>🥦 Veg catering</span>
                    </label>
                    <label style={S.filterDropdownItem}>
                      <input
                        type="checkbox"
                        checked={nonVegOnly}
                        onChange={(e) => setNonVegOnly(e.target.checked)}
                        style={{ accentColor: C.burgundy }}
                      />
                      <span>🍖 Non-veg catering</span>
                    </label>
                    <label style={S.filterDropdownItem}>
                      <input
                        type="checkbox"
                        checked={verifiedOnly}
                        onChange={(e) => setVerifiedOnly(e.target.checked)}
                        style={{ accentColor: C.burgundy }}
                      />
                      <span>✓ Verified only</span>
                    </label>
                  </div>
                )}
              </div>
            </div>

            {/* Reset link — outside the scroll, always visible on the right */}
            {anyFilterActive && (
              <button type="button" style={S.resetLink} onClick={resetFilters}>Reset all</button>
            )}
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
                <div className="all-venues-grid" style={{ ...S.fullWidthGrid, ...(isMobile ? S.fullWidthGridMobile : isTablet ? S.fullWidthGridTablet : {}) }}>
                  {filtered.map((v) => <VenueCard key={v._id} venue={v} distanceLabel={getDistanceLabel(v)} />)}
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
        /* ────────────────────────────────────────────────────────────────
           RULE: Never use opacity in keyframes or fill-mode "both/forwards"
                 — causes blank screen on first paint.
           ────────────────────────────────────────────────────────────────
           Keyframes here may animate transform ONLY (translateY, scale,
           rotate). They must never set opacity: 0 in from/to. Animation
           declarations must omit fill-mode entirely (default "none") so
           elements show their natural styles before/after the animation
           runs. If you need a stateful hidden→shown transition, drive it
           with React state, not CSS animation-fill-mode.

           Past bug: a previous version applied opacity: 0 in @keyframes +
           animation-fill-mode: both with staggered delays up to 1.1s. The
           hero's 92vh-tall section then rendered invisible for ~1 second
           on first paint, which looked exactly like a blank white page.
           ──────────────────────────────────────────────────────────────── */
        :global(.venue-card):hover {
          transform: translateY(-2px);
          box-shadow: 0 6px 28px rgba(107, 30, 46, 0.12);
          border-color: ${C.gold} !important;
        }
        :global(.hero-k-input)::placeholder { color: #b09080; }
        :global(.area-row):hover { background: rgba(107, 30, 46, 0.04); }
        /* Hide scrollbars on horizontal scrollers (filter bar, curated rows). */
        :global(.filter-bar-row)::-webkit-scrollbar,
        :global(.curated-scroll)::-webkit-scrollbar { display: none; }
        :global(.filter-bar-row), :global(.curated-scroll) {
          scrollbar-width: none;
          -ms-overflow-style: none;
        }
      `}</style>
    </>
  );
}

export async function getServerSideProps() {
  const emptyZoneCounts = { airport: 0, north: 0, south: 0, east: 0, west: 0, central: 0 };
  try {
    const res = await fetch(
      `${process.env.NEXT_PUBLIC_API_URL}/venues?status=published&limit=1000&skip=0`,
      { headers: { "Content-Type": "application/json" } }
    );
    if (!res.ok) throw new Error("Failed to fetch venues");
    const data = await res.json();
    const venues = data.venues || [];
    const zoneCounts = {
      airport: venues.filter((v) => v.zone === "airport").length,
      north: venues.filter((v) => v.zone === "north").length,
      south: venues.filter((v) => v.zone === "south").length,
      east: venues.filter((v) => v.zone === "east").length,
      west: venues.filter((v) => v.zone === "west").length,
      central: venues.filter((v) => v.zone === "central").length,
    };
    return { props: { venues, total: data.total || 0, zoneCounts } };
  } catch (err) {
    console.error("Venues SSR error:", err.message);
    return { props: { venues: [], total: 0, zoneCounts: emptyZoneCounts } };
  }
}
