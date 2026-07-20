import React from "react";
import "../styles/footer.css";

const Footer = () => {
  return (
    <footer className="footer">
      <div className="footer-top">
        <div className="footer-brand">
          <div className="footer-logo">Campus<span>HIRE</span></div>
          <p className="footer-tagline">
            Connecting South African students to the opportunities they deserve.
          </p>
          <div className="footer-socials">
            <a href="#" className="social-btn">𝕏</a>
            <a href="#" className="social-btn">in</a>
            <a href="#" className="social-btn">f</a>
          </div>
        </div>

        <div className="footer-col">
          <h4>Students</h4>
          <a href="/login">Student login</a>
          <a href="/jobs">Browse jobs</a>
          <a href="/about">How it works</a>
        </div>

        <div className="footer-col">
          <h4>Employers</h4>
          <a href="/employer-register">Register company</a>
          <a href="/post-job">Post a job</a>
          <a href="/login">Employer login</a>
        </div>

        <div className="footer-col">
          <h4>Company</h4>
          <a href="/about">About us</a>
          <a href="/contact">Contact</a>
          <a href="/privacy">Privacy Policy</a>
        </div>
      </div>

      <div className="footer-bottom">
        <p>© 2026 CampusHire. All rights reserved.</p>
        <div className="footer-legal">
          <a href="/privacy">Privacy Policy</a>
          <a href="/terms">Terms of Service</a>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
