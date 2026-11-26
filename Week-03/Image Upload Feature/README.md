# Image Upload Application

A simple, beginner-friendly full-stack Image Upload Application built with **React.js** (Vite), **Axios**, **Node.js**, **Express.js**, and **Multer** (disk storage).

## Features

- Select an image (`JPG`, `JPEG`, `PNG`, or `WEBP`, max `5 MB`)
- Preview the selected image before uploading
- Client-side and server-side validation for empty selection, invalid file formats, and oversized files
- Upload images via Axios using `FormData` (`multipart/form-data`)
- Store uploaded files locally on disk in `backend/uploads/`
- Serve uploaded images statically from Express and display the uploaded image using its returned URL
- Reset / upload another image easily

## Project Structure

```text
Image Upload Feature/
├── backend/
│   ├── uploads/          # Stored uploaded images
│   ├── package.json
│   └── server.js         # Express server + Multer upload API
├── frontend/
│   ├── src/
│   │   ├── App.css
│   │   ├── App.jsx       # Upload UI, preview, Axios integration
│   │   └── main.jsx
│   ├── index.html
│   ├── package.json
│   └── vite.config.js
└── README.md
```

## Prerequisites

- [Node.js](https://nodejs.org/) (v18 or higher recommended)
- `npm` (comes with Node.js)

## Installation & Running Locally

You will need two terminal windows: one for the backend server and one for the React frontend.

### 1. Start the Backend (Express + Multer)

```bash
cd backend
npm install
npm start
```

The backend server will run on `http://localhost:5000`.

- Upload endpoint: `POST http://localhost:5000/api/upload` (form field name: `image`)
- Static images URL: `http://localhost:5000/uploads/<filename>`

### 2. Start the Frontend (React + Vite)

Open a new terminal in the project root:

```bash
cd frontend
npm install
npm run dev
```

The React app will run on `http://localhost:5173`. Open this URL in your browser.

## API Response Format

### Successful Upload (`201 Created`)

```json
{
  "message": "Image uploaded successfully!",
  "filename": "photo-1732620000000-123456.png",
  "imageUrl": "http://localhost:5000/uploads/photo-1732620000000-123456.png"
}
```

### Error Response (`400 Bad Request`)

```json
{
  "message": "Invalid file format. Only JPG, JPEG, PNG, and WEBP images are allowed."
}
```

