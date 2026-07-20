import React, { useState, useEffect } from "react";
import StudentLayout from "../../layouts/StudentLayout";
import "../../styles/StudentdashboardStyles/CreateCv.css";

const CreateCV = () => {
  const [studentData, setStudentData] = useState(null);
  const [educationList, setEducationList] = useState([]);
  const [summary, setSummary] = useState("");
  const [experienceList, setExperienceList] = useState([]);

  useEffect(() => {
    // ✅ Mocked data (replace later with backend fetch)
    const fetchedData = {
      name: "Rilinde Nkosi",
      email: "rilinde@example.com",
      phone: "+27 123 456 789",
      location: "Johannesburg, South Africa",
      education: [
        { school: "University of Cape Town", degree: "BSc Computer Science", years: "2022 - 2025" }
      ]
    };
    setStudentData(fetchedData);
    setEducationList(fetchedData.education);
  }, []);

  const handleAddEducation = () => {
    setEducationList([...educationList, { school: "", degree: "", years: "" }]);
  };

  const handleEducationChange = (index, field, value) => {
    const updated = [...educationList];
    updated[index][field] = value;
    setEducationList(updated);
  };

  const handleAddExperience = () => {
    setExperienceList([...experienceList, { title: "", company: "", years: "", description: "" }]);
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

        {studentData && (
          <>
            <section className="cv-section">
              <h4>Personal Information</h4>
              <div className="cv-info">
                <p><strong>Name:</strong> {studentData.name}</p>
                <p><strong>Email:</strong> {studentData.email}</p>
                <p><strong>Phone:</strong> {studentData.phone}</p>
                <p><strong>Location:</strong> {studentData.location}</p>
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
                    placeholder="School / University"
                    value={edu.school}
                    onChange={(e) => handleEducationChange(index, "school", e.target.value)}
                  />
                  <input
                    type="text"
                    placeholder="Degree"
                    value={edu.degree}
                    onChange={(e) => handleEducationChange(index, "degree", e.target.value)}
                  />
                  <input
                    type="text"
                    placeholder="Years Attended"
                    value={edu.years}
                    onChange={(e) => handleEducationChange(index, "years", e.target.value)}
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
                    placeholder="Job Title"
                    value={exp.title}
                    onChange={(e) => handleExperienceChange(index, "title", e.target.value)}
                  />
                  <input
                    type="text"
                    placeholder="Company"
                    value={exp.company}
                    onChange={(e) => handleExperienceChange(index, "company", e.target.value)}
                  />
                  <input
                    type="text"
                    placeholder="Years Worked"
                    value={exp.years}
                    onChange={(e) => handleExperienceChange(index, "years", e.target.value)}
                  />
                  <textarea
                    placeholder="Describe your responsibilities and achievements..."
                    value={exp.description}
                    onChange={(e) => handleExperienceChange(index, "description", e.target.value)}
                  />
                </div>
              ))}
              <button className="btn-add" onClick={handleAddExperience}>+ Add Experience</button>
            </section>

            <div className="cv-actions">
              <button className="btn-save" onClick={handleSaveCV}>Save CV</button>
            </div>
          </>
        )}
      </div>
    </StudentLayout>
  );
};

export default CreateCV;
