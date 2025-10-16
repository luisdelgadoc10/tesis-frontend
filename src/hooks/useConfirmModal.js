// src/hooks/useConfirmModal.js
import { useState } from "react";

export const useConfirmModal = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [config, setConfig] = useState({
    title: "",
    message: "",
    onConfirm: () => {},
    type: "danger",
    confirmText: "Confirmar",
    cancelText: "Cancelar",
  });

  const showConfirm = ({
    title = "Confirmar acción",
    message = "¿Estás seguro de realizar esta acción?",
    onConfirm = () => {},
    type = "danger",
    confirmText = "Confirmar",
    cancelText = "Cancelar",
  }) => {
    setConfig({
      title,
      message,
      onConfirm,
      type,
      confirmText,
      cancelText,
    });
    setIsOpen(true);
  };

  const closeModal = () => {
    setIsOpen(false);
  };

  return {
    isOpen,
    config,
    showConfirm,
    closeModal,
  };
};