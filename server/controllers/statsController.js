import Habit from "../models/Habit.js";
import FoodLog from "../models/FoodLog.js";
import UserGoals from "../models/UserGoals.js";
import User from "../models/User.js";
import { getUserTimezoneRange } from "../utils/dateHelpers.js";

export const getStats = async (req, res) => {
  try {
    const user = await User.findById(req.user.id);
    const timezone = user.timezone;
    const { start: today, end: tomorrow } = getUserTimezoneRange(new Date(), timezone);

    const todayISO = today.toISOString().split("T")[0];

    const habits = (await Habit.find({ userId: user._id })) || [];
    const userGoals = await UserGoals.findOne({ userId: user._id });
    const dailyCaloriesGoal = userGoals?.calories || 2000;

    const todayHabits = habits.filter((h) => {
      const start = new Date(h.startDate).toISOString().split("T")[0];
      const end = h.endDate ? new Date(h.endDate).toISOString().split("T")[0] : null;
      if (!end) return todayISO >= start;
      return todayISO >= start && todayISO <= end;
    });

    const totalHabitsToday = todayHabits.length;

    const completedHabitsToday = todayHabits.filter((h) =>
      h.completedDates.some(
        (date) => new Date(date).toISOString().split("T")[0] === todayISO
      )
    ).length;

    const habitsPercent = totalHabitsToday
      ? Math.round((completedHabitsToday / totalHabitsToday) * 100)
      : 0;

    const foodLogsToday = await FoodLog.find({
      userId: user._id,
      date: { $gte: today, $lt: tomorrow },
    });

    const caloriesToday = foodLogsToday.reduce(
      (total, log) => total + (log.calories || 0),
      0
    );

    const caloriesPercent = dailyCaloriesGoal
      ? Math.round(
          (Math.min(caloriesToday, dailyCaloriesGoal) / dailyCaloriesGoal) * 100
        )
      : 0;

    const todayGoalPercent = Math.round((habitsPercent + caloriesPercent) / 2);

    const completedDatesSet = new Set();
    habits.forEach((habit) => {
      habit.completedDates.forEach((date) => {
        completedDatesSet.add(new Date(date).toISOString().split("T")[0]);
      });
    });

    const datesArray = Array.from(completedDatesSet).sort();
    let streakCount = 0;
    for (let i = datesArray.length - 1; i >= 0; i--) {
      const dateStr = datesArray[i];
      const dateObj = new Date(dateStr);
      dateObj.setHours(0, 0, 0, 0);
      const daysAgo = Math.floor((today - dateObj) / (1000 * 60 * 60 * 24));
      if (daysAgo === streakCount) {
        streakCount++;
      } else {
        break;
      }
    }

    res.json({
      streak: streakCount,
      caloriesToday,
      todayGoalPercent,
      habitsHit: `${completedHabitsToday} / ${totalHabitsToday}`,
    });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};
