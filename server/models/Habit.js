import mongoose from "mongoose";

const habitSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    name: {
      type: String,
      required: true,
    },
    frequency: {
      type: String, // "daily", "weekly", "monthly"
      default: "daily",
    },
    times: {
      type: Number,
      default: 1,
    },
    unit: {
      type: String,
      default: "minutes",
    },
    reminderTime: {
      type: String, // "HH:mm"
      default: null,
    },
    enableReminder: {
      type: Boolean,
      default: false,
    },
    startDate: {
      type: Date,
      default: Date.now,
    },
    endDate: {
      type: Date,
      default: null,
    },
    createdDate: {
      type: String,
      required: false,
    },
    emoji: {
      type: String,
      default: "🧘",
    },
    completedAt: {
      type: Date,
      default: null,
    },
    completedDates: {
      type: [Date],
      default: [],
    },
  },
  { timestamps: true }
);

export default mongoose.model("Habit", habitSchema);
