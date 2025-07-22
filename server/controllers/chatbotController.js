import Habit from "../models/Habit.js";
import FoodLog from "../models/FoodLog.js";
import Journal from "../models/Journal.js";
import UserGoals from "../models/UserGoals.js";
import { askGPT } from "../utils/gpt.js";

const analyzeMood = (journals) => {
  if (!journals.length) return "No entries yet";
  const recent = journals.slice(-5).map((j) => j.entry.toLowerCase()).join(" ");
  if (/happy|grateful|calm|motivated|relaxed/.test(recent)) return "Positive";
  if (/tired|stressed|anxious|angry|down/.test(recent)) return "Negative";
  return "Neutral";
};

export const chatWithAssistant = async (req, res) => {
  const userId = req.user.id;
  const { message, timeframe = "weekly" } = req.body;

  try {
    const isWellnessQuestion = (msg) => {
      const keywords = ["habit", "food", "calorie", "water", "step", "goal", "journal", "mood", "progress"];
      return keywords.some((word) => msg.toLowerCase().includes(word));
    };

    if (!isWellnessQuestion(message)) {
      const casualPrompt = [
        {
          role: "system",
          content: `You are WellNest, a friendly, human-like AI companion. You casually chat, make light jokes, and sound human. Don't lecture about health unless asked.`,
        },
        { role: "user", content: message },
      ];

      const casualResponse = await askGPT(casualPrompt);
      return res.json({ reply: casualResponse });
    }

    const habits = await Habit.find({ userId });
    const foodLogs = await FoodLog.find({ userId });
    const journals = await Journal.find({ userId });
    const goals = await UserGoals.findOne({ userId });

    const habitsAdded = habits.map((h) => h.name).join(", ") || "None";
    const completedHabitCount = habits.filter((h) => h.completedDates.length >= 3).map((h) => h.name);
    const missedHabitCount = habits.filter((h) => h.completedDates.length < 3).map((h) => h.name);
    const completionRate = habits.length
      ? Math.round((habits.reduce((acc, h) => acc + h.completedDates.length, 0) / (habits.length * 7)) * 100)
      : 0;

    const recentFoodLogs = foodLogs.slice(-7);
    const avgCalories = recentFoodLogs.length
      ? Math.round(recentFoodLogs.reduce((acc, f) => acc + (f.calories || 0), 0) / recentFoodLogs.length)
      : 0;
    const totalProtein = recentFoodLogs.reduce((acc, f) => acc + (f.protein || 0), 0);
    const totalCarbs = recentFoodLogs.reduce((acc, f) => acc + (f.carbs || 0), 0);
    const totalFats = recentFoodLogs.reduce((acc, f) => acc + (f.fats || 0), 0);
    const missedMeals = 7 - [...new Set(recentFoodLogs.map((f) => f.date.toISOString().split("T")[0]))].length;

    const waterGoal = goals?.water || 2;
    const stepsGoal = goals?.steps || 8000;
    const daysWithWater = recentFoodLogs.filter((f) => f.water >= waterGoal).length;
    const daysWithSteps = recentFoodLogs.filter((f) => f.steps >= stepsGoal).length;

    const mood = analyzeMood(journals);
    const keywords = journals.slice(-5).map((j) => j.entry.split(" ").slice(0, 3).join(" ")).join("; ");

    const userSummary = `
Wellness Overview (${timeframe}):
Habits:
- Added: ${habitsAdded}
- Consistently Completed: ${completedHabitCount.join(", ") || "None"}
- Frequently Missed: ${missedHabitCount.join(", ") || "None"}
- Completion Rate: ${completionRate}%

Food:
- Average Calories: ${avgCalories} kcal/day (Goal: ${goals?.calories || "Not set"})
- Macros: Protein ${totalProtein}g, Carbs ${totalCarbs}g, Fats ${totalFats}g over recent days
- Missed Meals: ${missedMeals} days without full meals logged

Hydration & Steps:
- Water Goal Hit: ${daysWithWater} / 7 days
- Steps Goal Hit: ${daysWithSteps} / 7 days

Journal Mood: ${mood}
Recent Journal Keywords: ${keywords}

User Question: ${message}
`;

    const wellnessPrompt = [
      {
        role: "system",
        content: `You are WellNest, a personalized AI wellness coach. When asked about health, habits, hydration, food, or wellness progress, give precise, realistic advice based on user data. Be supportive, brief, and human-like.`,
      },
      { role: "user", content: userSummary },
    ];

    const gptResponse = await askGPT(wellnessPrompt);
    res.json({ reply: gptResponse });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Something went wrong with the chatbot." });
  }
};
