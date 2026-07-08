import { Schema, model, models } from "mongoose"

const CreditAccountSchema = new Schema(
  {
    walletAddress: { type: String, required: true, unique: true, index: true },
    balance: { type: Number, default: 0 },
    totalPurchased: { type: Number, default: 0 },
  },
  { timestamps: true }
)

export const CreditAccount = models.CreditAccount || model("CreditAccount", CreditAccountSchema)
