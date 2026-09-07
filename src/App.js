import {
  BrowserRouter,
  Routes,
  Route,
  Navigate,
} from "react-router-dom";
import Home from "./home";
import Dashboard from "./dashboard";
import Internship from "./internship";
import Applications from "./Applications";
import Interviews from "./interviews";
import Documents from "./documents";
import Notification from "./notification"; 
import Profile from "./profile";
import AdminDashboard from "./admindashboard";
import ManageStudents from "./managestudents";
import Manageinternships from "./manageinternships";
import Managecompanies from "./managecompanies";
import ManageApplications from "./manageapplications";
import Report from "./report";

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Home />} />
        
        {/* Student Routes */}
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/internships" element={<Internship />} />
        <Route path="/applications" element={<Applications />} />
        <Route path="/interviews" element={<Interviews />} />
        <Route path="/documents" element={<Documents />} />
        <Route path="/notifications" element={<Notification />} />
        <Route path="/profile" element={<Profile />} />
        
        {/* Admin Routes (Supporting both short paths and /admin/... paths) */}
        <Route path="/admin" element={<AdminDashboard />} />
        <Route path="/admin/dashboard" element={<AdminDashboard />} />
        
        <Route path="/managestudents" element={<ManageStudents />} />
        <Route path="/admin/students" element={<ManageStudents />} />
        
        <Route path="/manageinternships" element={<Manageinternships />} />
        <Route path="/admin/internships" element={<Manageinternships />} />
        
        <Route path="/managecompanies" element={<Managecompanies />} />
        <Route path="/admin/companies" element={<Managecompanies />} />
        
        <Route path="/manageapplications" element={<ManageApplications />} />
        <Route path="/admin/applications" element={<ManageApplications />} />
        
        <Route path="/report" element={<Report />} />
        <Route path="/admin/reports" element={<Report />} />

        {/* Fallback */}
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;