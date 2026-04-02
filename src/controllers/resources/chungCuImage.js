const { makeCrudController } = require("../crudFactory");
const { ChungCuImage } = require("../../models");

module.exports = makeCrudController(ChungCuImage, { populate: ["idChungCu"] });

