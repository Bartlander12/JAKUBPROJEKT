// src/components/output-format/OutputFormatHeader.jsx
import React from "react";

export default function OutputFormatHeader({ label, hint, onClear }) {
  return (
    <div className="flex justify-between items-start">
      <div>
        <div className="text-sm font-medium">{label}</div>
        {hint && (
          <div className="text-[11px] text-slate-500">
            {hint}
          </div>
        )}
      </div>

      <button
        onClick={onClear}
        className="text-slate-400 hover:text-slate-600 text-lg"
      >
        ✕
      </button>
    </div>
  );
}
