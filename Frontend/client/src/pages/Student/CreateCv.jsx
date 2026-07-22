import React, { useState, useEffect } from "react";
import StudentLayout from "../../layouts/StudentLayout";
import "../../styles/StudentdashboardStyles/CreateCv.css";
import { getStudentProfile } from "../../utils/api";

const CreateCV = () => {
  const [studentData, setStudentData] = useState(null);
  const [educationList, setEducationList] = useState([]);
  const [summary, setSummary] = useState("");
  const [experienceList, setExperienceList] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    async function loadProfile() {
      try {
        const profile = await getStudentProfile();
        setStudentData(profile);
        setEducationList(profile.education || []);
        setExperienceList(profile.employment || []);
        setSummary(profile.career_objective || "");
      } catch (err) {
        setError(err.message || "Failed to load CV data.");
      } finally {
        setLoading(false);
      }
    }
    loadProfile();
  }, []);

  const handleAddEducation = () => {
    setEducationList([...educationList, { institution: "", qualification: "", date_range: "", subjects: "", majors: "", sub_majors: "", research: "" }]);
  };

  const handleEducationChange = (index, field, value) => {
    const updated = [...educationList];
    updated[index][field] = value;
    setEducationList(updated);
  };

  const handleAddExperience = () => {
    setExperienceList([...experienceList, { employer_name: "", job_title: "", date_range: "", tasks_responsibilities: "" }]);
  };

  const handleExperienceChange = (index, field, value) => {
    const updated = [...experienceList];
    updated[index][field] = value;
    setExperienceList(updated);
  };

  const handleSaveCV = () => {
    alert("CV saved successfully!");
  };

  return (
    <StudentLayout title="Create CV">
      <div className="cv-content">
        <h3>Build Your Resume</h3>
        <p>Utilize your existing profile information to craft your CV.</p>

        {loading ? (
          <p>Loading your profile...</p>
        ) : error ? (
          <p className="error">{error}</p>
        ) : studentData ? (
          <>
            <section className="cv-section">
              <h4>Personal Information</h4>
              <div className="cv-info">
                <p><strong>Name:</strong> {studentData.full_name || studentData.email}</p>
                <p><strong>Email:</strong> {studentData.email}</p>
                <p><strong>Student Number:</strong> {studentData.student_no || "Not set"}</p>
                <p><strong>Phone:</strong> {studentData.cel || studentData.tel || "Not set"}</p>
                <p><strong>Location:</strong> {studentData.address || "Not set"}</p>
                <p><strong>Gender:</strong> {studentData.gender || "Not set"}</p>
                <p><strong>Nationality:</strong> {studentData.nationality || "Not set"}</p>
                <p><strong>Level:</strong> {studentData.level || "Not set"}</p>
                <p><strong>ID / Passport:</strong> {studentData.id_passport_no || "Not set"}</p>
                <p><strong>Driver's License:</strong> {studentData.drivers_license || "Not set"}</p>
                <p><strong>Race:</strong> {studentData.race || "Not set"}</p>
                <p><strong>Achievements:</strong> {studentData.achievements || "Not set"}</p>
                <p><strong>Interests:</strong> {studentData.interests || "Not set"}</p>
              </div>
            </section>

            <section className="cv-section">
              <h4>Profile Summary</h4>
              <textarea
                placeholder="Write a short summary about yourself..."
                value={summary}
                onChange={(e) => setSummary(e.target.value)}
              />
            </section>

            <section className="cv-section">
              <h4>Education</h4>
              {educationList.map((edu, index) => (
                <div key={index} className="education-item">
                  <input
                    type="text"
                    placeholder="University / Institution"
                    value={edu.institution || ""}
                    onChange={(e) => handleEducationChange(index, "institution", e.target.value)}
                  />
                  <input
                    type="text"
                    placeholder="Qualification"
                    value={edu.qualification || ""}
                    onChange={(e) => handleEducationChange(index, "qualification", e.target.value)}
                  />
                  <input
                    type="text"
                    placeholder="Date Range"
                    value={edu.date_range || ""}
                    onChange={(e) => handleEducationChange(index, "date_range", e.target.value)}
                  />
                  <input
                    type="text"
                    placeholder="Subjects"
                    value={edu.subjects || ""}
                    onChange={(e) => handleEducationChange(index, "subjects", e.target.value)}
                  />
                  <input
                    type="text"
                    placeholder="Majors"
                    value={edu.majors || ""}
                    onChange={(e) => handleEducationChange(index, "majors", e.target.value)}
                  />
                  <input
                    type="text"
                    placeholder="Sub Majors"
                    value={edu.sub_majors || ""}
                    onChange={(e) => handleEducationChange(index, "sub_majors", e.target.value)}
                  />
                  <textarea
                    placeholder="Research / Notes"
                    value={edu.research || ""}
                    onChange={(e) => handleEducationChange(index, "research", e.target.value)}
                  />
                </div>
              ))}
              <button className="btn-add" onClick={handleAddEducation}>+ Add Education</button>
            </section>

            <section className="cv-section">
              <h4>Experience</h4>
              {experienceList.map((exp, index) => (
                <div key={index} className="experience-item">
                  <input
                    type="text"
                    placeholder="Employer"
                    value={exp.employer_name || ""}
                    onChange={(e) => handleExperienceChange(index, "employer_name", e.target.value)}
                  />
                  <input
                    type="text"
                    placeholder="Job Title"
                    value={exp.job_title || ""}
                    onChange={(e) => handleExperienceChange(index, "job_title", e.target.value)}
                  />
                  <input
                    type="text"
                    placeholder="Date Range"
                    value={exp.date_range || ""}
                    onChange={(e) => handleExperienceChange(index, "date_range", e.target.value)}
                  />
                  <textarea
                    placeholder="Describe your responsibilities and achievements..."
                    value={exp.tasks_responsibilities || ""}
                    onChange={(e) => handleExperienceChange(index, "tasks_responsibilities", e.target.value)}
                  />
                </div>
              ))}
              <button className="btn-add" onClick={handleAddExperience}>+ Add Experience</button>
            </section>

            <div className="cv-actions">
              <button className="btn-save" onClick={handleSaveCV}>Save CV</button>
            </div>
          </>
        ) : (
          <p>No CV data available.</p>
        )}
      </div>
    </StudentLayout>
  );
};

export default CreateCV;
