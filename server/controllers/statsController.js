import Habit from "../models/Habit.js";
import FoodLog from "../models/FoodLog.js";
import UserGoals from "../models/UserGoals.js";

export const getStats = async (req, res) => {
  try {
    const userId = req.user.id;
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    const tomorrow = new Date(today);
    tomorrow.setDate(today.getDate() + 1);

    const todayISO = today.toLocaleDateString("en-CA");

    // ✅ Fetch Data
    const habits = (await Habit.find({ userId })) || [];
    const userGoals = await UserGoals.findOne({ userId });
    const dailyCaloriesGoal = userGoals?.calories || 2000;

    // ✅ Filter only habits created today, EXACTLY like your UI
    const todayHabits = habits.filter((h) => h.createdDate === todayISO);

    const totalHabitsToday = todayHabits.length;

    const completedHabitsToday = todayHabits.filter((h) =>
      h.completedDates.some(
        (date) =>
          new Date(date).toLocaleDateString("en-CA") === todayISO
      )
    ).length;

    const habitsPercent = totalHabitsToday
      ? Math.round((completedHabitsToday / totalHabitsToday) * 100)
      : 0;

    // ✅ Today's Calories
    const foodLogsToday = await FoodLog.find({
      userId,
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

    // ✅ Today's Goal % — avg of habits and calories
    const todayGoalPercent = Math.round((habitsPercent + caloriesPercent) / 2);

    // ✅ Streak (leave this as is)
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

    // ✅ Response
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
