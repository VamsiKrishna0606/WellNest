const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const dotenv = require('dotenv');
const authRoutes = require('./routes/auth');
const habitRoutes = require('./routes/habitRoutes');
const foodRoutes = require('./routes/foodRoutes');

dotenv.config();

const app = express();

app.use(cors());
app.use(express.json());

// ✅ CONNECT TO MONGODB
mongoose.connect(process.env.MONGO_URI)
  .then(() => console.log("✅ MongoDB connected"))
  .catch(err => console.error("❌ MongoDB connection error:", err));

// ✅ ROUTES
app.use('/api/auth', authRoutes);
app.use('/api/habits', habitRoutes);
app.use('/api/food', foodRoutes);

// ✅ START SERVER
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`🚀 Server running on port ${PORT}`));
