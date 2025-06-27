import React, { useState } from 'react';
import './PayButton.css';
import axios from 'axios';
import { toast } from 'react-toastify';

const PayButton = ({ amount = "300.00", dermatologistId, patientId, onPaymentCompleted }) => {
  const [loading, setLoading] = useState(false);

  const handlePhonePePayment = async () => {
    setLoading(true);
    try {
      console.log('Initiating PhonePe payment with:', { amount, dermatologistId, patientId });
      const response = await axios.post(`${process.env.REACT_APP_API_URL}/api/checkup-request/initiate-payment`, {
        amount,
        dermatologistId,
        patientId
      });
      if (response.data && response.data.url) {
        window.location.href = response.data.url;
      } else {
        toast.error('Failed to initiate PhonePe payment.');
      }
    } catch (err) {
      toast.error('Error initiating PhonePe payment.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ width: '100%' }}>
      <div style={{ marginBottom: 8, textAlign: 'center', fontWeight: 500 }}>
        Pay ₹{amount} to proceed
      </div>
      <button className="phonepe-pay-btn" onClick={handlePhonePePayment} disabled={loading}>
        {loading ? 'Redirecting...' : 'Pay with PhonePe'}
      </button>
    </div>
  );
};

export default PayButton;
