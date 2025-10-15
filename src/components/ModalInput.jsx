// src/components/ModalInput.jsx

export default function ModalInput({
  label,
  name,
  type = "text",
  placeholder = "",
  value,
  onChange,
  highlightLabel = false,
  className = "",
  colSpan = 1, // Permite indicar cuántas columnas ocupa en el grid
  ...props
}) {
  return (
    <div className={`flex flex-col ${className} col-span-${colSpan}`}>
      {label && (
        <label
          htmlFor={name}
          className={`mb-1 ${
            highlightLabel
              ? "text-black font-medium text-sm"
              : "text-gray-700 font-normal text-sm"
          }`}
        >
          {label}
        </label>
      )}
      <input
        id={name}
        name={name}
        type={type}
        placeholder={placeholder}
        value={value}
        onChange={onChange}
        className="w-full px-3 py-2 text-gray-900 bg-gray-50 border border-gray-300 rounded-md
                   focus:outline-none focus:ring-2 focus:ring-[#325341] focus:border-[#325341]
                   transition-all text-sm"
        {...props}
      />
    </div>
  );
}
