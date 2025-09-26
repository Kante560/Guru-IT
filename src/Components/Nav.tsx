import { Link } from "react-router-dom";
import { useAuth } from "../_context/AuthContext.tsx";
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
    <>
      <div className="w-full fixed top-0 left-0 right-0 z-50 mt-6 md:mt-8 ">
        <div className="max-w-7xl mx-auto px-3 sm:px-4 md:px-6">
          <div className="bg-white/10 backdrop-blur-md ring-1 ring-white/20 w-full shadow-lg font-inter rounded-[28px] sm:rounded-[35px] md:rounded-[40px] px-3 sm:px-5 md:px-6">
            <div className="max-w-7xl mx-auto px-1 sm:px-4 md:px-6 py-2.5 sm:py-4 md:py-5 flex items-center justify-between">
            {/* Logo (Left) */}
            <div className="flex-shrink-0 min-w-[40px]">
              <Link to="/" className="flex items-center">
                <img
                  src="/gurudevs.png"
                  alt="Guru logo"
                  className="h-8 w-auto sm:h-10 md:h-11"
                />
              </Link>
            </div>

            {/* Center Links */}
            <div className="hidden md:flex flex-1 justify-center space-x-6 md:space-x-8 text-gray-600 font-medium">
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
                  <Link
                   className="hover:text-black hover:underline"
                    to="/assignment"
                  >
                  Assignments
                  </Link>
                </>
              )}
            </div>

            {/* Right (Logout or Auth Buttons) */}
            <div className="hidden md:flex items-center space-x-3 md:space-x-5">
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
              className="md:hidden text-gray-700 focus:outline-none p-2.5 rounded-lg focus-visible:ring-2 focus-visible:ring-blue-500 active:scale-95 transition"
              onClick={toggleMenu}
              aria-label="Toggle menu"
              aria-controls="mobile-menu"
              aria-expanded={menuOpen}
            >
              {menuOpen ? <X size={28} /> : <Menu size={28} />}
            </button>
          </div>

            {/* Mobile Menu */}
            {menuOpen && (
              <div
                id="user-mobile-menu"
                className="md:hidden bg-white/10 backdrop-blur-md ring-1 ring-white/20 px-3 sm:px-4 pb-4 pt-2 space-y-2 text-gray-700 font-medium text-center rounded-b-[28px] transition-all duration-500 origin-top animate-none"
                style={{
                  animation: "slide-down-admin 0.45s cubic-bezier(0.4,0,0.2,1)",
                }}
              >
                {isAuthenticated ? (
                  <>
                    <Link to="/" onClick={toggleMenu} className="block py-3 rounded-lg hover:bg-white/10">
                      Home
                    </Link>
                    <Link to="/checkinout" onClick={toggleMenu} className="block py-3 rounded-lg hover:bg-white/10">
                      Check-In
                    </Link>
                    <Link
                   className="hover:text-black hover:underline"
                    to="/assignment"
                  >
                  Assignments
                  </Link> 
                    <Link
                      to="/"
                      onClick={(e) => {
                        handleLogout(e);
                        toggleMenu();
                      }}
                      className="block py-3 rounded-lg text-red-600 hover:bg-white/10"
                    >
                      Logout
                    </Link>
                  </>
                ) : (
                  <>
                    <Link
                      to="/signup"
                      onClick={toggleMenu}
                      className="block py-3 px-4 bg-[#131A29] text-white rounded-lg ring-1 ring-white/20 hover:bg-white/10 active:scale-[.99]"
                    >
                      Sign-up
                    </Link>
                    <Link
                      to="/login"
                      onClick={toggleMenu}
                      className="block py-3 px-4 bg-[#131A29] text-white rounded-lg ring-1 ring-white/20 hover:bg-white/10 active:scale-[.99]"
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
      {/* No spacer: allow background to flow behind navbar for a floating effect */}
    </>
  );
};
