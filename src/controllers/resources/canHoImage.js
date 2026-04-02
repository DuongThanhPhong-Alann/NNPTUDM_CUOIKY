const { makeCrudController } = require("../crudFactory");
const { CanHoImage } = require("../../models");

module.exports = makeCrudController(CanHoImage, { populate: ["idCanHo"] });

