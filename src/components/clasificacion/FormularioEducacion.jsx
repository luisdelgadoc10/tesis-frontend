import FormularioBase from "./FormularioBase";

export default function FormularioEducacion({ datos, onChange }) {
  const pasos = [
    {
      titulo: "Nivel y Tipo de Institución Educativa",
      campos: [
        {
          nombre: 'nivel_educativo',
          label: 'Seleccione el nivel educativo que ofrece la institución',
          tipo: 'select',
          opciones: [
            { value: 'inicial', label: 'Educación Inicial' },
            { value: 'primaria', label: 'Educación Primaria' },
            { value: 'secundaria', label: 'Educación Secundaria' },
            { value: 'superior', label: 'Educación Superior (Universidad, Instituto, etc.)' },
            { value: 'especial', label: 'Educación Especial' },
            { value: 'tecnico', label: 'Educación Técnico Productiva' }
          ],
          requerido: true
        },
        {
          nombre: 'tipo_institucion',
          label: 'Tipo de institución educativa',
          tipo: 'select',
          opciones: [
            { value: 'cebe', label: 'CEBE (Centro de Educación Básica Especial)' },
            { value: 'cee', label: 'CEE (Centro de Educación Especial)' },
            { value: 'ces', label: 'CES (Centro de Educación Superior)' },
            { value: 'colegio_regular', label: 'Colegio Regular' },
            { value: 'colegio_concertado', label: 'Colegio Privado Concertado' },
            { value: 'instituto_superior', label: 'Instituto Superior Tecnológico o Pedagógico' },
            { value: 'universidad', label: 'Universidad' },
            { value: 'centro_tecnologico', label: 'Centro Tecnológico Productivo' }
          ],
          requerido: true
        }
      ]
    },
    {
      titulo: "Infraestructura y Espacios del Local",
      campos: [
        {
          nombre: 'numero_pisos',
          label: 'Cantidad de pisos o niveles del edificio',
          tipo: 'select',
          opciones: [
            { value: '1', label: '1 piso' },
            { value: '2', label: '2 pisos' },
            { value: '3', label: '3 pisos' },
            { value: '4', label: '4 pisos' },
            { value: '5', label: '5 pisos' },
            { value: '6-10', label: 'Entre 6 y 10 pisos' },
            { value: '>10', label: 'Más de 10 pisos' }
          ],
          requerido: true
        },
        {
          nombre: 'area_construida_m2',
          label: 'Área total construida del local (en m²)',
          tipo: 'select',
          opciones: [
            { value: '<500', label: 'Menos de 500 m²' },
            { value: '500-1500', label: 'Entre 500 y 1,500 m²' },
            { value: '1501-3000', label: 'Entre 1,501 y 3,000 m²' },
            { value: '3001-6000', label: 'Entre 3,001 y 6,000 m²' },
            { value: '>6000', label: 'Más de 6,000 m²' }
          ],
          requerido: true
        }
      ]
    },
    {
      titulo: "Capacidad y Atención a Estudiantes",
      campos: [
        {
          nombre: 'capacidad_alumnos',
          label: 'Capacidad aproximada de alumnos que puede atender la institución',
          tipo: 'select',
          opciones: [
            { value: '<100', label: 'Menos de 100 alumnos' },
            { value: '100-300', label: 'Entre 100 y 300 alumnos' },
            { value: '301-600', label: 'Entre 301 y 600 alumnos' },
            { value: '>600', label: 'Más de 600 alumnos' }
          ],
          requerido: true
        },
        {
          nombre: 'atiende_personas_discapacidad',
          label: '¿El centro educativo brinda atención a personas con discapacidad?',
          tipo: 'checkbox',
          requerido: false
        }
      ]
    },
    {
      titulo: "Aulas y Condiciones del Edificio",
      campos: [
        {
          nombre: 'cantidad_aulas',
          label: 'Número total de aulas disponibles',
          tipo: 'number',
          min: 1,
          requerido: true
        },
        {
          nombre: 'tipo_edificacion',
          label: 'Condición o tipo de la edificación',
          tipo: 'select',
          opciones: [
            { value: 'construida_educativa', label: 'Construida originalmente para uso educativo' },
            { value: 'remodelada_educacion', label: 'Remodelada o adaptada para uso educativo' }
          ],
          requerido: true
        }
      ]
    }
  ];

  return <FormularioBase pasos={pasos} datos={datos} onChange={onChange} />;
}
