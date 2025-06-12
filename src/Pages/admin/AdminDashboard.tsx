// src/pages/admin/AdminDashboard.tsx
import { AdminNav } from "./AdminNav";
import { useAuth } from "../../Components/AuthContext.tsx";
import { useNavigate } from "react-router-dom";
import { useEffect } from "react";

const AdminDashboard = () => {
  const { isAuthenticated, user } = useAuth();
  const navigate = useNavigate();

  // Redirect if not authenticated or not an admin
  useEffect(() => {
    if (!isAuthenticated || user?.account_type !== "admin") {
      navigate("/login"); // Adjust the path as needed
    }
  }, [isAuthenticated, user, navigate]);

  // Optional: Show nothing or a loading screen while checking auth
  if (!isAuthenticated || user?.account_type !== "admin") {
    return null; // Or a spinner / "Checking auth..." message
  }

  return (
    <div className="min-h-screen bg-gray-100 pt-20 font-inter">
      <AdminNav />
      <div className="max-w-7xl mx-auto p-6 mt-12">
        <h2 className="text-2xl font-semibold mb-4">Welcome, Admin 👋</h2>
        <p className="text-gray-700">
          Use the navigation above to manage check-ins, view assignments, and see all interns.
        </p>
      </div>
    </div>
  );
};

export default AdminDashboard;
