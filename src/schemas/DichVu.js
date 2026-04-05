const mongoose = require("mongoose");

const DichVuSchema = new mongoose.Schema(
  {
    tenDichVu: { type: String, required: true, trim: true },
    moTa: { type: String, trim: true },
    donGia: { type: mongoose.Schema.Types.Decimal128, required: true, min: 0 },
    donViTinh: { type: String, required: true, trim: true },
    trangThai: { type: Boolean, default: true },
  },
  {
    timestamps: true,
    collection: "dichvus",
  },
);

DichVuSchema.index({ tenDichVu: 1 }, { unique: true });

module.exports = mongoose.models.DichVu || mongoose.model("DichVu", DichVuSchema);
