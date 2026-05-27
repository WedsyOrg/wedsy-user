export default async function handler(req, res) {
  const ref = req.query.ref;
  const key = process.env.GOOGLE_PLACES_API_KEY;
  if (!ref || !key) return res.status(400).end();
  const url = `https://maps.googleapis.com/maps/api/place/photo?maxwidth=400&photo_reference=${ref}&key=${key}`;
  try {
    const r = await fetch(url, { redirect: "manual" });
    const loc = r.headers.get("location");
    if (loc) {
      res.setHeader("Cache-Control", "public, max-age=86400, immutable");
      res.redirect(302, loc);
      return;
    }
    res.status(502).end();
  } catch (e) {
    res.status(502).end();
  }
}
