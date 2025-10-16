// src/pages/RolesPage.jsx
import { useState, useEffect, useMemo } from "react";
import { useAuth } from "../context/AuthContext";
import { Shield, Plus, Edit, Trash2, RotateCcw, ToggleLeft, ToggleRight } from "lucide-react";
import { useNavigate } from "react-router-dom";
import Button from "../components/Button";
import StatusBadge from "../components/StatusBadge";
import CustomTable from "../components/CustomTable";
import ConfirmModal from "../components/ConfirmModal";
import { useNotification } from "../hooks/useNotification";
import { useConfirmModal } from "../hooks/useConfirmModal";

export default function RolesPage() {
  const { api } = useAuth();
  const navigate = useNavigate();
  const [roles, setRoles] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Notificaciones
  const { showSuccess, showError, withLoading } = useNotification();

  // Modal de confirmación
  const {
    isOpen: isConfirmOpen,
    config: confirmConfig,
    showConfirm,
    closeModal: closeConfirmModal,
  } = useConfirmModal();

  // Cargar roles
  const fetchRoles = async () => {
    try {
      setLoading(true);
      const { data } = await api.get("/roles");
      setRoles(Array.isArray(data) ? data : data.data || []);
    } catch (err) {
      console.error("Error al cargar roles:", err);
      setError("No se pudieron cargar los roles.");
      showError("Error al cargar roles", {
        description: "No se pudieron cargar los roles.",
        duration: 5000,
      });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchRoles();
  }, []);

  // Crear nuevo rol
  const handleCreate = () => {
    navigate("/roles/nuevo");
  };

  // Editar rol
  const handleEdit = (id) => {
    navigate(`/roles/${id}/editar`);
  };

  // Eliminar con modal de confirmación
  const handleDelete = (role) => {
    showConfirm({
      title: "Eliminar Rol",
      message: `¿Estás seguro de eliminar el rol "${role.name}"? Esta acción no se puede deshacer.`,
      confirmText: "Sí, eliminar",
      cancelText: "Cancelar",
      type: "danger",
      onConfirm: async () => {
        try {
          await withLoading(api.delete(`/roles/${role.id}`), {
            loading: "Eliminando rol...",
            success: "Rol eliminado correctamente",
            error: "No se pudo eliminar el rol",
          });
          fetchRoles();
        } catch (err) {
          // El error ya fue mostrado
        }
      },
    });
  };

  // Restaurar con modal de confirmación
  const handleRestore = (role) => {
    showConfirm({
      title: "Restaurar Rol",
      message: `¿Deseas restaurar el rol "${role.name}"? Volverá a estar disponible en el sistema.`,
      confirmText: "Sí, restaurar",
      cancelText: "Cancelar",
      type: "success",
      onConfirm: async () => {
        try {
          await withLoading(api.patch(`/roles/${role.id}/restore`), {
            loading: "Restaurando rol...",
            success: "Rol restaurado correctamente",
            error: "No se pudo restaurar el rol",
          });
          fetchRoles();
        } catch (err) {
          // El error ya fue mostrado
        }
      },
    });
  };

  // Activar con modal de confirmación
  const handleActivate = (role) => {
    showConfirm({
      title: "Activar Rol",
      message: `¿Estás seguro de activar el rol "${role.name}"?`,
      confirmText: "Sí, activar",
      cancelText: "Cancelar",
      type: "success",
      onConfirm: async () => {
        try {
          await withLoading(api.patch(`/roles/${role.id}/activate`), {
            loading: "Activando rol...",
            success: "Rol activado correctamente",
            error: "No se pudo activar el rol",
          });
          fetchRoles();
        } catch (err) {
          // El error ya fue mostrado
        }
      },
    });
  };

  // Desactivar con modal de confirmación
  const handleDeactivate = (role) => {
    showConfirm({
      title: "Desactivar Rol",
      message: `¿Estás seguro de desactivar el rol "${role.name}"? Los usuarios con este rol no podrán acceder a sus funciones.`,
      confirmText: "Sí, desactivar",
      cancelText: "Cancelar",
      type: "warning",
      onConfirm: async () => {
        try {
          await withLoading(api.patch(`/roles/${role.id}/deactivate`), {
            loading: "Desactivando rol...",
            success: "Rol desactivado correctamente",
            error: "No se pudo desactivar el rol",
          });
          fetchRoles();
        } catch (err) {
          // El error ya fue mostrado
        }
      },
    });
  };

  // Definir columnas para la tabla personalizada
  const columns = useMemo(
    () => [
      {
        header: "Nombre",
        accessorKey: "name",
        cell: ({ row }) => (
          <div className="flex items-center">
            <Shield className="h-5 w-5 text-gray-400 mr-2" />
            <span className="text-sm font-medium text-gray-900">
              {row.original.name}
            </span>
          </div>
        ),
      },
      {
        header: "Descripción",
        accessorKey: "descripcion",
        cell: ({ row }) => (
          <span className="text-sm text-gray-500">
            {row.original.descripcion || "—"}
          </span>
        ),
      },
      {
        header: "Estado",
        accessorKey: "estado",
        cell: ({ row }) => (
          <StatusBadge status={row.original.estado} size="sm" />
        ),
      },
      {
        header: "Acciones",
        cell: ({ row }) => (
          <div className="flex items-center">
            {row.original.estado ? (
              <>
                <button
                  onClick={() => handleEdit(row.original.id)}
                  className="text-blue-600 hover:text-blue-900 mr-3 p-1"
                  title="Editar"
                >
                  <Edit size={16} />
                </button>
                <button
                  onClick={() => handleDeactivate(row.original)}
                  className="text-yellow-600 hover:text-yellow-900 mr-3 p-1"
                  title="Desactivar"
                >
                  <ToggleLeft size={16} />
                </button>
                <button
                  onClick={() => handleDelete(row.original)}
                  className="text-red-600 hover:text-red-900 p-1"
                  title="Eliminar"
                >
                  <Trash2 size={16} />
                </button>
              </>
            ) : (
              <>
                <button
                  onClick={() => handleActivate(row.original)}
                  className="text-green-600 hover:text-green-900 mr-3 p-1"
                  title="Activar"
                >
                  <ToggleRight size={16} />
                </button>
                <button
                  onClick={() => handleRestore(row.original)}
                  className="text-gray-600 hover:text-gray-900 p-1"
                  title="Restaurar"
                >
                  <RotateCcw size={16} />
                </button>
              </>
            )}
          </div>
        ),
      },
    ],
    []
  );

  // Componente para vista móvil - Card
  const RoleCard = ({ role }) => (
    <div className="bg-white rounded-lg shadow border p-4 mb-4">
      <div className="flex items-start justify-between mb-3">
        <div className="flex items-center">
          <Shield className="h-5 w-5 text-gray-400 mr-2" />
          <div>
            <h3 className="font-medium text-gray-900">{role.name}</h3>
            <p className="text-sm text-gray-500">
              {role.descripcion || "Sin descripción"}
            </p>
          </div>
        </div>
        <StatusBadge status={role.estado} size="sm" />
      </div>

      <div className="flex justify-end mt-4 space-x-2">
        {role.estado ? (
          <>
            <button
              onClick={() => handleEdit(role.id)}
              className="p-2 text-blue-600 hover:text-blue-900 hover:bg-blue-50 rounded-full transition-colors"
              title="Editar"
            >
              <Edit size={16} />
            </button>
            <button
              onClick={() => handleDeactivate(role)}
              className="p-2 text-yellow-600 hover:text-yellow-900 hover:bg-yellow-50 rounded-full transition-colors"
              title="Desactivar"
            >
              <ToggleLeft size={16} />
            </button>
            <button
              onClick={() => handleDelete(role)}
              className="p-2 text-red-600 hover:text-red-900 hover:bg-red-50 rounded-full transition-colors"
              title="Eliminar"
            >
              <Trash2 size={16} />
            </button>
          </>
        ) : (
          <>
            <button
              onClick={() => handleActivate(role)}
              className="p-2 text-green-600 hover:text-green-900 hover:bg-green-50 rounded-full transition-colors"
              title="Activar"
            >
              <ToggleRight size={16} />
            </button>
            <button
              onClick={() => handleRestore(role)}
              className="p-2 text-gray-600 hover:text-gray-900 hover:bg-gray-50 rounded-full transition-colors"
              title="Restaurar"
            >
              <RotateCcw size={16} />
            </button>
          </>
        )}
      </div>
    </div>
  );

  return (
    <div className="w-full">
      <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center mb-6 gap-4">
        <h2 className="text-xl font-medium">Gestión de Roles</h2>
        <Button
          onClick={handleCreate}
          className="flex items-center gap-2 bg-[#24412f] text-white hover:bg-[#1b2a1f] transition-colors w-full sm:w-auto justify-center"
        >
          <Plus size={18} />
          Nuevo Rol
        </Button>
      </div>

      {error && (
        <div className="bg-red-100 text-red-700 p-3 rounded mb-4">{error}</div>
      )}

      {loading ? (
        <div className="text-center py-10">Cargando roles...</div>
      ) : (
        <>
          {/* Vista móvil - Cards */}
          <div className="md:hidden">
            {roles.length === 0 ? (
              <div className="text-center py-10 text-gray-500">
                No hay roles disponibles.
              </div>
            ) : (
              <div className="space-y-4">
                {roles.map((role) => (
                  <RoleCard key={role.id} role={role} />
                ))}
              </div>
            )}
          </div>

          {/* Vista escritorio - Tabla personalizada con CustomTable */}
          <div className="hidden md:block">
            <CustomTable data={roles} columns={columns} searchable={true} />
          </div>
        </>
      )}

      {/* Modal de Confirmación */}
      <ConfirmModal
        isOpen={isConfirmOpen}
        onClose={closeConfirmModal}
        onConfirm={confirmConfig.onConfirm}
        title={confirmConfig.title}
        message={confirmConfig.message}
        confirmText={confirmConfig.confirmText}
        cancelText={confirmConfig.cancelText}
        type={confirmConfig.type}
      />
    </div>
  );
}