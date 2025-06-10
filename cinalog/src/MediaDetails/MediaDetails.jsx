import React, { useState, useEffect } from "react";
import { useParams, Link } from "react-router-dom";
import { auth, database } from "../firebase";
import {
  ref,
  set,
  remove,
  onValue,
  query,
  orderByChild,
} from "firebase/database";
import "./MediaDetails.css";
import RatingReview from "../RatingReview";

const TMDB_API_KEY = "e58d19d46cc869a4aa7be5ac22a24e35"; // Replace with your TMDB API key
const TMDB_API_BASE = "https://api.themoviedb.org/3";
const TMDB_IMAGE_BASE = "https://image.tmdb.org/t/p";

function MediaDetails() {
  const { mediaType, id } = useParams();
  const [media, setMedia] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [user, setUser] = useState(null);
  const [isInWatchlist, setIsInWatchlist] = useState(false);
  const [reviews, setReviews] = useState([]);
  const [isLoadingReviews, setIsLoadingReviews] = useState(true);

  useEffect(() => {
    // Listen for auth state changes
    const unsubscribe = auth.onAuthStateChanged((user) => {
      setUser(user);
      if (user) {
        // Check if the media is in user's watchlist
        const watchlistRef = ref(
          database,
          `users/${user.uid}/watchlist/${mediaType}/${id}`
        );
        console.log("Checking watchlist status for:", {
          mediaType,
          id,
          path: `users/${user.uid}/watchlist/${mediaType}/${id}`,
        });
        onValue(watchlistRef, (snapshot) => {
          console.log("Watchlist status:", snapshot.exists(), "for", {
            mediaType,
            id,
          });
          setIsInWatchlist(snapshot.exists());
        });
      }
    });

    // Cleanup subscription
    return () => unsubscribe();
  }, [mediaType, id]);

  const toggleWatchlist = async () => {
    if (!user) return;

    const watchlistRef = ref(
      database,
      `users/${user.uid}/watchlist/${mediaType}/${id}`
    );
    console.log("Toggling watchlist for:", {
      mediaType,
      id,
      title: media.title || media.name,
    });

    try {
      if (isInWatchlist) {
        // Remove from watchlist
        console.log("Removing from watchlist:", { mediaType, id });
        await remove(watchlistRef);
      } else {
        // Add to watchlist
        const watchlistItem = {
          id: id,
          title: media.title || media.name,
          poster_path: media.poster_path,
          media_type: mediaType,
          added_at: new Date().toISOString(),
        };
        console.log("Adding to watchlist:", watchlistItem);
        console.log(
          "Watchlist path:",
          `users/${user.uid}/watchlist/${mediaType}/${id}`
        );
        await set(watchlistRef, watchlistItem);
      }
    } catch (error) {
      console.error("Error updating watchlist:", error);
    }
  };

  useEffect(() => {
    const fetchMediaDetails = async () => {
      try {
        setLoading(true);
        const response = await fetch(
          `${TMDB_API_BASE}/${mediaType}/${id}?api_key=${TMDB_API_KEY}&language=en-US&append_to_response=credits,videos`
        );
        const data = await response.json();

        if (!response.ok) {
          throw new Error(
            data.status_message || "Failed to fetch media details"
          );
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

  useEffect(() => {
    // Fetch reviews for this media
    const reviewsRef = ref(database, `reviews/${mediaType}/${id}`);
    const reviewsQuery = query(reviewsRef, orderByChild("createdAt"));

    const unsubscribe = onValue(reviewsQuery, (snapshot) => {
      const reviewsData = [];
      snapshot.forEach((childSnapshot) => {
        reviewsData.push({
          id: childSnapshot.key,
          ...childSnapshot.val(),
        });
      });
      // Sort reviews by creation date (newest first)
      reviewsData.sort((a, b) => b.createdAt - a.createdAt);
      setReviews(reviewsData);
      setIsLoadingReviews(false);
    });

    return () => unsubscribe();
  }, [mediaType, id]);

  const handleReviewSubmitted = () => {
    // Reviews will automatically update due to the onValue listener
  };

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
    videos,
  } = media;

  const releaseYear = (release_date || first_air_date)?.split("-")[0];
  const duration = runtime || episode_run_time?.[0] || 0;
  const hours = Math.floor(duration / 60);
  const minutes = duration % 60;
  const durationString = hours > 0 ? `${hours}h ${minutes}m` : `${minutes}m`;

  const trailer = videos?.results?.find(
    (video) => video.type === "Trailer" && video.site === "YouTube"
  );

  return (
    <div className="media-details">
      <div
        className="media-backdrop"
        style={{
          backgroundImage: `url(${TMDB_IMAGE_BASE}/original${backdrop_path})`,
        }}
      >
        <div className="media-backdrop-overlay">
          <div className="media-content">
            <div className="media-poster">
              <img
                src={`${TMDB_IMAGE_BASE}/w500${poster_path}`}
                alt={title || name}
                onError={(e) => {
                  e.target.src =
                    "https://via.placeholder.com/500x750?text=No+Image";
                }}
              />
              {!user && (
                <div className="login-user-section">
                  <p className="login-user-sentence">
                    Want to add this to your watchlist and give your review? Log
                    in <Link to="/login">here</Link>.
                  </p>
                </div>
              )}
            </div>
            <div className="media-info">
              <h1>{title || name}</h1>
              {user && (
                <button
                  className={`watchlist-button ${
                    isInWatchlist ? "in-watchlist" : ""
                  }`}
                  onClick={toggleWatchlist}
                >
                  {isInWatchlist ? "Added to Watchlist" : "Add to Watchlist"}
                </button>
              )}
              <div className="media-meta">
                <span className="media-year">{releaseYear}</span>
                <span className="media-duration">{durationString}</span>
                <span className="media-rating">
                  ★ {vote_average.toFixed(1)}
                </span>
                <div className="media-genres">
                  {genres.map((genre) => (
                    <span key={genre.id} className="media-genre">
                      {genre.name}
                    </span>
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
                    {credits.cast.slice(0, 6).map((person) => (
                      <div key={person.id} className="cast-member">
                        <img
                          src={
                            person.profile_path
                              ? `${TMDB_IMAGE_BASE}/w185${person.profile_path}`
                              : "https://via.placeholder.com/185x278?text=No+Image"
                          }
                          alt={person.name}
                          onError={(e) => {
                            e.target.src =
                              "https://via.placeholder.com/185x278?text=No+Image";
                          }}
                        />
                        <h3>{person.name}</h3>
                        <p>{person.character}</p>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {user && (
                <div className="rating-section">
                  <h2 className="personal-rating">Write a Review</h2>
                  <RatingReview
                    mediaType={mediaType}
                    mediaId={id}
                    mediaTitle={media.title || media.name}
                    onReviewSubmitted={handleReviewSubmitted}
                  />
                </div>
              )}

              <div className="reviews-section">
                <h2 className="reviews-title">User Reviews</h2>
                {isLoadingReviews ? (
                  <div className="loading-reviews">Loading reviews...</div>
                ) : reviews.length > 0 ? (
                  <div className="reviews-list">
                    {reviews.map((review) => (
                      <div key={review.id} className="review-card">
                        <div className="review-header">
                          <span className="review-username">
                            {review.username}
                          </span>
                          <div className="review-rating">
                            {[...Array(5)].map((_, i) => (
                              <span
                                key={i}
                                className="review-star"
                                style={{
                                  color: i < review.rating ? "gold" : "gray",
                                }}
                              >
                                ★
                              </span>
                            ))}
                          </div>
                          <span className="review-date">
                            {new Date(review.createdAt).toLocaleDateString()}
                          </span>
                        </div>
                        <p className="review-content">{review.review}</p>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="no-reviews">
                    No reviews yet. Be the first to review this{" "}
                    {mediaType === "movie" ? "movie" : "TV show"}!
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default MediaDetails;
