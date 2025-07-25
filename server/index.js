import dotenv from "dotenv";
dotenv.config();

import express from "express";
import mongoose from "mongoose";
import cors from "cors";

// Route imports
import authRoutes from "./routes/authRoutes.js";
import habitRoutes from "./routes/habitRoutes.js";
import foodRoutes from "./routes/foodRoutes.js";
import journalRoutes from "./routes/journalRoutes.js";
import statsRoutes from "./routes/statsRoutes.js";
import goalsRoutes from "./routes/goalsRoutes.js";
import analyticsRoutes from "./routes/analyticsRoutes.js";
import chatbotRoutes from "./routes/chatbotRoutes.js";

const app = express();
app.use(express.json());

// ✅ CORS - updated cleanly
app.use(
  cors({
    origin: [
      "http://localhost:5173",
      "http://localhost:8080",
      "http://localhost:8081",
      "https://well-nest-eta.vercel.app",
      "https://well-nest-gx1f2xdnh-vamsi-krishnas-projects-67b52aa7.vercel.app",
      "https://well-nest-three.vercel.app",
    ],
    credentials: true,
  })
);

// API routes
app.use("/api/auth", authRoutes);
app.use("/api/habits", habitRoutes);
app.use("/api/food", foodRoutes);
app.use("/api/journal", journalRoutes);
app.use("/api/stats", statsRoutes);
app.use("/api/goals", goalsRoutes);
app.use("/api/analytics", analyticsRoutes);
app.use("/api/chatbot", chatbotRoutes);

// MongoDB connection
mongoose
  .connect(process.env.MONGO_URI)
  .then(() => {
    console.log("✅ MongoDB Connected Successfully");
    app.listen(process.env.PORT, () => {
      console.log(`✅ Server running on port ${process.env.PORT}`);
    });
  })
  .catch((err) => console.error("❌ MongoDB Connection Error:", err));
