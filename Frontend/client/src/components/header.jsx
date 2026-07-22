import React, { useEffect, useState } from "react";
import "../styles/Dashboard.css";
import SignoutIcon from "../assets/Signout.png";
import { getLoggedInUser, getStudentProfile, getTokenPayload } from "../utils/api";

const Header = ({ title, userName, onSignOut }) => {
  const [displayName, setDisplayName] = useState(userName || "User");
  const [displayEmail, setDisplayEmail] = useState("");

  useEffect(() => {
    const tokenPayload = getTokenPayload();
    const storedUser = getLoggedInUser();

    if (!tokenPayload) {
      setDisplayName("User");
      setDisplayEmail("");
      return;
    }

    if (tokenPayload?.role === "student") {
      getStudentProfile()
        .then((profile) => {
          const name = profile?.full_name || storedUser.name || userName || "Student";
          const email = profile?.email || storedUser.email || "";

          setDisplayName(name);
          setDisplayEmail(email);

          localStorage.setItem("loggedInUser", JSON.stringify({ name, email }));
        })
        .catch(() => {
          setDisplayName(storedUser.name || userName || "Student");
          setDisplayEmail(storedUser.email || "");
        });
      return;
    }

    setDisplayName(storedUser.name || userName || "Admin");
    setDisplayEmail(storedUser.email || "");
  }, [userName]);

  return (
    <header className="dashboard-header">
      <div className="header-left">
        <h2>{title}</h2>
      </div>
      <div className="header-right">
        <span className="user-name"> {displayName}{displayEmail ? ` | ${displayEmail}` : ""}</span>
        <button className="signout" type="button" onClick={onSignOut} aria-label="Sign out">
          <img src={SignoutIcon} alt="Sign out" className="signout-icon" />
        </button>
      </div>
    </header>
  );
};

export default Header;
