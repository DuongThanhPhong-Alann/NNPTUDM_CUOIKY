let ChatMessage = require("../models/ChatMessage");

module.exports = {
  GetAll: async function () {
    return await ChatMessage.find({}).populate("idSession").populate("idNguoiDung");
  },
  GetById: async function (id) {
    return await ChatMessage.findById(id).populate("idSession").populate("idNguoiDung");
  },
  Create: async function (data) {
    let item = new ChatMessage(data);
    await item.save();
    return await ChatMessage.findById(item._id).populate("idSession").populate("idNguoiDung");
  },
  UpdateById: async function (id, data) {
    let updated = await ChatMessage.findByIdAndUpdate(id, data, {
      new: true,
      runValidators: true,
    });
    if (!updated) return null;
    return await ChatMessage.findById(updated._id).populate("idSession").populate("idNguoiDung");
  },
  DeleteById: async function (id) {
    return await ChatMessage.findByIdAndDelete(id);
  },
};

