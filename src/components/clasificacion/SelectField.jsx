

import Select from "react-select";
import { customSelectStyles } from "./selectStyles";

export default function SelectField({ campo, valor, onChange }) {
  const opciones = campo.opciones.map((op) => ({
    value: op.value,
    label: op.label,
  }));

  const selectedOption = opciones.find((op) => op.value === valor) || null;

  return (
    <Select
      value={selectedOption}
      onChange={(opt) => onChange(campo.nombre, opt ? opt.value : "")}
      options={opciones}
      placeholder="Seleccione..."
      isClearable
      isSearchable
      styles={customSelectStyles}
      menuPortalTarget={document.body}
    />
  );
}