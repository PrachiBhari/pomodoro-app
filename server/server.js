import express from "express";
import dotenv from "dotenv";
import cors from "cors";
import helmet from "helmet";
import connectDB from "./config/db.js";
import authRoutes from "./routes/authRoutes.js";
import sessionRoutes from "./routes/sessionRoutes.js";
import taskRoutes from "./routes/taskRoutes.js";

dotenv.config();
connectDB();

const app = express();

// --- CORS: whitelist your frontend ---
const allowedOrigins = [
  process.env.CLIENT_URL,      // e.g. https://your-frontend.netlify.app
  "http://localhost:5173",     // Vite dev
].filter(Boolean);

app.use(cors({
  origin(origin, cb) {
    if (!origin) return cb(null, true);              // Postman / server-to-server
    if (allowedOrigins.includes(origin)) return cb(null, true);
    return cb(new Error("Not allowed by CORS"));
  },
}));

// --- Basic hardening + parsing ---
app.use(helmet());
app.use(express.json({ limit: "1mb" }));

// --- Healthcheck ---
app.get("/api/health", (req, res) => {
  res.json({ ok: true, env: process.env.NODE_ENV || "development" });
});

// --- Routes ---
app.use("/api/auth", authRoutes);
app.use("/api/sessions", sessionRoutes);
app.use("/api/tasks", taskRoutes);

// --- 404 fallback ---
app.use((req, res) => {
  res.status(404).json({ message: "Route not found" });
});

// --- Error handler (prevents HTML error pages) ---
app.use((err, req, res, next) => {
  console.error("Server error:", err?.message);
  res.status(500).json({ message: err?.message || "Server error" });
});

console.log("JWT_SECRET loaded:", process.env.JWT_SECRET ? "✅" : "❌");

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`✅ Server running on port ${PORT}`));
