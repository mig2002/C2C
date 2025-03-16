// src/components/BailiffDashboard.js
import React, { useState } from "react";
import { useNavigate } from "react-router-dom"; // Import useNavigate
import axios from "axios";
import PendingCases from "./bailiffwork/PendingCases";
import Transactions from "./bailiffwork/Transactions";
import ChangeLawyer from "./bailiffwork/ChangeLawyer";
import RoleUpdate from "./bailiffwork/RoleUpdate";
import VerifyCase from "./bailiffwork/VerifyCase";
import CloseCase from "./bailiffwork/CloseCase";

const BailiffDashboard = () => {
  const [isAuthenticated, setIsAuthenticated] = useState(true);
  const navigate = useNavigate(); // Initialize useNavigate hook
  const token = localStorage.getItem("token");

  const config = {
    headers: {
      Authorization: token,
    },
  };

  const handleLogout = () => {
    localStorage.removeItem("token");
    setIsAuthenticated(false);
    // Use navigate instead of window.location.href
    navigate("/login");
  };

  if (!isAuthenticated) {
    return <div>Please log in to access the dashboard</div>;
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

      <div className="dashboard-sections">
        <PendingCases config={config} />
        <Transactions config={config} />
        <ChangeLawyer config={config} />
        <RoleUpdate config={config} />
        <VerifyCase config={config} />
        <CloseCase config={config} />
      </div>
    </div>
  );
};

export default BailiffDashboard;
