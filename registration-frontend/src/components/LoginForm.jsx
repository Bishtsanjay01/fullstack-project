import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";

const LoginForm = () => {
  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });
  const navigate = useNavigate(); // Initialize the useNavigate hook

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await fetch("http://localhost:8625/login", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),
      });
      const data = await response.json();
      if (response.ok) {
        alert("Login successful!");
        localStorage.setItem("token", data.token); // Store the JWT token in localStorage
        navigate("/app1"); // Redirect to dashboard page or another route after login
      } else {
        alert(data.error);
      }
    } catch (error) {
      console.error("Error:", error);
    }
  };

  return (
    <div className="form-container">
      <form onSubmit={handleSubmit}>
        <div>
          <label>Email:</label>
          <input
            type="email"
            name="email"
            value={formData.email}
            onChange={handleChange}
            required
          />
        </div>
        <div>
          <label>Password:</label>
          <input
            type="password"
            name="password"
            value={formData.password}
            onChange={handleChange}
            required
          />
        </div>
        <button type="submit">Login</button>
      </form>

      {/* Link to the Register Page */}
      <p>
        Don't have an account? <Link to="/">Register here</Link>
      </p>
    </div>
  );
};

export default LoginForm;
