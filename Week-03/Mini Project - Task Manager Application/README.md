# TaskFlow — Full-Stack Task Manager Application

A beginner-friendly, full-stack Task Manager application built with **React.js**, **Node.js**, **Express.js**, and **MongoDB**. Users can register, log in, create/edit/delete tasks, mark tasks as completed, and filter or search tasks by status, priority, title, and due date.

---

## Features

- **User Authentication**: Registration & login with `bcryptjs` password hashing and JWT (`jsonwebtoken`) Bearer token authentication.
- **Protected Routes**: Both backend API endpoints and frontend pages enforce authentication; unauthenticated users are redirected to `/login`.
- **Task CRUD**: Create, read, update, complete/reopen, and delete tasks. Users can only access, edit, or delete their own tasks.
- **Dashboard Summary**: Displays live counts for Total, Pending, In Progress, and Completed tasks.
- **Task Filtering & Search**: Filter tasks via API query parameters by `status`, `priority`, `dueDate`, and `search` (title), plus a quick reset to view all tasks.
- **Responsive UI**: Clean dashboard layout with sidebar navigation, summary cards, task cards, modals for adding/editing tasks, and mobile drawer support.

---

## Project Structure

```text
Mini Project - Task Manager Application/
├── backend/
│   ├── config/
│   │   └── db.js                 # MongoDB connection setup
│   ├── middleware/
│   │   └── authMiddleware.js     # JWT Bearer authentication middleware
│   ├── models/
│   │   ├── Task.js               # Mongoose Task schema
│   │   └── User.js               # Mongoose User schema
│   ├── routes/
│   │   ├── authRoutes.js         # Register, login, and current user routes
│   │   └── taskRoutes.js         # Protected task CRUD and filtering routes
│   ├── .env.example              # Backend environment variables template
│   ├── .gitignore
│   ├── package.json
│   └── server.js                 # Express app entry point
├── frontend/
│   ├── src/
│   │   ├── api/
│   │   │   └── axios.js          # Axios instance & JWT interceptors
│   │   ├── components/
│   │   │   ├── AlertBanner.jsx
│   │   │   ├── DeleteConfirmModal.jsx
│   │   │   ├── ProtectedRoute.jsx
│   │   │   ├── PublicRoute.jsx
│   │   │   ├── Sidebar.jsx
│   │   │   ├── SummaryCards.jsx
│   │   │   ├── TaskCard.jsx
│   │   │   ├── TaskFilters.jsx
│   │   │   └── TaskModal.jsx
│   │   ├── context/
│   │   │   └── AuthContext.jsx   # Global auth state & session persistence
│   │   ├── pages/
│   │   │   ├── DashboardPage.jsx
│   │   │   ├── LoginPage.jsx
│   │   │   └── RegisterPage.jsx
│   │   ├── App.jsx
│   │   ├── index.css
│   │   └── main.jsx
│   ├── .env.example              # Frontend environment variables template
│   ├── .gitignore
│   ├── index.html
│   ├── package.json
│   └── vite.config.js
├── .gitignore
└── README.md
```

---

## Prerequisites

- **Node.js** (v18+ recommended)
- **npm**
- **MongoDB** (local MongoDB Community Server or a free MongoDB Atlas connection string)

---

## Installation & Setup

### 1. Backend Setup

```bash
cd backend
npm install
```

Create a `.env` file in `backend/` (you can copy `backend/.env.example`):

```env
PORT=5000
MONGO_URI=mongodb://127.0.0.1:27017/task_manager_db
JWT_SECRET=your_jwt_secret_key_here
CLIENT_URL=http://localhost:5173
```

Start the backend server:

```bash
# Development (with auto-reload)
npm run dev

# Or production
npm start
```

The API will be available at `http://localhost:5000`.

### 2. Frontend Setup

Open a second terminal:

```bash
cd frontend
npm install
```

Create a `.env` file in `frontend/` (you can copy `frontend/.env.example`):

```env
VITE_API_URL=http://localhost:5000/api
```

Start the React development server:

```bash
npm run dev
```

Open `http://localhost:5173` in your browser.

---

## API Documentation

Base URL: `http://localhost:5000/api`

### Authentication Endpoints

#### Register a User
- **POST** `/auth/register`
- **Body**:
  ```json
  {
    "name": "Jane Doe",
    "email": "jane@example.com",
    "password": "password123"
  }
  ```
- **Response (`201 Created`)**:
  ```json
  {
    "message": "Registration successful.",
    "token": "<jwt_token>",
    "user": {
      "id": "...",
      "name": "Jane Doe",
      "email": "jane@example.com"
    }
  }
  ```

#### Login User
- **POST** `/auth/login`
- **Body**:
  ```json
  {
    "email": "jane@example.com",
    "password": "password123"
  }
  ```
- **Response (`200 OK`)**:
  ```json
  {
    "message": "Login successful.",
    "token": "<jwt_token>",
    "user": {
      "id": "...",
      "name": "Jane Doe",
      "email": "jane@example.com"
    }
  }
  ```

#### Get Current User
- **GET** `/auth/me`
- **Headers**: `Authorization: Bearer <jwt_token>`
- **Response (`200 OK`)**:
  ```json
  {
    "user": {
      "id": "...",
      "name": "Jane Doe",
      "email": "jane@example.com"
    }
  }
  ```

---

### Task Endpoints (Protected)

All task endpoints require the header:
`Authorization: Bearer <jwt_token>`

#### Create a Task
- **POST** `/tasks`
- **Body**:
  ```json
  {
    "title": "Complete project report",
    "description": "Write summary and API docs",
    "status": "Pending",
    "priority": "High",
    "dueDate": "2026-12-01"
  }
  ```
- **Response (`201 Created`)**: `{ "message": "Task created successfully.", "task": { ... } }`

#### Get All Tasks (with Optional Filtering)
- **GET** `/tasks`
- **Query Parameters**:
  - `status`: `Pending` | `In Progress` | `Completed` | `All`
  - `priority`: `Low` | `Medium` | `High` | `All`
  - `search`: Case-insensitive title search string
  - `dueDate`: `YYYY-MM-DD`
- **Example**: `GET /tasks?status=Pending&priority=High&search=report`
- **Response (`200 OK`)**:
  ```json
  {
    "tasks": [ ... ],
    "summary": {
      "total": 5,
      "pending": 2,
      "inProgress": 1,
      "completed": 2
    }
  }
  ```

#### Get Single Task
- **GET** `/tasks/:id`
- **Response (`200 OK`)**: `{ "task": { ... } }`

#### Update a Task
- **PUT** `/tasks/:id`
- **Body** (any subset of fields):
  ```json
  {
    "title": "Updated title",
    "status": "Completed",
    "priority": "Medium"
  }
  ```
- **Response (`200 OK`)**: `{ "message": "Task updated successfully.", "task": { ... } }`

#### Delete a Task
- **DELETE** `/tasks/:id`
- **Response (`200 OK`)**: `{ "message": "Task deleted successfully." }`

---

## Error Responses

| Status Code | Meaning |
| --- | --- |
| `400` | Validation error or invalid ID/query parameter |
| `401` | Missing, invalid, or expired JWT token / invalid login credentials |
| `403` | Authenticated user attempted to access or modify another user's task |
| `404` | Task or route not found |
| `500` | Internal server error |

