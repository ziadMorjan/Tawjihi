// src/components/ProtectedRoute.jsx
import { useContext } from "react";
import { Navigate, Outlet } from "react-router-dom";
import { AuthContext } from "../../context/AuthContext";

const ProtectedRoute = () => {
  const { isAuth } = useContext(AuthContext);

  // If not authenticated, redirect to login
  return isAuth ? <Outlet /> : <Navigate to="/auth/login" replace />;
};

export default ProtectedRoute;
