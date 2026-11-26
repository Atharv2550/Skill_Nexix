require('dotenv').config();
const express = require('express');
const connectDB = require('./config/db');
const taskRoutes = require('./routes/taskRoutes');
const { notFound, errorHandler } = require('./middleware/errorHandler');

const app = express();
const PORT = process.env.PORT || 5000;

// Connect to MongoDB
connectDB();

// Middleware to parse incoming JSON request bodies
app.use(express.json());

// Basic health-check route
app.get('/', (req, res) => {
  res.status(200).json({
    success: true,
    message: 'To-Do List REST API is running',
  });
});

// Task API routes
app.use('/api/tasks', taskRoutes);

// 404 and global error handlers
app.use(notFound);
app.use(errorHandler);

app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});

