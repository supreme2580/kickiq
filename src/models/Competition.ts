import { Schema, model, models } from "mongoose"

const CompetitionSchema = new Schema(
  {
    id: { type: Number, required: true, unique: true },
    name: { type: String, required: true },
    code: String,
    type: String,
    logo: String,
    season: Number,
  },
  { timestamps: true }
)

export const Competition = models.Competition || model("Competition", CompetitionSchema)
