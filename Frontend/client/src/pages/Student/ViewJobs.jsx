import React from "react";
import StudentLayout from "../../layouts/StudentLayout";
import SearchBar from "../../components/SearchBar";
import JobPost from "./JobPost";   // ✅ reuse existing component
import "../../styles/StudentdashboardStyles/ViewJobs.css";

const ViewJobs = () => {
  const handleSearch = (query) => {
    alert(`Searching for: ${query}`);
  };

  return (
    <StudentLayout title="View Jobs">
      {/* ✅ Search bar */}
      <SearchBar placeholder="Search jobs..." onSearch={handleSearch} />

      <div className="jobs-layout">
        {/* ✅ Filters */}
        <aside className="filters-panel">
          <h4>Filters</h4>
          <div>
            <label>Category</label>
            <select>
              <option>All</option>
              <option>IT & Software</option>
              <option>Marketing</option>
              <option>Finance</option>
            </select>
          </div>
          <div>
            <label>Location</label>
            <select>
              <option>All</option>
              <option>Johannesburg</option>
              <option>Cape Town</option>
              <option>Remote</option>
            </select>
          </div>
          <div>
            <label>Job Type</label>
            <select>
              <option>All</option>
              <option>Full-Time</option>
              <option>Part-Time</option>
              <option>Internship</option>
            </select>
          </div>
          <button className="btn-apply">Apply Filters</button>
        </aside>

        {/* ✅ Job Listings */}
        <section className="job-listings">
         {/*} <h4>Job Listings</h4>*/}
          <JobPost />   {/* ✅ reuse your existing JobPost component */}
        </section>
      </div>
    </StudentLayout>
  );
};

export default ViewJobs;
