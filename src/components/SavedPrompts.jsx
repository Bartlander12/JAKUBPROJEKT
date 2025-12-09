// src/components/SavedPrompts.jsx
import React from "react";

export default function SavedPrompts({ savedPrompts, onLoad, onDelete }) {
  if (!savedPrompts.length) {
    return <p className="text-xs text-slate-400">Zatiaľ nič uložené.</p>;
  }

  return (
    <div className="flex flex-wrap gap-2">
      {savedPrompts.map((p) => (
        <div
          key={p.id}
          className="flex items-center gap-1 bg-slate-50 border border-slate-200 rounded-full pl-2 pr-1 py-1"
        >
          <button
            type="button"
            onClick={() => onLoad(p)}
            className="text-[11px] px-2"
          >
            {p.title}
          </button>
          <button
            type="button"
            onClick={() => onDelete(p.id)}
            className="text-xs text-red-500 hover:text-red-600 px-1"
          >
            ❌
          </button>
        </div>
      ))}
    </div>
  );
}
