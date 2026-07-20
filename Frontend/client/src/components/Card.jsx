import React from "react";
import "../styles/Dashboard.css";

const Card = ({ title, count, description }) => {
  return (
    <div className="card">
      <div className="card-header">
        <h4>{title}</h4>
      </div>
      <h2 className="card-count">{count}</h2>
      <p className="card-description">{description}</p>
    </div>
  );
};

export default Card;
