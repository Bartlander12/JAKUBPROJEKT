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
  multiSelect = false,
  favorites = [],
  enableEnterAdd = false,
  onToggleFavorite = () => {},
}) {
  const [open, setOpen] = useState(false);
  const [query, setQuery] = useState("");
  const containerRef = useRef(null);

  const isTone = id === "tone";
  const canEnterAdd = enableEnterAdd || isTone;

  // 🔁 Sync query with value for single-select (persona),
  // aby ENTER vždy pracoval s tým, čo vidíš v inpute.
  useEffect(() => {
    if (!multiSelect) {
      setQuery(value || "");
    }
  }, [value, multiSelect]);

  // ⚙️ Close on outside click
  useEffect(() => {
    function handleClick(e) {
      if (containerRef.current && !containerRef.current.contains(e.target)) {
        setOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClick);
    return () => document.removeEventListener("mousedown", handleClick);
  }, []);

  // 🔍 Filter suggestions podľa query
  const filtered = useMemo(() => {
    const q = query.toLowerCase().trim();
    if (!q) return suggestions;
    return suggestions.filter((s) => s.toLowerCase().includes(q));
  }, [query, suggestions]);

  // ⌨️ Písanie do inputu
  const handleInputChange = (val) => {
    setQuery(val);
    if (!multiSelect) {
      // pre personu priebežne updatujeme value
      onChange(val);
    }
    if (!open) setOpen(true);
  };

  // ❌ Clear ALL (X hore vpravo) — len pre tóny
  const handleClearAll = () => {
    setQuery("");
    if (multiSelect) onChange([]);
    else onChange("");
  };

  // ❌ Clear len inputu (X vnútri inputu)
  const handleInputClear = () => {
    setQuery("");
    if (!multiSelect) {
      onChange("");
    }
  };

  // ✅ Výber položky zo zoznamu
  const handleSelect = (s) => {
    if (multiSelect) {
      let arr = Array.isArray(value) ? [...value] : [];
      arr = arr.includes(s) ? arr.filter((v) => v !== s) : [...arr, s];
      onChange(arr);
      setQuery("");
      setOpen(true);
    } else {
      onChange(s);
      setQuery(s);
      setOpen(false);
    }
  };

  // ⏎ ENTER – persona + tone
  const handleKeyDown = (e) => {
    if (!canEnterAdd) return;

    if (e.key === "Escape") {
      setOpen(false);
      return;
    }

    if (e.key !== "Enter") return;

    e.preventDefault();
    const newItem = query.trim();
    if (!newItem) return;

    const exists =
      suggestions.includes(newItem) || favorites.includes(newItem);

    // 🔹 Ak už existuje v suggestions/favorites
    if (exists) {
      if (!multiSelect) {
        // persona
        onChange(newItem);
        setQuery(newItem);
      } else {
        // tone multi
        let arr = Array.isArray(value) ? [...value] : [];
        if (!arr.includes(newItem)) arr.push(newItem);
        onChange(arr);
        setQuery("");
      }
      onToggleFavorite(newItem);
      return;
    }

    // 🔹 Nová PERSONA (single)
    if (!multiSelect) {
      onChange(newItem);
      setQuery(newItem);
      onToggleFavorite(newItem); // pridaj do "Moje persony"
      return;
    }

    // 🔹 Nový TONE (multi)
    let arr = Array.isArray(value) ? [...value] : [];
    if (!arr.includes(newItem)) arr.push(newItem);
    onChange(arr);
    onToggleFavorite(newItem); // pridaj do "Moje tóny"
    setQuery("");
  };

  // Zobrazenie X v inpute
  const showInputClear =
    (multiSelect && query.length > 0) ||
    (!multiSelect && (query ?? "").length > 0);

  const valueArray = Array.isArray(value) ? value : [];

  return (
    <div
      ref={containerRef}
      className="relative flex flex-col gap-1.5 bg-slate-50 border border-slate-200 rounded-2xl p-3.5"
    >
      {/* HEADER */}
      <div className="flex items-center justify-between">
        <div className="flex items-baseline gap-2 text-sm font-medium text-slate-900">
          <span>{label}</span>
          {hint && <span className="text-xs text-slate-500">{hint}</span>}
        </div>

        {/* CLEAR ALL — iba pre tone (multiSelect) */}
        {isTone && (
          <button
            type="button"
            onClick={handleClearAll}
            className="text-slate-400 hover:text-slate-600 text-lg"
            title="Vymazať všetky tóny"
          >
            ✕
          </button>
        )}
      </div>

      {/* TAGS (multiSelect = tone) */}
      {multiSelect && valueArray.length > 0 && (
        <div className="flex flex-wrap gap-1 mb-1">
          {valueArray.map((tag) => (
            <span
              key={tag}
              className="px-2 py-1 rounded-full bg-blue-100 text-blue-700 text-xs flex items-center gap-1"
            >
              {tag}
              <button
                onClick={() => handleSelect(tag)}
                className="text-[11px] hover:text-blue-900"
              >
                ✕
              </button>
            </span>
          ))}
        </div>
      )}

      {/* INPUT + X */}
      <div className="relative">
        <input
          id={id}
          type="text"
          className="w-full rounded-xl border border-slate-200 bg-white px-3 py-2.5 pr-10 text-sm outline-none focus:ring-2 focus:ring-blue-500/40"
          placeholder={placeholder}
          value={query}
          autoComplete="off"
          onChange={(e) => handleInputChange(e.target.value)}
          onFocus={() => setOpen(true)}
          onKeyDown={handleKeyDown}
        />

        {showInputClear && (
          <button
            type="button"
            onClick={handleInputClear}
            className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600"
          >
            ✕
          </button>
        )}
      </div>

      {/* DROPDOWN */}
      {open && (filtered.length > 0 || favorites.length > 0) && (
        <div className="absolute left-3 right-3 top-full mt-1 rounded-2xl border border-slate-200 bg-white shadow-xl max-h-64 overflow-y-auto text-sm z-20">

          {/* PERSONA FAVORITES */}
          {!isTone && favorites.length > 0 && (
            <div className="border-b border-slate-100">
              <div className="px-4 pt-2 pb-1 text-[11px] uppercase text-amber-600">
                Moje persony
              </div>
              {favorites
                .filter((f) => f.toLowerCase().includes(query.toLowerCase()))
                .map((fav) => {
                  const active = !multiSelect && value === fav;
                  return (
                    <button
                      key={fav}
                      className="w-full px-4 py-2 flex justify-between items-center hover:bg-amber-50"
                      onClick={() => handleSelect(fav)}
                    >
                      <span>{fav}</span>
                      {active && <span>✔</span>}
                    </button>
                  );
                })}
            </div>
          )}

          {/* TONE FAVORITES */}
          {isTone && favorites.length > 0 && (
            <div className="border-b border-slate-100">
              <div className="px-4 pt-2 pb-1 text-[11px] uppercase text-violet-600">
                Moje tóny
              </div>
              {favorites
                .filter((f) => f.toLowerCase().includes(query.toLowerCase()))
                .map((fav) => {
                  const active = valueArray.includes(fav);
                  return (
                    <button
                      key={fav}
                      className="w-full px-4 py-2 flex justify-between items-center hover:bg-violet-50"
                      onClick={() => handleSelect(fav)}
                    >
                      <span>{fav}</span>
                      {active && <span>✔</span>}
                    </button>
                  );
                })}
            </div>
          )}

          {/* SUGGESTIONS */}
          {filtered.map((s) => {
            const active = multiSelect
              ? valueArray.includes(s)
              : value === s;
            return (
              <button
                key={s}
                className="w-full px-4 py-2 flex justify-between hover:bg-slate-100"
                onClick={() => handleSelect(s)}
              >
                <span>{s}</span>
                {active && <span>✔</span>}
              </button>
            );
          })}
        </div>
      )}
    </div>
  );
}
