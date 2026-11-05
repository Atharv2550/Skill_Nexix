function Header() {

    return (

        <header className="navbar">

            <div className="logo">
                React<span>Practice.</span>
            </div>

            <nav>

                <a href="#home">Home</a>

                <a href="#projects">Projects</a>

                <a href="#contact">Contact</a>

            </nav>

            <a href="#contact" className="nav-button">
                Let's Talk ↗
            </a>

        </header>

    );
}

export default Header;