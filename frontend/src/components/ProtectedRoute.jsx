import React from 'react';
import { Navigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

export default function ProtectedRoute({ children, requireArtisan = false }) {
  const { user, isArtisan } = useAuth();

  if (!user) {
    return <Navigate to="/login" replace />;
  }

  if (requireArtisan && !isArtisan) {
    return <Navigate to="/" replace />;
  }

  return children;
}
