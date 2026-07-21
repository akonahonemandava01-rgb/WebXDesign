import React from "react";
import AdminLayout from "../../layouts/AdminLayout";
import Card from "../../components/Card";
import "../../styles/AdminDashboardStyles/AdminDashboard.css";

const AdminDashboard = () => {
  return (
    <AdminLayout title="Admin Dashboard">
      <h3>Admin Dashboard</h3>
      <p>Manage employers, job posts, student placements, and system reports.</p>

      {/* ✅ Dashboard Cards */}
      <div className="dashboard-row">
        <Card title="New Employers" count="8" description="Pending approval requests" />
        <Card title="New Job Posts" count="12" description="Jobs awaiting review" />
        <Card title="Student Placements" count="48" description="Active student hires" />
        <Card title="Reports & Stats" count="4" description="Analytics available" />
      </div>

      {/* ✅ Employer Overview */}
      <section>
        <h3>Employer Overview</h3>
        <div className="dashboard-row">
          <Card title="Active Employers" count="24" description="Approved companies" />
          <Card title="Total Employers" count="132" description="Registered companies" />
        </div>
      </section>

      {/* ✅ Pending Job Posts */}
      <section>
        <h3>Pending Job Posts</h3>
        <table>
          <thead>
            <tr>
              <th>Job Title</th>
              <th>Company</th>
              <th>Date Submitted</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td>Java Developer</td>
              <td>Tech Innovate</td>
              <td>23 July 2026</td>
              <td>
                <button>Approve</button>
                <button>Reject</button>
              </td>
            </tr>
            <tr>
              <td>Marketing Coordinator</td>
              <td>BizGrowth Solutions</td>
              <td>20 July 2026</td>
              <td>
                <button>Approve</button>
                <button>Reject</button>
              </td>
            </tr>
          </tbody>
        </table>
      </section>

      {/* ✅ Student Placement Stats */}
      <section>
        <h3>Student Placement Stats</h3>
        <div className="dashboard-row">
          <Card title="Current Placements" count="48" description="Students currently placed" />
          <Card title="Graduated Placements" count="115" description="Graduates placed" />
          <Card title="Placement Rate" count="78%" description="Overall success rate" />
        </div>
      </section>

      {/* ✅ Reports */}
      <section>
        <h3>System Reports</h3>
        <div className="dashboard-row">
          <Card title="Monthly Job Approvals" count="46" description="Jobs approved this month" />
          <Card title="Student Hires This Month" count="19" description="New hires recorded" />
        </div>
      </section>
    </AdminLayout>
  );
};

export default AdminDashboard;
