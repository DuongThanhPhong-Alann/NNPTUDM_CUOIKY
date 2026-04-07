var express = require("express");
var router = express.Router();
let chungCuImageController = require("../controllers/chungcuImages");
const { requireAuth, requireRoles } = require("../middlewares/auth");
const { imageUpload, getUploadedFile } = require("../middlewares/upload");

function buildPayload(req) {
  const file = getUploadedFile(req);

  return {
    ...req.body,
    duongDan: file ? `/uploads/${file.filename}` : req.body.duongDan,
  };
}

router.get("/", async function (req, res, next) {
  let items = await chungCuImageController.GetAll();
  res.send(items);
});

router.get("/:id", async function (req, res, next) {
  try {
    let item = await chungCuImageController.GetById(req.params.id);
    if (item) res.send(item);
    else res.status(404).send({ message: "id not found" });
  } catch (error) {
    res.status(404).send({ message: "id not found" });
  }
});

router.post(
  "/",
  requireAuth,
  requireRoles("Ban quan ly"),
  imageUpload,
  async function (req, res, next) {
    try {
      let item = await chungCuImageController.Create(buildPayload(req));
      res.send(item);
    } catch (err) {
      res.status(400).send({ message: err.message });
    }
  },
);

router.put(
  "/:id",
  requireAuth,
  requireRoles("Ban quan ly"),
  imageUpload,
  async function (req, res, next) {
    try {
      let updated = await chungCuImageController.UpdateById(req.params.id, buildPayload(req));
      if (!updated) return res.status(404).send({ message: "id not found" });
      res.send(updated);
    } catch (err) {
      res.status(400).send({ message: err.message });
    }
  },
);

router.delete("/:id", requireAuth, requireRoles("Ban quan ly"), async function (req, res, next) {
  try {
    let deleted = await chungCuImageController.DeleteById(req.params.id);
    if (!deleted) return res.status(404).send({ message: "id not found" });
    res.send({ message: "xoa thanh cong" });
  } catch (err) {
    res.status(400).send({ message: err.message });
  }
});

module.exports = router;
