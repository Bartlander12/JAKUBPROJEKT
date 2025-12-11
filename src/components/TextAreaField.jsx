// src/components/TextAreaField.jsx
import React, { useState } from "react";

export default function TextAreaField({
  label,
  hint,
  value,
  onChange,
  id,
  required,
}) {
  const [focused, setFocused] = useState(false);

  return (
    <div
      className={`flex flex-col gap-1.5 bg-slate-50 border border-slate-200 rounded-2xl p-3.5 transition-all ${
        focused ? "shadow-md" : ""
      }`}
    >
      {/* HEADER */}
      <div className="flex items-center justify-between gap-2">
        <div className="flex items-baseline gap-2 text-sm font-medium text-slate-900">
          <span>{label}</span>
          <span className="text-xs font-normal text-slate-500">{hint}</span>
        </div>

        {/* CLEAR X */}
        {value && (
          <button
            type="button"
            onClick={() => onChange("")}
            className="text-slate-400 hover:text-slate-600 text-lg"
            title="Vymazať obsah"
          >
            ✕
          </button>
        )}
      </div>

      {/* TEXTAREA */}
      <textarea
        id={id}
        className={`w-full rounded-xl border border-slate-200 bg-white px-3 py-2.5 text-sm outline-none resize-none transition-all duration-200
          ${focused ? "h-56" : "h-24"}    /* 🔥 toto je celé čaro */
          focus:ring-2 focus:ring-blue-500/40 focus:border-blue-500
        `}
        placeholder={hint}
        value={value}
        onFocus={() => setFocused(true)}
        onBlur={() => setFocused(false)}
        onChange={(e) => onChange(e.target.value)}
        required={required}
      />
    </div>
  );
}
