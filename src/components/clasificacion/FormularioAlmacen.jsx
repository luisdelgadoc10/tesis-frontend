import FormularioBase from "./FormularioBase";

export default function FormularioAlmacen({ datos, onChange }) {
  const pasos = [
    {
      titulo: "Cobertura y Cerramiento",
      campos: [
        {
          nombre: 'tipo_cobertura',
          label: 'Tipo de Cobertura',
          tipo: 'select',
          opciones: [
            { value: 'no_techado', label: 'No Techado' },
            { value: 'parcialmente_techado', label: 'Parcialmente Techado' },
            { value: 'totalmente_techado', label: 'Totalmente Techado' }
          ],
          requerido: true
        },
        {
          nombre: 'porcentaje_area_techada',
          label: 'Porcentaje de Área Techada',
          tipo: 'select',
          opciones: [
            { value: '0%', label: '0%' },
            { value: '1-25%', label: '1% - 25%' },
            { value: '26-50%', label: '26% - 50%' },
            { value: '51-75%', label: '51% - 75%' },
            { value: '76-99%', label: '76% - 99%' },
            { value: '100%', label: '100%' }
          ],
          requerido: true
        }
      ]
    },
    {
      titulo: "Tipo de Cerramiento y Establecimiento",
      campos: [
        {
          nombre: 'tipo_cerramiento',
          label: 'Tipo de Cerramiento',
          tipo: 'select',
          opciones: [
            { value: 'abierto', label: 'Abierto' },
            { value: 'semi_abierto', label: 'Semi-abierto' },
            { value: 'cerrado', label: 'Cerrado' },
            { value: 'techado_abierto', label: 'Techado pero Abierto' }
          ],
          requerido: true
        },
        {
          nombre: 'tipo_establecimiento',
          label: 'Tipo de Establecimiento',
          tipo: 'select',
          opciones: [
            { value: 'almacen_general', label: 'Almacén General' },
            { value: 'deposito', label: 'Depósito' },
            { value: 'centro_distribucion', label: 'Centro de Distribución' },
            { value: 'bodega', label: 'Bodega' },
            { value: 'terminal_carga', label: 'Terminal de Carga' },
            { value: 'plataforma_logistica', label: 'Plataforma Logística' },
            { value: 'estacionamiento_almacenamiento', label: 'Estacionamiento/Almacenamiento' }
          ],
          requerido: true
        }
      ]
    },
    {
      titulo: "Uso y Productos Almacenados",
      campos: [
        {
          nombre: 'uso_principal',
          label: 'Uso Principal',
          tipo: 'select',
          opciones: [
            { value: 'almacenamiento_mercancias', label: 'Almacenamiento de mercancías' },
            { value: 'distribucion', label: 'Distribución' },
            { value: 'logistica', label: 'Logística' },
            { value: 'estacionamiento_vehiculos', label: 'Estacionamiento de vehículos' },
            { value: 'almacenamiento_materiales', label: 'Almacenamiento de materiales' },
            { value: 'otros', label: 'Otros usos' }
          ],
          requerido: true
        },
        {
          nombre: 'almacena_productos_explosivos_pirotecnicos',
          label: '¿Almacena productos explosivos o pirotécnicos?',
          tipo: 'checkbox',
          requerido: false
        }
      ]
    },
    {
      titulo: "Tipo de Productos y Nivel de Peligrosidad",
      campos: [
        {
          nombre: 'tipo_productos_almacenados',
          label: 'Tipo de Productos Almacenados',
          tipo: 'select',
          opciones: [
            { value: 'ninguno_vacio', label: 'Ninguno (vacío/vehículos)' },
            { value: 'productos_generales', label: 'Productos Generales' },
            { value: 'alimentos', label: 'Alimentos' },
            { value: 'textiles', label: 'Textiles' },
            { value: 'electronicos', label: 'Electrónicos' },
            { value: 'quimicos_no_peligrosos', label: 'Químicos No Peligrosos' },
            { value: 'quimicos_peligrosos', label: 'Químicos Peligrosos' },
            { value: 'explosivos', label: 'Explosivos' },
            { value: 'pirotecnicos', label: 'Pirotécnicos' },
            { value: 'combustibles', label: 'Combustibles' },
            { value: 'gas_licuado', label: 'Gas Licuado' },
            { value: 'materiales_construccion', label: 'Materiales de Construcción' },
            { value: 'otros_peligrosos', label: 'Otros Productos Peligrosos' }
          ],
          requerido: true
        },
        {
          nombre: 'nivel_peligrosidad_nfpa',
          label: 'Nivel de Peligrosidad NFPA',
          tipo: 'select',
          opciones: [
            { value: '0_minimo', label: '0 (mínimo)' },
            { value: '1_ligero', label: '1 (ligero)' },
            { value: '2_moderado', label: '2 (moderado)' },
            { value: '3_serio', label: '3 (serio)' },
            { value: '4_severo', label: '4 (severo)' }
          ],
          requerido: true
        }
      ]
    },
    {
      titulo: "Áreas Administrativas",
      campos: [
        {
          nombre: 'tiene_areas_administrativas_techadas',
          label: '¿Tiene áreas administrativas techadas?',
          tipo: 'checkbox',
          requerido: false
        },
        {
          nombre: 'area_administrativa_servicios_m2',
          label: 'Área Administrativa y Servicios (m²)',
          tipo: 'select',
          opciones: [
            { value: '0', label: '0 m² (sin áreas administrativas)' },
            { value: '1-50', label: '1 - 50 m²' },
            { value: '51-100', label: '51 - 100 m²' },
            { value: '101-200', label: '101 - 200 m²' },
            { value: '201-500', label: '201 - 500 m²' },
            { value: '>500', label: 'Más de 500 m²' }
          ],
          requerido: true
        }
      ]
    }
  ];

  return <FormularioBase pasos={pasos} datos={datos} onChange={onChange} />;
}