import React from 'react';
import { useAuth } from '../context/authContext';
import { Navigate } from 'react-router-dom';
import Loader from '../components/Loading/Loader';

const RoleBaseRoutes = ({ children, requiredRole }) => {
  const { user, loading } = useAuth();

  // Show loader if the user's authentication status is loading
  if (loading) {
    return <Loader />;
  }

  // If the user does not have the required role, navigate to unauthorized page
  if (user && !requiredRole.includes(user.role)) {
    return <Navigate to="/unauthorized" />;
  }

  // If the user is logged in and has the correct role, render the children
  return user ? children : <Navigate to="/login" />;
};

export default RoleBaseRoutes;
