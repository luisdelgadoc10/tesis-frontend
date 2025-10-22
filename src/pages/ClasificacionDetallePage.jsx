// src/pages/ClasificacionDetallePage.jsx
import { useState, useEffect } from "react";
import { useAuth } from "../context/AuthContext";
import { useNavigate, useParams } from "react-router-dom";
import { 
  ArrowLeft, 
  FileText, 
  Eye, 
  MapPin, 
  Calendar, 
  User, 
  Building, 
  CheckCircle, 
  XCircle,
  Clock,
  Target,
  AlertTriangle,
  Flame,
  Home
} from "lucide-react";
import StatusBadge from "../components/StatusBadge";
import RiskBadge from "../components/RiskBadge";

export default function ClasificacionDetallePage() {
  const { api } = useAuth();
  const navigate = useNavigate();
  const { id } = useParams();
  const [clasificacion, setClasificacion] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Cargar clasificación
  const fetchClasificacion = async () => {
    try {
      setLoading(true);
      const { data } = await api.get(`/clasificaciones/${id}`);
      console.log("Datos completos:", data);
    console.log("Detalle:", data.detalle);
    console.log("Riesgo final:", data.detalle?.riesgo?.nombre);
    console.log("Riesgo incendio:", data.detalle?.riesgoIncendio?.nombre);
    console.log("Riesgo colapso:", data.detalle?.riesgoColapso?.nombre);
      setClasificacion(data);
    } catch (err) {
      console.error("Error al cargar clasificación:", err);
      setError("No se pudo cargar la clasificación.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchClasificacion();
  }, [id]);

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

  // Obtener subfunción específica según la función (igual al de la página de listado)
  const getSubfuncion = (detalle) => {
    const resultado = detalle?.resultado_modelo;
    if (!resultado) return "N/A";
    
    const funcionNombre = clasificacion?.funcion?.nombre?.toUpperCase();
    switch (funcionNombre) {
      case 'SALUD':
        return resultado.subfuncion_salud || "N/A";
      case 'COMERCIO':
        return resultado.subfuncion_comercio || "N/A";
      case 'ENCUENTRO':
        return resultado.subfuncion_encuentro || "N/A";
      case 'HOSPEDAJE':
        return resultado.subfuncion_hospedaje || "N/A";
      case 'EDUCACION':
        return resultado.subfuncion_educacion || "N/A";
      case 'INDUSTRIAL':
        return resultado.subfuncion_industrial || "N/A";
      case 'OFICINAS':
        return resultado.subfuncion_oficinas || "N/A";
      case 'ALMACEN':
        return resultado.subfuncion_almacen || "N/A";
      default:
        return "N/A";
    }
  };

  // Obtener el riesgo_final - Probar diferentes estructuras posibles
  const getRiesgoFinal = (clasificacion) => {
    return clasificacion.detalle?.riesgo_final || 
           "N/A";
  };

  const getRiesgoIncendio = (clasificacion) => {
    return clasificacion.detalle?.riesgo_incendio || "N/A";
  };

  // Obtener el riesgo de colapso
  const getRiesgoColapso = (clasificacion) => {
    return clasificacion.detalle?.riesgo_colapso || "N/A";
  };

  // Obtener el valor de confianza del resultado del modelo (igual al de la página de listado)
  const getConfianza = (detalle) => {
    const confianza = detalle?.resultado_modelo?.confianza;
    if (confianza === undefined || confianza === null) {
      return "N/A";
    }
    return confianza + "%";
  };

  // Obtener el tiempo de procesamiento en ms (igual al de la página de listado)
  const getTiempoMs = (detalle) => {
    const tiempoMs = detalle?.resultado_modelo?.tiempo_s;
    if (tiempoMs === undefined || tiempoMs === null) {
      return "N/A";
    }
    return tiempoMs.toFixed(2) + ' s';
  };

  // Formatear JSON para mostrar
  const formatJSON = (json) => {
    return JSON.stringify(json, null, 2);
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#24412f] mx-auto"></div>
          <p className="mt-4 text-gray-600">Cargando detalles...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gray-50 p-4">
        <div className="max-w-6xl mx-auto">
          <div className="bg-red-100 text-red-700 p-4 rounded-lg mb-6">
            {error}
          </div>
          <button
            onClick={() => navigate(-1)}
            className="flex items-center gap-2 text-gray-600 hover:text-gray-900 mb-6"
          >
            <ArrowLeft size={18} />
            Volver
          </button>
        </div>
      </div>
    );
  }

  if (!clasificacion) {
    return (
      <div className="min-h-screen bg-gray-50 p-4">
        <div className="max-w-6xl mx-auto">
          <div className="bg-yellow-100 text-yellow-700 p-4 rounded-lg mb-6">
            Clasificación no encontrada.
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

  const detalle = clasificacion.detalle;

  return (
    <div className="min-h-screen bg-gray-50 p-4">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="bg-white rounded-lg shadow mb-6 p-6">
          <div className="flex items-center justify-between mb-4">
            <button
              onClick={() => navigate(-1)}
              className="flex items-center gap-2 text-gray-600 hover:text-gray-900 mb-4"
            >
              <ArrowLeft size={18} />
              Volver
            </button>
            <StatusBadge 
              status={clasificacion.estado ? "active" : "inactive"} 
              text={clasificacion.estado ? "Activa" : "Eliminada"} 
            />
          </div>
          
          <div className="flex items-start justify-between">
            <div>
              <h1 className="text-2xl font-bold text-gray-900 mb-2">
                Detalle de Clasificación
              </h1>
              <div className="flex items-center gap-4 text-sm text-gray-600">
                <div className="flex items-center gap-1">
                  <Calendar size={16} />
                  {new Date(clasificacion.created_at).toLocaleDateString('es-ES')}
                </div>
                <div className="flex items-center gap-1">
                  <User size={16} />
                  {clasificacion.user?.name || "N/A"}
                </div>
              </div>
            </div>
            <div className="text-right">
              <div className="text-lg font-semibold text-gray-900">
                {clasificacion.establecimiento?.nombre_comercial || "Sin nombre"}
              </div>
              <div className="text-sm text-gray-500">
                RUC: {clasificacion.establecimiento?.ruc || "N/A"}
              </div>
            </div>
          </div>
        </div>

        {/* Información Principal */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
          {/* Información del Establecimiento */}
          <div className="bg-white rounded-lg shadow p-6">
            <h2 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
              <Building size={20} />
              Información del Establecimiento
            </h2>
            <div className="space-y-3">
              <div>
                <span className="text-sm font-medium text-gray-500">Nombre Comercial:</span>
                <p className="text-gray-900">{clasificacion.establecimiento?.nombre_comercial || "N/A"}</p>
              </div>
              <div>
                <span className="text-sm font-medium text-gray-500">RUC:</span>
                <p className="text-gray-900">{clasificacion.establecimiento?.ruc || "N/A"}</p>
              </div>
              <div>
                <span className="text-sm font-medium text-gray-500">Dirección:</span>
                <p className="text-gray-900">{clasificacion.establecimiento?.direccion || "N/A"}</p>
              </div>
              <div>
                <span className="text-sm font-medium text-gray-500">Teléfono:</span>
                <p className="text-gray-900">{clasificacion.establecimiento?.telefono || "N/A"}</p>
              </div>
              <div>
                <span className="text-sm font-medium text-gray-500">Correo Electrónico:</span>
                <p className="text-gray-900">{clasificacion.establecimiento?.correo_electronico || "N/A"}</p>
              </div>
            </div>
          </div>

          {/* Información de Clasificación */}
          <div className="bg-white rounded-lg shadow p-6">
            <h2 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
              <Target size={20} />
              Información de Clasificación
            </h2>
            <div className="space-y-3">
              <div>
                <span className="text-sm font-medium text-gray-500">Función:</span>
                <p className="text-gray-900">{clasificacion.funcion?.nombre || "N/A"}</p>
              </div>
              <div>
                <span className="text-sm font-medium text-gray-500">Subfunción:</span>
                <p className="text-gray-900">{getSubfuncion(detalle)}</p>
              </div>
              <div>
                <span className="text-sm font-medium text-gray-500">Riesgo Final:</span>
                <p className="text-gray-900">
                  {getRiesgoFinal(clasificacion) !== "N/A" ? (
                    <RiskBadge level={convertRiesgoLevel(getRiesgoFinal(clasificacion))} size="sm" variant="solid"/>
                  ) : (
                    "N/A"
                  )}
                </p>
              </div>
              <div>
                <span className="text-sm font-medium text-gray-500">Riesgo de Incendio:</span>
                <p className="text-gray-900">
                  {getRiesgoIncendio(clasificacion) !== "N/A" ? (
                    <RiskBadge level={convertRiesgoLevel(getRiesgoIncendio(clasificacion))} size="sm" variant="outlined" />
                  ) : (
                    "N/A"
                  )}
                </p>
              </div>
              <div>
                <span className="text-sm font-medium text-gray-500">Riesgo de Colapso:</span>
                <p className="text-gray-900">
                  {getRiesgoColapso(clasificacion) !== "N/A" ? (
                    <RiskBadge level={convertRiesgoLevel(getRiesgoColapso(clasificacion))} size="sm" variant="outlined" />
                  ) : (
                    "N/A"
                  )}
                </p>
              </div>
              <div>
                <span className="text-sm font-medium text-gray-500">Precisión del Modelo:</span>
                <p className="text-gray-900">{getConfianza(detalle)}</p>
              </div>
              <div>
                <span className="text-sm font-medium text-gray-500">Tiempo de Procesamiento:</span>
                <p className="text-gray-900">{getTiempoMs(detalle)}</p>
              </div>
            </div>
          </div>
        </div>

        {/* Documentos y Archivos */}
        {detalle?.documentos && detalle.documentos.length > 0 && (
          <div className="bg-white rounded-lg shadow p-6 mb-6">
            <h2 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
              <FileText size={20} />
              Documentos
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {detalle.documentos.map((doc, index) => (
                <div key={index} className="border rounded-lg p-4">
                  <div className="flex items-center gap-2 mb-2">
                    <FileText size={16} className="text-blue-600" />
                    <span className="font-medium text-sm">{doc.nombre}</span>
                  </div>
                  <div className="text-xs text-gray-500">
                    <div>Tipo: {doc.tipo}</div>
                    <div>Tamaño: {doc.tamano}</div>
                  </div>
                  {doc.url && (
                    <a
                      href={doc.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-blue-600 hover:text-blue-800 text-sm mt-2 inline-block"
                    >
                      Ver documento
                    </a>
                  )}
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Datos Adicionales */}
        {detalle?.datos_adicionales && (
          <div className="bg-white rounded-lg shadow p-6">
            <h2 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
              <AlertTriangle size={20} />
              Datos Adicionales
            </h2>
            <pre className="bg-gray-100 p-4 rounded text-sm overflow-x-auto">
              {formatJSON(detalle.datos_adicionales)}
            </pre>
          </div>
        )}
      </div>
    </div>
  );
}