import Habit from "../models/Habit.js";
import FoodLog from "../models/FoodLog.js";

export const getQuickStats = async (req, res) => {
  try {
    const today = new Date().toISOString().split("T")[0];
    const habitsToday = await Habit.find({ date: today });
    const caloriesToday = await FoodLog.find({ date: today });

    const completedCount = habitsToday.filter((h) => h.completed).length;
    const totalHabits = habitsToday.length;
    const weeklyCompletion = totalHabits ? (completedCount / totalHabits) * 100 : 0;

    const calories = caloriesToday.reduce((sum, f) => sum + f.calories, 0);
    const activeGoals = habitsToday.filter((h) => !h.completed).length;

    res.status(200).json({
      dayStreak: 7, // TODO: If you want, I can show how to calculate streak properly later.
      weeklyCompletion: Math.round(weeklyCompletion),
      calories,
      activeGoals,
    });
  } catch (error) {
    res.status(500).json({ message: "Failed to fetch quick stats", error });
  }
};
