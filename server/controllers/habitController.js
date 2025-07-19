import Habit from "../models/Habit.js";

export const createHabit = async (req, res) => {
  try {
    const {
      name,
      frequency,
      times,
      unit,
      reminderTime,
      enableReminder,
      startDate,
      endDate,
      createdDate,
      emoji,
    } = req.body;

    if (!name || times < 1) {
      return res.status(400).json({
        error: "Invalid input: name required, times must be at least 1.",
      });
    }

    const newHabit = await Habit.create({
      userId: req.user.id,
      name,
      frequency,
      times,
      unit,
      reminderTime,
      enableReminder,
      startDate,
      endDate,
      createdDate,
      emoji,
    });

    res.status(201).json(newHabit);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

export const getUserHabits = async (req, res) => {
  try {
    const habits = await Habit.find({ userId: req.user.id });
    res.json(habits);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

export const updateHabitCompletion = async (req, res) => {
  try {
    const habitId = req.params.id;
    const habit = await Habit.findOne({ _id: habitId, userId: req.user.id });

    if (!habit) return res.status(404).json({ error: "Habit not found." });

    habit.isCompleted = !habit.isCompleted;
    habit.completedAt = habit.isCompleted ? new Date() : null;

    await habit.save();
    res.json(habit);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

export const deleteHabit = async (req, res) => {
  try {
    await Habit.findOneAndDelete({ _id: req.params.id, userId: req.user.id });
    res.json({ message: "Habit deleted." });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};
