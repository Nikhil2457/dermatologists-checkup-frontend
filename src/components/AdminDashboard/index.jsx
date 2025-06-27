import React, { useEffect, useState } from 'react';
import axios from 'axios';
import Cookies from 'js-cookie';
import { useNavigate } from 'react-router-dom';
import StatCard from '../StatCard';
import './AdminDashboard.css';
import AdminClarifyIssuesModal from './AdminClarifyIssuesModal';

const AdminDashboard = () => {
  const [stats, setStats] = useState({
    totalUsers: 0,
    totalDermatologists: 0,
    totalRequests: 0,
    pendingRequests: 0,
    inProgressRequests: 0,
    completedRequests: 0,
    totalDermatologistsAvailable: 0
  });

  const [timeLeft, setTimeLeft] = useState(15 * 60); // 15 mins in seconds
  const navigate = useNavigate();
  const [adminMessage, setAdminMessage] = useState('');
  const [showClarifyModal, setShowClarifyModal] = useState(false);
  const [totalIssues, setTotalIssues] = useState(0);

  useEffect(() => {
    axios
      .get(`${process.env.REACT_APP_API_URL}/api/admin/stats`, { withCredentials: true })
      .then(res => setStats(res.data))
      .catch(err => console.error('Error fetching stats:', err));
    // Fetch total support issues
    axios
      .get(`${process.env.REACT_APP_API_URL}/api/support-issue/all`, { withCredentials: true })
      .then(res => setTotalIssues(res.data.issues.length))
      .catch(err => setTotalIssues(0));
  }, []);

  // 🕒 Timer countdown logic
  useEffect(() => {
    const interval = setInterval(() => {
      setTimeLeft(prev => {
        if (prev <= 1) {
          Cookies.remove('admin_token');
          clearInterval(interval);
          navigate('/admin');
          alert('⏳ Session expired. Please login again.');
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(interval); // cleanup
  }, [navigate]);


  useEffect(() => {
  // Verify session & get welcome message
  axios.get(`${process.env.REACT_APP_API_URL}/api/admin/dashboard`, { withCredentials: true })
    .then(res => {
      setAdminMessage(res.data.message); // "Welcome Admin!"
    })
    .catch(() => {
      Cookies.remove('admin_token');
      navigate('/admin');
    });
}, [navigate]);
  // 🔐 Check token on mount
//   useEffect(() => {
//     const token = Cookies.get('admin_token');
//     if (!token) {
//       navigate('/admin');
//     }
//   }, [navigate]);

  // ⌛ Format seconds to MM:SS
  const formatTime = (seconds) => {
    const m = Math.floor(seconds / 60);
    const s = seconds % 60;
    return `${m.toString().padStart(2, '0')}:${s.toString().padStart(2, '0')}`;
  };

  return (
    <div className="admin-dashboard-container">
      <div className="admin-dashboard-title-wrapper">
        <h2>📊 Admin Dashboard</h2>
      </div>
      <p style={{ fontWeight: 'bold', color: '#4a4a4a' }}>{adminMessage}</p>
      <p style={{ fontWeight: 'bold', color: 'crimson' }}>
        ⏱️ Session expires in: {formatTime(timeLeft)}
      </p>
      

      <div className="admin-dashboard-stats">
        <StatCard title="Total Patients" count={stats.totalUsers} icon="🧑‍⚕️" />
        <StatCard title="Total Dermatologists" count={stats.totalDermatologists} icon="👨‍🔬" />
        <StatCard title="Total Requests" count={stats.totalRequests} icon="📄" />
        <StatCard title="Total Dermatologists Avaliable" count={stats.totalDermatologistsAvailable} icon="👨‍🔬" />
        <StatCard title="Pending Requests" count={stats.pendingRequests} icon="⏳" />
        <StatCard title="In Progress" count={stats.inProgressRequests} icon="⚙️" />
        <StatCard title="Completed" count={stats.completedRequests} icon="✅" />
        <StatCard title="Total Issues Raised" count={totalIssues} icon="🛎️" />
      </div>

      <div className="admin-dashboard-actions">
        <button className="admin-action-btn" onClick={() => navigate('/admin/add-dermatologist')}>
          ➕ Add Dermatologist (Form)
        </button>
        <button className="admin-action-btn" onClick={() => navigate('/admin/create-dermatologist')}>
          🆕 Create Dermatologist User
        </button>
        <button className="admin-action-btn" onClick={() => setShowClarifyModal(true)}>
          🛎️ Clarify Issue
        </button>
      </div>

      {showClarifyModal && (
        <AdminClarifyIssuesModal onClose={() => setShowClarifyModal(false)} />
      )}
    </div>
  );
};

export default AdminDashboard;
