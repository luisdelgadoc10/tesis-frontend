import FormularioBase from "./FormularioBase";

/**
 * Formulario para establecimientos del sector "Salud".
 * 
 * Contiene pasos relacionados con:
 * - Nivel y tipo de establecimiento
 * - Capacidad e infraestructura
 * - Características del servicio
 * - Servicios y especialidades médicas
 * - Infraestructura física
 * - Personal médico
 */
export default function FormularioSalud({ datos, onChange }) {
  const pasos = [
    // 🏷️ Paso 1: Nivel y Tipo de Establecimiento
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

    // 🏗️ Paso 2: Capacidad e Infraestructura
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

    // 🩺 Paso 3: Características del Establecimiento
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

    // ⚕️ Paso 4: Servicios y Especialidades
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

    // 🧱 Paso 5: Infraestructura Física
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

    // 👩‍⚕️ Paso 6: Personal Médico
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
