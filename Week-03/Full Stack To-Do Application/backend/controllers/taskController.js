const mongoose = require('mongoose');
const Task = require('../models/Task');

/**
 * Validate fields for creating or updating a task.
 * Returns an error message string if invalid, or null if valid.
 */
const validateTaskInput = (body, { isUpdate = false } = {}) => {
  if (!body || typeof body !== 'object' || Array.isArray(body)) {
    return 'Request body must be a JSON object.';
  }

  const { title, description, completed } = body;

  if (!isUpdate) {
    if (typeof title !== 'string' || title.trim() === '') {
      return 'Title is required and must be a non-empty string.';
    }
  } else {
    const hasUpdatableField =
      title !== undefined || description !== undefined || completed !== undefined;

    if (!hasUpdatableField) {
      return 'Provide at least one field to update: title, description, or completed.';
    }

    if (title !== undefined && (typeof title !== 'string' || title.trim() === '')) {
      return 'Title must be a non-empty string.';
    }
  }

  if (description !== undefined && typeof description !== 'string') {
    return 'Description must be a string.';
  }

  if (completed !== undefined && typeof completed !== 'boolean') {
    return 'Completed must be a boolean (true or false).';
  }

  return null;
};

/**
 * Find a task by ID and verify it belongs to the authenticated user.
 * Sends an HTTP error response and returns null if invalid, missing, or unauthorized.
 */
const findOwnedTask = async (id, userId, res) => {
  if (!mongoose.Types.ObjectId.isValid(id)) {
    res.status(400).json({
      success: false,
      message: 'Invalid task ID format.',
    });
    return null;
  }

  const task = await Task.findById(id);

  if (!task) {
    res.status(404).json({
      success: false,
      message: 'Task not found.',
    });
    return null;
  }

  if (task.user.toString() !== userId.toString()) {
    res.status(403).json({
      success: false,
      message: 'Not authorized to access this task.',
    });
    return null;
  }

  return task;
};

/**
 * @desc    Create a new task for the logged-in user
 * @route   POST /api/tasks
 */
const createTask = async (req, res, next) => {
  try {
    const validationError = validateTaskInput(req.body);
    if (validationError) {
      return res.status(400).json({
        success: false,
        message: validationError,
      });
    }

    const { title, description, completed } = req.body;

    const task = await Task.create({
      user: req.user._id,
      title: title.trim(),
      description: description !== undefined ? description.trim() : '',
      completed: completed !== undefined ? completed : false,
    });

    return res.status(201).json({
      success: true,
      message: 'Task created successfully.',
      data: task,
    });
  } catch (error) {
    return next(error);
  }
};

/**
 * @desc    Get all tasks belonging to the logged-in user
 * @route   GET /api/tasks
 */
const getAllTasks = async (req, res, next) => {
  try {
    const tasks = await Task.find({ user: req.user._id }).sort({ createdAt: -1 });

    return res.status(200).json({
      success: true,
      count: tasks.length,
      data: tasks,
    });
  } catch (error) {
    return next(error);
  }
};

/**
 * @desc    Get a single task by ID (owned by logged-in user)
 * @route   GET /api/tasks/:id
 */
const getTaskById = async (req, res, next) => {
  try {
    const task = await findOwnedTask(req.params.id, req.user._id, res);
    if (!task) return;

    return res.status(200).json({
      success: true,
      data: task,
    });
  } catch (error) {
    return next(error);
  }
};

/**
 * @desc    Update a task by ID (owned by logged-in user)
 * @route   PUT /api/tasks/:id
 */
const updateTask = async (req, res, next) => {
  try {
    const validationError = validateTaskInput(req.body, { isUpdate: true });
    if (validationError) {
      return res.status(400).json({
        success: false,
        message: validationError,
      });
    }

    const task = await findOwnedTask(req.params.id, req.user._id, res);
    if (!task) return;

    if (req.body.title !== undefined) task.title = req.body.title.trim();
    if (req.body.description !== undefined) task.description = req.body.description.trim();
    if (req.body.completed !== undefined) task.completed = req.body.completed;

    const updatedTask = await task.save();

    return res.status(200).json({
      success: true,
      message: 'Task updated successfully.',
      data: updatedTask,
    });
  } catch (error) {
    return next(error);
  }
};

/**
 * @desc    Delete a task by ID (owned by logged-in user)
 * @route   DELETE /api/tasks/:id
 */
const deleteTask = async (req, res, next) => {
  try {
    const task = await findOwnedTask(req.params.id, req.user._id, res);
    if (!task) return;

    await task.deleteOne();

    return res.status(200).json({
      success: true,
      message: 'Task deleted successfully.',
      data: task,
    });
  } catch (error) {
    return next(error);
  }
};

module.exports = {
  createTask,
  getAllTasks,
  getTaskById,
  updateTask,
  deleteTask,
};

