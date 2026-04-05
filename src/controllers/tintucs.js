let TinTuc = require("../schemas/TinTuc");

module.exports = {
  GetAll: async function () {
    return await TinTuc.find({});
  },
  GetById: async function (id) {
    return await TinTuc.findById(id);
  },
  Create: async function (data) {
    let item = new TinTuc(data);
    await item.save();
    return item;
  },
  UpdateById: async function (id, data) {
    return await TinTuc.findByIdAndUpdate(id, data, { new: true, runValidators: true });
  },
  DeleteById: async function (id) {
    return await TinTuc.findByIdAndDelete(id);
  },
};

