// src/pages/UsersPage.jsx
import { useState, useEffect, useMemo } from "react";
import { useAuth } from "../context/AuthContext";
import { User as UserIcon, Plus, Edit, Trash2, RotateCcw } from "lucide-react";
import Button from "../components/Button";
import StatusBadge from "../components/StatusBadge";
import UserModal from "../components/UserModal";
import CustomTable from "../components/CustomTable";
import ConfirmModal from "../components/ConfirmModal";
import { useNotification } from "../hooks/useNotification";
import { useConfirmModal } from "../hooks/useConfirmModal";

export default function UsersPage() {
  const { api } = useAuth();
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [formError, setFormError] = useState("");

  // Notificaciones
  const { 
    showSuccess, 
    showError, 
    showLoading, 
    showApiError,
    dismissToast,
    withLoading 
  } = useNotification();

  // 👇 Modal de confirmación - RENOMBRADO para evitar conflictos
  const { 
    isOpen: isConfirmOpen, 
    config: confirmConfig, 
    showConfirm, 
    closeModal: closeConfirmModal 
  } = useConfirmModal();

  // Modal de usuario
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [currentUser, setCurrentUser] = useState(null);

  // Formulario
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    password_confirmation: "",
    roles: [],
  });

  // Cargar usuarios
  const fetchUsers = async () => {
    try {
      setLoading(true);
      const { data } = await api.get("/users");
      setUsers(Array.isArray(data) ? data : data.data || []);
    } catch (err) {
      console.error("Error al cargar usuarios:", err);
      setError("No se pudieron cargar los usuarios.");
      showError("Error al cargar usuarios", {
        description: "No se pudieron cargar los usuarios.",
        duration: 5000,
      });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  // Abrir modal para crear
  const handleCreate = () => {
    setCurrentUser(null);
    setFormData({
      name: "",
      email: "",
      password: "",
      password_confirmation: "",
      roles: [],
    });
    setFormError("");
    setIsModalOpen(true);
  };

  // Abrir modal para editar
  const handleEdit = (user) => {
    setCurrentUser(user);
    setFormData({
      name: user.name,
      email: user.email,
      password: "",
      password_confirmation: "",
      roles: user.roles ? user.roles.map((r) => r.name) : [],
    });
    setFormError("");
    setIsModalOpen(true);
  };

  // Cerrar modal de usuario
  const closeModal = () => {
    setIsModalOpen(false);
    setCurrentUser(null);
    setFormData({
      name: "",
      email: "",
      password: "",
      password_confirmation: "",
      roles: [],
    });
    setFormError("");
  };

  // Guardar (crear o editar)
  const handleSubmit = async (e) => {
    e.preventDefault();
    const toastId = showLoading(
      currentUser ? "Actualizando usuario..." : "Creando usuario..."
    );
    
    try {
      if (currentUser) {
        await api.put(`/users/${currentUser.id}`, formData);
        showSuccess("Usuario actualizado correctamente", { id: toastId });
      } else {
        await api.post("/users", formData);
        showSuccess("Usuario creado correctamente", { id: toastId });
      }
      closeModal();
      fetchUsers();
    } catch (err) {
      console.error("Error al guardar usuario:", err);
      dismissToast(toastId);
      showApiError(err, "Error al guardar usuario");
    }
  };

  // 🗑️ Eliminar con modal de confirmación
  const handleDelete = (user) => {
    showConfirm({
      title: "Eliminar Usuario",
      message: `¿Estás seguro de eliminar al usuario "${user.name}"? Esta acción no se puede deshacer.`,
      confirmText: "Sí, eliminar",
      cancelText: "Cancelar",
      type: "danger",
      onConfirm: async () => {
        try {
          await withLoading(
            api.delete(`/users/${user.id}`),
            {
              loading: "Eliminando usuario...",
              success: "Usuario eliminado correctamente",
              error: "No se pudo eliminar el usuario",
            }
          );
          fetchUsers();
        } catch (err) {
          // El error ya fue mostrado
        }
      },
    });
  };

  // ♻️ Restaurar con modal de confirmación
  const handleRestore = (user) => {
    showConfirm({
      title: "Restaurar Usuario",
      message: `¿Deseas restaurar al usuario "${user.name}"? Volverá a estar activo en el sistema.`,
      confirmText: "Sí, restaurar",
      cancelText: "Cancelar",
      type: "success",
      onConfirm: async () => {
        try {
          await withLoading(
            api.post(`/users/${user.id}/restore`),
            {
              loading: "Restaurando usuario...",
              success: "Usuario restaurado correctamente",
              error: "No se pudo restaurar el usuario",
            }
          );
          fetchUsers();
        } catch (err) {
          // El error ya fue mostrado
        }
      },
    });
  };

  // Mostrar roles del usuario
  const getRolesList = (user) => {
    if (user.roles && user.roles.length > 0) {
      return user.roles.map((r) => r.name).join(", ");
    }
    return "Sin rol";
  };

  // Definir columnas para la tabla
  const columns = useMemo(
    () => [
      {
        header: "Nombre",
        accessorKey: "name",
        cell: ({ row }) => (
          <div className="flex items-center">
            <UserIcon className="h-5 w-5 text-gray-400 mr-2" />
            <span className="text-sm font-medium text-gray-900">
              {row.original.name}
            </span>
          </div>
        ),
      },
      {
        header: "Email",
        accessorKey: "email",
        cell: ({ row }) => (
          <span className="text-sm text-gray-500">{row.original.email}</span>
        ),
      },
      {
        header: "Rol(es)",
        accessorKey: "roles",
        cell: ({ row }) => (
          <span className="text-sm text-gray-900">
            {getRolesList(row.original)}
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
                  onClick={() => handleEdit(row.original)}
                  className="text-blue-600 hover:text-blue-900 mr-3 p-1"
                  title="Editar"
                >
                  <Edit size={16} />
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
              <button
                onClick={() => handleRestore(row.original)}
                className="text-green-600 hover:text-green-900 p-1"
                title="Restaurar"
              >
                <RotateCcw size={16} />
              </button>
            )}
          </div>
        ),
      },
    ],
    []
  );

  // Componente para vista móvil - Card
  const UserCard = ({ user }) => (
    <div className="bg-white rounded-lg shadow border p-4 mb-4">
      <div className="flex items-start justify-between mb-3">
        <div className="flex items-center">
          <UserIcon className="h-5 w-5 text-gray-400 mr-2" />
          <div>
            <h3 className="font-medium text-gray-900">{user.name}</h3>
            <p className="text-sm text-gray-500">{user.email}</p>
          </div>
        </div>
        <StatusBadge status={user.estado} size="sm" />
      </div>

      <div className="space-y-2 text-sm">
        <div className="flex justify-between">
          <span className="text-gray-500">Rol(es):</span>
          <span className="font-medium max-w-[180px] truncate">
            {getRolesList(user)}
          </span>
        </div>
      </div>

      <div className="flex justify-end mt-4 space-x-2">
        {user.estado ? (
          <>
            <button
              onClick={() => handleEdit(user)}
              className="p-2 text-blue-600 hover:text-blue-900 hover:bg-blue-50 rounded-full transition-colors"
              title="Editar"
            >
              <Edit size={16} />
            </button>
            <button
              onClick={() => handleDelete(user)}
              className="p-2 text-red-600 hover:text-red-900 hover:bg-red-50 rounded-full transition-colors"
              title="Eliminar"
            >
              <Trash2 size={16} />
            </button>
          </>
        ) : (
          <button
            onClick={() => handleRestore(user)}
            className="p-2 text-green-600 hover:text-green-900 hover:bg-green-50 rounded-full transition-colors"
            title="Restaurar"
          >
            <RotateCcw size={16} />
          </button>
        )}
      </div>
    </div>
  );

  return (
    <div className="w-full">
      <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center mb-6 gap-4">
        <h2 className="text-xl font-medium">Gestión de Usuarios</h2>
        <Button
          onClick={handleCreate}
          className="flex items-center gap-2 bg-[#24412f] text-white hover:bg-[#1b2a1f] transition-colors w-full sm:w-auto justify-center"
        >
          <Plus size={18} />
          Nuevo Usuario
        </Button>
      </div>

      {error && (
        <div className="bg-red-100 text-red-700 p-3 rounded mb-4">{error}</div>
      )}

      {loading ? (
        <div className="text-center py-10">Cargando usuarios...</div>
      ) : (
        <>
          {/* Vista móvil - Cards */}
          <div className="md:hidden">
            {users.length === 0 ? (
              <div className="text-center py-10 text-gray-500">
                No hay usuarios disponibles.
              </div>
            ) : (
              <div className="space-y-4">
                {users.map((user) => (
                  <UserCard key={user.id} user={user} />
                ))}
              </div>
            )}
          </div>

          {/* Vista escritorio - Tabla */}
          <div className="hidden md:block">
            <CustomTable data={users} columns={columns} searchable={true} />
          </div>
        </>
      )}

      {/* Modal de Usuario */}
      <UserModal
        isOpen={isModalOpen}
        onClose={closeModal}
        onSubmit={handleSubmit}
        currentUser={currentUser}
        formData={formData}
        setFormData={setFormData}
        formError={formError}
      />

      {/* 👇 Modal de Confirmación - CON NOMBRES RENOMBRADOS */}
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