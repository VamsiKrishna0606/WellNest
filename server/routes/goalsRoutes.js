import express from "express";
import { createOrUpdateGoals, getUserGoals } from "../controllers/goalsController.js";
import { verifyToken } from "../middleware/authMiddleware.js";

const router = express.Router();

router.post("/", verifyToken, createOrUpdateGoals);
router.get("/", verifyToken, getUserGoals);

export default router;
