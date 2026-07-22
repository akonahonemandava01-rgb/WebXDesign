import React, { useEffect, useState } from "react";
import AdminLayout from "../../layouts/AdminLayout";
import "../../styles/AdminDashboardStyles/AdminDashboard.css";
import Toast from "../../components/Toast";
import ApproverModal from "../../components/ApproverModal";
import EntityDetailsModal from "../../components/EntityDetailsModal";
import { getEmployerDetails } from "../../utils/api";
import { getEmployers, reviewEmployer } from "../../utils/api";

const Employer = () => {
  const [activeTab, setActiveTab] = useState("New Employers");
  const [searchQuery, setSearchQuery] = useState("");
  const [activeStatus, setActiveStatus] = useState("All");
  const [toastMessage, setToastMessage] = useState("");
  const [employers, setEmployers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [approverModalOpen, setApproverModalOpen] = useState(false);
  const [approverModalData, setApproverModalData] = useState(null);
  const [detailsOpen, setDetailsOpen] = useState(false);
  const [detailsData, setDetailsData] = useState(null);

  useEffect(() => {
    async function loadEmployers() {
      try {
        const allEmployers = await getEmployers();
        setEmployers(allEmployers);
      } catch (err) {
        setToastMessage(err.message || "Failed to load employer data.");
      } finally {
        setLoading(false);
      }
    }

    loadEmployers();
  }, []);

  useEffect(() => {
    if (activeTab === "New Employers") {
      setActiveStatus("Pending");
    } else {
      setActiveStatus("All");
    }
  }, [activeTab]);

  const employersToShow = activeTab === "New Employers"
    ? employers.filter((employer) => employer.approval_status === "Pending")
    : employers;

  const filteredEmployers = employersToShow.filter((employer) => {
    const matchesStatus = activeStatus === "All" || employer.approval_status === activeStatus;
    const matchesSearch =
      employer.company_name?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      employer.registration_number?.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesStatus && matchesSearch;
  });

  const handleReview = async (employerId, approvalStatus, companyName) => {
    try {
      await reviewEmployer(employerId, approvalStatus, "");
      setEmployers((prev) =>
        prev.map((employer) =>
          employer.employer_id === employerId
            ? { ...employer, approval_status: approvalStatus }
            : employer
        )
      );
      setToastMessage(`${companyName} ${approvalStatus.toLowerCase()} successfully.`);
    } catch (err) {
      setToastMessage(err.message || "Failed to update employer status.");
    }
  };

  const tabLabels = ["New Employers", "All Employers"];
  const statusOptions = activeTab === "New Employers"
    ? ["Pending"]
    : ["All", "Pending", "Approved", "Rejected", "Deactivated"];

  const openDetails = async (id) => {
    try {
      const data = await getEmployerDetails(id);
      setDetailsData(data);
      setDetailsOpen(true);
    } catch (err) {
      setToastMessage(err.message || "Failed to load details");
    }
  };

  return (
    <AdminLayout title="Employers">
      <div className="page-content">
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
          <div className="filters-sidebar">
            <label>Status</label>
            <select value={activeStatus} onChange={(e) => setActiveStatus(e.target.value)}>
              {statusOptions.map((status) => (
                <option key={status} value={status}>{status}</option>
              ))}
            </select>
          </div>

          <div className="table-section">
            <div className="search-bar">
              <input
                type="text"
                placeholder="Search by company or registration number..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>

            {loading ? (
              <p>Loading employers...</p>
            ) : (
              <table className="data-table full-width-table">
                <thead>
                      <tr>
                        <th>Company Name</th>
                        <th>Registration No</th>
                        <th>Industry</th>
                        <th>Person Approved</th>
                        <th>Date Approved</th>
                        <th>Comments</th>
                        <th>Approval Status</th>
                        <th>Activation Status</th>
                        <th>Action</th>
                      </tr>
                    </thead>
                <tbody>
                  {filteredEmployers.length === 0 ? (
                      <tr>
                        <td colSpan={9} style={{ textAlign: "center", padding: "2rem" }}>
                          No Employers Found
                        </td>
                      </tr>
                    ) : (
                    filteredEmployers.map((employer) => {
                      const s = employer.approval_status;
                      const approvalStatusDisplay = s === "Deactivated" ? "Approved" : (s || "Pending");
                      const activationStatusDisplay = s === "Deactivated" ? "Deactivated" : (s === "Approved" ? "Active" : "-");
                        return (
                        <tr key={employer.employer_id} onClick={() => openDetails(employer.employer_id)} style={{ cursor: 'pointer' }}>
                          <td>{employer.company_name}</td>
                          <td>{employer.registration_number || "-"}</td>
                          <td>{employer.industry || employer.sector || "-"}</td>
                          <td>
                            {(employer.approved_by_email || employer.approved_by_user_id) ? (
                              <button
                                className="approver-link"
                                onClick={() => { setApproverModalData(employer); setApproverModalOpen(true); }}
                              >
                                {employer.approved_by_email || employer.approved_by_user_id}
                              </button>
                            ) : (
                              '-'
                            )}
                          </td>
                          <td>{employer.approved_at ? new Date(employer.approved_at).toLocaleString() : "-"}</td>
                          <td><div style={{ whiteSpace: 'pre-wrap' }}>{employer.approval_comments || "-"}</div></td>
                          <td>
                            <span className={`status-label ${approvalStatusDisplay.toLowerCase()}`}>
                              {approvalStatusDisplay}
                            </span>
                          </td>
                          <td>{activationStatusDisplay}</td>
                              <td onClick={(e)=>e.stopPropagation()}>
                                {activeTab === "New Employers" ? (
                                  <>
                                    <button
                                      className="btn-approve"
                                      onClick={() => handleReview(employer.employer_id, "Approved", employer.company_name)}
                                    >
                                      Approve
                                    </button>
                                    <button
                                      className="btn-reject"
                                      onClick={() => handleReview(employer.employer_id, "Rejected", employer.company_name)}
                                    >
                                      Reject
                                    </button>
                                  </>
                                ) : s === "Approved" ? (
                                  <button
                                    className="btn-reject"
                                    onClick={() => handleReview(employer.employer_id, "Deactivated", employer.company_name)}
                                  >
                                    Deactivate
                                  </button>
                                ) : s === "Deactivated" ? (
                                  <button
                                    className="btn-approve"
                                    onClick={() => handleReview(employer.employer_id, "Approved", employer.company_name)}
                                  >
                                    Activate
                                  </button>
                                ) : (
                                  <span className="no-action">—</span>
                                )}
                              </td>
                        </tr>
                      );
                    })
                  )}
                </tbody>
              </table>
            )}
          </div>
        </div>

        {toastMessage && <Toast message={toastMessage} onClose={() => setToastMessage("")} />}
        <ApproverModal open={approverModalOpen} approver={approverModalData} onClose={() => setApproverModalOpen(false)} />
        <EntityDetailsModal open={detailsOpen} onClose={() => setDetailsOpen(false)} title="Employer Details" data={detailsData} />
      </div>
    </AdminLayout>
  );
};

export default Employer;
