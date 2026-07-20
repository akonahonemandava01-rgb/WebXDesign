
import React, { useState }from "react";
import "../../styles/Authentication.css";
import Button from "../../components/button";

import { validateUsername, validateLoginPassword } from "../../utils/formValidation";



const Login = () => {
    const [formData, setFormData] = useState({ username: "", password: ""});
    const [errors, setErrors] = useState({});
    const [status, setStatus] = useState("");
    const [statusType, setStatusType] = useState("");

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });

    };
    
    const handleSubmit = (e) => {
        e.preventDefault();
        const newErrors = {
            username: validateUsername(formData.username),
            password: validateLoginPassword(formData.password),
        };

        const filteredErrors = Object.fromEntries(
            Object.entries(newErrors).filter(([, value]) => Boolean(value))
        );

        if (Object.keys(filteredErrors).length > 0) {
            setErrors(filteredErrors);
            setStatus("Please fill in the required fields correctly.");
            setStatusType("error");
            return;
        }

        setErrors({});

        if (formData.username === "admin" && formData.password === "12345678") {
            setStatus("Login successful!");
            setStatusType("success");
        } else {
            setStatus("Invalid credentials. Please try again.");
            setStatusType("error");
        }
    };




  return (
     <div className="auth-container">
      <div className="auth-card">
        <h2>Login</h2>

         {status && <p className={`status ${statusType}`}>{status}</p>}

        <form className="auth-form" onSubmit={handleSubmit}>
          <input
            name="username"
            type="text"
            placeholder="Username"
            value={formData.username}
            onChange={handleChange}
          />
          {errors.username && <span className="error">{errors.username}</span>}

          <input
            name="password"
            type="password"
            placeholder="Password"
            value={formData.password}
            onChange={handleChange}
          />
          {errors.password && <span className="error">{errors.password}</span>}

          <Button label="Login" type="primary" />
        </form>
       

        <p className="auth-alt">
          If Employer Not Registered <a href="/register">Sign Up</a>
        </p>

      </div>
    </div>
  );
};

export default Login;
