// src/pages/EstablecimientosPage.jsx
import { useState, useEffect, useMemo } from "react";
import { useAuth } from "../context/AuthContext";
import { Building2, Plus, Edit, Trash2, RotateCcw, Eye } from "lucide-react";
import { useNavigate } from "react-router-dom";
import Button from "../components/Button";
import StatusBadge from "../components/StatusBadge";
import CustomTable from "../components/CustomTable";
import ConfirmModal from "../components/ConfirmModal";
import { useNotification } from "../hooks/useNotification";
import { useConfirmModal } from "../hooks/useConfirmModal";

export default function EstablecimientosPage() {
  const { api } = useAuth();
  const navigate = useNavigate();
  const [establecimientos, setEstablecimientos] = useState([]);
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

  // Cargar establecimientos
  const fetchEstablecimientos = async () => {
    try {
      setLoading(true);
      const { data } = await api.get("/establecimientos");
      setEstablecimientos(Array.isArray(data) ? data : data.data || []);
    } catch (err) {
      console.error("Error al cargar establecimientos:", err);
      setError("No se pudieron cargar los establecimientos.");
      showError("Error al cargar establecimientos", {
        description: "No se pudieron cargar los establecimientos.",
        duration: 5000,
      });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchEstablecimientos();
  }, []);

  // Eliminar con modal de confirmación
  const handleDelete = (establecimiento) => {
    showConfirm({
      title: "Eliminar Establecimiento",
      message: `¿Estás seguro de eliminar "${establecimiento.nombre_comercial}"? Esta acción no se puede deshacer.`,
      confirmText: "Sí, eliminar",
      cancelText: "Cancelar",
      type: "danger",
      onConfirm: async () => {
        try {
          await withLoading(
            api.delete(`/establecimientos/${establecimiento.id}`),
            {
              loading: "Eliminando establecimiento...",
              success: "Establecimiento eliminado correctamente",
              error: "No se pudo eliminar el establecimiento",
            }
          );
          fetchEstablecimientos();
        } catch (err) {
          // El error ya fue mostrado
        }
      },
    });
  };

  // Restaurar con modal de confirmación
  const handleRestore = (establecimiento) => {
    showConfirm({
      title: "Restaurar Establecimiento",
      message: `¿Deseas restaurar "${establecimiento.nombre_comercial}"? Volverá a estar activo en el sistema.`,
      confirmText: "Sí, restaurar",
      cancelText: "Cancelar",
      type: "success",
      onConfirm: async () => {
        try {
          await withLoading(
            api.patch(`/establecimientos/${establecimiento.id}/restore`),
            {
              loading: "Restaurando establecimiento...",
              success: "Establecimiento restaurado correctamente",
              error: "No se pudo restaurar el establecimiento",
            }
          );
          fetchEstablecimientos();
        } catch (err) {
          // El error ya fue mostrado
        }
      },
    });
  };

  const EstablecimientoCard = ({ establecimiento }) => (
    <div className="bg-white rounded-lg shadow border p-4 mb-4">
      <div className="flex items-start justify-between mb-3">
        <div className="flex items-center">
          <Building2 className="h-5 w-5 text-gray-400 mr-2" />
          <div>
            <h3 className="font-medium text-gray-900">
              {establecimiento.nombre_comercial}
            </h3>
            <p className="text-sm text-gray-500">
              {establecimiento.razon_social}
            </p>
          </div>
        </div>
        <StatusBadge status={establecimiento.estado} />
      </div>

      <div className="space-y-2 text-sm">
        <div className="flex justify-between">
          <span className="text-gray-500">RUC:</span>
          <span className="font-medium">{establecimiento.ruc}</span>
        </div>
        <div className="flex justify-between">
          <span className="text-gray-500">Propietario:</span>
          <span className="font-medium">{establecimiento.propietario}</span>
        </div>
        <div className="flex justify-between">
          <span className="text-gray-500">Teléfono:</span>
          <span className="font-medium">{establecimiento.telefono}</span>
        </div>
      </div>

      <div className="flex justify-end mt-4 space-x-2">
        <button
          onClick={() => navigate(`/establecimientos/${establecimiento.id}`)}
          className="p-2 text-gray-600 hover:text-gray-900 hover:bg-gray-50 rounded-full transition-colors"
          title="Ver detalle"
        >
          <Eye size={16} />
        </button>

        {establecimiento.estado ? (
          <>
            <button
              onClick={() =>
                navigate(`/establecimientos/${establecimiento.id}/editar`)
              }
              className="p-2 text-blue-600 hover:text-blue-900 hover:bg-blue-50 rounded-full transition-colors"
              title="Editar"
            >
              <Edit size={16} />
            </button>
            <button
              onClick={() => handleDelete(establecimiento)}
              className="p-2 text-red-600 hover:text-red-900 hover:bg-red-50 rounded-full transition-colors"
              title="Eliminar"
            >
              <Trash2 size={16} />
            </button>
          </>
        ) : (
          <button
            onClick={() => handleRestore(establecimiento)}
            className="p-2 text-green-600 hover:text-green-900 hover:bg-green-50 rounded-full transition-colors"
            title="Restaurar"
          >
            <RotateCcw size={16} />
          </button>
        )}
      </div>
    </div>
  );

  // Definir columnas para la tabla personalizada
  const columns = useMemo(
    () => [
      {
        header: "Establecimiento",
        accessorKey: "nombre_comercial",
        cell: ({ row }) => (
          <div className="flex items-center">
            <Building2 className="h-5 w-5 text-gray-400 mr-2" />
            <div>
              <div className="text-sm font-medium text-gray-900">
                {row.original.nombre_comercial}
              </div>
              <div className="text-sm text-gray-500">
                {row.original.razon_social}
              </div>
            </div>
          </div>
        ),
      },
      {
        header: "RUC",
        accessorKey: "ruc",
        cell: ({ row }) => (
          <span className="text-sm text-gray-900">{row.original.ruc}</span>
        ),
      },
      {
        header: "Propietario",
        accessorKey: "propietario",
        cell: ({ row }) => (
          <span className="text-sm text-gray-900">
            {row.original.propietario}
          </span>
        ),
      },
      {
        header: "Teléfono",
        accessorKey: "telefono",
        cell: ({ row }) => (
          <span className="text-sm text-gray-900">{row.original.telefono}</span>
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
            <button
              onClick={() =>
                navigate(`/establecimientos/${row.original.id}`)
              }
              className="text-gray-600 hover:text-gray-900 mr-3 p-1"
              title="Ver detalle"
            >
              <Eye size={16} />
            </button>

            {row.original.estado ? (
              <>
                <button
                  onClick={() =>
                    navigate(`/establecimientos/${row.original.id}/editar`)
                  }
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

  return (
    <div className="w-full">
      <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center mb-6 gap-4">
        <h2 className="text-xl font-medium">Gestión de Establecimientos</h2>
        <Button
          onClick={() => navigate("/establecimientos/nuevo")}
          className="flex items-center gap-2 bg-[#24412f] text-white hover:bg-[#1b2a1f] transition-colors w-full sm:w-auto justify-center"
        >
          <Plus size={18} />
          Nuevo Establecimiento
        </Button>
      </div>

      {error && (
        <div className="bg-red-100 text-red-700 p-3 rounded mb-4">{error}</div>
      )}

      {loading ? (
        <div className="text-center py-10">Cargando establecimientos...</div>
      ) : (
        <>
          <div className="md:hidden">
            {establecimientos.length === 0 ? (
              <div className="text-center py-10 text-gray-500">
                No hay establecimientos disponibles.
              </div>
            ) : (
              <div className="space-y-4">
                {establecimientos.map((establecimiento) => (
                  <EstablecimientoCard
                    key={establecimiento.id}
                    establecimiento={establecimiento}
                  />
                ))}
              </div>
            )}
          </div>

          <div className="hidden md:block">
            <CustomTable
              data={establecimientos}
              columns={columns}
              searchable={true}
            />
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