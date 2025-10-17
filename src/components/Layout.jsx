// src/components/Layout.jsx
import { useState } from "react";
import { Outlet, useLocation } from "react-router-dom";
import Sidebar from "./Sidebar";
import { Menu } from "lucide-react";

export default function Layout() {
  const [isMobileOpen, setIsMobileOpen] = useState(false);
  const location = useLocation();

  const getTitle = () => {
    switch (location.pathname) {
      case "/dashboard":
        return "Dashboard";
      case "/users":
        return "Usuarios";
      case "/profile":
        return "Perfil";
      case "/establecimientos":
        return "Establecimientos";
      case "/clasificaciones":
        return "Clasificaciones";
      case "/clasificaciones/nueva":
        return "Clasificaciones";
      case "/clasificacion/detalle":
        return "Detalle de Clasificación";
      case "/funciones":
        return "Funciones";
      case "/subfunciones":
        return "Subfunciones";
      case "/actividades-economicas":
        return "Actividades Economicas";
      case "/roles":
        return "Roles";
      case "/permisos":
        return "Permisos";
      case "/settings":
        return "Configuración";
      case "/indicadores":
        return "Indicadores";
      default:
        return "Panel Administrativo";
    }
  };

  return (
    <div className="flex h-screen bg-gray-100 overflow-hidden">
      {/* Sidebar - se renderiza una sola vez */}
      <Sidebar isMobileOpen={isMobileOpen} setIsMobileOpen={setIsMobileOpen} />

      {/* Contenido principal */}
      <div className="flex-1 flex flex-col min-w-0 overflow-hidden">
        {/* Header */}
        <header className="flex-shrink-0 bg-white text-black p-4 shadow-md flex items-center justify-between">
          <h1 className="text-2xl font-semibold">{getTitle()}</h1>

          <button
            className="md:hidden p-2 bg-[#24412f] rounded text-white hover:bg-[#1b2a1f]"
            onClick={() => setIsMobileOpen(true)}
          >
            <Menu className="w-5 h-5" />
          </button>
        </header>

        {/* Main content - Aquí está el cambio clave */}
        <main className="flex-1 overflow-y-auto overflow-x-hidden">
          <div className="p-6">
            <Outlet />
          </div>
        </main>
      </div>
    </div>
  );
}