import { BookOpen } from "lucide-react";

function Footer() {

    return (

        <footer className="footer" id="about">

            <div className="footer-main">

                <div className="footer-brand">

                    <h2>
                        <BookOpen size={25} />
                        BlogSpace
                    </h2>

                    <p>
                        A place where ideas meet creativity.
                        Read, explore and discover something new.
                    </p>

                </div>

                <div className="footer-links">

                    <h3>Explore</h3>

                    <a href="#blogs">Latest Blogs</a>
                    <a href="#blogs">Technology</a>
                    <a href="#blogs">Programming</a>

                </div>

                <div className="footer-links">

                    <h3>Connect</h3>

                    <a href="https://github.com/" target="_blank" rel="noreferrer">
                        <span>GH</span> GitHub
                    </a>

                    <a href="https://linkedin.com/" target="_blank" rel="noreferrer">
                        <span>in</span> LinkedIn
                    </a>

                    <a href="https://instagram.com/" target="_blank" rel="noreferrer">
                        <span>◎</span> Instagram
                    </a>

                </div>

            </div>

            <div className="footer-bottom">

                © 2026 BlogSpace. All rights reserved.
                Built with React.

            </div>

        </footer>

    );

}

export default Footer;