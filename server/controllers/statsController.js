import Habit from "../models/Habit.js";
import FoodLog from "../models/FoodLog.js";

export const getStats = async (req, res) => {
  try {
    const userId = req.user.id;
    const today = new Date();
    const todayIST = new Date().toLocaleDateString("en-CA");
    today.setHours(0, 0, 0, 0);
    const todayISO = today.toISOString().split("T")[0];

    // --------- Fetch Habits & Food Logs ---------
    const habits = (await Habit.find({ userId })) || [];
    const foodLogs =
      (await FoodLog.find({ userId, date: { $gte: today } })) || [];

    // --------- Streak Calculation ---------
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

    // --------- Calories Today ---------
    const caloriesToday = foodLogs.reduce(
      (total, log) => total + (log.calories || 0),
      0
    );

    // --------- Weekly Goal % ---------
    const startOfWeek = new Date(today);
    startOfWeek.setDate(today.getDate() - today.getDay());

    let weeklyCompleted = 0;
    let weeklyTotal = 0;

    habits.forEach((habit) => {
      const start = new Date(habit.startDate);
      const end = habit.endDate ? new Date(habit.endDate) : null;

      for (
        let d = new Date(startOfWeek);
        d <= today;
        d.setDate(d.getDate() + 1)
      ) {
        const dISO = d.toISOString().split("T")[0];
        if (start <= d && (!end || end >= d)) {
          weeklyTotal++;
          if (
            habit.completedDates.some(
              (date) => date.toISOString().split("T")[0] === dISO
            )
          ) {
            weeklyCompleted++;
          }
        }
      }
    });

    const weeklyGoalPercent = weeklyTotal
      ? Math.round((weeklyCompleted / weeklyTotal) * 100)
      : 0;

    // --------- Habits Hit Today (ONLY CREATED TODAY) ---------
    // --------- Habits Hit Today ---------
// --------- Habits Hit Today (Only Today's Created Habits) ---------
const todayHabits = habits.filter((h) => h.createdDate === todayIST);

const todayCompleted = todayHabits.filter((h) =>
  h.completedDates.some(
    (date) => new Date(date).toLocaleDateString("en-CA") === todayIST
  )
).length;


    // --------- Final Response ---------
    res.json({
      streak: streakCount,
      caloriesToday,
      weeklyGoalPercent,
      habitsHit: `${todayCompleted} / ${todayHabits.length}`,
    });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};
