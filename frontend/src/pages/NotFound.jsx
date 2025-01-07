import React, { useContext } from "react";
import { Link } from "react-router-dom";
import { useAuth } from "../context/authContext"; // Import your AuthContext

const NotFound = () => {
  // Access the user role from the AuthContext
 const { user } = useAuth();

  // Check the user's role and set the correct dashboard link
  const dashboardLink = user?.role === "admin" ? "/admin-dashboard" : "/employee-dashboard";

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gray-100">
      {/* Main Content */}
      <div className="text-center">
        <h1 className="text-9xl font-bold text-gray-800">404</h1>
        <p className="text-2xl font-semibold text-gray-600 mt-4">
          Oops! Page Not Found
        </p>
        <p className="text-md text-gray-500 mt-2">
          The page you are looking for might have been removed, had its name
          changed, or is temporarily unavailable.
        </p>

        {/* Back to Dashboard Button */}
        <Link
          to={dashboardLink}  // Link conditionally based on user role
          className="mt-6 inline-block px-6 py-3 text-white font-medium bg-blue-500 rounded-md shadow-md hover:bg-blue-600 transition duration-300"
        >
          Go Back to Dashboard
        </Link>
      </div>

      {/* Illustration */}
      {/* <div className="mt-8">
        <img
          src="https://via.placeholder.com/500x300?text=Illustration+Placeholder"
          alt="404 Illustration"
          className="w-full max-w-md mx-auto"
        />
      </div> */}
    </div>
  );
};

export default NotFound;
