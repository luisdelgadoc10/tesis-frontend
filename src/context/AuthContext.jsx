// src/context/AuthContext.jsx
import { createContext, useContext, useState, useEffect } from "react";
import axios from "axios";

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [roles, setRoles] = useState(null); // Cambiado a null
  const [permissions, setPermissions] = useState(null); // Cambiado a null
  const [loading, setLoading] = useState(true);
  const [isInitialized, setIsInitialized] = useState(false); // Nuevo estado
  const [token, setToken] = useState(localStorage.getItem("token"));

  // ⚡ Configurar axios con baseURL para API
  const api = axios.create({
    baseURL: import.meta.env.VITE_API_URL,
  });

  // ⚡ Interceptor para agregar token automáticamente
  api.interceptors.request.use((config) => {
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    config.headers.Accept = "application/json";
    config.headers["Content-Type"] = "application/json";
    return config;
  });

  // ⚡ Interceptor para manejar errores de autenticación
  api.interceptors.response.use(
    (response) => response,
    (error) => {
      const originalRequest = error.config;
      const authRoutes = ["/login", "/register"];
      const isAuthRoute = authRoutes.some((route) =>
        originalRequest?.url?.endsWith(route)
      );

      if (error.response?.status === 401 && !isAuthRoute) {
        handleLogout();
      }

      return Promise.reject(error);
    }
  );

  // 🔧 Helper para setear usuario, roles y permisos en un solo lugar
  const setUserAndAccess = (userData) => {
    setUser(userData);
    setRoles(userData.roles?.map((role) => role.name) || []);
    setPermissions(userData.permissions?.map((perm) => perm.name) || []);
  };

  // ⚡ Función para limpiar estado de autenticación
  const handleLogout = () => {
    setToken(null);
    setUser(null);
    setRoles(null); // Cambiado a null
    setPermissions(null); // Cambiado a null
    localStorage.removeItem("token");
  };

  // ⚡ Cargar usuario al iniciar si hay token
  useEffect(() => {
    const fetchUser = async () => {
      setLoading(true);
      try {
        if (!token) {
          handleLogout();
        } else {
          const { data } = await api.get("/profile");
          setUser(data.user);
          setRoles(data.user.roles?.map((role) => role.name) || []);
          setPermissions(data.user.permissions?.map((perm) => perm.name) || []);
        }
      } catch (err) {
        console.error("Error al cargar usuario:", err);
        handleLogout();
      } finally {
        setLoading(false);
        setIsInitialized(true);
      }
    };

    fetchUser();
  }, [token]);

  const login = async (credentials) => {
    try {
      const { data } = await api.post("/login", credentials);
      setToken(data.token);
      setUserAndAccess(data.user);
      localStorage.setItem("token", data.token);
      return data;
    } catch (error) {
      throw error;
    }
  };

  const register = async (credentials) => {
    try {
      const { data } = await api.post("/register", credentials);
      setToken(data.token);
      setUserAndAccess(data.user);
      localStorage.setItem("token", data.token);
      return data;
    } catch (error) {
      console.error("Error en registro:", error);
      throw error;
    }
  };

  const logout = async () => {
    try {
      if (token) {
        await api.post("/logout");
      }
    } catch (error) {
      console.error("Error en logout:", error);
    } finally {
      handleLogout();
    }
  };

  // ✅ Funciones para verificar roles y permisos
  const hasRole = (role) => {
    if (!roles) return false;
    return roles.includes(role);
  };
  const hasPermission = (permission) => {
    if (!permissions) return false;
    return permissions.includes(permission);
  };
  const hasAnyRole = (rolesArray) =>
    rolesArray.some((role) => roles.includes(role));

  const value = {
    user,
    token,
    roles,
    permissions,
    login,
    register,
    logout,
    isAuthenticated: !!token && !!user, // Modificado
    loading,
    isInitialized, // Nuevo
    api,
    hasRole,
    hasPermission,
    hasAnyRole,
  };

  // Modificar el render
  if (!isInitialized) {
    return (
      <div className="flex items-center justify-center h-screen">
        <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth debe ser usado dentro de AuthProvider");
  }
  return context;
};
