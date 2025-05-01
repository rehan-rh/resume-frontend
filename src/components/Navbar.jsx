import { useState, useEffect, useRef } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { Menu, UserCircle, LogOut, Settings, LogIn, User } from "lucide-react";
import Cookies from "js-cookie"; // Import js-cookie to manage cookies
import toast from "react-hot-toast";

const Navbar = () => {
  const [menuOpen, setMenuOpen] = useState(false);
  const [profileOpen, setProfileOpen] = useState(false);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const navigate = useNavigate();
  const profileRef = useRef(null);
  const location = useLocation();

  // Function to check if the link is active
  const isActive = (path) => {
    return location.pathname === path;
  };

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
    toast.success("Logged out successfully!", {position:"bottom-left", duration:2000});
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
    <nav className="fixed bg-gradient-to-b flex from-black/20 to-transparent backdrop-blur-md w-full px-6 py-6 md:py-4 flex justify-between items-center">
    {/* <nav className="fixed top-0 left-0 w-full bg-gradient-to-b flex from-black/20 to-transparent backdrop-blur-md px-6 py-4 z-50"> */}
      {/* Left Side - Logo */}
      <Link to="/" className="font-bold text-[#03045E] text-2xl">
        Resume-Hub
      </Link>

      {/* Navigation Links (Hidden on Mobile) */}
      <div className="hidden md:flex gap-16 justify-between px-20 rounded-[40px] py-4 w-[900px] text-[19px] font-medium shadow-lg">
        <Link to="/"
          className={`${isActive("/") ? "text-[#2B2B2B]" : "text-[#03045E]" } hover:text-[#2B2B2B] font-medium`}>
            Home
        </Link>
        <Link to="/analyse"
          className={`${isActive("/analyse") ? "text-[#2B2B2B]" : "text-[#03045E]" } hover:text-[#2B2B2B] font-medium`}>
            ATS-Checker
        </Link>
        <Link to="/jobMatcher"
          className={`${isActive("/jobMatcher") ? "text-[#2B2B2B]" : "text-[#03045E]" } hover:text-[#2B2B2B] font-medium`}>
          Job-Matcher
        </Link> 
        <Link to="/test"
          className={`${isActive("/test") ? "text-[#2B2B2B]" : "text-[#03045E]" } hover:text-[#2B2B2B] font-medium`}>
            Interview-Prep
        </Link>
        <Link to="/stats"
          className={`${isActive("/stats") ? "text-[#2B2B2B]" : "text-[#03045E]" } hover:text-[#2B2B2B] font-medium`}>
            Stats
        </Link>
      </div>

      <div className="flex gap-4">
      {/* Mobile Menu Button */}
      <button className="md:hidden" onClick={() => setMenuOpen(!menuOpen)}>
          {isAuthenticated && (
            <Menu className="w-8 h-8" />
          )}
      </button>

      {/* Profile & Authentication Options */}
      <div className="flex items-center gap-4">
        {isAuthenticated ? (
          // If user is logged in, show Profile & Logout
          <div className="relative" ref={profileRef}>
            <button
              className="flex items-center space-x-2 text-gray-600 hover:text-blue-500"
              onClick={() => setProfileOpen(!profileOpen)}
            >
              <UserCircle className= {`${isActive("/profile") ? "text-[#2B2B2B]" : "text-[#03045E]" } w-8 h-8 cursor-pointer`} />
            </button>

            {profileOpen && (
              <div className="absolute right-0 mt-2 w-48 bg-white shadow-lg rounded-md py-2 z-50">
                <Link to="/profile" className="block px-4 py-2 hover:bg-gray-100 text-blue-500 flex gap-2 items-center font-medium">
                  <User className="w-4 h-4"/>Profile</Link>
                {/* <Link to="/settings" className="block px-4 py-2 hover:bg-gray-100 flex items-center gap-2 text-blue-500">
                  <Settings className="w-4 h-4" /> Settings
                </Link> */}
                <button
                  className="block w-full text-left px-4 py-2 hover:bg-gray-100 flex items-center gap-2 text-blue-500 font-medium"
                  onClick={handleLogout}
                >
                  <LogOut className="w-4 h-4 text-blue-500" /> Logout
                </button>
              </div>
            )}
          </div>
        ) : (
          // If user is not logged in, show Login button
          <Link to="/login" className="text-xl flex items-center gap-2 bg-transparent text-[#03045E] px-4 py-2 rounded-lg font-semibold hover:bg-gray-200 transition">
            <LogIn className="w-5 h-5" /> Login
          </Link>
        )}

      </div>

      </div>

      {/* Mobile Navigation (Shown when menuOpen is true) */}
      {menuOpen && (
        <div className="absolute top-16 left-0 w-full bg-white shadow-md flex flex-col items-center py-4 md:hidden z-50">
          <Link to="/" className="py-2 text-[#03045E] hover:bg-gray-200 w-full text-center">Home</Link>
          <Link to="/analyse" className="py-2 text-[#03045E] hover:bg-gray-200 w-full text-center">ATS-Checker</Link>
          <Link to="/jobMatcher" className="py-2 text-[#03045E] hover:bg-gray-200 w-full text-center">Job-Matcher</Link> 
          <Link to="/test" className="py-2 text-[#03045E] hover:bg-gray-200 w-full text-center">Interview-Prep</Link>
          <Link to="/stats" className="py-2 text-[#03045E] hover:bg-gray-200 w-full text-center">Stats</Link>
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
