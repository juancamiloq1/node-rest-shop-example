const express = require("express");
const app = express();
const morgan = require("morgan");
const bodyParser = require("body-parser");
const mongoose = require("mongoose");

const db_uri =
  "mongodb+srv://juancamiloqhz:" +
  process.env.MONGO_ATLAS_PW +
  "@cluster0-xold0.mongodb.net/test?retryWrites=true";
mongoose.connect(
  db_uri,
  { useNewUrlParser: true }
);
//mongoose.Promise = global.Promise; // here we solve a warning deprecation that i didn't find

const productsRoutes = require("./api/routes/products");
const ordersRoutes = require("./api/routes/orders");

app.use(morgan("dev"));
app.use("/uploads", express.static("uploads"));
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

// CORS setup into middleware
app.use((req, res, next) => {
  res.header("Access-Control-Allow-Origin", "*");
  res.header(
    "Access-Control-Allow-Headers",
    "Origin, X-Requested-With, Content-Type, Accept, Authorization"
  );
  if (req.method === "OPTIONS") {
    res.header(
      "Access-Control-Allow-Methods",
      "PUT",
      "POST",
      "PATCH",
      "DELETE"
    );
    return res.status(200).json({});
  }
  next();
});

// Routes which should handle requests
app.use("/products", productsRoutes);
app.use("/orders", ordersRoutes);

// define custom error message on not found routes
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
