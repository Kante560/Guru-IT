
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { Link } from "react-router-dom";
import { useAuth } from "../../Components/AuthContext";

export const AdminNav = () => {

const { logout } = useAuth();
  const handleLogout = (e: React.FormEvent) => {
      e.preventDefault();
      logout();
        // toast.success("Logged out successfully!")
   
   }
return (
  <div className="bg-gray-100 pt-20 font-inter">
    <nav className="fixed top-0 left-0 w-full bg-blue-900 text-white py-4 px-6 shadow-md z-50">
      <div className="flex justify-between items-center max-w-7xl mx-auto">
        {/* Left: Logo/Title */}
        <Link 
        to="/admindashboard"
        className="cursor-pointer "
        >
        <h1 className="text-xl font-bold">Admin Dashboard</h1>
        </Link>
        {/* Center: Navigation Links */}
        <div className="flex-1 flex justify-center">
          <div className="flex gap-6">
            <Link to="/admincheckin" className="hover:underline">
              Pending Check-Ins
            </Link>
            <Link to="/adminupload" className="hover:underline">
              Assignments
            </Link>
            <Link to="/users" className="hover:underline">
              Users
            </Link>
          </div>
        </div>
        {/* Right: Logout */}
        <div>
          <Link
            className="hover:text-black hover:underline"
            onClick={handleLogout}
            to="/"
          >
            Logout
          </Link>
        </div>
      </div>
    </nav>
  </div>
)}