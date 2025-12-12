// src/components/common/dropdown/DropdownItem.jsx
import React from "react";

export default function DropdownItem({
  label,
  active,
  selected,
  onClick,
  onDelete,
}) {
  return (
    <div
      className={`
        w-full px-4 py-2 flex justify-between items-center cursor-pointer
        ${active ? "bg-orange-50 text-orange-700" : ""}
        ${selected && !active ? "bg-orange-50 text-orange-700" : ""}
        hover:bg-slate-100
      `}
      onClick={onClick}
    >
      <span>{label}</span>

      {onDelete && (
        <button
          className="text-xs text-red-400 hover:text-red-600"
          onClick={(e) => {
            e.stopPropagation();
            onDelete();
          }}
        >
          🗑️
        </button>
      )}
    </div>
  );
}

