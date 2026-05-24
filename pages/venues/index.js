import Head from "next/head";
import Link from "next/link";
import { useState, useCallback } from "react";


import { trimTitle, trimDescription } from "@/utils/seo";

const VENUE_TYPES = [
  { value: "", label: "All types" },
  { value: "resort", label: "Resort" },
  { value: "farmhouse", label: "Farmhouse" },
];

const BUDGET_OPTIONS = [
  { value: "", label: "Any budget" },
  { value: "budget", label: "Under ₹2L" },
  { value: "mid", label: "₹2L – ₹5L" },
  { value: "premium", label: "₹5L – ₹10L" },
  { value: "luxury", label: "Above ₹10L" },
];

const AREAS = [
  { value: "North Bangalore", label: "North Bangalore" },
  { value: "South Bangalore", label: "South Bangalore" },
  { value: "Devanahalli", label: "Devanahalli" },
  { value: "Nandi Hills", label: "Nandi Hills" },
  { value: "Electronic City", label: "Electronic City" },
  { value: "Whitefield", label: "Whitefield" },
];

const AMENITIES = [
  { value: "accommodation", label: "Accommodation" },
  { value: "pool", label: "Swimming pool" },
  { value: "outdoor", label: "Outdoor lawn" },
  { value: "parking", label: "Parking" },
  { value: "generator", label: "Generator backup" },
];

const styles = {
  page: { background: "#fdf6ec", minHeight: "100vh", color: "#2c1810", fontFamily: "inherit" },
  hero: { background: "#fffaf4", borderBottom: "0.5px solid #e8d8c4", padding: "3.5rem 2rem 2.5rem", textAlign: "center" },
  eyebrow: { fontSize: 11, letterSpacing: 3, textTransform: "uppercase", color: "#b8852a", marginBottom: "1rem", display: "flex", alignItems: "center", justifyContent: "center", gap: 10 },
  eyebrowLine: { width: 28, height: 0.5, background: "#b8852a", opacity: 0.6, display: "block" },
  heroTitle: { fontSize: 42, fontWeight: 400, lineHeight: 1.1, color: "#2c1810", marginBottom: "0.75rem", letterSpacing: -0.5, fontFamily: "Georgia, 'Times New Roman', serif" },
  heroTitleEm: { fontStyle: "italic", color: "#6b1e2e" },
  heroSub: { fontSize: 15, color: "#7a5a48", marginBottom: "2rem", lineHeight: 1.7, maxWidth: 480, margin: "0 auto 2rem" },
  searchBar: { display: "flex", maxWidth: 580, margin: "0 auto 2rem", border: "0.5px solid #e8d8c4", borderRadius: 100, overflow: "hidden", background: "#fdf4e6" },
  searchInput: { flex: 1, background: "transparent", border: "none", padding: "0 1.5rem", fontSize: 14, color: "#2c1810", height: 48, outline: "none" },
  searchDivider: { width: 0.5, background: "#e8d8c4", margin: "10px 0" },
  searchSelect: { background: "transparent", border: "none", padding: "0 1rem", fontSize: 13, color: "#7a5a48", height: 48, outline: "none", cursor: "pointer" },
  searchBtn: { background: "#6b1e2e", border: "none", borderRadius: 100, margin: 6, padding: "0 20px", fontSize: 13, color: "#fdf6ec", fontWeight: 500, cursor: "pointer", whiteSpace: "nowrap" },
  statsRow: { display: "flex", justifyContent: "center", gap: "3rem", paddingTop: "1.5rem", borderTop: "0.5px solid #f0e4d0", marginTop: "1rem" },
  statVal: { fontSize: 22, fontWeight: 500, color: "#2c1810" },
  statLabel: { fontSize: 10, textTransform: "uppercase", letterSpacing: 1, color: "#b09080", marginTop: 2 },
  concierge: { background: "#6b1e2e", padding: "0.875rem 2rem", display: "flex", alignItems: "center", justifyContent: "space-between" },
  conciergeLeft: { display: "flex", alignItems: "center", gap: 12 },
  conciergeIcon: { width: 34, height: 34, border: "0.5px solid rgba(232,196,122,0.3)", borderRadius: 8, display: "flex", alignItems: "center", justifyContent: "center", color: "#e8c47a", fontSize: 16, flexShrink: 0 },
  conciergeText: { fontSize: 14, color: "#fdf6ec", fontWeight: 500 },
  conciergeSub: { fontSize: 12, color: "rgba(253,246,236,0.55)" },
  conciergeBtn: { background: "#e8c47a", border: "none", color: "#4a1520", borderRadius: 100, padding: "8px 18px", fontSize: 12, fontWeight: 500, cursor: "pointer", whiteSpace: "nowrap", flexShrink: 0 },
  features: { background: "#fffaf4", borderBottom: "0.5px solid #e8d8c4", display: "grid", gridTemplateColumns: "repeat(4, 1fr)" },
  featureItem: { padding: "1.25rem", textAlign: "center", borderRight: "0.5px solid #e8d8c4" },
  featureIcon: { width: 36, height: 36, border: "0.5px solid #e8d8c4", borderRadius: 8, display: "flex", alignItems: "center", justifyContent: "center", margin: "0 auto 8px", background: "#f7edda", color: "#6b1e2e", fontSize: 16 },
  featureTitle: { fontSize: 13, fontWeight: 500, color: "#2c1810", marginBottom: 3 },
  featureDesc: { fontSize: 11, color: "#b09080", lineHeight: 1.6 },
  body: { display: "flex", padding: "1.5rem 2rem", gap: "1.5rem", maxWidth: 1400, margin: "0 auto" },
  sidebar: { width: 240, flexShrink: 0 },
  sidebarCard: { background: "#fffaf4", border: "0.5px solid #e8d8c4", borderRadius: 12, padding: "1.1rem 1.25rem", marginBottom: 10 },
  sidebarTitle: { fontSize: 11, textTransform: "uppercase", letterSpacing: 1.5, color: "#b8852a", marginBottom: 12 },
  sidebarOption: { display: "flex", alignItems: "center", gap: 8, marginBottom: 8, cursor: "pointer" },
  sidebarLabel: { fontSize: 13, color: "#7a5a48", cursor: "pointer", flex: 1 },
  sidebarCount: { fontSize: 10, color: "#b09080", background: "#f7edda", padding: "2px 6px", borderRadius: 100 },
  main: { flex: 1, minWidth: 0 },
  moodBanner: { background: "#fdf4e6", border: "0.5px solid #f0e4d0", borderRadius: 14, padding: "1.25rem", marginBottom: "1rem", display: "flex", alignItems: "center", justifyContent: "space-between" },
  moodLeft: { display: "flex", alignItems: "center", gap: 12 },
  moodIcon: { width: 38, height: 38, background: "#6b1e2e", borderRadius: 10, display: "flex", alignItems: "center", justifyContent: "center", color: "#e8c47a", fontSize: 18, flexShrink: 0 },
  moodText: { fontSize: 14, fontWeight: 500, color: "#2c1810" },
  moodSub: { fontSize: 12, color: "#7a5a48" },
  moodBtn: { background: "#6b1e2e", border: "none", color: "#fdf6ec", borderRadius: 100, padding: "9px 18px", fontSize: 13, fontWeight: 500, cursor: "pointer", whiteSpace: "nowrap", flexShrink: 0 },
  resultsHeader: { display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: "1rem" },
  resultsCount: { fontSize: 14, color: "#7a5a48" },
  sortSelect: { height: 32, border: "0.5px solid #e8d8c4", borderRadius: 100, padding: "0 12px", fontSize: 12, color: "#7a5a48", background: "#fffaf4", outline: "none", cursor: "pointer" },
  grid: { display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(280px, 1fr))", gap: 14 },
  card: { background: "#fffaf4", border: "0.5px solid #e8d8c4", borderRadius: 14, overflow: "hidden", cursor: "pointer", textDecoration: "none", display: "block", color: "inherit" },
  cardImgWrap: { position: "relative", height: 180, overflow: "hidden", background: "#f0e2c8" },
  cardImg: { width: "100%", height: 180, objectFit: "cover", display: "block" },
  cardImgPlaceholder: { width: "100%", height: 180, display: "flex", alignItems: "center", justifyContent: "center", background: "#f0e2c8", fontSize: 44 },
  cardBadgeVerified: { position: "absolute", top: 10, left: 10, fontSize: 10, fontWeight: 500, padding: "4px 8px", borderRadius: 100, background: "#6b1e2e", color: "#fdf6ec" },
  cardBadgeType: { position: "absolute", top: 10, left: 10, fontSize: 10, fontWeight: 500, padding: "4px 8px", borderRadius: 100, background: "#fdf6ec", color: "#7a5a48", border: "0.5px solid #e8d8c4" },
  cardSave: { position: "absolute", top: 10, right: 10, width: 28, height: 28, background: "#fdf6ec", border: "0.5px solid #e8d8c4", borderRadius: "50%", display: "flex", alignItems: "center", justifyContent: "center", color: "#b09080", fontSize: 13, cursor: "pointer" },
  cardBody: { padding: 14 },
  cardName: { fontSize: 15, fontWeight: 500, color: "#2c1810", marginBottom: 3 },
  cardLoc: { fontSize: 12, color: "#b09080", marginBottom: 10, display: "flex", alignItems: "center", gap: 3 },
  cardTags: { display: "flex", flexWrap: "wrap", gap: 4, marginBottom: 10 },
  cardTag: { fontSize: 10, color: "#7a5a48", background: "#f7edda", border: "0.5px solid #f0e4d0", borderRadius: 100, padding: "2px 8px" },
  cardFooter: { display: "flex", alignItems: "center", justifyContent: "space-between", paddingTop: 10, borderTop: "0.5px solid #f0e4d0" },
  cardPrice: { fontSize: 13, fontWeight: 500, color: "#2c1810" },
  cardPriceSub: { fontSize: 11, color: "#b09080", fontWeight: 400 },
  cardRating: { fontSize: 12, color: "#b09080", display: "flex", alignItems: "center", gap: 3 },
  cardRatingStar: { color: "#b8852a", fontSize: 11 },
  empty: { textAlign: "center", padding: "4rem 2rem", color: "#7a5a48" },
};

function VenueCard({ venue }) {
  const price = venue.pricing?.note || "Price on request";
  const capacityText = venue.capacity?.max > 0 ? `${venue.capacity.min || 0}–${venue.capacity.max} guests` : null;
  const rooms = venue.accommodation?.rooms > 0 ? `${venue.accommodation.rooms} rooms` : null;
  const rating = venue.googleRating ? `${venue.googleRating} · ${venue.googleReviewCount || 0} reviews` : null;
  const isVerified = venue.status === "verified";
  const vType = venue.venueType === "farmhouse" ? "Farmhouse" : "Resort";
  const shortAddr = (venue.address || "Bangalore").replace(", Bangalore", "").replace(", Bengaluru", "").replace("Bangalore", "").trim();

  return (
    <Link href={`/venues/${venue.slug}`} style={styles.card}>
      <div style={styles.cardImgWrap}>
        {venue.coverPhoto ? (
          <img src={venue.coverPhoto} alt={venue.name} style={styles.cardImg} loading="lazy" />
        ) : (
          <div style={styles.cardImgPlaceholder}>🏡</div>
        )}
        <span style={isVerified ? styles.cardBadgeVerified : styles.cardBadgeType}>
          {isVerified ? "✓ Verified" : vType}
        </span>
        <span style={styles.cardSave}>♡</span>
      </div>
      <div style={styles.cardBody}>
        <div style={styles.cardName}>{venue.name}</div>
        <div style={styles.cardLoc}>📍 {shortAddr || "Bangalore"}</div>
        <div style={styles.cardTags}>
          <span style={styles.cardTag}>{vType}</span>
          {capacityText && <span style={styles.cardTag}>{capacityText}</span>}
          {rooms && <span style={styles.cardTag}>{rooms}</span>}
        </div>
        <div style={styles.cardFooter}>
          <div style={styles.cardPrice}>
            {price.includes("₹") ? price : price}
          </div>
          {rating && (
            <div style={styles.cardRating}>
              <span style={styles.cardRatingStar}>★</span> {rating}
            </div>
          )}
        </div>
      </div>
    </Link>
  );
}

export default function VenuesPage({ venues = [], total = 0 }) {
  const [search, setSearch] = useState("");
  const [venueType, setVenueType] = useState("");
  const [budget, setBudget] = useState("");
  const [selectedAreas, setSelectedAreas] = useState([]);
  const [sort, setSort] = useState("recommended");

  const toggleArea = useCallback((area) => {
    setSelectedAreas((prev) => prev.includes(area) ? prev.filter((a) => a !== area) : [...prev, area]);
  }, []);

  const filtered = venues
    .filter((v) => {
      if (!search) return true;
      const q = search.toLowerCase();
      return v.name?.toLowerCase().includes(q) || v.address?.toLowerCase().includes(q);
    })
    .filter((v) => venueType ? v.venueType === venueType : true)
    .filter((v) => selectedAreas.length > 0 ? selectedAreas.some((a) => v.address?.includes(a)) : true)
    .sort((a, b) => {
      if (sort === "rating") return (b.googleRating || 0) - (a.googleRating || 0);
      if (sort === "capacity") return (b.capacity?.max || 0) - (a.capacity?.max || 0);
      return (b.dataCompleteness || 0) - (a.dataCompleteness || 0);
    });

  const publishedCount = venues.filter((v) => v.status === "published").length;
  const resortCount = venues.filter((v) => v.venueType === "resort").length;
  const farmhouseCount = venues.filter((v) => v.venueType === "farmhouse").length;

  return (
    <>
      <Head>
        <title>{trimTitle("Wedding Venues in Bangalore — Resorts & Farmhouses | Wedsy")}</title>
        <meta name="description" content={trimDescription("Browse 74 curated wedding venues in Bangalore — luxury resorts, farmhouses, and heritage properties. Real photos, verified pricing, and instant chat with venues.")} />
        <meta property="og:title" content="Wedding Venues in Bangalore | Wedsy" />
        <meta property="og:description" content="74 curated wedding resorts and farmhouses in Bangalore. Browse, compare, and chat directly with venues." />
        <meta property="og:type" content="website" />
        <link rel="canonical" href="https://wedsy.in/venues" />
        <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify({ "@context": "https://schema.org", "@type": "ItemList", name: "Wedding Venues in Bangalore", description: "Curated wedding resorts and farmhouses in Bangalore", numberOfItems: total, url: "https://wedsy.in/venues" }) }} />
      </Head>

      

      <main style={styles.page}>
        <section style={styles.hero}>
          <div style={styles.eyebrow}>
            <span style={styles.eyebrowLine} />
            Bangalore's finest wedding venues
            <span style={styles.eyebrowLine} />
          </div>
          <h1 style={styles.heroTitle}>
            Your wedding,<br />
            <em style={styles.heroTitleEm}>perfectly placed</em>
          </h1>
          <p style={styles.heroSub}>
            {total} curated resorts and farmhouses — real photos, verified pricing, and a concierge that makes every decision effortless.
          </p>
          <div style={styles.searchBar}>
            <input style={styles.searchInput} placeholder="Search by name, area, or vibe..." value={search} onChange={(e) => setSearch(e.target.value)} />
            <div style={styles.searchDivider} />
            <select style={styles.searchSelect} value={venueType} onChange={(e) => setVenueType(e.target.value)}>
              {VENUE_TYPES.map((t) => <option key={t.value} value={t.value}>{t.label}</option>)}
            </select>
            <div style={styles.searchDivider} />
            <select style={styles.searchSelect} value={budget} onChange={(e) => setBudget(e.target.value)}>
              {BUDGET_OPTIONS.map((b) => <option key={b.value} value={b.value}>{b.label}</option>)}
            </select>
            <button style={styles.searchBtn}>🔍 Search</button>
          </div>
          <div style={styles.statsRow}>
            <div><div style={styles.statVal}>{total}</div><div style={styles.statLabel}>Curated venues</div></div>
            <div><div style={styles.statVal}>{publishedCount}</div><div style={styles.statLabel}>Verified listings</div></div>
            <div><div style={styles.statVal}>2 hrs</div><div style={styles.statLabel}>Avg response time</div></div>
            <div><div style={styles.statVal}>Free</div><div style={styles.statLabel}>Always</div></div>
          </div>
        </section>

        <div style={styles.concierge}>
          <div style={styles.conciergeLeft}>
            <div style={styles.conciergeIcon}>✨</div>
            <div>
              <div style={styles.conciergeText}>Not sure where to start?</div>
              <div style={styles.conciergeSub}>Tell our AI your vision — it finds your perfect venue in 60 seconds</div>
            </div>
          </div>
          <button style={styles.conciergeBtn}>Try Wedsy Concierge →</button>
        </div>

        <div style={styles.features}>
          {[
            { icon: "💬", title: "Chat directly", desc: "No forms into a void. Start a real conversation instantly." },
            { icon: "🗺️", title: "Scout planner", desc: "Plan your full scouting day. Wedsy routes you and pings every venue." },
            { icon: "📅", title: "Live availability", desc: "See exactly which dates are open before reaching out." },
            { icon: "🧮", title: "Budget clarity", desc: "Enter your total budget. We split it across every category." },
          ].map((f, i) => (
            <div key={f.title} style={{ ...styles.featureItem, borderRight: i < 3 ? "0.5px solid #e8d8c4" : "none" }}>
              <div style={styles.featureIcon}>{f.icon}</div>
              <div style={styles.featureTitle}>{f.title}</div>
              <div style={styles.featureDesc}>{f.desc}</div>
            </div>
          ))}
        </div>

        <div style={styles.body}>
          <aside style={styles.sidebar}>
            <div style={styles.sidebarCard}>
              <div style={styles.sidebarTitle}>Venue type</div>
              {[{ value: "", label: "All venues", count: total }, { value: "resort", label: "Resort", count: resortCount }, { value: "farmhouse", label: "Farmhouse", count: farmhouseCount }].map((t) => (
                <div key={t.value} style={styles.sidebarOption}>
                  <input type="radio" name="venueType" checked={venueType === t.value} onChange={() => setVenueType(t.value)} id={`type-${t.value}`} style={{ accentColor: "#6b1e2e" }} />
                  <label htmlFor={`type-${t.value}`} style={styles.sidebarLabel}>{t.label}</label>
                  <span style={styles.sidebarCount}>{t.count}</span>
                </div>
              ))}
            </div>
            <div style={styles.sidebarCard}>
              <div style={styles.sidebarTitle}>Area</div>
              {AREAS.map((a) => (
                <div key={a.value} style={styles.sidebarOption}>
                  <input type="checkbox" checked={selectedAreas.includes(a.value)} onChange={() => toggleArea(a.value)} id={`area-${a.value}`} style={{ accentColor: "#6b1e2e" }} />
                  <label htmlFor={`area-${a.value}`} style={styles.sidebarLabel}>{a.label}</label>
                </div>
              ))}
            </div>
          </aside>

          <div style={styles.main}>
            <div style={styles.moodBanner}>
              <div style={styles.moodLeft}>
                <div style={styles.moodIcon}>✨</div>
                <div>
                  <div style={styles.moodText}>Not sure where to start?</div>
                  <div style={styles.moodSub}>Answer 5 quick questions — we'll match you to your perfect venue</div>
                </div>
              </div>
              <button style={styles.moodBtn}>Try Mood Match ↗</button>
            </div>
            <div style={styles.resultsHeader}>
              <div style={styles.resultsCount}>Showing <strong>{filtered.length} venues</strong> in Bangalore</div>
              <select style={styles.sortSelect} value={sort} onChange={(e) => setSort(e.target.value)}>
                <option value="recommended">Sort: Recommended</option>
                <option value="rating">Rating: Highest</option>
                <option value="capacity">Capacity: Largest</option>
              </select>
            </div>
            {filtered.length > 0 ? (
              <div style={styles.grid}>
                {filtered.map((v) => <VenueCard key={v._id} venue={v} />)}
              </div>
            ) : (
              <div style={styles.empty}>
                <div style={{ fontSize: 32, marginBottom: 12 }}>🔍</div>
                <div style={{ fontSize: 16, fontWeight: 500, color: "#2c1810", marginBottom: 6 }}>No venues found</div>
                <div style={{ fontSize: 13 }}>Try adjusting your filters or search term</div>
              </div>
            )}
          </div>
        </div>
      </main>

      
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
