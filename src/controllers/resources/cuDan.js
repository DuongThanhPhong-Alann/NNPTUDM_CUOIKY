const { makeCrudController } = require("../crudFactory");
const { CuDan } = require("../../models");

module.exports = makeCrudController(CuDan, {
  populate: ["idNguoiDung", "idCanHo", "idChungCu"],
});

