// src/components/SuggestionInput/Tags.jsx
import React from "react";

export default function Tags({ value, onSelect }) {
  return (
    <div className="flex flex-wrap gap-1 mb-1">
      {value.map((tag) => (
        <span
          key={tag}
          className="px-2 py-1 rounded-full bg-blue-100 text-blue-700 text-xs flex items-center gap-1"
        >
          {tag}
          <button
            onClick={() => onSelect(tag)}
            className="text-[11px] hover:text-blue-900"
          >
            ✕
          </button>
        </span>
      ))}
    </div>
  );
}
