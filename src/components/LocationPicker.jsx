// src/components/LocationPicker.jsx
import {
  MapContainer,
  TileLayer,
  Marker,
  useMapEvents,
  useMap,
} from "react-leaflet";
import { useState, useEffect } from "react";
import { LocateIcon } from "lucide-react";
import "leaflet/dist/leaflet.css";
import L from "leaflet";

// Solución para el ícono del marcador
import markerIcon2x from "leaflet/dist/images/marker-icon-2x.png";
import markerIcon from "leaflet/dist/images/marker-icon.png";
import markerShadow from "leaflet/dist/images/marker-shadow.png";

delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: markerIcon2x,
  iconUrl: markerIcon,
  shadowUrl: markerShadow,
});

// Componente para centrar el mapa cuando cambia la ubicación
function MapUpdater({ center }) {
  const map = useMap();
  useEffect(() => {
    if (
      center &&
      typeof center[0] === "number" &&
      typeof center[1] === "number"
    ) {
      map.setView(center, 18);
    }
  }, [center, map]);
  return null;
}

export default function LocationPicker({
  position,
  onPositionChange,
  showCurrentLocationButton = true,
}) {
  const initialPosition =
    Array.isArray(position) &&
    typeof position[0] === "number" &&
    typeof position[1] === "number"
      ? [position[0], position[1]]
      : [-8.17123061424572, -79.00891877669534];

  const [markerPosition, setMarkerPosition] = useState(initialPosition);
  const [loadingGeolocation, setLoadingGeolocation] = useState(false);

  useEffect(() => {
    if (
      Array.isArray(position) &&
      typeof position[0] === "number" &&
      typeof position[1] === "number"
    ) {
      const newPos = [position[0], position[1]];
      if (newPos[0] !== markerPosition[0] || newPos[1] !== markerPosition[1]) {
        setMarkerPosition(newPos);
      }
    }
  }, [position, markerPosition]);

  const LocationEvents = () => {
    const map = useMapEvents({
      click(e) {
        const { lat, lng } = e.latlng;
        setMarkerPosition([lat, lng]);
        onPositionChange({ lat, lng });
      },
    });
    return null;
  };

  const handleGetCurrentLocation = () => {
    if (!navigator.geolocation) {
      alert("Tu navegador no soporta geolocalización.");
      return;
    }

    setLoadingGeolocation(true);

    navigator.geolocation.getCurrentPosition(
      (position) => {
        const { latitude, longitude } = position.coords;
        const newPos = [latitude, longitude];
        setMarkerPosition(newPos);
        onPositionChange({ lat: latitude, lng: longitude });
        setLoadingGeolocation(false);
      },
      (error) => {
        let message = "No se pudo obtener tu ubicación.";
        if (error.code === error.PERMISSION_DENIED) {
          message =
            "Permiso denegado. Por favor, permite el acceso en el navegador.";
        }
        alert(message);
        console.error("Error:", error);
        setLoadingGeolocation(false);
      },
      {
        enableHighAccuracy: true,
        timeout: 10000,
        maximumAge: 0,
      }
    );
  };

  return (
    <div className="h-64 w-full rounded-lg border relative overflow-hidden">
      <MapContainer
        center={markerPosition}
        zoom={15}
        scrollWheelZoom={true}
        className="h-full w-full"
        style={{ height: "100%", width: "100%" }}
      >
        <TileLayer
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
        />
        <LocationEvents />
        <Marker position={markerPosition} />
        <MapUpdater center={markerPosition} />
      </MapContainer>

      {/* Botón de geolocalización */}
      {showCurrentLocationButton && (
        <button
          onClick={handleGetCurrentLocation}
          disabled={loadingGeolocation}
          className="absolute bottom-2 right-2 z-[1000] bg-white hover:bg-gray-50 border border-[#24412f] rounded-md p-2 shadow-md transition-colors disabled:opacity-60"
          aria-label="Usar mi ubicación actual"
        >
          {loadingGeolocation ? (
            <div className="w-5 h-5 border-2 border-[#24412f] border-t-transparent rounded-full animate-spin"></div>
          ) : (
            <LocateIcon size={20} className="text-[#24412f]" />
          )}
        </button>
      )}
    </div>
  );
}
