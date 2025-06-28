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
        
        if (!token) {
          setStatus('failure');
          toast.error('Authentication required. Please login again.');
          setTimeout(() => navigate('/login'), 2000);
          return;
        }

        // 1. Check payment status from backend
        const res = await axios.get(`${process.env.REACT_APP_API_URL}/api/phonepe/status/${orderId}`, {
          headers: { Authorization: `Bearer ${token}` }
        });
        
        console.log('Payment status response:', res.data);
        
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
          setTimeout(() => navigate('/'), 3000); // Redirect to dashboard or home
        } else if (res.data.status === 'FAILED') {
          setStatus('failure');
          toast.error('Payment failed. Please try again.');
          setTimeout(() => navigate('/'), 3000);
        } else {
          // If still processing, check again after 2 seconds
          setTimeout(() => {
            checkStatusAndMarkPaid();
          }, 2000);
        }
      } catch (err) {
        console.error('Payment status check error:', err);
        setStatus('failure');
        toast.error('Error verifying payment status. Please try again.');
        setTimeout(() => navigate('/'), 3000);
      }
    };

    if (orderId && patientId && dermatologistId) {
      checkStatusAndMarkPaid();
    } else {
      setStatus('failure');
      toast.error('Missing payment information. Please try again.');
      setTimeout(() => navigate('/'), 2000);
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
          <div style={{ marginTop: 10, fontSize: 14, color: '#666' }}>
            Please wait while we confirm your payment
          </div>
        </>
      )}
      {status === 'success' && (
        <>
          <div style={{ color: 'green', fontSize: 22, fontWeight: 700, marginBottom: 10 }}>
            Payment Successful!
          </div>
          <div style={{ color: '#666', fontSize: 16 }}>
            Redirecting to dashboard...
          </div>
        </>
      )}
      {status === 'failure' && (
        <>
          <div style={{ color: 'red', fontSize: 22, fontWeight: 700, marginBottom: 10 }}>
            Payment Failed
          </div>
          <div style={{ color: '#666', fontSize: 16 }}>
            Redirecting to dashboard...
          </div>
        </>
      )}
    </div>
  );
};

export default PaymentStatus; 