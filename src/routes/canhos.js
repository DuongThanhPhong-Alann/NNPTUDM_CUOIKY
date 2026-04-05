var express = require("express");
var router = express.Router();
let canHoController = require("../controllers/canhos");
const { requireAuth, requireRoles } = require("../middlewares/auth");

router.get("/", async function (req, res, next) {
  let items = await canHoController.GetAll();
  res.send(items);
});

router.get("/:id", async function (req, res, next) {
  try {
    let item = await canHoController.GetById(req.params.id);
    if (item) res.send(item);
    else res.status(404).send({ message: "id not found" });
  } catch (error) {
    res.status(404).send({ message: "id not found" });
  }
});

router.post("/", requireAuth, requireRoles("Ban quan ly"), async function (req, res, next) {
  try {
    let item = await canHoController.Create(req.body);
    res.send(item);
  } catch (err) {
    res.status(400).send({ message: err.message });
  }
});

router.put("/:id", requireAuth, requireRoles("Ban quan ly"), async function (req, res, next) {
  try {
    let updated = await canHoController.UpdateById(req.params.id, req.body);
    if (!updated) return res.status(404).send({ message: "id not found" });
    res.send(updated);
  } catch (err) {
    res.status(400).send({ message: err.message });
  }
});

router.delete("/:id", requireAuth, requireRoles("Ban quan ly"), async function (req, res, next) {
  try {
    let deleted = await canHoController.DeleteById(req.params.id);
    if (!deleted) return res.status(404).send({ message: "id not found" });
    res.send(deleted);
  } catch (err) {
    res.status(400).send({ message: err.message });
  }
});

module.exports = router;
