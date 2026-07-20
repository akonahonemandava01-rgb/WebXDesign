
import React from "react";
import "../styles/Home.css";
import Button from "../components/button";
import Footer from "../components/footer";
import Navbar from "../components/Navbar";

const Home = () => {
  return (
    <>
      <Navbar />
      <main className="landing-main">
        {/* Hero Section */}
        <section className="hero">
          <div className="hero-content">
            <h1>Build your CV once.<br /><em>Land the job faster.</em></h1>
            <p>CampusHire connects Wits students with verified graduate jobs and internships.</p>
          </div>
        </section>

      {/* Features Section */}
      <section className="features">
        <div className="feature-box student-box">
          <h3> Students</h3>
          <ul>
            <li>Verified, institution-approved opportunities</li>
            <li>One-click apply with your saved profile</li>
            <li>Track every application in one place</li>
            <li>Internships, part-time and full-time roles</li>
          </ul>
          
        </div>

        <div className="feature-box employer-box">
          <h3>Employers</h3>
          <ul>
            <li>Post jobs and internships easily</li>
            <li>Review applicants with saved profiles</li>
            <li>Track hiring progress in one dashboard</li>
            <li>Connect with verified students</li>
          </ul>
        
        </div>

        <div className="feature-box admin-box">
          <h3> Admins</h3>
          <ul>
            <li>Approve employer registrations</li>
            <li>Manage job postings</li>
            <li>Track student placements</li>
            <li>Generate reports and analytics</li>
          </ul>
          
        </div>
      </section>
    </main>
      <Footer />
    </>
  );
};

export default Home;
