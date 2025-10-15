// src/components/RiskMapMarker.jsx (solo para la leyenda)
import { Shield, Zap, AlertTriangle, Target } from "lucide-react";

export default function RiskMapMarker({ 
  level, 
  size = "md", 
  showIcon = true,
  showText = false 
}) {
  // Normalizar el nivel de riesgo
  const riskLevel = level?.toString().toLowerCase() || "bajo";
  
  // Configuración por nivel de riesgo con colores sólidos
  const riskConfig = {
    bajo: {
      text: "Bajo",
      bgColor: "bg-emerald-500",
      borderColor: "border-emerald-600",
      icon: Shield,
      iconColor: "text-white"
    },
    medio: {
      text: "Medio",
      bgColor: "bg-amber-500",
      borderColor: "border-amber-600",
      icon: Zap,
      iconColor: "text-white"
    },
    alto: {
      text: "Alto",
      bgColor: "bg-orange-500",
      borderColor: "border-orange-600",
      icon: AlertTriangle,
      iconColor: "text-white"
    },
    "muy alto": {
      text: "Muy Alto",
      bgColor: "bg-red-600",
      borderColor: "border-red-700",
      icon: Target,
      iconColor: "text-white"
    }
  };

  const sizeClasses = {
    xs: "w-6 h-6",
    sm: "w-8 h-8",
    md: "w-10 h-10",
    lg: "w-12 h-12"
  };

  const currentSize = sizeClasses[size] || sizeClasses.md;
  const config = riskConfig[riskLevel] || riskConfig.bajo;
  const IconComponent = config.icon;

  const iconSize = size === "xs" ? 12 : size === "sm" ? 14 : size === "md" ? 16 : 20;

  return (
    <div className={`
      flex items-center justify-center rounded-full border-2 
      ${config.bgColor} ${config.borderColor} 
      ${currentSize} shadow-lg
    `}>
      {showIcon && (
        <IconComponent 
          size={iconSize} 
          className={config.iconColor} 
        />
      )}
      {showText && !showIcon && (
        <span className="font-bold text-white text-xs">
          {config.text.charAt(0)}
        </span>
      )}
      {showText && showIcon && (
        <span className="font-bold text-white text-xs ml-1">
          {config.text}
        </span>
      )}
    </div>
  );
}