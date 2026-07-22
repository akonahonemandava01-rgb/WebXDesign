import React, { useState, useEffect } from "react";
import StudentLayout from "../../layouts/StudentLayout";
import "../../styles/StudentdashboardStyles/profile.css";
import { getStudentProfile } from "../../utils/api";

const StudentProfile = () => {
  const [studentData, setStudentData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    async function loadProfile() {
      try {
        const profile = await getStudentProfile();
        setStudentData(profile);
      } catch (err) {
        setError(err.message || "Failed to load profile.");
      } finally {
        setLoading(false);
      }
    }
    loadProfile();
  }, []);

  if (loading) {
    return (
      <StudentLayout title="Profile">
        <p>Loading student data...</p>
      </StudentLayout>
    );
  }

  return (
    <StudentLayout title="Profile">
      <h3>Profile</h3>

      {error && <p className="error">{error}</p>}

      {studentData ? (
        <div className="profile-section">
          <div className="profile-card">
            <div className="profile-info">
              <p><strong>Name:</strong> {studentData.full_name || studentData.email}</p>
              <p><strong>Email:</strong> {studentData.email}</p>
              <p><strong>Phone:</strong> {studentData.cel || studentData.tel || "Not set"}</p>
              <p><strong>Location:</strong> {studentData.address || "Not set"}</p>
            </div>
          </div>

          <h4>Education</h4>
          <div className="education-list">
            {(studentData.education || []).map((edu, index) => (
              <div key={index} className="education-item">
                <p><strong>{edu.institution}</strong></p>
                <p>Qualification: {edu.qualification}</p>
                <p>Years: {edu.date_range}</p>
              </div>
            ))}
          </div>

          <div className="profile-actions">
            <button className="btn-edit">Edit</button>
            <button className="btn-save">Save Changes</button>
          </div>
        </div>
      ) : (
        <p>No student profile data available.</p>
      )}
    </StudentLayout>
  );
};

export default StudentProfile;
