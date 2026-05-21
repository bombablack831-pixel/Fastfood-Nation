/**
 * getLocation utility
 * Priority: Browser GPS → IP API (no cookies) → Kanodar default
 * Does NOT use third-party storage (tracking prevention safe)
 */

const KANODAR_DEFAULT = { lat: 24.1030, lng: 72.3361 };

// Get location via IP (CORS-friendly, no cookies, no tracking storage)
const getLocationByIP = async () => {
  // geojs.io - free, no auth, no tracking cookies, CORS enabled
  try {
    const res = await fetch('https://get.geojs.io/v1/ip/geo.json', {
      signal: AbortSignal.timeout(4000),
      credentials: 'omit', // No cookies - tracking prevention safe
    });
    const data = await res.json();
    if (data.latitude && data.longitude) {
      return { lat: parseFloat(data.latitude), lng: parseFloat(data.longitude) };
    }
  } catch (_) {}

  return null;
};

// Get location via browser GPS
const getLocationByGPS = () =>
  new Promise((resolve, reject) => {
    if (!navigator.geolocation) return reject(new Error('No geolocation'));
    navigator.geolocation.getCurrentPosition(
      (pos) => resolve({ lat: pos.coords.latitude, lng: pos.coords.longitude }),
      reject,
      { timeout: 6000, maximumAge: 60000, enableHighAccuracy: false }
    );
  });

/**
 * getLocation()
 * Returns { lat, lng } - always resolves, never throws
 */
export const getLocation = async () => {
  // 1. Try browser GPS first
  try {
    const loc = await getLocationByGPS();
    if (loc) return loc;
  } catch (_) {}

  // 2. Try IP-based fallback (no tracking storage used)
  const ipLoc = await getLocationByIP();
  if (ipLoc) return ipLoc;

  // 3. Final fallback: Kanodar, Gujarat
  return KANODAR_DEFAULT;
};

export default getLocation;
