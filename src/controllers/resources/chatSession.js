const { makeCrudController } = require("../crudFactory");
const { ChatSession } = require("../../models");

module.exports = makeCrudController(ChatSession, { populate: ["idNguoiDung"] });

