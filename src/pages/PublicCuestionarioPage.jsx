// src/pages/EncuestaPage.jsx
import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { FileText, Send, CheckCircle, AlertCircle, ShieldAlert } from "lucide-react";

export default function PublicCuestionarioPage() {
  const { token } = useParams(); // <- viene desde /encuesta/:token
  const [data, setData] = useState(null);
  const [respuestas, setRespuestas] = useState({});
  const [enviando, setEnviando] = useState(false);
  const [enviado, setEnviado] = useState(false);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        const API_BASE_URL = import.meta.env.VITE_API_URL;
        const res = await fetch(`${API_BASE_URL}/encuesta/${token}`);
        
        if (res.status === 403) {
          throw new Error("403");
        }
        
        if (!res.ok) {
          throw new Error(`HTTP error! status: ${res.status}`);
        }
        
        const data = await res.json();
        setData(data);
      } catch (err) {
        console.error("Error:", err);
        
        if (err.message === "403") {
          setError({
            type: "forbidden",
            message: "El enlace de la encuesta ha expirado o ya fue utilizado."
          });
        } else {
          setError({
            type: "general",
            message: "No se pudo cargar la encuesta. El enlace puede ser inválido."
          });
        }
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [token]);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#24412f] mx-auto mb-4"></div>
          <p className="text-gray-600">Cargando encuesta...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gray-50 p-6">
        <div className="max-w-4xl mx-auto">
          <div className={`
            ${error.type === "forbidden" 
              ? "bg-orange-100 text-orange-700 border-orange-200" 
              : "bg-red-100 text-red-700 border-red-200"}
            p-6 rounded-lg shadow mb-6 border
          `}>
            <div className="flex items-center gap-3">
              {error.type === "forbidden" ? (
                <ShieldAlert className="h-6 w-6" />
              ) : (
                <AlertCircle className="h-6 w-6" />
              )}
              <h2 className="text-xl font-bold">
                {error.type === "forbidden" ? "Encuesta No Disponible" : "Error"}
              </h2>
            </div>
            <p className="mt-3">{error.message}</p>
          </div>
          
          {error.type === "forbidden" ? (
            <div className="bg-white p-6 rounded-lg shadow">
              <h3 className="font-medium text-gray-900 mb-2">¿Qué puedes hacer?</h3>
              <ul className="list-disc list-inside text-gray-600 space-y-1">
                <li>Verifica que el enlace sea correcto y esté completo</li>
                <li>Solicita un nuevo enlace al administrador del sistema</li>
                <li>Asegúrate de no haber respondido esta encuesta anteriormente</li>
              </ul>
            </div>
          ) : (
            <button
              onClick={() => window.location.reload()}
              className="flex items-center gap-2 text-gray-600 hover:text-gray-900"
            >
              <FileText size={18} />
              Reintentar
            </button>
          )}
        </div>
      </div>
    );
  }

  if (enviado) {
    return (
      <div className="min-h-screen bg-gray-50 p-6">
        <div className="max-w-4xl mx-auto">
          <div className="bg-green-100 text-green-700 p-6 rounded-lg shadow mb-6">
            <div className="flex items-center gap-3">
              <CheckCircle className="h-6 w-6" />
              <h2 className="text-xl font-bold">¡Encuesta Enviada!</h2>
            </div>
            <p className="mt-3 text-lg">
              ✅ ¡Gracias por responder la encuesta!
            </p>
            <p className="mt-2 text-sm">
              Su respuesta ha sido registrada correctamente.
            </p>
          </div>
        </div>
      </div>
    );
  }

  const handleChange = (preguntaId, nivelId) => {
    setRespuestas({ ...respuestas, [preguntaId]: nivelId });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setEnviando(true);
    setError(null);

    const payload = {
      respuestas: Object.entries(respuestas).map(
        ([pregunta_id, nivel_satisfaccion_id]) => ({
          pregunta_id: parseInt(pregunta_id), // ✅ Asegurar que sea número
          nivel_satisfaccion_id: parseInt(nivel_satisfaccion_id), // ✅ Asegurar que sea número
        })
      ),
    };

    console.log("📤 Payload enviado:", payload); // ✅ Debug

    try {
      const API_BASE_URL = import.meta.env.VITE_API_URL;

      const res = await fetch(`${API_BASE_URL}/encuesta/${token}`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      const data = await res.json(); // ✅ Obtener respuesta del servidor

      if (res.ok) {
        setEnviado(true);
      } else if (res.status === 403) {
        setError({
          type: "forbidden",
          message: "El enlace de la encuesta ha expirado o ya fue utilizado."
        });
      } else {
        console.error("❌ Error del servidor:", data); // ✅ Ver error exacto
        setError({
          type: "general",
          message: `❌ Error: ${data.message || "Ocurrió un error"}`
        });
      }
    } catch (error) {
      console.error("❌ Error de red:", error);
      setError({
        type: "general",
        message: "❌ Error de conexión al servidor."
      });
    } finally {
      setEnviando(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-4xl mx-auto">
        {/* Header con gradient */}
        <div className="bg-gradient-to-b from-[#24412f] to-emerald-700 text-white rounded-lg shadow-lg p-6 mb-6">
          <div className="flex items-center gap-3 mb-2">
            <FileText className="h-8 w-8" />
            <h1 className="text-2xl font-bold">
              Encuesta de Satisfacción
            </h1>
          </div>
          <p className="text-emerald-100">
            Por favor, califique su experiencia
          </p>
        </div>

        {/* Formulario */}
        <div className="bg-white rounded-lg shadow-lg p-6">
          {error && (
            <div className={`
              ${error.type === "forbidden" 
                ? "bg-orange-100 text-orange-700 border-orange-200" 
                : "bg-red-100 text-red-700 border-red-200"}
              p-3 rounded mb-6 border
            `}>
              {error.message}
            </div>
          )}

          <form onSubmit={handleSubmit}>
            {data.preguntas.map((p) => (
              <div key={p.id} className="mb-8 p-4 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors">
                <p className="font-medium text-gray-900 mb-4 text-lg">
                  {p.pregunta}
                </p>
                <div className="grid grid-cols-1 md:grid-cols-5 gap-3">
                  {data.niveles_satisfaccion.map((nivel) => {
                    const isSelected = respuestas[p.id] === nivel.id;
                    
                    // Colores por nivel
                    const nivelColors = {
                      1: "bg-red-100 text-red-800 border-red-200 hover:border-red-300", // Muy Insatisfecho
                      2: "bg-orange-100 text-orange-800 border-orange-200 hover:border-orange-300", // Insatisfecho
                      3: "bg-yellow-100 text-yellow-800 border-yellow-200 hover:border-yellow-300", // Neutral
                      4: "bg-blue-100 text-blue-800 border-blue-200 hover:border-blue-300", // Satisfecho
                      5: "bg-green-100 text-green-800 border-green-200 hover:border-green-300" // Muy Satisfecho
                    };
                    
                    const defaultColors = "bg-white border-gray-200 hover:border-[#24412f]";
                    const selectedColors = "ring-2 ring-[#24412f] ring-offset-2";
                    const colors = nivelColors[nivel.id] || defaultColors;
                    
                    return (
                      <label 
                        key={nivel.id} 
                        className={`
                          flex flex-col items-center justify-center p-4 border-2 rounded-lg cursor-pointer transition-all
                          ${isSelected ? `${colors} ${selectedColors}` : `${colors}`}
                        `}
                      >
                        <input
                          type="radio"
                          name={`pregunta_${p.id}`}
                          value={nivel.id}
                          onChange={() => handleChange(p.id, nivel.id)}
                          className="sr-only"
                          required
                        />
                        <span className="text-sm font-medium text-center">{nivel.nombre}</span>
                        <span className="text-lg font-bold mt-1">{nivel.abreviatura || nivel.nombre.charAt(0)}</span>
                      </label>
                    );
                  })}
                </div>
              </div>
            ))}

            <div className="flex justify-end pt-6">
              <button
                type="submit"
                disabled={enviando}
                className={`
                  flex items-center gap-2 px-6 py-3 rounded-md font-medium transition-colors
                  ${enviando 
                    ? 'bg-gray-400 text-gray-700 cursor-not-allowed' 
                    : 'bg-gradient-to-b from-[#24412f] to-emerald-700 text-white hover:from-[#1b2a1f] hover:to-emerald-800 shadow-md'}
                `}
              >
                <Send size={18} />
                {enviando ? "Enviando..." : "Enviar Encuesta"}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}