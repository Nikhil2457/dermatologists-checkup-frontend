import React, { useState, useEffect, useCallback } from 'react';
import axios from 'axios';
import './index.css';

const RatingDisplay = ({ dermatologistId, dermatologistName }) => {
  const [ratings, setRatings] = useState([]);
  const [averageRating, setAverageRating] = useState(0);
  const [totalRatings, setTotalRatings] = useState(0);
  const [loading, setLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [showAllReviews, setShowAllReviews] = useState(false);

  const fetchRatings = useCallback(async () => {
    if (!dermatologistId) return;
    try {
      const response = await axios.get(
        `/api/ratings/dermatologist/${dermatologistId}?page=${currentPage}&limit=5`
      );
      setRatings(response.data.ratings);
      setTotalPages(response.data.totalPages);
      setLoading(false);
    } catch (error) {
      console.error('Error fetching ratings:', error);
      setLoading(false);
    }
  }, [dermatologistId, currentPage]);

  const fetchAverageRating = useCallback(async () => {
    if (!dermatologistId) return;
    try {
      const response = await axios.get(
        `/api/ratings/dermatologist/${dermatologistId}/average`
      );
      setAverageRating(response.data.averageRating);
      setTotalRatings(response.data.totalRatings);
    } catch (error) {
      console.error('Error fetching average rating:', error);
    }
  }, [dermatologistId]);

  useEffect(() => {
    fetchRatings();
    fetchAverageRating();
  }, [fetchRatings, fetchAverageRating]);

  const renderStars = (rating) => {
    return [1, 2, 3, 4, 5].map((star) => (
      <span
        key={star}
        className={`display-star ${star <= rating ? 'filled' : ''}`}
      >
        ⭐
      </span>
    ));
  };

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  if (loading) {
    return (
      <div className="rating-display-loading">
        <div className="loading-spinner"></div>
        <p>Loading ratings...</p>
      </div>
    );
  }

  return (
    <div className="rating-display-container">
      <div className="rating-summary">
        <div className="rating-average">
          <div className="rating-average-stars">
            {renderStars(Math.round(averageRating))}
          </div>
          <div className="rating-average-text">
            <span className="rating-average-number">{averageRating}</span>
            <span className="rating-average-max">/5</span>
          </div>
          <div className="rating-total">
            Based on {totalRatings} review{totalRatings !== 1 ? 's' : ''}
          </div>
        </div>
      </div>

      {ratings.length > 0 && (
        <div className="rating-reviews">
          <div className="rating-reviews-header">
            <h4>Recent Reviews</h4>
            {!showAllReviews && ratings.length > 3 && (
              <button
                className="rating-show-more-btn"
                onClick={() => setShowAllReviews(true)}
              >
                Show All Reviews
              </button>
            )}
          </div>

          <div className="rating-reviews-list">
            {(showAllReviews ? ratings : ratings.slice(0, 3)).map((rating) => (
              <div key={rating._id} className="rating-review-item">
                <div className="rating-review-header">
                  <div className="rating-review-stars">
                    {renderStars(rating.stars)}
                  </div>
                  <div className="rating-review-meta">
                    <span className="rating-review-author">
                      {rating.patientId?.username || 'Anonymous'}
                    </span>
                    <span className="rating-review-date">
                      {formatDate(rating.date)}
                    </span>
                  </div>
                </div>
                
                {rating.message && (
                  <div className="rating-review-message">
                    "{rating.message}"
                  </div>
                )}
              </div>
            ))}
          </div>

          {showAllReviews && totalPages > 1 && (
            <div className="rating-pagination">
              <button
                className="rating-pagination-btn"
                onClick={() => setCurrentPage(prev => Math.max(1, prev - 1))}
                disabled={currentPage === 1}
              >
                Previous
              </button>
              <span className="rating-pagination-info">
                Page {currentPage} of {totalPages}
              </span>
              <button
                className="rating-pagination-btn"
                onClick={() => setCurrentPage(prev => Math.min(totalPages, prev + 1))}
                disabled={currentPage === totalPages}
              >
                Next
              </button>
            </div>
          )}

          {showAllReviews && (
            <button
              className="rating-show-less-btn"
              onClick={() => {
                setShowAllReviews(false);
                setCurrentPage(1);
              }}
            >
              Show Less
            </button>
          )}
        </div>
      )}

      {ratings.length === 0 && (
        <div className="rating-no-reviews">
          <p>No reviews yet for Dr. {dermatologistName}</p>
          <p>Be the first to share your experience!</p>
        </div>
      )}
    </div>
  );
};

export default RatingDisplay; 