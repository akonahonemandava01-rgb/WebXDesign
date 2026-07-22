import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Home from "./pages/home";
import Login from "./pages/Authentication/login";
import RegisterP from "./pages/Authentication/register";
import StudentDashboard from "./pages/Student/StudentFDashboard";
import Profile from "./pages/Student/profile";
import CreateCV from "./pages/Student/CreateCv";
import ViewJobs from "./pages/Student/ViewJobs";
import MyApplications from "./pages/Student/myApplication";
import SavedJobs from "./pages/Student/SavedJobs";
import AdminDashboard from "./pages/Admin/adminDashboard";
import AdminProfile from "./pages/Admin/AdminProfile";
import Employer from "./pages/Admin/Employer";
import JobPosts from "./pages/Admin/jobpost";
import StudentPlacements from "./pages/Admin/StudentPlacements";
import ProtectedRoute from "./components/ProtectedRoute";

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<RegisterP />} />
        <Route path="/dashboard" element={<StudentDashboard />} />
        <Route path="/Dashboard" element={<StudentDashboard />} />
        <Route path="/student/dashboard" element={<StudentDashboard />} />
        <Route path="/student/jobs" element={<ViewJobs />} />
        <Route path="/student/profile" element={<Profile />} />
        <Route path="/student/createCv" element={<CreateCV />} />
        <Route path="/student/viewjobs" element={<ViewJobs />} />
        <Route path="/student/applications" element={<MyApplications />} />
        <Route path="/student/savedJobs" element={<SavedJobs />} />



        <Route path="/admin/dashboard" element={<ProtectedRoute><AdminDashboard /></ProtectedRoute>} />
        <Route path="/admin/profile" element={<ProtectedRoute><AdminProfile /></ProtectedRoute>} />
        <Route path="/admin/employers" element={<ProtectedRoute><Employer /></ProtectedRoute>} />
        <Route path="/admin/job-approval" element={<ProtectedRoute><JobPosts /></ProtectedRoute>} />
        <Route path="/admin/placements" element={<ProtectedRoute><StudentPlacements /></ProtectedRoute>} />

      
      </Routes>
    </Router>
  );
}

export default App;
