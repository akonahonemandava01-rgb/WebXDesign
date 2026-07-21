import React, { useState } from "react";
import AdminLayout from "../../layouts/AdminLayout";
import "../../styles/AdminDashboardStyles/AdminDashboard.css"; // ✅ common styles reused

const Employer = () => {
  const [activeTab, setActiveTab] = useState("Active Employers");

  const employersData = {
    "New Employers": [
      { company: "Innovate Tech", contact: "Sarah Johnson", email: "sarah@innovate.com", status: "Pending" },
      { company: "Global Solutions", contact: "Mike Patel", email: "mike@globalsol.com", status: "Pending" },
    ],
    "Active Employers": [
      { company: "EcoStartup Inc.", contact: "Lia Chen", email: "lia@ecostartup.com", status: "Active" },
      { company: "Tech Innovate", contact: "David Smith", email: "david@techinnovate.com", status: "Active" },
    ],
    "Rejected Employers": [
      { company: "BizGrowth Ltd", contact: "Anna Brown", email: "anna@bizgrowth.com", status: "Rejected" },
    ],
  };

  const handleRowClick = (employer) => {
    alert(`Viewing details for ${employer.company}`);
  };

  const handleDeactivate = (employer) => {
    alert(`Deactivated account for ${employer.company}`);
  };

  return (
    <AdminLayout title="Employers">
      <div className="page-content">
        <h3>Employers</h3>

        {/* ✅ Tabs */}
        <div className="tabs">
          {Object.keys(employersData).map((tab) => (
            <button
              key={tab}
              className={`tab-button ${activeTab === tab ? "active" : ""}`}
              onClick={() => setActiveTab(tab)}
            >
              {tab}
            </button>
          ))}
        </div>

        {/* ✅ Employer Table */}
        <table className="data-table">
          <thead>
            <tr>
              <th>Company Name</th>
              <th>Contact Person</th>
              <th>Email</th>
              <th>Status</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {employersData[activeTab].map((employer, index) => (
              <tr key={index} onClick={() => handleRowClick(employer)} className="clickable-row">
                <td>{employer.company}</td>
                <td>{employer.contact}</td>
                <td>{employer.email}</td>
                <td>
                  <span className={`status-label ${employer.status.toLowerCase()}`}>
                    {employer.status}
                  </span>
                </td>
                <td>
                  {employer.status === "Active" ? (
                    <button
                      className="btn-deactivate"
                      onClick={(e) => {
                        e.stopPropagation();
                        handleDeactivate(employer);
                      }}
                    >
                      Deactivate
                    </button>
                  ) : employer.status === "Pending" ? (
                    <>
                      <button className="btn-approve">Approve</button>
                      <button className="btn-reject">Reject</button>
                    </>
                  ) : (
                    <span className="no-action">—</span>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </AdminLayout>
  );
};

export default Employer;
