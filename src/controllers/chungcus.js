let ChungCu = require("../schemas/ChungCu");

module.exports = {
  GetAll: async function () {
    return await ChungCu.find({});
  },
  GetById: async function (id) {
    return await ChungCu.findById(id);
  },
  Create: async function (data) {
    let item = new ChungCu(data);
    await item.save();
    return item;
  },
  UpdateById: async function (id, data) {
    return await ChungCu.findByIdAndUpdate(id, data, { new: true, runValidators: true });
  },
  DeleteById: async function (id) {
    return await ChungCu.findByIdAndDelete(id);
  },
};

