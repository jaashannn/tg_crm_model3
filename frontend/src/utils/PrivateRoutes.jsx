import React from 'react';
import { useAuth } from '../context/AuthContext';
import { Navigate } from 'react-router-dom';
import Loader from '../components/Loading/Loader'; // Import Loader

const PrivateRoutes = ({ children }) => {
  const { user, loading } = useAuth();

  if (loading) {
    return <Loader />; // Use Loader component
  }

  return user ? children : <Navigate to="/login" />;
};

export default PrivateRoutes;
