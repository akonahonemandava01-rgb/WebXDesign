import React, { useState, useEffect } from "react";
import StudentLayout from "../../layouts/StudentLayout";
import "../../styles/StudentdashboardStyles/profile.css";
import { getStudentProfile, updateStudentProfile } from "../../utils/api";

const Profile = () => {
  const [studentData, setStudentData] = useState(null);
  const [formData, setFormData] = useState({});
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  useEffect(() => {
    async function loadProfile() {
      try {
        const profile = await getStudentProfile();
        setStudentData(profile);
        setFormData({
          full_name: profile.full_name || "",
          address: profile.address || "",
          tel: profile.tel || "",
          cel: profile.cel || "",
          id_passport_no: profile.id_passport_no || "",
          drivers_license: profile.drivers_license || "",
          level: profile.level || "",
          race: profile.race || "",
          career_objective: profile.career_objective || "",
          achievements: profile.achievements || "",
          interests: profile.interests || "",
        });
      } catch (err) {
        setError(err.message || "Failed to load profile.");
      } finally {
        setLoading(false);
      }
    }
    loadProfile();
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSave = async () => {
    try {
      setSaving(true);
      setError("");
      setSuccess("");
      const result = await updateStudentProfile(formData);
      setStudentData((prev) => ({ ...prev, ...formData }));
      setSuccess(result.message || "Profile updated successfully.");
    } catch (err) {
      setError(err.message || "Failed to update profile.");
    } finally {
      setSaving(false);
    }
  };

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
      {success && <p className="success">{success}</p>}

      {studentData ? (
        <div className="profile-section">
          <div className="profile-card">
            <div className="profile-info">
              <p><strong>Name:</strong> <input name="full_name" value={formData.full_name || ""} onChange={handleChange} /></p>
              <p><strong>Email:</strong> {studentData.email}</p>
              <p><strong>Phone:</strong> <input name="cel" value={formData.cel || ""} onChange={handleChange} /></p>
              <p><strong>Location:</strong> <input name="address" value={formData.address || ""} onChange={handleChange} /></p>
              <p><strong>ID / Passport:</strong> <input name="id_passport_no" value={formData.id_passport_no || ""} onChange={handleChange} /></p>
              <p><strong>Driver's License:</strong> <input name="drivers_license" value={formData.drivers_license || ""} onChange={handleChange} /></p>
              <p><strong>Level:</strong> <input name="level" value={formData.level || ""} onChange={handleChange} /></p>
              <p><strong>Race:</strong> <input name="race" value={formData.race || ""} onChange={handleChange} /></p>
            </div>
          </div>

          <h4>Education</h4>
          <div className="education-list">
            {(studentData.education || []).map((edu, index) => (
              <div key={index} className="education-item">
                <p><strong>{edu.institution || "Institution"}</strong></p>
                <p>Qualification: {edu.qualification || "Not set"}</p>
                <p>Years: {edu.date_range || "Not set"}</p>
              </div>
            ))}
          </div>

          <div className="profile-actions">
            <button className="btn-save" onClick={handleSave} disabled={saving}>
              {saving ? "Saving..." : "Save Changes"}
            </button>
          </div>
        </div>
      ) : (
        <p>No student profile data available.</p>
      )}
    </StudentLayout>
  );
};

export default Profile;
