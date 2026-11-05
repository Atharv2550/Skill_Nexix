import { useState } from "react";

import Navbar from "./components/Navbar";
import Hero from "./components/Hero";
import BlogCard from "./components/BlogCard";
import SearchBar from "./components/SearchBar";
import CategoryFilter from "./components/CategoryFilter";
import Footer from "./components/Footer";

import posts from "./data/posts.json";

import { ArrowUpRight, X } from "lucide-react";

import "./App.css";

function App() {

    // Search State
    const [search, setSearch] = useState("");

    // Category State
    const [selectedCategory, setSelectedCategory] = useState("All");

    // Selected Blog State
    const [selectedPost, setSelectedPost] = useState(null);

    // Dynamic Categories
    const categories = [
        "All",
        ...new Set(posts.map((post) => post.category))
    ];

    // Search and Filter Logic
    const filteredPosts = posts.filter((post) => {

        const searchText = search.toLowerCase();

        const matchesSearch =
            post.title.toLowerCase().includes(searchText) ||
            post.description.toLowerCase().includes(searchText) ||
            post.category.toLowerCase().includes(searchText);

        const matchesCategory =
            selectedCategory === "All" ||
            post.category === selectedCategory;

        return matchesSearch && matchesCategory;

    });

    return (

        <div className="app">

            {/* Navigation */}
            <Navbar
                search={search}
                setSearch={setSearch}
            />

            {/* Hero Section */}
            <Hero />

            {/* Blog Section */}
            <main className="blog-section" id="blogs">

                <SearchBar
                    search={search}
                    setSearch={setSearch}
                />

                <CategoryFilter
                    categories={categories}
                    selectedCategory={selectedCategory}
                    setSelectedCategory={setSelectedCategory}
                />

                <div className="results-heading">

                    <h2>
                        {selectedCategory === "All"
                            ? "Latest Articles"
                            : selectedCategory + " Articles"}
                    </h2>

                    <span>
                        {filteredPosts.length} articles found
                    </span>

                </div>

                {/* Dynamic Blog Cards */}

                <div className="blog-grid">

                    {filteredPosts.length > 0 ? (

                        filteredPosts.map((post) => (

                            <BlogCard
                                key={post.id}
                                post={post}
                                onReadMore={setSelectedPost}
                            />

                        ))

                    ) : (

                        <div className="empty-state">

                            <h2>🔍 No Articles Found</h2>

                            <p>
                                Try searching with another keyword
                                or selecting a different category.
                            </p>

                            <button
                                onClick={() => {
                                    setSearch("");
                                    setSelectedCategory("All");
                                }}
                            >
                                Clear Filters
                            </button>

                        </div>

                    )}

                </div>

            </main>

            {/* Read More Modal */}

            {selectedPost && (

                <div
                    className="modal-overlay"
                    onClick={() => setSelectedPost(null)}
                >

                    <div
                        className="blog-modal"
                        onClick={(e) => e.stopPropagation()}
                    >

                        <button
                            className="modal-close"
                            onClick={() => setSelectedPost(null)}
                        >
                            <X size={22} />
                        </button>

                        <img
                            src={selectedPost.image}
                            alt={selectedPost.title}
                        />

                        <span className="modal-category">
                            {selectedPost.category}
                        </span>

                        <h2>{selectedPost.title}</h2>

                        <p className="modal-meta">
                            By {selectedPost.author} • {selectedPost.readTime}
                        </p>

                        <p className="modal-description">
                            {selectedPost.description}
                        </p>

                        <button
                            className="modal-button"
                            onClick={() => setSelectedPost(null)}
                        >
                            Back to Articles
                            <ArrowUpRight size={17} />
                        </button>

                    </div>

                </div>

            )}

            {/* Footer */}
            <Footer />

        </div>

    );

}

export default App;