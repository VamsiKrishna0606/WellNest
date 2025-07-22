import User from "../models/User.js";
import UserGoals from "../models/UserGoals.js";
import Habit from "../models/Habit.js";
import FoodLog from "../models/FoodLog.js";
import Journal from "../models/Journal.js";
import { askGPT } from "../utils/gpt.js";
import { getUserTimezoneRange } from "../utils/dateHelpers.js";

const analyzeMood = (journals) => {
  if (!journals.length) return "No entries yet";
  const recent = journals
    .slice(-5)
    .map((j) => j.entry.toLowerCase())
    .join(" ");
  if (/happy|grateful|calm|motivated|relaxed/.test(recent)) return "Positive";
  if (/tired|stressed|anxious|angry|down/.test(recent)) return "Negative";
  return "Neutral";
};

export const chatWithAssistant = async (req, res) => {
  const userId = req.user.id;
  const { message } = req.body;

  try {
    const user = await User.findById(userId);
    const timezone = user.timezone;
    const { start: todayStart, end: tomorrowStart } = getUserTimezoneRange(new Date(), timezone);

    const goals = await UserGoals.findOne({ userId });
    const habits = await Habit.find({ userId });
    const foodLogs = await FoodLog.find({ userId }).sort({ date: -1 });
    const journals = await Journal.find({ userId });

    const todayLogs = foodLogs.filter((f) => f.date >= todayStart && f.date < tomorrowStart);

    const sevenDaysAgo = new Date(todayStart);
    sevenDaysAgo.setUTCDate(todayStart.getUTCDate() - 6);
    const weeklyLogs = foodLogs.filter((f) => f.date >= sevenDaysAgo && f.date < tomorrowStart);

    const currentMonth = todayStart.getUTCMonth();
    const monthlyLogs = foodLogs.filter((f) => f.date.getUTCMonth() === currentMonth);

    const thisMonthCalories = monthlyLogs.reduce((acc, log) => acc + (log.calories || 0), 0);
    const lastMonth = new Date(todayStart);
    lastMonth.setUTCMonth(lastMonth.getUTCMonth() - 1);
    const lastMonthCalories = foodLogs
      .filter((f) => f.date.getUTCMonth() === lastMonth.getUTCMonth())
      .reduce((acc, log) => acc + (log.calories || 0), 0);

    const weeklyCalories = weeklyLogs.reduce((acc, log) => acc + (log.calories || 0), 0);
    const todayCalories = todayLogs.reduce((acc, log) => acc + (log.calories || 0), 0);

    const todayStr = todayStart.toISOString().split("T")[0];
    const todayCompletedHabits = habits.filter((h) => h.completedDates.includes(todayStr)).length;
    const totalHabits = habits.length;

    const mood = analyzeMood(journals);
    const journalKeywords = journals
      .slice(-5)
      .map((j) => j.entry.split(" ").slice(0, 3).join(" "))
      .join("; ");

    const context = `
User Info:
- Name: ${user.username}
- Age: ${user.age || "Not set"}, Weight: ${user.weight || "Not set"}, Height: ${user.height || "Not set"}
- Fitness Level: ${user.fitnessLevel || "Not set"}
- Goal: ${user.goal || "Not set"}

Goals:
- Daily Calories: ${goals?.dailyCalories || "Not set"}
- Daily Steps: ${goals?.dailySteps || "Not set"}
- Hydration Goal: ${goals?.hydrationGoal || "Not set"}

Today's Summary:
- Calories Consumed: ${todayCalories}
- Habits Completed: ${todayCompletedHabits} / ${totalHabits}
- Mood: ${mood}
- Recent Journal Keywords: ${journalKeywords}

Weekly Summary:
- Total Calories: ${weeklyCalories}
- Active Days (meals logged / habits completed): Approx ${weeklyLogs.length} days

Monthly Comparison:
- This Month Calories: ${thisMonthCalories}
- Last Month Calories: ${lastMonthCalories}

Yearly: No need, data not detailed enough.

Instructions:
- If user asks about improvement, compare this month to last month.
- If user asks about calories, hydration, steps, answer from this context.
- If user asks casually, reply friendly, chill, human-like.
- Do NOT invent any numbers not given here.
`;

    const prompt = [
      {
        role: "system",
        content: "You are WellNest, a human-like wellness AI coach. Be short, helpful, friendly.",
      },
      {
        role: "user",
        content: `Here is my data:\n${context}\n\nQuestion: ${message}`,
      },
    ];

    const gptResponse = await askGPT(prompt);
    res.json({ reply: gptResponse });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Chatbot error." });
  }
};
