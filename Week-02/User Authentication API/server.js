require('dotenv').config();
const express = require('express');
const connectDB = require('./config/db');
const authRoutes = require('./routes/authRoutes');

const app = express();

// Parse incoming JSON request bodies
app.use(express.json());

// Basic health check endpoint
app.get('/', (req, res) => {
  res.status(200).json({
    message: 'User Authentication REST API is running.',
  });
});

// Authentication routes
app.use('/api/auth', authRoutes);

// Handle unknown routes
app.use((req, res) => {
  res.status(404).json({
    message: `Route ${req.originalUrl} not found.`,
  });
});

// Centralized error handler
app.use((err, req, res, next) => {
  // Handle malformed JSON payloads
  if (err instanceof SyntaxError && err.status === 400 && 'body' in err) {
    return res.status(400).json({
      message: 'Invalid JSON payload.',
    });
  }

  // Handle Mongoose validation errors
  if (err.name === 'ValidationError') {
    const messages = Object.values(err.errors).map((val) => val.message);
    return res.status(400).json({
      message: messages.join(', '),
    });
  }

  // Handle MongoDB duplicate key errors (e.g., duplicate email)
  if (err.code === 11000) {
    return res.status(409).json({
      message: 'A user with this email already exists.',
    });
  }

  console.error('Server Error:', err.message);
  res.status(err.statusCode || 500).json({
    message: err.message || 'Internal server error.',
  });
});

const PORT = process.env.PORT || 5000;

const startServer = async () => {
  try {
    await connectDB();
    app.listen(PORT, () => {
      console.log(`Server running on http://localhost:${PORT}`);
    });
  } catch (error) {
    console.error('Failed to start server:', error.message);
    process.exit(1);
  }
};

// Only start listening when run directly (makes testing imports easier)
if (require.main === module) {
  startServer();
}

module.exports = app;

