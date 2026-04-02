const mongoose = require("mongoose");

const ChuHoSchema = new mongoose.Schema(
  {
    idCuDan: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "CuDan",
      required: true,
      index: true,
    },
    idCanHo: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "CanHo",
      required: true,
      unique: true,
      index: true,
    },
    idChungCu: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "ChungCu",
      required: true,
      index: true,
    },
    ghiChu: { type: String, trim: true },
  },
  {
    timestamps: true,
    collection: "chuho",
  },
);

module.exports = mongoose.models.ChuHo || mongoose.model("ChuHo", ChuHoSchema);

