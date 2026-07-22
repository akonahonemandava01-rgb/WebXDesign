import React, { useEffect, useMemo, useState } from "react";
import StudentLayout from "../../layouts/StudentLayout";
import Card from "../../components/Card";
import ProfileCompletion from "./ProfileCompletion";
import SearchBar from "../../components/SearchBar";
import JobPost from "./JobPost";
import { getMatchedJobs, getMyApplications, getStudentProfile } from "../../utils/api";

const StudentDashboard = () => {
  const [profile, setProfile] = useState(null);
  const [applications, setApplications] = useState([]);
  const [matchedJobs, setMatchedJobs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");

  useEffect(() => {
    let mounted = true;

    async function loadDashboard() {
      try {
        const [profileData, applicationsData, matchedJobsData] = await Promise.all([
          getStudentProfile(),
          getMyApplications(),
          getMatchedJobs(),
        ]);

        if (!mounted) return;
        setProfile(profileData);
        setApplications(Array.isArray(applicationsData) ? applicationsData : []);
        setMatchedJobs(Array.isArray(matchedJobsData) ? matchedJobsData : []);
      } catch (err) {
        console.error(err);
      } finally {
        if (mounted) setLoading(false);
      }
    }

    loadDashboard();
    return () => { mounted = false; };
  }, []);

  const profileCompletion = useMemo(() => {
    if (!profile) return 0;
    const requiredFields = [
      profile.full_name,
      profile.address,
      profile.tel,
      profile.cel,
      profile.id_passport_no,
      profile.drivers_license,
      profile.career_objective,
      profile.race,
      profile.level,
      profile.achievements,
      profile.interests,
      profile.gender,
      profile.nationality,
    ];

    const filled = requiredFields.filter((value) => value && String(value).trim() !== "").length;
    return Math.round((filled / requiredFields.length) * 100);
  }, [profile]);

  const visibleJobs = matchedJobs.filter((job) => {
    const query = searchQuery.trim().toLowerCase();
    if (!query) return true;
    return (
      (job.title || "").toLowerCase().includes(query) ||
      (job.location || "").toLowerCase().includes(query) ||
      (job.employment_type || "").toLowerCase().includes(query)
    );
  });

  const successfulApplications = applications.filter((app) => app.application_status === "Successful").length;

  return (
    <StudentLayout title="Student Dashboard">
      <h3>Student Dashboard</h3>

      {loading ? (
        <p>Loading dashboard...</p>
      ) : (
        <>
          <div className="dashboard-row">
            <Card title="Jobs Applied" count={applications.length} description="Applications submitted" />
            <Card title="Successful Applications" count={successfulApplications} description="Accepted by employers" />
            <Card title="Matched Jobs" count={matchedJobs.length} description="Jobs aligned with your profile" />
            <Card title="Profile Completion" count={`${profileCompletion}%`} description="Profile readiness" />
            <Card title="Student Number" count={profile?.student_no || "-"} description="Current records" />
          </div>

          <ProfileCompletion percentage={profileCompletion} />

          <SearchBar placeholder="Search jobs, applications..." onSearch={(query) => setSearchQuery(query)} />

          <JobPost jobs={visibleJobs} />
        </>
      )}
    </StudentLayout>
  );
};

export default StudentDashboard;
