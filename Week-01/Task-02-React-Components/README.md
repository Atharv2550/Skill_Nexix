# Task 02: React Components Practice

A modern React application demonstrating modular component-driven architecture, reusable building blocks, props communication, state management, and dynamic rendering. Developed as part of the Skill Nexix Full Stack Development Internship (Week 1).

---

## 📌 Project Overview

This assignment focuses on mastering foundational React concepts:
- Breaking a user interface down into isolated, reusable components.
- Passing data and behavior between components using React `props`.
- Managing local interactive component state using the `useState` hook.
- Rendering collections dynamically using array mapping.

---

## ✨ Features & Component Breakdown

1. **Header Component (`Header.jsx`)**
   - Brand logo / title display.
   - Smooth navigation menu links (`#projects`, `#contact`).

2. **Hero Section**
   - Introductory developer badge, headline, and subtext.
   - Smooth call-to-action button linking directly to the projects section.

3. **Card Component (`Card.jsx`)**
   - Reusable card with dynamic props: `title`, `description`, `tech`, and `icon`.
   - Hover effects, tag styling, and responsive layout.

4. **Button Component (`Button.jsx`)**
   - Configurable button component supporting custom `text`, click handlers (`onClick`), and type attributes.

5. **Form Component (`Form.jsx`)**
   - Interactive contact form with controlled form inputs (`name`, `email`, `message`).
   - Local state management using `useState`.
   - Real-time submission handling with success status messaging and form reset.

6. **Footer Component (`Footer.jsx`)**
   - Social links, navigation shortcuts, and copyright information.

7. **Dynamic Rendering (`App.jsx`)**
   - Projects rendered dynamically from a JavaScript array of objects via `.map()`.

---

## 🛠️ Technologies Used

- **React 19:** Modern functional components and hooks (`useState`).
- **Vite 8:** Lightning-fast frontend build tool and dev server.
- **JavaScript (ES6+):** Arrow functions, array mapping, destructuring, and template literals.
- **CSS3:** Custom styles, CSS Grid, Flexbox, transitions, and media queries.

---

## 📁 File Structure

```text
Task-02-React-Components/
├── public/
│   ├── favicon.svg
│   └── icons.svg
├── src/
│   ├── assets/
│   │   ├── hero.png
│   │   ├── react.svg
│   │   └── vite.svg
│   ├── components/
│   │   ├── Button.jsx       # Reusable button component
│   │   ├── Card.jsx         # Project showcase card
│   │   ├── Footer.jsx       # App footer
│   │   ├── Form.jsx         # Controlled contact form with state
│   │   └── Header.jsx       # Navigation header
│   ├── App.css              # Main application styling
│   ├── App.jsx              # Root component assembling sections
│   ├── index.css            # Base global styles
│   └── main.jsx             # React entry point
├── index.html               # Vite HTML entry point
├── package.json             # Scripts & dependencies
├── package-lock.json        # Exact dependency lockfile
├── vite.config.js           # Vite configuration
└── README.md                # Task documentation
```

---

## 🚀 How to Run

### Prerequisites
Make sure you have [Node.js](https://nodejs.org/) (v18+) installed.

### 1. Navigate to the project directory
```bash
cd Week-01/Task-02-React-Components
```

### 2. Install dependencies
```bash
npm install
```

### 3. Start the development server
```bash
npm run dev
```
Open your browser and navigate to `http://localhost:5173/` (or the URL displayed in the terminal).

### 4. Build for production
```bash
npm run build
```

---

## 👨‍💻 Author

- **Atharv Anil Patil**
- GitHub: [@Atharv2550](https://github.com/Atharv2550)
- Email: [atharvpatil2773sjghk@gmail.com](mailto:atharvpatil2773sjghk@gmail.com)

