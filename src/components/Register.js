import React, { useState } from "react";
import { useNavigate, Link } from "react-router-dom";

const Register = () => {
  const navigate = useNavigate();
  
  const [userData, setUserData] = useState({
    name: "",
    email: "",
    password: "",
    role: "police",
    identityProof: null,
  });

  const roles = {
    police: ["badgeNumber", "department", "stationAddress"],
    bailiff: ["badgeNumber", "courtName"],
    judge: ["judgeId", "courtName", "designation", "validTill"],
    lawyer: ["barCertificate", "specialization", "validTill"],
    forensic_expert: ["qualification", "areaOfExpertise"],
  };

  const [roleDetails, setRoleDetails] = useState({});

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setUserData({ ...userData, [name]: value });
  };

  const handleRoleDetailChange = (e) => {
    const { name, value } = e.target;
    setRoleDetails({ ...roleDetails, [name]: value });
  };

  const handleFileUpload = (e) => {
    setUserData({ ...userData, identityProof: e.target.files[0] });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log("User Data:", userData);
    console.log("Role Details:", roleDetails);
    
    // Here, you'd send data to your backend
    alert("Registration Successful!");
    navigate("/");
  };
  
  const redirectToLogin = () => {
    navigate("/login");
  };
  
  // Format field name for display
  const formatFieldName = (field) => {
    return field
      .replace(/([A-Z])/g, " $1")
      .replace(/_/g, " ")
      .replace(/^\w/, (c) => c.toUpperCase());
  };

  return (
    <div 
      style={{ 
        minHeight: "100vh", 
        background: "#f5f2f0", 
        padding: "20px", 
        display: "flex", 
        justifyContent: "center", 
        alignItems: "center" 
      }}
    >
      <form 
        onSubmit={handleSubmit} 
        style={{ 
          width: "100%", 
          maxWidth: "450px",
          padding: "30px", 
          background: "white", 
          borderRadius: "10px", 
          boxShadow: "0 4px 8px rgba(0,0,0,0.1)"
        }}
      >
        <h2 style={{ textAlign: "center", color: "#e88d7d", marginBottom: "20px", fontSize: "1.5rem" }}>Register</h2>

        <div style={{ marginBottom: "15px" }}>
          <label style={{ display: "block", marginBottom: "5px", fontWeight: "500" }}>Name</label>
          <input 
            type="text" 
            name="name" 
            value={userData.name} 
            onChange={handleInputChange} 
            required 
            style={inputStyle} 
          />
        </div>

        <div style={{ marginBottom: "15px" }}>
          <label style={{ display: "block", marginBottom: "5px", fontWeight: "500" }}>Email</label>
          <input 
            type="email" 
            name="email" 
            value={userData.email} 
            onChange={handleInputChange} 
            required 
            style={inputStyle} 
          />
        </div>

        <div style={{ marginBottom: "15px" }}>
          <label style={{ display: "block", marginBottom: "5px", fontWeight: "500" }}>Password</label>
          <input 
            type="password" 
            name="password" 
            value={userData.password} 
            onChange={handleInputChange} 
            required 
            style={inputStyle} 
          />
        </div>

        <div style={{ marginBottom: "15px" }}>
          <label style={{ display: "block", marginBottom: "5px", fontWeight: "500" }}>Role</label>
          <select 
            name="role" 
            value={userData.role} 
            onChange={handleInputChange} 
            required 
            style={inputStyle}
          >
            {Object.keys(roles).map((role) => (
              <option key={role} value={role}>
                {role.replace(/_/g, " ").replace(/\b\w/g, l => l.toUpperCase())}
              </option>
            ))}
          </select>
        </div>

        {roles[userData.role]?.map((field) => (
          <div key={field} style={{ marginBottom: "15px" }}>
            <label style={{ display: "block", marginBottom: "5px", fontWeight: "500" }}>
              {formatFieldName(field)}
            </label>
            <input 
              type="text" 
              name={field} 
              value={roleDetails[field] || ""} 
              onChange={handleRoleDetailChange} 
              required 
              style={inputStyle} 
            />
          </div>
        ))}

        <div style={{ marginBottom: "20px" }}>
          <label style={{ display: "block", marginBottom: "5px", fontWeight: "500" }}>Identity Proof</label>
          <input 
            type="file" 
            onChange={handleFileUpload} 
            required 
            style={{
              ...inputStyle,
              padding: "8px"
            }} 
          />
        </div>

        <button type="submit" style={buttonStyle}>
          Register
        </button>
        
        <div style={{ marginTop: "20px", textAlign: "center" }}>
          <p style={{ fontSize: "0.9rem", color: "#666", marginBottom: "10px" }}>
            Already have an account?
          </p>
          <button 
            type="button" 
            onClick={redirectToLogin} 
            style={{
              ...buttonStyle,
              background: "white",
              color: "#e88d7d",
              border: "1px solid #e88d7d",
            }}
          >
            Login
          </button>
        </div>
      </form>
    </div>
  );
};

// Styles
const inputStyle = {
  width: "100%",
  padding: "10px",
  border: "1px solid #ccc",
  borderRadius: "5px",
  fontSize: "1rem",
  boxSizing: "border-box"
};

const buttonStyle = {
  width: "100%",
  padding: "12px",
  background: "#e88d7d",
  color: "white",
  border: "none",
  borderRadius: "5px",
  cursor: "pointer",
  fontSize: "1rem",
  fontWeight: "500",
  transition: "all 0.3s ease"
};

export default Register;