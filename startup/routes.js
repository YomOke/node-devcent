const cors = require("cors");
const express = require("express");
const userRoutes = require("../routes/userRoutes");
const { errorHandler, notFound } = require("../middleware/errorMiddleware");

module.exports = function (app) {
  app.use(cors());
  app.use(express.json());
  app.use("/api/users", userRoutes);
  app.use(errorHandler);
  app.use(notFound);
};
