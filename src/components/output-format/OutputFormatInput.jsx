// src/components/output-format/OutputFormatInput.jsx
import React from "react";

export default function OutputFormatInput({
  id,
  query,
  onChange,
  onFocus,
  onKeyDown,
  onClear,
}) {
  return (
    <div className="relative">
      <input
        id={id}
        type="text"
        placeholder="Pridaj alebo vyhľadaj…"
        className="w-full bg-white px-3 py-2.5 pr-10 border border-slate-200 rounded-xl text-sm outline-none focus:ring-2 focus:ring-blue-500/40"
        value={query}
        onChange={(e) => onChange(e.target.value)}
        onFocus={onFocus}
        onKeyDown={onKeyDown}
        autoComplete="off"
      />

      {query.length > 0 && (
        <button
          onClick={onClear}
          className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600"
        >
          ✕
        </button>
      )}
    </div>
  );
}
