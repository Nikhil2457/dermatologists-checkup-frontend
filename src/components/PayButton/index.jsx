import React, { useState } from 'react';
import './PayButton.css';
import axios from 'axios';
import { toast } from 'react-toastify';

const PayButton = ({ amount = "300.00", dermatologistId, patientId, onPaymentCompleted }) => {
  const [loading, setLoading] = useState(false);
  const [polling, setPolling] = useState(false);
  const [orderId, setOrderId] = useState(null);
  const [status, setStatus] = useState(null);

  const handlePhonePePayment = async () => {
    setLoading(true);
    try {
      const response = await axios.post(`${process.env.REACT_APP_API_URL}/api/checkup-request/initiate-payment`, {
        amount,
        dermatologistId,
        patientId
      });
      if (response.data && response.data.url && response.data.orderId) {
        window.open(response.data.url, '_blank');
        setOrderId(response.data.orderId);
        setPolling(true);
        setStatus('processing');
        pollPaymentStatus(response.data.orderId);
      } else {
        toast.error('Failed to initiate PhonePe payment.');
      }
    } catch (err) {
      toast.error('Error initiating PhonePe payment.');
    } finally {
      setLoading(false);
    }
  };

  const pollPaymentStatus = async (orderId) => {
    let attempts = 0;
    const maxAttempts = 20;
    const interval = setInterval(async () => {
      attempts++;
      try {
        const res = await axios.get(`${process.env.REACT_APP_API_URL}/api/phonepe/status/${orderId}`);
        if (res.data && res.data.status) {
          if (res.data.status === 'SUCCESS') {
            setStatus('success');
            setPolling(false);
            clearInterval(interval);
            toast.success('Payment successful!');
            if (onPaymentCompleted) onPaymentCompleted();
          } else if (res.data.status === 'FAILED') {
            setStatus('failure');
            setPolling(false);
            clearInterval(interval);
            toast.error('Payment failed.');
          }
        }
      } catch (err) {
        // Optionally handle error
      }
      if (attempts >= maxAttempts) {
        setPolling(false);
        setStatus('timeout');
        clearInterval(interval);
        toast.error('Payment status check timed out.');
      }
    }, 5000);
  };

  return (
    <div style={{ width: '100%' }}>
      <div style={{ marginBottom: 8, textAlign: 'center', fontWeight: 500 }}>
        Pay ₹{amount} to proceed
      </div>
      <button className="phonepe-pay-btn" onClick={handlePhonePePayment} disabled={loading || polling}>
        {loading ? 'Processing...' : 'Pay with PhonePe'}
      </button>
      {polling && (
        <div style={{ marginTop: 16, textAlign: 'center', color: '#1976d2', fontWeight: 600 }}>
          Waiting for payment confirmation...
        </div>
      )}
      {status === 'success' && (
        <div style={{ color: 'green', marginTop: 10 }}>Payment Successful!</div>
      )}
      {status === 'failure' && (
        <div style={{ color: 'red', marginTop: 10 }}>Payment Failed. Please try again.</div>
      )}
      {status === 'timeout' && (
        <div style={{ color: 'orange', marginTop: 10 }}>Payment status check timed out.</div>
      )}
    </div>
  );
};

export default PayButton;
