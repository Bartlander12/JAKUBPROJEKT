// src/components/output-format/OutputFormatOption.jsx
import React from "react";

export default function OutputFormatOption({
  label,
  active,
  onClick,
  deletable = false,
  onDelete = () => {},
  hoverClass = "hover:bg-slate-50",
}) {
  return (
    <div
      className={`w-full px-4 py-2 flex justify-between items-center cursor-pointer ${hoverClass} ${
        active ? "bg-orange-50 text-orange-700" : ""
      }`}
      onClick={onClick}
    >
      <span>{label}</span>

      {deletable && (
        <button
          className="text-xs text-red-400 hover:text-red-600"
          onClick={(e) => {
            e.stopPropagation();
            onDelete(label);
          }}
        >
          🗑️
        </button>
      )}
    </div>
  );
}
