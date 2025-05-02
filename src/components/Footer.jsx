import { Link } from "react-router-dom";
import { FaLinkedin, FaTwitter, FaGithub } from "react-icons/fa";

const Footer = () => {
  return (
    <footer className="bg-gray-900 text-white py-6 rounded-t-2xl -mt-4">
      <div className="container mx-auto px-6 flex flex-col md:flex-row justify-between items-center">
        
        {/* Left Side - Branding & Copyright */}
        <div className="text-center md:text-left">
          <h2 className="text-lg font-bold">Resume-Hub</h2>
          <p className="text-gray-400 text-sm">© {new Date().getFullYear()} All rights reserved.</p>
        </div>

        {/* Center - Navigation Links */}
        <div className="flex flex-wrap justify-center md:justify-start gap-4 mt-4 md:mt-0">
          <Link to="/home" className="text-gray-400 hover:text-white text-md">Home</Link>
          <Link to="/analyse" className="text-gray-400 hover:text-white text-md">ATS-Checker</Link>
        <Link to="/jobMatcher" className="text-gray-400 hover:text-white text-md">Job-Matcher</Link> 
        <Link to="/test" className="text-gray-400 hover:text-white text-md">Interview-Prep</Link>
        <Link to="/stats" className="text-gray-400 hover:text-white text-md">Stats</Link>
        </div>

        {/* Right Side - Social Media Icons */}
        <div className="flex gap-4 mt-4 md:mt-0">
          <a href="https://linkedin.com" target="_blank" rel="noopener noreferrer" className="text-gray-400 hover:text-white">
            <FaLinkedin size={20} />
          </a>
          <a href="https://twitter.com" target="_blank" rel="noopener noreferrer" className="text-gray-400 hover:text-white">
            <FaTwitter size={20} />
          </a>
          <a href="https://github.com" target="_blank" rel="noopener noreferrer" className="text-gray-400 hover:text-white">
            <FaGithub size={20} />
          </a>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
