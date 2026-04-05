const express = require("express");
const path = require("path");
const { errorHandler, notFoundHandler } = require("./middlewares/errorHandler");

function createApp() {
  const app = express();

  app.use(express.json());
  app.use("/uploads", express.static(path.join(__dirname, "..", "uploads")));

  app.get("/health", (_req, res) => {
    res.json({ ok: true });
  });

  app.use("/api/v1/auth", require("./routes/auth"));
  app.use("/api/v1/upload", require("./routes/upload"));
  app.use("/api/v1", require("./routes"));

  app.use(notFoundHandler);
  app.use(errorHandler);

  return app;
}

module.exports = { createApp };
