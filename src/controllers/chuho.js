let ChuHo = require("../schemas/ChuHo");

module.exports = {
  GetAll: async function () {
    return await ChuHo.find({}).populate("idCuDan").populate("idCanHo").populate("idChungCu");
  },
  GetById: async function (id) {
    return await ChuHo.findById(id).populate("idCuDan").populate("idCanHo").populate("idChungCu");
  },
  Create: async function (data) {
    let item = new ChuHo(data);
    await item.save();
    return await ChuHo.findById(item._id).populate("idCuDan").populate("idCanHo").populate("idChungCu");
  },
  UpdateById: async function (id, data) {
    let updated = await ChuHo.findByIdAndUpdate(id, data, { new: true, runValidators: true });
    if (!updated) return null;
    return await ChuHo.findById(updated._id).populate("idCuDan").populate("idCanHo").populate("idChungCu");
  },
  DeleteById: async function (id) {
    return await ChuHo.findByIdAndDelete(id);
  },
};

