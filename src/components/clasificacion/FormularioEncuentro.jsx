import FormularioBase from "./FormularioBase";

export default function FormularioEncuentro({ datos, onChange }) {
  const pasos = [
    // 1️⃣ Tipo y Capacidad del Evento
    {
      titulo: "Tipo y Capacidad del Evento",
      descripcion: "Selecciona el tipo de actividad y la capacidad máxima de asistentes permitida según el aforo.",
      campos: [
        {
          nombre: "tipo_actividad",
          label: "Tipo de Actividad",
          tipo: "select",
          opciones: [
            { value: "salon_eventos", label: "Salón de Eventos" },
            { value: "discoteca", label: "Discoteca" },
            { value: "casino", label: "Casino" },
            { value: "teatro", label: "Teatro" },
            { value: "cine", label: "Cine" },
            { value: "concierto", label: "Sala de Conciertos" },
            { value: "convenciones", label: "Centro de Convenciones" },
            { value: "deportivo", label: "Evento Deportivo" },
            { value: "religioso", label: "Evento Religioso" },
            { value: "feria", label: "Feria o Exposición" },
          ],
          requerido: true,
        },
        {
          nombre: "carga_ocupantes",
          label: "Carga de Ocupantes",
          tipo: "number",
          min: 1,
          requerido: true,
          placeholder: "Ejemplo: 250 personas",
        },
      ],
    },

    // 2️⃣ Ubicación e Infraestructura
    {
      titulo: "Ubicación e Infraestructura",
      descripcion: "Indica las características físicas del lugar donde se desarrollará el evento.",
      campos: [
        {
          nombre: "ubicado_en_sotano",
          label: "¿El evento se realiza en sótano?",
          tipo: "checkbox",
          requerido: false,
        },
        {
          nombre: "num_pisos",
          label: "Número de Pisos",
          tipo: "number",
          min: 1,
          requerido: true,
          placeholder: "Ejemplo: 2",
        },
      ],
    },

    // 3️⃣ Área y Características
    {
      titulo: "Área y Características",
      descripcion: "Registra el área total del evento y si se realiza de manera recurrente.",
      campos: [
        {
          nombre: "area_total_m2",
          label: "Área Total (m²)",
          tipo: "number",
          min: 0,
          step: 0.1,
          requerido: true,
          placeholder: "Ejemplo: 350.5",
        },
        {
          nombre: "evento_recurrente",
          label: "¿Es un evento recurrente?",
          tipo: "checkbox",
          requerido: false,
        },
      ],
    },

    // 4️⃣ Horario de Funcionamiento
    {
      titulo: "Horario de Funcionamiento",
      descripcion: "Selecciona el horario principal en el que se desarrollará el evento.",
      campos: [
        {
          nombre: "horario_funcionamiento",
          label: "Horario de Funcionamiento",
          tipo: "select",
          opciones: [
            { value: "diurno", label: "Diurno" },
            { value: "nocturno", label: "Nocturno" },
            { value: "mixto", label: "Mixto" },
          ],
          requerido: true,
        },
      ],
    },
  ];

  return <FormularioBase pasos={pasos} datos={datos} onChange={onChange} />;
}
