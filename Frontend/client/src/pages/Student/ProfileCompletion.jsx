import React from "react";
import "../../styles/Dashboard.css";

const ProfileCompletion = ({ percentage }) => {
  return (
    <div className="profile-completion">
      <h4>Profile Completion</h4>
      <div className="progress-bar">
        <div
          className="progress-fill"
          style={{ width: `${percentage}%` }}
        ></div>
      </div>
      <p>{percentage}% Complete</p>
    </div>
  );
};

export default ProfileCompletion;
