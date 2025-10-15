// src/pages/SubfuncionDetallePage.jsx
import { useState, useEffect } from "react";
import { useAuth } from "../context/AuthContext";
import { useParams, useNavigate, useLocation } from "react-router-dom";
import { ArrowLeft, Save, Eye, Edit3, Plus } from "lucide-react";
import Button from "../components/Button";
import StatusBadge from "../components/StatusBadge";
import RiskBadge from "../components/RiskBadge";

export default function SubfuncionDetallePage() {
  const { api } = useAuth();
  const { id } = useParams();
  const navigate = useNavigate();
  const location = useLocation();
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [subfuncion, setSubfuncion] = useState({
    codigo: "",
    descripcion: "",
    funcion_id: "",
    riesgo_incendio_id: "",
    riesgo_colapso_id: ""
  });
  const [funciones, setFunciones] = useState([]);
  const [nivelesRiesgo, setNivelesRiesgo] = useState([]);
  const [modos, setModos] = useState({ ver: false, editar: false, crear: false });

  // Determinar el modo basado en la ruta
  useEffect(() => {
    const isEditMode = location.pathname.includes('/editar');
    const isDetailView = location.pathname.includes('/detalle') || (!location.pathname.includes('/editar') && id);
    const isCreateMode = location.pathname.includes('/nueva');
    
    setModos({
      ver: isDetailView,
      editar: isEditMode,
      crear: isCreateMode
    });
  }, [location.pathname, id]);

  // Cargar funciones y niveles de riesgo
  const fetchInitialData = async () => {
    try {
      const [funcionesRes, riesgosRes] = await Promise.all([
        api.get("/funciones"),
        api.get("/niveles-riesgo")
      ]);
      
      setFunciones(funcionesRes.data);
      setNivelesRiesgo(riesgosRes.data);
    } catch (err) {
      console.error("Error al cargar datos iniciales:", err);
      setError("No se pudieron cargar los datos iniciales.");
    }
  };

  // Cargar subfunción específica si estamos editando o viendo detalle
  const fetchSubfuncion = async () => {
    if (!id) return;
    
    try {
      const { data } = await api.get(`/subfunciones/${id}`);
      setSubfuncion(data);
    } catch (err) {
      console.error("Error al cargar subfunción:", err);
      setError("No se pudo cargar la subfunción.");
    }
  };

  useEffect(() => {
    const loadData = async () => {
      setLoading(true);
      await fetchInitialData();
      if (id) {
        await fetchSubfuncion();
      }
      setLoading(false);
    };
    
    loadData();
  }, [id]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setSubfuncion(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    try {
      if (modos.editar || modos.crear) {
        if (modos.editar) {
          await api.put(`/subfunciones/${id}`, subfuncion);
        } else {
          await api.post("/subfunciones", subfuncion);
        }
        navigate("/subfunciones");
      }
    } catch (err) {
      console.error("Error al guardar subfunción:", err);
      setError("No se pudo guardar la subfunción.");
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#24412f] mx-auto"></div>
          <p className="mt-4 text-gray-600">Cargando...</p>
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

  const modo = modos.editar ? "Editar" : modos.crear ? "Crear" : "Detalle";

  // Función para convertir nombre de riesgo a nivel para RiskBadge
  const getRiskLevel = (nombreRiesgo) => {
    if (!nombreRiesgo) return "bajo";
    
    const nivel = nombreRiesgo.toLowerCase().trim();
    switch (nivel) {
      case 'bajo':
        return 'bajo';
      case 'medio':
        return 'medio';
      case 'alto':
        return 'alto';
      case 'muy alto':
      case 'muy_alto':
        return 'muy_alto';
      default:
        return 'bajo';
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-4xl mx-auto">
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-3">
            <button
              onClick={() => navigate(-1)}
              className="flex items-center gap-2 text-gray-600 hover:text-gray-900"
            >
              <ArrowLeft size={18} />
              Volver
            </button>
            <h1 className="text-2xl font-bold text-gray-900">
              {modo} Subfunción
            </h1>
          </div>
          
          {id && !modos.crear && (
            <div className="flex items-center gap-2">
              {!modos.ver && (
                <button
                  onClick={() => navigate(`/subfunciones/${id}`)}
                  className="flex items-center gap-1 px-3 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors"
                >
                  <Eye size={16} />
                  Detalle
                </button>
              )}
              {!modos.editar && (
                <button
                  onClick={() => navigate(`/subfunciones/${id}/editar`)}
                  className="flex items-center gap-1 px-3 py-2 bg-green-600 text-white rounded-md hover:bg-green-700 transition-colors"
                >
                  <Edit3 size={16} />
                  Editar
                </button>
              )}
            </div>
          )}
        </div>

        <div className="bg-white rounded-lg shadow p-6">
          <form onSubmit={handleSubmit}>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Código *
                </label>
                {modos.ver ? (
                  <div className="text-gray-900">{subfuncion.codigo}</div>
                ) : (
                  <input
                    type="text"
                    name="codigo"
                    value={subfuncion.codigo}
                    onChange={handleInputChange}
                    required
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#24412f] focus:border-transparent"
                    disabled={modos.ver}
                  />
                )}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Función *
                </label>
                {modos.ver ? (
                  <div className="text-gray-900">
                    {funciones.find(f => f.id === parseInt(subfuncion.funcion_id))?.nombre || "N/A"}
                  </div>
                ) : (
                  <select
                    name="funcion_id"
                    value={subfuncion.funcion_id}
                    onChange={handleInputChange}
                    required
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#24412f] focus:border-transparent"
                    disabled={modos.ver}
                  >
                    <option value="">Seleccionar función</option>
                    {funciones.map(funcion => (
                      <option key={funcion.id} value={funcion.id}>
                        {funcion.nombre}
                      </option>
                    ))}
                  </select>
                )}
              </div>

              <div className="md:col-span-2">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Descripción
                </label>
                {modos.ver ? (
                  <div className="text-gray-900">{subfuncion.descripcion}</div>
                ) : (
                  <textarea
                    name="descripcion"
                    value={subfuncion.descripcion}
                    onChange={handleInputChange}
                    rows={3}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#24412f] focus:border-transparent"
                    disabled={modos.ver}
                  />
                )}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Riesgo Incendio *
                </label>
                {modos.ver ? (
                  <div className="flex items-center gap-2">
                    <RiskBadge 
                      level={getRiskLevel(subfuncion.riesgo_incendio?.nombre)} 
                      size="sm" 
                      variant="solid"
                    />
                  </div>
                ) : (
                  <select
                    name="riesgo_incendio_id"
                    value={subfuncion.riesgo_incendio_id || subfuncion.riesgo_incendio?.id || ""}
                    onChange={handleInputChange}
                    required
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#24412f] focus:border-transparent"
                    disabled={modos.ver}
                  >
                    <option value="">Seleccionar riesgo</option>
                    {nivelesRiesgo.map(riesgo => (
                      <option key={riesgo.id} value={riesgo.id}>
                        {riesgo.nombre}
                      </option>
                    ))}
                  </select>
                )}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Riesgo Colapso *
                </label>
                {modos.ver ? (
                  <div className="flex items-center gap-2">
                    <RiskBadge 
                      level={getRiskLevel(subfuncion.riesgo_colapso?.nombre)} 
                      size="sm" 
                      variant="solid"
                    />
                  </div>
                ) : (
                  <select
                    name="riesgo_colapso_id"
                    value={subfuncion.riesgo_colapso_id || subfuncion.riesgo_colapso?.id || ""}
                    onChange={handleInputChange}
                    required
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#24412f] focus:border-transparent"
                    disabled={modos.ver}
                  >
                    <option value="">Seleccionar riesgo</option>
                    {nivelesRiesgo.map(riesgo => (
                      <option key={riesgo.id} value={riesgo.id}>
                        {riesgo.nombre}
                      </option>
                    ))}
                  </select>
                )}
              </div>
            </div>

            {!modos.ver && (
              <div className="flex justify-end gap-3">
                <button
                  type="button"
                  onClick={() => navigate(-1)}
                  className="px-4 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50 transition-colors"
                >
                  Cancelar
                </button>
                <Button
                  type="submit"
                  className="flex items-center gap-2 bg-[#24412f] text-white hover:bg-[#1b2a1f] transition-colors"
                >
                  <Save size={18} />
                  {modos.editar ? "Actualizar" : "Guardar"}
                </Button>
              </div>
            )}
          </form>
        </div>
      </div>
    </div>
  );
}