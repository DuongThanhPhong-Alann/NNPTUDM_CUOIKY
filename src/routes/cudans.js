var express = require("express");
var router = express.Router();
let cuDanController = require("../controllers/cudans");
const { requireAuth, requireRoles } = require("../middlewares/auth");

router.get("/", async function (req, res, next) {
  let items = await cuDanController.GetAll();
  res.send(items);
});

router.get("/:id", async function (req, res, next) {
  try {
    let item = await cuDanController.GetById(req.params.id);
    if (item) res.send(item);
    else res.status(404).send({ message: "id not found" });
  } catch (error) {
    res.status(404).send({ message: "id not found" });
  }
});

router.post("/", requireAuth, requireRoles("Ban quan ly"), async function (req, res, next) {
  try {
    let item = await cuDanController.Create(req.body);
    res.send(item);
  } catch (err) {
    res.status(400).send({ message: err.message });
  }
});

router.put("/:id", requireAuth, requireRoles("Ban quan ly"), async function (req, res, next) {
  try {
    let updated = await cuDanController.UpdateById(req.params.id, req.body);
    if (!updated) return res.status(404).send({ message: "id not found" });
    res.send(updated);
  } catch (err) {
    res.status(400).send({ message: err.message });
  }
});

router.delete("/:id", requireAuth, requireRoles("Ban quan ly"), async function (req, res, next) {
  try {
    let deleted = await cuDanController.DeleteById(req.params.id);
    if (!deleted) return res.status(404).send({ message: "id not found" });
    res.send({ message: "xoa thanh cong" });
  } catch (err) {
    res.status(400).send({ message: err.message });
  }
});

module.exports = router;
