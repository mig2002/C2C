import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import CasePaymentComponent from './mtv';

const SimpleLawyerDashboard = () => {
  const navigate = useNavigate();
  const [caseId, setCaseId] = useState('');
  const [transactions, setTransactions] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  
  // New case form state
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    parties: [],
    judge: '',
    courtName: '',
    newParty: ''
  });

  // Handle logout
  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('role');
    localStorage.removeItem('email');
    navigate('/login');
  };

  // Fetch transactions for a case
  const fetchTransactions = async () => {
    if (!caseId) {
      setError('Please enter a Case ID');
      return;
    }
    
    setLoading(true);
    try {
      const token = localStorage.getItem('token');
      const response = await axios.get(`/lawyer?caseId=${caseId}`, {
        headers: { Authorization: token }
      });
      
      setTransactions(response.data.moneyTransactions);
      setError('');
    } catch (err) {
      setError(err.response?.data?.msg || 'Error fetching transactions');
      setTransactions([]);
    } finally {
      setLoading(false);
    }
  };

  // Handle new case submission
  const handleSubmit = async (e) => {
    e.preventDefault();
    const { title, description, parties, judge, courtName } = formData;
    
    if (!title || !judge || !courtName || parties.length === 0) {
      setError('Missing required fields');
      return;
    }

    try {
      const token = localStorage.getItem('token');
      await axios.post('/lawyer', {
        title,
        description,
        parties,
        judge,
        courtName
      }, {
        headers: { Authorization: token }
      });

      setFormData({
        title: '',
        description: '',
        parties: [],
        judge: '',
        courtName: '',
        newParty: ''
      });
      setError('');
      alert('Case filed successfully!');
    } catch (err) {
      setError(err.response?.data?.msg || 'Error filing case');
    }
  };

  // Add a new party to the parties array
  const addParty = () => {
    if (formData.newParty) {
      setFormData({
        ...formData,
        parties: [...formData.parties, formData.newParty],
        newParty: ''
      });
    }
  };

  // Inline styles matching login page theme
  const styles = {
    // Navbar styles
    navbar: {
      display: 'flex',
      justifyContent: 'space-between',
      alignItems: 'center',
      padding: '15px 20px',
      backgroundColor: 'white',
      boxShadow: '0 2px 4px rgba(0,0,0,0.1)',
      marginBottom: '20px',
      borderRadius: '8px'
    },
    navbarBrand: {
      color: '#e88d7d',
      fontSize: '1.5rem',
      fontWeight: 'bold',
      margin: 0
    },
    logoutButton: {
      backgroundColor: '#e88d7d',
      color: 'white',
      border: 'none',
      padding: '8px 15px',
      borderRadius: '5px',
      cursor: 'pointer',
      fontSize: '0.9rem',
      fontWeight: '500',
      transition: 'background-color 0.3s'
    },
    
    // Dashboard styles
    dashboardContainer: {
      maxWidth: '1200px',
      margin: '0 auto',
      padding: '20px',
      fontFamily: 'Arial, sans-serif',
      backgroundColor: '#f5f2f0',
      minHeight: '100vh'
    },
    contentContainer: {
      padding: '20px',
    },
    heading: {
      color: '#e88d7d',
      marginBottom: '30px',
      borderBottom: '2px solid #e88d7d',
      paddingBottom: '10px'
    },
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
    searchBox: {
      display: 'flex',
      marginBottom: '20px'
    },
    input: {
      flex: '1',
      padding: '12px',
      border: '1px solid #ccc',
      borderRadius: '5px 0 0 5px',
      fontSize: '16px'
    },
    button: {
      backgroundColor: '#e88d7d',
      color: 'white',
      border: 'none',
      padding: '12px 15px',
      borderRadius: '0 5px 5px 0',
      cursor: 'pointer',
      fontSize: '16px',
      fontWeight: '500'
    },
    table: {
      width: '100%',
      borderCollapse: 'collapse',
      marginTop: '10px'
    },
    tableHeader: {
      backgroundColor: '#f5f2f0',
      padding: '12px',
      textAlign: 'left',
      borderBottom: '2px solid #ddd',
      color: '#333'
    },
    tableCell: {
      padding: '12px',
      borderBottom: '1px solid #ddd'
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
    textInput: {
      width: '100%',
      padding: '12px',
      border: '1px solid #ccc',
      borderRadius: '5px',
      fontSize: '16px'
    },
    textarea: {
      width: '100%',
      padding: '12px',
      border: '1px solid #ccc',
      borderRadius: '5px',
      minHeight: '100px',
      fontSize: '16px',
      fontFamily: 'Arial, sans-serif'
    },
    partyInput: {
      display: 'flex',
      marginBottom: '10px'
    },
    partyList: {
      display: 'flex',
      flexWrap: 'wrap',
      gap: '8px',
      marginTop: '10px'
    },
    partyTag: {
      backgroundColor: '#f9e4e0',
      color: '#e88d7d',
      padding: '5px 12px',
      borderRadius: '20px',
      fontSize: '14px'
    },
    error: {
      color: '#c62828',
      marginTop: '10px',
      background: '#ffebee',
      padding: '10px',
      borderRadius: '5px',
      fontSize: '0.875rem'
    },
    submitBtn: {
      backgroundColor: '#e88d7d',
      color: 'white',
      border: 'none',
      padding: '12px 20px',
      borderRadius: '5px',
      cursor: 'pointer',
      fontSize: '16px',
      fontWeight: '500',
      marginTop: '10px',
      width: '100%'
    }
  };

  return (
    <div style={styles.dashboardContainer}>
      {/* Navbar */}
      <nav style={styles.navbar}>
        <h1 style={styles.navbarBrand}>Lawyer Dashboard</h1>
        <button 
          onClick={handleLogout} 
          style={styles.logoutButton}
        >
          Logout
        </button>
      </nav>

      <div style={styles.contentContainer}>
        {/* View Transactions Section */}
        <div style={styles.section}>
          <h2 style={styles.sectionHeading}>View Case Transactions</h2>
          <div style={styles.searchBox}>
            <input
              type="text"
              value={caseId}
              onChange={(e) => setCaseId(e.target.value)}
              placeholder="Enter Case ID"
              style={styles.input}
            />
            <button 
              onClick={fetchTransactions} 
              disabled={loading}
              style={styles.button}
            >
              {loading ? 'Loading...' : 'Search'}
            </button>
          </div>
          
          {error && <p style={styles.error}>{error}</p>}
          
          {transactions.length > 0 ? (
            <table style={styles.table}>
              <thead>
                <tr>
                  <th style={styles.tableHeader}>Amount</th>
                  <th style={styles.tableHeader}>From</th>
                  <th style={styles.tableHeader}>To</th>
                  <th style={styles.tableHeader}>Date</th>
                </tr>
              </thead>
              <tbody>
                {transactions.map((tx, index) => (
                  <tr key={index}>
                    <td style={styles.tableCell}>{tx.amount}</td>
                    <td style={styles.tableCell}>{tx.from}</td>
                    <td style={styles.tableCell}>{tx.to}</td>
                    <td style={styles.tableCell}>{new Date(tx.timestamp).toLocaleDateString()}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          ) : (
            <p>No transactions found</p>
          )}
        </div>
        <CasePaymentComponent />

        {/* File New Case Section */}
        <div style={styles.section}>
          <h2 style={styles.sectionHeading}>File New Case</h2>
          <form onSubmit={handleSubmit}>
            <div style={styles.formGroup}>
              <label style={styles.label}>Title*</label>
              <input
                type="text"
                value={formData.title}
                onChange={(e) => setFormData({...formData, title: e.target.value})}
                required
                style={styles.textInput}
              />
            </div>

            <div style={styles.formGroup}>
              <label style={styles.label}>Description</label>
              <textarea
                value={formData.description}
                onChange={(e) => setFormData({...formData, description: e.target.value})}
                style={styles.textarea}
              />
            </div>

            <div style={styles.formGroup}>
              <label style={styles.label}>Parties*</label>
              <div style={styles.partyInput}>
                <input
                  type="text"
                  value={formData.newParty}
                  onChange={(e) => setFormData({...formData, newParty: e.target.value})}
                  placeholder="Add party"
                  style={{...styles.input, borderRadius: '5px 0 0 5px'}}
                />
                <button type="button" onClick={addParty} style={styles.button}>
                  Add Party
                </button>
              </div>
              <div style={styles.partyList}>
                {formData.parties.map((party, index) => (
                  <span key={index} style={styles.partyTag}>
                    {party}
                  </span>
                ))}
              </div>
            </div>

            <div style={styles.formGroup}>
              <label style={styles.label}>Judge*</label>
              <input
                type="text"
                value={formData.judge}
                onChange={(e) => setFormData({...formData, judge: e.target.value})}
                required
                style={styles.textInput}
              />
            </div>

            <div style={styles.formGroup}>
              <label style={styles.label}>Court Name*</label>
              <input
                type="text"
                value={formData.courtName}
                onChange={(e) => setFormData({...formData, courtName: e.target.value})}
                required
                style={styles.textInput}
              />
            </div>

            {error && <p style={styles.error}>{error}</p>}
            <button type="submit" style={styles.submitBtn}>
              File Case
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default SimpleLawyerDashboard;