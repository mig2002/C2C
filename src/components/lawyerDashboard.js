import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import CasePaymentComponent from './mtv';
import styles from "./styles/lawyerdash";

const SimpleLawyerDashboard = () => {
  const navigate = useNavigate();
  const [activeSection, setActiveSection] = useState('viewTransactions');
  
  // State for transactions section
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
    navigate('/');
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
      const response = await axios.get(`http://localhost:3000/user/lawyer?caseId=${caseId}`, {
        headers: { Authorization: token }
      });
      console.log(response.data.moneyTransactions);
      
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
      await axios.post('http://localhost:3000/user/lawyer/', {
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

  // Render active section
  const renderActiveSection = () => {
    switch(activeSection) {
      case 'viewTransactions':
        return (
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
                      <div style={styles.value}>Rs. {transaction[7]}</div>
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
      case 'casePayment':
        return <CasePaymentComponent />;
      case 'fileNewCase':
        return (
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
        );
      default:
        return null;
    }
  };

  return (
    <div style={{
      display: 'flex', 
      flexDirection: 'column', 
      height: '100vh'
    }}>
      {/* Navbar */}
      <nav style={{
        display: "flex",
        justifyContent: "space-between",
        alignItems: "center",
        padding: "15px 20px",
        backgroundColor: "white",
        boxShadow: "0 2px 4px rgba(0,0,0,0.1)",
        position: 'fixed',
        top: 0,
        left: 0,
        right: 0,
        zIndex: 1000,
      }}>
        <h1 style={styles.navbarBrand}>Lawyer Dashboard</h1>
        <button 
          onClick={handleLogout} 
          style={styles.logoutButton}
        >
          Logout
        </button>
      </nav>

      {/* Dashboard Content */}
      <div style={{
        display: 'flex',
        height: 'calc(100vh - 70px)', // Adjust for header height
        marginTop: '70px', // Match header height
      }}>
        {/* Sidebar Navigation */}
        <div style={{
          width: '250px',
          backgroundColor: '#f4f4f4',
          padding: '20px',
          borderRight: '1px solid #e0e0e0'
        }}>
          <div style={{ marginBottom: '20px' }}>
            <h3 style={{ marginBottom: '10px', color: '#333' }}>Dashboard Sections</h3>
            <button 
              onClick={() => setActiveSection('viewTransactions')}
              style={{
                width: '100%',
                padding: '10px',
                marginBottom: '10px',
                backgroundColor: activeSection === 'viewTransactions' ? '#e88d7d' : 'white',
                color: activeSection === 'viewTransactions' ? 'white' : 'black',
                border: '1px solid #ddd',
                borderRadius: '5px',
                cursor: 'pointer'
              }}
            >
              View Transactions
            </button>
            <button 
              onClick={() => setActiveSection('casePayment')}
              style={{
                width: '100%',
                padding: '10px',
                marginBottom: '10px',
                backgroundColor: activeSection === 'casePayment' ? '#e88d7d' : 'white',
                color: activeSection === 'casePayment' ? 'white' : 'black',
                border: '1px solid #ddd',
                borderRadius: '5px',
                cursor: 'pointer'
              }}
            >
              Case Payment
            </button>
            <button 
              onClick={() => setActiveSection('fileNewCase')}
              style={{
                width: '100%',
                padding: '10px',
                marginBottom: '10px',
                backgroundColor: activeSection === 'fileNewCase' ? '#e88d7d' : 'white',
                color: activeSection === 'fileNewCase' ? 'white' : 'black',
                border: '1px solid #ddd',
                borderRadius: '5px',
                cursor: 'pointer'
              }}
            >
              File New Case
            </button>
          </div>
        </div>

        {/* Main Content Area */}
        <div style={{
          flex: 1,
          padding: '20px',
          overflowY: 'auto'
        }}>
          {renderActiveSection()}
        </div>
      </div>
    </div>
  );
};

export default SimpleLawyerDashboard;