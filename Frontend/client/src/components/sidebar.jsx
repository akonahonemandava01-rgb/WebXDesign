import React from "react";
import "../styles/Dashboard.css";
import { Link } from "react-router-dom";

const Sidebar = ({ menuItems = [] }) => {
  return (
    <div className="sidebar">
      <ul>
        {menuItems.map((item, index) => (
          <li key={index}>
            <Link to={item.path} className="sidebar-link">
              {item.icon && <img src={item.icon} alt={item.label} className="sidebar-icon" />}
              {item.label}
            </Link>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default Sidebar;