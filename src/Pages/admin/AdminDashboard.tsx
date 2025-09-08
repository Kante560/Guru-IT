import { AdminNav } from "./AdminNav";
import { useAuth } from "../../Components/AuthContext";
import { useNavigate } from "react-router-dom";
import { useEffect } from "react";
import { Footer } from "../../Components/Footer";

const AdminDashboard = () => {
  const { isAuthenticated } = useAuth();
  const navigate = useNavigate();
    const { user } = useAuth();
    const userName = user ? user.name : "Admin";


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
      <div className="bg-admin-dashboard min-h-[150vh] flex flex-col">
        <div className="flex-1 flex flex-col font-inter">
          <AdminNav />
          <div className="flex-1 flex flex-col justify-center items-center" style={{ minHeight: "50vh" }}>
            <div className="w-full max-w-7xl mx-auto pt-8 sm:pt-18 px-2 sm:px-6 flex-1 flex flex-col mt-8 sm:mt-20 sm:mb-20 md:pt-0 md:pb-0">
              <div className="bg-white rounded-lg shadow-md p-4 sm:p-6">
                <h2 className="text-lg sm:text-2xl font-semibold mb-2 sm:mb-4 text-blue-900">
                  Welcome back, {userName} 👋
                </h2>
                <p className="text-gray-700 mb-2 sm:mb-4">
                  Use the navigation above to:
                </p>
                <ul className="list-disc list-inside space-y-1 sm:space-y-2 text-gray-600 ml-2 sm:ml-4">
                  <li>Monitor intern check-ins and attendance</li>
                  <li>Manage and create assignments</li>
                  <li>View and manage registered users</li>
                  <li>Track intern progress and submissions</li>
                </ul>
              </div>
            </div>
          </div>
        </div>
        <div style={{ minHeight: "50vh" }} />
        <Footer />
      </div>
    </>
  )

  
};

export default AdminDashboard;