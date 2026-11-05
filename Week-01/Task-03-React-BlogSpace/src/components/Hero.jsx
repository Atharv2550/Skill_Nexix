import { ArrowRight, Sparkles } from "lucide-react";

function Hero() {

    return (

        <section className="hero">

            <div className="hero-content">

                <div className="hero-badge">
                    <Sparkles size={15} />
                    Ideas that inspire. Stories that matter.
                </div>

                <h1>
                    Explore Ideas.
                    <br />
                    <span>Discover Perspectives.</span>
                </h1>

                <p>
                    Your daily destination for technology,
                    programming, creativity and ideas that
                    make you think differently.
                </p>

                <a href="#blogs" className="hero-button">
                    Start Exploring
                    <ArrowRight size={18} />
                </a>

                <div className="hero-stats">

                    <div>
                        <h3>100+</h3>
                        <span>Ideas to explore</span>
                    </div>

                    <div>
                        <h3>10+</h3>
                        <span>Topics covered</span>
                    </div>

                    <div>
                        <h3>Daily</h3>
                        <span>Fresh inspiration</span>
                    </div>

                </div>

            </div>

            <div className="hero-visual">

                <div className="hero-image-card">

                    <img
                        src="https://images.unsplash.com/photo-1499750310107-5fef28a66643?w=900"
                        alt="Creative workspace"
                    />

                    <div className="image-overlay">
                        <span>FEATURED STORIES</span>
                        <h3>Ideas worth sharing.</h3>
                    </div>

                </div>

                <div className="floating-card">
                    ✨ Read. Learn. Grow.
                </div>

            </div>

        </section>

    );

}

export default Hero;