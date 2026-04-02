const { makeCrudController } = require("../crudFactory");
const { TinTuc } = require("../../models");

module.exports = makeCrudController(TinTuc);

