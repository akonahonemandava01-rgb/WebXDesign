import React from "react";
import { Link } from "react-router-dom";
import "../styles/Navbar.css";


const Navbar = () => {
  return (
    <header className="navbar">
      <div className="navbar-brand">
        <div className="navbar-logo" aria-label="CampusHire logo" role="img"></div>
        <div className="navbar-header">CampusHire</div>
      </div>
      <div className="navbar-center">
        <nav className="navbar-links">
          <Link to="/">Home</Link>
          <Link to="/jobs">Jobs</Link>
          <Link to="/about">About</Link>
          <Link to="/contact">Contact</Link>
        </nav>
      </div>
      <div className="navbar-actions">
        <Link to="/login" className="navbar-right">SignIn</Link>
        <Link to="/register" className="navbar-right navbar-register">Employer SignUp</Link>
      </div>
    </header>
  );
};

export default Navbar;