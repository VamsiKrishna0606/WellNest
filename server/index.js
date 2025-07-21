import dotenv from "dotenv";
dotenv.config();

import express from "express";
import mongoose from "mongoose";
import cors from "cors";

import authRoutes from "./routes/authRoutes.js";
import protectedRoutes from "./routes/protectedRoutes.js";
import habitRoutes from "./routes/habitRoutes.js";
import foodRoutes from "./routes/foodRoutes.js";
import journalRoutes from "./routes/journalRoutes.js";
import statsRoutes from "./routes/statsRoutes.js";
import goalsRoutes from "./routes/goalsRoutes.js";
import analyticsRoutes from "./routes/analyticsRoutes.js";
import chatbotRoutes from "./routes/chatbotRoutes.js";


const app = express();
app.use(express.json());
app.use(cors());
app.use("/api/auth", authRoutes);
app.use("/api/protected", protectedRoutes);
app.use("/api/habits", habitRoutes);
app.use("/api/food", foodRoutes);
app.use("/api/journal", journalRoutes);
app.use("/api/stats", statsRoutes);
app.use("/api/goals", goalsRoutes);
app.use("/api/stats", statsRoutes);
app.use("/api/analytics", analyticsRoutes);
app.use("/api/chatbot", chatbotRoutes);


mongoose
  .connect(process.env.MONGO_URI)
  .then(() => {
    console.log("✅ MongoDB Connected Successfully");
    app.listen(process.env.PORT, () => {
      console.log(`✅ Server running on port ${process.env.PORT}`);
    });
  })
  .catch((err) => console.log("MongoDB Connection Error:", err));
