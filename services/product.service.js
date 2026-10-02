/**
 * Product Service Layer
 *
 * Contains business logic and calls the database layer.
 * No direct req/res handling — that belongs to the controller.
 */

const productsDb = require('../database/products.db');

/**
 * Get all products
 * @returns {Promise<Array>}
 */
async function getAllProducts() {
  return productsDb.getAll();
}

/**
 * Get a single product by ID
 * @param {number} id
 * @returns {Promise<Object|null>}
 */
async function getProductById(id) {
  return productsDb.getById(id);
}

/**
 * Create a new product
 * @param {Object} data - { name, price, category }
 * @returns {Promise<Object>}
 */
async function createProduct(data) {
  return productsDb.create(data);
}

/**
 * Full update a product
 * @param {number} id
 * @param {Object} data - { name, price, category }
 * @returns {Promise<Object|null>}
 */
async function updateProduct(id, data) {
  return productsDb.update(id, data);
}

/**
 * Partial update a product
 * @param {number} id
 * @param {Object} data - fields to patch
 * @returns {Promise<Object|null>}
 */
async function patchProduct(id, data) {
  return productsDb.patch(id, data);
}

/**
 * Remove a product
 * @param {number} id
 * @returns {Promise<Object|null>}
 */
async function deleteProduct(id) {
  return productsDb.remove(id);
}

module.exports = {
  getAllProducts,
  getProductById,
  createProduct,
  updateProduct,
  patchProduct,
  deleteProduct
};
