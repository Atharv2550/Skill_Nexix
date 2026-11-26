const http = require('http');
const path = require('path');
const express = require('express');
const cors = require('cors');
const cookieParser = require('cookie-parser');
const dotenv = require('dotenv');
const jwt = require('jsonwebtoken');
const { Server } = require('socket.io');

const connectDB = require('./config/db');
const User = require('./models/User');
const { parseCookies } = require('./middleware/authMiddleware');
const { notFoundHandler, errorHandler } = require('./middleware/errorMiddleware');

const authRoutes = require('./routes/authRoutes');
const userRoutes = require('./routes/userRoutes');
const postRoutes = require('./routes/postRoutes');

dotenv.config({ path: path.join(__dirname, '.env') });

const app = express();
const server = http.createServer(app);

const clientOrigin = process.env.CLIENT_URL || 'http://localhost:5173';

// Configure Socket.IO with CORS and cookie/JWT authentication
const io = new Server(server, {
  cors: {
    origin: clientOrigin,
    credentials: true,
    methods: ['GET', 'POST'],
  },
});

io.use(async (socket, next) => {
  try {
    const cookies = parseCookies(socket.handshake.headers?.cookie || '');
    const token = cookies.token || socket.handshake.auth?.token;

    if (!token) {
      return next(new Error('Authentication required for real-time updates'));
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const user = await User.findById(decoded.id).select('_id fullName username profilePicture');

    if (!user) {
      return next(new Error('Invalid user session'));
    }

    socket.user = user;
    next();
  } catch (error) {
    next(new Error('Invalid or expired authentication token'));
  }
});

io.on('connection', (socket) => {
  console.log(`Socket connected: ${socket.id} (@${socket.user.username})`);

  socket.on('disconnect', (reason) => {
    console.log(`Socket disconnected: ${socket.id} (${reason})`);
  });
});

app.set('io', io);

// Core middleware
app.use(
  cors({
    origin: clientOrigin,
    credentials: true,
  })
);
app.use(express.json({ limit: '1mb' }));
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());

// Serve uploaded images statically
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

// Health check
app.get('/api/health', (req, res) => {
  res.status(200).json({ success: true, status: 'ok', timestamp: new Date().toISOString() });
});

// API routes
app.use('/api/auth', authRoutes);
app.use('/api/users', userRoutes);
app.use('/api/posts', postRoutes);

// Error handlers
app.use(notFoundHandler);
app.use(errorHandler);

const PORT = process.env.PORT || 5000;

connectDB().then(() => {
  server.listen(PORT, () => {
    console.log(`Server running in ${process.env.NODE_ENV || 'development'} mode on port ${PORT}`);
  });
});
