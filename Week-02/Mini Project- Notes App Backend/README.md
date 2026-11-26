# Notes App Backend REST API

A simple, beginner-friendly REST API for a Notes application built with **Node.js**, **Express.js**, **MongoDB**, **Mongoose**, **bcrypt**, and **JWT (JSON Web Token)** authentication.

---

## Features

- User registration and login with **bcrypt** password hashing
- Stateless authentication using **JWT** tokens
- Protected CRUD endpoints for managing personal notes
- Strict ownership checks so users can only view, update, and delete their own notes
- Input validation and centralized error handling

---

## Folder Structure

```text
Mini Project- Notes App Backend/
├── config/
│   └── db.js                 # MongoDB connection setup using Mongoose
├── controllers/
│   ├── authController.js     # Register and login request handlers
│   └── noteController.js     # CRUD handlers for notes with ownership checks
├── middleware/
│   ├── authMiddleware.js     # Verifies JWT Bearer token and attaches req.user
│   └── errorMiddleware.js    # 404 handler and centralized error formatter
├── models/
│   ├── Note.js               # Mongoose Note schema (title, content, user, timestamps)
│   └── User.js               # Mongoose User schema with bcrypt pre-save hook
├── routes/
│   ├── authRoutes.js         # /api/auth routes
│   └── noteRoutes.js         # /api/notes routes (protected by authMiddleware)
├── .env                      # Local environment variables (not committed to git)
├── .env.example              # Template for environment variables
├── .gitignore                # Ignores node_modules and .env
├── package.json              # Project metadata, dependencies, and scripts
├── README.md                 # Project documentation and Postman testing guide
└── server.js                 # Express app entry point
```

---

## Installation & Setup

### Prerequisites
- [Node.js](https://nodejs.org/) (v18+ recommended)
- [MongoDB](https://www.mongodb.com/) running locally or a MongoDB Atlas connection string

### Steps

1. **Navigate to the project folder**
   ```bash
   cd "Mini Project- Notes App Backend"
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Configure environment variables**
   Copy `.env.example` to `.env` (or update the existing `.env` file):
   ```env
   PORT=5000
   MONGO_URI=mongodb://127.0.0.1:27017/notes_app
   JWT_SECRET=your_super_secret_jwt_key_here
   JWT_EXPIRES_IN=7d
   ```

4. **Start the server**
   - Development mode (auto-restarts on file changes with `nodemon`):
     ```bash
     npm run dev
     ```
   - Production mode:
     ```bash
     npm start
     ```

   If everything is configured properly, you will see:
   ```text
   MongoDB connected: 127.0.0.1
   Server running on http://localhost:5000
   ```

---

## API Endpoints

### Authentication (`/api/auth`)

| Method | Endpoint | Access | Description |
| :--- | :--- | :--- | :--- |
| `POST` | `/api/auth/register` | Public | Register a new user |
| `POST` | `/api/auth/login` | Public | Login an existing user and receive a JWT token |

### Notes (`/api/notes`) — *Protected (Requires JWT)*

| Method | Endpoint | Access | Description |
| :--- | :--- | :--- | :--- |
| `POST` | `/api/notes` | Private | Create a new note |
| `GET` | `/api/notes` | Private | Get all notes belonging to the logged-in user |
| `GET` | `/api/notes/:id` | Private | Get a single note by ID (owned by user) |
| `PUT` | `/api/notes/:id` | Private | Update an existing note by ID (owned by user) |
| `DELETE` | `/api/notes/:id` | Private | Delete a note by ID (owned by user) |

---

## Sample Requests & Responses

### 1. Register a User
**Request:** `POST http://localhost:5000/api/auth/register`
```json
{
  "name": "Alice Johnson",
  "email": "alice@example.com",
  "password": "password123"
}
```
**Response (`201 Created`):**
```json
{
  "message": "User registered successfully.",
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "user": {
    "id": "6745a1b2c3d4e5f60718293a",
    "name": "Alice Johnson",
    "email": "alice@example.com",
    "createdAt": "2026-11-26T12:55:00.000Z"
  }
}
```

### 2. Login User
**Request:** `POST http://localhost:5000/api/auth/login`
```json
{
  "email": "alice@example.com",
  "password": "password123"
}
```
**Response (`200 OK`):**
```json
{
  "message": "Login successful.",
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "user": {
    "id": "6745a1b2c3d4e5f60718293a",
    "name": "Alice Johnson",
    "email": "alice@example.com",
    "createdAt": "2026-11-26T12:55:00.000Z"
  }
}
```

### 3. Create a Note
**Headers:** `Authorization: Bearer <your_jwt_token>`  
**Request:** `POST http://localhost:5000/api/notes`
```json
{
  "title": "Grocery List",
  "content": "Milk, Eggs, Bread, Coffee"
}
```
**Response (`201 Created`):**
```json
{
  "message": "Note created successfully.",
  "note": {
    "_id": "6745a210c3d4e5f607182940",
    "title": "Grocery List",
    "content": "Milk, Eggs, Bread, Coffee",
    "user": "6745a1b2c3d4e5f60718293a",
    "createdAt": "2026-11-26T12:56:00.000Z",
    "updatedAt": "2026-11-26T12:56:00.000Z",
    "__v": 0
  }
}
```

### 4. Get All Notes (Logged-in User)
**Headers:** `Authorization: Bearer <your_jwt_token>`  
**Request:** `GET http://localhost:5000/api/notes`  
**Response (`200 OK`):**
```json
{
  "count": 1,
  "notes": [
    {
      "_id": "6745a210c3d4e5f607182940",
      "title": "Grocery List",
      "content": "Milk, Eggs, Bread, Coffee",
      "user": "6745a1b2c3d4e5f60718293a",
      "createdAt": "2026-11-26T12:56:00.000Z",
      "updatedAt": "2026-11-26T12:56:00.000Z",
      "__v": 0
    }
  ]
}
```

### 5. Get a Specific Note
**Headers:** `Authorization: Bearer <your_jwt_token>`  
**Request:** `GET http://localhost:5000/api/notes/6745a210c3d4e5f607182940`  
**Response (`200 OK`):**
```json
{
  "note": {
    "_id": "6745a210c3d4e5f607182940",
    "title": "Grocery List",
    "content": "Milk, Eggs, Bread, Coffee",
    "user": "6745a1b2c3d4e5f60718293a",
    "createdAt": "2026-11-26T12:56:00.000Z",
    "updatedAt": "2026-11-26T12:56:00.000Z",
    "__v": 0
  }
}
```

### 6. Update a Note
**Headers:** `Authorization: Bearer <your_jwt_token>`  
**Request:** `PUT http://localhost:5000/api/notes/6745a210c3d4e5f607182940`
```json
{
  "title": "Weekend Grocery List",
  "content": "Milk, Eggs, Bread, Coffee, Apples"
}
```
**Response (`200 OK`):**
```json
{
  "message": "Note updated successfully.",
  "note": {
    "_id": "6745a210c3d4e5f607182940",
    "title": "Weekend Grocery List",
    "content": "Milk, Eggs, Bread, Coffee, Apples",
    "user": "6745a1b2c3d4e5f60718293a",
    "createdAt": "2026-11-26T12:56:00.000Z",
    "updatedAt": "2026-11-26T12:58:00.000Z",
    "__v": 0
  }
}
```

### 7. Delete a Note
**Headers:** `Authorization: Bearer <your_jwt_token>`  
**Request:** `DELETE http://localhost:5000/api/notes/6745a210c3d4e5f607182940`  
**Response (`200 OK`):**
```json
{
  "message": "Note deleted successfully."
}
```

### Error Responses
- `400 Bad Request` – Missing/invalid fields or invalid note ID format
- `401 Unauthorized` – Missing, invalid, or expired JWT token; or wrong login credentials
- `403 Forbidden` – Trying to view, update, or delete another user's note
- `404 Not Found` – Note or route does not exist
- `409 Conflict` – Email is already registered

---

## Testing with Postman

1. **Start the server** (`npm run dev`).
2. **Register a user:**
   - Method: `POST`
   - URL: `http://localhost:5000/api/auth/register`
   - Body -> **raw** -> **JSON**: enter `name`, `email`, and `password`, then click **Send**.
3. **Login to get your JWT token:**
   - Method: `POST`
   - URL: `http://localhost:5000/api/auth/login`
   - Body -> **raw** -> **JSON**: enter `email` and `password`, then click **Send**.
   - Copy the `token` string from the JSON response.
4. **Pass the JWT Token in Postman:**
   - Open any `/api/notes` request.
   - Go to the **Authorization** tab.
   - Set **Auth Type** to **Bearer Token**.
   - Paste your copied JWT token into the **Token** field.
   - *(Alternatively, open the **Headers** tab and add key `Authorization` with value `Bearer <your_jwt_token>`.)*
5. **Test all Notes endpoints:**
   - `POST /api/notes` with JSON `{ "title": "...", "content": "..." }`
   - `GET /api/notes` to list all your notes
   - `GET /api/notes/<note_id>` to get one note
   - `PUT /api/notes/<note_id>` with updated `title` / `content`
   - `DELETE /api/notes/<note_id>` to delete the note
6. **Verify security:**
   - Try calling `GET /api/notes` without a token -> returns `401 Unauthorized`.
   - Register a second user, log in with that user's token, and try `GET /api/notes/<first_users_note_id>` -> returns `403 Forbidden`.

