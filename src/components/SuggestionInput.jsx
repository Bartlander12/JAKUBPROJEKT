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
  multiSelect = false,
  favorites = [],
  onToggleFavorite = () => {},
}) {
  const [open, setOpen] = useState(false);
  const [query, setQuery] = useState("");
  const containerRef = useRef(null);

  // close dropdown on outside click
  useEffect(() => {
    function handleClickOutside(e) {
      if (containerRef.current && !containerRef.current.contains(e.target)) {
        setOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  // filtering suggestions
  const filtered = useMemo(() => {
    if (!query.trim()) return suggestions;
    return suggestions.filter((s) =>
      s.toLowerCase().includes(query.trim().toLowerCase())
    );
  }, [suggestions, query]);

  const isToneField = id === "tone";

  // handle typing
  const handleInputChange = (val) => {
    if (!multiSelect) onChange(val);
    setQuery(val);
    if (!open) setOpen(true);
  };

  // toggle item selection
  const handleSelect = (s) => {
    if (multiSelect) {
      let newValue = Array.isArray(value) ? [...value] : [];
      if (newValue.includes(s)) {
        newValue = newValue.filter((v) => v !== s);
      } else {
        newValue.push(s);
      }
      onChange(newValue);
      setQuery("");
      setOpen(true);
    } else {
      onChange(s);
      setQuery("");
      setOpen(false);
    }
  };

  // ENTER = iba pre TONY
  const handleKeyDown = (e) => {
    if (!isToneField) return; // only tones can add custom items
    if (!multiSelect) return;

    if (e.key === "Enter") {
      e.preventDefault();
      const newTone = query.trim();
      if (!newTone) return;

      let newValue = Array.isArray(value) ? [...value] : [];

      if (!newValue.includes(newTone)) {
        newValue.push(newTone);
      }

      // add to tone selections
      onChange(newValue);

      // add to favorites of tones
      onToggleFavorite(newTone);

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
      {/* LABEL */}
      <div className="flex items-center justify-between gap-2">
        <div className="flex items-baseline gap-2 text-sm font-medium text-slate-900">
          <span>{label}</span>
          {hint && <span className="text-xs text-slate-500">{hint}</span>}
        </div>

        <div className="flex items-center gap-2">
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

          {/* ⭐ only for persona — tones no star */}
          {!isToneField && (
            <button
              type="button"
              onClick={() => onToggleFavorite(value || query)}
              disabled={!value && !query}
              className={`text-lg ${
                favorites.includes(value || query)
                  ? "text-yellow-500"
                  : "text-slate-400 hover:text-yellow-500"
              }`}
              title="Pridať do obľúbených"
            >
              ⭐
            </button>
          )}
        </div>
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

      {/* INPUT */}
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

      {/* DROPDOWN */}
      {open && (filtered.length > 0 || favorites.length > 0) && (
        <div className="absolute left-3 right-3 top-[100%] mt-1 rounded-2xl border border-slate-200 bg-white shadow-xl max-h-64 overflow-y-auto z-20">

          {/* MOJE TÓNY (iba ak id === tone) */}
          {isToneField && favorites.length > 0 && (
            <div className="border-b border-slate-100">
              <div className="px-4 pt-2 pb-1 text-[11px] uppercase tracking-wider text-violet-600">
                Moje tóny
              </div>
              {favorites
                .filter((f) =>
                  f.toLowerCase().includes(query.toLowerCase())
                )
                .map((fav) => {
                  const active =
                    multiSelect && Array.isArray(value) && value.includes(fav);

                  return (
                    <div
                      key={`fav-${fav}`}
                      className={`w-full px-4 py-2 text-sm flex justify-between items-center hover:bg-violet-50 ${
                        active ? "bg-violet-100 text-violet-800" : ""
                      }`}
                    >
                      <button
                        type="button"
                        className="text-left flex-1"
                        onClick={() => handleSelect(fav)}
                      >
                        {fav}
                      </button>

                      <button
                        type="button"
                        className="text-xs text-red-400 hover:text-red-600"
                        onClick={(e) => {
                          e.stopPropagation();
                          onToggleFavorite(fav);
                        }}
                      >
                        🗑️
                      </button>
                    </div>
                  );
                })}
            </div>
          )}

          {/* SUGGESTIONS */}
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
