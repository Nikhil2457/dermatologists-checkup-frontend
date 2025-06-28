import React, { useEffect, useState } from 'react';
import axios from 'axios';
import jsPDF from 'jspdf';
import { TailSpin } from 'react-loader-spinner'; // ✅ Use TailSpin
import './RequestedStatus.css';

const RequestedStatus = () => {
  const [requests, setRequests] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState('All');
  const [sortOrder, setSortOrder] = useState('desc');
  const [requestCount, setRequestCount] = useState(0);

  useEffect(() => {
  setLoading(true); // ✅ Move here
  const token = localStorage.getItem('token');
  axios.get(`${process.env.REACT_APP_API_URL}/api/patient/me`, { 
    headers: { Authorization: `Bearer ${token}` }
  })
    .then(res => {
      const patientId = res.data._id;
      return axios.get(`${process.env.REACT_APP_API_URL}/api/patient/${patientId}/requests?status=${filter}`, {
        headers: { Authorization: `Bearer ${token}` }
      });
    })
    .then(res => {
      let data = res.data.requests;

      if (sortOrder === 'asc') {
        data.sort((a, b) => new Date(a.createdAt) - new Date(b.createdAt));
      } else {
        data.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
      }

      setRequests(data);
      setRequestCount(res.data.count);
    })
    .catch(err => console.error('Error fetching requests:', err))
    .finally(() => setLoading(false));
}, [filter, sortOrder]); // ✅ Trigger on change


  const generatePDF = async (req) => {
    const doc = new jsPDF();
    doc.setFontSize(18);
    doc.text('🦷 Dental Checkup Report', 20, 20);

    doc.setFontSize(12);
    doc.text(`Dentist: ${req.dermatologistId?.name || 'N/A'}`, 20, 35);
    doc.text(`Phone: ${req.dermatologistId?.phoneNumber || 'N/A'}`, 20, 45);
    doc.text(`Status: ${req.status}`, 20, 55);
    doc.text(`Products: ${req.products || 'N/A'}`, 20, 65);
    doc.text(`Precautions: ${req.description || 'N/A'}`, 20, 75, { maxWidth: 170 });

    if (req.images && req.images.length > 0) {
      const imgUrl = `${process.env.REACT_APP_API_URL}/uploads/${req.images[0].imageFilename.replace('uploads\\', '')}`;
      try {
        const imageData = await toBase64(imgUrl);
        doc.addImage(imageData, 'JPEG', 20, 90, 80, 80);
      } catch (e) {
        console.error('Image load error:', e);
      }
    }

    doc.save(`checkup_${req._id}.pdf`);
  };

  const toBase64 = (url) =>
    fetch(url)
      .then(res => res.blob())
      .then(blob =>
        new Promise((resolve, reject) => {
          const reader = new FileReader();
          reader.onloadend = () => resolve(reader.result);
          reader.onerror = reject;
          reader.readAsDataURL(blob);
        })
      );

  // Download PDF from backend
  const downloadPDF = async (req) => {
    try {
      const token = localStorage.getItem('token');
      const response = await fetch(`${process.env.REACT_APP_API_URL}/api/export/${req._id}`, {
        method: 'GET',
        headers: { Authorization: `Bearer ${token}` }
      });
      if (!response.ok) throw new Error('Failed to download PDF');
      const blob = await response.blob();
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `checkup_${req._id}.pdf`;
      document.body.appendChild(a);
      a.click();
      a.remove();
      window.URL.revokeObjectURL(url);
    } catch (err) {
      alert('Failed to download PDF report.');
      console.error(err);
    }
  };

  return (
    <div className="requested-status-page">
      <h2 className="requested-status-title">📝 Requested Status</h2>
      <div className="requested-status-controls">
  <select value={filter} onChange={(e) => { setFilter(e.target.value); }}>
    <option value="All">All</option>
    <option value="Pending">Pending</option>
    <option value="In Progress">In Progress</option>
    <option value="Completed">Completed</option>
  </select>

  <select value={sortOrder} onChange={(e) => { setSortOrder(e.target.value);  }}>
    <option value="desc">Newest First</option>
    <option value="asc">Oldest First</option>
  </select>
</div>
<div className="requested-status-count">
  Showing <span className="requested-status-count-number">{requestCount}</span> request(s)
</div>

      {loading ? (
        <div className="requested-status-loading">
          <TailSpin height={50} width={50} color="#4fa94d" />
        </div>
      ) : requests.length === 0 ? (
        <p className="requested-status-no-requests">No checkup requests found.</p>
      ) : (
        <ul className="requested-status-list">
          {requests.map((req) => (
            <li key={req._id} className={`requested-status-card requested-status-${req.status.toLowerCase().replace(' ', '-')}`}>
              <div className="requested-status-info">
                {req.dermatologistId ? (
                  <>
                    <p>👩‍⚕️ <strong>Dermatologist:</strong> {req.dermatologistId.name}</p>
                    <p>📞 <strong>Phone:</strong> {req.dermatologistId.phoneNumber}</p>
                  </>
                ) : (
                  <>
                    <p>👩‍⚕️ <strong>Dermatologist:</strong> Not Assigned</p>
                    <p>📞 <strong>Phone:</strong> N/A</p>
                  </>
                )}

                <p>📌 <strong>Status:</strong> {req.status}</p>
              </div>

              {req.status.toLowerCase() === 'completed' && (
                <div className="requested-status-completed-section">
                  <div className="requested-status-images">
                    {req.images.map((img, index) => (
                      <div key={index} className="requested-status-image-container">
                        <img
                          src={`${process.env.REACT_APP_API_URL}/uploads/${img.imageFilename.replace('uploads\\', '')}`}
                          alt="Result"
                          className="requested-status-image"
                        />
                        <p className="requested-status-image-description">{img.description}</p>
                        <a
                          href={`${process.env.REACT_APP_API_URL}/uploads/${img.imageFilename.replace('uploads\\', '')}`}
                          download={`result_${index}.jpg`}
                          className="requested-status-download-link"
                        >
                          ⬇ Download Image
                        </a>
                      </div>
                    ))}
                  </div>

                  <p><strong>🛒 Products:</strong> {req.products || 'Not provided'}</p>
                  <p><strong>🧾 Precautions:</strong> {req.description || 'Not provided'}</p>

                  <button onClick={() => downloadPDF(req)} className="requested-status-pdf-button">
                    ⬇ Download Full Report (PDF)
                  </button>
                </div>
              )}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

export default RequestedStatus;
