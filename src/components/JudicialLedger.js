import React from "react";
import paperImage from "../images/paper.png";

export default function JudicialLedger() {
  return (
    <div style={{ display: "flex", alignItems: "center", justifyContent: "center", minHeight: "100vh", background: "#f5f2f0", padding: "40px" }}>
      {/* Left Section - Text Content */}
      <div style={{ flex: 1, paddingRight: "40px", maxWidth: "50%" }}>
        <h1 style={{ fontSize: "48px", fontWeight: "bold", fontFamily: "serif" }}>
          Judicial <br /> <span style={{ fontWeight: "600" }}>Deposits Ledger</span>
        </h1>
        <p style={{ color: "gray", lineHeight: "1.6" }}>
          The Judicial Deposits Ledger provides real-time tracking and an immutable history of all deposit-related transactions, securely recorded on the blockchain to prevent tampering. Users can view detailed transaction histories, monitor refund statuses, and receive alerts for unclaimed deposits, ensuring transparent, accountable management of all judicial funds. This tamper-proof system offers judiciary members confidence in the accuracy and security of each transaction, reducing the risk of mismanagement and reinforcing trust in the judicial process.
        </p>
        {/* Input Field and Button */}
        <div style={{ display: "flex", marginTop: "20px" }}>
          <input
            type="text"
            placeholder="Enter Case ID"
            style={{
              padding: "10px",
              border: "1px solid gray",
              borderRadius: "5px",
              marginRight: "10px",
              flex: "1"
            }}
          />
          <button style={{ background: "#e88d7d", color: "white", border: "none", padding: "10px 20px", borderRadius: "5px", cursor: "pointer" }}>
            Submit
          </button>
        </div>
      </div>

      {/* Right Section - Image */}
      <div style={{ flex: 1, display: "flex", justifyContent: "center" }}>
        <img
          src={paperImage}
          alt="Judicial Ledger"
          style={{ height:"50%",width: "70%", borderRadius: "10px", border: "5px solid #e88d7d" }}
        />
      </div>
    </div>
  );
}
