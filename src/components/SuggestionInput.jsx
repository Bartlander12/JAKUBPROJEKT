// src/components/SuggestionInput.jsx
import React, { useMemo, useState, useRef, useEffect } from "react";

export default function SuggestionInput({
  label,
  hint,
  placeholder,
  value,
  onChange,
  suggestions,
  id,
  allowClear = true,
  multiSelect = false,  // 🔥 nový parameter
}) {
  const [open, setOpen] = useState(false);
  const [query, setQuery] = useState("");
  const containerRef = useRef(null);

  // Close dropdown when clicking outside
  useEffect(() => {
    function handleClickOutside(e) {
      if (containerRef.current && !containerRef.current.contains(e.target)) {
        setOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  // Filter list
  const filtered = useMemo(() => {
    if (!query.trim()) return suggestions;
    return suggestions.filter((s) =>
      s.toLowerCase().includes(query.trim().toLowerCase())
    );
  }, [suggestions, query]);

  // Input typing
  const handleInputChange = (val) => {
    if (!multiSelect) {
      onChange(val);
    }
    setQuery(val);
    if (!open) setOpen(true);
  };

  // Clicking an item
  const handleSelect = (s) => {
    if (multiSelect) {
      let newValue = Array.isArray(value) ? [...value] : [];

      if (newValue.includes(s)) {
        // remove
        newValue = newValue.filter((item) => item !== s);
      } else {
        // add
        newValue.push(s);
      }
      onChange(newValue);
      setQuery(""); // clear filter
      setOpen(true); // keep open for more selections
    } else {
      // single select
      onChange(s);
      setQuery("");
      setOpen(false);
    }
  };

  const handleKeyDown = (e) => {
  if (e.key === "Enter" && multiSelect) {
    e.preventDefault();
    const newItem = query.trim();

    if (!newItem) return;

    let newValue = Array.isArray(value) ? [...value] : [];

    if (!newValue.includes(newItem)) {
      newValue.push(newItem);
    }

    onChange(newValue);
    setQuery("");
    setOpen(true);
  }
};

  const handleClearAll = () => {
    onChange(multiSelect ? [] : "");
    setQuery("");
  };

  return (
    <div
      ref={containerRef}
      className="relative flex flex-col gap-1.5 bg-slate-50 border border-slate-200 rounded-2xl p-3.5"
    >
      {/* Label */}
      <div className="flex items-center justify-between gap-2">
        <div className="flex items-baseline gap-2 text-sm font-medium text-slate-900">
          <span>{label}</span>
          {hint && <span className="text-xs text-slate-500">{hint}</span>}
        </div>

        {allowClear && (
          <button
            type="button"
            onClick={handleClearAll}
            className="text-sm opacity-70 hover:opacity-100"
            title="Vymazať"
          >
            🧹
          </button>
        )}
      </div>

      {/* MULTISELECT TAGS */}
      {multiSelect && Array.isArray(value) && value.length > 0 && (
        <div className="flex flex-wrap gap-1 mb-1">
          {value.map((tag) => (
            <span
              key={tag}
              className="px-2 py-1 rounded-full bg-blue-100 text-blue-700 text-xs flex items-center gap-1"
            >
              {tag}
              <button
                onClick={() => handleSelect(tag)}
                className="text-[11px] text-blue-700 hover:text-blue-900"
              >
                ✕
              </button>
            </span>
          ))}
        </div>
      )}

      {/* Input */}
      <input
        id={id}
        type="text"
        className="w-full rounded-xl border border-slate-200 bg-white px-3 py-2.5 text-sm outline-none focus:ring-2 focus:ring-blue-500/40"
        placeholder={placeholder}
        value={multiSelect ? query : value}
        autoComplete="off"
        onChange={(e) => handleInputChange(e.target.value)}
        onFocus={() => setOpen(true)}
        onKeyDown={handleKeyDown}
      />

      {/* Dropdown */}
      {open && filtered.length > 0 && (
        <div className="absolute left-3 right-3 top-[100%] mt-1 rounded-2xl border border-slate-200 bg-white shadow-xl max-h-64 overflow-y-auto z-20">
          {filtered.map((s) => {
            const active =
              multiSelect && Array.isArray(value) && value.includes(s);

            return (
              <button
                key={s}
                type="button"
                onClick={() => handleSelect(s)}
                className={`w-full text-left px-4 py-2 text-sm hover:bg-slate-100 flex justify-between ${
                  active ? "bg-blue-50 text-blue-700" : ""
                }`}
              >
                {s}
                {active && "✔"}
              </button>
            );
          })}
        </div>
      )}
    </div>
  );
}
