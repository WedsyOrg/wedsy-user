/**
 * GTM dataLayer push helper (A13). Use alongside Meta Pixel so GTM can trigger tags.
 * Push once per action; do not have GTM fire Pixel again for the same action (no double-fire).
 */
export function pushDataLayer(eventName, payload = {}) {
  if (typeof window === "undefined" || !window.dataLayer) return;
  window.dataLayer.push({ event: eventName, ...payload });
}
