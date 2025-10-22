import { useState } from "react";
import Button from "../Button";
import SelectField from "./SelectField";
import MultiSelectField from "./MultiSelectField";

export default function FormularioBase({ pasos, datos, onChange }) {
  const [pasoActual, setPasoActual] = useState(0);
  const totalPasos = pasos.length;

  const esPasoValido = () => {
    const paso = pasos[pasoActual];
    return paso.campos.every((campo) => {
      if (!campo.requerido) return true;
      if (campo.tipo === "multiselect") {
        return datos[campo.nombre] && datos[campo.nombre].length > 0;
      }
      return datos[campo.nombre] !== undefined && datos[campo.nombre] !== "";
    });
  };

  const handleSiguiente = () => {
    if (esPasoValido() && pasoActual < totalPasos - 1) {
      setPasoActual(pasoActual + 1);
    }
  };

  const handleAnterior = () => {
    if (pasoActual > 0) {
      setPasoActual(pasoActual - 1);
    }
  };

  const renderCampo = (campo) => {
    const valor = datos[campo.nombre] ?? (campo.tipo === "multiselect" ? [] : "");

    switch (campo.tipo) {
      case "select":
        return <SelectField campo={campo} valor={valor} onChange={onChange} />;

      case "number":
        return (
          <input
            type="number"
            value={valor}
            onChange={(e) =>
              onChange(campo.nombre, e.target.value === "" ? "" : Number(e.target.value))
            }
            min={campo.min}
            max={campo.max}
            step={campo.step || 1}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-[#24412f] focus:border-[#24412f]"
            required={campo.requerido}
          />
        );

      case "checkbox":
        return (
          <div className="flex items-center">
            <input
              type="checkbox"
              id={campo.nombre}
              checked={!!valor}
              onChange={(e) => onChange(campo.nombre, e.target.checked)}
              className="h-4 w-4 text-[#24412f] rounded focus:ring-[#24412f] border-gray-300"
            />
            <label htmlFor={campo.nombre} className="ml-2 text-sm text-gray-700">
              {campo.label}
            </label>
          </div>
        );

      case "multiselect":
        return <MultiSelectField campo={campo} valor={valor} onChange={onChange} />;

      default:
        return null;
    }
  };

  return (
    <div className="space-y-6">
      {/* Encabezado con progreso */}
      <div className="flex justify-between items-center mb-6">
        <h4 className="text-lg font-medium text-gray-800">
          {pasos[pasoActual].titulo}
        </h4>
        <span className="text-sm text-gray-500">
          Paso {pasoActual + 1} de {totalPasos}
        </span>
      </div>

      {/* Barra de progreso */}
      <div className="w-full bg-gray-200 rounded-full h-2 mb-6">
        <div
          className="bg-[#24412f] h-2 rounded-full transition-all duration-300"
          style={{ width: `${((pasoActual + 1) / totalPasos) * 100}%` }}
        />
      </div>

      {/* Campos del paso actual */}
      <div className="space-y-4">
        {pasos[pasoActual].campos.map((campo, index) => (
          <div key={index}>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              {campo.label} {campo.requerido && <span className="text-red-500">*</span>}
            </label>
            {renderCampo(campo)}
          </div>
        ))}
      </div>

      {/* Botones de navegación */}
      <div className="flex justify-between pt-4 border-t">
        <Button
          type="button"
          onClick={handleAnterior}
          disabled={pasoActual === 0}
          className="px-4 py-2 bg-gray-500 text-white hover:bg-gray-700 rounded-md disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
        >
          Anterior
        </Button>

        <Button
          type="button"
          onClick={handleSiguiente}
          disabled={!esPasoValido()}
          className="px-4 py-2 bg-[#24412f] text-white hover:bg-[#1b2a1f] rounded-md disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
        >
          {pasoActual === totalPasos - 1 ? "Completar Datos" : "Siguiente"}
        </Button>
      </div>
    </div>
  );
}
