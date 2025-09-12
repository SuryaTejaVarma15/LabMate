import React from "react";
import { useNavigate } from "react-router-dom";

export default function GetStarted() {
  const navigate = useNavigate();
  return (
    <div style={{ textAlign: "center", marginTop: 100 }}>
      <h1>Welcome to LabMate</h1>
      <button onClick={() => navigate("/signin")} style={{ marginTop: 20 }}>
        Get Started
      </button>
    </div>
  );
}
