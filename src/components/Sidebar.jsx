// src/components/Sidebar.jsx
import { Home, Users, Store, X, LogOut, Shapes, BriefcaseBusiness, ShieldCheck, FileLock,FolderOpen,FolderInput, MapPinned } from "lucide-react";
import { NavLink, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import Logo from "./Logo";

export default function Sidebar({ isMobileOpen, setIsMobileOpen }) {
  const { user, logout, hasPermission } = useAuth(); // ← ¡Añadido hasPermission!
  const navigate = useNavigate();

  // Definir menú con permisos
  const menuItems = [
    { name: "Dashboard", icon: <Home size={18} />, path: "/dashboard", permission: "view-dashboard" },
    { name: "Usuarios", icon: <Users size={18} />, path: "/users", permission: "view-users" },
    { name: "Establecimientos", icon: <Store size={18} />, path: "/establecimientos", permission: "view-establecimientos" },
    { name: "Clasificaciones", icon: <Shapes size={18} />, path: "/clasificaciones", permission: "view-clasificaciones" },
    { name: "Mapa de Riesgo", icon: <MapPinned size={18} />, path: "/mapa-riesgo", permission: "view-mapa-riesgo" },
    { name: "Funciones", icon: <FolderOpen size={18} />, path: "/funciones", permission: "view-funciones" },
    { name: "Subfunciones", icon: <FolderInput size={18} />, path: "/subfunciones", permission: "view-subfunciones" },
    { name: "Actividades Economicas", icon: <BriefcaseBusiness size={18} />, path: "/actividades-economicas", permission: "view-actividades" },
    { name: "Roles", icon: <ShieldCheck size={18} />, path: "/roles", permission: "view-roles" },
    { name: "Permisos", icon: <FileLock size={18} />, path: "/permisos", permission: "view-permisos" },
  ];

  // Filtrar ítems según permisos
  const visibleMenuItems = menuItems.filter(item => 
    !item.permission || hasPermission(item.permission)
  );

  const linkStyles = ({ isActive }) =>
    `flex items-center gap-2 px-3 py-2 my-0.5 rounded-md text-sm font-medium transition-colors w-auto mx-2 ${
      isActive
        ? "bg-white text-[#24412f] shadow-md"
        : "text-white hover:bg-white/20 hover:text-white"
    }`;

  const handleLogout = () => {
    logout();
    setIsMobileOpen(false);
    navigate("/login", { replace: true });
  };

  return (
    <>
      {/* Sidebar de escritorio - siempre visible en desktop */}
      <aside className="hidden md:flex md:flex-col md:w-64 bg-gradient-to-b from-[#24412f] to-emerald-700 text-white h-screen sticky top-0">
        {/* Logo */}
        <div className="p-4 mb-6">
          <Logo />
        </div>

        <nav className="flex flex-col mt-2">
          {visibleMenuItems.map((item) => (
            <NavLink key={item.path} to={item.path} className={linkStyles}>
              {item.icon}
              {item.name}
            </NavLink>
          ))}
        </nav>

        {user && (
          <div className="p-4 border-t border-white/20 mt-auto">
            <p className="text-sm mb-2">{user.name}</p>
            <button
              onClick={handleLogout}
              className="flex items-center gap-2 px-3 py-2 bg-white/10 rounded-md hover:bg-white/20 w-full text-sm font-medium transition-colors text-white"
            >
              <LogOut size={18} />
              Cerrar sesión
            </button>
          </div>
        )}
      </aside>

      {/* Sidebar móvil - solo se muestra cuando isMobileOpen es true */}
      {isMobileOpen && (
        <>
          {/* Overlay oscuro */}
          <div
            className="fixed inset-0 bg-black/50 z-40 md:hidden"
            onClick={() => setIsMobileOpen(false)}
          />

          {/* Panel móvil */}
          <aside className="fixed top-0 left-0 h-full w-64 bg-gradient-to-b from-[#24412f] to-emerald-700 text-white flex flex-col p-4 z-50 transform transition-transform duration-300 ease-in-out md:hidden">
            {/* Logo móvil */}
            <div className="mb-6">
              <Logo />
            </div>

            <button
              onClick={() => setIsMobileOpen(false)}
              className="self-end p-2 mb-4 bg-white/10 rounded text-white hover:bg-white/20"
            >
              <X size={20} />
            </button>

            <nav className="flex flex-col">
              {visibleMenuItems.map((item) => (
                <NavLink
                  key={item.path}
                  to={item.path}
                  className={linkStyles}
                  onClick={() => setIsMobileOpen(false)}
                >
                  {item.icon}
                  {item.name}
                </NavLink>
              ))}
            </nav>

            {user && (
              <div className="mt-auto border-t border-white/20 pt-4">
                <p className="text-sm mb-2">{user.name}</p>
                <button
                  onClick={handleLogout}
                  className="flex items-center gap-2 px-3 py-2 bg-white/10 rounded-md hover:bg-white/20 w-full text-sm font-medium transition-colors text-white"
                >
                  <LogOut size={18} />
                  Cerrar sesión
                </button>
              </div>
            )}
          </aside>
        </>
      )}
    </>
  );
}