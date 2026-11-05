# Task 03: React BlogSpace (Mini Project)

A modern, responsive technical blog web application built with React and Vite. Features JSON-driven article management, real-time live search, dynamic category filtering, reading time estimates, and an interactive full-article reader modal. Developed as part of the Skill Nexix Full Stack Development Internship (Week 1).

---

## 📌 Project Overview

BlogSpace is a mini project developed to simulate a production-grade content platform. It emphasizes client-side state synchronization, structured JSON data consumption, multi-criteria filtering, accessible modal interactions, and modern UI/UX design patterns.

---

## ✨ Features

- **JSON-Based Data Architecture:** Articles are stored and managed in a clean, structured JSON file (`posts.json`) including metadata: title, description, category, author, date, read time, and banner images.
- **Real-Time Search:** Instant filtering across article titles, descriptions, and categories as the user types.
- **Dynamic Category Filtering:** Categories are automatically derived from the dataset using ES6 `Set`, allowing effortless addition of new topics.
- **Article Reader Modal:** Clicking "Read More" opens a responsive dialog modal displaying the complete article content, hero image, author details, and category tags without page reload.
- **Article Counter & Status:** Dynamic header displaying real-time match count based on active search queries and selected category.
- **Empty State Experience:** Clean fallback screen displayed when no articles match search or category criteria, with a single-click "Clear Filters" action.
- **Modern Responsive Design:** Multi-column responsive grid built using CSS Grid and Flexbox, fully optimized for mobile, tablet, and desktop viewports.
- **Clean Component Architecture:** Well-organized components:
  - `Navbar.jsx`: Header brand navigation and integrated search shortcut.
  - `Hero.jsx`: Engaging banner introducing the platform.
  - `SearchBar.jsx`: Input component with search icon and real-time query synchronization.
  - `CategoryFilter.jsx`: Filter pills with active state indication.
  - `BlogCard.jsx`: Individual article presentation card with image, tag, metadata, and CTA.
  - `Footer.jsx`: Platform footer with quick links and copyright info.

---

## 🛠️ Technologies Used

- **React 19:** Functional components, reactive hooks (`useState`).
- **Vite 8:** Modern development tooling and fast build pipeline.
- **Lucide React:** Modern, scalable vector icon library.
- **JSON:** Client-side data store for blog articles.
- **CSS3:** Custom styles, CSS variables, Grid/Flexbox layout, glassmorphism, and animations.

---

## 📁 File Structure

```text
Task-03-React-BlogSpace/
├── public/
│   ├── favicon.svg
│   └── icons.svg
├── src/
│   ├── assets/
│   │   ├── hero.png
│   │   ├── react.svg
│   │   └── vite.svg
│   ├── components/
│   │   ├── BlogCard.jsx        # Article card component
│   │   ├── CategoryFilter.jsx  # Category selection pills
│   │   ├── Footer.jsx          # Site footer
│   │   ├── Hero.jsx            # Banner section
│   │   ├── Navbar.jsx          # Site navigation bar
│   │   └── SearchBar.jsx       # Interactive search input
│   ├── data/
│   │   └── posts.json          # Article database in JSON format
│   ├── App.css                 # Application styling
│   ├── App.jsx                 # Main application logic & modal
│   ├── index.css               # Global base styles
│   └── main.jsx                # React root mount
├── index.html                  # HTML entry point
├── package.json                # Project dependencies and scripts
├── package-lock.json           # Locked dependency versions
├── vite.config.js              # Vite bundler configuration
└── README.md                   # Project documentation
```

---

## 🚀 How to Run

### Prerequisites
Ensure you have [Node.js](https://nodejs.org/) (v18+) installed.

### 1. Navigate to the project directory
```bash
cd Week-01/Task-03-React-BlogSpace
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

