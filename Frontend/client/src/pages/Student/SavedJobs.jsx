import React, { useEffect, useState } from "react";
import StudentLayout from "../../layouts/StudentLayout";
import "../../styles/StudentdashboardStyles/SavedJobs.css";

const SavedJobs = () => {
  const [jobs, setJobs] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const saved = localStorage.getItem("savedJobs");
    if (saved) {
      setJobs(JSON.parse(saved));
    }
    setLoading(false);
  }, []);

  const handleRemove = (title) => {
    const updatedJobs = jobs.filter((job) => job.title !== title);
    setJobs(updatedJobs);
    localStorage.setItem("savedJobs", JSON.stringify(updatedJobs));
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

        <div className="savedjobs-list">
          {loading ? (
            <p>Loading saved jobs...</p>
          ) : jobs.length === 0 ? (
            <p>No saved jobs available.</p>
          ) : (
            jobs.map((job, index) => (
              <div key={index} className="savedjob-card">
                <div className="savedjob-info">
                  <h4>{job.title}</h4>
                  <p>{job.company} | {job.location}</p>
                  <p className="saved-date">Saved on: {job.savedDate || "Unknown"}</p>
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
            ))
          )}
        </div>
      </main>
    </StudentLayout>
  );
};

export default SavedJobs;
