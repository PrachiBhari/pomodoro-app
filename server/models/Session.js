import mongoose from "mongoose";

const sessionSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    taskName: {
      type: String,
      default: "Untitled Task",
    },
    duration: {
      type: Number, // in minutes
      required: true,
    },
    mode: {
      type: String,
      enum: ["work", "break"],
      default: "work",
    },
    date: {
      type: Date,
      default: Date.now,
    },
  },
  { timestamps: true }
);

export default mongoose.model("Session", sessionSchema);
