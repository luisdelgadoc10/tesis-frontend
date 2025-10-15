// src/pages/NuevaClasificacionPage.jsx
import { useNavigate } from "react-router-dom";
import { useState, useEffect } from "react";
import { useAuth } from "../context/AuthContext";
import Button from "../components/Button";
import { X, Save, Building2, List, Home } from "lucide-react";
import Select from "react-select";

export default function NuevaClasificacionPage() {
  const { api } = useAuth();
  const navigate = useNavigate();

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

        // Mapeo para acceso rápido
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
        setError("No se pudieron cargar los establecimientos.");
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
      return;
    }

    if (!formData.actividad_economica_id) {
      setError("No se pudo obtener la actividad económica.");
      return;
    }

    setLoading(true);
    setError("");

    try {
      // Payload limpio, con los mínimos requeridos
      const payload = {
        establecimiento_id: Number(formData.establecimiento_id),
        actividad_economica_id: Number(formData.actividad_economica_id),
        ...datosEspecificos,
      };

      await api.post("/clasificaciones", payload);

      alert("¡Clasificación guardada exitosamente!");
      navigate("/clasificaciones");
    } catch (err) {
      console.error("Error al guardar:", err);
      setError(
        err.response?.data?.message ||
          "Error al guardar la clasificación. Intente nuevamente."
      );
    } finally {
      setLoading(false);
    }
  };

  const handleCancel = () => navigate("/clasificaciones");

  // -------------------- HELPERS --------------------
  const actividadNombre = formData.actividad_economica_id
    ? actividades[formData.actividad_economica_id]?.descripcion || "Sin descripción"
    : "Sin asignar";

  const funcionNombre = formData.funcion_nombre || "Sin asignar";

  const establecimientosOptions = establecimientos.map((est) => ({
    value: est.id.toString(),
    label: `${est.nombre_comercial} - ${est.ruc}`,
  }));

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
        <div className="bg-red-100 text-red-700 p-3 rounded mb-4">{error}</div>
      )}

      <form onSubmit={handleSubmit} className="space-y-6">
        {/* CARD 1 */}
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
                  Cargando...
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
                  styles={{
                    control: (provided) => ({
                      ...provided,
                      borderColor: "#d1d5db",
                      borderRadius: "0.375rem",
                      padding: "2px",
                      boxShadow: "none",
                    }),
                    menu: (provided) => ({
                      ...provided,
                      zIndex: 9999,
                    }),
                  }}
                />
              )}
            </div>

            {/* Actividad y función */}
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
          </div>
        </div>

        {/* CARD 2 */}
        {formData.funcion_nombre && (
          <div className="bg-white rounded-lg shadow border p-6">
            <h3 className="text-lg font-medium text-gray-800 mb-4 pb-2 border-b">
              DATOS PARA CLASIFICACIÓN ({formData.funcion_nombre})
            </h3>
            {renderFormularioEspecifico(
              formData.funcion_nombre,
              datosEspecificos,
              handleDatoEspecifico
            )}
          </div>
        )}

        {/* BOTONES */}
        <div className="flex justify-end space-x-3">
          <Button
            type="button"
            onClick={handleCancel}
            className="px-4 py-2 bg-gray-200 text-gray-800 hover:bg-gray-300 rounded-md"
            disabled={loading}
          >
            Cancelar
          </Button>
          <Button
            type="submit"
            className="px-4 py-2 bg-[#24412f] text-white hover:bg-[#1b2a1f] rounded-md flex items-center gap-2"
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

// ================= FORMULARIOS ESPECÍFICOS =================
function renderFormularioEspecifico(funcion, datos, onChange) {
  switch (funcion) {
    case "SALUD":
      return <FormularioSalud datos={datos} onChange={onChange} />;
    case "ENCUENTRO":
      return <FormularioEncuentro datos={datos} onChange={onChange} />;
    case "HOSPEDAJE":
      return <FormularioHospedaje datos={datos} onChange={onChange} />;
    case "EDUCACION":
      return <FormularioEducacion datos={datos} onChange={onChange} />;
    case "INDUSTRIAL":
      return <FormularioIndustrial datos={datos} onChange={onChange} />;
    case "OFICINAS":
      return <FormularioOficinas datos={datos} onChange={onChange} />;
    case "COMERCIO":
      return <FormularioComercio datos={datos} onChange={onChange} />;
    case "ALMACEN":
      return <FormularioAlmacen datos={datos} onChange={onChange} />;
    default:
      return (
        <div className="p-4 bg-gray-50 rounded-md">
          <p className="text-sm text-gray-600">
            Formulario para "{funcion}" no disponible.
          </p>
        </div>
      );
  }
}

// =============== COMPONENTES POR FUNCIÓN ===============

const FormularioSalud = ({ datos, onChange }) => {
  const [pasoActual, setPasoActual] = useState(0);

  // Definir los pasos con 2 campos cada uno
  const pasos = [
    {
      titulo: "Nivel y Tipo de Establecimiento",
      campos: [
        {
          nombre: 'nivel_atencion',
          label: 'Nivel de Atención',
          tipo: 'select',
          opciones: [
            { value: 'primario', label: 'Primario' },
            { value: 'secundario', label: 'Secundario' },
            { value: 'terciario', label: 'Terciario' }
          ],
          requerido: true
        },
        {
          nombre: 'tipo_establecimiento',
          label: 'Tipo de Establecimiento',
          tipo: 'select',
          opciones: [
            { value: 'hospital', label: 'Hospital' },
            { value: 'clinica', label: 'Clínica' },
            { value: 'centro_salud', label: 'Centro de Salud' },
            { value: 'consultorio', label: 'Consultorio' }
          ],
          requerido: true
        }
      ]
    },
    {
      titulo: "Capacidad e Infraestructura",
      campos: [
        {
          nombre: 'camas_internamiento',
          label: 'Camas de Internamiento',
          tipo: 'number',
          min: 0,
          requerido: true
        },
        {
          nombre: 'capacidad_atencion',
          label: 'Capacidad de Atención Diaria',
          tipo: 'number',
          min: 0,
          requerido: true
        }
      ]
    },
    {
      titulo: "Características del Establecimiento",
      campos: [
        {
          nombre: 'usuarios_no_autosuficientes',
          label: '¿Atiende usuarios no autosuficientes?',
          tipo: 'checkbox',
          requerido: false
        },
        {
          nombre: 'urgencias_24h',
          label: '¿Tiene servicio de urgencias 24h?',
          tipo: 'checkbox',
          requerido: false
        }
      ]
    },
    {
      titulo: "Servicios y Especialidades",
      campos: [
        {
          nombre: 'num_especialidades',
          label: 'Número de Especialidades',
          tipo: 'number',
          min: 0,
          requerido: true
        },
        {
          nombre: 'servicios_disponibles',
          label: 'Servicios Disponibles',
          tipo: 'multiselect',
          opciones: [
            { value: 'laboratorio', label: 'Laboratorio' },
            { value: 'rayos_x', label: 'Rayos X' },
            { value: 'tomografia', label: 'Tomografía' },
            { value: 'resonancia', label: 'Resonancia Magnética' },
            { value: 'hemodialisis', label: 'Hemodiálisis' },
            { value: 'cirugia', label: 'Cirugía' },
            { value: 'maternidad', label: 'Maternidad' },
            { value: 'uci', label: 'Unidad de Cuidados Intensivos' }
          ],
          requerido: false
        }
      ]
    },
    {
      titulo: "Infraestructura Física",
      campos: [
        {
          nombre: 'num_pisos',
          label: 'Número de Pisos',
          tipo: 'number',
          min: 1,
          requerido: true
        },
        {
          nombre: 'area_construida',
          label: 'Área Construida (m²)',
          tipo: 'number',
          min: 0,
          step: 0.1,
          requerido: true
        }
      ]
    },
    {
      titulo: "Personal Médico",
      campos: [
        {
          nombre: 'personal_medico_total',
          label: 'Personal Médico Total',
          tipo: 'number',
          min: 0,
          requerido: true
        }
      ]
    }
  ];

  const totalPasos = pasos.length;

  // Validar campos del paso actual
  const esPasoValido = () => {
    const paso = pasos[pasoActual];
    return paso.campos.every(campo => {
      if (!campo.requerido) return true;
      if (campo.tipo === 'multiselect') {
        return datos[campo.nombre] && datos[campo.nombre].length > 0;
      }
      return datos[campo.nombre] !== undefined && datos[campo.nombre] !== '';
    });
  };

  const handleSiguiente = () => {
    if (esPasoValido()) {
      if (pasoActual < totalPasos - 1) {
        setPasoActual(pasoActual + 1);
      }
    }
  };

  const handleAnterior = () => {
    if (pasoActual > 0) {
      setPasoActual(pasoActual - 1);
    }
  };

  // Renderizar un campo según su tipo
  const renderCampo = (campo) => {
    const valor = datos[campo.nombre] ?? (campo.tipo === 'multiselect' ? [] : '');
    
    switch (campo.tipo) {
      case 'select':
        return (
          <select
            value={valor}
            onChange={(e) => onChange(campo.nombre, e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-[#24412f]"
            required={campo.requerido}
          >
            <option value="">Seleccione...</option>
            {campo.opciones.map(op => (
              <option key={op.value} value={op.value}>{op.label}</option>
            ))}
          </select>
        );
      
      case 'number':
        return (
          <input
            type="number"
            value={valor}
            onChange={(e) => onChange(campo.nombre, e.target.value === '' ? '' : Number(e.target.value))}
            min={campo.min}
            step={campo.step || 1}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-[#24412f]"
            required={campo.requerido}
          />
        );
      
      case 'checkbox':
        return (
          <div className="flex items-center">
            <input
              type="checkbox"
              id={campo.nombre}
              checked={!!valor}
              onChange={(e) => onChange(campo.nombre, e.target.checked)}
              className="h-4 w-4 text-[#24412f] rounded focus:ring-[#24412f]"
            />
            <label htmlFor={campo.nombre} className="ml-2 text-sm text-gray-700">
              {campo.label}
            </label>
          </div>
        );
      
      case 'multiselect':
        return (
          <div className="space-y-2">
            {campo.opciones.map(op => (
              <div key={op.value} className="flex items-center">
                <input
                  type="checkbox"
                  id={`${campo.nombre}_${op.value}`}
                  checked={valor.includes(op.value)}
                  onChange={(e) => {
                    const nuevosValores = e.target.checked
                      ? [...valor, op.value]
                      : valor.filter(v => v !== op.value);
                    onChange(campo.nombre, nuevosValores);
                  }}
                  className="h-4 w-4 text-[#24412f] rounded focus:ring-[#24412f]"
                />
                <label htmlFor={`${campo.nombre}_${op.value}`} className="ml-2 text-sm text-gray-700">
                  {op.label}
                </label>
              </div>
            ))}
          </div>
        );
      
      default:
        return null;
    }
  };

  return (
    <div className="space-y-6">
      {/* Indicador de progreso */}
      <div className="flex justify-between items-center mb-6">
        <h4 className="text-lg font-medium text-gray-800">{pasos[pasoActual].titulo}</h4>
        <span className="text-sm text-gray-500">
          Paso {pasoActual + 1} de {totalPasos}
        </span>
      </div>

      {/* Barra de progreso visual */}
      <div className="w-full bg-gray-200 rounded-full h-2 mb-6">
        <div 
          className="bg-[#24412f] h-2 rounded-full transition-all duration-300"
          style={{ width: `${((pasoActual + 1) / totalPasos) * 100}%` }}
        ></div>
      </div>

      {/* Campos del paso actual */}
      <div className="space-y-4">
        {pasos[pasoActual].campos.map((campo, index) => (
          <div key={index}>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              {campo.label} {campo.requerido && <span className="text-red-500">*</span>}
            </label>
            {renderCampo(campo)}
          </div>
        ))}
      </div>

      {/* Botones de navegación */}
      <div className="flex justify-between pt-4">
        <Button
          type="button"
          onClick={handleAnterior}
          disabled={pasoActual === 0}
          className="px-4 py-2 bg-gray-200 text-gray-800 hover:bg-gray-300 rounded-md disabled:opacity-50"
        >
          Anterior
        </Button>
        
        <Button
          type="button"
          onClick={handleSiguiente}
          disabled={!esPasoValido()}
          className="px-4 py-2 bg-[#24412f] text-white hover:bg-[#1b2a1f] rounded-md disabled:opacity-50"
        >
          {pasoActual === totalPasos - 1 ? 'Completar Datos' : 'Siguiente'}
        </Button>
      </div>
    </div>
  );
};

const FormularioEncuentro = ({ datos, onChange }) => {
  const [pasoActual, setPasoActual] = useState(0);

  const pasos = [
    {
      titulo: "Tipo y Capacidad del Evento",
      campos: [
        {
          nombre: 'tipo_actividad',
          label: 'Tipo de Actividad',
          tipo: 'select',
          opciones: [
            { value: 'salon_eventos', label: 'Salón de Eventos' },
            { value: 'discoteca', label: 'Discoteca' },
            { value: 'casino', label: 'Casino' },
            { value: 'teatro', label: 'Teatro' },
            { value: 'cine', label: 'Cine' },
            { value: 'concierto', label: 'Sala de Conciertos' },
            { value: 'convenciones', label: 'Centro de Convenciones' },
            { value: 'deportivo', label: 'Evento Deportivo' },
            { value: 'religioso', label: 'Evento Religioso' },
            { value: 'feria', label: 'Feria/Exposición' }
          ],
          requerido: true
        },
        {
          nombre: 'carga_ocupantes',
          label: 'Carga de Ocupantes',
          tipo: 'number',
          min: 1,
          requerido: true
        }
      ]
    },
    {
      titulo: "Ubicación e Infraestructura",
      campos: [
        {
          nombre: 'ubicado_en_sotano',
          label: '¿El evento se realiza en sótano?',
          tipo: 'checkbox',
          requerido: false
        },
        {
          nombre: 'num_pisos',
          label: 'Número de Pisos',
          tipo: 'number',
          min: 1,
          requerido: true
        }
      ]
    },
    {
      titulo: "Área y Características",
      campos: [
        {
          nombre: 'area_total_m2',
          label: 'Área Total (m²)',
          tipo: 'number',
          min: 0,
          step: 0.1,
          requerido: true
        },
        {
          nombre: 'evento_recurrente',
          label: '¿Es un evento recurrente?',
          tipo: 'checkbox',
          requerido: false
        }
      ]
    },
    {
      titulo: "Horario de Funcionamiento",
      campos: [
        {
          nombre: 'horario_funcionamiento',
          label: 'Horario de Funcionamiento',
          tipo: 'select',
          opciones: [
            { value: 'diurno', label: 'Diurno' },
            { value: 'nocturno', label: 'Nocturno' },
            { value: 'mixto', label: 'Mixto' }
          ],
          requerido: true
        }
      ]
    }
  ];

  const totalPasos = pasos.length;

  // Validar campos del paso actual
  const esPasoValido = () => {
    const paso = pasos[pasoActual];
    return paso.campos.every(campo => {
      if (!campo.requerido) return true;
      if (campo.tipo === 'multiselect') {
        return datos[campo.nombre] && datos[campo.nombre].length > 0;
      }
      return datos[campo.nombre] !== undefined && datos[campo.nombre] !== '';
    });
  };

  const handleSiguiente = () => {
    if (esPasoValido()) {
      if (pasoActual < totalPasos - 1) {
        setPasoActual(pasoActual + 1);
      }
    }
  };

  const handleAnterior = () => {
    if (pasoActual > 0) {
      setPasoActual(pasoActual - 1);
    }
  };

  // Renderizar un campo según su tipo
  const renderCampo = (campo) => {
    const valor = datos[campo.nombre] ?? (campo.tipo === 'multiselect' ? [] : '');
    
    switch (campo.tipo) {
      case 'select':
        return (
          <select
            value={valor}
            onChange={(e) => onChange(campo.nombre, e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-[#24412f]"
            required={campo.requerido}
          >
            <option value="">Seleccione...</option>
            {campo.opciones.map(op => (
              <option key={op.value} value={op.value}>{op.label}</option>
            ))}
          </select>
        );
      
      case 'number':
        return (
          <input
            type="number"
            value={valor}
            onChange={(e) => onChange(campo.nombre, e.target.value === '' ? '' : Number(e.target.value))}
            min={campo.min}
            step={campo.step || 1}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-[#24412f]"
            required={campo.requerido}
          />
        );
      
      case 'checkbox':
        return (
          <div className="flex items-center">
            <input
              type="checkbox"
              id={campo.nombre}
              checked={!!valor}
              onChange={(e) => onChange(campo.nombre, e.target.checked)}
              className="h-4 w-4 text-[#24412f] rounded focus:ring-[#24412f]"
            />
            <label htmlFor={campo.nombre} className="ml-2 text-sm text-gray-700">
              {campo.label}
            </label>
          </div>
        );
      
      case 'multiselect':
        return (
          <div className="space-y-2">
            {campo.opciones.map(op => (
              <div key={op.value} className="flex items-center">
                <input
                  type="checkbox"
                  id={`${campo.nombre}_${op.value}`}
                  checked={valor.includes(op.value)}
                  onChange={(e) => {
                    const nuevosValores = e.target.checked
                      ? [...valor, op.value]
                      : valor.filter(v => v !== op.value);
                    onChange(campo.nombre, nuevosValores);
                  }}
                  className="h-4 w-4 text-[#24412f] rounded focus:ring-[#24412f]"
                />
                <label htmlFor={`${campo.nombre}_${op.value}`} className="ml-2 text-sm text-gray-700">
                  {op.label}
                </label>
              </div>
            ))}
          </div>
        );
      
      default:
        return null;
    }
  };

  return (
    <div className="space-y-6">
      {/* Indicador de progreso */}
      <div className="flex justify-between items-center mb-6">
        <h4 className="text-lg font-medium text-gray-800">{pasos[pasoActual].titulo}</h4>
        <span className="text-sm text-gray-500">
          Paso {pasoActual + 1} de {totalPasos}
        </span>
      </div>

      {/* Barra de progreso visual */}
      <div className="w-full bg-gray-200 rounded-full h-2 mb-6">
        <div 
          className="bg-[#24412f] h-2 rounded-full transition-all duration-300"
          style={{ width: `${((pasoActual + 1) / totalPasos) * 100}%` }}
        ></div>
      </div>

      {/* Campos del paso actual */}
      <div className="space-y-4">
        {pasos[pasoActual].campos.map((campo, index) => (
          <div key={index}>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              {campo.label} {campo.requerido && <span className="text-red-500">*</span>}
            </label>
            {renderCampo(campo)}
          </div>
        ))}
      </div>

      {/* Botones de navegación */}
      <div className="flex justify-between pt-4">
        <Button
          type="button"
          onClick={handleAnterior}
          disabled={pasoActual === 0}
          className="px-4 py-2 bg-gray-200 text-gray-800 hover:bg-gray-300 rounded-md disabled:opacity-50"
        >
          Anterior
        </Button>
        
        <Button
          type="button"
          onClick={handleSiguiente}
          disabled={!esPasoValido()}
          className="px-4 py-2 bg-[#24412f] text-white hover:bg-[#1b2a1f] rounded-md disabled:opacity-50"
        >
          {pasoActual === totalPasos - 1 ? 'Completar Datos' : 'Siguiente'}
        </Button>
      </div>
    </div>
  );
};

const FormularioHospedaje = ({ datos, onChange }) => {
  const [pasoActual, setPasoActual] = useState(0);

  const pasos = [
    {
      titulo: "Categoría y Tipo de Hospedaje",
      campos: [
        {
          nombre: 'categoria_estrellas',
          label: 'Categoría (Estrellas)',
          tipo: 'select',
          opciones: [
            { value: '0', label: 'Sin categoría' },
            { value: '1', label: '1 Estrella' },
            { value: '2', label: '2 Estrellas' },
            { value: '3', label: '3 Estrellas' },
            { value: '4', label: '4 Estrellas' },
            { value: '5', label: '5 Estrellas' }
          ],
          requerido: true
        },
        {
          nombre: 'tipo_hospedaje',
          label: 'Tipo de Hospedaje',
          tipo: 'select',
          opciones: [
            { value: 'hotel', label: 'Hotel' },
            { value: 'hostal', label: 'Hostal' },
            { value: 'albergue', label: 'Albergue' },
            { value: 'ecolodge', label: 'Ecolodge' },
            { value: 'residencial', label: 'Residencial' },
            { value: 'apartamento', label: 'Apartamento Turístico' }
          ],
          requerido: true
        }
      ]
    },
    {
      titulo: "Infraestructura del Establecimiento",
      campos: [
        {
          nombre: 'num_pisos',
          label: 'Número de Pisos',
          tipo: 'number',
          min: 1,
          requerido: true
        },
        {
          nombre: 'tiene_sotano',
          label: '¿Tiene sótano?',
          tipo: 'checkbox',
          requerido: false
        }
      ]
    },
    {
      titulo: "Capacidad y Ocupación",
      campos: [
        {
          nombre: 'num_habitaciones',
          label: 'Número de Habitaciones',
          tipo: 'number',
          min: 1,
          requerido: true
        },
        {
          nombre: 'capacidad_ocupantes',
          label: 'Capacidad de Ocupantes',
          tipo: 'number',
          min: 1,
          requerido: true
        }
      ]
    },
    {
      titulo: "Características Adicionales",
      campos: [
        {
          nombre: 'uso_mixto',
          label: '¿El establecimiento tiene uso mixto?',
          tipo: 'checkbox',
          requerido: false
        },
        {
          nombre: 'tiene_estacionamiento',
          label: '¿Tiene estacionamiento?',
          tipo: 'checkbox',
          requerido: false
        }
      ]
    },
    {
      titulo: "Estacionamiento en Sótano",
      campos: [
        {
          nombre: 'estacionamiento_en_sotano',
          label: '¿El estacionamiento está en sótano?',
          tipo: 'checkbox',
          requerido: false
        }
      ]
    }
  ];

  const totalPasos = pasos.length;

  // Validar campos del paso actual
  const esPasoValido = () => {
    const paso = pasos[pasoActual];
    return paso.campos.every(campo => {
      if (!campo.requerido) return true;
      if (campo.tipo === 'multiselect') {
        return datos[campo.nombre] && datos[campo.nombre].length > 0;
      }
      return datos[campo.nombre] !== undefined && datos[campo.nombre] !== '';
    });
  };

  const handleSiguiente = () => {
    if (esPasoValido()) {
      if (pasoActual < totalPasos - 1) {
        setPasoActual(pasoActual + 1);
      }
    }
  };

  const handleAnterior = () => {
    if (pasoActual > 0) {
      setPasoActual(pasoActual - 1);
    }
  };

  // Renderizar un campo según su tipo
  const renderCampo = (campo) => {
    const valor = datos[campo.nombre] ?? (campo.tipo === 'multiselect' ? [] : '');
    
    switch (campo.tipo) {
      case 'select':
        return (
          <select
            value={valor}
            onChange={(e) => onChange(campo.nombre, e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-[#24412f]"
            required={campo.requerido}
          >
            <option value="">Seleccione...</option>
            {campo.opciones.map(op => (
              <option key={op.value} value={op.value}>{op.label}</option>
            ))}
          </select>
        );
      
      case 'number':
        return (
          <input
            type="number"
            value={valor}
            onChange={(e) => onChange(campo.nombre, e.target.value === '' ? '' : Number(e.target.value))}
            min={campo.min}
            step={campo.step || 1}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-[#24412f]"
            required={campo.requerido}
          />
        );
      
      case 'checkbox':
        return (
          <div className="flex items-center">
            <input
              type="checkbox"
              id={campo.nombre}
              checked={!!valor}
              onChange={(e) => onChange(campo.nombre, e.target.checked)}
              className="h-4 w-4 text-[#24412f] rounded focus:ring-[#24412f]"
            />
            <label htmlFor={campo.nombre} className="ml-2 text-sm text-gray-700">
              {campo.label}
            </label>
          </div>
        );
      
      case 'multiselect':
        return (
          <div className="space-y-2">
            {campo.opciones.map(op => (
              <div key={op.value} className="flex items-center">
                <input
                  type="checkbox"
                  id={`${campo.nombre}_${op.value}`}
                  checked={valor.includes(op.value)}
                  onChange={(e) => {
                    const nuevosValores = e.target.checked
                      ? [...valor, op.value]
                      : valor.filter(v => v !== op.value);
                    onChange(campo.nombre, nuevosValores);
                  }}
                  className="h-4 w-4 text-[#24412f] rounded focus:ring-[#24412f]"
                />
                <label htmlFor={`${campo.nombre}_${op.value}`} className="ml-2 text-sm text-gray-700">
                  {op.label}
                </label>
              </div>
            ))}
          </div>
        );
      
      default:
        return null;
    }
  };

  return (
    <div className="space-y-6">
      {/* Indicador de progreso */}
      <div className="flex justify-between items-center mb-6">
        <h4 className="text-lg font-medium text-gray-800">{pasos[pasoActual].titulo}</h4>
        <span className="text-sm text-gray-500">
          Paso {pasoActual + 1} de {totalPasos}
        </span>
      </div>

      {/* Barra de progreso visual */}
      <div className="w-full bg-gray-200 rounded-full h-2 mb-6">
        <div 
          className="bg-[#24412f] h-2 rounded-full transition-all duration-300"
          style={{ width: `${((pasoActual + 1) / totalPasos) * 100}%` }}
        ></div>
      </div>

      {/* Campos del paso actual */}
      <div className="space-y-4">
        {pasos[pasoActual].campos.map((campo, index) => (
          <div key={index}>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              {campo.label} {campo.requerido && <span className="text-red-500">*</span>}
            </label>
            {renderCampo(campo)}
          </div>
        ))}
      </div>

      {/* Botones de navegación */}
      <div className="flex justify-between pt-4">
        <Button
          type="button"
          onClick={handleAnterior}
          disabled={pasoActual === 0}
          className="px-4 py-2 bg-gray-200 text-gray-800 hover:bg-gray-300 rounded-md disabled:opacity-50"
        >
          Anterior
        </Button>
        
        <Button
          type="button"
          onClick={handleSiguiente}
          disabled={!esPasoValido()}
          className="px-4 py-2 bg-[#24412f] text-white hover:bg-[#1b2a1f] rounded-md disabled:opacity-50"
        >
          {pasoActual === totalPasos - 1 ? 'Completar Datos' : 'Siguiente'}
        </Button>
      </div>
    </div>
  );
};

const FormularioEducacion = ({ datos, onChange }) => {
  const [pasoActual, setPasoActual] = useState(0);

  const pasos = [
    {
      titulo: "Nivel y Tipo de Institución",
      campos: [
        {
          nombre: 'nivel_educativo',
          label: 'Nivel Educativo',
          tipo: 'select',
          opciones: [
            { value: 'inicial', label: 'Inicial' },
            { value: 'primaria', label: 'Primaria' },
            { value: 'secundaria', label: 'Secundaria' },
            { value: 'superior', label: 'Superior' },
            { value: 'especial', label: 'Educación Especial' },
            { value: 'tecnico', label: 'Técnico Productivo' }
          ],
          requerido: true
        },
        {
          nombre: 'tipo_institucion',
          label: 'Tipo de Institución',
          tipo: 'select',
          opciones: [
            { value: 'cebe', label: 'CEBE' },
            { value: 'cee', label: 'CEE' },
            { value: 'ces', label: 'CES' },
            { value: 'colegio_regular', label: 'Colegio Regular' },
            { value: 'colegio_concertado', label: 'Colegio Concertado' },
            { value: 'instituto_superior', label: 'Instituto Superior' },
            { value: 'universidad', label: 'Universidad' },
            { value: 'centro_tecnologico', label: 'Centro Tecnológico' }
          ],
          requerido: true
        }
      ]
    },
    {
      titulo: "Infraestructura Física",
      campos: [
        {
          nombre: 'numero_pisos',
          label: 'Número de Pisos',
          tipo: 'select',
          opciones: [
            { value: '1', label: '1 piso' },
            { value: '2', label: '2 pisos' },
            { value: '3', label: '3 pisos' },
            { value: '4', label: '4 pisos' },
            { value: '5', label: '5 pisos' },
            { value: '6-10', label: '6 a 10 pisos' },
            { value: '>10', label: 'Más de 10 pisos' }
          ],
          requerido: true
        },
        {
          nombre: 'area_construida_m2',
          label: 'Área Construida (m²)',
          tipo: 'select',
          opciones: [
            { value: '<500', label: 'Menos de 500 m²' },
            { value: '500-1500', label: '500 - 1,500 m²' },
            { value: '1501-3000', label: '1,501 - 3,000 m²' },
            { value: '3001-6000', label: '3,001 - 6,000 m²' },
            { value: '>6000', label: 'Más de 6,000 m²' }
          ],
          requerido: true
        }
      ]
    },
    {
      titulo: "Capacidad y Atención",
      campos: [
        {
          nombre: 'capacidad_alumnos',
          label: 'Capacidad de Alumnos',
          tipo: 'select',
          opciones: [
            { value: '<100', label: 'Menos de 100 alumnos' },
            { value: '100-300', label: '100 - 300 alumnos' },
            { value: '301-600', label: '301 - 600 alumnos' },
            { value: '>600', label: 'Más de 600 alumnos' }
          ],
          requerido: true
        },
        {
          nombre: 'atiende_personas_discapacidad',
          label: '¿Atiende personas con discapacidad?',
          tipo: 'checkbox',
          requerido: false
        }
      ]
    },
    {
      titulo: "Aulas y Edificación",
      campos: [
        {
          nombre: 'cantidad_aulas',
          label: 'Cantidad de Aulas',
          tipo: 'number',
          min: 1,
          requerido: true
        },
        {
          nombre: 'tipo_edificacion',
          label: 'Tipo de Edificación',
          tipo: 'select',
          opciones: [
            { value: 'construida_educativa', label: 'Construida como Educativa' },
            { value: 'remodelada_educacion', label: 'Remodelada/Acondicionada para Educación' }
          ],
          requerido: true
        }
      ]
    }
  ];

  const totalPasos = pasos.length;

  // Validar campos del paso actual
  const esPasoValido = () => {
    const paso = pasos[pasoActual];
    return paso.campos.every(campo => {
      if (!campo.requerido) return true;
      if (campo.tipo === 'multiselect') {
        return datos[campo.nombre] && datos[campo.nombre].length > 0;
      }
      return datos[campo.nombre] !== undefined && datos[campo.nombre] !== '';
    });
  };

  const handleSiguiente = () => {
    if (esPasoValido()) {
      if (pasoActual < totalPasos - 1) {
        setPasoActual(pasoActual + 1);
      }
    }
  };

  const handleAnterior = () => {
    if (pasoActual > 0) {
      setPasoActual(pasoActual - 1);
    }
  };

  // Renderizar un campo según su tipo
  const renderCampo = (campo) => {
    const valor = datos[campo.nombre] ?? (campo.tipo === 'multiselect' ? [] : '');
    
    switch (campo.tipo) {
      case 'select':
        return (
          <select
            value={valor}
            onChange={(e) => onChange(campo.nombre, e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-[#24412f]"
            required={campo.requerido}
          >
            <option value="">Seleccione...</option>
            {campo.opciones.map(op => (
              <option key={op.value} value={op.value}>{op.label}</option>
            ))}
          </select>
        );
      
      case 'number':
        return (
          <input
            type="number"
            value={valor}
            onChange={(e) => onChange(campo.nombre, e.target.value === '' ? '' : Number(e.target.value))}
            min={campo.min}
            step={campo.step || 1}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-[#24412f]"
            required={campo.requerido}
          />
        );
      
      case 'checkbox':
        return (
          <div className="flex items-center">
            <input
              type="checkbox"
              id={campo.nombre}
              checked={!!valor}
              onChange={(e) => onChange(campo.nombre, e.target.checked)}
              className="h-4 w-4 text-[#24412f] rounded focus:ring-[#24412f]"
            />
            <label htmlFor={campo.nombre} className="ml-2 text-sm text-gray-700">
              {campo.label}
            </label>
          </div>
        );
      
      case 'multiselect':
        return (
          <div className="space-y-2">
            {campo.opciones.map(op => (
              <div key={op.value} className="flex items-center">
                <input
                  type="checkbox"
                  id={`${campo.nombre}_${op.value}`}
                  checked={valor.includes(op.value)}
                  onChange={(e) => {
                    const nuevosValores = e.target.checked
                      ? [...valor, op.value]
                      : valor.filter(v => v !== op.value);
                    onChange(campo.nombre, nuevosValores);
                  }}
                  className="h-4 w-4 text-[#24412f] rounded focus:ring-[#24412f]"
                />
                <label htmlFor={`${campo.nombre}_${op.value}`} className="ml-2 text-sm text-gray-700">
                  {op.label}
                </label>
              </div>
            ))}
          </div>
        );
      
      default:
        return null;
    }
  };

  return (
    <div className="space-y-6">
      {/* Indicador de progreso */}
      <div className="flex justify-between items-center mb-6">
        <h4 className="text-lg font-medium text-gray-800">{pasos[pasoActual].titulo}</h4>
        <span className="text-sm text-gray-500">
          Paso {pasoActual + 1} de {totalPasos}
        </span>
      </div>

      {/* Barra de progreso visual */}
      <div className="w-full bg-gray-200 rounded-full h-2 mb-6">
        <div 
          className="bg-[#24412f] h-2 rounded-full transition-all duration-300"
          style={{ width: `${((pasoActual + 1) / totalPasos) * 100}%` }}
        ></div>
      </div>

      {/* Campos del paso actual */}
      <div className="space-y-4">
        {pasos[pasoActual].campos.map((campo, index) => (
          <div key={index}>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              {campo.label} {campo.requerido && <span className="text-red-500">*</span>}
            </label>
            {renderCampo(campo)}
          </div>
        ))}
      </div>

      {/* Botones de navegación */}
      <div className="flex justify-between pt-4">
        <Button
          type="button"
          onClick={handleAnterior}
          disabled={pasoActual === 0}
          className="px-4 py-2 bg-gray-200 text-gray-800 hover:bg-gray-300 rounded-md disabled:opacity-50"
        >
          Anterior
        </Button>
        
        <Button
          type="button"
          onClick={handleSiguiente}
          disabled={!esPasoValido()}
          className="px-4 py-2 bg-[#24412f] text-white hover:bg-[#1b2a1f] rounded-md disabled:opacity-50"
        >
          {pasoActual === totalPasos - 1 ? 'Completar Datos' : 'Siguiente'}
        </Button>
      </div>
    </div>
  );
};

const FormularioIndustrial = ({ datos, onChange }) => {
  const [pasoActual, setPasoActual] = useState(0);

  const pasos = [
    {
      titulo: "Proceso y Maquinaria",
      campos: [
        {
          nombre: 'tipo_proceso_productivo',
          label: 'Tipo de Proceso Productivo',
          tipo: 'select',
          opciones: [
            { value: 'manual_artesanal', label: 'Manual/Artesanal' },
            { value: 'mecanizado', label: 'Mecanizado' },
            { value: 'automatizado', label: 'Automatizado' },
            { value: 'semiautomatizado', label: 'Semiautomatizado' },
            { value: 'ensamblaje', label: 'Ensamblaje' },
            { value: 'transformacion', label: 'Transformación' }
          ],
          requerido: true
        },
        {
          nombre: 'tipo_maquinaria_principal',
          label: 'Tipo de Maquinaria Principal',
          tipo: 'select',
          opciones: [
            { value: 'herramientas_manuales', label: 'Herramientas Manuales' },
            { value: 'maquinaria_liviana', label: 'Maquinaria Liviana' },
            { value: 'maquinaria_pesada', label: 'Maquinaria Pesada' },
            { value: 'equipo_electronico', label: 'Equipo Electrónico' },
            { value: 'robotica', label: 'Robótica' },
            { value: 'sin_maquinaria', label: 'Sin Maquinaria' }
          ],
          requerido: true
        }
      ]
    },
    {
      titulo: "Producción y Productos",
      campos: [
        {
          nombre: 'escala_produccion',
          label: 'Escala de Producción',
          tipo: 'select',
          opciones: [
            { value: 'unitaria_pedido', label: 'Unitaria/Por Pedido' },
            { value: 'pequena_serie', label: 'Pequeña Serie' },
            { value: 'produccion_masa', label: 'Producción en Masa' },
            { value: 'produccion_continua', label: 'Producción Continua' }
          ],
          requerido: true
        },
        {
          nombre: 'tipo_producto_fabricado',
          label: 'Tipo de Producto Fabricado',
          tipo: 'select',
          opciones: [
            { value: 'artesania_manualidades', label: 'Artesanía/Manualidades' },
            { value: 'alimentos_bebidas', label: 'Alimentos y Bebidas' },
            { value: 'textiles_confeccion', label: 'Textiles y Confección' },
            { value: 'metalurgia', label: 'Metalurgia' },
            { value: 'quimicos', label: 'Productos Químicos' },
            { value: 'madera', label: 'Madera y Muebles' },
            { value: 'plasticos', label: 'Plásticos' },
            { value: 'electronicos', label: 'Electrónicos' },
            { value: 'vehiculos', label: 'Vehículos y Partes' },
            { value: 'otros', label: 'Otros' }
          ],
          requerido: true
        }
      ]
    },
    {
      titulo: "Materiales y Peligrosidad",
      campos: [
        {
          nombre: 'trabaja_materiales_explosivos',
          label: '¿Trabaja con materiales explosivos?',
          tipo: 'checkbox',
          requerido: false
        },
        {
          nombre: 'nivel_peligrosidad_insumos',
          label: 'Nivel de Peligrosidad de Insumos',
          tipo: 'select',
          opciones: [
            { value: 'bajo', label: 'Bajo' },
            { value: 'medio', label: 'Medio' },
            { value: 'alto', label: 'Alto' },
            { value: 'muy_alto', label: 'Muy Alto' }
          ],
          requerido: true
        }
      ]
    },
    {
      titulo: "Infraestructura y Personal",
      campos: [
        {
          nombre: 'area_produccion_m2',
          label: 'Área de Producción (m²)',
          tipo: 'select',
          opciones: [
            { value: '<50', label: 'Menos de 50 m²' },
            { value: '50-200', label: '50 - 200 m²' },
            { value: '201-500', label: '201 - 500 m²' },
            { value: '501-1000', label: '501 - 1,000 m²' },
            { value: '>1000', label: 'Más de 1,000 m²' }
          ],
          requerido: true
        },
        {
          nombre: 'numero_trabajadores',
          label: 'Número de Trabajadores',
          tipo: 'select',
          opciones: [
            { value: '1-5', label: '1 - 5 trabajadores' },
            { value: '6-10', label: '6 - 10 trabajadores' },
            { value: '11-25', label: '11 - 25 trabajadores' },
            { value: '26-50', label: '26 - 50 trabajadores' },
            { value: '>50', label: 'Más de 50 trabajadores' }
          ],
          requerido: true
        }
      ]
    },
    {
      titulo: "Características Adicionales",
      campos: [
        {
          nombre: 'tiene_area_comercializacion_integrada',
          label: '¿Tiene área de comercialización integrada?',
          tipo: 'checkbox',
          requerido: false
        },
        {
          nombre: 'tipo_establecimiento',
          label: 'Tipo de Establecimiento',
          tipo: 'select',
          opciones: [
            { value: 'taller_artesanal', label: 'Taller Artesanal' },
            { value: 'micro_empresa', label: 'Micro Empresa Industrial' },
            { value: 'pequena_industria', label: 'Pequeña Industria' },
            { value: 'mediana_industria', label: 'Mediana Industria' },
            { value: 'gran_industria', label: 'Gran Industria' },
            { value: 'zona_industrial', label: 'Zona Industrial' },
            { value: 'parque_industrial', label: 'Parque Industrial' }
          ],
          requerido: true
        }
      ]
    }
  ];

  const totalPasos = pasos.length;

  // Validar campos del paso actual
  const esPasoValido = () => {
    const paso = pasos[pasoActual];
    return paso.campos.every(campo => {
      if (!campo.requerido) return true;
      if (campo.tipo === 'multiselect') {
        return datos[campo.nombre] && datos[campo.nombre].length > 0;
      }
      return datos[campo.nombre] !== undefined && datos[campo.nombre] !== '';
    });
  };

  const handleSiguiente = () => {
    if (esPasoValido()) {
      if (pasoActual < totalPasos - 1) {
        setPasoActual(pasoActual + 1);
      }
    }
  };

  const handleAnterior = () => {
    if (pasoActual > 0) {
      setPasoActual(pasoActual - 1);
    }
  };

  // Renderizar un campo según su tipo
  const renderCampo = (campo) => {
    const valor = datos[campo.nombre] ?? (campo.tipo === 'multiselect' ? [] : '');
    
    switch (campo.tipo) {
      case 'select':
        return (
          <select
            value={valor}
            onChange={(e) => onChange(campo.nombre, e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-[#24412f]"
            required={campo.requerido}
          >
            <option value="">Seleccione...</option>
            {campo.opciones.map(op => (
              <option key={op.value} value={op.value}>{op.label}</option>
            ))}
          </select>
        );
      
      case 'number':
        return (
          <input
            type="number"
            value={valor}
            onChange={(e) => onChange(campo.nombre, e.target.value === '' ? '' : Number(e.target.value))}
            min={campo.min}
            step={campo.step || 1}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-[#24412f]"
            required={campo.requerido}
          />
        );
      
      case 'checkbox':
        return (
          <div className="flex items-center">
            <input
              type="checkbox"
              id={campo.nombre}
              checked={!!valor}
              onChange={(e) => onChange(campo.nombre, e.target.checked)}
              className="h-4 w-4 text-[#24412f] rounded focus:ring-[#24412f]"
            />
            <label htmlFor={campo.nombre} className="ml-2 text-sm text-gray-700">
              {campo.label}
            </label>
          </div>
        );
      
      case 'multiselect':
        return (
          <div className="space-y-2">
            {campo.opciones.map(op => (
              <div key={op.value} className="flex items-center">
                <input
                  type="checkbox"
                  id={`${campo.nombre}_${op.value}`}
                  checked={valor.includes(op.value)}
                  onChange={(e) => {
                    const nuevosValores = e.target.checked
                      ? [...valor, op.value]
                      : valor.filter(v => v !== op.value);
                    onChange(campo.nombre, nuevosValores);
                  }}
                  className="h-4 w-4 text-[#24412f] rounded focus:ring-[#24412f]"
                />
                <label htmlFor={`${campo.nombre}_${op.value}`} className="ml-2 text-sm text-gray-700">
                  {op.label}
                </label>
              </div>
            ))}
          </div>
        );
      
      default:
        return null;
    }
  };

  return (
    <div className="space-y-6">
      {/* Indicador de progreso */}
      <div className="flex justify-between items-center mb-6">
        <h4 className="text-lg font-medium text-gray-800">{pasos[pasoActual].titulo}</h4>
        <span className="text-sm text-gray-500">
          Paso {pasoActual + 1} de {totalPasos}
        </span>
      </div>

      {/* Barra de progreso visual */}
      <div className="w-full bg-gray-200 rounded-full h-2 mb-6">
        <div 
          className="bg-[#24412f] h-2 rounded-full transition-all duration-300"
          style={{ width: `${((pasoActual + 1) / totalPasos) * 100}%` }}
        ></div>
      </div>

      {/* Campos del paso actual */}
      <div className="space-y-4">
        {pasos[pasoActual].campos.map((campo, index) => (
          <div key={index}>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              {campo.label} {campo.requerido && <span className="text-red-500">*</span>}
            </label>
            {renderCampo(campo)}
          </div>
        ))}
      </div>

      {/* Botones de navegación */}
      <div className="flex justify-between pt-4">
        <Button
          type="button"
          onClick={handleAnterior}
          disabled={pasoActual === 0}
          className="px-4 py-2 bg-gray-200 text-gray-800 hover:bg-gray-300 rounded-md disabled:opacity-50"
        >
          Anterior
        </Button>
        
        <Button
          type="button"
          onClick={handleSiguiente}
          disabled={!esPasoValido()}
          className="px-4 py-2 bg-[#24412f] text-white hover:bg-[#1b2a1f] rounded-md disabled:opacity-50"
        >
          {pasoActual === totalPasos - 1 ? 'Completar Datos' : 'Siguiente'}
        </Button>
      </div>
    </div>
  );
};

const FormularioOficinas = ({ datos, onChange }) => {
  const [pasoActual, setPasoActual] = useState(0);

  const pasos = [
    {
      titulo: "Infraestructura del Edificio",
      campos: [
        {
          nombre: 'numero_pisos_edificacion',
          label: 'Número de Pisos del Edificio',
          tipo: 'select',
          opciones: [
            { value: '1', label: '1 piso' },
            { value: '2', label: '2 pisos' },
            { value: '3', label: '3 pisos' },
            { value: '4', label: '4 pisos' },
            { value: '5', label: '5 pisos' },
            { value: '6-10', label: '6 - 10 pisos' },
            { value: '11-20', label: '11 - 20 pisos' },
            { value: '>20', label: 'Más de 20 pisos' }
          ],
          requerido: true
        },
        {
          nombre: 'area_techada_por_piso_m2',
          label: 'Área Techada por Piso (m²)',
          tipo: 'select',
          opciones: [
            { value: '<200', label: 'Menos de 200 m²' },
            { value: '200-400', label: '200 - 400 m²' },
            { value: '401-600', label: '401 - 600 m²' },
            { value: '601-800', label: '601 - 800 m²' },
            { value: '>800', label: 'Más de 800 m²' }
          ],
          requerido: true
        }
      ]
    },
    {
      titulo: "Área Total y Conformidad",
      campos: [
        {
          nombre: 'area_techada_total_m2',
          label: 'Área Techada Total (m²)',
          tipo: 'select',
          opciones: [
            { value: '<500', label: 'Menos de 500 m²' },
            { value: '500-2000', label: '500 - 2,000 m²' },
            { value: '2001-5000', label: '2,001 - 5,000 m²' },
            { value: '5001-10000', label: '5,001 - 10,000 m²' },
            { value: '>10000', label: 'Más de 10,000 m²' }
          ],
          requerido: true
        },
        {
          nombre: 'año_conformidad_obra',
          label: 'Año de Conformidad de Obra',
          tipo: 'number',
          min: 1900,
          max: new Date().getFullYear(),
          requerido: true
        }
      ]
    },
    {
      titulo: "Antigüedad y Vigencia de Conformidad",
      campos: [
        {
          nombre: 'antigüedad_conformidad_años',
          label: 'Antigüedad de Conformidad (años)',
          tipo: 'select',
          opciones: [
            { value: '0-1', label: '0 - 1 año' },
            { value: '2-3', label: '2 - 3 años' },
            { value: '4-5', label: '4 - 5 años' },
            { value: '6-10', label: '6 - 10 años' },
            { value: '>10', label: 'Más de 10 años' }
          ],
          requerido: true
        },
        {
          nombre: 'tiene_conformidad_obra_vigente',
          label: '¿Tiene conformidad de obra vigente?',
          tipo: 'checkbox',
          requerido: false
        }
      ]
    },
    {
      titulo: "Tipo de Conformidad y Ocupación",
      campos: [
        {
          nombre: 'tipo_conformidad',
          label: 'Tipo de Conformidad',
          tipo: 'select',
          opciones: [
            { value: 'obra_nueva', label: 'Obra Nueva' },
            { value: 'remodelacion', label: 'Remodelación' },
            { value: 'ampliacion', label: 'Ampliación' },
            { value: 'cambio_uso', label: 'Cambio de Uso' },
            { value: 'regularizacion', label: 'Regularización' }
          ],
          requerido: true
        },
        {
          nombre: 'tipo_ocupacion_edificio',
          label: 'Tipo de Ocupación del Edificio',
          tipo: 'select',
          opciones: [
            { value: 'uso_exclusivo', label: 'Uso Exclusivo' },
            { value: 'uso_compartido', label: 'Uso Compartido' }
          ],
          requerido: true
        }
      ]
    },
    {
      titulo: "Áreas Comunes y Ubicación",
      campos: [
        {
          nombre: 'areas_comunes_tienen_itse_vigente',
          label: 'Áreas Comunes con ITSE Vigente',
          tipo: 'select',
          opciones: [
            { value: 'si', label: 'Sí' },
            { value: 'no', label: 'No' },
            { value: 'no_aplica', label: 'No Aplica' }
          ],
          requerido: true
        },
        {
          nombre: 'piso_ubicacion_establecimiento',
          label: 'Piso de Ubicación del Establecimiento',
          tipo: 'select',
          opciones: [
            { value: 'pb', label: 'Planta Baja (PB)' },
            { value: 's1', label: 'Sótano 1' },
            { value: 's2', label: 'Sótano 2' },
            { value: '1', label: 'Piso 1' },
            { value: '2', label: 'Piso 2' },
            { value: '3', label: 'Piso 3' },
            { value: '4', label: 'Piso 4' },
            { value: '5', label: 'Piso 5' },
            { value: '6-10', label: 'Pisos 6-10' },
            { value: '>10', label: 'Más de 10 pisos' }
          ],
          requerido: true
        }
      ]
    },
    {
      titulo: "Diseño y Remodelaciones",
      campos: [
        {
          nombre: 'uso_diseño_original',
          label: 'Uso del Diseño Original',
          tipo: 'select',
          opciones: [
            { value: 'oficinas_origen', label: 'Oficinas desde origen' },
            { value: 'adaptado_oficinas', label: 'Adaptado a oficinas' }
          ],
          requerido: true
        },
        {
          nombre: 'ha_tenido_remodelaciones_ampliaciones',
          label: '¿Ha tenido remodelaciones o ampliaciones?',
          tipo: 'checkbox',
          requerido: false
        }
      ]
    }
  ];

  const totalPasos = pasos.length;

  // Validar campos del paso actual
  const esPasoValido = () => {
    const paso = pasos[pasoActual];
    return paso.campos.every(campo => {
      if (!campo.requerido) return true;
      if (campo.tipo === 'multiselect') {
        return datos[campo.nombre] && datos[campo.nombre].length > 0;
      }
      return datos[campo.nombre] !== undefined && datos[campo.nombre] !== '';
    });
  };

  const handleSiguiente = () => {
    if (esPasoValido()) {
      if (pasoActual < totalPasos - 1) {
        setPasoActual(pasoActual + 1);
      }
    }
  };

  const handleAnterior = () => {
    if (pasoActual > 0) {
      setPasoActual(pasoActual - 1);
    }
  };

  // Renderizar un campo según su tipo
  const renderCampo = (campo) => {
    const valor = datos[campo.nombre] ?? (campo.tipo === 'multiselect' ? [] : '');
    
    switch (campo.tipo) {
      case 'select':
        return (
          <select
            value={valor}
            onChange={(e) => onChange(campo.nombre, e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-[#24412f]"
            required={campo.requerido}
          >
            <option value="">Seleccione...</option>
            {campo.opciones.map(op => (
              <option key={op.value} value={op.value}>{op.label}</option>
            ))}
          </select>
        );
      
      case 'number':
        return (
          <input
            type="number"
            value={valor}
            onChange={(e) => onChange(campo.nombre, e.target.value === '' ? '' : Number(e.target.value))}
            min={campo.min}
            max={campo.max}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-[#24412f]"
            required={campo.requerido}
          />
        );
      
      case 'checkbox':
        return (
          <div className="flex items-center">
            <input
              type="checkbox"
              id={campo.nombre}
              checked={!!valor}
              onChange={(e) => onChange(campo.nombre, e.target.checked)}
              className="h-4 w-4 text-[#24412f] rounded focus:ring-[#24412f]"
            />
            <label htmlFor={campo.nombre} className="ml-2 text-sm text-gray-700">
              {campo.label}
            </label>
          </div>
        );
      
      case 'multiselect':
        return (
          <div className="space-y-2">
            {campo.opciones.map(op => (
              <div key={op.value} className="flex items-center">
                <input
                  type="checkbox"
                  id={`${campo.nombre}_${op.value}`}
                  checked={valor.includes(op.value)}
                  onChange={(e) => {
                    const nuevosValores = e.target.checked
                      ? [...valor, op.value]
                      : valor.filter(v => v !== op.value);
                    onChange(campo.nombre, nuevosValores);
                  }}
                  className="h-4 w-4 text-[#24412f] rounded focus:ring-[#24412f]"
                />
                <label htmlFor={`${campo.nombre}_${op.value}`} className="ml-2 text-sm text-gray-700">
                  {op.label}
                </label>
              </div>
            ))}
          </div>
        );
      
      default:
        return null;
    }
  };

  return (
    <div className="space-y-6">
      {/* Indicador de progreso */}
      <div className="flex justify-between items-center mb-6">
        <h4 className="text-lg font-medium text-gray-800">{pasos[pasoActual].titulo}</h4>
        <span className="text-sm text-gray-500">
          Paso {pasoActual + 1} de {totalPasos}
        </span>
      </div>

      {/* Barra de progreso visual */}
      <div className="w-full bg-gray-200 rounded-full h-2 mb-6">
        <div 
          className="bg-[#24412f] h-2 rounded-full transition-all duration-300"
          style={{ width: `${((pasoActual + 1) / totalPasos) * 100}%` }}
        ></div>
      </div>

      {/* Campos del paso actual */}
      <div className="space-y-4">
        {pasos[pasoActual].campos.map((campo, index) => (
          <div key={index}>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              {campo.label} {campo.requerido && <span className="text-red-500">*</span>}
            </label>
            {renderCampo(campo)}
          </div>
        ))}
      </div>

      {/* Botones de navegación */}
      <div className="flex justify-between pt-4">
        <Button
          type="button"
          onClick={handleAnterior}
          disabled={pasoActual === 0}
          className="px-4 py-2 bg-gray-200 text-gray-800 hover:bg-gray-300 rounded-md disabled:opacity-50"
        >
          Anterior
        </Button>
        
        <Button
          type="button"
          onClick={handleSiguiente}
          disabled={!esPasoValido()}
          className="px-4 py-2 bg-[#24412f] text-white hover:bg-[#1b2a1f] rounded-md disabled:opacity-50"
        >
          {pasoActual === totalPasos - 1 ? 'Completar Datos' : 'Siguiente'}
        </Button>
      </div>
    </div>
  );
};

const FormularioComercio = ({ datos, onChange }) => {
  const [pasoActual, setPasoActual] = useState(0);

  const pasos = [
    {
      titulo: "Infraestructura del Edificio",
      campos: [
        {
          nombre: 'numero_pisos_edificacion',
          label: 'Número de Pisos del Edificio',
          tipo: 'select',
          opciones: [
            { value: '1', label: '1 piso' },
            { value: '2', label: '2 pisos' },
            { value: '3', label: '3 pisos' },
            { value: '4', label: '4 pisos' },
            { value: '5-10', label: '5 - 10 pisos' },
            { value: '>10', label: 'Más de 10 pisos' }
          ],
          requerido: true
        },
        {
          nombre: 'area_techada_total_m2',
          label: 'Área Techada Total (m²)',
          tipo: 'select',
          opciones: [
            { value: '<300', label: 'Menos de 300 m²' },
            { value: '300-750', label: '300 - 750 m²' },
            { value: '751-1500', label: '751 - 1,500 m²' },
            { value: '1501-3000', label: '1,501 - 3,000 m²' },
            { value: '>3000', label: 'Más de 3,000 m²' }
          ],
          requerido: true
        }
      ]
    },
    {
      titulo: "Área de Venta y Tipo de Establecimiento",
      campos: [
        {
          nombre: 'area_venta_m2',
          label: 'Área de Venta (m²)',
          tipo: 'select',
          opciones: [
            { value: '<200', label: 'Menos de 200 m²' },
            { value: '200-500', label: '200 - 500 m²' },
            { value: '501-1000', label: '501 - 1,000 m²' },
            { value: '1001-2000', label: '1,001 - 2,000 m²' },
            { value: '>2000', label: 'Más de 2,000 m²' }
          ],
          requerido: true
        },
        {
          nombre: 'tipo_establecimiento_comercial',
          label: 'Tipo de Establecimiento Comercial',
          tipo: 'select',
          opciones: [
            { value: 'tienda_individual', label: 'Tienda Individual' },
            { value: 'kiosco', label: 'Kiosco' },
            { value: 'modulo_centro_comercial', label: 'Módulo en Centro Comercial' },
            { value: 'tienda_departamental', label: 'Tienda Departamental' },
            { value: 'supermercado', label: 'Supermercado' },
            { value: 'hipermercado', label: 'Hipermercado' },
            { value: 'mercado_abastos', label: 'Mercado de Abastos' },
            { value: 'galeria_comercial', label: 'Galería Comercial' },
            { value: 'centro_comercial', label: 'Centro Comercial' }
          ],
          requerido: true
        }
      ]
    },
    {
      titulo: "Operación y Uso del Edificio",
      campos: [
        {
          nombre: 'modalidad_operacion',
          label: 'Modalidad de Operación',
          tipo: 'select',
          opciones: [
            { value: 'independiente', label: 'Independiente' },
            { value: 'franquicia', label: 'Franquicia' },
            { value: 'cadena', label: 'Cadena' },
            { value: 'cooperativa', label: 'Cooperativa' },
            { value: 'asociacion', label: 'Asociación' }
          ],
          requerido: true
        },
        {
          nombre: 'uso_edificacion',
          label: 'Uso de la Edificación',
          tipo: 'select',
          opciones: [
            { value: 'comercial_exclusivo', label: 'Comercial Exclusivo' },
            { value: 'uso_mixto', label: 'Uso Mixto (Comercial + Residencial)' },
            { value: 'uso_mixto_oficinas', label: 'Uso Mixto (Comercial + Oficinas)' },
            { value: 'uso_mixto_industrial', label: 'Uso Mixto (Comercial + Industrial)' }
          ],
          requerido: true
        }
      ]
    },
    {
      titulo: "Licencias y Autorizaciones",
      campos: [
        {
          nombre: 'tipo_licencia_funcionamiento',
          label: 'Tipo de Licencia de Funcionamiento',
          tipo: 'select',
          opciones: [
            { value: 'individual', label: 'Individual' },
            { value: 'corporativa', label: 'Corporativa' },
            { value: 'municipal', label: 'Municipal' },
            { value: 'sectorial', label: 'Sectorial' },
            { value: 'especial', label: 'Especial' }
          ],
          requerido: true
        },
        {
          nombre: 'edificio_tiene_licencia_corporativa',
          label: 'Edificio con Licencia Corporativa',
          tipo: 'select',
          opciones: [
            { value: 'si', label: 'Sí' },
            { value: 'no', label: 'No' },
            { value: 'no_aplica', label: 'No Aplica' }
          ],
          requerido: true
        }
      ]
    },
    {
      titulo: "Productos Peligrosos",
      campos: [
        {
          nombre: 'comercializa_productos_explosivos_pirotecnicos',
          label: '¿Comercializa productos explosivos o pirotécnicos?',
          tipo: 'checkbox',
          requerido: false
        },
        {
          nombre: 'tipo_productos_peligrosos',
          label: 'Tipo de Productos Peligrosos',
          tipo: 'select',
          opciones: [
            { value: 'ninguno', label: 'Ninguno' },
            { value: 'explosivos', label: 'Explosivos' },
            { value: 'pirotecnicos', label: 'Pirotécnicos' },
            { value: 'quimicos', label: 'Productos Químicos' },
            { value: 'combustibles', label: 'Combustibles' },
            { value: 'gas_licuado', label: 'Gas Licuado' },
            { value: 'otros', label: 'Otros Productos Peligrosos' }
          ],
          requerido: true
        }
      ]
    },
    {
      titulo: "Formato y Locales Comerciales",
      campos: [
        {
          nombre: 'formato_comercial',
          label: 'Formato Comercial',
          tipo: 'select',
          opciones: [
            { value: 'tienda_pequena', label: 'Tienda Pequeña' },
            { value: 'tienda_mediana', label: 'Tienda Mediana' },
            { value: 'tienda_grande', label: 'Tienda Grande' },
            { value: 'supermercado', label: 'Supermercado' },
            { value: 'hipermercado', label: 'Hipermercado' },
            { value: 'centro_comercial', label: 'Centro Comercial' },
            { value: 'mercado_tradicional', label: 'Mercado Tradicional' },
            { value: 'galeria_comercial', label: 'Galería Comercial' },
            { value: 'outlet', label: 'Outlet' },
            { value: 'tienda_especializada', label: 'Tienda Especializada' }
          ],
          requerido: true
        },
        {
          nombre: 'numero_locales_comerciales_edificio',
          label: 'Número de Locales Comerciales en el Edificio',
          tipo: 'select',
          opciones: [
            { value: '1', label: '1 local' },
            { value: '2-5', label: '2 - 5 locales' },
            { value: '6-10', label: '6 - 10 locales' },
            { value: '11-20', label: '11 - 20 locales' },
            { value: '>20', label: 'Más de 20 locales' }
          ],
          requerido: true
        }
      ]
    }
  ];

  const totalPasos = pasos.length;

  // Validar campos del paso actual
  const esPasoValido = () => {
    const paso = pasos[pasoActual];
    return paso.campos.every(campo => {
      if (!campo.requerido) return true;
      if (campo.tipo === 'multiselect') {
        return datos[campo.nombre] && datos[campo.nombre].length > 0;
      }
      return datos[campo.nombre] !== undefined && datos[campo.nombre] !== '';
    });
  };

  const handleSiguiente = () => {
    if (esPasoValido()) {
      if (pasoActual < totalPasos - 1) {
        setPasoActual(pasoActual + 1);
      }
    }
  };

  const handleAnterior = () => {
    if (pasoActual > 0) {
      setPasoActual(pasoActual - 1);
    }
  };

  // Renderizar un campo según su tipo
  const renderCampo = (campo) => {
    const valor = datos[campo.nombre] ?? (campo.tipo === 'multiselect' ? [] : '');
    
    switch (campo.tipo) {
      case 'select':
        return (
          <select
            value={valor}
            onChange={(e) => onChange(campo.nombre, e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-[#24412f]"
            required={campo.requerido}
          >
            <option value="">Seleccione...</option>
            {campo.opciones.map(op => (
              <option key={op.value} value={op.value}>{op.label}</option>
            ))}
          </select>
        );
      
      case 'number':
        return (
          <input
            type="number"
            value={valor}
            onChange={(e) => onChange(campo.nombre, e.target.value === '' ? '' : Number(e.target.value))}
            min={campo.min}
            step={campo.step || 1}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-[#24412f]"
            required={campo.requerido}
          />
        );
      
      case 'checkbox':
        return (
          <div className="flex items-center">
            <input
              type="checkbox"
              id={campo.nombre}
              checked={!!valor}
              onChange={(e) => onChange(campo.nombre, e.target.checked)}
              className="h-4 w-4 text-[#24412f] rounded focus:ring-[#24412f]"
            />
            <label htmlFor={campo.nombre} className="ml-2 text-sm text-gray-700">
              {campo.label}
            </label>
          </div>
        );
      
      case 'multiselect':
        return (
          <div className="space-y-2">
            {campo.opciones.map(op => (
              <div key={op.value} className="flex items-center">
                <input
                  type="checkbox"
                  id={`${campo.nombre}_${op.value}`}
                  checked={valor.includes(op.value)}
                  onChange={(e) => {
                    const nuevosValores = e.target.checked
                      ? [...valor, op.value]
                      : valor.filter(v => v !== op.value);
                    onChange(campo.nombre, nuevosValores);
                  }}
                  className="h-4 w-4 text-[#24412f] rounded focus:ring-[#24412f]"
                />
                <label htmlFor={`${campo.nombre}_${op.value}`} className="ml-2 text-sm text-gray-700">
                  {op.label}
                </label>
              </div>
            ))}
          </div>
        );
      
      default:
        return null;
    }
  };

  return (
    <div className="space-y-6">
      {/* Indicador de progreso */}
      <div className="flex justify-between items-center mb-6">
        <h4 className="text-lg font-medium text-gray-800">{pasos[pasoActual].titulo}</h4>
        <span className="text-sm text-gray-500">
          Paso {pasoActual + 1} de {totalPasos}
        </span>
      </div>

      {/* Barra de progreso visual */}
      <div className="w-full bg-gray-200 rounded-full h-2 mb-6">
        <div 
          className="bg-[#24412f] h-2 rounded-full transition-all duration-300"
          style={{ width: `${((pasoActual + 1) / totalPasos) * 100}%` }}
        ></div>
      </div>

      {/* Campos del paso actual */}
      <div className="space-y-4">
        {pasos[pasoActual].campos.map((campo, index) => (
          <div key={index}>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              {campo.label} {campo.requerido && <span className="text-red-500">*</span>}
            </label>
            {renderCampo(campo)}
          </div>
        ))}
      </div>

      {/* Botones de navegación */}
      <div className="flex justify-between pt-4">
        <Button
          type="button"
          onClick={handleAnterior}
          disabled={pasoActual === 0}
          className="px-4 py-2 bg-gray-200 text-gray-800 hover:bg-gray-300 rounded-md disabled:opacity-50"
        >
          Anterior
        </Button>
        
        <Button
          type="button"
          onClick={handleSiguiente}
          disabled={!esPasoValido()}
          className="px-4 py-2 bg-[#24412f] text-white hover:bg-[#1b2a1f] rounded-md disabled:opacity-50"
        >
          {pasoActual === totalPasos - 1 ? 'Completar Datos' : 'Siguiente'}
        </Button>
      </div>
    </div>
  );
};

const FormularioAlmacen = ({ datos, onChange }) => {
  const [pasoActual, setPasoActual] = useState(0);

  const pasos = [
    {
      titulo: "Cobertura y Cerramiento",
      campos: [
        {
          nombre: 'tipo_cobertura',
          label: 'Tipo de Cobertura',
          tipo: 'select',
          opciones: [
            { value: 'no_techado', label: 'No Techado' },
            { value: 'parcialmente_techado', label: 'Parcialmente Techado' },
            { value: 'totalmente_techado', label: 'Totalmente Techado' }
          ],
          requerido: true
        },
        {
          nombre: 'porcentaje_area_techada',
          label: 'Porcentaje de Área Techada',
          tipo: 'select',
          opciones: [
            { value: '0%', label: '0%' },
            { value: '1-25%', label: '1% - 25%' },
            { value: '26-50%', label: '26% - 50%' },
            { value: '51-75%', label: '51% - 75%' },
            { value: '76-99%', label: '76% - 99%' },
            { value: '100%', label: '100%' }
          ],
          requerido: true
        }
      ]
    },
    {
      titulo: "Tipo de Cerramiento y Establecimiento",
      campos: [
        {
          nombre: 'tipo_cerramiento',
          label: 'Tipo de Cerramiento',
          tipo: 'select',
          opciones: [
            { value: 'abierto', label: 'Abierto' },
            { value: 'semi_abierto', label: 'Semi-abierto' },
            { value: 'cerrado', label: 'Cerrado' },
            { value: 'techado_abierto', label: 'Techado pero Abierto' }
          ],
          requerido: true
        },
        {
          nombre: 'tipo_establecimiento',
          label: 'Tipo de Establecimiento',
          tipo: 'select',
          opciones: [
            { value: 'almacen_general', label: 'Almacén General' },
            { value: 'deposito', label: 'Depósito' },
            { value: 'centro_distribucion', label: 'Centro de Distribución' },
            { value: 'bodega', label: 'Bodega' },
            { value: 'terminal_carga', label: 'Terminal de Carga' },
            { value: 'plataforma_logistica', label: 'Plataforma Logística' },
            { value: 'estacionamiento_almacenamiento', label: 'Estacionamiento/Almacenamiento' }
          ],
          requerido: true
        }
      ]
    },
    {
      titulo: "Uso y Productos Almacenados",
      campos: [
        {
          nombre: 'uso_principal',
          label: 'Uso Principal',
          tipo: 'select',
          opciones: [
            { value: 'almacenamiento_mercancias', label: 'Almacenamiento de mercancías' },
            { value: 'distribucion', label: 'Distribución' },
            { value: 'logistica', label: 'Logística' },
            { value: 'estacionamiento_vehiculos', label: 'Estacionamiento de vehículos' },
            { value: 'almacenamiento_materiales', label: 'Almacenamiento de materiales' },
            { value: 'otros', label: 'Otros usos' }
          ],
          requerido: true
        },
        {
          nombre: 'almacena_productos_explosivos_pirotecnicos',
          label: '¿Almacena productos explosivos o pirotécnicos?',
          tipo: 'checkbox',
          requerido: false
        }
      ]
    },
    {
      titulo: "Tipo de Productos y Nivel de Peligrosidad",
      campos: [
        {
          nombre: 'tipo_productos_almacenados',
          label: 'Tipo de Productos Almacenados',
          tipo: 'select',
          opciones: [
            { value: 'ninguno_vacio', label: 'Ninguno (vacío/vehículos)' },
            { value: 'productos_generales', label: 'Productos Generales' },
            { value: 'alimentos', label: 'Alimentos' },
            { value: 'textiles', label: 'Textiles' },
            { value: 'electronicos', label: 'Electrónicos' },
            { value: 'quimicos_no_peligrosos', label: 'Químicos No Peligrosos' },
            { value: 'quimicos_peligrosos', label: 'Químicos Peligrosos' },
            { value: 'explosivos', label: 'Explosivos' },
            { value: 'pirotecnicos', label: 'Pirotécnicos' },
            { value: 'combustibles', label: 'Combustibles' },
            { value: 'gas_licuado', label: 'Gas Licuado' },
            { value: 'materiales_construccion', label: 'Materiales de Construcción' },
            { value: 'otros_peligrosos', label: 'Otros Productos Peligrosos' }
          ],
          requerido: true
        },
        {
          nombre: 'nivel_peligrosidad_nfpa',
          label: 'Nivel de Peligrosidad NFPA',
          tipo: 'select',
          opciones: [
            { value: '0_minimo', label: '0 (mínimo)' },
            { value: '1_ligero', label: '1 (ligero)' },
            { value: '2_moderado', label: '2 (moderado)' },
            { value: '3_serio', label: '3 (serio)' },
            { value: '4_severo', label: '4 (severo)' }
          ],
          requerido: true
        }
      ]
    },
    {
      titulo: "Áreas Administrativas",
      campos: [
        {
          nombre: 'tiene_areas_administrativas_techadas',
          label: '¿Tiene áreas administrativas techadas?',
          tipo: 'checkbox',
          requerido: false
        },
        {
          nombre: 'area_administrativa_servicios_m2',
          label: 'Área Administrativa y Servicios (m²)',
          tipo: 'select',
          opciones: [
            { value: '0', label: '0 m² (sin áreas administrativas)' },
            { value: '1-50', label: '1 - 50 m²' },
            { value: '51-100', label: '51 - 100 m²' },
            { value: '101-200', label: '101 - 200 m²' },
            { value: '201-500', label: '201 - 500 m²' },
            { value: '>500', label: 'Más de 500 m²' }
          ],
          requerido: true
        }
      ]
    }
  ];

  const totalPasos = pasos.length;

  // Validar campos del paso actual
  const esPasoValido = () => {
    const paso = pasos[pasoActual];
    return paso.campos.every(campo => {
      if (!campo.requerido) return true;
      if (campo.tipo === 'multiselect') {
        return datos[campo.nombre] && datos[campo.nombre].length > 0;
      }
      return datos[campo.nombre] !== undefined && datos[campo.nombre] !== '';
    });
  };

  const handleSiguiente = () => {
    if (esPasoValido()) {
      if (pasoActual < totalPasos - 1) {
        setPasoActual(pasoActual + 1);
      }
    }
  };

  const handleAnterior = () => {
    if (pasoActual > 0) {
      setPasoActual(pasoActual - 1);
    }
  };

  // Renderizar un campo según su tipo
  const renderCampo = (campo) => {
    const valor = datos[campo.nombre] ?? (campo.tipo === 'multiselect' ? [] : '');
    
    switch (campo.tipo) {
      case 'select':
        return (
          <select
            value={valor}
            onChange={(e) => onChange(campo.nombre, e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-[#24412f]"
            required={campo.requerido}
          >
            <option value="">Seleccione...</option>
            {campo.opciones.map(op => (
              <option key={op.value} value={op.value}>{op.label}</option>
            ))}
          </select>
        );
      
      case 'number':
        return (
          <input
            type="number"
            value={valor}
            onChange={(e) => onChange(campo.nombre, e.target.value === '' ? '' : Number(e.target.value))}
            min={campo.min}
            step={campo.step || 1}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-[#24412f]"
            required={campo.requerido}
          />
        );
      
      case 'checkbox':
        return (
          <div className="flex items-center">
            <input
              type="checkbox"
              id={campo.nombre}
              checked={!!valor}
              onChange={(e) => onChange(campo.nombre, e.target.checked)}
              className="h-4 w-4 text-[#24412f] rounded focus:ring-[#24412f]"
            />
            <label htmlFor={campo.nombre} className="ml-2 text-sm text-gray-700">
              {campo.label}
            </label>
          </div>
        );
      
      case 'multiselect':
        return (
          <div className="space-y-2">
            {campo.opciones.map(op => (
              <div key={op.value} className="flex items-center">
                <input
                  type="checkbox"
                  id={`${campo.nombre}_${op.value}`}
                  checked={valor.includes(op.value)}
                  onChange={(e) => {
                    const nuevosValores = e.target.checked
                      ? [...valor, op.value]
                      : valor.filter(v => v !== op.value);
                    onChange(campo.nombre, nuevosValores);
                  }}
                  className="h-4 w-4 text-[#24412f] rounded focus:ring-[#24412f]"
                />
                <label htmlFor={`${campo.nombre}_${op.value}`} className="ml-2 text-sm text-gray-700">
                  {op.label}
                </label>
              </div>
            ))}
          </div>
        );
      
      default:
        return null;
    }
  };

  return (
    <div className="space-y-6">
      {/* Indicador de progreso */}
      <div className="flex justify-between items-center mb-6">
        <h4 className="text-lg font-medium text-gray-800">{pasos[pasoActual].titulo}</h4>
        <span className="text-sm text-gray-500">
          Paso {pasoActual + 1} de {totalPasos}
        </span>
      </div>

      {/* Barra de progreso visual */}
      <div className="w-full bg-gray-200 rounded-full h-2 mb-6">
        <div 
          className="bg-[#24412f] h-2 rounded-full transition-all duration-300"
          style={{ width: `${((pasoActual + 1) / totalPasos) * 100}%` }}
        ></div>
      </div>

      {/* Campos del paso actual */}
      <div className="space-y-4">
        {pasos[pasoActual].campos.map((campo, index) => (
          <div key={index}>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              {campo.label} {campo.requerido && <span className="text-red-500">*</span>}
            </label>
            {renderCampo(campo)}
          </div>
        ))}
      </div>

      {/* Botones de navegación */}
      <div className="flex justify-between pt-4">
        <Button
          type="button"
          onClick={handleAnterior}
          disabled={pasoActual === 0}
          className="px-4 py-2 bg-gray-200 text-gray-800 hover:bg-gray-300 rounded-md disabled:opacity-50"
        >
          Anterior
        </Button>
        
        <Button
          type="button"
          onClick={handleSiguiente}
          disabled={!esPasoValido()}
          className="px-4 py-2 bg-[#24412f] text-white hover:bg-[#1b2a1f] rounded-md disabled:opacity-50"
        >
          {pasoActual === totalPasos - 1 ? 'Completar Datos' : 'Siguiente'}
        </Button>
      </div>
    </div>
  );
};