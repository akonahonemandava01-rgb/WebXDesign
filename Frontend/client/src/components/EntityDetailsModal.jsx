import React from "react";
import "../styles/AdminDashboardStyles/AdminDashboard.css";

const Row = ({ label, value }) => (
  <div className="detail-row">
    <div className="detail-label">{label}</div>
    <div className="detail-value">{value ?? "-"}</div>
  </div>
);

export default function EntityDetailsModal({ open, onClose, title, data }) {
  if (!open) return null;
  return (
    <div className="modal-backdrop">
      <div className="modal-card">
        <div className="modal-header">
          <h4>{title || "Details"}</h4>
          <button className="close-btn" onClick={onClose}>×</button>
        </div>
        <div className="modal-body">
          {data ? (
            <div className="details-grid">
              {Object.keys(data).map((k) => (
                <Row key={k} label={k.replace(/_/g, " ")} value={String(data[k])} />
              ))}
            </div>
          ) : (
            <p>No details available</p>
          )}
        </div>
        <div className="modal-footer">
          <button className="btn-approve" onClick={onClose}>Close</button>
        </div>
      </div>
    </div>
  );
}
