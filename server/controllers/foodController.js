import FoodLog from "../models/FoodLog.js";

// ✅ Create Food Log - with future date restriction
export const createFoodLog = async (req, res) => {
  try {
    const { name, calories, protein, carbs, fats, mealType, date } = req.body;

    // Input validation
    if (!name || typeof name !== "string" || calories < 0 || protein < 0 || carbs < 0 || fats < 0) {
      return res.status(400).json({
        error: "Invalid input: name is required, and numbers cannot be negative.",
      });
    }

    // 🔴 Block future dates
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const inputDate = new Date(date);
    inputDate.setHours(0, 0, 0, 0);

    if (inputDate > today) {
      return res.status(400).json({ message: "Cannot add food logs for future dates." });
    }

    // ✅ Create and Save
    const foodLog = await FoodLog.create({
      userId: req.user.id,
      name,
      calories,
      protein,
      carbs,
      fats,
      mealType,
      date,
    });

    res.status(201).json(foodLog);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// ✅ Get All User Food Logs
export const getUserFoodLogs = async (req, res) => {
  try {
    const foodLogs = await FoodLog.find({ userId: req.user.id }).sort({ date: -1 });
    res.json(foodLogs);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// ✅ Delete Food Log
export const deleteFoodLog = async (req, res) => {
  try {
    await FoodLog.findOneAndDelete({ _id: req.params.id, userId: req.user.id });
    res.json({ message: "Food log deleted." });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};
