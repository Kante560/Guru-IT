import { Link } from "react-router-dom";
import gurudevs from "../assets/gurudevs.png";
import { useAuth } from "../Components/AuthContext.tsx";
import { useState } from "react";
import { Menu, X } from "lucide-react";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

export const Nav = () => {
  const { isAuthenticated, logout } = useAuth();
  const [menuOpen, setMenuOpen] = useState(false);
  const toggleMenu = () => setMenuOpen(!menuOpen);

  const handleLogout = (e: React.FormEvent) => {
    e.preventDefault();
    logout();
    // toast.success("Logged out successfully!");
  };
  return (
    <div className="bg-white border-b-gray-200 font-inter border-b-[2px] w-full z-2 fixed top-0 left-0">
      <div className="max-w-7xl mx-auto px-4 py-4 flex justify-between items-center">
        {/* Logo */}
        <Link to="/" className="flex items-center">
          <img src={gurudevs} alt="Guru logo" />
        </Link>

        {/* Desktop Nav */}
        <div className="hidden md:flex space-x-6 items-center text-gray-600 font-medium">
          {isAuthenticated ? (
            <>
              <Link className="hover:text-black hover:underline" to="/">
                Home
              </Link>
              <Link
                className="hover:text-black hover:underline"
                to="/checkinout"
              >
                Check-In
              </Link>
              <Link
                className="hover:text-black hover:underline"
                onClick={handleLogout}
                to="/"
              >
                Logout
              </Link>
            </>
          ) : (
            <>
              <Link
                to="/signup"
                className="py-2 px-4 bg-red-600 text-white rounded-lg"
              >
                Sign-up
              </Link>
              <Link
                to="/login"
                className="py-2 px-4 bg-blue-900 text-white rounded-lg"
              >
                Sign-in
              </Link>
            </>
          )}
        </div>

        {/* Mobile Toggle Button */}
        <button
          className="md:hidden text-gray-700 focus:outline-none"
          onClick={toggleMenu}
        >
          {menuOpen ? <X size={24} /> : <Menu size={24} />}
        </button>
      </div>

      {/* Mobile Nav Menu */}
      {menuOpen && (
        <div className="md:hidden bg-white px-4 pb-4 space-y-3 text-gray-600 font-medium">
          {isAuthenticated ? (
            <>
              <Link to="/" onClick={toggleMenu} className="block">
                Home
              </Link>
              <Link to="/checkinout" onClick={toggleMenu} className="block">
                Check-In
              </Link>
            </>
          ) : (
            <>
              <Link
                to="/signup"
                onClick={toggleMenu}
                className="block py-2 px-4 bg-red-600 text-white rounded-lg"
              >
                Sign-up
              </Link>
              <Link
                to="/login"
                onClick={toggleMenu}
                className="block py-2 px-4 bg-blue-900 text-white rounded-lg"
              >
                Sign-in
              </Link>
            </>
          )}
        </div>
      )}
    </div>
  );
};
