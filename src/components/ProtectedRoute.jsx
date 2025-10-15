// src/components/ProtectedRoute.jsx
import { Navigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

export default function ProtectedRoute({ children, permission, redirectPath = "/unauthorized" }) {
  const { hasPermission, loading } = useAuth();

  if (loading) {
    return <div className="flex items-center justify-center h-screen">Cargando permisos...</div>;
  }


  if (!hasPermission(permission)) {
    return <Navigate to={redirectPath} replace />;
  }

  return children;
}