// src/components/StatusBadge.jsx
import { CheckCircle, XCircle } from "lucide-react";

export default function StatusBadge({ 
  status, 
  activeText = "Activo", 
  inactiveText = "Inactivo",
  size = "sm", // "xs" | "sm" | "md"
  variant = "default", // "default" | "subtle" | "minimal"
  showIcon = true
}) {
  const isActive = status === true || status === 1 || status === "activo" || status === "active";
  
  const sizeClasses = {
    xs: "px-2 py-0.5 text-xs",
    sm: "px-2.5 py-0.5 text-sm",
    md: "px-3 py-1 text-sm"
  };

  const variantClasses = {
    default: {
      active: "bg-green-100 text-green-800",
      inactive: "bg-red-100 text-red-800"
    },
    subtle: {
      active: "bg-green-50 text-green-700",
      inactive: "bg-red-50 text-red-700"
    },
    minimal: {
      active: "bg-transparent text-green-600",
      inactive: "bg-transparent text-red-600"
    }
  };

  const iconSize = size === "xs" ? 12 : size === "sm" ? 14 : 16;
  const baseClasses = "inline-flex items-center rounded-full font-medium";
  const currentVariant = variantClasses[variant] || variantClasses.default;
  const currentSize = sizeClasses[size] || sizeClasses.sm;

  return (
    <span className={`${baseClasses} ${currentSize} ${isActive ? currentVariant.active : currentVariant.inactive}`}>
      {showIcon && (
        isActive ? 
          <CheckCircle size={iconSize} className="mr-1.5" /> : 
          <XCircle size={iconSize} className="mr-1.5" />
      )}
      {isActive ? activeText : inactiveText}
    </span>
  );
}