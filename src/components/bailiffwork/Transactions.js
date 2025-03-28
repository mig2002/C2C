// src/components/Transactions.js
import React, { useState } from 'react';
import axios from 'axios';
import styles from '../styles/lawyerdash';

const Transactions = ({ config }) => {
  const [caseId, setCaseId] = useState('');
  const [transactions, setTransactions] = useState([]);
  const [message, setMessage] = useState('');

  const fetchTransactions = async (e) => {
    e.preventDefault();
   
    try {
      const token = localStorage.getItem('token');
      const res = await axios.get(`http://localhost:3000/user/bailiffs/trans?caseId=${caseId}`, {
        headers: { Authorization: token }
      });
      console.log(res.data.transactions);
      setTransactions(res.data.transactions);
      setMessage('');
    } catch (err) {
      setMessage(err.response?.data?.msg || 'Error fetching transactions');
    }
  };

  return (
    <div className="section">
      <h2>Case Transactions</h2>
      <form onSubmit={fetchTransactions}>
        <input
          type="text"
          value={caseId}
          onChange={(e) => setCaseId(e.target.value)}
          placeholder="Enter Case ID"
        />
        <button type="submit">Get Transactions</button>
      </form>
      {message && <p>{message}</p>}
      {transactions.length > 0 ? (
  <div>
    {transactions.map((transaction, index) => (
      <div key={index} style={styles.caseContainer}>
        <h2 style={styles.heading}>Case Information</h2>
        
        <div style={styles.infoRow}>
          <div style={styles.label}>Case ID</div>
          <div style={styles.value}>{transaction[0]}</div>
        </div>
        
        <div style={styles.infoRow}>
          <div style={styles.label}>Court</div>
          <div style={styles.value}>{transaction[2]}</div>
        </div>
        
        <div style={styles.infoRow}>
          <div style={styles.label}>Judge</div>
          <div style={styles.value}>{transaction[1]}</div>
        </div>

        <div style={styles.infoRow}>
          <div style={styles.label}>Lawyer</div>
          <div style={styles.value}>{transaction[5]}</div>
        </div>
        
        <div style={styles.infoRow}>
          <div style={styles.label}>Parties</div>
          <div style={styles.value}>{transaction[3]} vs {transaction[4]}</div>
        </div>
        
        <div style={styles.infoRow}>
          <div style={styles.label}>Amount</div>
          <div style={styles.value}>${transaction[7]}</div>
        </div>
        
        <div style={styles.infoRow}>
          <div style={styles.label}>Status</div>
          <div style={styles.value}>{transaction[9] ? "Approved" : "Pending"}</div>
        </div>

      
      </div>
    ))}
  </div>
) : (
  <p>No case information found</p>
)}
    </div>
  );
};

export default Transactions;