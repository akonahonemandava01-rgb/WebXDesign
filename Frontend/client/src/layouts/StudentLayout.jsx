import React from "react";
import Header from "../components/Header";
import Sidebar from "../components/Sidebar";
import DashboardIcon from "../assets/StudentIcons/dashboard.png";
import ProfileIcon from "../assets/StudentIcons/profile.png";
import MyApplicationIcon from "../assets/StudentIcons/Myapplication.png";
import searchJobIcon from "../assets/StudentIcons/searchJob.png";
import visualIcon from "../assets/StudentIcons/visual.png";
import cvIcon from "../assets/StudentIcons/cv.png";

const StudentLayout = ({ children, title = "Student Dashboard" }) => {
  const handleSignOut = () => {
    alert("Signed out");
  };

  const studentMenu = [
    { label: "Dashboard", path: "/dashboard", icon: DashboardIcon },
    { label: "Profile", path: "/profile", icon: ProfileIcon },
    { label: "Create CV", path: "/create-cv", icon: cvIcon },
    { label: "View Jobs", path: "/view-jobs", icon: visualIcon },
    { label: "My Applications", path: "/applications", icon: MyApplicationIcon },
    { label: "Saved Jobs", path: "/savedJobs" },
    { label: "Courses", path: "/courses" }
  ];

  return (
    <div className="dashboard-container">
      {/* Sidebar stays fixed on the left */}
      <Sidebar menuItems={studentMenu} />

      {/* Main area with header + content */}
      <div className="main-area">
        <Header title={title} userName="Rilinde" onSignOut={handleSignOut} />
        <main className="content">
          {children}
        </main>
      </div>
    </div>
  );
};

export default StudentLayout;
