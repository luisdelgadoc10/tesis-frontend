import FormularioBase from "./FormularioBase";

export default function FormularioIndustrial({ datos, onChange }) {
  const pasos = [
    // 1️⃣ Proceso y Maquinaria
    {
      titulo: "Proceso y Maquinaria",
      descripcion: "Indica el tipo de proceso productivo que se realiza y la maquinaria principal utilizada en la producción.",
      campos: [
        {
          nombre: "tipo_proceso_productivo",
          label: "Tipo de Proceso Productivo",
          tipo: "select",
          opciones: [
            { value: "manual_artesanal", label: "Manual / Artesanal" },
            { value: "mecanizado", label: "Mecanizado" },
            { value: "automatizado", label: "Automatizado" },
            { value: "semiautomatizado", label: "Semiautomatizado" },
            { value: "ensamblaje", label: "Ensamblaje" },
            { value: "transformacion", label: "Transformación" },
          ],
          requerido: true,
        },
        {
          nombre: "tipo_maquinaria_principal",
          label: "Tipo de Maquinaria Principal",
          tipo: "select",
          opciones: [
            { value: "herramientas_manuales", label: "Herramientas Manuales" },
            { value: "maquinaria_liviana", label: "Maquinaria Liviana" },
            { value: "maquinaria_pesada", label: "Maquinaria Pesada" },
            { value: "equipo_electronico", label: "Equipo Electrónico" },
            { value: "robotica", label: "Robótica" },
            { value: "sin_maquinaria", label: "Sin Maquinaria" },
          ],
          requerido: true,
        },
      ],
    },

    // 2️⃣ Producción y Productos
    {
      titulo: "Producción y Productos",
      descripcion: "Selecciona la escala de producción y el tipo de productos fabricados por el establecimiento industrial.",
      campos: [
        {
          nombre: "escala_produccion",
          label: "Escala de Producción",
          tipo: "select",
          opciones: [
            { value: "unitaria_pedido", label: "Unitaria / Por Pedido" },
            { value: "pequena_serie", label: "Pequeña Serie" },
            { value: "produccion_masa", label: "Producción en Masa" },
            { value: "produccion_continua", label: "Producción Continua" },
          ],
          requerido: true,
        },
        {
          nombre: "tipo_producto_fabricado",
          label: "Tipo de Producto Fabricado",
          tipo: "select",
          opciones: [
            { value: "artesania_manualidades", label: "Artesanía / Manualidades" },
            { value: "alimentos_bebidas", label: "Alimentos y Bebidas" },
            { value: "textiles_confeccion", label: "Textiles y Confección" },
            { value: "metalurgia", label: "Metalurgia" },
            { value: "quimicos", label: "Productos Químicos" },
            { value: "madera", label: "Madera y Muebles" },
            { value: "plasticos", label: "Plásticos" },
            { value: "electronicos", label: "Electrónicos" },
            { value: "vehiculos", label: "Vehículos y Partes" },
            { value: "otros", label: "Otros" },
          ],
          requerido: true,
        },
      ],
    },

    // 3️⃣ Materiales y Peligrosidad
    {
      titulo: "Materiales y Peligrosidad",
      descripcion: "Especifica si se utilizan materiales peligrosos o explosivos y el nivel de riesgo asociado a los insumos.",
      campos: [
        {
          nombre: "trabaja_materiales_explosivos",
          label: "¿Trabaja con materiales explosivos?",
          tipo: "checkbox",
          requerido: false,
        },
        {
          nombre: "nivel_peligrosidad_insumos",
          label: "Nivel de Peligrosidad de Insumos",
          tipo: "select",
          opciones: [
            { value: "bajo", label: "Bajo" },
            { value: "medio", label: "Medio" },
            { value: "alto", label: "Alto" },
            { value: "muy_alto", label: "Muy Alto" },
          ],
          requerido: true,
        },
      ],
    },

    // 4️⃣ Infraestructura y Personal
    {
      titulo: "Infraestructura y Personal",
      descripcion: "Detalla el tamaño del área de producción y el número aproximado de trabajadores en el establecimiento.",
      campos: [
        {
          nombre: "area_produccion_m2",
          label: "Área de Producción (m²)",
          tipo: "select",
          opciones: [
            { value: "<50", label: "Menos de 50 m²" },
            { value: "50-200", label: "50 - 200 m²" },
            { value: "201-500", label: "201 - 500 m²" },
            { value: "501-1000", label: "501 - 1,000 m²" },
            { value: ">1000", label: "Más de 1,000 m²" },
          ],
          requerido: true,
        },
        {
          nombre: "numero_trabajadores",
          label: "Número de Trabajadores",
          tipo: "select",
          opciones: [
            { value: "1-5", label: "1 - 5 trabajadores" },
            { value: "6-10", label: "6 - 10 trabajadores" },
            { value: "11-25", label: "11 - 25 trabajadores" },
            { value: "26-50", label: "26 - 50 trabajadores" },
            { value: ">50", label: "Más de 50 trabajadores" },
          ],
          requerido: true,
        },
      ],
    },

    // 5️⃣ Características Adicionales
    {
      titulo: "Características Adicionales",
      descripcion: "Indica si el establecimiento cuenta con áreas complementarias o pertenece a un tipo industrial específico.",
      campos: [
        {
          nombre: "tiene_area_comercializacion_integrada",
          label: "¿Tiene área de comercialización integrada?",
          tipo: "checkbox",
          requerido: false,
        },
        {
          nombre: "tipo_establecimiento",
          label: "Tipo de Establecimiento",
          tipo: "select",
          opciones: [
            { value: "taller_artesanal", label: "Taller Artesanal" },
            { value: "micro_empresa", label: "Microempresa Industrial" },
            { value: "pequena_industria", label: "Pequeña Industria" },
            { value: "mediana_industria", label: "Mediana Industria" },
            { value: "gran_industria", label: "Gran Industria" },
            { value: "zona_industrial", label: "Zona Industrial" },
            { value: "parque_industrial", label: "Parque Industrial" },
          ],
          requerido: true,
        },
      ],
    },
  ];

  return <FormularioBase pasos={pasos} datos={datos} onChange={onChange} />;
}
