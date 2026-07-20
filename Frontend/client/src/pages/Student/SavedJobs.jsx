import React, { useState } from "react";
import StudentLayout from "../../layouts/StudentLayout";
import "../../styles/StudentdashboardStyles/SavedJobs.css";

const savedJobs = [
  {
    title: "Software Engineer",
    company: "Tech Innovate",
    location: "Johannesburg, South Africa",
    savedDate: "15 July 2026",
    type: "Full-Time",
    mode: "On-Site",
    description: "Join our team to develop cutting-edge software solutions in an innovative environment."
  },
  {
    title: "Digital Marketing Specialist",
    company: "Creative Media Group",
    location: "Remote",
    savedDate: "10 July 2026",
    type: "Part-Time",
    mode: "Remote",
    description: "Looking for a creative marketer with experience in digital campaigns and analytics."
  },
  {
    title: "Data Analyst",
    company: "Finance Dynamics",
    location: "Cape Town, South Africa",
    savedDate: "5 July 2026",
    type: "Full-Time",
    mode: "Hybrid",
    description: "Analyze financial data and provide insights to drive business decisions."
  }
];

const SavedJobs = () => {
  const [jobs, setJobs] = useState(savedJobs);

  const handleRemove = (title) => {
    setJobs(jobs.filter((job) => job.title !== title));
    alert(`${title} removed from saved jobs.`);
  };

  return (
    <StudentLayout title="Saved Jobs">
      <main className="savedjobs-content">
        <h3>Saved Jobs</h3>

        {/* ✅ Filters */}
        <div className="filters-bar">
          <select>
            <option>Sort by: Date Saved</option>
            <option>Sort by: Job Title</option>
          </select>
          <select>
            <option>Location</option>
            <option>Johannesburg</option>
            <option>Cape Town</option>
            <option>Remote</option>
          </select>
          <select>
            <option>Job Type</option>
            <option>Full-Time</option>
            <option>Part-Time</option>
            <option>Internship</option>
          </select>
        </div>

        {/* ✅ Saved Job Cards */}
        <div className="savedjobs-list">
          {jobs.map((job, index) => (
            <div key={index} className="savedjob-card">
              <div className="savedjob-info">
                <h4>{job.title}</h4>
                <p>{job.company} | {job.location}</p>
                <p className="saved-date">Saved on: {job.savedDate}</p>
                <div className="tags">
                  <span className="tag type">{job.type}</span>
                  <span className="tag mode">{job.mode}</span>
                </div>
                <p className="description">{job.description}</p>
              </div>
              <div className="savedjob-actions">
                <button className="btn-view">View Details</button>
                <button className="btn-remove" onClick={() => handleRemove(job.title)}>Remove</button>
              </div>
            </div>
          ))}
        </div>
      </main>
    </StudentLayout>
  );
};

export default SavedJobs;
