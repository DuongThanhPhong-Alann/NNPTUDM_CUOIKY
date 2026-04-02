const mongoose = require("mongoose");

const ChungCuImageSchema = new mongoose.Schema(
  {
    idChungCu: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "ChungCu",
      required: true,
      index: true,
    },
    duongDan: { type: String, required: true, trim: true },
  },
  {
    timestamps: true,
    collection: "hinhanhchungcus",
  },
);

ChungCuImageSchema.index({ idChungCu: 1, duongDan: 1 }, { unique: true });

module.exports =
  mongoose.models.ChungCuImage ||
  mongoose.model("ChungCuImage", ChungCuImageSchema);

