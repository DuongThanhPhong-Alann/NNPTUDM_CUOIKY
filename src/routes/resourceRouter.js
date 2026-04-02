const express = require("express");
const { asyncHandler } = require("../middlewares/asyncHandler");

function resourceRouter(controller) {
  const router = express.Router();

  router.get("/", asyncHandler(controller.list));
  router.get("/:id", asyncHandler(controller.getById));
  router.post("/", asyncHandler(controller.create));
  router.put("/:id", asyncHandler(controller.updateById));
  router.delete("/:id", asyncHandler(controller.deleteById));

  return router;
}

module.exports = { resourceRouter };

