

import Select from "react-select";
import { customSelectStyles } from "./selectStyles";

export default function MultiSelectField({ campo, valor, onChange }) {
  const opciones = campo.opciones.map((op) => ({
    value: op.value,
    label: op.label,
  }));

  const selectedOptions = opciones.filter((op) => valor.includes(op.value));

  return (
    <Select
      value={selectedOptions}
      onChange={(opts) => {
        const valores = opts ? opts.map((opt) => opt.value) : [];
        onChange(campo.nombre, valores);
      }}
      options={opciones}
      placeholder="Seleccione opciones..."
      isMulti
      isSearchable
      styles={customSelectStyles}
      menuPortalTarget={document.body}
    />
  );
}