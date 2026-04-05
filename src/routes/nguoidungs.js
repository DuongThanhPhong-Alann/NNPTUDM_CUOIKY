var express = require("express");
var router = express.Router();
let nguoiDungController = require("../controllers/nguoidungs");
const { requireAuth, requireRoles } = require("../middlewares/auth");

router.get("/", requireAuth, requireRoles("Ban quan ly"), async function (req, res, next) {
  let items = await nguoiDungController.GetAll();
  res.send(items);
});

router.get("/:id", requireAuth, async function (req, res, next) {
  try {
    let item = await nguoiDungController.GetById(req.params.id);
    if (!item) {
      res.status(404).send({ message: "id not found" });
      return;
    }
    if (
      req.user.loaiNguoiDung !== "Ban quan ly" &&
      String(item._id) !== String(req.user._id)
    ) {
      res.status(403).send({ message: "forbidden" });
      return;
    }
    res.send(item);
  } catch (error) {
    res.status(404).send({ message: "id not found" });
  }
});

router.post("/", requireAuth, requireRoles("Ban quan ly"), async function (req, res, next) {
  try {
    let item = await nguoiDungController.Create(req.body);
    res.send(item);
  } catch (err) {
    res.status(400).send({ message: err.message });
  }
});

router.put("/:id", requireAuth, async function (req, res, next) {
  try {
    if (
      req.user.loaiNguoiDung !== "Ban quan ly" &&
      String(req.params.id) !== String(req.user._id)
    ) {
      return res.status(403).send({ message: "forbidden" });
    }
    let updated = await nguoiDungController.UpdateById(req.params.id, req.body);
    if (!updated) return res.status(404).send({ message: "id not found" });
    res.send(updated);
  } catch (err) {
    res.status(400).send({ message: err.message });
  }
});

router.delete("/:id", requireAuth, requireRoles("Ban quan ly"), async function (req, res, next) {
  try {
    let deleted = await nguoiDungController.DeleteById(req.params.id);
    if (!deleted) return res.status(404).send({ message: "id not found" });
    res.send(deleted);
  } catch (err) {
    res.status(400).send({ message: err.message });
  }
});

module.exports = router;
