let CanHoImage = require("../models/CanHoImage");

module.exports = {
  GetAll: async function () {
    return await CanHoImage.find({}).populate("idCanHo");
  },
  GetById: async function (id) {
    return await CanHoImage.findById(id).populate("idCanHo");
  },
  Create: async function (data) {
    let item = new CanHoImage(data);
    await item.save();
    return await CanHoImage.findById(item._id).populate("idCanHo");
  },
  UpdateById: async function (id, data) {
    let updated = await CanHoImage.findByIdAndUpdate(id, data, {
      new: true,
      runValidators: true,
    });
    if (!updated) return null;
    return await CanHoImage.findById(updated._id).populate("idCanHo");
  },
  DeleteById: async function (id) {
    return await CanHoImage.findByIdAndDelete(id);
  },
};

