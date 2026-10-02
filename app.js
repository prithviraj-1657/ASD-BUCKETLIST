const express = require('express');
const productRoutes = require('./routes/product.routes');
const { notFoundHandler, errorHandler } = require('./middleware/error.middleware');

const app = express();

app.use(express.json());

// Mount product routes
app.use('/products', productRoutes);

// 404 fallback — must come after all route definitions
app.use(notFoundHandler);

// Centralized error handler — must be the very last middleware
app.use(errorHandler);

module.exports = app;
