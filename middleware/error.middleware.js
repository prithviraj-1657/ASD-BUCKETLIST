/**
 * Error Handling Middleware
 *
 * Centralized error handler — catches any errors thrown in route handlers.
 * Must be registered AFTER all routes in app.js.
 */

/**
 * 404 fallback — no route matched
 */
function notFoundHandler(req, res, _next) {
  res.status(404).json({ error: `Route ${req.method} ${req.originalUrl} not found` });
}

/**
 * Global error handler — Express recognizes this by the 4-argument signature
 */
function errorHandler(err, _req, res, _next) {
  console.error('Unhandled error:', err.message || err);
  res.status(err.status || 500).json({
    error: err.message || 'Internal Server Error'
  });
}

module.exports = { notFoundHandler, errorHandler };
