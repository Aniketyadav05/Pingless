/** Canonical URLs for sharing and PDF links */
export function getSiteOrigin() {
  if (typeof window === 'undefined') return 'https://pingless.app';
  return window.location.origin;
}

export function getProfileUrl(username) {
  if (!username) return getSiteOrigin();
  return `${getSiteOrigin()}/${encodeURIComponent(username)}`;
}

export function getHomeUrl() {
  return getSiteOrigin();
}
