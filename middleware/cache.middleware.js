/**
 * Cache Middleware
 *
 * For GET requests only:
 *  - HIT: returns cached response with X-Cache: HIT header
 *  - MISS: intercepts res.json to cache only 200 responses, sets X-Cache: MISS
 */

const cacheService = require('../services/cache.service');

/**
 * Cache middleware — attach to GET routes
 */
function cacheMiddleware(req, res, next) {
  const key = req.originalUrl;

  // Check for a cached entry
  const entry = cacheService.get(key);

  if (entry) {
    // Cache HIT — return cached data without hitting controller
    res.set('X-Cache', 'HIT');
    return res.status(200).json(entry.value);
  }

  // Cache MISS — let the request proceed through the layers
  res.set('X-Cache', 'MISS');

  // Wrap res.json to intercept the response and cache only 200 results
  const originalJson = res.json.bind(res);
  res.json = function (body) {
    // Only cache successful (200) responses — never 400/404/500
    if (res.statusCode === 200) {
      cacheService.set(key, body);
    }
    return originalJson(body);
  };

  next();
}

module.exports = cacheMiddleware;
