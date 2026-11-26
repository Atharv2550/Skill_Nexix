const mongoose = require("mongoose");

const VALID_STATUSES = ["Pending", "In Progress", "Completed"];
const VALID_PRIORITIES = ["Low", "Medium", "High"];

const taskSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: [true, "Task title is required"],
      trim: true,
      maxlength: [150, "Title cannot exceed 150 characters"],
    },
    description: {
      type: String,
      trim: true,
      default: "",
      maxlength: [2000, "Description cannot exceed 2000 characters"],
    },
    status: {
      type: String,
      enum: {
        values: VALID_STATUSES,
        message: "Status must be Pending, In Progress, or Completed",
      },
      default: "Pending",
    },
    priority: {
      type: String,
      enum: {
        values: VALID_PRIORITIES,
        message: "Priority must be Low, Medium, or High",
      },
      default: "Medium",
    },
    dueDate: {
      type: Date,
      default: null,
    },
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
  },
  {
    timestamps: true,
  }
);

module.exports = {
  Task: mongoose.model("Task", taskSchema),
  VALID_STATUSES,
  VALID_PRIORITIES,
};

