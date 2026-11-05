# Skill Nexix – Internship Assignments

Welcome to the central repository for the **Full Stack Web Development Internship** assignments at **Skill Nexix**. This repository documents the practical work, hands-on tasks, and mini-projects developed throughout the internship program.

---

## 📌 Internship Overview

- **Intern Name:** Atharv Anil Patil
- **Domain:** Full Stack Web Development
- **Organization / Program:** Skill Nexix
- **Repository:** [https://github.com/Atharv2550/Skill_Nexix.git](https://github.com/Atharv2550/Skill_Nexix.git)

---

## 📂 Repository Structure

The repository is structured week-wise to maintain modularity, clean organization, and traceability:

```text
Skill_Nexix/
│
├── README.md
├── .gitignore
│
└── Week-01/
    ├── Task-01-Personal-Portfolio/
    │   ├── index.html
    │   ├── style.css
    │   ├── assets/
    │   └── README.md
    │
    ├── Task-02-React-Components/
    │   ├── public/
    │   ├── src/
    │   │   ├── assets/
    │   │   ├── components/
    │   │   │   ├── Button.jsx
    │   │   │   ├── Card.jsx
    │   │   │   ├── Footer.jsx
    │   │   │   ├── Form.jsx
    │   │   │   └── Header.jsx
    │   │   ├── App.css
    │   │   ├── App.jsx
    │   │   ├── index.css
    │   │   └── main.jsx
    │   ├── index.html
    │   ├── package.json
    │   ├── package-lock.json
    │   ├── vite.config.js
    │   └── README.md
    │
    └── Task-03-React-BlogSpace/
        ├── public/
        ├── src/
        │   ├── assets/
        │   ├── components/
        │   │   ├── BlogCard.jsx
        │   │   ├── CategoryFilter.jsx
        │   │   ├── Footer.jsx
        │   │   ├── Hero.jsx
        │   │   ├── Navbar.jsx
        │   │   └── SearchBar.jsx
        │   ├── data/
        │   │   └── posts.json
        │   ├── App.css
        │   ├── App.jsx
        │   ├── index.css
        │   └── main.jsx
        ├── index.html
        ├── package.json
        ├── package-lock.json
        ├── vite.config.js
        └── README.md
```

---

## 🚀 Week 1 Assignments Summary

### Task 1: Personal Portfolio Website
- **Folder:** [`Week-01/Task-01-Personal-Portfolio`](./Week-01/Task-01-Personal-Portfolio/)
- **Core Technologies:** HTML5, CSS3, Modern Responsive Layouts.
- **Description:** A clean, accessible, and fully responsive personal developer portfolio website. Features a structured layout including a hero/about introduction, educational background card, featured projects showcase (LibraryVerse, RouteCraft, CampusSync), interactive contact section, and social/GitHub links.
- **Key Features:**
  - Semantic HTML5 document outline.
  - Custom CSS styling with mobile-first media queries (`@media (max-width: 768px)`).
  - Smooth scrolling navigation (`scroll-behavior: smooth`).
  - Card-based layouts with subtle hover elevation and shadow effects.

### Task 2: React Components Practice
- **Folder:** [`Week-01/Task-02-React-Components`](./Week-01/Task-02-React-Components/)
- **Core Technologies:** React 19, Vite, JavaScript (ES6+), CSS3.
- **Description:** A modular React single-page application built to master component-driven architecture, reusable UI building blocks, props passing, and state management.
- **Key Features:**
  - **Modular Architecture:** Separated components for `Header`, `Footer`, `Card`, `Button`, and `Form`.
  - **Props & Dynamic Rendering:** Dynamically maps through project collections using custom props for icons, titles, tech stacks, and descriptions.
  - **State Management:** Interactive contact form with local state handling, real-time input capture, and submission confirmation feedback.
  - **Smooth UX:** Built-in smooth scrolling triggers and interactive states.

### Task 3: React BlogSpace (Mini Project)
- **Folder:** [`Week-01/Task-03-React-BlogSpace`](./Week-01/Task-03-React-BlogSpace/)
- **Core Technologies:** React 19, Vite, Lucide React, JSON Data Store, CSS3.
- **Description:** A modern, feature-rich blog portal web application designed for browsing technical articles. Demonstrates real-world data filtering, reactive state synchronization, modal previews, and modern card UI.
- **Key Features:**
  - **JSON-Driven Data Architecture:** Articles loaded dynamically from an externalized `posts.json` data store.
  - **Live Search Filtering:** Real-time search by title, description, or category with instant feedback.
  - **Dynamic Category Filtering:** Dynamic category pills computed via ES6 `Set` (e.g., All, Web Development, Artificial Intelligence, Database, Cloud Computing).
  - **Article Modal Reader:** Interactive full-article preview popup modal with overlay backdrop dismiss and smooth animations.
  - **Empty State Handling:** Intuitive fallback view with one-click "Clear Filters" when queries yield zero matches.
  - **Responsive UI:** Adaptive multi-column grid layout transitioning from desktop to mobile screens.

---

## 🛠️ Technologies & Tools

- **Languages:** HTML5, CSS3, JavaScript (ES6+)
- **Library / Framework:** React 19
- **Build Tool:** Vite 8
- **Icons:** Lucide React
- **Version Control:** Git, GitHub
- **Package Manager:** npm

---

## 💻 Installation & Execution Instructions

### Prerequisites
Make sure you have [Node.js](https://nodejs.org/) (v18 or higher recommended) and [Git](https://git-scm.com/) installed on your system.

### 1. Clone the Repository
```bash
git clone https://github.com/Atharv2550/Skill_Nexix.git
cd Skill_Nexix
```

### 2. Running Task 1: Personal Portfolio
Task 1 is built with vanilla HTML5 and CSS3 and requires no build tools.
- Simply navigate to `Week-01/Task-01-Personal-Portfolio/`
- Double-click `index.html` to open in any web browser, or serve it using Live Server / python:
  ```bash
  cd Week-01/Task-01-Personal-Portfolio
  # Optional: serve with python
  python -m http.server 3000
  ```

### 3. Running Task 2: React Components Practice
```bash
cd Week-01/Task-02-React-Components
npm install
npm run dev
```
Open your browser at `http://localhost:5173/` (or the URL shown in terminal).

To create a production build:
```bash
npm run build
```

### 4. Running Task 3: React BlogSpace
```bash
cd Week-01/Task-03-React-BlogSpace
npm install
npm run dev
```
Open your browser at `http://localhost:5173/` (or the URL shown in terminal).

To create a production build:
```bash
npm run build
```

---

## 👨‍💻 Developer Information

- **Developer:** Atharv Anil Patil
- **Education:** B.Tech in Computer Science Engineering, D.Y. Patil College of Engineering
- **GitHub:** [@Atharv2550](https://github.com/Atharv2550)
- **Email:** [atharvpatil2773sjghk@gmail.com](mailto:atharvpatil2773sjghk@gmail.com)

---

## 📄 License
This repository is maintained for the Skill Nexix Full Stack Development Internship. All rights reserved &copy; 2026 Atharv Patil.

