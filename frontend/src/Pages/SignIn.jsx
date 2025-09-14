import React, { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import "../index.css";

export default function SignIn() {
  const [email, setEmail] = useState("");
  const [pw, setPw] = useState("");
  const navigate = useNavigate();

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!email || !pw) {
      alert("Please fill all fields");
      return;
    }
    // mock login success
    navigate("/chatbot");
  };

  return (
    <div className="page-center-wrapper">
      <div className="page-card auth-card">
        <h2 className="auth-title">Sign In</h2>
        <form onSubmit={handleSubmit} className="auth-form">
          <input
            type="email"
            placeholder="Email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="auth-input"
            required
          />
          <input
            type="password"
            placeholder="Password"
            value={pw}
            onChange={(e) => setPw(e.target.value)}
            className="auth-input"
            required
          />
          <button type="submit" className="auth-btn">
            Sign In
          </button>
        </form>
        <p className="auth-link">
          Don’t have an account? <Link to="/signup">Sign Up</Link>
        </p>
      </div>
    </div>
  );
}
