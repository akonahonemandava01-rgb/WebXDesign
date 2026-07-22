
import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import "../../styles/Authentication.css";
import Button from "../../components/button";
import { getStudentProfile, loginUser, saveLoggedInUser, saveToken } from "../../utils/api";
import { validateEmail, validateLoginPassword } from "../../utils/formValidation";

const Login = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({ email: "", password: "" });
  const [errors, setErrors] = useState({});
  const [status, setStatus] = useState("");
  const [statusType, setStatusType] = useState("");

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const newErrors = {
      email: validateEmail(formData.email),
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
    setStatus("");

    try {
      const result = await loginUser(formData.email, formData.password);
      saveToken(result.token);

      if (result.role === "student") {
        const profile = await getStudentProfile();
        saveLoggedInUser({
          name: profile?.full_name || "Student",
          email: profile?.email || formData.email,
        });
      } else {
        saveLoggedInUser({
          name: result.role === "admin" ? "Admin" : "User",
          email: formData.email,
        });
      }

      setStatus(result.message || "Login successful!");
      setStatusType("success");
      if (result.role === "admin") {
        navigate("/admin/dashboard");
      } else {
        navigate("/student/dashboard");
      }
    } catch (error) {
      setStatus(error.message);
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
            name="email"
            type="email"
            placeholder="Email"
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
