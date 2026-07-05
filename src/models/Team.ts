import { Schema, model, models } from "mongoose"

const TeamSchema = new Schema(
  {
    id: { type: Number, required: true, unique: true },
    name: { type: String, required: true },
    code: String,
    country: String,
    founded: Number,
    national: Boolean,
    logo: String,
    fifaRanking: Number,
  },
  { timestamps: true }
)

export const Team = models.Team || model("Team", TeamSchema)
