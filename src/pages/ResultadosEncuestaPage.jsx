// src/pages/ResultadosEncuestaPage.jsx
import { useState, useEffect, useMemo } from "react";
import { useAuth } from "../context/AuthContext";
import {
  FileText,
  BarChart3,
  Calendar,
  User,
  Building,
  CheckCircle,
  XCircle,
} from "lucide-react";
import { useNavigate } from "react-router-dom";
import Button from "../components/Button";
import StatusBadge from "../components/StatusBadge";
import CustomTable from "../components/CustomTable";

export default function ResultadosEncuestaPage() {
  const { api } = useAuth();
  const navigate = useNavigate();
  const [respuestas, setRespuestas] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Cargar respuestas del cuestionario
  const fetchRespuestas = async () => {
    try {
      setLoading(true);
      const { data } = await api.get("/satisfaccion");
      setRespuestas(Array.isArray(data) ? data : data.data || []);
    } catch (err) {
      console.error("Error al cargar respuestas:", err);
      setError("No se pudieron cargar las respuestas del cuestionario.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchRespuestas();
  }, []);

  // Ver detalle de una clasificación
  const handleView = (clasificacionId) => {
    navigate(`/clasificaciones/${clasificacionId}`);
  };

  // Obtener el nombre de la pregunta
  const getPreguntaNombre = (respuesta) => {
    return respuesta.pregunta?.pregunta || "N/A";
  };

  // Obtener el nivel de satisfacción
  const getNivelSatisfaccion = (respuesta) => {
    return respuesta.nivel_satisfaccion?.nombre || "N/A";
  };

  // Obtener fecha de respuesta
  const getFechaRespuesta = (respuesta) => {
    return respuesta.created_at
      ? new Date(respuesta.created_at).toLocaleDateString("es-ES")
      : "N/A";
  };

  // Definir columnas para la tabla personalizada
  const columns = useMemo(
    () => [
      {
        header: 'Establecimiento',
        accessorKey: "clasificacion.establecimiento",
        cell: ({ row }) => (
          <div className="flex items-center">
            <Building className="h-5 w-5 text-gray-400 mr-2" />
            <div>
              <div className="text-sm font-medium text-gray-900">
                {row.original.clasificacion?.establecimiento?.nombre_comercial || "—"}
              </div>
              <div className="text-sm text-gray-500">
                {row.original.clasificacion?.establecimiento?.ruc || ""}
              </div>
            </div>
          </div>
        ),
      },
      {
        header: "Pregunta",
        accessorKey: "pregunta.pregunta",
        cell: ({ row }) => (
          <div className="text-sm text-gray-900 max-w-xs truncate">
            {getPreguntaNombre(row.original)}
          </div>
        ),
      },
      {
        header: "Nivel de Satisfacción",
        accessorKey: "nivelSatisfaccion.nombre",
        cell: ({ row }) => (
          <div className="text-sm text-gray-900 max-w-xs truncate">
            {getNivelSatisfaccion(row.original)}
          </div>
        ),
      },
      {
        header: "Fecha de Respuesta",
        accessorKey: "created_at",
        cell: ({ row }) => (
          <div className="flex items-center gap-1">
            <Calendar className="h-4 w-4 text-gray-400" />
            <span className="text-sm text-gray-900">
              {getFechaRespuesta(row.original)}
            </span>
          </div>
        ),
      },
      {
        header: "Acciones",
        cell: ({ row }) => (
          <div className="flex items-center">
            {row.original.clasificacion?.estado ? (
              <>
                <button
                  onClick={() => handleView(row.original.clasificacion.id)}
                  className="text-blue-600 hover:text-blue-900 mr-3 p-1"
                  title="Ver Clasificación"
                >
                  <FileText size={16} />
                </button>
              </>
            ) : (
              <button
                onClick={() => handleView(row.original.clasificacion.id)}
                className="text-green-600 hover:text-green-900 p-1"
                title="Ver Clasificación"
              >
                <FileText size={16} />
              </button>
            )}
          </div>
        ),
      },
    ],
    []
  );

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center mb-6 gap-4">
          <div className="flex items-center gap-3">
            <BarChart3 className="h-8 w-8 text-[#24412f]" />
            <div>
              <h1 className="text-2xl font-bold text-gray-900">
                Resultados de Encuestas
              </h1>
              <p className="text-gray-600 mt-1">
                Análisis de respuestas del cuestionario de satisfacción
              </p>
            </div>
          </div>
          <Button
            onClick={() => navigate("/dashboard")}
            className="flex items-center gap-2 bg-[#24412f] text-white hover:bg-[#1b2a1f] transition-colors w-full sm:w-auto justify-center"
          >
            <BarChart3 size={18} />
            Volver al Dashboard
          </Button>
        </div>

        {error && (
          <div className="bg-red-100 text-red-700 p-3 rounded mb-4">
            {error}
          </div>
        )}

        {loading ? (
          <div className="text-center py-10">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#24412f] mx-auto mb-4"></div>
            <p className="text-gray-600">Cargando resultados de encuestas...</p>
          </div>
        ) : (
          <>
            {/* Estadísticas resumen */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
              <div className="bg-white p-4 rounded-lg shadow">
                <div className="flex items-center gap-3">
                  <div className="p-2 bg-blue-100 rounded-lg">
                    <FileText className="h-5 w-5 text-blue-600" />
                  </div>
                  <div>
                    <p className="text-sm text-gray-600">Total Respuestas</p>
                    <p className="text-2xl font-bold text-blue-600">
                      {respuestas.length}
                    </p>
                  </div>
                </div>
              </div>

              <div className="bg-white p-4 rounded-lg shadow">
                <div className="flex items-center gap-3">
                  <div className="p-2 bg-green-100 rounded-lg">
                    <CheckCircle className="h-5 w-5 text-green-600" />
                  </div>
                  <div>
                    <p className="text-sm text-gray-600">
                      Clasificaciones Activas
                    </p>
                    <p className="text-2xl font-bold text-green-600">
                      {respuestas.filter((r) => r.clasificacion?.estado).length}
                    </p>
                  </div>
                </div>
              </div>

              <div className="bg-white p-4 rounded-lg shadow">
                <div className="flex items-center gap-3">
                  <div className="p-2 bg-red-100 rounded-lg">
                    <XCircle className="h-5 w-5 text-red-600" />
                  </div>
                  <div>
                    <p className="text-sm text-gray-600">
                      Clasificaciones Inactivas
                    </p>
                    <p className="text-2xl font-bold text-red-600">
                      {
                        respuestas.filter((r) => !r.clasificacion?.estado)
                          .length
                      }
                    </p>
                  </div>
                </div>
              </div>

              <div className="bg-white p-4 rounded-lg shadow">
                <div className="flex items-center gap-3">
                  <div className="p-2 bg-purple-100 rounded-lg">
                    <User className="h-5 w-5 text-purple-600" />
                  </div>
                  <div>
                    <p className="text-sm text-gray-600">Usuarios Únicos</p>
                    <p className="text-2xl font-bold text-purple-600">
                      {
                        [
                          ...new Set(
                            respuestas
                              .map((r) => r.clasificacion?.user?.id)
                              .filter(Boolean)
                          ),
                        ].length
                      }
                    </p>
                  </div>
                </div>
              </div>
            </div>

            {/* Vista móvil - Cards */}
            <div className="md:hidden">
              {respuestas.length === 0 ? (
                <div className="text-center py-10 text-gray-500">
                  No hay respuestas de encuestas disponibles.
                </div>
              ) : (
                <div className="space-y-4">
                  {respuestas.map((respuesta) => (
                    <div
                      key={respuesta.id}
                      className="bg-white rounded-lg shadow border p-4 mb-4"
                    >
                      <div className="flex items-start justify-between mb-3">
                        <div>
                          <h3 className="font-medium text-gray-900">
                            {respuesta.clasificacion?.establecimiento
                              ?.nombre_comercial || "Sin establecimiento"}
                          </h3>
                          <p className="text-sm text-gray-500">
                            {respuesta.clasificacion?.establecimiento?.ruc ||
                              ""}
                          </p>
                        </div>
                        <StatusBadge
                          status={respuesta.clasificacion?.estado}
                          size="sm"
                        />
                      </div>

                      <div className="space-y-2 text-sm">
                        <div className="flex justify-between">
                          <span className="text-gray-500">Pregunta:</span>
                          <span className="font-medium max-w-[180px] truncate">
                            {getPreguntaNombre(respuesta)}
                          </span>
                        </div>
                        <div className="flex justify-between items-center">
                          <span className="text-gray-500">Satisfacción:</span>
                          <span className="font-medium">
                            {getNivelSatisfaccion(respuesta) !== "N/A"}
                          </span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-gray-500">Fecha:</span>
                          <span className="font-medium">
                            {getFechaRespuesta(respuesta)}
                          </span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-gray-500">Usuario:</span>
                          <span className="font-medium">
                            {respuesta.clasificacion?.user?.name || "N/A"}
                          </span>
                        </div>
                      </div>

                      <div className="flex justify-end mt-4 space-x-2">
                        <button
                          onClick={() => handleView(respuesta.clasificacion.id)}
                          className="p-2 text-blue-600 hover:text-blue-900 hover:bg-blue-50 rounded-full transition-colors"
                          title="Ver Clasificación"
                        >
                          <FileText size={16} />
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* Vista escritorio - Tabla personalizada con CustomTable */}
            <div className="hidden md:block">
              <CustomTable
                data={respuestas}
                columns={columns}
                searchable={true}
              />
            </div>
          </>
        )}
      </div>
    </div>
  );
}
