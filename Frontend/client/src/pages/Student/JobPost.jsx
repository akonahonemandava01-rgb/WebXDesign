import React from "react";
import JobPostCard from "./JobPostCard";
import "../../styles/StudentdashboardStyles/StudentDashboard.css";

const jobs = [
  {
    title: "Java Developer",
    company: "Communicate Finance",
    location: "Cape Town: City Bowl",
    datePosted: "17 July 2026",
    closingDate: "20 October 2026",
    description: "Opportunity for a Senior Java Backend Engineer to join a high-performing team..."
  },
  {
    title: "Java Developer",
    company: "ATS Test",
    location: "Cape Town, South Africa",
    datePosted: "18 July 2026",
    closingDate: "25 October 2026",
    description: "Fixed Term role with duties in testing, training, and company benefits..."
  }
];

const JobPost = () => {
  return (
    <div className="job-posts">
      <h4>Job Posts</h4>
      <div className="job-list">
        {jobs.map((job, index) => (
          <JobPostCard key={index} job={job} />
        ))}
      </div>
    </div>
  );
};

export default JobPost;
