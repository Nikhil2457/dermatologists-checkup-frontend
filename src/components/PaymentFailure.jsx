import React from 'react';
import { useNavigate } from 'react-router-dom';

const PaymentFailure = () => {
  const navigate = useNavigate();
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
      <div style={{ color: 'red', fontSize: 22, fontWeight: 700, marginBottom: 10 }}>
        ❌ Payment Failed
      </div>
      <div style={{ color: '#666', fontSize: 16, marginBottom: 20 }}>
        Unfortunately, your payment could not be processed. Please try again or contact support.
      </div>
      <button style={{ padding: '10px 24px', fontSize: 16, background: '#1976d2', color: '#fff', border: 'none', borderRadius: 4, cursor: 'pointer' }} onClick={() => navigate('/')}>Go Home</button>
    </div>
  );
};

export default PaymentFailure; 