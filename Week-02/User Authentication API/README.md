# User Authentication REST API

A simple, beginner-friendly backend REST API for user registration, login, and protected profile access built with **Node.js**, **Express.js**, **MongoDB** (via **Mongoose**), **bcrypt**, **JSON Web Tokens (JWT)**, and **dotenv**.

---

## Features

- User registration with input validation and unique email enforcement
- Secure password hashing with `bcrypt` before saving to MongoDB
- User login with password verification and JWT generation
- Authentication middleware (`protect`) to verify Bearer JWT tokens
- Protected profile route accessible only to authenticated users
- Environment-based configuration with `dotenv`
- Centralized validation and error handling

---

## Project Structure

```text
User Authentication API/
├── config/
│   └── db.js                 # MongoDB connection setup using Mongoose
├── controllers/
│   └── authController.js     # Register, login, and profile handlers
├── middleware/
│   └── authMiddleware.js     # JWT verification middleware
├── models/
│   └── User.js               # Mongoose User schema & bcrypt hooks
├── routes/
│   └── authRoutes.js         # /api/auth route definitions
├── .env.example              # Sample environment variables
├── .gitignore
├── package.json
├── README.md
└── server.js                 # Express app entry point
```

---

## Prerequisites

- [Node.js](https://nodejs.org/) (v18+ recommended)
- [MongoDB](https://www.mongodb.com/) running locally (`mongodb://127.0.0.1:27017`) **or** a free [MongoDB Atlas](https://www.mongodb.com/atlas) cluster URI
- [Postman](https://www.postman.com/) (or any API client) for testing endpoints

---

## Installation & Running Instructions

1. **Navigate to the project directory:**
   ```bash
   cd "User Authentication API"
   ```

2. **Install dependencies:**
   ```bash
   npm install
   ```

3. **Configure environment variables:**
   Create a `.env` file in the root directory (or copy `.env.example` if `.env` does not exist):
   ```bash
   cp .env.example .env
   ```
   Update `.env` with your MongoDB URI and a strong JWT secret:
   ```env
   PORT=5000
   MONGO_URI=mongodb://127.0.0.1:27017/user_auth_api
   JWT_SECRET=your_super_secret_jwt_key_change_this
   JWT_EXPIRES_IN=1d
   ```

4. **Start MongoDB:**
   - If using local MongoDB, ensure the MongoDB service is running.
   - If using MongoDB Atlas, paste your Atlas connection string into `MONGO_URI`.

5. **Run the server:**
   - Production / standard mode:
     ```bash
     npm start
     ```
   - Development mode (auto-restarts on file changes with `nodemon`):
     ```bash
     npm run dev
     ```

   You should see:
   ```text
   MongoDB connected: 127.0.0.1
   Server running on http://localhost:5000
   ```

---

## API Endpoints Overview

| Method | Endpoint             | Access  | Description                        |
| ------ | -------------------- | ------- | ---------------------------------- |
| GET    | `/`                  | Public  | Health check                       |
| POST   | `/api/auth/register` | Public  | Register a new user                |
| POST   | `/api/auth/login`    | Public  | Log in and receive a JWT           |
| GET    | `/api/auth/profile`  | Private | Get the logged-in user's profile   |

---

## Sample Postman Requests & Responses

Base URL: `http://localhost:5000`

### 1. Register a New User

- **Method:** `POST`
- **URL:** `http://localhost:5000/api/auth/register`
- **Headers:**
  - `Content-Type: application/json`
- **Body (`raw` -> `JSON`):**
  ```json
  {
    "name": "Alice Johnson",
    "email": "alice@example.com",
    "password": "password123"
  }
  ```

- **Success Response (`201 Created`):**
  ```json
  {
    "message": "User registered successfully.",
    "user": {
      "id": "6745f1234567890abcdef123",
      "name": "Alice Johnson",
      "email": "alice@example.com",
      "createdAt": "2026-11-26T12:45:00.000Z"
    }
  }
  ```

- **Error Response — Duplicate Email (`409 Conflict`):**
  ```json
  {
    "message": "A user with this email already exists."
  }
  ```

- **Error Response — Validation Failure (`400 Bad Request`):**
  ```json
  {
    "message": "Password must be at least 6 characters long."
  }
  ```

---

### 2. Login an Existing User

- **Method:** `POST`
- **URL:** `http://localhost:5000/api/auth/login`
- **Headers:**
  - `Content-Type: application/json`
- **Body (`raw` -> `JSON`):**
  ```json
  {
    "email": "alice@example.com",
    "password": "password123"
  }
  ```

- **Success Response (`200 OK`):**
  ```json
  {
    "message": "Login successful.",
    "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6IjY3NDVmMTIzNDU2Nzg5MGFiY2RlZjEyMyIsImlhdCI6MTczMjYyNTEwMCwiZXhwIjoxNzMyNzExNTAwfQ.exampleSignature",
    "user": {
      "id": "6745f1234567890abcdef123",
      "name": "Alice Johnson",
      "email": "alice@example.com",
      "createdAt": "2026-11-26T12:45:00.000Z"
    }
  }
  ```

- **Error Response — Wrong Credentials (`401 Unauthorized`):**
  ```json
  {
    "message": "Invalid email or password."
  }
  ```

---

### 3. Get Logged-In User's Profile (Protected Route)

- **Method:** `GET`
- **URL:** `http://localhost:5000/api/auth/profile`
- **Headers:**
  - `Authorization: Bearer <your_jwt_token>`

- **Success Response (`200 OK`):**
  ```json
  {
    "user": {
      "id": "6745f1234567890abcdef123",
      "name": "Alice Johnson",
      "email": "alice@example.com",
      "createdAt": "2026-11-26T12:45:00.000Z"
    }
  }
  ```

- **Error Response — Missing Token (`401 Unauthorized`):**
  ```json
  {
    "message": "Access denied. No token provided."
  }
  ```

- **Error Response — Invalid or Expired Token (`401 Unauthorized`):**
  ```json
  {
    "message": "Invalid authentication token."
  }
  ```

---

## How to Test Using Postman (Step-by-Step)

### Step 1: Test Registration
1. Open Postman and click **New** -> **HTTP**.
2. Set the method to **POST** and enter `http://localhost:5000/api/auth/register`.
3. Open the **Body** tab, select **raw**, and choose **JSON** from the dropdown.
4. Paste the sample registration JSON (`name`, `email`, `password`) and click **Send**.
5. Confirm you receive status **`201 Created`** and the user object (note that the password is not returned).
6. Click **Send** a second time with the same email to verify duplicate-email protection returns **`409 Conflict`**.

### Step 2: Test Login
1. Create a new request tab in Postman.
2. Set the method to **POST** and enter `http://localhost:5000/api/auth/login`.
3. Under **Body** -> **raw** -> **JSON**, enter the registered `email` and `password`.
4. Click **Send**.
5. Confirm you receive status **`200 OK`** along with a `token` string in the JSON response.
6. **Copy the `token` value** (without quotes) for the next step.

### Step 3: Test the Protected Profile Route
1. Create a new request tab in Postman.
2. Set the method to **GET** and enter `http://localhost:5000/api/auth/profile`.
3. **First, test without a token:** click **Send** right away and confirm you get **`401 Unauthorized`** (`"Access denied. No token provided."`).
4. **Next, add your JWT token:**
   - Go to the **Authorization** tab.
   - Set **Auth Type** to **Bearer Token**.
   - Paste your copied JWT token into the **Token** field.
   - *(Alternatively, open the **Headers** tab and add a header with Key `Authorization` and Value `Bearer <paste_your_token_here>`.)*
5. Click **Send** and confirm you receive status **`200 OK`** with the logged-in user's profile.

