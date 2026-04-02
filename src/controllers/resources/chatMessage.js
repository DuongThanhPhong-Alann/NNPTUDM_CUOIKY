const { makeCrudController } = require("../crudFactory");
const { ChatMessage } = require("../../models");

module.exports = makeCrudController(ChatMessage, {
  populate: ["idSession", "idNguoiDung"],
});

