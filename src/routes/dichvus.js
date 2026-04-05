var express = require("express");
var router = express.Router();
let dichVuController = require("../controllers/dichvus");

router.get("/", async function (req, res, next) {
  let items = await dichVuController.GetAll();
  res.send(items);
});

router.get("/:id", async function (req, res, next) {
  try {
    let item = await dichVuController.GetById(req.params.id);
    if (item) res.send(item);
    else res.status(404).send({ message: "id not found" });
  } catch (error) {
    res.status(404).send({ message: "id not found" });
  }
});

router.post("/", async function (req, res, next) {
  try {
    let item = await dichVuController.Create(req.body);
    res.send(item);
  } catch (err) {
    res.status(400).send({ message: err.message });
  }
});

router.put("/:id", async function (req, res, next) {
  try {
    let updated = await dichVuController.UpdateById(req.params.id, req.body);
    if (!updated) return res.status(404).send({ message: "id not found" });
    res.send(updated);
  } catch (err) {
    res.status(400).send({ message: err.message });
  }
});

router.delete("/:id", async function (req, res, next) {
  try {
    let deleted = await dichVuController.DeleteById(req.params.id);
    if (!deleted) return res.status(404).send({ message: "id not found" });
    res.send(deleted);
  } catch (err) {
    res.status(400).send({ message: err.message });
  }
});

module.exports = router;
