import React, { useState } from "react";
import "../../styles/StudentdashboardStyles/StudentDashboard.css";
import CompanyIcon from "../../assets/JobIcons/company.png";
import LocationIcon from "../../assets/JobIcons/location.png";
import ScheduleIcon from "../../assets/JobIcons/schedule.png";
import WishlistIcon from "../../assets/JobIcons/wishlist.png";
import { applyJob } from "../../utils/api";

const JobPostCard = ({ job }) => {
  const [expanded, setExpanded] = useState(false);
  const [wishlisted, setWishlisted] = useState(false);
  const [message, setMessage] = useState("");
  const [applying, setApplying] = useState(false);

  const handleWishlistClick = () => {
    setWishlisted(!wishlisted);
    setMessage(!wishlisted ? `${job.title} added to wishlist` : `${job.title} removed from wishlist`);
    setTimeout(() => setMessage(""), 3000);
  };

  const handleApply = async () => {
    try {
      setApplying(true);
      await applyJob(job.job_id);
      setMessage("Application submitted successfully.");
    } catch (err) {
      setMessage(err.message || "Failed to apply.");
    } finally {
      setApplying(false);
      setTimeout(() => setMessage(""), 3000);
    }
  };

  return (
    <div className="job-card">
      {message && <div className="alert-banner">{message}</div>}

      <h4 className="job-title">{job.title}</h4>

      <div className="job-info">
        <img src={CompanyIcon} alt="Company" className="job-icon" />
        <span>{job.company_name || "Employer"}</span>
      </div>

      <div className="job-info">
        <img src={LocationIcon} alt="Location" className="job-icon" />
        <span>{job.location}</span>
      </div>

      <div className="job-info">
        <img src={ScheduleIcon} alt="Schedule" className="job-icon" />
        <span>{job.employment_type || "Job Type"} • Closes {job.closing_date?.split("T")[0] || "N/A"}</span>
      </div>

      {expanded && (
        <div className="job-details">
          <p>{job.description || "No description provided."}</p>
          {job.hourly_rate && <p><strong>Rate:</strong> {job.hourly_rate}</p>}
        </div>
      )}

      <div className="job-actions">
        <button className="btn-link" onClick={() => setExpanded(!expanded)}>
          {expanded ? "Less" : "More"}
        </button>
        <div className="apply-wishlist">
          <button className="btn-apply-small" onClick={handleApply} disabled={applying}>
            {applying ? "Applying..." : "Apply"}
          </button>
          <img
            src={WishlistIcon}
            alt="Wishlist"
            className={`wishlist-icon ${wishlisted ? "wishlisted" : ""}`}
            onClick={handleWishlistClick}
          />
        </div>
      </div>
    </div>
  );
};

export default JobPostCard;
