let DichVu = require("../schemas/DichVu");

module.exports = {
  GetAll: async function () {
    return await DichVu.find({});
  },
  GetById: async function (id) {
    return await DichVu.findById(id);
  },
  Create: async function (data) {
    let item = new DichVu(data);
    await item.save();
    return item;
  },
  UpdateById: async function (id, data) {
    return await DichVu.findByIdAndUpdate(id, data, { new: true, runValidators: true });
  },
  DeleteById: async function (id) {
    return await DichVu.findByIdAndDelete(id);
  },
};
