import React, { useEffect, useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { TailSpin } from 'react-loader-spinner';
import { toast } from 'react-toastify';
import axios from 'axios';

const PaymentCallback = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [orderId, setOrderId] = useState(null);

  useEffect(() => {
    const params = new URLSearchParams(location.search);
    const orderIdParam = params.get('orderId');
    setOrderId(orderIdParam);
    
    if (orderIdParam) {
      checkPaymentStatus(orderIdParam);
    } else {
      toast.error('Missing payment information. Please try again.');
      setTimeout(() => navigate('/'), 2000);
    }
  }, [location.search, navigate]);

  const checkPaymentStatus = async (orderId) => {
    try {
      // First check if payment is already marked as paid in our DB
      const res = await axios.get(`${process.env.REACT_APP_API_URL}/api/phonepe/webhook-status/${orderId}`);
      
      if (res.data && res.data.status) {
        if (res.data.status === 'SUCCESS') {
          toast.success('Payment successful!');
          setTimeout(() => navigate('/success'), 1000);
        } else if (res.data.status === 'FAILED') {
          toast.error('Payment failed. Please try again.');
          setTimeout(() => navigate('/failure'), 1000);
        } else {
          // Payment is still processing, poll for status
          pollPaymentStatus(orderId);
        }
      } else {
        toast.error('Unable to verify payment status.');
        setTimeout(() => navigate('/failure'), 2000);
      }
    } catch (err) {
      console.error('Error checking payment status:', err);
      toast.error('Error verifying payment. Please contact support.');
      setTimeout(() => navigate('/failure'), 2000);
    } finally {
      setLoading(false);
    }
  };

  const pollPaymentStatus = async (orderId) => {
    let attempts = 0;
    const maxAttempts = 10;
    const interval = setInterval(async () => {
      attempts++;
      try {
        const res = await axios.get(`${process.env.REACT_APP_API_URL}/api/phonepe/webhook-status/${orderId}`);
        if (res.data && res.data.status) {
          if (res.data.status === 'SUCCESS') {
            clearInterval(interval);
            toast.success('Payment successful!');
            setTimeout(() => navigate('/success'), 1000);
          } else if (res.data.status === 'FAILED') {
            clearInterval(interval);
            toast.error('Payment failed. Please try again.');
            setTimeout(() => navigate('/failure'), 1000);
          }
        }
      } catch (err) {
        console.error('Error polling payment status:', err);
      }
      
      if (attempts >= maxAttempts) {
        clearInterval(interval);
        toast.error('Payment status check timed out. Please contact support.');
        setTimeout(() => navigate('/failure'), 2000);
      }
    }, 3000);
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
      {loading && (
        <>
          <TailSpin height={60} width={60} color="#1976d2" />
          <div style={{ marginTop: 20, fontSize: 20, color: '#1976d2', fontWeight: 600 }}>
            Verifying payment...
          </div>
          <div style={{ marginTop: 10, fontSize: 14, color: '#666', textAlign: 'center' }}>
            Please wait while we confirm your payment status
          </div>
          <div style={{ marginTop: 5, fontSize: 12, color: '#999' }}>
            Order ID: {orderId}
          </div>
        </>
      )}
    </div>
  );
};

export default PaymentCallback; 