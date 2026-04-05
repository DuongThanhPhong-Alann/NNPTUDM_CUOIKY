const mongoose = require("mongoose");

const CHAT_ROLE = ["system", "user", "assistant", "tool"];

const ChatMessageSchema = new mongoose.Schema(
  {
    idSession: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "ChatSession",
      required: true,
      index: true,
    },
    idNguoiDung: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "NguoiDung",
      index: true,
    },
    role: { type: String, enum: CHAT_ROLE, required: true, index: true },
    content: { type: String, required: true },
    model: { type: String, trim: true },
    usage: {
      inputTokens: { type: Number, min: 0 },
      outputTokens: { type: Number, min: 0 },
      totalTokens: { type: Number, min: 0 },
    },
    metadata: { type: mongoose.Schema.Types.Mixed },
  },
  {
    timestamps: true,
    collection: "chatmessages",
  },
);

ChatMessageSchema.index({ idSession: 1, createdAt: 1 });

module.exports =
  mongoose.models.ChatMessage ||
  mongoose.model("ChatMessage", ChatMessageSchema);

