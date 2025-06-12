// server/middleware/authMiddleware.js
const jwt = require("jsonwebtoken");

const authMiddleware = (req, res, next) => {
  console.log("🛡️ authMiddleware triggered");

  const token = req.headers.authorization?.split(" ")[1];
  if (!token) {
    console.log("❌ No token found");
    return res.status(401).json({ msg: "No token, access denied" });
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.userId = decoded.id; // 👈 depends on what field you use during jwt.sign()
    console.log("✅ User ID from token:", req.userId);
    next();
  } catch (err) {
    console.error("❌ Invalid token", err.message);
    return res.status(401).json({ msg: "Invalid token" });
  }
};

module.exports = authMiddleware;
