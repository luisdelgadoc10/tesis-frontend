// src/pages/SubfuncionesPage.jsx (actualizado)
import { useState, useEffect, useMemo } from "react";
import { useAuth } from "../context/AuthContext";
import { FileText, Plus, Eye, Edit3, Trash2, Search, ChevronLeft, ChevronRight } from "lucide-react";
import { useNavigate } from "react-router-dom";
import Button from "../components/Button";
import StatusBadge from "../components/StatusBadge";
import RiskBadge from "../components/RiskBadge";
import CustomTable from "../components/CustomTable";

export default function SubfuncionesPage() {
  const { api } = useAuth();
  const navigate = useNavigate();
  const [subfunciones, setSubfunciones] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Cargar subfunciones
  const fetchSubfunciones = async () => {
    try {
      setLoading(true);
      const { data } = await api.get("/subfunciones");
      setSubfunciones(Array.isArray(data) ? data : data.data || []);
    } catch (err) {
      console.error("Error al cargar subfunciones:", err);
      setError("No se pudieron cargar las subfunciones.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchSubfunciones();
  }, []);

  // Ver detalle
  const handleView = (id) => {
    navigate(`/subfunciones/${id}`);
  };

  // Editar
  const handleEdit = (id) => {
    navigate(`/subfunciones/${id}/editar`);
  };

  // Eliminar
  const handleDelete = async (id) => {
    if (!window.confirm("¿Estás seguro de eliminar esta subfunción?")) return;
    
    try {
      await api.delete(`/subfunciones/${id}`);
      fetchSubfunciones();
    } catch (err) {
      console.error("Error al eliminar subfunción:", err);
      alert("No se pudo eliminar la subfunción.");
    }
  };

  // Convertir nombre de riesgo a nivel para RiskBadge
  const getRiskLevel = (nombreRiesgo) => {
    if (!nombreRiesgo) return "bajo";
    
    const nivel = nombreRiesgo.toLowerCase().trim();
    switch (nivel) {
      case 'bajo':
        return 'bajo';
      case 'medio':
        return 'medio';
      case 'alto':
        return 'alto';
      case 'muy alto':
      case 'muy_alto':
        return 'muy_alto';
      default:
        return 'bajo';
    }
  };

  // Definir columnas para la tabla
  const columns = useMemo(() => [
    {
      header: 'Función',
      accessorKey: 'funcion.nombre',
      cell: ({ row }) => (
        <div className="text-sm text-gray-900">
          {row.original.funcion?.nombre || "—"}
        </div>
      ),
    },
    {
      header: 'Código',
      accessorKey: 'codigo',
      cell: ({ row }) => (
        <div className="text-sm font-medium text-gray-900">
          {row.original.codigo || "—"}
        </div>
      ),
    },
    {
      header: 'Descripción',
      accessorKey: 'descripcion',
      cell: ({ row }) => (
        <div className="text-sm text-gray-900 max-w-xs truncate">
          {row.original.descripcion || "—"}
        </div>
      ),
    },
    {
      header: 'Riesgo Incendio',
      cell: ({ row }) => (
        <RiskBadge 
          level={getRiskLevel(row.original.riesgo_incendio?.nombre)} 
          size="xs" 
          variant="solid"
        />
      ),
    },
    {
      header: 'Riesgo Colapso',
      cell: ({ row }) => (
        <RiskBadge 
          level={getRiskLevel(row.original.riesgo_colapso?.nombre)} 
          size="xs" 
          variant="solid"
        />
      ),
    },
    {
      header: 'Acciones',
      cell: ({ row }) => (
        <div className="flex items-center space-x-2">
          <button
            onClick={() => handleView(row.original.id)}
            className="text-blue-600 hover:text-blue-900 p-1"
            title="Ver"
          >
            <Eye size={16} />
          </button>
          <button
            onClick={() => handleEdit(row.original.id)}
            className="text-green-600 hover:text-green-900 p-1"
            title="Editar"
          >
            <Edit3 size={16} />
          </button>
          <button
            onClick={() => handleDelete(row.original.id)}
            className="text-red-600 hover:text-red-900 p-1"
            title="Eliminar"
          >
            <Trash2 size={16} />
          </button>
        </div>
      ),
    },
  ], []);

  // Componente para vista móvil - Card
  const SubfuncionCard = ({ subfuncion }) => (
    <div className="bg-white rounded-lg shadow border p-4 mb-4">
      <div className="flex items-start justify-between mb-3">
        <div>
          <h3 className="font-medium text-gray-900">
            {subfuncion.codigo || "Sin código"}
          </h3>
          <p className="text-sm text-gray-500">
            {subfuncion.funcion?.nombre || "Sin función"}
          </p>
        </div>
        <StatusBadge status={true} />
      </div>

      <div className="space-y-2 text-sm">
        <div className="flex justify-between">
          <span className="text-gray-500">Descripción:</span>
          <span className="font-medium max-w-[180px] truncate">
            {subfuncion.descripcion || "N/A"}
          </span>
        </div>
        <div className="flex justify-between items-center">
          <span className="text-gray-500">Riesgo Incendio:</span>
          <RiskBadge 
            level={getRiskLevel(subfuncion.riesgo_incendio?.nombre)} 
            size="sm" 
          />
        </div>
        <div className="flex justify-between items-center">
          <span className="text-gray-500">Riesgo Colapso:</span>
          <RiskBadge 
            level={getRiskLevel(subfuncion.riesgo_colapso?.nombre)} 
            size="sm" 
          />
        </div>
      </div>

      <div className="flex justify-end mt-4 space-x-2">
        <button
          onClick={() => handleView(subfuncion.id)}
          className="p-2 text-blue-600 hover:text-blue-900 hover:bg-blue-50 rounded-full transition-colors"
          title="Ver"
        >
          <Eye size={16} />
        </button>
        <button
          onClick={() => handleEdit(subfuncion.id)}
          className="p-2 text-green-600 hover:text-green-900 hover:bg-green-50 rounded-full transition-colors"
          title="Editar"
        >
          <Edit3 size={16} />
        </button>
        <button
          onClick={() => handleDelete(subfuncion.id)}
          className="p-2 text-red-600 hover:text-red-900 hover:bg-red-50 rounded-full transition-colors"
          title="Eliminar"
        >
          <Trash2 size={16} />
        </button>
      </div>
    </div>
  );

  return (
    <div className="w-full">
      <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center mb-6 gap-4">
        <h2 className="text-xl font-medium">Subfunciones</h2>
        <Button
          onClick={() => navigate("/subfunciones/nueva")}
          className="flex items-center gap-2 bg-[#24412f] text-white hover:bg-[#1b2a1f] transition-colors w-full sm:w-auto justify-center"
        >
          <Plus size={18} />
          Nueva Subfunción
        </Button>
      </div>

      {error && (
        <div className="bg-red-100 text-red-700 p-3 rounded mb-4">{error}</div>
      )}

      {loading ? (
        <div className="text-center py-10">Cargando subfunciones...</div>
      ) : (
        <>
          {/* Vista móvil - Cards */}
          <div className="md:hidden">
            {subfunciones.length === 0 ? (
              <div className="text-center py-10 text-gray-500">
                No hay subfunciones disponibles.
              </div>
            ) : (
              <div className="space-y-4">
                {subfunciones.map((subfuncion) => (
                  <SubfuncionCard 
                    key={subfuncion.id} 
                    subfuncion={subfuncion} 
                  />
                ))}
              </div>
            )}
          </div>

          {/* Vista escritorio - Tabla personalizada con paginación y filtrado */}
          <div className="hidden md:block">
            <CustomTable 
              data={subfunciones} 
              columns={columns} 
              searchable={true}
            />
          </div>
        </>
      )}
    </div>
  );
}