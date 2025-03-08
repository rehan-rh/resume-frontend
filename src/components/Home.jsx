import { useState } from "react";
import { motion } from "framer-motion";
import { UploadCloud, FileText, ArrowRight } from "lucide-react";
import axios from "axios";
import Cookies from "js-cookie";

const Home = () => {
  const [selectedFile, setSelectedFile] = useState(null);
  const [dragActive, setDragActive] = useState(false);
  const [loading, setLoading] = useState(false); // Loading state
  const [result, setResult] = useState(null); // Store API response
  const [display, setDisplay] = useState(false);

  const handleFileChange = (event) => {
    const file = event.target.files[0];
    if (file) {
      setSelectedFile(file);
    }
  };

  // Drag and drop handlers
  const handleDragOver = (event) => {
    event.preventDefault();
    setDragActive(true);
  };

  const handleDragEnter = (event) => {
    event.preventDefault();
    setDragActive(true);
  };

  const handleDragLeave = () => {
    setDragActive(false);
  };

  const handleDrop = (event) => {
    event.preventDefault();
    setDragActive(false);
    
    const file = event.dataTransfer.files[0]; // Get the dropped file
    if (file) {
      setSelectedFile(file);
    }
  };

  // 🚀 API Call to Send Resume
  const handleAnalyzeResume = async () => {
    if (!selectedFile) {
      alert("Please select a resume first!");
      return;
    }

    setLoading(true);
    setDisplay(false);
    try {
      // Retrieve the JWT token from cookies
      const token = Cookies.get("token"); // Make sure you set this at login
      if (!token) {
        alert("User not authenticated. Please log in again.");
        return;
      }
      // console.log(token); // working
      // Create FormData to send file
      const formData = new FormData();
      formData.append("resume", selectedFile);
      // console.log(selectedFile); // working
      // Send to backend
      const response = await axios.post("http://localhost:7777/resume/analyze", formData, {
        headers: {
          Authorization: `Bearer ${token}`, // Pass the token
          "Content-Type": "multipart/form-data",
        },
      });
      console.log(response.data);
      // Set the received response
      setResult(response.data);
      alert("Resume analysis successful!");
      setDisplay(true);
    } catch (error) {
      console.error("Error analyzing resume:", error);
      alert("Failed to analyze resume.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-indigo-500 text-white px-4">
      {/* Hero Section */}
      <motion.h1
        className="text-5xl font-bold text-center mb-4"
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8 }}
      >
        AI-Powered Resume Analyzer
      </motion.h1>
      <p className="text-lg text-center max-w-xl mb-6">
        Upload your resume and let AI analyze its strengths and weaknesses, providing insights to enhance your career growth.
      </p>

      {/* Drag & Drop + Click Upload Box */}
      <motion.label
        htmlFor="resume-upload"
        className={`w-80 md:w-126 h-68 bg-white/10 border ${dragActive ? "border-white/40 bg-white/20" : "border-white/20"} rounded-2xl flex flex-col items-center justify-center cursor-pointer hover:bg-white/20 transition-all`}
        whileHover={{ scale: 1.05 }}
        onDragOver={handleDragOver}
        onDragEnter={handleDragEnter}
        onDragLeave={handleDragLeave}
        onDrop={handleDrop}
      >
        {selectedFile ? (
          <div className="flex items-center gap-2 text-white">
            <FileText size={24} />
            <span className="text-sm">{selectedFile.name}</span>
          </div>
        ) : (
          <div className="flex flex-col items-center">
            <UploadCloud size={78} className="text-white mb-2" />
            <p className="text-sm">{dragActive ? "Drop the file here" : "Drag & drop or click to upload your resume (PDF, DOCX)"}</p>
          </div>
        )}
      </motion.label>
      <input
        type="file"
        id="resume-upload"
        className="hidden"
        accept=".pdf,.doc,.docx"
        onChange={handleFileChange}
      />

      {/* Analyze Button */}
      {selectedFile && (
        <motion.button
          className="mt-6 bg-white text-indigo-600 font-semibold px-6 py-3 rounded-lg flex items-center gap-2 hover:bg-indigo-100 transition-all"
          whileHover={{ scale: 1.1 }}
          onClick={handleAnalyzeResume} // 🔥 Call API
          disabled={loading}
        >
          {loading ? "Analyzing..." : "Analyze Resume"} <ArrowRight size={20} />
        </motion.button>
      )}

      {/* Display Result */}
      {result && display && (
        <div className="mt-6 bg-white text-gray-700 p-4 rounded-lg shadow">
          <h2 className="text-lg font-bold text-indigo-600">Resume Analysis Report</h2>

          <p><strong>Overall Resume Strength:</strong> {result.score}/100</p>

          <p><strong>ATS Compatibility:</strong> {result.atsFriendly ? "✅ High" : "❌ Low"}</p>

          <h3 className="text-md font-semibold mt-4">Detailed Analysis:</h3>
          <p className="whitespace-pre-line mt-2">{result.analysis}</p>
        </div>
      )}
    </div>
  );
};

export default Home;