import { useState, useEffect } from "react";
import { useAuth } from "../context/AuthContext";
import { 
  Target, 
  TrendingUp, 
  Clock, 
  AlertTriangle, 
  Shield, 
  Users,
  BarChart3,
  Activity,
  CheckCircle,
  XCircle,
  AlertCircle,
  Zap,
  Database,
  FileText
} from "lucide-react";

export default function Dashboard() {
  const { api } = useAuth();
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

  // Filtrar solo las que tienen resultado_modelo
  const validClas = clasificaciones.filter(c => c.detalle?.resultado_modelo);

  // Promedio de precisión
  const promedioConfianza =
    validClas.reduce((sum, c) => sum + (c.detalle?.resultado_modelo?.confianza || 0), 0) /
    (validClas.length || 1);

  // Promedio de tiempo
  const promedioTiempo =
    validClas.reduce((sum, c) => sum + (c.detalle?.resultado_modelo?.tiempo_ms || 0), 0) /
    (validClas.length || 1);

  // Distribución de riesgos (riesgo_final nombre)
  const riesgoCounts = validClas.reduce((acc, c) => {
    const nombre = c.detalle?.riesgo_final || "N/A";
    acc[nombre] = (acc[nombre] || 0) + 1;
    return acc;
  }, {});

  // Colores para los riesgos
  const riesgoColors = {
    "Bajo": "bg-emerald-500",
    "Medio": "bg-amber-500", 
    "Alto": "bg-orange-500",
    "Muy Alto": "bg-red-500",
    "N/A": "bg-gray-500"
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-blue-50 p-6">
      <div className="max-w-7xl mx-auto space-y-8">
        {/* Header */}
        <div className="bg-white rounded-2xl shadow-lg p-8 mb-8">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <div className="p-3 bg-gradient-to-r from-[#24412f] to-emerald-700 rounded-xl">
                <BarChart3 className="h-8 w-8 text-white" />
              </div>
              <div>
                <h2 className="text-3xl font-bold text-gray-900">Dashboard de Clasificaciones</h2>
                <p className="text-gray-600 mt-1">Análisis y métricas del Smart Risk</p>
              </div>
            </div>
            <div className="text-right">
              <div className="text-2xl font-bold text-gray-900">
                {new Date().toLocaleDateString('es-ES', { 
                  weekday: 'long', 
                  year: 'numeric', 
                  month: 'long', 
                  day: 'numeric' 
                })}
              </div>
              <div className="text-sm text-gray-500">Última actualización</div>
            </div>
          </div>
        </div>

        {error && (
          <div className="bg-red-50 border-l-4 border-red-500 p-4 rounded-lg">
            <div className="flex items-center">
              <AlertCircle className="h-5 w-5 text-red-500 mr-3" />
              <p className="text-red-700">{error}</p>
            </div>
          </div>
        )}

        {loading ? (
          <div className="flex items-center justify-center py-20">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#24412f]"></div>
          </div>
        ) : (
          <>
            {/* Estadísticas principales */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              {/* Total Clasificaciones */}
              <div className="bg-gradient-to-r from-blue-500 to-blue-600 rounded-2xl p-6 text-white shadow-lg hover:shadow-xl transition-shadow">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-blue-100 text-sm font-medium">Total Clasificaciones</p>
                    <p className="text-3xl font-bold mt-2">{clasificaciones.length}</p>
                  </div>
                  <div className="p-3 bg-blue-400 rounded-full">
                    <Target className="h-8 w-8" />
                  </div>
                </div>
              </div>

              {/* Promedio Precisión */}
              <div className="bg-gradient-to-r from-emerald-500 to-emerald-600 rounded-2xl p-6 text-white shadow-lg hover:shadow-xl transition-shadow">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-emerald-100 text-sm font-medium">Precisión Promedio</p>
                    <p className="text-3xl font-bold mt-2">{promedioConfianza.toFixed(2)}%</p>
                  </div>
                  <div className="p-3 bg-emerald-400 rounded-full">
                    <Zap className="h-8 w-8" />
                  </div>
                </div>
              </div>

              {/* Promedio Tiempo */}
              <div className="bg-gradient-to-r from-purple-500 to-purple-600 rounded-2xl p-6 text-white shadow-lg hover:shadow-xl transition-shadow">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-purple-100 text-sm font-medium">Tiempo Promedio</p>
                    <p className="text-3xl font-bold mt-2">{promedioTiempo.toFixed(2)}ms</p>
                  </div>
                  <div className="p-3 bg-purple-400 rounded-full">
                    <Clock className="h-8 w-8" />
                  </div>
                </div>
              </div>

              {/* Clasificaciones Válidas */}
              <div className="bg-gradient-to-r from-orange-500 to-orange-600 rounded-2xl p-6 text-white shadow-lg hover:shadow-xl transition-shadow">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-orange-100 text-sm font-medium">Con Resultados</p>
                    <p className="text-3xl font-bold mt-2">{validClas.length}</p>
                  </div>
                  <div className="p-3 bg-orange-400 rounded-full">
                    <CheckCircle className="h-8 w-8" />
                  </div>
                </div>
              </div>
            </div>

            {/* Distribución de riesgos */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
              <div className="bg-white rounded-2xl shadow-lg p-6">
                <div className="flex items-center space-x-3 mb-6">
                  <div className="p-2 bg-red-100 rounded-lg">
                    <AlertTriangle className="h-6 w-6 text-red-600" />
                  </div>
                  <div>
                    <h3 className="text-lg font-semibold text-gray-900">Distribución de Riesgos</h3>
                    <p className="text-gray-500 text-sm">Clasificaciones por nivel de riesgo</p>
                  </div>
                </div>
                
                <div className="space-y-4">
                  {Object.entries(riesgoCounts).map(([nombre, count]) => (
                    <div key={nombre} className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                      <div className="flex items-center space-x-3">
                        <div className={`w-3 h-3 rounded-full ${riesgoColors[nombre] || 'bg-gray-500'}`}></div>
                        <span className="font-medium text-gray-900">{nombre}</span>
                      </div>
                      <div className="flex items-center space-x-2">
                        <span className="text-2xl font-bold text-gray-900">{count}</span>
                        <span className="text-sm text-gray-500">
                          ({((count / clasificaciones.length) * 100).toFixed(1)}%)
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Métricas adicionales */}
              <div className="bg-white rounded-2xl shadow-lg p-6">
                <div className="flex items-center space-x-3 mb-6">
                  <div className="p-2 bg-blue-100 rounded-lg">
                    <Activity className="h-6 w-6 text-blue-600" />
                  </div>
                  <div>
                    <h3 className="text-lg font-semibold text-gray-900">Métricas del Sistema</h3>
                    <p className="text-gray-500 text-sm">Rendimiento y eficiencia</p>
                  </div>
                </div>
                
                <div className="space-y-6">
                  <div className="flex justify-between items-center">
                    <div className="flex items-center space-x-3">
                      <TrendingUp className="h-5 w-5 text-blue-500" />
                      <span className="text-gray-700">Precisión Promedio</span>
                    </div>
                    <span className="text-2xl font-bold text-blue-600">{promedioConfianza.toFixed(2)}%</span>
                  </div>
                  
                  <div className="flex justify-between items-center">
                    <div className="flex items-center space-x-3">
                      <Clock className="h-5 w-5 text-purple-500" />
                      <span className="text-gray-700">Tiempo Promedio</span>
                    </div>
                    <span className="text-2xl font-bold text-purple-600">{promedioTiempo.toFixed(2)}ms</span>
                  </div>
                  
                  <div className="flex justify-between items-center">
                    <div className="flex items-center space-x-3">
                      <FileText className="h-5 w-5 text-green-500" />
                      <span className="text-gray-700">Clasificaciones Válidas</span>
                    </div>
                    <span className="text-2xl font-bold text-green-600">{validClas.length}</span>
                  </div>
                  
                  <div className="flex justify-between items-center">
                    <div className="flex items-center space-x-3">
                      <Database className="h-5 w-5 text-orange-500" />
                      <span className="text-gray-700">Total Procesadas</span>
                    </div>
                    <span className="text-2xl font-bold text-orange-600">{clasificaciones.length}</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Resumen visual */}
            <div className="bg-white rounded-2xl shadow-lg p-6">
              <div className="flex items-center space-x-3 mb-6">
                <div className="p-2 bg-green-100 rounded-lg">
                  <Shield className="h-6 w-6 text-green-600" />
                </div>
                <div>
                  <h3 className="text-lg font-semibold text-gray-900">Estado del Sistema</h3>
                  <p className="text-gray-500 text-sm">Resumen de rendimiento y seguridad</p>
                </div>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="text-center p-6 bg-gradient-to-br from-emerald-50 to-green-50 rounded-xl border border-emerald-100">
                  <div className="text-3xl font-bold text-emerald-600 mb-2">
                    {((validClas.filter(c => c.detalle?.riesgo_final === 'Bajo' || c.detalle?.riesgo_final === 'Medio').length / validClas.length) * 100 || 0).toFixed(1)}%
                  </div>
                  <div className="text-sm text-gray-600">Riesgos Bajo/Medio</div>
                  <div className="text-xs text-gray-500 mt-1">Clasificaciones seguras</div>
                </div>
                
                <div className="text-center p-6 bg-gradient-to-br from-orange-50 to-red-50 rounded-xl border border-orange-100">
                  <div className="text-3xl font-bold text-orange-600 mb-2">
                    {((validClas.filter(c => c.detalle?.riesgo_final === 'Alto' || c.detalle?.riesgo_final === 'Muy Alto').length / validClas.length) * 100 || 0).toFixed(1)}%
                  </div>
                  <div className="text-sm text-gray-600">Riesgos Alto/Muy Alto</div>
                  <div className="text-xs text-gray-500 mt-1">Requieren atención</div>
                </div>
                
                <div className="text-center p-6 bg-gradient-to-br from-blue-50 to-indigo-50 rounded-xl border border-blue-100">
                  <div className="text-3xl font-bold text-blue-600 mb-2">
                    {validClas.length > 0 ? promedioConfianza.toFixed(2) : '0.00'}%
                  </div>
                  <div className="text-sm text-gray-600">Confianza Promedio</div>
                  <div className="text-xs text-gray-500 mt-1">Precisión del modelo</div>
                </div>
              </div>
            </div>
          </>
        )}
      </div>
    </div>
  );
}