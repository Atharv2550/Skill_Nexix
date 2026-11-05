import Header from "./components/Header";
import Footer from "./components/Footer";
import Card from "./components/Card";
import Button from "./components/Button";
import Form from "./components/Form";

import "./App.css";

function App() {

    const projects = [
        {
            title: "LibraryVerse",
            description: "A smart library management system built using MERN stack with role-based authentication.",
            tech: "React • Node.js • MongoDB",
            icon: "📚"
        },
        {
            title: "RouteCraft",
            description: "An intelligent travel planning platform for discovering destinations and organizing trips.",
            tech: "React • Express • MongoDB",
            icon: "✈️"
        },
        {
            title: "CampusSync",
            description: "A smart campus community platform connecting students, faculty and administrators.",
            tech: "MERN Stack",
            icon: "🎓"
        }
    ];

    return (
        <div className="app">

            <Header />

            {/* Hero Section */}

            <section className="hero">

                <div className="hero-content">

                    <span className="badge">
                        ✨ React Developer
                    </span>

                    <h1>
                        Welcome to <span>React Practice</span>
                    </h1>

                    <p>
                        Building beautiful, responsive and reusable
                        interfaces with React components.
                    </p>

                    <Button
                        text="Explore Projects ↓"
                        onClick={() =>
                            document.getElementById("projects")
                            .scrollIntoView({ behavior: "smooth" })
                        }
                    />

                </div>

            </section>

            {/* Projects Section */}

            <section className="projects" id="projects">

                <div className="section-heading">

                    <span>MY WORK</span>

                    <h2>Featured Projects</h2>

                    <p>
                        Some applications I have developed.
                    </p>

                </div>

                <div className="project-grid">

                    {projects.map((project, index) => (

                        <Card
                            key={index}
                            title={project.title}
                            description={project.description}
                            tech={project.tech}
                            icon={project.icon}
                        />

                    ))}

                </div>

            </section>

            {/* Contact Section */}

            <section className="contact" id="contact">

                <div className="section-heading">

                    <span>GET IN TOUCH</span>

                    <h2>Let's Connect</h2>

                    <p>
                        Have a project or opportunity?
                        Feel free to contact me.
                    </p>

                </div>

                <Form />

            </section>

            <Footer />

        </div>
    );
}

export default App;