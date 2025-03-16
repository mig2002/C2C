// src/components/Transactions.js
import React, { useState } from 'react';
import axios from 'axios';

const Transactions = ({ config }) => {
  const [caseId, setCaseId] = useState('');
  const [transactions, setTransactions] = useState([]);
  const [message, setMessage] = useState('');

  const fetchTransactions = async (e) => {
    e.preventDefault();
    try {
      const res = await axios.get(`/bailiff/trans?caseId=${caseId}`, config);
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
      {transactions.length > 0 && (
        <ul>
          {transactions.map((tx, index) => (
            <li key={index}>{JSON.stringify(tx)}</li>
          ))}
        </ul>
      )}
    </div>
  );
};

export default Transactions;