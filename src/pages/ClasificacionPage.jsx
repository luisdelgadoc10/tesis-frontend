// src/pages/ClasificacionesPage.jsx
import { useState, useEffect, useMemo } from "react";
import { useAuth } from "../context/AuthContext";
import {
  FileText,
  Plus,
  Eye,
  Trash2,
  RotateCcw,
  Send,
  MessageSquareMore,
} from "lucide-react";
import { useNavigate } from "react-router-dom";
import Button from "../components/Button";
import StatusBadge from "../components/StatusBadge";
import RiskBadge from "../components/RiskBadge";
import CustomTable from "../components/CustomTable";
import ConfirmModal from "../components/ConfirmModal";
import { useNotification } from "../hooks/useNotification";
import { useConfirmModal } from "../hooks/useConfirmModal";

export default function ClasificacionesPage() {
  const { api } = useAuth();
  const navigate = useNavigate();
  const [clasificaciones, setClasificaciones] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Notificaciones
  const { showSuccess, showError, showInfo, withLoading } = useNotification();

  // Modal de confirmación
  const {
    isOpen: isConfirmOpen,
    config: confirmConfig,
    showConfirm,
    closeModal: closeConfirmModal,
  } = useConfirmModal();

  // Cargar clasificaciones
  const fetchClasificaciones = async () => {
    try {
      setLoading(true);
      const { data } = await api.get("/clasificaciones");
      setClasificaciones(Array.isArray(data) ? data : data.data || []);
    } catch (err) {
      console.error("Error al cargar clasificaciones:", err);
      setError("No se pudieron cargar las clasificaciones.");
      showError("Error al cargar clasificaciones", {
        description: "No se pudieron cargar las clasificaciones.",
        duration: 5000,
      });
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

  // Eliminar con modal de confirmación
  const handleDelete = (clasificacion) => {
    const nombreEstablecimiento =
      clasificacion.establecimiento?.nombre_comercial || "esta clasificación";

    showConfirm({
      title: "Eliminar Clasificación",
      message: `¿Estás seguro de eliminar la clasificación de "${nombreEstablecimiento}"? Esta acción no se puede deshacer.`,
      confirmText: "Sí, eliminar",
      cancelText: "Cancelar",
      type: "danger",
      onConfirm: async () => {
        try {
          await withLoading(
            api.delete(`/clasificaciones/${clasificacion.id}`),
            {
              loading: "Eliminando clasificación...",
              success: "Clasificación eliminada correctamente",
              error: "No se pudo eliminar la clasificación",
            }
          );
          fetchClasificaciones();
        } catch (err) {
          // El error ya fue mostrado
        }
      },
    });
  };

  // Restaurar con modal de confirmación
  const handleRestore = (clasificacion) => {
    const nombreEstablecimiento =
      clasificacion.establecimiento?.nombre_comercial || "esta clasificación";

    showConfirm({
      title: "Restaurar Clasificación",
      message: `¿Deseas restaurar la clasificación de "${nombreEstablecimiento}"?`,
      confirmText: "Sí, restaurar",
      cancelText: "Cancelar",
      type: "success",
      onConfirm: async () => {
        try {
          await withLoading(
            api.patch(`/clasificaciones/${clasificacion.id}/restore`),
            {
              loading: "Restaurando clasificación...",
              success: "Clasificación restaurada correctamente",
              error: "No se pudo restaurar la clasificación",
            }
          );
          fetchClasificaciones();
        } catch (err) {
          // El error ya fue mostrado
        }
      },
    });
  };

  // Ver reporte PDF
  const handleReport = (id) => {
    const backendUrl = import.meta.env.VITE_API_URL.replace("/api", "");
    window.open(`${backendUrl}/clasificaciones/${id}/pdf`, "_blank");
    showInfo("Abriendo reporte PDF", {
      description: "El reporte se abrirá en una nueva pestaña",
      duration: 3000,
    });
  };

  // Enviar reporte por WhatsApp
  const handleSendWssp = async (clasificacion) => {
    let telefono = clasificacion.establecimiento?.telefono;

    if (!telefono) {
      showError("Teléfono no disponible", {
        description:
          "No se encontró un número de teléfono para este establecimiento.",
        duration: 5000,
      });
      return;
    }

    // Normalizar teléfono
    telefono = telefono.toString().replace(/\s+/g, "");
    if (!telefono.startsWith("+51")) {
      telefono = `+51${telefono}`;
    }

    showConfirm({
      title: "Enviar Reporte por WhatsApp",
      message: `¿Deseas enviar el reporte de clasificación a ${telefono}?`,
      confirmText: "Sí, enviar",
      cancelText: "Cancelar",
      type: "info",
      onConfirm: async () => {
        try {
          await withLoading(
            api.post(`/send-report/${clasificacion.id}`, { telefono }),
            {
              loading: "Enviando reporte por WhatsApp...",
              success: `Reporte enviado correctamente a ${telefono}`,
              error: "No se pudo enviar el reporte",
            }
          );
        } catch (err) {
          // Manejo específico de errores
          if (err.response?.status === 422) {
            showError("Datos inválidos", {
              description: "Verifica el número de teléfono.",
              duration: 5000,
            });
          } else {
            showError("Error desconocido", {
              description: "Ocurrió un problema al enviar el reporte.",
              duration: 5000,
            });
          }
        }
      },
    });
  };

  // Enviar encuesta por WhatsApp
  const handleSendSurvey = async (clasificacion) => {
    let telefono = clasificacion.establecimiento?.telefono;

    if (!telefono) {
      showError("Teléfono no disponible", {
        description:
          "No se encontró un número de teléfono para este establecimiento.",
        duration: 5000,
      });
      return;
    }

    // Normalizar teléfono
    telefono = telefono.toString().replace(/\s+/g, "");
    if (!telefono.startsWith("+51")) {
      telefono = `+51${telefono}`;
    }

    const token = clasificacion.token_encuesta;

    showConfirm({
      title: "Enviar Encuesta por WhatsApp",
      message: `¿Deseas enviar el enlace de la encuesta a ${telefono}?`,
      confirmText: "Sí, enviar",
      cancelText: "Cancelar",
      type: "info",
      onConfirm: async () => {
        try {
          const { data } = await api.post(`/send-survey`, {
            phone: telefono,
            token,
          });

          if (data?.status === "success") {
            showSuccess("Encuesta enviada", {
              description: `Enlace de encuesta enviado correctamente a ${telefono}`,
              duration: 4000,
            });
          } else {
            showError("Error al enviar encuesta", {
              description: "No se pudo enviar el enlace de la encuesta.",
              duration: 5000,
            });
          }
        } catch (err) {
          console.error("Error al enviar encuesta:", err);
          showError("Error al enviar encuesta", {
            description:
              "Ocurrió un error al enviar el enlace de la encuesta por WhatsApp.",
            duration: 5000,
          });
        }
      },
    });
  };

  // Convertir el nivel de riesgo
  const convertRiesgoLevel = (nivel) => {
    if (!nivel) return "bajo";
    const nivelLower = nivel.toLowerCase().trim();
    if (nivelLower === "muy alto" || nivelLower === "muy_alto")
      return "muy_alto";
    if (nivelLower === "alto") return "alto";
    if (nivelLower === "medio") return "medio";
    if (nivelLower === "bajo") return "bajo";
    if (nivelLower.includes("muy") && nivelLower.includes("alto"))
      return "muy_alto";
    return nivelLower;
  };

  // Obtener la subfunción específica
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

  const getRiesgoFinal = (clasificacion) => {
    return clasificacion.detalle?.riesgo_final || "N/A";
  };

  const getConfianza = (clasificacion) => {
    const confianza = clasificacion.detalle?.resultado_modelo?.confianza;
    if (confianza === undefined || confianza === null) return "N/A";
    return confianza + "%";
  };

  const getTiempoMs = (clasificacion) => {
    const tiempoMs = clasificacion.detalle?.resultado_modelo?.tiempo_s;
    if (tiempoMs === undefined || tiempoMs === null) return "N/A";
    return tiempoMs + ' s';
    //return tiempoMs.toFixed(2) + ' s';
  };

  // Definir columnas
  const columns = useMemo(
    () => [
      {
        header: "Establecimiento",
        accessorKey: "establecimiento",
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
        header: "Función",
        accessorKey: "funcion.nombre",
        cell: ({ row }) => (
          <div className="text-sm text-gray-900">
            {row.original.funcion?.nombre || "—"}
          </div>
        ),
      },
      {
        header: "Subfunción",
        accessorKey: "subfuncion",
        cell: ({ row }) => (
          <span className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-blue-100 text-blue-800">
            {getSubfuncion(row.original)}
          </span>
        ),
      },
      {
        header: "Riesgo Final",
        accessorKey: "riesgo_final",
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
        header: "Precisión",
        accessorKey: "confianza",
        cell: ({ row }) => (
          <span className="text-sm text-gray-900 font-medium">
            {getConfianza(row.original)}
          </span>
        ),
      },
      {
        header: "Tiempo (s)",
        accessorKey: "tiempo_s",
        cell: ({ row }) => (
          <span className="text-sm text-gray-900">
            {getTiempoMs(row.original)}
          </span>
        ),
      },
      {
        header: "Acciones",
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
                  onClick={() => handleSendWssp(row.original)}
                  className="text-green-600 hover:text-green-900 p-1 mr-2"
                  title="Enviar por WhatsApp"
                >
                  <Send size={16} />
                </button>
                <button
                  onClick={() => handleSendSurvey(row.original)}
                  className="text-teal-600 hover:text-teal-900 p-1 mr-2"
                  title="Enviar encuesta por WhatsApp"
                >
                  <MessageSquareMore size={16} />
                </button>
                <button
                  onClick={() => handleDelete(row.original)}
                  className="text-red-600 hover:text-red-900 p-1"
                  title="Eliminar"
                >
                  <Trash2 size={16} />
                </button>
              </>
            ) : (
              <button
                onClick={() => handleRestore(row.original)}
                className="text-green-600 hover:text-green-900 p-1"
                title="Restaurar"
              >
                <RotateCcw size={16} />
              </button>
            )}
          </div>
        ),
      },
    ],
    []
  );

  // Componente Card para móvil
  const ClasificacionCard = ({ clasificacion }) => (
    <div className="bg-white rounded-lg shadow border p-4 mb-4">
      <div className="flex items-start justify-between mb-3">
        <div>
          <h3 className="font-medium text-gray-900">
            {clasificacion.funcion?.nombre || "Sin función"}
          </h3>
          <p className="text-sm text-gray-500">
            {clasificacion.establecimiento?.nombre_comercial ||
              "Sin establecimiento"}
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
              <RiskBadge
                level={convertRiesgoLevel(getRiesgoFinal(clasificacion))}
                size="xs"
              />
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
              onClick={() => handleSendWssp(clasificacion)}
              className="p-2 text-green-600 hover:text-green-900 hover:bg-green-50 rounded-full transition-colors"
              title="Enviar por WhatsApp"
            >
              <Send size={16} />
            </button>
            <button
              onClick={() => handleSendSurvey(clasificacion)}
              className="p-2 text-teal-600 hover:text-teal-900 hover:bg-teal-50 rounded-full transition-colors"
              title="Enviar encuesta"
            >
              <MessageSquareMore size={16} />
            </button>
            <button
              onClick={() => handleDelete(clasificacion)}
              className="p-2 text-red-600 hover:text-red-900 hover:bg-red-50 rounded-full transition-colors"
              title="Eliminar"
            >
              <Trash2 size={16} />
            </button>
          </>
        ) : (
          <button
            onClick={() => handleRestore(clasificacion)}
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
          Clasificaciones de Establecimientos
        </h2>
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

          <div className="hidden md:block">
            <CustomTable
              data={clasificaciones}
              columns={columns}
              searchable={true}
            />
          </div>
        </>
      )}

      {/* Modal de Confirmación */}
      <ConfirmModal
        isOpen={isConfirmOpen}
        onClose={closeConfirmModal}
        onConfirm={confirmConfig.onConfirm}
        title={confirmConfig.title}
        message={confirmConfig.message}
        confirmText={confirmConfig.confirmText}
        cancelText={confirmConfig.cancelText}
        type={confirmConfig.type}
      />
    </div>
  );
}
