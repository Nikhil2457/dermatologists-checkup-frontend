import React, { useState, useEffect } from 'react';
import axios from 'axios';
import Cookies from 'js-cookie';
import { useNavigate } from 'react-router-dom';
import './index.css';
import { toast } from 'react-toastify';
import { TailSpin } from 'react-loader-spinner';

function AuthPage() {
  const [role, setRole] = useState('patient'); // patient or dermatologist
  const [isLogin, setIsLogin] = useState(true);
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [phoneNumber, setPhoneNumber] = useState('');
  const [otp, setOtp] = useState('');
  const [otpSent, setOtpSent] = useState(false);
  const [otpVerified, setOtpVerified] = useState(false);
  const [otpLoading, setOtpLoading] = useState(false);
  const [otpCooldown, setOtpCooldown] = useState(0);
  const [isRedirecting, setIsRedirecting] = useState(false);
  const navigate = useNavigate();

  const toggleRole = (newRole) => {
    setRole(newRole);
    setIsLogin(true);
    setUsername('');
    setPassword('');
    setPhoneNumber('');
    setOtp('');
    setOtpSent(false);
    setOtpVerified(false);
  };

  const toggleAuthMode = () => setIsLogin(!isLogin);

  // Send OTP handler
  const handleSendOtp = async (e) => {
    e.preventDefault();
    if (!/^[0-9]{10}$/.test(phoneNumber)) {
      toast.error('Phone number must be 10 digits');
      return;
    }
    setOtpLoading(true);
    try {
      await axios.post(`${process.env.REACT_APP_API_URL}/api/otp/send-otp`, { phoneNumber });
      setOtpSent(true);
      setOtpCooldown(60); // 60 seconds cooldown
      toast.success('OTP sent to your phone');
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to send OTP');
    } finally {
      setOtpLoading(false);
    }
  };

  // OTP cooldown timer effect
  useEffect(() => {
    if (otpCooldown > 0) {
      const timer = setTimeout(() => setOtpCooldown(otpCooldown - 1), 1000);
      return () => clearTimeout(timer);
    }
  }, [otpCooldown]);

  // Verify OTP handler
  const handleVerifyOtp = async (e) => {
    e.preventDefault();
    if (!otp || otp.length !== 6) {
      toast.error('Enter the 6-digit OTP');
      return;
    }
    setOtpLoading(true);
    try {
      await axios.post(`${process.env.REACT_APP_API_URL}/api/otp/verify-otp`, { phoneNumber, otp });
      setOtpVerified(true);
      toast.success('Phone number verified!');
    } catch (err) {
      toast.error(err.response?.data?.message || 'OTP verification failed');
    } finally {
      setOtpLoading(false);
    }
  };

  // Signup/Login handler
  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!isLogin && role === 'patient') {
      if (!/^[0-9]{10}$/.test(phoneNumber)) {
        toast.error('Phone number must be 10 digits');
        return;
      }
      if (!otpVerified) {
        toast.error('Please verify your phone number with OTP');
        return;
      }
    }
    const endpoint = isLogin
      ? `${process.env.REACT_APP_API_URL}/api/users/login`
      : `${process.env.REACT_APP_API_URL}/api/users/signup`;
    console.log(endpoint);
    const payload = isLogin
      ? { username, password }
      : { username, password, role, phoneNumber };
    try {
      const res = await axios.post(endpoint, payload, { withCredentials: true });
      if (isLogin && res.data.role !== role) {
        toast.error(`You are not logged in with ${role} credentials.`);
        return;
      }
      localStorage.setItem('token', res.data.token);
      localStorage.setItem('role', res.data.role);
      toast.success(`${isLogin ? 'Login' : 'Signup'} successful!`);
      setIsRedirecting(true);
      setTimeout(() => {
        if (!isLogin) {
          sessionStorage.setItem('justSignedUp', 'true');
        }
        setIsRedirecting(false);
        if (role === 'dermatologist') {
          navigate('/patients', { replace: true });
        } else {
          navigate('/dermatologists', { replace: true });
        }
      }, 2000);
    } catch (err) {
      toast.error(err.response?.data?.message || 'Something went wrong');
    }
  };

  if (isRedirecting) {
    return (
      <div className="auth-page-loading-overlay">
        <div className="auth-page-loading-content">
          <TailSpin height={60} width={60} color="#1976d2" />
          <div style={{ marginTop: 20, fontSize: 20, color: '#1976d2', fontWeight: 600 }}>
            Redirecting...
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="auth-page-container">
      <div className="auth-page-wrapper">
        <div className="auth-page-role-toggle" data-role={role}>
          <button
            onClick={() => toggleRole('patient')}
            className={`auth-page-role-btn ${role === 'patient' ? 'active' : ''}`}
          >
            Patient
          </button>
          <button
            onClick={() => toggleRole('dermatologist')}
            className={`auth-page-role-btn ${role === 'dermatologist' ? 'active' : ''}`}
          >
            Dermatologist
          </button>
        </div>

        <h2 className="auth-page-title">
          {isLogin ? `${role === 'patient' ? 'Patient' : 'Dermatologist'} Login` : 'Patient Signup'}
        </h2>

        <form onSubmit={handleSubmit} className="auth-page-form">
          <input
            className="auth-page-input"
            placeholder="Username"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            required
          />
          <input
            className="auth-page-input"
            type="password"
            placeholder="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />

          {/* Patient Signup: Phone + OTP Flow */}
          {!isLogin && role === 'patient' && (
            <>
              <input
                className="auth-page-input"
                type="tel"
                placeholder="Phone Number (10 digits)"
                value={phoneNumber}
                onChange={(e) => {
                  setPhoneNumber(e.target.value);
                  setOtpSent(false);
                  setOtpVerified(false);
                  setOtp('');
                }}
                maxLength={10}
                required
                disabled={otpSent || otpVerified}
              />
              {!otpSent && !otpVerified && (
                <button
                  className="auth-page-submit-btn"
                  style={{ marginBottom: 10 }}
                  onClick={handleSendOtp}
                  disabled={otpLoading || otpCooldown > 0}
                  type="button"
                >
                  {otpLoading ? 'Sending OTP...' : (otpCooldown > 0 ? `Send OTP (${otpCooldown}s)` : 'Send OTP')}
                </button>
              )}
              {otpSent && !otpVerified && (
                <>
                  <input
                    className="auth-page-input"
                    type="text"
                    placeholder="Enter OTP"
                    value={otp}
                    onChange={(e) => setOtp(e.target.value)}
                    maxLength={6}
                    required
                  />
                  <button
                    className="auth-page-submit-btn"
                    style={{ marginBottom: 10 }}
                    onClick={handleVerifyOtp}
                    disabled={otpLoading}
                    type="button"
                  >
                    {otpLoading ? 'Verifying...' : 'Verify OTP'}
                  </button>
                  <button
                    className="auth-page-toggle-link"
                    style={{ marginBottom: 10, color: '#1976d2', background: 'none', border: 'none', cursor: 'pointer' }}
                    onClick={handleSendOtp}
                    disabled={otpLoading || otpCooldown > 0}
                    type="button"
                  >
                    {otpCooldown > 0 ? `Resend OTP (${otpCooldown}s)` : 'Resend OTP'}
                  </button>
                </>
              )}
              {otpVerified && (
                <div style={{ color: 'green', marginBottom: 10, fontWeight: 500 }}>
                  Phone number verified!
                </div>
              )}
            </>
          )}

          {/* Dermatologist Signup or Login: Normal flow */}
          {(isLogin || role === 'dermatologist') && (
            <button type="submit" className="auth-page-submit-btn">
              {isLogin ? 'Login' : 'Signup'}
            </button>
          )}

          {/* Patient Signup: Only show signup button if OTP verified */}
          {!isLogin && role === 'patient' && otpVerified && (
            <button type="submit" className="auth-page-submit-btn">
              Signup
            </button>
          )}
        </form>

        {role === 'patient' && (
          <>
            <p className="auth-page-toggle-link" onClick={toggleAuthMode}>
              {isLogin ? 'New user? Signup' : 'Already have an account? Login'}
            </p>
            <p className="auth-page-toggle-link" onClick={() => navigate('/admin')}>Admin? Login here</p>
          </>
        )}
      </div>
    </div>
  );
}

export default AuthPage;
