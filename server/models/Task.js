import mongoose from "mongoose";

const TaskSchema = new mongoose.Schema(
  {
    user:   { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true, index: true },
    title:  { type: String, required: true, trim: true },
    status: { type: String, enum: ["todo", "done"], default: "todo" },
    category: { type: String, default: "" },
    totalMs: { type: Number, default: 0 }, // accumulated focus time (ms)
    isArchived: { type: Boolean, default: false },
  },
  { timestamps: true }
);

export default mongoose.model("Task", TaskSchema);
