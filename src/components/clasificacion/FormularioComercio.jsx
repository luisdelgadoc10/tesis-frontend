import FormularioBase from "./FormularioBase";

export default function FormularioComercio({ datos, onChange }) {
  const pasos = [
    {
      titulo: "Infraestructura del Edificio",
      campos: [
        {
          nombre: 'numero_pisos_edificacion',
          label: 'Número de Pisos del Edificio',
          tipo: 'select',
          opciones: [
            { value: '1', label: '1 piso' },
            { value: '2', label: '2 pisos' },
            { value: '3', label: '3 pisos' },
            { value: '4', label: '4 pisos' },
            { value: '5-10', label: '5 - 10 pisos' },
            { value: '>10', label: 'Más de 10 pisos' }
          ],
          requerido: true
        },
        {
          nombre: 'area_techada_total_m2',
          label: 'Área Techada Total (m²)',
          tipo: 'select',
          opciones: [
            { value: '<300', label: 'Menos de 300 m²' },
            { value: '300-750', label: '300 - 750 m²' },
            { value: '751-1500', label: '751 - 1,500 m²' },
            { value: '1501-3000', label: '1,501 - 3,000 m²' },
            { value: '>3000', label: 'Más de 3,000 m²' }
          ],
          requerido: true
        }
      ]
    },
    {
      titulo: "Área de Venta y Tipo de Establecimiento",
      campos: [
        {
          nombre: 'area_venta_m2',
          label: 'Área de Venta (m²)',
          tipo: 'select',
          opciones: [
            { value: '<200', label: 'Menos de 200 m²' },
            { value: '200-500', label: '200 - 500 m²' },
            { value: '501-1000', label: '501 - 1,000 m²' },
            { value: '1001-2000', label: '1,001 - 2,000 m²' },
            { value: '>2000', label: 'Más de 2,000 m²' }
          ],
          requerido: true
        },
        {
          nombre: 'tipo_establecimiento_comercial',
          label: 'Tipo de Establecimiento Comercial',
          tipo: 'select',
          opciones: [
            { value: 'tienda_individual', label: 'Tienda Individual' },
            { value: 'kiosco', label: 'Kiosco' },
            { value: 'modulo_centro_comercial', label: 'Módulo en Centro Comercial' },
            { value: 'tienda_departamental', label: 'Tienda Departamental' },
            { value: 'supermercado', label: 'Supermercado' },
            { value: 'hipermercado', label: 'Hipermercado' },
            { value: 'mercado_abastos', label: 'Mercado de Abastos' },
            { value: 'galeria_comercial', label: 'Galería Comercial' },
            { value: 'centro_comercial', label: 'Centro Comercial' }
          ],
          requerido: true
        }
      ]
    },
    {
      titulo: "Operación y Uso del Edificio",
      campos: [
        {
          nombre: 'modalidad_operacion',
          label: 'Modalidad de Operación',
          tipo: 'select',
          opciones: [
            { value: 'independiente', label: 'Independiente' },
            { value: 'franquicia', label: 'Franquicia' },
            { value: 'cadena', label: 'Cadena' },
            { value: 'cooperativa', label: 'Cooperativa' },
            { value: 'asociacion', label: 'Asociación' }
          ],
          requerido: true
        },
        {
          nombre: 'uso_edificacion',
          label: 'Uso de la Edificación',
          tipo: 'select',
          opciones: [
            { value: 'comercial_exclusivo', label: 'Comercial Exclusivo' },
            { value: 'uso_mixto', label: 'Uso Mixto (Comercial + Residencial)' },
            { value: 'uso_mixto_oficinas', label: 'Uso Mixto (Comercial + Oficinas)' },
            { value: 'uso_mixto_industrial', label: 'Uso Mixto (Comercial + Industrial)' }
          ],
          requerido: true
        }
      ]
    },
    {
      titulo: "Licencias y Autorizaciones",
      campos: [
        {
          nombre: 'tipo_licencia_funcionamiento',
          label: 'Tipo de Licencia de Funcionamiento',
          tipo: 'select',
          opciones: [
            { value: 'individual', label: 'Individual' },
            { value: 'corporativa', label: 'Corporativa' },
            { value: 'municipal', label: 'Municipal' },
            { value: 'sectorial', label: 'Sectorial' },
            { value: 'especial', label: 'Especial' }
          ],
          requerido: true
        },
        {
          nombre: 'edificio_tiene_licencia_corporativa',
          label: 'Edificio con Licencia Corporativa',
          tipo: 'select',
          opciones: [
            { value: 'si', label: 'Sí' },
            { value: 'no', label: 'No' },
            { value: 'no_aplica', label: 'No Aplica' }
          ],
          requerido: true
        }
      ]
    },
    {
      titulo: "Productos Peligrosos",
      campos: [
        {
          nombre: 'comercializa_productos_explosivos_pirotecnicos',
          label: '¿Comercializa productos explosivos o pirotécnicos?',
          tipo: 'checkbox',
          requerido: false
        },
        {
          nombre: 'tipo_productos_peligrosos',
          label: 'Tipo de Productos Peligrosos',
          tipo: 'select',
          opciones: [
            { value: 'ninguno', label: 'Ninguno' },
            { value: 'explosivos', label: 'Explosivos' },
            { value: 'pirotecnicos', label: 'Pirotécnicos' },
            { value: 'quimicos', label: 'Productos Químicos' },
            { value: 'combustibles', label: 'Combustibles' },
            { value: 'gas_licuado', label: 'Gas Licuado' },
            { value: 'otros', label: 'Otros Productos Peligrosos' }
          ],
          requerido: true
        }
      ]
    },
    {
      titulo: "Formato y Locales Comerciales",
      campos: [
        {
          nombre: 'formato_comercial',
          label: 'Formato Comercial',
          tipo: 'select',
          opciones: [
            { value: 'tienda_pequena', label: 'Tienda Pequeña' },
            { value: 'tienda_mediana', label: 'Tienda Mediana' },
            { value: 'tienda_grande', label: 'Tienda Grande' },
            { value: 'supermercado', label: 'Supermercado' },
            { value: 'hipermercado', label: 'Hipermercado' },
            { value: 'centro_comercial', label: 'Centro Comercial' },
            { value: 'mercado_tradicional', label: 'Mercado Tradicional' },
            { value: 'galeria_comercial', label: 'Galería Comercial' },
            { value: 'outlet', label: 'Outlet' },
            { value: 'tienda_especializada', label: 'Tienda Especializada' }
          ],
          requerido: true
        },
        {
          nombre: 'numero_locales_comerciales_edificio',
          label: 'Número de Locales Comerciales en el Edificio',
          tipo: 'select',
          opciones: [
            { value: '1', label: '1 local' },
            { value: '2-5', label: '2 - 5 locales' },
            { value: '6-10', label: '6 - 10 locales' },
            { value: '11-20', label: '11 - 20 locales' },
            { value: '>20', label: 'Más de 20 locales' }
          ],
          requerido: true
        }
      ]
    }
  ];

  return <FormularioBase pasos={pasos} datos={datos} onChange={onChange} />;
}