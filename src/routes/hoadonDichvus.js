var express = require("express");
var router = express.Router();
let hoaDonDichVuController = require("../controllers/hoadondichvus");
const { requireAuth, requireRoles } = require("../middlewares/auth");

router.get("/", requireAuth, async function (req, res, next) {
  let items =
    req.user.loaiNguoiDung === "Ban quan ly"
      ? await hoaDonDichVuController.GetAll()
      : await hoaDonDichVuController.GetAllByNguoiDung(req.user._id);
  res.send(items);
});

router.get("/:id", requireAuth, async function (req, res, next) {
  try {
    let item = await hoaDonDichVuController.GetById(req.params.id);
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

router.post("/", requireAuth, requireRoles("Ban quan ly"), async function (req, res, next) {
  try {
    let item = await hoaDonDichVuController.Create(req.body);
    res.send(item);
  } catch (err) {
    res.status(400).send({ message: err.message });
  }
});

router.put("/:id", requireAuth, requireRoles("Ban quan ly"), async function (req, res, next) {
  try {
    let updated = await hoaDonDichVuController.UpdateById(req.params.id, req.body);
    if (!updated) return res.status(404).send({ message: "id not found" });
    res.send(updated);
  } catch (err) {
    res.status(400).send({ message: err.message });
  }
});

router.delete("/:id", requireAuth, requireRoles("Ban quan ly"), async function (req, res, next) {
  try {
    let deleted = await hoaDonDichVuController.DeleteById(req.params.id);
    if (!deleted) return res.status(404).send({ message: "id not found" });
    res.send({ message: "xoa thanh cong" });
  } catch (err) {
    res.status(400).send({ message: err.message });
  }
});

module.exports = router;
