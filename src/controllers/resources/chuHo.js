const { makeCrudController } = require("../crudFactory");
const { ChuHo } = require("../../models");

module.exports = makeCrudController(ChuHo, {
  populate: ["idCuDan", "idCanHo", "idChungCu"],
});

