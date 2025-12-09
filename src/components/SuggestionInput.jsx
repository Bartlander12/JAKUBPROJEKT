// src/components/SuggestionInput.jsx
import React, { useMemo, useState } from "react";

export default function SuggestionInput({
  label,
  hint,
  placeholder,
  value,
  onChange,
  suggestions,
  id,
  allowClear = true,
}) {
  const [open, setOpen] = useState(false);
  const [query, setQuery] = useState("");

  const filtered = useMemo(() => {
    if (!query.trim()) return suggestions;
    return suggestions.filter((s) =>
      s.toLowerCase().includes(query.trim().toLowerCase())
    );
  }, [suggestions, query]);

  const handleInputChange = (val) => {
    onChange(val);
    setQuery(val);
    if (!open) setOpen(true);
  };

  const handleSelect = (s) => {
    onChange(s);
    setQuery(s);
    setOpen(false);
  };

  return (
    <div className="relative flex flex-col gap-1.5 bg-slate-50 border border-slate-200 rounded-2xl p-3.5">
      <div className="flex items-center justify-between gap-2">
        <div className="flex items-baseline gap-2 text-sm font-medium text-slate-900">
          <span>{label}</span>
          {hint && (
            <span className="text-xs font-normal text-slate-500">{hint}</span>
          )}
        </div>
        <div className="flex items-center gap-1.5">
          <span
            className="text-base text-yellow-400"
            title="Obľúbené (logiku si vieš doplniť)"
          >
            ⭐
          </span>
          {allowClear && (
            <button
              type="button"
              onClick={() => handleInputChange("")}
              className="text-sm opacity-70 hover:opacity-100"
              title="Vymazať"
            >
              🧹
            </button>
          )}
        </div>
      </div>
      <input
        id={id}
        type="text"
        className="w-full rounded-xl border border-slate-200 bg-white px-3 py-2.5 text-sm outline-none focus:ring-2 focus:ring-blue-500/40 focus:border-blue-500"
        placeholder={placeholder}
        value={value}
        autoComplete="off"
        onChange={(e) => handleInputChange(e.target.value)}
        onFocus={() => setOpen(true)}
      />
      {open && filtered.length > 0 && (
        <div className="absolute left-3 right-3 top-[100%] mt-1 rounded-2xl border border-slate-200 bg-white shadow-xl max-h-64 overflow-y-auto z-20">
          {filtered.map((s) => (
            <button
              key={s}
              type="button"
              onClick={() => handleSelect(s)}
              className="w-full text-left px-4 py-2 text-sm hover:bg-slate-100"
            >
              {s}
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
