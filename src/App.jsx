// src/App.jsx
import { BrowserRouter, Routes, Route, Navigate, useLocation } from "react-router-dom";
import { AuthProvider, useAuth } from "./context/AuthContext";
import LoginPage from "./pages/LoginPage";
import PublicCuestionarioPage from "./pages/PublicCuestionarioPage";
import Layout from "./components/Layout";
import ProtectedRoute from "./components/ProtectedRoute";
import Unauthorized from "./pages/Unauthorized";

// Páginas protegidas
import Dashboard from "./pages/Dashboard";
import UsersPage from "./pages/UsersPage";
import EstablishmentsPage from "./pages/EstablecimientosPage";
import ClassificationsPage from "./pages/ClasificacionPage";
import NuevaClasificacionPage from "./pages/NuevaClasificacionPage";
import FuncionesPage from "./pages/FuncionesPage";
import ActividadesEconomicasPage from "./pages/ActividadesEconomicasPage";
import RolesPage from "./pages/RolesPage";
import PermisosPage from "./pages/PermisosPage";
import EstablecimientoDetallePage from "./pages/EstablecimientoDetallePage";
import SubfuncionesPage from "./pages/SubfuncionesPage";
import ClasificacionDetallePage from "./pages/ClasificacionDetallePage";
import MapaRiesgoPage from "./pages/MapaRiesgoPage";
import SubfuncionDetallePage from "./pages/SubfuncionDetallePage";    
import RolFormPage from "./pages/RolFormPage";



// Componente interno para proteger rutas (autenticación)
function ProtectedLayout() {
  const { isAuthenticated, loading, isInitialized } = useAuth(); // Añadimos isInitialized

  // Esperar a que la autenticación esté inicializada
  if (!isInitialized || loading) {
    return (
      <div className="flex items-center justify-center h-screen">
        <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  return <Layout />;
}

function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <Routes>
          {/* Ruta pública */}
          <Route
            path="/login"
            element={
              <PublicRoute>
                <LoginPage />
              </PublicRoute>
            }
          />
          <Route
            path="/encuesta/:token"
            element={
              <PublicRoute>
                <PublicCuestionarioPage />
              </PublicRoute>
            } 
          />


          <Route path="/unauthorized" element={<Unauthorized />} />

          {/* Rutas protegidas */}
          <Route element={<ProtectedLayout />}>
            {/* Dashboard (sin permiso específico, solo autenticado) */}
            <Route
              path="/dashboard"
              element={
                <ProtectedRoute permission="view-dashboard">
                  <Dashboard />
                </ProtectedRoute>
              }
            />

            {/* Usuarios */}
            <Route
              path="/users"
              element={
                <ProtectedRoute permission="view-users">
                  <UsersPage />
                </ProtectedRoute>
              }
            />

            {/* Establecimientos */}
            <Route
              path="/establecimientos"
              element={
                <ProtectedRoute permission="view-establecimientos">
                  <EstablishmentsPage />
                </ProtectedRoute>
              }
            />

            {/* Crear Establecimientos */}
            <Route
              path="/establecimientos/nuevo"
              element={
                <ProtectedRoute permission="crear-establecimiento">
                  <EstablecimientoDetallePage />
                </ProtectedRoute>
              }
            />

            {/* Editar Establecimientos */}
            <Route
              path="/establecimientos/:id/editar"
              element={
                <ProtectedRoute permission="editar-establecimiento">
                  <EstablecimientoDetallePage />
                </ProtectedRoute>
              }
            />

            {/* Visualiza detalle de Establecimientos */}
            <Route
              path="/establecimientos/:id"
              element={
                <ProtectedRoute permission="detalle-establecimiento" >
                  <EstablecimientoDetallePage />
                </ProtectedRoute>
              }
            />

            {/* Clasificaciones */}
            <Route
              path="/clasificaciones"
              element={
                <ProtectedRoute permission="view-clasificaciones">
                  <ClassificationsPage />
                </ProtectedRoute>
              }
            />

            <Route
              path="/clasificaciones/nueva"
              element={
                <ProtectedRoute permission="create-clasificaciones">
                  <NuevaClasificacionPage />
                </ProtectedRoute>
              }
            />
            <Route
              path="/clasificaciones/:id"
              element={
                <ProtectedRoute permission="detalle-clasificaciones">
                  <ClasificacionDetallePage />
                </ProtectedRoute>
              }
            />

            { /* Mapa de Riesgo */}
            <Route
              path="/mapa-riesgo"
              element={
                <ProtectedRoute permission="view-mapa-riesgo">
                  <MapaRiesgoPage />
                </ProtectedRoute>
              }
            />

            {/* Funciones */}
            <Route
              path="/funciones"
              element={
                <ProtectedRoute permission="view-funciones">
                  <FuncionesPage />
                </ProtectedRoute>
              }
            />
            {/* Subfunciones */}
            <Route
              path="/subfunciones"
              element={
                <ProtectedRoute permission="view-subfunciones">
                  <SubfuncionesPage />
                </ProtectedRoute>
              }
            />

            <Route
              path="/subfunciones/nueva"
              element={
                <ProtectedRoute permission="agregar-subfunciones">
                  <SubfuncionDetallePage />
                </ProtectedRoute>
              }
            />

            <Route
              path="/subfunciones/:id"
              element={
                <ProtectedRoute permission="detalle-subfunciones">
                  <SubfuncionDetallePage />
                </ProtectedRoute>
              }
            />

            <Route
              path="/subfunciones/:id/editar"
              element={
                <ProtectedRoute permission="edit-subfunciones">
                  <SubfuncionDetallePage />
                </ProtectedRoute>
              }
            />

            {/* Actividades Económicas */}
            <Route
              path="/actividades-economicas"
              element={
                <ProtectedRoute permission="view-actividades">
                  <ActividadesEconomicasPage />
                </ProtectedRoute>
              }
            />

            {/* Roles */}
            <Route
              path="/roles"
              element={
                <ProtectedRoute permission="view-roles">
                  <RolesPage />
                </ProtectedRoute>
              }
            />

            <Route
              path="/roles/nuevo"
              element={
                <ProtectedRoute permission="create-roles">
                  <RolFormPage />
                </ProtectedRoute>
              }
            />

            <Route
              path="/roles/:id/editar"
              element={
                <ProtectedRoute permission="edit-roles">
                  <RolFormPage />
                </ProtectedRoute>
              }
            />

            {/* Permisos */}
            <Route
              path="/permisos"
              element={
                <ProtectedRoute permission="view-permisos">
                  <PermisosPage />
                </ProtectedRoute>
              }
            />

            {/* Redirección por defecto */}
            <Route path="*" element={<Navigate to="/dashboard" replace />} />
          </Route>
        </Routes>
      </BrowserRouter>
    </AuthProvider>
  );
}

// Nuevo componente para rutas públicas
function PublicRoute({ children }) {
  const { isAuthenticated, loading, isInitialized } = useAuth();
  const location = useLocation();

  if (!isInitialized || loading) {
    return (
      <div className="flex items-center justify-center h-screen">
        <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  // Rutas que redirigen al dashboard si el usuario ya está logueado
  const redirectIfAuth = ["/login", "/register"];

  if (isAuthenticated && redirectIfAuth.includes(location.pathname)) {
    return <Navigate to="/dashboard" replace />;
  }

  // Todas las demás rutas públicas (ej: /encuesta/...) se muestran normalmente
  return children;
}

export default App;
