const mongoose = require("mongoose");

const TinTucSchema = new mongoose.Schema(
  {
    tieuDe: { type: String, required: true, trim: true },
    noiDung: { type: String, required: true },
    ngayDang: { type: Date, default: Date.now, index: true },
    ngaySuKien: { type: Date },
    hinhAnh: { type: String, trim: true },
  },
  {
    timestamps: true,
    collection: "tintucs",
  },
);

module.exports = mongoose.models.TinTuc || mongoose.model("TinTuc", TinTucSchema);

