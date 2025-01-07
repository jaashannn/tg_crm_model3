import axios from "axios";
import React, { useState } from "react";
import { useAuth } from "../context/authContext";
import { useNavigate } from "react-router-dom";
import backgroundImage from '../assets/background.jpg';

import Logo from "../assets/icon.ico"

const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState(null);
  const { login } = useAuth();
  const navigate = useNavigate();
  const apiUrl = import.meta.env.VITE_API_URL;

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.post(
        `${apiUrl}/api/auth/login`,
        { email, password }
      );
      if (response.data.success) {
        login(response.data.user);
        localStorage.setItem("token", response.data.token);
        if (response.data.user.role === "admin") {
          navigate("/admin-dashboard");
        } else {
          navigate("/employee-dashboard");
        }
      }
    } catch (error) {
      if (error.response && !error.response.data.success) {
        setError(error.response.data.error);
      } else {
        setError("Server Error");
      }
    }
  };

  return (
    <div
      className="flex items-center justify-center min-h-screen bg-cover bg-center"
      style={{
        backgroundImage: `url(${backgroundImage})`

      }}
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
        {error && <p className="text-red-500">{error}</p>}
        <form onSubmit={handleSubmit}>
          <div className="mb-4">
            <label htmlFor="email" className="block text-gray-700">
              Email
            </label>
            <input
              type="email"
              className="w-full px-4 py-2 border rounded"
              placeholder="Enter Email"
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </div>
          <div className="mb-6">
            <label htmlFor="password" className="block text-gray-700">
              Password
            </label>
            <input
              type="password"
              className="w-full px-4 py-2 border rounded"
              placeholder="*****"
              onChange={(e) => setPassword(e.target.value)}
              required
            />
          </div>
          <div className="flex justify-end mb-4">
            <a href="#" className="text-teal-600 hover:underline">
              Forgot password?
            </a>
          </div>
          <button
            type="submit"
            className="signin-button w-full text-white font-semibold text-lg py-3 rounded transition-transform transform hover:scale-105"
            style={{
              background: "linear-gradient(102deg, #3DD1B4 -16.81%, #393091 113.74%)",
              border: "1px solid #3DD1B4",
            }}
          >
            Sign In
          </button>
        </form>
      </div>
    </div>
  );
};

export default Login;
