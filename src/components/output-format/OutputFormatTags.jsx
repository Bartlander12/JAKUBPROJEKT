// src/components/output-format/OutputFormatTags.jsx
import React from "react";

export default function OutputFormatTags({ selected, onRemove }) {
  if (!selected || selected.length === 0) return null;

  return (
    <div className="flex flex-wrap gap-1 my-1">
      {selected.map((opt) => (
        <span
          key={opt}
          className="px-2 py-1 bg-emerald-100 text-emerald-800 rounded-full text-xs flex items-center gap-1"
        >
          {opt}
          <button
            onClick={() => onRemove(opt)}
            className="text-[11px]"
          >
            ✕
          </button>
        </span>
      ))}
    </div>
  );
}
