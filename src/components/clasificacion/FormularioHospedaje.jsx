import FormularioBase from "./FormularioBase";

export default function FormularioHospedaje({ datos, onChange }) {
  const pasos = [
    // 1️⃣ Categoría y Tipo de Hospedaje
    {
      titulo: "Categoría y Tipo de Hospedaje",
      descripcion: "Selecciona la categoría por estrellas y el tipo de establecimiento de hospedaje correspondiente.",
      campos: [
        {
          nombre: "categoria_estrellas",
          label: "Categoría (Estrellas)",
          tipo: "select",
          opciones: [
            { value: "0", label: "Sin categoría" },
            { value: "1", label: "1 Estrella" },
            { value: "2", label: "2 Estrellas" },
            { value: "3", label: "3 Estrellas" },
            { value: "4", label: "4 Estrellas" },
            { value: "5", label: "5 Estrellas" },
          ],
          requerido: true,
        },
        {
          nombre: "tipo_hospedaje",
          label: "Tipo de Hospedaje",
          tipo: "select",
          opciones: [
            { value: "hotel", label: "Hotel" },
            { value: "hostal", label: "Hostal" },
            { value: "albergue", label: "Albergue" },
            { value: "ecolodge", label: "Ecolodge" },
            { value: "residencial", label: "Residencial" },
            { value: "apartamento", label: "Apartamento Turístico" },
          ],
          requerido: true,
        },
      ],
    },

    // 2️⃣ Infraestructura del Establecimiento
    {
      titulo: "Infraestructura del Establecimiento",
      descripcion: "Registra las características físicas principales del edificio donde opera el hospedaje.",
      campos: [
        {
          nombre: "num_pisos",
          label: "Número de Pisos",
          tipo: "number",
          min: 1,
          requerido: true,
          placeholder: "Ejemplo: 3",
        },
        {
          nombre: "tiene_sotano",
          label: "¿Tiene sótano?",
          tipo: "checkbox",
          requerido: false,
        },
      ],
    },

    // 3️⃣ Capacidad y Ocupación
    {
      titulo: "Capacidad y Ocupación",
      descripcion: "Indica la cantidad total de habitaciones disponibles y la capacidad máxima de huéspedes.",
      campos: [
        {
          nombre: "num_habitaciones",
          label: "Número de Habitaciones",
          tipo: "number",
          min: 1,
          requerido: true,
          placeholder: "Ejemplo: 45",
        },
        {
          nombre: "capacidad_ocupantes",
          label: "Capacidad de Ocupantes",
          tipo: "number",
          min: 1,
          requerido: true,
          placeholder: "Ejemplo: 120 personas",
        },
      ],
    },

    // 4️⃣ Características Adicionales
    {
      titulo: "Características Adicionales",
      descripcion: "Marca las opciones adicionales según las condiciones y usos del establecimiento.",
      campos: [
        {
          nombre: "uso_mixto",
          label: "¿El establecimiento tiene uso mixto?",
          tipo: "checkbox",
          requerido: false,
        },
        {
          nombre: "tiene_estacionamiento",
          label: "¿Tiene estacionamiento?",
          tipo: "checkbox",
          requerido: false,
        },
      ],
    },

    // 5️⃣ Estacionamiento en Sótano
    {
      titulo: "Estacionamiento en Sótano",
      descripcion: "Indica si el estacionamiento se encuentra ubicado en un nivel de sótano.",
      campos: [
        {
          nombre: "estacionamiento_en_sotano",
          label: "¿El estacionamiento está en sótano?",
          tipo: "checkbox",
          requerido: false,
        },
      ],
    },
  ];

  return <FormularioBase pasos={pasos} datos={datos} onChange={onChange} />;
}
