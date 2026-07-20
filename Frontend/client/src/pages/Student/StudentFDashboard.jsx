import React from "react";
import StudentLayout from "../../layouts/StudentLayout";
import Card from "../../components/Card";
import ProfileCompletion from "./ProfileCompletion";
import SearchBar from "../../components/SearchBar";
import JobPost from "./JobPost";

const StudentDashboard = () => {
  const handleSearch = (query) => {
    alert(`Searching for: ${query}`);
  };

  return (
    <StudentLayout title="Student Dashboard">
      <h3>Student Dashboard</h3>

          {/* Job Cards */}
          <div className="dashboard-row">
            <Card title="Jobs Applied" count="5" description="Applications submitted" />
            <Card title="Interviews" count="2" description="Upcoming interviews" />
            <Card title="Courses" count="3" description="Active learning courses" />
            <Card title="Saved Jobs" count="12" description="Bookmarked opportunities" />
            <Card title="Recommended Jobs" count="4" description="New matches today" />
          </div>

          {/* Profile Completion */}
          <ProfileCompletion percentage={75} />

          {/* Search Bar */}
          <SearchBar placeholder="Search jobs, applications..." onSearch={handleSearch} />

      {/* Job Posts */}
      <JobPost />
    </StudentLayout>
  );
};

export default StudentDashboard;
