import { Link } from "react-router-dom";
import { useAuth } from "../../_context/AuthContext";
import { useState, useEffect } from "react";
import { Menu, X } from "lucide-react";

export const AdminNav = () => {
  const { logout } = useAuth();
  const [menuOpen, setMenuOpen] = useState(false);
  const toggleMenu = () => setMenuOpen(!menuOpen);

  // Close mobile menu on scroll with animation
  useEffect(() => {
    if (!menuOpen) return;
    let timeout: number | null = null;
    const handleScroll = () => {
      // Start closing animation, then hide after animation
      const menu = document.getElementById("admin-mobile-menu");
      if (menu) {
        menu.style.animation = "slide-up-admin 0.5s cubic-bezier(0.4,0,0.2,1)";
      }
      timeout = window.setTimeout(() => setMenuOpen(false), 500);
    };
    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => {
      window.removeEventListener("scroll", handleScroll);
      if (timeout) clearTimeout(timeout);
    };
  }, [menuOpen]);

  const handleLogout = (e: React.FormEvent) => {
    e.preventDefault();
    logout();
  };

  return (
    <div className="w-full fixed top-0 left-0 z-50 mt-3">
      <div className="max-w-7xl mx-auto px-2 sm:px-4">
        <div className="bg-blue-900 border-b border-blue-900/30 backdrop-blur-md w-full shadow-md rounded-[35px] px-2 sm:px-5">
          <div className="max-w-7xl mx-auto px-2 sm:px-4 py-3 sm:py-4 flex items-center justify-between">
            {/* Logo/Title (Left) */}
            <div className="flex-shrink-0">
              <Link to="/admindashboard" className="flex items-center">
                <h1 className="text-lg sm:text-xl font-bold text-white">
                  Admin Dashboard
                </h1>
              </Link>
            </div>
            {/* Center: Navigation Links */}
            <div className="hidden md:flex flex-1 justify-center">
              <div className="flex gap-4 sm:gap-6 text-white font-medium">
                <Link to="/admincheckin" className="hover:underline">
                 Daily Check-Ins
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
            <div className="hidden md:flex">
              <Link
                className="hover:text-red-500 text-red-500 hover:underline"
                onClick={handleLogout}
                to="/"
              >
                Logout
              </Link>
            </div>
            {/* Mobile Toggle Button */}
            <button
              className="md:hidden text-white focus:outline-none"
              onClick={toggleMenu}
            >
              {menuOpen ? <X size={24} /> : <Menu size={24} />}
            </button>
          </div>
          {/* Mobile Menu */}
          {menuOpen && (
            <div
              id="admin-mobile-menu"
              className="md:hidden bg-blue-900/90 px-2 sm:px-4 pb-4 space-y-3 text-white font-medium text-center rounded-b-[35px] transition-all duration-500 origin-top transform animate-none"
              style={{
                animation: "slide-down-admin 0.45s cubic-bezier(0.4,0,0.2,1)",
              }}
            >
              <Link
                to="/admincheckin"
                onClick={toggleMenu}
                className="block py-2 hover:underline"
              >
                Pending Check-Ins
              </Link>
              <Link
                to="/adminupload"
                onClick={toggleMenu}
                className="block py-2 hover:underline"
              >
                Assignments
              </Link>
              <Link
                to="/users"
                onClick={toggleMenu}
                className="block py-2 hover:underline"
              >
                Users
              </Link>
              <Link
                to="/"
                onClick={(e) => {
                  handleLogout(e);
                  toggleMenu();
                }}
                className="block py-2 hover:underline text-red-200"
              >
                Logout
              </Link>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};