// src/hooks/useNotification.js
import { toast } from "sonner";

export const useNotification = () => {
  // Configuración base para todos los toasts
  const defaultConfig = {
    duration: 2500,
    style: {
      borderRadius: '8px',
    },
  };

  const showSuccess = (message, options = {}) => {
    return toast.success(message, {
      ...defaultConfig,
      description: options.description,
      duration: options.duration || defaultConfig.duration,
      className: "bg-green-50 border-green-200",
      icon: "✅",
      ...options,
    });
  };

  const showError = (message, options = {}) => {
    return toast.error(message, {
      ...defaultConfig,
      description: options.description,
      duration: options.duration || 5000, // Errores duran más
      className: "bg-red-50 border-red-200",
      icon: "❌",
      ...options,
    });
  };

  const showWarning = (message, options = {}) => {
    return toast.warning(message, {
      ...defaultConfig,
      description: options.description,
      duration: options.duration || defaultConfig.duration,
      className: "bg-yellow-50 border-yellow-200",
      icon: "⚠️",
      ...options,
    });
  };

  const showInfo = (message, options = {}) => {
    return toast.info(message, {
      ...defaultConfig,
      description: options.description,
      duration: options.duration || defaultConfig.duration,
      className: "bg-blue-50 border-blue-200",
      icon: "ℹ️",
      ...options,
    });
  };

  const showLoading = (message, options = {}) => {
    return toast.loading(message, {
      ...defaultConfig,
      description: options.description,
      className: "bg-gray-50 border-gray-200",
      ...options,
    });
  };

  // Helper para operaciones con loading automático
  const withLoading = async (promise, messages = {}) => {
    const {
      loading = "Procesando...",
      success = "Operación exitosa",
      error = "Ocurrió un error",
    } = messages;

    const toastId = showLoading(loading);

    try {
      const result = await promise;
      toast.success(success, {
        id: toastId,
        ...defaultConfig,
        className: "bg-green-50 border-green-200",
        icon: "✅",
      });
      return result;
    } catch (err) {
      const errorMsg = err.response?.data?.message || error;
      toast.error("Error", {
        id: toastId,
        description: errorMsg,
        duration: 5000,
        className: "bg-red-50 border-red-200",
        icon: "❌",
      });
      throw err;
    }
  };

  // Helper para errores de API con formato consistente
  const showApiError = (err, defaultMessage = "Ocurrió un error") => {
    const message = err.response?.data?.message || defaultMessage;
    const errors = err.response?.data?.errors;

    // Si hay múltiples errores de validación
    if (errors) {
      const errorList = Object.values(errors).flat().join(", ");
      return showError(defaultMessage, {
        description: errorList,
        duration: 6000,
      });
    }

    return showError(defaultMessage, {
      description: message,
    });
  };

  const dismissToast = (id) => {
    toast.dismiss(id);
  };

  const dismissAll = () => {
    toast.dismiss();
  };

  return {
    showSuccess,
    showError,
    showWarning,
    showInfo,
    showLoading,
    withLoading,
    showApiError,
    dismissToast,
    dismissAll,
  };
};