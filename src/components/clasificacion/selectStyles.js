

export const customSelectStyles = {
  control: (provided, state) => ({
    ...provided,
    borderColor: state.isFocused ? "#24412f" : "#d1d5db",
    boxShadow: state.isFocused ? "0 0 0 3px rgba(36, 65, 47, 0.1)" : "none",
    "&:hover": { borderColor: "#24412f" },
    minHeight: "42px",
    borderRadius: "0.375rem",
    fontSize: "0.875rem",
  }),
  option: (provided, state) => ({
    ...provided,
    backgroundColor: state.isSelected
      ? "#24412f"
      : state.isFocused
      ? "#f3f4f6"
      : "white",
    color: state.isSelected ? "white" : "#374151",
    padding: "8px 12px",
  }),
  singleValue: (provided) => ({ ...provided, color: "#374151" }),
  placeholder: (provided) => ({ ...provided, color: "#9ca3af" }),
  menuPortal: (provided) => ({ ...provided, zIndex: 9999 }),
  multiValue: (provided) => ({
    ...provided,
    backgroundColor: "#e5e7eb",
    borderRadius: "0.25rem",
  }),
  multiValueLabel: (provided) => ({
    ...provided,
    color: "#374151",
    fontSize: "0.875rem",
  }),
  multiValueRemove: (provided) => ({
    ...provided,
    color: "#6b7280",
    "&:hover": {
      backgroundColor: "#d1d5db",
      color: "#374151",
    },
  }),
};