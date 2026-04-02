const mongoose = require("mongoose");

const ChatSessionSchema = new mongoose.Schema(
  {
    idNguoiDung: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "NguoiDung",
      index: true,
    },
    tieuDe: { type: String, trim: true },
    tags: { type: [String], default: [] },
    isArchived: { type: Boolean, default: false, index: true },
    lastMessageAt: { type: Date, index: true },
    metadata: { type: mongoose.Schema.Types.Mixed },
  },
  {
    timestamps: true,
    collection: "chatsessions",
  },
);

ChatSessionSchema.index({ idNguoiDung: 1, lastMessageAt: -1 });

module.exports =
  mongoose.models.ChatSession ||
  mongoose.model("ChatSession", ChatSessionSchema);

