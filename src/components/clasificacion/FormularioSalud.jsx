import FormularioBase from "./FormularioBase";

export default function FormularioSalud({ datos, onChange }) {
  const pasos = [
    {
      titulo: "Nivel y Tipo de Establecimiento",
      campos: [
        {
          nombre: "nivel_atencion",
          label: "Nivel de Atención",
          tipo: "select",
          opciones: [
            { value: "primario", label: "Primario" },
            { value: "secundario", label: "Secundario" },
            { value: "terciario", label: "Terciario" },
          ],
          requerido: true,
        },
        {
          nombre: "tipo_establecimiento",
          label: "Tipo de Establecimiento",
          tipo: "select",
          opciones: [
            { value: "hospital", label: "Hospital" },
            { value: "clinica", label: "Clínica" },
            { value: "centro_salud", label: "Centro de Salud" },
            { value: "consultorio", label: "Consultorio" },
          ],
          requerido: true,
        },
      ],
    },
    {
      titulo: "Capacidad e Infraestructura",
      campos: [
        {
          nombre: "camas_internamiento",
          label: "Camas de Internamiento",
          tipo: "number",
          min: 0,
          requerido: true,
        },
        {
          nombre: "capacidad_atencion",
          label: "Capacidad de Atención Diaria",
          tipo: "number",
          min: 0,
          requerido: true,
        },
      ],
    },
    {
      titulo: "Características del Establecimiento",
      campos: [
        {
          nombre: "usuarios_no_autosuficientes",
          label: "¿Atiende usuarios no autosuficientes?",
          tipo: "checkbox",
          requerido: false,
        },
        {
          nombre: "urgencias_24h",
          label: "¿Tiene servicio de urgencias 24h?",
          tipo: "checkbox",
          requerido: false,
        },
      ],
    },
    {
      titulo: "Servicios y Especialidades",
      campos: [
        {
          nombre: "num_especialidades",
          label: "Número de Especialidades",
          tipo: "number",
          min: 0,
          requerido: true,
        },
        {
          nombre: "servicios_disponibles",
          label: "Servicios Disponibles",
          tipo: "multiselect",
          opciones: [
            { value: "laboratorio", label: "Laboratorio" },
            { value: "rayos_x", label: "Rayos X" },
            { value: "tomografia", label: "Tomografía" },
            { value: "resonancia", label: "Resonancia Magnética" },
            { value: "hemodialisis", label: "Hemodiálisis" },
            { value: "cirugia", label: "Cirugía" },
            { value: "maternidad", label: "Maternidad" },
            { value: "uci", label: "Unidad de Cuidados Intensivos" },
          ],
          requerido: false,
        },
      ],
    },
    {
      titulo: "Infraestructura Física",
      campos: [
        {
          nombre: "num_pisos",
          label: "Número de Pisos",
          tipo: "number",
          min: 1,
          requerido: true,
        },
        {
          nombre: "area_construida",
          label: "Área Construida (m²)",
          tipo: "number",
          min: 0,
          step: 0.1,
          requerido: true,
        },
      ],
    },
    {
      titulo: "Personal Médico",
      campos: [
        {
          nombre: "personal_medico_total",
          label: "Personal Médico Total",
          tipo: "number",
          min: 0,
          requerido: true,
        },
      ],
    },
  ];

  return <FormularioBase pasos={pasos} datos={datos} onChange={onChange} />;
}