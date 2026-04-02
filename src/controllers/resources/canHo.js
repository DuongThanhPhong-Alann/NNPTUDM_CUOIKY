const { makeCrudController } = require("../crudFactory");
const { CanHo } = require("../../models");

module.exports = makeCrudController(CanHo, { populate: ["idChungCu"] });

