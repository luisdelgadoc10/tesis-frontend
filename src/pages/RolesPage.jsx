// src/pages/RolesPage.jsx
import { useState, useEffect, useMemo } from "react";
import { useAuth } from "../context/AuthContext";
import { Shield, Plus, Edit, Trash2, RotateCcw, ToggleLeft, ToggleRight } from "lucide-react";
import { useNavigate } from "react-router-dom";
import Button from "../components/Button";
import StatusBadge from "../components/StatusBadge";
import CustomTable from "../components/CustomTable";

export default function RolesPage() {
  const { api } = useAuth();
  const navigate = useNavigate();
  const [roles, setRoles] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Cargar roles
  const fetchRoles = async () => {
    try {
      setLoading(true);
      const { data } = await api.get("/roles");
      setRoles(Array.isArray(data) ? data : data.data || []);
    } catch (err) {
      console.error("Error al cargar roles:", err);
      setError("No se pudieron cargar los roles.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchRoles();
  }, []);

  // Crear nuevo rol
  const handleCreate = () => {
    navigate("/roles/nuevo");
  };

  // Editar rol
  const handleEdit = (id) => {
    navigate(`/roles/${id}/editar`);
  };

  // Eliminar (soft delete)
  const handleDelete = async (id) => {
    if (!window.confirm("¿Estás seguro de eliminar este rol?")) return;

    try {
      await api.delete(`/roles/${id}`);
      fetchRoles();
    } catch (err) {
      console.error("Error al eliminar rol:", err);
      alert("No se pudo eliminar el rol.");
    }
  };

  // Restaurar
  const handleRestore = async (id) => {
    if (!window.confirm("¿Estás seguro de restaurar este rol?")) return;

    try {
      await api.patch(`/roles/${id}/restore`);
      fetchRoles();
    } catch (err) {
      console.error("Error al restaurar rol:", err);
      alert("No se pudo restaurar el rol.");
    }
  };

  // Activar
  const handleActivate = async (id) => {
    if (!window.confirm("¿Estás seguro de activar este rol?")) return;

    try {
      await api.patch(`/roles/${id}/activate`);
      fetchRoles();
    } catch (err) {
      console.error("Error al activar rol:", err);
      alert("No se pudo activar el rol.");
    }
  };

  // Desactivar
  const handleDeactivate = async (id) => {
    if (!window.confirm("¿Estás seguro de desactivar este rol?")) return;

    try {
      await api.patch(`/roles/${id}/deactivate`);
      fetchRoles();
    } catch (err) {
      console.error("Error al desactivar rol:", err);
      alert("No se pudo desactivar el rol.");
    }
  };

  // Definir columnas para la tabla personalizada
  const columns = useMemo(() => [
    {
      header: 'Nombre',
      accessorKey: 'name',
      cell: ({ row }) => (
        <div className="flex items-center">
          <Shield className="h-5 w-5 text-gray-400 mr-2" />
          <span className="text-sm font-medium text-gray-900">
            {row.original.name}
          </span>
        </div>
      ),
    },
    {
      header: 'Descripción',
      accessorKey: 'descripcion',
      cell: ({ row }) => (
        <span className="text-sm text-gray-500">
          {row.original.descripcion || "—"}
        </span>
      ),
    },
    {
      header: 'Estado',
      accessorKey: 'estado',
      cell: ({ row }) => (
        <StatusBadge status={row.original.estado} size="sm" />
      ),
    },
    {
      header: 'Acciones',
      cell: ({ row }) => (
        <div className="flex items-center">
          {row.original.estado ? (
            <>
              <button
                onClick={() => handleEdit(row.original.id)}
                className="text-blue-600 hover:text-blue-900 mr-3 p-1"
                title="Editar"
              >
                <Edit size={16} />
              </button>
              <button
                onClick={() => handleDeactivate(row.original.id)}
                className="text-yellow-600 hover:text-yellow-900 mr-3 p-1"
                title="Desactivar"
              >
                <ToggleLeft size={16} />
              </button>
              <button
                onClick={() => handleDelete(row.original.id)}
                className="text-red-600 hover:text-red-900 p-1"
                title="Eliminar"
              >
                <Trash2 size={16} />
              </button>
            </>
          ) : (
            <>
              <button
                onClick={() => handleActivate(row.original.id)}
                className="text-green-600 hover:text-green-900 mr-3 p-1"
                title="Activar"
              >
                <ToggleRight size={16} />
              </button>
              <button
                onClick={() => handleRestore(row.original.id)}
                className="text-gray-600 hover:text-gray-900 p-1"
                title="Restaurar"
              >
                <RotateCcw size={16} />
              </button>
            </>
          )}
        </div>
      ),
    },
  ], []);

  // Componente para vista móvil - Card
  const RoleCard = ({ role }) => (
    <div className="bg-white rounded-lg shadow border p-4 mb-4">
      <div className="flex items-start justify-between mb-3">
        <div className="flex items-center">
          <Shield className="h-5 w-5 text-gray-400 mr-2" />
          <div>
            <h3 className="font-medium text-gray-900">{role.name}</h3>
            <p className="text-sm text-gray-500">{role.descripcion || "Sin descripción"}</p>
          </div>
        </div>
        <StatusBadge status={role.estado} size="sm" />
      </div>

      <div className="flex justify-end mt-4 space-x-2">
        {role.estado ? (
          <>
            <button
              onClick={() => handleEdit(role.id)}
              className="p-2 text-blue-600 hover:text-blue-900 hover:bg-blue-50 rounded-full transition-colors"
              title="Editar"
            >
              <Edit size={16} />
            </button>
            <button
              onClick={() => handleDeactivate(role.id)}
              className="p-2 text-yellow-600 hover:text-yellow-900 hover:bg-yellow-50 rounded-full transition-colors"
              title="Desactivar"
            >
              <ToggleLeft size={16} />
            </button>
            <button
              onClick={() => handleDelete(role.id)}
              className="p-2 text-red-600 hover:text-red-900 hover:bg-red-50 rounded-full transition-colors"
              title="Eliminar"
            >
              <Trash2 size={16} />
            </button>
          </>
        ) : (
          <>
            <button
              onClick={() => handleActivate(role.id)}
              className="p-2 text-green-600 hover:text-green-900 hover:bg-green-50 rounded-full transition-colors"
              title="Activar"
            >
              <ToggleRight size={16} />
            </button>
            <button
              onClick={() => handleRestore(role.id)}
              className="p-2 text-gray-600 hover:text-gray-900 hover:bg-gray-50 rounded-full transition-colors"
              title="Restaurar"
            >
              <RotateCcw size={16} />
            </button>
          </>
        )}
      </div>
    </div>
  );

  return (
    <div className="w-full">
      <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center mb-6 gap-4">
        <h2 className="text-xl font-medium">Gestión de Roles</h2>
        <Button
          onClick={handleCreate}
          className="flex items-center gap-2 bg-[#24412f] text-white hover:bg-[#1b2a1f] transition-colors w-full sm:w-auto justify-center"
        >
          <Plus size={18} />
          Nuevo Rol
        </Button>
      </div>

      {error && (
        <div className="bg-red-100 text-red-700 p-3 rounded mb-4">{error}</div>
      )}

      {loading ? (
        <div className="text-center py-10">Cargando roles...</div>
      ) : (
        <>
          {/* Vista móvil - Cards */}
          <div className="md:hidden">
            {roles.length === 0 ? (
              <div className="text-center py-10 text-gray-500">
                No hay roles disponibles.
              </div>
            ) : (
              <div className="space-y-4">
                {roles.map((role) => (
                  <RoleCard key={role.id} role={role} />
                ))}
              </div>
            )}
          </div>

          {/* Vista escritorio - Tabla personalizada con CustomTable */}
          <div className="hidden md:block">
            <CustomTable 
              data={roles} 
              columns={columns} 
              searchable={true}
            />
          </div>
        </>
      )}
    </div>
  );
}