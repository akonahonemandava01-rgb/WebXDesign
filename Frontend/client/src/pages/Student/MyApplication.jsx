import React, { useState } from "react";
import StudentLayout from "../../layouts/StudentLayout";
import "../../styles/StudentdashboardStyles/MyApplication.css";

const applications = [
  {
    title: "Java Developer",
    company: "Communicate Finance",
    location: "Cape Town, South Africa",
    appliedDate: "17 July 2026",
    status: "In Progress",
    statusColor: "green"
  },
  {
    title: "Marketing Intern",
    company: "Creative Media Group",
    location: "Johannesburg, South Africa",
    appliedDate: "22 June 2026",
    status: "Interview Scheduled",
    statusColor: "purple"
  },
  {
    title: "Business Analyst",
    company: "ATS Test",
    location: "Cape Town, South Africa",
    appliedDate: "10 June 2026",
    status: "Offer Received",
    statusColor: "limegreen"
  },
  {
    title: "Graphic Designer",
    company: "Visual Wave Studio",
    location: "Remote",
    appliedDate: "05 May 2026",
    status: "Rejected",
    statusColor: "red"
  }
];

const MyApplications = () => {
  const [filter, setFilter] = useState("All");

  const filteredApps =
    filter === "All"
      ? applications
      : applications.filter((app) => app.status.includes(filter));

  const handleWithdraw = (title) => {
    alert(`You have withdrawn your application for ${title}.`);
  };

  return (
    <StudentLayout title="My Applications">
      <main className="applications-content">
        <h3>Track Application</h3>

        {/* ✅ Filter Tabs */}
        <div className="filter-tabs">
          {["All", "In Progress", "Interview", "Offered", "Rejected"].map((tab) => (
            <button
              key={tab}
              className={`filter-tab ${filter === tab ? "active" : ""}`}
              onClick={() => setFilter(tab)}
            >
              {tab}
            </button>
          ))}
        </div>

        {/* ✅ Application Cards */}
        <div className="applications-list">
          {filteredApps.map((app, index) => (
            <div key={index} className="application-card">
              <div className="application-info">
                <h4>{app.title}</h4>
                <p>{app.company} | {app.location}</p>
                <p className="applied-date">Applied on: {app.appliedDate}</p>
              </div>
              <div className="application-status">
                <span
                  className="status-badge"
                  style={{ backgroundColor: app.statusColor }}
                >
                  {app.status}
                </span>
                <button
                  className="btn-withdraw"
                  onClick={() => handleWithdraw(app.title)}
                >
                  Withdraw
                </button>
              </div>
            </div>
          ))}
        </div>
      </main>
    </StudentLayout>
  );
};

export default MyApplications;
