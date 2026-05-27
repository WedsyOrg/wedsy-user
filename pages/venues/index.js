import Head from "next/head";
import Link from "next/link";
import { useState, useCallback, useMemo } from "react";

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

const AREAS = [
  "North Bangalore",
  "South Bangalore",
  "Devanahalli",
  "Nandi Hills",
  "Electronic City",
  "Whitefield",
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
  cardImgWrap: { position: "relative", height: 200, overflow: "hidden", background: "#f0e2c8" },
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

// ─── Page ───
export default function VenuesPage({ venues = [], total = 0 }) {
  const [search, setSearch] = useState("");
  const [venueType, setVenueType] = useState("");
  const [selectedAreas, setSelectedAreas] = useState([]);
  const [capacityBucket, setCapacityBucket] = useState("");
  const [priceBucket, setPriceBucket] = useState("");
  const [amenitySet, setAmenitySet] = useState({});
  const [verifiedOnly, setVerifiedOnly] = useState(false);
  const [sort, setSort] = useState("recommended");

  const toggleArea = useCallback((area) => {
    setSelectedAreas((prev) => prev.includes(area) ? prev.filter((a) => a !== area) : [...prev, area]);
  }, []);
  const toggleAmenity = useCallback((key) => {
    setAmenitySet((prev) => ({ ...prev, [key]: !prev[key] }));
  }, []);
  const resetFilters = () => {
    setSearch("");
    setVenueType("");
    setSelectedAreas([]);
    setCapacityBucket("");
    setPriceBucket("");
    setAmenitySet({});
    setVerifiedOnly(false);
  };

  // ─── Counts (per facet — based on the full list, not the filtered set, so
  // badges remain stable as the user toggles filters) ───
  const verifiedCount = useMemo(() => venues.filter((v) => v.status === "verified").length, [venues]);
  const areaCounts = useMemo(() => {
    const m = {};
    AREAS.forEach((a) => { m[a] = venues.filter((v) => v.address?.includes(a)).length; });
    return m;
  }, [venues]);
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
      .filter((v) => (selectedAreas.length > 0 ? selectedAreas.some((a) => v.address?.includes(a)) : true))
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
  }, [venues, search, venueType, selectedAreas, capacityBucket, priceBucket, amenitySet, verifiedOnly, sort]);

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
        {/* 1 — HERO */}
        <section style={S.hero}>
          <div style={S.heroEyebrow}>Bangalore's curated wedding venues</div>
          <h1 style={S.heroTitle}>
            Find your <em style={S.heroTitleEm}>perfect</em> wedding venue<br />in Bangalore
          </h1>
          <p style={S.heroSub}>
            Resorts, farmhouses, and villas — vetted, photographed, and ready for the day you've imagined.
          </p>
          <div style={S.searchBar}>
            <input
              style={S.searchInput}
              placeholder="Search by name or area…"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
            <div style={S.searchDivider} />
            <select style={S.searchSelect} value={venueType} onChange={(e) => setVenueType(e.target.value)}>
              <option value="">All venue types</option>
              <option value="resort">Resort</option>
              <option value="farmhouse">Farmhouse</option>
              <option value="villa">Villa</option>
            </select>
            <button type="button" style={S.searchBtn} aria-label="Search">Search</button>
          </div>
          <div style={S.statsRow}>
            <span><span style={S.statNum}>{total}</span> Venues</span>
            <span style={S.statSep}>·</span>
            <span><span style={S.statNum}>{verifiedCount}</span> Verified</span>
            <span style={S.statSep}>·</span>
            <span><span style={S.statNum}>2 hr</span> avg response</span>
            <span style={S.statSep}>·</span>
            <span><span style={S.statNum}>Always free</span></span>
          </div>
        </section>

        {/* 2 — TYPE TABS */}
        <div style={S.tabsWrap}>
          {VENUE_TYPE_TABS.map((t) => (
            <button
              key={t.value || "all"}
              type="button"
              style={venueType === t.value ? S.tabOn : S.tab}
              onClick={() => setVenueType(t.value)}
            >
              {t.label}
              {typeCounts[t.value] !== undefined && (
                <span style={{ marginLeft: 8, opacity: 0.7 }}>{typeCounts[t.value]}</span>
              )}
            </button>
          ))}
        </div>

        {/* 3 — FEATURED */}
        {featured.length > 0 && (
          <section style={S.featuredSec}>
            <div style={S.featuredKicker}>✨ Featured this week</div>
            <h2 style={S.featuredTitle}>The most complete listings on Wedsy</h2>
            <div style={S.featuredGrid}>
              {featured.map((v) => <VenueCard key={v._id} venue={v} featured />)}
            </div>
          </section>
        )}

        {/* 4 + 5 — FILTERS SIDEBAR + RESULTS */}
        <div style={S.body}>
          <aside style={S.sidebar}>
            {/* Venue type (radio) */}
            <div style={S.filterCard}>
              <div style={S.filterHeader}>Venue type</div>
              {VENUE_TYPE_TABS.map((t) => (
                <label key={t.value || "all"} style={S.filterOption}>
                  <input
                    type="radio"
                    name="venueTypeFilter"
                    checked={venueType === t.value}
                    onChange={() => setVenueType(t.value)}
                    style={{ accentColor: C.burgundy }}
                  />
                  <span style={S.filterLabel}>{t.label}</span>
                  <span style={S.filterCount}>{typeCounts[t.value] ?? 0}</span>
                </label>
              ))}
            </div>

            {/* Area checkboxes */}
            <div style={S.filterCard}>
              <div style={S.filterHeader}>Area</div>
              {AREAS.map((a) => (
                <label key={a} style={S.filterOption}>
                  <input
                    type="checkbox"
                    checked={selectedAreas.includes(a)}
                    onChange={() => toggleArea(a)}
                    style={{ accentColor: C.burgundy }}
                  />
                  <span style={S.filterLabel}>{a}</span>
                  <span style={S.filterCount}>{areaCounts[a] ?? 0}</span>
                </label>
              ))}
            </div>

            {/* Capacity */}
            <div style={S.filterCard}>
              <div style={S.filterHeader}>Guest capacity</div>
              <select style={S.filterSelect} value={capacityBucket} onChange={(e) => setCapacityBucket(e.target.value)}>
                {CAPACITY_OPTIONS.map((o) => <option key={o.value} value={o.value}>{o.label}</option>)}
              </select>
            </div>

            {/* Price range */}
            <div style={S.filterCard}>
              <div style={S.filterHeader}>Price range</div>
              <select style={S.filterSelect} value={priceBucket} onChange={(e) => setPriceBucket(e.target.value)}>
                {PRICE_OPTIONS.map((o) => <option key={o.value} value={o.value}>{o.label}</option>)}
              </select>
            </div>

            {/* Amenities */}
            <div style={S.filterCard}>
              <div style={S.filterHeader}>Amenities</div>
              {AMENITY_FILTERS.map((a) => (
                <label key={a.key} style={S.filterOption}>
                  <input
                    type="checkbox"
                    checked={!!amenitySet[a.key]}
                    onChange={() => toggleAmenity(a.key)}
                    style={{ accentColor: C.burgundy }}
                  />
                  <span style={S.filterLabel}>
                    <span aria-hidden="true" style={{ marginRight: 6 }}>{a.icon}</span>
                    {a.label}
                  </span>
                </label>
              ))}
            </div>

            {/* Verified toggle */}
            <div style={S.filterCard}>
              <div style={S.filterToggleRow}>
                <span style={S.filterToggleText}>Verified venues only</span>
                <button
                  type="button"
                  aria-pressed={verifiedOnly}
                  onClick={() => setVerifiedOnly((v) => !v)}
                  style={{ ...S.filterTogglePill, background: verifiedOnly ? C.burgundy : "#e8d8c4" }}
                >
                  <span
                    style={{
                      ...S.filterToggleKnob,
                      transform: verifiedOnly ? "translateX(16px)" : "translateX(0)",
                      display: "block",
                    }}
                  />
                </button>
              </div>
            </div>

            <button type="button" style={S.resetBtn} onClick={resetFilters}>Reset filters</button>
          </aside>

          <div style={S.main}>
            <div style={S.resultsHeader}>
              <div style={S.resultsCount}>
                Showing <span style={S.resultsCountStrong}>{filtered.length}</span> of {venues.length} venues
              </div>
              <select style={S.sortSelect} value={sort} onChange={(e) => setSort(e.target.value)}>
                <option value="recommended">Sort: Recommended</option>
                <option value="rating">Rating: Highest</option>
                <option value="capacity">Capacity: Largest</option>
                <option value="price">Price: Low to high</option>
              </select>
            </div>

            {/* 5 — VENUE CARDS */}
            {filtered.length > 0 ? (
              <div style={S.grid}>
                {filtered.map((v) => <VenueCard key={v._id} venue={v} />)}
              </div>
            ) : (
              /* 6 — EMPTY STATE */
              <div style={S.empty}>
                <div style={S.emptyIcon}>🔍</div>
                <div style={S.emptyTitle}>No venues match those filters</div>
                <div style={S.emptyText}>Try widening your capacity, price, or area selection — there's a fit out there.</div>
                <button type="button" style={S.emptyBtn} onClick={resetFilters}>Clear filters</button>
              </div>
            )}
          </div>
        </div>

        {/* 7 — BOTTOM CTA */}
        <div style={S.ownerBand}>
          <div style={S.ownerKicker}>For venue owners</div>
          <div style={S.ownerHeadline}>Own a wedding venue?</div>
          <Link href="/venues/join" style={S.ownerLink}>
            List it on Wedsy <span aria-hidden="true">→</span>
          </Link>
        </div>
      </main>

      <style jsx>{`
        :global(.venue-card):hover {
          transform: translateY(-2px);
          box-shadow: 0 6px 28px rgba(107, 30, 46, 0.12);
          border-color: ${C.gold} !important;
        }
      `}</style>
    </>
  );
}

export async function getServerSideProps() {
  try {
    const res = await fetch(
      `${process.env.NEXT_PUBLIC_API_URL}/venues?status=published&limit=100`,
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
