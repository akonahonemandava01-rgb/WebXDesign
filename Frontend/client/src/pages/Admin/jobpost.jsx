import React, { useState, useEffect } from "react";
import AdminLayout from "../../layouts/AdminLayout";
import "../../styles/AdminDashboardStyles/AdminDashboard.css";
import Toast from "../../components/Toast";
import ApproverModal from "../../components/ApproverModal";
import EntityDetailsModal from "../../components/EntityDetailsModal";
import { getJobDetails } from "../../utils/api";
import { getJobsForReview, reviewJob } from "../../utils/api";

const JobPosts = () => {
  const [activeTab, setActiveTab] = useState("New Job Posts");
  const [searchQuery, setSearchQuery] = useState("");
  const [activeStatus, setActiveStatus] = useState("All");
  const [activeCourse, setActiveCourse] = useState("All");
  const [toastMessage, setToastMessage] = useState("");

  const [jobs, setJobs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [approverModalOpen, setApproverModalOpen] = useState(false);
  const [approverModalData, setApproverModalData] = useState(null);
  const [detailsOpen, setDetailsOpen] = useState(false);
  const [detailsData, setDetailsData] = useState(null);

  // Load jobs from backend
  useEffect(() => {
    let mounted = true;
    async function load() {
      setLoading(true);
      try {
        const all = await getJobsForReview();
        if (!mounted) return;
        // normalize fields
        setJobs(Array.isArray(all) ? all : []);
      } catch (err) {
        setJobs([]);
        setToastMessage(err.message || "Failed to load jobs");
      } finally {
        setLoading(false);
      }
    }
    load();
    return () => { mounted = false; };
  }, []);

  const filteredJobs = jobs.filter((job) => {
    const matchesStatus = activeStatus === "All" || job.approval_status === activeStatus;
    const matchesCourse = activeCourse === "All" || (job.course === activeCourse);
    const title = (job.title || "").toLowerCase();
    const company = (job.company || job.employer_name || job.employer_email || "").toLowerCase();
    const matchesSearch = title.includes(searchQuery.toLowerCase()) || company.includes(searchQuery.toLowerCase());
    return matchesStatus && matchesCourse && matchesSearch;
  });

  const tabLabels = ["New Job Posts", "All"];

  useEffect(() => {
    if (activeTab === "New Job Posts") setActiveStatus("Pending");
    if (activeTab === "All") setActiveStatus("All");
  }, [activeTab]);

  // Approve / Reject handlers using backend
  const handleReview = async (jobId, approvalStatus) => {
    try {
      await reviewJob(jobId, approvalStatus, "");
      setToastMessage(`Job ${approvalStatus.toLowerCase()}`);
      // refresh list
      const refreshed = await getJobsForReview();
      setJobs(Array.isArray(refreshed) ? refreshed : []);
    } catch (err) {
      setToastMessage(err.message || "Failed to update job status");
    }
    window.scrollTo(0, 0);
  };

  const openDetails = async (id) => {
    try {
      const data = await getJobDetails(id);
      setDetailsData(data);
      setDetailsOpen(true);
    } catch (err) {
      setToastMessage(err.message || "Failed to load details");
    }
  };

  return (
    <AdminLayout title="Job Posts">
      <div className="page-content job-posts">
        

        <div className="tabs">
          {tabLabels.map((tab) => (
            <button
              key={tab}
              className={`tab-button ${activeTab === tab ? "active" : ""}`}
              onClick={() => setActiveTab(tab)}
            >
              {tab}
            </button>
          ))}
        </div>

        <div className="filters-layout">
          {/* Left Sidebar Filters */}
          <div className="filters-sidebar">
            <label>Status</label>
            <select value={activeStatus} onChange={(e) => setActiveStatus(e.target.value)}>
              <option>All</option>
              <option>Pending</option>
              <option>Approved</option>
              <option>Available</option>
              <option>Removed</option>
              <option>Rejected</option>
            </select>

            <label>Course</label>
            <select value={activeCourse} onChange={(e) => setActiveCourse(e.target.value)}>
              <option>All</option>
              <option>Computer Science</option>
              <option>Marketing</option>
              <option>Engineering</option>
            </select>
          </div>

          {/* Table + Search on the right */}
          <div className="table-section">
            {loading ? (
              <p>Loading jobs...</p>
            ) : (
              <table className="data-table full-width-table">
                <thead>
                  <tr>
                    <th>Job Title</th>
                    <th>Location</th>
                    <th>Type</th>
                    <th>Closing Date</th>
                    <th>Date Submitted</th>
                    <th>Status</th>
                    <th>Approver</th>
                    <th>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredJobs.length === 0 ? (
                    <tr>
                      <td colSpan={8} style={{ textAlign: "center", padding: "2rem" }}>
                        No Jobs Found
                      </td>
                    </tr>
                  ) : (
                    filteredJobs.map((job) => (
                      <tr key={job.job_id} onClick={() => openDetails(job.job_id)} style={{ cursor: 'pointer' }}>
                        <td>{job.title || '-'}</td>
                        <td>{job.location || '-'}</td>
                        <td>{job.employment_type || '-'}</td>
                        <td>{job.closing_date ? new Date(job.closing_date).toLocaleDateString() : '-'}</td>
                        <td>{job.created_at ? new Date(job.created_at).toLocaleString() : '-'}</td>
                        <td><span className={`status-label ${((job.approval_status||'pending')).toLowerCase()}`}>{job.approval_status || 'Pending'}</span></td>
                        <td>
                          {(job.approved_by_email || job.approved_by_user_id) ? (
                            <button className="approver-link" onClick={(e)=>{ e.stopPropagation(); setApproverModalData(job); setApproverModalOpen(true); }}>
                              {job.approved_by_email || job.approved_by_user_id}
                            </button>
                          ) : ('-')}
                        </td>
                        <td onClick={(e)=>e.stopPropagation()}>
                          {job.approval_status === 'Pending' ? (
                            <>
                              <button className="btn-approve" onClick={() => handleReview(job.job_id, 'Approved')}>Approve</button>
                              <button className="btn-reject" onClick={() => handleReview(job.job_id, 'Rejected')}>Reject</button>
                            </>
                          ) : (
                            <span className="no-action">—</span>
                          )}
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            )}
          </div>
        </div>

        {toastMessage && <Toast message={toastMessage} onClose={() => setToastMessage("")} />}
        <ApproverModal open={approverModalOpen} approver={approverModalData} onClose={() => setApproverModalOpen(false)} />
        <EntityDetailsModal open={detailsOpen} onClose={() => setDetailsOpen(false)} title="Job Details" data={detailsData} />
      </div>
    </AdminLayout>
  );
};

export default JobPosts;

async function openDetails(id){
  // placeholder; will be implemented in-component to access state
}
