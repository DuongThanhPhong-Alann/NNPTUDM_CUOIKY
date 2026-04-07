const express = require("express");
const { imageUpload, getUploadedFile } = require("../middlewares/upload");
const { requireAuth, requireRoles } = require("../middlewares/auth");

const router = express.Router();

router.post(
  "/",
  requireAuth,
  requireRoles("Ban quan ly"),
  imageUpload,
  function (req, res) {
    const file = getUploadedFile(req);

    if (!file) {
      return res.status(400).send({ message: "file is required" });
    }

    return res.status(201).send({
      filename: file.filename,
      originalname: file.originalname,
      mimetype: file.mimetype,
      size: file.size,
      url: `/uploads/${file.filename}`,
    });
  },
);

module.exports = router;
