import { useState } from "react";
import { Link } from "react-router-dom";
import { Menu, UserCircle, LogOut, Settings } from "lucide-react";

const Navbar = () => {
  const [menuOpen, setMenuOpen] = useState(false);
  const [profileOpen, setProfileOpen] = useState(false);

  return (
    <nav className="bg-white shadow-md px-6 py-3 flex justify-between items-center">
      {/* Left Side - Logo */}
      <Link to="/" className="text-xl font-bold text-blue-600">
        Resume Analyzer
      </Link>

      {/* Navigation Links (Hidden on Mobile) */}
      <div className="hidden md:flex gap-6">
        <Link to="/home" className="hover:text-blue-500">Home</Link>
        <Link to="/analyze" className="hover:text-blue-500">Analyze</Link>
        <Link to="/about" className="hover:text-blue-500">About</Link>
        <Link to="/contact" className="hover:text-blue-500">Contact</Link>
      </div>

      {/* Profile & Mobile Menu */}
      <div className="flex items-center gap-4">
        {/* Profile Dropdown */}
        <div className="relative">
          <button
            className="flex items-center space-x-2 text-gray-600 hover:text-blue-500"
            onClick={() => setProfileOpen(!profileOpen)}
          >
            <UserCircle className="w-8 h-8" />
          </button>

          {profileOpen && (
            <div className="absolute right-0 mt-2 w-48 bg-white shadow-lg rounded-md py-2">
              <Link to="/profile" className="block px-4 py-2 hover:bg-gray-100">Profile</Link>
              <Link to="/settings" className="block px-4 py-2 hover:bg-gray-100 flex items-center gap-2">
                <Settings className="w-4 h-4" /> Settings
              </Link>
              <button className="block w-full text-left px-4 py-2 hover:bg-gray-100 flex items-center gap-2">
                <LogOut className="w-4 h-4" /> Logout
              </button>
            </div>
          )}
        </div>

        {/* Mobile Menu Button */}
        <button className="md:hidden" onClick={() => setMenuOpen(!menuOpen)}>
          <Menu className="w-6 h-6 text-gray-600" />
        </button>
      </div>

      {/* Mobile Navigation (Shown when menuOpen is true) */}
      {menuOpen && (
        <div className="absolute top-16 left-0 w-full bg-white shadow-md flex flex-col items-center py-4 md:hidden">
          <Link to="/home" className="py-2 hover:text-blue-500">Home</Link>
          <Link to="/analyze" className="py-2 hover:text-blue-500">Analyze</Link>
          <Link to="/about" className="py-2 hover:text-blue-500">About</Link>
          <Link to="/contact" className="py-2 hover:text-blue-500">Contact</Link>
        </div>
      )}
    </nav>
  );
};

export default Navbar;
