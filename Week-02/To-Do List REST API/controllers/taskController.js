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
 * Helper to validate MongoDB ObjectId format.
 */
const isValidObjectId = (id) => mongoose.Types.ObjectId.isValid(id);

/**
 * @desc    Create a new task
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
      title: title.trim(),
      description: description !== undefined ? description.trim() : '',
      completed: completed !== undefined ? completed : false,
    });

    return res.status(201).json({
      success: true,
      message: 'Task created successfully',
      data: task,
    });
  } catch (error) {
    return next(error);
  }
};

/**
 * @desc    Get all tasks
 * @route   GET /api/tasks
 */
const getAllTasks = async (req, res, next) => {
  try {
    const tasks = await Task.find().sort({ createdAt: -1 });

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
 * @desc    Get a single task by ID
 * @route   GET /api/tasks/:id
 */
const getTaskById = async (req, res, next) => {
  try {
    const { id } = req.params;

    if (!isValidObjectId(id)) {
      return res.status(400).json({
        success: false,
        message: 'Invalid task ID format.',
      });
    }

    const task = await Task.findById(id);

    if (!task) {
      return res.status(404).json({
        success: false,
        message: 'Task not found.',
      });
    }

    return res.status(200).json({
      success: true,
      data: task,
    });
  } catch (error) {
    return next(error);
  }
};

/**
 * @desc    Update a task by ID
 * @route   PUT /api/tasks/:id
 */
const updateTask = async (req, res, next) => {
  try {
    const { id } = req.params;

    if (!isValidObjectId(id)) {
      return res.status(400).json({
        success: false,
        message: 'Invalid task ID format.',
      });
    }

    const validationError = validateTaskInput(req.body, { isUpdate: true });
    if (validationError) {
      return res.status(400).json({
        success: false,
        message: validationError,
      });
    }

    const updates = {};
    if (req.body.title !== undefined) updates.title = req.body.title.trim();
    if (req.body.description !== undefined) updates.description = req.body.description.trim();
    if (req.body.completed !== undefined) updates.completed = req.body.completed;

    const updatedTask = await Task.findByIdAndUpdate(id, updates, {
      new: true,
      runValidators: true,
    });

    if (!updatedTask) {
      return res.status(404).json({
        success: false,
        message: 'Task not found.',
      });
    }

    return res.status(200).json({
      success: true,
      message: 'Task updated successfully',
      data: updatedTask,
    });
  } catch (error) {
    return next(error);
  }
};

/**
 * @desc    Delete a task by ID
 * @route   DELETE /api/tasks/:id
 */
const deleteTask = async (req, res, next) => {
  try {
    const { id } = req.params;

    if (!isValidObjectId(id)) {
      return res.status(400).json({
        success: false,
        message: 'Invalid task ID format.',
      });
    }

    const deletedTask = await Task.findByIdAndDelete(id);

    if (!deletedTask) {
      return res.status(404).json({
        success: false,
        message: 'Task not found.',
      });
    }

    return res.status(200).json({
      success: true,
      message: 'Task deleted successfully',
      data: deletedTask,
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

