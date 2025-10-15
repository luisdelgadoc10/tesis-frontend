// src/components/EstablecimientoModal.jsx
import { useState } from "react";
import { X } from "lucide-react";
import Button from "./Button";
import LocationPicker from "./LocationPicker";
import "leaflet/dist/leaflet.css";
import Select from "react-select"; // ✅ Importamos react-select

// Estilos personalizados para react-select (opcional pero recomendado)
const customSelectStyles = {
  control: (provided, state) => ({
    ...provided,
    borderColor: state.isFocused ? "#24412f" : "#d1d5db",
    boxShadow: state.isFocused ? "0 0 0 3px rgba(36, 65, 47, 0.1)" : "none",
    "&:hover": {
      borderColor: "#24412f",
    },
    minHeight: "42px",
    borderRadius: "0.375rem",
    fontSize: "0.875rem",
  }),
  option: (provided, state) => ({
    ...provided,
    backgroundColor: state.isSelected
      ? "#24412f"
      : state.isFocused
      ? "#f3f4f6"
      : "white",
    color: state.isSelected ? "white" : "#374151",
    padding: "8px 12px",
    fontSize: "0.875rem",
  }),
  singleValue: (provided) => ({
    ...provided,
    color: "#374151",
  }),
  placeholder: (provided) => ({
    ...provided,
    color: "#9ca3af",
  }),
  menu: (provided) => ({
    ...provided,
    zIndex: 10,
  }),
};

export default function EstablecimientoModal({
  isOpen,
  onClose,
  onSubmit,
  currentEstablecimiento,
  formData,
  setFormData,
  formError,
  actividadesEconomicas = [],
}) {
  if (!isOpen) return null;

  const [loadingReverseGeocode, setLoadingReverseGeocode] = useState(false);

  const reverseGeocode = async (lat, lng) => {
    setLoadingReverseGeocode(true);
    try {
      const response = await fetch(
        `https://nominatim.openstreetmap.org/reverse?format=json&lat=${lat}&lon=${lng}&zoom=18&addressdetails=1`
      );
      const data = await response.json();
      if (data.display_name) {
        setFormData((prev) => ({
          ...prev,
          direccion: data.display_name,
        }));
      }
    } catch (err) {
      console.warn("No se pudo obtener la dirección desde las coordenadas.");
    } finally {
      setLoadingReverseGeocode(false);
    }
  };

  const handleLocationChange = (coords) => {
    setFormData((prev) => ({
      ...prev,
      latitud: coords.lat,
      longitud: coords.lng,
    }));
  };

  // Convertir actividades a formato para react-select
  const actividadesOptions = actividadesEconomicas.map((actividad) => ({
    value: actividad.id,
    label: actividad.descripcion,
  }));

  // Manejar cambio en react-select
  const handleActividadChange = (selectedOption) => {
    setFormData((prev) => ({
      ...prev,
      actividad_economica_id: selectedOption ? selectedOption.value : null,
    }));
  };

  // Valor actual para react-select
  const selectedActividad = actividadesOptions.find(
    (option) => option.value === formData.actividad_economica_id
  );

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-lg max-w-3xl w-full max-h-[90vh] overflow-y-auto">
        <div className="flex items-center justify-between p-6 border-b">
          <h3 className="text-xl font-semibold text-gray-800">
            {currentEstablecimiento
              ? "Editar Establecimiento"
              : "Nuevo Establecimiento"}
          </h3>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600 transition-colors"
          >
            <X size={22} />
          </button>
        </div>

        <form onSubmit={onSubmit} className="p-8 space-y-8">
          {formError && (
            <div className="bg-red-50 text-red-700 p-4 rounded-lg border border-red-200">
              {formError}
            </div>
          )}

          {/* Sección: Datos del Establecimiento */}
          <div className="space-y-6">
            <div>
              <h4 className="text-lg font-medium text-gray-800 mb-4">
                Datos del Establecimiento
              </h4>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Nombre Comercial *
                </label>
                <input
                  type="text"
                  value={formData.nombre_comercial}
                  onChange={(e) =>
                    setFormData({
                      ...formData,
                      nombre_comercial: e.target.value,
                    })
                  }
                  className="w-full px-4 py-2.5 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#24412f] focus:border-transparent"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Razón Social *
                </label>
                <input
                  type="text"
                  value={formData.razon_social}
                  onChange={(e) =>
                    setFormData({ ...formData, razon_social: e.target.value })
                  }
                  className="w-full px-4 py-2.5 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#24412f] focus:border-transparent"
                  required
                />
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  RUC *
                </label>
                <input
                  type="text"
                  value={formData.ruc}
                  onChange={(e) => {
                    const value = e.target.value;
                    if (/^\d{0,11}$/.test(value)) {
                      setFormData({ ...formData, ruc: value });
                    }
                  }}
                  className="w-full px-4 py-2.5 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#24412f] focus:border-transparent"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Dirección *
                </label>
                <input
                  type="text"
                  value={formData.direccion}
                  onChange={(e) =>
                    setFormData({ ...formData, direccion: e.target.value })
                  }
                  className="w-full px-4 py-2.5 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#24412f] focus:border-transparent"
                  required
                />
              </div>
            </div>

            {/* Actividad Económica en fila completa */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Actividad Económica *
              </label>
              <Select
                value={selectedActividad}
                onChange={handleActividadChange}
                options={actividadesOptions}
                placeholder="Seleccionar actividad..."
                isClearable
                isSearchable
                styles={customSelectStyles}
                className="text-sm"
                required
              />
            </div>

            {/* Mapa de Ubicación */}
            <div className="pt-4">
              <label className="block text-sm font-medium text-gray-700 mb-3">
                Ubicación en el Mapa
              </label>
              <LocationPicker
                position={[formData.latitud, formData.longitud]}
                onPositionChange={handleLocationChange}
              />
              <div className="mt-3 text-xs text-gray-500 italic">
                Haz clic en el mapa para colocar el marcador en la ubicación
                exacta del establecimiento.
                {loadingReverseGeocode && " Obteniendo dirección..."}
              </div>
              <div className="mt-3 grid grid-cols-2 gap-3 text-sm">
                <div>
                  <span className="text-gray-600">Latitud:</span>{" "}
                  <span className="font-mono">
                    {formData.latitud
                      ? Number(formData.latitud).toFixed(6)
                      : "—"}
                  </span>
                </div>
                <div>
                  <span className="text-gray-600">Longitud:</span>{" "}
                  <span className="font-mono">
                    {formData.longitud
                      ? Number(formData.longitud).toFixed(6)
                      : "—"}
                  </span>
                </div>
              </div>
            </div>
          </div>

          {/* Sección: Datos de Contacto */}
          <div className="pt-6 border-t space-y-6">
            <h4 className="text-lg font-medium text-gray-800">
              Datos de Contacto
            </h4>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Propietario *
                </label>
                <input
                  type="text"
                  value={formData.propietario}
                  onChange={(e) =>
                    setFormData({ ...formData, propietario: e.target.value })
                  }
                  className="w-full px-4 py-2.5 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#24412f] focus:border-transparent"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Teléfono *
                </label>
                <input
                  type="tel"
                  value={formData.telefono}
                  onChange={(e) => {
                    const value = e.target.value;
                    if (/^\d{0,9}$/.test(value)) {
                      setFormData({ ...formData, telefono: value });
                    }
                  }}
                  className="w-full px-4 py-2.5 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#24412f] focus:border-transparent"
                  required
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Correo Electrónico
              </label>
              <input
                type="email"
                value={formData.correo_electronico}
                onChange={(e) =>
                  setFormData({
                    ...formData,
                    correo_electronico: e.target.value,
                  })
                }
                className="w-full px-4 py-2.5 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#24412f] focus:border-transparent"
              />
            </div>
          </div>

          {/* Botones */}
          <div className="flex justify-end space-x-4 pt-4">
            <Button
              type="button"
              onClick={onClose}
              className="px-5 py-2.5 text-gray-700 bg-gray-100 hover:bg-gray-200 rounded-md transition-colors"
            >
              Cancelar
            </Button>
            <Button
              type="submit"
              className="px-5 py-2.5 bg-[#24412f] text-white hover:bg-[#1b2a1f] rounded-md transition-colors font-medium"
            >
              {currentEstablecimiento ? "Actualizar" : "Crear"}
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
}
