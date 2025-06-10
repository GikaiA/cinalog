import React, { useState } from 'react';
import { auth, database } from './firebase';
import { ref, push, set, serverTimestamp } from 'firebase/database';

function RatingReview({ mediaType, mediaId, mediaTitle, onReviewSubmitted }) {
  const [rating, setRating] = useState(0);
  const [review, setReview] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    const user = auth.currentUser;

    if (!user) {
      setError('Please log in to submit a review');
      return;
    }

    if (rating === 0) {
      setError('Please select a rating');
      return;
    }

    if (!review.trim()) {
      setError('Please write a review');
      return;
    }

    setIsSubmitting(true);
    setError('');

    try {
      const reviewsRef = ref(database, `reviews/${mediaType}/${mediaId}`);
      const newReviewRef = push(reviewsRef);
      
      await set(newReviewRef, {
        userId: user.uid,
        username: user.displayName || 'Anonymous',
        rating: rating,
        review: review.trim(),
        mediaTitle: mediaTitle,
        createdAt: serverTimestamp(),
      });

      // Reset form
      setRating(0);
      setReview('');
      
      // Notify parent component
      if (onReviewSubmitted) {
        onReviewSubmitted();
      }
    } catch (error) {
      console.error('Error submitting review:', error);
      setError('Failed to submit review. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="rating-review-container">
      {error && <div className="error-message">{error}</div>}
      <form onSubmit={handleSubmit}>
        <div className="rating-stars">
          {[1, 2, 3, 4, 5].map((star) => (
            <span
              key={star}
              className="star"
              style={{
                cursor: 'pointer',
                color: rating >= star ? 'gold' : 'gray',
                fontSize: '35px',
              }}
              onClick={() => setRating(star)}
            >
              {' '}★{' '}
            </span>
          ))}
        </div>
        <div className="review-input-container">
          <textarea
            className="review-textarea"
            placeholder="Write your review here..."
            value={review}
            onChange={(e) => setReview(e.target.value)}
            rows="4"
          />
        </div>
        <button 
          type="submit" 
          className="submit-review-button"
          disabled={isSubmitting}
        >
          {isSubmitting ? 'Submitting...' : 'Submit Review'}
        </button>
      </form>
    </div>
  );
}

export default RatingReview;