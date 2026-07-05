import { Schema, model, models } from "mongoose"

const StandingSchema = new Schema(
  {
    id: { type: Number, required: true, unique: true },
    competitionId: Number,
    season: Number,
    teamId: { type: Number, required: true },
    position: { type: Number, required: true },
    played: { type: Number, default: 0 },
    won: { type: Number, default: 0 },
    drawn: { type: Number, default: 0 },
    lost: { type: Number, default: 0 },
    goalsFor: { type: Number, default: 0 },
    goalsAgainst: { type: Number, default: 0 },
    goalDiff: { type: Number, default: 0 },
    points: { type: Number, default: 0 },
    form: String,
    groupName: String,
  },
  { timestamps: true }
)

export const Standing = models.Standing || model("Standing", StandingSchema)
