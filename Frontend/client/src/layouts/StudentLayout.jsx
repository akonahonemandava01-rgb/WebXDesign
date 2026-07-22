import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import Header from "../components/Header";
import Sidebar from "../components/Sidebar";
import DashboardIcon from "../assets/StudentIcons/dashboard.png";
import ProfileIcon from "../assets/StudentIcons/profile.png";
import MyApplicationIcon from "../assets/StudentIcons/Myapplication.png";
import searchJobIcon from "../assets/StudentIcons/searchJob.png";
import visualIcon from "../assets/StudentIcons/visual.png";
import cvIcon from "../assets/StudentIcons/cv.png";
import Toast from "../components/Toast";
import { clearToken } from "../utils/api";

const StudentLayout = ({ children, title = "Student Dashboard" }) => {
  const [toastMessage, setToastMessage] = useState("");
  const navigate = useNavigate();

  const handleSignOut = () => {
    clearToken();
    setToastMessage("Signed out successfully.");
    setTimeout(() => {
      navigate("/login");
      window.location.reload();
    }, 500);
  };

  const studentMenu = [
    { label: "Dashboard", path: "/student/dashboard", icon: DashboardIcon },
    { label: "Profile", path: "/student/profile", icon: ProfileIcon },
    { label: "Create CV", path: "/student/createCv", icon: cvIcon },
    { label: "View Jobs", path: "/student/viewjobs", icon: visualIcon },
    { label: "My Applications", path: "/student/applications", icon: MyApplicationIcon },
    { label: "Saved Jobs", path: "/student/savedJobs" },
    { label: "Courses", path: "/student/courses" }
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
      {toastMessage && <Toast message={toastMessage} onClose={() => setToastMessage("")} />}
    </div>
  );
};

export default StudentLayout;
