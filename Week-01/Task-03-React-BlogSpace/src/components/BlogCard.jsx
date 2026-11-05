import { ArrowUpRight, Clock } from "lucide-react";

function BlogCard({ post, onReadMore }) {

    return (

        <article className="blog-card">

            <div className="blog-image">

                <img
                    src={post.image}
                    alt={post.title}
                    loading="lazy"
                />

                <span className="category-tag">
                    {post.category}
                </span>

            </div>

            <div className="blog-content">

                <div className="blog-meta">
                    <span>{post.author}</span>
                    <span>•</span>
                    <span>{post.date}</span>
                </div>

                <h3>{post.title}</h3>

                <p>{post.description}</p>

                <div className="blog-footer">

                    <span className="read-time">
                        <Clock size={15} />
                        {post.readTime}
                    </span>

                    <button
                        className="read-more"
                        onClick={() => onReadMore(post)}
                    >
                        Read More
                        <ArrowUpRight size={17} />
                    </button>

                </div>

            </div>

        </article>

    );

}

export default BlogCard;