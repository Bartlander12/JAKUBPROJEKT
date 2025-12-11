// src/components/SuggestionInput/SuggestionInput.jsx
import React, { useMemo, useState, useRef, useEffect } from "react";

import InputField from "./InputField";
import Tags from "./Tags";
import Dropdown from "./Dropdown";

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

  // keep input synced with persona
  useEffect(() => {
    if (!multiSelect) setQuery(value || "");
  }, [value, multiSelect]);

  // close dropdown when clicking outside
  useEffect(() => {
    const handler = (e) => {
      if (containerRef.current && !containerRef.current.contains(e.target)) {
        setOpen(false);
      }
    };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, []);

  // filter suggestions
  const filtered = useMemo(() => {
    const q = query.toLowerCase().trim();
    if (!q) return suggestions;
    return suggestions.filter((s) => s.toLowerCase().includes(q));
  }, [query, suggestions]);

  // input change
  const handleInputChange = (val) => {
    setQuery(val);
    if (!multiSelect) onChange(val);
    if (!open) setOpen(true);
  };

  // clear all
  const handleClearAll = () => {
    setQuery("");
    multiSelect ? onChange([]) : onChange("");
  };

  // clear only input
  const handleInputClear = () => {
    setQuery("");
    if (!multiSelect) onChange("");
  };

  // selecting item
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

  // ENTER behavior
  const handleKeyDown = (e) => {
    if (!canEnterAdd) return;
    if (e.key === "Escape") return setOpen(false);
    if (e.key !== "Enter") return;

    e.preventDefault();

    const newItem = query.trim();
    if (!newItem) return;

    const exists =
      suggestions.includes(newItem) ||
      favorites.includes(newItem);

    if (exists) {
      if (!multiSelect) {
        onChange(newItem);
        setQuery(newItem);
      } else {
        let arr = Array.isArray(value) ? [...value] : [];
        if (!arr.includes(newItem)) arr.push(newItem);
        onChange(arr);
        setQuery("");
      }
      onToggleFavorite(newItem);
      return;
    }

    if (!multiSelect) {
      onChange(newItem);
      setQuery(newItem);
      onToggleFavorite(newItem);
      return;
    }

    let arr = Array.isArray(value) ? [...value] : [];
    if (!arr.includes(newItem)) arr.push(newItem);
    onChange(arr);
    onToggleFavorite(newItem);
    setQuery("");
  };

  const valueArray = Array.isArray(value) ? value : [];

  const showInputClear =
    (multiSelect && query.length > 0) ||
    (!multiSelect && (query ?? "").length > 0);

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

        {isTone && (
          <button
            type="button"
            onClick={handleClearAll}
            className="text-slate-400 hover:text-slate-600 text-lg"
          >
            ✕
          </button>
        )}
      </div>

      {/* TAGS */}
      {multiSelect && valueArray.length > 0 && (
        <Tags value={valueArray} onSelect={handleSelect} />
      )}

      {/* INPUT */}
      <InputField
        id={id}
        placeholder={placeholder}
        query={query}
        onChange={handleInputChange}
        onClear={handleInputClear}
        onKeyDown={handleKeyDown}
        showClear={showInputClear}
        setOpen={setOpen}
      />

      {/* DROPDOWN */}
      {open && (
        <Dropdown
          filtered={filtered}
          favorites={favorites}
          query={query}
          isTone={isTone}
          value={value}
          valueArray={valueArray}
          onSelect={handleSelect}
          onToggleFavorite={onToggleFavorite}
        />
      )}
    </div>
  );
}
