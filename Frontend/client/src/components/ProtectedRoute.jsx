import React from 'react';
import { Navigate } from 'react-router-dom';
import { isAdmin, getToken } from '../utils/api';

const ProtectedRoute = ({ children }) => {
  const token = getToken();
  if (!token) return <Navigate to="/login" replace />;
  if (!isAdmin()) return <Navigate to="/login" replace />;
  return children;
};

export default ProtectedRoute;
