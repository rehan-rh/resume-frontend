import { useState } from "react";
import { motion } from "framer-motion";
import { UploadCloud, FileText, ArrowRight, XCircle, CheckCircle, Award, Brain, MessageSquare, Settings } from "lucide-react";
import axios from "axios";
import Cookies from "js-cookie";
import { toast } from 'react-hot-toast';
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer } from "recharts";

const TestPage = () => {
  const [selectedFile, setSelectedFile] = useState(null);
  const [dragActive, setDragActive] = useState(false);
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState(null);
  const [display, setDisplay] = useState(false);
  const [jobDescription,setJobDescription]=useState("");
  const [data, setData] = useState([]);
  const [showQuestions,setShowQuestions]=useState(false);
  const [questions,setQuestions]=useState({});
  const [mcqAnswer, setMcqAnswer] = useState({});
  const [softSkillAnswer, setSoftSkillAnswer] = useState({});
  const [descriptiveAnswer, setDescriptiveAnswer] = useState({});
  const [evaluationResult,setEvaluationResult]=useState(false);
  const [submitting,setSubmitting]=useState(false);
  const [showSettings, setShowSettings] = useState(false);
  const [questionSettings, setQuestionSettings] = useState({
    mcq: 10,
    descriptive: 3,
    softSkills: 2
  });

  const handleFileChange = (event) => {
    const file = event.target.files[0];
    if (file) {
      setSelectedFile(file);
    }
  };

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
    
    const file = event.dataTransfer.files[0];
    if (file) {
      setSelectedFile(file);
    }
  };

  const handleInputChange = (type, index, value) => {
    if (type === "mcq") {
      setMcqAnswer({ ...mcqAnswer, [index]: value });
    } else if (type === "softskills") {
      setSoftSkillAnswer({ ...softSkillAnswer, [index]: value });
    }
    else{
      setDescriptiveAnswer({...descriptiveAnswer, [index]: value });
    }
  };

  const handleSettingsChange = (type, value) => {
    // Ensure value is positive and an integer
    const numValue = Math.max(1, parseInt(value) || 1);
    setQuestionSettings({ ...questionSettings, [type]: numValue });
  };
  
  const handleTakeTest = async () => {
    if (!selectedFile) {
      toast.error("Please select a resume first!", {duration:2000, position:"bottom-left"});
      return;
    }
    
    setLoading(true);
    setShowQuestions(false);
    try {
      const token = Cookies.get("token");
      console.log("token")
      console.log(token) 
      if (!token) {
        toast.error("User not authenticated, Please log in", {duration:2000, position:"bottom-left"});
        return;
      }
      
      const formData = new FormData();
      formData.append("resume", selectedFile);
      
      // Add question count preferences to the form data
      formData.append("mcqCount", questionSettings.mcq);
      formData.append("descriptiveCount", questionSettings.descriptive);
      formData.append("softSkillsCount", questionSettings.softSkills);
     
      console.log(selectedFile);
      console.log("making the request");

      const response = await axios.post(`${import.meta.env.VITE_BACKEND_URL}/resume/taketest`, formData, {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "multipart/form-data",
        },
      });
      console.log(response);
      
      setQuestions(response.data.questions);
      setShowQuestions(true);
      toast.success("Test created successfully!", { duration:2000, position:"bottom-left" });
    } catch (error) {
      console.error("Error analyzing resume:", error);
      alert("Failed to analyze resume.");
    } finally {
      setLoading(false);
    }
  };  

  const handleSubmitAnswers = async () => {
    const token = Cookies.get("token");
  
    if (!token) {
      toast.error("User not authenticated, Please log in", { duration: 2000, position: "bottom-left" });
      return;
    }

    setSubmitting(true);
  
    const formattedAnswers = {
      mcq: questions.mcq.map((q, index) => ({
        question: q.question,
        selectedAnswer: mcqAnswer[index] || "Not answered",
        correctAnswer: q.answer,
      })),
      descriptive: questions.descriptive.map((q, index) => ({
        question: q.question,
        answer: descriptiveAnswer[index] || "Not answered"
      })),
      softSkills: questions.softSkills.map((q, index) => ({
        question: q.question,
        answer: softSkillAnswer[index] || "Not answered"
      }))
    };
  
    console.log("Sending formatted answers to backend:", formattedAnswers);
  
    try {
      const response = await axios.post(`${import.meta.env.VITE_BACKEND_URL}/resume/submit-answers`, formattedAnswers, {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json"
        }
      });
  
      console.log("Evaluation result:", response.data);
      setResult(response.data);
      
      console.log(response.data);
      
      setShowQuestions(false);
      setEvaluationResult(true);
      setSubmitting(false);
      
      toast.success("Answers submitted and evaluated successfully!", { duration: 2000, position: "bottom-left" });
  
    } catch (error) {
      console.error("Error submitting answers:", error);
      toast.error("Failed to submit answers", { duration: 2000, position: "bottom-right" });
    }
  };

  const toggleSettings = () => {
    setShowSettings(!showSettings);
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gradient-to-b from-purple-600 to-purple-800 text-white px-4 py-10 mt-22">
      {/* Hero Section */}
      <motion.h1
        className="text-5xl font-bold text-center mb-4 mt-6"
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8 }}
      >
        AI-Powered Interview Prep
      </motion.h1>
      <p className="text-lg text-center max-w-xl mb-6">
        Upload your resume and let AI ask you some interview level questions based on your resume.
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
            <p className="text-sm px-4 text-center">
              {dragActive ? "Drop the file here" : "Drag & drop or click to upload your resume (PDF, DOCX)"}
            </p>
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
  
      {/* Toggle Settings Button */}
      {selectedFile && (
        <div className="mt-4 flex flex-col items-center">
          <button
            onClick={toggleSettings}
            className="bg-white/20 text-white px-4 py-2 rounded-lg flex items-center gap-2 hover:bg-white/30 transition-all"
          >
            <Settings size={18} /> {showSettings ? "Hide Settings" : "Customize Questions Count"}
          </button>
          
          {/* Settings Panel */}
          {showSettings && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: "auto" }}
              className="mt-4 bg-white/10 p-4 rounded-lg w-80"
            >
              <h3 className="font-semibold mb-3 text-center">Questions Count Settings</h3>
              <div className="grid grid-cols-1 gap-3">
                <div>
                  <label className="block text-sm mb-1">Multiple Choice (MCQ)</label>
                  <input
                    type="number"
                    min="1"
                    max="50"
                    value={questionSettings.mcq}
                    onChange={(e) => handleSettingsChange("mcq", e.target.value)}
                    className="w-full px-3 py-2 bg-white/20 rounded-md text-white"
                  />
                </div>
                <div>
                  <label className="block text-sm mb-1">Descriptive Questions</label>
                  <input
                    type="number"
                    min="1"
                    max="20"
                    value={questionSettings.descriptive}
                    onChange={(e) => handleSettingsChange("descriptive", e.target.value)}
                    className="w-full px-3 py-2 bg-white/20 rounded-md text-white"
                  />
                </div>
                <div>
                  <label className="block text-sm mb-1">Soft Skills Questions</label>
                  <input
                    type="number"
                    min="1"
                    max="20"
                    value={questionSettings.softSkills}
                    onChange={(e) => handleSettingsChange("softSkills", e.target.value)}
                    className="w-full px-3 py-2 bg-white/20 rounded-md text-white"
                  />
                </div>
              </div>
            </motion.div>
          )}
        </div>
      )}
  
      {/* Analyze Button */}
      {selectedFile && (
        <motion.button
          className="mt-6 bg-white text-purple-600 font-semibold px-6 py-3 rounded-lg flex items-center gap-2 hover:bg-indigo-100 transition-all shadow-lg"
          whileHover={{ scale: 1.1 }}
          onClick={handleTakeTest}
          disabled={loading}
        >
          {loading ? "Analyzing the resume..." : "Take Test"} <ArrowRight size={20} />
        </motion.button>
      )}

      {/* QUESTIONS SECTION - IMPROVED UI */}
      {showQuestions && questions && (
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="mt-10 bg-gradient-to-br from-purple-100 to-pink-50 text-purple-900 p-8 rounded-2xl max-w-4xl w-full mb-16 shadow-xl"
        >
          <h2 className="text-3xl font-bold mb-8 text-center text-purple-800 border-b-2 border-purple-300 pb-2">
            Interview Questions
          </h2>
          
          {/* MCQs Section */}
          <div className="mb-12 bg-white/80 rounded-xl p-6 shadow-md">
            <div className="flex items-center gap-3 mb-4">
              <Brain size={24} className="text-purple-700" />
              <h2 className="text-2xl font-bold text-purple-700">Technical MCQs</h2>
            </div>
            
            {questions.mcq.map((q, index) => (
              <div key={index} className="mb-6 bg-purple-50 p-4 rounded-lg">
                <p className="font-semibold text-purple-900">{index + 1}. {q.question}</p>
                <div className="flex flex-col mt-3 ml-2">
                  {q.options.map((option, i) => (
                    <label key={i} className="mb-2 flex items-center hover:bg-purple-100 p-2 rounded-md transition-all">
                      <input
                        type="radio"
                        name={`mcq-${index}`}
                        value={option}
                        checked={mcqAnswer[index] === option}
                        onChange={() => handleInputChange("mcq", index, option)}
                        className="mr-2 ml-2 accent-purple-700"
                      />
                      <span>{option}</span>
                    </label>
                  ))}
                </div>
              </div>
            ))}
          </div>

          {/* Descriptive Questions Section */}
          <div className="mb-12 bg-white/80 rounded-xl p-6 shadow-md">
            <div className="flex items-center gap-3 mb-4">
              <MessageSquare size={24} className="text-purple-700" />
              <h2 className="text-2xl font-bold text-purple-700">Descriptive Questions</h2>
            </div>
            
            {questions.descriptive.map((q, index) => (
              <div key={index} className="mb-6 bg-purple-50 p-4 rounded-lg">
                <p className="font-semibold text-purple-900">{index + 1}. {q.question}</p>
                <textarea
                  className="w-full mt-3 p-3 border border-purple-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-400"
                  rows="4"
                  placeholder="Type your answer here..."
                  value={descriptiveAnswer[index] || ""}
                  onChange={(e) => handleInputChange("descriptive", index, e.target.value)}
                />
              </div>
            ))}
          </div>

          {/* Soft Skills Section */}
          <div className="mb-8 bg-white/80 rounded-xl p-6 shadow-md">
            <div className="flex items-center gap-3 mb-4">
              <Award size={24} className="text-purple-700" />
              <h2 className="text-2xl font-bold text-purple-700">Soft Skills Questions</h2>
            </div>
            
            {questions.softSkills.map((q, index) => (
              <div key={index} className="mb-6 bg-purple-50 p-4 rounded-lg">
                <p className="font-semibold text-purple-900">{index + 1}. {q.question}</p>
                <textarea
                  className="w-full mt-3 p-3 border border-purple-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-400"
                  rows="4"
                  placeholder="Type your answer here..."
                  value={softSkillAnswer[index] || ""}
                  onChange={(e) => handleInputChange("softskills", index, e.target.value)}
                />
              </div>
            ))}
          </div>

          <div className="flex justify-center">
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={handleSubmitAnswers}
              className="bg-gradient-to-r from-purple-600 to-pink-500 text-white px-8 py-3 rounded-lg font-semibold hover:from-purple-700 hover:to-pink-600 shadow-lg flex items-center gap-2"
              disabled={submitting}
            >
              {submitting ? "Submitting..." : "Submit Answers"} <ArrowRight size={20} />
            </motion.button>
          </div>
        </motion.div>
      )}

      {/* EVALUATION RESULTS SECTION - IMPROVED UI */}
      {evaluationResult && (
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="mt-10 bg-gradient-to-br from-purple-100 to-pink-50 text-purple-900 p-8 rounded-2xl max-w-5xl w-full mb-16 shadow-xl"
        >
          <h2 className="text-3xl font-bold mb-8 text-center text-purple-800 border-b-2 border-purple-300 pb-2">
            Evaluation Results
          </h2>

          {/* MCQ Section */}
          <div className="mb-10 bg-white/80 rounded-xl p-6 shadow-md">
            <div className="flex items-center gap-3 mb-4 pb-2 border-b border-purple-200">
              <Brain size={24} className="text-purple-700" />
              <h3 className="text-xl font-bold text-purple-700">Technical MCQs</h3>
              <div className="ml-auto bg-purple-100 px-4 py-1 rounded-full font-semibold">
                Score: {result.sectionScores?.mcq?.score} / {result.sectionScores?.mcq?.total}
              </div>
            </div>
            
            {result.sectionScores?.mcq?.details?.map((item, index) => (
              <div key={index} className={`mb-6 p-4 rounded-lg ${item.selectedAnswer === item.correctAnswer ? "bg-green-50" : "bg-red-50"} border-l-4 ${item.selectedAnswer === item.correctAnswer ? "border-green-400" : "border-red-400"}`}>
                <p className="font-semibold">{index + 1}. {item.question}</p>
                <div className="mt-2 pl-4">
                  <div className="flex items-center">
                    {item.selectedAnswer === item.correctAnswer ? 
                      <CheckCircle size={16} className="text-green-500 mr-2" /> : 
                      <XCircle size={16} className="text-red-500 mr-2" />
                    }
                    <p className={`${item.selectedAnswer === item.correctAnswer ? "text-green-600" : "text-red-600"} font-medium`}>
                      Your Answer: {item.selectedAnswer}
                    </p>
                  </div>
                  
                  <div className="flex items-center mt-1">
                    <CheckCircle size={16} className="text-blue-500 mr-2" />
                    <p className="text-blue-600 font-medium">Correct Answer: {item.correctAnswer}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Descriptive Section */}
          <div className="mb-10 bg-white/80 rounded-xl p-6 shadow-md">
            <div className="flex items-center gap-3 mb-4 pb-2 border-b border-purple-200">
              <MessageSquare size={24} className="text-purple-700" />
              <h3 className="text-xl font-bold text-purple-700">Descriptive Questions</h3>
            </div>
            
            <div className="p-4 bg-purple-50 rounded-lg">
              <p className="italic text-purple-800">{result.sectionScores?.descriptive?.feedbackSummary}</p>
            </div>
          </div>

          {/* Soft Skills Section */}
          <div className="mb-10 bg-white/80 rounded-xl p-6 shadow-md">
            <div className="flex items-center gap-3 mb-4 pb-2 border-b border-purple-200">
              <Award size={24} className="text-purple-700" />
              <h3 className="text-xl font-bold text-purple-700">Soft Skills Assessment</h3>
            </div>
            
            <div className="p-4 bg-purple-50 rounded-lg mb-4">
              <p className="italic text-purple-800">{result.sectionScores?.softSkills?.feedbackSummary}</p>
            </div>
            
            {result.sectionScores?.softSkills?.strengths?.length > 0 && (
              <div className="mb-4 p-3 bg-green-50 rounded-lg border-l-4 border-green-400">
                <p className="font-bold text-green-700">Strengths:</p>
                <p className="text-green-800 mt-1">{result.sectionScores.softSkills.strengths.join("")}</p>
              </div>
            )}
            
            {result.sectionScores?.softSkills?.suggestions?.length > 0 && (
              <div className="mb-4 p-3 bg-blue-50 rounded-lg border-l-4 border-blue-400">
                <p className="font-bold text-blue-700">Suggestions:</p>
                <p className="text-blue-800 mt-1">{result.sectionScores.softSkills.suggestions.join("")}</p>
              </div>
            )}
            
            {result.sectionScores?.softSkills?.weaknesses?.length > 0 && (
              <div className="mb-4 p-3 bg-amber-50 rounded-lg border-l-4 border-amber-400">
                <p className="font-bold text-amber-700">Areas for Improvement:</p>
                <p className="text-amber-800 mt-1">{result.sectionScores.softSkills.weaknesses.join("")}</p>
              </div>
            )}
          </div>

          {/* Mentor Analysis */}
          <div className="bg-gradient-to-r from-purple-600/10 to-pink-500/10 rounded-xl p-6 shadow-lg border border-purple-200">
            <h3 className="font-bold text-center text-2xl text-purple-800 mb-4 pb-2 border-b border-purple-200">Mentor Analysis</h3>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="bg-white/80 p-4 rounded-lg shadow-sm">
                <p className="font-bold text-purple-700 mb-1">Confidence Level:</p>
                <div className="flex items-center">
                  <div className={`w-full h-3 rounded-full ${result.mentorAnalysis?.confidenceLevel === 'Low' ? 'bg-red-200' : result.mentorAnalysis?.confidenceLevel === 'Medium' ? 'bg-amber-200' : 'bg-green-200'}`}>
                    <div 
                      className={`h-3 rounded-full ${result.mentorAnalysis?.confidenceLevel === 'Low' ? 'bg-red-500 w-1/3' : result.mentorAnalysis?.confidenceLevel === 'Medium' ? 'bg-amber-500 w-2/3' : 'bg-green-500 w-full'}`}
                    ></div>
                  </div>
                  <span className="ml-3 font-semibold">{result.mentorAnalysis?.confidenceLevel}</span>
                </div>
              </div>
              
              <div className="bg-white/80 p-4 rounded-lg shadow-sm">
                <p className="font-bold text-purple-700 mb-1">Improvement Areas:</p>
                <ul className="list-disc pl-5">
                  {result.mentorAnalysis?.improvementAreas?.map((area, index) => (
                    <li key={index} className="text-purple-900 mb-1">{area}</li>
                  ))}
                </ul>
              </div>
              
              {result.mentorAnalysis?.strongAreas?.length > 0 && (
                <div className="bg-white/80 p-4 rounded-lg shadow-sm">
                  <p className="font-bold text-purple-700 mb-1">Strong Areas:</p>
                  <ul className="list-disc pl-5">
                    {result.mentorAnalysis.strongAreas.map((area, index) => (
                      <li key={index} className="text-purple-900 mb-1">{area}</li>
                    ))}
                  </ul>
                </div>
              )}
              
              <div className="bg-white/80 p-4 rounded-lg shadow-sm md:col-span-2">
                <p className="font-bold text-purple-700 mb-1">Mentor Advice:</p>
                <p className="text-purple-900 italic">{result.mentorAnalysis?.mentorAdvice}</p>
              </div>
            </div>
          </div>
          
          <div className="flex justify-center mt-8">
            <button 
              onClick={() => {
                setEvaluationResult(false);
                setShowQuestions(false);
                setSelectedFile(null);
              }}
              className="bg-gradient-to-r from-purple-600 to-pink-500 text-white px-6 py-2 rounded-lg font-semibold hover:from-purple-700 hover:to-pink-600 shadow-lg"
            >
              Take Another Test
            </button>
          </div>
        </motion.div>
      )}
    </div>
  );
}
  
export default TestPage;