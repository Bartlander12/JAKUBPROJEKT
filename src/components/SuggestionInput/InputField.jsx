// src/components/SuggestionInput/InputField.jsx
import React from "react";

export default function InputField({
  id,
  placeholder,
  query,
  onChange,
  onClear,
  onKeyDown,
  showClear,
  setOpen,
}) {
  return (
    <div className="relative">
      <input
        id={id}
        type="text"
        placeholder={placeholder}
        className="w-full rounded-xl border border-slate-200 bg-white px-3 py-2.5 pr-10 text-sm outline-none 
                   focus:ring-2 focus:ring-blue-500/40"
        value={query}
        autoComplete="off"
        onChange={(e) => onChange(e.target.value)}
        onFocus={() => setOpen(true)}
        onKeyDown={onKeyDown}
      />

      {showClear && (
        <button
          type="button"
          onClick={onClear}
          className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600"
        >
          ✕
        </button>
      )}
    </div>
  );
}
