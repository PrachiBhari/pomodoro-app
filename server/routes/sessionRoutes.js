import express from "express";
import Session from "../models/Session.js";
import { verifyToken } from "../middleware/authMiddleware.js";

const router = express.Router();

// ✅ Add new session
router.post("/", verifyToken, async (req, res) => {
  try {
    const { taskName, duration, mode } = req.body;
    const newSession = new Session({
      user: req.user.id,
      taskName,
      duration,
      mode,
    });
    await newSession.save();
    res.status(201).json({ message: "Session recorded successfully", session: newSession });
  } catch (error) {
    console.error("Error saving session:", error);
    res.status(500).json({ message: "Server error" });
  }
});

// ✅ Get all sessions for logged-in user
router.get("/", verifyToken, async (req, res) => {
  try {
    const sessions = await Session.find({ user: req.user.id }).sort({ createdAt: -1 });
    res.json(sessions);
  } catch (error) {
    console.error("Error fetching sessions:", error);
    res.status(500).json({ message: "Server error" });
  }
});

// ✅ Get daily total focus time
router.get("/summary/today", verifyToken, async (req, res) => {
  try {
    const start = new Date();
    start.setHours(0, 0, 0, 0);
    const end = new Date();
    end.setHours(23, 59, 59, 999);

    const sessions = await Session.find({
      user: req.user.id,
      date: { $gte: start, $lte: end },
    });

    const totalMinutes = sessions.reduce((sum, s) => sum + s.duration, 0);
    res.json({ totalMinutes, count: sessions.length });
  } catch (error) {
    console.error("Error calculating summary:", error);
    res.status(500).json({ message: "Server error" });
  }
});

router.get("/summary/week", verifyToken, async (req, res) => {
  try {
    const userId = req.user.id;
    const now = new Date();
    const from = new Date(now);
    from.setDate(now.getDate() - 6); // inclusive today - 6 days
    from.setHours(0,0,0,0);

    const docs = await Session.aggregate([
      { $match: { user: userId, mode: "work", date: { $gte: from } } },
      {
        $group: {
          _id: { $dateToString: { format: "%Y-%m-%d", date: "$date" } },
          minutes: { $sum: "$duration" }
        }
      },
      { $sort: { _id: 1 } }
    ]);

    res.json(docs); // [{ _id: '2025-11-05', minutes: 50 }, ...]
  } catch (e) {
    res.status(500).json({ message: e.message });
  }
});

export default router;
