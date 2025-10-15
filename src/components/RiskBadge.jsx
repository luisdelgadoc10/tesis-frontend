// src/components/RiskBadge.jsx
import { AlertCircle, Shield, Siren, ShieldCheck, CircleCheck, SignalMedium, ShieldHalf, TriangleAlert } from "lucide-react";

export default function RiskBadge({ 
  level, // "bajo" | "medio" | "alto" | "muy_alto"
  size = "sm", // "xs" | "sm" | "md"
  variant = "default", // "default" | "solid" | "outlined"
  showIcon = true,
  showText = true
}) {
  // Normalizar el nivel de riesgo
  const riskLevel = level?.toString().toLowerCase() || "bajo";
  
  // Configuración por nivel de riesgo con colores más vibrantes
  const riskConfig = {
    bajo: {
      text: "Bajo",
      color: {
        default: "bg-emerald-100 text-emerald-800 border-emerald-200",
        solid: "bg-emerald-500 text-white",
        outlined: "bg-transparent text-emerald-600 border-2 border-emerald-500"
      },
      icon: CircleCheck,
      iconColor: "text-emerald-600",
      solidIconColor: "text-white"
    },
    medio: {
      text: "Medio",
      color: {
        default: "bg-amber-100 text-amber-800 border-amber-200",
        solid: "bg-amber-500 text-white",
        outlined: "bg-transparent text-amber-600 border-2 border-amber-500"
      },
      icon: ShieldHalf,
      iconColor: "text-amber-600",
      solidIconColor: "text-white"
    },
    alto: {
      text: "Alto",
      color: {
        default: "bg-orange-100 text-orange-800 border-orange-200",
        solid: "bg-orange-500 text-white",
        outlined: "bg-transparent text-orange-600 border-2 border-orange-500"
      },
      icon: TriangleAlert,
      iconColor: "text-orange-600",
      solidIconColor: "text-white"
    },
    muy_alto: {
      text: "Muy Alto",
      color: {
        default: "bg-red-100 text-red-800 border-red-200",
        solid: "bg-red-600 text-white",
        outlined: "bg-transparent text-red-600 border-2 border-red-600"
      },
      icon: Siren,
      iconColor: "text-red-600",
      solidIconColor: "text-white"
    }
  };

  const sizeClasses = {
    xs: "px-2 py-0.5 text-xs",
    sm: "px-3 py-1 text-sm",
    md: "px-4 py-1.5 text-sm"
  };

  const baseClasses = "inline-flex items-center rounded-full font-semibold";
  const currentSize = sizeClasses[size] || sizeClasses.sm;
  const config = riskConfig[riskLevel] || riskConfig.bajo;
  const IconComponent = config.icon;

  const iconSize = size === "xs" ? 12 : size === "sm" ? 14 : 16;
  const isSolid = variant === "solid";
  const iconColor = isSolid ? config.solidIconColor : config.iconColor;

  return (
    <span className={`${baseClasses} ${currentSize} ${config.color[variant] || config.color.default} ${variant !== "outlined" ? 'border' : ''}`}>
      {showIcon && (
        <IconComponent 
          size={iconSize} 
          className={`mr-1.5 flex-shrink-0 ${iconColor}`} 
        />
      )}
      {showText && (
        <span className="truncate font-bold">{config.text}</span>
      )}
    </span>
  );
}