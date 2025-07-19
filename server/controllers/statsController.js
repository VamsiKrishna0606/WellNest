import FoodLog from "../models/FoodLog.js";
import Habit from "../models/Habit.js";
import Journal from "../models/Journal.js";
import mongoose from "mongoose";

const calculateJournalStreak = (journalDates) => {
  const sortedDates = journalDates.map(date => new Date(date.date)).sort((a, b) => b - a);
  let streak = 0;
  let currentDate = new Date();
  currentDate.setHours(0, 0, 0, 0);

  for (const date of sortedDates) {
    const journalDate = new Date(date.date);
    journalDate.setHours(0, 0, 0, 0);

    if (currentDate.getTime() === journalDate.getTime()) {
      streak++;
      currentDate.setDate(currentDate.getDate() - 1);
    } else if (currentDate.getTime() - journalDate.getTime() === 86400000) {
      streak++;
      currentDate.setDate(currentDate.getDate() - 1);
    } else {
      break;
    }
  }

  return streak;
};

export const getQuickStats = async (req, res) => {
  try {
    const userId = req.user.id;

    const totalCalories = await FoodLog.aggregate([
      { $match: { userId: new mongoose.Types.ObjectId(userId) } },
      { $group: { _id: null, total: { $sum: "$calories" } } },
    ]);

    const calories = totalCalories[0]?.total || 0;
    const habitCount = await Habit.countDocuments({ userId });
    const journalCount = await Journal.countDocuments({ userId });

    const journalDates = await Journal.find({ userId }, "date");

    const streak = calculateJournalStreak(journalDates);

    res.json({
      totalCalories: calories,
      totalHabits: habitCount,
      totalJournals: journalCount,
      journalStreak: streak,
    });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};
