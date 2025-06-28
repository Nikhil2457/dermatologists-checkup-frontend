import React, { useState } from 'react';
import axios from 'axios';
import { toast } from 'react-toastify';
import './CreateDermatologistUser.css';

const CreateDermatologistUser = () => {
  const [phoneNumber, setPhoneNumber] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [phoneError, setPhoneError] = useState('');
  const [passwordError, setPasswordError] = useState('');

  const validatePhoneNumber = (phone) => {
    const phoneRegex = /^[0-9]{10,15}$/;
    if (!phone) {
      setPhoneError('Phone number is required');
      return false;
    }
    if (!phoneRegex.test(phone)) {
      setPhoneError('Please enter a valid phone number (10-15 digits)');
      return false;
    }
    setPhoneError('');
    return true;
  };

  const validatePassword = (password) => {
    if (!password) {
      setPasswordError('Password is required');
      return false;
    }
    if (password.length < 6) {
      setPasswordError('Password must be at least 6 characters long');
      return false;
    }
    setPasswordError('');
    return true;
  };

  const handlePhoneChange = (e) => {
    const value = e.target.value;
    setPhoneNumber(value);
    if (phoneError) {
      validatePhoneNumber(value);
    }
  };

  const handlePasswordChange = (e) => {
    const value = e.target.value;
    setPassword(value);
    if (passwordError) {
      validatePassword(value);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    // Validate inputs
    const isPhoneValid = validatePhoneNumber(phoneNumber);
    const isPasswordValid = validatePassword(password);
    if (!isPhoneValid || !isPasswordValid) {
      return;
    }
    setLoading(true);
    try {
      const token = localStorage.getItem('admin_token');
      const response = await axios.post(`${process.env.REACT_APP_API_URL}/api/admin/create-dermatologist-user`, {
        phoneNumber,
        password
      }, { 
        headers: { Authorization: `Bearer ${token}` }
      });
      toast.success(response.data.message || 'Dermatologist user created successfully!');
      setPhoneNumber('');
      setPassword('');
      setPhoneError('');
      setPasswordError('');
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to create dermatologist user');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="create-dermatologist-container">
      <div className="create-dermatologist-wrapper">
        <h2 className="create-dermatologist-title">➕ Create Dermatologist User</h2>
        <form onSubmit={handleSubmit} className="create-dermatologist-form">
          <div className="create-dermatologist-input-group">
            <input
              type="tel"
              className={`create-dermatologist-input ${phoneError ? 'error' : ''}`}
              placeholder="Dermatologist Phone Number"
              value={phoneNumber}
              onChange={handlePhoneChange}
              onBlur={() => validatePhoneNumber(phoneNumber)}
              disabled={loading}
              required
            />
            {phoneError && (
              <div className="create-dermatologist-validation-message error">
                {phoneError}
              </div>
            )}
          </div>
          <div className="create-dermatologist-input-group">
            <input
              type="password"
              className={`create-dermatologist-input ${passwordError ? 'error' : ''}`}
              placeholder="Default Password"
              value={password}
              onChange={handlePasswordChange}
              onBlur={() => validatePassword(password)}
              disabled={loading}
              required
            />
            {passwordError && (
              <div className="create-dermatologist-validation-message error">
                {passwordError}
              </div>
            )}
          </div>
          <button 
            type="submit" 
            className="create-dermatologist-submit-btn"
            disabled={loading}
          >
            {loading ? (
              <div className="create-dermatologist-loading">
                <div className="create-dermatologist-spinner"></div>
                <span>Creating User...</span>
              </div>
            ) : (
              'Create Dermatologist User'
            )}
          </button>
        </form>
      </div>
    </div>
  );
};

export default CreateDermatologistUser; 