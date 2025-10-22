import FormularioBase from "./FormularioBase";

export default function FormularioEncuentro({ datos, onChange }) {
  const pasos = [
    {
      titulo: "Tipo y Capacidad del Evento",
      campos: [
        {
          nombre: 'tipo_actividad',
          label: 'Tipo de Actividad',
          tipo: 'select',
          opciones: [
            { value: 'salon_eventos', label: 'Salón de Eventos' },
            { value: 'discoteca', label: 'Discoteca' },
            { value: 'casino', label: 'Casino' },
            { value: 'teatro', label: 'Teatro' },
            { value: 'cine', label: 'Cine' },
            { value: 'concierto', label: 'Sala de Conciertos' },
            { value: 'convenciones', label: 'Centro de Convenciones' },
            { value: 'deportivo', label: 'Evento Deportivo' },
            { value: 'religioso', label: 'Evento Religioso' },
            { value: 'feria', label: 'Feria/Exposición' }
          ],
          requerido: true
        },
        {
          nombre: 'carga_ocupantes',
          label: 'Carga de Ocupantes',
          tipo: 'number',
          min: 1,
          requerido: true
        }
      ]
    },
    {
      titulo: "Ubicación e Infraestructura",
      campos: [
        {
          nombre: 'ubicado_en_sotano',
          label: '¿El evento se realiza en sótano?',
          tipo: 'checkbox',
          requerido: false
        },
        {
          nombre: 'num_pisos',
          label: 'Número de Pisos',
          tipo: 'number',
          min: 1,
          requerido: true
        }
      ]
    },
    {
      titulo: "Área y Características",
      campos: [
        {
          nombre: 'area_total_m2',
          label: 'Área Total (m²)',
          tipo: 'number',
          min: 0,
          step: 0.1,
          requerido: true
        },
        {
          nombre: 'evento_recurrente',
          label: '¿Es un evento recurrente?',
          tipo: 'checkbox',
          requerido: false
        }
      ]
    },
    {
      titulo: "Horario de Funcionamiento",
      campos: [
        {
          nombre: 'horario_funcionamiento',
          label: 'Horario de Funcionamiento',
          tipo: 'select',
          opciones: [
            { value: 'diurno', label: 'Diurno' },
            { value: 'nocturno', label: 'Nocturno' },
            { value: 'mixto', label: 'Mixto' }
          ],
          requerido: true
        }
      ]
    }
  ];

  return <FormularioBase pasos={pasos} datos={datos} onChange={onChange} />;
}