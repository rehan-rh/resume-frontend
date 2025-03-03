import { useState } from "react";
import { motion } from "framer-motion";
import { UploadCloud, FileText, ArrowRight } from "lucide-react";

const Home = () => {
  const [selectedFile, setSelectedFile] = useState(null);

  const handleFileChange = (event) => {
    const file = event.target.files[0];
    if (file) {
      setSelectedFile(file);
    }
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500 text-white px-4">
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

      {/* File Upload Box */}
      <motion.label
        htmlFor="resume-upload"
        className="w-80 md:w-96 h-48 bg-white/10 border border-white/20 rounded-2xl flex flex-col items-center justify-center cursor-pointer hover:bg-white/20 transition-all"
        whileHover={{ scale: 1.05 }}
      >
        {selectedFile ? (
          <div className="flex items-center gap-2 text-white">
            <FileText size={24} />
            <span className="text-sm">{selectedFile.name}</span>
          </div>
        ) : (
          <div className="flex flex-col items-center">
            <UploadCloud size={48} className="text-white mb-2" />
            <p className="text-sm">Drag & drop or click to upload your resume (PDF, DOCX)</p>
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
