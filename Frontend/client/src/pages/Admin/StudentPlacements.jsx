import React, { useEffect, useState } from "react";
import AdminLayout from "../../layouts/AdminLayout";
import "../../styles/AdminDashboardStyles/AdminDashboard.css";
import { getPlacements } from "../../utils/api";

const StudentPlacements = () => {
  const [activeFaculty, setActiveFaculty] = useState("All");
  const [activeLevel, setActiveLevel] = useState("All");
  const [activeCourse, setActiveCourse] = useState("All");
  const [activeIndustry, setActiveIndustry] = useState("All");
  const [searchQuery, setSearchQuery] = useState("");

  const [placementsData, setPlacementsData] = useState([]);

  useEffect(() => {
    let mounted = true;
    async function load() {
      try {
        const data = await getPlacements();
        if (!mounted) return;
        const mapped = data.map((r) => ({
          number: r.student_no || `#${r.application_id}`,
          name: r.full_name || "-",
          faculty: r.faculty || "-",
          level: r.level || "-",
          course: r.course || "-",
          company: r.company || "-",
          industry: r.industry || "-",
          position: r.position || "-",
          startDate: r.applied_at ? new Date(r.applied_at).toLocaleDateString() : "-",
          endDate: "-",
          status: r.application_status || "-",
        }));
        setPlacementsData(mapped);
      } catch (err) {
        console.error("Failed to load placements:", err.message);
      }
    }
    load();
    return () => { mounted = false; };
  }, []);

  // Filter + Search logic
  const filteredPlacements = placementsData.filter((p) => {
    const matchesFilters =
      (activeFaculty === "All" || p.faculty === activeFaculty) &&
      (activeLevel === "All" || p.level === activeLevel) &&
      (activeCourse === "All" || p.course === activeCourse) &&
      (activeIndustry === "All" || p.industry === activeIndustry);

    const matchesSearch =
      p.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      p.number.toLowerCase().includes(searchQuery.toLowerCase());

    return matchesFilters && matchesSearch;
  });

  return (
    <AdminLayout title="Student Placements">
      <div className="page-content student-placements">
        <h3>Student Placements</h3>

        <div className="filters-layout">
          {/* Left Sidebar Filters */}
          <div className="filters-sidebar">
            <label>Faculty</label>
            <select value={activeFaculty} onChange={(e) => setActiveFaculty(e.target.value)}>
              <option>All</option>
              <option>Engineering</option>
              <option>Business</option>
              <option>Humanities</option>
            </select>

            <label>Level</label>
            <select value={activeLevel} onChange={(e) => setActiveLevel(e.target.value)}>
              <option>All</option>
              <option>Undergraduate</option>
              <option>Postgraduate</option>
            </select>

            <label>Course</label>
            <select value={activeCourse} onChange={(e) => setActiveCourse(e.target.value)}>
              <option>All</option>
              <option>Computer Science</option>
              <option>Mechanical Eng.</option>
              <option>Marketing</option>
              <option>Psychology</option>
            </select>

            <label>Industry</label>
            <select value={activeIndustry} onChange={(e) => setActiveIndustry(e.target.value)}>
              <option>All</option>
              <option>IT</option>
              <option>Manufacturing</option>
              <option>Business</option>
              <option>Healthcare</option>
            </select>
          </div>

          {/* Table + Search on the right */}
          <div className="table-section">
            <div className="search-bar">
              <input
                type="text"
                placeholder="Search by Student Name or Number..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>

            <table className="data-table">
              <thead>
                <tr>
                  <th>Student Number</th>
                  <th>Student Name</th>
                  <th>Faculty</th>
                  <th>Level</th>
                  <th>Course</th>
                  <th>Company</th>
                  <th>Industry</th>
                  <th>Position</th>
                  <th>Start Date</th>
                  <th>End Date</th>
                  <th>Status</th>
                </tr>
              </thead>
              <tbody>
                {filteredPlacements.length === 0 ? (
                  <tr>
                    <td colSpan={11} style={{ textAlign: "center", padding: "2rem" }}>
                      No Students Found
                    </td>
                  </tr>
                ) : (
                  filteredPlacements.map((placement, index) => (
                    <tr key={index} className="clickable-row">
                      <td>{placement.number}</td>
                      <td>{placement.name}</td>
                      <td>{placement.faculty}</td>
                      <td>{placement.level}</td>
                      <td>{placement.course}</td>
                      <td>{placement.company}</td>
                      <td>{placement.industry}</td>
                      <td>{placement.position}</td>
                      <td>{placement.startDate}</td>
                      <td>{placement.endDate}</td>
                      <td>
                        <span className={`status-label ${placement.status.toLowerCase()}`}>
                          {placement.status}
                        </span>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </AdminLayout>
  );
};

export default StudentPlacements;
