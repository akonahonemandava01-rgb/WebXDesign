import React, { useEffect, useState } from "react";
import StudentLayout from "../../layouts/StudentLayout";
import SearchBar from "../../components/SearchBar";
import JobPost from "./JobPost";
import { getJobs } from "../../utils/api";
import "../../styles/StudentdashboardStyles/ViewJobs.css";

const ViewJobs = () => {
  const [jobs, setJobs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");

  useEffect(() => {
    async function loadJobs() {
      try {
        const data = await getJobs();
        setJobs(data);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    }
    loadJobs();
  }, []);

  const handleSearch = (query) => {
    setSearchQuery(query);
  };

  const visibleJobs = jobs.filter((job) =>
    job.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
    job.location.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <StudentLayout title="Jobs">
      <SearchBar placeholder="Search jobs..." onSearch={handleSearch} />

      <div className="jobs-layout">
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

        <section className="job-listings">
          {loading ? <p>Loading jobs...</p> : <JobPost jobs={visibleJobs} />}
        </section>
      </div>
    </StudentLayout>
  );
};

export default ViewJobs;
