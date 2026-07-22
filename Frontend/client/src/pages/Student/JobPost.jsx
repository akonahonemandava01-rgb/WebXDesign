import React from "react";
import JobPostCard from "./JobPostCard";
import "../../styles/StudentdashboardStyles/StudentDashboard.css";

const JobPost = ({ jobs = [] }) => {
  return (
    <div className="job-posts">
      <h4>Job Posts</h4>
      <div className="job-list">
        {jobs.length > 0 ? (
          jobs.map((job) => (
            <JobPostCard key={job.job_id || job.title} job={job} />
          ))
        ) : (
          <p>No jobs found.</p>
        )}
      </div>
    </div>
  );
};

export default JobPost;
