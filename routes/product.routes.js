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

// GET routes (with cache middleware)
router.get('/', cacheMiddleware, productController.getAllProducts);
router.get('/:id', cacheMiddleware, productController.getProductById);

// Write routes (invalidation middleware will be added in the next commit)
router.post('/', productController.createProduct);
router.put('/:id', productController.updateProduct);
router.patch('/:id', productController.patchProduct);
router.delete('/:id', productController.deleteProduct);

module.exports = router;
