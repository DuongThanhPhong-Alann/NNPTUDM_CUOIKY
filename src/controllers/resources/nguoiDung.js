const { makeCrudController } = require("../crudFactory");
const { NguoiDung } = require("../../models");

module.exports = makeCrudController(NguoiDung);

