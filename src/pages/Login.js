// src/pages/Login.js
import React, { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import "./form.css";

function Login() {
  const [formData, setFormData] = useState({ email: "", password: "" });
  const [message, setMessage] = useState("");
  const [isError, setIsError] = useState(false);
  const navigate = useNavigate();

  // 🔗 Backend URL
  const API_BASE = "https://skillswap-backend-hj73.onrender.com/api";

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      // 🔐 Login request
      await axios.post(`${API_BASE}/auth/login`, formData, {
        withCredentials: true,
      });

      // 👤 Fetch logged-in user details
      const res = await axios.get(`${API_BASE}/auth/me`, {
        withCredentials: true,
      });

      // 💾 Save user email locally
      localStorage.setItem("userEmail", res.data.email);

      navigate("/dashboard");
    } catch (err) {
      setIsError(true);
      setMessage(
        err.response?.data?.message || "Login failed. Please try again."
      );
      setTimeout(() => setMessage(""), 2000);
    }
  };

  return (
    <div className="form-container">
      <h2>Login</h2>
      <form onSubmit={handleSubmit}>
        <input
          type="email"
          name="email"
          placeholder="Email"
          onChange={handleChange}
          required
        />
        <input
          type="password"
          name="password"
          placeholder="Password"
          onChange={handleChange}
          required
        />
        <button type="submit">Login</button>
      </form>

      {message && (
        <div
          style={{
            marginTop: "15px",
            padding: "10px",
            borderRadius: "5px",
            color: isError ? "#ff4d4d" : "#4CAF50",
            backgroundColor: isError ? "#331111" : "#113311",
            fontWeight: "bold",
            textAlign: "center",
          }}
        >
          {message}
        </div>
      )}
    </div>
  );
}

export default Login;
