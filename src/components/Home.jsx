import { useState } from "react";
import { motion } from "framer-motion";
import { UploadCloud, FileText, ArrowRight } from "lucide-react";

const Home = () => {
  const [selectedFile, setSelectedFile] = useState(null);
  const [dragActive, setDragActive] = useState(false);

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
        >
          Analyze Resume <ArrowRight size={20} />
        </motion.button>
      )}
    </div>
  );
};

export default Home;