// src/pages/ActividadesEconomicasPage.jsx
import { useState, useEffect, useMemo } from "react";
import { useAuth } from "../context/AuthContext";
import {
  Briefcase,
  Plus,
  Edit,
  Trash2,
  RotateCcw,
  Eye,
  X,
} from "lucide-react";
import { useNavigate } from "react-router-dom";
import Button from "../components/Button";
import ActividadEconomicaModal from "../components/ActividadEconomicaModal";
import StatusBadge from "../components/StatusBadge";
import CustomTable from "../components/CustomTable"; // Importar el nuevo componente

export default function ActividadesEconomicasPage() {
  const { api } = useAuth();
  const navigate = useNavigate();
  const [actividades, setActividades] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [formError, setFormError] = useState("");

  // Modal de edición/creación
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [currentActividad, setCurrentActividad] = useState(null);

  // Modal de detalle
  const [isDetailModalOpen, setIsDetailModalOpen] = useState(false);
  const [selectedActividad, setSelectedActividad] = useState(null);

  // Formulario
  const [formData, setFormData] = useState({
    descripcion: "",
    funcion_id: "",
  });

  // Cargar actividades
  const fetchActividades = async () => {
    try {
      setLoading(true);
      const { data } = await api.get("/actividades");
      setActividades(Array.isArray(data) ? data : data.data || []);
    } catch (err) {
      console.error("Error al cargar actividades económicas:", err);
      setError("No se pudieron cargar las actividades económicas.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchActividades();
  }, []);

  // Abrir modal para crear
  const handleCreate = () => {
    setCurrentActividad(null);
    setFormData({
      descripcion: "",
      funcion_id: "",
    });
    setFormError("");
    setIsModalOpen(true);
  };

  // Abrir modal para editar
  const handleEdit = (actividad) => {
    setCurrentActividad(actividad);
    setFormData({
      descripcion: actividad.descripcion,
      funcion_id: actividad.funcion_id,
    });
    setFormError("");
    setIsModalOpen(true);
  };

  // Abrir modal de detalle
  const handleViewDetail = (actividad) => {
    setSelectedActividad(actividad);
    setIsDetailModalOpen(true);
  };

  // Cerrar modales
  const closeModal = () => {
    setIsModalOpen(false);
    setCurrentActividad(null);
    setFormData({
      descripcion: "",
      funcion_id: "",
    });
    setFormError("");
  };

  const closeDetailModal = () => {
    setIsDetailModalOpen(false);
    setSelectedActividad(null);
  };

  // Guardar (crear o editar)
  const handleSubmit = async (e) => {
    e.preventDefault();
    setFormError("");

    try {
      if (currentActividad) {
        await api.put(`/actividades/${currentActividad.id}`, formData);
      } else {
        await api.post("/actividades", formData);
      }
      closeModal();
      fetchActividades();
    } catch (err) {
      console.error("Error al guardar actividad económica:", err);
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

  // Eliminar
  const handleDelete = async (id) => {
    if (!window.confirm("¿Estás seguro de eliminar esta actividad económica?"))
      return;

    try {
      await api.delete(`/actividades/${id}`);
      fetchActividades();
    } catch (err) {
      console.error("Error al eliminar actividad económica:", err);
      alert("No se pudo eliminar la actividad económica.");
    }
  };

  // Restaurar
  const handleRestore = async (id) => {
    if (!window.confirm("¿Estás seguro de restaurar esta actividad económica?"))
      return;

    try {
      await api.post(`/actividades/${id}/restore`);
      fetchActividades();
    } catch (err) {
      console.error("Error al restaurar actividad económica:", err);
      alert("No se pudo restaurar la actividad económica.");
    }
  };

  // Definir columnas para la tabla personalizada
  const columns = useMemo(() => [
    {
      header: 'Descripción',
      accessorKey: 'descripcion',
      cell: ({ row }) => (
        <span className="text-sm text-gray-500 truncate block max-w-xs">
          {row.original.descripcion}
        </span>
      ),
    },
    {
      header: 'Función',
      accessorKey: 'funcion.nombre',
      cell: ({ row }) => (
        <span className="text-sm text-gray-900">
          {row.original.funcion?.nombre || "—"}
        </span>
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
        <div className="flex space-x-2 items-center">
          <button
            onClick={() => handleViewDetail(row.original)}
            className="p-2 text-gray-600 hover:text-gray-900 hover:bg-gray-50 rounded-full transition-colors"
            title="Ver detalle"
          >
            <Eye size={16} />
          </button>
          {row.original.estado ? (
            <>
              <button
                onClick={() => handleEdit(row.original)}
                className="p-2 text-blue-600 hover:text-blue-900 hover:bg-blue-50 rounded-full transition-colors"
                title="Editar"
              >
                <Edit size={16} />
              </button>
              <button
                onClick={() => handleDelete(row.original.id)}
                className="p-2 text-red-600 hover:text-red-900 hover:bg-red-50 rounded-full transition-colors"
                title="Eliminar"
              >
                <Trash2 size={16} />
              </button>
            </>
          ) : (
            <button
              onClick={() => handleRestore(row.original.id)}
              className="p-2 text-green-600 hover:text-green-900 hover:bg-green-50 rounded-full transition-colors"
              title="Restaurar"
            >
              <RotateCcw size={16} />
            </button>
          )}
        </div>
      ),
    },
  ], []);

  // ✅ Modal de Detalle — solo texto, sin inputs
  const ActividadDetailModal = ({ isOpen, onClose, actividad }) => {
    if (!isOpen || !actividad) return null;

    return (
      <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
        <div className="bg-white rounded-lg max-w-2xl w-full max-h-[90vh] overflow-y-auto">
          <div className="flex items-center justify-between p-6 border-b">
            <h3 className="text-lg font-medium">
              Detalle de Actividad Económica
            </h3>
            <button
              onClick={onClose}
              className="text-gray-400 hover:text-gray-600 transition-colors"
            >
              <X size={20} />
            </button>
          </div>

          <div className="p-6 space-y-6">
            <div>
              <h4 className="text-sm font-semibold text-gray-700 mb-1">
                Estado
              </h4>
              <div className="inline-block">
                <StatusBadge status={actividad.estado} size="sm" />
              </div>
            </div>
            <div>
              <h4 className="text-sm font-semibold text-gray-700 mb-1">
                Descripción
              </h4>
              <p className="text-gray-900 bg-gray-50 p-3 rounded-md border">
                {actividad.descripcion || "—"}
              </p>
            </div>
            <div>
              <h4 className="text-sm font-semibold text-gray-700 mb-1">
                Función Asociada
              </h4>
              <p className="text-gray-900 font-medium">
                {actividad.funcion?.nombre || "—"}
              </p>
            </div>
            <div className="pt-4 flex justify-end">
              <Button
                type="button"
                onClick={onClose}
                className="bg-gray-500 hover:bg-gray-800 text-white transition"
              >
                Cerrar
              </Button>
            </div>
          </div>
        </div>
      </div>
    );
  };

  // Componente para vista móvil - Card
  const ActividadCard = ({ actividad }) => (
    <div className="bg-white rounded-lg shadow border p-4 mb-4">
      <div className="flex items-start justify-between mb-3">
        <div className="flex items-center">
          <Briefcase className="h-5 w-5 text-gray-400 mr-2" />
          <div>
            <p className="text-sm text-gray-500">{actividad.descripcion}</p>
          </div>
        </div>
        <StatusBadge status={actividad.estado} size="sm" />
      </div>

      <div className="flex justify-end mt-4 space-x-2">
        <button
          onClick={() => handleViewDetail(actividad)}
          className="p-2 text-gray-600 hover:text-gray-900 hover:bg-gray-50 rounded-full transition-colors"
          title="Ver detalle"
        >
          <Eye size={16} />
        </button>

        {actividad.estado ? (
          <>
            <button
              onClick={() => handleEdit(actividad)}
              className="p-2 text-blue-600 hover:text-blue-900 hover:bg-blue-50 rounded-full transition-colors"
              title="Editar"
            >
              <Edit size={16} />
            </button>
            <button
              onClick={() => handleDelete(actividad.id)}
              className="p-2 text-red-600 hover:text-red-900 hover:bg-red-50 rounded-full transition-colors"
              title="Eliminar"
            >
              <Trash2 size={16} />
            </button>
          </>
        ) : (
          <button
            onClick={() => handleRestore(actividad.id)}
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
        <h2 className="text-xl font-medium">
          Gestión de Actividades Económicas
        </h2>
        <Button
          onClick={handleCreate}
          className="flex items-center gap-2 bg-[#24412f] text-white hover:bg-[#1b2a1f] transition-colors w-full sm:w-auto justify-center"
        >
          <Plus size={18} />
          Nueva Actividad
        </Button>
      </div>

      {error && (
        <div className="bg-red-100 text-red-700 p-3 rounded mb-4">{error}</div>
      )}

      {loading ? (
        <div className="text-center py-10">
          Cargando actividades económicas...
        </div>
      ) : (
        <>
          {/* Vista móvil - Cards */}
          <div className="md:hidden">
            {actividades.length === 0 ? (
              <div className="text-center py-10 text-gray-500">
                No se encontraron actividades económicas.
              </div>
            ) : (
              <div className="space-y-4">
                {actividades.map((actividad) => (
                  <ActividadCard key={actividad.id} actividad={actividad} />
                ))}
              </div>
            )}
          </div>

          {/* Vista escritorio - Tabla personalizada con CustomTable */}
          <div className="hidden md:block">
            <CustomTable 
              data={actividades} 
              columns={columns} 
              searchable={true} // Usar el buscador de CustomTable
            />
          </div>
        </>
      )}

      {/* Modal de edición/creación */}
      <ActividadEconomicaModal
        isOpen={isModalOpen}
        onClose={closeModal}
        onSubmit={handleSubmit}
        currentActividad={currentActividad}
        formData={formData}
        setFormData={setFormData}
        formError={formError}
      />

      {/* Modal de detalle */}
      <ActividadDetailModal
        isOpen={isDetailModalOpen}
        onClose={closeDetailModal}
        actividad={selectedActividad}
      />
    </div>
  );
}