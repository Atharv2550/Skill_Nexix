# Full Stack To-Do Application

A beginner-friendly Full Stack To-Do Application built with **React.js (Vite)**, **Node.js**, **Express.js**, and **MongoDB (Mongoose)**, featuring **JWT Authentication** and **bcrypt** password hashing.

This project consolidates and reuses the Week 2 **User Authentication API** and **To-Do List REST API** into a unified backend, connecting tasks to individual authenticated users and integrating with a responsive React frontend via Axios.

---

## Features

- **User Authentication**:
  - Register a new account (`POST /api/auth/register`) with bcrypt password hashing.
  - Log in (`POST /api/auth/login`) and receive a signed JWT token.
  - Persistent login using `localStorage` and automatic `Authorization: Bearer <token>` headers via Axios interceptors.
  - Protected Dashboard route and redirect to `/login` on logout.
- **Task Management (CRUD)**:
  - Create new tasks with title and optional description.
  - View only the tasks belonging to the logged-in user.
  - Edit existing task titles and descriptions inline.
  - Toggle tasks between **Pending** and **Completed**.
  - Delete tasks.
- **Validation & Feedback**:
  - Client-side and server-side input validation.
  - Clear success and error alert messages.
  - Responsive layout for desktop and mobile screens.

---

## Project Structure

```text
Full Stack To-Do Application/
├── backend/
│   ├── config/
│   │   └── db.js                 # MongoDB connection helper
│   ├── controllers/
│   │   ├── authController.js     # Register, login, profile logic
│   │   └── taskController.js     # User-scoped task CRUD & ownership checks
│   ├── middleware/
│   │   ├── authMiddleware.js     # JWT Bearer verification (protect)
│   │   └── errorHandler.js       # 404 & centralized error handling
│   ├── models/
│   │   ├── Task.js               # Task schema with user reference
│   │   └── User.js               # User schema with bcrypt password hashing
│   ├── routes/
│   │   ├── authRoutes.js         # /api/auth routes
│   │   └── taskRoutes.js         # Protected /api/tasks routes
│   ├── .env.example
│   ├── package.json
│   └── server.js                 # Express app entry point
├── frontend/
│   ├── src/
│   │   ├── api/
│   │   │   └── axios.js          # Axios instance + JWT interceptor
│   │   ├── components/
│   │   │   ├── Alert.jsx
│   │   │   ├── Navbar.jsx
│   │   │   ├── ProtectedRoute.jsx
│   │   │   ├── TaskForm.jsx
│   │   │   └── TaskItem.jsx
│   │   ├── context/
│   │   │   └── AuthContext.jsx   # Auth state & localStorage persistence
│   │   ├── pages/
│   │   │   ├── DashboardPage.jsx
│   │   │   ├── LoginPage.jsx
│   │   │   └── RegisterPage.jsx
│   │   ├── App.jsx               # React Router setup
│   │   ├── index.css             # Responsive styling
│   │   └── main.jsx
│   ├── .env.example
│   ├── index.html
│   ├── package.json
│   └── vite.config.js
└── README.md
```

---

## Prerequisites

- **Node.js** (v18 or later recommended)
- **npm**
- **MongoDB** (running locally on `mongodb://127.0.0.1:27017` or a MongoDB Atlas connection string)

---

## Setup Instructions

### 1. Backend Setup

1. Navigate to the `backend` folder:
   ```bash
   cd backend
   ```
2. Install dependencies:
   ```bash
   npm install
   ```
3. Configure environment variables by copying `.env.example` to `.env` (or updating the existing `.env`):
   ```env
   PORT=5000
   MONGO_URI=mongodb://127.0.0.1:27017/fullstack_todo_db
   JWT_SECRET=replace_with_a_strong_secret_key
   JWT_EXPIRES_IN=1d
   CLIENT_URL=http://localhost:5173
   ```
4. Start the backend server:
   ```bash
   npm run dev
   ```
   The API will run at `http://localhost:5000`.

### 2. Frontend Setup

1. Open a new terminal and navigate to the `frontend` folder:
   ```bash
   cd frontend
   ```
2. Install dependencies:
   ```bash
   npm install
   ```
3. (Optional) Create a `.env` file from `.env.example` if your backend runs on a different URL:
   ```env
   VITE_API_URL=http://localhost:5000/api
   ```
4. Start the React development server:
   ```bash
   npm run dev
   ```
   Open the URL shown in the terminal (default: `http://localhost:5173`).

---

## API Endpoints

### Authentication (`/api/auth`)

| Method | Endpoint | Access | Description |
| ------ | -------- | ------ | ----------- |
| POST | `/api/auth/register` | Public | Register a new user and return JWT |
| POST | `/api/auth/login` | Public | Authenticate user and return JWT |
| GET | `/api/auth/profile` | Protected | Get logged-in user's profile |

### Tasks (`/api/tasks`)

All `/api/tasks` routes require `Authorization: Bearer <token>`.

| Method | Endpoint | Access | Description |
| ------ | -------- | ------ | ----------- |
| POST | `/api/tasks` | Protected | Create a new task for the logged-in user |
| GET | `/api/tasks` | Protected | Get all tasks belonging to the logged-in user |
| GET | `/api/tasks/:id` | Protected | Get a single owned task by ID |
| PUT | `/api/tasks/:id` | Protected | Update an owned task (title, description, completed) |
| DELETE | `/api/tasks/:id` | Protected | Delete an owned task |

