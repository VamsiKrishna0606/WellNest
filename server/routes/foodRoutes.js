const express = require("express");
const router = express.Router();
const FoodLog = require("../models/FoodLog");
const auth = require("../middleware/authMiddleware");

// GET food logs for a user
router.get("/", auth, async (req, res) => {
  const logs = await FoodLog.find({ userId: req.userId });
  res.json(logs);
});

// POST new food entry
router.post("/", auth, async (req, res) => {
  const { name, calories } = req.body;
  const newEntry = new FoodLog({ name, calories, userId: req.userId });
  await newEntry.save();
  res.json(newEntry);
});

module.exports = router;
