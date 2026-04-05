const mongoose = require("mongoose");
const { LOAI_NGUOI_DUNG } = require("./enums");

const NguoiDungSchema = new mongoose.Schema(
  {
    hoTen: { type: String, required: true, trim: true },
    email: { type: String, required: true, trim: true, lowercase: true },
    matKhau: { type: String, required: true },
    soDienThoai: { type: String, trim: true },
    loaiNguoiDung: { type: String, enum: LOAI_NGUOI_DUNG, required: true },
  },
  {
    timestamps: true,
    collection: "nguoidungs",
  },
);

NguoiDungSchema.index({ email: 1 }, { unique: true });

module.exports =
  mongoose.models.NguoiDung || mongoose.model("NguoiDung", NguoiDungSchema);

