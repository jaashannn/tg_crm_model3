import React from 'react';
import { useAuth } from '../context/AuthContext';
import { Navigate } from 'react-router-dom';
import Loader from '../components/Loading/Loader'; // Ensure correct import path

const RoleBaseRoutes = ({ children, requiredRole }) => {
  const { user, loading } = useAuth();

  // Show loader while authentication state is being determined
  if (loading) {
    return <Loader />;
  }

  // Redirect to unauthorized page if the user exists but does not have the required role
  if (user && !requiredRole.includes(user.role)) {
    return <Navigate to="/unauthorized" />;
  }

  // Redirect to login page if the user is not authenticated
  return user ? children : <Navigate to="/login" />;
};

export default RoleBaseRoutes;
