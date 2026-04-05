const mongoose = require("mongoose");

const ChungCuSchema = new mongoose.Schema(
  {
    ten: { type: String, required: true, trim: true },
    diaChi: { type: String, required: true, trim: true },
    chuDauTu: { type: String, trim: true },
    namXayDung: { type: Number, min: 1800, max: 3000 },
    soTang: { type: Number, min: 0 },
    moTa: { type: String, trim: true },
  },
  {
    timestamps: true,
    collection: "chungcus",
  },
);

module.exports =
  mongoose.models.ChungCu || mongoose.model("ChungCu", ChungCuSchema);

