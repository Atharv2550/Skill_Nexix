# To-Do List REST API

A simple, beginner-friendly **To-Do List REST API** built with **Node.js**, **Express.js**, and **MongoDB** (using **Mongoose**). This is a backend-only REST API with CRUD endpoints, basic input validation, and centralized error handling.

---

## Folder Structure

```text
To-Do List REST API/
├── config/
│   └── db.js               # MongoDB connection setup using Mongoose
├── controllers/
│   └── taskController.js   # Request handlers and validation for tasks
├── middleware/
│   └── errorHandler.js     # 404 and global error-handling middleware
├── models/
│   └── Task.js             # Mongoose Task schema and model
├── routes/
│   └── taskRoutes.js       # Express routes for /api/tasks
├── .env                    # Environment variables (ignored by git)
├── .env.example            # Example environment variables template
├── .gitignore              # Files and folders ignored by git
├── package.json            # Project metadata, scripts, and dependencies
├── README.md               # Project documentation
└── server.js               # Application entry point
```

---

## Prerequisites

Before running this project, make sure you have:

1. **Node.js** (v18 or higher recommended) — [Download Node.js](https://nodejs.org/)
2. **MongoDB** — either:
   - Local MongoDB Community Server running on `mongodb://127.0.0.1:27017`, **or**
   - A free cloud database on [MongoDB Atlas](https://www.mongodb.com/atlas)
3. **Postman** (for testing the API endpoints) — [Download Postman](https://www.postman.com/downloads/)

---

## Installation & Setup

1. **Navigate to the project folder:**
   ```bash
   cd "To-Do List REST API"
   ```

2. **Install dependencies:**
   ```bash
   npm install
   ```

3. **Configure environment variables:**

   Create a `.env` file in the root directory (or copy `.env.example` to `.env`):
   ```env
   PORT=5000
   MONGO_URI=mongodb://127.0.0.1:27017/todo_list_db
   ```
   > If you are using **MongoDB Atlas**, replace `MONGO_URI` with your Atlas connection string.

---

## Running the Server

- **Start normally:**
  ```bash
  npm start
  ```

- **Start in development mode (auto-restarts on file changes using `nodemon`):**
  ```bash
  npm run dev
  ```

When the server starts successfully, you will see:
```text
Server is running on http://localhost:5000
MongoDB connected: 127.0.0.1
```

---

## Task Model

Each task document stored in MongoDB has the following fields:

| Field         | Type    | Required | Default | Description                           |
| ------------- | ------- | -------- | ------- | ------------------------------------- |
| `title`       | String  | Yes      | —       | Short title of the task (max 100 chars) |
| `description` | String  | No       | `""`    | Detailed notes (max 500 chars)        |
| `completed`   | Boolean | No       | `false` | Whether the task is completed         |
| `createdAt`   | Date    | Auto     | Auto    | Timestamp when the task was created   |
| `updatedAt`   | Date    | Auto     | Auto    | Timestamp when the task was updated   |

---

## API Endpoints & Examples

Base URL: `http://localhost:5000`

### 1. Create a Task — `POST /api/tasks`

**Request Body (`application/json`):**
```json
{
  "title": "Buy groceries",
  "description": "Milk, eggs, bread, and coffee",
  "completed": false
}
```
> Note: Only `title` is required. `description` defaults to `""` and `completed` defaults to `false`.

**Success Response (`201 Created`):**
```json
{
  "success": true,
  "message": "Task created successfully",
  "data": {
    "_id": "6745a1b2c3d4e5f60718293a",
    "title": "Buy groceries",
    "description": "Milk, eggs, bread, and coffee",
    "completed": false,
    "createdAt": "2026-11-26T12:45:00.000Z",
    "updatedAt": "2026-11-26T12:45:00.000Z",
    "__v": 0
  }
}
```

**Validation Error Response (`400 Bad Request`):**
```json
{
  "success": false,
  "message": "Title is required and must be a non-empty string."
}
```

---

### 2. Get All Tasks — `GET /api/tasks`

**Success Response (`200 OK`):**
```json
{
  "success": true,
  "count": 2,
  "data": [
    {
      "_id": "6745a1b2c3d4e5f60718293b",
      "title": "Finish Node.js assignment",
      "description": "Build and test the To-Do List REST API",
      "completed": true,
      "createdAt": "2026-11-26T12:46:00.000Z",
      "updatedAt": "2026-11-26T12:47:00.000Z",
      "__v": 0
    },
    {
      "_id": "6745a1b2c3d4e5f60718293a",
      "title": "Buy groceries",
      "description": "Milk, eggs, bread, and coffee",
      "completed": false,
      "createdAt": "2026-11-26T12:45:00.000Z",
      "updatedAt": "2026-11-26T12:45:00.000Z",
      "__v": 0
    }
  ]
}
```

---

### 3. Get a Task by ID — `GET /api/tasks/:id`

**Example Request:**
`GET http://localhost:5000/api/tasks/6745a1b2c3d4e5f60718293a`

**Success Response (`200 OK`):**
```json
{
  "success": true,
  "data": {
    "_id": "6745a1b2c3d4e5f60718293a",
    "title": "Buy groceries",
    "description": "Milk, eggs, bread, and coffee",
    "completed": false,
    "createdAt": "2026-11-26T12:45:00.000Z",
    "updatedAt": "2026-11-26T12:45:00.000Z",
    "__v": 0
  }
}
```

**Error Responses:**
- **Invalid ID format (`400 Bad Request`):**
  ```json
  {
    "success": false,
    "message": "Invalid task ID format."
  }
  ```
- **Task does not exist (`404 Not Found`):**
  ```json
  {
    "success": false,
    "message": "Task not found."
  }
  ```

---

### 4. Update a Task — `PUT /api/tasks/:id`

**Example Request:**
`PUT http://localhost:5000/api/tasks/6745a1b2c3d4e5f60718293a`

**Request Body (`application/json`):**
```json
{
  "title": "Buy groceries and snacks",
  "completed": true
}
```
> You can send one or more of `title`, `description`, or `completed`.

**Success Response (`200 OK`):**
```json
{
  "success": true,
  "message": "Task updated successfully",
  "data": {
    "_id": "6745a1b2c3d4e5f60718293a",
    "title": "Buy groceries and snacks",
    "description": "Milk, eggs, bread, and coffee",
    "completed": true,
    "createdAt": "2026-11-26T12:45:00.000Z",
    "updatedAt": "2026-11-26T12:50:00.000Z",
    "__v": 0
  }
}
```

---

### 5. Delete a Task — `DELETE /api/tasks/:id`

**Example Request:**
`DELETE http://localhost:5000/api/tasks/6745a1b2c3d4e5f60718293a`

**Success Response (`200 OK`):**
```json
{
  "success": true,
  "message": "Task deleted successfully",
  "data": {
    "_id": "6745a1b2c3d4e5f60718293a",
    "title": "Buy groceries and snacks",
    "description": "Milk, eggs, bread, and coffee",
    "completed": true,
    "createdAt": "2026-11-26T12:45:00.000Z",
    "updatedAt": "2026-11-26T12:50:00.000Z",
    "__v": 0
  }
}
```

---

## How to Test Every Endpoint Using Postman

1. **Start your MongoDB service** (if running locally) and start the API server:
   ```bash
   npm run dev
   ```
2. Open **Postman** and create a new **Collection** named `To-Do List API`.

### Test 1: Add a New Task (`POST`)
1. Click **New** -> **HTTP Request**.
2. Set method to **POST** and URL to `http://localhost:5000/api/tasks`.
3. Open the **Body** tab, select **raw**, and choose **JSON** from the dropdown on the right.
4. Paste:
   ```json
   {
     "title": "Learn Express.js",
     "description": "Build a simple REST API"
   }
   ```
5. Click **Send**.
6. Verify the status is `201 Created` and copy the `_id` value from the response `data` object (you will use it in Tests 3, 4, and 5).

### Test 2: Get All Tasks (`GET`)
1. Create a new request with method **GET** and URL `http://localhost:5000/api/tasks`.
2. Click **Send**.
3. Verify the status is `200 OK` and you see an array of tasks in `data`.

### Test 3: Get a Single Task by ID (`GET`)
1. Create a new request with method **GET** and URL `http://localhost:5000/api/tasks/<PASTE_TASK_ID>`.
2. Click **Send**.
3. Verify the status is `200 OK` and the matching task is returned.

### Test 4: Update a Task (`PUT`)
1. Create a new request with method **PUT** and URL `http://localhost:5000/api/tasks/<PASTE_TASK_ID>`.
2. Go to **Body** -> **raw** -> **JSON** and enter:
   ```json
   {
     "title": "Learn Express.js & Mongoose",
     "completed": true
   }
   ```
3. Click **Send**.
4. Verify the status is `200 OK` and `completed` is now `true`.

### Test 5: Delete a Task (`DELETE`)
1. Create a new request with method **DELETE** and URL `http://localhost:5000/api/tasks/<PASTE_TASK_ID>`.
2. Click **Send**.
3. Verify the status is `200 OK` and the response confirms `"Task deleted successfully"`.
4. (Optional) Send the **GET** request from Test 3 again with the same ID and verify you now get `404 Not Found`.

### Optional Validation Checks in Postman
- Send a `POST /api/tasks` request with `{}` (missing `title`) -> expect `400 Bad Request`.
- Send a `GET /api/tasks/12345` request (invalid MongoDB ID) -> expect `400 Bad Request`.
- Send a `GET /api/unknown` request -> expect `404 Not Found`.

