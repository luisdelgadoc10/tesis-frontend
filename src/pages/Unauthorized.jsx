// src/pages/Unauthorized.jsx
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

export default function Unauthorized() {
  const navigate = useNavigate();
  const { isAuthenticated, logout } = useAuth();

  const handleGoHome = () => {
    if (isAuthenticated) {
      navigate("/dashboard");
    } else {
      navigate("/login");
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50">
      <div className="max-w-md w-full text-center">
        <div className="bg-white shadow-lg rounded-lg p-8">
          {/* Ícono de acceso denegado */}
          <div className="mx-auto w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mb-6">
            <svg
              className="w-8 h-8 text-red-600"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L4.082 16.5c-.77.833.192 2.5 1.732 2.5z"
              />
            </svg>
          </div>

          {/* Mensaje principal */}
          <h1 className="text-2xl font-bold text-gray-900 mb-4">
            Acceso Denegado
          </h1>
          
          <p className="text-gray-600 mb-8">
            No tienes los permisos necesarios para acceder a esta página.
            Contacta al administrador si crees que esto es un error.
          </p>

          {/* Botones de acción */}
          <div className="space-y-3">
            <button
              onClick={handleGoHome}
              className="w-full bg-blue-600 hover:bg-blue-700 text-white font-medium py-2 px-4 rounded-md transition-colors"
            >
              {isAuthenticated ? "Ir al Dashboard" : "Ir al Login"}
            </button>

            {isAuthenticated && (
              <button
                onClick={() => navigate(-1)}
                className="w-full bg-gray-300 hover:bg-gray-400 text-gray-700 font-medium py-2 px-4 rounded-md transition-colors"
              >
                Volver Atrás
              </button>
            )}

            {isAuthenticated && (
              <button
                onClick={logout}
                className="w-full text-red-600 hover:text-red-800 font-medium py-2 px-4 transition-colors"
              >
                Cerrar Sesión
              </button>
            )}
          </div>
        </div>

        {/* Información adicional */}
        <p className="mt-6 text-sm text-gray-500">
          ¿Necesitas ayuda? {" "}
          <Link to="/contact" className="text-blue-600 hover:underline">
            Contacta soporte
          </Link>
        </p>
      </div>
    </div>
  );
}