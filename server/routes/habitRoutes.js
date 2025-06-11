const express = require("express");
const router = express.Router();
const Habit = require("../models/Habit");
const auth = require("../middleware/authMiddleware");

// GET all habits for a user
router.get("/", auth, async (req, res) => {
  const habits = await Habit.find({ userId: req.userId });
  res.json(habits);
});

// POST a new habit
router.post("/", auth, async (req, res) => {
  const { name } = req.body;
  const newHabit = new Habit({ name, userId: req.userId });
  await newHabit.save();
  res.json(newHabit);
});

module.exports = router;
