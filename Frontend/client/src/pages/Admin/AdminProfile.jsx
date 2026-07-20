import React, { useState } from "react";
import AdminLayout from "../../layouts/AdminLayout";
import "../../styles/profile.css";

const AdminProfile = () => {
  const [admin, setAdmin] = useState({
    name: "John Admin",
    email: "john.admin@example.com",
    role: "System Administrator",
    phone: "(555) 123-4567",
    location: "Johannesburg, South Africa",
    education: [
      "MBA, Business Administration - University of Cape Town (2015 - 2017)",
      "BSc, Information Technology - Wits University (2010 - 2014)"
    ]
  });

  const [isEditing, setIsEditing] = useState(false);

  const handleEdit = () => setIsEditing(true);
  const handleSave = () => {
    setIsEditing(false);
    alert("Profile updated successfully!");
  };

  return (
    <AdminLayout title="Admin Profile">
      <div className="profile-content">
      

        {/* Profile Card */}
        <div className="profile-card">
          {/*<img
            src="https://via.placeholder.com/100"
            alt="Admin Avatar"
            className="profile-image"
          />*/}

          <div className="profile-info">
            {isEditing ? (
              <>
                <p>
                  <strong>Name:</strong>{" "}
                  <input
                    type="text"
                    value={admin.name}
                    onChange={(e) => setAdmin({ ...admin, name: e.target.value })}
                  />
                </p>
                <p>
                  <strong>Email:</strong>{" "}
                  <input
                    type="email"
                    value={admin.email}
                    onChange={(e) => setAdmin({ ...admin, email: e.target.value })}
                  />
                </p>
                <p>
                  <strong>Role:</strong>{" "}
                  <input
                    type="text"
                    value={admin.role}
                    onChange={(e) => setAdmin({ ...admin, role: e.target.value })}
                  />
                </p>
                <p>
                  <strong>Phone:</strong>{" "}
                  <input
                    type="text"
                    value={admin.phone}
                    onChange={(e) => setAdmin({ ...admin, phone: e.target.value })}
                  />
                </p>
                <p>
                  <strong>Location:</strong>{" "}
                  <input
                    type="text"
                    value={admin.location}
                    onChange={(e) => setAdmin({ ...admin, location: e.target.value })}
                  />
                </p>
              </>
            ) : (
              <>
                <p><strong>Name:</strong> {admin.name}</p>
                <p><strong>Email:</strong> {admin.email}</p>
                <p><strong>Role:</strong> {admin.role}</p>
                <p><strong>Phone:</strong> {admin.phone}</p>
                <p><strong>Location:</strong> {admin.location}</p>
              </>
            )}
          </div>
        </div>

        {/* ✅ Education Section */}
        <div className="profile-section">
          <h4>Education</h4>
          <div className="education-list">
            {admin.education.map((edu, index) => (
              <div key={index} className="education-item">
                {edu}
              </div>
            ))}
          </div>
        </div>

        {/*  Actions */}
        <div className="profile-actions">
          {!isEditing ? (
            <button className="btn-edit" onClick={handleEdit}>Edit Profile</button>
          ) : (
            <button className="btn-save" onClick={handleSave}>Save Changes</button>
          )}
        </div>
      </div>
    </AdminLayout>
  );
};

export default AdminProfile;
