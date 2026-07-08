import { Schema, model, models } from "mongoose"

const SubscriptionSchema = new Schema(
  {
    walletAddress: { type: String, required: true },
    active: { type: Boolean, default: true },
    txHash: String,
    amount: String,
    currency: { type: String, default: "USDC" },
    expiresAt: Date,
  },
  { timestamps: true }
)

export const Subscription = models.Subscription || model("Subscription", SubscriptionSchema)
