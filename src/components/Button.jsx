export default function Button({ children, className = "", ...props }) {
  return (
    <button
      {...props}
      className={`px-3 py-2 rounded-lg font-semibold shadow-md transition-colors duration-200 
        text-white bg-[#325341] hover:bg-[#26402f] focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[#325341] 
        ${className}`}
    >
      {children}
    </button>
  );
}
