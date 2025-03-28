import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";

export default function LoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();

  // Check if user is already logged in
  // useEffect(() => {
  //   const token = localStorage.getItem("token");
  //   const role = localStorage.getItem("role");

  //   if (token && role) {
  //     // Redirect to appropriate dashboard if already logged in
  //     redirectBasedOnRole(role);
  //   }
  // }, []);

  // Function to handle redirection based on role
  const redirectBasedOnRole = (role) => {
    if (role === "lawyer") {
      navigate("/lawyer-dashboard");
    } else if (role === "bailiff") {
      navigate("/bailiff-dashboard");
    } else if (role === "police") {
      navigate("/police-dashboard");
    } else if (role === "judge") {
      navigate("/judge-dashboard");
    } else if (role === "foreinsic") {
      navigate("/foreinsic-dashboard");
    } else {
      setError("Unknown user role");
    }
  };

  const handleLogin = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    setError("");

    try {
      // Call your authentication API
      const response = await axios.post("http://localhost:3000/login", {
        email,
        password,
      });

      // Log full response for debugging (remove in production)
      console.log("Login response:", response.data);

      // Verify that response contains the expected data based on your actual API response
      if (
        !response.data ||
        !response.data.success ||
        !response.data.jwtToken ||
        !response.data.role
      ) {
        throw new Error("Invalid response from server");
      }

      // Store token and role based on the actual response structure
      localStorage.setItem("token", response.data.jwtToken);
      localStorage.setItem("role", response.data.role);

      // Store email for user identification if needed
      localStorage.setItem("email", email);

      // Redirect based on role
      redirectBasedOnRole(response.data.role);
    } catch (err) {
      console.error("Login error:", err);
      setError(
        err.response?.data?.msg || "Invalid credentials. Please try again."
      );
    } finally {
      setIsLoading(false);
    }
  };

  const redirectToRegister = () => {
    navigate("/register");
  };

  return (
    <div
      style={{
        minHeight: "100vh",
        background: "#f5f2f0",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        padding: "20px",
      }}
    >
      <div
        style={{
          background: "white",
          padding: "40px",
          borderRadius: "10px",
          boxShadow: "0 4px 8px rgba(0,0,0,0.1)",
          width: "100%",
          maxWidth: "400px",
          margin: "0 auto",
          textAlign: "center",
        }}
      >
        <h2
          style={{
            color: "#e88d7d",
            marginBottom: "20px",
            fontSize: "1.5rem",
            fontWeight: "bold",
          }}
        >
          Login
        </h2>

        {error && (
          <div
            style={{
              background: "#ffebee",
              color: "#c62828",
              padding: "10px",
              borderRadius: "5px",
              marginBottom: "15px",
              fontSize: "0.875rem",
            }}
          >
            {error}
          </div>
        )}

        <form onSubmit={handleLogin}>
          {/* Email Input */}
          <div style={{ marginBottom: "15px", textAlign: "left" }}>
            <label
              htmlFor="email"
              style={{
                display: "block",
                marginBottom: "5px",
                fontSize: "0.875rem",
                fontWeight: "500",
                color: "#333",
              }}
            >
              Email
            </label>
            <input
              id="email"
              type="email"
              placeholder="Enter your email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              style={{
                width: "100%",
                padding: "12px",
                border: "1px solid #ccc",
                borderRadius: "5px",
                fontSize: "1rem",
              }}
              required
            />
          </div>

          {/* Password Input */}
          <div style={{ marginBottom: "20px", textAlign: "left" }}>
            <label
              htmlFor="password"
              style={{
                display: "block",
                marginBottom: "5px",
                fontSize: "0.875rem",
                fontWeight: "500",
                color: "#333",
              }}
            >
              Password
            </label>
            <input
              id="password"
              type="password"
              placeholder="Enter your password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              style={{
                width: "100%",
                padding: "12px",
                border: "1px solid #ccc",
                borderRadius: "5px",
                fontSize: "1rem",
              }}
              required
            />
          </div>

          {/* Login Button */}
          <button
            type="submit"
            style={{
              background: "#e88d7d",
              color: "white",
              border: "none",
              padding: "12px",
              borderRadius: "5px",
              cursor: "pointer",
              width: "100%",
              fontSize: "1rem",
              fontWeight: "500",
              transition: "background-color 0.3s",
            }}
            disabled={isLoading}
          >
            {isLoading ? "Logging in..." : "Login"}
          </button>

          {/* Register Section */}
          <div style={{ marginTop: "20px", textAlign: "center" }}>
            <p
              style={{
                fontSize: "0.9rem",
                color: "#666",
                marginBottom: "10px",
              }}
            >
              Don't have an account?
            </p>
            <button
              type="button"
              onClick={redirectToRegister}
              style={{
                background: "white",
                color: "#e88d7d",
                border: "1px solid #e88d7d",
                padding: "12px",
                borderRadius: "5px",
                cursor: "pointer",
                width: "100%",
                fontSize: "1rem",
                fontWeight: "500",
                transition: "all 0.3s ease",
              }}
            >
              Register
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
