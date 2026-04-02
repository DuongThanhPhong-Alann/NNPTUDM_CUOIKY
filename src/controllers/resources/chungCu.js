const { makeCrudController } = require("../crudFactory");
const { ChungCu } = require("../../models");

module.exports = makeCrudController(ChungCu);

