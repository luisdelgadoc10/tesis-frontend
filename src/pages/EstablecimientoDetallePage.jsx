// src/pages/EstablecimientoDetallePage.jsx
import { useState, useEffect } from "react";
import { useAuth } from "../context/AuthContext";
import { useNavigate, useParams, useLocation } from "react-router-dom";
import { Building2, ArrowLeft, Edit3, Save } from "lucide-react";
import Button from "../components/Button";
import StatusBadge from "../components/StatusBadge";
import LocationPicker from "../components/LocationPicker";
import Select from "react-select";
import { useNotification } from "../hooks/useNotification"; // 👈 Importar

// Estilos para react-select
const customSelectStyles = {
  control: (provided, state) => ({
    ...provided,
    borderColor: state.isFocused ? "#24412f" : "#d1d5db",
    boxShadow: state.isFocused ? "0 0 0 3px rgba(36, 65, 47, 0.1)" : "none",
    "&:hover": { borderColor: "#24412f" },
    minHeight: "42px",
    borderRadius: "0.375rem",
    fontSize: "0.875rem",
  }),
  option: (provided, state) => ({
    ...provided,
    backgroundColor: state.isSelected
      ? "#24412f"
      : state.isFocused
      ? "#f3f4f6"
      : "white",
    color: state.isSelected ? "white" : "#374151",
    padding: "8px 12px",
  }),
  singleValue: (provided) => ({ ...provided, color: "#374151" }),
  placeholder: (provided) => ({ ...provided, color: "#9ca3af" }),
  menuPortal: (provided) => ({ ...provided, zIndex: 9999 }),
};

export default function EstablecimientoDetallePage() {
  const { id } = useParams();
  const location = useLocation();
  const { api } = useAuth();
  const navigate = useNavigate();

  // 👇 Hook de notificaciones
  const { showSuccess, showError, showLoading, dismissToast, showApiError } = useNotification();

  const [establecimiento, setEstablecimiento] = useState(null);
  const [formData, setFormData] = useState({
    nombre_comercial: "",
    razon_social: "",
    ruc: "",
    direccion: "",
    propietario: "",
    telefono: "",
    correo_electronico: "",
    latitud: -8.17123061424572,
    longitud: -79.00891877669534,
    actividad_economica_id: null,
  });
  const [actividadesEconomicas, setActividadesEconomicas] = useState([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState(null);
  const [formError, setFormError] = useState("");

  // Determinar el modo
  const isCreateMode = id === "nuevo" || (!id && location.pathname.includes("/nuevo"));
  const isEditMode = !isCreateMode && location.pathname.includes("/editar");
  const isViewMode = !isCreateMode && !isEditMode;

  // Debug para verificar los modos
  console.log("EstablecimientoDetallePage - Debug:", {
    id,
    pathname: location.pathname,
    isCreateMode,
    isEditMode,
    isViewMode
  });

  // Cargar actividades económicas
  useEffect(() => {
    if (isCreateMode || isEditMode) {
      const fetchActividades = async () => {
        try {
          const { data } = await api.get("/actividades/activas");
          setActividadesEconomicas(Array.isArray(data) ? data : data.data || []);
        } catch (err) {
          console.error("Error al cargar actividades:", err);
          showError("Error al cargar actividades económicas", {
            description: "No se pudieron cargar las actividades económicas.",
            duration: 5000,
          });
        }
      };
      fetchActividades();
    }
  }, [isCreateMode, isEditMode, api]);

  // Cargar establecimiento
  useEffect(() => {
    console.log("=== useEffect EJECUTÁNDOSE ===");
    console.log("ID recibido:", JSON.stringify(id));
    console.log("Tipo de ID:", typeof id);
    console.log("pathname:", location.pathname);
    console.log("isCreateMode calculado:", isCreateMode);
    
    // Verificación para modo creación
    if (!id || id === "nuevo" || id === undefined || id === null || location.pathname.includes("/nuevo")) {
      console.log("🟢 MODO CREACIÓN DETECTADO - Saltando carga");
      setLoading(false);
      setError(null);
      return;
    }

    // Verificación adicional
    if (String(id).toLowerCase() === "nuevo") {
      console.log("🟢 ID 'nuevo' detectado (string) - Saltando carga");
      setLoading(false);
      setError(null);
      return;
    }

    console.log("🔴 Intentando cargar establecimiento para ID:", id);
    
    const fetchEstablecimiento = async () => {
      try {
        setLoading(true);
        setError(null);
        
        // Validar que el ID sea numérico
        const idNumber = Number(id);
        console.log("ID convertido a número:", idNumber);
        
        if (isNaN(idNumber) || idNumber <= 0) {
          console.error("❌ ID inválido:", { id, idNumber });
          throw new Error("ID de establecimiento inválido");
        }

        console.log("🔵 Haciendo petición GET a:", `/establecimientos/${id}`);
        const { data } = await api.get(`/establecimientos/${id}`);
        console.log("✅ Establecimiento cargado:", data);
        setEstablecimiento(data);
        
        // Si estamos en modo edición, poblar el formulario
        if (location.pathname.includes("/editar")) {
          console.log("🟡 Poblando formulario para modo edición");
          setFormData({
            nombre_comercial: data.nombre_comercial || "",
            razon_social: data.razon_social || "",
            ruc: data.ruc || "",
            direccion: data.direccion || "",
            propietario: data.propietario || "",
            telefono: data.telefono || "",
            correo_electronico: data.correo_electronico || "",
            latitud: parseFloat(data.latitud) || -8.17123061424572,
            longitud: parseFloat(data.longitud) || -79.00891877669534,
            actividad_economica_id: data.actividad_economica_id || null,
          });
        }
      } catch (err) {
        console.error("❌ Error al cargar establecimiento:", err);
        const errorMessage = err.message || "No se pudo cargar el establecimiento.";
        setError(errorMessage);
        showError("Error al cargar establecimiento", {
          description: errorMessage,
          duration: 5000,
        });
      } finally {
        setLoading(false);
      }
    };

    fetchEstablecimiento();
  }, [id, location.pathname, api]);

  const handleLocationChange = (coords) => {
    setFormData((prev) => ({
      ...prev,
      latitud: coords.lat,
      longitud: coords.lng,
    }));
  };

  // 🚀 Handle Submit con notificaciones
  const handleSubmit = async (e) => {
    e.preventDefault();
    setFormError("");

    const toastId = showLoading(
      isCreateMode ? "Creando establecimiento..." : "Actualizando establecimiento..."
    );

    try {
      let response;
      if (isCreateMode) {
        response = await api.post("/establecimientos", formData);
        showSuccess("Establecimiento creado correctamente", { id: toastId });
        navigate(`/establecimientos`);
      } else {
        response = await api.put(`/establecimientos/${id}`, formData);
        showSuccess("Establecimiento actualizado correctamente", { id: toastId });
        setEstablecimiento(response.data);
        navigate(`/establecimientos/${id}`);
      }
    } catch (err) {
      console.error("Error al guardar:", err);
      dismissToast(toastId);
      
      // Usar showApiError para manejar errores de validación
      showApiError(err, isCreateMode ? "Error al crear establecimiento" : "Error al actualizar establecimiento");
      
      // También mostrar en el formulario
      if (err.response?.data?.message) {
        setFormError(err.response.data.message);
      } else {
        setFormError("Error al guardar. Intente nuevamente.");
      }
    }
  };

  const actividadesOptions = actividadesEconomicas.map((act) => ({
    value: act.id,
    label: act.descripcion,
  }));

  const selectedActividad = actividadesOptions.find(
    (opt) => opt.value === formData.actividad_economica_id
  );

  // Renderizado en modo carga
  if (loading) {
    return (
      <div className="w-full p-6">
        <div className="flex items-center gap-2 mb-6">
          <Button
            onClick={() => navigate("/establecimientos")}
            className="flex items-center gap-2 bg-gray-500 text-white hover:bg-gray-700"
          >
            <ArrowLeft size={18} />
            Volver
          </Button>
        </div>
        <div className="text-center py-10">Cargando...</div>
      </div>
    );
  }

  // Error
  if (error) {
    return (
      <div className="w-full p-6">
        <div className="flex items-center gap-2 mb-6">
          <Button
            onClick={() => navigate("/establecimientos")}
            className="flex items-center gap-2 bg-gray-500 text-white hover:bg-gray-700"
          >
            <ArrowLeft size={18} />
            Volver
          </Button>
        </div>
        <div className="bg-red-100 text-red-700 p-4 rounded">
          {error}
        </div>
      </div>
    );
  }

  // Modo edición o creación
  if (isCreateMode || isEditMode) {
    return (
      <div className="w-full p-6">
        <div className="flex items-center gap-2 mb-6">
          <Button
            onClick={() => navigate("/establecimientos")}
            className="flex items-center gap-2 bg-gray-500 text-white hover:bg-gray-700"
          >
            <ArrowLeft size={18} />
            Volver
          </Button>
          <h2 className="text-xl font-medium">
            {isCreateMode ? "Nuevo Establecimiento" : "Editar Establecimiento"}
          </h2>
        </div>

        {formError && (
          <div className="bg-red-50 text-red-700 p-4 rounded-lg mb-6 border border-red-200">
            {formError}
          </div>
        )}

        <form onSubmit={handleSubmit} className="bg-white rounded-lg shadow p-6 space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Nombre Comercial *
              </label>
              <input
                type="text"
                value={formData.nombre_comercial}
                onChange={(e) => setFormData({ ...formData, nombre_comercial: e.target.value })}
                className="w-full px-4 py-2.5 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#24412f]"
                required
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Razón Social *
              </label>
              <input
                type="text"
                value={formData.razon_social}
                onChange={(e) => setFormData({ ...formData, razon_social: e.target.value })}
                className="w-full px-4 py-2.5 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#24412f]"
                required
              />
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                RUC *
              </label>
              <input
                type="text"
                value={formData.ruc}
                onChange={(e) => {
                  if (/^\d{0,11}$/.test(e.target.value)) {
                    setFormData({ ...formData, ruc: e.target.value });
                  }
                }}
                className="w-full px-4 py-2.5 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#24412f]"
                required
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Dirección *
              </label>
              <input
                type="text"
                value={formData.direccion}
                onChange={(e) => setFormData({ ...formData, direccion: e.target.value })}
                className="w-full px-4 py-2.5 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#24412f]"
                required
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Actividad Económica *
            </label>
            <Select
              value={selectedActividad}
              onChange={(opt) => setFormData({ ...formData, actividad_economica_id: opt?.value || null })}
              options={actividadesOptions}
              placeholder="Seleccionar actividad..."
              isClearable
              isSearchable
              styles={customSelectStyles}
              menuPortalTarget={document.body}
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Propietario *
            </label>
            <input
              type="text"
              value={formData.propietario}
              onChange={(e) => setFormData({ ...formData, propietario: e.target.value })}
              className="w-full px-4 py-2.5 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#24412f]"
              required
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Teléfono *
              </label>
              <input
                type="tel"
                value={formData.telefono}
                onChange={(e) => {
                  if (/^\d{0,9}$/.test(e.target.value)) {
                    setFormData({ ...formData, telefono: e.target.value });
                  }
                }}
                className="w-full px-4 py-2.5 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#24412f]"
                required
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Correo Electrónico
              </label>
              <input
                type="email"
                value={formData.correo_electronico}
                onChange={(e) => setFormData({ ...formData, correo_electronico: e.target.value })}
                className="w-full px-4 py-2.5 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#24412f]"
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Ubicación en el Mapa
            </label>
            <LocationPicker
              position={[formData.latitud, formData.longitud]}
              onPositionChange={handleLocationChange}
              showCurrentLocationButton={true}
            />
          </div>

          <div className="flex justify-end space-x-3 pt-4">
            <Button
              type="button"
              onClick={() => navigate("/establecimientos")}
              className="px-5 py-2.5 bg-gray-500 text-white hover:bg-gray-700 rounded-md"
            >
              Cancelar
            </Button>
            <Button
              type="submit"
              disabled={saving}
              className="px-5 py-2.5 bg-[#24412f] text-white hover:bg-[#1b2a1f] rounded-md flex items-center gap-2"
            >
              {saving ? "Guardando..." : "Guardar"}
              <Save size={18} />
            </Button>
          </div>
        </form>
      </div>
    );
  }

  // Modo vista (detalle)
  return (
    <div className="w-full p-6">
      <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center mb-6 gap-4">
        <div className="flex items-center gap-2">
          <Button
            onClick={() => navigate("/establecimientos")}
            className="flex items-center gap-2 bg-gray-500 text-white hover:bg-gray-700"
          >
            <ArrowLeft size={18} />
            Volver
          </Button>
          <h2 className="text-xl font-medium">Detalle de Establecimiento</h2>
        </div>
        <div className="flex items-center gap-2">
          {establecimiento && <StatusBadge status={establecimiento.estado} size="sm" />}
          <Button
            onClick={() => navigate(`/establecimientos/${id}/editar`)}
            className="p-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
            title="Editar"
          >
            <Edit3 size={16} />
          </Button>
        </div>
      </div>

      <div className="bg-white rounded-lg shadow p-6 space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Nombre Comercial
            </label>
            <p className="px-3 py-2 bg-gray-50 rounded-md border">
              {establecimiento.nombre_comercial}
            </p>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Razón Social
            </label>
            <p className="px-3 py-2 bg-gray-50 rounded-md border">
              {establecimiento.razon_social}
            </p>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              RUC
            </label>
            <p className="px-3 py-2 bg-gray-50 rounded-md border">
              {establecimiento.ruc}
            </p>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Dirección
            </label>
            <p className="px-3 py-2 bg-gray-50 rounded-md border">
              {establecimiento.direccion}
            </p>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Propietario
            </label>
            <p className="px-3 py-2 bg-gray-50 rounded-md border">
              {establecimiento.propietario}
            </p>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Teléfono
            </label>
            <p className="px-3 py-2 bg-gray-50 rounded-md border">
              {establecimiento.telefono}
            </p>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Correo Electrónico
            </label>
            <p className="px-3 py-2 bg-gray-50 rounded-md border">
              {establecimiento.correo_electronico || "—"}
            </p>
          </div>
          {establecimiento.actividad_economica && (
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Actividad Económica
              </label>
              <p className="px-3 py-2 bg-gray-50 rounded-md border">
                {establecimiento.actividad_economica.descripcion || establecimiento.actividad_economica.nombre}
              </p>
            </div>
          )}
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Ubicación en el Mapa
          </label>
          {establecimiento.latitud && establecimiento.longitud ? (
            <LocationPicker
              position={[
                parseFloat(establecimiento.latitud),
                parseFloat(establecimiento.longitud),
              ]}
              onPositionChange={() => {}}
              showCurrentLocationButton={false}
            />
          ) : (
            <div className="h-64 w-full rounded-lg border flex items-center justify-center text-gray-500">
              No hay ubicación registrada
            </div>
          )}
        </div>
      </div>
    </div>
  );
}