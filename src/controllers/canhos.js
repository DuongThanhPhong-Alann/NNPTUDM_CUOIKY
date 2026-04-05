let CanHo = require("../schemas/CanHo");

module.exports = {
  GetAll: async function () {
    return await CanHo.find({}).populate("idChungCu");
  },
  GetById: async function (id) {
    return await CanHo.findById(id).populate("idChungCu");
  },
  Create: async function (data) {
    let item = new CanHo(data);
    await item.save();
    return await CanHo.findById(item._id).populate("idChungCu");
  },
  UpdateById: async function (id, data) {
    let updated = await CanHo.findByIdAndUpdate(id, data, { new: true, runValidators: true });
    if (!updated) return null;
    return await CanHo.findById(updated._id).populate("idChungCu");
  },
  DeleteById: async function (id) {
    return await CanHo.findByIdAndDelete(id);
  },
};

