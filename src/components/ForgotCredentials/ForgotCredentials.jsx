import React, { useState } from "react";
import axios from "axios";
import "./ForgotCredentials.css";

const API_BASE = `${process.env.REACT_APP_API_URL}/api/users`;

export default function ForgotCredentials() {
  const [step, setStep] = useState(1);
  const [phone, setPhone] = useState("");
  const [usernames, setUsernames] = useState([]);
  const [selectedUsername, setSelectedUsername] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);

  // Handle phone submit
  const handlePhoneSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setMessage("");
    setUsernames([]);
    setSelectedUsername("");
    setNewPassword("");
    try {
      const res = await axios.post(`${API_BASE}/forgot-credentials`, { phone });
      setUsernames(res.data.usernames);
      setStep(2);
    } catch (err) {
      setMessage(
        err.response?.data?.message || "Something went wrong."
      );
    }
    setLoading(false);
  };

  // Handle password update
  const handlePasswordUpdate = async (e) => {
    e.preventDefault();
    setLoading(true);
    setMessage("");
    try {
      const res = await axios.post(`${API_BASE}/update-password`, {
        phone,
        username: selectedUsername,
        newPassword,
      });
      setMessage("Password updated successfully!");
      setStep(1);
      setPhone("");
      setUsernames([]);
      setSelectedUsername("");
      setNewPassword("");
    } catch (err) {
      setMessage(
        err.response?.data?.message || "Something went wrong."
      );
    }
    setLoading(false);
  };

  return (
    <div className="forgot-credentials-container">
      <h2 className="fc-title">Forgot Username or Password?</h2>
      {message && <div className="fc-message">{message}</div>}

      {step === 1 && (
        <form className="fc-form" onSubmit={handlePhoneSubmit}>
          <label htmlFor="phone">Enter your phone number:</label>
          <input
            id="phone"
            type="tel"
            value={phone}
            onChange={(e) => setPhone(e.target.value)}
            placeholder="e.g. 9876543210"
            required
            pattern="[0-9]{10,15}"
            disabled={loading}
          />
          <button type="submit" className="fc-btn" disabled={loading}>
            {loading ? "Checking..." : "Find Accounts"}
          </button>
        </form>
      )}

      {step === 2 && (
        <div className="fc-usernames-list animate-fade-in">
          <p>Accounts found for <b>{phone}</b>:</p>
          <ul>
            {usernames.map((uname) => (
              <li key={uname} className="fc-username-item">
                <span className="fc-username">{uname}</span>
                <button
                  className="fc-btn fc-update-btn"
                  onClick={() => {
                    setSelectedUsername(uname);
                    setStep(3);
                    setMessage("");
                  }}
                >
                  Update Password
                </button>
              </li>
            ))}
          </ul>
          <button className="fc-btn fc-back-btn" onClick={() => setStep(1)}>
            Back
          </button>
        </div>
      )}

      {step === 3 && (
        <form className="fc-form animate-slide-up" onSubmit={handlePasswordUpdate}>
          <p>
            Update password for <b>{selectedUsername}</b>
          </p>
          <input
            type="password"
            value={newPassword}
            onChange={(e) => setNewPassword(e.target.value)}
            placeholder="New password"
            required
            minLength={6}
            disabled={loading}
          />
          <button type="submit" className="fc-btn" disabled={loading}>
            {loading ? "Updating..." : "Submit"}
          </button>
          <button
            type="button"
            className="fc-btn fc-back-btn"
            onClick={() => {
              setStep(2);
              setSelectedUsername("");
              setNewPassword("");
              setMessage("");
            }}
            disabled={loading}
          >
            Back
          </button>
        </form>
      )}
    </div>
  );
}