import React from "react";
import "../styles/Dashboard.css";

const Header = ({ title, userName, onSignOut }) => {
  return (
    <header className="dashboard-header">
      <div className="header-left">
        <h2>{title}</h2>
        
      </div>
    <div className="header-right" onClick={onSignOut}>
        
       <span className="user-name">Welcome, {userName}</span>

       <span className="signout">Sign Out</span>
       
    </div>

    </header>
  );
};

export default Header;
