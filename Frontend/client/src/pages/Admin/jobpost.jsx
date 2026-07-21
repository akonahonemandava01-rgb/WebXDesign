import React, { useState } from "react";
import AdminLayout from "../../layouts/AdminLayout";
import "../../styles/AdminDashboardStyles/AdminDashboard.css"; // ✅ shared styles

const JobPosts = () => {
  const [activeTab, setActiveTab] = useState("New Job Posts");

  const jobPostsData = {
    "New Job Posts": [
      { title: "Java Developer", company: "Tech Innovate", date: "23 July 2026", status: "Pending" },
      { title: "Marketing Coordinator", company: "BizGrowth Solutions", date: "20 July 2026", status: "Pending" },
    ],
    "Approved Job Posts": [
      { title: "IT Support Specialist", company: "CoreTech Systems", date: "18 July 2026", status: "Approved" },
      { title: "Business Analyst", company: "Global Solutions", date: "15 July 2026", status: "Approved" },
    ],
    "Rejected Job Posts": [
      { title: "Graphic Designer", company: "Visual Wave Studio", date: "10 July 2026", status: "Rejected" },
    ],
  };

  const handleRowClick = (job) => {
    alert(`Viewing details for ${job.title} at ${job.company}`);
  };

  const handleMakeAvailable = (job) => {
    alert(`Job made available: ${job.title}`);
  };

  const handleRemoveJob = (job) => {
    alert(`Job removed: ${job.title}`);
  };

  return (
    <AdminLayout title="Job Posts">
      <div className="page-content">
        <h3>Job Posts</h3>

        {/* ✅ Tabs */}
        <div className="tabs">
          {Object.keys(jobPostsData).map((tab) => (
            <button
              key={tab}
              className={`tab-button ${activeTab === tab ? "active" : ""}`}
              onClick={() => setActiveTab(tab)}
            >
              {tab}
            </button>
          ))}
        </div>

        {/* ✅ Job Posts Table */}
        <table className="data-table">
          <thead>
            <tr>
              <th>Job Title</th>
              <th>Company</th>
              <th>Date Submitted</th>
              <th>Status</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {jobPostsData[activeTab].map((job, index) => (
              <tr key={index} onClick={() => handleRowClick(job)} className="clickable-row">
                <td>{job.title}</td>
                <td>{job.company}</td>
                <td>{job.date}</td>
                <td>
                  <span className={`status-label ${job.status.toLowerCase()}`}>
                    {job.status}
                  </span>
                </td>
                <td>
                  {job.status === "Pending" ? (
                    <>
                      <button className="btn-approve">Approve</button>
                      <button className="btn-reject">Reject</button>
                    </>
                  ) : job.status === "Approved" ? (
                    <>
                      <button
                        className="btn-approve"
                        onClick={(e) => {
                          e.stopPropagation();
                          handleMakeAvailable(job);
                        }}
                      >
                        Make Available
                      </button>
                      <button
                        className="btn-reject"
                        onClick={(e) => {
                          e.stopPropagation();
                          handleRemoveJob(job);
                        }}
                      >
                        Remove Job
                      </button>
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

export default JobPosts;
