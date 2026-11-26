const express = require("express");
const mongoose = require("mongoose");
const { Task, VALID_STATUSES, VALID_PRIORITIES } = require("../models/Task");
const protect = require("../middleware/authMiddleware");

const router = express.Router();

// Protect all task routes
router.use(protect);

/**
 * Escape special regex characters so user search text is matched literally.
 */
const escapeRegex = (text) => text.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");

/**
 * Fetch a task by ID and verify it belongs to the authenticated user.
 */
const findOwnedTask = async (taskId, userId) => {
  if (!mongoose.Types.ObjectId.isValid(taskId)) {
    return { errorStatus: 400, message: "Invalid task ID." };
  }

  const task = await Task.findById(taskId);
  if (!task) {
    return { errorStatus: 404, message: "Task not found." };
  }

  if (task.user.toString() !== userId.toString()) {
    return { errorStatus: 403, message: "Not authorized to access this task." };
  }

  return { task };
};

/**
 * Parse and validate optional dueDate input.
 */
const parseDueDate = (value) => {
  if (value === undefined) return { provided: false };
  if (value === null || value === "") return { provided: true, date: null };

  const parsed = new Date(value);
  if (Number.isNaN(parsed.getTime())) {
    return { error: "Invalid due date format." };
  }
  return { provided: true, date: parsed };
};

/**
 * Compute overall task counts for the logged-in user.
 */
const getUserTaskSummary = async (userId) => {
  const counts = await Task.aggregate([
    { $match: { user: userId } },
    { $group: { _id: "$status", count: { $sum: 1 } } },
  ]);

  const summary = {
    total: 0,
    pending: 0,
    inProgress: 0,
    completed: 0,
  };

  for (const item of counts) {
    summary.total += item.count;
    if (item._id === "Pending") summary.pending = item.count;
    if (item._id === "In Progress") summary.inProgress = item.count;
    if (item._id === "Completed") summary.completed = item.count;
  }

  return summary;
};

/**
 * POST /api/tasks
 * Create a new task for the logged-in user.
 */
router.post("/", async (req, res) => {
  try {
    const { title, description, status, priority, dueDate } = req.body;

    if (!title || !title.trim()) {
      return res.status(400).json({ message: "Task title is required." });
    }

    if (status && !VALID_STATUSES.includes(status)) {
      return res.status(400).json({
        message: "Status must be Pending, In Progress, or Completed.",
      });
    }

    if (priority && !VALID_PRIORITIES.includes(priority)) {
      return res.status(400).json({
        message: "Priority must be Low, Medium, or High.",
      });
    }

    const parsedDueDate = parseDueDate(dueDate);
    if (parsedDueDate.error) {
      return res.status(400).json({ message: parsedDueDate.error });
    }

    const task = await Task.create({
      title: title.trim(),
      description: description ? description.trim() : "",
      status: status || "Pending",
      priority: priority || "Medium",
      dueDate: parsedDueDate.provided ? parsedDueDate.date : null,
      user: req.user._id,
    });

    return res.status(201).json({
      message: "Task created successfully.",
      task,
    });
  } catch (error) {
    console.error("Create task error:", error);
    return res.status(500).json({ message: "Server error while creating task." });
  }
});

/**
 * GET /api/tasks
 * Get all tasks for the logged-in user with optional status, priority, search, and dueDate filters.
 */
router.get("/", async (req, res) => {
  try {
    const { status, priority, search, dueDate } = req.query;
    const filter = { user: req.user._id };

    if (status && status !== "All") {
      if (!VALID_STATUSES.includes(status)) {
        return res.status(400).json({
          message: "Invalid status filter. Use Pending, In Progress, or Completed.",
        });
      }
      filter.status = status;
    }

    if (priority && priority !== "All") {
      if (!VALID_PRIORITIES.includes(priority)) {
        return res.status(400).json({
          message: "Invalid priority filter. Use Low, Medium, or High.",
        });
      }
      filter.priority = priority;
    }

    if (search && search.trim()) {
      filter.title = {
        $regex: escapeRegex(search.trim()),
        $options: "i",
      };
    }

    if (dueDate && dueDate.trim()) {
      const dateStr = dueDate.trim();
      const startOfDay = new Date(`${dateStr}T00:00:00.000Z`);
      const endOfDay = new Date(`${dateStr}T23:59:59.999Z`);

      if (Number.isNaN(startOfDay.getTime())) {
        return res.status(400).json({ message: "Invalid dueDate filter format." });
      }

      filter.dueDate = { $gte: startOfDay, $lte: endOfDay };
    }

    const [tasks, summary] = await Promise.all([
      Task.find(filter).sort({ createdAt: -1 }),
      getUserTaskSummary(req.user._id),
    ]);

    return res.status(200).json({ tasks, summary });
  } catch (error) {
    console.error("Get tasks error:", error);
    return res.status(500).json({ message: "Server error while fetching tasks." });
  }
});

/**
 * GET /api/tasks/:id
 * Get a single task belonging to the logged-in user.
 */
router.get("/:id", async (req, res) => {
  try {
    const result = await findOwnedTask(req.params.id, req.user._id);
    if (result.errorStatus) {
      return res.status(result.errorStatus).json({ message: result.message });
    }

    return res.status(200).json({ task: result.task });
  } catch (error) {
    console.error("Get single task error:", error);
    return res.status(500).json({ message: "Server error while fetching task." });
  }
});

/**
 * PUT /api/tasks/:id
 * Update an existing task belonging to the logged-in user.
 */
router.put("/:id", async (req, res) => {
  try {
    const result = await findOwnedTask(req.params.id, req.user._id);
    if (result.errorStatus) {
      return res.status(result.errorStatus).json({ message: result.message });
    }

    const { task } = result;
    const { title, description, status, priority, dueDate } = req.body;

    if (title !== undefined) {
      if (!title.trim()) {
        return res.status(400).json({ message: "Task title cannot be empty." });
      }
      task.title = title.trim();
    }

    if (description !== undefined) {
      task.description = description.trim();
    }

    if (status !== undefined) {
      if (!VALID_STATUSES.includes(status)) {
        return res.status(400).json({
          message: "Status must be Pending, In Progress, or Completed.",
        });
      }
      task.status = status;
    }

    if (priority !== undefined) {
      if (!VALID_PRIORITIES.includes(priority)) {
        return res.status(400).json({
          message: "Priority must be Low, Medium, or High.",
        });
      }
      task.priority = priority;
    }

    const parsedDueDate = parseDueDate(dueDate);
    if (parsedDueDate.error) {
      return res.status(400).json({ message: parsedDueDate.error });
    }
    if (parsedDueDate.provided) {
      task.dueDate = parsedDueDate.date;
    }

    await task.save();

    return res.status(200).json({
      message: "Task updated successfully.",
      task,
    });
  } catch (error) {
    console.error("Update task error:", error);
    return res.status(500).json({ message: "Server error while updating task." });
  }
});

/**
 * DELETE /api/tasks/:id
 * Delete a task belonging to the logged-in user.
 */
router.delete("/:id", async (req, res) => {
  try {
    const result = await findOwnedTask(req.params.id, req.user._id);
    if (result.errorStatus) {
      return res.status(result.errorStatus).json({ message: result.message });
    }

    await result.task.deleteOne();

    return res.status(200).json({ message: "Task deleted successfully." });
  } catch (error) {
    console.error("Delete task error:", error);
    return res.status(500).json({ message: "Server error while deleting task." });
  }
});

module.exports = router;

