// Reusable StatCard.jsx
import React from 'react';
import './StatCard.css';


const StatCard = ({ title, count, icon }) => (
  <div className="stat-card">
    <div className="stat-icon">{icon}</div>
    <div className="stat-info">
      <h4>{title}</h4>
      <p>{count}</p>
    </div>
  </div>
);

export default StatCard;