const mongoose = require("mongoose");

const CuDanSchema = new mongoose.Schema(
  {
    idNguoiDung: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "NguoiDung",
      required: true,
      unique: true,
      index: true,
    },
    idCanHo: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "CanHo",
      required: true,
      index: true,
    },
    idChungCu: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "ChungCu",
      required: true,
      index: true,
    },
  },
  {
    timestamps: true,
    collection: "cudans",
  },
);

module.exports = mongoose.models.CuDan || mongoose.model("CuDan", CuDanSchema);

