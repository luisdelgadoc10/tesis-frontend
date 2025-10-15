// src/components/AuthCard.jsx
export default function AuthCard({ title, children, footer }) {
  return (
    <div className="flex min-h-screen items-center justify-center bg-gradient-to-br from-slate-900 via-gray-800 to-slate-900 px-4">
      <div className="w-full max-w-4xl bg-white/10 backdrop-blur-md shadow-2xl rounded-2xl grid grid-cols-1 md:grid-cols-2 overflow-hidden">
        
        {/* Imagen o Branding (oculto en móvil) */}
        <div className="hidden md:flex items-center justify-center bg-gradient-to-tr from-indigo-500 to-purple-600 p-8">
          <h2 className="text-4xl font-bold text-white drop-shadow-lg">
            LuxCode
          </h2>
        </div>

        {/* Formulario */}
        <div className="p-8 md:p-12">
          <h1 className="text-3xl font-bold text-white mb-6">{title}</h1>
          {children}

          {footer && (
            <div className="mt-6 text-center text-gray-300 text-sm">{footer}</div>
          )}
        </div>
      </div>
    </div>
  );
}
