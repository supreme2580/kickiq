import { Schema, model, models } from "mongoose"

const PredictionSchema = new Schema(
  {
    matchId: { type: Number, required: true },
    walletAddress: { type: String, required: true },
    homeScore: Number,
    awayScore: Number,
    winner: String,
    confidence: Number,
    analysis: String,
    isPremium: { type: Boolean, default: false },
  },
  { timestamps: true }
)

export const Prediction = models.Prediction || model("Prediction", PredictionSchema)
