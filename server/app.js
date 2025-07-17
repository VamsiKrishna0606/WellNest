import express from "express";
import mongoose from "mongoose";
import cors from "cors";
import dotenv from "dotenv";
import habitRoutes from "./routes/habitRoutes.js"; // Correct import
import foodRoutes from "./routes/foodRoutes.js";
import journalRoutes from "./routes/journalRoutes.js";
import goalRoutes from "./routes/goalRoutes.js";

dotenv.config();

const app = express();
app.use(cors());
app.use(express.json());
// Important for POST body to work

mongoose
  .connect(process.env.MONGO_URI)
  .then(() => console.log("✅ MongoDB Connected"))
  .catch((err) => console.log("❌ MongoDB Error:", err));

// Correct route
app.use("/api/habits", habitRoutes);
app.use("/api/foodlogs", foodRoutes);
app.use("/api/journals", journalRoutes);
app.use('/api/goals', goalRoutes);

app.listen(process.env.PORT, () => {
  console.log(`✅ Server running on port ${process.env.PORT}`);
});
