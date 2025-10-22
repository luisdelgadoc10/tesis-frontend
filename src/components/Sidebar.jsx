// src/components/Sidebar.jsx
import {
  Home,
  Users,
  Store,
  X,
  LogOut,
  Shapes,
  BriefcaseBusiness,
  ShieldCheck,
  FileLock,
  FolderOpen,
  FolderInput,
  MapPinned,
} from "lucide-react";
import { NavLink, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import Logo from "./Logo";

export default function Sidebar({ isMobileOpen, setIsMobileOpen }) {
  const { user, logout, hasPermission } = useAuth();
  const navigate = useNavigate();

  // ✅ Menú agrupado por secciones
  const menuGroups = [
    {
      title: "General",
      items: [
        { name: "Dashboard", icon: <Home size={18} />, path: "/dashboard", permission: "view-dashboard" },
        { name: "Mapa de Riesgo", icon: <MapPinned size={18} />, path: "/mapa-riesgo", permission: "view-mapa-riesgo" },
        { name: "Indicadores", icon: <ShieldCheck size={18} />, path: "/indicadores", permission: "view-indicadores" },
        { name: "Satisfacción", icon: <ShieldCheck size={18} />, path: "/satisfaccion", permission: "view-satisfaccion" },
      ],
    },
    {
      title: "Acceso",
      items: [
        { name: "Usuarios", icon: <Users size={18} />, path: "/users", permission: "view-users" },
        { name: "Roles", icon: <ShieldCheck size={18} />, path: "/roles", permission: "view-roles" },
        { name: "Permisos", icon: <FileLock size={18} />, path: "/permisos", permission: "view-permisos" },
      ],
    },
    {
      title: "Gestión",
      items: [        
        { name: "Establecimientos", icon: <Store size={18} />, path: "/establecimientos", permission: "view-establecimientos" },
        { name: "Clasificaciones", icon: <Shapes size={18} />, path: "/clasificaciones", permission: "view-clasificaciones" },
        { name: "Actividades Económicas", icon: <BriefcaseBusiness size={18} />, path: "/actividades-economicas", permission: "view-actividades" },
      ],
    },
    {
      title: "Configuración",
      items: [
        { name: "Funciones", icon: <FolderOpen size={18} />, path: "/funciones", permission: "view-funciones" },
        { name: "Subfunciones", icon: <FolderInput size={18} />, path: "/subfunciones", permission: "view-subfunciones" },
      ],
    },
  ];

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

  // ✅ Render de los grupos de menú
  const renderMenu = () => (
    <div className="flex-1 overflow-y-auto px-1 custom-scroll">
      {menuGroups.map((group) => {
        // Filtrar ítems según permisos
        const visibleItems = group.items.filter(
          (item) => !item.permission || hasPermission(item.permission)
        );

        if (visibleItems.length === 0) return null;

        return (
          <div key={group.title} className="mb-4">
            <h3 className="text-xs uppercase text-white/60 font-semibold px-3 mb-2">
              {group.title}
            </h3>
            {visibleItems.map((item) => (
              <NavLink key={item.path} to={item.path} className={linkStyles}>
                {item.icon}
                {item.name}
              </NavLink>
            ))}
          </div>
        );
      })}
    </div>
  );

  return (
    <>
      {/* Sidebar de escritorio */}
      <aside className="hidden md:flex md:flex-col md:w-64 bg-gradient-to-b from-[#24412f] to-emerald-700 text-white h-screen sticky top-0">
        <div className="p-4">
          <Logo />
        </div>

        {renderMenu()}

        {user && (
          <div className="p-4 border-t border-white/20">
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

      {/* Sidebar móvil */}
      {isMobileOpen && (
        <>
          <div
            className="fixed inset-0 bg-black/50 z-40 md:hidden"
            onClick={() => setIsMobileOpen(false)}
          />
          <aside className="fixed top-0 left-0 h-full w-64 bg-gradient-to-b from-[#24412f] to-emerald-700 text-white flex flex-col z-50 transform transition-transform duration-300 ease-in-out md:hidden">
            <div className="flex items-center justify-between p-4">
              <Logo />
              <button
                onClick={() => setIsMobileOpen(false)}
                className="p-2 bg-white/10 rounded hover:bg-white/20"
              >
                <X size={20} />
              </button>
            </div>

            {renderMenu()}

            {user && (
              <div className="p-4 border-t border-white/20">
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
