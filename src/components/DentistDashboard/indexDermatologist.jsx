import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { TailSpin } from 'react-loader-spinner';
import { useNavigate, useLocation } from 'react-router-dom';
import AIAssistant from '../AIAssistant';
import RatingDisplay from '../RatingDisplay';
import ContactUsModal from '../ContactUsModal';
import './indexDermatologist.css';

const stepSections = [
  'basic',
  'symptoms',
  'history',
  'lesion',
];

const DermatologistDashboard = () => {
  const [dermatologistName, setDermatologistName] = useState('');
  const [dermatologistId, setDermatologistId] = useState('');
  const [requests, setRequests] = useState([]);
  const [editRequestId, setEditRequestId] = useState(null);
  const [productInput, setProductInput] = useState('');
  const [descInput, setDescInput] = useState('');
  const [loading, setLoading] = useState(true);
  const [actionLoadingId, setActionLoadingId] = useState(null);
  const [filter, setFilter] = useState('All');
  const [sortOrder, setSortOrder] = useState('desc');
  const [isAiModalOpen, setIsAiModalOpen] = useState(false);
  const [requestCount, setRequestCount] = useState(0);
  const [showRatings, setShowRatings] = useState(false);
  const [requestSteps, setRequestSteps] = useState({}); // { [requestId]: stepIndex }

  const navigate = useNavigate();
  const location = useLocation();
  const [paymentStatus, setPaymentStatus] = useState(null);
  const [paymentOrderId, setPaymentOrderId] = useState(null);
  const [processing, setProcessing] = useState(false);
  const [isContactModalOpen, setIsContactModalOpen] = useState(false);

  const openAiModal = () => setIsAiModalOpen(true);
  const closeAiModal = () => setIsAiModalOpen(false);

  useEffect(() => {
    const token = localStorage.getItem('token');
    axios.get(`${process.env.REACT_APP_API_URL}/api/dermatologist/me`, { 
      headers: { Authorization: `Bearer ${token}` }
    })
      .then(res => {
        setDermatologistName(res.data.profile.name);
        setDermatologistId(res.data.profile._id);
      });
  }, []);

  useEffect(() => {
    const fetchRequests = async () => {
      setLoading(true);
      try {
        const token = localStorage.getItem('token');
        const response = await axios.get(`${process.env.REACT_APP_API_URL}/api/dermatologist/me/requests`, {
          headers: { Authorization: `Bearer ${token}` }
        });
        let data = response.data.requests;

        if (sortOrder === 'asc') {
          data.sort((a, b) => new Date(a.createdAt) - new Date(b.createdAt));
        } else {
          data.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
        }

        setRequests(data);
        setRequestCount(response.data.count);
      } catch (err) {
        console.error('Error fetching requests:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchRequests();
  }, [filter, sortOrder]);

  const refreshRequests = async () => {
    setLoading(true);
    try {
      const token = localStorage.getItem('token');
      const res = await axios.get(`${process.env.REACT_APP_API_URL}/api/dermatologist/me/requests`, { 
        headers: { Authorization: `Bearer ${token}` }
      });
      setRequests(res.data.requests);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
      setActionLoadingId(null);
    }
  };

  const markInProgress = async (id) => {
    setActionLoadingId(id);
    const token = localStorage.getItem('token');
    await axios.patch(`${process.env.REACT_APP_API_URL}/api/dermatologist/me/${id}/update`, {
      status: 'In Progress'
    }, { 
      headers: { Authorization: `Bearer ${token}` }
    });
    await refreshRequests();
  };

  const markCompleted = async (id) => {
    setActionLoadingId(id);
    const token = localStorage.getItem('token');
    await axios.patch(`${process.env.REACT_APP_API_URL}/api/dermatologist/me/${id}/update`, {
      status: 'Completed',
      products: productInput,
      description: descInput
    }, { 
      headers: { Authorization: `Bearer ${token}` }
    });
    setEditRequestId(null);
    setProductInput('');
    setDescInput('');
    await refreshRequests();
  };

  const handleLogout = () => {
    document.cookie = 'token=; Max-Age=0; path=/;';
    document.cookie = 'role=; Max-Age=0; path=/;';
    navigate('/');
  };

  useEffect(() => {
    const params = new URLSearchParams(location.search);
    const status = params.get('status');
    const orderId = params.get('orderId');
    if (status) {
      setPaymentStatus(status);
      setPaymentOrderId(orderId);
      if (status === 'processing' && orderId) {
        setProcessing(true);
        // Poll backend for payment status
        const interval = setInterval(async () => {
          try {
            // Replace with your actual backend endpoint for checking payment status
            const res = await axios.get(`${process.env.REACT_APP_API_URL}/api/phonepe/status/${orderId}`);
            if (res.data && res.data.status) {
              if (res.data.status === 'SUCCESS') {
                setPaymentStatus('success');
                setProcessing(false);
                clearInterval(interval);
              } else if (res.data.status === 'FAILED') {
                setPaymentStatus('failure');
                setProcessing(false);
                clearInterval(interval);
              }
            }
          } catch (err) {
            // Optionally handle error
          }
        }, 9000);
        return () => clearInterval(interval);
      }
    }
  }, [location.search]);

  const handleRetry = () => {
    // Remove query params and reload page to allow retry
    navigate('/dermatologist', { replace: true });
    window.location.reload();
  };

  // Show payment status message if present
  if (paymentStatus) {
    if (paymentStatus === 'success') {
      return (
        <div className="payment-status-message success">
          <h2>Payment Successful!</h2>
          <p>Your payment was successful. You can now access all features.</p>
        </div>
      );
    } else if (paymentStatus === 'failure') {
      return (
        <div className="payment-status-message failure">
          <h2>Payment Failed</h2>
          <p>Your payment could not be completed. Please try again.</p>
          <button onClick={handleRetry}>Retry Payment</button>
        </div>
      );
    } else if (paymentStatus === 'processing') {
      return (
        <div className="payment-status-message processing">
          <h2>Payment Processing...</h2>
          <TailSpin height={40} width={40} color="#4fa94d" />
          <p>We are waiting for confirmation. This may take a few moments.</p>
          {processing && paymentOrderId && (
            <p>Order ID: {paymentOrderId}</p>
          )}
        </div>
      );
    }
  }

  return (
    <div className="dermatologist-dashboard-container">
      <div className="dermatologist-dashboard-header">
        <div className="dermatologist-header-content">
          <h2 className="dermatologist-welcome-text">👋 Welcome, {dermatologistName}</h2>
          <h3 className="dermatologist-section-title">📋 Patient Checkup Requests</h3>
        </div>
        <div className="dermatologist-header-actions">
          <button 
            className="dermatologist-ratings-btn"
            onClick={() => setShowRatings(!showRatings)}
          >
            {showRatings ? '📋 Hide Ratings' : '⭐ View My Ratings'}
          </button>
          <button onClick={handleLogout} className="dermatologist-logout-btn">
            <span className="dermatologist-logout-icon">🚪</span>
            <span className="dermatologist-logout-text">Logout</span>
          </button>
        </div>
      </div>

      {showRatings && dermatologistId && (
        <div className="dermatologist-ratings-section">
          <h3 className="dermatologist-ratings-title">⭐ My Ratings & Reviews</h3>
          <RatingDisplay dermatologistId={dermatologistId} dermatologistName={dermatologistName} />
        </div>
      )}

      <div className="dermatologist-filter-sort-controls">
        <select value={filter} onChange={(e) => setFilter(e.target.value)}>
          <option value="All">All</option>
          <option value="Pending">Pending</option>
          <option value="In Progress">In Progress</option>
          <option value="Completed">Completed</option>
        </select>

        <select value={sortOrder} onChange={(e) => setSortOrder(e.target.value)}>
          <option value="desc">Newest First</option>
          <option value="asc">Oldest First</option>
        </select>
      </div>
      <div className="dermatologist-requests-count">
        Showing <span className="dermatologist-count-number">{requestCount}</span> request(s)
      </div>
      <div className="dermatologist-requests-container">
        {loading ? (
          <div className="dermatologist-loading-container">
            <TailSpin height={50} width={50} color="#4fa94d" />
          </div>
        ) : requests.length === 0 ? (
          <p className="dermatologist-no-requests">No checkup requests found.</p>
        ) : (
          <ul className="dermatologist-requests-list">
            {requests.map(req => {
              const step = requestSteps[req._id] || 0;
              const setStep = (newStep) => setRequestSteps(prev => ({ ...prev, [req._id]: newStep }));
              return (
                <li key={req._id} className="dermatologist-request-item">
                  <div className="dermatologist-request-header">
                    <div className="dermatologist-request-info">
                      <p>🧑‍🤝‍🧑 Patient: {req.patientId || 'Unknown'}</p>
                      <p>📅 Date: {new Date(req.createdAt).toLocaleString()}</p>
                      <p className={`dermatologist-status dermatologist-status-${req.status.toLowerCase().replace(' ', '-')}`}>
                        📌 Status: {req.status}
                      </p>
                    </div>
                  </div>

                  {/* Step 1: Basic Information */}
                  {step === 0 && (
                    <div className="dermatologist-request-section">
                      <h4 className="dermatologist-section-title">📸 Basic Information</h4>
                      <div className="dermatologist-request-images">
                        {req.images.map((img, i) => (
                          <div key={i} className="dermatologist-image-container">
                            <img src={`${process.env.REACT_APP_API_URL}/${img.imageFilename}`} alt="Patient Image" className="dermatologist-request-image" />
                            {img.description && (
                              <p className="dermatologist-request-image-description">{img.description}</p>
                            )}
                          </div>
                        ))}
                      </div>
                      {req.description && (
                        <div className="dermatologist-info-row">
                          <span className="dermatologist-info-label">Description:</span>
                          <span className="dermatologist-info-value">{req.description}</span>
                        </div>
                      )}
                      {req.bodyPart && (
                        <div className="dermatologist-info-row">
                          <span className="dermatologist-info-label">Affected Body Part:</span>
                          <span className="dermatologist-info-value">{req.bodyPart}</span>
                        </div>
                      )}
                      {req.skinType && (
                        <div className="dermatologist-info-row">
                          <span className="dermatologist-info-label">Skin Type:</span>
                          <span className="dermatologist-info-value">{req.skinType}</span>
                        </div>
                      )}
                    </div>
                  )}

                  {/* Step 2: Symptoms & Duration */}
                  {step === 1 && (
                    <div className="dermatologist-request-section">
                      <h4 className="dermatologist-section-title">🩺 Symptoms & Duration</h4>
                      {req.symptoms && (
                        <div className="dermatologist-info-row">
                          <span className="dermatologist-info-label">Symptoms:</span>
                          <span className="dermatologist-info-value">{req.symptoms}</span>
                        </div>
                      )}
                      {req.duration && (
                        <div className="dermatologist-info-row">
                          <span className="dermatologist-info-label">Duration:</span>
                          <span className="dermatologist-info-value">{req.duration}</span>
                        </div>
                      )}
                      <div className="dermatologist-info-grid">
                        {req.onsetType && (
                          <div className="dermatologist-info-item">
                            <span className="dermatologist-info-label">Onset Type:</span>
                            <span className="dermatologist-info-value">{req.onsetType}</span>
                          </div>
                        )}
                        {req.spreading && (
                          <div className="dermatologist-info-item">
                            <span className="dermatologist-info-label">Spreading Pattern:</span>
                            <span className="dermatologist-info-value">{req.spreading}</span>
                          </div>
                        )}
                        {req.bleedingOrPus && (
                          <div className="dermatologist-info-item">
                            <span className="dermatologist-info-label">Bleeding/Pus:</span>
                            <span className="dermatologist-info-value">{req.bleedingOrPus}</span>
                          </div>
                        )}
                        {req.sunExposure && (
                          <div className="dermatologist-info-item">
                            <span className="dermatologist-info-label">Sun Exposure:</span>
                            <span className="dermatologist-info-value">{req.sunExposure}</span>
                          </div>
                        )}
                      </div>
                      {(req.itchLevel > 0 || req.painLevel > 0) && (
                        <div className="dermatologist-levels">
                          {req.itchLevel > 0 && (
                            <div className="dermatologist-level-item">
                              <span className="dermatologist-info-label">Itch Level:</span>
                              <div className="dermatologist-level-bar">
                                <div 
                                  className="dermatologist-level-fill" 
                                  style={{ width: `${(req.itchLevel / 10) * 100}%` }}
                                ></div>
                                <span className="dermatologist-level-text">{req.itchLevel}/10</span>
                              </div>
                            </div>
                          )}
                          {req.painLevel > 0 && (
                            <div className="dermatologist-level-item">
                              <span className="dermatologist-info-label">Pain Level:</span>
                              <div className="dermatologist-level-bar">
                                <div 
                                  className="dermatologist-level-fill" 
                                  style={{ width: `${(req.painLevel / 10) * 100}%` }}
                                ></div>
                                <span className="dermatologist-level-text">{req.painLevel}/10</span>
                              </div>
                            </div>
                          )}
                        </div>
                      )}
                    </div>
                  )}

                  {/* Step 3: Medical History */}
                  {step === 2 && (
                    <div className="dermatologist-request-section">
                      <h4 className="dermatologist-section-title">📋 Medical History</h4>
                      <div className="dermatologist-info-grid">
                        {req.cosmeticUse && (
                          <div className="dermatologist-info-item">
                            <span className="dermatologist-info-label">Recent Cosmetic Use:</span>
                            <span className="dermatologist-info-value">{req.cosmeticUse}</span>
                          </div>
                        )}
                        {req.newProductUse && (
                          <div className="dermatologist-info-item">
                            <span className="dermatologist-info-label">New Product Use:</span>
                            <span className="dermatologist-info-value">{req.newProductUse}</span>
                          </div>
                        )}
                        {req.workExposure && (
                          <div className="dermatologist-info-item">
                            <span className="dermatologist-info-label">Work Exposure:</span>
                            <span className="dermatologist-info-value">{req.workExposure}</span>
                          </div>
                        )}
                        {req.allergies && (
                          <div className="dermatologist-info-item">
                            <span className="dermatologist-info-label">Known Allergies:</span>
                            <span className="dermatologist-info-value">{req.allergies}</span>
                          </div>
                        )}
                        {req.pastSkinConditions && (
                          <div className="dermatologist-info-item">
                            <span className="dermatologist-info-label">Previous Skin Conditions:</span>
                            <span className="dermatologist-info-value">{req.pastSkinConditions}</span>
                          </div>
                        )}
                        {req.familyHistory && (
                          <div className="dermatologist-info-item">
                            <span className="dermatologist-info-label">Family History:</span>
                            <span className="dermatologist-info-value">{req.familyHistory}</span>
                          </div>
                        )}
                        {req.medicationsUsed && (
                          <div className="dermatologist-info-item">
                            <span className="dermatologist-info-label">Medications Used:</span>
                            <span className="dermatologist-info-value">{req.medicationsUsed}</span>
                          </div>
                        )}
                      </div>
                    </div>
                  )}

                  {/* Step 4: Lesion Characteristics */}
                  {step === 3 && (
                    <div className="dermatologist-request-section">
                      <h4 className="dermatologist-section-title">🔍 Lesion Characteristics</h4>
                      <div className="dermatologist-info-grid">
                        {req.lesionType && (
                          <div className="dermatologist-info-item">
                            <span className="dermatologist-info-label">Lesion Type:</span>
                            <span className="dermatologist-info-value">{req.lesionType}</span>
                          </div>
                        )}
                        {req.lesionColor && (
                          <div className="dermatologist-info-item">
                            <span className="dermatologist-info-label">Lesion Color:</span>
                            <span className="dermatologist-info-value">{req.lesionColor}</span>
                          </div>
                        )}
                        {req.lesionShape && (
                          <div className="dermatologist-info-item">
                            <span className="dermatologist-info-label">Lesion Shape:</span>
                            <span className="dermatologist-info-value">{req.lesionShape}</span>
                          </div>
                        )}
                        {req.lesionBorder && (
                          <div className="dermatologist-info-item">
                            <span className="dermatologist-info-label">Lesion Border:</span>
                            <span className="dermatologist-info-value">{req.lesionBorder}</span>
                          </div>
                        )}
                        {req.lesionTexture && (
                          <div className="dermatologist-info-item">
                            <span className="dermatologist-info-label">Surface Texture:</span>
                            <span className="dermatologist-info-value">{req.lesionTexture}</span>
                          </div>
                        )}
                      </div>
                      {req.associatedFeatures && (
                        <div className="dermatologist-info-row">
                          <span className="dermatologist-info-label">Associated Features:</span>
                          <span className="dermatologist-info-value">{req.associatedFeatures}</span>
                        </div>
                      )}
                      {req.patientNotes && (
                        <div className="dermatologist-info-row">
                          <span className="dermatologist-info-label">Patient Notes:</span>
                          <span className="dermatologist-info-value">{req.patientNotes}</span>
                        </div>
                      )}
                    </div>
                  )}

                  {/* Step Navigation */}
                  <div className="dermatologist-step-navigation">
                    <button
                      className="dermatologist-action-btn dermatologist-btn-secondary"
                      onClick={() => setStep(Math.max(0, step - 1))}
                      disabled={step === 0}
                    >
                      ← Back
                    </button>
                    <span style={{ flex: 1 }} />
                    <button
                      className="dermatologist-action-btn dermatologist-btn-primary"
                      onClick={() => setStep(Math.min(stepSections.length - 1, step + 1))}
                      disabled={step === stepSections.length - 1}
                    >
                      Next →
                    </button>
                  </div>

                  {/* Action Buttons */}
                  {req.status === 'Pending' && (
                    <div className="dermatologist-action-buttons">
                      <button
                        className="dermatologist-action-btn dermatologist-btn-primary"
                        onClick={() => markInProgress(req._id)}
                        disabled={actionLoadingId === req._id}
                      >
                        {actionLoadingId === req._id ? 'Loading...' : 'Mark In Progress'}
                      </button>
                    </div>
                  )}
                  {req.status === 'In Progress' && (
                    <div className="dermatologist-action-buttons">
                      {editRequestId === req._id ? (
                        <>
                          <div className="dermatologist-form-inputs">
                            <input
                              className="dermatologist-form-input"
                              type="text"
                              placeholder="Products to use"
                              value={productInput}
                              onChange={(e) => setProductInput(e.target.value)}
                            />
                            <input
                              className="dermatologist-form-input"
                              type="text"
                              placeholder="Description/Precautions"
                              value={descInput}
                              onChange={(e) => setDescInput(e.target.value)}
                            />
                          </div>
                          <button
                            className="dermatologist-action-btn dermatologist-btn-success"
                            onClick={() => markCompleted(req._id)}
                            disabled={actionLoadingId === req._id}
                          >
                            {actionLoadingId === req._id ? 'Submitting...' : 'Submit Completion'}
                          </button>
                        </>
                      ) : (
                        <button
                          className="dermatologist-action-btn dermatologist-btn-secondary"
                          onClick={() => setEditRequestId(req._id)}
                        >
                          Mark Completed
                        </button>
                      )}
                    </div>
                  )}
                  {req.status === 'Completed' && (
                    <div className="dermatologist-completed-info">
                      {req.products && <p>💊 Products: {req.products}</p>}
                      {req.description && <p>📝 Description: {req.description}</p>}
                    </div>
                  )}
                </li>
              );
            })}
          </ul>
        )}
      </div>

      {/* AI Assistant FAB */}
      <button className="dermatologist-ai-fab" onClick={openAiModal}>
        🧠
      </button>

      {/* AI Assistant Modal */}
      {isAiModalOpen && (
        <div className="dermatologist-ai-modal-overlay">
          <div className="dermatologist-ai-modal-content">
            <button className="dermatologist-ai-modal-close" onClick={closeAiModal}>X</button>
            <AIAssistant role="dermatologist" userName={dermatologistName} />
          </div>
        </div>
      )}

      {/* Contact Us Floating Button */}
      <button className="patient-contact-fab" onClick={() => setIsContactModalOpen(true)} title="Contact Support">
        <span role="img" aria-label="Contact">🛎️</span>
        <span className="patient-contact-fab-label">Contact Us</span>
      </button>

      {/* Contact Us Modal */}
      {isContactModalOpen && (
        <ContactUsModal
          userRole="dermatologist"
          dermatologistName={dermatologistName}
          dermatologistId={dermatologistId}
          onClose={() => setIsContactModalOpen(false)}
        />
      )}
    </div>
  );
};

export default DermatologistDashboard; 