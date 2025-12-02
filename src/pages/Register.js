import React, { useState } from "react";
import instance from "./api/axiosInstance";
import { useNavigate } from "react-router-dom";
import "./form.css";

function Register() {
  const [formData, setFormData] = useState({
    username: "",
    email: "",
    password: "",
  });

  const [successMessage, setSuccessMessage] = useState("");
  const navigate = useNavigate();

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const res = await instance.post("/auth/register", formData, {
        withCredentials: true,
      });

      setSuccessMessage("🎉 Registered successfully! Redirecting...");
      setTimeout(() => {
        setSuccessMessage("");
        navigate("/login");
      }, 1200); // faster fade
    } catch (err) {
      alert("❌ Registration failed. Try again.");
    }
  };

  return (
    <div className="form-container">
      <h2>Register</h2>
      <form onSubmit={handleSubmit}>
        <input
          type="text"
          name="username"
          placeholder="Username"
          onChange={handleChange}
          required
        />
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
        <button type="submit">Register</button>
      </form>

      {successMessage && (
        <div className="success-message">{successMessage}</div>
      )}
    </div>
  );
}

export default Register;
