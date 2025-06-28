import React, { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import axios from 'axios';
import CheckupRequestUpload from '../CheckupRequestUpload';
import AIAssistant from '../AIAssistant';
import PayButton from '../PayButton';
import RatingForm from '../RatingForm';
import RatingDisplay from '../RatingDisplay';
import './index.css';
import { TailSpin } from 'react-loader-spinner';
import { toast } from 'react-toastify';
import ContactUsModal from '../ContactUsModal';

const PatientDashboard = () => {
  const [dermatologists, setDermatologists] = useState([]);
  const [patientId, setPatientId] = useState('');
  const [loading, setLoading] = useState(true);
  const [patientName, setPatientName] = useState('');
  const [isAiModalOpen, setIsAiModalOpen] = useState(false);
  const [showRatingForm, setShowRatingForm] = useState(false);
  const [ratingDermatologistId, setRatingDermatologistId] = useState(null);
  const [ratingDermatologistName, setRatingDermatologistName] = useState('');
  const [showRatings, setShowRatings] = useState({});
  const [refreshCounters, setRefreshCounters] = useState({});
  const [showUploadForm, setShowUploadForm] = useState(false);
  const [selectedDermatologistForUpload, setSelectedDermatologistForUpload] = useState(null);
  const [paymentStatus, setPaymentStatus] = useState({});
  const [unusedPayments, setUnusedPayments] = useState({});
  const [isContactModalOpen, setIsContactModalOpen] = useState(false);

  const navigate = useNavigate();

  const openAiModal = () => setIsAiModalOpen(true);
  const closeAiModal = () => setIsAiModalOpen(false);

  const handleLogout = () => {
    document.cookie = 'token=; Max-Age=0; path=/;';
    document.cookie = 'role=; Max-Age=0; path=/;';
    navigate('/');
  };

  const handlePaymentCompleted = async (dermatologistId) => {
    try {
      await axios.post(`${process.env.REACT_APP_API_URL}/api/payments/mark-paid`, {
        patientId,
        dermatologistId
      });
      setPaymentStatus((prev) => ({ ...prev, [dermatologistId]: true }));
      setShowUploadForm(true);
      setSelectedDermatologistForUpload(dermatologistId);
      toast.success('Payment successful! You can now submit your checkup request.');
    } catch (err) {
      toast.error('Failed to mark payment as paid.');
    }
  };

  const handleRateDermatologist = (dermatologistId, dermatologistName) => {
    setRatingDermatologistId(dermatologistId);
    setRatingDermatologistName(dermatologistName);
    setShowRatingForm(true);
  };

  const handleRatingSubmitted = () => {
    // Refresh dermatologists to update ratings
    fetchDermatologists();
    // Force re-render of RatingDisplay for the specific dermatologist
    setRefreshCounters(counters => ({
        ...counters,
        [ratingDermatologistId]: (counters[ratingDermatologistId] || 0) + 1
    }));
  };

  const toggleRatings = (dermatologistId) => {
    setShowRatings(prev => ({
      ...prev,
      [dermatologistId]: !prev[dermatologistId]
    }));
  };

  const fetchPaymentStatus = async (patientId, dermatologists) => {
    const status = {};
    await Promise.all(
      dermatologists.map(async (derm) => {
        if (!derm._id) return;
        try {
          const res = await axios.get(`${process.env.REACT_APP_API_URL}/api/payments/status?patientId=${patientId}&dermatologistId=${derm._id}`);
          status[derm._id] = res.data.paid;
        } catch {
          status[derm._id] = false;
        }
      })
    );
    setPaymentStatus(status);
  };

  const fetchUnusedPayments = async (patientId, dermatologists) => {
    const counts = {};
    await Promise.all(
      dermatologists.map(async (derm) => {
        if (!derm._id) return;
        try {
          const res = await axios.get(`${process.env.REACT_APP_API_URL}/api/payments/unused-count?patientId=${patientId}&dermatologistId=${derm._id}`);
          counts[derm._id] = res.data.count;
        } catch {
          counts[derm._id] = 0;
        }
      })
    );
    setUnusedPayments(counts);
  };

  const fetchDermatologists = async () => {
    try {
      const token = localStorage.getItem('token');
      const response = await axios.get(`${process.env.REACT_APP_API_URL}/api/dermatologists`, { 
        headers: { Authorization: `Bearer ${token}` }
      });
      setDermatologists(response.data);
      setLoading(false);
      await fetchPaymentStatus(patientId, response.data);
      await fetchUnusedPayments(patientId, response.data);
    } catch (error) {
      console.error('Error fetching dermatologists:', error);
      setLoading(false);
    }
  };

  const fetchPatientData = async () => {
    try {
      const token = localStorage.getItem('token');
      const response = await axios.get(`${process.env.REACT_APP_API_URL}/api/patient/me`, { 
        headers: { Authorization: `Bearer ${token}` }
      });
      setPatientId(response.data._id);
      setPatientName(response.data.username);
    } catch (error) {
      console.error('Error fetching patient info:', error);
    }
  };

  useEffect(() => {
    fetchPatientData();
  }, []);

  useEffect(() => {
    if (!patientId) return;
    const fetchAll = async () => {
      try {
        const response = await axios.get(`${process.env.REACT_APP_API_URL}/api/dermatologists`, { withCredentials: true });
        setDermatologists(response.data);
        setLoading(false);
        await fetchPaymentStatus(patientId, response.data);
        await fetchUnusedPayments(patientId, response.data);
      } catch (error) {
        console.error('Error fetching dermatologists:', error);
        setLoading(false);
      }
    };
    fetchAll();
  }, [patientId]);

  const fetchRequests = async () => {
    try {
      const token = localStorage.getItem('token');
      const response = await axios.get(`${process.env.REACT_APP_API_URL}/api/patient/${patientId}/requests?status=${filter}`, {
        headers: { Authorization: `Bearer ${token}` }
      });
    } catch (error) {
      console.error('Error fetching requests:', error);
    }
  };

  return (
    <div className="patient-dashboard-container">
      <div className="patient-dashboard-header">
        <h2 className="patient-dashboard-title">
          Available Dermatologists
          <Link to="/requested-status" className="patient-status-link">
            → View Requested Status
          </Link>
        </h2>
        <button onClick={handleLogout} className="patient-logout-btn">
          <span className="patient-logout-icon">🚪</span>
          <span className="patient-logout-text">Logout</span>
        </button>
      </div>

      {loading ? (
        <div className="patient-loading-container">
          <TailSpin height={50} width={50} color="#4fa94d" />
          <p>Loading dermatologists...</p>
        </div>
      ) : dermatologists.length === 0 ? (
        <p className="patient-no-dermatologists">No dermatologists available.</p>
      ) : (
        <div className="patient-dermatologists-grid">
          {dermatologists.map(dermatologist => {
            let fee = 0;
            if (typeof dermatologist.fee === 'string') {
              const cleaned = dermatologist.fee.replace(/[^0-9]/g, '');
              fee = cleaned ? parseInt(cleaned, 10) : 0;
            }
            const needsPayment = fee > 0;
            const unusedCount = unusedPayments[dermatologist._id] || 0;

            return (
              <div key={dermatologist._id} className="patient-dermatologist-card">
                <img src={dermatologist.profileImage} alt={dermatologist.name} className="patient-dermatologist-image" />
                <h4 className="patient-dermatologist-name">{dermatologist.name}</h4>
                <p className="patient-dermatologist-qualification">{dermatologist.qualifications}</p>
                <p className="patient-dermatologist-rating">⭐ {dermatologist.ratings}/5</p>
                <p className="patient-dermatologist-experience">📚Experience: {dermatologist.experience}</p>
                <p className="patient-dermatologist-place">📍{dermatologist.place}</p>
                <p className={`patient-dermatologist-verification ${dermatologist.isVerified ? 'verified' : 'not-verified'}`}>
                  {dermatologist.isVerified ? '✔ Verified' : '✖ Not Verified'}
                </p>
                <p className="patient-dermatologist-fee">
                  ��Fee: {fee === 0 ? 'Free' : `₹${fee}`}
                </p>

                <div className="patient-dermatologist-actions">
                  {needsPayment ? (
                    unusedCount > 0 ? (
                      <button
                        className="patient-request-button"
                        onClick={() => {
                          setShowUploadForm(true);
                          setSelectedDermatologistForUpload(dermatologist._id);
                          setUnusedPayments(prev => ({
                            ...prev,
                            [dermatologist._id]: prev[dermatologist._id] - 1
                          }));
                        }}
                      >
                        Request Checkup
                      </button>
                    ) : (
                      <>
                        <p className="pay-first-message">💳 Pay ₹{fee} to proceed checkup</p>
                        <PayButton
                          dermatologistId={dermatologist._id}
                          amount={fee}
                          patientId={patientId}
                          onPaymentCompleted={async () => {
                            await axios.post(`${process.env.REACT_APP_API_URL}/api/payments/mark-paid`, {
                              patientId,
                              dermatologistId: dermatologist._id
                            });
                            await fetchDermatologists();
                            toast.success('Payment successful! You can now submit your checkup request.');
                          }}
                        />
                      </>
                    )
                  ) : (
                    <button
                      className="patient-request-button"
                      onClick={() => handlePaymentCompleted(dermatologist._id)}
                    >
                      Request Checkup
                    </button>
                  )}

                  <button
                    className="patient-rate-button"
                    onClick={() => handleRateDermatologist(dermatologist._id, dermatologist.name)}
                  >
                    ⭐ Rate Dermatologist
                  </button>

                  <button
                    className="patient-view-reviews-button"
                    onClick={() => toggleRatings(dermatologist._id)}
                  >
                    {showRatings[dermatologist._id] ? 'Hide Reviews' : 'View Reviews'}
                  </button>
                </div>

                {showRatings[dermatologist._id] && (
                  <RatingDisplay
                    key={`${dermatologist._id}-${refreshCounters[dermatologist._id] || 0}`}
                    dermatologistId={dermatologist._id}
                    dermatologistName={dermatologist.name}
                  />
                )}
              </div>
            );
          })}
        </div>
      )}

      {showUploadForm && selectedDermatologistForUpload && (
        <div className="patient-popup-overlay">
          <div className="patient-popup-content">
            <button onClick={async () => { setShowUploadForm(false); await fetchDermatologists(); }} className="patient-close-button">X</button>
            <CheckupRequestUpload
              dermatologistId={selectedDermatologistForUpload}
              patientId={patientId}
              onSuccess={async () => {
                setShowUploadForm(false);
                await fetchDermatologists();
              }}
            />
          </div>
        </div>
      )}

      {showRatingForm && (
        <RatingForm
          dermatologistId={ratingDermatologistId}
          dermatologistName={ratingDermatologistName}
          onRatingSubmitted={handleRatingSubmitted}
          onClose={() => setShowRatingForm(false)}
        />
      )}

      <button className="patient-ai-fab" onClick={openAiModal}>🧠</button>

      {/* Contact Us Floating Button */}
      <button className="patient-contact-fab" onClick={() => setIsContactModalOpen(true)} title="Contact Support">
        <span role="img" aria-label="Contact">🛎️</span>
        <span className="patient-contact-fab-label">Contact Us</span>
      </button>

      {isAiModalOpen && (
        <div className="patient-ai-modal-overlay">
          <div className="patient-ai-modal-content">
            <button className="patient-ai-modal-close" onClick={closeAiModal}>X</button>
            <AIAssistant role="patient" userName={patientName} />
          </div>
        </div>
      )}

      {/* Contact Us Modal */}
      {isContactModalOpen && (
        <ContactUsModal
          userRole="patient"
          onClose={() => setIsContactModalOpen(false)}
        />
      )}
    </div>
  );
};

export default PatientDashboard;
