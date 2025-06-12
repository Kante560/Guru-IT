import { AdminNav } from "./AdminNav";
import { useAuth } from "../../Components/AuthContext";
import { useNavigate } from "react-router-dom";
import { useEffect } from "react";
import { Footer } from "../../Components/Footer";

const AdminDashboard = () => {
  const { isAuthenticated } = useAuth();
  const navigate = useNavigate();

  // Only check for authentication
  useEffect(() => {
    if (!isAuthenticated) {
      navigate("/login");
    }
  }, [isAuthenticated, navigate]);

  // Show loading state while checking authentication
  if (!isAuthenticated) {
    return (
      <div className="flex items-center justify-center bg-red-900">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-900"></div>
      </div>
    );
  }

  return (
    <>
    <div className=" bg-gray-100 min-h-[100vh]  justify-center items-center font-inter">
      <AdminNav />
      <div className="max-w-7xl  mx-auto p-6">
        <div className="bg-white rounded-lg shadow-md p-6">
          <h2 className="text-2xl font-semibold mb-4 text-blue-900">Welcome, Admin 👋</h2>
          <p className="text-gray-700 mb-4">
            Use the navigation above to:
          </p>
          <ul className="list-disc list-inside space-y-2 text-gray-600 ml-4">
            <li>Monitor intern check-ins and attendance</li>
            <li>Manage and create assignments</li>
            <li>View and manage registered users</li>
            <li>Track intern progress and submissions</li>
          </ul>
        </div>
      </div>
    </div>

    <Footer/>
    </>
  );
};

export default AdminDashboard;