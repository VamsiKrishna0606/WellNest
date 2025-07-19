import express from "express";
import { getQuickStats } from "../controllers/statsController.js";
import { verifyToken } from "../middleware/authMiddleware.js";
import mongoose from "mongoose";

const router = express.Router();

router.get("/", verifyToken, getQuickStats);

export default router;
