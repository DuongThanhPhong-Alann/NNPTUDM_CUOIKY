var express = require("express");
var router = express.Router();
let chatSessionController = require("../controllers/chatSessions");
const { requireAuth } = require("../middlewares/auth");

router.get("/", requireAuth, async function (req, res, next) {
  let items =
    req.user.loaiNguoiDung === "Ban quan ly"
      ? await chatSessionController.GetAll()
      : await chatSessionController.GetAllByNguoiDung(req.user._id);
  res.send(items);
});

router.get("/:id", requireAuth, async function (req, res, next) {
  try {
    let item = await chatSessionController.GetById(req.params.id);
    if (!item) {
      res.status(404).send({ message: "id not found" });
      return;
    }
    if (
      req.user.loaiNguoiDung !== "Ban quan ly" &&
      String(item.idNguoiDung?._id || item.idNguoiDung) !== String(req.user._id)
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
  try {
    let payload = { ...req.body };
    if (req.user.loaiNguoiDung !== "Ban quan ly") {
      payload.idNguoiDung = req.user._id;
    }
    let item = await chatSessionController.Create(payload);
    res.send(item);
  } catch (err) {
    res.status(400).send({ message: err.message });
  }
});

router.put("/:id", requireAuth, async function (req, res, next) {
  try {
    let current = await chatSessionController.GetById(req.params.id);
    if (!current) return res.status(404).send({ message: "id not found" });
    if (
      req.user.loaiNguoiDung !== "Ban quan ly" &&
      String(current.idNguoiDung?._id || current.idNguoiDung) !== String(req.user._id)
    ) {
      return res.status(403).send({ message: "forbidden" });
    }
    let updated = await chatSessionController.UpdateById(req.params.id, req.body);
    if (!updated) return res.status(404).send({ message: "id not found" });
    res.send(updated);
  } catch (err) {
    res.status(400).send({ message: err.message });
  }
});

router.delete("/:id", requireAuth, async function (req, res, next) {
  try {
    let current = await chatSessionController.GetById(req.params.id);
    if (!current) return res.status(404).send({ message: "id not found" });
    if (
      req.user.loaiNguoiDung !== "Ban quan ly" &&
      String(current.idNguoiDung?._id || current.idNguoiDung) !== String(req.user._id)
    ) {
      return res.status(403).send({ message: "forbidden" });
    }
    let deleted = await chatSessionController.DeleteById(req.params.id);
    if (!deleted) return res.status(404).send({ message: "id not found" });
    res.send({ message: "xoa thanh cong" });
  } catch (err) {
    res.status(400).send({ message: err.message });
  }
});

module.exports = router;
