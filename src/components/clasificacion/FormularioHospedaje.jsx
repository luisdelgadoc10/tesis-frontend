import FormularioBase from "./FormularioBase";

export default function FormularioHospedaje({ datos, onChange }) {
  const pasos = [
    {
      titulo: "Categoría y Tipo de Hospedaje",
      campos: [
        {
          nombre: 'categoria_estrellas',
          label: 'Categoría (Estrellas)',
          tipo: 'select',
          opciones: [
            { value: '0', label: 'Sin categoría' },
            { value: '1', label: '1 Estrella' },
            { value: '2', label: '2 Estrellas' },
            { value: '3', label: '3 Estrellas' },
            { value: '4', label: '4 Estrellas' },
            { value: '5', label: '5 Estrellas' }
          ],
          requerido: true
        },
        {
          nombre: 'tipo_hospedaje',
          label: 'Tipo de Hospedaje',
          tipo: 'select',
          opciones: [
            { value: 'hotel', label: 'Hotel' },
            { value: 'hostal', label: 'Hostal' },
            { value: 'albergue', label: 'Albergue' },
            { value: 'ecolodge', label: 'Ecolodge' },
            { value: 'residencial', label: 'Residencial' },
            { value: 'apartamento', label: 'Apartamento Turístico' }
          ],
          requerido: true
        }
      ]
    },
    {
      titulo: "Infraestructura del Establecimiento",
      campos: [
        {
          nombre: 'num_pisos',
          label: 'Número de Pisos',
          tipo: 'number',
          min: 1,
          requerido: true
        },
        {
          nombre: 'tiene_sotano',
          label: '¿Tiene sótano?',
          tipo: 'checkbox',
          requerido: false
        }
      ]
    },
    {
      titulo: "Capacidad y Ocupación",
      campos: [
        {
          nombre: 'num_habitaciones',
          label: 'Número de Habitaciones',
          tipo: 'number',
          min: 1,
          requerido: true
        },
        {
          nombre: 'capacidad_ocupantes',
          label: 'Capacidad de Ocupantes',
          tipo: 'number',
          min: 1,
          requerido: true
        }
      ]
    },
    {
      titulo: "Características Adicionales",
      campos: [
        {
          nombre: 'uso_mixto',
          label: '¿El establecimiento tiene uso mixto?',
          tipo: 'checkbox',
          requerido: false
        },
        {
          nombre: 'tiene_estacionamiento',
          label: '¿Tiene estacionamiento?',
          tipo: 'checkbox',
          requerido: false
        }
      ]
    },
    {
      titulo: "Estacionamiento en Sótano",
      campos: [
        {
          nombre: 'estacionamiento_en_sotano',
          label: '¿El estacionamiento está en sótano?',
          tipo: 'checkbox',
          requerido: false
        }
      ]
    }
  ];

  return <FormularioBase pasos={pasos} datos={datos} onChange={onChange} />;
}