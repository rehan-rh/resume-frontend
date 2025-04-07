import { useState, useEffect, useRef } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Menu, UserCircle, LogOut, Settings, LogIn, User } from "lucide-react";
import Cookies from "js-cookie"; // Import js-cookie to manage cookies

const Navbar = () => {
  const [menuOpen, setMenuOpen] = useState(false);
  const [profileOpen, setProfileOpen] = useState(false);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const navigate = useNavigate();
  const profileRef = useRef(null);

  // Function to check authentication based on cookies
  const checkAuth = () => {
    const token = Cookies.get("token"); // Retrieve token from cookies
    setIsAuthenticated(!!token);
    if (!token) {
      setProfileOpen(false); // Close profile dropdown if user is not authenticated
    }
  };

  useEffect(() => {
    checkAuth(); // Check auth on component mount

    // Listen for token changes in cookies
    const interval = setInterval(checkAuth, 1000); // Check every second (better than reloading)
    return () => clearInterval(interval); // Cleanup interval on unmount
  }, []);

  const handleLogout = () => {
    Cookies.remove("token"); // Remove authentication token
    setIsAuthenticated(false);
    setProfileOpen(false); // Close profile dropdown on logout
    navigate("/login"); // Redirect to login page
  };

  // Close profile dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (profileRef.current && !profileRef.current.contains(event.target)) {
        setProfileOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  return (
    <nav className="bg-[#03045E] shadow-md px-6 py-3 flex justify-between items-center text-white relative">
      {/* Left Side - Logo */}
      <Link to="/" className="text-xl font-bold text-white">
        Resume-Analyzer
      </Link>

      {/* Navigation Links (Hidden on Mobile) */}
      <div className="hidden md:flex gap-18">
        <Link to="/" className="hover:text-blue-400">Home</Link>
        <Link to="/analyse" className="hover:text-blue-400">ATS Checker</Link>
        <Link to="/jobMatcher" className="hover:text-blue-400">Job Matcher</Link> 
        {/* <Link to="/about" className="hover:text-blue-400">About</Link>
        <Link to="/contact" className="hover:text-blue-400">Contact</Link> */}
        <Link to="/stats" className="hover:text-blue-400">Stats</Link>
        <Link to="/test" className="hover:text-blue-400">Test</Link>
      </div>

      {/* Profile & Authentication Options */}
      <div className="flex items-center gap-4">
        {isAuthenticated ? (
          // If user is logged in, show Profile & Logout
          <div className="relative" ref={profileRef}>
            <button
              className="flex items-center space-x-2 text-gray-600 hover:text-blue-500"
              onClick={() => setProfileOpen(!profileOpen)}
            >
              <UserCircle className="w-8 h-8 text-white" />
            </button>

            {profileOpen && (
              <div className="absolute right-0 mt-2 w-48 bg-white shadow-lg rounded-md py-2 z-50">
                <Link to="/profile" className="block px-4 py-2 hover:bg-gray-100 text-blue-500 flex gap-2 items-center">
                  <User className="w-4 h-4"/>Profile</Link>
                <Link to="/settings" className="block px-4 py-2 hover:bg-gray-100 flex items-center gap-2 text-blue-500">
                  <Settings className="w-4 h-4" /> Settings
                </Link>
                <button
                  className="block w-full text-left px-4 py-2 hover:bg-gray-100 flex items-center gap-2 text-blue-500"
                  onClick={handleLogout}
                >
                  <LogOut className="w-4 h-4 text-blue-500" /> Logout
                </button>
              </div>
            )}
          </div>
        ) : (
          // If user is not logged in, show Login button
          <Link to="/login" className="flex items-center gap-2 bg-white text-[#03045E] px-4 py-2 rounded-lg font-semibold hover:bg-gray-200 transition">
            <LogIn className="w-5 h-5" /> Login
          </Link>
        )}

        {/* Mobile Menu Button */}
        <button className="md:hidden" onClick={() => setMenuOpen(!menuOpen)}>
          <Menu className="w-6 h-6 text-white" />
        </button>
      </div>

      {/* Mobile Navigation (Shown when menuOpen is true) */}
      {menuOpen && (
        <div className="absolute top-16 left-0 w-full bg-white shadow-md flex flex-col items-center py-4 md:hidden z-50">
          <Link to="/" className="py-2 text-[#03045E] hover:bg-gray-200 w-full text-center">Home</Link>
          <Link to="/analyse" className="py-2 text-[#03045E] hover:bg-gray-200 w-full text-center">Analyze</Link>
          <Link to="/about" className="py-2 text-[#03045E] hover:bg-gray-200 w-full text-center">About</Link>
          <Link to="/contact" className="py-2 text-[#03045E] hover:bg-gray-200 w-full text-center">Contact</Link>
          {isAuthenticated ? (
            <button className="py-2 text-[#03045E] hover:bg-gray-200 w-full text-center" onClick={handleLogout}>Logout</button>
          ) : (
            <Link to="/login" className="py-2 text-[#03045E] hover:bg-gray-200 w-full text-center">Login</Link>
          )}
        </div>
      )}
    </nav>
  );
};

export default Navbar;
