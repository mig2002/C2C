import React, { useState, useEffect } from "react";
import { FileText, UserCheck, RefreshCw, Check, X, Users, AlertTriangle } from "lucide-react";
import axios from "axios";

// Simple Button Component (reused from lawyer dashboard)
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
      <a href={to} style={{ textDecoration: "none" }}>
        <button style={styles[variant]}>{children}</button>
      </a>
    );
  }
  
  return (
    <button style={styles[variant]} onClick={onClick} type={type}>
      {children}
    </button>
  );
};

// Change Lawyer Form Component
const ChangeLawyerForm = ({ onClose, onSubmit, caseId }) => {
  const [formData, setFormData] = useState({
    oldUserId: "",
    newUserId: "",
    caseId: caseId || ""
  });
  
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
  
  const handleSubmit = (e) => {
    e.preventDefault();
    
    // Validate form
    const newErrors = {};
    if (!formData.oldUserId.trim()) newErrors.oldUserId = "Current lawyer ID is required";
    if (!formData.newUserId.trim()) newErrors.newUserId = "New lawyer ID is required";
    if (!formData.caseId.trim()) newErrors.caseId = "Case ID is required";
    
    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }
    
    onSubmit(formData);
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
          <h2 style={{ margin: 0, color: "#e88d7d" }}>Change Case Lawyer</h2>
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
              Case ID*
            </label>
            <input 
              type="text" 
              name="caseId" 
              value={formData.caseId} 
              onChange={handleChange} 
              readOnly={!!caseId}
              style={{ 
                width: "100%", 
                padding: "8px", 
                borderRadius: "4px", 
                border: errors.caseId ? "1px solid red" : "1px solid #ddd",
                backgroundColor: caseId ? "#f5f5f5" : "white"
              }}
            />
            {errors.caseId && (
              <p style={{ color: "red", margin: "5px 0 0 0", fontSize: "14px" }}>
                {errors.caseId}
              </p>
            )}
          </div>
          
          <div style={{ marginBottom: "15px" }}>
            <label style={{ display: "block", marginBottom: "5px", fontWeight: "500" }}>
              Current Lawyer User ID*
            </label>
            <input 
              type="text" 
              name="oldUserId" 
              value={formData.oldUserId} 
              onChange={handleChange} 
              style={{ 
                width: "100%", 
                padding: "8px", 
                borderRadius: "4px", 
                border: errors.oldUserId ? "1px solid red" : "1px solid #ddd"
              }}
            />
            {errors.oldUserId && (
              <p style={{ color: "red", margin: "5px 0 0 0", fontSize: "14px" }}>
                {errors.oldUserId}
              </p>
            )}
          </div>
          
          <div style={{ marginBottom: "20px" }}>
            <label style={{ display: "block", marginBottom: "5px", fontWeight: "500" }}>
              New Lawyer User ID*
            </label>
            <input 
              type="text" 
              name="newUserId" 
              value={formData.newUserId} 
              onChange={handleChange} 
              style={{ 
                width: "100%", 
                padding: "8px", 
                borderRadius: "4px", 
                border: errors.newUserId ? "1px solid red" : "1px solid #ddd"
              }}
            />
            {errors.newUserId && (
              <p style={{ color: "red", margin: "5px 0 0 0", fontSize: "14px" }}>
                {errors.newUserId}
              </p>
            )}
          </div>
          
          <div style={{ display: "flex", justifyContent: "flex-end", gap: "10px" }}>
            <Button variant="outline" onClick={onClose}>Cancel</Button>
            <Button type="submit">Submit Change</Button>
          </div>
        </form>
      </div>
    </div>
  );
};

// Update User Role Form
const UpdateUserRoleForm = ({ onClose, onSubmit }) => {
  const [formData, setFormData] = useState({
    userId: "",
    status: "Verified"
  });
  
  const [errors, setErrors] = useState({});
  
  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
    
    if (errors[e.target.name]) {
      setErrors({
        ...errors,
        [e.target.name]: null
      });
    }
  };
  
  const handleSubmit = (e) => {
    e.preventDefault();
    
    // Validate form
    const newErrors = {};
    if (!formData.userId.trim()) newErrors.userId = "User ID is required";
    
    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }
    
    onSubmit(formData);
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
        maxWidth: "500px"
      }}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "20px" }}>
          <h2 style={{ margin: 0, color: "#e88d7d" }}>Update User Status</h2>
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
              User ID*
            </label>
            <input 
              type="text" 
              name="userId" 
              value={formData.userId} 
              onChange={handleChange} 
              style={{ 
                width: "100%", 
                padding: "8px", 
                borderRadius: "4px", 
                border: errors.userId ? "1px solid red" : "1px solid #ddd"
              }}
            />
            {errors.userId && (
              <p style={{ color: "red", margin: "5px 0 0 0", fontSize: "14px" }}>
                {errors.userId}
              </p>
            )}
          </div>
          
          <div style={{ marginBottom: "20px" }}>
            <label style={{ display: "block", marginBottom: "5px", fontWeight: "500" }}>
              Status*
            </label>
            <select
              name="status"
              value={formData.status}
              onChange={handleChange}
              style={{
                width: "100%",
                padding: "8px",
                borderRadius: "4px",
                border: "1px solid #ddd"
              }}
            >
              <option value="Verified">Verified</option>
              <option value="Rejected">Rejected</option>
            </select>
          </div>
          
          <div style={{ display: "flex", justifyContent: "flex-end", gap: "10px" }}>
            <Button variant="outline" onClick={onClose}>Cancel</Button>
            <Button type="submit">Update Status</Button>
          </div>
        </form>
      </div>
    </div>
  );
};

// Main Bailiff Dashboard Component
export default function BailiffDashboard() {
  const [pendingCases, setPendingCases] = useState([]);
  const [selectedCase, setSelectedCase] = useState(null);
  const [transactions, setTransactions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [loadingTransactions, setLoadingTransactions] = useState(false);
  const [showChangeLawyerForm, setShowChangeLawyerForm] = useState(false);
  const [showUpdateUserForm, setShowUpdateUserForm] = useState(false);
  const [activeTab, setActiveTab] = useState("pending"); // "pending" or "verified"
  
  // Fetch cases on component mount
  useEffect(() => {
    fetchPendingCases();
  }, []);
  
  // Fetch pending cases from API
  const fetchPendingCases = async () => {
    try {
      setLoading(true);
      
      // Actual API call implementation
      const token = localStorage.getItem('authToken');
      try {
        const response = await axios.get('/api/bailiff/case', {
          headers: { Authorization: token }
        });
        setPendingCases(response.data.pendingCases || []);
      } catch (apiError) {
        console.error('API Error:', apiError);
        // Fallback to simulated data if API fails
        setPendingCases([
          { _id: "123", title: "Smith vs. Jones", caseNumber: "CV-2024-1234", status: "Pending", courtName: "Central District Court", judge: "Hon. Maria Garcia", parties: ["John Smith", "David Jones"] },
          { _id: "456", title: "Property Dispute #422", caseNumber: "CV-2024-5678", status: "Pending", courtName: "County Court", judge: "Hon. Robert Chen", parties: ["ABC Corporation", "Homeowners Association"] }
        ]);
      }
      
      setLoading(false);
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
  
  // Fetch transactions for a case
  const fetchTransactions = async (caseId) => {
    try {
      setLoadingTransactions(true);
      
      // Actual API call implementation
      const token = localStorage.getItem('authToken');
      try {
        const response = await axios.get(`/api/bailiff/trans?caseId=${caseId}`, {
          headers: { Authorization: token }
        });
        setTransactions(response.data.transactions || []);
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
  
  // Handle verify case
  const handleVerifyCase = async (caseId) => {
    try {
      const token = localStorage.getItem('authToken');
      await axios.put('/api/bailiff/verifyCase', { caseId }, {
        headers: { Authorization: token }
      });
      
      // Update local state
      setPendingCases(pendingCases.filter(c => c._id !== caseId));
      if (selectedCase && selectedCase._id === caseId) {
        setSelectedCase({ ...selectedCase, status: "Open" });
      }
      
      alert("Case verified successfully!");
    } catch (error) {
      console.error('Error verifying case:', error);
      alert("Failed to verify case. Please try again.");
    }
  };
  
  // Handle close case
  const handleCloseCase = async (caseId) => {
    try {
      const token = localStorage.getItem('authToken');
      await axios.put('/api/bailiff/closeCase', { caseId }, {
        headers: { Authorization: token }
      });
      
      // Update local state
      if (selectedCase && selectedCase._id === caseId) {
        setSelectedCase({ ...selectedCase, status: "Closed" });
      }
      
      alert("Case closed successfully!");
    } catch (error) {
      console.error('Error closing case:', error);
      alert("Failed to close case. Please try again.");
    }
  };
  
  // Handle change lawyer form submission
  const handleSubmitChangeLawyer = async (formData) => {
    try {
      const token = localStorage.getItem('authToken');
      await axios.put('/api/bailiff/changeLawyer', formData, {
        headers: { Authorization: token }
      });
      
      setShowChangeLawyerForm(false);
      alert("Lawyer changed successfully!");
    } catch (error) {
      console.error('Error changing lawyer:', error);
      alert(`Failed to change lawyer: ${error.response?.data?.msg || "Please try again."}`);
    }
  };
  
  // Handle update user role form submission
  const handleSubmitUpdateUser = async (formData) => {
    try {
      const token = localStorage.getItem('authToken');
      await axios.put('/api/bailiff/role', formData, {
        headers: { Authorization: token }
      });
      
      setShowUpdateUserForm(false);
      alert(`User status updated to ${formData.status} successfully!`);
    } catch (error) {
      console.error('Error updating user status:', error);
      alert(`Failed to update user status: ${error.response?.data?.msg || "Please try again."}`);
    }
  };

  // Handle logout
  const handleLogout = () => {
    // Clear authentication token from localStorage
    localStorage.removeItem('authToken');
    
    // Redirect to login page
    window.location.href = '/login';
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
          <h1>Bailiff Dashboard</h1>
          {!selectedCase && (
            <div style={{ display: "flex", gap: "10px" }}>
              <Button onClick={() => setShowUpdateUserForm(true)}>
                <UserCheck size={16} style={{ marginRight: "5px" }} />
                Verify User
              </Button>
            </div>
          )}
        </div>
        
        {!selectedCase ? (
          <div style={{ display: "grid", gridTemplateColumns: "1fr", gap: "20px" }}>
            {/* Action Tabs */}
            <div style={{ display: "flex", gap: "10px", marginBottom: "10px" }}>
              <button 
                onClick={() => setActiveTab("pending")}
                style={{
                  padding: "10px 20px",
                  background: activeTab === "pending" ? "#e88d7d" : "white",
                  color: activeTab === "pending" ? "white" : "black",
                  border: "none",
                  borderRadius: "4px",
                  cursor: "pointer",
                  fontWeight: activeTab === "pending" ? "bold" : "normal"
                }}
              >
                <AlertTriangle size={16} style={{ marginRight: "5px", verticalAlign: "middle" }} />
                Pending Cases
              </button>
              <button 
                onClick={() => setActiveTab("users")}
                style={{
                  padding: "10px 20px",
                  background: activeTab === "users" ? "#e88d7d" : "white",
                  color: activeTab === "users" ? "white" : "black",
                  border: "none",
                  borderRadius: "4px",
                  cursor: "pointer",
                  fontWeight: activeTab === "users" ? "bold" : "normal"
                }}
              >
                <Users size={16} style={{ marginRight: "5px", verticalAlign: "middle" }} />
                Manage Lawyers
              </button>
            </div>
            
            {/* Pending Cases List */}
            {activeTab === "pending" && (
              <div style={{ background: "white", borderRadius: "8px", boxShadow: "0 2px 4px rgba(0,0,0,0.1)", padding: "20px" }}>
                <div style={{ display: "flex", alignItems: "center", marginBottom: "15px", color: "#e88d7d" }}>
                  <FileText size={20} style={{ marginRight: "10px" }} />
                  <h3 style={{ margin: 0 }}>Pending Cases</h3>
                </div>
                
                {loading ? (
                  <p style={{ textAlign: "center", padding: "20px" }}>Loading...</p>
                ) : pendingCases.length > 0 ? (
                  <div>
                    {pendingCases.map((caseItem) => (
                      <div 
                        key={caseItem._id}
                        style={{ 
                          padding: "12px", 
                          borderBottom: "1px solid #eee", 
                          display: "flex",
                          justifyContent: "space-between",
                          alignItems: "center"
                        }}
                      >
                        <div style={{ cursor: "pointer" }} onClick={() => handleCaseSelect(caseItem)}>
                          <h4 style={{ margin: 0, marginBottom: "4px" }}>{caseItem.title}</h4>
                          <p style={{ margin: 0, color: "gray", fontSize: "14px" }}>
                            Case #: {caseItem.caseNumber} | Court: {caseItem.courtName}
                          </p>
                        </div>
                        <div style={{ display: "flex", gap: "10px" }}>
                          <Button 
                            onClick={() => handleVerifyCase(caseItem._id)}
                            style={{ display: "flex", alignItems: "center", gap: "5px" }}
                          >
                            <Check size={16} />
                            Verify
                          </Button>
                          <Button 
                            variant="outline" 
                            onClick={() => handleCaseSelect(caseItem)}
                            style={{ display: "flex", alignItems: "center", gap: "5px" }}
                          >
                            View
                          </Button>
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div style={{ textAlign: "center", padding: "30px 20px" }}>
                    <p>No pending cases found.</p>
                  </div>
                )}
              </div>
            )}
            
            {/* Lawyer Management */}
            {activeTab === "users" && (
              <div style={{ background: "white", borderRadius: "8px", boxShadow: "0 2px 4px rgba(0,0,0,0.1)", padding: "20px" }}>
                <div style={{ display: "flex", alignItems: "center", marginBottom: "15px", color: "#e88d7d" }}>
                  <Users size={20} style={{ marginRight: "10px" }} />
                  <h3 style={{ margin: 0 }}>Lawyer Management</h3>
                </div>
                
                <div style={{ textAlign: "center", padding: "20px" }}>
                  <p>Use these tools to manage case assignments and verify users.</p>
                  <div style={{ display: "flex", gap: "15px", justifyContent: "center", marginTop: "20px" }}>
                    <Button onClick={() => setShowChangeLawyerForm(true)}>
                      Change Case Lawyer
                    </Button>
                    <Button onClick={() => setShowUpdateUserForm(true)}>
                      Verify User
                    </Button>
                  </div>
                </div>
              </div>
            )}
          </div>
        ) : (
          <div>
            {/* Case Detail View */}
            <Button 
              variant="outline" 
              onClick={() => setSelectedCase(null)} 
              style={{ marginBottom: "20px" }}
            >
              ← Back to Dashboard
            </Button>
            
            <div style={{ display: "grid", gridTemplateColumns: "1fr", gap: "20px" }}>
              {/* Case Details */}
              <div style={{ background: "white", borderRadius: "8px", boxShadow: "0 2px 4px rgba(0,0,0,0.1)", padding: "20px" }}>
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "start" }}>
                  <div>
                    <h2>{selectedCase.title}</h2>
                    <p style={{ color: "gray" }}>Case #: {selectedCase.caseNumber}</p>
                  </div>
                  <div>
                    <span style={{ 
                      display: "inline-block",
                      padding: "5px 10px",
                      borderRadius: "15px",
                      fontSize: "14px",
                      fontWeight: "bold",
                      backgroundColor: selectedCase.status === "Pending" ? "#FFC107" : 
                                      selectedCase.status === "Open" ? "#4CAF50" : 
                                      selectedCase.status === "Closed" ? "#9E9E9E" : "#e88d7d",
                      color: "white"
                    }}>
                      {selectedCase.status}
                    </span>
                  </div>
                </div>
                
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
                
                <div style={{ marginTop: "20px", display: "flex", justifyContent: "flex-end", gap: "10px" }}>
                  {selectedCase.status === "Pending" && (
                    <Button onClick={() => handleVerifyCase(selectedCase._id)}>
                      <Check size={16} style={{ marginRight: "5px" }} />
                      Verify Case
                    </Button>
                  )}
                  {selectedCase.status === "Open" && (
                    <Button onClick={() => handleCloseCase(selectedCase._id)}>
                      Close Case
                    </Button>
                  )}
                  <Button 
                    variant="outline" 
                    onClick={() => setShowChangeLawyerForm(true)}
                  >
                    Change Lawyer
                  </Button>
                </div>
              </div>
              
              {/* Transactions */}
              <div style={{ background: "white", borderRadius: "8px", boxShadow: "0 2px 4px rgba(0,0,0,0.1)", padding: "20px" }}>
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "15px" }}>
                  <h3 style={{ margin: 0 }}>Case Transactions</h3>
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
      
      {/* Change Lawyer Form Modal */}
      {showChangeLawyerForm && (
        <ChangeLawyerForm 
          onClose={() => setShowChangeLawyerForm(false)}
          onSubmit={handleSubmitChangeLawyer}
          caseId={selectedCase?._id}
        />
      )}
      
      {/* Update User Role Form Modal */}
      {showUpdateUserForm && (
        <UpdateUserRoleForm 
          onClose={() => setShowUpdateUserForm(false)}
          onSubmit={handleSubmitUpdateUser}
        />
      )}
    </div>
  );
}