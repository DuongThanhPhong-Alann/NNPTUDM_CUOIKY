let HoaDonDichVu = require("../schemas/HoaDonDichVu");

module.exports = {
  GetAll: async function () {
    return await HoaDonDichVu.find({})
      .populate("idDichVu")
      .populate("idCanHo")
      .populate("idNguoiDung");
  },
  GetAllByNguoiDung: async function (idNguoiDung) {
    return await HoaDonDichVu.find({ idNguoiDung })
      .populate("idDichVu")
      .populate("idCanHo")
      .populate("idNguoiDung");
  },
  GetById: async function (id) {
    return await HoaDonDichVu.findById(id)
      .populate("idDichVu")
      .populate("idCanHo")
      .populate("idNguoiDung");
  },
  Create: async function (data) {
    let item = new HoaDonDichVu(data);
    await item.save();
    return await HoaDonDichVu.findById(item._id)
      .populate("idDichVu")
      .populate("idCanHo")
      .populate("idNguoiDung");
  },
  UpdateById: async function (id, data) {
    let updated = await HoaDonDichVu.findByIdAndUpdate(id, data, {
      new: true,
      runValidators: true,
    });
    if (!updated) return null;
    return await HoaDonDichVu.findById(updated._id)
      .populate("idDichVu")
      .populate("idCanHo")
      .populate("idNguoiDung");
  },
  DeleteById: async function (id) {
    return await HoaDonDichVu.findByIdAndDelete(id);
  },
};
