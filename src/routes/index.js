const express = require("express");

const router = express.Router();

router.use("/chungcus", require("./chungcus"));
router.use("/chungcu-images", require("./chungcuImages"));
router.use("/canhos", require("./canhos"));
router.use("/canho-images", require("./canhoImages"));
router.use("/nguoidungs", require("./nguoidungs"));
router.use("/cudans", require("./cudans"));
router.use("/chuho", require("./chuho"));
router.use("/tintucs", require("./tintucs"));
router.use("/chat-sessions", require("./chatSessions"));
router.use("/chat-messages", require("./chatMessages"));
router.use("/dichvus", require("./dichvus"));
router.use("/hoadon-dichvus", require("./hoadonDichvus"));

module.exports = router;
