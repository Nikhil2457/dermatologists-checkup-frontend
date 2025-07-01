import React, { useEffect, useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { TailSpin } from 'react-loader-spinner';
import { toast } from 'react-toastify';
import axios from 'axios';

const PaymentStatus = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const [polling, setPolling] = useState(false);
  const [orderId, setOrderId] = useState(null);
  const [status, setStatus] = useState('processing');

  useEffect(() => {
    const params = new URLSearchParams(location.search);
    const orderIdParam = params.get('orderId');
    setOrderId(orderIdParam);
    if (orderIdParam) {
      setPolling(true);
      setStatus('processing');
      pollPaymentStatus(orderIdParam);
    } else {
      setStatus('failure');
      toast.error('Missing payment information. Please try again.');
      setTimeout(() => navigate('/'), 2000);
    }
    // eslint-disable-next-line
  }, [location.search]);

  const pollPaymentStatus = async (orderId) => {
    let attempts = 0;
    const maxAttempts = 10;
    const interval = setInterval(async () => {
      attempts++;
      try {
        const res = await axios.get(`${process.env.REACT_APP_API_URL}/api/phonepe/status/${orderId}`);
        if (res.data && res.data.status) {
          if (res.data.status === 'SUCCESS' || res.data.status === 'COMPLETED') {
            setStatus('success');
            setPolling(false);
            clearInterval(interval);
            toast.success('Payment successful! You can now submit your checkup request.');
            setTimeout(() => navigate('/dermatologists'), 2000);
          } else if (res.data.status === 'FAILED') {
            setStatus('failure');
            setPolling(false);
            clearInterval(interval);
            toast.error('Payment failed. Please try again.');
            setTimeout(() => navigate('/'), 2000);
          }
        } else if (res.data && res.data.error) {
          // Backend returned an error
          console.error('Backend error:', res.data);
          toast.error(`Backend error: ${res.data.message || res.data.error}`);
        }
      } catch (err) {
        // Log and show backend/network error
        console.error('Network or backend error:', err);
        toast.error(`Network or backend error: ${err.response?.data?.message || err.message}`);
      }
      if (attempts >= maxAttempts) {
        setPolling(false);
        setStatus('timeout');
        clearInterval(interval);
        toast.error('Payment status check timed out.');
        setTimeout(() => navigate('/'), 2000);
      }
    }, 5000);
  };

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
            Processing payment...
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
            Redirecting to home...
          </div>
          <div style={{ fontSize: 12, color: '#999' }}>
            Order ID: {orderId}
          </div>
        </>
      )}
      {status === 'timeout' && (
        <>
          <div style={{ color: 'orange', fontSize: 22, fontWeight: 700, marginBottom: 10 }}>
            Payment status check timed out.
          </div>
          <div style={{ color: '#666', fontSize: 16, marginBottom: 20 }}>
            Redirecting to home...
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