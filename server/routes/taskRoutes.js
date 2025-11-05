import express from "express";
import Task from "../models/Task.js";
import { verifyToken } from "../middleware/authMiddleware.js";

const router = express.Router();

// GET /api/tasks
router.get("/", verifyToken, async (req, res) => {
  const tasks = await Task.find({ user: req.user.id, isArchived: false }).sort("-createdAt");
  res.json(tasks);
});

// POST /api/tasks
router.post("/", verifyToken, async (req, res) => {
  const { title, category = "", status = "todo" } = req.body;
  if (!title?.trim()) return res.status(400).json({ message: "Title required" });
  const task = await Task.create({ user: req.user.id, title: title.trim(), category, status });
  res.status(201).json(task);
});

// PATCH /api/tasks/:id
router.patch("/:id", verifyToken, async (req, res) => {
  const t = await Task.findOneAndUpdate(
    { _id: req.params.id, user: req.user.id },
    req.body,
    { new: true }
  );
  if (!t) return res.status(404).json({ message: "Task not found" });
  res.json(t);
});

// DELETE /api/tasks/:id
router.delete("/:id", verifyToken, async (req, res) => {
  const t = await Task.findOneAndUpdate(
    { _id: req.params.id, user: req.user.id },
    { isArchived: true },
    { new: true }
  );
  if (!t) return res.status(404).json({ message: "Task not found" });
  res.json({ ok: true });
});

// POST /api/tasks/:id/inc-time  (increment totalMs safely)
router.post("/:id/inc-time", verifyToken, async (req, res) => {
  const { ms = 0 } = req.body;
  const t = await Task.findOneAndUpdate(
    { _id: req.params.id, user: req.user.id },
    { $inc: { totalMs: Math.max(0, Math.floor(ms)) } },
    { new: true }
  );
  if (!t) return res.status(404).json({ message: "Task not found" });
  res.json(t);
});

export default router;
