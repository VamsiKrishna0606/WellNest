import Habit from "../models/Habit.js";
import FoodLog from "../models/FoodLog.js";
import UserGoals from "../models/UserGoals.js";

function getDaysInMonth(year, month) {
  return new Date(year, month + 1, 0).getDate();
}

// ---------------- DAILY ----------------
export const getDailyAnalytics = async (req, res) => {
  const userId = req.user.id;
  const today = new Date();
  const monday = new Date(today);
  monday.setDate(today.getDate() - today.getDay() + 1);
  monday.setHours(0, 0, 0, 0);

  const days = Array.from({ length: 7 }).map((_, i) => {
    const d = new Date(monday);
    d.setDate(monday.getDate() + i);
    return d.toISOString().split("T")[0];
  });

  const habits = await Habit.find({ userId });
  const foodLogs = await FoodLog.find({ userId });

  const data = days.map((dateStr) => {
    const dateObj = new Date(dateStr);
    const totalHabits = habits.filter(
      (h) =>
        new Date(h.startDate) <= dateObj &&
        (!h.endDate || new Date(h.endDate) >= dateObj)
    ).length;
    const completedHabits = habits.filter((h) =>
      h.completedDates.some(
        (d) => new Date(d).toISOString().split("T")[0] === dateStr
      )
    ).length;
    const calories = foodLogs
      .filter((log) => log.date.toISOString().split("T")[0] === dateStr)
      .reduce((acc, log) => acc + (log.calories || 0), 0);
    return {
      date: dateStr,
      habitsPercent: totalHabits ? (completedHabits / totalHabits) * 100 : 0,
      calories,
      active: completedHabits > 0 || calories > 0,
    };
  });

  const activeDays = data.filter((d) => d.active).length;
  const totalCompleted = data.reduce((acc, d) => acc + d.habitsPercent, 0);
  const totalCalories = data.reduce((acc, d) => acc + d.calories, 0);

  res.json({
    labels: days.map((d) => d.split("-")[2]),
    datasets: data.map((d) => ({
      date: d.date.split("-")[2],
      habitsPercent: d.habitsPercent,
      calories: d.calories,
    })),
    totalCalories,
    activeDays,
    avgCompletion: Math.round(totalCompleted / (days.length || 1)),
    totalProtein: foodLogs.reduce((acc, log) => acc + (log.protein || 0), 0),
    totalCarbs: foodLogs.reduce((acc, log) => acc + (log.carbs || 0), 0),
    totalFats: foodLogs.reduce((acc, log) => acc + (log.fats || 0), 0),
  });
};

// ---------------- MONTHLY ----------------
export const getMonthlyAnalytics = async (req, res) => {
  const userId = req.user.id;
  const today = new Date();
  const year = today.getFullYear();
  const month = today.getMonth();
  const daysInMonth = getDaysInMonth(year, month);

  const days = Array.from({ length: daysInMonth }).map((_, i) => {
    const d = new Date(year, month, i + 1);
    return d.toISOString().split("T")[0];
  });

  const habits = await Habit.find({ userId });
  const foodLogs = await FoodLog.find({ userId });

  const data = days.map((dateStr) => {
    const dateObj = new Date(dateStr);
    const totalHabits = habits.filter(
      (h) =>
        new Date(h.startDate) <= dateObj &&
        (!h.endDate || new Date(h.endDate) >= dateObj)
    ).length;
    const completedHabits = habits.filter((h) =>
      h.completedDates.some(
        (d) => new Date(d).toISOString().split("T")[0] === dateStr
      )
    ).length;
    const calories = foodLogs
      .filter((log) => log.date.toISOString().split("T")[0] === dateStr)
      .reduce((acc, log) => acc + (log.calories || 0), 0);
    return {
      date: dateStr,
      habitsPercent: totalHabits ? (completedHabits / totalHabits) * 100 : 0,
      calories,
      active: completedHabits > 0 || calories > 0,
    };
  });

  const activeDays = data.filter((d) => d.active).length;
  const totalCompleted = data.reduce((acc, d) => acc + d.habitsPercent, 0);
  const totalCalories = data.reduce((acc, d) => acc + d.calories, 0);

  res.json({
    labels: days.map((d) => d.split("-")[2]),
    datasets: data.map((d) => ({
      date: d.date.split("-")[2],
      habitsPercent: d.habitsPercent,
      calories: d.calories,
    })),
    totalCalories,
    activeDays,
    avgCompletion: Math.round(totalCompleted / (days.length || 1)),
  });
};

// ---------------- YEARLY ----------------
export const getYearlyAnalytics = async (req, res) => {
  const userId = req.user.id;
  const months = Array.from({ length: 12 }).map((_, i) => i);
  const habits = await Habit.find({ userId });
  const foodLogs = await FoodLog.find({ userId });

  const data = months.map((monthIdx) => {
    const daysInMonth = getDaysInMonth(new Date().getFullYear(), monthIdx);
    let completed = 0;
    let total = 0;
    let calories = 0;

    for (let day = 1; day <= daysInMonth; day++) {
      const date = new Date(new Date().getFullYear(), monthIdx, day);
      const dateStr = date.toISOString().split("T")[0];
      const totalHabits = habits.filter(
        (h) =>
          new Date(h.startDate) <= date &&
          (!h.endDate || new Date(h.endDate) >= date)
      ).length;
      const completedHabits = habits.filter((h) =>
        h.completedDates.some(
          (d) => new Date(d).toISOString().split("T")[0] === dateStr
        )
      ).length;
      calories += foodLogs
        .filter((log) => log.date.toISOString().split("T")[0] === dateStr)
        .reduce((acc, log) => acc + (log.calories || 0), 0);
      total += totalHabits;
      completed += completedHabits;
    }

    return {
      month: monthIdx,
      habitsPercent: total ? (completed / total) * 100 : 0,
      calories,
      active: completed > 0 || calories > 0,
    };
  });

  const activeDays = data.filter((d) => d.active).length;

  res.json({
    labels: [
      "Jan",
      "Feb",
      "Mar",
      "Apr",
      "May",
      "Jun",
      "Jul",
      "Aug",
      "Sep",
      "Oct",
      "Nov",
      "Dec",
    ],
    datasets: data.map((d, idx) => ({
      month: [
        "Jan",
        "Feb",
        "Mar",
        "Apr",
        "May",
        "Jun",
        "Jul",
        "Aug",
        "Sep",
        "Oct",
        "Nov",
        "Dec",
      ][idx],
      habitsPercent: d.habitsPercent,
      calories: d.calories,
    })),
    totalCalories: data.reduce((acc, d) => acc + d.calories, 0),
    activeDays,
    avgCompletion: Math.round(
      data.reduce((acc, d) => acc + d.habitsPercent, 0) / 12
    ),
  });
};

// ---------------- SUMMARY ----------------
export const getSummaryForDate = async (req, res) => {
  const userId = req.user.id;
  const dateStr = req.query.date;
  const dateObj = new Date(dateStr);
  dateObj.setHours(0, 0, 0, 0);
  const tomorrow = new Date(dateObj);
  tomorrow.setDate(dateObj.getDate() + 1);

  const habits = await Habit.find({ userId });
  const foodLogs = await FoodLog.find({
    userId,
    date: { $gte: dateObj, $lt: tomorrow },
  });
  const userGoals = await UserGoals.findOne({ userId });
  const caloriesGoal = userGoals?.calories || 2000;

  const activeHabits = habits.filter(
    (h) =>
      new Date(h.startDate) <= dateObj &&
      (!h.endDate || new Date(h.endDate) >= dateObj)
  );

  const completedHabits = activeHabits.filter((h) =>
    h.completedDates.some(
      (d) => new Date(d).toISOString().split("T")[0] === dateStr
    )
  );

  const habitsPercent = activeHabits.length
    ? Math.round((completedHabits.length / activeHabits.length) * 100)
    : 0;

  const caloriesToday = foodLogs.reduce(
    (total, log) => total + (log.calories || 0),
    0
  );
  const totalProtein = foodLogs.reduce(
    (acc, log) => acc + (log.protein || 0),
    0
  );
  const totalCarbs = foodLogs.reduce((acc, log) => acc + (log.carbs || 0), 0);
  const totalFats = foodLogs.reduce((acc, log) => acc + (log.fats || 0), 0);

  res.json({
    date: dateStr,
    habitsCompleted: habitsPercent,
    caloriesConsumed: caloriesToday,
    caloriesGoal,
    allCompleted: habitsPercent === 100 && caloriesToday <= caloriesGoal,
    habitsList: activeHabits,
    foodList: foodLogs,
    totalProtein,
    totalCarbs,
    totalFats,
  });
};
