import React, { useEffect, useState } from "react";
import AdminLayout from "../../layouts/AdminLayout";
import Card from "../../components/Card";
import "../../styles/AdminDashboardStyles/AdminDashboard.css";
import { getJobsForReview, getStats, reviewJob } from "../../utils/api";

const AdminDashboard = () => {
  const [stats, setStats] = useState(null);
  const [pendingJobs, setPendingJobs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [statusMessage, setStatusMessage] = useState("");

  useEffect(() => {
    async function loadDashboardData() {
      try {
        const [statsData, jobs] = await Promise.all([
          getStats(),
          getJobsForReview("Pending"),
        ]);
        setStats(statsData);
        setPendingJobs(jobs);
      } catch (err) {
        setStatusMessage(err.message || "Failed to load admin dashboard data.");
      } finally {
        setLoading(false);
      }
    }

    loadDashboardData();
  }, []);

  const handleReview = async (jobId, approvalStatus) => {
    try {
      await reviewJob(jobId, approvalStatus, "");
      setPendingJobs((prev) => prev.filter((job) => job.job_id !== jobId));
      setStatusMessage(`Job ${approvalStatus.toLowerCase()} successfully.`);
    } catch (err) {
      setStatusMessage(err.message || "Failed to update job review status.");
    }
  };

  const pendingJobsCount = pendingJobs.length;
  const pendingApplicationsCount = stats?.applications_by_status?.find((item) => item.application_status === "Pending")?.count || 0;
  const approvedJobsCount = stats?.jobs_by_status?.find((item) => item.approval_status === "Approved")?.count || 0;

  return (
    <AdminLayout title="Admin">
      
      <p>Manage employers, job posts, student placements, and system reports.</p>

      {statusMessage && <p className="status-message">{statusMessage}</p>}

      <div className="dashboard-row">
        <Card
          title="Total Students"
          count={stats?.total_students ?? "-"}
          description="Registered students"
        />
        <Card
          title="Total Employers"
          count={stats?.total_employers ?? "-"}
          description="Registered employers"
        />
        <Card
          title="Pending Job Reviews"
          count={loading ? "..." : pendingJobsCount}
          description="Jobs awaiting approval"
        />
        <Card
          title="Pending Applications"
          count={loading ? "..." : pendingApplicationsCount}
          description="Applications needing attention"
        />
      </div>

      <section>
        <h3>Pending Job Posts</h3>
        {loading ? (
          <p>Loading pending jobs...</p>
        ) : pendingJobsCount === 0 ? (
          <p>No pending jobs found.</p>
        ) : (
          <table>
            <thead>
              <tr>
                <th>Job Title</th>
                <th>Location</th>
                <th>Type</th>
                <th>Date Submitted</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {pendingJobs.map((job) => (
                <tr key={job.job_id}>
                  <td>{job.title}</td>
                  <td>{job.location}</td>
                  <td>{job.employment_type}</td>
                  <td>{new Date(job.created_at).toLocaleDateString()}</td>
                  <td>
                    <button onClick={() => handleReview(job.job_id, "Approved")}>Approve</button>
                    <button onClick={() => handleReview(job.job_id, "Rejected")}>Reject</button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </section>

      <section>
        <h3>Job Approval Summary</h3>
        <div className="dashboard-row">
          <Card title="Approved Jobs" count={approvedJobsCount} description="Jobs already approved" />
          <Card title="Pending Reviews" count={pendingJobsCount} description="Waiting approval" />
          <Card title="Total Jobs" count={stats?.jobs_by_status?.reduce((sum, item) => sum + item.count, 0) ?? "-"} description="All job posts" />
        </div>
      </section>
    </AdminLayout>
  );
};

export default AdminDashboard;
