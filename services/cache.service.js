/**
 * Cache Service - TTL-based in-memory cache using a Map
 *
 * Each entry: { value: <any>, createdAt: <timestamp> }
 * Expired entries are lazily removed on access.
 */

// TTL in milliseconds — defined in one place for easy tuning
const CACHE_TTL = 60 * 1000; // 1 minute

// Internal cache store
const cache = new Map();

/**
 * Retrieve a value from the cache
 * @param {string} key
 * @returns {*|null} cached value or null if missing/expired
 */
function get(key) {
  if (!cache.has(key)) return null;

  const entry = cache.get(key);
  const age = Date.now() - entry.createdAt;

  if (age > CACHE_TTL) {
    // Entry has expired — remove it and treat as a miss
    cache.delete(key);
    return null;
  }

  return entry;
}

/**
 * Store a value in the cache with the current timestamp
 * @param {string} key
 * @param {*} value
 */
function set(key, value) {
  cache.set(key, {
    value,
    createdAt: Date.now()
  });
}

/**
 * Clear all cache entries
 */
function clear() {
  cache.clear();
}

module.exports = { get, set, clear };
