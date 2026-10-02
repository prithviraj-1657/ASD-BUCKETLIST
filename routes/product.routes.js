/**
 * Product Routes
 *
 * Maps HTTP methods and paths to the appropriate middleware and controller functions.
 * Request flow: Route -> Middleware -> Controller -> Service -> Database
 */

const express = require('express');
const router = express.Router();
const productController = require('../controllers/product.controller');
const cacheMiddleware = require('../middleware/cache.middleware');
const invalidateCache = require('../middleware/invalidate.middleware');

// GET routes (with cache middleware)
router.get('/', cacheMiddleware, productController.getAllProducts);
router.get('/:id', cacheMiddleware, productController.getProductById);

// Write routes (with cache invalidation middleware)
router.post('/', invalidateCache, productController.createProduct);
router.put('/:id', invalidateCache, productController.updateProduct);
router.patch('/:id', invalidateCache, productController.patchProduct);
router.delete('/:id', invalidateCache, productController.deleteProduct);

module.exports = router;
