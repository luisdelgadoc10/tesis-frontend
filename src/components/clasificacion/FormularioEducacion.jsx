import FormularioBase from "./FormularioBase";

export default function FormularioEducacion({ datos, onChange }) {
  const pasos = [
    {
      titulo: "Nivel y Tipo de Institución",
      campos: [
        {
          nombre: 'nivel_educativo',
          label: 'Nivel Educativo',
          tipo: 'select',
          opciones: [
            { value: 'inicial', label: 'Inicial' },
            { value: 'primaria', label: 'Primaria' },
            { value: 'secundaria', label: 'Secundaria' },
            { value: 'superior', label: 'Superior' },
            { value: 'especial', label: 'Educación Especial' },
            { value: 'tecnico', label: 'Técnico Productivo' }
          ],
          requerido: true
        },
        {
          nombre: 'tipo_institucion',
          label: 'Tipo de Institución',
          tipo: 'select',
          opciones: [
            { value: 'cebe', label: 'CEBE' },
            { value: 'cee', label: 'CEE' },
            { value: 'ces', label: 'CES' },
            { value: 'colegio_regular', label: 'Colegio Regular' },
            { value: 'colegio_concertado', label: 'Colegio Concertado' },
            { value: 'instituto_superior', label: 'Instituto Superior' },
            { value: 'universidad', label: 'Universidad' },
            { value: 'centro_tecnologico', label: 'Centro Tecnológico' }
          ],
          requerido: true
        }
      ]
    },
    {
      titulo: "Infraestructura Física",
      campos: [
        {
          nombre: 'numero_pisos',
          label: 'Número de Pisos',
          tipo: 'select',
          opciones: [
            { value: '1', label: '1 piso' },
            { value: '2', label: '2 pisos' },
            { value: '3', label: '3 pisos' },
            { value: '4', label: '4 pisos' },
            { value: '5', label: '5 pisos' },
            { value: '6-10', label: '6 a 10 pisos' },
            { value: '>10', label: 'Más de 10 pisos' }
          ],
          requerido: true
        },
        {
          nombre: 'area_construida_m2',
          label: 'Área Construida (m²)',
          tipo: 'select',
          opciones: [
            { value: '<500', label: 'Menos de 500 m²' },
            { value: '500-1500', label: '500 - 1,500 m²' },
            { value: '1501-3000', label: '1,501 - 3,000 m²' },
            { value: '3001-6000', label: '3,001 - 6,000 m²' },
            { value: '>6000', label: 'Más de 6,000 m²' }
          ],
          requerido: true
        }
      ]
    },
    {
      titulo: "Capacidad y Atención",
      campos: [
        {
          nombre: 'capacidad_alumnos',
          label: 'Capacidad de Alumnos',
          tipo: 'select',
          opciones: [
            { value: '<100', label: 'Menos de 100 alumnos' },
            { value: '100-300', label: '100 - 300 alumnos' },
            { value: '301-600', label: '301 - 600 alumnos' },
            { value: '>600', label: 'Más de 600 alumnos' }
          ],
          requerido: true
        },
        {
          nombre: 'atiende_personas_discapacidad',
          label: '¿Atiende personas con discapacidad?',
          tipo: 'checkbox',
          requerido: false
        }
      ]
    },
    {
      titulo: "Aulas y Edificación",
      campos: [
        {
          nombre: 'cantidad_aulas',
          label: 'Cantidad de Aulas',
          tipo: 'number',
          min: 1,
          requerido: true
        },
        {
          nombre: 'tipo_edificacion',
          label: 'Tipo de Edificación',
          tipo: 'select',
          opciones: [
            { value: 'construida_educativa', label: 'Construida como Educativa' },
            { value: 'remodelada_educacion', label: 'Remodelada/Acondicionada para Educación' }
          ],
          requerido: true
        }
      ]
    }
  ];

  return <FormularioBase pasos={pasos} datos={datos} onChange={onChange} />;
}