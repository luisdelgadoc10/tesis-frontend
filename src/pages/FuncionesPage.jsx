// src/pages/FuncionesPage.jsx
import { useState, useEffect, useMemo } from "react";
import { useAuth } from "../context/AuthContext";
import { Settings2, Plus, Edit, Trash2, RotateCcw } from "lucide-react";
import { useNavigate } from "react-router-dom";
import Button from "../components/Button";
import StatusBadge from "../components/StatusBadge";
import FuncionModal from "../components/FuncionModal";
import ConfirmModal from "../components/ConfirmModal";
import { useNotification } from "../hooks/useNotification";
import { useConfirmModal } from "../hooks/useConfirmModal";
import CustomTable from "../components/CustomTable"; // Importar el nuevo componente

export default function FuncionesPage() {
  const { api } = useAuth();
  const navigate = useNavigate();
  const [funciones, setFunciones] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [formError, setFormError] = useState("");

  // Notificaciones
  const {
    showSuccess,
    showError,
    showLoading,
    dismissToast,
    showApiError,
    withLoading,
  } = useNotification();

  // Modal de confirmación
  const {
    isOpen: isConfirmOpen,
    config: confirmConfig,
    showConfirm,
    closeModal: closeConfirmModal,
  } = useConfirmModal();

  // Modal de función
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [currentFuncion, setCurrentFuncion] = useState(null);

  // Formulario
  const [formData, setFormData] = useState({
    nombre: "",
  });

  // Cargar funciones
  const fetchFunciones = async () => {
    try {
      setLoading(true);
      const { data } = await api.get("/funciones");
      setFunciones(Array.isArray(data) ? data : data.data || []);
    } catch (err) {
      console.error("Error al cargar funciones:", err);
      setError("No se pudieron cargar las funciones.");
      showError("Error al cargar funciones", {
        description: "No se pudieron cargar las funciones.",
        duration: 5000,
      });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchFunciones();
  }, []);

  // Abrir modal para crear
  const handleCreate = () => {
    setCurrentFuncion(null);
    setFormData({
      nombre: "",
    });
    setFormError("");
    setIsModalOpen(true);
  };

  // Abrir modal para editar
  const handleEdit = (funcion) => {
    setCurrentFuncion(funcion);
    setFormData({
      nombre: funcion.nombre,
    });
    setFormError("");
    setIsModalOpen(true);
  };

  // Cerrar modal
  const closeModal = () => {
    setIsModalOpen(false);
    setCurrentFuncion(null);
    setFormData({
      nombre: "",
    });
    setFormError("");
  };

  // Guardar (crear o editar)
  const handleSubmit = async (e) => {
    e.preventDefault();
    setFormError("");

    const toastId = showLoading(
      currentFuncion ? "Actualizando función..." : "Creando función..."
    );

    try {
      if (currentFuncion) {
        await api.put(`/funciones/${currentFuncion.id}`, formData);
        showSuccess("Función actualizada correctamente", { id: toastId });
      } else {
        await api.post("/funciones", formData);
        showSuccess("Función creada correctamente", { id: toastId });
      }
      closeModal();
      fetchFunciones();
    } catch (err) {
      console.error("Error al guardar función:", err);
      dismissToast(toastId);
      showApiError(err, "Error al guardar función");

      // También mostrar en el formulario
      if (err.response?.data?.errors) {
        const firstError = Object.values(err.response.data.errors)[0][0];
        setFormError(firstError);
      } else if (err.response?.data?.message) {
        setFormError(err.response.data.message);
      } else {
        setFormError("Error desconocido. Intente nuevamente.");
      }
    }
  };

  // Eliminar con modal de confirmación
  const handleDelete = (funcion) => {
    showConfirm({
      title: "Eliminar Función",
      message: `¿Estás seguro de eliminar la función "${funcion.nombre}"? Esta acción no se puede deshacer.`,
      confirmText: "Sí, eliminar",
      cancelText: "Cancelar",
      type: "danger",
      onConfirm: async () => {
        try {
          await withLoading(api.delete(`/funciones/${funcion.id}`), {
            loading: "Eliminando función...",
            success: "Función eliminada correctamente",
            error: "No se pudo eliminar la función",
          });
          fetchFunciones();
        } catch (err) {
          // El error ya fue mostrado
        }
      },
    });
  };

  // Restaurar con modal de confirmación
  const handleRestore = (funcion) => {
    showConfirm({
      title: "Restaurar Función",
      message: `¿Deseas restaurar la función "${funcion.nombre}"? Volverá a estar activa en el sistema.`,
      confirmText: "Sí, restaurar",
      cancelText: "Cancelar",
      type: "success",
      onConfirm: async () => {
        try {
          await withLoading(api.post(`/funciones/${funcion.id}/restore`), {
            loading: "Restaurando función...",
            success: "Función restaurada correctamente",
            error: "No se pudo restaurar la función",
          });
          fetchFunciones();
        } catch (err) {
          // El error ya fue mostrado
        }
      },
    });
  };

  // Definir columnas para la tabla personalizada
  const columns = useMemo(() => [
    {
      header: 'Nombre',
      accessorKey: 'nombre',
      cell: ({ row }) => (
        <div className="flex items-center">
          <Settings2 className="h-5 w-5 text-gray-400 mr-2" />
          <span className="text-sm font-medium text-gray-900">
            {row.original.nombre || "—"}
          </span>
        </div>
      ),
    },
    {
      header: 'Estado',
      accessorKey: 'estado',
      cell: ({ row }) => (
        <StatusBadge status={row.original.estado} size="sm" />
      ),
    },
    {
      header: 'Acciones',
      cell: ({ row }) => (
        <div className="flex items-center space-x-2">
          {row.original.estado ? (
            <>
              <button
                onClick={() => handleEdit(row.original)}
                className="text-blue-600 hover:text-blue-900 p-1"
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
  ], []);

  // Componente para vista móvil - Card
  const FuncionCard = ({ funcion }) => (
    <div className="bg-white rounded-lg shadow border p-4 mb-4">
      <div className="flex items-start justify-between mb-3">
        <div className="flex items-center">
          <Settings2 className="h-5 w-5 text-gray-400 mr-2" />
          <div>
            <h3 className="font-medium text-gray-900">{funcion.nombre}</h3>
          </div>
        </div>
        <StatusBadge status={funcion.estado} size="sm" />
      </div>

      <div className="flex justify-end mt-4 space-x-2">
        {funcion.estado ? (
          <>
            <button
              onClick={() => handleEdit(funcion)}
              className="p-2 text-blue-600 hover:text-blue-900 hover:bg-blue-50 rounded-full transition-colors"
              title="Editar"
            >
              <Edit size={16} />
            </button>
            <button
              onClick={() => handleDelete(funcion)}
              className="p-2 text-red-600 hover:text-red-900 hover:bg-red-50 rounded-full transition-colors"
              title="Eliminar"
            >
              <Trash2 size={16} />
            </button>
          </>
        ) : (
          <button
            onClick={() => handleRestore(funcion)}
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
        <h2 className="text-xl font-medium">Gestión de Funciones</h2>
        <Button
          onClick={handleCreate}
          className="flex items-center gap-2 bg-[#24412f] text-white hover:bg-[#1b2a1f] transition-colors w-full sm:w-auto justify-center"
        >
          <Plus size={18} />
          Nueva Función
        </Button>
      </div>

      {error && (
        <div className="bg-red-100 text-red-700 p-3 rounded mb-4">{error}</div>
      )}

      {loading ? (
        <div className="text-center py-10">Cargando funciones...</div>
      ) : (
        <>
          {/* Vista móvil - Cards */}
          <div className="md:hidden">
            {funciones.length === 0 ? (
              <div className="text-center py-10 text-gray-500">
                No hay funciones disponibles.
              </div>
            ) : (
              <div className="space-y-4">
                {funciones.map((funcion) => (
                  <FuncionCard 
                    key={funcion.id} 
                    funcion={funcion} 
                  />
                ))}
              </div>
            )}
          </div>

          {/* Vista escritorio - Tabla personalizada con CustomTable */}
          <div className="hidden md:block">
            <CustomTable 
              data={funciones} 
              columns={columns} 
              searchable={true}
            />
          </div>
        </>
      )}

      {/* Modal de Función */}
      <FuncionModal
        isOpen={isModalOpen}
        onClose={closeModal}
        onSubmit={handleSubmit}
        currentFuncion={currentFuncion}
        formData={formData}
        setFormData={setFormData}
        formError={formError}
      />

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