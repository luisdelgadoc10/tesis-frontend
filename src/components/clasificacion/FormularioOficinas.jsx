import FormularioBase from "./FormularioBase";

export default function FormularioOficinas({ datos, onChange }) {
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
            { value: '5', label: '5 pisos' },
            { value: '6-10', label: '6 - 10 pisos' },
            { value: '11-20', label: '11 - 20 pisos' },
            { value: '>20', label: 'Más de 20 pisos' }
          ],
          requerido: true
        },
        {
          nombre: 'area_techada_por_piso_m2',
          label: 'Área Techada por Piso (m²)',
          tipo: 'select',
          opciones: [
            { value: '<200', label: 'Menos de 200 m²' },
            { value: '200-400', label: '200 - 400 m²' },
            { value: '401-600', label: '401 - 600 m²' },
            { value: '601-800', label: '601 - 800 m²' },
            { value: '>800', label: 'Más de 800 m²' }
          ],
          requerido: true
        }
      ]
    },
    {
      titulo: "Área Total y Conformidad",
      campos: [
        {
          nombre: 'area_techada_total_m2',
          label: 'Área Techada Total (m²)',
          tipo: 'select',
          opciones: [
            { value: '<500', label: 'Menos de 500 m²' },
            { value: '500-2000', label: '500 - 2,000 m²' },
            { value: '2001-5000', label: '2,001 - 5,000 m²' },
            { value: '5001-10000', label: '5,001 - 10,000 m²' },
            { value: '>10000', label: 'Más de 10,000 m²' }
          ],
          requerido: true
        },
        {
          nombre: 'año_conformidad_obra',
          label: 'Año de Conformidad de Obra',
          tipo: 'number',
          min: 1900,
          max: new Date().getFullYear(),
          requerido: true
        }
      ]
    },
    {
      titulo: "Antigüedad y Vigencia de Conformidad",
      campos: [
        {
          nombre: 'antigüedad_conformidad_años',
          label: 'Antigüedad de Conformidad (años)',
          tipo: 'select',
          opciones: [
            { value: '0-1', label: '0 - 1 año' },
            { value: '2-3', label: '2 - 3 años' },
            { value: '4-5', label: '4 - 5 años' },
            { value: '6-10', label: '6 - 10 años' },
            { value: '>10', label: 'Más de 10 años' }
          ],
          requerido: true
        },
        {
          nombre: 'tiene_conformidad_obra_vigente',
          label: '¿Tiene conformidad de obra vigente?',
          tipo: 'checkbox',
          requerido: false
        }
      ]
    },
    {
      titulo: "Tipo de Conformidad y Ocupación",
      campos: [
        {
          nombre: 'tipo_conformidad',
          label: 'Tipo de Conformidad',
          tipo: 'select',
          opciones: [
            { value: 'obra_nueva', label: 'Obra Nueva' },
            { value: 'remodelacion', label: 'Remodelación' },
            { value: 'ampliacion', label: 'Ampliación' },
            { value: 'cambio_uso', label: 'Cambio de Uso' },
            { value: 'regularizacion', label: 'Regularización' }
          ],
          requerido: true
        },
        {
          nombre: 'tipo_ocupacion_edificio',
          label: 'Tipo de Ocupación del Edificio',
          tipo: 'select',
          opciones: [
            { value: 'uso_exclusivo', label: 'Uso Exclusivo' },
            { value: 'uso_compartido', label: 'Uso Compartido' }
          ],
          requerido: true
        }
      ]
    },
    {
      titulo: "Áreas Comunes y Ubicación",
      campos: [
        {
          nombre: 'areas_comunes_tienen_itse_vigente',
          label: 'Áreas Comunes con ITSE Vigente',
          tipo: 'select',
          opciones: [
            { value: 'si', label: 'Sí' },
            { value: 'no', label: 'No' },
            { value: 'no_aplica', label: 'No Aplica' }
          ],
          requerido: true
        },
        {
          nombre: 'piso_ubicacion_establecimiento',
          label: 'Piso de Ubicación del Establecimiento',
          tipo: 'select',
          opciones: [
            { value: 'pb', label: 'Planta Baja (PB)' },
            { value: 's1', label: 'Sótano 1' },
            { value: 's2', label: 'Sótano 2' },
            { value: '1', label: 'Piso 1' },
            { value: '2', label: 'Piso 2' },
            { value: '3', label: 'Piso 3' },
            { value: '4', label: 'Piso 4' },
            { value: '5', label: 'Piso 5' },
            { value: '6-10', label: 'Pisos 6-10' },
            { value: '>10', label: 'Más de 10 pisos' }
          ],
          requerido: true
        }
      ]
    },
    {
      titulo: "Diseño y Remodelaciones",
      campos: [
        {
          nombre: 'uso_diseño_original',
          label: 'Uso del Diseño Original',
          tipo: 'select',
          opciones: [
            { value: 'oficinas_origen', label: 'Oficinas desde origen' },
            { value: 'adaptado_oficinas', label: 'Adaptado a oficinas' }
          ],
          requerido: true
        },
        {
          nombre: 'ha_tenido_remodelaciones_ampliaciones',
          label: '¿Ha tenido remodelaciones o ampliaciones?',
          tipo: 'checkbox',
          requerido: false
        }
      ]
    }
  ];

  return <FormularioBase pasos={pasos} datos={datos} onChange={onChange} />;
}