import { Routes, Route } from "react-router-dom";
import { Home } from "./Pages/UserDashboard";
import { CalendarPage } from "./Components/Calender";
import { Signup } from "./Pages/auth/Signup";
import { Login } from "./Pages/auth/Login";
import { CheckInOut } from "./Pages/CheckInOut";
import { AuthProvider } from "./_context/AuthContext";
import ProtectedRoute from "./Routes/ProtectedRoute";
import AdminDashboard from "./Pages/admin/AdminDashboard";
import AdminCheckIn from "./Pages/admin/AdminCheckIn";
import UsersPage from "./Pages/admin/UsersPage";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { AssignmentUpload } from "./Pages/admin/AdminAssignmentForm";
import { Forms } from "./Components/Forms";
import UserAssignment from "./Pages/UserAssignment";
import AdminAssignmentsList from "./Pages/admin/AdminAssignmentsList";

export const App = () => {
  return (
    <AuthProvider>
      <ToastContainer />
      <Routes>
        {/* ---------- Public Routes ---------- */}
        <Route path="/" element={<Home />} />
        <Route path="/signup" element={<Signup />} />
        <Route path="/login" element={<Login />} />

        {/* ---------- Intern-only Routes ---------- */}
        <Route
          path="/checkinout"
          element={
          <ProtectedRoute role="">
          <CheckInOut/>
          </ProtectedRoute> }       
        />
        <Route
          path="/calendar"
          element={
            <ProtectedRoute role="">
              <CalendarPage />
            </ProtectedRoute>
          }
        />
        <Route
          path="/forms"
          element={
            <ProtectedRoute role="">
              <Forms />
            </ProtectedRoute>
          }
        />
        <Route
          path="/assignment"
          element={
            <ProtectedRoute role="">
              <UserAssignment />
            </ProtectedRoute>
          }
        />

        {/* ---------- Admin-only Routes ---------- */}
        <Route
          path="/admindashboard"
          element={
            <ProtectedRoute role="admin">
              <AdminDashboard />
            </ProtectedRoute>
          }
        />
        <Route
          path="/admincheckin"
          element={
            <ProtectedRoute role="admin">
              <AdminCheckIn />
            </ProtectedRoute>
          }
        />
        <Route
          path="/users"
          element={
            <ProtectedRoute role="admin">
              <UsersPage />
            </ProtectedRoute>
          }
        />
        <Route
          path="/adminupload"
          element={
            <ProtectedRoute role="admin">
              <AssignmentUpload />
            </ProtectedRoute>
          }
        />
        <Route
          path="/adminassignments"
          element={
            <ProtectedRoute role="admin">
              <AdminAssignmentsList />
            </ProtectedRoute>
          }
        />
      </Routes>
    </AuthProvider>
  );
};
