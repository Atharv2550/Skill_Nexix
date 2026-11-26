# PulseFeed — Social Media Feed Application

A complete, full-stack MERN (MongoDB, Express.js, React, Node.js) Social Media Feed Application featuring secure HttpOnly JWT authentication, post creation with image uploads, real-time feed updates via Socket.IO, likes, comments, and editable user profiles.

---

## 1. Project Overview

**PulseFeed** is a modern, responsive social networking platform built as a Week 4 Major Project. Users can register and log in securely, publish text and image posts, browse a reverse-chronological community feed with pagination, like and comment on posts, manage their own content, and customize their user profiles—all with instant real-time synchronization across connected clients using Socket.IO.

---

## 2. Project Objectives

- Build a clean, modular full-stack MERN application using **MVC architecture** on the backend and component-driven **React + Vite + Tailwind CSS** on the frontend.
- Implement secure user authentication using **bcrypt** password hashing, **JWT** tokens, and **HttpOnly cookies**.
- Support image uploads (JPG, JPEG, PNG, WEBP up to 5 MB) stored on disk via **Multer** and served statically by Express.
- Enforce strict authorization and ownership rules so users can only edit or delete their own posts, comments, and profile information.
- Deliver real-time updates (new posts, edits, deletions, likes, and comments) via authenticated **Socket.IO** connections.

---

## 3. Main Features

- **User Authentication & Session Persistence**
  - Registration with Full Name, Username, Email, Password, and Confirm Password.
  - Duplicate email and username prevention.
  - Password hashing with `bcrypt` and session persistence via `HttpOnly` JWT cookies.
  - Protected frontend routes and backend API middleware.
- **Home Feed**
  - Reverse-chronological feed fetched from MongoDB with "Load More" pagination.
  - Post composer with live image preview, file validation, and character counter.
  - Loading skeletons, empty-feed states, and error recovery states.
- **Post Management**
  - Create text-only or image+text posts.
  - Edit and delete your own posts (with confirmation modal).
  - Automatic cleanup of uploaded image files and associated comments upon deletion.
- **Likes & Comments**
  - Atomic like/unlike (`$addToSet` / `$pull`) preventing duplicate likes.
  - Expandable comment threads with author `@username`, timestamps, and owner-only deletion.
- **User Profiles**
  - View any user's profile, bio, avatar, post count, join date, and published posts.
  - Edit your own profile details and upload/update your profile picture.
- **Real-Time Updates (Socket.IO)**
  - Authenticated WebSocket/polling connections.
  - Live broadcast of `post:created`, `post:updated`, `post:deleted`, `post:liked`, `comment:created`, and `comment:deleted` events after successful database writes.

---

## 4. Technology Stack

### Frontend
- **React 19** with **Vite**
- **JavaScript (ES Modules)**
- **Tailwind CSS**
- **React Router DOM**
- **Axios** (`withCredentials: true`)
- **React Context API** (`AuthContext`, `SocketContext`)
- **Socket.IO Client**
- **Lucide React** (icons)

### Backend
- **Node.js** & **Express.js**
- **MongoDB** & **Mongoose**
- **JWT (`jsonwebtoken`)** & **Cookie Parser**
- **bcrypt**
- **Multer** (multipart/form-data image uploads)
- **Socket.IO**
- **CORS** & **dotenv**

---

## 5. Project Architecture

The application follows a decoupled client-server architecture:

1. **Frontend (React + Vite)** renders the UI, manages authentication and socket state via React Context, validates inputs and image files client-side, and communicates with the backend through reusable Axios service modules (`services/`).
2. **Backend (Express MVC)** separates concerns into:
   - **Routes** (`routes/`) — map HTTP endpoints and attach auth/upload middleware.
   - **Middleware** (`middleware/`) — verify JWT cookies, validate/store Multer uploads, and centralize error formatting.
   - **Controllers** (`controllers/`) — execute business logic, ownership checks, MongoDB operations, and emit Socket.IO events.
   - **Models** (`models/`) — define Mongoose schemas, validation rules, indexes, and password hooks.
3. **Database (MongoDB)** stores `User`, `Post`, and `Comment` documents, while uploaded images are saved locally under `backend/uploads/` and served at `/uploads/...`.
4. **Real-Time Layer (Socket.IO)** shares the HTTP server with Express, authenticates handshakes using the `token` cookie, and broadcasts updates only after database operations succeed.

---

## 6. Folder Structure

```text
Social Media Feed Application/
├── .gitignore
├── README.md
├── backend/
│   ├── config/
│   │   └── db.js
│   ├── controllers/
│   │   ├── authController.js
│   │   ├── commentController.js
│   │   ├── postController.js
│   │   └── userController.js
│   ├── middleware/
│   │   ├── authMiddleware.js
│   │   ├── errorMiddleware.js
│   │   └── uploadMiddleware.js
│   ├── models/
│   │   ├── Comment.js
│   │   ├── Post.js
│   │   └── User.js
│   ├── routes/
│   │   ├── authRoutes.js
│   │   ├── postRoutes.js
│   │   └── userRoutes.js
│   ├── uploads/
│   │   ├── avatars/
│   │   ├── posts/
│   │   └── .gitkeep
│   ├── utils/
│   │   ├── fileHelper.js
│   │   ├── generateToken.js
│   │   ├── postHelper.js
│   │   └── validators.js
│   ├── .env.example
│   ├── .gitignore
│   ├── package.json
│   └── server.js
└── frontend/
    ├── src/
    │   ├── assets/
    │   │   └── logo.svg
    │   ├── components/
    │   │   ├── AppLayout.jsx
    │   │   ├── Avatar.jsx
    │   │   ├── CommentSection.jsx
    │   │   ├── ConfirmModal.jsx
    │   │   ├── CreatePost.jsx
    │   │   ├── EditPostModal.jsx
    │   │   ├── EditProfileModal.jsx
    │   │   ├── MobileNav.jsx
    │   │   ├── PostCard.jsx
    │   │   ├── PostSkeleton.jsx
    │   │   ├── ProtectedRoute.jsx
    │   │   └── Sidebar.jsx
    │   ├── context/
    │   │   ├── AuthContext.jsx
    │   │   └── SocketContext.jsx
    │   ├── hooks/
    │   │   ├── useAuth.js
    │   │   ├── usePostsFeed.js
    │   │   └── useSocket.js
    │   ├── pages/
    │   │   ├── HomePage.jsx
    │   │   ├── LoginPage.jsx
    │   │   ├── NotFoundPage.jsx
    │   │   ├── ProfilePage.jsx
    │   │   └── RegisterPage.jsx
    │   ├── services/
    │   │   ├── api.js
    │   │   ├── authService.js
    │   │   ├── postService.js
    │   │   └── userService.js
    │   ├── utils/
    │   │   ├── formatDate.js
    │   │   └── mediaUrl.js
    │   ├── App.jsx
    │   ├── index.css
    │   └── main.jsx
    ├── .env.example
    ├── .gitignore
    ├── index.html
    ├── package.json
    ├── postcss.config.js
    ├── tailwind.config.js
    └── vite.config.js
```

---

## 7. Database Models

### `User` (`backend/models/User.js`)
| Field | Type | Notes |
|---|---|---|
| `fullName` | `String` | Required, 2–60 chars |
| `username` | `String` | Required, unique, lowercase, 3–30 chars (`[a-zA-Z0-9_]`) |
| `email` | `String` | Required, unique, lowercase, valid email |
| `password` | `String` | Required, min 6 chars, hashed via `bcrypt`, `select: false` |
| `bio` | `String` | Optional, max 250 chars |
| `profilePicture` | `String` | Optional path (e.g., `/uploads/avatars/...`) |
| `createdAt` / `updatedAt` | `Date` | Auto-managed by Mongoose timestamps |

### `Post` (`backend/models/Post.js`)
| Field | Type | Notes |
|---|---|---|
| `user` | `ObjectId` | Ref `User`, required, indexed |
| `content` | `String` | Optional if `image` is provided, max 2000 chars |
| `image` | `String` | Optional path (e.g., `/uploads/posts/...`) |
| `likes` | `[ObjectId]` | Array of `User` IDs |
| `createdAt` / `updatedAt` | `Date` | Indexed `{ createdAt: -1 }` for feed sorting |

### `Comment` (`backend/models/Comment.js`)
| Field | Type | Notes |
|---|---|---|
| `post` | `ObjectId` | Ref `Post`, required, indexed |
| `user` | `ObjectId` | Ref `User`, required |
| `text` | `String` | Required, 1–1000 chars |
| `createdAt` / `updatedAt` | `Date` | Auto-managed by Mongoose timestamps |

**Relationships:**
- One `User` → Many `Post`s (`Post.user` references `User._id`)
- One `User` → Many `Comment`s (`Comment.user` references `User._id`)
- One `Post` → Many `Comment`s (`Comment.post` references `Post._id`)
- Many `User`s ↔ Many `Post`s via `Post.likes` array

---

## 8. API Endpoint Documentation

Base URL: `http://localhost:5000/api`

### Authentication
| Method | Endpoint | Access | Description |
|---|---|---|---|
| `POST` | `/auth/register` | Public | Register user & set `HttpOnly` JWT cookie |
| `POST` | `/auth/login` | Public | Authenticate user & set `HttpOnly` JWT cookie |
| `POST` | `/auth/logout` | Public | Clear authentication cookie |
| `GET` | `/auth/me` | Private | Get currently authenticated user |

### Users & Profiles
| Method | Endpoint | Access | Description |
|---|---|---|---|
| `GET` | `/users/:id` | Private | Get user profile & total post count |
| `PUT` | `/users/profile` | Private | Update logged-in user's name, username, bio, or `profilePicture` |
| `GET` | `/users/:id/posts` | Private | Get paginated posts created by user `:id` |

### Posts
| Method | Endpoint | Access | Description |
|---|---|---|---|
| `POST` | `/posts` | Private | Create post (`content` and/or `image` via `multipart/form-data`) |
| `GET` | `/posts?page=1&limit=10` | Private | Get paginated feed posts (newest first) |
| `GET` | `/posts/:id` | Private | Get single post by ID |
| `PUT` | `/posts/:id` | Private (Owner) | Update post text and/or image |
| `DELETE` | `/posts/:id` | Private (Owner) | Delete post, its comments, and uploaded image |

### Likes
| Method | Endpoint | Access | Description |
|---|---|---|---|
| `POST` | `/posts/:id/like` | Private | Like a post (duplicate-safe) |
| `DELETE` | `/posts/:id/like` | Private | Unlike a post |

### Comments
| Method | Endpoint | Access | Description |
|---|---|---|---|
| `POST` | `/posts/:id/comments` | Private | Add a comment to post `:id` |
| `GET` | `/posts/:id/comments` | Private | List all comments for post `:id` |
| `DELETE` | `/posts/:id/comments/:commentId` | Private (Owner) | Delete own comment |

---

## 9. Installation Instructions

### Prerequisites
- **Node.js** v18+ and **npm**
- **MongoDB** (local MongoDB Community Server or MongoDB Atlas connection string)

### 1. Clone or open the project
```bash
cd "Social Media Feed Application"
```

### 2. Install backend dependencies
```bash
cd backend
npm install
```

### 3. Install frontend dependencies
```bash
cd ../frontend
npm install
```

---

## 10. Environment Variable Configuration

### Backend (`backend/.env`)
Copy `backend/.env.example` to `backend/.env` and update values as needed:

```env
PORT=5000
NODE_ENV=development
MONGO_URI=mongodb://127.0.0.1:27017/social_media_feed
JWT_SECRET=replace_with_a_strong_random_secret_key
JWT_EXPIRES_IN=7d
CLIENT_URL=http://localhost:5173
```

### Frontend (`frontend/.env`)
Copy `frontend/.env.example` to `frontend/.env`:

```env
VITE_API_URL=http://localhost:5000
```

> **Note:** Never commit `.env` files or real credentials to version control.

---

## 11. Running the Application Locally

### Run Backend
```bash
cd backend
npm run dev
```
The API and Socket.IO server will start on `http://localhost:5000`.

### Run Frontend
Open a second terminal:
```bash
cd frontend
npm run dev
```
The React app will start on `http://localhost:5173`.

---

## 12. How to Test Using Postman

Because authentication uses an `HttpOnly` cookie (`token`), Postman automatically stores the cookie from `/api/auth/register` or `/api/auth/login` in its Cookie Jar and sends it on subsequent requests to `http://localhost:5000`.

### 1) Register a User
- **Request:** `POST http://localhost:5000/api/auth/register`
- **Headers:** `Content-Type: application/json`
- **Body (raw JSON):**
```json
{
  "fullName": "Alex Morgan",
  "username": "alex_morgan",
  "email": "alex@example.com",
  "password": "password123",
  "confirmPassword": "password123"
}
```
- **Sample Response (`201 Created`):**
```json
{
  "success": true,
  "message": "Account created successfully.",
  "user": {
    "_id": "6745a1b2c3d4e5f601234567",
    "fullName": "Alex Morgan",
    "username": "alex_morgan",
    "email": "alex@example.com",
    "bio": "",
    "profilePicture": "",
    "createdAt": "2026-11-26T13:45:00.000Z",
    "updatedAt": "2026-11-26T13:45:00.000Z"
  }
}
```

### 2) Login
- **Request:** `POST http://localhost:5000/api/auth/login`
- **Body (raw JSON):**
```json
{
  "email": "alex@example.com",
  "password": "password123"
}
```
- **Sample Response (`200 OK`):**
```json
{
  "success": true,
  "message": "Logged in successfully.",
  "user": {
    "_id": "6745a1b2c3d4e5f601234567",
    "fullName": "Alex Morgan",
    "username": "alex_morgan",
    "email": "alex@example.com",
    "bio": "",
    "profilePicture": ""
  }
}
```

### 3) Get Current Authenticated User
- **Request:** `GET http://localhost:5000/api/auth/me`
- **Sample Response (`200 OK`):**
```json
{
  "success": true,
  "user": {
    "_id": "6745a1b2c3d4e5f601234567",
    "fullName": "Alex Morgan",
    "username": "alex_morgan",
    "email": "alex@example.com",
    "bio": "",
    "profilePicture": ""
  }
}
```

### 4) Create a Post (with Optional Image)
- **Request:** `POST http://localhost:5000/api/posts`
- **Body (`form-data`):**
  - `content` (Text): `"Hello PulseFeed! Sharing my first post."`
  - `image` (File): select a `.jpg`, `.jpeg`, `.png`, or `.webp` file (max 5 MB)
- **Sample Response (`201 Created`):**
```json
{
  "success": true,
  "message": "Post published successfully.",
  "post": {
    "_id": "6745a2c3d4e5f601234568",
    "user": {
      "_id": "6745a1b2c3d4e5f601234567",
      "fullName": "Alex Morgan",
      "username": "alex_morgan",
      "profilePicture": ""
    },
    "content": "Hello PulseFeed! Sharing my first post.",
    "image": "/uploads/posts/image-1732628700000-123456789.png",
    "likes": [],
    "likesCount": 0,
    "commentsCount": 0,
    "createdAt": "2026-11-26T13:50:00.000Z",
    "updatedAt": "2026-11-26T13:50:00.000Z"
  }
}
```

### 5) Get Feed Posts (Paginated)
- **Request:** `GET http://localhost:5000/api/posts?page=1&limit=10`
- **Sample Response (`200 OK`):**
```json
{
  "success": true,
  "posts": [
    {
      "_id": "6745a2c3d4e5f601234568",
      "user": {
        "_id": "6745a1b2c3d4e5f601234567",
        "fullName": "Alex Morgan",
        "username": "alex_morgan",
        "profilePicture": ""
      },
      "content": "Hello PulseFeed! Sharing my first post.",
      "image": "/uploads/posts/image-1732628700000-123456789.png",
      "likes": [],
      "likesCount": 0,
      "commentsCount": 0,
      "createdAt": "2026-11-26T13:50:00.000Z"
    }
  ],
  "pagination": {
    "page": 1,
    "limit": 10,
    "totalPosts": 1,
    "totalPages": 1,
    "hasMore": false
  }
}
```

### 6) Edit & Delete a Post
- **Edit Request:** `PUT http://localhost:5000/api/posts/6745a2c3d4e5f601234568`
- **Body (`form-data` or `raw JSON`):** `{ "content": "Updated post text!" }`
- **Delete Request:** `DELETE http://localhost:5000/api/posts/6745a2c3d4e5f601234568`
- **Sample Delete Response (`200 OK`):**
```json
{
  "success": true,
  "message": "Post deleted successfully.",
  "postId": "6745a2c3d4e5f601234568"
}
```

### 7) Like & Unlike a Post
- **Like Request:** `POST http://localhost:5000/api/posts/6745a2c3d4e5f601234568/like`
- **Unlike Request:** `DELETE http://localhost:5000/api/posts/6745a2c3d4e5f601234568/like`
- **Sample Response (`200 OK`):**
```json
{
  "success": true,
  "postId": "6745a2c3d4e5f601234568",
  "likes": ["6745a1b2c3d4e5f601234567"],
  "likesCount": 1,
  "userId": "6745a1b2c3d4e5f601234567"
}
```

### 8) Add, List, and Delete Comments
- **Add Comment:** `POST http://localhost:5000/api/posts/6745a2c3d4e5f601234568/comments`
  - Body: `{ "text": "Great post!" }`
  - Response (`201 Created`):
```json
{
  "success": true,
  "message": "Comment added.",
  "comment": {
    "_id": "6745a3d4e5f601234569",
    "post": "6745a2c3d4e5f601234568",
    "user": {
      "_id": "6745a1b2c3d4e5f601234567",
      "fullName": "Alex Morgan",
      "username": "alex_morgan",
      "profilePicture": ""
    },
    "text": "Great post!",
    "createdAt": "2026-11-26T13:52:00.000Z"
  },
  "commentsCount": 1
}
```
- **Get Comments:** `GET http://localhost:5000/api/posts/6745a2c3d4e5f601234568/comments`
- **Delete Comment:** `DELETE http://localhost:5000/api/posts/6745a2c3d4e5f601234568/comments/6745a3d4e5f601234569`

### 9) Update Profile & View User Profile
- **Update Profile:** `PUT http://localhost:5000/api/users/profile`
  - Body (`form-data`): `fullName`, `username`, `bio`, `profilePicture` (File)
- **Get Profile:** `GET http://localhost:5000/api/users/6745a1b2c3d4e5f601234567`
- **Get User Posts:** `GET http://localhost:5000/api/users/6745a1b2c3d4e5f601234567/posts?page=1&limit=10`

---

## 13. Screenshots

> Add screenshots of your running application before academic submission:
- `Login & Registration Pages`
- `Home Feed with Image Posts & Live Socket Status`
- `Comment Thread & Like Interactions`
- `User Profile & Edit Profile Modal`

---

## 14. Future Enhancements

- User follow/unfollow system and personalized "Following" feed tab.
- Real-time notifications bell for likes and comments.
- User search and hashtag discovery.
- Cloud object storage (e.g., S3 or Cloudinary) for production media persistence.
- Direct messaging between users.

