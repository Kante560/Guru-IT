// src/Components/ProtectedRoute.tsx
import React from "react";
import { Navigate } from "react-router-dom";
import { useAuth } from "../Components/AuthContext";

interface ProtectedRouteProps {
  children: React.ReactNode;
  role?: "admin" | ""; // restrict by role if provided
}

const ProtectedRoute = ({ children, role }: ProtectedRouteProps) => {
  const { isAuthenticated, user } = useAuth();

  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  if (role && user?.role !== role) {
    // user is logged in but doesn’t have the right role
    return <Navigate to="/" replace />;
  }

  return children;
};

export default ProtectedRoute;
