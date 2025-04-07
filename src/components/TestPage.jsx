import { useState } from "react";
import { motion } from "framer-motion";
import { UploadCloud, FileText, ArrowRight, XCircle, CheckCircle } from "lucide-react";
import axios from "axios";
import Cookies from "js-cookie";
import { toast } from 'react-hot-toast';
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer } from "recharts";

const TestPage = () => {
  const [selectedFile, setSelectedFile] = useState(null);
  const [dragActive, setDragActive] = useState(false);
  const [loading, setLoading] = useState(false); // Loading state
  const [result, setResult] = useState(null); // Store API response
  const [display, setDisplay] = useState(false);
  const [jobDescription,setJobDescription]=useState("");
  const [data, setData] = useState([]); // Define data state
  const [showQuestions,setShowQuestions]=useState(false);
  const [questions,setQuestions]=useState({});
  const [mcqAnswer, setMcqAnswer] = useState({});
  const [softSkillAnswer, setSoftSkillAnswer] = useState({});
  const [descriptiveAnswer, setDescriptiveAnswer] = useState({});
  const [evaluationResult,setEvaluationResult]=useState(false);
  const [submitting,setSubmitting]=useState(false);



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

  
  // 🚀 API Call to Send Resume
  const handleTakeTest = async () => {
    if (!selectedFile) {
      toast.error("Please select a resume first!", {duration:2000, position:"bottom-right"});
      return;
    }
    
    setLoading(true);
    setShowQuestions(false);
    try {
      // Retrieve the JWT token from cookies
      const token = Cookies.get("token"); // Make sure you set this at login
      console.log("token")
      console.log(token) 
      if (!token) {
        toast.error("User not authenticated, Please log in", {duration:2000, position:"bottom-right"});
        return;
      }
      // console.log(token); // working
      // Create FormData to send file
      const formData = new FormData();
      formData.append("resume", selectedFile);
     
      console.log(selectedFile); // working
      // Send to backend


      console.log("making the request");

      const response = await axios.post("http://localhost:7777/resume/taketest", formData, {
        headers: {
          Authorization: `Bearer ${token}`, // Pass the token
          "Content-Type": "multipart/form-data",
        },
      });
      console.log(response);
      
    //   console.log(response.data);

      // Set the received response
      setQuestions(response.data.questions);
      setShowQuestions(true);
      toast.success("Test created  successfully!", { duration:2000, position:"bottom-right" });

    //   setDisplay(true);
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
      toast.error("User not authenticated, Please log in", { duration: 2000, position: "bottom-right" });
      return;
    }

    setSubmitting(true);
  
    const formattedAnswers = {
      mcq: questions.mcq.map((q, index) => ({
        question: q.question,
        selectedAnswer: mcqAnswer[index] || "Not answered",
        correctAnswer: q.answer, // assuming it's available in backend response

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
      const response = await axios.post("http://localhost:7777/resume/submit-answers", formattedAnswers, {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json"
        }
      });
  
      console.log("Evaluation result:", response.data);
      setResult(response.data); // store score/result
      
      console.log(response.data);
      
      setShowQuestions(false);

      setEvaluationResult(true);
  
      setSubmitting(false);
      
      toast.success("Answers submitted and evaluated successfully!", { duration: 2000, position: "bottom-right" });
  
    } catch (error) {
      console.error("Error submitting answers:", error);
      toast.error("Failed to submit answers", { duration: 2000, position: "bottom-right" });
    }
  };
  


  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-purple-500 text-white px-4">
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
            <p className="text-sm">
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
  
  
  
      {/* Analyze Button */}
      {selectedFile && (
        <motion.button
          className="mt-6 bg-white text-indigo-600 font-semibold px-6 py-3 rounded-lg flex items-center gap-2 hover:bg-indigo-100 transition-all"
          whileHover={{ scale: 1.1 }}
          onClick={handleTakeTest}
          disabled={loading}
        >
          {loading ? "Analyzing the resume..." : "Take Test"} <ArrowRight size={20} />
        </motion.button>
      )}


{showQuestions && questions && (
  <div className="mt-10 bg-white text-black p-6 rounded-xl max-w-4xl w-full mb-16">
    {/* MCQs Section */}
    <h2 className="text-2xl font-bold mb-4 text-purple-600 shadow-lg text-center">MCQ Questions</h2>
    {questions.mcq.map((q, index) => (
      <div key={index} className="mb-6">
        <p className="font-semibold">{index + 1}. {q.question}</p>
        <div className="flex flex-col mt-2">
          {q.options.map((option, i) => (
            <label key={i} className="mb-1">
              <input
                type="radio"
                name={`mcq-${index}`}
                value={option}
                checked={mcqAnswer[index] === option}
                onChange={() => handleInputChange("mcq", index, option)}
                className="mr-2 ml-4"
              />
              {option}
            </label>
          ))}
        </div>
      </div>
    ))}

     {/* Descriptive Questions Section */}
     <h2 className="mt-8 text-2xl font-bold mb-4 text-purple-600 shadow-lg text-center">Descriptive Questions</h2>
    {questions.descriptive.map((q, index) => (
      <div key={index} className="mb-6">
        <p className="font-semibold">{index + 1}. {q.question}</p>
        <textarea
          className="w-full mt-2 p-2 border border-gray-300 rounded-md"
          rows="4"
          value={descriptiveAnswer[index] || ""}
          onChange={(e) => handleInputChange("descriptive", index, e.target.value)}
        />
      </div>
    ))}

    {/* Soft Skills Section */}
    <h2 className="mt-8 text-2xl font-bold mb-4 text-purple-600 shadow-lg text-center">Soft Skills Questions</h2>
    {questions.softSkills.map((q, index) => (
      <div key={index} className="mb-6">
        <p className="font-semibold">{index + 1}. {q.question}</p>
        <textarea
          className="w-full mt-2 p-2 border border-gray-300 rounded-md"
          rows="4"
          value={softSkillAnswer[index] || ""}
          onChange={(e) => handleInputChange("softskills", index, e.target.value)}
        />
      </div>
    ))}

    <button
      onClick={handleSubmitAnswers}
      className="mt-6 bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 transition"
      >
      {submitting?"Submitting the Answers..":"Submit Answers"}
    </button>
  </div>
)}

{evaluationResult && (
  <div className="mt-10 bg-white text-black p-6 rounded-xl max-w-6xl w-[100%] mb-16">
    <h2 className="text-2xl font-bold mb-4 text-center">Evaluation Results</h2>

    {/* ✅ MCQ Section */}
    <h3 className="text-lg font-semibold mb-2 text-purple-800">For MCQ :</h3>
    {result.sectionScores?.mcq?.details?.map((item, index) => (
      <div key={index} className="mb-4 ml-4">
        <p className="font-semibold">{index + 1}. {item.question}</p>
        <p className={`mt-1 ${item.selectedAnswer === item.correctAnswer ? "text-green-600" : "text-red-600"}`}>
          Your Answer: {item.selectedAnswer}
        </p>
        <p className="text-blue-600">Correct Answer: {item.correctAnswer}</p>
      </div>
    ))}
    <p className="font-medium text-2xl leading-tight font-sans m-4">Total Score: {result.sectionScores?.mcq?.score} / {result.sectionScores?.mcq?.total}</p>

    {/* ✅ Descriptive Section */}
    <h3 className="text-lg font-semibold mt-6 mb-2 text-purple-800"> For Descriptive Questions :</h3>
    <p className="italic mb-2 ml-4">{result.sectionScores?.descriptive?.feedbackSummary}</p>

    {/* ✅ Soft Skills Section */}
    <h3 className="text-lg font-semibold mt-6 mb-2 text-purple-800">For Soft Skills Questions :</h3>
    <p className="italic mb-2 ml-4">{result.sectionScores?.softSkills?.feedbackSummary}</p>
    {result.sectionScores?.softSkills?.strengths?.length > 0 && (
      <p className="ml-4"><strong>Strengths:</strong> {removeEventListeneresult.sectionScores.softSkills.strengths.join("")}</p>
    )}
    {result.sectionScores?.softSkills?.suggestions?.length > 0 && (
      <p className="ml-4"><strong>Suggestions: </strong> {result.sectionScores.softSkills.suggestions.join("")}</p>
    )}
    {result.sectionScores?.softSkills?.weaknesses?.length > 0 && (
      <p className="ml-4"><strong>Weaknesses: </strong> {result.sectionScores.softSkills.weaknesses.join("")}</p>
    )}

    {/* 📋 Mentor Analysis */}
    <div className="mb-6 mt-10">
      <h3 className="font-semibold text-blue-700 text-2xl text-center mb-2">Mentor Analysis</h3>
      <p><strong>Confidence Level:</strong> {result.mentorAnalysis?.confidenceLevel}</p>
      <p><strong>Advice:</strong> {result.mentorAnalysis?.mentorAdvice}</p>
      <p><strong>Improvement Areas:</strong> {result.mentorAnalysis?.improvementAreas?.join(". ")}</p>
      {evaluationResult.mentorAnalysis?.strongAreas?.length > 0 && (
        <p><strong>Strong Areas:</strong> {result.mentorAnalysis.strongAreas.join(". ")}</p>
      )}
    </div>

  </div>
)}



</div>

  );
}
  

export default TestPage;