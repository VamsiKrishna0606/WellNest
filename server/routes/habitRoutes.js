import express from "express";
import {
  getAllHabits,
  createHabit,
  deleteHabit,
  updateHabitCompletion,
} from "../controllers/habitController.js";

const router = express.Router();

router.get("/", getAllHabits);
router.post("/", createHabit);
router.delete("/:id", deleteHabit);
router.patch("/:id", updateHabitCompletion);

export default router;
