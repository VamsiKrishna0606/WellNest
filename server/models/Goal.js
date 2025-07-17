import mongoose from "mongoose";

const GoalSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true,
  },
  target: {
    type: String,
    required: true,
  },
  progress: {
    type: String,
    required: true,
  },
  date: {
    type: String,
    required: true,
  },
});

const Goal = mongoose.model("Goal", GoalSchema);
export default Goal;
