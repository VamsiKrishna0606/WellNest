import mongoose from "mongoose";

const userGoalsSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true,
    unique: true,
  },
  dailySteps: Number,
  dailyCalories: Number,
  weeklyWorkouts: Number,
  weightGoal: Number,
  sleepHours: Number,
  hydrationLiters: Number,
  customGoals: String,
  preferredUnits: {
    weight: {
      type: String,
      default: "kg"
    },
    distance: {
      type: String,
      default: "km"
    }
  },
}, { timestamps: true });

export default mongoose.model("UserGoals", userGoalsSchema);
