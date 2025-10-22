import { useNavigate } from "react-router-dom";
import { useState, useEffect } from "react";
import { useAuth } from "../context/AuthContext";
import Button from "../components/Button";
import { X, Save, Building2, List, Home } from "lucide-react";
import Select from "react-select";
import { useNotification } from "../hooks/useNotification";
import { customSelectStyles } from "../components/clasificacion/selectStyles";

// Importar formularios por función
import FormularioSalud from "../components/clasificacion/FormularioSalud";
import FormularioEncuentro from "../components/clasificacion/FormularioEncuentro";
import FormularioHospedaje from "../components/clasificacion/FormularioHospedaje";
import FormularioEducacion from "../components/clasificacion/FormularioEducacion";
import FormularioIndustrial from "../components/clasificacion/FormularioIndustrial";
import FormularioOficinas from "../components/clasificacion/FormularioOficinas";
import FormularioComercio from "../components/clasificacion/FormularioComercio";
import FormularioAlmacen from "../components/clasificacion/FormularioAlmacen";

export default function NuevaClasificacionPage() {
  const { api } = useAuth();
  const navigate = useNavigate();
  const { showSuccess, showError, showLoading, dismissToast, showApiError } =
    useNotification();

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  // Datos de listas
  const [establecimientos, setEstablecimientos] = useState([]);
  const [loadingEstablecimientos, setLoadingEstablecimientos] = useState(true);
  const [actividades, setActividades] = useState({});
  const [funciones, setFunciones] = useState({});

  // Datos del formulario
  const [formData, setFormData] = useState({
    establecimiento_id: "",
    actividad_economica_id: "",
    funcion_id: "",
    funcion_nombre: "",
  });

  // Estado dinámico según función
  const [datosEspecificos, setDatosEspecificos] = useState({});

  // -------------------- CARGAR LISTAS --------------------
  useEffect(() => {
    const cargarListas = async () => {
      try {
        const [actRes, funcRes] = await Promise.all([
          api.get("/actividades"),
          api.get("/funciones"),
        ]);

        const actData = Array.isArray(actRes.data)
          ? actRes.data
          : actRes.data.data || [];
        const funcData = Array.isArray(funcRes.data)
          ? funcRes.data
          : funcRes.data.data || [];

        const actMap = {};
        actData.forEach((a) => {
          actMap[a.id] = a;
        });
        setActividades(actMap);

        const funcMap = {};
        funcData.forEach((f) => {
          funcMap[f.id] = f;
        });
        setFunciones(funcMap);
      } catch (err) {
        console.error("Error al cargar actividades/funciones:", err);
        showError("Error al cargar datos", {
          description: "No se pudieron cargar las actividades y funciones.",
          duration: 5000,
        });
      }
    };

    cargarListas();
  }, [api]);

  // -------------------- CARGAR ESTABLECIMIENTOS --------------------
  useEffect(() => {
    const fetchEstablecimientos = async () => {
      try {
        setLoadingEstablecimientos(true);
        const { data } = await api.get("/establecimientos");
        const list = Array.isArray(data) ? data : data.data || [];
        setEstablecimientos(list.filter((est) => est.estado));
      } catch (err) {
        console.error("Error al cargar establecimientos:", err);
        showError("Error al cargar establecimientos", {
          description: "No se pudieron cargar los establecimientos.",
          duration: 5000,
        });
      } finally {
        setLoadingEstablecimientos(false);
      }
    };

    fetchEstablecimientos();
  }, [api]);

  // -------------------- AL CAMBIAR ESTABLECIMIENTO --------------------
  useEffect(() => {
    if (!formData.establecimiento_id) {
      setFormData((prev) => ({
        ...prev,
        actividad_economica_id: "",
        funcion_id: "",
        funcion_nombre: "",
      }));
      setDatosEspecificos({});
      return;
    }

    const est = establecimientos.find(
      (e) => e.id == formData.establecimiento_id
    );

    if (!est?.actividad_economica_id) {
      setFormData((prev) => ({
        ...prev,
        actividad_economica_id: "",
        funcion_id: "",
        funcion_nombre: "",
      }));
      setDatosEspecificos({});
      return;
    }

    const actividad = actividades[est.actividad_economica_id];
    const funcion = funciones[actividad?.funcion_id];

    setFormData((prev) => ({
      ...prev,
      actividad_economica_id: actividad?.id || "",
      funcion_id: funcion?.id || "",
      funcion_nombre: funcion?.nombre || "",
    }));

    setDatosEspecificos({});
  }, [formData.establecimiento_id, actividades, funciones, establecimientos]);

  // -------------------- HANDLERS --------------------
  const handleDatoEspecifico = (key, value) => {
    setDatosEspecificos((prev) => ({
      ...prev,
      [key]: value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!formData.establecimiento_id) {
      setError("Seleccione un establecimiento válido.");
      showError("Validación", {
        description: "Seleccione un establecimiento válido.",
        duration: 3000,
      });
      return;
    }

    if (!formData.actividad_economica_id) {
      setError("No se pudo obtener la actividad económica.");
      showError("Validación", {
        description: "No se pudo obtener la actividad económica.",
        duration: 3000,
      });
      return;
    }

    setLoading(true);
    setError("");

    const toastId = showLoading("Guardando clasificación...");

    try {
      const payload = {
        establecimiento_id: Number(formData.establecimiento_id),
        actividad_economica_id: Number(formData.actividad_economica_id),
        ...datosEspecificos,
      };

      await api.post("/clasificaciones", payload);

      showSuccess("Clasificación guardada exitosamente", { id: toastId });
      navigate("/clasificaciones");
    } catch (err) {
      console.error("Error al guardar:", err);
      dismissToast(toastId);

      showApiError(err, "Error al guardar clasificación");

      if (err.response?.data?.message) {
        setError(err.response.data.message);
      } else {
        setError("Error al guardar la clasificación. Intente nuevamente.");
      }
    } finally {
      setLoading(false);
    }
  };

  const handleCancel = () => navigate("/clasificaciones");

  // -------------------- HELPERS --------------------
  const actividadNombre = formData.actividad_economica_id
    ? actividades[formData.actividad_economica_id]?.descripcion ||
      "Sin descripción"
    : "Sin asignar";

  const funcionNombre = formData.funcion_nombre || "Sin asignar";

  const establecimientosOptions = establecimientos.map((est) => ({
    value: est.id.toString(),
    label: `${est.nombre_comercial} - ${est.ruc}`,
  }));

  // -------------------- RENDER FORMULARIO ESPECÍFICO --------------------
  const renderFormularioEspecifico = () => {
    switch (formData.funcion_nombre) {
      case "SALUD":
        return <FormularioSalud datos={datosEspecificos} onChange={handleDatoEspecifico} />;
      case "ENCUENTRO":
        return <FormularioEncuentro datos={datosEspecificos} onChange={handleDatoEspecifico} />;
      case "HOSPEDAJE":
        return <FormularioHospedaje datos={datosEspecificos} onChange={handleDatoEspecifico} />;
      case "EDUCACION":
        return <FormularioEducacion datos={datosEspecificos} onChange={handleDatoEspecifico} />;
      case "INDUSTRIAL":
        return <FormularioIndustrial datos={datosEspecificos} onChange={handleDatoEspecifico} />;
      case "OFICINAS ADMINISTRATIVAS":
        return <FormularioOficinas datos={datosEspecificos} onChange={handleDatoEspecifico} />;
      case "COMERCIO":
        return <FormularioComercio datos={datosEspecificos} onChange={handleDatoEspecifico} />;
      case "ALMACEN":
        return <FormularioAlmacen datos={datosEspecificos} onChange={handleDatoEspecifico} />;
      default:
        return (
          <div className="p-4 bg-gray-50 rounded-md border border-gray-200">
            <p className="text-sm text-gray-600">
              Formulario para "{formData.funcion_nombre}" no disponible.
            </p>
          </div>
        );
    }
  };

  // -------------------- RENDER --------------------
  return (
    <div className="w-full">
      {/* HEADER */}
      <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center mb-6 gap-4">
        <h2 className="text-xl font-medium">Nueva Clasificación</h2>
        <Button
          onClick={handleCancel}
          className="flex items-center gap-2 bg-gray-500 text-white hover:bg-gray-600 transition-colors w-full sm:w-auto justify-center"
        >
          <X size={18} />
          Cancelar
        </Button>
      </div>

      {/* ERROR */}
      {error && (
        <div className="bg-red-50 border border-red-200 text-red-700 p-4 rounded-lg mb-4">
          {error}
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-6">
        {/* CARD 1: DATOS DEL ESTABLECIMIENTO */}
        <div className="bg-white rounded-lg shadow border p-6">
          <h3 className="text-lg font-medium text-gray-800 mb-4 pb-2 border-b">
            DATOS DEL ESTABLECIMIENTO
          </h3>

          <div className="grid grid-cols-1 gap-6">
            {/* Establecimiento */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                <div className="flex items-center gap-2">
                  <Building2 size={18} />
                  Establecimiento *
                </div>
              </label>
              {loadingEstablecimientos ? (
                <div className="p-3 bg-gray-100 rounded text-gray-500">
                  Cargando establecimientos...
                </div>
              ) : (
                <Select
                  value={
                    establecimientosOptions.find(
                      (op) => op.value === formData.establecimiento_id
                    ) || null
                  }
                  onChange={(opt) =>
                    setFormData((prev) => ({
                      ...prev,
                      establecimiento_id: opt ? opt.value : "",
                    }))
                  }
                  options={establecimientosOptions}
                  placeholder="-- Seleccione un establecimiento --"
                  isClearable
                  isSearchable
                  styles={customSelectStyles}
                  menuPortalTarget={document.body}
                />
              )}
            </div>

            {/* Información de Actividad y Función */}
            {formData.establecimiento_id && (
              <div className="mt-4 p-4 bg-blue-50 rounded-lg border border-blue-200">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <div className="flex items-center gap-2 mb-1">
                      <Home size={16} className="text-blue-600" />
                      <span className="text-sm font-medium text-blue-700">
                        Actividad Económica
                      </span>
                    </div>
                    <p className="text-sm text-gray-800">{actividadNombre}</p>
                  </div>
                  <div>
                    <div className="flex items-center gap-2 mb-1">
                      <List size={16} className="text-blue-600" />
                      <span className="text-sm font-medium text-blue-700">
                        Función
                      </span>
                    </div>
                    <p className="text-sm font-semibold text-gray-800">
                      {funcionNombre}
                    </p>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* CARD 2: FORMULARIO ESPECÍFICO POR FUNCIÓN */}
        {formData.funcion_nombre && (
          <div className="bg-white rounded-lg shadow border p-6">
            <h3 className="text-lg font-medium text-gray-800 mb-4 pb-2 border-b">
              DATOS PARA CLASIFICACIÓN ({formData.funcion_nombre})
            </h3>
            {renderFormularioEspecifico()}
          </div>
        )}

        {/* BOTONES DE ACCIÓN */}
        <div className="flex justify-end space-x-3">
          <Button
            type="button"
            onClick={handleCancel}
            className="px-4 py-2 bg-gray-500 text-white hover:bg-gray-700 rounded-md transition-colors"
            disabled={loading}
          >
            Cancelar
          </Button>
          <Button
            type="submit"
            className="px-4 py-2 bg-[#24412f] text-white hover:bg-[#1b2a1f] rounded-md flex items-center gap-2 transition-colors"
            disabled={loading || !formData.establecimiento_id}
          >
            <Save size={18} />
            {loading ? "Guardando..." : "Guardar Clasificación"}
          </Button>
        </div>
      </form>
    </div>
  );
}