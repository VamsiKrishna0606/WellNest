import mongoose from "mongoose";

const FoodLogSchema = new mongoose.Schema({
  meal: {
    type: String,
    required: true,
  },
  calories: {
    type: Number,
    required: true,
  },
  date: {
    type: String, // dd-mm-yyyy
    required: true,
  },
  time: {
    type: String,
    required: true,
  },
  category: {
    type: String,
    required: true,
  },
});

const FoodLog = mongoose.model("FoodLog", FoodLogSchema);
export default FoodLog;
