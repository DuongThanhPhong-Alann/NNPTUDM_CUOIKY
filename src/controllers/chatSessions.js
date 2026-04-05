let ChatSession = require("../schemas/ChatSession");

module.exports = {
  GetAll: async function () {
    return await ChatSession.find({}).populate("idNguoiDung");
  },
  GetAllByNguoiDung: async function (idNguoiDung) {
    return await ChatSession.find({ idNguoiDung }).populate("idNguoiDung");
  },
  GetById: async function (id) {
    return await ChatSession.findById(id).populate("idNguoiDung");
  },
  Create: async function (data) {
    let item = new ChatSession(data);
    await item.save();
    return await ChatSession.findById(item._id).populate("idNguoiDung");
  },
  UpdateById: async function (id, data) {
    let updated = await ChatSession.findByIdAndUpdate(id, data, {
      new: true,
      runValidators: true,
    });
    if (!updated) return null;
    return await ChatSession.findById(updated._id).populate("idNguoiDung");
  },
  DeleteById: async function (id) {
    return await ChatSession.findByIdAndDelete(id);
  },
  UpdateLastMessageAt: async function (id, lastMessageAt, session) {
    return await ChatSession.findByIdAndUpdate(
      id,
      { lastMessageAt },
      { new: true, session },
    );
  },
};
