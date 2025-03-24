import axios from "axios";
import React, { useState } from "react";
import { useAuth } from "../context/AuthContext";
import { useNavigate } from "react-router-dom";
import backgroundImage from "../assets/background.jpg";
import Logo from "../assets/icon.ico";
import { toast } from "react-hot-toast";

const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [otp, setOtp] = useState("");
  const [isOtpSent, setIsOtpSent] = useState(false);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);
  const { login } = useAuth();
  const navigate = useNavigate();
  const apiUrl = import.meta.env.VITE_API_URL;

  const handleSendOtp = async () => {
    setLoading(true);
    try {
      // Step 1: Validate email and password
      const loginResponse = await axios.post(`${apiUrl}/api/auth/login`, { email, password });
      console.log(loginResponse, "loginResponse");
      if (loginResponse.data.success) {

        toast.success("password verified successfully!");
        // Step 2: If email and password are valid, send OTP
        const otpResponse = await axios.post(`${apiUrl}/api/auth/send-otp`, { email });
        if (otpResponse.data.success) {
          setIsOtpSent(true);
          toast.success("OTP sent to your email!");
        }
      }
    } catch (error) {
      setError(error.response?.data?.error || "Invalid email or password");
      toast.error(error.response?.data?.error || "Invalid email or password");
    } finally {
      setLoading(false);
    }
  };

  const handleVerifyOtp = async () => {
    setLoading(true);
    try {
      // Step 3: Verify OTP
      const otpVerifyResponse = await axios.post(`${apiUrl}/api/auth/verify-otp`, { email, otp });
      if (otpVerifyResponse.data.success) {
        toast.success("OTP verified successfully!");

        // Step 4: Log the user in after OTP verification
        const loginResponse = await axios.post(`${apiUrl}/api/auth/login`, { email, password });
        if (loginResponse.data.success) {
          login(loginResponse.data.user);
          localStorage.setItem("token", loginResponse.data.token);
          toast.success("Login Successful!");
          navigate(loginResponse.data.user.role === "admin" ? "/admin-dashboard" : "/employee-dashboard");
        }
      }
    } catch (error) {
      setError(error.response?.data?.error || "Failed to verify OTP");
      toast.error(error.response?.data?.error || "Failed to verify OTP");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-cover bg-center" style={{ backgroundImage: `url(${backgroundImage})` }}>
      <div className="absolute top-0 left-0 flex items-center p-6 space-x-4">
        <img src={Logo} alt="Logo" className="h-10" />
        <h1 className="mt-2 text-3xl font-bold text-white">Testgrid</h1>
      </div>
      <div className="absolute top-10 text-center w-full">
        <h2 className="text-3xl font-semibold text-white">Test Better, Launch Faster</h2>
      </div>
      <div className="p-8 bg-white rounded-lg shadow-lg w-96">
        <h2 className="text-2xl font-bold mb-6">Login</h2>
        {error && <p className="text-red-500 mb-4">{error}</p>}
        <form onSubmit={(e) => e.preventDefault()}>
          <div className="mb-4">
            <label htmlFor="email" className="block text-gray-700">Email</label>
            <input type="email" id="email" className="w-full px-4 py-2 border rounded" placeholder="Enter Email" value={email} onChange={(e) => setEmail(e.target.value)} required />
          </div>
          {!isOtpSent && (
            <div className="mb-6">
              <label htmlFor="password" className="block text-gray-700">Password</label>
              <input type="password" id="password" className="w-full px-4 py-2 border rounded" placeholder="*****" value={password} onChange={(e) => setPassword(e.target.value)} required />
            </div>
          )}
          {isOtpSent && (
            <div className="mb-6">
              <label htmlFor="otp" className="block text-gray-700">OTP</label>
              <input type="text" id="otp" className="w-full px-4 py-2 border rounded" placeholder="Enter OTP" value={otp} onChange={(e) => setOtp(e.target.value)} required />
            </div>
          )}
          <div className="flex justify-end mb-4">
            <a href="#" className="text-teal-600 hover:underline">Forgot password?</a>
          </div>
          <button
            type="button"
            onClick={isOtpSent ? handleVerifyOtp : handleSendOtp}
            className={`w-full text-white font-semibold text-lg py-3 rounded transition-transform transform hover:scale-105 ${loading ? "cursor-not-allowed opacity-50" : ""}`}
            style={{ background: "linear-gradient(102deg, #3DD1B4 -16.81%, #393091 113.74%)", border: "1px solid #3DD1B4" }}
            disabled={loading}
          >
            {loading ? "Processing..." : isOtpSent ? "Verify OTP" : "Send OTP"}
          </button>
        </form>
      </div>
    </div>
  );
};

export default Login;