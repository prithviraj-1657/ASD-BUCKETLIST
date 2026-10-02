/**
 * Product Routes
 *
 * Maps HTTP methods and paths to the appropriate controller functions.
 * Middleware (cache, invalidation) will be added in later commits.
 */

const express = require('express');
const router = express.Router();
const productController = require('../controllers/product.controller');

// GET routes
router.get('/', productController.getAllProducts);
router.get('/:id', productController.getProductById);

module.exports = router;
