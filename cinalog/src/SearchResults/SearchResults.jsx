import React from 'react';
import { Link } from 'react-router-dom';
import './SearchResults.css';

function SearchResults({ results, onClose }) {
  if (!results || results.length === 0) return null;

  return (
    <div className="search-results-container" onClick={(e) => e.stopPropagation()}>
      <div className="search-results">
        {results.map((item) => (
          <Link 
            to={`/${item.media_type}/${item.id}`} 
            key={item.id} 
            className="search-result-item"
            onClick={onClose}
          >
            <img 
              src={`https://image.tmdb.org/t/p/w92${item.poster_path}`} 
              alt={item.title || item.name}
              className="search-result-poster"
              onError={(e) => {
                e.target.src = 'https://via.placeholder.com/92x138?text=No+Image';
              }}
            />
            <div className="search-result-info">
              <h3>{item.title || item.name}</h3>
              <p>{item.media_type === 'movie' ? 'Movie' : 'TV Show'}</p>
              <p className="search-result-year">
                {item.release_date?.split('-')[0] || item.first_air_date?.split('-')[0]}
              </p>
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
}

export default SearchResults; 