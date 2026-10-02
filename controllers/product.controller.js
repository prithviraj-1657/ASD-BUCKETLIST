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

/**
 * POST /products - create a new product
 */
async function createProduct(req, res, next) {
  try {
    const { name, price, category } = req.body;

    // Validation: name and price are required, price must be a number
    if (!name || price === undefined || price === null) {
      return res.status(400).json({ error: 'Name and price are required' });
    }
    if (typeof price !== 'number' || isNaN(price)) {
      return res.status(400).json({ error: 'Price must be a number' });
    }

    const product = await productService.createProduct({ name, price, category });
    res.status(201).json(product);
  } catch (err) {
    next(err);
  }
}

/**
 * PUT /products/:id - full update a product
 */
async function updateProduct(req, res, next) {
  try {
    const id = parseInt(req.params.id, 10);
    if (isNaN(id)) {
      return res.status(400).json({ error: 'Invalid product ID' });
    }

    const { name, price, category } = req.body;

    // Validation: name and price required for full replacement
    if (!name || price === undefined || price === null) {
      return res.status(400).json({ error: 'Name and price are required' });
    }
    if (typeof price !== 'number' || isNaN(price)) {
      return res.status(400).json({ error: 'Price must be a number' });
    }

    const product = await productService.updateProduct(id, { name, price, category });
    if (!product) {
      return res.status(404).json({ error: 'Product not found' });
    }
    res.status(200).json(product);
  } catch (err) {
    next(err);
  }
}

/**
 * PATCH /products/:id - partial update a product
 */
async function patchProduct(req, res, next) {
  try {
    const id = parseInt(req.params.id, 10);
    if (isNaN(id)) {
      return res.status(400).json({ error: 'Invalid product ID' });
    }

    // If price is provided, it must be a number
    if (req.body.price !== undefined && (typeof req.body.price !== 'number' || isNaN(req.body.price))) {
      return res.status(400).json({ error: 'Price must be a number' });
    }

    const product = await productService.patchProduct(id, req.body);
    if (!product) {
      return res.status(404).json({ error: 'Product not found' });
    }
    res.status(200).json(product);
  } catch (err) {
    next(err);
  }
}

/**
 * DELETE /products/:id - remove a product
 */
async function deleteProduct(req, res, next) {
  try {
    const id = parseInt(req.params.id, 10);
    if (isNaN(id)) {
      return res.status(400).json({ error: 'Invalid product ID' });
    }

    const product = await productService.deleteProduct(id);
    if (!product) {
      return res.status(404).json({ error: 'Product not found' });
    }
    res.status(200).json({ message: 'Product deleted', product });
  } catch (err) {
    next(err);
  }
}

module.exports = {
  getAllProducts,
  getProductById,
  createProduct,
  updateProduct,
  patchProduct,
  deleteProduct
};
