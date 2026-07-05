import { Schema, model, models } from "mongoose"

const MatchSchema = new Schema(
  {
    id: { type: Number, required: true, unique: true },
    competitionId: Number,
    season: Number,
    round: String,
    date: { type: Date, required: true },
    status: {
      type: String,
      enum: ["SCHEDULED", "LIVE", "FINISHED", "POSTPONED", "CANCELLED"],
      default: "SCHEDULED",
    },
    minute: Number,
    homeTeamId: { type: Number, required: true },
    awayTeamId: { type: Number, required: true },
    homeScore: Number,
    awayScore: Number,
    homeXg: Number,
    awayXg: Number,
    possessionHome: Number,
    possessionAway: Number,
    shotsHome: Number,
    shotsAway: Number,
    shotsOnTargetHome: Number,
    shotsOnTargetAway: Number,
    venue: String,
  },
  { timestamps: true }
)

export const Match = models.Match || model("Match", MatchSchema)
