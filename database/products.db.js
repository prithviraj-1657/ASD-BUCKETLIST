/**
 * Database Layer - In-memory product data store
 *
 * This module simulates a database using an in-memory array.
 * All data access functions are defined here.
 * A simulated latency constant makes cache HIT vs MISS visible.
 */

// Simulated database latency in milliseconds (easy to remove)
const DB_LATENCY_MS = 300;

// In-memory product store seeded with sample data
let products = [
  { id: 1, name: 'Wireless Mouse', price: 29.99, category: 'Electronics' },
  { id: 2, name: 'Mechanical Keyboard', price: 79.99, category: 'Electronics' },
  { id: 3, name: 'Running Shoes', price: 119.99, category: 'Footwear' },
  { id: 4, name: 'Coffee Mug', price: 12.49, category: 'Kitchen' },
  { id: 5, name: 'Notebook Journal', price: 8.99, category: 'Stationery' }
];

// Auto-incrementing ID counter
let nextId = 6;

/**
 * Helper: simulate async database latency
 */
function simulateLatency() {
  return new Promise((resolve) => setTimeout(resolve, DB_LATENCY_MS));
}

/**
 * Retrieve all products
 * @returns {Promise<Array>} copy of the products array
 */
async function getAll() {
  await simulateLatency();
  return products.map((p) => ({ ...p }));
}

/**
 * Retrieve a single product by ID
 * @param {number} id
 * @returns {Promise<Object|null>} copy of the product or null
 */
async function getById(id) {
  await simulateLatency();
  const product = products.find((p) => p.id === id);
  return product ? { ...product } : null;
}

/**
 * Create a new product
 * @param {Object} data - { name, price, category }
 * @returns {Promise<Object>} the newly created product
 */
async function create(data) {
  await simulateLatency();
  const product = {
    id: nextId++,
    name: data.name,
    price: data.price,
    category: data.category || 'Uncategorized'
  };
  products.push(product);
  return { ...product };
}

/**
 * Full update (replace) a product by ID
 * @param {number} id
 * @param {Object} data - { name, price, category }
 * @returns {Promise<Object|null>} updated product or null if not found
 */
async function update(id, data) {
  await simulateLatency();
  const index = products.findIndex((p) => p.id === id);
  if (index === -1) return null;
  products[index] = {
    id,
    name: data.name,
    price: data.price,
    category: data.category || 'Uncategorized'
  };
  return { ...products[index] };
}

/**
 * Partial update (patch) a product by ID
 * @param {number} id
 * @param {Object} data - fields to update
 * @returns {Promise<Object|null>} patched product or null if not found
 */
async function patch(id, data) {
  await simulateLatency();
  const index = products.findIndex((p) => p.id === id);
  if (index === -1) return null;
  products[index] = { ...products[index], ...data, id }; // preserve id
  return { ...products[index] };
}

/**
 * Remove a product by ID
 * @param {number} id
 * @returns {Promise<Object|null>} removed product or null if not found
 */
async function remove(id) {
  await simulateLatency();
  const index = products.findIndex((p) => p.id === id);
  if (index === -1) return null;
  const removed = products.splice(index, 1)[0];
  return { ...removed };
}

module.exports = { getAll, getById, create, update, patch, remove };
