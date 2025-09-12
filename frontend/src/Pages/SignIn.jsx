import { useState } from "react";
import { useNavigate } from "react-router-dom";

export default function SignIn() {
  const [user, setUser] = useState({ username: "", password: "" });
  const navigate = useNavigate();

  const handleSignIn = (e) => {
    e.preventDefault();
    if (user.username && user.password) navigate("/dashboard");
    else alert("Enter username & password");
  };

  return (
    <div
      style={{
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        height: "100vh",
        background: "#f4f6f8",
      }}
    >
      <form
        onSubmit={handleSignIn}
        style={{
          background: "#fff",
          padding: "40px 30px",
          borderRadius: "12px",
          boxShadow: "0px 4px 12px rgba(0,0,0,0.1)",
          width: "320px",
          textAlign: "center",
        }}
      >
        <h2 style={{ marginBottom: "30px", color: "#2c3e50" }}>Sign In</h2>

        <input
          placeholder="Username"
          value={user.username}
          onChange={(e) => setUser({ ...user, username: e.target.value })}
          style={{
            width: "100%",
            padding: "10px",
            marginBottom: "20px",
            borderRadius: "8px",
            border: "1px solid #ccc",
            fontSize: "14px",
          }}
        />

        <input
          type="password"
          placeholder="Password"
          value={user.password}
          onChange={(e) => setUser({ ...user, password: e.target.value })}
          style={{
            width: "100%",
            padding: "10px",
            marginBottom: "25px",
            borderRadius: "8px",
            border: "1px solid #ccc",
            fontSize: "14px",
          }}
        />

        <button
          type="submit"
          style={{
            width: "100%",
            padding: "10px",
            background: "#3498db",
            color: "#fff",
            border: "none",
            borderRadius: "8px",
            cursor: "pointer",
            fontSize: "16px",
          }}
        >
          Sign In
        </button>
      </form>
    </div>
  );
}
