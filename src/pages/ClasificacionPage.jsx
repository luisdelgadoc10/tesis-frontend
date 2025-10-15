// src/pages/ClasificacionesPage.jsx
import { useState, useEffect, useMemo } from "react";
import { useAuth } from "../context/AuthContext";
import { FileText, Plus, Eye, Trash2, RotateCcw } from "lucide-react";
import { useNavigate } from "react-router-dom";
import Button from "../components/Button";
import StatusBadge from "../components/StatusBadge";
import RiskBadge from "../components/RiskBadge";
import CustomTable from "../components/CustomTable"; // Importar el nuevo componente

export default function ClasificacionesPage() {
  const { api } = useAuth();
  const navigate = useNavigate();
  const [clasificaciones, setClasificaciones] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Cargar clasificaciones
  const fetchClasificaciones = async () => {
    try {
      setLoading(true);
      const { data } = await api.get("/clasificaciones");
      setClasificaciones(Array.isArray(data) ? data : data.data || []);
    } catch (err) {
      console.error("Error al cargar clasificaciones:", err);
      setError("No se pudieron cargar las clasificaciones.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchClasificaciones();
  }, []);

  // Ver detalle
  const handleView = (id) => {
    navigate(`/clasificaciones/${id}`);
  };

  // Eliminar
  const handleDelete = async (id) => {
    if (!window.confirm("¿Estás seguro de eliminar esta clasificación?"))
      return;

    try {
      await api.delete(`/clasificaciones/${id}`);
      fetchClasificaciones();
    } catch (err) {
      console.error("Error al eliminar clasificación:", err);
      alert("No se pudo eliminar la clasificación.");
    }
  };

  // Restaurar
  const handleRestore = async (id) => {
    if (!window.confirm("¿Estás seguro de restaurar esta clasificación?"))
      return;

    try {
      await api.patch(`/clasificaciones/${id}/restore`);
      fetchClasificaciones();
    } catch (err) {
      console.error("Error al restaurar clasificación:", err);
      alert("No se pudo restaurar la clasificación.");
    }
  };

  const handleReport = (id) => {
    const backendUrl = import.meta.env.VITE_API_URL.replace("/api", ""); 
    // 🔹 quitamos "/api" porque la ruta del PDF no está bajo /api

    window.open(`${backendUrl}/clasificaciones/${id}/pdf`, "_blank");
  };

  // Convertir el nivel de riesgo al formato que espera RiskBadge
  const convertRiesgoLevel = (nivel) => {
    if (!nivel) return "bajo";

    const nivelLower = nivel.toLowerCase().trim();

    // Mapear exactamente los valores posibles
    if (nivelLower === "muy alto" || nivelLower === "muy_alto") {
      return "muy_alto";
    }
    if (nivelLower === "alto") {
      return "alto";
    }
    if (nivelLower === "medio") {
      return "medio";
    }
    if (nivelLower === "bajo") {
      return "bajo";
    }

    // Si no coincide exactamente, intentar detectar
    if (nivelLower.includes("muy") && nivelLower.includes("alto")) {
      return "muy_alto";
    }

    // Por defecto, devolver el nivel tal cual en minúsculas
    return nivelLower;
  };

  // Obtener la subfunción específica según la función (del resultado_modelo)
  const getSubfuncion = (clasificacion) => {
    const resultado = clasificacion.detalle?.resultado_modelo;
    if (!resultado) return "N/A";

    const funcionNombre = clasificacion.funcion?.nombre?.toUpperCase();
    switch (funcionNombre) {
      case "SALUD":
        return resultado.subfuncion_salud || "N/A";
      case "COMERCIO":
        return resultado.subfuncion_comercio || "N/A";
      case "ENCUENTRO":
        return resultado.subfuncion_encuentro || "N/A";
      case "HOSPEDAJE":
        return resultado.subfuncion_hospedaje || "N/A";
      case "EDUCACION":
        return resultado.subfuncion_educacion || "N/A";
      case "INDUSTRIAL":
        return resultado.subfuncion_industrial || "N/A";
      case "OFICINAS":
        return resultado.subfuncion_oficinas || "N/A";
      case "ALMACEN":
        return resultado.subfuncion_almacen || "N/A";
      default:
        return "N/A";
    }
  };

  // Obtener el riesgo_final directo de la columna (ahora es texto)
  const getRiesgoFinal = (clasificacion) => {
    return clasificacion.detalle?.riesgo_final || "N/A";
  };

  // Obtener el valor de confianza del resultado del modelo
  const getConfianza = (clasificacion) => {
    const confianza = clasificacion.detalle?.resultado_modelo?.confianza;
    if (confianza === undefined || confianza === null) {
      return "N/A";
    }
    return confianza.toFixed(2) + '%';
  };

  // Obtener el tiempo de procesamiento en ms
  const getTiempoMs = (clasificacion) => {
    const tiempoMs = clasificacion.detalle?.resultado_modelo?.tiempo_ms;
    if (tiempoMs === undefined || tiempoMs === null) {
      return "N/A";
    }
    return tiempoMs.toFixed(2) + ' ms';
  };

  // Definir columnas para la tabla personalizada
  const columns = useMemo(() => [
    {
      header: 'Establecimiento',
      accessorKey: 'establecimiento',
      cell: ({ row }) => (
        <div className="text-sm">
          <div className="font-medium text-gray-900">
            {row.original.establecimiento?.nombre_comercial || "—"}
          </div>
          <div className="text-gray-500">
            {row.original.establecimiento?.ruc || ""}
          </div>
        </div>
      ),
    },
    {
      header: 'Función',
      accessorKey: 'funcion.nombre',
      cell: ({ row }) => (
        <div className="text-sm text-gray-900">
          {row.original.funcion?.nombre || "—"}
        </div>
      ),
    },
    {
      header: 'Subfunción',
      accessorKey: 'subfuncion',
      cell: ({ row }) => (
        <span className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-blue-100 text-blue-800">
          {getSubfuncion(row.original)}
        </span>
      ),
    },
    {
      header: 'Riesgo Final',
      accessorKey: 'riesgo_final',
      cell: ({ row }) => {
        const riesgoFinal = getRiesgoFinal(row.original);
        return riesgoFinal !== "N/A" ? (
          <RiskBadge
            level={convertRiesgoLevel(riesgoFinal)}
            size="xs"
            variant="solid"
          />
        ) : (
          <span className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-gray-100 text-gray-800">
            N/A
          </span>
        );
      },
    },
    {
      header: 'Precisión',
      accessorKey: 'confianza',
      cell: ({ row }) => (
        <span className="text-sm text-gray-900 font-medium">
          {getConfianza(row.original)}
        </span>
      ),
    },
    {
      header: 'Tiempo (ms)',
      accessorKey: 'tiempo_ms',
      cell: ({ row }) => (
        <span className="text-sm text-gray-900">
          {getTiempoMs(row.original)}
        </span>
      ),
    },
    {
      header: 'Acciones',
      cell: ({ row }) => (
        <div className="flex items-center">
          {row.original.estado ? (
            <>
              <button
                onClick={() => handleView(row.original.id)}
                className="text-blue-600 hover:text-blue-900 mr-3 p-1"
                title="Ver"
              >
                <Eye size={16} />
              </button>
              <button
                onClick={() => handleReport(row.original.id)}
                className="text-amber-600 hover:text-amber-900 p-1 mr-2"
                title="Ver reporte PDF"
              >
                <FileText size={16} />
              </button>
              <button
                onClick={() => handleDelete(row.original.id)}
                className="text-red-600 hover:text-red-900 p-1"
                title="Eliminar"
              >
                <Trash2 size={16} />
              </button>
            </>
          ) : (
            <button
              onClick={() => handleRestore(row.original.id)}
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
  const ClasificacionCard = ({ clasificacion }) => (
    <div className="bg-white rounded-lg shadow border p-4 mb-4">
      <div className="flex items-start justify-between mb-3">
        <div>
          <h3 className="font-medium text-gray-900">
            {clasificacion.funcion?.nombre || "Sin función"}
          </h3>
          <p className="text-sm text-gray-500">
            {clasificacion.establecimiento?.nombre_comercial || "Sin establecimiento"}
          </p>
        </div>
      </div>

      <div className="space-y-2 text-sm">
        <div className="flex justify-between">
          <span className="text-gray-500">Subfunción:</span>
          <span className="font-medium">{getSubfuncion(clasificacion)}</span>
        </div>
        <div className="flex justify-between">
          <span className="text-gray-500">Riesgo Final:</span>
          <span className="font-medium">
            {getRiesgoFinal(clasificacion) !== "N/A" ? (
              <RiskBadge level={convertRiesgoLevel(getRiesgoFinal(clasificacion))} size="xs" />
            ) : (
              "N/A"
            )}
          </span>
        </div>
        <div className="flex justify-between">
          <span className="text-gray-500">Precisión:</span>
          <span className="font-medium">{getConfianza(clasificacion)}</span>
        </div>
        <div className="flex justify-between">
          <span className="text-gray-500">Tiempo (ms):</span>
          <span className="font-medium">{getTiempoMs(clasificacion)}</span>
        </div>
        <div className="flex justify-between">
          <span className="text-gray-500">Usuario:</span>
          <span className="font-medium">
            {clasificacion.user?.name || "N/A"}
          </span>
        </div>
      </div>

      <div className="flex justify-end mt-4 space-x-2">
        {clasificacion.estado ? (
          <>
            <button
              onClick={() => handleView(clasificacion.id)}
              className="p-2 text-blue-600 hover:text-blue-900 hover:bg-blue-50 rounded-full transition-colors"
              title="Ver"
            >
              <Eye size={16} />
            </button>
            <button
              onClick={() => handleDelete(clasificacion.id)}
              className="p-2 text-red-600 hover:text-red-900 hover:bg-red-50 rounded-full transition-colors"
              title="Eliminar"
            >
              <Trash2 size={16} />
            </button>
          </>
        ) : (
          <button
            onClick={() => handleRestore(clasificacion.id)}
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
        <h2 className="text-xl font-medium">Clasificaciones de Establecimientos</h2>
        <Button
          onClick={() => navigate("/clasificaciones/nueva")}
          className="flex items-center gap-2 bg-[#24412f] text-white hover:bg-[#1b2a1f] transition-colors w-full sm:w-auto justify-center"
        >
          <Plus size={18} />
          Nueva Clasificación
        </Button>
      </div>

      {error && (
        <div className="bg-red-100 text-red-700 p-3 rounded mb-4">{error}</div>
      )}

      {loading ? (
        <div className="text-center py-10">Cargando clasificaciones...</div>
      ) : (
        <>
          {/* Vista móvil - Cards */}
          <div className="md:hidden">
            {clasificaciones.length === 0 ? (
              <div className="text-center py-10 text-gray-500">
                No hay clasificaciones disponibles.
              </div>
            ) : (
              <div className="space-y-4">
                {clasificaciones.map((clasificacion) => (
                  <ClasificacionCard 
                    key={clasificacion.id} 
                    clasificacion={clasificacion} 
                  />
                ))}
              </div>
            )}
          </div>

          {/* Vista escritorio - Tabla personalizada con CustomTable */}
          <div className="hidden md:block">
            <CustomTable 
              data={clasificaciones} 
              columns={columns} 
              searchable={true}
            />
          </div>
        </>
      )}
    </div>
  );
}