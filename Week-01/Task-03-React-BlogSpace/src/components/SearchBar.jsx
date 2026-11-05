import { Search, SlidersHorizontal } from "lucide-react";

function SearchBar({ search, setSearch }) {

    return (

        <div className="search-section">

            <div className="search-heading">

                <div>
                    <span className="section-label">
                        FIND YOUR INTEREST
                    </span>

                    <h2>Discover Articles</h2>
                </div>

                <SlidersHorizontal size={22} />

            </div>

            <div className="main-search">

                <Search size={21} />

                <input
                    type="text"
                    placeholder="Search by title, topic or keyword..."
                    value={search}
                    onChange={(e) => setSearch(e.target.value)}
                />

            </div>

        </div>

    );

}

export default SearchBar;