// src/components/FuncionModal.jsx
import { X } from "lucide-react";
import Button from "./Button";

export default function FuncionModal({
  isOpen,
  onClose,
  onSubmit,
  currentFuncion,
  formData,
  setFormData,
  formError,
}) {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-lg max-w-md w-full">
        <div className="flex items-center justify-between p-6 border-b">
          <h3 className="text-lg font-medium">
            {currentFuncion ? "Editar Función" : "Nueva Función"}
          </h3>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600 transition-colors"
          >
            <X size={20} />
          </button>
        </div>

        <form onSubmit={onSubmit} className="p-6 space-y-6">
          {formError && (
            <div className="bg-red-100 text-red-700 p-3 rounded text-sm">
              {formError}
            </div>
          )}

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Nombre de la Función *
            </label>
            <input
              type="text"
              value={formData.nombre}
              onChange={(e) => setFormData({ ...formData, nombre: e.target.value })}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#24412f] focus:border-transparent"
              required
            />
          </div>

          <div className="flex justify-end space-x-3 pt-4">
            <Button
              type="button"
              onClick={onClose}
              className="text-gray-600 bg-gray-500 hover:bg-gray-800 transition"
            >
              Cancelar
            </Button>
            <Button
              type="submit"
              className="px-4 py-2 bg-[#24412f] text-white hover:bg-[#1b2a1f] rounded-md transition-colors"
            >
              {currentFuncion ? "Actualizar" : "Crear"}
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
}