/**
 * SEO helpers: trim title/description to recommended lengths for SERPs.
 * Use in every page's <Head> for <title> and <meta name="description">.
 */
const TITLE_MAX = 60;
const DESCRIPTION_MAX = 155;

export function trimTitle(text, max = TITLE_MAX) {
  if (text == null || typeof text !== "string") return "";
  const t = text.trim();
  return t.length <= max ? t : t.slice(0, max - 3).trim() + "...";
}

export function trimDescription(text, max = DESCRIPTION_MAX) {
  if (text == null || typeof text !== "string") return "";
  const d = text.trim();
  return d.length <= max ? d : d.slice(0, max - 3).trim() + "...";
}

/**
 * OG image fallbacks by category (A3). Use when no product/artist image is available.
 * Add actual image files to public/: og-decor.jpg, og-makeup.jpg, og-default.jpg
 */
const BASE_URL = "https://www.wedsy.in";

export const OG_IMAGES = {
  default: `${BASE_URL}/og-default.jpg`,
  decor: `${BASE_URL}/og-decor.jpg`,
  makeup: `${BASE_URL}/og-makeup.jpg`,
};
