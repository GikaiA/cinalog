import React, { useState, useEffect } from 'react'
import { Link } from 'react-router-dom';
import './Home.css';
import cinemabg from '../videos/movie.mp4';

const TMDB_API_KEY = 'e58d19d46cc869a4aa7be5ac22a24e35';
const TMDB_API_BASE = 'https://api.themoviedb.org/3';
const TMDB_IMAGE_BASE = 'https://image.tmdb.org/t/p';

function Home() {
  const [featuredMovies, setFeaturedMovies] = useState([]);
  const [featuredTVShows, setFeaturedTVShows] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchFeaturedContent = async () => {
      try {
        // Fetch popular movies
        const moviesResponse = await fetch(
          `${TMDB_API_BASE}/movie/popular?api_key=${TMDB_API_KEY}&language=en-US&page=1`
        );
        const moviesData = await moviesResponse.json();

        // Fetch popular TV shows
        const tvResponse = await fetch(
          `${TMDB_API_BASE}/tv/popular?api_key=${TMDB_API_KEY}&language=en-US&page=1`
        );
        const tvData = await tvResponse.json();

        setFeaturedMovies(moviesData.results.slice(0, 7)); // Get first 7 movies
        setFeaturedTVShows(tvData.results.slice(0, 7)); // Get first 7 TV shows
        setLoading(false);
      } catch (error) {
        console.error('Error fetching featured content:', error);
        setLoading(false);
      }
    };

    fetchFeaturedContent();
  }, []);

  const renderMediaPoster = (item, type) => (
    <Link to={`/${type}/${item.id}`} key={item.id} className="media-poster">
      <img
        src={`${TMDB_IMAGE_BASE}/w500${item.poster_path}`}
        alt={type === 'movie' ? item.title : item.name}
        className="poster-image"
      />
      <div className="poster-info">
        <h3>{type === 'movie' ? item.title : item.name}</h3>
        <p>{type === 'movie' ? item.release_date?.split('-')[0] : item.first_air_date?.split('-')[0]}</p>
      </div>
    </Link>
  );

  return (
    <div className='home'>
      <div className='hero-section'>
        <div className='hero-content'>
          <video src={cinemabg} autoPlay loop muted className='hero-video'/>                          
        </div>
        <div className='hero-title-container'>
          <h1 className='hero-title'>Welcome to Cinelog</h1>
          <p className='hero-description'>
            Your ultimate destination for all things cinema. Explore the latest movies,
            find your favorite shows, and get the latest news in the world of cinema.
          </p>
        </div>
        <div className='movies-tv-section'>
          <h1 className='movies-tv-title'>Featured Movies & TV Shows</h1>
          
          {loading ? (
            <div className="loading">Loading...</div>
          ) : (
            <>
              <div className="featured-movies">
                <h2>Popular Movies</h2>
                <marquee></marquee>
                <div className="posters-grid">
                  {featuredMovies.map(movie => renderMediaPoster(movie, 'movie'))}
                </div>
              </div>
              
              {/* <div className="featured-tv">
                <h2>Popular TV Shows</h2>
                <div className="posters-grid">
                  {featuredTVShows.map(show => renderMediaPoster(show, 'tv'))}
                </div>
              </div> */}
            </>
          )}
        </div>
        <div className='features-section'>
          <h1>Cinalog lets you...</h1>
          <div className='features-grid'>
            <div className='feature-item'>
              <p>Add movies and tv shows to your watchlist</p>
            </div>
            <div className='feature-item'>
              <p>Rate movies on a 5-star rating system</p>
            </div>
            <div className='feature-item'>
              <p>Create a Watch Diary</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default Home
