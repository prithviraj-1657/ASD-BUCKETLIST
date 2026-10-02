/**
 * Cache Invalidation Middleware
 *
 * Attached to write routes (POST, PUT, PATCH, DELETE).
 * Clears ALL cache entries only when the write operation succeeds (2xx status).
 * Failed writes (400, 404) do NOT clear the cache.
 */

const cacheService = require('../services/cache.service');

/**
 * Invalidation middleware — clears cache on successful writes
 */
function invalidateCache(req, res, next) {
  // Listen for the response to finish, then check status code
  res.on('finish', () => {
    if (res.statusCode >= 200 && res.statusCode < 300) {
      cacheService.clear();
    }
  });

  next();
}

module.exports = invalidateCache;
