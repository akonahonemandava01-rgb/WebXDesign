import React from "react";
import Header from "../components/Header";
import Sidebar from "../components/Sidebar";
import EmployersIcon from "../assets/AdminIcons/businessman.png";
import JobList from "../assets/AdminIcons/JobList.png";
import StudentPlacemnet from "../assets/AdminIcons/placement.png";
import StatsIcon from "../assets/AdminIcons/monitor.png";
import DashboardIcon from "../assets/dashboard.png";
import ProfileIcon from "../assets/profile.png";

const AdminLayout = ({ children, title = "Admin Dashboard" }) => {
  const handleSignOut = () => {
    alert("Signed out");
  };

  // Admin menu items
  const adminMenu = [
    { label: "Dashboard", path: "/admin-dashboard", icon:DashboardIcon },
    { label: "Profile", path: "/admin-profile", icon: ProfileIcon },
    { label: "Employers", path: "/employers", icon: EmployersIcon },
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
    </div>
  );
};

export default AdminLayout;
