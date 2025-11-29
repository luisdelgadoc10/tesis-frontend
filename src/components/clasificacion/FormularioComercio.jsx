import FormularioBase from "./FormularioBase";

export default function FormularioComercio({ datos, onChange }) {
  const pasos = [
    {
      titulo: "Características de la Infraestructura",
      campos: [
        {
          nombre: 'numero_pisos_edificacion',
          label: 'Cantidad de pisos que tiene el edificio',
          tipo: 'select',
          opciones: [
            { value: '1', label: '1 piso' },
            { value: '2', label: '2 pisos' },
            { value: '3', label: '3 pisos' },
            { value: '4', label: '4 pisos' },
            { value: '5-10', label: 'Entre 5 y 10 pisos' },
            { value: '>10', label: 'Más de 10 pisos' }
          ],
          requerido: true
        },
        {
          nombre: 'area_techada_total_m2',
          label: 'Área techada total del establecimiento (m²)',
          tipo: 'select',
          opciones: [
            { value: '<300', label: 'Menos de 300 m²' },
            { value: '300-750', label: 'Entre 300 y 750 m²' },
            { value: '751-1500', label: 'Entre 751 y 1,500 m²' },
            { value: '1501-3000', label: 'Entre 1,501 y 3,000 m²' },
            { value: '>3000', label: 'Más de 3,000 m²' }
          ],
          requerido: true
        }
      ]
    },
    {
      titulo: "Área de Venta y Tipo de Negocio",
      campos: [
        {
          nombre: 'area_venta_m2',
          label: 'Área destinada a la venta o atención al público (m²)',
          tipo: 'select',
          opciones: [
            { value: '<200', label: 'Menos de 200 m²' },
            { value: '200-500', label: 'Entre 200 y 500 m²' },
            { value: '501-1000', label: 'Entre 501 y 1,000 m²' },
            { value: '1001-2000', label: 'Entre 1,001 y 2,000 m²' },
            { value: '>2000', label: 'Más de 2,000 m²' }
          ],
          requerido: true
        },
        {
          nombre: 'tipo_establecimiento_comercial',
          label: 'Tipo de negocio o establecimiento',
          tipo: 'select',
          opciones: [
            { value: 'tienda_individual', label: 'Tienda independiente' },
            { value: 'kiosco', label: 'Kiosco o puesto pequeño' },
            { value: 'modulo_centro_comercial', label: 'Módulo dentro de un centro comercial' },
            { value: 'tienda_departamental', label: 'Tienda por departamentos' },
            { value: 'supermercado', label: 'Supermercado' },
            { value: 'hipermercado', label: 'Hipermercado' },
            { value: 'mercado_abastos', label: 'Mercado de abastos' },
            { value: 'galeria_comercial', label: 'Galería comercial' },
            { value: 'centro_comercial', label: 'Centro comercial' }
          ],
          requerido: true
        }
      ]
    },
    {
      titulo: "Operación y Uso del Local",
      campos: [
        {
          nombre: 'modalidad_operacion',
          label: '¿Cómo opera su negocio?',
          tipo: 'select',
          opciones: [
            { value: 'independiente', label: 'De forma independiente' },
            { value: 'franquicia', label: 'Como franquicia' },
            { value: 'cadena', label: 'Como parte de una cadena' },
            { value: 'cooperativa', label: 'A través de una cooperativa' },
            { value: 'asociacion', label: 'Bajo una asociación' }
          ],
          requerido: true
        },
        {
          nombre: 'uso_edificacion',
          label: 'Uso principal del edificio donde opera',
          tipo: 'select',
          opciones: [
            { value: 'comercial_exclusivo', label: 'Solo uso comercial' },
            { value: 'uso_mixto', label: 'Comercial y residencial' },
            { value: 'uso_mixto_oficinas', label: 'Comercial y oficinas' },
            { value: 'uso_mixto_industrial', label: 'Comercial e industrial' }
          ],
          requerido: true
        }
      ]
    },
    {
      titulo: "Licencias y Permisos",
      campos: [
        {
          nombre: 'tipo_licencia_funcionamiento',
          label: 'Tipo de licencia de funcionamiento con la que cuenta',
          tipo: 'select',
          opciones: [
            { value: 'individual', label: 'Licencia individual' },
            { value: 'corporativa', label: 'Licencia corporativa' },
            { value: 'municipal', label: 'Licencia municipal' },
            { value: 'sectorial', label: 'Licencia sectorial' },
            { value: 'especial', label: 'Licencia especial' }
          ],
          requerido: true
        },
        {
          nombre: 'edificio_tiene_licencia_corporativa',
          label: '¿El edificio cuenta con una licencia corporativa general?',
          tipo: 'select',
          opciones: [
            { value: 'si', label: 'Sí, cuenta con licencia corporativa' },
            { value: 'no', label: 'No, no tiene licencia corporativa' },
            { value: 'no_aplica', label: 'No aplica' }
          ],
          requerido: true
        }
      ]
    },
    {
      titulo: "Productos y Sustancias Peligrosas",
      campos: [
        {
          nombre: 'comercializa_productos_explosivos_pirotecnicos',
          label: '¿Su negocio vende productos explosivos o pirotécnicos?',
          tipo: 'checkbox',
          requerido: false
        },
        {
          nombre: 'tipo_productos_peligrosos',
          label: 'Tipo de productos peligrosos que comercializa o almacena',
          tipo: 'select',
          opciones: [
            { value: 'ninguno', label: 'Ninguno' },
            { value: 'explosivos', label: 'Explosivos' },
            { value: 'pirotecnicos', label: 'Pirotécnicos' },
            { value: 'quimicos', label: 'Sustancias químicas' },
            { value: 'combustibles', label: 'Combustibles (gasolina, diésel, etc.)' },
            { value: 'gas_licuado', label: 'Gas licuado' },
            { value: 'otros', label: 'Otros productos peligrosos' }
          ],
          requerido: true
        }
      ]
    },
    {
      titulo: "Formato y Cantidad de Locales",
      campos: [
        {
          nombre: 'formato_comercial',
          label: 'Formato o tipo de comercio',
          tipo: 'select',
          opciones: [
            { value: 'tienda_pequena', label: 'Tienda pequeña (bodega, minimarket, etc.)' },
            { value: 'tienda_mediana', label: 'Tienda mediana o especializada' },
            { value: 'tienda_grande', label: 'Tienda grande o autoservicio' },
            { value: 'supermercado', label: 'Supermercado' },
            { value: 'hipermercado', label: 'Hipermercado' },
            { value: 'centro_comercial', label: 'Centro comercial' },
            { value: 'mercado_tradicional', label: 'Mercado tradicional' },
            { value: 'galeria_comercial', label: 'Galería comercial' },
            { value: 'outlet', label: 'Outlet' },
            { value: 'tienda_especializada', label: 'Tienda especializada por rubro' }
          ],
          requerido: true
        },
        {
          nombre: 'numero_locales_comerciales_edificio',
          label: 'Cantidad total de locales comerciales en el edificio',
          tipo: 'select',
          opciones: [
            { value: '1', label: '1 local' },
            { value: '2-5', label: 'De 2 a 5 locales' },
            { value: '6-10', label: 'De 6 a 10 locales' },
            { value: '11-20', label: 'De 11 a 20 locales' },
            { value: '>20', label: 'Más de 20 locales' }
          ],
          requerido: true
        }
      ]
    }
  ];

  return <FormularioBase pasos={pasos} datos={datos} onChange={onChange} />;
}
