require("dotenv").config();
const express = require("express");
const connectDB = require("./config/db");
const authRoutes = require("./routes/authRoutes");
const noteRoutes = require("./routes/noteRoutes");
const { notFound, errorHandler } = require("./middleware/errorMiddleware");

const app = express();

// Validate required environment variables
if (!process.env.MONGO_URI || !process.env.JWT_SECRET) {
  console.error("Missing required environment variables: MONGO_URI and JWT_SECRET must be set.");
  process.exit(1);
}

// Parse incoming JSON request bodies
app.use(express.json());

// Basic health check route
app.get("/", (req, res) => {
  res.status(200).json({ message: "Notes App Backend API is running." });
});

// API Routes
app.use("/api/auth", authRoutes);
app.use("/api/notes", noteRoutes);

// 404 and centralized error handling middleware
app.use(notFound);
app.use(errorHandler);

const PORT = process.env.PORT || 5000;

connectDB().then(() => {
  app.listen(PORT, () => {
    console.log(`Server running on http://localhost:${PORT}`);
  });
});

