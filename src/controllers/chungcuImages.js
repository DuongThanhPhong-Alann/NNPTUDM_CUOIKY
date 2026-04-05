let ChungCuImage = require("../schemas/ChungCuImage");

module.exports = {
  GetAll: async function () {
    return await ChungCuImage.find({}).populate("idChungCu");
  },
  GetById: async function (id) {
    return await ChungCuImage.findById(id).populate("idChungCu");
  },
  Create: async function (data) {
    let item = new ChungCuImage(data);
    await item.save();
    return await ChungCuImage.findById(item._id).populate("idChungCu");
  },
  UpdateById: async function (id, data) {
    let updated = await ChungCuImage.findByIdAndUpdate(id, data, {
      new: true,
      runValidators: true,
    });
    if (!updated) return null;
    return await ChungCuImage.findById(updated._id).populate("idChungCu");
  },
  DeleteById: async function (id) {
    return await ChungCuImage.findByIdAndDelete(id);
  },
};

