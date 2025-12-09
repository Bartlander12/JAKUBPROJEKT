// src/components/TextAreaField.jsx
import React from "react";

export default function TextAreaField({
  label,
  hint,
  value,
  onChange,
  id,
  required,
}) {
  return (
    <div className="flex flex-col gap-1.5 bg-slate-50 border border-slate-200 rounded-2xl p-3.5">
      <div className="flex items-center justify-between gap-2">
        <div className="flex items-baseline gap-2 text-sm font-medium text-slate-900">
          <span>{label}</span>
          <span className="text-xs font-normal text-slate-500">{hint}</span>
        </div>
        <button
          type="button"
          onClick={() => onChange("")}
          className="text-sm opacity-70 hover:opacity-100"
          title="Vymazať"
        >
          🧹
        </button>
      </div>
      <textarea
        id={id}
        className="w-full rounded-xl border border-slate-200 bg-white px-3 py-2.5 text-sm outline-none focus:ring-2 focus:ring-blue-500/40 focus:border-blue-500 resize-vertical min-h-[80px]"
        placeholder={hint}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        required={required}
      />
    </div>
  );
}
