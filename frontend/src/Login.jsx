import { useState } from "react";
import { login } from "./api";

export default function Login({ onLogin }) {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

  async function handleSubmit() {
    setError("");

    try {
      const res = await login(username, password);
      localStorage.setItem("token", res.token);
      onLogin();
    } catch (err) {
      setError(err.message || "Login failed");
    }
  }

  return (
    <div
      style={{
        height: "100vh",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        background: "linear-gradient(135deg, #2563eb, #60a5fa)",
        padding: "20px",
      }}
    >
      <div
        style={{
          background: "white",
          width: "100%",
          maxWidth: "380px",
          padding: "35px 30px",
          borderRadius: "12px",
          boxShadow:
            "0 10px 25px rgba(0,0,0,0.1), 0 3px 10px rgba(0,0,0,0.08)",
          animation: "fadeIn 0.5s ease",
        }}
      >
        <h2
          style={{
            textAlign: "center",
            marginBottom: "25px",
            fontSize: "26px",
            fontWeight: "600",
            color: "#1e293b",
          }}
        >
          Welcome Back
        </h2>

        <label style={{ fontSize: "14px", color: "#475569" }}>Username</label>
        <input
          placeholder="Enter username"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
          style={{
            width: "100%",
            padding: "12px",
            marginBottom: "15px",
            borderRadius: "8px",
            border: "1px solid #cbd5e1",
            fontSize: "15px",
            transition: "0.2s",
          }}
        />

        <label style={{ fontSize: "14px", color: "#475569" }}>Password</label>
        <input
          type="password"
          placeholder="Enter password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          style={{
            width: "100%",
            padding: "12px",
            marginBottom: "25px",
            borderRadius: "8px",
            border: "1px solid #cbd5e1",
            fontSize: "15px",
            transition: "0.2s",
          }}
        />

        <button
          onClick={handleSubmit}
          style={{
            width: "100%",
            padding: "12px",
            background: "#2563eb",
            color: "white",
            border: "none",
            borderRadius: "8px",
            fontSize: "16px",
            cursor: "pointer",
            fontWeight: "600",
            transition: "0.25s",
          }}
          onMouseEnter={(e) =>
            (e.target.style.background = "#1e40af")
          }
          onMouseLeave={(e) =>
            (e.target.style.background = "#2563eb")
          }
        >
          Log In
        </button>

        {error && (
          <p
            style={{
              color: "red",
              marginTop: "15px",
              textAlign: "center",
              fontSize: "14px",
            }}
          >
            {error}
          </p>
        )}

        <style>
          {`
            @keyframes fadeIn {
              from { opacity: 0; transform: translateY(10px); }
              to { opacity: 1; transform: translateY(0); }
            }

            input:focus {
              outline: none;
              border-color: #2563eb;
              box-shadow: 0 0 0 2px rgba(37,99,235,0.15);
            }
          `}
        </style>
      </div>
    </div>
  );
}
