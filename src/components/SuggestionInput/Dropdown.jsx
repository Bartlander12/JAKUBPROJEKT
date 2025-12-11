// src/components/SuggestionInput/Dropdown.jsx
import React from "react";
import DropdownSection from "./DropdownSection";
import SuggestionItem from "./SuggestionItem";

export default function Dropdown({
  filtered,
  favorites,
  query,
  isTone,
  value,
  valueArray,
  onSelect,
  onToggleFavorite,
}) {
  const filteredFavorites = favorites.filter((f) =>
    f.toLowerCase().includes(query.toLowerCase())
  );

  return (
    <div className="absolute left-3 right-3 top-full mt-1 rounded-2xl border border-slate-200 
                    bg-white shadow-xl max-h-64 overflow-y-auto text-sm z-20">

      {/* PERSONA FAVORITES */}
      {!isTone && filteredFavorites.length > 0 && (
        <DropdownSection title="Moje persony" color="amber">
          {filteredFavorites.map((fav) => (
            <SuggestionItem
              key={fav}
              label={fav}
              active={value === fav}
              color="amber"
              onSelect={() => onSelect(fav)}
              onDelete={() => onToggleFavorite(fav)}
            />
          ))}
        </DropdownSection>
      )}

      {/* TONE FAVORITES */}
      {isTone && filteredFavorites.length > 0 && (
        <DropdownSection title="Moje tóny" color="violet">
          {filteredFavorites.map((fav) => (
            <SuggestionItem
              key={fav}
              label={fav}
              active={valueArray.includes(fav)}
              color="violet"
              onSelect={() => onSelect(fav)}
              onDelete={() => onToggleFavorite(fav)}
            />
          ))}
        </DropdownSection>
      )}

      {/* NORMAL SUGGESTIONS */}
      {filtered.map((s) => {
        const active = isTone
          ? valueArray.includes(s)
          : value === s;

        return (
          <SuggestionItem
            key={s}
            label={s}
            active={active}
            onSelect={() => onSelect(s)}
          />
        );
      })}
    </div>
  );
}
