const express = require("express");
const controllers = require("../controllers");
const { resourceRouter } = require("./resourceRouter");

const router = express.Router();

router.use("/chungcus", resourceRouter(controllers.chungCu));
router.use("/chungcu-images", resourceRouter(controllers.chungCuImage));
router.use("/canhos", resourceRouter(controllers.canHo));
router.use("/canho-images", resourceRouter(controllers.canHoImage));
router.use("/nguoidungs", resourceRouter(controllers.nguoiDung));
router.use("/cudans", resourceRouter(controllers.cuDan));
router.use("/chuho", resourceRouter(controllers.chuHo));
router.use("/tintucs", resourceRouter(controllers.tinTuc));
router.use("/chat-sessions", resourceRouter(controllers.chatSession));
router.use("/chat-messages", resourceRouter(controllers.chatMessage));

module.exports = router;

