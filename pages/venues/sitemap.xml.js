// Venues sitemap — served at /venues/sitemap.xml.
//
// Pages-Router SSR approach: this is a normal page route whose
// getServerSideProps writes the XML body directly to `res` and returns
// `{ props: {} }`. No global config (next.config.js / _document) is touched —
// the sitemap is entirely venues-local. It pulls the published venue slugs
// from GET /venues and emits a <urlset> with the canonical detail URLs plus
// the /venues index itself.
//
// Submit this file's URL (https://wedsy.in/venues/sitemap.xml) in Search
// Console, or reference it from a top-level sitemap index if/when one exists.

const SITE = "https://wedsy.in";

function xmlEscape(str) {
  return String(str || "")
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&apos;");
}

function buildSitemap(venues) {
  const now = new Date().toISOString();
  const urls = [];
  // The browse index.
  urls.push(
    `  <url>\n    <loc>${SITE}/venues</loc>\n    <changefreq>daily</changefreq>\n    <priority>0.9</priority>\n  </url>`
  );
  // One entry per published venue.
  for (const v of venues) {
    if (!v || !v.slug) continue;
    const lastmod = v.updatedAt
      ? new Date(v.updatedAt).toISOString()
      : now;
    urls.push(
      `  <url>\n    <loc>${SITE}/venues/${xmlEscape(v.slug)}</loc>\n    <lastmod>${lastmod}</lastmod>\n    <changefreq>weekly</changefreq>\n    <priority>0.8</priority>\n  </url>`
    );
  }
  return `<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n${urls.join("\n")}\n</urlset>\n`;
}

export async function getServerSideProps({ res }) {
  let venues = [];
  try {
    // The GET /venues endpoint caps each page at 200 rows, so page through with
    // limit/skip until we've collected `total` (or hit a safety ceiling). This
    // guarantees every published venue makes it into the sitemap.
    const PAGE = 200;
    const MAX_PAGES = 50; // 10k venues — well above any realistic catalog size
    let skip = 0;
    let total = Infinity;
    for (let i = 0; i < MAX_PAGES && skip < total; i++) {
      const r = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/venues?status=published&limit=${PAGE}&skip=${skip}`
      );
      if (!r.ok) break;
      const data = await r.json();
      const batch = Array.isArray(data.venues) ? data.venues : [];
      venues.push(...batch);
      total = Number(data.total) || venues.length;
      if (batch.length === 0) break;
      skip += PAGE;
    }
  } catch (e) {
    // Fall through with whatever we collected — still emits a valid sitemap
    // (at minimum the /venues index) so the route never 500s.
  }

  const xml = buildSitemap(venues);
  res.setHeader("Content-Type", "application/xml; charset=utf-8");
  res.setHeader(
    "Cache-Control",
    "public, s-maxage=3600, stale-while-revalidate=86400"
  );
  res.write(xml);
  res.end();
  return { props: {} };
}

// Never rendered — getServerSideProps ends the response.
export default function VenuesSitemap() {
  return null;
}
