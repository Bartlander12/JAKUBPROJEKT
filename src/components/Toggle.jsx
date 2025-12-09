// src/components/Toggle.jsx
import React from "react";

export default function Toggle({ label, description, checked, onChange }) {
  return (
    <div className="flex items-start gap-3">
      <button
        type="button"
        onClick={() => onChange(!checked)}
        className={`relative inline-flex h-6 w-11 shrink-0 items-center rounded-full transition ${
          checked ? "bg-blue-600" : "bg-slate-300"
        }`}
        aria-pressed={checked}
      >
        <span
          className={`inline-block h-5 w-5 transform rounded-full bg-white shadow transition ${
            checked ? "translate-x-5" : "translate-x-1"
          }`}
        />
      </button>
      <div className="flex flex-col">
        <span className="text-sm text-slate-900">{label}</span>
        {description && (
          <span className="text-xs text-slate-500">{description}</span>
        )}
      </div>
    </div>
  );
}
