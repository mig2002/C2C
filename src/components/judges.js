// src/components/JudgesDashboard.js
import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import DocumentRetriever from "./DocumentRetriever";

const JudgesDashboard = () => {
  const [isAuthenticated, setIsAuthenticated] = useState(true);
  const [cases, setCases] = useState([]);
  const [selectedCase, setSelectedCase] = useState("");
  const [loading, setLoading] = useState(true);
  const [userData, setUserData] = useState(null);
  const [error, setError] = useState("");
  
  const navigate = useNavigate();
  const token = localStorage.getItem("token");

  // Fetch user data and cases on component mount
  useEffect(() => {
    const fetchUserData = async () => {
      if (!token) {
        setIsAuthenticated(false);
        return;
      }
      try {
        // Get user profile data
        const userResponse = await axios.get("/api/user/profile", {
          headers: {
            Authorization: `Bearer ${token}`
          }
        });

        if (userResponse.data.success) {
          setUserData(userResponse.data.user);
          
          // Fetch cases assigned to this judge
          const casesResponse = await axios.get("/api/cases/judge", {
            headers: {
              Authorization: `Bearer ${token}`
            }
          });
          
          if (casesResponse.data.success) {
            setCases(casesResponse.data.cases || []);
          } else {
            setError("Failed to load cases");
          }
        } else {
          setIsAuthenticated(false);
        }
      } catch (err) {
        console.error("Error fetching data:", err);
        if (err.response?.status === 401) {
          setIsAuthenticated(false);
        } else {
          setError("Failed to load dashboard data");
        }
      } finally {
        setLoading(false);
      }
    };

    fetchUserData();
  }, [token]);

  const handleLogout = () => {
    localStorage.removeItem("token");
    setIsAuthenticated(false);
    navigate("/login");
  };

  const handleCaseChange = (e) => {
    setSelectedCase(e.target.value);
  };

  if (!isAuthenticated) {
    return <div>Please log in to access the dashboard</div>;
  }

  if (loading) {
    return (
      <div className="dashboard-container" style={{ textAlign: "center", padding: "50px" }}>
        <p>Loading dashboard...</p>
      </div>
    );
  }

  return (
    <div className="dashboard-container">
      <nav
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          padding: "15px 20px",
          backgroundColor: "white",
          boxShadow: "0 2px 4px rgba(0,0,0,0.1)",
          marginBottom: "20px",
          borderRadius: "8px",
        }}
      >
        <h1
          style={{
            color: "#e88d7d",
            fontSize: "1.5rem",
            fontWeight: "bold",
            margin: 0,
          }}
        >
          Judge Dashboard
        </h1>
        <div style={{ display: "flex", alignItems: "center" }}>
          {userData && (
            <span style={{ marginRight: "15px", color: "#555" }}>
              Welcome, {userData.name || userData.email}
            </span>
          )}
          <button
            onClick={handleLogout}
            style={{
              backgroundColor: "#e88d7d",
              color: "white",
              border: "none",
              padding: "8px 15px",
              borderRadius: "5px",
              cursor: "pointer",
              fontSize: "0.9rem",
              fontWeight: "500",
              transition: "background-color 0.3s",
            }}
          >
            Logout
          </button>
        </div>
      </nav>

      {error && (
        <div className="error-message" style={{ marginBottom: "20px" }}>
          {error}
        </div>
      )}

      <div className="dashboard-sections">
        {/* Case selection section */}
        <div className="section">
          <h2>Select Case</h2>
          <div>
            <label htmlFor="caseSelect">Your Assigned Cases</label>
            <select
              id="caseSelect"
              value={selectedCase}
              onChange={handleCaseChange}
              style={{
                padding: "12px",
                border: "1px solid #ccc",
                borderRadius: "5px",
                fontSize: "1rem",
                width: "100%",
                marginBottom: "15px",
              }}
            >
              <option value="">-- Select a case --</option>
              {cases.length > 0 ? (
                cases.map((caseItem) => (
                  <option key={caseItem._id} value={caseItem._id}>
                    {caseItem.caseNumber || caseItem.title || caseItem._id} - {caseItem.parties?.join(" vs ") || "Unknown parties"}
                  </option>
                ))
              ) : (
                <option disabled>No cases assigned</option>
              )}
            </select>
          </div>

          {selectedCase ? (
            <div style={{ marginTop: "15px" }}>
              <h3 style={{ color: "#555", fontSize: "1rem", marginBottom: "10px" }}>
                Case Details
              </h3>
              {cases.find(c => c._id === selectedCase) ? (
                <div>
                  <p>
                    <strong>Case Number:</strong> {cases.find(c => c._id === selectedCase).caseNumber || "N/A"}
                  </p>
                  <p>
                    <strong>Court:</strong> {cases.find(c => c._id === selectedCase).courtName || "N/A"}
                  </p>
                  <p>
                    <strong>Parties:</strong> {cases.find(c => c._id === selectedCase).parties?.join(" vs ") || "N/A"}
                  </p>
                </div>
              ) : (
                <p>Case details not available</p>
              )}
            </div>
          ) : (
            <p style={{ color: "#666", fontStyle: "italic" }}>
              Select a case to view details and documents
            </p>
          )}
        </div>

        {/* Document retriever component */}
        <DocumentRetriever
          userRole="judge"
          caseId={selectedCase}/>
      </div>

    </div>
  );
};

export default JudgesDashboard;