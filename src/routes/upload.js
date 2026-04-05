const express = require("express");
const { upload } = require("../middlewares/upload");
const { requireAuth, requireRoles } = require("../middlewares/auth");

const router = express.Router();

router.post(
  "/",
  requireAuth,
  requireRoles("Ban quan ly"),
  upload.single("file"),
  function (req, res) {
    if (!req.file) {
      return res.status(400).send({ message: "file is required" });
    }

    return res.status(201).send({
      filename: req.file.filename,
      originalname: req.file.originalname,
      mimetype: req.file.mimetype,
      size: req.file.size,
      url: `/uploads/${req.file.filename}`,
    });
  },
);

module.exports = router;
