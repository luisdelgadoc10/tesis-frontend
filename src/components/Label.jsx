export default function Label({ text, htmlFor, highlight = false, className = "" }) {
  return (
    <label
      htmlFor={htmlFor}
      className={`text-sm mb-1 ${
        highlight ? "text-black font-medium" : "text-gray-700 font-normal"
      } ${className}`}
    >
      {text}
    </label>
  );
}
