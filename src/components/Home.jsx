import { useState } from "react";
import { motion } from "framer-motion";
import { UploadCloud, FileText, ArrowRight, XCircle, CheckCircle } from "lucide-react";
import axios from "axios";
import Cookies from "js-cookie";
import { toast } from 'react-hot-toast';
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer } from "recharts";

const Home = () => {
  const [selectedFile, setSelectedFile] = useState(null);
  const [dragActive, setDragActive] = useState(false);
  const [loading, setLoading] = useState(false); // Loading state
  const [result, setResult] = useState(null); // Store API response
  const [display, setDisplay] = useState(false);
  const [jobDescription,setJobDescription]=useState("");
  const [data, setData] = useState([]); // Define data state




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
      console.log("token")
      console.log(token) 
      if (!token) {
        toast.error("User not authenticated, Please log in", {duration:2000, position:"bottom-left"});
        // alert("User not authenticated. Please log in again.");
        return;
      }
      // console.log(token); // working
      // Create FormData to send file
      const formData = new FormData();
      formData.append("resume", selectedFile);
      formData.append("jobDescription",jobDescription);
      console.log(selectedFile); // working
      // Send to backend

      const response = await axios.post(`${import.meta.env.VITE_BACKEND_URL}/resume/analyze`, formData, {
        headers: {
          Authorization: `Bearer ${token}`, // Pass the token
          "Content-Type": "multipart/form-data",
        },
      });
      console.log(response.resume);
      
      // Set the received response
      setResult(response.data.resume);
      toast.success("Resume analysis successful!", { duration:2000, position:"bottom-left" });
      // alert("Resume analysis successful!");
    

       // ✅ Fix: Define data inside useState
       const sectionScores = response.data.sectionScores;
       const newData = Object.keys(sectionScores).map((key) => ({
         section: key.charAt(0).toUpperCase() + key.slice(1), // Capitalize first letter
         score: sectionScores[key],
       }));
       setData(newData); // ✅ Update state

      setDisplay(true);
    } catch (error) {
      console.error("Error analyzing resume:", error);
      alert("Failed to analyze resume.");
    } finally {
      setLoading(false);
    }
  };

  


  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-indigo-500 text-white px-4 mt-22">
      {/* Hero Section */}
      <motion.h1
        className="text-5xl font-bold text-center mb-4 mt-4"
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8 }}
      >
        AI-Powered ATS Checker
      </motion.h1>
      <p className="text-lg text-center max-w-xl mb-6">
        Upload your resume and let AI analyze its strengths and weaknesses, providing insights to enhance your career growth.
      </p>

      {/* Drag & Drop + Click Upload Box */}
      <motion.label
        htmlFor="resume-upload"
        className={`w-80 md:w-126 h-58 bg-white/10 border ${dragActive ? "border-white/40 bg-white/20" : "border-white/20"} rounded-2xl flex flex-col items-center justify-center cursor-pointer hover:bg-white/20 transition-all`}
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
            <p className="text-sm px-4 text-center">{dragActive ? "Drop the file here" : "Drag & drop or click to upload your resume (PDF, DOCX)"}</p>
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
{result?.analysis && display && (
  <div className="mt-6 bg-white text-gray-700 p-4 rounded-lg shadow mb-16">
    <h2 className="text-lg font-bold text-indigo-600">ATS Checker Report</h2>

    {/* Overall Score & ATS Compatibility */}
    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
      <div className="bg-gray-100 p-4 rounded-lg">
        <h3 className="text-md font-semibold">ATS Score</h3>
        <p className="text-lg font-bold">{result.analysis.score}/100</p>
      </div>
      <div className="bg-gray-100 p-4 rounded-lg">
        <h3 className="text-md font-semibold">ATS Compatibility</h3>
        <p className="text-lg font-bold flex items-center gap-2">
          {result.analysis.atsFriendly=="true" ? (
            <CheckCircle size={20} className="text-green-500" />
          ) : (
            <XCircle size={20} className="text-red-500" />
          )} 
          {result.analysis.atsFriendly=="true" ? "High" : "Low"}
        </p>
      </div>
    </div>

    {/* Readability Score */}
    <div className="bg-gray-100 p-4 rounded-lg mt-2">
    <h3 className="text-md font-semibold mt-4">Readability Score</h3>
    <p className="text-lg font-bold">{result.analysis.readabilityScore}/100</p>
    </div>

    {/* Grammar Issues */}
    <div className="bg-gray-100 p-4 rounded-lg mt-2">
    <h3 className="text-md font-semibold mt-4">Grammar Issues</h3>
    <p className="text-gray-700">{result.analysis.grammarIssues}</p></div>

    {/* Detailed Description */}
    <div className="bg-gray-100 p-4 rounded-lg mt-2">
    <h3 className="text-md font-semibold mt-4">Detailed Description</h3>
    <p className="text-gray-700 whitespace-pre-line">{result.analysis.detailedDescription}</p>
    </div>

    {/* Missing Keywords */}
    {/* <div className="bg-gray-100 p-4 rounded-lg mt-2">
    <h3 className="text-md font-semibold mt-4">Missing Keywords</h3>
    <div className="flex flex-wrap gap-2 mt-2">
      {result.analysis.missingKeywords?.length > 0 ? (
        result.analysis.missingKeywords.map((keyword, index) => (
          <span key={index} className="px-3 py-1 bg-red-100 text-red-600 border border-red-300 rounded-full text-sm">
            {keyword}
          </span>
        ))
      ) : (
        <span className="text-gray-500">No missing keywords found.</span>
      )}
    </div>
    </div> */}

    {/* Suggested Jobs */}
    {/* <div className="bg-gray-100 p-4 rounded-lg mt-2">
    <h3 className="text-md font-semibold mt-4">Suggested Jobs</h3>
    <ul className="mt-2 space-y-1">
      {result.analysis.suggestedJobs?.length > 0 ? (
        result.analysis.suggestedJobs.map((job, index) => (
          <li key={index} className="text-indigo-700 font-medium">• {job}</li>
        ))
      ) : (
        <li className="text-gray-500">No suggested jobs available.</li>
      )}
    </ul>
    </div> */}

    {/* Section-wise Scores (Bar Chart) */}
    <div>
            <h3 className="text-md font-semibold mt-4">Section-wise Scores:</h3>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={data} margin={{ top: 10, right: 30, left: 0, bottom: 5 }}>
                <XAxis dataKey="section" />
                <YAxis domain={[0, 10]} />
                <Tooltip />
                <Bar dataKey="score" fill="#6366F1" radius={[5, 5, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
  </div>
)}

    </div>
  );
};

export default Home;