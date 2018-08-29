const express = require("express");
const app = express();
const morgan = require("morgan");

const productsRoutes = require("./api/routes/products");
const ordersRoutes = require("./api/routes/orders");

app.use(morgan("dev"));

// Routes which should handle requests
app.use("/products", productsRoutes);
app.use("/orders", ordersRoutes);

// Aqui se define custom error message en not found routes
app.use((req, res, next) => {
  const error = new Error("Not Found");
  error.status = 404;
  next(error);
});

// Error when doing stuff into the database (when route exists)
app.use((error, req, res, next) => {
  res.status(error.status || 500);
  res.json({
    error: {
      message: error.message
    }
  });
});

module.exports = app;
