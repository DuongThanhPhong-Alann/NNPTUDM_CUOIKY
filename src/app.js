const express = require("express");

function createApp() {
  const app = express();

  app.use(express.json());

  app.get("/health", (_req, res) => {
    res.json({ ok: true });
  });

  app.use("/api/v1/chungcus", require("./routes/chungcus"));
  app.use("/api/v1/chungcu-images", require("./routes/chungcuImages"));
  app.use("/api/v1/canhos", require("./routes/canhos"));
  app.use("/api/v1/canho-images", require("./routes/canhoImages"));
  app.use("/api/v1/nguoidungs", require("./routes/nguoidungs"));
  app.use("/api/v1/cudans", require("./routes/cudans"));
  app.use("/api/v1/chuho", require("./routes/chuho"));
  app.use("/api/v1/tintucs", require("./routes/tintucs"));
  app.use("/api/v1/chat-sessions", require("./routes/chatSessions"));
  app.use("/api/v1/chat-messages", require("./routes/chatMessages"));

  return app;
}

module.exports = { createApp };
