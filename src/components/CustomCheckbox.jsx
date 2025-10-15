// src/components/CustomCheckbox.jsx
import { useState, useEffect, forwardRef } from 'react';

const CustomCheckbox = forwardRef(({ 
  checked = false, 
  onChange, 
  label = "", 
  disabled = false,
  indeterminate = false,
  className = "",
  ...props 
}, ref) => {
  const [isChecked, setIsChecked] = useState(checked);

  useEffect(() => {
    setIsChecked(checked);
  }, [checked]);

  const handleChange = (e) => {
    const newChecked = e.target.checked;
    setIsChecked(newChecked);
    if (onChange) {
      onChange(e);
    }
  };

  return (
    <label className={`inline-flex items-center cursor-pointer ${disabled ? 'opacity-50 cursor-not-allowed' : ''} ${className}`}>
      <div className="relative flex items-center">
        <input
          ref={ref}
          type="checkbox"
          className="sr-only" // Ocultar el checkbox nativo
          checked={isChecked}
          onChange={handleChange}
          disabled={disabled}
          {...props}
        />
        
        {/* Contenedor del checkbox personalizado */}
        <div className={`
          w-5 h-5 flex items-center justify-center border rounded transition-all duration-200
          ${isChecked || indeterminate 
            ? 'bg-gradient-to-b from-[#24412f] to-emerald-700 border-[#24412f]' 
            : 'bg-white border-gray-300 hover:border-[#24412f]'
          }
          ${disabled ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer'}
        `}>
          {/* Checkmark */}
          {(isChecked || indeterminate) && (
            <svg 
              className="w-4 h-4 text-white" 
              fill="none" 
              stroke="currentColor" 
              viewBox="0 0 24 24"
              xmlns="http://www.w3.org/2000/svg"
            >
              {indeterminate ? (
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="3" d="M5 12h14" />
              ) : (
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="3" d="M5 13l4 4L19 7" />
              )}
            </svg>
          )}
        </div>
      </div>
      
      {label && (
        <span className={`ml-2 text-sm ${disabled ? 'text-gray-400' : 'text-gray-700'}`}>
          {label}
        </span>
      )}
    </label>
  );
});

CustomCheckbox.displayName = 'CustomCheckbox';

export default CustomCheckbox;