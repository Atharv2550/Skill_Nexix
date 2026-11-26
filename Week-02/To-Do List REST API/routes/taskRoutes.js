const express = require('express');
const {
  createTask,
  getAllTasks,
  getTaskById,
  updateTask,
  deleteTask,
} = require('../controllers/taskController');

const router = express.Router();

// POST /api/tasks - Add a new task
router.post('/', createTask);

// GET /api/tasks - Get all tasks
router.get('/', getAllTasks);

// GET /api/tasks/:id - Get a single task by ID
router.get('/:id', getTaskById);

// PUT /api/tasks/:id - Update a task by ID
router.put('/:id', updateTask);

// DELETE /api/tasks/:id - Delete a task by ID
router.delete('/:id', deleteTask);

module.exports = router;

