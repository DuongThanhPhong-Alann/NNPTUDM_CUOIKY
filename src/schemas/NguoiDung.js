const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");
const { LOAI_NGUOI_DUNG } = require("./enums");

function isHashedPassword(value) {
  return typeof value === "string" && /^\$2[aby]\$\d{2}\$/.test(value);
}

const NguoiDungSchema = new mongoose.Schema(
  {
    hoTen: { type: String, required: true, trim: true },
    email: { type: String, required: true, trim: true, lowercase: true },
    matKhau: { type: String, required: true, select: false },
    soDienThoai: { type: String, trim: true },
    loaiNguoiDung: { type: String, enum: LOAI_NGUOI_DUNG, required: true },
  },
  {
    timestamps: true,
    collection: "nguoidungs",
    toJSON: {
      transform: function (_doc, ret) {
        delete ret.matKhau;
        return ret;
      },
    },
  },
);

NguoiDungSchema.index({ email: 1 }, { unique: true });

NguoiDungSchema.pre("save", async function (next) {
  if (!this.isModified("matKhau") || isHashedPassword(this.matKhau)) {
    return next();
  }

  this.matKhau = await bcrypt.hash(this.matKhau, 10);
  next();
});

NguoiDungSchema.pre("findOneAndUpdate", async function (next) {
  const update = this.getUpdate();
  if (!update) return next();

  const matKhau = update.matKhau || (update.$set && update.$set.matKhau);
  if (!matKhau || isHashedPassword(matKhau)) return next();

  const hashed = await bcrypt.hash(matKhau, 10);
  if (update.matKhau) update.matKhau = hashed;
  if (update.$set && update.$set.matKhau) update.$set.matKhau = hashed;
  next();
});

module.exports =
  mongoose.models.NguoiDung || mongoose.model("NguoiDung", NguoiDungSchema);