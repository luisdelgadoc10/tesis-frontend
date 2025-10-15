// SidebarButton.jsx
import React from "react";

export default function SidebarButton({ children, isActive, onClick }) {
  const buttonStyles = `flex items-center gap-2 px-3 py-2 rounded-md text-sm font-medium transition-colors ${
    isActive
      ? "bg-[#D2E4DA] text-black"
      : "text-white hover:bg-[#D2E4DA] hover:text-black"
  }`;

  return (
    <button className={buttonStyles} onClick={onClick}>
      {children}
    </button>
  );
}
