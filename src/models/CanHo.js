const mongoose = require("mongoose");
const { TRANG_THAI_CAN_HO } = require("./enums");

const CanHoSchema = new mongoose.Schema(
  {
    maCan: { type: String, required: true, trim: true },
    idChungCu: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "ChungCu",
      required: true,
      index: true,
    },
    dienTich: { type: Number, min: 0 },
    soPhong: { type: Number, min: 0 },
    gia: { type: mongoose.Schema.Types.Decimal128, min: 0 },
    trangThai: { type: String, enum: TRANG_THAI_CAN_HO, required: true },
    moTa: { type: String, trim: true },
    urls: { type: [String], default: [] },
  },
  {
    timestamps: true,
    collection: "canhos",
  },
);

CanHoSchema.index({ maCan: 1, idChungCu: 1 }, { unique: true });

module.exports = mongoose.models.CanHo || mongoose.model("CanHo", CanHoSchema);

