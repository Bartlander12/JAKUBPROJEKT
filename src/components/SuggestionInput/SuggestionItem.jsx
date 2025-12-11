// src/components/SuggestionInput/SuggestionItem.jsx
import React from "react";

export default function SuggestionItem({
  label,
  active,
  color = "slate",
  onSelect,
  onDelete,
}) {
  const hoverColor =
    color === "amber"
      ? "hover:bg-amber-50"
      : color === "violet"
      ? "hover:bg-violet-50"
      : "hover:bg-slate-100";

  return (
    <div
      className={`w-full px-4 py-2 flex justify-between items-center cursor-pointer 
                  ${hoverColor} ${active ? "bg-orange-50 text-orange-700" : ""}`}
      onClick={onSelect}
    >
      <span>{label}</span>

      {onDelete && (
        <button
          type="button"
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
