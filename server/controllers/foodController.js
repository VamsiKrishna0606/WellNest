import FoodLog from "../models/FoodLog.js";

export const getAllFoodLogs = async (req, res) => {
  try {
    const foodLogs = await FoodLog.find();
    res.status(200).json(foodLogs);
  } catch (error) {
    res.status(500).json({ message: "Failed to fetch food logs", error });
  }
};

export const createFoodLog = async (req, res) => {
  try {
    const { meal, calories, date, time, category } = req.body;

    const newFoodLog = new FoodLog({
      meal,
      calories,
      date,
      time,
      category,
    });

    await newFoodLog.save();
    res.status(201).json(newFoodLog);
  } catch (error) {
    res.status(500).json({ message: "Failed to create food log", error });
  }
};

export const deleteFoodLog = async (req, res) => {
  try {
    const { id } = req.params;
    const deleted = await FoodLog.findByIdAndDelete(id);
    if (!deleted) {
      return res.status(404).json({ message: "Food log not found" });
    }
    res.status(200).json({ message: "Food log deleted successfully" });
  } catch (error) {
    res.status(500).json({ message: "Failed to delete food log", error });
  }
};
