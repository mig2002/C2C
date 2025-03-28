import React, { useState, useEffect } from 'react';
import axios from 'axios';

const CasePaymentComponent = () => {
  const [caseId, setCaseId] = useState('');
  const [amount, setAmount] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [orderId, setOrderId] = useState(null);
  const [paymentSuccess, setPaymentSuccess] = useState(false);

  // Function to load Razorpay script
  useEffect(() => {
    const script = document.createElement('script');
    script.src = 'https://checkout.razorpay.com/v1/checkout.js';
    script.async = true;
    document.body.appendChild(script);

    return () => {
      document.body.removeChild(script);
    };
  }, []);

  // Function to create a Razorpay order
  const createOrder = async () => {
    if (!caseId || !amount) {
      setError('Please enter both Case ID and Amount')
      return;
    }

    if (isNaN(amount) || parseFloat(amount) <= 0) {
      setError('Please enter a valid amount');
      return;
    }

    setLoading(true);
    setError('');
    
    try {
      const token = localStorage.getItem('token');
      const response = await axios.get(`http://localhost:3000/user/lawyer/transfer/money/orderID?caseId=${caseId}&amount=${amount}`, {
        headers: { Authorization: token }
      });
      
      setOrderId(response.data.order_id);
      openRazorpayModal(response.data.order_id);
    } catch (err) {
      setError(err.response?.data?.msg || 'Error creating payment order');
    } finally {
      setLoading(false);
    }
  };

  // Function to open Razorpay payment modal
  const openRazorpayModal = (orderId) => {
    const options = {
      key: "rzp_test_uV3C0lEnqJv9ak", // Replace with env variable
      amount: parseFloat(amount) * 100, // Amount in paisa
      currency: "INR",
      name: "Judicial System",
      description: `Payment for Case ID: ${caseId}`,
      order_id: orderId,
      handler: function(response) {
        // On successful payment
        handlePaymentSuccess();
      },
      prefill: {
        email: localStorage.getItem('email') || '',
      },
      theme: {
        color: "#e88d7d" // Using the same theme color
      },
      modal: {
        ondismiss: function() {
          setLoading(false);
        }
      }
    };

    const rzp = new window.Razorpay(options);
    rzp.open();
  };

  // Handle successful payment - simplified to match backend expectations
  const handlePaymentSuccess = async () => {
    try {
      setLoading(true);
      
      const token = localStorage.getItem('token');
      await axios.post('http://localhost:3000/user/lawyer/transfer/money/addTransaction', {
        caseId: caseId,
        amount: amount
        // No Razorpay-specific parameters since backend doesn't use them
      }, {
        headers: { Authorization: token }
      });
       
      setPaymentSuccess(true);
      setCaseId('');
      setAmount('');
    } catch (err) {
      setError(err.response?.data?.msg || 'Error adding transaction record');
    } finally {
      setLoading(false);
    }
  };

  // Inline styles matching the theme
  const styles = {
    section: {
      backgroundColor: 'white',
      borderRadius: '10px',
      boxShadow: '0 4px 8px rgba(0,0,0,0.1)',
      padding: '25px',
      marginBottom: '30px'
    },
    sectionHeading: {
      color: '#e88d7d',
      marginTop: '0',
      marginBottom: '20px',
      fontSize: '1.4rem'
    },
    formGroup: {
      marginBottom: '20px'
    },
    label: {
      display: 'block',
      marginBottom: '5px',
      fontWeight: '500',
      color: '#333',
      fontSize: '0.875rem'
    },
    input: {
      width: '100%',
      padding: '12px',
      border: '1px solid #ccc',
      borderRadius: '5px',
      fontSize: '16px'
    },
    button: {
      backgroundColor: '#e88d7d',
      color: 'white',
      border: 'none',
      padding: '12px 20px',
      borderRadius: '5px',
      cursor: 'pointer',
      fontSize: '16px',
      fontWeight: '500',
      width: '100%'
    },
    error: {
      color: '#c62828',
      marginTop: '10px',
      background: '#ffebee',
      padding: '10px',
      borderRadius: '5px',
      fontSize: '0.875rem'
    },
    success: {
      color: '#2e7d32',
      marginTop: '10px',
      background: '#e8f5e9',
      padding: '10px',
      borderRadius: '5px',
      fontSize: '0.875rem'
    }
  };

  return (
    <div style={styles.section}>
      <h2 style={styles.sectionHeading}>Make Court Payment</h2>
      
      {paymentSuccess && (
        <div style={styles.success}>
          Payment successfully processed and recorded on blockchain!
        </div>
      )}
      
      {error && <div style={styles.error}>{error}</div>}
      
      <div style={styles.formGroup}>
        <label style={styles.label}>Case ID*</label>
        <input
          type="text"
          value={caseId}
          onChange={(e) => setCaseId(e.target.value)}
          placeholder="Enter Case ID"
          style={styles.input}
          required
        />
      </div>
      
      <div style={styles.formGroup}>
        <label style={styles.label}>Amount (INR)*</label>
        <input
          type="number"
          value={amount}
          onChange={(e) => setAmount(e.target.value)}
          placeholder="Enter amount"
          style={styles.input}
          min="1"
          step="1"
          required
        />
      </div>
      
      <button 
        onClick={createOrder} 
        disabled={loading}
        style={styles.button}
      >
        {loading ? 'Processing...' : 'Make Payment'}
      </button>
    </div>
  );
};

export default CasePaymentComponent;