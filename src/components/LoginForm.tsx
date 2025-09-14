import React, { useState } from "react";
import { motion } from "framer-motion";
import { Eye, EyeOff, Mail, Lock, User, UserPlus, School, MapPin } from "lucide-react";
import GlassCard from "./GlassCard";

interface LoginFormProps {
  type: "student" | "teacher";
  onLogin: (email: string, password: string) => void;
  onClose: () => void;
}

const LoginForm: React.FC<LoginFormProps> = ({ type, onLogin, onClose }) => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [isSignUp, setIsSignUp] = useState(false);
  const [signUpData, setSignUpData] = useState({
    name: "",
    confirmPassword: "",
    school: "",
    grade: "",
    state: "",
    subject: "", // for teachers
  });

  const indianStates = [
    'Andhra Pradesh', 'Arunachal Pradesh', 'Assam', 'Bihar', 'Chhattisgarh',
    'Goa', 'Gujarat', 'Haryana', 'Himachal Pradesh', 'Jharkhand', 'Karnataka',
    'Kerala', 'Madhya Pradesh', 'Maharashtra', 'Manipur', 'Meghalaya', 'Mizoram',
    'Nagaland', 'Odisha', 'Punjab', 'Rajasthan', 'Sikkim', 'Tamil Nadu',
    'Telangana', 'Tripura', 'Uttar Pradesh', 'Uttarakhand', 'West Bengal'
  ];

  const grades = ['6th', '7th', '8th', '9th', '10th', '11th', '12th'];

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (isSignUp) {
      // Validate sign up form
      if (password !== signUpData.confirmPassword) {
        alert("Passwords don't match!");
        return;
      }
      if (password.length < 6) {
        alert("Password must be at least 6 characters long!");
        return;
      }
      // In a real app, you would send the sign up data to your backend
      console.log("Sign up data:", { email, password, ...signUpData, type });
      alert(`${type === 'student' ? 'Student' : 'Teacher'} account created successfully! You can now log in.`);
      setIsSignUp(false);
      // Reset form
      setEmail("");
      setPassword("");
      setSignUpData({
        name: "",
        confirmPassword: "",
        school: "",
        grade: "",
        state: "",
        subject: "",
      });
    } else {
      onLogin(email, password);
    }
  };

  const handleSignUpDataChange = (field: string, value: string) => {
    setSignUpData(prev => ({ ...prev, [field]: value }));
  };

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4"
      onClick={onClose}
    >
      <motion.div
        initial={{ scale: 0.8, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        exit={{ scale: 0.8, opacity: 0 }}
        onClick={(e) => e.stopPropagation()}
        className="w-full max-w-md"
      >
        <GlassCard className="p-8">
          <div className="text-center mb-8">
            <div className="w-16 h-16 bg-gradient-to-r from-[#F8D991] to-[#F6B080] rounded-full flex items-center justify-center mx-auto mb-4">
              <User className="h-8 w-8 text-[#091D23]" />
            </div>
            <h2 className="text-2xl font-bold text-white mb-2">
              {isSignUp ? `${type === "student" ? "Student" : "Teacher"} Sign Up` : `${type === "student" ? "Student" : "Teacher"} Login`}
            </h2>
            <p className="text-white/70">{isSignUp ? "Join the PrismWorlds community" : "Welcome back to PrismWorlds"}</p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-6">
            {isSignUp && (
              <div>
                <label className="block text-white/80 text-sm font-medium mb-2">
                  Full Name
                </label>
                <div className="relative">
                  <User className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-white/50" />
                  <input
                    type="text"
                    value={signUpData.name}
                    onChange={(e) => handleSignUpDataChange("name", e.target.value)}
                    className="w-full pl-10 pr-4 py-3 bg-white/10 border border-white/20 rounded-xl text-white placeholder-white/50 focus:outline-none focus:ring-2 focus:ring-[#E1664C] focus:border-transparent backdrop-blur-sm"
                    placeholder="Enter your full name"
                    required
                  />
                </div>
              </div>
            )}

            <div>
              <label className="block text-white/80 text-sm font-medium mb-2">
                Email Address
              </label>
              <div className="relative">
                <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-white/50" />
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full pl-10 pr-4 py-3 bg-white/10 border border-white/20 rounded-xl text-white placeholder-white/50 focus:outline-none focus:ring-2 focus:ring-[#E1664C] focus:border-transparent backdrop-blur-sm"
                  placeholder="Enter your email"
                  required
                />
              </div>
            </div>

            <div>
              <label className="block text-white/80 text-sm font-medium mb-2">
                Password
              </label>
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-white/50" />
                <input
                  type={showPassword ? "text" : "password"}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full pl-10 pr-12 py-3 bg-white/10 border border-white/20 rounded-xl text-white placeholder-white/50 focus:outline-none focus:ring-2 focus:ring-[#E1664C] focus:border-transparent backdrop-blur-sm"
                  placeholder="Enter your password"
                  required
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 transform -translate-y-1/2 text-white/50 hover:text-[#E1664C] transition-colors focus:outline-none focus:ring-2 focus:ring-[#E1664C] rounded"
                >
                  {showPassword ? (
                    <EyeOff className="h-5 w-5" />
                  ) : (
                    <Eye className="h-5 w-5" />
                  )}
                </button>
              </div>
            </div>

            {isSignUp && (
              <div>
                <label className="block text-white/80 text-sm font-medium mb-2">
                  Confirm Password
                </label>
                <div className="relative">
                  <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-white/50" />
                  <input
                    type="password"
                    value={signUpData.confirmPassword}
                    onChange={(e) => handleSignUpDataChange("confirmPassword", e.target.value)}
                    className="w-full pl-10 pr-4 py-3 bg-white/10 border border-white/20 rounded-xl text-white placeholder-white/50 focus:outline-none focus:ring-2 focus:ring-[#E1664C] focus:border-transparent backdrop-blur-sm"
                    placeholder="Confirm your password"
                    required
                  />
                </div>
              </div>
            )}

            {isSignUp && (
              <>
                <div>
                  <label className="block text-white/80 text-sm font-medium mb-2">
                    School/Institution
                  </label>
                  <div className="relative">
                    <School className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-white/50" />
                    <input
                      type="text"
                      value={signUpData.school}
                      onChange={(e) => handleSignUpDataChange("school", e.target.value)}
                      className="w-full pl-10 pr-4 py-3 bg-white/10 border border-white/20 rounded-xl text-white placeholder-white/50 focus:outline-none focus:ring-2 focus:ring-[#E1664C] focus:border-transparent backdrop-blur-sm"
                      placeholder="Enter your school name"
                      required
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {type === "student" ? (
                    <div>
                      <label className="block text-white/80 text-sm font-medium mb-2">
                        Grade
                      </label>
                      <select
                        value={signUpData.grade}
                        onChange={(e) => handleSignUpDataChange("grade", e.target.value)}
                        className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-xl text-white focus:outline-none focus:ring-2 focus:ring-[#E1664C] focus:border-transparent backdrop-blur-sm"
                        required
                      >
                        <option value="" className="bg-[#091D23] text-white">Select Grade</option>
                        {grades.map(grade => (
                          <option key={grade} value={grade} className="bg-[#091D23] text-white">
                            {grade}
                          </option>
                        ))}
                      </select>
                    </div>
                  ) : (
                    <div>
                      <label className="block text-white/80 text-sm font-medium mb-2">
                        Subject/Department
                      </label>
                      <input
                        type="text"
                        value={signUpData.subject}
                        onChange={(e) => handleSignUpDataChange("subject", e.target.value)}
                        className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-xl text-white placeholder-white/50 focus:outline-none focus:ring-2 focus:ring-[#E1664C] focus:border-transparent backdrop-blur-sm"
                        placeholder="e.g., Environmental Science"
                        required
                      />
                    </div>
                  )}

                  <div>
                    <label className="block text-white/80 text-sm font-medium mb-2">
                      State
                    </label>
                    <div className="relative">
                      <MapPin className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-white/50" />
                      <select
                        value={signUpData.state}
                        onChange={(e) => handleSignUpDataChange("state", e.target.value)}
                        className="w-full pl-10 pr-4 py-3 bg-white/10 border border-white/20 rounded-xl text-white focus:outline-none focus:ring-2 focus:ring-[#E1664C] focus:border-transparent backdrop-blur-sm"
                        required
                      >
                        <option value="" className="bg-[#091D23] text-white">Select State</option>
                        {indianStates.map(state => (
                          <option key={state} value={state} className="bg-[#091D23] text-white">
                            {state}
                          </option>
                        ))}
                      </select>
                    </div>
                  </div>
                </div>
              </>
            )}

            <button
              type="submit"
              className="w-full bg-gradient-to-r from-[#F8D991] to-[#F6B080] text-[#091D23] py-3 rounded-xl font-semibold hover:shadow-lg hover:shadow-[#F8D991]/25 transition-all duration-300 focus:outline-none focus:ring-2 focus:ring-[#E1664C] focus:ring-offset-2 focus:ring-offset-transparent"
            >
              {isSignUp ? "Create Account" : "Sign In"}
            </button>
          </form>

          <div className="mt-6 text-center">
            <button
              type="button"
              onClick={() => setIsSignUp(!isSignUp)}
              className="text-[#E1664C] hover:text-[#F58B60] transition-colors focus:outline-none focus:ring-2 focus:ring-[#E1664C] rounded px-2 py-1 mb-3 flex items-center space-x-1 mx-auto"
            >
              <UserPlus className="h-4 w-4" />
              <span>{isSignUp ? "Already have an account? Sign In" : "New to PrismWorlds? Sign Up"}</span>
            </button>
            <button
              onClick={onClose}
              className="text-white/70 hover:text-[#E1664C] transition-colors focus:outline-none focus:ring-2 focus:ring-[#E1664C] rounded px-2 py-1"
            >
              Cancel
            </button>
          </div>
        </GlassCard>
      </motion.div>
    </motion.div>
  );
};

export default LoginForm;
