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

  console.log('PaymentStatus component loaded with params:', { orderId, patientId, dermatologistId });

  useEffect(() => {
    const checkStatusAndMarkPaid = async () => {
      try {
        const token = localStorage.getItem('token');
        
        if (!token) {
          setStatus('failure');
          toast.error('Authentication required. Please login again.');
          setTimeout(() => navigate('/'), 2000); // Navigate to home instead of /login
          return;
        }

        console.log('Checking payment status for orderId:', orderId);

        // 1. Check payment status from backend
        const res = await axios.get(`${process.env.REACT_APP_API_URL}/api/phonepe/status/${orderId}`, {
          headers: { Authorization: `Bearer ${token}` }
        });
        
        console.log('Payment status response:', res.data);
        
        if (res.data.success && res.data.status === 'SUCCESS') {
          // 2. Mark payment as paid in your DB
          await axios.post(`${process.env.REACT_APP_API_URL}/api/payments/mark-paid`, {
            patientId,
            dermatologistId,
            orderId
          }, {
            headers: { Authorization: `Bearer ${token}` }
          });
          setStatus('success');
          toast.success('Payment successful! You can now submit your checkup request.');
          setTimeout(() => navigate('/dermatologists'), 3000); // Redirect to patient dashboard
        } else if (res.data.success && res.data.status === 'FAILED') {
          setStatus('failure');
          toast.error('Payment failed. Please try again.');
          setTimeout(() => navigate('/dermatologists'), 3000);
        } else if (res.data.success && res.data.status === 'PROCESSING') {
          // If still processing, check again after 3 seconds
          setTimeout(() => {
            checkStatusAndMarkPaid();
          }, 3000);
        } else {
          setStatus('failure');
          toast.error('Payment status unclear. Please check with support.');
          setTimeout(() => navigate('/dermatologists'), 3000);
        }
      } catch (err) {
        console.error('Payment status check error:', err);
        setStatus('failure');
        if (err.response?.status === 401) {
          toast.error('Authentication expired. Please login again.');
          setTimeout(() => navigate('/'), 2000);
        } else if (err.response?.status === 404) {
          toast.error('Payment not found. Please contact support.');
          setTimeout(() => navigate('/dermatologists'), 3000);
        } else {
          toast.error('Error verifying payment status. Please try again.');
          setTimeout(() => navigate('/dermatologists'), 3000);
        }
      }
    };

    if (orderId && patientId && dermatologistId) {
      checkStatusAndMarkPaid();
    } else {
      console.error('Missing payment parameters:', { orderId, patientId, dermatologistId });
      setStatus('failure');
      toast.error('Missing payment information. Please try again.');
      setTimeout(() => navigate('/dermatologists'), 2000);
    }
  }, [orderId, patientId, dermatologistId, navigate]);

  return (
    <div style={{ 
      minHeight: '100vh', 
      display: 'flex', 
      alignItems: 'center', 
      justifyContent: 'center', 
      flexDirection: 'column',
      backgroundColor: '#f5f5f5',
      padding: '20px'
    }}>
      {status === 'processing' && (
        <>
          <TailSpin height={60} width={60} color="#1976d2" />
          <div style={{ marginTop: 20, fontSize: 20, color: '#1976d2', fontWeight: 600 }}>
            Verifying payment...
          </div>
          <div style={{ marginTop: 10, fontSize: 14, color: '#666', textAlign: 'center' }}>
            Please wait while we confirm your payment
          </div>
          <div style={{ marginTop: 5, fontSize: 12, color: '#999' }}>
            Order ID: {orderId}
          </div>
        </>
      )}
      {status === 'success' && (
        <>
          <div style={{ color: 'green', fontSize: 22, fontWeight: 700, marginBottom: 10 }}>
            ✅ Payment Successful!
          </div>
          <div style={{ color: '#666', fontSize: 16, marginBottom: 20 }}>
            Redirecting to dashboard...
          </div>
          <div style={{ fontSize: 12, color: '#999' }}>
            Order ID: {orderId}
          </div>
        </>
      )}
      {status === 'failure' && (
        <>
          <div style={{ color: 'red', fontSize: 22, fontWeight: 700, marginBottom: 10 }}>
            ❌ Payment Failed
          </div>
          <div style={{ color: '#666', fontSize: 16, marginBottom: 20 }}>
            Redirecting to dashboard...
          </div>
          <div style={{ fontSize: 12, color: '#999' }}>
            Order ID: {orderId}
          </div>
        </>
      )}
    </div>
  );
};

export default PaymentStatus; 