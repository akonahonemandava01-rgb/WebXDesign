import React, { useState, useEffect } from "react";
import StudentLayout from "../../layouts/StudentLayout";
import "../../styles/StudentdashboardStyles/profile.css";

const StudentProfile = () => {
  const [studentData, setStudentData] = useState(null);

  useEffect(() => {
    // Later replace with API call to school database
    setStudentData({
      name: "Rilinde Musehane",
      email: "rilinde@example.com",
      phone: "+27 123 456 789",
      location: "Johannesburg, South Africa",
      education: [
        { school: "University of Cape Town", degree: "BSc Computer Science", years: "2022 - 2025" },
        { school: "Green Fields High School", degree: "High School Diploma", years: "2017 - 2021" }
      ]
    });
  }, []);

  return (
    <StudentLayout title="Profile">
      <h3>Profile</h3>

          {studentData ? (
            <div className="profile-section">
              <div className="profile-card">
                {/*<img src="/assets/profile-placeholder.png" alt="Profile" className="profile-image" />*/}
                <div className="profile-info">
                  <p><strong>Name:</strong> {studentData.name}</p>
                  <p><strong>Email:</strong> {studentData.email}</p>
                  <p><strong>Phone:</strong> {studentData.phone}</p>
                  <p><strong>Location:</strong> {studentData.location}</p>
                </div>
              </div>

              <h4>Education</h4>
              <div className="education-list">
                {studentData.education.map((edu, index) => (
                  <div key={index} className="education-item">
                    <p><strong>{edu.school}</strong></p>
                    <p>Degree: {edu.degree}</p>
                    <p>Years: {edu.years}</p>
                  </div>
                ))}
              </div>

              <div className="profile-actions">
                <button className="btn-edit">Edit</button>
                <button className="btn-save">Save Changes</button>
              </div>
            </div>
          ) : (
            <p>Loading student data...</p>
          )}
    </StudentLayout>
  );
};

export default StudentProfile;
