const mongoose = require("mongoose");

const CanHoImageSchema = new mongoose.Schema(
  {
    idCanHo: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "CanHo",
      required: true,
      index: true,
    },
    duongDan: { type: String, required: true, trim: true },
  },
  {
    timestamps: true,
    collection: "hinhanhcanhos",
  },
);

CanHoImageSchema.index({ idCanHo: 1, duongDan: 1 }, { unique: true });

module.exports =
  mongoose.models.CanHoImage || mongoose.model("CanHoImage", CanHoImageSchema);

