import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import PendingCases from "./bailiffwork/PendingCases";
import Transactions from "./bailiffwork/Transactions";
import ChangeLawyer from "./bailiffwork/ChangeLawyer";
import RoleUpdate from "./bailiffwork/RoleUpdate";
import VerifyCase from "./bailiffwork/VerifyCase";
import CloseCase from "./bailiffwork/CloseCase";

const BailiffDashboard = () => {
  const [isAuthenticated, setIsAuthenticated] = useState(true);
  const [activeSection, setActiveSection] = useState('pendingCases');
  const navigate = useNavigate();
  const token = localStorage.getItem("token");

  const config = {
    headers: {
      Authorization: token,
    },
  };

  const handleLogout = () => {
    localStorage.removeItem("token");
    setIsAuthenticated(false);
    navigate("/login");
  };

  // Render active component based on selected section
  const renderActiveSection = () => {
    switch(activeSection) {
      case 'pendingCases':
        return <PendingCases config={config} />;
      case 'transactions':
        return <Transactions config={config} />;
      case 'changeLawyer':
        return <ChangeLawyer config={config} />;
      case 'roleUpdate':
        return <RoleUpdate config={config} />;
      case 'verifyCase':
        return <VerifyCase config={config} />;
      case 'closeCase':
        return <CloseCase config={config} />;
      default:
        return <PendingCases config={config} />;
    }
  };

  if (!isAuthenticated) {
    return <div>Please log in to access the dashboard</div>;
  }

  return (
    <div className="dashboard-container" style={{ 
      display: 'flex', 
      flexDirection: 'column', 
      width :"100vw",
    }}>
      {/* Fixed Header */}
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
        <h1 style={{
          color: "#e88d7d",
          fontSize: "1.5rem",
          fontWeight: "bold",
          margin: 0,
        }}>
          Bailiff Dashboard
        </h1>
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
      </nav>

      {/* Sidebar Navigation */}
      <div style={{
        display: 'flex',
        height: 'calc(100vh - 70px)', // Adjust for header heigh
        marginTop: '70px', // Match header height
      }}>
        <div style={{
          width: '250px',
          backgroundColor: '#f4f4f4',
          padding: '20px',
          borderRight: '1px solid #e0e0e0'
        }}>
          <div style={{ marginBottom: '20px' }}>
            <h3 style={{ marginBottom: '10px', color: '#333' }}>Dashboard Sections</h3>
            <button 
              onClick={() => setActiveSection('pendingCases')}
              style={{
                width: '100%',
                padding: '10px',
                marginBottom: '10px',
                backgroundColor: activeSection === 'pendingCases' ? '#e88d7d' : 'white',
                color: activeSection === 'pendingCases' ? 'white' : 'black',
                border: '1px solid #ddd',
                borderRadius: '5px',
                cursor: 'pointer'
              }}
            >
              Pending Cases
            </button>
            <button 
              onClick={() => setActiveSection('transactions')}
              style={{
                width: '100%',
                padding: '10px',
                marginBottom: '10px',
                backgroundColor: activeSection === 'transactions' ? '#e88d7d' : 'white',
                color: activeSection === 'transactions' ? 'white' : 'black',
                border: '1px solid #ddd',
                borderRadius: '5px',
                cursor: 'pointer'
              }}
            >
              Transactions
            </button>
            <button 
              onClick={() => setActiveSection('changeLawyer')}
              style={{
                width: '100%',
                padding: '10px',
                marginBottom: '10px',
                backgroundColor: activeSection === 'changeLawyer' ? '#e88d7d' : 'white',
                color: activeSection === 'changeLawyer' ? 'white' : 'black',
                border: '1px solid #ddd',
                borderRadius: '5px',
                cursor: 'pointer'
              }}
            >
              Change Lawyer
            </button>
            <button 
              onClick={() => setActiveSection('roleUpdate')}
              style={{
                width: '100%',
                padding: '10px',
                marginBottom: '10px',
                backgroundColor: activeSection === 'roleUpdate' ? '#e88d7d' : 'white',
                color: activeSection === 'roleUpdate' ? 'white' : 'black',
                border: '1px solid #ddd',
                borderRadius: '5px',
                cursor: 'pointer'
              }}
            >
              Role Update
            </button>
            <button 
              onClick={() => setActiveSection('verifyCase')}
              style={{
                width: '100%',
                padding: '10px',
                marginBottom: '10px',
                backgroundColor: activeSection === 'verifyCase' ? '#e88d7d' : 'white',
                color: activeSection === 'verifyCase' ? 'white' : 'black',
                border: '1px solid #ddd',
                borderRadius: '5px',
                cursor: 'pointer'
              }}
            >
              Verify Case
            </button>
            <button 
              onClick={() => setActiveSection('closeCase')}
              style={{
                width: '100%',
                padding: '10px',
                marginBottom: '10px',
                backgroundColor: activeSection === 'closeCase' ? '#e88d7d' : 'white',
                color: activeSection === 'closeCase' ? 'white' : 'black',
                border: '1px solid #ddd',
                borderRadius: '5px',
                cursor: 'pointer'
              }}
            >
              Close Case
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

export default BailiffDashboard;