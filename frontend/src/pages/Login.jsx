import axios from "axios";
import React, { useState } from "react";
import { useAuth } from "../context/AuthContext";
import { useNavigate } from "react-router-dom";
import backgroundImage from "../assets/background.jpg";
import Logo from "../assets/icon.ico";
import { toast } from "react-hot-toast"; // Import toast

const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false); // Added loading state
  const { login } = useAuth();
  const navigate = useNavigate();
  const apiUrl = import.meta.env.VITE_API_URL;

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true); // Disable form while loading
    try {
      const response = await axios.post(
        `${apiUrl}/api/auth/login`,
        { email, password }
      );
      if (response.data.success) {
        login(response.data.user);
        localStorage.setItem("token", response.data.token);
        toast.success("Login Successful!"); // Show success toast

        // Check if the user is an admin or employee and navigate accordingly
        if (response.data.user.role === "admin") {
          navigate("/admin-dashboard");
        } else {
          navigate("/employee-dashboard");
        }
      }
    } catch (error) {
      setError(error.response?.data?.error || "Server Error");
      toast.error(error.response?.data?.error || "Server Error"); // Show error toast
    } finally {
      setLoading(false); // Enable form again after loading
    }
  };

  return (
    <div
      className="flex items-center justify-center min-h-screen bg-cover bg-center"
      style={{ backgroundImage: `url(${backgroundImage})` }}
    >
      <div className="absolute top-0 left-0 flex items-center p-6 space-x-4">
        <img src={Logo} alt="Logo" className="h-10" />
        <h1 className="mt-2 text-3xl font-bold text-white">Testgrid</h1>
      </div>
      <div className="absolute top-10 text-center w-full">
        <h2 className="text-3xl font-semibold text-white">
          Test Better, Launch Faster
        </h2>
      </div>
      <div className="p-8 bg-white rounded-lg shadow-lg w-96">
        <h2 className="text-2xl font-bold mb-6">Login</h2>
        {error && <p className="text-red-500 mb-4">{error}</p>}
        <form onSubmit={handleSubmit}>
          <div className="mb-4">
            <label htmlFor="email" className="block text-gray-700">
              Email
            </label>
            <input
              type="email"
              id="email"
              className="w-full px-4 py-2 border rounded"
              placeholder="Enter Email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              aria-label="Email"
            />
          </div>
          <div className="mb-6">
            <label htmlFor="password" className="block text-gray-700">
              Password
            </label>
            <input
              type="password"
              id="password"
              className="w-full px-4 py-2 border rounded"
              placeholder="*****"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              aria-label="Password"
            />
          </div>
          <div className="flex justify-end mb-4">
            <a href="#" className="text-teal-600 hover:underline">
              Forgot password?
            </a>
          </div>
          <button
            type="submit"
            className={`signin-button w-full text-white font-semibold text-lg py-3 rounded transition-transform transform hover:scale-105 ${
              loading ? "cursor-not-allowed opacity-50" : ""
            }`}
            style={{
              background: "linear-gradient(102deg, #3DD1B4 -16.81%, #393091 113.74%)",
              border: "1px solid #3DD1B4",
            }}
            disabled={loading} // Disable the button while loading
          >
            {loading ? "Signing In..." : "Sign In"}
          </button>
        </form>
      </div>
    </div>
  );
};

export default Login;
