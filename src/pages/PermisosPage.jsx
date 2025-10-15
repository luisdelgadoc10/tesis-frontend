// src/pages/PermisosPage.jsx
import { useState, useEffect } from "react";
import { useAuth } from "../context/AuthContext";
import { Key, Plus, Edit, Trash2, RotateCcw, ToggleLeft, ToggleRight } from "lucide-react";
import { useNavigate } from "react-router-dom";
import Button from "../components/Button";
import StatusBadge from "../components/StatusBadge";
import PermisoModal from "../components/PermisoModal";

export default function PermisosPage() {
  const { api } = useAuth();
  const navigate = useNavigate();
  const [permisos, setPermisos] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [formError, setFormError] = useState("");

  // Modal
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [currentPermiso, setCurrentPermiso] = useState(null);

  // Formulario
  const [formData, setFormData] = useState({
    name: "",
  });

  // Cargar permisos
  const fetchPermisos = async () => {
    try {
      setLoading(true);
      const { data } = await api.get("/permisos");
      setPermisos(Array.isArray(data) ? data : data.data || []);
    } catch (err) {
      console.error("Error al cargar permisos:", err);
      setError("No se pudieron cargar los permisos.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchPermisos();
  }, []);

  // Abrir modal para crear
  const handleCreate = () => {
    setCurrentPermiso(null);
    setFormData({
      name: "",
    });
    setFormError("");
    setIsModalOpen(true);
  };

  // Abrir modal para editar
  const handleEdit = (permiso) => {
    setCurrentPermiso(permiso);
    setFormData({
      name: permiso.name,
    });
    setFormError("");
    setIsModalOpen(true);
  };

  // Cerrar modal
  const closeModal = () => {
    setIsModalOpen(false);
    setCurrentPermiso(null);
    setFormData({
      name: "",
    });
    setFormError("");
  };

  // Guardar (crear o editar)
  const handleSubmit = async (e) => {
    e.preventDefault();
    setFormError("");

    try {
      if (currentPermiso) {
        await api.put(`/permisos/${currentPermiso.id}`, formData);
      } else {
        await api.post("/permisos", formData);
      }
      closeModal();
      fetchPermisos();
    } catch (err) {
      console.error("Error al guardar permiso:", err);
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
    if (!window.confirm("¿Estás seguro de eliminar este permiso?")) return;

    try {
      await api.delete(`/permisos/${id}`);
      fetchPermisos();
    } catch (err) {
      console.error("Error al eliminar permiso:", err);
      alert("No se pudo eliminar el permiso.");
    }
  };

  // Restaurar
  const handleRestore = async (id) => {
    if (!window.confirm("¿Estás seguro de restaurar este permiso?")) return;

    try {
      await api.patch(`/permisos/${id}/restore`);
      fetchPermisos();
    } catch (err) {
      console.error("Error al restaurar permiso:", err);
      alert("No se pudo restaurar el permiso.");
    }
  };

  // Activar
  const handleActivate = async (id) => {
    if (!window.confirm("¿Estás seguro de activar este permiso?")) return;

    try {
      await api.patch(`/permisos/${id}/activate`);
      fetchPermisos();
    } catch (err) {
      console.error("Error al activar permiso:", err);
      alert("No se pudo activar el permiso.");
    }
  };

  // Desactivar
  const handleDeactivate = async (id) => {
    if (!window.confirm("¿Estás seguro de desactivar este permiso?")) return;

    try {
      await api.patch(`/permisos/${id}/deactivate`);
      fetchPermisos();
    } catch (err) {
      console.error("Error al desactivar permiso:", err);
      alert("No se pudo desactivar el permiso.");
    }
  };

  // Componente para vista móvil - Card
  const PermisoCard = ({ permiso }) => (
    <div className="bg-white rounded-lg shadow border p-4 mb-4">
      <div className="flex items-start justify-between mb-3">
        <div className="flex items-center">
          <Key className="h-5 w-5 text-gray-400 mr-2" />
          <div>
            <h3 className="font-medium text-gray-900">{permiso.name}</h3>
          </div>
        </div>
        <StatusBadge status={permiso.estado} size="sm" />
      </div>

      <div className="flex justify-end mt-4 space-x-2">
        {permiso.estado ? (
          <>
            <button
              onClick={() => handleEdit(permiso)}
              className="p-2 text-blue-600 hover:text-blue-900 hover:bg-blue-50 rounded-full transition-colors"
              title="Editar"
            >
              <Edit size={16} />
            </button>
            <button
              onClick={() => handleDeactivate(permiso.id)}
              className="p-2 text-yellow-600 hover:text-yellow-900 hover:bg-yellow-50 rounded-full transition-colors"
              title="Desactivar"
            >
              <ToggleLeft size={16} />
            </button>
            <button
              onClick={() => handleDelete(permiso.id)}
              className="p-2 text-red-600 hover:text-red-900 hover:bg-red-50 rounded-full transition-colors"
              title="Eliminar"
            >
              <Trash2 size={16} />
            </button>
          </>
        ) : (
          <>
            <button
              onClick={() => handleActivate(permiso.id)}
              className="p-2 text-green-600 hover:text-green-900 hover:bg-green-50 rounded-full transition-colors"
              title="Activar"
            >
              <ToggleRight size={16} />
            </button>
            <button
              onClick={() => handleRestore(permiso.id)}
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
        <h2 className="text-xl font-medium">Gestión de Permisos</h2>
        <Button
          onClick={handleCreate}
          className="flex items-center gap-2 bg-[#24412f] text-white hover:bg-[#1b2a1f] transition-colors w-full sm:w-auto justify-center"
        >
          <Plus size={18} />
          Nuevo Permiso
        </Button>
      </div>

      {error && (
        <div className="bg-red-100 text-red-700 p-3 rounded mb-4">{error}</div>
      )}

      {loading ? (
        <div className="text-center py-10">Cargando permisos...</div>
      ) : (
        <>
          {/* Vista móvil - Cards */}
          <div className="md:hidden">
            {permisos.length === 0 ? (
              <div className="text-center py-10 text-gray-500">
                No hay permisos disponibles.
              </div>
            ) : (
              <div className="space-y-4">
                {permisos.map((permiso) => (
                  <PermisoCard key={permiso.id} permiso={permiso} />
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
                  {permisos.length === 0 ? (
                    <tr>
                      <td
                        colSpan="3"
                        className="px-6 py-4 text-center text-gray-500"
                      >
                        No hay permisos disponibles.
                      </td>
                    </tr>
                  ) : (
                    permisos.map((permiso) => (
                      <tr key={permiso.id} className="hover:bg-gray-50">
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="flex items-center">
                            <Key className="h-5 w-5 text-gray-400 mr-2" />
                            <span className="text-sm font-medium text-gray-900">
                              {permiso.name}
                            </span>
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <StatusBadge status={permiso.estado} size="sm" />
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                          {permiso.estado ? (
                            <>
                              <button
                                onClick={() => handleEdit(permiso)}
                                className="text-blue-600 hover:text-blue-900 mr-3 p-1"
                                title="Editar"
                              >
                                <Edit size={16} />
                              </button>
                              <button
                                onClick={() => handleDeactivate(permiso.id)}
                                className="text-yellow-600 hover:text-yellow-900 mr-3 p-1"
                                title="Desactivar"
                              >
                                <ToggleLeft size={16} />
                              </button>
                              <button
                                onClick={() => handleDelete(permiso.id)}
                                className="text-red-600 hover:text-red-900 p-1"
                                title="Eliminar"
                              >
                                <Trash2 size={16} />
                              </button>
                            </>
                          ) : (
                            <>
                              <button
                                onClick={() => handleActivate(permiso.id)}
                                className="text-green-600 hover:text-green-900 mr-3 p-1"
                                title="Activar"
                              >
                                <ToggleRight size={16} />
                              </button>
                              <button
                                onClick={() => handleRestore(permiso.id)}
                                className="text-gray-600 hover:text-gray-900 p-1"
                                title="Restaurar"
                              >
                                <RotateCcw size={16} />
                              </button>
                            </>
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

      <PermisoModal
        isOpen={isModalOpen}
        onClose={closeModal}
        onSubmit={handleSubmit}
        currentPermiso={currentPermiso}
        formData={formData}
        setFormData={setFormData}
        formError={formError}
      />
    </div>
  );
}