import React from "react";
import { Link } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

const NotFound = () => {
  // Get the current user from AuthContext
  const { user } = useAuth();

  // Determine the correct dashboard link based on the user's role
  const dashboardLink = user?.role === "admin" ? "/admin-dashboard" : user ? "/employee-dashboard" : "/login";

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gray-100">
      <div className="text-center">
        <h1 className="text-9xl font-bold text-gray-800">404</h1>
        <p className="text-2xl font-semibold text-gray-600 mt-4">Oops! Page Not Found</p>
        <p className="text-md text-gray-500 mt-2">
          The page you are looking for might have been removed, had its name changed, or is temporarily unavailable.
        </p>
        {/* Link to the dashboard based on user role */}
        <Link
          to={dashboardLink}
          className="mt-6 inline-block px-6 py-3 text-white font-medium bg-blue-500 rounded-md shadow-md hover:bg-blue-600 transition duration-300"
        >
          Go Back to Dashboard
        </Link>
      </div>
    </div>
  );
};

export default NotFound;
