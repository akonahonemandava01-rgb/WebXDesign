import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import Header from "../components/Header";
import Toast from "../components/Toast";
import Sidebar from "../components/Sidebar";
import EmployersIcon from "../assets/AdminIcons/businessman.png";
import JobList from "../assets/AdminIcons/JobList.png";
import StudentPlacemnet from "../assets/AdminIcons/placement.png";
import StatsIcon from "../assets/AdminIcons/monitor.png";
import DashboardIcon from "../assets/dashboard.png";
import ProfileIcon from "../assets/profile.png";
import { clearToken } from "../utils/api";

const AdminLayout = ({ children, title = "Admin Dashboard" }) => {
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

  // Admin menu items
  const adminMenu = [
    { label: "Dashboard", path: "/admin/dashboard", icon:DashboardIcon },
    { label: "Profile", path: "/admin/profile", icon: ProfileIcon },
    { label: "Employers", path: "/admin/employers", icon: EmployersIcon },
    { label: "Job Posts", path: "/admin/job-approval", icon:JobList },
    { label: "Student Placements", path: "/admin/placements", icon: StudentPlacemnet },
    { label: "Reports", path: "/admin/reports", icon: StatsIcon }
  ];

  return (
    <div className="dashboard-container">
      {/* Sidebar stays fixed on the left */}
      <Sidebar menuItems={adminMenu} />

      {/* Main area with header + content */}
      <div className="main-area">
        <Header title={title} userName="Admin" onSignOut={handleSignOut} />
        <main className="content">
          {children}
        </main>
      </div>
      {toastMessage && <Toast message={toastMessage} onClose={() => setToastMessage("")} />}
    </div>
  );
};

export default AdminLayout;
