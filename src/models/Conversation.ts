import { Schema, model, models } from "mongoose"

const MessageSchema = new Schema(
  {
    role: { type: String, enum: ["user", "assistant"], required: true },
    content: { type: String, required: true },
  },
  { _id: false }
)

const ConversationSchema = new Schema(
  {
    userId: { type: String, required: true, index: true },
    title: { type: String, default: "New chat" },
    messages: [MessageSchema],
  },
  { timestamps: true }
)

export const Conversation = models.Conversation || model("Conversation", ConversationSchema)
