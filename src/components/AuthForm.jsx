import { useState } from "react";
import { motion } from "framer-motion";
import { Mail, Lock, User } from "lucide-react";
import axios from "axios";
import { useNavigate} from "react-router-dom";

const AuthForm = () => {
  const [isLogin, setIsLogin] = useState(true);
  const [formData, setFormData] = useState({ fullName: "", emailId: "", password: "", confirmPassword: "" });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const navigate = useNavigate();
  const API_URL = "http://localhost:7777"; // Replace with your backend URL

  const handleInputChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    if (!isLogin && formData.password !== formData.confirmPassword) {
      setError("Passwords do not match");
      setLoading(false);
      return;
    }

    const endpoint = isLogin ? "/login" : "/signup";
    const requestBody = isLogin
      ? { emailId: formData.emailId, password: formData.password }
      : { fullName: formData.fullName, emailId: formData.emailId, password: formData.password };

    try {
      const response = await axios.post(`${API_URL}${endpoint}`, requestBody, {
        headers: { "Content-Type": "application/json" },
        withCredentials: true, // Ensures cookies are handled properly
      });

      localStorage.setItem("token", response.data.token); // Save JWT token
      alert(`${isLogin ? "Login" : "Sign Up"} Successful!`);
      setFormData({ fullName: "", emailId: "", password: "", confirmPassword: "" }); // Clear form
      navigate("/home");
    } catch (err) {
      setError(err.response?.data || "Something went wrong");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-r from-[#03045E] to-[#0077B6] px-4">
      <motion.div
        className="bg-white p-8 rounded-2xl shadow-lg w-full max-w-md"
        initial={{ opacity: 0, y: -30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8 }}
      >
        {/* Toggle Between Login & Sign Up */}
        <div className="flex justify-between mb-6">
          <button
            className={`text-lg font-semibold flex-1 p-2 transition-all ${
              isLogin ? "border-b-4 border-[#0077B6] text-[#0077B6]" : "text-gray-500"
            }`}
            onClick={() => setIsLogin(true)}
          >
            Sign In
          </button>
          <button
            className={`text-lg font-semibold flex-1 p-2 transition-all ${
              !isLogin ? "border-b-4 border-[#0077B6] text-[#0077B6]" : "text-gray-500"
            }`}
            onClick={() => setIsLogin(false)}
          >
            Sign Up
          </button>
        </div>

        {/* Form Fields */}
        <form className="space-y-4" onSubmit={handleSubmit}>
          {!isLogin && (
            <div className="relative">
              <User className="absolute left-3 top-3 text-gray-400" size={20} />
              <input
                type="text"
                name="fullName"
                placeholder="Full Name"
                className="w-full pl-10 p-3 border border-gray-300 rounded-lg focus:outline-none focus:border-[#0077B6]"
                value={formData.fullName}
                onChange={handleInputChange}
                required
              />
            </div>
          )}
          <div className="relative">
            <Mail className="absolute left-3 top-3 text-gray-400" size={20} />
            <input
              type="email"
              name="emailId"
              placeholder="Email Address"
              className="w-full pl-10 p-3 border border-gray-300 rounded-lg focus:outline-none focus:border-[#0077B6]"
              value={formData.emailId}
              onChange={handleInputChange}
              required
            />
          </div>
          <div className="relative">
            <Lock className="absolute left-3 top-3 text-gray-400" size={20} />
            <input
              type="password"
              name="password"
              placeholder="Password"
              className="w-full pl-10 p-3 border border-gray-300 rounded-lg focus:outline-none focus:border-[#0077B6]"
              value={formData.password}
              onChange={handleInputChange}
              required
            />
          </div>
          {!isLogin && (
            <div className="relative">
              <Lock className="absolute left-3 top-3 text-gray-400" size={20} />
              <input
                type="password"
                name="confirmPassword"
                placeholder="Confirm Password"
                className="w-full pl-10 p-3 border border-gray-300 rounded-lg focus:outline-none focus:border-[#0077B6]"
                value={formData.confirmPassword}
                onChange={handleInputChange}
                required
              />
            </div>
          )}

          {/* Error Message */}
          {error && <p className="text-red-500 text-sm text-center">{error}</p>}

          {/* Submit Button */}
          <motion.button
            type="submit"
            className="w-full bg-[#0077B6] hover:bg-[#023E8A] text-white py-3 rounded-lg font-semibold transition-all disabled:opacity-50"
            whileHover={{ scale: loading ? 1 : 1.05 }}
            disabled={loading}
          >
            {loading ? "Processing..." : isLogin ? "Sign In" : "Sign Up"}
          </motion.button>
        </form>

        {/* Switch to Sign Up / Login */}
        <p className="text-center text-gray-600 mt-4">
          {isLogin ? "Don't have an account?" : "Already have an account?"}{" "}
          <span
            className="text-[#0077B6] font-semibold cursor-pointer"
            onClick={() => setIsLogin(!isLogin)}
          >
            {isLogin ? "Sign Up" : "Sign In"}
          </span>
        </p>
      </motion.div>
    </div>
  );
};

export default AuthForm;