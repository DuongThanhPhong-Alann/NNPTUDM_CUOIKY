var express = require("express");
const mongoose = require("mongoose");
var router = express.Router();
let chatMessageController = require("../controllers/chatMessages");
let chatSessionController = require("../controllers/chatSessions");
const { requireAuth } = require("../middlewares/auth");
const { getIO } = require("../socket");

router.get("/", requireAuth, async function (req, res, next) {
  let items;
  if (req.query.idSession) {
    const session = await chatSessionController.GetById(req.query.idSession);
    if (!session) return res.status(404).send({ message: "id not found" });
    if (
      req.user.loaiNguoiDung !== "Ban quan ly" &&
      String(session.idNguoiDung?._id || session.idNguoiDung) !== String(req.user._id)
    ) {
      return res.status(403).send({ message: "forbidden" });
    }
    items = await chatMessageController.GetAllBySessionId(req.query.idSession);
  } else if (req.user.loaiNguoiDung === "Ban quan ly") {
    items = await chatMessageController.GetAll();
  } else {
    return res.status(400).send({ message: "idSession is required" });
  }
  res.send(items);
});

router.get("/:id", requireAuth, async function (req, res, next) {
  try {
    let item = await chatMessageController.GetById(req.params.id);
    if (!item) {
      res.status(404).send({ message: "id not found" });
      return;
    }
    const session = await chatSessionController.GetById(item.idSession?._id || item.idSession);
    if (
      req.user.loaiNguoiDung !== "Ban quan ly" &&
      String(session.idNguoiDung?._id || session.idNguoiDung) !== String(req.user._id)
    ) {
      res.status(403).send({ message: "forbidden" });
      return;
    }
    res.send(item);
  } catch (error) {
    res.status(404).send({ message: "id not found" });
  }
});

router.post("/", requireAuth, async function (req, res, next) {
  let dbSession;
  try {
    const chatSession = await chatSessionController.GetById(req.body.idSession);
    if (!chatSession) return res.status(404).send({ message: "session not found" });
    if (
      req.user.loaiNguoiDung !== "Ban quan ly" &&
      String(chatSession.idNguoiDung?._id || chatSession.idNguoiDung) !== String(req.user._id)
    ) {
      return res.status(403).send({ message: "forbidden" });
    }

    dbSession = await mongoose.startSession();
    dbSession.startTransaction();

    const payload = {
      ...req.body,
      idNguoiDung: req.user._id,
    };

    let created = await chatMessageController.CreateWithSession(payload, dbSession);
    await chatSessionController.UpdateLastMessageAt(chatSession._id, new Date(), dbSession);

    await dbSession.commitTransaction();
    dbSession.endSession();

    let item = await chatMessageController.GetById(created._id);
    const io = getIO();
    if (io) {
      io.to(`chat:${String(chatSession._id)}`).emit("chat:message", item);
      io.to(`user:${String(chatSession.idNguoiDung?._id || chatSession.idNguoiDung)}`).emit(
        "chat:message",
        item,
      );
    }

    res.send(item);
  } catch (err) {
    if (dbSession) {
      await dbSession.abortTransaction().catch(() => undefined);
      dbSession.endSession();
    }
    res.status(400).send({ message: err.message });
  }
});

router.put("/:id", requireAuth, async function (req, res, next) {
  try {
    let current = await chatMessageController.GetById(req.params.id);
    if (!current) return res.status(404).send({ message: "id not found" });
    const session = await chatSessionController.GetById(current.idSession?._id || current.idSession);
    if (
      req.user.loaiNguoiDung !== "Ban quan ly" &&
      String(current.idNguoiDung?._id || current.idNguoiDung) !== String(req.user._id) &&
      String(session.idNguoiDung?._id || session.idNguoiDung) !== String(req.user._id)
    ) {
      return res.status(403).send({ message: "forbidden" });
    }
    let updated = await chatMessageController.UpdateById(req.params.id, req.body);
    if (!updated) return res.status(404).send({ message: "id not found" });
    res.send(updated);
  } catch (err) {
    res.status(400).send({ message: err.message });
  }
});

router.delete("/:id", requireAuth, async function (req, res, next) {
  try {
    let current = await chatMessageController.GetById(req.params.id);
    if (!current) return res.status(404).send({ message: "id not found" });
    const session = await chatSessionController.GetById(current.idSession?._id || current.idSession);
    if (
      req.user.loaiNguoiDung !== "Ban quan ly" &&
      String(current.idNguoiDung?._id || current.idNguoiDung) !== String(req.user._id) &&
      String(session.idNguoiDung?._id || session.idNguoiDung) !== String(req.user._id)
    ) {
      return res.status(403).send({ message: "forbidden" });
    }
    let deleted = await chatMessageController.DeleteById(req.params.id);
    if (!deleted) return res.status(404).send({ message: "id not found" });
    res.send({ message: "xoa thanh cong" });
  } catch (err) {
    res.status(400).send({ message: err.message });
  }
});

module.exports = router;
