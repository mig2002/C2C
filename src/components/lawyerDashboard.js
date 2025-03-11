import React, { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { FileText, DollarSign, Plus, X, RefreshCw } from "lucide-react";
import axios from "axios";

// Simple Button Component
const Button = ({ children, onClick, variant = "default", to, type = "button" }) => {
  const styles = {
    outline: {
      border: "1px solid black",
      padding: "8px 16px",
      background: "white",
      cursor: "pointer",
    },
    default: {
      background: "#e88d7d",
      color: "white",
      padding: "8px 16px",
      border: "none",
      cursor: "pointer",
      borderRadius: "4px",
    },
  };

  if (to) {
    return (
      <Link to={to} style={{ textDecoration: "none" }}>
        <button style={styles[variant]}>{children}</button>
      </Link>
    );
  }
  
  return (
    <button style={styles[variant]} onClick={onClick} type={type}>
      {children}
    </button>
  );
};

// New Case Form Component
const NewCaseForm = ({ onClose, onSubmit }) => {
  const [formData, setFormData] = useState({
    caseNumber: "",
    title: "",
    description: "",
    parties: [],
    judge: "",
    courtName: ""
  });
  
  const [party, setParty] = useState("");
  const [errors, setErrors] = useState({});
  
  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
    
    // Clear error for this field if it exists
    if (errors[e.target.name]) {
      setErrors({
        ...errors,
        [e.target.name]: null
      });
    }
  };
  
  const addParty = () => {
    if (party.trim()) {
      setFormData({
        ...formData,
        parties: [...formData.parties, party.trim()]
      });
      setParty("");
      
      // Clear parties error if it exists
      if (errors.parties) {
        setErrors({
          ...errors,
          parties: null
        });
      }
    }
  };
  
  const removeParty = (index) => {
    const updatedParties = [...formData.parties];
    updatedParties.splice(index, 1);
    setFormData({
      ...formData,
      parties: updatedParties
    });
  };
  
  const handleSubmit = (e) => {
    e.preventDefault();
    
    // Validate form
    const newErrors = {};
    if (!formData.title.trim()) newErrors.title = "Title is required";
    if (!formData.caseNumber.trim()) newErrors.caseNumber = "Case number is required";
    if (formData.parties.length === 0) newErrors.parties = "At least one party is required";
    if (!formData.judge.trim()) newErrors.judge = "Judge name is required";
    if (!formData.courtName.trim()) newErrors.courtName = "Court name is required";
    
    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }
    
    onSubmit(formData);
  };
  
  // Handle Enter key press in the party input
  const handleKeyPress = (e) => {
    if (e.key === 'Enter' && party.trim()) {
      e.preventDefault();
      addParty();
    }
  };
  
  return (
    <div style={{ 
      position: "fixed", 
      top: 0, 
      left: 0, 
      right: 0, 
      bottom: 0, 
      background: "rgba(0,0,0,0.5)", 
      display: "flex", 
      justifyContent: "center", 
      alignItems: "center",
      zIndex: 1000
    }}>
      <div style={{ 
        background: "white", 
        borderRadius: "8px", 
        padding: "25px",
        width: "90%",
        maxWidth: "500px",
        maxHeight: "90vh",
        overflow: "auto"
      }}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "20px" }}>
          <h2 style={{ margin: 0, color: "#e88d7d" }}>File New Case</h2>
          <button 
            onClick={onClose}
            style={{ 
              background: "none", 
              border: "none", 
              cursor: "pointer", 
              fontSize: "24px",
              display: "flex",
              alignItems: "center",
              justifyContent: "center"
            }}
          >
            <X size={24} />
          </button>
        </div>
        
        <form onSubmit={handleSubmit}>
          <div style={{ marginBottom: "15px" }}>
            <label style={{ display: "block", marginBottom: "5px", fontWeight: "500" }}>
              Case Number*
            </label>
            <input 
              type="text" 
              name="caseNumber" 
              value={formData.caseNumber} 
              onChange={handleChange} 
              style={{ 
                width: "100%", 
                padding: "8px", 
                borderRadius: "4px", 
                border: errors.caseNumber ? "1px solid red" : "1px solid #ddd"
              }}
            />
            {errors.caseNumber && (
              <p style={{ color: "red", margin: "5px 0 0 0", fontSize: "14px" }}>
                {errors.caseNumber}
              </p>
            )}
          </div>
          
          <div style={{ marginBottom: "15px" }}>
            <label style={{ display: "block", marginBottom: "5px", fontWeight: "500" }}>
              Case Title*
            </label>
            <input 
              type="text" 
              name="title" 
              value={formData.title} 
              onChange={handleChange} 
              style={{ 
                width: "100%", 
                padding: "8px", 
                borderRadius: "4px", 
                border: errors.title ? "1px solid red" : "1px solid #ddd"
              }}
            />
            {errors.title && (
              <p style={{ color: "red", margin: "5px 0 0 0", fontSize: "14px" }}>
                {errors.title}
              </p>
            )}
          </div>
          
          <div style={{ marginBottom: "15px" }}>
            <label style={{ display: "block", marginBottom: "5px", fontWeight: "500" }}>
              Description
            </label>
            <textarea 
              name="description" 
              value={formData.description} 
              onChange={handleChange} 
              style={{ 
                width: "100%", 
                padding: "8px", 
                borderRadius: "4px", 
                border: "1px solid #ddd",
                minHeight: "80px",
                resize: "vertical"
              }}
            />
          </div>
          
          <div style={{ marginBottom: "15px" }}>
            <label style={{ display: "block", marginBottom: "5px", fontWeight: "500" }}>
              Parties*
            </label>
            <div style={{ display: "flex" }}>
              <input 
                type="text" 
                value={party} 
                onChange={(e) => setParty(e.target.value)} 
                onKeyPress={handleKeyPress}
                placeholder="Add party name and press Enter"
                style={{ 
                  flex: 1, 
                  padding: "8px", 
                  borderRadius: "4px 0 0 4px", 
                  border: errors.parties ? "1px solid red" : "1px solid #ddd",
                  borderRight: "none"
                }}
              />
              <button 
                type="button" 
                onClick={addParty}
                style={{ 
                  background: "#e88d7d", 
                  color: "white", 
                  border: "none", 
                  borderRadius: "0 4px 4px 0", 
                  padding: "0 15px",
                  cursor: "pointer"
                }}
              >
                Add
              </button>
            </div>
            
            {errors.parties && (
              <p style={{ color: "red", margin: "5px 0", fontSize: "14px" }}>
                {errors.parties}
              </p>
            )}
            
            {formData.parties.length > 0 && (
              <div style={{ marginTop: "10px" }}>
                {formData.parties.map((p, i) => (
                  <div 
                    key={i} 
                    style={{ 
                      display: "inline-flex",
                      alignItems: "center", 
                      background: "#f5f2f0", 
                      padding: "5px 10px", 
                      borderRadius: "15px", 
                      margin: "0 5px 5px 0",
                      fontSize: "14px"
                    }}
                  >
                    {p}
                    <button 
                      type="button"
                      onClick={() => removeParty(i)}
                      style={{ 
                        background: "none", 
                        border: "none", 
                        cursor: "pointer", 
                        marginLeft: "5px",
                        padding: "0",
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center"
                      }}
                    >
                      <X size={14} />
                    </button>
                  </div>
                ))}
              </div>
            )}
          </div>
          
          <div style={{ marginBottom: "15px" }}>
            <label style={{ display: "block", marginBottom: "5px", fontWeight: "500" }}>
              Judge Name*
            </label>
            <input 
              type="text" 
              name="judge" 
              value={formData.judge} 
              onChange={handleChange} 
              style={{ 
                width: "100%", 
                padding: "8px", 
                borderRadius: "4px", 
                border: errors.judge ? "1px solid red" : "1px solid #ddd"
              }}
            />
            {errors.judge && (
              <p style={{ color: "red", margin: "5px 0 0 0", fontSize: "14px" }}>
                {errors.judge}
              </p>
            )}
          </div>
          
          <div style={{ marginBottom: "20px" }}>
            <label style={{ display: "block", marginBottom: "5px", fontWeight: "500" }}>
              Court Name*
            </label>
            <input 
              type="text" 
              name="courtName" 
              value={formData.courtName} 
              onChange={handleChange} 
              style={{ 
                width: "100%", 
                padding: "8px", 
                borderRadius: "4px", 
                border: errors.courtName ? "1px solid red" : "1px solid #ddd"
              }}
            />
            {errors.courtName && (
              <p style={{ color: "red", margin: "5px 0 0 0", fontSize: "14px" }}>
                {errors.courtName}
              </p>
            )}
          </div>
          
          <div style={{ display: "flex", justifyContent: "flex-end", gap: "10px" }}>
            <Button variant="outline" onClick={onClose}>Cancel</Button>
            <Button type="submit">Submit Case</Button>
          </div>
        </form>
      </div>
    </div>
  );
};

// Simple Dashboard
export default function SimpleLawyerDashboard() {
  const [cases, setCases] = useState([]);
  const [selectedCase, setSelectedCase] = useState(null);
  const [transactions, setTransactions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [loadingTransactions, setLoadingTransactions] = useState(false);
  const [showNewCaseForm, setShowNewCaseForm] = useState(false);
  const navigate = useNavigate();
  
  // Fetch cases on component mount
  useEffect(() => {
    fetchCases();
  }, []);
  
  // Fetch cases from API
  const fetchCases = async () => {
    try {
      setLoading(true);
      
      // Replace this with your actual API call
      // const token = localStorage.getItem('authToken');
      // const response = await axios.get('/api/lawyer/cases', {
      //   headers: { Authorization: token }
      // });
      // setCases(response.data.cases);
      
      // Simulated data for demonstration
      setTimeout(() => {
        setCases([
          { _id: "123", title: "Smith vs. Jones", caseNumber: "CV-2024-1234", courtName: "Central District Court", judge: "Hon. Maria Garcia", parties: ["John Smith", "David Jones"] },
          { _id: "456", title: "Property Dispute #422", caseNumber: "CV-2024-5678", courtName: "County Court", judge: "Hon. Robert Chen", parties: ["ABC Corporation", "Homeowners Association"] }
        ]);
        setLoading(false);
      }, 500);
      
    } catch (error) {
      console.error('Error fetching cases:', error);
      setLoading(false);
    }
  };
  
  // Handle case selection and fetch transactions
  const handleCaseSelect = async (caseData) => {
    setSelectedCase(caseData);
    await fetchTransactions(caseData._id);
  };
  
  // Fetch transactions from the JudicialDeposit contract
  const fetchTransactions = async (caseId) => {
    try {
      setLoadingTransactions(true);
      
      // Actual API call implementation
      const token = localStorage.getItem('authToken');
      try {
        const response = await axios.get(`/api/lawyer?caseId=${caseId}`, {
          headers: { Authorization: token }
        });
        setTransactions(response.data.moneyTransactions || []);
      } catch (apiError) {
        console.error('API Error:', apiError);
        // Fallback to simulated data if API fails
        setTransactions([
          { type: "Deposit", amount: 1.5, from: "0x1234567890abcdef", timestamp: Date.now()/1000 - 86400 },
          { type: "Withdrawal", amount: 0.5, from: "0x1234567890abcdef", timestamp: Date.now()/1000 }
        ]);
      }
      
      setLoadingTransactions(false);
    } catch (error) {
      console.error('Error fetching transactions:', error);
      setTransactions([]);
      setLoadingTransactions(false);
    }
  };
  
  // Handle form submission
  const handleSubmitCase = async (formData) => {
    try {
      // Replace this with your actual API call
      // const token = localStorage.getItem('authToken');
      // await axios.post('/api/lawyer', formData, {
      //   headers: { Authorization: token }
      // });
      
      console.log("Submitting case:", formData);
      
      // For demonstration, add the new case to the state
      const newCase = {
        _id: Date.now().toString(),
        ...formData
      };
      
      setCases([...cases, newCase]);
      setShowNewCaseForm(false);
      
      // Show success alert
      alert("Case filed successfully!");
      
    } catch (error) {
      console.error('Error submitting case:', error);
      alert("Failed to submit case. Please try again.");
    }
  };

  // Handle logout functionality
  const handleLogout = () => {
    // Clear authentication token from local storage
    localStorage.removeItem('authToken');
    
    // You could also clear any other user-related data from localStorage
    // localStorage.removeItem('userData');
    
    // Display logout message
    alert("You have been successfully logged out.");
    
    // Redirect to login page
    navigate('/login');
  };

  return (
    <div style={{ minHeight: "100vh", background: "#f5f2f0", padding: "0" }}>
      {/* Navigation */}
      <nav style={{ display: "flex", justifyContent: "space-between", alignItems: "center", padding: "15px 20px", background: "white", boxShadow: "0 2px 4px rgba(0,0,0,0.1)" }}>
        <div style={{ background: "#e88d7d", padding: "10px 20px", borderRadius: "5px", color: "white", fontWeight: "bold" }}>JUDICIAL LEDGER</div>
        <div style={{ display: "flex", gap: "15px" }}>
          <Button variant="outline" onClick={handleLogout}>LOGOUT</Button>
        </div>
      </nav>

      {/* Main Content */}
      <div style={{ padding: "20px", maxWidth: "1000px", margin: "0 auto" }}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "20px" }}>
          <h1>Lawyer Dashboard</h1>
          {!selectedCase && (
           <div style={{ display: "flex", justifyContent: "flex-end", gap: "10px", marginBottom: "20px" }}>
           <Button style={{ backgroundColor: "#4CAF50", color: "white", padding: "10px 15px", borderRadius: "8px", fontSize: "16px", fontWeight: "bold" }} 
                   onClick={() => setShowNewCaseForm(true)}>
             <Plus size={16} style={{ marginRight: "5px" }} />
             New Case
           </Button>
         
           <Button style={{ backgroundColor: "#007BFF", color: "white", padding: "10px 15px", borderRadius: "8px", fontSize: "16px", fontWeight: "bold" }} 
                   onClick={() => setShowNewCaseForm(true)}>
            
             CaseId
           </Button>
         </div>
         
           
            
          )}
        </div>
        
        {!selectedCase ? (
          <div style={{ display: "grid", gridTemplateColumns: "1fr", gap: "20px" }}>
            {/* Cases List */}
            <div style={{ background: "white", borderRadius: "8px", boxShadow: "0 2px 4px rgba(0,0,0,0.1)", padding: "20px" }}>
              <div style={{ display: "flex", alignItems: "center", marginBottom: "15px", color: "#e88d7d" }}>
                <FileText size={20} style={{ marginRight: "10px" }} />
                <h3 style={{ margin: 0 }}>My Cases</h3>
              </div>
              
              {loading ? (
                <p style={{ textAlign: "center", padding: "20px" }}>Loading...</p>
              ) : cases.length > 0 ? (
                <div>
                  {cases.map((caseItem) => (
                    <div 
                      key={caseItem._id}
                      style={{ 
                        padding: "12px", 
                        borderBottom: "1px solid #eee", 
                        cursor: "pointer",
                        display: "flex",
                        justifyContent: "space-between"
                      }}
                      onClick={() => handleCaseSelect(caseItem)}
                    >
                      <div>
                        <h4 style={{ margin: 0, marginBottom: "4px" }}>{caseItem.title}</h4>
                        <p style={{ margin: 0, color: "gray", fontSize: "14px" }}>
                          Case #: {caseItem.caseNumber} | Court: {caseItem.courtName}
                        </p>
                      </div>
                      <span style={{ color: "#e88d7d" }}>View</span>
                    </div>
                  ))}
                </div>
              ) : (
                <div style={{ textAlign: "center", padding: "30px 20px" }}>
                  <p>No cases found. Create your first case.</p>
                  <Button onClick={() => setShowNewCaseForm(true)}>
                    <Plus size={16} style={{ marginRight: "5px" }} />
                    New Case
                  </Button>
                </div>

              )}
            </div>
          </div>
        ) : (
          <div>
            {/* Case Detail View */}
            <Button 
              variant="outline" 
              onClick={() => setSelectedCase(null)} 
              style={{ marginBottom: "20px" }}
            >
              ← Back to Cases
            </Button>
            
            <div style={{ display: "grid", gridTemplateColumns: "1fr", gap: "20px" }}>
              {/* Case Details */}
              <div style={{ background: "white", borderRadius: "8px", boxShadow: "0 2px 4px rgba(0,0,0,0.1)", padding: "20px" }}>
                <h2>{selectedCase.title}</h2>
                <p style={{ color: "gray" }}>Case #: {selectedCase.caseNumber}</p>
                
                <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "20px", marginTop: "15px" }}>
                  <div>
                    <h4 style={{ marginBottom: "5px" }}>Court Information</h4>
                    <p style={{ margin: "0 0 5px 0" }}><strong>Court Name:</strong> {selectedCase.courtName}</p>
                    <p style={{ margin: 0 }}><strong>Judge:</strong> {selectedCase.judge}</p>
                  </div>
                  <div>
                    <h4 style={{ marginBottom: "5px" }}>Parties Involved</h4>
                    <ul style={{ paddingLeft: "20px", margin: 0 }}>
                      {selectedCase.parties.map((party, index) => (
                        <li key={index}>{party}</li>
                      ))}
                    </ul>
                  </div>
                </div>
                
                {selectedCase.description && (
                  <div style={{ marginTop: "15px" }}>
                    <h4 style={{ marginBottom: "5px" }}>Description</h4>
                    <p style={{ margin: 0 }}>{selectedCase.description}</p>
                  </div>
                )}
              </div>
              
              {/* Transactions */}
              <div style={{ background: "white", borderRadius: "8px", boxShadow: "0 2px 4px rgba(0,0,0,0.1)", padding: "20px" }}>
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "15px" }}>
                  <div style={{ display: "flex", alignItems: "center", color: "#e88d7d" }}>
                    <DollarSign size={20} style={{ marginRight: "10px" }} />
                    <h3 style={{ margin: 0 }}>Money Transactions</h3>
                  </div>
                  <Button 
                    onClick={() => fetchTransactions(selectedCase._id)}
                    style={{ display: "flex", alignItems: "center", gap: "5px" }}
                  >
                    <RefreshCw size={16} />
                    Refresh
                  </Button>
                </div>
                
                {loadingTransactions ? (
                  <p style={{ textAlign: "center", padding: "20px" }}>Loading transactions...</p>
                ) : transactions.length > 0 ? (
                  transactions.map((transaction, index) => (
                    <div key={index} style={{ padding: "12px", borderBottom: "1px solid #eee" }}>
                      <div style={{ display: "flex", justifyContent: "space-between" }}>
                        <span>{transaction.type}</span>
                        <span style={{ fontWeight: "bold" }}>{transaction.amount} ETH</span>
                      </div>
                      <div style={{ display: "flex", justifyContent: "space-between", fontSize: "14px", color: "gray" }}>
                        <span>From: {transaction.from.substring(0, 8)}...</span>
                        <span>{new Date(transaction.timestamp * 1000).toLocaleDateString()}</span>
                      </div>
                    </div>
                  ))
                ) : (
                  <p style={{ textAlign: "center", padding: "20px", color: "gray" }}>
                    No transactions recorded for this case yet.
                  </p>
                )}
              </div>
            </div>
          </div>
        )}
      </div>
      
      {/* New Case Form Modal */}
      {showNewCaseForm && (
        <NewCaseForm 
          onClose={() => setShowNewCaseForm(false)}
          onSubmit={handleSubmitCase}
        />
      )}
    </div>
  );
}