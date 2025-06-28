import React, { useEffect, useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { TailSpin } from 'react-loader-spinner';
import { toast } from 'react-toastify';

const PaymentStatus = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const [status, setStatus] = useState('processing');

  // Extract orderId, patientId, dermatologistId from query params
  const params = new URLSearchParams(location.search);
  const orderId = params.get('orderId');
  const patientId = params.get('patientId');
  const dermatologistId = params.get('dermatologistId');

  useEffect(() => {
    const checkStatusAndMarkPaid = async () => {
      try {
        const token = localStorage.getItem('token');
        // 1. Check payment status from backend
        const res = await axios.get(`${process.env.REACT_APP_API_URL}/api/phonepe/status/${orderId}`, {
          headers: { Authorization: `Bearer ${token}` }
        });
        if (res.data.status === 'SUCCESS') {
          // 2. Mark payment as paid in your DB
          await axios.post(`${process.env.REACT_APP_API_URL}/api/payments/mark-paid`, {
            patientId,
            dermatologistId
          }, {
            headers: { Authorization: `Bearer ${token}` }
          });
          setStatus('success');
          toast.success('Payment successful! You can now submit your checkup request.');
          setTimeout(() => navigate('/'), 2000); // Redirect to dashboard or home
        } else if (res.data.status === 'FAILED') {
          setStatus('failure');
          toast.error('Payment failed. Please try again.');
        } else {
          setStatus('processing');
        }
      } catch (err) {
        setStatus('failure');
        toast.error('Error verifying payment status.');
      }
    };

    if (orderId && patientId && dermatologistId) {
      checkStatusAndMarkPaid();
    }
  }, [orderId, patientId, dermatologistId, navigate]);

  return (
    <div style={{ minHeight: '60vh', display: 'flex', alignItems: 'center', justifyContent: 'center', flexDirection: 'column' }}>
      {status === 'processing' && (
        <>
          <TailSpin height={60} width={60} color="#1976d2" />
          <div style={{ marginTop: 20, fontSize: 20, color: '#1976d2', fontWeight: 600 }}>
            Verifying payment...
          </div>
        </>
      )}
      {status === 'success' && (
        <div style={{ color: 'green', fontSize: 22, fontWeight: 700 }}>Payment Successful!</div>
      )}
      {status === 'failure' && (
        <div style={{ color: 'red', fontSize: 22, fontWeight: 700 }}>Payment Failed</div>
      )}
    </div>
  );
};

export default PaymentStatus; 