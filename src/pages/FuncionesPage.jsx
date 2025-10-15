// src/pages/FuncionesPage.jsx
import { useState, useEffect } from "react";
import { useAuth } from "../context/AuthContext";
import { Settings2, Plus, Edit, Trash2, RotateCcw } from "lucide-react";
import { useNavigate } from "react-router-dom";
import Button from "../components/Button";
import StatusBadge from "../components/StatusBadge";
import FuncionModal from "../components/FuncionModal";

export default function FuncionesPage() {
  const { api } = useAuth();
  const navigate = useNavigate();
  const [funciones, setFunciones] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [formError, setFormError] = useState("");

  // Modal
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
      const { data } = await api.get("/funciones"); // ← LISTA TODAS (activas + inactivas)
      setFunciones(Array.isArray(data) ? data : data.data || []);
    } catch (err) {
      console.error("Error al cargar funciones:", err);
      setError("No se pudieron cargar las funciones.");
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

    try {
      if (currentFuncion) {
        await api.put(`/funciones/${currentFuncion.id}`, formData);
      } else {
        await api.post("/funciones", formData);
      }
      closeModal();
      fetchFunciones();
    } catch (err) {
      console.error("Error al guardar función:", err);
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

  // Eliminar (soft delete)
  const handleDelete = async (id) => {
    if (!window.confirm("¿Estás seguro de eliminar esta función?")) return;

    try {
      await api.delete(`/funciones/${id}`);
      fetchFunciones();
    } catch (err) {
      console.error("Error al eliminar función:", err);
      alert("No se pudo eliminar la función.");
    }
  };

  // ✅ RESTAURAR → AHORA USA POST (según tu ruta)
  const handleRestore = async (id) => {
    if (!window.confirm("¿Estás seguro de restaurar esta función?")) return;

    try {
      await api.post(`/funciones/${id}/restore`); // ← ¡CORREGIDO A POST!
      fetchFunciones();
    } catch (err) {
      console.error("Error al restaurar función:", err);
      alert("No se pudo restaurar la función.");
    }
  };

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
              onClick={() => handleDelete(funcion.id)}
              className="p-2 text-red-600 hover:text-red-900 hover:bg-red-50 rounded-full transition-colors"
              title="Eliminar"
            >
              <Trash2 size={16} />
            </button>
          </>
        ) : (
          <button
            onClick={() => handleRestore(funcion.id)}
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
                  <FuncionCard key={funcion.id} funcion={funcion} />
                ))}
              </div>
            )}
          </div>

          {/* Vista escritorio - Tabla con scroll horizontal */}
          <div className="hidden md:block overflow-x-auto">
            <div className="bg-white rounded-lg shadow overflow-hidden border min-w-full">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Nombre
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Estado
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Acciones
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {funciones.length === 0 ? (
                    <tr>
                      <td
                        colSpan="3"
                        className="px-6 py-4 text-center text-gray-500"
                      >
                        No hay funciones disponibles.
                      </td>
                    </tr>
                  ) : (
                    funciones.map((funcion) => (
                      <tr key={funcion.id} className="hover:bg-gray-50">
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="flex items-center">
                            <Settings2 className="h-5 w-5 text-gray-400 mr-2" />
                            <span className="text-sm font-medium text-gray-900">
                              {funcion.nombre}
                            </span>
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <StatusBadge status={funcion.estado} size="sm" />
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                          {funcion.estado ? (
                            <>
                              <button
                                onClick={() => handleEdit(funcion)}
                                className="text-blue-600 hover:text-blue-900 mr-3 p-1"
                                title="Editar"
                              >
                                <Edit size={16} />
                              </button>
                              <button
                                onClick={() => handleDelete(funcion.id)}
                                className="text-red-600 hover:text-red-900 p-1"
                                title="Eliminar"
                              >
                                <Trash2 size={16} />
                              </button>
                            </>
                          ) : (
                            <button
                              onClick={() => handleRestore(funcion.id)}
                              className="text-green-600 hover:text-green-900 p-1"
                              title="Restaurar"
                            >
                              <RotateCcw size={16} />
                            </button>
                          )}
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </>
      )}

      <FuncionModal
        isOpen={isModalOpen}
        onClose={closeModal}
        onSubmit={handleSubmit}
        currentFuncion={currentFuncion}
        formData={formData}
        setFormData={setFormData}
        formError={formError}
      />
    </div>
  );
}