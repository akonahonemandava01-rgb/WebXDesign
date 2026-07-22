import React, { useEffect, useState } from "react";
import StudentLayout from "../../layouts/StudentLayout";
import "../../styles/StudentdashboardStyles/MyApplication.css";
import { getMyApplications, withdrawApplication } from "../../utils/api";

const statusColors = {
  Pending: "orange",
  Successful: "green",
  Unsuccessful: "red",
  Withdrawn: "gray",
  "In Progress": "green",
  "Interview Scheduled": "purple",
  "Offer Received": "limegreen",
  Rejected: "red"
};

const MyApplications = () => {
  const [applications, setApplications] = useState([]);
  const [filter, setFilter] = useState("All");
  const [loading, setLoading] = useState(true);
  const [statusMessage, setStatusMessage] = useState("");

  useEffect(() => {
    async function loadApplications() {
      try {
        const apps = await getMyApplications();
        setApplications(apps);
      } catch (err) {
        setStatusMessage(err.message || "Failed to load applications.");
      } finally {
        setLoading(false);
      }
    }
    loadApplications();
  }, []);

  const filteredApps =
    filter === "All"
      ? applications
      : applications.filter((app) => app.application_status?.includes(filter));

  const handleWithdraw = async (application) => {
    try {
      await withdrawApplication(application.application_id);
      setApplications((prev) =>
        prev.map((app) =>
          app.application_id === application.application_id
            ? { ...app, application_status: "Withdrawn" }
            : app
        )
      );
      setStatusMessage("Your application has been withdrawn.");
    } catch (err) {
      setStatusMessage(err.message || "Failed to withdraw application.");
    }
  };

  return (
    <StudentLayout title="My Applications">
      <main className="applications-content">
        <h3>Track Application</h3>

        {statusMessage && <p className="status-message">{statusMessage}</p>}

        <div className="filter-tabs">
          {["All", "Pending", "Successful", "Unsuccessful", "Withdrawn"].map((tab) => (
            <button
              key={tab}
              className={`filter-tab ${filter === tab ? "active" : ""}`}
              onClick={() => setFilter(tab)}
            >
              {tab}
            </button>
          ))}
        </div>

        {loading ? (
          <p>Loading applications...</p>
        ) : (
          <div className="applications-list">
            {filteredApps.length === 0 ? (
              <p>No applications found.</p>
            ) : (
              filteredApps.map((app) => (
                <div key={app.application_id} className="application-card">
                  <div className="application-info">
                    <h4>{app.title}</h4>
                    <p>{app.location}</p>
                    <p className="applied-date">Applied on: {new Date(app.applied_at).toLocaleDateString()}</p>
                  </div>
                  <div className="application-status">
                    <span
                      className="status-badge"
                      style={{ backgroundColor: statusColors[app.application_status] || "gray" }}
                    >
                      {app.application_status}
                    </span>
                    {app.application_status === "Pending" && (
                      <button
                        className="btn-withdraw"
                        onClick={() => handleWithdraw(app)}
                      >
                        Withdraw
                      </button>
                    )}
                  </div>
                </div>
              ))
            )}
          </div>
        )}
      </main>
    </StudentLayout>
  );
};

export default MyApplications;
