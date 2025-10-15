// src/pages/MapaRiesgo.jsx
import { useState, useEffect, useMemo } from "react";
import { MapContainer, TileLayer, Marker, Popup } from "react-leaflet";
import L from "leaflet";
import "leaflet/dist/leaflet.css";
import { useAuth } from "../context/AuthContext";
import { Target, AlertTriangle, Shield, Zap, MapPin } from "lucide-react";
import RiskBadge from "../components/RiskBadge";
import RiskMapMarker from "../components/RiskMapMarker";

// Iconos personalizados para cada nivel de riesgo
const createRiskIcon = (riskLevel) => {
  let bgColor = "#6B7280"; // gris por defecto
  let iconHtml = '<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="white" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="10"/></svg>';
  
  // Normalizar el nivel de riesgo
  const normalizedRisk = riskLevel?.toLowerCase().trim();
  
  switch (normalizedRisk) {
    case "bajo":
      bgColor = "#10B981"; // verde
      iconHtml = '<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="white" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/></svg>';
      break;
    case "medio":
      bgColor = "#F59E0B"; // ámbar
      iconHtml = '<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="white" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M13 2 3 14h9l-1 8 10-12h-9l1-8z"/></svg>';
      break;
    case "alto":
      bgColor = "#F97316"; // naranja
      iconHtml = '<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="white" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/><path d="M9 12l2 2 4-4"/></svg>';
      break;
    case "muy alto":
      bgColor = "#EF4444"; // rojo
      iconHtml = '<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="white" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="10"/><line x1="12" y1="8" x2="12" y2="12"/><line x1="12" y1="16" x2="12.01" y2="16"/></svg>';
      break;
    default:
      bgColor = "#6B7280"; // gris
      iconHtml = '<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="white" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="10"/></svg>';
  }

  return L.divIcon({
    className: 'custom-risk-marker',
    html: `
      <div style="
        background-color: ${bgColor};
        border: 2px solid white;
        border-radius: 50%;
        width: 32px;
        height: 32px;
        display: flex;
        align-items: center;
        justify-content: center;
        box-shadow: 0 2px 6px rgba(0,0,0,0.3);
      ">
        ${iconHtml}
      </div>
    `,
    iconSize: [32, 32],
    iconAnchor: [16, 16],
  });
};

// Función para normalizar el nivel de riesgo para RiskBadge
const normalizeRiskLevel = (riskLevel) => {
  const normalized = riskLevel?.toLowerCase().trim();
  
  if (normalized === "muy alto") return "muy_alto";
  if (normalized === "bajo" || normalized === "medio" || normalized === "alto") return normalized;
  
  return "bajo"; // valor por defecto
};

export default function MapaRiesgo() {
  const { api } = useAuth();
  const [establecimientos, setEstablecimientos] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedRisk, setSelectedRisk] = useState("todos");
  const [searchTerm, setSearchTerm] = useState("");

  // Cargar establecimientos con clasificaciones
  const fetchEstablecimientos = async () => {
    try {
      setLoading(true);
      const { data } = await api.get("/clasificaciones");
      // Filtrar solo establecimientos con riesgo conocido
      const establecimientosConRiesgo = data.filter(est => 
        est.detalle?.riesgo_final
      );
      setEstablecimientos(establecimientosConRiesgo);
    } catch (err) {
      console.error("Error al cargar establecimientos:", err);
      setError("No se pudieron cargar los establecimientos.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchEstablecimientos();
  }, []);

  // Obtener el riesgo final de una clasificación
  const getRiesgoFinal = (est) => {
    // Priorizar el nombre guardado directamente, luego la relación
    return est.detalle?.riesgo_final ||
           "Desconocido";
  };

  // Filtrar establecimientos
  const filteredEstablecimientos = useMemo(() => {
    return establecimientos.filter(est => {
      const riesgo = getRiesgoFinal(est);
      const normalizedRiesgo = riesgo.toLowerCase().trim();
      
      // Solo mostrar riesgos conocidos
      const isKnownRisk = ["bajo", "medio", "alto", "muy alto"].includes(normalizedRiesgo);
      if (!isKnownRisk) return false;
      
      const matchesRisk = selectedRisk === "todos" || 
        normalizedRiesgo === selectedRisk;
      
      const matchesSearch = searchTerm === "" ||
        est.establecimiento?.nombre_comercial?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        est.establecimiento?.direccion?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        est.funcion?.nombre?.toLowerCase().includes(searchTerm.toLowerCase());
      
      return matchesRisk && matchesSearch;
    });
  }, [establecimientos, selectedRisk, searchTerm]);

  // Agrupar por nivel de riesgo para estadísticas
  const riskStats = useMemo(() => {
    const stats = {
      "bajo": 0,
      "medio": 0,
      "alto": 0,
      "muy alto": 0
    };
    
    establecimientos.forEach(est => {
      const risk = getRiesgoFinal(est).toLowerCase().trim();
      
      if (stats.hasOwnProperty(risk)) {
        stats[risk]++;
      }
    });
    
    return stats;
  }, [establecimientos]);

  // Coordenadas por defecto (Moche)
  const defaultCenter = [-8.1715, -79.0092]; 
  const defaultZoom = 15;

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 p-6">
        <div className="max-w-7xl mx-auto">
          <div className="text-center py-20">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#24412f] mx-auto mb-4"></div>
            <p className="text-gray-600">Cargando mapa de riesgos...</p>
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gray-50 p-6">
        <div className="max-w-7xl mx-auto">
          <div className="bg-red-100 text-red-700 p-4 rounded mb-6">
            {error}
          </div>
          <button
            onClick={fetchEstablecimientos}
            className="bg-[#24412f] text-white px-4 py-2 rounded hover:bg-[#1b2a1f] transition-colors"
          >
            Reintentar
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-6 py-4">
          <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
            <div>
              <h1 className="text-2xl font-bold text-gray-900 flex items-center gap-3">
                <MapPin className="text-[#24412f]" size={28} />
                Mapa de Riesgos
              </h1>
              <p className="text-gray-600 mt-1">
                Visualización geográfica de riesgos de establecimientos
              </p>
            </div>
            
            <div className="flex flex-col sm:flex-row gap-3">
              {/* Filtro por riesgo */}
              <select
                value={selectedRisk}
                onChange={(e) => setSelectedRisk(e.target.value)}
                className="px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#24412f] focus:border-transparent"
              >
                <option value="todos">Todos los riesgos</option>
                <option value="bajo">Bajo</option>
                <option value="medio">Medio</option>
                <option value="alto">Alto</option>
                <option value="muy alto">Muy Alto</option>
              </select>
              
              {/* Buscador */}
              <input
                type="text"
                placeholder="Buscar por nombre, dirección o función..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#24412f] focus:border-transparent"
              />
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto p-6">
        {/* Estadísticas */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
          <div className="bg-white p-4 rounded-lg shadow">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-emerald-100 rounded-lg">
                <Shield className="h-5 w-5 text-emerald-600" />
              </div>
              <div>
                <p className="text-sm text-gray-600">Bajo</p>
                <p className="text-2xl font-bold text-emerald-600">{riskStats.bajo}</p>
              </div>
            </div>
          </div>
          
          <div className="bg-white p-4 rounded-lg shadow">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-amber-100 rounded-lg">
                <Zap className="h-5 w-5 text-amber-600" />
              </div>
              <div>
                <p className="text-sm text-gray-600">Medio</p>
                <p className="text-2xl font-bold text-amber-600">{riskStats.medio}</p>
              </div>
            </div>
          </div>
          
          <div className="bg-white p-4 rounded-lg shadow">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-orange-100 rounded-lg">
                <AlertTriangle className="h-5 w-5 text-orange-600" />
              </div>
              <div>
                <p className="text-sm text-gray-600">Alto</p>
                <p className="text-2xl font-bold text-orange-600">{riskStats.alto}</p>
              </div>
            </div>
          </div>
          
          <div className="bg-white p-4 rounded-lg shadow">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-red-100 rounded-lg">
                <Target className="h-5 w-5 text-red-600" />
              </div>
              <div>
                <p className="text-sm text-gray-600">Muy Alto</p>
                <p className="text-2xl font-bold text-red-600">{riskStats["muy alto"]}</p>
              </div>
            </div>
          </div>
        </div>

        {/* Mapa */}
        <div className="bg-white rounded-lg shadow-lg overflow-hidden" style={{ height: '600px' }}>
          <MapContainer 
            center={defaultCenter} 
            zoom={defaultZoom} 
            style={{ height: '100%', width: '100%' }}
            className="z-0"
          >
            <TileLayer
              attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
              url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
            />
            
            {filteredEstablecimientos.map((est) => {
              // Intentar obtener la dirección y convertirla a coordenadas
              const direccion = est.establecimiento?.direccion;
              const riesgo = getRiesgoFinal(est);
              
              // Para este ejemplo, usaremos coordenadas fijas
              // En una implementación real, usarías un servicio de geocodificación
              const lat = est.establecimiento?.latitud || -12.0464; // Coordenadas por defecto
              const lng = est.establecimiento?.longitud || -77.0428; // Coordenadas por defecto
              
              if (!lat || !lng) return null;
              
              const markerIcon = createRiskIcon(riesgo);
              
              return (
                <Marker
                  key={est.id}
                  position={[lat, lng]}
                  icon={markerIcon}
                >
                  <Popup>
                    <div className="max-w-sm">
                      <h3 className="font-bold text-gray-900 mb-2">
                        {est.establecimiento?.nombre_comercial}
                      </h3>
                      <p className="text-sm text-gray-600 mb-2">
                        <span className="font-medium">Dirección:</span> {direccion}
                      </p>
                      <p className="text-sm text-gray-600 mb-2">
                        <span className="font-medium">Función:</span> {est.funcion?.nombre}
                      </p>
                      <p className="text-sm text-gray-600 mb-3">
                        <span className="font-medium">Riesgo Final:</span>
                      </p>
                      <div className="mb-2">
                        <RiskBadge 
                          level={normalizeRiskLevel(riesgo)} 
                          size="sm" 
                          variant="solid"
                        />
                      </div>
                      <div className="text-xs text-gray-500">
                        <p>Clasificado el: {new Date(est.fecha_clasificacion).toLocaleDateString()}</p>
                      </div>
                    </div>
                  </Popup>
                </Marker>
              );
            })}
          </MapContainer>
        </div>

        {/* Leyenda */}
        <div className="mt-6 bg-white p-4 rounded-lg shadow">
          <h3 className="font-semibold text-gray-900 mb-3">Leyenda Niveles de Riesgo:</h3>
          <div className="flex flex-wrap gap-6">
            <div className="flex items-center gap-3">
              <RiskMapMarker level="bajo" size="sm" showIcon={true} />
              <span className="text-sm text-gray-700">Bajo Riesgo</span>
            </div>
            <div className="flex items-center gap-3">
              <RiskMapMarker level="medio" size="sm" showIcon={true} />
              <span className="text-sm text-gray-700">Riesgo Medio</span>
            </div>
            <div className="flex items-center gap-3">
              <RiskMapMarker level="alto" size="sm" showIcon={true} />
              <span className="text-sm text-gray-700">Riesgo Alto</span>
            </div>
            <div className="flex items-center gap-3">
              <RiskMapMarker level="muy alto" size="sm" showIcon={true} />
              <span className="text-sm text-gray-700">Muy Alto Riesgo</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}