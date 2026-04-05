let CuDan = require("../schemas/CuDan");

module.exports = {
  GetAll: async function () {
    return await CuDan.find({}).populate("idNguoiDung").populate("idCanHo").populate("idChungCu");
  },
  GetById: async function (id) {
    return await CuDan.findById(id).populate("idNguoiDung").populate("idCanHo").populate("idChungCu");
  },
  Create: async function (data) {
    let item = new CuDan(data);
    await item.save();
    return await CuDan.findById(item._id).populate("idNguoiDung").populate("idCanHo").populate("idChungCu");
  },
  UpdateById: async function (id, data) {
    let updated = await CuDan.findByIdAndUpdate(id, data, { new: true, runValidators: true });
    if (!updated) return null;
    return await CuDan.findById(updated._id)
      .populate("idNguoiDung")
      .populate("idCanHo")
      .populate("idChungCu");
  },
  DeleteById: async function (id) {
    return await CuDan.findByIdAndDelete(id);
  },
};

