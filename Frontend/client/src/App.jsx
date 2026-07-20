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

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<RegisterP />} />
        <Route path="/Student-Dashboard" element={<StudentDashboard />} />
        <Route path="/dashboard" element={<StudentDashboard />} />
        <Route path="/jobs" element={<ViewJobs />} />
        <Route path="/profile" element={<Profile />} />
        <Route path="/create-cv" element={<CreateCV />} />
        <Route path="/view-jobs" element={<ViewJobs />} />
        <Route path="/applications" element={<MyApplications />} />
        <Route path="/savedJobs" element={<SavedJobs />} />
        <Route path="/admin-dashboard" element={<AdminDashboard />} />
        <Route path="/admin-profile" element={<AdminProfile />} />
      </Routes>
    </Router>
  );
}

export default App;
