import express from "express";
import { getQuickStats } from "../controllers/statsController.js";

const router = express.Router();

router.get("/", getQuickStats);

export default router;
