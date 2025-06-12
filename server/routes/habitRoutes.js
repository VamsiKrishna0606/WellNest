const express = require('express');
const router = express.Router();
const Habit = require('../models/Habit');
const auth = require('../middleware/authMiddleware');

// GET all habits
router.get("/", auth, async (req, res) => {
  try {
    const habits = await Habit.find({ userId: req.userId });
    res.json(habits);
  } catch (err) {
    console.error("❌ GET /api/habits failed:", err);
    res.status(500).json({ msg: "Server error" });
  }
});

// POST new habit
router.post("/", auth, async (req, res) => {
  console.log("🔔 Habit POST hit");
  console.log("📦 Body:", req.body);
  console.log("👤 User ID:", req.userId);

  try {
    const { name } = req.body;
    if (!name) {
      console.log("❌ No habit name provided.");
      return res.status(400).json({ msg: "Habit name is required" });
    }

    const newHabit = new Habit({
      name,
      userId: req.userId,
    });

    const savedHabit = await newHabit.save();
    console.log("✅ Saved habit:", savedHabit);
    res.json(savedHabit);
  } catch (err) {
    console.error("🔥 POST /api/habits failed:", err);
    res.status(500).json({ msg: "Server error", error: err.message });
  }
});

module.exports = router;
