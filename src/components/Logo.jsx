// src/components/Logo.jsx

export default function Logo({ className = "" }) {
  return (
    <div className={`flex items-center space-x-3 ${className}`}>
      {/* Logo desde la carpeta public */}
      <div className="p-2 bg-white rounded-xl flex items-center justify-center">
        <img
          src="/logo.png"
          alt="Logo Smart Risk"
          className="h-8 w-8 object-contain"
        />
      </div>

      <div>
        <h1 className="text-lg font-bold text-white">Smart Risk</h1>
        <p className="text-xs text-white/80 font-medium">Versión 1.0</p>
      </div>
    </div>
  );
}
