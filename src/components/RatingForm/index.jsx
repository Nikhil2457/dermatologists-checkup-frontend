import React, { useState, useEffect, useCallback } from 'react';
import axios from 'axios';
import './index.css';

const RatingForm = ({ dermatologistId, dermatologistName, onRatingSubmitted, onClose }) => {
  const [stars, setStars] = useState(0);
  const [hoveredStar, setHoveredStar] = useState(0);
  const [message, setMessage] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [existingRating, setExistingRating] = useState(null);

  const checkExistingRating = useCallback(async () => {
    if (!dermatologistId) return;
    try {
      const response = await axios.get(`/api/ratings/check/${dermatologistId}`, {
        withCredentials: true
      });
      if (response.data.hasRated) {
        setExistingRating(response.data.rating);
        setStars(response.data.rating.stars);
        setMessage(response.data.rating.message || '');
      }
    } catch (error) {
      console.error('Error checking existing rating:', error);
    }
  }, [dermatologistId]);

  useEffect(() => {
    checkExistingRating();
  }, [checkExistingRating]);

  const handleStarClick = (starValue) => {
    setStars(starValue);
  };

  const handleStarHover = (starValue) => {
    setHoveredStar(starValue);
  };

  const handleStarLeave = () => {
    setHoveredStar(0);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!dermatologistId) {
      setError('Invalid dermatologist');
      return;
    }
    if (stars === 0) {
      setError('Please select a rating');
      return;
    }
    setLoading(true);
    setError('');
    try {
      if (existingRating) {
        // Update existing rating
        await axios.put(`/api/ratings/${existingRating._id}`, {
          stars,
          message
        }, { withCredentials: true });
      } else {
        // Submit new rating
        await axios.post('/api/ratings', {
          dermatologistId,
          stars,
          message
        }, { withCredentials: true });
      }
      onRatingSubmitted();
      onClose();
    } catch (error) {
      console.error('Error submitting rating:', error);
      setError(error.response?.data?.message || 'Error submitting rating');
    } finally {
      setLoading(false);
    }
  };

  const renderStars = () => {
    return [1, 2, 3, 4, 5].map((star) => (
      <span
        key={star}
        className={`star ${star <= (hoveredStar || stars) ? 'filled' : ''}`}
        onClick={() => handleStarClick(star)}
        onMouseEnter={() => handleStarHover(star)}
        onMouseLeave={handleStarLeave}
      >
        ⭐
      </span>
    ));
  };

  return (
    <div className="rating-form-overlay">
      <div className="rating-form-container">
        <div className="rating-form-header">
          <h3>Rate Dr. {dermatologistName}</h3>
          <button className="rating-form-close" onClick={onClose}>×</button>
        </div>
        <form onSubmit={handleSubmit} className="rating-form">
          <div className="rating-stars-container">
            <label className="rating-label">Your Rating:</label>
            <div className="rating-stars">
              {renderStars()}
            </div>
            <span className="rating-text">
              {stars > 0 ? `${stars} star${stars > 1 ? 's' : ''}` : 'Select rating'}
            </span>
          </div>
          <div className="rating-message-container">
            <label className="rating-label" htmlFor="message">
              Optional Feedback:
            </label>
            <textarea
              id="message"
              className="rating-message-input"
              placeholder="Share your experience with this dermatologist..."
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              maxLength={500}
              rows={4}
            />
            <span className="rating-char-count">
              {message.length}/500 characters
            </span>
          </div>
          {error && <div className="rating-error">{error}</div>}
          <div className="rating-form-actions">
            <button
              type="button"
              className="rating-cancel-btn"
              onClick={onClose}
              disabled={loading}
            >
              Cancel
            </button>
            <button
              type="submit"
              className="rating-submit-btn"
              disabled={loading || stars === 0}
            >
              {loading ? 'Submitting...' : existingRating ? 'Update Rating' : 'Submit Rating'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default RatingForm; 