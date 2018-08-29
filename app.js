const express = require("express");
const productsRoutes = require("./api/routes/products");
const ordersRoutes = require("./api/routes/orders");

const app = express();

app.use("/products", productsRoutes);
app.use("/orders", ordersRoutes);

module.exports = app;
