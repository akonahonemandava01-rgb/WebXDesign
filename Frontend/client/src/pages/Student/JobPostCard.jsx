import React, { useState } from "react";
import "../../styles/StudentdashboardStyles/StudentDashboard.css";

// Job icons for the job cards
import CompanyIcon from "../../assets/JobIcons/company.png";
import LocationIcon from "../../assets/JobIcons/location.png";
import ScheduleIcon from "../../assets/JobIcons/schedule.png";
import WishlistIcon from "../../assets/JobIcons/wishlist.png";

const JobPostCard = ({ job }) => {
  const [expanded, setExpanded] = useState(false);
  const [wishlisted, setWishlisted] = useState(false);
  const [message, setMessage] = useState(""); // ✅ custom alert message

  const handleWishlistClick = () => {
    setWishlisted(!wishlisted);
    if (!wishlisted) {
      setMessage(`${job.title} added to wishlist`);
    } else {
      setMessage(`${job.title} removed from wishlist`);
    }

    // Clear message after 3 seconds
    setTimeout(() => setMessage(""), 3000);
  };

  return (
    <div className="job-card">
      {/* ✅ Custom alert banner */}
      {message && <div className="alert-banner">{message}</div>}

      <h4 className="job-title">{job.title}</h4>

      {/* Company */}
      <div className="job-info">
        <img src={CompanyIcon} alt="Company" className="job-icon" />
        <span>{job.company}</span>
      </div>

      {/* Location */}
      <div className="job-info">
        <img src={LocationIcon} alt="Location" className="job-icon" />
        <span>{job.location}</span>
      </div>

      {/* Dates */}
      <div className="job-info">
        <img src={ScheduleIcon} alt="Schedule" className="job-icon" />
        <span>{job.datePosted} - {job.closingDate}</span>
      </div>

      {/* Expanded description */}
      {expanded && (
        <div className="job-details">
          <p>{job.description}</p>
        </div>
      )}

      {/* Actions */}
      <div className="job-actions">
        <button 
          className="btn-link" 
          onClick={() => setExpanded(!expanded)}
        >
          {expanded ? "Less" : "More"}
        </button>
        <div className="apply-wishlist">
          <button className="btn-apply-small">Apply</button>
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
