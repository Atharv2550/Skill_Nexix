function Card({ title, description, tech, icon }) {

    return (

        <div className="project-card">

            <div className="card-top">

                <div className="project-icon">
                    {icon}
                </div>

                <span className="project-status">
                    ● Completed
                </span>

            </div>

            <h3>{title}</h3>

            <p>{description}</p>

            <div className="tech-stack">
                {tech}
            </div>

            <div className="card-footer">

                <span>View Project</span>

                <span className="arrow">↗</span>

            </div>

        </div>

    );

}

export default Card;