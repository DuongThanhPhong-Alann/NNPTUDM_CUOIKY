let NguoiDung = require("../schemas/NguoiDung");

module.exports = {
  GetAll: async function () {
    return await NguoiDung.find({});
  },
  GetById: async function (id) {
    return await NguoiDung.findById(id);
  },
  Create: async function (data) {
    let item = new NguoiDung(data);
    await item.save();
    return item;
  },
  FindByEmail: async function (email) {
    return await NguoiDung.findOne({ email: String(email).toLowerCase() });
  },
  FindByEmailWithPassword: async function (email) {
    return await NguoiDung.findOne({ email: String(email).toLowerCase() }).select("+matKhau");
  },
  UpdateById: async function (id, data) {
    return await NguoiDung.findByIdAndUpdate(id, data, { new: true, runValidators: true });
  },
  DeleteById: async function (id) {
    return await NguoiDung.findByIdAndDelete(id);
  },
};
