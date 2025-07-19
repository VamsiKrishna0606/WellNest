import UserGoals from "../models/UserGoals.js";

export const createOrUpdateGoals = async (req, res) => {
  try {
    const {
      dailySteps,
      dailyCalories,
      weeklyWorkouts,
      weightGoal,
      sleepHours,
      hydrationLiters,
      customGoals,
      preferredUnits
    } = req.body;

    if (
      dailySteps < 0 ||
      dailyCalories < 0 ||
      weeklyWorkouts < 0 ||
      weightGoal < 0 ||
      sleepHours < 0 ||
      hydrationLiters < 0
    ) {
      return res.status(400).json({ error: "Goal values cannot be negative." });
    }

    const existing = await UserGoals.findOne({ userId: req.user.id });

    if (existing) {
      existing.dailySteps = dailySteps;
      existing.dailyCalories = dailyCalories;
      existing.weeklyWorkouts = weeklyWorkouts;
      existing.weightGoal = weightGoal;
      existing.sleepHours = sleepHours;
      existing.hydrationLiters = hydrationLiters;
      existing.customGoals = customGoals;
      existing.preferredUnits = preferredUnits;
      await existing.save();
      return res.json(existing);
    }

    const newGoals = await UserGoals.create({
      userId: req.user.id,
      dailySteps,
      dailyCalories,
      weeklyWorkouts,
      weightGoal,
      sleepHours,
      hydrationLiters,
      customGoals,
      preferredUnits,
    });
    res.status(201).json(newGoals);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

export const getUserGoals = async (req, res) => {
  try {
    const goals = await UserGoals.findOne({ userId: req.user.id });
    res.json(goals);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};
