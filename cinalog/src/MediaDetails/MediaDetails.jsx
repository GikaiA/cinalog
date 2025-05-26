import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import './MediaDetails.css';

const TMDB_API_KEY = 'e58d19d46cc869a4aa7be5ac22a24e35'; // Replace with your TMDB API key
const TMDB_API_BASE = 'https://api.themoviedb.org/3';
const TMDB_IMAGE_BASE = 'https://image.tmdb.org/t/p';

function MediaDetails() {
  const { mediaType, id } = useParams();
  const [media, setMedia] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchMediaDetails = async () => {
      try {
        setLoading(true);
        const response = await fetch(
          `${TMDB_API_BASE}/${mediaType}/${id}?api_key=${TMDB_API_KEY}&language=en-US&append_to_response=credits,videos`
        );
        const data = await response.json();
        
        if (!response.ok) {
          throw new Error(data.status_message || 'Failed to fetch media details');
        }
        
        setMedia(data);
        setError(null);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchMediaDetails();
  }, [mediaType, id]);

  if (loading) {
    return <div className="media-details-loading">Loading...</div>;
  }

  if (error) {
    return <div className="media-details-error">Error: {error}</div>;
  }

  if (!media) {
    return <div className="media-details-error">Media not found</div>;
  }

  const {
    title,
    name,
    overview,
    poster_path,
    backdrop_path,
    vote_average,
    release_date,
    first_air_date,
    runtime,
    episode_run_time,
    genres,
    credits,
    videos
  } = media;

  const releaseYear = (release_date || first_air_date)?.split('-')[0];
  const duration = runtime || (episode_run_time?.[0] || 0);
  const hours = Math.floor(duration / 60);
  const minutes = duration % 60;
  const durationString = hours > 0 ? `${hours}h ${minutes}m` : `${minutes}m`;

  const trailer = videos?.results?.find(video => 
    video.type === 'Trailer' && video.site === 'YouTube'
  );

  return (
    <div className="media-details">
      <div 
        className="media-backdrop"
        style={{
          backgroundImage: `url(${TMDB_IMAGE_BASE}/original${backdrop_path})`
        }}
      >
        <div className="media-backdrop-overlay">
          <div className="media-content">
            <div className="media-poster">
              <img 
                src={`${TMDB_IMAGE_BASE}/w500${poster_path}`}
                alt={title || name}
                onError={(e) => {
                  e.target.src = 'https://via.placeholder.com/500x750?text=No+Image';
                }}
              />
            </div>
            <div className="media-info">
              <h1>{title || name}</h1>
              <div className="media-meta">
                <span className="media-year">{releaseYear}</span>
                <span className="media-duration">{durationString}</span>
                <span className="media-rating">★ {vote_average.toFixed(1)}</span>
                <div className="media-genres">
                  {genres.map(genre => (
                    <span key={genre.id} className="media-genre">{genre.name}</span>
                  ))}
                </div>
              </div>
              <p className="media-overview">{overview}</p>
              
              {trailer && (
                <div className="media-trailer">
                  <h2>Trailer</h2>
                  <iframe
                    width="560"
                    height="315"
                    src={`https://www.youtube.com/embed/${trailer.key}`}
                    title="Trailer"
                    frameBorder="0"
                    allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                    allowFullScreen
                  ></iframe>
                </div>
              )}

              {credits?.cast && (
                <div className="media-cast">
                  <h2>Cast</h2>
                  <div className="cast-list">
                    {credits.cast.slice(0, 6).map(person => (
                      <div key={person.id} className="cast-member">
                        <img
                          src={person.profile_path 
                            ? `${TMDB_IMAGE_BASE}/w185${person.profile_path}`
                            : 'https://via.placeholder.com/185x278?text=No+Image'
                          }
                          alt={person.name}
                          onError={(e) => {
                            e.target.src = 'https://via.placeholder.com/185x278?text=No+Image';
                          }}
                        />
                        <h3>{person.name}</h3>
                        <p>{person.character}</p>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default MediaDetails; 