import React from "react";
import { Link } from "react-router-dom"; // Using React Router for navigation
import { Scale, FileCheck, Shield } from "lucide-react";
import JudicialLedger from "./JudicialLedger";

// Reusable Button Component
const Button = ({ children, onClick, variant, to }) => {
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
    },
  };

  return to ? (
    <Link to={to} style={{ textDecoration: "none" }}>
      <button style={styles[variant]}>{children}</button>
    </Link>
  ) : (
    <button style={styles[variant]} onClick={onClick}>
      {children}
    </button>
  );
};

export default function HomePage() {
  return (
    <div style={{ minHeight: "100vh", background: "#f5f2f0", padding: "20px" }}>
      <nav style={{ display: "flex", justifyContent: "space-between", alignItems: "center", padding: "10px 20px", background: "white" }}>
        <div style={{ background: "gray", padding: "10px 20px", borderRadius: "5px" }}>LOGO</div>
        <div style={{ display: "flex", gap: "15px" }}>
          <Link to="/" style={{ textDecoration: "none", color: "black" }}>HOME</Link>
          <Link to="/about" style={{ textDecoration: "none", color: "black" }}>ABOUT</Link>
          <Link to="/contact" style={{ textDecoration: "none", color: "black" }}>CONTACT</Link>
          <Button variant="outline" to="/register">REGISTER</Button> {/* Register Page Link */}
          <Button variant="outline" to="/login">LOGIN</Button>
        </div>
      </nav>

      <section style={{ display: "flex", justifyContent: "space-between", padding: "40px 20px" }}>
        <div style={{ maxWidth: "50%" }}>
          <h1 style={{ fontSize: "32px", fontWeight: "bold" }}>Revolutionizing Judicial Transparency with Blockchain</h1>
          <p style={{ color: "gray" }}>
            Introducing a secure, blockchain-based system to modernize and protect judicial processes. With tamper-proof, decentralized storage for deposits and forensic reports, we enhance transparency, integrity, and reliability.
          </p>
          <Button variant="default">Learn More</Button>
        </div>
        <div>
          <img src="https://hebbkx1anhila5yf.public.blob.vercel-storage.com/image-3HHNoMD6CHgemY47gq31tMdBXQt1Ht.png" alt="Lady Justice Statue" style={{ width: "400px", height: "auto" }} />
        </div>
      </section>

      

      {/* Benefits Section */}
      <section style={{ padding: "40px 20px", background: "white", borderRadius: "20px" }}>
        <h2 style={{ textAlign: "center", color: "#e88d7d" }}>Core Benefits</h2>
        <div style={{ display: "flex", justifyContent: "space-between" }}>
          {[
            { Icon: Scale, title: "Immutable Judicial Deposits Ledger", text: "Our blockchain-based ledger offers tamper-proof tracking of judicial deposits." },
            { Icon: FileCheck, title: "Secure Forensic Report Management", text: "Forensic reports are stored with blockchain-verified access." },
            { Icon: Shield, title: "Enhanced Transparency and Accountability", text: "With immutable records, our system provides full transparency." },
          ].map(({ Icon, title, text }, index) => (
            <div key={index} style={{ textAlign: "center", maxWidth: "30%" }}>
              <Icon size={48} />
              <h3>{title}</h3>
              <p style={{ color: "gray" }}>{text}</p>
            </div>
          ))}
        </div>
      </section>
    
      <JudicialLedger />

    </div>
    // <div>
    //   {/* <LawyerDashboard/> */}
    //   <BailiffDashboard/>
    // </div>
  );
}
