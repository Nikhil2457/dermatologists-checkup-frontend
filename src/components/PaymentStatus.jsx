import React, { useEffect, useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
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
    if (orderId && patientId && dermatologistId) {
      setStatus('success');
      toast.success('Payment successful! You can now submit your checkup request.');
      setTimeout(() => navigate('/dermatologists'), 3000); // Redirect to patient dashboard
    } else {
      setStatus('failure');
      toast.error('Missing payment information. Please try again.');
      setTimeout(() => navigate('/'), 2000);
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
    </div>
  );
};

export default PaymentStatus; 