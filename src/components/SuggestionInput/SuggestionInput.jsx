// src/components/SuggestionInput/SuggestionInput.jsx
import React, { useMemo, useState, useRef, useEffect } from "react";
import DropdownContainer from "../common/dropdown/DropdownContainer";
import DropdownSection from "../common/dropdown/DropdownSection";
import DropdownItem from "../common/dropdown/DropdownItem";

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
  const [activeIndex, setActiveIndex] = useState(-1);
  const containerRef = useRef(null);

  const isTone = id === "tone";
  const canEnterAdd = enableEnterAdd || isTone;

  // keep query synced for persona
  useEffect(() => {
    if (!multiSelect) setQuery(value || "");
  }, [value, multiSelect]);

  // filter suggestions
  const filtered = useMemo(() => {
    const q = query.toLowerCase().trim();
    if (!q) return suggestions;
    return suggestions.filter((s) => s.toLowerCase().includes(q));
  }, [query, suggestions]);

  // combined list for keyboard navigation
  const listItems = useMemo(() => {
    let arr = [];
    if (favorites.length > 0) {
      favorites
        .filter((f) => f.toLowerCase().includes(query.toLowerCase()))
        .forEach((fav) =>
          arr.push({
            type: "favorite",
            value: fav,
          })
        );
    }
    filtered.forEach((s) =>
      arr.push({
        type: "suggestion",
        value: s,
      })
    );
    return arr;
  }, [favorites, filtered, query]);

  const valueArray = Array.isArray(value) ? value : [];

  const handleInputChange = (val) => {
    setQuery(val);
    if (!multiSelect) onChange(val);
    if (!open) setOpen(true);
    setActiveIndex(-1);
  };

  // FIXED handleSelect with correct multi-select behavior
  const handleSelect = (s) => {
    if (multiSelect) {
      let arr = [...valueArray];
      arr = arr.includes(s) ? arr.filter((v) => v !== s) : [...arr, s];

      onChange(arr);
      setQuery("");
      setActiveIndex(-1); // 🔥 important fix
      // do NOT close dropdown on multi-select
    } else {
      onChange(s);
      setQuery(s);
      setOpen(false);
    }
  };

  // FIXED handleEnterAdd with correct behavior for persona + tone
  const handleEnterAdd = () => {
    const newItem = query.trim();
    if (!newItem) return;

    const exists = suggestions.includes(newItem) || favorites.includes(newItem);

    if (exists) {
      handleSelect(newItem);
      onToggleFavorite(newItem);
      return;
    }

    // SINGLE SELECT (persona)
    if (!multiSelect) {
      onChange(newItem);
      setQuery(newItem);
      onToggleFavorite(newItem);
      return;
    }

    // MULTI SELECT (tone)
    let arr = [...valueArray];
    if (!arr.includes(newItem)) arr.push(newItem);

    onChange(arr);
    onToggleFavorite(newItem);

    setQuery("");
    setActiveIndex(-1); // 🔥 reset again
  };

  const handleKeyDown = (e) => {
    if (!canEnterAdd) return;

    if (e.key === "Escape") {
      setOpen(false);
      return;
    }

    if (e.key === "Enter") {
      e.preventDefault();

      if (activeIndex >= 0) {
        const item = listItems[activeIndex];
        if (item) {
          handleSelect(item.value);
          setActiveIndex(-1); // 🔥 reset index after Enter
          return;
        }
      }

      handleEnterAdd();
      return;
    }
  };

  const onSelectIndex = (i) => {
    const item = listItems[i];
    if (item) handleSelect(item.value);
  };

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
            onClick={() => {
              setQuery("");
              onChange([]);
            }}
            className="text-slate-400 hover:text-slate-600 text-lg"
          >
            ✕
          </button>
        )}
      </div>

      {/* TAGS */}
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

      {/* INPUT */}
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
            onClick={() => {
              setQuery("");
              if (!multiSelect) onChange("");
            }}
            className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600"
          >
            ✕
          </button>
        )}
      </div>

      {/* DROPDOWN */}
      <DropdownContainer
        open={open}
        onClose={() => setOpen(false)}
        containerRef={containerRef}
        activeIndex={activeIndex}
        setActiveIndex={setActiveIndex}
        itemCount={listItems.length}
        onSelectIndex={onSelectIndex}
      >
        {favorites.length > 0 && (
        <DropdownSection title={isTone ? "Moje tóny" : "Moje persony"}>
          {favorites
            .filter((f) =>
              f.toLowerCase().includes(query.toLowerCase())
            )
            .map((fav, i) => (
              <DropdownItem
                key={fav}
                label={fav}
                active={activeIndex === i}
                selected={valueArray.includes(fav)}   // 🔥 MUST HAVE
                onClick={() => handleSelect(fav)}
                onDelete={() => onToggleFavorite(fav)}
              />
            ))}
        </DropdownSection>
      )}


        {/* Suggestions */}
        <DropdownSection>
          {filtered.map((s, i) => {
            const globalIndex = favorites.length + i;

            return (
              <DropdownItem
                key={s}
                label={s}
                active={activeIndex === globalIndex}
                selected={valueArray.includes(s)}       // 🔥 MUST HAVE
                onClick={() => handleSelect(s)}
              />
            );
          })}
        </DropdownSection>
      </DropdownContainer>
    </div>
  );
}
