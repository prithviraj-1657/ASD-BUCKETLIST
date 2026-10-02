const express = require('express');
const productRoutes = require('./routes/product.routes');

const app = express();

app.use(express.json());

// Mount product routes
app.use('/products', productRoutes);

module.exports = app;
