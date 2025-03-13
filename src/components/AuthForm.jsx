import { useState } from "react";
import { motion } from "framer-motion";
import { Mail, Lock, User } from "lucide-react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { GoogleLogin } from "@react-oauth/google";
import { jwtDecode } from "jwt-decode";
import { toast } from 'react-hot-toast';

const AuthForm = () => {
  const [isLogin, setIsLogin] = useState(true);
  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    emailId: "",
    password: "",
  });
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

    // if (!isLogin && formData.password !== formData.confirmPassword) {
    //   setError("Passwords do not match");
    //   setLoading(false);
    //   return;
    // }

    const endpoint = isLogin ? "/login" : "/signup";
    const requestBody = isLogin
      ? { emailId: formData.emailId, password: formData.password }
      : {
          firstName: formData.firstName,
          lastName: formData.lastName,
          emailId: formData.emailId,
          password: formData.password,
        };
        console.log(requestBody);
    try {
      const response = await axios.post(`${API_URL}${endpoint}`, requestBody, {
        headers: { "Content-Type": "application/json" },
        withCredentials: true,
      });

      localStorage.setItem("token", response.data.token);
      toast.success(`${isLogin ? "Login" : "Sign Up"} Successful!`,{duration: 2000});
      setFormData({ firstName: "", lastName: "", emailId: "", password: ""});
      navigate("/analyse");
    } catch (err) {
      setError(err.response?.data || "Something went wrong");
    } finally {
      setLoading(false);
    }
  };

  const handleGoogleLogin = async (details) => {
    try {
      
      const response = await axios.post(`${API_URL}/googlelogin`, { emailId:details.email, fullName: details.name });

      localStorage.setItem("token", response.data.token);
      
      toast.success(`Login Successful`,{duration: 2000});
 

      navigate("/home");
    } catch (error) {
      setError("Google login failed");
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

        <form className="space-y-4" onSubmit={handleSubmit}>
          {!isLogin && (
            <>
              <div className="relative">
                <User className="absolute left-3 top-3 text-gray-400" size={20} />
                <input
                  type="text"
                  name="firstName"
                  placeholder="First Name"
                  className="w-full pl-10 p-3 border border-gray-300 rounded-lg focus:outline-none focus:border-[#0077B6]"
                  value={formData.firstName}
                  onChange={handleInputChange}
                  required
                />
              </div>
              <div className="relative">
                <User className="absolute left-3 top-3 text-gray-400" size={20} />
                <input
                  type="text"
                  name="lastName"
                  placeholder="Last Name"
                  className="w-full pl-10 p-3 border border-gray-300 rounded-lg focus:outline-none focus:border-[#0077B6]"
                  value={formData.lastName}
                  onChange={handleInputChange}
                />
              </div>
            </>
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

          {error && <p className="text-red-500 text-sm text-center">{error}</p>}

          <motion.button
            type="submit"
            className="w-full bg-[#0077B6] hover:bg-[#023E8A] text-white py-3 rounded-lg font-semibold transition-all disabled:opacity-50"
            whileHover={{ scale: loading ? 1 : 1.05 }}
            disabled={loading}
          >
            {loading ? "Processing..." : isLogin ? "Sign In" : "Sign Up"}
          </motion.button>
        </form>

        <div className="mt-4 flex flex-col items-center">
          <GoogleLogin
            text="continue_with"
            onSuccess={(res)=>{
              let details=jwtDecode(res?.credential);
              handleGoogleLogin(details);
            }}
            onError={() => setError("Google login failed")}
          />

        </div>
      </motion.div>
    </div>
  );
};

export default AuthForm;
