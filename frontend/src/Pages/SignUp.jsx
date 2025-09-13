import React, { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import "../index.css";

export default function SignUp() {
  const [email, setEmail] = useState("");
  const [pw, setPw] = useState("");
  const navigate = useNavigate();

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!email || !pw) {
      alert("Please fill all fields");
      return;
    }
    // mock signup success
    navigate("/signin");
  };

  return (
    <div className="auth-page">
      <div className="card auth-card">
        <h2 className="auth-title">Sign Up</h2>
        <form onSubmit={handleSubmit} className="auth-form">
          <input
            type="email"
            placeholder="Email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="auth-input"
          />
          <input
            type="password"
            placeholder="Password"
            value={pw}
            onChange={(e) => setPw(e.target.value)}
            className="auth-input"
          />
          <button type="submit" className="auth-btn">Sign Up</button>
        </form>
        <p className="auth-link">
          Already have an account? <Link to="/signin">Sign In</Link>
        </p>
      </div>
    </div>
  );
}
