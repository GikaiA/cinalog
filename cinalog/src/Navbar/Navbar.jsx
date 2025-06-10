import React, { useState, useEffect, useRef } from "react";
import { Link, useNavigate } from "react-router-dom";
import { auth } from "../firebase";
import { signOut } from "firebase/auth";
import "./Navbar.css";
import SearchResults from "../SearchResults/SearchResults";

const TMDB_API_KEY = "e58d19d46cc869a4aa7be5ac22a24e35"; // Replace with your TMDB API key
const TMDB_API_BASE = "https://api.themoviedb.org/3";

function Navbar() {
  const [isOpen, setIsOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [searchResults, setSearchResults] = useState([]);
  const [isSearching, setIsSearching] = useState(false);
  const [user, setUser] = useState(null);
  const searchTimeoutRef = useRef(null);
  const searchContainerRef = useRef(null);
  const navigate = useNavigate();

  useEffect(() => {
    // Listen for auth state changes
    const unsubscribe = auth.onAuthStateChanged((user) => {
      setUser(user);
    });

    // Cleanup subscription
    return () => unsubscribe();
  }, []);

  const handleSignOut = async () => {
    try {
      await signOut(auth);
      navigate("/");
    } catch (error) {
      console.error("Error signing out:", error);
    }
  };

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (
        searchContainerRef.current &&
        !searchContainerRef.current.contains(event.target)
      ) {
        setSearchResults([]);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleSearch = async (query) => {
    if (!query.trim()) {
      setSearchResults([]);
      return;
    }

    try {
      const response = await fetch(
        `${TMDB_API_BASE}/search/multi?api_key=${TMDB_API_KEY}&query=${encodeURIComponent(
          query
        )}&language=en-US&page=1&include_adult=false`
      );
      const data = await response.json();

      // Filter results to only include movies and TV shows
      const filteredResults = data.results.filter(
        (item) =>
          (item.media_type === "movie" || item.media_type === "tv") &&
          item.poster_path
      );

      setSearchResults(filteredResults.slice(0, 10)); // Limit to 10 results
    } catch (error) {
      console.error("Error searching:", error);
      setSearchResults([]);
    }
  };

  const handleSearchChange = (e) => {
    const query = e.target.value;
    setSearchQuery(query);
    setIsSearching(true);

    // Clear previous timeout
    if (searchTimeoutRef.current) {
      clearTimeout(searchTimeoutRef.current);
    }

    // Set new timeout for search
    searchTimeoutRef.current = setTimeout(() => {
      handleSearch(query);
      setIsSearching(false);
    }, 300); // 300ms debounce
  };

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    if (searchTimeoutRef.current) {
      clearTimeout(searchTimeoutRef.current);
    }
    handleSearch(searchQuery);
  };

  return (
    <nav className="navbar">
      <Link to="/" className="navbar-title">
        <p className="title">🍿 Cinalog</p>
      </Link>
      <div className="search-bar-section" ref={searchContainerRef}>
        <form onSubmit={handleSearchSubmit}>
          <input
            type="text"
            className="search-bar"
            placeholder="Search for a movie or tv show..."
            value={searchQuery}
            onChange={handleSearchChange}
          />
          <button type="submit" className="search-button">
            {isSearching ? "Searching..." : "Search"}
          </button>
        </form>
        <SearchResults
          results={searchResults}
          onClose={() => setSearchResults([])}
        />
      </div>
      <ul className={isOpen ? "nav-menu open" : "nav-menu"}>
        {user ? (
          <>
            <li>
              <Link to="/profile" className="nav-item">
                Profile
              </Link>
            </li>
            <li>
              <button
                onClick={handleSignOut}
                className="nav-item sign-out-button"
              >
                Sign Out
              </button>
            </li>
          </>
        ) : (
          <>
            <li>
              <Link to="/register" className="nav-item">
                Create Account
              </Link>
            </li>
            <li>
              <Link to="/login" className="nav-item">
                Login
              </Link>
            </li>
          </>
        )}
        <div className="close-menu" onClick={() => setIsOpen(false)}>
          ✖
        </div>
      </ul>
      <div className="menu-toggle" onClick={() => setIsOpen(!isOpen)}>
        ☰
      </div>
    </nav>
  );
}

export default Navbar;
