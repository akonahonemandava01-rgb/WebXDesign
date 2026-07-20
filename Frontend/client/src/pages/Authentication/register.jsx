
import React from "react";
import "../../styles/Authentication.css";
import Button from "../../components/Button";

const Register = () => {
  return (
    <div className="auth-container">
      <div className="auth-card">
        <h2>Employer Registration</h2>
        <p className="auth-subtitle">Register your company to post jobs</p>

        <form className="auth-form">
          <input type="text" placeholder="Initials" />
          <input type="text" placeholder="Surname" />
          <input type="text" placeholder="Company Name" />
          <input type="text" placeholder="Industry " />
          <input type="text" placeholder="Link to Website" />
          <input type="text" placeholder="Company Address" />
          <input type="text" placeholder="Contact Person Name" />
          <input type="email" placeholder="Company Email" />
          <input type="tel" placeholder="Contact Phone Number" />
          <input type="password" placeholder="Password" />
          <input type="password" placeholder="Confirm Password" />

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
