const mongoose = require("mongoose");
const { TRANG_THAI_HOA_DON_DICH_VU } = require("./enums");

const HoaDonDichVuSchema = new mongoose.Schema(
  {
    idDichVu: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "DichVu",
      required: true,
      index: true,
    },
    idCanHo: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "CanHo",
      required: true,
      index: true,
    },
    idNguoiDung: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "NguoiDung",
      required: true,
      index: true,
    },
    kyThanhToan: { type: String, required: true, trim: true },
    soLuong: { type: Number, required: true, min: 1, default: 1 },
    donGia: { type: mongoose.Schema.Types.Decimal128, required: true, min: 0 },
    thanhTien: { type: mongoose.Schema.Types.Decimal128, required: true, min: 0 },
    ngayLap: { type: Date, default: Date.now },
    hanThanhToan: { type: Date, required: true },
    ngayThanhToan: { type: Date },
    trangThai: {
      type: String,
      enum: TRANG_THAI_HOA_DON_DICH_VU,
      default: "Chua thanh toan",
      required: true,
    },
    ghiChu: { type: String, trim: true },
  },
  {
    timestamps: true,
    collection: "hoadondichvus",
  },
);

HoaDonDichVuSchema.pre("validate", function (next) {
  if (this.donGia !== undefined && this.soLuong !== undefined) {
    const donGia = Number(this.donGia.toString());
    const thanhTien = donGia * this.soLuong;
    this.thanhTien = mongoose.Types.Decimal128.fromString(String(thanhTien));
  }
  next();
});

HoaDonDichVuSchema.index({ idCanHo: 1, idDichVu: 1, kyThanhToan: 1 }, { unique: true });

module.exports =
  mongoose.models.HoaDonDichVu || mongoose.model("HoaDonDichVu", HoaDonDichVuSchema);
