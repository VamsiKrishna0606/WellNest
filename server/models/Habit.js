import mongoose from "mongoose";

const HabitSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
  },
  frequency: {
    type: String,
    required: true,
  },
  icon: {
    type: String,
    required: false,
  },
  date: {
    type: String, // ✅ Store dd-mm-yyyy as string, not Date type
    required: true,
  },
  completed: {
    type: Boolean,
    default: false,
  },
});

const Habit = mongoose.model("Habit", HabitSchema);
export default Habit;
