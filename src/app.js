const express = require("express");
const { errorHandler, notFoundHandler } = require("./middlewares/errorHandler");

function createApp() {
  const app = express();

  app.use(express.json());

  app.get("/health", (_req, res) => {
    res.json({ ok: true });
  });

  // Canonical CRUD routes (uniform responses + centralized error handling)
  app.use("/api/v1", require("./routes"));

  // Errors
  app.use(notFoundHandler);
  app.use(errorHandler);

  return app;
}

module.exports = { createApp };
