// src/components/UserModal.jsx
import { X } from "lucide-react";
import { useState, useEffect } from "react";
import Button from "./Button";
import { useAuth } from "../context/AuthContext";
import CustomCheckbox from "./CustomCheckbox"; // Importar el nuevo componente

export default function UserModal({
  isOpen,
  onClose,
  onSubmit,
  currentUser,
  formData,
  setFormData,
  formError,
}) {
  const { api } = useAuth();
  const [roles, setRoles] = useState([]);
  const [loadingRoles, setLoadingRoles] = useState(false);

  // Cargar roles al abrir el modal
  useEffect(() => {
    if (isOpen) {
      setLoadingRoles(true);
      api.get("/roles")
        .then((response) => {
          const rolesData = Array.isArray(response.data) ? response.data : response.data.data || [];
          setRoles(rolesData.filter(r => r.estado === 1)); // Solo roles activos
        })
        .catch((err) => {
          console.error("Error al cargar roles:", err);
          setRoles([]);
        })
        .finally(() => {
          setLoadingRoles(false);
        });
    }
  }, [isOpen, api]);

  // Manejar selección de roles
  const toggleRole = (roleName) => {
    setFormData(prev => {
      const currentRoles = prev.roles || [];
      const isSelected = currentRoles.includes(roleName);
      const newRoles = isSelected
        ? currentRoles.filter(r => r !== roleName)
        : [...currentRoles, roleName];
      return { ...prev, roles: newRoles };
    });
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-lg max-w-md w-full">
        <div className="flex items-center justify-between p-6 border-b">
          <h3 className="text-lg font-medium">
            {currentUser ? "Editar Usuario" : "Nuevo Usuario"}
          </h3>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600 transition-colors"
          >
            <X size={20} />
          </button>
        </div>

        <form onSubmit={onSubmit} className="p-6 space-y-6">
          {formError && (
            <div className="bg-red-100 text-red-700 p-3 rounded text-sm">
              {formError}
            </div>
          )}

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Nombre *
            </label>
            <input
              type="text"
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#24412f] focus:border-transparent"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Email *
            </label>
            <input
              type="email"
              value={formData.email}
              onChange={(e) => setFormData({ ...formData, email: e.target.value })}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#24412f] focus:border-transparent"
              required
            />
          </div>

          {/* Roles - ahora con checkboxes personalizados */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Roles *
            </label>
            {loadingRoles ? (
              <div className="text-sm text-gray-500">Cargando roles...</div>
            ) : roles.length === 0 ? (
              <div className="text-sm text-gray-500">No hay roles activos disponibles.</div>
            ) : (
              <div className="space-y-2 max-h-40 overflow-y-auto p-2 border border-gray-200 rounded-md">
                {roles.map((role) => (
                  <CustomCheckbox
                    key={role.id}
                    checked={formData.roles?.includes(role.name)}
                    onChange={() => toggleRole(role.name)}
                    label={role.name}
                    className="p-2 hover:bg-gray-50 rounded transition-colors w-full"
                  />
                ))}
              </div>
            )}
          </div>

          {/* Contraseña (solo en creación) */}
          {!currentUser && (
            <>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Contraseña *
                </label>
                <input
                  type="password"
                  value={formData.password}
                  onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#24412f] focus:border-transparent"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Confirmar Contraseña *
                </label>
                <input
                  type="password"
                  value={formData.password_confirmation}
                  onChange={(e) => setFormData({ ...formData, password_confirmation: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#24412f] focus:border-transparent"
                  required
                />
              </div>
            </>
          )}

          <div className="flex justify-end space-x-3 pt-4">
            <Button
              type="button"
              onClick={onClose}
              className="text-gray-600 bg-gray-500 hover:bg-gray-800 transition"
            >
              Cancelar
            </Button>
            <Button
              type="submit"
              className="px-4 py-2 bg-[#24412f] text-white hover:bg-[#1b2a1f] rounded-md transition-colors"
            >
              {currentUser ? "Actualizar" : "Crear"}
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
}