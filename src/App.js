import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import HomePage from "./components/HomePage";
import Register from "./components/Register"; // Import Register Page
import LoginPage from "./components/LoginPage";
import SimpleLawyerDashboard from "./components/lawyerDashboard";
import BailiffDashboard from "./components/bailiffs";


function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<HomePage />} /> {/* HomePage contains JudicialLedger */}
        <Route path="/register" element={<Register />} /> {/* Register Page */}
        <Route path="/login" element={<LoginPage />} /> {/* LoginPage */}
        <Route path="/lawyer-dashboard" element={<SimpleLawyerDashboard/>}/>
        <Route path="/bailiff-dashboard" element={<BailiffDashboard/>}/>

      </Routes>
    </Router>
  );
}

export default App;
