
import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import "../../styles/Authentication.css";
import Button from "../../components/button";
import { registerEmployer } from "../../utils/api";
import { validateEmail, ValidatePassword, formFields } from "../../utils/formValidation";

const Register = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    company_name: "",
    registration_number: "",
    email: "",
    password: "",
    confirmPassword: "",
  });
  const [errors, setErrors] = useState({});
  const [status, setStatus] = useState("");
  const [statusType, setStatusType] = useState("");

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const newErrors = {
      company_name: formFields(formData.company_name, "Company name"),
      registration_number: formFields(formData.registration_number, "Registration number"),
      email: validateEmail(formData.email),
      password: ValidatePassword(formData.password),
    };

    if (formData.password !== formData.confirmPassword) {
      newErrors.confirmPassword = "Passwords do not match";
    }

    const filteredErrors = Object.fromEntries(
      Object.entries(newErrors).filter(([, value]) => Boolean(value))
    );

    if (Object.keys(filteredErrors).length > 0) {
      setErrors(filteredErrors);
      setStatus("Please fix the highlighted fields.");
      setStatusType("error");
      return;
    }

    setErrors({});
    setStatus("");

    try {
      const response = await registerEmployer({
        email: formData.email,
        password: formData.password,
        company_name: formData.company_name,
        registration_number: formData.registration_number,
      });
      setStatus(response.message || "Registration successful. Await approval.");
      setStatusType("success");
      setTimeout(() => navigate("/login"), 1200);
    } catch (error) {
      setStatus(error.message);
      setStatusType("error");
    }
  };

  return (
    <div className="auth-container">
      <div className="auth-card">
        <h2>Employer Registration</h2>
        <p className="auth-subtitle">Register your company to post jobs</p>

        {status && <p className={`status ${statusType}`}>{status}</p>}

        <form className="auth-form" onSubmit={handleSubmit}>
          <input
            name="company_name"
            type="text"
            placeholder="Company Name"
            value={formData.company_name}
            onChange={handleChange}
          />
          {errors.company_name && <span className="error">{errors.company_name}</span>}

          <input
            name="registration_number"
            type="text"
            placeholder="Registration Number"
            value={formData.registration_number}
            onChange={handleChange}
          />
          {errors.registration_number && <span className="error">{errors.registration_number}</span>}

          <input
            name="email"
            type="email"
            placeholder="Company Email"
            value={formData.email}
            onChange={handleChange}
          />
          {errors.email && <span className="error">{errors.email}</span>}

          <input
            name="password"
            type="password"
            placeholder="Password"
            value={formData.password}
            onChange={handleChange}
          />
          {errors.password && <span className="error">{errors.password}</span>}

          <input
            name="confirmPassword"
            type="password"
            placeholder="Confirm Password"
            value={formData.confirmPassword}
            onChange={handleChange}
          />
          {errors.confirmPassword && <span className="error">{errors.confirmPassword}</span>}

          <Button label="Register" type="primary" />
        </form>

        <p className="auth-alt">
          Already registered? <a href="/login">Sign in</a>
        </p>
      </div>
    </div>
  );
};

export default Register;
