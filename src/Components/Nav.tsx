import { Link } from "react-router-dom";
import gurudevs from "../assets/gurudevs.png";
import { useAuth } from "./AuthContext.tsx";
import { useState } from "react";
import { Menu, X } from "lucide-react";

export const Nav = () => {
  const { isAuthenticated, logout } = useAuth();
  const [menuOpen, setMenuOpen] = useState(false);
  const toggleMenu = () => setMenuOpen(!menuOpen);

  const handleLogout = (e: React.FormEvent) => {
    e.preventDefault();
    logout();
  };

  return (
    <div className="w-full fixed top-0 left-0 z-50 mt-3">
      <div className="max-w-7xl mx-auto px-2 sm:px-4">
        <div className="bg-white/20 border-b border-white/30 backdrop-blur-md w-full shadow-md font-inter rounded-[35px] px-2 sm:px-5">
          <div className="max-w-7xl mx-auto px-2 sm:px-4 py-3 sm:py-4 flex items-center justify-between">
            {/* Logo (Left) */}
            <div className="flex-shrink-0 min-w-[40px]">
              <Link to="/" className="flex items-center">
                <img
                  src={gurudevs}
                  alt="Guru logo"
                  className="h-8 w-auto sm:h-10"
                />
              </Link>
            </div>

            {/* Center Links */}
            <div className="hidden md:flex flex-1 justify-center space-x-4 sm:space-x-6 text-gray-600 font-medium">
              {isAuthenticated && (
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
                </>
              )}
            </div>

            {/* Right (Logout or Auth Buttons) */}
            <div className="hidden md:flex items-center space-x-2 sm:space-x-4">
              {isAuthenticated ? (
                <Link
                  className=" hover:underline text-red-600"
                  onClick={handleLogout}
                  to="/"
                >
                  Logout
                </Link>
              ) : (
                <>
                  <Link
                    to="/signup"
                    className="py-2 px-3 sm:px-4 bg-red-600 text-white rounded-lg"
                  >
                    Sign-up
                  </Link>
                  <Link
                    to="/login"
                    className="py-2 px-3 sm:px-4 bg-[#131A29] text-white rounded-lg"
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

          {/* Mobile Menu */}
          {menuOpen && (
            <div className="md:hidden bg-white px-2 sm:px-4 pb-4 space-y-3 text-gray-600 font-medium text-center rounded-b-[35px]">
              {isAuthenticated ? (
                <>
                  <Link to="/" onClick={toggleMenu} className="block">
                    Home
                  </Link>
                  <Link to="/checkinout" onClick={toggleMenu} className="block">
                    Check-In
                  </Link>
                  <Link
                    to="/"
                    onClick={(e) => {
                      handleLogout(e);
                      toggleMenu();
                    }}
                    className="block"
                  >
                    Logout
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
                    className="block py-2 px-4 bg-[#131A29] text-white rounded-lg"
                  >
                    Sign-in
                  </Link>
                </>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
