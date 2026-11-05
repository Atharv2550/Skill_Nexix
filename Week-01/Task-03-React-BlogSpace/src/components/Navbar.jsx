import { BookOpen, Search, Menu } from "lucide-react";

function Navbar({ search, setSearch }) {

    return (

        <header className="navbar">

            <div className="nav-container">

                <a href="#" className="logo">
                    <BookOpen size={27} />
                    <span>Blog<span className="logo-highlight">Space</span></span>
                </a>

                <nav className="nav-links">
                    <a href="#">Home</a>
                    <a href="#blogs">Explore</a>
                    <a href="#about">About</a>
                </nav>

                <div className="nav-actions">

                    <div className="nav-search">
                        <Search size={17} />

                        <input
                            type="text"
                            placeholder="Search articles..."
                            value={search}
                            onChange={(e) => setSearch(e.target.value)}
                        />

                    </div>

                    <a href="#blogs" className="write-btn">
                        Explore Blogs
                    </a>

                </div>

                <Menu className="mobile-menu" size={25} />

            </div>

        </header>

    );
}

export default Navbar;