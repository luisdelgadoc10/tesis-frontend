// src/pages/RolFormPage.jsx
import { useState, useEffect } from "react";
import { useAuth } from "../context/AuthContext";
import { useParams, useNavigate, useLocation } from "react-router-dom";
import { ArrowLeft, Save, Shield } from "lucide-react";
import Button from "../components/Button";
import CustomCheckbox from "../components/CustomCheckbox";
import { useNotification } from "../hooks/useNotification"; // 👈 Importar

export default function RolFormPage() {
  const { api } = useAuth();
  const { id } = useParams();
  const navigate = useNavigate();
  const location = useLocation();

  // 👇 Hook de notificaciones
  const { showSuccess, showError, showLoading, dismissToast, showApiError } =
    useNotification();

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [permisos, setPermisos] = useState([]);
  const [rol, setRol] = useState({
    name: "",
    permissions: [],
  });

  // Determinar el modo basado en la ruta
  const isEditMode = location.pathname.includes("/editar");
  const isCreateMode = location.pathname.includes("/nuevo");
  const modo = isEditMode ? "Editar" : "Crear";

  // Cargar permisos y rol (si es edición)
  const fetchInitialData = async () => {
    try {
      setLoading(true);

      // Cargar todos los permisos
      const permisosRes = await api.get("/permisos");
      const permisosDisponibles = Array.isArray(permisosRes.data)
        ? permisosRes.data
        : permisosRes.data.data || [];

      setPermisos(permisosDisponibles.filter((p) => p.estado === 1)); // Solo activos

      // Si es edición, cargar el rol
      if (id && isEditMode) {
        const rolRes = await api.get(`/roles/${id}`);
        console.log("Datos del rol cargado:", rolRes.data);

        // Extraer los IDs de los permisos del rol
        let permissionsIds = [];
        if (rolRes.data.permissions && Array.isArray(rolRes.data.permissions)) {
          permissionsIds = rolRes.data.permissions.map((p) => p.id);
        }

        console.log("IDs de permisos extraídos:", permissionsIds);

        setRol({
          name: rolRes.data.name || "",
          permissions: permissionsIds,
        });
      } else if (isCreateMode) {
        // En modo creación, marcar "view-dashboard" por defecto
        const permisoDashboard = permisosDisponibles.find(
          (p) => p.name === "view-dashboard"
        );
        if (permisoDashboard) {
          setRol((prev) => ({
            ...prev,
            permissions: [permisoDashboard.id],
          }));
        } else {
          setRol((prev) => ({
            ...prev,
            permissions: [],
          }));
        }
      }
    } catch (err) {
      console.error("Error al cargar datos:", err);
      const errorMessage = "No se pudieron cargar los datos.";
      setError(errorMessage);
      showError("Error al cargar datos", {
        description: errorMessage,
        duration: 5000,
      });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchInitialData();
  }, [id, isEditMode]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setRol((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handlePermisoToggle = (permisoId) => {
    // No permitir desmarcar "view-dashboard"
    const permisoDashboard = permisos.find((p) => p.name === "view-dashboard");
    if (permisoDashboard && permisoId === permisoDashboard.id) {
      return; // No hacer nada si intentan desmarcar view-dashboard
    }

    setRol((prev) => {
      const permissionsActuales = [...prev.permissions];
      const index = permissionsActuales.indexOf(permisoId);

      if (index > -1) {
        // Remover permiso
        permissionsActuales.splice(index, 1);
      } else {
        // Agregar permiso
        permissionsActuales.push(permisoId);
      }

      return {
        ...prev,
        permissions: permissionsActuales,
      };
    });
  };

  // 🚀 Handle Submit con notificaciones
  const handleSubmit = async (e) => {
    e.preventDefault();

    const toastId = showLoading(
      isEditMode ? "Actualizando rol..." : "Creando rol..."
    );

    try {
      // El payload debe enviar permissions como array de IDs
      const payload = {
        name: rol.name,
        permissions: rol.permissions, // Array de IDs de permisos
      };

      console.log("Enviando payload al backend:", payload);

      if (isEditMode) {
        await api.put(`/roles/${id}`, payload);
        showSuccess("Rol actualizado correctamente", { id: toastId });
      } else {
        await api.post("/roles", payload);
        showSuccess("Rol creado correctamente", { id: toastId });
      }

      navigate("/roles");
    } catch (err) {
      console.error("Error al guardar rol:", err);
      console.error("Respuesta del servidor:", err.response?.data);
      console.error("Código de error:", err.response?.status);

      dismissToast(toastId);

      // Usar showApiError para manejar errores automáticamente
      showApiError(
        err,
        isEditMode ? "Error al actualizar rol" : "Error al crear rol"
      );

      // También mostrar en el estado local para la UI
      if (err.response?.status === 422) {
        setError(
          "Error de validación: " +
            JSON.stringify(err.response.data.errors || err.response.data)
        );
      } else if (err.response?.status === 500) {
        setError(
          "Error del servidor: " +
            (err.response.data.message || "Error interno del servidor")
        );
      } else {
        setError(
          "No se pudo guardar el rol. Código: " + err.response?.status
        );
      }
    }
  };

  // Verificar si un permiso está bloqueado (no editable)
  const isPermisoBloqueado = (permisoId) => {
    const permisoDashboard = permisos.find((p) => p.name === "view-dashboard");
    return permisoDashboard && permisoId === permisoDashboard.id;
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#24412f] mx-auto mb-4"></div>
          <p className="text-gray-600">Cargando...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gray-50 p-6">
        <div className="max-w-4xl mx-auto">
          <div className="bg-red-100 text-red-700 p-4 rounded mb-6">
            {error}
          </div>
          <button
            onClick={() => navigate(-1)}
            className="flex items-center gap-2 text-gray-600 hover:text-gray-900"
          >
            <ArrowLeft size={18} />
            Volver
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-4xl mx-auto">
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-3">
            <button
              onClick={() => navigate("/roles")}
              className="flex items-center gap-2 text-gray-600 hover:text-gray-900"
            >
              <ArrowLeft size={18} />
              Volver
            </button>
            <h1 className="text-2xl font-bold text-gray-900">{modo} Rol</h1>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow p-6">
          <form onSubmit={handleSubmit}>
            <div className="grid grid-cols-1 gap-6 mb-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Nombre del Rol *
                </label>
                <div className="relative">
                  <Shield className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                  <input
                    type="text"
                    name="name"
                    value={rol.name}
                    onChange={handleInputChange}
                    required
                    className="w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#24412f] focus:border-transparent"
                    placeholder="Ingrese el nombre del rol"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Permisos *
                </label>
                <div className="border border-gray-200 rounded-md p-4 max-h-96 overflow-y-auto">
                  {permisos.length === 0 ? (
                    <p className="text-gray-500 text-center py-4">
                      No hay permisos disponibles.
                    </p>
                  ) : (
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                      {permisos.map((permiso) => {
                        const isChecked = rol.permissions.includes(permiso.id);
                        const isLocked = isPermisoBloqueado(permiso.id);

                        return (
                          <CustomCheckbox
                            key={permiso.id}
                            checked={isChecked}
                            onChange={() => handlePermisoToggle(permiso.id)}
                            label={permiso.descripcion || permiso.name}
                            disabled={isLocked}
                            className={`p-3 border rounded-lg transition-colors ${
                              isLocked
                                ? "border-blue-300 bg-blue-50"
                                : "border-gray-200 hover:border-[#24412f]"
                            }`}
                          />
                        );
                      })}
                    </div>
                  )}
                </div>
                {rol.permissions.length > 0 && (
                  <p className="mt-2 text-sm text-blue-600">
                    * El permiso "Dashboard" está siempre incluido y no se puede
                    desmarcar
                  </p>
                )}
              </div>
            </div>

            <div className="flex justify-end gap-3">
              <button
                type="button"
                onClick={() => navigate("/roles")}
                className="px-4 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50 transition-colors"
              >
                Cancelar
              </button>
              <Button
                type="submit"
                className="flex items-center gap-2 bg-[#24412f] text-white hover:bg-[#1b2a1f] transition-colors"
              >
                <Save size={18} />
                {isEditMode ? "Actualizar" : "Crear"} Rol
              </Button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}