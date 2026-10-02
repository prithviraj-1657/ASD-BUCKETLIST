/**
 * Product Controller
 *
 * Handles HTTP request/response objects.
 * Delegates all business logic to the service layer.
 * No direct database access allowed here.
 */

const productService = require('../services/product.service');

/**
 * GET /products - retrieve all products
 */
async function getAllProducts(req, res, next) {
  try {
    const products = await productService.getAllProducts();
    res.status(200).json(products);
  } catch (err) {
    next(err);
  }
}

/**
 * GET /products/:id - retrieve a single product
 */
async function getProductById(req, res, next) {
  try {
    const id = parseInt(req.params.id, 10);
    if (isNaN(id)) {
      return res.status(400).json({ error: 'Invalid product ID' });
    }
    const product = await productService.getProductById(id);
    if (!product) {
      return res.status(404).json({ error: 'Product not found' });
    }
    res.status(200).json(product);
  } catch (err) {
    next(err);
  }
}

module.exports = {
  getAllProducts,
  getProductById
};
