// src/components/ConfirmModal.jsx
import { X, AlertTriangle, Trash2, RotateCcw, AlertCircle } from "lucide-react";
import Button from "./Button";

export default function ConfirmModal({
  isOpen,
  onClose,
  onConfirm,
  title = "Confirmar acción",
  message = "¿Estás seguro de realizar esta acción?",
  confirmText = "Confirmar",
  cancelText = "Cancelar",
  type = "danger", // danger, warning, info, success
  icon: CustomIcon,
}) {
  if (!isOpen) return null;

  // Definir colores y iconos según el tipo
  const config = {
    danger: {
      icon: Trash2,
      iconColor: "text-red-600",
      iconBg: "bg-red-100",
      buttonBg: "bg-red-600 hover:bg-red-700",
      borderColor: "border-red-200",
    },
    warning: {
      icon: AlertTriangle,
      iconColor: "text-yellow-600",
      iconBg: "bg-yellow-100",
      buttonBg: "bg-yellow-600 hover:bg-yellow-700",
      borderColor: "border-yellow-200",
    },
    info: {
      icon: AlertCircle,
      iconColor: "text-blue-600",
      iconBg: "bg-blue-100",
      buttonBg: "bg-blue-600 hover:bg-blue-700",
      borderColor: "border-blue-200",
    },
    success: {
      icon: RotateCcw,
      iconColor: "text-green-600",
      iconBg: "bg-green-100",
      buttonBg: "bg-green-600 hover:bg-green-700",
      borderColor: "border-green-200",
    },
  };

  const { icon: Icon, iconColor, iconBg, buttonBg, borderColor } = config[type];
  const IconComponent = CustomIcon || Icon;

  const handleConfirm = () => {
    onConfirm();
    onClose();
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-lg w-full max-w-md shadow-xl">
        {/* Header */}
        <div className="flex items-start justify-between p-6 border-b">
          <div className="flex items-start space-x-3">
            <div className={`${iconBg} p-2 rounded-full`}>
              <IconComponent className={`h-6 w-6 ${iconColor}`} />
            </div>
            <div>
              <h3 className="text-lg font-semibold text-gray-900">{title}</h3>
            </div>
          </div>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600 transition-colors"
          >
            <X size={20} />
          </button>
        </div>

        {/* Body */}
        <div className="p-6">
          <p className="text-gray-600 text-sm leading-relaxed">{message}</p>
        </div>

        {/* Footer */}
        <div className="flex justify-end space-x-3 p-6 border-t bg-gray-50">
          <Button
            type="button"
            onClick={onClose}
            className="px-4 py-2 bg-gray-500 text-white hover:bg-gray-700 rounded-md"
          >
            {cancelText}
          </Button>
          <Button
            type="button"
            onClick={handleConfirm}
            className={`px-4 py-2 text-white transition-colors ${buttonBg}`}
          >
            {confirmText}
          </Button>
        </div>
      </div>
    </div>
  );
}